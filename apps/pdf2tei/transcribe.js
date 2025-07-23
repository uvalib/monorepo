#!/usr/bin/env node
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { OpenAI } from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { fileURLToPath } from 'url';
import PDFParser from 'pdf2json';
import { XMLParser } from 'fast-xml-parser';
import { diffLines } from 'diff';
import { DOMParser, XMLSerializer } from 'xmldom';

// Helper to sanitize XML entities in TEI output
function sanitizeTei(tei) {
  let cleaned = tei.replace(/ /g, ' ');
  cleaned = cleaned.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+);)/g, '&');
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
  return cleaned;
}

// Helper to repair unclosed tags using a stack-based approach
function repairUnclosedTags(tei) {
  const stack = [];
  const selfClosingTags = new Set(['lb', 'pb', 'milestone', 'br']); // Add known self-closing TEI tags
  const tagRegex = /<([\/!]?)([a-zA-Z][a-zA-Z0-9]*)[^>]*?(\/?)>/g;
  let match;
  while ((match = tagRegex.exec(tei)) !== null) {
    const [fullTag, prefix, tagName, selfClose] = match;
    if (prefix === '!' || prefix === '?') continue; // Skip comments, processing instructions
    if (prefix === '/') {
      // Closing tag
      if (stack.length && stack[stack.length - 1] === tagName) {
        stack.pop();
      }
      // Ignore mismatches for repair purposes
    } else {
      // Opening tag
      if (selfClose === '/' || selfClosingTags.has(tagName)) {
        // Self-closing, do nothing
      } else {
        stack.push(tagName);
      }
    }
  }
  let closingTags = '';
  while (stack.length) {
    closingTags += `</${stack.pop()}>`;
  }
  return tei + closingTags;
}

// Helper to validate and repair XML
function validateAndRepairTei(tei, attempt) {
  let repairedTei = tei;
  // First, attempt to repair any unclosed tags
  repairedTei = repairUnclosedTags(repairedTei);

  const parser = new DOMParser({
    errorHandler: {
      warning: () => {},
      error: () => {},
      fatalError: () => {}
    }
  });
  const serializer = new XMLSerializer();
  const doc = parser.parseFromString(repairedTei, 'text/xml');
  const errors = doc.getElementsByTagName('parsererror');

  if (errors.length > 0) {
    console.warn(`XML validation failed on attempt ${attempt} even after repair`);
    return { isValid: false, repairedTei, issues: ['Failed to repair XML'] };
  }
  return { isValid: true, repairedTei: serializer.serializeToString(doc), issues: [] };
}

