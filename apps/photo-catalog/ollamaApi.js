import retry from 'retry';
import ollama from 'ollama';
import fs from 'fs';

export async function retryOllamaCall(fn, params, retries = 3) {
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

export async function generateEmbeddings(imagePath) {
    const imageBuffer = fs.readFileSync(imagePath);
    const imageData = imageBuffer.toString('base64');

    const response = await retryOllamaCall(
        params => ollama.embeddings(params),
        {
//            model: 'llava-llama3',
            model: 'llava',
            temperature: 0.7,
            prompt: imageData
        }
    );
    return response.embedding;
}

export async function analyzePathAndFilename(filePath) {
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
            model: 'llama3',
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
