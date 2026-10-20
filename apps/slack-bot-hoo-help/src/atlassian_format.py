"""
atlassian_format.py — turn Atlassian page/issue bodies into text the model can read.

  - storage_to_markdown: Confluence "storage" XHTML → markdown (headings, lists,
    tables, links made absolute; macro markup dropped, macro text kept).
  - adf_to_text: Jira's Atlassian Document Format (JSON) → plain text.
  - strip_highlight: remove Confluence search highlight markers.
"""

from __future__ import annotations

import re
from html.parser import HTMLParser
from typing import Any, Dict, List, Optional
from urllib.parse import urljoin

_HL = re.compile(r"@@@(?:end)?hl@@@")
_DROP_CONTENT = {"script", "style", "ac:parameter"}  # macro parameters are settings, not prose


def strip_highlight(text: str) -> str:
    return _HL.sub("", text or "")


class _StorageParser(HTMLParser):
    def __init__(self, site: str):
        super().__init__(convert_charrefs=True)
        self.site = site.rstrip("/") + "/"
        self.lines: List[str] = []
        self.buf: List[str] = []
        self.prefix = ""
        self.lists: List[List[Any]] = []  # [kind, counter]
        self.links: List[Any] = []  # [href, start index in buf]
        self.drop = 0
        self.table: Optional[List[List[str]]] = None
        self.cell: Optional[List[str]] = None

    # -- block helpers --------------------------------------------------------
    def _flush(self) -> None:
        text = " ".join("".join(self.buf).split())
        if text:
            self.lines.append(self.prefix + text)
        self.buf, self.prefix = [], ""

    def _blank(self) -> None:
        self._flush()
        if self.lines and self.lines[-1] != "":
            self.lines.append("")

    def _emit(self, s: str) -> None:
        (self.cell if self.cell is not None else self.buf).append(s)

    # -- parser callbacks -----------------------------------------------------
    def handle_starttag(self, tag: str, attrs) -> None:
        a = dict(attrs)
        if tag in _DROP_CONTENT:
            self.drop += 1
            return
        if re.fullmatch(r"h[1-6]", tag):
            self._blank()
            self.prefix = "#" * int(tag[1]) + " "
        elif tag in ("p", "div", "blockquote"):
            if self.cell is None:
                self._blank()
        elif tag == "br":
            if self.cell is not None:
                self.cell.append(" ")
            else:
                self._flush()
        elif tag in ("ul", "ol"):
            self._flush()
            self.lists.append([tag, 0])
        elif tag == "li":
            self._flush()
            depth = max(0, len(self.lists) - 1)
            kind = self.lists[-1] if self.lists else ["ul", 0]
            kind[1] += 1
            self.prefix = "  " * depth + (f"{kind[1]}. " if kind[0] == "ol" else "- ")
        elif tag in ("strong", "b"):
            self._emit("**")
        elif tag in ("em", "i"):
            self._emit("_")
        elif tag == "code":
            self._emit("`")
        elif tag == "a":
            target = self.cell if self.cell is not None else self.buf
            self.links.append([a.get("href") or "", len(target)])
        elif tag == "table":
            self._blank()
            self.table = []
        elif tag == "tr" and self.table is not None:
            self.table.append([])
        elif tag in ("td", "th") and self.table is not None:
            self.cell = []

    def handle_endtag(self, tag: str) -> None:
        if tag in _DROP_CONTENT:
            self.drop = max(0, self.drop - 1)
            return
        if re.fullmatch(r"h[1-6]", tag) or tag in ("p", "div", "blockquote"):
            if self.cell is None:
                self._blank()
        elif tag == "li":
            self._flush()
        elif tag in ("ul", "ol"):
            self._flush()
            if self.lists:
                self.lists.pop()
            if not self.lists:
                self._blank()
        elif tag in ("strong", "b"):
            self._emit("**")
        elif tag in ("em", "i"):
            self._emit("_")
        elif tag == "code":
            self._emit("`")
        elif tag == "a" and self.links:
            href, start = self.links.pop()
            target = self.cell if self.cell is not None else self.buf
            text = "".join(target[start:]).strip()
            del target[start:]
            if href and not href.startswith(("http://", "https://", "mailto:")):
                href = urljoin(self.site, href.lstrip("/"))
            target.append(f"[{text or href}]({href})" if href else text)
        elif tag in ("td", "th") and self.cell is not None and self.table is not None:
            if self.table:
                self.table[-1].append(" ".join("".join(self.cell).split()).replace("|", "\\|"))
            self.cell = None
        elif tag == "table" and self.table is not None:
            rows = [r for r in self.table if r]
            if rows:
                width = max(len(r) for r in rows)
                rows = [r + [""] * (width - len(r)) for r in rows]
                self.lines.append("| " + " | ".join(rows[0]) + " |")
                self.lines.append("|" + " --- |" * width)
                self.lines.extend("| " + " | ".join(r) + " |" for r in rows[1:])
                self.lines.append("")
            self.table = None

    def handle_data(self, data: str) -> None:
        if self.drop:
            return
        if self.table is not None and self.cell is None:
            return  # whitespace between table tags
        self._emit(data)

    def result(self) -> str:
        self._flush()
        text = "\n".join(self.lines)
        return re.sub(r"\n{3,}", "\n\n", text).strip()


def storage_to_markdown(xhtml: str, *, site: str) -> str:
    if not xhtml:
        return ""
    parser = _StorageParser(site)
    parser.feed(xhtml)
    parser.close()
    return parser.result()


def _adf_inline(node: Dict[str, Any]) -> str:
    kind = node.get("type")
    if kind == "text":
        return node.get("text") or ""
    if kind in ("mention", "emoji", "status", "date"):
        attrs = node.get("attrs") or {}
        return str(attrs.get("text") or attrs.get("shortName") or "")
    if kind == "hardBreak":
        return "\n"
    if kind in ("inlineCard", "blockCard"):
        return str((node.get("attrs") or {}).get("url") or "")
    return "".join(_adf_inline(c) for c in node.get("content") or [])


def _adf_blocks(node: Dict[str, Any], depth: int = 0) -> List[str]:
    kind = node.get("type")
    children = node.get("content") or []
    if kind in ("bulletList", "orderedList"):
        lines: List[str] = []
        for i, item in enumerate(children, 1):
            marker = f"{i}. " if kind == "orderedList" else "- "
            inner: List[str] = []
            for c in item.get("content") or []:
                inner.extend(_adf_blocks(c, depth + 1))
            if inner:
                lines.append("  " * depth + marker + inner[0].lstrip())
                lines.extend(inner[1:])
        return lines
    if kind == "heading":
        text = _adf_inline(node).strip()
        return [text] if text else []
    if kind in ("paragraph", "codeBlock", "blockquote", "panel", "tableCell", "tableHeader"):
        if kind in ("blockquote", "panel"):
            out: List[str] = []
            for c in children:
                out.extend(_adf_blocks(c, depth))
            return out
        text = _adf_inline(node).strip()
        return [text] if text else []
    if kind in ("doc", "table", "tableRow", "listItem", "layoutSection", "layoutColumn", "expand"):
        out = []
        for c in children:
            out.extend(_adf_blocks(c, depth))
        return out
    text = _adf_inline(node).strip()  # unknown node: keep its text
    return [text] if text else []


def adf_to_text(doc: Optional[Dict[str, Any]]) -> str:
    if not doc or not isinstance(doc, dict):
        return ""
    return "\n".join(_adf_blocks(doc)).strip()
