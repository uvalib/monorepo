# server.py
from mcp.server.fastmcp import FastMCP
import db_helper as db
import processing as proc
import report_generator as rep

# Initialize FastMCP Server
mcp = FastMCP("Occupancy Reporting")

@mcp.tool()
def get_libraries() -> list[str]:
    """
    Returns a list of all libraries available in the database.
    """
    engine = db.get_db_engine()
    mapping, _ = db.get_libraries_mapping(engine)
    return list(mapping.keys())

@mcp.tool()
def get_foot_traffic(start_date: str, end_date: str, library: str) -> str:
    """
    Get foot traffic totals (entries, exits, and combined) for a library in a date range.
    :param start_date: Start date (YYYY-MM-DD)
    :param end_date: End date (YYYY-MM-DD)
    :param library: Library name (e.g. Clemons, Shannon, Science & Engineering)
    """
    engine = db.get_db_engine()
    mapping, lookup = db.get_libraries_mapping(engine)
    
    norm_lib = library.lower().replace('&', 'and').replace(' ', '')
    if norm_lib not in lookup:
        return f"Error: Library '{library}' not found. Available libraries: {', '.join(mapping.keys())}"
    resolved_lib = lookup[norm_lib]
    serials = mapping[resolved_lib]
    
    start_id = db.get_start_id(engine, start_date)
    raw_df = db.query_raw_metrics(engine, start_id, end_date, serials)
    processed_df = proc.process_occupancy_data(raw_df, serials)
    metrics = rep.generate_report_metrics(processed_df, start_date, end_date)
    
    if "error" in metrics:
        return f"Error: {metrics['error']}"
        
    return f"""### Foot Traffic Summary: {resolved_lib}
* **Date Range**: {start_date} to {end_date}
* **Total Entries ("In" Traffic)**: {metrics['total_in']:,}
* **Total Exits ("Out" Traffic)**: {metrics['total_out']:,}
* **Total Combined Activity**: {metrics['combined_total']:,}
* **Average Daily Entries**: {metrics['avg_daily_in']:,.2f}
"""

@mcp.tool()
def get_occupancy_report(start_date: str, end_date: str, library: str, start_time: str = "00:00", end_time: str = "24:00") -> str:
    """
    Get a full executive occupancy and quality report for a library in a date range.
    :param start_date: Start date (YYYY-MM-DD)
    :param end_date: End date (YYYY-MM-DD)
    :param library: Library name (e.g. Clemons, Shannon, Science & Engineering)
    :param start_time: Start time (HH:MM, default 00:00)
    :param end_time: End time (HH:MM, default 24:00)
    """
    engine = db.get_db_engine()
    mapping, lookup = db.get_libraries_mapping(engine)
    
    norm_lib = library.lower().replace('&', 'and').replace(' ', '')
    if norm_lib not in lookup:
        return f"Error: Library '{library}' not found. Available libraries: {', '.join(mapping.keys())}"
    resolved_lib = lookup[norm_lib]
    serials = mapping[resolved_lib]
    
    start_id = db.get_start_id(engine, start_date)
    raw_df = db.query_raw_metrics(engine, start_id, end_date, serials)
    processed_df = proc.process_occupancy_data(raw_df, serials)
    metrics = rep.generate_report_metrics(processed_df, start_date, end_date, start_time, end_time)
    
    if "error" in metrics:
        return f"Error: {metrics['error']}"
        
    rep_text = rep.format_report_as_markdown(resolved_lib, metrics, start_date, end_date)
    return f"""# Occupancy Report: {resolved_lib} ({start_date} to {end_date})
{rep_text}"""

if __name__ == "__main__":
    import sys
    # Use streamable-http transport when running in AgentCore (or any HTTP host).
    # Fall back to stdio for local Claude Desktop / MCP client usage.
    transport = "streamable-http" if "--http" in sys.argv else "stdio"
    mcp.run(transport=transport)
