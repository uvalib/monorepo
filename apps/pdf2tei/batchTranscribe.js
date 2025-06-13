#!/usr/bin/env node
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { transcribePDF } from './transcribe.js';

async function main() {
  const pagesDir = path.resolve('book-pages');
  const outputDir = path.resolve('fragments');
  if (!fs.existsSync(pagesDir)) {
    console.error(`Pages directory not found: ${pagesDir}`);
    process.exit(1);
  }
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Read and sort PDF files by numeric page number
  const files = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.pdf'))
    .sort((a, b) => {
      const aMatch = a.match(/(\d+)/);
      const bMatch = b.match(/(\d+)/);
      const aNum = aMatch ? parseInt(aMatch[1], 10) : 0;
      const bNum = bMatch ? parseInt(bMatch[1], 10) : 0;
      return aNum - bNum;
    });

  // Find starting index
  const startFile = 'book-page-7.pdf';
  const startIndex = files.indexOf(startFile);
  if (startIndex === -1) {
    console.error(`Start file not found in pages directory: ${startFile}`);
    process.exit(1);
  }

  let pageNum = 1;
  for (let i = startIndex; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(pagesDir, file);
    const outputFile = path.join(outputDir, `fragment-${pageNum}.json`);
    // Skip if fragment already exists
    if (fs.existsSync(outputFile)) {
      console.log(`Skipping ${file} as fragment already exists: ${outputFile}`);
      pageNum++;
      continue;
    }
    console.log(`Transcribing ${file} as page ${pageNum}...`);
    try {
      await transcribePDF(inputPath, pageNum, outputFile);
      console.log(`Wrote fragment to ${outputFile}`);
    } catch (err) {
      console.error(`Error on page ${pageNum} (${file}):`, err.message);
      process.exit(1);
    }
    pageNum++;
  }
}

main();
