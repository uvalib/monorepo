#!/usr/bin/env node
import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { OpenAI } from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { fileURLToPath } from 'url';

// Define schema for structured transcription output
const TranscriptionResult = z.object({
  tei: z.string()          // TEI XML fragment
});

// Function to transcribe a single-page PDF into TEI XML
export async function transcribePDF(input, pageNumber, output) {
  const inputPath = path.resolve(input);
  if (!fs.existsSync(inputPath)) throw new Error(`Input PDF not found: ${inputPath}`);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Please set the OPENAI_API_KEY environment variable');

  const pdfBytes = fs.readFileSync(inputPath);
  // Attach PDF file directly as a buffer instead of embedding base64

  // Build the prompt
  let userPrompt = `You are a University Librarian and an expert at PDF to TEI transcription.
 Given the attached PDF page, transcribe its content into TEI XML according to these rules:

Use <pb n="${pageNumber}"/> at the start, where ${pageNumber} is the page number.

Mark every physical line break as <lb/>.

Mark italic text with <hi>.

Mark bold text with <hi rend="bold">.

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
Escape special characters in text content—&, <, >, ' and "—using XML entities (&amp;, &lt;, &gt;, &apos;, &quot;), and use proper self-closing syntax for empty elements (e.g., <lb/>).
Ensure all open tags are closed at the end of the page so the fragment is well-formed XML.
Ensure the output uses only UTF-8 characters; do not emit characters outside the UTF-8 range.

INPUTS:
- Page number: ${pageNumber}
`;
  // No cross-page tag tracking needed, each fragment is self-contained

  const openai = new OpenAI({ apiKey });
  // Upload the PDF page for LLM to process
  const fileResp = await openai.files.create({
    file: fs.createReadStream(inputPath),
    purpose: 'user_data'
  });
  // Parse transcription into structured JSON
  const parsed = await openai.responses.parse({
    model: 'o3',
    input: [
      {
        role: 'user',
        content: [
          { type: 'input_file', file_id: fileResp.id },
          { type: 'input_text', text: userPrompt }
        ]
      }
    ],
    text: {
      format: zodTextFormat(TranscriptionResult, 'transcription')
    }
  });
  const result = parsed.output_parsed;
  const outputData = JSON.stringify(result, null, 2);

  if (output) {
    fs.writeFileSync(path.resolve(output), outputData);
  }
  return result;
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

// Only start CLI when this module is run directly
const __filename = fileURLToPath(import.meta.url);
if (path.resolve(process.argv[1]) === __filename) {
  program.parse(process.argv);
}
