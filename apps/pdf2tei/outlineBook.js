#!/usr/bin/env node
/*
 * outlineBook.js (Improved)
 * ----------------
 * Enhanced for accuracy, styles, validation, chunking, and improved page labels.
 * Now incorporates the table of contents to guide section divisions and page numbering.
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
import pRetry from 'p-retry';
import { XMLValidator } from 'fast-xml-parser';

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
  teiLines.push('  <teiHeader>');
  teiLines.push('    <fileDesc><titleStmt><title>Book Outline (Generated)</title></titleStmt></fileDesc>');
  teiLines.push('  </teiHeader>');
  teiLines.push('  <text>');

  const escapeXml = (str) => str.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/'/g, '\'');

  const addDiv = (depth, type, n, head, startLabel, endLabel) => {
    teiLines.push(`${indent(depth)}<div type="${type}" n="${n}">`);
    if (startLabel) teiLines.push(`${indent(depth + 1)}<pb n="${escapeXml(startLabel)}"/>`);
    teiLines.push(`${indent(depth + 1)}<head>${escapeXml(head)}</head>`);
    if (endLabel) teiLines.push(`${indent(depth + 1)}<pb n="${escapeXml(endLabel)}"/>`);
    teiLines.push(`${indent(depth)}</div>`);
  };

  const front = outlineArray.filter(o => /front/i.test(o.section));
  const back = outlineArray.filter(o => /back|appendix|index/i.test(o.section));
  const body = outlineArray.filter(o => !front.includes(o) && !back.includes(o));

  if (front.length) {
    teiLines.push('    <front>');
    front.forEach((o, idx) => addDiv(3, 'front', idx + 1, o.description, o.startLabel, o.endLabel));
    teiLines.push('    </front>');
  }

  if (body.length) {
    teiLines.push('    <body>');
    body.forEach((o, idx) => addDiv(3, o.section, idx + 1, o.description, o.startLabel, o.endLabel));
    teiLines.push('    </body>');
  }

  if (back.length) {
    teiLines.push('    <back>');
    back.forEach((o, idx) => addDiv(3, 'back', idx + 1, o.description, o.startLabel, o.endLabel));
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

  console.log('Building page summaries and styles…');
  const pages = pdfJson.formImage?.Pages || pdfJson.Pages || [];
  const totalPages = pages.length;
  const pageSummaries = pages.map((page, idx) => {
    let text = '';
    let styles = [];
    let footerTexts = [];
    (page.Texts || []).sort((a, b) => a.y - b.y); // Sort by y asc (bottom first)
    for (const textObj of page.Texts) {
      let objText = '';
      for (const r of textObj.R || []) {
        const decoded = decodeURIComponent(r.T).trim();
        const ts = r.TS || [0, 10, 0, 0];
        styles.push({ text: decoded, bold: ts[2] === 1, italic: ts[3] === 1 });
        objText += decoded + ' ';
        text += decoded + ' ';
      }
      if (textObj.y < 100) { // Footer threshold
        footerTexts.push(objText.trim());
      }
    }
    text = text.replace(/\s+/g, ' ').trim().slice(0, 300);
    const footer = footerTexts.join(' ').trim();
    let pageLabel = null;
    const labelMatch = footer.match(/\b([ivxclmd]+|\d+)\b/i);
    if (labelMatch) {
      const candidate = labelMatch[0].toUpperCase();
      const romanRegex = /^(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3}))$/i;
      if (romanRegex.test(candidate) || /^\d+$/.test(candidate)) {
        pageLabel = candidate;
      }
    }
    return { page: idx + 1, text, styles: styles.slice(0, 10), label: pageLabel };
  });

  // Post-process labels to fill missing sequentially
  let currentLabel = null;
  let isRoman = true;
  let romanCounter = 0;
  let arabicCounter = 0;
  pageSummaries.forEach((p, idx) => {
    if (p.label) {
      currentLabel = p.label;
      if (/^\d+$/.test(currentLabel)) {
        isRoman = false;
        arabicCounter = parseInt(currentLabel, 10);
      } else if (isRoman) {
        romanCounter = romanToInt(currentLabel);
      }
    } else if (currentLabel) {
      if (isRoman) {
        romanCounter++;
        p.label = intToRoman(romanCounter);
      } else {
        arabicCounter++;
        p.label = arabicCounter.toString();
      }
    }
  });

  // Extract table of contents from pages 5 and 6
  const tocPage5 = pageSummaries[4] ? pageSummaries[4].text : '';
  const tocPage6 = pageSummaries[5] ? pageSummaries[5].text : '';
  const tocText = (tocPage5 + '\n' + tocPage6).replace(/\s+/g, ' ').trim();

  const stylesFile = outputFile.replace('.json', '.styles.json');
  fs.writeFileSync(stylesFile, JSON.stringify(pageSummaries, null, 2));

  const openai = new OpenAI({ apiKey });

  const OutlineSection = z.object({
    section: z.enum(['front', 'back', 'article', 'chapter', 'appendix', 'index']),
    description: z.string(),
    startPage: z.number().int().positive(),
    endPage: z.number().int().positive(),
    startLabel: z.string().nullable(),
    endLabel: z.string().nullable()
  }).refine(d => d.endPage >= d.startPage, { message: 'endPage must be >= startPage' });

  const OutlineResponse = z.object({
    outline: z.array(OutlineSection)
  });

  const systemPrompt = `You are an expert scholarly content analyst specializing in academic volumes like journals or essay collections.
Using the extracted text and styles from each page (provided as JSON), identify major structural divisions. For body content in collections, use 'article' for independent papers; 'chapter' for monographs.

Key rules:
- Output UTF-8 only; escape special chars in descriptions (e.g., & to &).
- Use styles (bold, italic) to infer sections (e.g., bold for titles).
- Note cross-page continuations in descriptions if needed (e.g., "Article starts mid-page").
- Cover all provided pages without gaps/overlaps.
- Aim for 10-25 elements; prioritize articles/chapters.
- Use 'label' (roman or arabic page number from footer) for 'startLabel' and 'endLabel' if applicable. Infer missing labels sequentially (roman for front, arabic starting at 1 for body).
- Use the book's table of contents to guide the outline, especially for article divisions, descriptions, and starting labeled pages. Match the TOC entries closely for body sections. Treat each TOC entry as a single 'article' even if it includes handlists or appendices.
- startPage and endPage refer to physical PDF page numbers (1-based, starting from half-title as 1). startLabel and endLabel are the printed page labels (roman for front matter, arabic starting at 1 for body on physical page 7).

Return ONLY raw JSON: { outline: [array] }.`;

  console.log('Requesting outline from OpenAI…');

  let outlineObj = { outline: [] };

  // Chunk for large PDFs
  const chunkSize = 150;
  if (totalPages > chunkSize) {
    console.log(`Large PDF; chunking into ${Math.ceil(totalPages / chunkSize)} parts...`);
    const chunks = [];
    for (let i = 0; i < totalPages; i += chunkSize) {
      chunks.push(pageSummaries.slice(i, i + chunkSize));
    }

    const partialOutlines = await Promise.all(chunks.map(async (chunk, chunkIdx) => {
      const firstPage = chunk[0].page;
      const lastPage = chunk[chunk.length - 1].page;
      const chunkPrompt = `Table of contents from the book: ${tocText}\nPage summaries for physical pages ${firstPage}-${lastPage} (with styles and labels): ${JSON.stringify(chunk)}\nCreate partial outline for this chunk only, matching schema. Use physical start/end, include/infer logical labels. Cover exactly physical ${firstPage} to ${lastPage}. Align with TOC where applicable.`;
      const getPartial = async () => {
        const parsedResp = await openai.responses.parse({
          model: 'o3',
          input: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: chunkPrompt }
          ],
          text: { format: zodTextFormat(OutlineResponse, 'outline') }
        });
        return parsedResp.output_parsed;
      };
      return await pRetry(getPartial, { retries: 3 });
    }));

    // Merge
    const mergePrompt = `Table of contents from the book: ${tocText}\nMerge these partial outlines into one cohesive full outline: ${JSON.stringify(partialOutlines.map(po => po.outline))}\nEnsure no gaps/overlaps in physical pages, consistent sections/descriptions. Full must cover physical 1 to ${totalPages}. Preserve/infer logical labels sequentially (roman for front, arabic starting at 1 for body on physical 7). Adjust boundaries to match content and TOC (e.g., first article ends physical ~111 with label 105). Return full { outline: [array] }.`;
    const getMerged = async () => {
      const parsedResp = await openai.responses.parse({
        model: 'o3',
        input: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: mergePrompt }
        ],
        text: { format: zodTextFormat(OutlineResponse, 'outline') }
      });
      return parsedResp.output_parsed;
    };
    outlineObj = await pRetry(getMerged, { retries: 3 });
  } else {
    const userPrompt = `Table of contents from the book: ${tocText}\nPage summaries (with styles and labels): ${JSON.stringify(pageSummaries)}\nCreate outline matching schema. Use physical start/end, include/infer logical labels (roman for front, arabic starting at 1 for body on physical 7). Ensure accurate ranges (e.g., first article ends physical ~111 with label 105). Align with TOC.`;
    const getOutline = async () => {
      const parsedResp = await openai.responses.parse({
        model: 'o3',
        input: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        text: { format: zodTextFormat(OutlineResponse, 'outline') }
      });
      return parsedResp.output_parsed;
    };
    outlineObj = await pRetry(getOutline, { retries: 3 });
  }

  // Validate ranges
  let lastEnd = 0;
  outlineObj.outline.sort((a, b) => a.startPage - b.startPage);
  for (const sec of outlineObj.outline) {
    if (sec.startPage !== lastEnd + 1) throw new Error('Gap/overlap detected');
    lastEnd = sec.endPage;
  }
  if (lastEnd !== totalPages) throw new Error('Does not cover all pages');

  // Sanitize descriptions
  outlineObj.outline.forEach(sec => {
    sec.description = sec.description.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
  });

  fs.writeFileSync(outputFile, JSON.stringify(outlineObj, null, 2), 'utf8');
  console.log(`Outline written to ${outputFile}`);
  console.log(`Styles written to ${stylesFile}`);

  if (teiOutput) {
    const teiStr = outlineToTei(outlineObj.outline);
    fs.writeFileSync(teiOutput, teiStr, 'utf8');
    console.log(`TEI skeleton written to ${teiOutput}`);

    // Validate TEI for well-formedness
    const validationResult = XMLValidator.validate(teiStr);
    if (validationResult === true) {
      console.log('TEI is well-formed.');
    } else {
      console.warn('TEI is not well-formed:', validationResult.err);
    }
  }
}

// Helper functions for roman numerals
function romanToInt(roman) {
  const romanMap = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
  let num = 0;
  for (let i = 0; i < roman.length; i++) {
    if (romanMap[roman[i]] < romanMap[roman[i + 1]]) {
      num -= romanMap[roman[i]];
    } else {
      num += romanMap[roman[i]];
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
  let roman = '';
  for (const { value, symbol } of romanMap) {
    while (num >= value) {
      roman += symbol;
      num -= value;
    }
  }
  return roman;
}

// CLI unchanged
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

const __filename = fileURLToPath(import.meta.url);
if (path.resolve(process.argv[1]) === __filename) {
  program.parse(process.argv);
}