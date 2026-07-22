import type { MonthlyReport, ReportsDataset } from './types';
import { slugifyLibrary } from './libraries';
import reportsData from '../data/reports.json';

const dataset = reportsData as ReportsDataset;

export function loadReports(): ReportsDataset {
  return dataset;
}

export function getReportsForLibrary(slug: string): MonthlyReport[] {
  const data = loadReports();
  return data.reports
    .filter((r) => r.slug === slug)
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

export function getReport(slug: string, monthKey: string): MonthlyReport | undefined {
  const data = loadReports();
  return data.reports.find((r) => r.slug === slug && r.monthKey === monthKey);
}

export function getAllReportPaths(): { slug: string; monthKey: string }[] {
  return loadReports().reports.map((r) => ({
    slug: r.slug,
    monthKey: r.monthKey,
  }));
}

export function libraryTotals(slug: string): {
  totalIn: number;
  totalOut: number;
  monthsWithData: number;
} {
  const reports = getReportsForLibrary(slug);
  let totalIn = 0;
  let totalOut = 0;
  let monthsWithData = 0;
  for (const r of reports) {
    if (r.metrics) {
      totalIn += r.metrics.totalIn;
      totalOut += r.metrics.totalOut;
      monthsWithData += 1;
    }
  }
  return { totalIn, totalOut, monthsWithData };
}

export function latestReport(slug: string): MonthlyReport | undefined {
  const reports = getReportsForLibrary(slug).filter((r) => r.metrics);
  return reports[reports.length - 1];
}

export { slugifyLibrary };
