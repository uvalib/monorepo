#!/usr/bin/env node
/*
 * frontBuilder.js
 * ----------------
 * Build the <teiHeader> element and the <front> element for a book
 * automatically, using the PDF pages identified as "front" matter in the
 * outline JSON produced by outlineBook.js.
 *
 * The script will:
 *   1. Read <book>.outline.json.
 *   2. Identify all OutlineSection entries with section === 'front' (case-insensitive match).
 *   3. Extract plain-text from the corresponding page range (pdf2json).
 *   4. Ask the LLM to produce *two* TEI fragments in a structured response:
 *        {
 *           "teiHeader": "<teiHeader>…</teiHeader>",
 *           "front": "<front>…</front>"  // containing titlePage, etc.
 *        }
 *   5. Write validated results to:
 *        • <book>.teiHeader.xml
 *        • <book>.front.xml
 *        • <book>.front.json   (raw structured JSON)
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

function sanitizeTei(xml) {
  let cleaned = xml.replace(/&nbsp;/g, '&#160;');
  cleaned = cleaned.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+);)/g, '&amp;');
  return cleaned.trim();
}
import { fileURLToPath } from 'url';

function readOutline(outlinePath) {
  const raw = fs.readFileSync(outlinePath, 'utf8');
  const obj = JSON.parse(raw);
  if (!Array.isArray(obj.outline)) {
    throw new Error(`Invalid outline JSON; expected { outline: […] }`);
  }
  return obj.outline;
}

function extractPagesText(pdfPath, startPage, endPage) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on('pdfParser_dataError', err => reject(err));
    pdfParser.on('pdfParser_dataReady', data => {
      const pages = data.formImage?.Pages || data.Pages || [];
      const pageTexts = [];
      for (let idx = startPage - 1; idx < endPage && idx < pages.length; idx++) {
        const page = pages[idx];
        let txt = '';
        for (const t of page.Texts) {
          for (const r of t.R) {
            txt += decodeURIComponent(r.T);
          }
          txt += '\n';
        }
        pageTexts.push(txt.trim());
      }
      resolve(pageTexts);
    });
    pdfParser.loadPDF(pdfPath);
  });
}

async function buildFront({ pdfPath, outlinePath, outputPrefix }) {
  const outline = readOutline(outlinePath);
  const frontSections = outline.filter(o => /front/i.test(o.section));
  if (!frontSections.length) {
    throw new Error('No front-matter sections found in the outline.');
  }

  const startPage = frontSections[0].startPage;
  const endPage = frontSections[frontSections.length - 1].endPage;

  console.log(`Front matter spans pages ${startPage}-${endPage}. Extracting text…`);
  const pageTexts = await extractPagesText(pdfPath, startPage, endPage);

  const plainText = pageTexts.join('\n\n');

  // Build roman numeral mapping for page breaks (i, ii, iii, …)
  const toRoman = (num) => {
    const numerals = [
      [1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'],
      [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'],
      [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']
    ];
    let result = '';
    for (const [value, numeral] of numerals) {
      while (num >= value) {
        result += numeral;
        num -= value;
      }
    }
    return result;
  };

  const romanMap = Array.from({ length: endPage - startPage + 1 }, (_, idx) => ({
    page: startPage + idx,
    roman: toRoman(idx + 1),
    blank: pageTexts[idx].length === 0
  }));

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const openai = new OpenAI({ apiKey });

  const systemPrompt = `You are an expert in TEI-P5 encoding for scholarly books.`;
  const userPrompt = `Using the following plain text extracted from the book’s front matter, create two distinct TEI fragments:

1. A complete <teiHeader> suitable for a standalone TEI document (include fileDesc, titleStmt, publicationStmt, etc.).
2. A <front> element containing title pages, table of contents, preliminary material, etc., properly encoded.

Return STRICT JSON matching this TypeScript interface (no markdown fences):
interface Output { teiHeader: string; front: string; }

Plain text from front matter (pages ${startPage}-${endPage}):
${plainText}`;

  const pbInstruction = `Insert a <pb n="…"/> tag **at the start of every page** according to this list (roman numerals lower-case). If blank is true, mark the page as blank with <pb n="…" rend="blank"/> and do not include any other content for that page.\n${JSON.stringify(romanMap)}\n`;

  const cleanupInstruction = `\nWhile converting, remove duplicate lines, stray single letters, or OCR noise such as isolated 'S S N N'. Preserve meaningful content, line breaks (<lb/>), italics/bold smallcaps etc. Ensure well-formed TEI, following the example front matter in full-sample.tei.xml.`;

  const finalPrompt = userPrompt + '\n' + pbInstruction + cleanupInstruction;

  const OutputSchema = z.object({
    teiHeader: z.string().min(10),
    front: z.string().min(10)
  });

  console.log('Requesting TEI header + front from OpenAI…');
  const parsed = await openai.responses.parse({
    model: 'o3',
    input: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: finalPrompt }
    ],
    text: { format: zodTextFormat(OutputSchema, 'output') }
  });

  const { teiHeader, front } = parsed.output_parsed;
  const sanitizedHeader = sanitizeTei(teiHeader);
  const sanitizedFront = sanitizeTei(front);

  const parser = new XMLParser();
  try {
    parser.parse(`<root>${sanitizedHeader}${sanitizedFront}</root>`);
  } catch (e) {
    console.warn('Warning: generated TEI fragments are not well-formed:', e.message);
  }

  fs.writeFileSync(`${outputPrefix}.front.json`, JSON.stringify(parsed.output_parsed, null, 2));
  fs.writeFileSync(`${outputPrefix}.teiHeader.xml`, sanitizedHeader);
  fs.writeFileSync(`${outputPrefix}.front.xml`, sanitizedFront);

  console.log(`Wrote ${outputPrefix}.teiHeader.xml and ${outputPrefix}.front.xml`);
}

// ------------- CLI -------------
const program = new Command();
program
  .name('pdf-front')
  .description('Generate <teiHeader> and <front> TEI fragments from front-matter pages.')
  .requiredOption('-p, --pdf <file>', 'PDF file')
  .requiredOption('-o, --outline <json>', 'Outline JSON file produced by pdf-outline')
  .option('-x, --output-prefix <prefix>', 'Prefix for output files')
  .action(async (opts) => {
    const prefix = opts.outputPrefix || path.basename(opts.pdf, path.extname(opts.pdf));
    try {
      await buildFront({
        pdfPath: path.resolve(opts.pdf),
        outlinePath: path.resolve(opts.outline),
        outputPrefix: path.resolve(prefix)
      });
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  });

// execute if called directly
const __filename = fileURLToPath(import.meta.url);
if (path.resolve(process.argv[1]) === __filename) {
  program.parse(process.argv);
}
