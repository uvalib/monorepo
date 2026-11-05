import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from virgo_access import (  # noqa: E402
    ACCESS_TYPES, ItemDetails, classify_access, parse_item_details,
)

SERIALS = """# Item Record: Some Streaming Title
## Availability & access
- **Availability**: Online
- **Library**: UVA Library
- **Location / shelf**: Internet materials
- **Access online**: http://RE5QY4SB7X.search.serialssolutions.com/?V=1.0&L=RE5QY4SB7X&S=JCs&C=x
- **Virgo Catalog URL**: https://search.lib.virginia.edu/sources/uva_library/items/u12618378
## Bibliographic details
- **Author(s)**: Someone
- **Format**: EBook, Book, Online
"""
PROXY = """# Item Record: Heaven: A Novel (1st ed.)
## Availability & access
- **Availability**: Online
- **Library**: UVA Library
- **Location / shelf**: Internet materials
- **Call number**: `BF637.B85 K393 2021`
- **Access online**: https://proxy1.library.virginia.edu/login?url=https://ebookcentral.proquest.com/lib/uva/detail.action?docID=7211071
- **Virgo Catalog URL**: https://search.lib.virginia.edu/sources/uva_library/items/u13271543
## Bibliographic details
- **Author(s)**: Kawakami, Mieko
- **Format**: EBook, Book, Online
"""
ARTICLE = """# Item Record: An Article About Things
## Availability & access
- **Availability**: Online
- **Library**: —
- **Location / shelf**: —
- **Access online**: https://proxy1.library.virginia.edu/login?url=https://search.ebscohost.com/login.aspx?direct=true&db=a9h
"""
BOOK = """# Item Record: A Printed Book
- **Availability**: On shelf
- **Library**: Clemons
- **Location / shelf**: Stacks
- **Call number**: `PS1 .A1`
- **Format**: Book
"""


def test_parse_item_details():
    d = parse_item_details(SERIALS)
    assert d.title == "Some Streaming Title"
    assert d.format == "EBook, Book, Online"
    assert d.library == "UVA Library"
    assert d.location == "Internet materials"
    assert len(d.access_urls) == 1 and "serialssolutions.com" in d.access_urls[0]

    d = parse_item_details(PROXY)
    assert d.title == "Heaven: A Novel (1st ed.)"
    assert d.format == "EBook, Book, Online"
    assert d.access_urls[0].startswith("https://proxy1.library.virginia.edu/login?url=")

    d = parse_item_details(ARTICLE)
    assert d.title == "An Article About Things"
    assert d.format == ""
    assert d.library == "" and d.location == ""
    assert "ebscohost.com" in d.access_urls[0]

    d = parse_item_details(BOOK)
    assert (d.library, d.location, d.access_urls) == ("Clemons", "Stacks", [])


def D(**kw):
    base = dict(title="t", format="", library="", location="", access_urls=[])
    base.update(kw)
    return ItemDetails(**base)


def test_classify_access():
    assert classify_access("articles", None) == "licensed (EDS)"
    assert classify_access("articles", D(library="Clemons")) == "licensed (EDS)"
    assert classify_access("hathitrust", None) == "HathiTrust"
    assert classify_access("images", D()) == "UVA digital"
    assert classify_access("uva_library", parse_item_details(PROXY)) == "licensed e-resource"
    assert classify_access("uva_library", parse_item_details(SERIALS)) == "licensed e-resource"
    avalon = D(library="UVA Library", access_urls=["https://avalon.lib.virginia.edu/media_objects/x"])
    assert classify_access("uva_library", avalon) == "UVA digital"
    assert classify_access("uva_library", parse_item_details(BOOK)) == "physical (UVA collection)"
    assert classify_access("uva_library", D(library="UVA Library")) == "unknown"
    assert classify_access("uva_library", D(library="—")) == "unknown"
    assert classify_access("uva_library", None) == "unknown"
    assert classify_access("somepool", D(library="Clemons")) == "unknown"
    # a lookalike host is not licensed
    fake = D(library="UVA Library", access_urls=["https://evil-jstor.org.example.com/x"])
    assert classify_access("uva_library", fake) == "unknown"
    assert all(classify_access(p, None) in ACCESS_TYPES
               for p in ("uva_library", "articles", "hathitrust", "images", "x"))


def test_image_record_heading():
    d = parse_item_details("# Image Record: Rotunda, north front\n- **Format**: Photograph\n")
    assert d.title == "Rotunda, north front" and d.format == "Photograph"
