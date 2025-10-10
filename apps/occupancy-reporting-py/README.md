# Occupancy Reporting Tools

Utilities for transforming raw door-counter metrics into actionable occupancy summaries for the building operations team.

## Overview

1. Export raw counts (`getCounts.sh`).
2. Enrich the counts with minute-level occupancy (`process-occupancy.py`).
3. Explore trends and coverage with interactive summaries (`report.py`).

Supporting modules (for example `hours.py`) look up building hours so automated resets and reporting windows align with when the building is actually open.

## Requirements

- Python 3.11+
- `pip install -r requirements.txt` (pandas, numpy, python-dotenv, requests)
- Optional: `mysql` CLI for running `getCounts.sh`
- Environment variable `SERIAL_NO` (comma-separated) to restrict processing to specific sensors; leave blank to include all.

Create a `.env` file in this directory to store secrets safely:

```bash
SERIAL_NO=abc123,def456
```

## Key Files

| File | Purpose |
| --- | --- |
| `.env`, `.env.limited` | Sample environment files listing `SERIAL_NO` filters used during processing and reporting. |
| `counts.tsv`, `counts-test.tsv` | Raw export from the door counter system (full dataset and recent 30-day slice). |
| `counts_with_occupancy.tsv`, `counts_with_occupancy_test.tsv` | Output from `process-occupancy.py` that layers occupancy onto the raw counts. |
| `getCounts.sh` | Convenience script that runs the MySQL export for production and 30-day test datasets. |
| `hours.py` | Fetches building hours from LibCal and exposes helpers to reason about open/closed windows. |
| `process-occupancy.py` | Converts raw counts into consistent in/out deltas, injects daily resets, zeroes activity outside open buffers, and emits the enriched TSV. |
| `report.py` | Command-line report that filters by date/time, restricts to open hours, and prints totals, coverage, peaks, and distributions. |
| `testhours.py` | Developer sandbox for validating the `hours.py` helpers. |

## Typical Workflow

1. **Download counts**

   ```bash
   ./getCounts.sh
   ```

   The script writes CSVs to `~/Downloads`. Convert to TSV if needed before running the Python scripts.

2. **Process occupancy**

   ```bash
   python process-occupancy.py
   ```

   Pass `--test` to read `counts-test.tsv` and write `counts_with_occupancy_test.tsv`.

3. **Generate a report**

   ```bash
   python report.py
   ```

   The script will prompt for start/end dates and times. Use `--test` to read the test occupancy file, `--daily` for per-day/hour detail, and `--debug` to inspect filtered rows.

## Notes

- `process-occupancy.py` uses LibCal hours to anchor zeroed segments an hour before opening and silence activity outside a one-hour buffer on either side of published open intervals.
- Reports only consider minutes when the building is open according to LibCal (with the same buffer), ensuring totals align with staffed hours.
- Keep local copies of the TSVs out of version control—`.gitignore` excludes them by default.
