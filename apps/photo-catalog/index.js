import fs from 'fs';
import path from 'path';
import { v5 as uuidv5 } from 'uuid';
import exifr from 'exifr';
import ollama from 'ollama';
import * as tf from '@tensorflow/tfjs-node';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import sharp from 'sharp';
import retry from 'retry';
import fetch from 'node-fetch';

// Generate a consistent UUID from the string
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

// Supported resolutions for llava-llama3
const SUPPORTED_RESOLUTIONS = [
    { width: 672, height: 672 },
    { width: 336, height: 1344 },
    { width: 1344, height: 336 }
];

async function getMetadata(filePath) {
    const exif = await exifr.parse(filePath, { xmp: true });
    return exif;
}

function generateUUID(filePath) {
    return uuidv5(filePath, NAMESPACE);
}

async function retryOllamaCall(fn, params, retries = 3) {
    const operation = retry.operation({ retries: retries, factor: 2, minTimeout: 1000, maxTimeout: 30000 });

    return new Promise((resolve, reject) => {
        operation.attempt(async currentAttempt => {
            try {
                const response = await fn(params);
                console.log(`Ollama API call succeeded on attempt ${currentAttempt}`);
                resolve(response);
            } catch (err) {
                if (operation.retry(err)) {
                    console.log(`Retrying Ollama API call (attempt ${currentAttempt})...`);
                    return;
                }
                reject(err);
            }
        });
    });
}

async function generateEmbeddings(imagePath) {
    const imageBuffer = fs.readFileSync(imagePath);
    const imageData = imageBuffer.toString('base64');

    const response = await retryOllamaCall(
        params => ollama.embeddings(params),
        {
            model: 'llava-llama3',
            images: [imageData]
        }
    );
    return response.embedding;
}

function getBestResolution(width, height) {
    return SUPPORTED_RESOLUTIONS.reduce((best, res) => {
        const resAspectRatio = res.width / res.height;
        const imageAspectRatio = width / height;
        
        const padWidth = res.width - (res.height * imageAspectRatio);
        const padHeight = res.height - (res.width / imageAspectRatio);

        const padding = Math.max(padWidth, 0) * res.height + Math.max(padHeight, 0) * res.width;

        return padding < best.padding ? { ...res, padding } : best;
    }, { width: 0, height: 0, padding: Infinity });
}

function applyOrientation(image, orientation) {
    switch (orientation) {
        case 'Rotate 90 CW':
            return image.rotate(90);
        case 'Rotate 180':
            return image.rotate(180);
        case 'Rotate 270 CW':
            return image.rotate(270);
        default:
            return image;
    }
}

async function getFriendlyLocationName(lat, lng) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    return data.display_name;
}

async function analyzePathAndFilename(filePath) {
    filePath = filePath.replace("/Volumes/lib_content107/Addison_2018", '');
    const prompt = `Analyze the following path and filename to infer the context of the image. Provide a detailed context string based on the directory names and filename.

    Path: ${filePath}
    `;

    const systemPrompt = `
    You are a contextual analyzer. Your task is to analyze file paths and filenames to infer the context of the image. 
    Use directory names and filenames to provide as much context as possible.

    If the filename is "IMG_1234.jpg" you can infer that the image was taken with a camera and the image number is 1234.
    If the directory name is "Shoots 2022" you can infer that the image was taken in the year 2022.
    If the directory name is "05-06 Basketball" you can infer that the image is related to basketball and the 2005-2006 season.
    If the directory name is "UVa - Wake Forrest" you can infer that the image is related to a sports event between the University of Virginia and Wake Forrest.

    Template:
    """
    {
        "description": "Detailed context string based on the directory names and filename.",
        "event": "Event name or description",
        "teams": ["Team1", "Team2"],
        "season": "Season name or description",
        "filename inference": "Inference based on the filename"
    }
    """

    `;
    console.log(prompt);

    const response = await retryOllamaCall(
        params => ollama.generate(params),
        {
            model: 'llava-llama3',
            prompt: prompt,
            system: systemPrompt,
            format: 'json'
        }
    );

    console.log(response.response);
    const context = response.response;

    console.log(`Inferred context for ${filePath}: ${context}`);
    return context;
}

