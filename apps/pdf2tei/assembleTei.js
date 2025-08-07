#!/usr/bin/env node
/*
 * assembleTei.js
 * --------------
 * Assemble the final TEI document from:
 *   • teiHeader fragment (required)
 *   • front fragment     (optional)
 *   • body fragment(s)   (optional, already wrapped in <body> or plaintext)
 *   • back fragment      (optional)
 *
 * Usage:
 *   node assembleTei.js --header book.teiHeader.xml --front book.front.xml --body tei.xml --back book.back.xml -o final.xml
 */

import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { fileURLToPath } from 'url';

function readIf(file) {
  return file && fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trim() : '';
}

function assemble({ header, front, body, back, output }) {
  if (!header) throw new Error('teiHeader fragment is required');

  const parts = [];
  parts.push('<?xml version="1.0" encoding="UTF-8"?>');
  parts.push('<TEI xmlns="http://www.tei-c.org/ns/1.0">');
  parts.push(header.trim());
  parts.push('<text>');
  if (front) parts.push(front.trim());
  if (body) {
    const bodyContent = body.trim();
    // Ensure wrapped in <body> … </body>
    if (/^<body[ >]/i.test(bodyContent)) {
      parts.push(bodyContent);
    } else {
      parts.push('<body>');
      parts.push(bodyContent);
      parts.push('</body>');
    }
  }
  if (back) parts.push(back.trim());
  parts.push('</text>');
  parts.push('</TEI>');

  // Join parts and perform XML cleanup before writing
  const rawXml = parts.join('\n');
  const safeXml = rawXml
    .replace(/& /g, '&amp; ')
    .replace(/&rsquo;/g, "'")
    .replace(/xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
  fs.writeFileSync(output, safeXml, 'utf8');
  console.log(`Written complete TEI to ${output}`);
}

const program = new Command();
program
  .name('tei-assemble')
  .description('Assemble final TEI document from component fragments')
  .requiredOption('--header <file>', 'teiHeader fragment XML')
  .option('--front <file>', 'front fragment XML')
  .option('--body <file>', 'body XML or fragment already inside <body>')
  .option('--back <file>', 'back fragment XML')
  .option('-o, --output <file>', 'Output TEI file', 'final-transcription.tei.xml')
  .action(opts => {
    try {
      assemble({
        header: readIf(opts.header),
        front: readIf(opts.front),
        body: readIf(opts.body),
        back: readIf(opts.back),
        output: path.resolve(opts.output)
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
