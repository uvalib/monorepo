#!/usr/bin/env python3
"""Smoke tests for in-process Wikipedia tools (live MediaWiki API)."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from wikipedia_tools import (
    TOOL_GET_PAGE,
    TOOL_SEARCH,
    bedrock_tool_specs,
    call_local_tool,
    is_local_tool,
    search,
    get_page,
)


def test_specs():
    specs = bedrock_tool_specs()
    names = {s["toolSpec"]["name"] for s in specs}
    assert names == {TOOL_SEARCH, TOOL_GET_PAGE}
    assert is_local_tool(TOOL_SEARCH)
    assert not is_local_tool("get_libraries")


def test_search_and_page():
    out = search("New York Times number-one books of 2025", limit=3)
    assert "Wikipedia search" in out
    assert "page_id" in out
    assert "2025" in out or "number-one" in out.lower() or "Times" in out

    # Known page from API smoke
    page = get_page(title="List of The New York Times number-one books of 2025")
    assert "Wikipedia:" in page
    assert "URL" in page
    # Should mention at least one well-known 2025 #1 if page is populated
    assert len(page) > 500

    via_dispatch = call_local_tool(TOOL_SEARCH, {"query": "Percival Everett", "limit": 2})
    assert "page_id" in via_dispatch


if __name__ == "__main__":
    test_specs()
    test_search_and_page()
    print("test_wikipedia_tools: OK")
