# test_mcp_locally.py
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "OccupancyReporting", "app", "OccupancyReporting"))

import db_helper as db
import processing as proc
import report_generator as rep
import camera_quirks
from datetime import datetime, timedelta

def main():
    print("Initializing Database Engine...")
    try:
        engine = db.get_db_engine()
        print("Connected! Fetching library configuration mapping...")
        mapping, lookup = db.get_libraries_mapping(engine)
        print("\nDiscovered Libraries and Camera Counts (after location overrides):")
        for lib, serials in mapping.items():
            print(f" - {lib}: {len(serials)} cameras")

        # Sanity-check quirks against live cameras table
        clemons = set(mapping.get("Clemons", []))
        shannon = set(mapping.get("Shannon", []))
        assert "b8:a4:4f:5d:31:54" in clemons, "31:54 should count as Clemons"
        assert "b8:a4:4f:5d:31:54" not in shannon, "31:54 should not remain under Shannon"
        print("\nQuirk check: Clemons-side connector (31:54) reassigned to Clemons — OK")

        print("\nRunning a sample query test for Clemons Library (last 7 days)...")
        end_date = datetime.now().strftime("%Y-%m-%d")
        start_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
        print(f"Date range: {start_date} to {end_date}")

        serials = db.resolve_library_serials(mapping, "Clemons", start_date, end_date)
        print(f"Resolved {len(serials)} serials for Clemons in range")

        print("Finding start ID...")
        start_id = db.get_start_id(engine, start_date)
        print(f"Start ID: {start_id}")

        print("Querying raw metrics...")
        raw_df = db.query_raw_metrics(engine, start_id, end_date, serials)
        print(f"Retrieved {len(raw_df)} raw records.")
        raw_df = camera_quirks.filter_metrics_for_library(raw_df, "Clemons", mapping)
        print(f"After library filter: {len(raw_df)} records.")

        if raw_df.empty:
            print("No data retrieved.")
            return

        print("Processing occupancy data...")
        active = raw_df["serial_no"].unique().tolist()
        processed_df = proc.process_occupancy_data(raw_df, active)
        print(f"Processed into {len(processed_df)} minute-level records.")

        print("Generating metrics summary...")
        metrics = rep.generate_report_metrics(processed_df, start_date, end_date)

        if "error" in metrics:
            print(f"Metrics error: {metrics['error']}")
            return

        print("\nSample Report Results:")
        print(f"Total In: {metrics['total_in']}")
        print(f"Total Out: {metrics['total_out']}")
        print(f"Avg Occupancy: {metrics['avg_occupancy']:.2f}")
        print("Test passed successfully!")
    except Exception as e:
        print(f"\nError during testing: {e}")
        print("Note: Ensure you are connected to the UVA VPN (moresecure-vpn-pat-1.its.virginia.edu) to reach the RDS database.")
        raise

if __name__ == "__main__":
    main()