async function processImage(filePath, collectionContext) {
    console.log(`Processing image: ${filePath}`);
    const metadata = await getMetadata(filePath);
    console.log(`Extracted metadata for ${filePath}`);
    const uuid = generateUUID(filePath);
    const metadataFilePath = path.join(argv.out, `${uuid}.json`);

    if (fs.existsSync(metadataFilePath)) {
        console.log(`Metadata for ${filePath} already exists. Skipping.`);
        return;
    }

    // Create an empty metadata file as a placeholder
    fs.writeFileSync(metadataFilePath, '{}');
    console.log(`Created placeholder metadata file for ${filePath}`);

    // Convert image to JPEG and rotate it if necessary
    let image = sharp(filePath).jpeg();
    if (metadata.Orientation) {
        image = applyOrientation(image, metadata.Orientation);
    }
    const imageBuffer = await image.toBuffer();
    console.log(`Converted and possibly rotated ${filePath} to JPEG format`);

    const { width, height } = await sharp(imageBuffer).metadata();
    const bestRes = getBestResolution(width, height);

    const resizedImageBuffer = await sharp(imageBuffer)
        .resize({
            width: bestRes.width,
            height: bestRes.height,
            fit: 'contain',
            background: { r: 0, g: 0, b: 0 } // Change to white { r: 255, g: 255, b: 255 } if preferred
        })
        .toBuffer();
    console.log(`Resized ${filePath} to best resolution: ${bestRes.width}x${bestRes.height}`);

    // Save the resized image as a temporary file for LLM processing
    const tempImagePath = path.join(argv.out, `${uuid}.jpg`);
    fs.writeFileSync(tempImagePath, resizedImageBuffer);
    console.log(`Saved temporary resized image at ${tempImagePath}`);

    // Create and save a WebP version of the original image resized to a max of 800px
    const webpImageBuffer = await sharp(filePath)
        .resize({ width: 800, height: 800, fit: 'inside' })
        .webp()
        .toBuffer();
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
    Be as concise as possible and never make up data that is not present in the source material. Try to describe the image as accurately as possible.

    Try to be logical in your assessment of the image. If the image is about a basketball game and the person is holding an instrument you can infer that the person is a band member. 
    If the image is about a basketball game and the person is holding a basketball you can infer that the person is a basketball player.
    `;
    
    const prompt = `
    Based on the following context and metadata, generate a concise and descriptive title, a short description, a detailed description and appropriate categories for the image.

    The original path and filename of this image is: "${filePath}"
    In some cases the file path (directory names) and/or filename may provide the only context we have for the image.
    ${inferredContext}

    Date Photo was taken: "${metadata.DateTimeOriginal}"
    
    ${ locationName && locationName!=="Not available" ? `Location: ${locationName}`:""}

    Template:
    {
      "title": "A concise and descriptive title",
      "shortDescription": "A brief description of the image content",
      "longDescription": "A detailed description of the image content",
      "categories": ["Category1", "Category2"]
    }

    `;

    console.log(prompt);

    const response = await retryOllamaCall(
        params => ollama.generate(params),
        {
            model: 'llava-llama3',
            prompt: prompt,
            system: systemPrompt,
            images: [imageData],
            format: 'json'
        }
    );

    console.log(`Generated metadata for ${filePath}`);

    const metadataJson = JSON.parse(response.response);
    metadataJson.exifData = metadata;
    metadataJson.contentUrl = webpImagePath;
    metadataJson.encodingFormat = 'image/webp';
    metadataJson.embedUrl = tempImagePath;
    metadataJson.originalPath = filePath;
    console.log(`Generating embeddings for ${filePath}`);
    metadataJson.embeddings = await generateEmbeddings(tempImagePath);
    console.log(`Generated embeddings for ${filePath}`);

    fs.writeFileSync(metadataFilePath, JSON.stringify(metadataJson, null, 2));
    console.log(`Metadata for ${filePath} written to ${metadataFilePath}`);

    // Delete the temporary image file
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
                await processImage(filePath, collectionContext);
            }
        }
    };

    const rootDir = argv._[0];
    await processDirectory(rootDir);
    console.log('Processing complete.');
}

main().catch(console.error);
