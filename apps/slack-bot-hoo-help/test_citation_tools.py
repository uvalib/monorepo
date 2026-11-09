"""check_citations, part 2: the tool — parallel searches, budget, table output, wiring."""
import os
import sys
import time
from types import SimpleNamespace

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from citation_check import TOOL_CHECK_CITATIONS, CitationTools, citation_tools_for_env  # noqa: E402
from test_citation_check import HURBON, MIRACLE_RESULTS, RODMAN  # noqa: E402

HEADER = ("| # | Author | Title | Citation | UVA has it? | Match | Location / call number | Virgo link | "
          "Other editions or works by author |")
NONE = "**Total Hits**: 0 item(s) found (showing 0).\n\nNo records matched your search query."
HURBON_AUTHOR = """## Matching items

### 1. Les Mystères du Vaudou
- **Library**: Clemons
- **Location / shelf**: Clemons Stacks
- **Call number**: `BL2530.H3 H86 1993`
- **Author**: Hurbon, Laënnec
- **Virgo record**: https://search.lib.virginia.edu/sources/uva_library/items/u2160012
- **Item ID**: `u2160012`

### 2. Dieu Dans le Vaudou Haïtien
- **Library**: Clemons
- **Location / shelf**: Clemons Stacks
- **Call number**: `BL2530.H3 H87`
- **Author**: Hurbon, Laënnec
- **Virgo record**: https://search.lib.virginia.edu/sources/uva_library/items/u100200
- **Item ID**: `u100200`

### 3. Religions et Lien Social
- **Author**: Hurbon, Laënnec
- **Item ID**: `u3`
"""
AUCTION = "_Latin American Art_. Sotheby's Sale 6301. November 1990."
RESULTS = {("title", "The Miracle of Haitian Art"): MIRACLE_RESULTS,
           ("title", "Voodoo: Search for the Spirit"): NONE,
           ("author", "Hurbon"): HURBON_AUTHOR,
           ("title", "Latin American Art"): NONE}


class Gateway:
    def __init__(self, results=None, delay=0.0, fail=()):
        self.results, self.delay, self.fail = results or RESULTS, delay, set(fail)
        self.calls = []

    def __call__(self, name, args):
        self.calls.append((name, dict(args)))
        assert name == "Catalog___search_catalog"
        if self.delay:
            time.sleep(self.delay)
        if args["query"] in self.fail:
            return "Error: gateway timeout"
        return self.results.get((args["field"], args["query"]), NONE)


def make(gateway=None, **kw):
    g = gateway or Gateway()
    return CitationTools(g, v2=lambda: True, **kw), g


def rows(out):
    return [ln for ln in out.splitlines() if ln.startswith("| ") and not ln.startswith(("| #", "| ---"))]


def test_one_row_per_citation_and_summary():
    t, _ = make()
    out = t.call(TOOL_CHECK_CITATIONS, {"citations": [RODMAN, HURBON, AUCTION]})
    lines = out.splitlines()
    assert lines[0] == "Citation check — 3 citations: 1 held, 0 likely (check), 2 not found, 0 not checked"
    assert HEADER in lines
    r = rows(out)
    assert len(r) == 3
    assert ("| Yes | exact | Fine Arts Stacks, N6606.R62 | "
            "https://search.lib.virginia.edu/sources/uva_library/items/u877894 |") in r[0]
    assert "| No | none |" in r[1] and "Les Mystères du Vaudou (u2160012); Dieu Dans le Vaudou Haïtien (u100200)" in r[1]
    assert r[2].startswith("| 3 |") and "| No | none |" in r[2]
    assert ('Auction catalogs, journal articles and single journal issues usually aren\'t catalogued as their own '
            'records: "No" for those means check the journal or database.') in lines


def test_author_search_only_when_title_not_found():
    t, g = make()
    t.call(TOOL_CHECK_CITATIONS, {"citations": [RODMAN, HURBON, AUCTION]})
    author_calls = [a["query"] for _, a in g.calls if a["field"] == "author"]
    assert author_calls == ["Hurbon"]
    assert len(g.calls) <= 2 * 3


def test_parallel_budget():
    t, _ = make(Gateway(delay=0.2), budget=0.3)
    t0 = time.monotonic()
    out = t.call(TOOL_CHECK_CITATIONS, {"citations": [f"Author{i}, A. _Title number {i}_. 2000." for i in range(20)]})
    assert time.monotonic() - t0 < 2
    assert any("| Not checked | timed out |" in r for r in rows(out))
    assert "not checked" in out.splitlines()[0] and len(rows(out)) == 20


def test_search_failure_row():
    t, _ = make(Gateway(fail={"The Miracle of Haitian Art"}))
    r = rows(t.call(TOOL_CHECK_CITATIONS, {"citations": [RODMAN, AUCTION]}))
    assert "| Not checked | search failed |" in r[0] and "| No | none |" in r[1]


