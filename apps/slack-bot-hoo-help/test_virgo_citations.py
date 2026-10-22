#!/usr/bin/env python3
"""RIS for Virgo catalog results via Virgo's citations service (fake service, no network)."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

import virgo_citations as vc  # noqa: E402

REC = "https://search.lib.virginia.edu/sources/uva_library/items/"
SEARCH_OUT = f"""# Virgo Catalog Search Results
**Query**: `title:1984` | **Source/Pool**: `uva_library`

## Matching items

### 1. 1984
- **Availability**: On shelf — available now
- **Format**: Video, DVD
- **Author**: Michael Radford; Orwell, George
- **Virgo record**: {REC}u5099809
- **Item ID**: `u5099809`

### 2. Nineteen eighty-four : a novel
- **Format**: Book
- **Author**: Orwell, George
- **Virgo record**: {REC}u254532
- **Item ID**: `u254532`

### 3. Nineteen eighty-four : a novel
- **Virgo record**: {REC}u254532
"""
IMAGE_OUT = "### 1. Rotunda\n- **Virgo page**: https://search.lib.virginia.edu/sources/images/items/uva-lib:1041884\n"
SERVICE_RIS = ("TY  - VIDEO\nAU  - Orwell, George\nTI  - 1984\nPY  - 2003\n"
               'N1  - Based on the novel.\nN1  - <a href="https://search.lib.virginia.edu/items/u5099809" rel="nofollow">'
               "https://search.lib.virginia.edu/items/u5099809</a>\nER  - \n")


def step(output, tool="VirgoCatalogRuntime___search_by_field", status="success"):
    return {"tool_name": tool, "status": status, "output": output}


class FakeCitations:
    def __init__(self, ris=None, fail=()):
        self.ris, self.fail, self.calls = ris or {}, set(fail), []

    def __call__(self, item_id):
        self.calls.append(item_id)
        if item_id in self.fail:
            raise RuntimeError("timeout")
        return self.ris.get(item_id, SERVICE_RIS)


def test_catalog_items_in_order_without_duplicates_or_other_pools():
    found = vc.catalog_items([step(SEARCH_OUT), step(IMAGE_OUT, tool="X___search_virgo_image_suggestions"),
                              step(f"{REC}u999", status="error")])
    assert [i.item_id for i in found.items] == ["u5099809", "u254532"]
    assert found.items[1].title == "Nineteen eighty-four : a novel" and found.items[1].author == "Orwell, George"
    assert found.items[0].format == "Video, DVD"
    assert found.skipped_other == 1  # the image


def test_service_ris_is_cleaned_to_plain_ur_and_crlf():
    rec = vc.clean_record(SERVICE_RIS, "u5099809")
    lines = rec.split("\r\n")
    assert lines[0] == "TY  - VIDEO" and lines[-1] == "ER  - "
    assert "UR  - https://search.lib.virginia.edu/items/u5099809" in lines
    assert not any("<a " in line for line in lines) and "N1  - Based on the novel." in lines
    assert "\n" not in rec.replace("\r\n", "")


def test_ur_added_when_the_service_gives_none():
    rec = vc.clean_record("TY  - BOOK\nTI  - Animal farm\nER  - \n", "u1")
    assert "UR  - https://search.lib.virginia.edu/sources/uva_library/items/u1" in rec


def test_virgo_ris_fetches_each_item_and_falls_back_on_failure():
    fake = FakeCitations(fail={"u254532"})
    result = vc.virgo_ris([step(SEARCH_OUT)], fetch=fake)
    text = result.content.decode("utf-8")
    assert sorted(fake.calls) == ["u254532", "u5099809"]
    assert text.count("ER  - ") == 2 and text.startswith("TY  - VIDEO")
    assert "TY  - BOOK\r\nTI  - Nineteen eighty-four : a novel\r\nAU  - Orwell, George" in text  # fallback record
    assert result.cited == 2 and result.fallback == 1 and result.skipped_other == 0


def test_virgo_ris_caps_items():
    many = "\n".join(f"### {i}. Book {i}\n- **Virgo record**: {REC}u{i}" for i in range(80))
    fake = FakeCitations()
    result = vc.virgo_ris([step(many)], fetch=fake)
    assert len(fake.calls) == vc.MAX_ITEMS == 50 and result.cited == 50 and result.capped


def test_slow_service_stops_at_the_time_budget():  # Lambda has 120 s; 50 hung requests would blow it
    many = "\n".join(f"### {i}. Book {i}\n- **Virgo record**: {REC}u{i}" for i in range(12))
    now = [0.0]
    fake = FakeCitations()

    def slow(item_id):
        now[0] += 5.0  # every request takes 5 s
        return fake(item_id)
    result = vc.virgo_ris([step(many)], fetch=slow, budget_s=20, clock=lambda: now[0])
    assert result.cited == 12 and 0 < result.fallback < 12  # the rest still get fallback records
    assert len(fake.calls) <= 4 + vc.WORKERS


def test_no_catalog_items_means_no_file():
    result = vc.virgo_ris([step(IMAGE_OUT)], fetch=FakeCitations())
    assert result.content == b"" and result.cited == 0 and result.skipped_other == 1


if __name__ == "__main__":
    test_catalog_items_in_order_without_duplicates_or_other_pools()
    test_service_ris_is_cleaned_to_plain_ur_and_crlf()
    test_ur_added_when_the_service_gives_none()
    test_virgo_ris_fetches_each_item_and_falls_back_on_failure()
    test_virgo_ris_caps_items()
    test_slow_service_stops_at_the_time_budget()
    test_no_catalog_items_means_no_file()
    print("ok")
