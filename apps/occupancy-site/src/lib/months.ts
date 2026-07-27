/**
 * Calendar helpers for the occupancy site.
 *
 * The published window is always complete calendar months in America/New_York
 * (never a partial month cut at a rolling day-aligned 2-year mark).
 */

const TZ = 'America/New_York';

function nyParts(date = new Date()): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

/**
 * Build the rolling N complete calendar months ending with the previous month
 * (America/New_York). Example (NY date 2026-07-21): 2024-07 … 2026-06.
 */
export function lastCompleteMonths(count = 24, now = new Date()): MonthKey[] {
  const { year: cy, month: cm } = nyParts(now);
  let year = cy;
  let month = cm - 1;
  if (month < 1) {
    month = 12;
    year -= 1;
  }

  const months: MonthKey[] = [];
  for (let i = 0; i < count; i++) {
    months.unshift({ year, month });
    month -= 1;
    if (month < 1) {
      month = 12;
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

/** Full calendar-month bounds (day 1 through last day). Never partial. */
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
