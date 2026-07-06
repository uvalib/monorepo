# report_generator.py
import pandas as pd
from datetime import datetime, timedelta, time
from hours_helper import get_hours, is_open

def generate_report_metrics(df: pd.DataFrame, start_date_str: str, end_date_str: str, start_time_str: str = "00:00", end_time_str: str = "24:00") -> dict:
    """
    Analyzes the processed occupancy data and aggregates statistics for a given window.
    """
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    start_time = datetime.strptime(start_time_str, "%H:%M").time()
    
    if end_time_str == "24:00":
        end_time = datetime.strptime("23:59", "%H:%M").time()
        end_exclusive = False
    else:
        end_time = datetime.strptime(end_time_str, "%H:%M").time()
        end_exclusive = end_time.minute == 0 and end_time.second == 0
        
    open_intervals = get_hours(start_date_str, end_date_str)
    
    df = df.copy()
    df['date'] = df['created_at_nyc'].dt.date
    df['time'] = df['created_at_nyc'].dt.time
    df['hour'] = df['created_at_nyc'].dt.hour
    
    df = df[(df['date'] >= start_date) & (df['date'] <= end_date)]
    
    df = df[df['time'] >= start_time]
    if end_exclusive:
        df = df[df['time'] < end_time]
    else:
        df = df[df['time'] <= end_time]
        
    if df.empty:
        return {"error": "No metrics available in the selected date/time range."}
        
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
        
    df = df.sort_values('created_at_nyc')
    
    df['delta_in'] = df.groupby('date')['count_in'].diff().fillna(0)
    df['delta_out'] = df.groupby('date')['count_out'].diff().fillna(0)
    
    neg_in_mask = df['delta_in'] < 0
    neg_out_mask = df['delta_out'] < 0
    df.loc[neg_in_mask, 'delta_in'] = df.loc[neg_in_mask, 'count_in']
    df.loc[neg_out_mask, 'delta_out'] = df.loc[neg_out_mask, 'count_out']
    
    df['is_open'] = df.apply(lambda row: is_open(row['date'], row['time'], open_intervals), axis=1)
    
    observed_open_minutes = int(df['is_open'].sum())
    off_hours_mask = ~df['is_open']
    off_hours_in = df.loc[off_hours_mask, 'suppressed_in'].sum()
    off_hours_out = df.loc[off_hours_mask, 'suppressed_out'].sum()
    off_hours_minutes = int((off_hours_mask & df['outside_buffer']).sum())
    
    df_open = df[df['is_open']].copy()
    
    total_in = df_open['delta_in'].sum()
    total_out = df_open['delta_out'].sum()
    combined_total = total_in + total_out
    
    daily_totals = df_open.groupby('date').agg({'delta_in': 'sum', 'delta_out': 'sum', 'occupancy': 'mean'}).reset_index()
    daily_totals['combined'] = daily_totals['delta_in'] + daily_totals['delta_out']
    num_days = len(daily_totals)
    
    avg_daily_in = total_in / num_days if num_days > 0 else 0
    avg_daily_out = total_out / num_days if num_days > 0 else 0
    avg_daily_combined = combined_total / num_days if num_days > 0 else 0
    avg_occupancy = df_open['occupancy'].mean() if not df_open.empty else 0
    
    hourly_per_day = df_open.groupby(['date', 'hour']).agg({'delta_in': 'sum', 'delta_out': 'sum', 'occupancy': 'mean'}).reset_index()
    hourly_stats = []
    if not hourly_per_day.empty:
        hourly_stats_df = hourly_per_day.groupby('hour').agg({
            'delta_in': 'sum',
            'delta_out': 'sum',
            'occupancy': 'mean',
            'date': 'nunique'
        }).reset_index()
        hourly_stats_df['avg_in'] = hourly_stats_df['delta_in'] / hourly_stats_df['date']
        hourly_stats_df['avg_out'] = hourly_stats_df['delta_out'] / hourly_stats_df['date']
        hourly_stats = hourly_stats_df.to_dict(orient='records')
        
    peak_day = None
    if not daily_totals.empty:
        peak_day_row = daily_totals.loc[daily_totals['combined'].idxmax()]
        peak_day = {
            "date": peak_day_row['date'].isoformat(),
            "in": int(peak_day_row['delta_in']),
            "out": int(peak_day_row['delta_out']),
            "occupancy": float(peak_day_row['occupancy'])
        }
        
    peak_hour = None
    if not hourly_per_day.empty:
        hourly_per_day['combined'] = hourly_per_day['delta_in'] + hourly_per_day['delta_out']
        peak_hour_row = hourly_per_day.loc[hourly_per_day['combined'].idxmax()]
        peak_hour = {
            "date": peak_hour_row['date'].isoformat(),
            "hour": int(peak_hour_row['hour']),
            "in": int(peak_hour_row['delta_in']),
            "out": int(peak_hour_row['delta_out']),
            "occupancy": float(peak_hour_row['occupancy'])
        }
        
    total_days_in_range = (end_date - start_date).days + 1
    coverage_ratio = (observed_open_minutes / expected_open_minutes) if expected_open_minutes > 0 else 0
    missing_minutes = max(expected_open_minutes - observed_open_minutes, 0)
    adjustment_total = float(df_open['adjustment_in'].abs().sum() + df_open['adjustment_out'].abs().sum())
    adjustment_ratio = adjustment_total / combined_total if combined_total > 0 else 0
    adjustment_events = int(df_open['reset_flag_in'].sum() + df_open['reset_flag_out'].sum())
    
    suppression_total = off_hours_in + off_hours_out
    total_with_suppression = combined_total + suppression_total
    suppression_ratio = suppression_total / total_with_suppression if total_with_suppression > 0 else 0
    
    median_occ = df_open['occupancy'].median() if not df_open.empty else 0
    baseline_occ = max(1.0, median_occ)
    start_occ = df_open['occupancy'].iloc[0] if not df_open.empty else 0
    end_occ = df_open['occupancy'].iloc[-1] if not df_open.empty else 0
    net_flow = total_in - total_out
    occupancy_change = end_occ - start_occ
    flow_drift = net_flow - occupancy_change
    drift_ratio = abs(flow_drift) / baseline_occ
    
    reset_threshold = 5
    daily_first_occ = df_open.groupby('date')['occupancy'].first() if not df_open.empty else pd.Series(dtype=float)
    reset_issues = int((daily_first_occ > reset_threshold).sum())
    
    severity = 0
    quality_notes = []
    if expected_open_minutes > 0:
        if coverage_ratio < 0.7:
            severity = 2
            quality_notes.append(f"Coverage {coverage_ratio:.1%} (target >=90%)")
        elif coverage_ratio < 0.9:
            severity = max(severity, 1)
            quality_notes.append(f"Coverage {coverage_ratio:.1%} (target >=90%)")
            
    if combined_total > 0:
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
        quality_notes.append(f"Net flow drift {flow_drift:.0f} ({drift_ratio:.1f}x median occupancy)")
    elif drift_ratio > 2:
        severity = max(severity, 1)
        quality_notes.append(f"Net flow drift {flow_drift:.0f} ({drift_ratio:.1f}x median occupancy)")
        
    if reset_issues > 3:
        severity = 2
        quality_notes.append(f"{reset_issues} days started above reset threshold")
    elif reset_issues > 1:
        severity = max(severity, 1)
        quality_notes.append(f"{reset_issues} days started above reset threshold")
        
    confidence_label = ["High", "Medium", "Low"][severity]
    
    return {
        "total_in": int(total_in),
        "total_out": int(total_out),
        "combined_total": int(combined_total),
        "avg_daily_in": float(avg_daily_in),
        "avg_daily_out": float(avg_daily_out),
        "avg_daily_combined": float(avg_daily_combined),
        "avg_occupancy": float(avg_occupancy),
        "open_days_sampled": int(num_days),
        "total_days_in_range": int(total_days_in_range),
        "observed_open_minutes": int(observed_open_minutes),
        "expected_open_minutes": int(expected_open_minutes),
        "coverage_ratio": float(coverage_ratio) if expected_open_minutes > 0 else 0.0,
        "missing_minutes": int(missing_minutes),
        "adjustment_total": int(round(adjustment_total)),
        "adjustment_events": int(adjustment_events),
        "adjustment_ratio": float(adjustment_ratio),
        "suppression_total": int(round(suppression_total)),
        "suppression_minutes": int(off_hours_minutes),
        "suppression_ratio": float(suppression_ratio),
        "flow_drift": int(round(flow_drift)),
        "drift_ratio": float(drift_ratio),
        "reset_issues": int(reset_issues),
        "confidence_rating": confidence_label,
        "quality_notes": quality_notes,
        "peak_day": peak_day,
        "peak_hour": peak_hour,
        "hourly_stats": hourly_stats,
        "daily_totals": daily_totals.to_dict(orient='records')
    }

