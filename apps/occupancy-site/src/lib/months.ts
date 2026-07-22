/**
 * Build the rolling 24 complete calendar months ending with the previous month.
 * Example (today = 2026-07-20): 2024-07 … 2026-06.
 */
export function lastCompleteMonths(count = 24, now = new Date()): MonthKey[] {
  const months: MonthKey[] = [];
  // Start at previous complete month
  let year = now.getFullYear();
  let month = now.getMonth(); // 0-based; current month index → last complete is month-1
  // If day is early in the month we still use previous month as last complete
  month -= 1;
  if (month < 0) {
    month = 11;
    year -= 1;
  }

  for (let i = 0; i < count; i++) {
    months.unshift({ year, month: month + 1 }); // 1-based month for storage
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
  }
  return months;
}

export interface MonthKey {
  year: number;
  /** 1–12 */
  month: number;
}

export function monthKeyString(m: MonthKey): string {
  return `${m.year}-${String(m.month).padStart(2, '0')}`;
}

export function monthLabel(m: MonthKey, style: 'long' | 'short' = 'long'): string {
  const d = new Date(Date.UTC(m.year, m.month - 1, 1));
  return d.toLocaleDateString('en-US', {
    month: style,
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function monthDateRange(m: MonthKey): { startDate: string; endDate: string } {
  const startDate = `${m.year}-${String(m.month).padStart(2, '0')}-01`;
  const lastDay = new Date(Date.UTC(m.year, m.month, 0)).getUTCDate();
  const endDate = `${m.year}-${String(m.month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { startDate, endDate };
}

export function groupMonthsByYear(months: MonthKey[]): Map<number, MonthKey[]> {
  const map = new Map<number, MonthKey[]>();
  for (const m of months) {
    const list = map.get(m.year) ?? [];
    list.push(m);
    map.set(m.year, list);
  }
  return map;
}
