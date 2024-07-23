import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { loadEnv, createBatchFile, processMarkdown, readBatchOutput } from './utils.js';
import fs from 'fs/promises';
import path from 'path';
import { visitParents } from 'unist-util-visit-parents';
import { unified } from 'unified';
import markdown from 'remark-parse';
import stringify from 'remark-stringify';

const DEFAULT_MODEL = 'gpt-4o-mini';

const encodeImage = async (filePath) => {
  const imageBuffer = await fs.readFile(filePath);
  return imageBuffer.toString('base64');
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
        temperature: 1,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300
      });

      if (response.choices && response.choices.length > 0) {
        node.alt = response.choices[0].message.content;
      }
    }
  }

  return parser.stringify(tree);
}

async function processAccessibility(options) {
  if (!await loadEnv() || !process.env.OPENAI_API_KEY) {
    throw new Error('API key is missing or .env is not loaded.');
  }

  const markdownContent = await fs.readFile(options.file, 'utf8');
  const instruction = `Process the images in the markdown file to add or overwrite alt text based on accessibility guidelines.` + (options.instruction || '');

  async function processFile(filePath) {
    const batchFilePath = `${filePath}.batch.jsonl`;

    if (options.batch) {
      const batchOutput = await readBatchOutput(batchFilePath);
      if (batchOutput) {
        console.log(batchOutput);
        const outputPath = options.output || filePath.replace(/\.md$/, '.out.md');
        await fs.writeFile(outputPath, batchOutput);
        console.log(`Output written to ${outputPath}`);
      } else {
        await createBatchFile({
          filePath,
          instruction,
          output: batchFilePath,
          originalOutputPath: options.output || filePath.replace(/\.md$/, '.out.md'),
          model: options.model
        });
      }
    } else {
      const updatedMarkdown = await processImages({
        markdownContent: markdownContent,
        apiKey: process.env.OPENAI_API_KEY,
        overwrite: options.overwrite,
        model: options.model
      });

      const outputFilePath = options.output || filePath.replace(/\.md$/, '.out.md');
      await fs.writeFile(outputFilePath, updatedMarkdown);
      console.log(`Updated markdown written to ${outputFilePath}`);
    }
  }

  const stats = await fs.stat(options.file);
  if (stats.isDirectory()) {
    const files = await fs.readdir(options.file);
    for (const file of files) {
      if (file.endsWith('.md')) {
        await processFile(path.join(options.file, file));
      }
    }
  } else {
    await processFile(options.file);
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
