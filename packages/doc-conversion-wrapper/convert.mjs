#!/usr/bin/env node

import mammoth from 'mammoth';
import TurndownService from 'turndown';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { execSync } from 'child_process';
import sharp from 'sharp';
import crypto from 'crypto';
import dotenv from 'dotenv';

import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const llmConfig = {
    'openai': {
        maxInputTokens: 15000 // Adjust based on the actual limit for GPT-4
    },
    'openai4': {
        model: 'gpt-4',
        maxInputTokens: 15000 // Adjust based on the actual limit for GPT-4
    },
};

function generateHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

// Construct the path to the .env file relative to the script's location
const envPath = path.resolve(path.dirname(import.meta.url.replace('file://', '')), '../../.env');

// Check if the .env file exists
if (fs.existsSync(envPath)) {
    // If it exists, load the .env file
    dotenv.config({ path: envPath });
} else {
    console.log('.env file not found, skipping dotenv configuration.');
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
    .option('llm', {
        alias: 'l',
        type: 'string',
        description: 'LLM to use (openai or openai4)',
        default: 'openai'
    })    
    .option('prompts', {
        alias: 'p',
        type: 'array',
        description: 'LLM prompts to be run on the converted markdown',
    })
    .argv;

// Retrieve the file paths from the command line arguments
const docPaths = argv._;
const outDir = argv.outdir;
const overwrite = argv.overwrite;

let modelConfig = llmConfig[argv.llm] || llmConfig['openai'];
let model = new ChatOpenAI(modelConfig);

let maxInputTokens = modelConfig.maxInputTokens;

if (!docPaths.length) {
    console.error('Please provide a .docx or .tei file path or pattern as an argument.');
    process.exit(1);
}

docPaths.forEach(async (docPath) => {
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

    let markdown;
    if (parsedPath.ext === '.docx') {
        // If it's a .docx file, use Mammoth to convert to HTML
        const result = await mammoth.convertToHtml({ path: docPath }, {
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
        });

        // Check if there are any warnings and print them
        if (result.messages.length) {
            console.warn("Conversion warnings for file", docPath);
            result.messages.forEach((message) => console.warn(message.message));
        }

        // Convert the HTML to markdown
        markdown = turndownService.turndown(result.value);
    } else if (parsedPath.ext === '.tei') {
        // If it's a .tei file, use Docker and the Saxon HE jar to convert to HTML
        const htmlFilePath = path.join(outputDirectory, `${parsedPath.name}.html`);
        const absoluteDocPath = path.resolve(docPath);
        const absoluteStylesheetPath = path.resolve(__dirname, 'tei2html.xsl');
        const command = `docker run -v "${path.dirname(absoluteDocPath)}:/data" -v "${path.dirname(absoluteStylesheetPath)}:/styles" saxon-debian -s:/data/${path.basename(docPath)} -xsl:/styles/tei2html.xsl -o:/data/${path.basename(htmlFilePath)}`;

        execSync(command);

        // Read the generated HTML file
        const html = fs.readFileSync(path.join(path.dirname(absoluteDocPath), path.basename(htmlFilePath)), 'utf8');

        // Convert the HTML to markdown
        markdown = turndownService.turndown(html);

        // Delete the HTML file
        fs.unlinkSync(path.join(path.dirname(absoluteDocPath), path.basename(htmlFilePath)));
    } else {
        console.error(`Unsupported file extension: ${parsedPath.ext}`);
        return;
    }

    if (argv.prompts) {
        for (const promptText of argv.prompts) {
            // Split the markdown document into chunks
            const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
                chunkSize: maxInputTokens - 1000, // Leave some space for the prompt
                chunkOverlap: 100,
            });
            const chunks = await splitter.createDocuments([markdown]);

// Process each chunk
for (const [index, chunk] of chunks.entries()) {
    const chunkPrompt = `Process the following chunk of a markdown document:\n\n${chunk.pageContent}\n\n${promptText}`;
    console.log(`Chunk prompt for chunk ${index + 1}:`, chunkPrompt); // Add this line for debugging
const promptTemplate = PromptTemplate.fromTemplate(chunkPrompt);


    const chain = promptTemplate.pipe(model);
    const result = await chain.invoke();
    console.log(`Processed chunk ${index + 1} of ${chunks.length}:`, result.choices[0].text);
}


        }
    }

    // Write the final result to a file
    fs.writeFileSync(newFilePath, markdown);
    console.log(`Markdown file created at ${newFilePath}`);
});
