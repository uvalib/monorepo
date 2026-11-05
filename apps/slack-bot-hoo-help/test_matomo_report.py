import datetime
import os
import sys

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from matomo_report import (  # noqa: E402
    AUTOMATED_MIN_ACTIONS, AUTOMATED_MIN_SECONDS, AUTOMATED_SEGMENT,
    VIRGO_SITE_ID, resolve_period, resolve_site,
)

D = datetime.date
TODAY = D(2026, 11, 5)

SITES = [
    {"idsite": i, "name": n, "main_url": u} for i, n, u in [
        (1, "Virgo 3", "http://search.lib.virginia.edu"),
        (2, "Explore", "http://explore.lib.virginia.edu"),
        (3, "Library Cluster", "http://www.lib.virginia.edu"),
        (5, "Research Guides", "http://guides.lib.virginia.edu"),
        (10, "Library CMS", "http://www.library.virginia.edu"),
        (13, "Mobile", "http://m.library.virginia.edu"),
        (22, "Faculty Newsletter", "http://facultynews.library.virginia.edu"),
        (23, "Test UX", "http://wwwstatic.lib.virginia.edu"),
        (25, "The Taper", "http://thetaper.library.virginia.edu"),
        (26, "Staff newsletter", "http://staffnews.staffweb.lib.virginia.edu"),
        (31, "100 Objects", "http://100objects.lib.virginia.edu"),
        (39, "Virgo 4-prod", "https://v4.lib.virginia.edu"),
        (40, "Virgo Lite", "https://virgo-lite.lib.virginia.edu"),
        (41, "Tedium Reducer III", "https://fillholdreader.internal.lib.virginia.edu"),
        (42, "Avalon", "https://avalon.lib.virginia.edu"),
        (58, "Modern Library", "https://mlbib.library.virginia.edu"),
        (59, "BOV Minutes", "https://bov.library.virginia.edu"),
    ]
]


def test_constants():
    assert VIRGO_SITE_ID == 39
    assert AUTOMATED_MIN_SECONDS == 3600
    assert AUTOMATED_MIN_ACTIONS == 1000
    assert AUTOMATED_SEGMENT == "visitDuration>=3600;actions>=1000"


@pytest.mark.parametrize("fy", ["FY26", "2026", "FY 26", "fy26"])
def test_fiscal_year(fy):
    p = resolve_period(fiscal_year=fy, today=TODAY)
    assert (p.start, p.end) == (D(2025, 7, 1), D(2026, 6, 30))
    assert p.period == "range" and not p.capped
    assert p.date == "2025-07-01,2026-06-30"
    assert p.label == "2025-07-01 to 2026-06-30"


def test_fiscal_year_so_far_capped():
    p = resolve_period(fiscal_year="FY27", today=TODAY)
    assert p.end == D(2026, 11, 4) and p.capped
    assert p.label.endswith("2026-11-04")


def test_whole_month_and_year():
    p = resolve_period("2026-10-01", "2026-10-31", today=TODAY)
    assert (p.period, p.date) == ("month", "2026-10-01")
    p = resolve_period("2025-01-01", "2025-12-31", today=TODAY)
    assert (p.period, p.date) == ("year", "2025-01-01")
    p = resolve_period("2026-10-03", "2026-10-20", today=TODAY)
    assert (p.period, p.date) == ("range", "2026-10-03,2026-10-20")


def test_end_capped_at_yesterday():
    p = resolve_period("2026-11-01", "2026-12-31", today=TODAY)
    assert p.end == D(2026, 11, 4) and p.capped and p.period == "range"


def test_bad_dates():
    with pytest.raises(ValueError, match="before"):
        resolve_period("2026-10-20", "2026-10-03", today=TODAY)
    with pytest.raises(ValueError):
        resolve_period("2026-13-01", "2026-13-02", today=TODAY)
    with pytest.raises(ValueError):
        resolve_period("2026-10-01", "2026-10-31", fiscal_year="FY26", today=TODAY)
    with pytest.raises(ValueError, match="dates or a fiscal year"):
        resolve_period(today=TODAY)
    with pytest.raises(ValueError):
        resolve_period(fiscal_year="banana", today=TODAY)
    with pytest.raises(ValueError):
        resolve_period("2026-12-01", "2026-12-31", today=TODAY)


@pytest.mark.parametrize("q,expected", [
    ("39", 39), ("Virgo", 39), ("virgo 4-prod", 39),
    ("search.lib.virginia.edu", 39), ("https://search.lib.virginia.edu/", 39),
    ("guides", 5), ("www.library.virginia.edu", 10),
    ("Library website", 10), ("Tedium", 41), ("Virgo Lite", 40),
    ("1", 1),
])
def test_resolve_site_loose_names(q, expected):
    assert resolve_site(SITES, q)["idsite"] == expected


def test_resolve_site_errors():
    with pytest.raises(ValueError, match="39 Virgo 4-prod"):
        resolve_site(SITES, "nope")
    with pytest.raises(ValueError, match="Unknown site"):
        resolve_site(SITES, "999")
    with pytest.raises(ValueError, match="newsletter"):
        resolve_site(SITES, "newsletter")  # two sites match: listed, not guessed


def test_capped_partial_month():
    p = resolve_period("2026-11-01", "2026-11-30", today=TODAY)
    assert p.period == "range" and p.end == D(2026, 11, 4) and p.capped
    assert p.date == "2026-11-01,2026-11-04"


def test_start_only_means_to_yesterday():
    p = resolve_period("2026-10-01", today=TODAY)
    assert p.start == D(2026, 10, 1) and p.end == D(2026, 11, 4) and p.capped
    assert p.period == "range"


def test_end_without_start_errors():
    with pytest.raises(ValueError):
        resolve_period(end_date="2026-10-31", today=TODAY)


@pytest.mark.parametrize("q", ["100", "4", "7"])
def test_digit_query_is_id_only(q):
    with pytest.raises(ValueError, match="Unknown site"):
        resolve_site(SITES, q)
