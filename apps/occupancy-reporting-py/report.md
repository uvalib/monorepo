# Report Output Reference

Use this guide while interpreting the CLI output from `report.py`. Each section of the report is derived from the LibCal-adjusted occupancy data produced by `process-occupancy.py`.

## Running the report

```bash
python report.py [--test] [--daily] [--debug]
```

The script prompts for:

- **Start/End Dates (YYYY-MM-DD)** – inclusive bounds for days to sample.
- **Start Time / End Time (HH:MM)** – UTC-converted minutes must fall inside this window. `24:00` on the prompt is treated as the trailing edge of the day.

Optional flags:

- `--test` reads `counts_with_occupancy_test.tsv` instead of the full dataset.
- `--daily` prints per-day totals plus every day/hour segment before the summary blocks.
- `--debug` echoes rows that were excluded because the building was closed, along with per-hour deltas.

All calculations discard minutes when the building is closed. Building hours are fetched from LibCal and expanded with a small buffer (15 minutes before / 30 minutes after) to capture arrival and exit spikes.

## Summary blocks

Each heading in the standard output means:

### Total for building over the period

- **in / out** – Sum of people entering and exiting during the filtered window.
- **combined** – Shortcut for `in + out`, representing total traffic across the door counters.

### Average daily

- **in / out / combined** – Mean daily totals for `delta_in` and `delta_out`. Helpful for comparing days regardless of how many were included.
- **avg occupancy** – Mean of the average occupancy observed for each day (the typical number of people present at any instant on that day). This is *not* total patrons per day; use the `in` counts for that.

### Coverage summary

- **Open days included** – Number of building-open days that contributed data vs. total calendar days in the requested range.
- **Unique open hours sampled** – Count of day/hour combinations captured after filtering. Low numbers hint at sparse coverage.

### Daily distribution

- **Median daily in/out** – Middle (50th percentile) daily traffic counts, robust against single extreme days.
- **Median daily avg occupancy** – Typical average occupancy level for a day in the window.
- **Avg in/out per open hour** – Traffic volumes normalized by the number of hours the building was open. Great for comparing windows of different lengths.
- **95th percentile occupancy across open minutes** – Occupancy threshold exceeded only 5% of the time, useful for capacity planning.

### Peak day

- Highlights the day with the highest combined traffic (`in + out`). Provides `in`, `out`, and the day’s average occupancy to contextualize whether the spike came from arrivals, departures, or sustained occupancy.

### Peak hour (single day/hour segment)

- Shows the most active one-hour slice (within a specific day) based on combined traffic, with the hour’s average occupancy included.

### Average hourly

- Aggregates each hour-of-day across all included days. For every hour you’ll see:
  - **in / out** – Average arrivals and departures during that hour on days when it was observed.
  - **avg occupancy** – Mean occupancy during that hour, averaged across contributing days.

### Average occupancy over the period

- Straight mean of every minute’s occupancy after filtering. Use it to gauge the overall fullness of the space within the requested window.

## Tips for analysis

- To reason about daily totals, combine `Average daily in/out` with `Median daily in/out` to understand typical vs. mean traffic.
- Compare `Peak day` with the 95th percentile occupancy to see whether spikes are sustained or short-lived.
- Use `Average hourly` to align staffing or programming with periods of peak demand.
- Pair the coverage metrics with the requested range to ensure you’re not drawing conclusions from partial data.
