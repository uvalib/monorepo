import type { ReportMetrics } from './types';

function num(match: RegExpMatchArray | null, group = 1): number {
  if (!match) return 0;
  return Number(String(match[group]).replace(/,/g, ''));
}

/**
 * Parse the markdown occupancy report returned by the MCP service into structured metrics.
 */
export function parseOccupancyReport(markdown: string): ReportMetrics | null {
  if (!markdown || markdown.startsWith('Error:') || markdown.includes('Error generating report')) {
    return null;
  }

  const total = markdown.match(
    /Total for building over the period:\s*in\s+([\d,]+),\s*out\s+([\d,]+),\s*combined\s+([\d,]+)/i,
  );
  const avgDaily = markdown.match(
    /Average daily:\s*in\s+([\d,.]+),\s*out\s+([\d,.]+),\s*combined\s+([\d,.]+),\s*avg occupancy\s+([\d,.]+)/i,
  );
  const openDays = markdown.match(
    /Open days included:\s*(\d+)\s+out of\s+(\d+)\s+days/i,
  );
  const coverage = markdown.match(
    /Open minutes captured:\s*([\d,]+)\s+of\s+([\d,]+)\s+\(([\d.]+)%\)/i,
  );
  const missing = markdown.match(/Minutes missing during open hours:\s*([\d,]+)/i);
  const confidence = markdown.match(/Confidence rating:\s*(High|Medium|Low)/i);
  const peakDay = markdown.match(/Peak day:\s*\n\s*(.+)/i);
  const peakHour = markdown.match(/Peak hour[^:]*:\s*\n\s*(.+)/i);

  const notesBlock = markdown.match(/Notes:\s*\n((?:\s{2,}-\s.+\n?)+)/i);
  const qualityNotes: string[] = [];
  if (notesBlock) {
    for (const line of notesBlock[1].split('\n')) {
      const n = line.match(/^\s*-\s+(.+)/);
      if (n) qualityNotes.push(n[1].trim());
    }
  }

  if (!total) return null;

  return {
    totalIn: num(total, 1),
    totalOut: num(total, 2),
    combined: num(total, 3),
    avgDailyIn: num(avgDaily, 1),
    avgDailyOut: num(avgDaily, 2),
    avgDailyCombined: num(avgDaily, 3),
    avgOccupancy: num(avgDaily, 4),
    openDays: num(openDays, 1),
    totalDays: num(openDays, 2),
    observedMinutes: num(coverage, 1),
    expectedMinutes: num(coverage, 2),
    coverage: coverage ? Number(coverage[3]) / 100 : 0,
    missingMinutes: num(missing, 1),
    confidence: (confidence?.[1] as ReportMetrics['confidence']) ?? 'Unknown',
    qualityNotes,
    peakDay: peakDay?.[1]?.trim() === 'n/a' ? null : peakDay?.[1]?.trim() ?? null,
    peakHour: peakHour?.[1]?.trim() === 'n/a' ? null : peakHour?.[1]?.trim() ?? null,
  };
}

/** Lightweight parse of the foot-traffic summary format. */
export function parseFootTraffic(text: string): Partial<ReportMetrics> | null {
  if (!text || text.startsWith('Error:')) return null;
  const entries = text.match(/Total Entries[^:]*:\s*([\d,]+)/i);
  const exits = text.match(/Total Exits[^:]*:\s*([\d,]+)/i);
  const combined = text.match(/Total Combined Activity:\s*([\d,]+)/i);
  const avg = text.match(/Average Daily Entries:\s*([\d,.]+)/i);
  if (!entries) return null;
  return {
    totalIn: num(entries, 1),
    totalOut: num(exits, 1),
    combined: num(combined, 1),
    avgDailyIn: num(avg, 1),
  };
}

export function formatInt(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '—';
  return Math.round(n).toLocaleString('en-US');
}

export function formatDecimal(n: number | null | undefined, digits = 1): string {
  if (n == null || Number.isNaN(n)) return '—';
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatPct(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return '—';
  return `${(n * 100).toFixed(1)}%`;
}
