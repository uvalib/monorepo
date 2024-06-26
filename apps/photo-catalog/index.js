import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { v5 as uuidv5 } from 'uuid';
import { getMetadata } from './metadata.js';
import { processImage } from './imageProcessing.js';
import { retryOllamaCall, generateEmbeddings, analyzePathAndFilename } from './ollamaApi.js';
import { getFriendlyLocationName } from './location.js';
import ollama from 'ollama';

const NAMESPACE_STRING = 'lib.virginia.edu';
const NAMESPACE = uuidv5(NAMESPACE_STRING, uuidv5.DNS);

const argv = yargs(hideBin(process.argv))
    .option('context', {
        alias: 'c',
        type: 'string',
        description: 'Path to a plain text file containing the collection context',
    })
    .option('out', {
        alias: 'o',
        type: 'string',
        description: 'Directory to store generated metadata files',
        default: process.cwd(),
    })
    .demandCommand(1, 'You need to specify the root directory to start processing')
    .help()
    .alias('help', 'h')
    .argv;

const SUPPORTED_RESOLUTIONS = [
    { width: 672, height: 672 },
    { width: 336, height: 1344 },
    { width: 1344, height: 336 }
];

function generateUUID(filePath) {
    return uuidv5(filePath, NAMESPACE);
}

async function processImageFile(filePath, collectionContext) {
    console.log(`Processing image: ${filePath}`);
    const metadata = await getMetadata(filePath);
    console.log(`Extracted metadata for ${filePath}`);
    const uuid = generateUUID(filePath);
    const metadataFilePath = path.join(argv.out, `${uuid}.json`);

    if (fs.existsSync(metadataFilePath)) {
        console.log(`Metadata for ${filePath} already exists. Skipping.`);
        return;
    }

    fs.writeFileSync(metadataFilePath, '{}');
    console.log(`Created placeholder metadata file for ${filePath}`);

    const { resizedImageBuffer, webpImageBuffer } = await processImage(filePath, metadata, SUPPORTED_RESOLUTIONS);

    const tempImagePath = path.join(argv.out, `${uuid}.jpg`);
    fs.writeFileSync(tempImagePath, resizedImageBuffer);
    console.log(`Saved temporary resized image at ${tempImagePath}`);

    const webpImagePath = path.join(argv.out, `${uuid}.webp`);
    fs.writeFileSync(webpImagePath, webpImageBuffer);
    console.log(`Saved WebP image at ${webpImagePath}`);

    const imageData = resizedImageBuffer.toString('base64');

    let locationName = 'Not available';
    if (metadata.GPSLatitude && metadata.GPSLongitude) {
        locationName = await getFriendlyLocationName(metadata.GPSLatitude, metadata.GPSLongitude);
        console.log(`Friendly location name: ${locationName}`);
    }

    const inferredContext = await analyzePathAndFilename(filePath);

    const systemPrompt = `
    You are a Librarian/cataloger at the University of Virginia. You always use ALA best practices and never infer metadata that is not present in the source material. Your task is to create metadata for images.
    The following rules must be followed or the metadata will be considered incorrect (and you will be penalized):
    * Be as concise as possible. 
    * Try to describe the image as accurately as possible.
    * Be objective and don't make assumptions about the image content that are not obvious.  
    * If text is unclear or unreadable do not attempt to transcribe it.
    * Don't specify timezones when providing dates.
    * Don't provide information that is not present in the image or metadata.

    Feel free to point out details that may be of interest to users, but do not make assumptions about the image content that are not obvious.
    `;
    
    const dateTaken = metadata.DateTimeOriginal;

    const prompt = `
    Based on the following context and metadata, generate a concise and descriptive title, a short description, a detailed description, and as many appropriate categories as you can for the image.

    Date Photo was taken: "${dateTaken}"
    
    ${ locationName && locationName!=="Not available" ? `Location: ${locationName}`:""}

    Template:
    {
      "title": "A concise and descriptive title",
      "shortDescription": "A brief description of the image content",
      "longDescription": "A detailed description of the image content",
      "categories": ["Category1", "Category2", "Category3", "Category4", "Category5", ...]
    }

    The following context was inferred from the path and filename of the image. Use this only when necessary to provide additional context when describing the image.
    Only use this information if it is relevant to the image content (e.g. the image was taken at a specific event or location).
    """${inferredContext}"""
    `;

    console.log(prompt);

    let response;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            response = await retryOllamaCall(
                params => ollama.generate(params),
                {
                    model: 'llava',
                    prompt: prompt,
                    system: systemPrompt,
                    images: [imageData],
                    format: 'json'
                }
            );
            break; // If successful, exit the loop
        } catch (error) {
            console.log(`Attempt ${attempt} failed: ${error.message}`);
            if (attempt === 3) {
                throw error; // Rethrow the error after the final attempt
            }
        }
    }

    console.log(`Generated metadata for ${filePath}`);

    let metadataJson;
    try {
        metadataJson = JSON.parse(response.response);
    } catch (error) {
        console.error("Error parsing JSON response:", error);
        throw error; // Rethrow the error after the final attempt
    }
    metadataJson.exifData = metadata;
    metadataJson.contentUrl = webpImagePath;
    metadataJson.encodingFormat = 'image/webp';
    metadataJson.embedUrl = tempImagePath;
    metadataJson.originalPath = filePath;
    metadataJson.context = inferredContext;
    console.log(`Generating embeddings for ${filePath}`);
    metadataJson.embeddings = await generateEmbeddings(tempImagePath);
    console.log(`Generated embeddings for ${filePath}`);

    fs.writeFileSync(metadataFilePath, JSON.stringify(metadataJson, null, 2));
    console.log(`Metadata for ${filePath} written to ${metadataFilePath}`);

    fs.unlinkSync(tempImagePath);
    console.log(`Deleted temporary resized image at ${tempImagePath}`);
}

async function main() {
    const collectionContext = argv.context ? fs.readFileSync(argv.context, 'utf8') : '';

    const processDirectory = async (dir) => {
        console.log(`Processing directory: ${dir}`);
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);

            if (fs.statSync(filePath).isDirectory()) {
                await processDirectory(filePath);
            } else if (/\.(jpg|jpeg|png|tiff|raw)$/i.test(file)) {
                await processImageFile(filePath, collectionContext);
            }
        }
    };

    const rootDir = argv._[0];
    await processDirectory(rootDir);
    console.log('Processing complete.');
}

main().catch(console.error);
