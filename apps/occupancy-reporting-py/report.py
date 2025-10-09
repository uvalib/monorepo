import pandas as pd
from datetime import datetime, timedelta
import os
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
else:
    end_time = datetime.strptime(end_time_str, "%H:%M").time()

# Get open hours
open_intervals = get_hours(start_date_str, end_date_str)

# Load the TSV file
file_path = 'counts_with_occupancy.tsv'
df = pd.read_csv(file_path, sep='\t')

# Convert created_at to datetime with UTC
df['created_at'] = pd.to_datetime(df['created_at'], utc=True)

# Convert to NYC timezone
df['created_at_nyc'] = df['created_at'].dt.tz_convert('America/New_York')

# Extract NYC date and time
df['date'] = df['created_at_nyc'].dt.date
df['time'] = df['created_at_nyc'].dt.time
df['hour'] = df['created_at_nyc'].dt.hour

# Filter by serial_no
df = df[df['serial_no'].isin(serial_nos)]

# Filter by date range (NYC)
df = df[(df['date'] >= start_date) & (df['date'] <= end_date)]

# Filter by time range (NYC)
df = df[(df['time'] >= start_time) & (df['time'] <= end_time)]

# Sort the dataframe
df = df.sort_values('created_at_nyc')

# Aggregate to building level
building_df = df.groupby('created_at_nyc').agg({
    'delta_in': 'sum',
    'delta_out': 'sum',
    'occupancy': 'sum',
    'date': 'first',
    'hour': 'first',
    'time': 'first'
}).reset_index()

# Fold exact end_time entries into previous hour if end_time is on the hour
if end_time.minute == 0 and end_time.second == 0 and end_time.microsecond == 0:
    condition = (building_df['time'] == end_time)
    if end_time.hour > 0:
        building_df.loc[condition, 'hour'] = end_time.hour - 1
    else:
        building_df.loc[condition, 'hour'] = 23
        building_df.loc[condition, 'date'] = building_df.loc[condition, 'date'] - timedelta(days=1)

# Compute is_open
building_df['is_open'] = building_df.apply(lambda row: is_open(row['date'], row['time'], open_intervals), axis=1)

# If debug, list skipped
if args.debug:
    skipped = building_df[~building_df['is_open']].copy()
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
building_df = building_df[building_df['is_open']]

# Drop is_open
building_df = building_df.drop('is_open', axis=1)

# If debug, print the groups
if args.debug:
    print("Debug building data:")
    print(building_df[['created_at_nyc', 'delta_in', 'delta_out', 'occupancy']])
    print("\n")

# Compute daily totals
daily_totals = building_df.groupby('date').agg({'delta_in': 'sum', 'delta_out': 'sum', 'occupancy': 'mean'}).reset_index()

# Compute hourly totals per day
hourly_per_day = building_df.groupby(['date', 'hour']).agg({'delta_in': 'sum', 'delta_out': 'sum', 'occupancy': 'mean'}).reset_index()

# Compute total over period
total_in = building_df['delta_in'].sum()
total_out = building_df['delta_out'].sum()

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

# Average hourly
if num_days > 0:
    hourly_avg = building_df.groupby('hour').agg({'delta_in': 'sum', 'delta_out': 'sum', 'occupancy': 'mean'}).reset_index()
    hourly_avg['avg_in'] = hourly_avg['delta_in'] / num_days
    hourly_avg['avg_out'] = hourly_avg['delta_out'] / num_days
    print("Average hourly:")
    for _, row in hourly_avg.sort_values('hour').iterrows():
        print(f"  Hour {int(row['hour']):02d}: in {row['avg_in']:.2f}, out {row['avg_out']:.2f}, avg occupancy {row['occupancy']:.2f}")

# Average occupancy
if not building_df.empty:
    avg_occupancy = building_df['occupancy'].mean()
    print(f"Average occupancy over the period: {avg_occupancy:.2f}")