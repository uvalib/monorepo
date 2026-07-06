# db_helper.py
import os
from datetime import date, datetime, timedelta
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

# Get DB credentials from env
DB_HOST = os.getenv("DB_HOST", "rds-mysql8-production.internal.lib.virginia.edu")
DB_USER = os.getenv("DB_USER", "occupancy_ro")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Kagaim3CaiXie1")
DB_NAME = os.getenv("DB_NAME", "occupancy")

# Table metadata
TABLE_START_DATE = date(2023, 10, 18)
AVG_IDS_PER_DAY = 58300

def get_db_engine():
    connection_url = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
    return create_engine(connection_url)

def get_libraries_mapping(engine):
    """
    Queries the cameras table to build a mapping of:
    location_short -> list of serial numbers.
    Also returns a normalized name lookup dictionary.
    """
    query = "SELECT serial_no, location_short FROM cameras"
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)
    
    mapping = {}
    normalized_lookup = {}
    for _, row in df.iterrows():
        loc = row['location_short'].strip()
        serial = row['serial_no'].strip()
        if loc not in mapping:
            mapping[loc] = []
        mapping[loc].append(serial)
        
        # Build normalized keys for matching (e.g. 'clemons', 'shannon', 'music', 'fine arts', 'science & engineering')
        norm_key = loc.lower().replace('&', 'and').replace(' ', '')
        normalized_lookup[norm_key] = loc
        
        # Add aliases
        if "science" in norm_key:
            normalized_lookup["science"] = loc
            normalized_lookup["sel"] = loc
            normalized_lookup["scienceandengineering"] = loc
            normalized_lookup["scienceengineering"] = loc
            
    return mapping, normalized_lookup

def get_start_id(engine, start_date_str):
    """
    Performs an optimized start ID lookup using day-based estimation to prevent full-table scans.
    """
    target_dt = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    if target_dt <= TABLE_START_DATE:
        return 1
        
    days_since_start = (target_dt - TABLE_START_DATE).days
    est_id = days_since_start * AVG_IDS_PER_DAY
    # Apply a 20-day safety buffer (approx 1.1 million IDs)
    scan_start_id = max(1, est_id - 1100000)
    
    query = text("""
        SELECT id FROM rawmetrics 
        WHERE id >= :scan_start_id AND created_at >= :start_dt 
        ORDER BY id ASC LIMIT 1
    """)
    
    with engine.connect() as conn:
        result = conn.execute(query, {"scan_start_id": scan_start_id, "start_dt": start_date_str + " 00:00:00"})
        row = result.fetchone()
        if row:
            return row[0]
            
    # Fallback to scanning from beginning if not found
    fallback_query = text("SELECT id FROM rawmetrics WHERE created_at >= :start_dt ORDER BY id ASC LIMIT 1")
    with engine.connect() as conn:
        result = conn.execute(fallback_query, {"start_dt": start_date_str + " 00:00:00"})
        row = result.fetchone()
        return row[0] if row else 1

def query_raw_metrics(engine, start_id, end_date_str, serial_nos):
    """
    Queries the rawmetrics table from the start_id up to the end date for the selected serial numbers.
    """
    # Cover the target end day in full (add 2 days buffer to end_date_str for TZ and processing window)
    end_dt = datetime.strptime(end_date_str, "%Y-%m-%d") + timedelta(days=2)
    end_dt_str = end_dt.strftime("%Y-%m-%d 00:00:00")
    
    query = """
        SELECT serial_no, count_in, count_out, created_at
        FROM rawmetrics
        WHERE id >= :start_id
          AND created_at <= :end_dt_str
          AND source = 'sum'
          AND serial_no IN :serials
        ORDER BY id ASC
    """
    
    with engine.connect() as conn:
        df = pd.read_sql(
            text(query), 
            conn, 
            params={"start_id": start_id, "end_dt_str": end_dt_str, "serials": tuple(serial_nos)}
        )
    return df
