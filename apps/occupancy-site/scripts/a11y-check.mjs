/**
 * Accessibility checks for the occupancy site.
 *
 * Uses Lighthouse (automated a11y category) + axe-core (WCAG 2 A/AA).
 *
 * Usage:
 *   node scripts/a11y-check.mjs
 *   node scripts/a11y-check.mjs --base https://d2wwhxepx1jqa4.cloudfront.net
 *   node scripts/a11y-check.mjs --base http://127.0.0.1:4321
 */

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'tmp/lighthouse');

function parseArgs(argv) {
  let base = 'https://d2wwhxepx1jqa4.cloudfront.net';
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--base') base = argv[++i].replace(/\/$/, '');
  }
  return { base };
}

const PATHS = [
  { path: '/', name: 'home' },
  { path: '/methodology/', name: 'methodology' },
  { path: '/libraries/clemons/', name: 'libraries_clemons' },
  { path: '/reports/clemons/2025-06/', name: 'report_clemons' },
];

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], ...opts });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

async function lighthousePage(base, page) {
  const out = path.join(OUT, `${page.name}.json`);
  const url = `${base}${page.path}`;
  const args = [
    'lighthouse',
    url,
    '--only-categories=accessibility',
    '--chrome-flags=--headless --no-sandbox --disable-gpu',
    '--output=json',
    `--output-path=${out}`,
    '--quiet',
    '--preset=desktop',
  ];
  const result = await run('npx', args, { cwd: ROOT, env: process.env });
  if (result.code !== 0) {
    throw new Error(`Lighthouse failed for ${url}: ${result.stderr || result.stdout}`);
  }
  const data = JSON.parse(readFileSync(out, 'utf8'));
  const score = data.categories?.accessibility?.score;
  const fails = Object.entries(data.audits || {})
    .filter(
      ([, a]) =>
        a.score != null &&
        a.score < 1 &&
        !['manual', 'notApplicable', 'informative'].includes(a.scoreDisplayMode),
    )
    .map(([id, a]) => ({ id, title: a.title, score: a.score }));
  return { url, score, fails, out };
}

async function axePages(base) {
  // Dynamic import so the script can still run Lighthouse if puppeteer isn't installed
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
  } catch {
    console.warn('puppeteer not installed — skipping axe-core scan (npm i -D puppeteer axe-core)');
    return [];
  }
  const require = createRequire(import.meta.url);
  let axePath;
  try {
    axePath = require.resolve('axe-core');
  } catch {
    console.warn('axe-core not installed — skipping axe-core scan');
    return [];
  }
  const axeSource = readFileSync(axePath, 'utf8');
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const results = [];
  try {
    for (const page of PATHS) {
      const url = `${base}${page.path}`;
      const tab = await browser.newPage();
      await tab.setViewport({ width: 1280, height: 800 });
      await tab.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await tab.evaluate(axeSource);
      const axe = await tab.evaluate(async () => {
        // eslint-disable-next-line no-undef
        return await axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
          },
        });
      });
      results.push({
        url,
        violations: axe.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.slice(0, 5).map((n) => n.target),
        })),
        incomplete: axe.incomplete.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.slice(0, 5).map((n) => n.target),
        })),
      });
      await tab.close();
    }
  } finally {
    await browser.close();
  }
  return results;
}

async function main() {
  const { base } = parseArgs(process.argv);
  mkdirSync(OUT, { recursive: true });
  console.log(`A11y check base: ${base}`);

  const lh = [];
  for (const page of PATHS) {
    process.stdout.write(`Lighthouse ${page.path} ... `);
    const r = await lighthousePage(base, page);
    lh.push(r);
    console.log(r.score == null ? 'n/a' : `${Math.round(r.score * 100)}`);
    for (const f of r.fails) console.log(`  FAIL ${f.id}: ${f.title}`);
  }

  console.log('Running axe-core ...');
  const axe = await axePages(base);
  for (const r of axe) {
    console.log(
      `${r.url}  violations=${r.violations.length} incomplete=${r.incomplete.length}`,
    );
    for (const v of r.violations) {
      console.log(`  VIOLATION [${v.impact}] ${v.id}: ${v.help}`);
    }
    for (const v of r.incomplete) {
      console.log(`  INCOMPLETE [${v.impact}] ${v.id}: ${v.help}`);
    }
  }

  const summary = { base, lighthouse: lh, axe, at: new Date().toISOString() };
  writeFileSync(path.join(OUT, 'a11y-summary.json'), JSON.stringify(summary, null, 2));

  const lhFails = lh.some((r) => (r.fails?.length ?? 0) > 0 || (r.score ?? 1) < 1);
  const axeFails = axe.some((r) => (r.violations?.length ?? 0) > 0);
  if (lhFails || axeFails) {
    console.error('\nAccessibility check failed.');
    process.exit(1);
  }
  console.log('\nAccessibility check passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
