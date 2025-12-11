import pandas as pd
import numpy as np
from datetime import datetime, timedelta, timezone, time
import os
from dotenv import load_dotenv
import argparse
from zoneinfo import ZoneInfo
from hours import fetch_hours, parse_time, get_day_open_times

NY_TZ = ZoneInfo('America/New_York')

# Load environment variables
load_dotenv()

# Get SERIAL_NO from env
serial_input = os.getenv('SERIAL_NO', '')
serial_nos = [s.strip() for s in serial_input.split(',') if s.strip()]

# Parse command-line arguments
parser = argparse.ArgumentParser(description='Add occupancy to counts.')
parser.add_argument('--debug', action='store_true', help='Enable debug mode to print log lines.')
parser.add_argument('--test', action='store_true', help='Process only the last week of data and output to test file.')
args = parser.parse_args()

if args.debug:
    pd.set_option('display.max_rows', None)

# Load the TSV file
file_path = "./counts-test.tsv" if args.test else "./counts.tsv"
df = pd.read_csv(file_path, sep='\t')

if serial_nos:
    df = df[df['serial_no'].isin(serial_nos)]

# Convert created_at to datetime with UTC and compute helper columns
df['created_at'] = pd.to_datetime(df['created_at'], utc=True)
df['created_at_nyc'] = df['created_at'].dt.tz_convert(NY_TZ)
df['minute_time'] = df['created_at'].dt.floor('min')

if df.empty:
    raise ValueError("No data available after filtering by SERIAL_NO.")


