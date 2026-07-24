#!/usr/bin/env python3
"""
test_kb_mcp_locally.py — Local smoke test for BedrockKB MCP server tools
"""

import sys
import os

# Add BedrockKB app directory to python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "BedrockKB", "app", "BedrockKB"))

import main as app


def main():
    print("=" * 60)
    print("1. Testing search_uvalib_web (N2B734PGWU)...")
    res1 = app.search_uvalib_web(query="special collections borrowing policy", max_results=2)
    print(res1[:600])

    print("\n" + "=" * 60)
    print("2. Testing search_virgo_image_suggestions (J34YBBVTGA)...")
    res2 = app.search_virgo_image_suggestions(query="rotunda drawings", max_results=2)
    print(res2[:600])

    print("\n" + "=" * 60)
    print("3. Testing search_virgo_item_suggestions (UMMEKLDTPR)...")
    res3 = app.search_virgo_item_suggestions(query="civil war memoirs", max_results=2)
    print(res3[:600])

    print("\n" + "=" * 60)
    print("4. Testing search_virgo_suggestions (ANITQDQQXN - author suggestions)...")
    res4 = app.search_virgo_suggestions(query="Faulkner", max_results=2)
    print(res4[:600])

    print("\n" + "=" * 60)
    print("5. Testing BedrockKB MCP Prompt Templates...")
    import asyncio
    prompts = asyncio.run(app.mcp.list_prompts())
    prompt_names = [p.name for p in prompts]
    print(f"   Discovered prompt templates ({len(prompts)}): {prompt_names}")
    assert "library_policy_faq_template" in prompt_names, "library_policy_faq_template missing"
    assert "visual_and_author_discovery_template" in prompt_names, "visual_and_author_discovery_template missing"

    res_prompt = asyncio.run(app.mcp.get_prompt("library_policy_faq_template", {"query": "interlibrary loan"}))
    assert res_prompt and res_prompt.messages, "get_prompt returned empty result"
    print("   Successfully generated library_policy_faq_template prompt!")

    print("\n" + "=" * 60)
    print("ALL LOCAL KB SMOKE TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)


if __name__ == "__main__":
    main()

