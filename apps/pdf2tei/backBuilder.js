#!/usr/bin/env node
/*
 * backBuilder.js
 * --------------
 * Build the <back> TEI element from pages identified as back matter in the
 * outline.  Similar to frontBuilder but produces only one fragment.
 */

import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import PDFParser from 'pdf2json';
import { OpenAI } from 'openai';
import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';
import { XMLParser } from 'fast-xml-parser';
import { fileURLToPath } from 'url';

function readOutline(outlinePath) {
  const raw = fs.readFileSync(outlinePath, 'utf8');
  const obj = JSON.parse(raw);
  return obj.outline || obj;
}

function extractPagesText(pdfPath, start, end) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on('pdfParser_dataError', err => reject(err));
    pdfParser.on('pdfParser_dataReady', data => {
      const pages = data.formImage?.Pages || data.Pages || [];
      let text = '';
      for (let i = start - 1; i < end && i < pages.length; i++) {
        const page = pages[i];
        for (const t of page.Texts) {
          for (const r of t.R) text += decodeURIComponent(r.T);
          text += '\n';
        }
        text += '\n';
      }
      resolve(text);
    });
    pdfParser.loadPDF(pdfPath);
  });
}

function sanitize(xml) {
  return xml.replace(/&nbsp;/g, '&#160;').replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+);)/g, '&amp;');
}

async function buildBack({ pdfPath, outlinePath, outputFile, maxPages }) {
  const outline = readOutline(outlinePath);
  const backSections = outline.filter(o => /back|appendix|index/i.test(o.section));
  if (!backSections.length) {
    throw new Error('No back matter sections in outline');
  }

  let start = backSections[0].startPage;
  let end = backSections[backSections.length - 1].endPage;

  if (maxPages && maxPages > 0) {
    end = Math.min(end, start + maxPages - 1);
    console.log(`Limiting back-matter to first ${maxPages} pages (${start}-${end}) for test run.`);
  }

  const text = await extractPagesText(pdfPath, start, end);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const openai = new OpenAI({ apiKey });

  const sysPrompt = 'You are a TEI-P5 expert.';
  const userPrompt = `Use the text below (pages ${start}-${end}) to create a well-formed <back> element (including bibliography, index, appendices, etc.). Do not include <teiHeader> or <front>. If the selection is incomplete, output what is available but ensure valid TEI.\nText:\n${text}`;

  const schema = z.object({ back: z.string().min(10) });

  const parsed = await openai.responses.parse({
    model: 'o3-mini',
    input: [
      { role: 'system', content: sysPrompt },
      { role: 'user', content: userPrompt }
    ],
    text: { format: zodTextFormat(schema, 'result') }
  });

  const xml = sanitize(parsed.output_parsed.back);
  // quick validation
  try { new XMLParser().parse(`<root>${xml}</root>`);} catch(e) { console.warn('Back XML not well-formed:', e.message); }

  fs.writeFileSync(outputFile, xml, 'utf8');
  console.log(`Back matter written to ${outputFile}`);
}

// CLI
const program = new Command();
program
  .name('pdf-back')
  .description('Generate <back> TEI fragment from back-matter pages')
  .requiredOption('-p, --pdf <file>', 'PDF file')
  .requiredOption('-o, --outline <json>', 'Outline JSON file')
  .option('-O, --output <file>', 'Output file', 'book.back.xml')
  .option('-m, --max-pages <n>', 'Maximum pages to include (testing)', v => parseInt(v, 10))
  .action(async opts => {
    try {
      await buildBack({
        pdfPath: path.resolve(opts.pdf),
        outlinePath: path.resolve(opts.outline),
        outputFile: path.resolve(opts.output),
        maxPages: opts.maxPages
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
