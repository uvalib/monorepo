# hours.py
import requests
from datetime import datetime, timedelta, time

def parse_time(s):
    s = s.lower().replace(' ', '')
    if ':' in s:
        if 'am' in s or 'pm' in s:
            fmt = "%I:%M%p"
        else:
            fmt = "%H:%M"
    else:
        fmt = "%I%p"
    return datetime.strptime(s, fmt).time()

def fetch_hours(start_date, end_date):
    open_intervals = {}
    current_start = start_date
    max_chunk_days = 31
    while current_start <= end_date:
        current_end = min(end_date, current_start + timedelta(days=max_chunk_days - 1))
        current_start_str = current_start.isoformat()
        current_end_str = current_end.isoformat()
        url = f"https://cal.lib.virginia.edu/api/1.0/hours/3638,17367,4170?iid=863&key=e4b27d40b7099e8e392113da2f8bf30a&from={current_start_str}&to={current_end_str}"
        response = requests.get(url)
        if response.status_code != 200:
            raise ValueError(f"Failed to fetch hours for {current_start_str} to {current_end_str}: {response.status_code}")
        data = response.json()
        # Take first location's dates
        dates_hours = data[0]['dates']
        for date_str in dates_hours:
            date_info = dates_hours[date_str]
            status = date_info['status']
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
            if status == "closed":
                open_intervals[date_str] = []
                continue
            if status == "24hours":
                open_intervals[date_str] = [(time(0,0), time(23,59,59))]
                continue
            intervals = []
            for period in date_info.get('hours', []):
                from_str = period['from']
                to_str = period['to']
                try:
                    from_time = parse_time(from_str)
                    to_time = parse_time(to_str)
                except:
                    continue
                if from_time == time(0,0) and to_time == time(0,0):
                    intervals.append((time(0,0), time(23,59,59)))
                    continue
                adjusted_to_time = to_time
                if to_time == time(0,0):
                    adjusted_to_time = time(23,59,59)
                if adjusted_to_time >= from_time:
                    intervals.append((from_time, adjusted_to_time))
                else:
                    intervals.append((from_time, time(23,59,59)))
                    next_date = date + timedelta(days=1)
                    next_date_str = next_date.isoformat()
                    if next_date_str not in open_intervals:
                        open_intervals[next_date_str] = []
                    open_intervals[next_date_str].append((time(0,0), to_time))
            open_intervals[date_str] = intervals
        current_start = current_end + timedelta(days=1)
    return open_intervals

def get_day_open_times(date_str):
    date = datetime.strptime(date_str, "%Y-%m-%d").date()
    prev_date = date - timedelta(days=1)
    next_date = date + timedelta(days=1)
    intervals = fetch_hours(prev_date, next_date)
    
    day_intervals = sorted(intervals.get(date_str, []), key=lambda x: x[0])
    prev_intervals = sorted(intervals.get(prev_date.isoformat(), []), key=lambda x: x[0])
    next_intervals = sorted(intervals.get(next_date.isoformat(), []), key=lambda x: x[0])
    
    if not day_intervals:
        open_times = "Closed"
    else:
        open_times = []
        for start, end in day_intervals:
            start_str = start.strftime("%H:%M")
            end_str = end.strftime("%H:%M") if end != time(23,59,59) else "24:00"
            open_times.append(f"{start_str}-{end_str}")
        if len(open_times) == 1 and open_times[0] == "00:00-24:00":
            open_times = "00:00-24:00"
        else:
            open_times = ", ".join(open_times)
    
    # Determine if opened
    opened = False
    if day_intervals and day_intervals[0][0] > time(0,0):
        opened = True
    elif day_intervals and day_intervals[0][0] == time(0,0):
        # Check if previous day ends at 23:59
        if prev_intervals and prev_intervals[-1][1] == time(23,59,59):
            opened = False
        else:
            opened = True
    else:
        opened = False  # Closed all day
    
    # Determine if closed
    closed = False
    if day_intervals and day_intervals[-1][1] < time(23,59,59):
        closed = True
    elif day_intervals and day_intervals[-1][1] == time(23,59,59):
        # Check if next day starts at 0:00
        if next_intervals and next_intervals[0][0] == time(0,0):
            closed = False
        else:
            closed = True
    else:
        closed = False  # Closed all day
    
    return {
        "open_times": open_times,
        "opened": "Yes" if opened else "No",
        "closed": "Yes" if closed else "No"
    }

def get_hours(start_date_str, end_date_str):
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    raw_intervals = fetch_hours(start_date, end_date)
    # Extend intervals with buffers
    extended_intervals = {k: [] for k in raw_intervals}
    for date_str in list(raw_intervals.keys()):
        date = datetime.strptime(date_str, "%Y-%m-%d").date()
        for s, e in raw_intervals[date_str]:
            dt_s = datetime.combine(date, s)
            dt_e = datetime.combine(date, e)
            dt_new_s = dt_s - timedelta(minutes=15)
            dt_new_e = dt_e + timedelta(minutes=30)
            # Add the extended interval, handling day spans
            current_dt = dt_new_s
            while current_dt < dt_new_e:
                current_date_str = current_dt.date().isoformat()
                if current_date_str not in extended_intervals:
                    extended_intervals[current_date_str] = []
                day_end = datetime.combine(current_dt.date(), time(23,59,59,999999))
                segment_end = min(day_end, dt_new_e)
                segment_start_time = current_dt.time()
                segment_end_time = segment_end.time()
                extended_intervals[current_date_str].append((segment_start_time, segment_end_time))
                current_dt = day_end + timedelta(microseconds=1)
    
    # Merge overlapping intervals per day
    def merge_intervals(intervals):
        if not intervals:
            return []
        sorted_int = sorted(intervals, key=lambda x: x[0])
        merged = [sorted_int[0]]
        for current in sorted_int[1:]:
            last = merged[-1]
            if current[0] <= last[1]:
                merged[-1] = (last[0], max(last[1], current[1]))
            else:
                merged.append(current)
        return merged
    
    for date_str in extended_intervals:
        extended_intervals[date_str] = merge_intervals(extended_intervals[date_str])
    
    return extended_intervals

def is_open(date, time, open_intervals):
    date_str = date.isoformat()
    if date_str not in open_intervals:
        return False
    for start, end in open_intervals[date_str]:
        if start <= time <= end:
            return True
    return False