def merge_windows(windows):
    if not windows:
        return []
    windows = sorted(windows, key=lambda x: x[0])
    merged = [list(windows[0])]
    for start, end in windows[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return [(start, end) for start, end in merged]

# Compute per-device deltas, accounting for counter resets
df = df.sort_values(['serial_no', 'minute_time'])

def compute_reset_delta(series: pd.Series) -> pd.Series:
    diff = series.diff()
    delta = diff.where(diff >= 0, series)
    delta.iloc[0] = series.iloc[0]
    return delta.fillna(series.iloc[0])

df['delta_in'] = df.groupby('serial_no')['count_in'].transform(compute_reset_delta)
df['delta_out'] = df.groupby('serial_no')['count_out'].transform(compute_reset_delta)

# Aggregate building-level deltas per minute
building_df = df.groupby('minute_time').agg({
    'delta_in': 'sum',
    'delta_out': 'sum'
}).reset_index().rename(columns={'minute_time': 'created_at_utc'})

# Attach localized timestamps for filtering and scheduling
building_df['created_at_nyc'] = building_df['created_at_utc'].dt.tz_convert(NY_TZ)
building_df['date'] = building_df['created_at_nyc'].dt.date
building_df['time'] = building_df['created_at_nyc'].dt.time

# Determine reporting window
start_date = building_df['date'].min()
end_date = building_df['date'].max()

if building_df.empty:
    raise ValueError("No building data available for the selected date range.")

start_date = building_df['date'].min()
end_date = building_df['date'].max()

building_df = building_df.sort_values('created_at_utc').reset_index(drop=True)

# Compute reset times (1 hour before opening) in NYC timezone
reset_times_nyc = []
buffer_windows_utc = []
current_day = start_date
while current_day <= end_date:
    day_info = get_day_open_times(current_day.isoformat())
    open_times = day_info['open_times']
    if day_info['opened'] == 'Yes' and open_times != "Closed":
        first_period = open_times.split(', ')[0]
        first_start_str = first_period.split('-')[0]
        first_start_time = parse_time(first_start_str)
        reset_dt = datetime.combine(current_day, first_start_time, tzinfo=NY_TZ) - timedelta(hours=1)
        reset_dt = reset_dt.replace(second=0, microsecond=0)
        reset_times_nyc.append(reset_dt)

    if open_times != "Closed":
        periods = open_times.split(', ')
        for period in periods:
            if not period:
                continue
            start_str, end_str = period.split('-')
            start_time = parse_time(start_str)
            if end_str == "24:00":
                end_dt_local = datetime.combine(current_day + timedelta(days=1), time(0, 0), tzinfo=NY_TZ)
            else:
                end_time = parse_time(end_str)
                end_dt_local = datetime.combine(current_day, end_time, tzinfo=NY_TZ)
            start_dt_local = datetime.combine(current_day, start_time, tzinfo=NY_TZ)
            buffer_start = (start_dt_local - timedelta(hours=1)).astimezone(timezone.utc)
            buffer_end = (end_dt_local + timedelta(hours=1)).astimezone(timezone.utc)
            buffer_windows_utc.append((buffer_start, buffer_end))
    current_day += timedelta(days=1)

buffer_windows_utc = merge_windows(buffer_windows_utc)

# Ensure at least one reset anchor
if not reset_times_nyc:
    reset_times_nyc.append(building_df['created_at_nyc'].min().replace(second=0, microsecond=0))

reset_times_nyc = sorted(set(reset_times_nyc))
reset_times_utc = [rt.astimezone(timezone.utc) for rt in reset_times_nyc]

# Insert zero rows at reset times to anchor segments
building_df = building_df.set_index('created_at_utc')
max_existing_timestamp = building_df.index.max()
for rt_utc in reset_times_utc:
    if rt_utc <= max_existing_timestamp and rt_utc not in building_df.index:
        building_df.loc[rt_utc] = {'delta_in': 0, 'delta_out': 0, 'created_at_nyc': rt_utc.astimezone(NY_TZ), 'date': rt_utc.astimezone(NY_TZ).date(), 'time': rt_utc.astimezone(NY_TZ).time()}

building_df = building_df.sort_index().reset_index()
building_df['created_at_nyc'] = building_df['created_at_utc'].dt.tz_convert(NY_TZ)
building_df['date'] = building_df['created_at_nyc'].dt.date
building_df['time'] = building_df['created_at_nyc'].dt.time

# Assign segments based on latest reset time
reset_index = pd.DatetimeIndex(reset_times_nyc)
created_at_index = pd.DatetimeIndex(building_df['created_at_nyc'])
segment_positions = reset_index.searchsorted(created_at_index, side='right') - 1
segment_positions = np.clip(segment_positions, 0, len(reset_index) - 1)
building_df['segment'] = reset_index.take(segment_positions)

# Compute cumulative counts per segment starting at zero
segment_groups = building_df.groupby('segment')
building_df['count_in'] = segment_groups['delta_in'].cumsum()
building_df['count_out'] = segment_groups['delta_out'].cumsum()

building_df['count_in'] -= segment_groups['count_in'].transform('first')
building_df['count_out'] -= segment_groups['count_out'].transform('first')

building_df['occupancy'] = building_df['count_in'] - building_df['count_out']

# Prevent negative occupancy within each segment
building_df['occupancy'] = building_df.groupby('segment')['occupancy'].transform(lambda s: s.clip(lower=0))

if buffer_windows_utc:
    created_utc = building_df['created_at_utc'].to_numpy()
    window_masks = [(created_utc >= start) & (created_utc <= end) for start, end in buffer_windows_utc]
    if len(window_masks) == 1:
        inside_window = window_masks[0]
    else:
        inside_window = np.column_stack(window_masks).any(axis=1)
    inside_window = pd.Series(inside_window, index=building_df.index)
    building_df.loc[~inside_window, ['delta_in', 'delta_out', 'count_in', 'count_out', 'occupancy']] = 0

# Round numeric columns to integers for cleaner output
for col in ['delta_in', 'delta_out', 'count_in', 'count_out', 'occupancy']:
    building_df[col] = building_df[col].round().astype(int)

# If debug, print the data
if args.debug:
    print("Debug building data:")
    print(building_df[['created_at_utc', 'created_at_nyc', 'count_in', 'count_out', 'occupancy']])
    print("\n")

# Select columns for output using NYC-local timestamps
output_df = building_df[['created_at_nyc', 'count_in', 'count_out', 'occupancy']].rename(columns={'created_at_nyc': 'created_at'})

# Save to new TSV
output_path = "./counts_with_occupancy.tsv"
if args.test:
    output_path = "./counts_with_occupancy_test.tsv"
output_df.to_csv(output_path, sep='\t', index=False)
print(f"Saved to {output_path}")