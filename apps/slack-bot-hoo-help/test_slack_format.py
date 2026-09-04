#!/usr/bin/env python3
"""Unit tests for LLM Block Kit parsing/sanitizing (no Bedrock)."""

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from slack_format import (
    FORMATTER_TOOL_NAME,
    SLACK_BLOCK_KIT_SCHEMA,
    drop_unsourced_hours_blocks,
    formatter_output_usable,
    formatter_preserves_draft,
    parse_formatter_payload,
    rewrite_urls_in_blocks,
    sanitize_llm_blocks,
)
from bedrock_mantle import extract_message_text, extract_tool_arguments
from bedrock_params import (
    DEFAULT_AGENT_MODEL_ID,
    DEFAULT_FORMAT_MODEL_ID,
    inference_config_for_model,
    uses_bedrock_mantle,
)


def test_plain_mrkdwn_passthrough():
    text, blocks = parse_formatter_payload("*Clemons* is open until 12:00 AM.")
    assert "Clemons" in text
    assert blocks is None


def test_json_header_section_and_button():
    payload = {
        "text": "Great Expectations is on the shelf at Clemons.",
        "blocks": [
            {"type": "header", "text": "Great Expectations"},
            {
                "type": "section",
                "text": "by Charles Dickens",
                "fields": [
                    {"label": "Location", "value": "Clemons, 3rd Floor"},
                    {"label": "Call number", "value": "`PR4570.G7 1994`"},
                ],
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": "Open in Virgo",
                        "url": "https://search.lib.virginia.edu/sources/uva_library/items/u110023",
                    }
                ],
            },
        ],
    }
    text, blocks = parse_formatter_payload(json.dumps(payload))
    assert "on the shelf" in text
    assert blocks is not None
    assert blocks[0]["type"] == "header"
    assert blocks[0]["text"]["type"] == "plain_text"
    assert blocks[1]["fields"][0]["text"].startswith("*Location*")
    assert blocks[2]["elements"][0]["url"].startswith("https://")
    assert "action_id" not in blocks[2]["elements"][0]


def test_fenced_json_and_string_table():
    raw = """```json
{"text": "Hours intro", "blocks": [
  {"type": "header", "text": "Copies"},
  {"type": "table", "rows": [["Title", "Location"], ["Great Expectations", "Clemons"]]}
]}
```"""
    text, blocks = parse_formatter_payload(raw)
    assert text == "Hours intro"
    assert blocks[1]["type"] == "table"
    assert blocks[1]["rows"][1][1]["type"] == "raw_text"
    assert blocks[1]["rows"][1][1]["text"] == "Clemons"


def test_drops_charts_and_interactive_buttons():
    blocks = sanitize_llm_blocks(
        [
            {
                "type": "data_visualization",
                "title": "Nope",
                "chart": {"type": "pie", "segments": [{"label": "A", "value": 1}]},
            },
            {
                "type": "actions",
                "elements": [
                    {"type": "button", "text": "Click", "action_id": "do_it", "value": "x"}
                ],
            },
            {"type": "section", "text": "Keep me"},
        ]
    )
    assert [b["type"] for b in blocks] == ["section"]


def test_hours_drops_llm_day_list():
    """Code-owned hours table replaces Gemma's day-by-day listing."""
    from slack_format import format_for_slack

    class _Step:
        def __init__(self):
            self.tool_name = "get_library_hours"
            self.status = "success"
            self.output = (
                "### Hours: Clemons Library\n"
                "* **Official name**: **Clemons Library**\n"
                "| Date | Day | Hours |\n"
                "| :--- | :--- | :--- |\n"
                "| 2026-09-05 | Sat | 9:00 AM–12:00 AM |\n"
                "| 2026-09-06 | Sun | 10:00 AM–12:00 AM |\n"
            )

    payload = json.dumps(
        {
            "text": "Clemons Library Hours, Saturday, September 5: 9:00 AM–12:00 AM",
            "blocks": [
                {"type": "header", "text": "Clemons Library Hours"},
                {
                    "type": "section",
                    "text": (
                        "Saturday, September 5:\n9:00 AM–12:00 AM\n"
                        "Sunday, September 6:\n10:00 AM–12:00 AM"
                    ),
                },
            ],
        }
    )
    text, blocks = format_for_slack(
        payload, use_llm=False, tool_steps=[_Step()]
    )
    types = [b.get("type") for b in blocks]
    assert types.count("header") == 1
    assert "table" in types
    assert "section" not in types
    assert "September 5" not in json.dumps(blocks)
    assert "Clemons" in text
    assert "9:00 AM–12:00 AM" in text


