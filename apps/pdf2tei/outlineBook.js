#!/usr/bin/env node
/*
 * outlineBook.js
 * ----------------
 * Produce a high-level page-range outline for a multi-page PDF.
 * The script parses the entire PDF with pdf2json, then asks the LLM to
 * produce a concise breakdown such as:
 *   1-6   front matter (title pages, acknowledgements …)
 *   7-290 main body (chapters, articles …)
 *   291-312 back matter (appendix, bibliography, index …)
 * More fine-grained when the model can infer it.
 *
 * Output is returned as JSON and written to <basename>.outline.json by default.
 *
 * Usage:
 *   node outlineBook.js book.pdf   # writes book.outline.json
 *   node outlineBook.js book.pdf -o toc.json
 */

import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { OpenAI } from 'openai';
import PDFParser from 'pdf2json';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';

async function parsePdfToJson(pdfPath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on('pdfParser_dataError', err => reject(err.parserError || err));
    pdfParser.on('pdfParser_dataReady', data => resolve(data));
    pdfParser.loadPDF(pdfPath);
  });
}

function outlineToTei(outlineArray) {
  const indent = (depth) => '  '.repeat(depth);
  const teiLines = [];
  teiLines.push('<?xml version="1.0" encoding="UTF-8"?>');
  teiLines.push('<TEI xmlns="http://www.tei-c.org/ns/1.0">');
  teiLines.push('  <text>');

  const addDiv = (depth, type, n, head) => {
    teiLines.push(`${indent(depth)}<div type="${type}" n="${n}">`);
    teiLines.push(`${indent(depth + 1)}<head>${head}</head>`);
    teiLines.push(`${indent(depth)}</div>`);
  };

  // Partition outline into front/body/back buckets
  const front = outlineArray.filter(o => /front/i.test(o.section));
  const back = outlineArray.filter(o => /back|appendix|index/i.test(o.section));
  const body = outlineArray.filter(o => !front.includes(o) && !back.includes(o));

  if (front.length) {
    teiLines.push('    <front>');
    front.forEach((o, idx) => addDiv(3, 'front', idx + 1, o.description));
    teiLines.push('    </front>');
  }

  if (body.length) {
    teiLines.push('    <body>');
    body.forEach((o, idx) => addDiv(3, 'body', idx + 1, o.description));
    teiLines.push('    </body>');
  }

  if (back.length) {
    teiLines.push('    <back>');
    back.forEach((o, idx) => addDiv(3, 'back', idx + 1, o.description));
    teiLines.push('    </back>');
  }

  teiLines.push('  </text>');
  teiLines.push('</TEI>');
  return teiLines.join('\n');
}

async function generateBookOutline({ inputPdf, outputFile, teiOutput }) {
  if (!fs.existsSync(inputPdf)) {
    throw new Error(`Input PDF not found: ${inputPdf}`);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Please set the OPENAI_API_KEY environment variable');
  }

  console.log('Parsing PDF with pdf2json…');
  const pdfJson = await parsePdfToJson(inputPdf);

  // Build trimmed page text summaries for prompt efficiency
  console.log('Building page summaries…');
  const pages = pdfJson.formImage?.Pages || pdfJson.Pages || [];
  const pageSummaries = pages.map((page, idx) => {
    let text = '';
    for (const textObj of page.Texts) {
      for (const r of textObj.R) {
        text += decodeURIComponent(r.T);
      }
      text += ' ';
    }
    text = text.replace(/\s+/g, ' ').trim();
    const trimmed = text.slice(0, 400); // limit per page
    return { page: idx + 1, text: trimmed };
  });

  const openai = new OpenAI({ apiKey });

  // Zod schema for structured output
  const OutlineSection = z.object({
    section: z.string(),
    description: z.string(),
    startPage: z.number().int().positive(),
    endPage: z.number().int().positive()
  }).refine(d => d.endPage >= d.startPage, { message: 'endPage must be >= startPage' });

  const OutlineResponse = z.object({
    outline: z.array(OutlineSection)
  });

  // Craft prompt
  const systemPrompt = `You are an expert scholarly content analyst.
Using the extracted text from each page of a book (provided below as JSON), identify the major structural divisions and output a concise outline for TEI conversion.

Return a JSON array.  Each element MUST have:
  • section  – short label (front, body, back, chapter, appendix, etc.)
  • description – human-readable description (e.g. "title pages", "chapter 2")
  • startPage – integer (PDF page number starting at 1)
  • endPage   – integer (inclusive)

Begin at page 1 and finish with the last page.  Aim for roughly 10-25 elements.  Respond ONLY with raw JSON.`;

  const userPrompt = `Here is the page summary JSON for the entire PDF book. Using this, create a structured outline in JSON that matches the following TypeScript type:\n\ninterface OutlineSection {\n  section: string;         // short label like \'front\', \'body\', \'back\', \'chapter\', etc.\n  description: string;     // human-readable description of the section\n  startPage: number;       // integer page number (1-based) where the section begins\n  endPage: number;         // integer page number (inclusive) where the section ends\n}\n\nReturn an object shaped as { outline: OutlineSection[] }.\nDo NOT wrap your response in markdown fences.  Produce strictly valid JSON.\n\nHere is the page summary array:\n${JSON.stringify(pageSummaries)}\n`;

  console.log('Requesting outline from OpenAI…');
  const parsedResp = await openai.responses.parse({
    model: 'o3',
    input: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    text: { format: zodTextFormat(OutlineResponse, 'outline') }
  });

  const outlineObj = parsedResp.output_parsed;

  fs.writeFileSync(outputFile, JSON.stringify(outlineObj, null, 2), 'utf8');
  console.log(`Outline written to ${outputFile}`);

  if (teiOutput) {
    const teiStr = outlineToTei(outlineObj.outline);
    fs.writeFileSync(teiOutput, teiStr, 'utf8');
    console.log(`TEI outline written to ${teiOutput}`);
  }
}

// ------------ CLI --------------
const program = new Command();

program
  .name('pdf-outline')
  .description('Create a page-range outline of a multi-page PDF via OpenAI')
  .argument('<pdf>', 'Input PDF file')
  .option('-o, --output <file>', 'Output JSON file')
  .option('--tei <file>', 'Also write a TEI skeleton outline to this file')
  .action(async (pdf, opts) => {
    const outPath = opts.output || `${path.basename(pdf, path.extname(pdf))}.outline.json`;
    try {
      await generateBookOutline({
        inputPdf: path.resolve(pdf),
        outputFile: path.resolve(outPath),
        teiOutput: opts.tei ? path.resolve(opts.tei) : null
      });
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  });

// Only run CLI when executed directly
const __filename = fileURLToPath(import.meta.url);
if (path.resolve(process.argv[1]) === __filename) {
  program.parse(process.argv);
}
