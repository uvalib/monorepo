#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { Command } = require('commander');

const program = new Command();

program
  .name('pdf-split')
  .description('Split a PDF into single-page PDFs')
  .argument('<input>', 'Path to input PDF file')
  .option('-o, --output <dir>', 'Output directory', '.')
  .action(async (input, options) => {
    const inputPath = path.resolve(input);
    const outputDir = path.resolve(options.output);

    if (!fs.existsSync(inputPath)) {
      console.error(`Input file not found: ${inputPath}`);
      process.exit(1);
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const data = fs.readFileSync(inputPath);
    const srcDoc = await PDFDocument.load(data);
    const totalPages = srcDoc.getPageCount();

    for (let i = 0; i < totalPages; i++) {
      const newDoc = await PDFDocument.create();
      const [page] = await newDoc.copyPages(srcDoc, [i]);
      newDoc.addPage(page);

      const pdfBytes = await newDoc.save();
      const baseName = path.basename(inputPath, path.extname(inputPath));
      const outPath = path.join(outputDir, `${baseName}-page-${i + 1}.pdf`);

      fs.writeFileSync(outPath, pdfBytes);
      console.log(`Written: ${outPath}`);
    }
  });

program.parse(process.argv);
