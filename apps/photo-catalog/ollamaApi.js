import retry from 'retry';
import ollama from 'ollama';
import fs from 'fs';

export async function retryOllamaCall(fn, params, retries = 10) {
    const operation = retry.operation({ retries: retries, factor: 2, minTimeout: 4000, maxTimeout: 60000 });

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

export async function analyzePathAndFilename(filePath, collectionContext) {
    filePath = filePath.replace("/Volumes/lib_content107/Addison_2018", '');
    const prompt = `Analyze the following path and filename to infer the context of the image. Provide a detailed context string based on the directory names and filename.

    Path: ${filePath}
    `;

    const systemPrompt = `
    You are a contextual analyzer. Your task is to analyze file paths and filenames to infer the context of the image. 
    Use directory names and filenames to provide as much context as possible.
    The following rules must be followed or the context will be considered incorrect (and you will be penalized):
    * If the filename is similar to "IMG_1234.jpg" you can infer that the image was taken with a camera and the image number is 1234.
    * If the filename appears to contain a name (e.g. "MarcusHagans_02HiRes_DA.jpg" refers to "Marcus Hagans" and "Michael_Johnson_04HiRes_DA.jpg" refers to "Michael Johnson") you can infer that the image is related to that person.
    * If the filename contains a keyword you can infer that the image is related to that keyword (e.g. "Band_01HiRes_DA.jpg" refers to a band, "Celebration_01HiRes_DA.jpg" refers to a celebration, "Paratrooper_06.jpg" refers to a paratrooper).
    * If the directory name is similar to "Shoots 2022" you can infer that the image was taken in the year 2022.
    * If the directory name is similar to "05-06 Basketball" you can infer that the image is related to basketball and the 2005-2006 season.
    * If the directory name appears to contain two schools (e.g. "UVA vs VT" or "UVA-VT") you can infer that the image is related to a sports event between those schools.
    * If the directory contains a keyword you can infer that the image is related to that keyword (e.g. "Graduation" refers to a graduation event, "Wedding" refers to a wedding event).
    * If the directory name contains what appears to be a Name (e.g. "John Doe") you can infer that the image is related to that person.
    * The directory path can contain multiple levels of directories. Use the directory names to provide additional context.
    * If the filename is more descriptive than what would come from a camera (e.g. "UVA vs VT Football Game 2005.jpg") you can use the filename to infer additional (more specific) context.

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

        ${collectionContext? `
            The following context pertains to the collection this image is part of:
            """${collectionContext}"""    
        `:''}
    `;
    console.log(prompt);

    const response = await retryOllamaCall(
        params => ollama.generate(params),
        {
//            model: 'llama3',
            model: 'gemma2',
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
