import mammoth from 'mammoth';
import TurndownService from 'turndown';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import libxmljs from 'libxmljs';
import saxonJs from 'saxon-js';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { formatMarkdown as mdAssistantFormat } from '@uvalib/markdown-assistant/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));  // Define __dirname for ES Modules
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
    .option('format', {
        alias: 'f',
        type: 'boolean',
        description: 'Format the markdown using OpenAI'
    })
    .argv;
    
const docPaths = argv._;
const outDir = argv.outdir;
const overwrite = argv.overwrite;

if (!docPaths.length) {
    console.error('Please provide a .docx or .tei file path or pattern as an argument.');
    process.exit(1);
}

docPaths.forEach(async docPath => {
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
            .then(async result => {
                const html = result.value;
                const messages = result.messages;

                if (messages.length) {
                    console.warn("Conversion warnings for file", docPath);
                    messages.forEach((message) => console.warn(message.message));
                }

                const markdown = turndownService.turndown(html);
                fs.writeFileSync(newFilePath, markdown);

                if (argv.format) {
                    await mdAssistantFormat({
                        filePath: newFilePath,
                        output: newFilePath
                    }).catch(err => { console.error(err); })
                    console.log("Markdown formatted with OpenAI.");
                } else {
                    console.log(`Markdown file created at ${newFilePath}`);
                }
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

            // Resolve entities in the source XML since SaxonJS does not...
            const sourceDoc = libxmljs.parseXml(sourceXml, { noblanks: true, nocdata: true, noent: true, dtdattr: true, recover: true });

            let srcDoc = sourceDoc.toString();
            // Remove entities that are not supported by SaxonJS (and no longer available)
            srcDoc = srcDoc.replace(/&resp_transcription_Apex;/ig, '');
            srcDoc = srcDoc.replace(/&resp_markup1_Apex;/ig, '');
            srcDoc = srcDoc.replace(/&resp_markup2_Apex2DLPS;/ig, '');
            srcDoc = srcDoc.replace(/&copy;/ig, '&#169;');
            srcDoc = srcDoc.replace(/&projectDesc;/ig, '');
            srcDoc = srcDoc.replace(/&editorial_.*?;/ig, '');
            srcDoc = srcDoc.replace(/&emsp;/ig, '&#8195;');
            srcDoc = srcDoc.replace(/&mdash/ig, '&#8212;');
            srcDoc = srcDoc.replace(/&frac12;/ig, '&#189;');
            srcDoc = srcDoc.replace(/&eacute;/ig, '&#233;');
            srcDoc = srcDoc.replace(/&pound;/ig, '&#163;');
            srcDoc = srcDoc.replace(/&egrave;/ig, '&#232;');
            srcDoc = srcDoc.replace(/&prime;/ig, '&#8242;');
            srcDoc = srcDoc.replace(/&uuml;/ig, '&#252;');
            srcDoc = srcDoc.replace(/&frac34;/ig, '&#190;');
            srcDoc = srcDoc.replace(/&commat;/ig, '&#64;');
            srcDoc = srcDoc.replace(/&ccedil;/ig, '&#231;');
            srcDoc = srcDoc.replace(/&deg;/ig, '&#176;');
            srcDoc = srcDoc.replace(/&times;/ig, '&#215;');
            srcDoc = srcDoc.replace(/&plus;/ig, '&#43;');
            srcDoc = srcDoc.replace(/&divide;/ig, '&#247;');
            srcDoc = srcDoc.replace(/&minus;/ig, '&#8722;');
            srcDoc = srcDoc.replace(/&frac14;/ig, '&#188;');
            srcDoc = srcDoc.replace(/&Aring;/ig, '&#197;');
            srcDoc = srcDoc.replace(/&agrave;/ig, '&#224;');
            srcDoc = srcDoc.replace(/&dagger;/ig, '&#8224;');
            srcDoc = srcDoc.replace(/&cent;/ig, '&#162;');
            srcDoc = srcDoc.replace(/&ouml;/ig, '&#246;');
            srcDoc = srcDoc.replace(/&sect;/ig, '&#167;');
            srcDoc = srcDoc.replace(/&middot;/ig, '&#183;');
            srcDoc = srcDoc.replace(/&Acirc;/ig, '&#194;');
            srcDoc = srcDoc.replace(/&not;/ig, '&#172;');
            srcDoc = srcDoc.replace(/&plusmn;/ig, '&#177;');
            srcDoc = srcDoc.replace(/&wbull;/ig, '&#8226;');
            srcDoc = srcDoc.replace(/&dtrif;/ig, '&#9662;');
            srcDoc = srcDoc.replace(/&percnt;/ig, '&#37;');
            srcDoc = srcDoc.replace(/&bull;/ig, '&#8226;');
            srcDoc = srcDoc.replace(/&nbsp;/ig, '&#160;');
            srcDoc = srcDoc.replace(/&lowbar;/ig, '&#95;');
            srcDoc = srcDoc.replace(/&rdquo;/ig, '&#8221;');
            srcDoc = srcDoc.replace(/&ldquo;/ig, '&#8220;');
            srcDoc = srcDoc.replace(/&atilde;/ig, '&#195;');
            srcDoc = srcDoc.replace(/&dollar;/ig, '&#36;');
            srcDoc = srcDoc.replace(/&num;/ig, '&#35;');
            srcDoc = srcDoc.replace(/&ast;/ig, '&#42;');
            srcDoc = srcDoc.replace(/&ndash;/ig, '&#8211;');
            srcDoc = srcDoc.replace(/&lpar;/ig, '&#40;');
            srcDoc = srcDoc.replace(/&rpar;/ig, '&#41;');          

            const result = saxonJs.transform({
                stylesheetText: stylesheetXml,
                sourceText: srcDoc,
                destination: "serialized"
            });

            if (!result || !result.principalResult) {
                throw new Error("Transformation failed: No result returned from SaxonJS.");
            }

            const markdown = turndownService.turndown(result.principalResult);
            fs.writeFileSync(newFilePath, markdown);

            console.log("transformed with xsl");

            if (argv.format) {
                await mdAssistantFormat({
                    filePath: newFilePath,
                    output: newFilePath
                }).catch(err => { console.error(err); })
                console.log("Markdown formatted with OpenAI.");
            } else {
                console.log(`Markdown file created at ${newFilePath}`);
            }
        } catch (err) {
            console.error('An error occurred during transformation:', err);
            throw err;
        }
    } else {
        console.error(`Unsupported file extension: ${parsedPath.ext}`);
    }
});