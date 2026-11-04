#!/usr/bin/env python3
"""Link gate, review round 4: whitespace or control characters inside a link target can't hide the
real host (browsers strip tabs/newlines), and "%" in a host is never safe (no network)."""

import os
import sys

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

import link_check  # noqa: E402


@pytest.mark.parametrize("ws", ["\t", "\n", " ", "\r", "\x0b", "\x00"])
def test_whitespace_inside_slack_link_target_is_dropped(ws):
    text = f"See <https://lib.virginia.edu{ws}.evil.com/c?d=S|the guide> today."
    got, changes = link_check.drop_untrusted_urls(text, link_check.is_library_url)
    assert "evil.com" not in got and "the guide" in got and changes
    assert got.startswith("See the guide")


def test_unlabelled_link_with_whitespace_is_dropped():
    got, _ = link_check.drop_untrusted_urls("See <https://lib.virginia.edu\t.evil.com/c?d=S> now.",
                                            link_check.is_library_url)
    assert "evil" not in got and "lib.virginia.edu" not in got


def test_control_characters_removed_but_lines_kept():
    got, _ = link_check.drop_untrusted_urls("Line one\x01\nLine\ttwo https://library.virginia.edu/x\n",
                                            link_check.is_library_url)
    assert got == "Line one\nLinetwo https://library.virginia.edu/x\n"


def test_ordinary_library_links_unchanged():
    text = "• <https://library.virginia.edu/hours|Hours>\n• <https://guides.lib.virginia.edu/az.php>"
    assert link_check.drop_untrusted_urls(text, link_check.is_library_url) == (text, [])


@pytest.mark.parametrize("url", ["https://evil.com%40.lib.virginia.edu/x", "https://lib%2evirginia.edu/x",
                                 "https://a%2Fb.library.virginia.edu/", "https://library.virginia.edu%00.evil.com/"])
def test_percent_in_host_is_unsafe(url, monkeypatch):
    assert not link_check.url_is_safe(url)
    assert not link_check.is_library_url(url)
    assert not link_check.url_allowlist([url])(url)
    monkeypatch.setattr(link_check.requests, "Session", lambda: (_ for _ in ()).throw(AssertionError("fetched")))
    assert link_check.check_url(url).error == link_check.REFUSED_PRIVATE


@pytest.mark.parametrize("url", ["https://xn--vil-9la.lib.virginia.edu/x", "https://lib_x.virginia.edu/x"])
def test_library_hosts_are_plain_ascii_names(url):
    assert link_check.is_library_url(url) is (url.startswith("https://xn--"))
