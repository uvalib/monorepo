# testhours.py
from datetime import datetime
from hours import get_day_open_times

date_str = input("Enter date (YYYY-MM-DD): ")

result = get_day_open_times(date_str)

print(f"For {date_str}:")
print(f"Open times: {result['open_times']}")
print(f"Opened on this day: {result['opened']}")
print(f"Closed on this day: {result['closed']}")