// Helper function to audit transcription
async function auditTranscription(pdfData, teiXml, pageNumber, openai) {
  console.log(`Starting audit for page ${pageNumber}...`);
  try {
    const parser = new XMLParser();
    parser.parse(teiXml);
    console.log('XML validation passed');
  } catch {
    console.error('XML validation failed');
    return { auditPassed: false, issues: ['Malformed XML'] };
  }
  console.log('Extracting text from PDF JSON');
  const pages = (pdfData.formImage?.Pages || pdfData.Pages) || [];
  let pdfText = '';
  for (const page of pages) {
    for (const textObj of page.Texts) {
      for (const r of textObj.R) {
        pdfText += decodeURIComponent(r.T);
      }
      pdfText += '\n';
    }
  }
  console.log('Extracting text from TEI XML');
  const teiText = teiXml.replace(/<[^>]+>/g, '');
  const wordRegex = /[\p{L}\p{N}]+/gu;
  const pdfWordSet = new Set((pdfText.match(wordRegex) || []).map(w => w.toLowerCase()));
  const shouldIgnoreToken = (tok) => {
    const ignoreSet = new Set(['amp', 'lt', 'gt', 'quot', 'apos', 'nbsp']);
    if (ignoreSet.has(tok)) return true;
    if (/^\d+$/.test(tok)) return true;
    return false;
  };
  const teiTokens = (teiText.match(wordRegex) || []).map((w) => w.toLowerCase());
  const inventedWords = [];
  for (const tok of teiTokens) {
    if (shouldIgnoreToken(tok)) continue;
    if (pdfWordSet.has(tok)) continue;
    const lowerTok = tok.toLowerCase();
    const memo = {};
    const canSegment = (start) => {
      if (start === lowerTok.length) return true;
      if (memo[start] !== undefined) return memo[start];
      for (let end = start + 1; end <= lowerTok.length; end++) {
        const piece = lowerTok.slice(start, end);
        if (pdfWordSet.has(piece) && canSegment(end)) {
          return (memo[start] = true);
        }
      }
      return (memo[start] = false);
    };
    if (!canSegment(0)) {
      inventedWords.push(tok);
      if (inventedWords.length > 50) break;
    }
  }
  if (inventedWords.length > 0) {
    console.warn('Audit failed – TEI introduces new words:', inventedWords.slice(0, 20));
    return {
      auditPassed: false,
      issues: [
        `Transcription contains words not present on PDF page: ${inventedWords.slice(0, 20).join(', ')}${inventedWords.length > 20 ? ', …' : ''}`,
      ],
    };
  }
  console.log('Computing diff between PDF and TEI text');
  const diffs = diffLines(pdfText, teiText);
  const diffText = diffs.map(d => (d.added ? '+' : d.removed ? '-' : ' ') + d.value).join('');
  console.log('Diff preview:', diffText.slice(0, 200), '...');
  const systemPrompt = `You are an auditor checking if differences between extracted PDF text and TEI transcription are acceptable (only header/footer or formatting differences).`;
  const userPrompt = `Diff for page ${pageNumber}:\n${diffText}\n\nRespond with a JSON object: { \"auditPassed\": boolean, \"issues\": string[] }`;
  console.log('Sending audit prompt to LLM');
  const auditResp = await openai.chat.completions.create({
    model: 'o3-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });
  console.log('Received audit response:', auditResp.choices[0].message.content);
  try {
    const auditResult = JSON.parse(auditResp.choices[0].message.content);
    console.log('Parsed audit result:', auditResult);
    return auditResult;
  } catch {
    console.error('Failed to parse audit JSON');
    return { auditPassed: false, issues: ['Invalid audit JSON response'] };
  }
}

// Define schema for structured transcription output
const TranscriptionResult = z.object({
  tei: z.string()
});

// Function to transcribe a single-page PDF into TEI XML
export async function transcribePDF(input, pageNumber, output) {
  const inputPath = path.resolve(input);
  const pdfParser = new PDFParser();
  let pdfData;
  await new Promise((resolve, reject) => {
    pdfParser.on('pdfParser_dataError', err => reject(err));
    pdfParser.on('pdfParser_dataReady', data => { pdfData = data; resolve(); });
    pdfParser.loadPDF(inputPath);
  });
  const pdfJsonString = JSON.stringify(pdfData, null, 2);
  if (!fs.existsSync(inputPath)) throw new Error(`Input PDF not found: ${inputPath}`);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Please set the OPENAI_API_KEY environment variable');
  const openai = new OpenAI({ apiKey });
  const maxAttempts = 5;
  let lastError;
  let result;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`Attempt ${attempt}/${maxAttempts} for page ${pageNumber}`);
    try {
      let userPrompt = `You are a University Librarian and an expert at PDF to TEI transcription.
      It is critical that you faithfully transcribe every formatting detail from the original PDF (italics, bold, underline, smallcaps, superscript, dropcaps, etc.) using the correct TEI tags; do not omit or alter any styling.

Given the attached PDF page, transcribe its content into TEI XML according to these rules:

Use <pb n="${pageNumber}"/> at the start, where ${pageNumber} is the page number.
Mark every line break as <lb/>.
Mark all small caps text with <hi rend="smallcaps">.
Mark all italic text with <hi rend="italic">.
Mark all bold text with <hi rend="bold">.
Mark all underlined text with <hi rend="underline">.
Mark all superscript text with <hi rend="sup">.
Omit headers, footers, page numbers, running heads, and decorative/duplicative content.
Mark up all images and figures:
Use <figure>, include <head> if present, and always provide a <figDesc> describing the image and/or its caption.
Place a comment: <!-- Image link to be added during image export workflow -->
Place each <figure> where the image appears in reading order.
Use <milestone unit="horizontalRule" rend="hr"/> to represent horizontal rules in the text.
For dropcap characters at the start of paragraphs, wrap the initial letter in <hi rend="dropcap">X</hi> before the rest of the text.
If the page contains only an image/figure, only output <pb n="${pageNumber}"/> and <figure>.
If the previous page ended with an open tag (e.g., <p>, <div>), continue inside that tag. Only open or close tags if needed by the text.
Only generate a TEI fragment for inclusion inside the <body> element (do not include document-level containers like <TEI>, <text>, or <body>).
For article titles and headings, wrap the title text in a <head> element (preserving line breaks as <lb/>), and for author bylines, use a <byline> element containing <hi rend="italic">by</hi> followed by a <name type="pname">Author Name</name>.
Escape special characters in text content—&, <, >, ' and "—using XML entities (numeric character reference), and use proper self-closing syntax for empty elements (e.g., <lb/>).
Ensure all open tags are closed at the end of the page so the fragment is well-formed XML. Every element you open must be closed by the end of the fragment; do not leave any tags unclosed.
Ensure the output uses only UTF-8 characters; do not emit characters outside the UTF-8 range.
Read both the attached PDF page and the parsed JSON data to inform your transcription.
Be sure to mark up every line break, bold, and italic text accurately by comparing both the pdf and the json representations of the document.
Be sure to format the TEI XML correctly, with all tags properly opened and closed.
${attempt > 1 ? 'Previous attempt failed due to invalid XML, likely from unclosed tags like <p> or <div>. Ensure every opened tag (e.g., <div>, <p>, <head>, <hi>) is properly closed in the correct nesting order before the end of the fragment.' : ''}

INPUTS:
- Page number: ${pageNumber}
`;
      const fileResp = await openai.files.create({
        file: fs.createReadStream(inputPath),
        purpose: 'user_data'
      });
      const parsed = await openai.responses.parse({
        model: 'o3',
        input: [
          { role: 'user', content: [
              { type: 'input_file', file_id: fileResp.id },
              { type: 'input_text', text: userPrompt },
              { type: 'input_text', text: `PDF JSON parse result:\n${pdfJsonString}` }
            ]
          }
        ],
        text: { format: zodTextFormat(TranscriptionResult, 'transcription') }
      });
      result = parsed.output_parsed;
      console.log('Cleaning up TEI XML entities');
      result.tei = sanitizeTei(result.tei);
      const validationResult = validateAndRepairTei(result.tei, attempt);
      if (!validationResult.isValid) {
        console.warn(`XML validation failed: ${validationResult.issues.join(', ')}`);
        lastError = new Error(`XML validation failed: ${validationResult.issues.join(', ')}`);
        continue;
      }
      const teiXml = validationResult.repairedTei;
      const auditResult = await auditTranscription(pdfData, teiXml, pageNumber, openai);
      console.log(`Audit passed: ${auditResult.auditPassed}`);
      if (auditResult.auditPassed) {
        result.tei = teiXml; // Use the repaired/validated TEI
        result.audit = auditResult;
        const outputData = JSON.stringify(result, null, 2);
        if (output) fs.writeFileSync(path.resolve(output), outputData);
        return result;
      } else {
        console.warn(`Audit failed on attempt ${attempt}:`, auditResult.issues);
        lastError = new Error(`Audit failed on attempt ${attempt}`);
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw new Error(`Transcription audit failed after ${maxAttempts} attempts: ${lastError.message}`);
}

// CLI entrypoint
const program = new Command();
program
  .name('pdf-transcribe')
  .description('Transcribe a single-page PDF into a TEI XML fragment using OpenAI')
  .argument('<input>', 'Path to single-page PDF file')
  .requiredOption('-n, --page-number <number>', 'Page number of this PDF page')
  .option('-o, --output <file>', 'File to write TEI output (default: stdout)')
  .action(async (input, options) => {
    try {
      const result = await transcribePDF(
        input,
        options.pageNumber,
        options.output
      );
      if (options.output) {
        console.log(`TEI fragment written to ${options.output}`);
      } else {
        console.log(result);
      }
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  });

const __filename = fileURLToPath(import.meta.url);
if (path.resolve(process.argv[1]) === __filename) {
  program.parse(process.argv);
}