def test_format_for_slack_merges_llm_blocks_with_hours():
    payload = json.dumps(
        {
            "text": "*Clemons Library* is open all week.",
            "blocks": [
                {"type": "header", "text": "Clemons Library"},
                {"type": "section", "text": "Open every day this week."},
            ],
        }
    )

    class _Step:
        def __init__(self):
            self.tool_name = "get_library_hours"
            self.status = "success"
            self.output = (
                "### Hours: Clemons Library\n"
                "* **Official name**: **Clemons Library**\n"
                "| Date | Day | Hours |\n"
                "| :--- | :--- | :--- |\n"
                "| 2026-09-05 | Sat | 9:00 AM–12:00 AM |\n"
            )

    # Simulate formatter JSON as if the LLM already ran (use_llm=False path
    # still parses JSON via format_for_slack's parse of `raw` only when use_llm
    # produced formatted text). Drive parse + merge through format_for_slack
    # by passing JSON as the draft with use_llm=False — that path does not
    # parse JSON. So merge via parse + format_for_slack hours table instead.
    text, llm_blocks = parse_formatter_payload(payload)
    assert llm_blocks
    from slack_format import _build_blocks
    from slack_blocks import blocks_from_tool_steps

    extra = blocks_from_tool_steps([_Step()])
    blocks = _build_blocks(text, [], extra_blocks=extra, llm_blocks=llm_blocks)
    types = [b["type"] for b in blocks]
    assert types[0] == "header"
    assert "table" in types
    assert types.index("header") < types.index("table")


def test_rewrite_urls_in_blocks():
    blocks = [
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "Virgo"},
                    "url": "https://bad.example/old",
                }
            ],
        }
    ]
    out = rewrite_urls_in_blocks(
        blocks,
        [{"url": "https://bad.example/old", "replacement": "https://search.lib.virginia.edu/x", "action": "replaced"}],
    )
    assert out[0]["elements"][0]["url"] == "https://search.lib.virginia.edu/x"


def test_image_card_coercion():
    blocks = sanitize_llm_blocks(
        [
            {
                "type": "card",
                "title": "Rotunda in snow",
                "hero_image": "https://iiif.lib.virginia.edu/iiif/example/full/400,/0/default.jpg",
                "actions": [
                    {
                        "text": "Virgo",
                        "url": "https://search.lib.virginia.edu/sources/uva_library/items/u1",
                    }
                ],
            }
        ]
    )
    assert blocks[0]["type"] == "card"
    assert blocks[0]["hero_image"]["image_url"].startswith("https://iiif.")
    assert blocks[0]["actions"][0]["type"] == "button"


def test_model_defaults_and_inference_config():
    assert DEFAULT_AGENT_MODEL_ID == "minimax.minimax-m2.5"
    assert DEFAULT_FORMAT_MODEL_ID == "google.gemma-4-31b"
    assert uses_bedrock_mantle("google.gemma-4-31b")
    assert not uses_bedrock_mantle("minimax.minimax-m2.5")
    cfg = inference_config_for_model("minimax.minimax-m2.5", max_tokens=2048)
    assert cfg["maxTokens"] == 2048
    assert cfg["temperature"] == 1.0
    assert cfg["topP"] == 0.95
    cfg2 = inference_config_for_model(
        "minimax.minimax-m2.5", max_tokens=2048, include_top_p=False
    )
    assert "topP" not in cfg2


def test_block_kit_schema_locks_allowlist():
    assert SLACK_BLOCK_KIT_SCHEMA["required"] == ["text", "blocks"]
    types = SLACK_BLOCK_KIT_SCHEMA["properties"]["blocks"]["items"]["properties"]["type"][
        "enum"
    ]
    assert "header" in types
    assert "carousel" in types
    assert "data_visualization" not in types


def test_minimax_reasoning_is_wrapped():
    from agent import _assistant_visible_text

    text = _assistant_visible_text(
        [
            {
                "reasoningContent": {
                    "reasoningText": {"text": "I should call get_library_hours"}
                }
            },
            {"text": "*Clemons* is open until 12:00 AM."},
        ]
    )
    assert "<thinking>" in text
    assert "get_library_hours" in text
    assert "Clemons" in text


def test_drops_invented_main_library_hours():
    blocks = sanitize_llm_blocks(
        [
            {"type": "header", "text": "Welcome to HooHelp— Library Hours & Locations"},
            {
                "type": "section",
                "fields": [
                    {"label": "Location", "value": "Main Library"},
                    {"label": "Hours", "value": "Mon-Fri 8am - 10pm, Sat 9am - 6pm, Sun Closed"},
                ],
            },
            {"type": "section", "text": "Need help with something specific?"},
        ]
    )
    cleaned = drop_unsourced_hours_blocks(blocks, hours_from_tools=False)
    types_text = json.dumps(cleaned)
    assert "Main Library" not in types_text
    assert "Mon-Fri" not in types_text
    assert any(b.get("type") == "section" for b in cleaned)


