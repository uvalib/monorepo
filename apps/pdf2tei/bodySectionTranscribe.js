#!/usr/bin/env node
/*
 * bodySectionTranscribe.js
 * ------------------------
 * Iterate through the "body" sections detected in book.outline.json and use
 * the existing transcribePDF() helper to create TEI fragments for each page.
 * After each section is fully processed, merge its page-level fragments into
 * a single TEI fragment (wrapped in <div/> + <head/> if desired) and write it
 * to fragments/<slug>.tei.xml.  These merged section files can later be
 * concatenated to form the <body> of the final TEI document.
 */

import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { transcribePDF } from './transcribe.js';
import { fileURLToPath } from 'url';

// Helper functions for roman numeral conversion
function romanToInt(roman) {
  const romanMap = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
  let num = 0;
  for (let i = 0; i < roman.length; i++) {
    const curr = romanMap[roman[i]?.toUpperCase()] || 0;
    const next = romanMap[roman[i+1]?.toUpperCase()] || 0;
    if (curr < next) {
      num -= curr;
    } else {
      num += curr;
    }
  }
  return num;
}

function intToRoman(num) {
  const romanMap = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' }
  ];
  let result = '';
  for (const { value, symbol } of romanMap) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

function readOutline(outlinePath) {
  const raw = fs.readFileSync(outlinePath, 'utf8');
  const obj = JSON.parse(raw);
  return Array.isArray(obj.outline) ? obj.outline : obj;
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function mergeSectionFragments(sectionDir) {
  const files = fs.readdirSync(sectionDir)
    .filter(f => /fragment-\d+\.json$/.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/(\d+)/)[1]);
      const nb = parseInt(b.match(/(\d+)/)[1]);
      return na - nb;
    });
  const fragments = files.map(f => {
    const data = JSON.parse(fs.readFileSync(path.join(sectionDir, f), 'utf8'));
    return data.tei;
  });
  return fragments.join('\n');
}

async function processBody({ pdfDir, outlinePath, fragmentsRoot, maxPages, bodyOut }) {
  const outline = readOutline(outlinePath);
  const bodySections = outline.filter(o => !/front/i.test(o.section) && !/back|appendix|index/i.test(o.section));
  if (!bodySections.length) {
    console.log('No body sections found in outline.');
    return;
  }

  ensureDir(fragmentsRoot);

  let processedPages = 0;

  const mergedSectionFiles = [];

  for (let idx = 0; idx < bodySections.length; idx++) {
    const sec = bodySections[idx];
    const slug = `${idx + 1}-${slugify(sec.description || sec.section)}`;
    const sectionDir = path.join(fragmentsRoot, slug);
    ensureDir(sectionDir);

    console.log(`\n=== Processing section: ${sec.description} (pages ${sec.startPage}-${sec.endPage}) ===`);

    for (let page = sec.startPage; page <= sec.endPage; page++) {
      if (maxPages && processedPages >= maxPages) {
        console.log(`Reached max-pages limit (${maxPages}). Stopping.`);
        break; // exit page loop; will merge what we have and then break section/outer
      }
      const pdfName = `book-page-${page}.pdf`;
      const pdfPath = path.join(pdfDir, pdfName);
      if (!fs.existsSync(pdfPath)) {
        console.error(`PDF page not found: ${pdfPath}`);
        process.exit(1);
      }

      const fragmentPath = path.join(sectionDir, `fragment-${page}.json`);
      if (fs.existsSync(fragmentPath)) {
        console.log(`Skipping page ${page}; fragment exists.`);
        continue;
      }

      try {
        // Compute logical page label for transcription
        let pageLabel;
        const startLabel = sec.startLabel;
        const offset = page - sec.startPage;
        if (/^\d+$/.test(startLabel)) {
          pageLabel = String(parseInt(startLabel, 10) + offset);
        } else {
          const startNum = romanToInt(startLabel);
          pageLabel = intToRoman(startNum + offset);
        }
        await transcribePDF(pdfPath, pageLabel, fragmentPath);
        processedPages++;
      } catch (e) {
        console.error(`Error transcribing page ${page}:`, e.message);
        process.exit(1);
      }
    }

    // Merge

    const mergedContent = mergeSectionFragments(sectionDir);
    const wrapped = `<div type="section" n="${idx + 1}">\n  <head>${sec.description || sec.section}</head>\n${mergedContent}\n</div>`;
    const mergedFile = path.join(fragmentsRoot, `${slug}.tei.xml`);
    fs.writeFileSync(mergedFile, wrapped, 'utf8');
    mergedSectionFiles.push(mergedFile);
    console.log(`Merged section TEI → ${mergedFile}`);

    if (maxPages && processedPages >= maxPages) {
      console.log('Max-pages reached; stopping further sections.');
      break;
    }
  }

  // Concatenate all merged section files into one body fragment
  if (mergedSectionFiles.length) {
    const combined = mergedSectionFiles
      .map(f => fs.readFileSync(f, 'utf8'))
      .join('\n');
    fs.writeFileSync(bodyOut, `<body>\n${combined}\n</body>`, 'utf8');
    console.log(`Combined body fragment written to ${bodyOut}`);
  }
}

// CLI
const program = new Command();
program
  .name('pdf-body')
  .description('Transcribe body sections according to outline')
  .requiredOption('-d, --pdf-dir <dir>', 'Directory containing single-page PDFs (book-page-<n>.pdf)')
  .requiredOption('-o, --outline <json>', 'Outline JSON file')
  .option('-f, --fragments <dir>', 'Output root directory for fragments', 'fragments')
  .option('-m, --max-pages <n>', 'Maximum number of pages to process (for quick tests)', v => parseInt(v, 10))
  .option('-b, --body-out <file>', 'File to write combined body fragment', 'book.body.xml')
  .action(async opts => {
    try {
      await processBody({
        pdfDir: path.resolve(opts.pdfDir),
        outlinePath: path.resolve(opts.outline),
        fragmentsRoot: path.resolve(opts.fragments),
        maxPages: opts.maxPages,
        bodyOut: path.resolve(opts.bodyOut)
      });
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  });

const __filename = fileURLToPath(import.meta.url);
if (path.resolve(process.argv[1]) === __filename) {
  program.parse(process.argv);
}
