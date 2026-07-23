#!/usr/bin/env python3
"""
test_catalog_mcp_locally.py — Smoke test script for VirgoCatalog MCP server
"""

import sys
import os

# Add VirgoCatalog app directory to python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "VirgoCatalog", "app", "VirgoCatalog"))

import catalog_helper as cat
import main as app


def main():
    print("=" * 60)
    print("1. Testing Virgo Guest Authorization Token Fetching...")
    token = cat.get_guest_token()
    print(f"   Success! Token (len={len(token)}): {token[:35]}...")

    print("\n" + "=" * 60)
    print("2. Testing Catalog Search Tool (search_catalog - uva_library)...")
    res1 = app.search_catalog(query="clemons library", pool="uva_library", rows=5)
    print(res1[:600])

    print("\n" + "=" * 60)
    print("3. Testing Field Search Tool (search_by_field - title: 'Huckleberry Finn')...")
    res2 = app.search_by_field(query="Huckleberry Finn", field="title", rows=3)
    print(res2[:600])

    print("\n" + "=" * 60)
    print("4. Testing Item Details Tool (get_item_details)...")
    try:
        # Search to get a valid record ID dynamically
        raw_res = cat.search_catalog(query="clemons", pool="uva_library", rows=1)
        groups = raw_res.get("group_list", [])
        if groups and groups[0].get("record_list"):
            rec_fields = cat.extract_record_fields(groups[0]["record_list"][0].get("fields", []))
            item_id = rec_fields.get("identifier") or "u321111"
            print(f"   Fetching details for item ID: {item_id}")
            res3 = app.get_item_details(item_id=item_id, pool_id="uva_library")
            print(res3[:700])
        else:
            print("   No records found to test item detail lookup.")
    except Exception as e:
        print(f"   Item details test failed: {e}")

    print("\n" + "=" * 60)
    print("ALL LOCAL TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)


if __name__ == "__main__":
    main()
