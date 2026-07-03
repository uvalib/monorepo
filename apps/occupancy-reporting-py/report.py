import pandas as pd
from datetime import datetime, timedelta, time
import os
import sys
from dotenv import load_dotenv
import argparse
from hours import get_hours, is_open

# Load environment variables
load_dotenv()

# Get SERIAL_NO from env
serial_input = os.getenv('SERIAL_NO', '')
serial_nos = [s.strip() for s in serial_input.split(',') if s.strip()]

# Parse command-line arguments
parser = argparse.ArgumentParser(description='Process occupancy counts.')
parser.add_argument('--debug', action='store_true', help='Enable debug mode to print log lines.')
parser.add_argument('--daily', action='store_true', help='Enable printing daily and hourly details.')
parser.add_argument('--csvDump', action='store_true', help='Output a CSV of in/out counts with estimated occupancy for each day/hour instead of creating a report.')
parser.add_argument('--test', action='store_true', help='Use test occupancy data file instead of production.')
args = parser.parse_args()

if args.debug:
    pd.set_option('display.max_rows', None)

# Ask user for inputs
start_date_str = input("Enter start date (YYYY-MM-DD): ")
end_date_str = input("Enter end date (YYYY-MM-DD): ")
start_time_str = input("Enter start time (HH:MM): ")
end_time_str = input("Enter end time (HH:MM): ")

# Parse dates and times
start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
start_time = datetime.strptime(start_time_str, "%H:%M").time()
if end_time_str == "24:00":
    end_time = datetime.strptime("23:59", "%H:%M").time()
    end_exclusive = False
else:
    end_time = datetime.strptime(end_time_str, "%H:%M").time()
    end_exclusive = end_time.minute == 0 and end_time.second == 0 and end_time.microsecond == 0

# Get open hours
open_intervals = get_hours(start_date_str, end_date_str)

# Load the TSV file
file_path = 'counts_with_occupancy_test.tsv' if args.test else 'counts_with_occupancy.tsv'
df = pd.read_csv(file_path, sep='\t')

# Filter by serial number if provided
if serial_nos:
    if 'serial_no' in df.columns:
        df = df[df['serial_no'].astype(str).isin(serial_nos)]
    else:
        print(f"Warning: SERIAL_NO filter {serial_nos} provided but 'serial_no' column missing in dataset.")

for col in ['adjustment_in', 'adjustment_out', 'suppressed_in', 'suppressed_out', 'reset_flag_in', 'reset_flag_out']:
    if col not in df.columns:
        df[col] = 0

if 'outside_buffer' not in df.columns:
    df['outside_buffer'] = False

if 'segment_anchor' not in df.columns:
    df['segment_anchor'] = False

# Convert created_at to datetime with UTC
df['created_at'] = pd.to_datetime(df['created_at'], utc=True)

# Convert to NYC timezone
df['created_at_nyc'] = df['created_at'].dt.tz_convert('America/New_York')

# Extract NYC date and time
df['date'] = df['created_at_nyc'].dt.date
df['time'] = df['created_at_nyc'].dt.time
df['hour'] = df['created_at_nyc'].dt.hour

# Filter by date range (NYC)
df = df[(df['date'] >= start_date) & (df['date'] <= end_date)]

# Filter by time range (NYC)
df = df[df['time'] >= start_time]
if end_exclusive:
    df = df[df['time'] < end_time]
else:
    df = df[df['time'] <= end_time]

def time_in_window(local_time: time) -> bool:
    if start_time <= end_time or (start_time == end_time and not end_exclusive):
        if end_exclusive:
            return start_time <= local_time < end_time
        return start_time <= local_time <= end_time
    else:
        if end_exclusive:
            return local_time >= start_time or local_time < end_time
        return local_time >= start_time or local_time <= end_time

