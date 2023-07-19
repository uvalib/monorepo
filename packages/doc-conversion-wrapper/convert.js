#!/usr/bin/env node

const mammoth = require('mammoth');
const TurndownService = require('turndown');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const turndownService = new TurndownService();

const argv = yargs(hideBin(process.argv))
    .option('outdir', {
        alias: 'd',
        type: 'string',
        description: 'Output directory for the markdown files',
    })
    .option('overwrite', {
        alias: 'o',
        type: 'boolean',
        description: 'Overwrite existing markdown files',
    })
    .argv;

// Retrieve the file paths from the command line arguments
const docxPaths = argv._;
const outDir = argv.outdir;
const overwrite = argv.overwrite;

if (!docxPaths.length) {
    console.error('Please provide a .docx file path or pattern as an argument.');
    process.exit(1);
}

docxPaths.forEach(docxPath => {
    // Derive the new file path
    const parsedPath = path.parse(docxPath);
    const outputDirectory = outDir || parsedPath.dir;

    // If output directory does not exist, create it
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
    }

    const newFilePath = path.join(outputDirectory, `${parsedPath.name}.md`);

    // Check if file exists and if overwrite flag is not set
    if (fs.existsSync(newFilePath) && !overwrite) {
        console.log(`File already exists and overwrite flag is not set. Skipping conversion for ${newFilePath}.`);
        return;
    }

    mammoth.convertToHtml({ path: docxPath })
        .then(result => {
            const html = result.value;
            const messages = result.messages;
            
            // Check if there are any warnings and print them
            if (messages.length) {
                console.warn("Conversion warnings for file", docxPath);
                messages.forEach((message) => console.warn(message.message));
            }

            // Convert the HTML to markdown
            const markdown = turndownService.turndown(html);

            // Write the markdown to a file
            fs.writeFileSync(newFilePath, markdown);

            console.log(`Markdown file created at ${newFilePath}`);
        })
        .catch(err => {
            console.error('An error occurred:', err);
        });
});
