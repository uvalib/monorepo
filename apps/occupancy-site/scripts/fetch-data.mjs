/**
 * Fetch two years of monthly occupancy reports from the UVA Library occupancy MCP gateway.
 *
 * Usage:
 *   node scripts/fetch-data.mjs
 *   node scripts/fetch-data.mjs --concurrency 3
 *   node scripts/fetch-data.mjs --months 24 --library Music
 *
 * Results are written to src/data/reports.json for static site generation.
 *
 * Month window:
 *   Exactly N complete calendar months ending with the previous calendar month
 *   (America/New_York). Every report uses full month start/end dates — never a
 *   partial month cut at a rolling "today − 2 years" day mark.
 *
 * Cache / resume:
 *   Fully closed months may be reused from reports.json.
 *   The most recent month in the window is always re-fetched.
 *   The in-progress current calendar month is never cached (and is not included
 *   in the published window — only complete months appear on the site).
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'src/data/reports.json');

const GATEWAY =
  process.env.OCCUPANCY_MCP_URL ||
  'https://occupancy-reporting-gateway-mohw8c1jug.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp';

const TZ = 'America/New_York';

const LIBRARIES = [
  'Clemons',
  'Fine Arts',
  'Music',
  'Science & Engineering',
  'Shannon',
];

function slugifyLibrary(name) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .replace('science-and-engineering', 'science-engineering');
}

/** Calendar parts in America/New_York (not the host machine's local zone). */
function nyParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

function formatYmd(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function monthKeyString(m) {
  return `${m.year}-${String(m.month).padStart(2, '0')}`;
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Full calendar-month date range (always day 1 through last day of month).
 * Never shortens to "today" — complete months only.
 */
function monthDateRange(m) {
  const startDate = formatYmd(m.year, m.month, 1);
  const endDate = formatYmd(m.year, m.month, daysInMonth(m.year, m.month));
  return { startDate, endDate };
}

/**
 * Rolling window of `count` complete calendar months ending with the previous
 * calendar month in America/New_York.
 * Example (NY date 2026-07-21): 2024-07 … 2026-06 (all full months).
 */
function lastCompleteMonths(count = 24, now = new Date()) {
  const { year: cy, month: cm } = nyParts(now);
  // Previous calendar month (1-based)
  let year = cy;
  let month = cm - 1;
  if (month < 1) {
    month = 12;
    year -= 1;
  }

  const months = [];
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

function currentMonthKey(now = new Date()) {
  const { year, month } = nyParts(now);
  return monthKeyString({ year, month });
}

/**
 * A month may be served from cache only if it is fully closed in NY time
 * (last day of that month is strictly before today) and it is not the most
 * recent month in the published window (always re-fetch latest for freshness).
 */
function shouldUseCache(m, latestMonthKey, now = new Date()) {
  const key = monthKeyString(m);
  if (key === currentMonthKey(now)) return false;
  if (key === latestMonthKey) return false;

  const { year: ty, month: tm, day: td } = nyParts(now);
  const today = formatYmd(ty, tm, td);
  const { endDate } = monthDateRange(m);
  // Fully closed once today is after the month's last calendar day
  return today > endDate;
}

function parseArgs(argv) {
  const opts = { concurrency: 2, months: 24, library: null, resume: true };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--concurrency') opts.concurrency = Number(argv[++i]);
    else if (a === '--months') opts.months = Number(argv[++i]);
    else if (a === '--library') opts.library = argv[++i];
    else if (a === '--no-resume') opts.resume = false;
    else if (a === '--help') {
      console.log(`Usage: node scripts/fetch-data.mjs [options]
  --concurrency N   Parallel MCP calls (default 2)
  --months N         Number of complete calendar months (default 24)
  --library NAME     Only fetch one library
  --no-resume        Ignore existing cache and re-fetch all

Cache policy: fully closed historical months may be resumed from reports.json.
The most recent complete month is always re-fetched. The in-progress current
month is never included (only full calendar months are published).`);
      process.exit(0);
    }
  }
  return opts;
}

async function mcpCall(toolName, args, timeoutMs = 180_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(GATEWAY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: `OccupancyReportingRuntime___${toolName}`,
          arguments: args,
        },
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    const body = await res.json();
    if (body.error) {
      throw new Error(JSON.stringify(body.error));
    }
    const content = body?.result?.content;
    if (Array.isArray(content)) {
      return content.map((c) => c.text ?? '').join('\n');
    }
    return body?.result?.structuredContent?.result ?? '';
  } finally {
    clearTimeout(timer);
  }
}

function num(match, group = 1) {
  if (!match) return 0;
  return Number(String(match[group]).replace(/,/g, ''));
}

function parseOccupancyReport(markdown) {
  if (!markdown || markdown.startsWith('Error:') || markdown.includes('Error generating report')) {
    return null;
  }
  const total = markdown.match(
    /Total for building over the period:\s*in\s+([\d,]+),\s*out\s+([\d,]+),\s*combined\s+([\d,]+)/i,
  );
  const avgDaily = markdown.match(
    /Average daily:\s*in\s+([\d,.]+),\s*out\s+([\d,.]+),\s*combined\s+([\d,.]+),\s*avg occupancy\s+([\d,.]+)/i,
  );
  const openDays = markdown.match(/Open days included:\s*(\d+)\s+out of\s+(\d+)\s+days/i);
  const coverage = markdown.match(
    /Open minutes captured:\s*([\d,]+)\s+of\s+([\d,]+)\s+\(([\d.]+)%\)/i,
  );
  const missing = markdown.match(/Minutes missing during open hours:\s*([\d,]+)/i);
  const confidence = markdown.match(/Confidence rating:\s*(High|Medium|Low)/i);
  const peakDay = markdown.match(/Peak day:\s*\n\s*(.+)/i);
  const peakHour = markdown.match(/Peak hour[^:]*:\s*\n\s*(.+)/i);
  const notesBlock = markdown.match(/Notes:\s*\n((?:\s{2,}-\s.+\n?)+)/i);
  const qualityNotes = [];
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
    confidence: confidence?.[1] ?? 'Unknown',
    qualityNotes,
    peakDay: peakDay?.[1]?.trim() === 'n/a' ? null : peakDay?.[1]?.trim() ?? null,
    peakHour: peakHour?.[1]?.trim() === 'n/a' ? null : peakHour?.[1]?.trim() ?? null,
  };
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let index = 0;
  async function run() {
    while (index < items.length) {
      const i = index++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => run()));
  return results;
}

