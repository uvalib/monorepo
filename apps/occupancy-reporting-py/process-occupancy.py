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
parser = argparse.ArgumentParser(description='Add occupancy to counts.')
parser.add_argument('--debug', action='store_true', help='Enable debug mode to print log lines.')
args = parser.parse_args()

if args.debug:
    pd.set_option('display.max_rows', None)

# Load the TSV file
file_path = "./counts.tsv"
df = pd.read_csv(file_path, sep='\t')

# Convert created_at to datetime with UTC
df['created_at'] = pd.to_datetime(df['created_at'], utc=True)

# Convert to NYC timezone
df['created_at_nyc'] = df['created_at'].dt.tz_convert('America/New_York')

# Extract NYC date and time
df['date'] = df['created_at_nyc'].dt.date
df['time'] = df['created_at_nyc'].dt.time

# Get date range from data
start_date = df['date'].min()
end_date = df['date'].max()
start_date_str = start_date.isoformat()
end_date_str = end_date.isoformat()

# Get open hours
open_intervals = get_hours(start_date_str, end_date_str)

# Filter by serial_no
df = df[df['serial_no'].isin(serial_nos)]

# Compute is_open
df['is_open'] = df.apply(lambda row: is_open(row['date'], row['time'], open_intervals), axis=1)

# If debug, list skipped
if args.debug:
    skipped = df[~df['is_open']].copy()
    if not skipped.empty:
        skipped['hour'] = skipped['created_at_nyc'].dt.hour
        print("Skipped due to closed hours:")
        unique_date_hours = skipped[['date', 'hour']].drop_duplicates().sort_values(['date', 'hour'])
        for _, row in unique_date_hours.iterrows():
            dt = row['date']
            hr = row['hour']
            group = skipped[(skipped['date'] == dt) & (skipped['hour'] == hr)]
            skipped_in = group['count_in'].sum()  
            skipped_out = group['count_out'].sum()
            if skipped_in > 0 or skipped_out > 0:  
                print(f"{dt} hour {int(hr):02d}: in {skipped_in}, out {skipped_out}")
        total_skipped_in = skipped['count_in'].sum()
        total_skipped_out = skipped['count_out'].sum()
        print(f"Total skipped raw counts: in {total_skipped_in}, out {total_skipped_out}")

# Filter to open hours
df = df[df['is_open']]

# Drop is_open
df = df.drop('is_open', axis=1)

# Sort by created_at_nyc
df = df.sort_values('created_at_nyc')

# Compute previous values within each serial_no and date group
df['prev_in'] = df.groupby(['serial_no', 'date'])['count_in'].shift(1)
df['prev_out'] = df.groupby(['serial_no', 'date'])['count_out'].shift(1)

# Compute deltas
def compute_delta(curr, prev):
    if pd.isnull(prev):
        return 0
    elif curr >= prev:
        return curr - prev
    else:
        return curr

df['delta_in'] = df.apply(lambda row: compute_delta(row['count_in'], row['prev_in']), axis=1)
df['delta_out'] = df.apply(lambda row: compute_delta(row['count_out'], row['prev_out']), axis=1)

# Add net delta
df['net_delta'] = df['delta_in'] - df['delta_out']

# Add estimated occupancy, resetting per day
df['occupancy'] = df.groupby(['serial_no', 'date'])['net_delta'].cumsum()

# Adjust for negative occupancy per day per serial_no
grouped = df.groupby(['serial_no', 'date'])
for key, sub_df in grouped:
    min_occ = sub_df['occupancy'].min()
    if min_occ < 0:
        shift = -min_occ
        df.loc[sub_df.index, 'occupancy'] += shift

# If debug, print the groups
if args.debug:
    for key, group in grouped:
        group = group.sort_values('created_at')
        sn, dt = key
        print(f"Debug for {sn} on {dt}:")
        print(group[['created_at', 'count_in', 'count_out', 'occupancy']])
        print("\n")

# Save to new TSV
output_path = "./counts_with_occupancy.tsv"
df.to_csv(output_path, sep='\t', index=False)
print(f"Saved to {output_path}")