def test_greeting_skips_fake_hours_card():
    from slack_format import format_for_slack

    draft = (
        "Hi there! I'm Hoo Helper, your UVA Library assistant. "
        "I can help with library hours, Virgo, and images. What can I help with?"
    )
    text, blocks = format_for_slack(draft, use_llm=False)
    blob = json.dumps(blocks) + text
    assert "Main Library" not in blob
    assert "Mon-Fri" not in blob
    assert "Hoo Helper" in text or "Hoo Helper" in blob


def test_rejects_formatter_that_drops_capability_list():
    draft = (
        "Hi there! I'm Hoo Helper.\n\n"
        "I can help you with things like:\n\n"
        "• Library hours and locations (Clemons, Shannon, RMC)\n"
        "• Finding books in the Virgo catalog\n"
        "• Searching digital images and historic photos\n"
        "• Study room and equipment reservations\n"
        "• Walking directions between library buildings\n"
        "• Library events and workshops\n\n"
        "What can I help you with today?"
    )
    blocks = sanitize_llm_blocks(
        [
            {"type": "section", "text": "Hi there! I'm *Hoo Helper*"},
            {
                "type": "section",
                "text": "I'm the UVA Library's AI assistant in Slack. I can help you with things like:",
            },
            {"type": "section", "text": "What can I help you with today?"},
        ]
    )
    assert not formatter_preserves_draft(
        draft,
        "Hi! I'm Hoo Helper. I can help with hours, Virgo, images, reservations.",
        blocks,
    )


def test_rejects_truncated_block_json():
    """Gemma 31B posted 'I can help you with::{' as a block while text= was clean."""
    blocks = sanitize_llm_blocks(
        [
            {
                "type": "section",
                "text": "Hi! I'm Hoo Helper :wave:\nI'm the UVA Library's AI assistant in Slack. I can help you with::{",
            }
        ]
    )
    assert not formatter_output_usable(
        "Hi! I'm Hoo Helper, the UVA Library's AI assistant.",
        blocks,
    )
    from slack_format import format_for_slack

    draft = (
        "Hi there! Thanks for the update.\n\n"
        "I'm Hoo Helper, the UVA Library's AI assistant in Slack. I can help you with:\n"
        "* Library hours and locations\n"
        "* Finding books in Virgo"
    )
    text, out_blocks = format_for_slack(draft, use_llm=False)
    blob = text + json.dumps(out_blocks)
    assert "with::{" not in blob
    assert "Hoo Helper" in blob


def test_rejects_derailed_formatter_output():
    junk = (
        "Found 16 photos.\n"
        ":{:title:predicted_key:value:short:true}}]}}\n"
        "我不支持直接使用预测键。"
    )
    assert not formatter_output_usable(junk)
    from slack_format import format_for_slack

    text, blocks = format_for_slack(
        "Those are all the snow photos I have for that search. Try another query?",
        use_llm=False,
    )
    assert "Those are all" in text
    assert "predicted_key" not in text


def test_extract_formatter_tool_call():
    resp = {
        "choices": [
            {
                "message": {
                    "content": "",
                    "tool_calls": [
                        {
                            "id": "call_1",
                            "type": "function",
                            "function": {
                                "name": FORMATTER_TOOL_NAME,
                                "arguments": json.dumps(
                                    {
                                        "text": "Clemons is open.",
                                        "blocks": [
                                            {
                                                "type": "header",
                                                "text": "Clemons Library",
                                            }
                                        ],
                                    }
                                ),
                            },
                        }
                    ],
                }
            }
        ]
    }
    raw = extract_tool_arguments(resp, FORMATTER_TOOL_NAME)
    text, blocks = parse_formatter_payload(raw)
    assert "Clemons" in text
    assert blocks[0]["type"] == "header"
    assert extract_message_text(resp) == ""


def main():
    tests = [
        test_plain_mrkdwn_passthrough,
        test_json_header_section_and_button,
        test_fenced_json_and_string_table,
        test_drops_charts_and_interactive_buttons,
        test_hours_drops_llm_day_list,
        test_format_for_slack_merges_llm_blocks_with_hours,
        test_rewrite_urls_in_blocks,
        test_image_card_coercion,
        test_model_defaults_and_inference_config,
        test_block_kit_schema_locks_allowlist,
        test_minimax_reasoning_is_wrapped,
        test_drops_invented_main_library_hours,
        test_greeting_skips_fake_hours_card,
        test_rejects_formatter_that_drops_capability_list,
        test_rejects_truncated_block_json,
        test_rejects_derailed_formatter_output,
        test_extract_formatter_tool_call,
    ]
    for fn in tests:
        fn()
        print(f"ok  {fn.__name__}")
    print(f"\n{len(tests)} tests passed")


if __name__ == "__main__":
    main()