/** True if stored report uses a full calendar-month end date for its monthKey. */
function isFullMonthReport(r) {
  if (!r?.monthKey || !r?.startDate || !r?.endDate) return false;
  const [y, m] = r.monthKey.split('-').map(Number);
  if (!y || !m) return false;
  const expected = monthDateRange({ year: y, month: m });
  return r.startDate === expected.startDate && r.endDate === expected.endDate;
}

async function main() {
  const opts = parseArgs(process.argv);
  const now = new Date();
  const months = lastCompleteMonths(opts.months, now);
  const latestMonthKey = monthKeyString(months[months.length - 1]);
  const ny = nyParts(now);

  const libraries = opts.library
    ? LIBRARIES.filter(
        (l) =>
          l.toLowerCase() === opts.library.toLowerCase() ||
          slugifyLibrary(l) === opts.library,
      )
    : LIBRARIES;

  if (libraries.length === 0) {
    console.error(`Unknown library: ${opts.library}`);
    process.exit(1);
  }

  const jobs = [];
  for (const library of libraries) {
    for (const m of months) {
      jobs.push({ library, month: m, monthKey: monthKeyString(m), ...monthDateRange(m) });
    }
  }

  /** @type {Map<string, any>} */
  const existing = new Map();
  if (opts.resume && existsSync(OUT)) {
    try {
      const prev = JSON.parse(readFileSync(OUT, 'utf8'));
      let skippedPartial = 0;
      for (const r of prev.reports ?? []) {
        if (!r.metrics && !(r.error && !String(r.error).includes('abort'))) continue;
        if (!isFullMonthReport(r)) {
          skippedPartial++;
          continue;
        }
        existing.set(`${r.slug}/${r.monthKey}`, r);
      }
      console.log(
        `Loaded ${existing.size} full-month cached reports from ${OUT}` +
          (skippedPartial ? ` (ignored ${skippedPartial} partial/malformed)` : ''),
      );
    } catch {
      console.warn('Could not read existing cache; starting fresh.');
    }
  }

  console.log(
    `Fetching ${jobs.length} monthly reports (${libraries.length} libraries × ${months.length} complete months)`,
  );
  console.log(`Gateway: ${GATEWAY}`);
  console.log(`Concurrency: ${opts.concurrency}`);
  console.log(`Timezone: ${TZ} (today ${formatYmd(ny.year, ny.month, ny.day)})`);
  console.log(
    `Range: ${monthKeyString(months[0])} → ${latestMonthKey} (full calendar months only)`,
  );
  console.log(
    `Cache: historical closed months may resume; always re-fetch latest (${latestMonthKey})`,
  );

  let done = 0;
  let fromCache = 0;
  let failed = 0;

  const reports = await mapPool(jobs, opts.concurrency, async (job) => {
    const slug = slugifyLibrary(job.library);
    const cacheKey = `${slug}/${job.monthKey}`;
    const useCache =
      opts.resume &&
      existing.has(cacheKey) &&
      shouldUseCache(job.month, latestMonthKey, now);

    if (useCache) {
      done++;
      fromCache++;
      process.stdout.write(
        `\r[${done}/${jobs.length}] cached ${cacheKey.padEnd(36)} (+${fromCache} cache, ${failed} err)`,
      );
      // Ensure dates are full-month even if older cache had correct metrics
      const cached = existing.get(cacheKey);
      return {
        ...cached,
        startDate: job.startDate,
        endDate: job.endDate,
      };
    }

    const label = `${job.library} ${job.monthKey}`;
    try {
      const markdown = await mcpCall('get_occupancy_report', {
        library: job.library,
        start_date: job.startDate,
        end_date: job.endDate,
      });
      const isError = typeof markdown === 'string' && markdown.trim().startsWith('Error:');
      const metrics = isError ? null : parseOccupancyReport(markdown);
      done++;
      if (isError || !metrics) failed++;
      process.stdout.write(
        `\r[${done}/${jobs.length}] ${label.padEnd(36)} (+${fromCache} cache, ${failed} err)`,
      );
      return {
        library: job.library,
        slug,
        year: job.month.year,
        month: job.month.month,
        monthKey: job.monthKey,
        startDate: job.startDate,
        endDate: job.endDate,
        error: isError ? markdown.trim() : metrics ? null : 'Failed to parse report',
        metrics,
        markdown: isError ? null : markdown,
      };
    } catch (err) {
      done++;
      failed++;
      const message =
        err?.name === 'AbortError' ? 'Request timed out' : String(err?.message ?? err);
      process.stdout.write(
        `\r[${done}/${jobs.length}] FAIL ${label.padEnd(32)} (+${fromCache} cache, ${failed} err)`,
      );
      return {
        library: job.library,
        slug,
        year: job.month.year,
        month: job.month.month,
        monthKey: job.monthKey,
        startDate: job.startDate,
        endDate: job.endDate,
        error: message,
        metrics: null,
        markdown: null,
      };
    }
  });

  process.stdout.write('\n');

  // Keep only this run's month window. When filtering --library, preserve other libraries.
  let allReports = reports;
  if (opts.library && existsSync(OUT)) {
    try {
      const prev = JSON.parse(readFileSync(OUT, 'utf8'));
      const keepSlugs = new Set(libraries.map(slugifyLibrary));
      const monthKeys = new Set(months.map(monthKeyString));
      const others = (prev.reports ?? []).filter(
        (r) =>
          !keepSlugs.has(r.slug) &&
          monthKeys.has(r.monthKey) &&
          isFullMonthReport(r),
      );
      allReports = [...others, ...reports];
    } catch {
      /* ignore */
    }
  }

  // Drop any report outside the current complete-month window
  const allowedMonths = new Set(months.map(monthKeyString));
  allReports = allReports.filter((r) => allowedMonths.has(r.monthKey) && isFullMonthReport(r));

  allReports.sort((a, b) => {
    const c = a.slug.localeCompare(b.slug);
    return c !== 0 ? c : a.monthKey.localeCompare(b.monthKey);
  });

  const dataset = {
    fetchedAt: new Date().toISOString(),
    gateway: GATEWAY,
    timezone: TZ,
    range: {
      start: monthKeyString(months[0]),
      end: latestMonthKey,
    },
    libraries: LIBRARIES,
    months: months.map(monthKeyString),
    reports: allReports,
  };

  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(dataset, null, 2));

  const ok = allReports.filter((r) => r.metrics).length;
  const err = allReports.filter((r) => !r.metrics).length;
  console.log(`Wrote ${OUT}`);
  console.log(
    `Reports with metrics: ${ok}; without: ${err}; from cache this run: ${fromCache}; re-fetched latest month: ${latestMonthKey}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
