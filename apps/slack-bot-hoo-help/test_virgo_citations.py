#!/usr/bin/env python3
"""RIS for Virgo catalog results via the Virgo MCP server's get_citations tool (fake gateway, no network)."""

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


def record(item_id, ty="BOOK", note=""):
    lines = [f"TY  - {ty}", f"TI  - Title {item_id}", f"ID  - {item_id}", f"UR  - {REC}{item_id}"]
    return "\r\n".join(lines + ([f"N1  - {note}"] if note else []) + ["ER  - "])


def step(output, tool="VirgoCatalogRuntime___search_by_field", status="success"):
    return {"tool_name": tool, "status": status, "output": output}


class FakeGateway:
    """call_tool(name, args) like GatewayMCPClient: get_citations answers with one RIS record per ID."""

    def __init__(self, unavailable=(), reply=None):
        self.unavailable, self.reply, self.calls = set(unavailable), reply, []

    def __call__(self, name, args):
        self.calls.append((name, args))
        if self.reply is not None:
            return self.reply
        ids = [i for i in args["item_ids"].split(",") if i]
        return "\r\n".join(record(i, note=vc.UNAVAILABLE_NOTE) if i in self.unavailable else record(i)
                           for i in ids) + "\r\n"


def test_catalog_items_in_order_without_duplicates_or_other_pools():
    found = vc.catalog_items([step(SEARCH_OUT), step(IMAGE_OUT, tool="X___search_virgo_image_suggestions"),
                              step(f"{REC}u999", status="error")])
    assert [i.item_id for i in found.items] == ["u5099809", "u254532"]
    assert found.items[1].title == "Nineteen eighty-four : a novel" and found.items[1].author == "Orwell, George"
    assert found.items[0].format == "Video, DVD"
    assert found.skipped_other == 1  # the image


def test_one_gateway_call_for_all_items_in_search_order():
    gw = FakeGateway()
    result = vc.virgo_ris([step(SEARCH_OUT)], call_tool=gw)
    assert gw.calls == [("VirgoCatalogRuntime___get_citations", {"item_ids": "u5099809,u254532", "format": "ris"})]
    text = result.content.decode("utf-8")
    assert text.index("ID  - u5099809") < text.index("ID  - u254532") and text.count("ER  - ") == 2
    assert result.cited == 2 and result.fallback == 0


def test_unavailable_items_use_the_search_output():
    result = vc.virgo_ris([step(SEARCH_OUT)], call_tool=FakeGateway(unavailable={"u254532"}))
    text = result.content.decode("utf-8")
    assert "TY  - BOOK\r\nTI  - Nineteen eighty-four : a novel\r\nAU  - Orwell, George" in text
    assert vc.UNAVAILABLE_NOTE not in text and result.fallback == 1


def test_gateway_error_falls_back_for_every_item():
    for reply in ["Gateway Tool Invocation Error (x): timed out", "Tool Error: Unknown tool", ""]:
        result = vc.virgo_ris([step(SEARCH_OUT)], call_tool=FakeGateway(reply=reply))
        assert result.cited == 2 and result.fallback == 2, reply
        assert "TI  - 1984" in result.content.decode("utf-8")


def test_caps_items():
    many = "\n".join(f"### {i}. Book {i}\n- **Virgo record**: {REC}u{i}" for i in range(80))
    gw = FakeGateway()
    result = vc.virgo_ris([step(many)], call_tool=gw)
    assert len(gw.calls[0][1]["item_ids"].split(",")) == vc.MAX_ITEMS == 50
    assert result.cited == 50 and result.capped


PREVIOUS_ANSWER = (f"We have it:\n• <{REC}u4422|*Nineteen Eighty-four*> — Shannon, on shelf\n"
                   "• *1984* (DVD) https://search.lib.virginia.edu/items/u5099809 — Clemons\n")
HISTORY = [{"role": "user", "content": [{"text": "[Doug]: do we have 1984?"}]},
           {"role": "assistant", "content": [{"text": PREVIOUS_ANSWER}]}]


def test_refers_back():
    for text in ["can I get those as RIS?", "these in Zotero format", "export them for Zotero", "the above as RIS"]:
        assert vc.refers_back(text), text
    assert not vc.refers_back("Orwell books as RIS for Zotero")


def test_items_from_the_previous_answer():
    found = vc.items_from_history(HISTORY)
    assert [i.item_id for i in found.items] == ["u4422", "u5099809"]
    assert found.items[0].title == "Nineteen Eighty-four"
    assert vc.items_from_history([{"role": "user", "content": [{"text": f"{REC}u1"}]}]).items == []  # bot turns only


def test_those_uses_the_previous_answer_not_a_new_search():  # trial: RIS re-ran a different search
    gw = FakeGateway()
    result = vc.virgo_ris([step(SEARCH_OUT)], call_tool=gw, history=HISTORY, user_text="can I get those as RIS?")
    assert gw.calls[0][1]["item_ids"] == "u4422,u5099809" and result.cited == 2


def test_new_request_still_uses_this_turns_search():
    gw = FakeGateway()
    vc.virgo_ris([step(SEARCH_OUT)], call_tool=gw, history=HISTORY, user_text="Orwell books as RIS")
    assert gw.calls[0][1]["item_ids"] == "u5099809,u254532"
    gw = FakeGateway()
    vc.virgo_ris([], call_tool=gw, history=HISTORY, user_text="as RIS please")  # nothing searched: use the answer
    assert gw.calls[0][1]["item_ids"] == "u4422,u5099809"


def test_the_models_own_get_citations_call_is_the_file():  # live check: the model picks "those" itself
    ris = "\r\n".join([record("u4422"), record("u9", note=vc.UNAVAILABLE_NOTE)]) + "\r\n"
    cite_step = {"tool_name": "VirgoCatalogRuntime___get_citations", "status": "success",
                 "input": {"item_ids": "u4422, u9", "format": "ris"}, "output": ris}
    gw = FakeGateway()
    result = vc.virgo_ris([step(SEARCH_OUT), cite_step], call_tool=gw, history=HISTORY, user_text="those as RIS")
    text = result.content.decode("utf-8")
    assert gw.calls == []  # no second gateway call
    assert text.index("ID  - u4422") < text.index("ID  - u9") and result.cited == 2 and result.fallback == 1
    assert vc.UNAVAILABLE_NOTE not in text  # the unavailable one gets a fallback record
    apa_step = {**cite_step, "input": {"item_ids": "u4422", "format": "apa"}, "output": "**APA** ..."}
    vc.virgo_ris([step(SEARCH_OUT), apa_step], call_tool=gw, history=HISTORY, user_text="those as RIS")
    assert gw.calls and gw.calls[0][1]["item_ids"] == "u4422,u5099809"  # APA calls don't count


def test_no_catalog_items_means_no_call_and_no_file():
    gw = FakeGateway()
    result = vc.virgo_ris([step(IMAGE_OUT)], call_tool=gw)
    assert gw.calls == [] and result.content == b"" and result.cited == 0 and result.skipped_other == 1


if __name__ == "__main__":
    test_catalog_items_in_order_without_duplicates_or_other_pools()
    test_one_gateway_call_for_all_items_in_search_order()
    test_unavailable_items_use_the_search_output()
    test_gateway_error_falls_back_for_every_item()
    test_caps_items()
    test_refers_back()
    test_items_from_the_previous_answer()
    test_those_uses_the_previous_answer_not_a_new_search()
    test_new_request_still_uses_this_turns_search()
    test_the_models_own_get_citations_call_is_the_file()
    test_no_catalog_items_means_no_call_and_no_file()
    print("ok")