def format_report_as_markdown(name: str, metrics: dict, start_date: str, end_date: str) -> str:
    if "error" in metrics:
        return f"### Error generating report: {metrics['error']}"
        
    notes_str = ""
    if metrics["quality_notes"]:
        notes_str = "\n  Notes:\n" + "\n".join([f"    - {n}" for n in metrics["quality_notes"]])
        
    peak_day_str = "n/a"
    if metrics["peak_day"]:
        peak_day_str = f"{metrics['peak_day']['date']}: in {metrics['peak_day']['in']}, out {metrics['peak_day']['out']}, avg occupancy {metrics['peak_day']['occupancy']:.2f}"
        
    peak_hour_str = "n/a"
    if metrics["peak_hour"]:
        peak_hour_str = f"{metrics['peak_hour']['date']} Hour {metrics['peak_hour']['hour']:02d}: in {metrics['peak_hour']['in']}, out {metrics['peak_hour']['out']}, avg occupancy {metrics['peak_hour']['occupancy']:.2f}"

    hourly_lines = []
    for h in sorted(metrics["hourly_stats"], key=lambda x: x["hour"]):
        hourly_lines.append(f"  Hour {h['hour']:02d}: in {h['avg_in']:.2f}, out {h['avg_out']:.2f}, avg occupancy {h['occupancy']:.2f}")
    hourly_str = "\n".join(hourly_lines)

    return f"""Total for building over the period: in {metrics['total_in']}, out {metrics['total_out']}, combined {metrics['combined_total']}
Average daily: in {metrics['avg_daily_in']:.2f}, out {metrics['avg_daily_out']:.2f}, combined {metrics['avg_daily_combined']:.2f}, avg occupancy {metrics['avg_occupancy']:.2f}
Coverage summary:
  Open days included: {metrics['open_days_sampled']} out of {metrics['total_days_in_range']} days in range
  Unique open hours sampled: {len(metrics['hourly_stats'])}
  Open minutes captured: {metrics['observed_open_minutes']} of {metrics['expected_open_minutes']} ({metrics['coverage_ratio']:.1%})
  Minutes missing during open hours: {metrics['missing_minutes']}
Data quality summary:
  Confidence rating: {metrics['confidence_rating']}
  Resets/adjustments applied: {metrics['adjustment_total']} patrons across {metrics['adjustment_events']} minutes ({metrics['adjustment_ratio']:.2%} of open traffic)
  Off-hours suppressed traffic: {metrics['suppression_total']} patrons across {metrics['suppression_minutes']} minutes ({metrics['suppression_ratio']:.2%} of total traffic)
  Net flow drift vs occupancy change: {metrics['flow_drift']} ({metrics['drift_ratio']:.2f}x median occupancy)
  Days starting above 5 occupants: {metrics['reset_issues']}{notes_str}
Daily distribution:
  Median daily in/out: n/a
  Median daily avg occupancy: n/a
  Avg in/out per open hour: n/a
Peak day:
  {peak_day_str}
Peak hour (single day/hour segment):
  {peak_hour_str}
Average hourly:
{hourly_str}
Average occupancy over the period: {metrics['avg_occupancy']:.2f}"""
