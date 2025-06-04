#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { Command } from 'commander';

// Function to split a PDF into single-page files
export async function splitPDF(input, outputDir = '.') {
  const inputPath = path.resolve(input);
  const outDir = path.resolve(outputDir);

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const data = fs.readFileSync(inputPath);
  const srcDoc = await PDFDocument.load(data);
  const totalPages = srcDoc.getPageCount();
  const baseName = path.basename(inputPath, path.extname(inputPath));

  for (let i = 0; i < totalPages; i++) {
    const newDoc = await PDFDocument.create();
    const [page] = await newDoc.copyPages(srcDoc, [i]);
    newDoc.addPage(page);

    const pdfBytes = await newDoc.save();
    const outPath = path.join(outDir, `${baseName}-page-${i + 1}.pdf`);
    fs.writeFileSync(outPath, pdfBytes);
    console.log(`Written: ${outPath}`);
  }
}

// CLI entrypoint
const program = new Command();

program
  .name('pdf-split')
  .description('Split a PDF into single-page PDFs')
  .argument('<input>', 'Path to input PDF file')
  .option('-o, --output <dir>', 'Output directory', '.')
  .action(async (input, options) => {
    try {
      await splitPDF(input, options.output);
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