expected_open_minutes = 0
current_date = start_date
while current_date <= end_date:
    for minute_index in range(24 * 60):
        local_time_candidate = time(minute_index // 60, minute_index % 60)
        if not time_in_window(local_time_candidate):
            continue
        if is_open(current_date, local_time_candidate, open_intervals):
            expected_open_minutes += 1
    current_date += timedelta(days=1)

# Sort the dataframe
df = df.sort_values('created_at_nyc')

# Compute deltas within each day to avoid cross-day resets
df['delta_in'] = df.groupby('date')['count_in'].diff().fillna(0)
df['delta_out'] = df.groupby('date')['count_out'].diff().fillna(0)

# Handle counter resets and negative diffs by falling back to the current count
neg_in_mask = df['delta_in'] < 0
neg_out_mask = df['delta_out'] < 0
df.loc[neg_in_mask, 'delta_in'] = df.loc[neg_in_mask, 'count_in']
df.loc[neg_out_mask, 'delta_out'] = df.loc[neg_out_mask, 'count_out']

# Compute is_open
if df.empty:
    df['is_open'] = pd.Series(dtype=bool)
else:
    df['is_open'] = df.apply(lambda row: is_open(row['date'], row['time'], open_intervals), axis=1)

observed_open_minutes = int(df['is_open'].sum())
off_hours_mask = ~df['is_open']
off_hours_in = df.loc[off_hours_mask, 'suppressed_in'].sum()
off_hours_out = df.loc[off_hours_mask, 'suppressed_out'].sum()
off_hours_minutes = int((off_hours_mask & df['outside_buffer']).sum())

# If debug, list skipped
if args.debug:
    skipped = df[~df['is_open']].copy()
    if not skipped.empty:
        print("Skipped due to closed hours:")
        unique_date_hours = skipped[['date', 'hour']].drop_duplicates().sort_values(['date', 'hour'])
        for _, row in unique_date_hours.iterrows():
            dt = row['date']
            hr = row['hour']
            group = skipped[(skipped['date'] == dt) & (skipped['hour'] == hr)]
            skipped_in = group['delta_in'].sum()
            skipped_out = group['delta_out'].sum()
            if skipped_in > 0 or skipped_out > 0:
                print(f"{dt} hour {int(hr):02d}: in {skipped_in}, out {skipped_out}")
        total_skipped_in = skipped['delta_in'].sum()
        total_skipped_out = skipped['delta_out'].sum()
        print(f"Total skipped: in {total_skipped_in}, out {total_skipped_out}")

# Filter to open hours
df = df[df['is_open']]

# Drop is_open
df = df.drop('is_open', axis=1)

# If debug, print the groups
if args.debug:
    print("Debug building data:")
    print(df[['created_at_nyc', 'delta_in', 'delta_out', 'occupancy']])
    print("\n")

# Compute daily totals
daily_totals = df.groupby('date').agg({'delta_in': 'sum', 'delta_out': 'sum', 'occupancy': 'mean'}).reset_index()
daily_totals['combined'] = daily_totals['delta_in'] + daily_totals['delta_out']

# Compute hourly totals per day
hourly_per_day = df.groupby(['date', 'hour']).agg({'delta_in': 'sum', 'delta_out': 'sum', 'occupancy': 'mean'}).reset_index()
hourly_per_day['combined'] = hourly_per_day['delta_in'] + hourly_per_day['delta_out']

if args.csvDump:
    print("date,hour,in,out,occupancy")
    for _, row in hourly_per_day.sort_values(['date', 'hour']).iterrows():
        print(f"{row['date']},{int(row['hour']):02d},{int(row['delta_in'])},{int(row['delta_out'])},{row['occupancy']:.2f}")
    sys.exit(0)

# Compute total over period
total_in = df['delta_in'].sum()
total_out = df['delta_out'].sum()

# Number of days
num_days = len(daily_totals)

# Print daily totals and hourly breakdowns if --daily flag is set
if args.daily:
    sorted_dates = sorted(daily_totals['date'])
    for date in sorted_dates:
        day_row = daily_totals[daily_totals['date'] == date]
        day_in = day_row['delta_in'].values[0]
        day_out = day_row['delta_out'].values[0]
        day_occ = day_row['occupancy'].values[0]
        print(f"Daily total for {date}: in {int(day_in)}, out {int(day_out)}, avg occupancy {day_occ:.2f}")

        # Hourly for this day
        day_hourly = hourly_per_day[hourly_per_day['date'] == date].sort_values('hour')
        for _, row in day_hourly.iterrows():
            print(f"  Hour {int(row['hour']):02d}: in {int(row['delta_in'])}, out {int(row['delta_out'])}, avg occupancy {row['occupancy']:.2f}")

# Output total for the building
print(f"Total for building over the period: in {int(total_in)}, out {int(total_out)}, combined {int(total_in + total_out)}")

# Average daily
avg_daily_in = total_in / num_days if num_days > 0 else 0
avg_daily_out = total_out / num_days if num_days > 0 else 0
avg_daily_occ = daily_totals['occupancy'].mean() if num_days > 0 else 0
print(f"Average daily: in {avg_daily_in:.2f}, out {avg_daily_out:.2f}, combined {(avg_daily_in + avg_daily_out):.2f}, avg occupancy {avg_daily_occ:.2f}")

# Coverage and distribution details
total_days_in_range = (end_date - start_date).days + 1
unique_open_hours = df[['date', 'hour']].drop_duplicates()
open_hour_count = len(unique_open_hours)
avg_in_per_open_hour = total_in / open_hour_count if open_hour_count > 0 else 0
avg_out_per_open_hour = total_out / open_hour_count if open_hour_count > 0 else 0

traffic_total = total_in + total_out
suppression_total = off_hours_in + off_hours_out
total_with_suppression = traffic_total + suppression_total
coverage_ratio = (observed_open_minutes / expected_open_minutes) if expected_open_minutes > 0 else None
missing_minutes = max(expected_open_minutes - observed_open_minutes, 0) if expected_open_minutes > 0 else 0
adjustment_total = float(df['adjustment_in'].abs().sum() + df['adjustment_out'].abs().sum())
adjustment_ratio = adjustment_total / traffic_total if traffic_total > 0 else 0
adjustment_events = int(df['reset_flag_in'].sum() + df['reset_flag_out'].sum())
median_occ = df['occupancy'].median() if not df.empty else 0
baseline_occ = max(1.0, median_occ)
if not df.empty:
    start_occ = df['occupancy'].iloc[0]
    end_occ = df['occupancy'].iloc[-1]
else:
    start_occ = 0
    end_occ = 0
net_flow = total_in - total_out
occupancy_change = end_occ - start_occ
flow_drift = net_flow - occupancy_change
drift_ratio = abs(flow_drift) / baseline_occ if baseline_occ > 0 else 0
reset_threshold = 5
daily_first_occ = df.groupby('date')['occupancy'].first() if not df.empty else pd.Series(dtype=float)
reset_issues = int((daily_first_occ > reset_threshold).sum())
suppression_ratio = suppression_total / total_with_suppression if total_with_suppression > 0 else 0

severity = 0
quality_notes = []

if expected_open_minutes > 0:
    if coverage_ratio < 0.7:
        severity = 2
        quality_notes.append(f"Coverage {coverage_ratio:.1%} (target ≥90%)")
    elif coverage_ratio < 0.9:
        severity = max(severity, 1)
        quality_notes.append(f"Coverage {coverage_ratio:.1%} (target ≥90%)")
else:
    coverage_ratio = None

if traffic_total > 0:
    if adjustment_ratio > 0.05:
        severity = 2
        quality_notes.append(f"Resets adjusted {adjustment_ratio:.1%} of open traffic")
    elif adjustment_ratio > 0.01:
        severity = max(severity, 1)
        quality_notes.append(f"Resets adjusted {adjustment_ratio:.1%} of open traffic")

if total_with_suppression > 0:
    if suppression_ratio > 0.05:
        severity = 2
        quality_notes.append(f"Suppressed off-hours traffic {suppression_ratio:.1%}")
    elif suppression_ratio > 0.02:
        severity = max(severity, 1)
        quality_notes.append(f"Suppressed off-hours traffic {suppression_ratio:.1%}")

if drift_ratio > 5:
    severity = 2
    quality_notes.append(f"Net flow drift {flow_drift:.0f} ({drift_ratio:.1f}× median occupancy)")
elif drift_ratio > 2:
    severity = max(severity, 1)
    quality_notes.append(f"Net flow drift {flow_drift:.0f} ({drift_ratio:.1f}× median occupancy)")

if reset_issues > 3:
    severity = 2
    quality_notes.append(f"{reset_issues} days started above reset threshold")
elif reset_issues > 1:
    severity = max(severity, 1)
    quality_notes.append(f"{reset_issues} days started above reset threshold")

if df.empty and expected_open_minutes > 0:
    severity = 2
    quality_notes.append("No open-minute samples captured in range")

confidence_label = ["High", "Medium", "Low"][severity]

print("Coverage summary:")
print(f"  Open days included: {num_days} out of {total_days_in_range} days in range")
print(f"  Unique open hours sampled: {open_hour_count}")
if coverage_ratio is not None:
    print(f"  Open minutes captured: {observed_open_minutes} of {expected_open_minutes} ({coverage_ratio:.1%})")
    print(f"  Minutes missing during open hours: {missing_minutes}")
else:
    print("  Open minutes captured: n/a (no published open minutes during this window)")
    print(f"  Minutes observed during closed hours: {observed_open_minutes}")

print("Data quality summary:")
print(f"  Confidence rating: {confidence_label}")
print(f"  Resets/adjustments applied: {int(round(adjustment_total))} patrons across {adjustment_events} minutes ({adjustment_ratio:.2%} of open traffic)")
print(f"  Off-hours suppressed traffic: {int(round(suppression_total))} patrons across {off_hours_minutes} minutes ({suppression_ratio:.2%} of total traffic)")
print(f"  Net flow drift vs occupancy change: {int(round(flow_drift))} ({drift_ratio:.2f}× median occupancy {median_occ:.2f})")
print(f"  Days starting above {reset_threshold} occupants: {reset_issues}")
if quality_notes:
    print("  Notes:")
    for note in quality_notes:
        print(f"    - {note}")

if num_days > 0:
    median_daily_in = daily_totals['delta_in'].median()
    median_daily_out = daily_totals['delta_out'].median()
    median_daily_occ = daily_totals['occupancy'].median()
    occ_95 = df['occupancy'].quantile(0.95) if not df.empty else 0
    print("Daily distribution:")
    print(f"  Median daily in/out: {median_daily_in:.0f} / {median_daily_out:.0f}")
    print(f"  Median daily avg occupancy: {median_daily_occ:.2f}")
    if open_hour_count > 0:
        print(f"  Avg in/out per open hour: {avg_in_per_open_hour:.2f} / {avg_out_per_open_hour:.2f}")
    print(f"  95th percentile occupancy across open minutes: {occ_95:.2f}")

    peak_day_idx = daily_totals['combined'].idxmax()
    peak_day = daily_totals.loc[peak_day_idx]
    print("Peak day:")
    print(
        f"  {peak_day['date']}: in {int(peak_day['delta_in'])}, out {int(peak_day['delta_out'])}, avg occupancy {peak_day['occupancy']:.2f}"
    )

if not hourly_per_day.empty:
    peak_hour_idx = hourly_per_day['combined'].idxmax()
    peak_hour = hourly_per_day.loc[peak_hour_idx]
    print("Peak hour (single day/hour segment):")
    print(
        f"  {peak_hour['date']} hour {int(peak_hour['hour']):02d}: in {int(peak_hour['delta_in'])}, out {int(peak_hour['delta_out'])}, avg occupancy {peak_hour['occupancy']:.2f}"
    )

# Average hourly
if not hourly_per_day.empty:
    hourly_stats = hourly_per_day.groupby('hour').agg({
        'delta_in': 'sum',
        'delta_out': 'sum',
        'occupancy': 'mean',
        'date': 'nunique'
    }).rename(columns={'delta_in': 'total_in', 'delta_out': 'total_out', 'occupancy': 'avg_occupancy', 'date': 'day_count'}).reset_index()

    hourly_stats['avg_in'] = hourly_stats['total_in'] / hourly_stats['day_count']
    hourly_stats['avg_out'] = hourly_stats['total_out'] / hourly_stats['day_count']

    print("Average hourly:")
    for _, row in hourly_stats.sort_values('hour').iterrows():
        print(f"  Hour {int(row['hour']):02d}: in {row['avg_in']:.2f}, out {row['avg_out']:.2f}, avg occupancy {row['avg_occupancy']:.2f}")

# Average occupancy
if not df.empty:
    avg_occupancy = df['occupancy'].mean()
    print(f"Average occupancy over the period: {avg_occupancy:.2f}")