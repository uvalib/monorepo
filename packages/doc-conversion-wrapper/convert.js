#!/usr/bin/env node

const mammoth = require('mammoth');
const TurndownService = require('turndown');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { execSync } = require('child_process');
const sharp = require('sharp'); // Added sharp import

const crypto = require('crypto');

function generateHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

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

    // If output directory does not exist and is not empty, create it
    if (outputDirectory && !fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
    }

    const imgDir = path.join(outputDirectory, 'images');
    if (!fs.existsSync(imgDir)) {
        fs.mkdirSync(imgDir, { recursive: true });
    }


    const newFilePath = path.join(outputDirectory, `${parsedPath.name}.md`);

    // Check if file exists and if overwrite flag is not set
    if (fs.existsSync(newFilePath) && !overwrite) {
        console.log(`File already exists and overwrite flag is not set. Skipping conversion for ${newFilePath}.`);
        return;
    }

    if (parsedPath.ext === '.docx') {
        // If it's a .docx file, use Mammoth to convert to HTML
        mammoth.convertToHtml(
            { path: docPath},
            {   
                
                convertImage: mammoth.images.imgElement(function (image) {
                    return image.read("base64").then(async function (imageBuffer) {
                        const buffer = Buffer.from(imageBuffer, "base64");
                        const hash = generateHash(buffer);
                        const imgPath = path.join(imgDir, `${hash}.webp`);
                
                        // Check if the image file already exists before writing
                        if (!fs.existsSync(imgPath)) {
                            const resizedBuffer = await sharp(buffer)
                                .resize(400) // Set the desired width
                                .webp({ quality: 80 }) // Set the desired format and quality
                                .toBuffer();
                
                            fs.writeFileSync(imgPath, resizedBuffer);
                        }
                
                        return {
                            src: path.relative(outputDirectory, imgPath)
                        };
                    });
                })
                    
/*
            convertImage: mammoth.images.imgElement(function (image) {
                return image.read("base64").then(async function (imageBuffer) {
                    const buffer = Buffer.from(imageBuffer, "base64");
                    const img = await sharp(buffer)
                        .resize(400) // Set the desired width
                        .webp({ quality: 80 }) // Set the desired format and quality
                        .toBuffer()
                        .then(function (resizedBuffer) {
                            return {
                                src: "data:image/webp;base64," + resizedBuffer.toString("base64")
                            };
                        });
                    return img;
                });
            })
*/            
        })
        
        
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
            const absoluteStylesheetPath = path.resolve(__dirname, 'tei2html.xsl');
            const command = `docker run -v "${path.dirname(absoluteDocPath)}:/data" -v "${path.dirname(absoluteStylesheetPath)}:/styles" saxon-debian -s:/data/${path.basename(docPath)} -xsl:/styles/tei2html.xsl -o:/data/${path.basename(htmlFilePath)}`;

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