def test_cap_100():
    t, _ = make()
    out = t.call(TOOL_CHECK_CITATIONS, {"citations": [AUCTION] * 101})
    assert len(rows(out)) == 100 and "1 more not checked (limit 100)" in out


def test_start_number():
    t, _ = make()
    assert rows(t.call(TOOL_CHECK_CITATIONS, {"citations": [AUCTION], "start_number": 26}))[0].startswith("| 26 |")


def test_cells_cleaned():
    t, _ = make()
    r = rows(t.call(TOOL_CHECK_CITATIONS, {"citations": ["Odd | title\twith\nbreaks. 2000."]}))
    assert len(r) == 1 and r[0].count("|") == 10


def test_empty_and_bad_input():
    t, _ = make()
    assert t.call(TOOL_CHECK_CITATIONS, {"citations": []}).startswith("Error:")
    assert t.call(TOOL_CHECK_CITATIONS, {}).startswith("Error:")


def test_offered_only_on_v2_gateway():
    assert CitationTools(Gateway(), v2=lambda: False).tool_specs() == []
    spec = CitationTools(Gateway(), v2=lambda: True).tool_specs()[0]["toolSpec"]
    assert spec["name"] == "check_citations" and spec["inputSchema"]["json"]["required"] == ["citations"]
    assert citation_tools_for_env({"ENABLE_CITATION_CHECK": "false"}, gateway_call=Gateway(), v2=lambda: True) is None
    assert citation_tools_for_env({}, gateway_call=Gateway(), v2=lambda: True) is not None
    assert citation_tools_for_env({}, gateway_call=None, v2=lambda: True) is None


def test_untrusted_and_trusted_links():
    from agent import _link_sources, untrusted_source
    assert untrusted_source("check_citations")
    t, _ = make()
    out = t.call(TOOL_CHECK_CITATIONS, {"citations": [RODMAN]})
    step = SimpleNamespace(tool_name="check_citations", output=out,
                           input={"citations": ["see https://search.lib.virginia.edu/sources/uva_library/items/u999"]})
    trusted = _link_sources(SimpleNamespace(steps=[step]))[1]
    assert "https://search.lib.virginia.edu/sources/uva_library/items/u877894" in trusted
    assert not any("u999" in u for u in trusted)


# ---- live eval 2026-11-09: "other works" listed the first author results, not related ones ----

NOISY_AUTHOR = """## Matching items

### 0. L'insurrection des Esclaves de Saint-Domingue, 22-23 Août 1791: Actes de la Table Ronde Internationale
- **Author**: Hurbon, Laënnec
- **Item ID**: `u3543443`

### 1. Religions et Lien Social: l'église et l'état Moderne En Haïti
- **Author**: Hurbon, Laënnec
- **Item ID**: `u4031680`

### 2. Le Barbare Imaginaire
- **Author**: Hurbon, Laënnec
- **Item ID**: `u2`

### 3. Les Mystères du Vaudou
- **Author**: Hurbon, Laënnec
- **Item ID**: `u2160012`
"""
OTHER_RODMAN = """## Matching items

### 1. Arms Transfers to Israel
- **Author**: Rodman, David
- **Item ID**: `u460473`
"""


def test_other_works_are_related_titles_by_the_same_author():
    results = dict(RESULTS)
    results[("author", "Hurbon")] = NOISY_AUTHOR
    t, _ = make(Gateway(results))
    r = rows(t.call(TOOL_CHECK_CITATIONS, {"citations": [HURBON]}))[0]
    assert r.rstrip(" |").endswith("Les Mystères du Vaudou (u2160012)")
    assert "Religions" not in r and "Barbare" not in r and "insurrection" not in r


def test_other_works_skip_a_different_person_with_the_surname():
    joy = "Rodman, Selden. _Where Art Is Joy: Haitian Art, the First Forty Years_. 1988."
    results = {("author", "Rodman"): OTHER_RODMAN}
    t, _ = make(Gateway(results))
    r = rows(t.call(TOOL_CHECK_CITATIONS, {"citations": [joy]}))[0]
    assert "Arms Transfers" not in r and r.rstrip().endswith("| — |")



def test_author_and_title_columns():
    # 2026-11-09: "The first column should only include the author, the second the title".
    t, _ = make()
    r = rows(t.call(TOOL_CHECK_CITATIONS, {"citations": [RODMAN, AUCTION]}))
    assert r[0].startswith("| 1 | Rodman, Selden | The Miracle of Haitian Art | Rodman, Selden. _The Miracle")
    assert r[1].startswith("| 2 | — | Latin American Art | _Latin American Art_.")
