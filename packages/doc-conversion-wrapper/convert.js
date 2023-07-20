#!/usr/bin/env node

const mammoth = require('mammoth');
const TurndownService = require('turndown');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { execSync } = require('child_process');

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
const docPaths = argv._;
const outDir = argv.outdir;
const overwrite = argv.overwrite;

if (!docPaths.length) {
    console.error('Please provide a .docx or .tei file path or pattern as an argument.');
    process.exit(1);
}

docPaths.forEach(docPath => {
    // Derive the new file path
    const parsedPath = path.parse(docPath);
    const outputDirectory = outDir || parsedPath.dir;

    // If output directory does not exist, create it
    if (!fs.existsSync(outputDirectory)) {
        console.log(outputDirectory);
        fs.mkdirSync(outputDirectory, { recursive: true });
    }

    const newFilePath = path.join(outputDirectory, `${parsedPath.name}.md`);

    // Check if file exists and if overwrite flag is not set
    if (fs.existsSync(newFilePath) && !overwrite) {
        console.log(`File already exists and overwrite flag is not set. Skipping conversion for ${newFilePath}.`);
        return;
    }

    if (parsedPath.ext === '.docx') {
        // If it's a .docx file, use Mammoth to convert to HTML
        mammoth.convertToHtml({ path: docPath })
            .then(result => {
                const html = result.value;
                const messages = result.messages;
                
                // Check if there are any warnings and print them
                if (messages.length) {
                    console.warn("Conversion warnings for file", docPath);
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
    } else if (parsedPath.ext === '.tei') {
        // If it's a .tei file, use Docker and the Saxon HE jar to convert to HTML
        const htmlFilePath = path.join(outputDirectory, `${parsedPath.name}.html`);

        try {
            const absoluteDocPath = path.resolve(docPath);
            const command = `docker run -v "${path.dirname(absoluteDocPath)}:/data" saxon-debian -s:/data/${path.basename(docPath)} -xsl:/data/tei2html.xsl -o:/data/${path.basename(htmlFilePath)}`;


            execSync(command);

            // Read the generated HTML file
            const html = fs.readFileSync(path.join(path.dirname(absoluteDocPath), path.basename(htmlFilePath)), 'utf8');

            // Convert the HTML to markdown
            const markdown = turndownService.turndown(html);

            // Write the markdown to a file
            fs.writeFileSync(newFilePath, markdown);

            // Delete the HTML file
            fs.unlinkSync(path.join(path.dirname(absoluteDocPath), path.basename(htmlFilePath)));

            console.log(`Markdown file created at ${newFilePath}`);
        } catch (err) {
            console.error('An error occurred:', err);
        }
    } else {
        console.error(`Unsupported file extension: ${parsedPath.ext}`);
    }
});
