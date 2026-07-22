"""Unit tests for temporary camera quirks (no DB required)."""

from datetime import date, datetime, timezone

import pandas as pd

import camera_quirks as cq


def _sample_mapping():
    """Minimal cameras-table style mapping before overrides."""
    return {
        "Clemons": ["B8A44F59727B", "ACCC8EF00E27"],
        "Shannon": [
            "b8:a4:4f:5d:31:54",  # B8A44F5D3154 — override → Clemons (always; not FA swap)
            "b8:a4:4f:5d:59:90",  # B8A44F5D5990 — Clemons @ 172.29.3.57 pre-swap; FA post-swap
            "b8:a4:4f:5d:59:9e",  # direction invert
        ],
        "Fine Arts": ["B8A44F4F195D"],  # @ 172.29.8.29 pre-swap; @ 172.29.3.57 / Clemons post-swap
    }


def test_location_override_moves_connectors_to_clemons():
    mapping = cq.apply_location_overrides(_sample_mapping())
    assert "b8:a4:4f:5d:31:54" in mapping["Clemons"]
    assert "b8:a4:4f:5d:59:90" in mapping["Clemons"]
    assert "b8:a4:4f:5d:31:54" not in mapping.get("Shannon", [])
    assert "b8:a4:4f:5d:59:90" not in mapping.get("Shannon", [])
    assert "B8A44F59727B" in mapping["Clemons"]


def test_direction_inversion_swaps_in_out():
    df = pd.DataFrame(
        [
            {"serial_no": "b8:a4:4f:5d:59:9e", "count_in": 10, "count_out": 3},
            {"serial_no": "b8:a4:4f:5d:59:90", "count_in": 5, "count_out": 1},
        ]
    )
    out = cq.apply_direction_inversions(df)
    inv = out[out["serial_no"] == "b8:a4:4f:5d:59:9e"].iloc[0]
    other = out[out["serial_no"] == "b8:a4:4f:5d:59:90"].iloc[0]
    assert inv["count_in"] == 3 and inv["count_out"] == 10
    assert other["count_in"] == 5 and other["count_out"] == 1


def test_effective_location_pre_and_post_swap():
    mapping = cq.apply_location_overrides(_sample_mapping())

    pre = date(2026, 6, 16)
    post = date(2026, 6, 17)

    # Pre-swap: FA serial at Fine Arts; 59:90 (B8A44F5D5990) at Clemons (172.29.3.57)
    assert cq.effective_location_for_serial("B8A44F4F195D", pre, mapping) == "Fine Arts"
    assert cq.effective_location_for_serial("b8:a4:4f:5d:59:90", pre, mapping) == "Clemons"

    # Post-swap: FA MAC B8A44F4F195D is now at 172.29.3.57 / Clemons; 59:90 is Fine Arts
    assert cq.effective_location_for_serial("B8A44F4F195D", post, mapping) == "Clemons"
    assert cq.effective_location_for_serial("b8:a4:4f:5d:59:90", post, mapping) == "Fine Arts"

    # 31:54 (B8A44F5D3154) was never the FA swap partner — static Clemons only
    assert cq.effective_location_for_serial("b8:a4:4f:5d:31:54", pre, mapping) == "Clemons"
    assert cq.effective_location_for_serial("b8:a4:4f:5d:31:54", post, mapping) == "Clemons"
    assert cq._swap_partner("b8:a4:4f:5d:31:54") is None
    assert cq._swap_partner("B8A44F5D3154") is None


def test_serials_for_library_includes_swap_partner_post_range():
    mapping = cq.apply_location_overrides(_sample_mapping())

    # Pre-swap-only range: Fine Arts only needs its base serial
    pre_serials = cq.serials_for_library(
        "Fine Arts", mapping, start=date(2026, 6, 1), end=date(2026, 6, 16)
    )
    assert pre_serials == ["B8A44F4F195D"]

    # Range touching post-swap: Fine Arts also needs 59:90 (now at FA)
    post_serials = cq.serials_for_library(
        "Fine Arts", mapping, start=date(2026, 6, 1), end=date(2026, 6, 30)
    )
    assert "B8A44F4F195D" in post_serials
    assert "b8:a4:4f:5d:59:90" in post_serials

    # Clemons post-swap needs the former FA serial
    clemons_post = cq.serials_for_library(
        "Clemons", mapping, start=date(2026, 6, 20), end=date(2026, 6, 30)
    )
    assert "B8A44F4F195D" in clemons_post
    assert "b8:a4:4f:5d:59:90" in clemons_post  # base Clemons serial still fetched

    # Shannon is not involved in this swap pair
    shannon_post = cq.serials_for_library(
        "Shannon", mapping, start=date(2026, 6, 20), end=date(2026, 6, 30)
    )
    assert "B8A44F4F195D" not in shannon_post
    assert "b8:a4:4f:5d:59:90" not in shannon_post


def test_filter_metrics_for_library_by_date():
    mapping = cq.apply_location_overrides(_sample_mapping())
    df = pd.DataFrame(
        [
            {
                "serial_no": "B8A44F4F195D",
                "count_in": 1,
                "count_out": 0,
                "created_at": datetime(2026, 6, 10, 15, 0, tzinfo=timezone.utc),
            },
            {
                "serial_no": "B8A44F4F195D",
                "count_in": 2,
                "count_out": 0,
                "created_at": datetime(2026, 6, 20, 15, 0, tzinfo=timezone.utc),
            },
            {
                "serial_no": "b8:a4:4f:5d:59:90",
                "count_in": 3,
                "count_out": 0,
                "created_at": datetime(2026, 6, 20, 15, 0, tzinfo=timezone.utc),
            },
            {
                "serial_no": "b8:a4:4f:5d:59:90",
                "count_in": 4,
                "count_out": 0,
                "created_at": datetime(2026, 6, 10, 15, 0, tzinfo=timezone.utc),
            },
        ]
    )

    fal = cq.filter_metrics_for_library(df, "Fine Arts", mapping)
    # pre-swap 195D + post-swap 59:90
    assert set(fal["count_in"]) == {1, 3}

    clemons = cq.filter_metrics_for_library(df, "Clemons", mapping)
    # post-swap 195D + pre-swap 59:90
    assert set(clemons["count_in"]) == {2, 4}

    shannon = cq.filter_metrics_for_library(df, "Shannon", mapping)
    assert shannon.empty


if __name__ == "__main__":
    test_location_override_moves_connectors_to_clemons()
    test_direction_inversion_swaps_in_out()
    test_effective_location_pre_and_post_swap()
    test_serials_for_library_includes_swap_partner_post_range()
    test_filter_metrics_for_library_by_date()
    print("All camera_quirks tests passed.")
