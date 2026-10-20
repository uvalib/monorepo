#!/usr/bin/env python3
"""Confluence storage → markdown and Jira ADF → text (no network)."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from atlassian_format import adf_to_text, storage_to_markdown, strip_highlight  # noqa: E402

SITE = "https://virginia-its.atlassian.net"


def test_storage_headings_lists_links_tables():
    md = storage_to_markdown(
        '<h2>Hours</h2><p>See <a href="/wiki/spaces/LIB/pages/1">this</a>.</p>'
        "<ul><li>One</li><li>Two</li></ul>"
        "<table><tr><th>Day</th><th>Open</th></tr><tr><td>Mon</td><td>8</td></tr></table>",
        site=SITE,
    )
    assert "## Hours" in md
    assert "- One" in md and "- Two" in md
    assert "[this](https://virginia-its.atlassian.net/wiki/spaces/LIB/pages/1)" in md
    assert "| Day | Open |" in md and "| Mon | 8 |" in md


def test_storage_ordered_list_bold_and_absolute_links_kept():
    md = storage_to_markdown('<ol><li>First <strong>step</strong></li><li>Second</li></ol>'
                             '<p><a href="https://example.org/x">ext</a></p>', site=SITE)
    assert "1. First **step**" in md and "2. Second" in md
    assert "[ext](https://example.org/x)" in md


def test_storage_macros_keep_text_drop_markup():
    md = storage_to_markdown(
        '<ac:structured-macro ac:name="info"><ac:rich-text-body><p>Note this</p>'
        "</ac:rich-text-body></ac:structured-macro>",
        site="https://x",
    )
    assert "Note this" in md and "ac:" not in md


def test_storage_collapses_blank_lines_and_handles_empty():
    md = storage_to_markdown("<p>a</p><p></p><p></p><p>b</p>", site=SITE)
    assert "\n\n\n" not in md and "a" in md and "b" in md
    assert storage_to_markdown("", site=SITE) == ""


def test_adf_paragraphs_lists_mentions():
    doc = {"type": "doc", "content": [
        {"type": "paragraph", "content": [{"type": "text", "text": "Camera "},
                                          {"type": "mention", "attrs": {"text": "@Pat Doe"}}]},
        {"type": "bulletList", "content": [{"type": "listItem", "content": [
            {"type": "paragraph", "content": [{"type": "text", "text": "reboot"}]}]}]}]}
    assert adf_to_text(doc) == "Camera @Pat Doe\n- reboot"


def test_adf_none_and_unknown_nodes():  # RF4
    assert adf_to_text(None) == ""
    assert adf_to_text({"type": "doc", "content": [{"type": "mystery", "content": [{"type": "text", "text": "x"}]}]}) == "x"


def test_strip_highlight():
    assert strip_highlight("the @@@hl@@@camera@@@endhl@@@ fix") == "the camera fix"


if __name__ == "__main__":
    test_storage_headings_lists_links_tables()
    test_storage_ordered_list_bold_and_absolute_links_kept()
    test_storage_macros_keep_text_drop_markup()
    test_storage_collapses_blank_lines_and_handles_empty()
    test_adf_paragraphs_lists_mentions()
    test_adf_none_and_unknown_nodes()
    test_strip_highlight()
    print("ok")
