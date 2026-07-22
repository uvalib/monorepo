export interface ReportMetrics {
  totalIn: number;
  totalOut: number;
  combined: number;
  avgDailyIn: number;
  avgDailyOut: number;
  avgDailyCombined: number;
  avgOccupancy: number;
  openDays: number;
  totalDays: number;
  observedMinutes: number;
  expectedMinutes: number;
  coverage: number;
  missingMinutes: number;
  confidence: 'High' | 'Medium' | 'Low' | 'Unknown';
  qualityNotes: string[];
  peakDay: string | null;
  peakHour: string | null;
}

export interface MonthlyReport {
  library: string;
  slug: string;
  year: number;
  month: number;
  monthKey: string;
  startDate: string;
  endDate: string;
  error: string | null;
  metrics: ReportMetrics | null;
  markdown: string | null;
}

export interface ReportsDataset {
  fetchedAt: string;
  gateway: string;
  range: {
    start: string;
    end: string;
  };
  libraries: string[];
  months: string[];
  reports: MonthlyReport[];
}
