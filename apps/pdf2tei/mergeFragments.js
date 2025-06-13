#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Determine directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const fragmentsDir = path.resolve(__dirname, 'fragments');
const outputPath = path.resolve(__dirname, 'tei.xml');
// Ensure fragments directory exists
if (!fs.existsSync(fragmentsDir)) {
  fs.mkdirSync(fragmentsDir, { recursive: true });
}

// Read fragment files, filter and sort by integer
const files = fs.readdirSync(fragmentsDir)
  .filter(f => /^fragment-(\d+)\.json$/.test(f))
  .sort((a, b) => {
    const numA = parseInt(a.match(/fragment-(\d+)\.json/)[1], 10);
    const numB = parseInt(b.match(/fragment-(\d+)\.json/)[1], 10);
    return numA - numB;
  });

// Extract TEI content
const fragments = files.map(f => {
  const fullPath = path.join(fragmentsDir, f);
  const data = fs.readFileSync(fullPath, 'utf8');
  try {
    const json = JSON.parse(data);
    return json.tei;
  } catch (err) {
    console.error(`Error parsing JSON in file ${fullPath}:`, err);
    process.exit(1);
  }
});

// Build TEI document
const xmlParts = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<TEI xmlns="http://www.tei-c.org/ns/1.0">',
  '<text>',
  '<body>'
];
xmlParts.push(...fragments);
xmlParts.push('</body>', '</text>', '</TEI>');

// Write output file
fs.writeFileSync(outputPath, xmlParts.join('\n'), 'utf8');
console.log(`Written TEI document to ${outputPath}`);
