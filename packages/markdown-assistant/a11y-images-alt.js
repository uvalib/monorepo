import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { loadEnv, createBatchFile, processMarkdown, readBatchOutput } from './utils.js';
import fs from 'fs/promises';
import path from 'path';
import { visitParents } from 'unist-util-visit-parents';
import { unified } from 'unified';
import markdown from 'remark-parse';
import stringify from 'remark-stringify';
import OpenAI from 'openai';

const DEFAULT_MODEL = 'gpt-4o-mini';
const CHUNK_SIZE = 1;
const LLM_COMMENT = '<!-- altadded -->';

const encodeImage = async (filePath) => {
  if (filePath.startsWith('data:image')) {
    // If the filePath is a base64-encoded image URL, return the base64 data directly
    const base64Data = filePath.split(',')[1];
    return base64Data;
  } else {
    // Otherwise, read the file from the file system
    const imageBuffer = await fs.readFile(filePath);
    return imageBuffer.toString('base64');
  }
};

// Function to find contextual text for images
function findTextContext(node, ancestors) {
  let beforeText = '';
  let afterText = '';
  if (ancestors.length > 0) {
    const parent = ancestors[ancestors.length - 1];
    const index = parent.children.indexOf(node);
    for (let i = index - 1; i >= 0; i--) {
      const child = parent.children[i];
      if (child.type === 'text') beforeText = child.value;
      if (child.type === 'paragraph') beforeText = child.children.find(child => child.type === 'text').value;
    }
    for (let i = index + 1; i < parent.children.length; i++) {
      const child = parent.children[i];
      if (child.type === 'text') afterText = child.value;
      if (child.type === 'paragraph') afterText = child.children.find(child => child.type === 'text').value;
    }
  }
  return { beforeText, afterText };
}

async function processImages({ markdownContent, apiKey, overwrite, model }) {
  const openai = new OpenAI({ apiKey });
  const parser = unified().use(markdown, { commonmark: true }).use(stringify);
  const tree = parser.parse(markdownContent);
  const imageNodes = [];

  visitParents(tree, 'image', (node, ancestors) => {
    const { beforeText, afterText } = findTextContext(node, ancestors);
    imageNodes.push({ node, beforeText, afterText });
  });

  for (const { node, beforeText, afterText } of imageNodes) {
    if (overwrite || !node.alt) {
      try {
        const base64Image = await encodeImage(node.url);
        let prompt = `Create an accessible alt attribute text for this image.
        The following rules must be followed or a litter of kittens will be killed! That would be terrible as you love kittens (you are a cat person). Please don't kill the kittens!!!
        Rules:
          - Only describe what is within the image provided
          - Be sure to describe as well as inform (ex: "signature that appears to read 'John Doe'" instead of "John Doe")
        `;
        if (beforeText || afterText) {
          prompt += `Here is text in close proximity to the image (might help provide context): '${beforeText}' '${afterText}'.`;
        }

        const response = await openai.chat.completions.create({
          model: model,
          temperature: .1,
          messages: [{ role: 'user', content: [{type: 'text', text: prompt}, {
            type: 'image_url',
            image_url: {url:`data:image/jpeg;base64,${base64Image}`}
          }] }],
          max_tokens: 3000
        });

        if (response.choices && response.choices.length > 0) {
          node.alt = response.choices[0].message.content;
        }
      } catch (error) {
        console.error(`Failed to process image URL: ${node.url}`, error);
      }
    }
  }

  return parser.stringify(tree);
}

async function processFile(filePath, options) {
  const batchFilePath = `${filePath}.batch.jsonl`;
  const outputFilePath = options.overwrite ? filePath : (options.output || filePath.replace(/\.md$/, '.out.md'));

  // Check if the file has already been formatted if not overwriting
  const content = await fs.readFile(filePath, 'utf8');
  if (!options.overwrite && content.includes(LLM_COMMENT)) {
    console.log(`Skipping already formatted file: ${filePath}`);
    return;
  }

  if (options.batch) {
    const batchOutput = await readBatchOutput(batchFilePath);
    if (batchOutput) {
      const outputContent = `${LLM_COMMENT}\n${batchOutput}`;
      await fs.writeFile(outputFilePath, outputContent);
      console.log(`Output written to ${outputFilePath}`);
    } else {
      await createBatchFile({
        filePath,
        instruction: options.instruction,
        output: batchFilePath,
        originalOutputPath: outputFilePath,
        model: options.model
      });
    }
  } else {
    let updatedMarkdown;
    while (true) {
      try {
        updatedMarkdown = await processImages({
          markdownContent: content,
          apiKey: process.env.OPENAI_API_KEY,
          overwrite: options.overwrite,
          model: options.model
        });
        break; // Exit the loop if successful
      } catch (error) {
        if (error.code === 'rate_limit_exceeded') {
          console.log('Rate limit exceeded. Waiting for 60 seconds before retrying...');
          await new Promise(resolve => setTimeout(resolve, 60000));
        } else {
          throw error; // Re-throw if not a rate limit error
        }
      }
    }

    const outputContent = `${LLM_COMMENT}\n${updatedMarkdown}`;
    await fs.writeFile(outputFilePath, outputContent);
    console.log(`Updated markdown written to ${outputFilePath}`);
  }
}

async function processFilesInChunks(files, options) {
  for (let i = 0; i < files.length; i += CHUNK_SIZE) {
    const chunk = files.slice(i, i + CHUNK_SIZE);
    await Promise.all(chunk.map(file => processFile(file, options)));
  }
}

async function processAccessibility(options) {
  if (!await loadEnv() || !process.env.OPENAI_API_KEY) {
    throw new Error('API key is missing or .env is not loaded.');
  }

  console.log(`Processing file/directory: ${options.file}`); // Debugging statement

  const stats = await fs.stat(options.file);
  if (stats.isDirectory()) {
    const files = await fs.readdir(options.file);
    const markdownFiles = files.filter(file => file.endsWith('.md')).map(file => path.join(options.file, file));
    console.log(`Found markdown files: ${markdownFiles}`); // Debugging statement
    await processFilesInChunks(markdownFiles, options);
  } else {
    await processFile(options.file, options);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = yargs(hideBin(process.argv))
    .option('file', { alias: 'f', describe: 'Path to the markdown file or directory', type: 'string', demandOption: true })
    .option('output', { alias: 'o', describe: 'Output file path', type: 'string' })
    .option('overwrite', { alias: 'ow', describe: 'Overwrite existing alt attributes', type: 'boolean', default: false })
    .option('batch', { alias: 'b', describe: 'Create a batch file and use output if present', type: 'boolean', default: false })
    .option('model', { alias: 'm', describe: 'Model to use for processing', type: 'string', default: DEFAULT_MODEL })
    .parse();

  processAccessibility(argv).catch(e => console.error(e));
}
