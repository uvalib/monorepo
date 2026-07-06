# test_mcp_locally.py
import db_helper as db
import processing as proc
import report_generator as rep
from datetime import datetime, timedelta

def main():
    print("Initializing Database Engine...")
    try:
        engine = db.get_db_engine()
        print("Connected! Fetching library configuration mapping...")
        mapping, lookup = db.get_libraries_mapping(engine)
        print("\nDiscovered Libraries and Camera Counts:")
        for lib, serials in mapping.items():
            print(f" - {lib}: {len(serials)} cameras")
            
        print("\nRunning a sample query test for Clemons Library (last 7 days)...")
        # Find Clemons serials
        clemons_serials = mapping.get("Clemons")
        if not clemons_serials:
            print("Clemons not found in mapping!")
            return
            
        end_date = datetime.now().strftime("%Y-%m-%d")
        start_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
        print(f"Date range: {start_date} to {end_date}")
        
        print("Finding start ID...")
        start_id = db.get_start_id(engine, start_date)
        print(f"Start ID: {start_id}")
        
        print("Querying raw metrics...")
        raw_df = db.query_raw_metrics(engine, start_id, end_date, clemons_serials)
        print(f"Retrieved {len(raw_df)} raw records.")
        
        if raw_df.empty:
            print("No data retrieved.")
            return
            
        print("Processing occupancy data...")
        processed_df = proc.process_occupancy_data(raw_df, clemons_serials)
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

if __name__ == "__main__":
    main()
