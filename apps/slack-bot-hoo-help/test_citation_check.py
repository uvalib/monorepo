"""check_citations, part 1: reading citations and matching catalog records (code, not the model)."""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from citation_check import Record, match, parse_citation, parse_results, significant_words  # noqa: E402

MIRACLE_RESULTS = """# Virgo Catalog Search Results
**Query**: `title:The Miracle of Haitian Art` | **Source/Pool**: `uva_library`

**Total Hits**: 3 item(s) found (showing 3).

## Matching items

### 1. The Miracle of Haitian Art ([1st ed.])
- **Availability**: On shelf — available now
- **Library**: Fine Arts
- **Location / shelf**: Fine Arts Stacks
- **Call number**: `N6606.R62`
- **Format**: Book
- **Author**: Rodman, Selden
- **Virgo record**: https://search.lib.virginia.edu/sources/uva_library/items/u877894
- **Item ID**: `u877894`

### 2. Art in the Lives of Immigrant Communities in the United States
- **Availability**: On shelf — available now
- **Library**: Fine Arts
- **Location / shelf**: Fine Arts Stacks
- **Call number**: `NX180.S6 A73 2010`
- **Format**: Book
- **Author**: DiMaggio, Paul; Fernández-Kelly, María Patricia
- **Virgo record**: https://search.lib.virginia.edu/sources/uva_library/items/u5270720
- **Item ID**: `u5270720`
"""

RODMAN = "Rodman, Selden. _The Miracle of Haitian Art_. Garden City, NY: Doubleday, 1974."
HURBON = ("Hurbon, Laënnec. _Voodoo: Search for the Spirit_. Translated by Lory Frankel. "
          "New York: Harry N. Abrams, 1995.")


def rec(title, author=""):
    return Record(title=title, author=author, library="", location="", call_number="", url="", item_id="")


def test_parse_author_title_year():
    c = parse_citation(RODMAN)
    assert (c.surname, c.title, c.year) == ("Rodman", "The Miracle of Haitian Art", "1974")
    h = parse_citation(HURBON)
    assert (h.surname, h.title, h.year) == ("Hurbon", "Voodoo: Search for the Spirit", "1995")


def test_parse_title_first_citation():
    c = parse_citation("_Latin American Art_. Sotheby's Sale 6301. November 1990.")
    assert (c.author, c.surname, c.title, c.year) == ("", "", "Latin American Art", "1990")


def test_parse_quoted_article():
    c = parse_citation('Liu. "Highlights of Haitian Auction." _Haitian Art Newsletter_ Dec 1978.')
    assert c.surname == "Liu" and c.title == "Highlights of Haitian Auction" and c.year == "1978"


def test_parse_plain_citation_without_markup():
    c = parse_citation("Alexis, Gérald. Edouard Duval-Carrié. Port-au-Prince, 1996.")
    assert (c.surname, c.title, c.year) == ("Alexis", "Edouard Duval-Carrié", "1996")


def test_parse_results():
    r = parse_results(MIRACLE_RESULTS)
    assert len(r) == 2
    assert r[0] == Record(title="The Miracle of Haitian Art ([1st ed.])", author="Rodman, Selden",
                          library="Fine Arts", location="Fine Arts Stacks", call_number="N6606.R62",
                          url="https://search.lib.virginia.edu/sources/uva_library/items/u877894",
                          item_id="u877894")
    assert parse_results("No records matched your search query.") == []


def test_significant_words():
    assert significant_words("Haïti et ses Peintres: de 1804 à 1980") == {"haiti", "et", "ses", "peintres", "1804", "1980"}


def test_match_exact_likely_none():
    rodman = parse_citation(RODMAN)
    assert match(rodman, parse_results(MIRACLE_RESULTS)[0]) == "exact"
    hurbon = parse_citation(HURBON)
    assert match(hurbon, rec("Les Mystères du Vaudou", "Hurbon, Laënnec")) == "none"
    assert match(hurbon, rec("Voodoo", "Hurbon, Laënnec")) == "likely"


def test_short_generic_title_not_exact():
    c = parse_citation("_Latin American Art_. Sotheby's Sale 6301. November 1990.")
    assert match(c, rec("Latin American Art", "Lucie-Smith, Edward")) == "likely"


def test_exact_needs_author_when_citation_has_one():
    c = parse_citation(RODMAN)
    assert match(c, rec("The Miracle of Haitian Art", "Someone, Else")) == "likely"


def test_accents_and_punctuation_ignored():
    c = parse_citation("Lerebours, Michel Philippe. _Haïti et ses peintres_. 2 vols. 1989.")
    assert match(c, rec("Haiti et ses peintres : de 1804 à 1980", "Lerebours, Michel-Philippe")) == "exact"


def test_author_stops_where_an_italic_or_quoted_title_starts():
    c = parse_citation("Smith, J. _The Art of Haiti_. New York: Praeger, 1980.")
    assert (c.author, c.surname, c.title) == ("Smith, J", "Smith", "The Art of Haiti")
    q = parse_citation('Price-Mars, J. "Ainsi parla l\'oncle." Port-au-Prince, 1928.')
    assert q.surname == "Price-Mars" and q.title == "Ainsi parla l'oncle"
