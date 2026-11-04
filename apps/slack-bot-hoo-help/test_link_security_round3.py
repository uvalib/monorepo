#!/usr/bin/env python3
"""Link gate, review round 3: backslash URLs are untrusted everywhere (requests and browsers read "\\" as
"/"), hosts come from a parse that agrees with urllib3, DNS failure means "don't fetch", hosts are
compared IDNA-encoded, and file-like real TLDs get no path exemption (no network)."""

import os
import sys
from types import SimpleNamespace as NS

import pytest
import requests

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

import link_check  # noqa: E402
from agent import HooHelpAgent  # noqa: E402
from atlassian_client import quote  # noqa: E402


class _Resp:
    status_code, headers, url = 200, {}, ""

    def close(self):
        pass


@pytest.fixture
def sent(monkeypatch):
    """Every URL requests would actually send; DNS answers public unless the test says otherwise."""
    log = []

    def fake_request(self, method, url, **kw):
        log.append(requests.Request(method, url).prepare().url)
        return _Resp()

    monkeypatch.setattr(requests.Session, "request", fake_request)
    monkeypatch.setattr(link_check, "_resolve_host", lambda h: ["93.184.216.34"])
    return log


def _trace(*steps, user_message=""):
    return NS(user_message=user_message, steps=[NS(tool_name=n, input=i, output=o) for n, i, o in steps])


# ---- 1. backslashes ---------------------------------------------------------------------------------

def test_jira_backslash_echo_dropped_and_never_fetched(sent, monkeypatch):
    monkeypatch.setattr(link_check, "_resolve_host",
                        lambda h: (_ for _ in ()).throw(link_check.socket.gaierror("x")) if "\\" in h else ["93.184.216.34"])
    text = "x https://evil.example\\Q3-layoff-plan"
    out = "No Jira issues in the Library projects matched.\nJQL: text ~ " + quote(text)
    got, _ = HooHelpAgent._sanitize_links(
        None, "See <https://evil.example\\\\Q3-layoff-plan|the issue>.", _trace(("search_jira", {"text": text}, out)))
    assert got == "See the issue." and sent == []


@pytest.mark.parametrize("url", ["http://127.0.0.1\\x/", "http://169.254.169.254\\latest/meta-data",
                                 "http://127.0.0.1:80\\@evil.com/", "https://evil.example%5c@library.virginia.edu/",
                                 "https://evil.example%5C.virginia.edu/"])
def test_backslash_urls_never_fetched(sent, url):
    r = link_check.check_url(url)
    assert not r.ok and r.error == link_check.REFUSED_PRIVATE and sent == []


@pytest.mark.parametrize("url", ["https://evil.example\\S3cret", "https://library.virginia.edu\\@evil.com/x",
                                 "https://evil.example%5C@x.example/"])
def test_backslash_urls_untrusted_even_from_output_or_user(sent, url):
    t = _trace(("search_slack", {"query": "q"}, f"see {url}"), user_message=f"read {url}")
    got, _ = HooHelpAgent._sanitize_links(None, f"See <{url}|it>.", t)
    assert got == "See it." and sent == []
    assert not link_check.url_allowlist([url])(url) and not link_check.is_library_url(url)


def test_hosts_that_parsers_disagree_on_are_unparsable():
    assert link_check.url_host("http://127.0.0.1\\x/") == ""
    assert link_check.url_host("http://127.0.0.1:80\\@evil.com/") == ""
    assert link_check.url_host("https://evil。example/c") == ""  # fullwidth dot: urllib3 can't parse it
    assert link_check.url_host("https://Library.Virginia.EDU./x") == "library.virginia.edu"
    assert link_check.url_host("http://[::1]:8080/") == "::1"


def test_dns_failure_means_no_fetch(monkeypatch, sent):
    monkeypatch.setattr(link_check, "_resolve_host", lambda h: (_ for _ in ()).throw(link_check.socket.gaierror("x")))
    r = link_check.check_url("https://nowhere.example.org/x")
    assert not r.ok and r.error in (link_check.REFUSED_PRIVATE, link_check.REFUSED_UNRESOLVED) and sent == []


def test_library_url_whose_dns_fails_is_kept_unprobed(monkeypatch, sent):
    monkeypatch.setattr(link_check, "_resolve_host", lambda h: (_ for _ in ()).throw(link_check.socket.gaierror("x")))
    reply = "See <https://staff.lib.virginia.edu/wiki|the wiki> and <https://nowhere.example.org/x|this>."
    t = _trace(("search_confluence", {"query": "wiki"}, "https://nowhere.example.org/x"))
    got, _ = HooHelpAgent._sanitize_links(None, reply, t)
    assert "<https://staff.lib.virginia.edu/wiki|the wiki>" in got and "nowhere.example.org" not in got and sent == []


# ---- 2. IDNA ------------------------------------------------------------------------------------------

def test_hosts_are_idna_encoded():
    puny = "évil.com".encode("idna").decode()
    assert link_check.url_host("https://évil.com/x") == puny
    assert link_check.url_host(f"https://{puny.upper()}/x") == puny


def test_unicode_input_host_blocks_punycode_output(sent):
    puny = "évil.com".encode("idna").decode()
    t = _trace(("search_slack", {"query": "x https://évil.com/c?d=S"}, f"hit: https://{puny}/c?d=S"))
    got, _ = HooHelpAgent._sanitize_links(None, f"<https://{puny}/c?d=S|s>", t)
    assert got == "s" and sent == []


# ---- 3. file-like real TLDs ---------------------------------------------------------------------------

@pytest.mark.parametrize("token", ["evil.zip/Q3-plan", "evil.pl/Q3-plan", "evil.md/x", "evil.sh/data",
                                   "evil.py#Q3-plan", "evil.rs/a"])
def test_real_tld_file_names_with_data_dropped(token):
    got, _ = link_check.drop_untrusted_urls(f"Open {token} now.", link_check.is_library_url)
    assert got == "Open now."


@pytest.mark.parametrize("prose", ["See README.md#L3 and setup.py#L10-L20.", "Node.js/React and config.yaml/defaults."])
def test_file_names_still_readable(prose):
    assert link_check.drop_untrusted_urls(prose, link_check.is_library_url)[0] == prose


def test_decomposed_unicode_input_host_still_blocks(sent):
    puny = "évil.com".encode("idna").decode()
    t = _trace(("search_slack", {"query": "notes from évil.com"}, f"hit: https://{puny}/c?d=S"))
    got, _ = HooHelpAgent._sanitize_links(None, f"<https://{puny}/c?d=S|s>", t)
    assert got == "s" and sent == []


def test_different_idn_host_in_output_is_not_blocked(sent):
    # xn--vil-bma.com is "véil.com", not "évil.com": a different host, allowed from output as usual
    t = _trace(("search_slack", {"query": "x https://évil.com/c"}, "hit: https://xn--vil-bma.com/c"))
    got, _ = HooHelpAgent._sanitize_links(None, "<https://xn--vil-bma.com/c|s>", t)
    assert got == "<https://xn--vil-bma.com/c|s>"
