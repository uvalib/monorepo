"""check_citations fixes from the 2026-11-10 Haitian-art list (15 items; Virgo holds 8).

Hoo Helper called Bloncourt (held) "likely" and matched Demme's film to a Demme book.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from citation_check import TOOL_CHECK_CITATIONS, Record, match, parse_citation, title_queries  # noqa: E402
from test_citation_tools import Gateway, make, rows  # noqa: E402

BLONCOURT = ("Bloncourt, Gérald, and Marie-José Nadal-Gardère. _La peinture haïtienne / Haitian Painters_. "
             "Paris: Nathan, 1986.")
DEMME = ("Demme, Jonathan, and Kirsten Coyne, eds. _Haiti: Three Visions—Etienne Chavannes, Edger-Baptiste, "
         "Ernst Prophète_. New York: Kaliko Press, 1994.")
JOY = "Rodman, Selden. _Where Art Is Joy: Haitian Art, the First Forty Years_. New York: Ruggles de Latour, 1988."
HURBON = "Hurbon, Laënnec. _Voodoo: Search for the Spirit_. New York: Harry N. Abrams, 1995."


def rec(title, author="", library="", location="", call_number=""):
    return Record(title=title, author=author, library=library, location=location, call_number=call_number,
                  url="", item_id="")


def block(title, author, library="Fine Arts", location="Fine Arts Stacks", call="X1", item="u1"):
    return (f"## Matching items\n\n### 1. {title}\n- **Library**: {library}\n- **Location / shelf**: {location}\n"
            f"- **Call number**: `{call}`\n- **Author**: {author}\n"
            f"- **Virgo record**: https://search.lib.virginia.edu/sources/uva_library/items/{item}\n"
            f"- **Item ID**: `{item}`\n")


PEINTURE = block("La Peinture Haïtienne", "Nadal-Gardère, Marie-José; Bloncourt, Gérald", library="Fine Arts",
                 location="Interlibrary Lending", call="ND306.P43 1986", item="u788710")
DREAMS = block("Haiti: Dreams of Democracy", "Jonathan Demme; Jo Menell; Demme, Jonathan; Menell, Jo",
               library="Ivy", location="By Request", call="VIDEO.VHS4187", item="u1298600")


# 1. search text: punctuation out, each side of a bilingual title, then the main title

def test_title_queries():
    assert title_queries(parse_citation(BLONCOURT)) == [
        "La peinture haïtienne Haitian Painters", "La peinture haïtienne", "Haitian Painters"]
    assert title_queries(parse_citation(DEMME)) == [
        "Haiti: Three Visions Etienne Chavannes, Edger-Baptiste, Ernst Prophète"]  # "Haiti" alone is too broad
    assert title_queries(parse_citation(JOY)) == [
        "Where Art Is Joy: Haitian Art, the First Forty Years", "Where Art Is Joy"]
    assert title_queries(parse_citation("Rodman, Selden. _The Miracle of Haitian Art_. 1974.")) == [
        "The Miracle of Haitian Art"]


# 2. one side of a bilingual title, with the author, is the same work

def test_bilingual_side_with_author_is_exact():
    c = parse_citation(BLONCOURT)
    assert match(c, rec("La Peinture Haïtienne", "Nadal-Gardère, Marie-José; Bloncourt, Gérald")) == "exact"
    assert match(c, rec("Haitian Painters", "Bloncourt, Gérald")) == "exact"
    assert match(c, rec("La Peinture Haïtienne", "Someone, Else")) == "likely"


# 3. a shared main title doesn't count when the subtitles disagree

def test_main_title_with_a_different_subtitle_is_none():
    c = parse_citation(DEMME)
    assert match(c, rec("Haiti: Dreams of Democracy", "Demme, Jonathan")) == "none"
    assert match(c, rec("Haiti: Poverty Reduction Strategy Paper", "IMF")) == "none"
    assert match(c, rec("From Sugar to Revolution: Women's Visions of Haiti, Cuba", "Chancy, Myriam")) == "none"


def test_main_title_still_counts_without_a_conflicting_subtitle():
    c = parse_citation(HURBON)
    assert match(c, rec("Voodoo", "Hurbon, Laënnec")) == "likely"
    assert match(c, rec("Voodoo: Search for the Spirit", "Hurbon, Laënnec")) == "exact"


def test_bloncourt_held_and_demme_not():
    results = {("title", "La peinture haïtienne"): PEINTURE, ("author", "Demme, Jonathan"): DREAMS,
               ("author", "Demme"): DREAMS}
    t, _ = make(Gateway(results))
    r = rows(t.call(TOOL_CHECK_CITATIONS, {"citations": [BLONCOURT, DEMME]}))
    assert "| Yes | exact |" in r[0]
    assert "| No | none |" in r[1] and "VHS4187" not in r[1]


# 4. the library goes with the location ("Interlibrary Lending" alone hid that Fine Arts owns it)

def test_location_names_the_library():
    t, _ = make(Gateway({("title", "La peinture haïtienne"): PEINTURE}))
    r = rows(t.call(TOOL_CHECK_CITATIONS, {"citations": [BLONCOURT]}))[0]
    assert "| Fine Arts, Interlibrary Lending, ND306.P43 1986 |" in r


def test_location_not_repeated_when_it_names_the_library():
    stacks = block("The Miracle of Haitian Art", "Rodman, Selden", call="N6606.R62")
    t, _ = make(Gateway({("title", "The Miracle of Haitian Art"): stacks}))
    r = rows(t.call(TOOL_CHECK_CITATIONS, {"citations": ["Rodman, Selden. _The Miracle of Haitian Art_. 1974."]}))[0]
    assert "| Fine Arts Stacks, N6606.R62 |" in r


# 5. author search by full name, falling back to the surname when the full name finds someone else

SELDEN = block("Haiti: The Black Republic", "Rodman, Selden", item="u2")
TOCQUEVILLE = block("Democracy in America", "Tocqueville, Alexis de; Bevan, Gerald", item="u3")
GERALD_ALEXIS = block("Pour que vive la ligne: Tebó", "Alexis, Gérald", item="u4")


def test_author_search_uses_the_full_name():
    t, g = make(Gateway({("author", "Rodman, Selden"): SELDEN}))
    t.call(TOOL_CHECK_CITATIONS, {"citations": [JOY]})
    assert [a["query"] for _, a in g.calls if a["field"] == "author"] == ["Rodman, Selden"]


def test_author_search_falls_back_to_the_surname():
    alexis = "Alexis, Gérald. _Peintres haïtiens_. Paris: Cercle d’Art, 2000."
    t, g = make(Gateway({("author", "Alexis, Gérald"): TOCQUEVILLE, ("author", "Alexis"): GERALD_ALEXIS}))
    t.call(TOOL_CHECK_CITATIONS, {"citations": [alexis]})
    assert [a["query"] for _, a in g.calls if a["field"] == "author"] == ["Alexis, Gérald", "Alexis"]


def test_no_given_name_searches_the_surname_once():
    t, g = make(Gateway({}))
    t.call(TOOL_CHECK_CITATIONS, {"citations": ["Pataki. _Haitian Painting: Art and Kitsch_. 1986."]})
    assert [a["query"] for _, a in g.calls if a["field"] == "author"] == ["Pataki"]
