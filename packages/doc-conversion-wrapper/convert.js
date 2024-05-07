#!/usr/bin/env node

const mammoth = require('mammoth');
const TurndownService = require('turndown');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const saxonJs = require('saxon-js');
const sharp = require('sharp');

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

const docPaths = argv._;
const outDir = argv.outdir;
const overwrite = argv.overwrite;

if (!docPaths.length) {
    console.error('Please provide a .docx or .tei file path or pattern as an argument.');
    process.exit(1);
}

docPaths.forEach(docPath => {
    const parsedPath = path.parse(docPath);
    const outputDirectory = outDir || parsedPath.dir;

    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
    }

    const newFilePath = path.join(outputDirectory, `${parsedPath.name}.md`);

    if (fs.existsSync(newFilePath) && !overwrite) {
        console.log(`File already exists and overwrite flag is not set. Skipping conversion for ${newFilePath}.`);
        return;
    }

    if (parsedPath.ext === '.docx') {
        mammoth.convertToHtml(
            { path: docPath },
            {
                convertImage: mammoth.images.imgElement(function (image) {
                    return image.read("base64").then(async function (imageBuffer) {
                        const buffer = Buffer.from(imageBuffer, "base64");
                        const img = await sharp(buffer)
                            .resize(400)
                            .webp({ quality: 80 })
                            .toBuffer()
                            .then(function (resizedBuffer) {
                                return {
                                    src: "data:image/webp;base64," + resizedBuffer.toString("base64")
                                };
                            });
                        return img;
                    });
                })
            })
            .then(result => {
                const html = result.value;
                const messages = result.messages;

                if (messages.length) {
                    console.warn("Conversion warnings for file", docPath);
                    messages.forEach((message) => console.warn(message.message));
                }

                const markdown = turndownService.turndown(html);
                fs.writeFileSync(newFilePath, markdown);

                console.log(`Markdown file created at ${newFilePath}`);
            })
            .catch(err => {
                console.error('An error occurred:', err);
            });
    } else if (parsedPath.ext === '.tei') {
        try {
            console.log("attempt to transform");

            const absoluteDocPath = path.resolve(docPath);
            const absoluteStylesheetPath = path.resolve(__dirname, 'tei2html.sef.json');

            const sourceXml = fs.readFileSync(absoluteDocPath, 'utf8');
            const stylesheetXml = fs.readFileSync(absoluteStylesheetPath, 'utf8');

            const result = saxonJs.transform({
                stylesheetText: stylesheetXml,
                sourceText: sourceXml,
                destination: "serialized"
            });

            if (!result || !result.principalResult) {
                throw new Error("Transformation failed: No result returned from SaxonJS.");
            }

            const markdown = turndownService.turndown(result.principalResult);
            fs.writeFileSync(newFilePath, markdown);

            console.log("transformed with xsl");
            console.log(`Markdown file created at ${newFilePath}`);
        } catch (err) {
            console.error('An error occurred during transformation:', err);
            throw err;
        }
    } else {
        console.error(`Unsupported file extension: ${parsedPath.ext}`);
    }
});
