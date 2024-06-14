import fs from 'fs/promises';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { unified } from 'unified';
import markdown from 'remark-parse';
import { visitParents } from 'unist-util-visit-parents';
import stringify from 'remark-stringify';

const processMarkdown = async (content) => {
  try {
    return await unified().use(markdown).use(stringify).process(content);
  } catch (error) {
    console.error('Error processing markdown:', error);
    throw error;
  }
};

const loadEnv = async () => {
  const envPath = path.resolve(path.dirname(import.meta.url.replace('file://', '')), '../../.env');
  try {
    await fs.access(envPath);
    dotenv.config({ path: envPath });
    console.log('.env file loaded successfully.');
    return true;
  } catch {
    console.error('.env file not found, skipping dotenv configuration.');
    return false;
  }
};

const encodeImage = async (filePath) => {
  const imageBuffer = await fs.readFile(filePath);
  return imageBuffer.toString('base64');
};

// Main function to process images within markdown content
export const processImages = async ({ markdownContent, apiKey, overwrite }) => {
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
      const prompt = `Create an accessible alt attribute text for this image.
      The following rules must be followed or a litter of kittens will be killed! That would be terrible as you love kittens (you are a cat person).  Please don't kill the kittens!!!
      Rules:
        - Only describe what is within the image provided
        - Be sure to describe as well as inform (ex: "signature that appears to read 'John Doe'" instead of "John Doe")      
      `;
      if (beforeText || afterText)
        prompt += `Here is text in close proximity to the image (might help provide context): '${beforeText}' '${afterText}'.`;
      console.log(prompt);
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 1,
        messages: [{ role: 'user', content: [{
          type: 'text',
          text: prompt
        }, {
          type: 'image_url',
          image_url: {url:`data:image/jpeg;base64,${base64Image}`}
        }] }],
        max_tokens: 300
      });

      if (response.choices && response.choices.length > 0) {
        node.alt = response.choices[0].message.content;
      }
    }
  }

  return parser.stringify(tree);
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
};

// Conditional execution for CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const main = async () => {
    const envLoaded = await loadEnv();
    if (!envLoaded || !process.env.OPENAI_API_KEY) {
      console.error('API key is missing.');
      return;
    }

    const argv = yargs(hideBin(process.argv))
      .option('file', { alias: 'f', describe: 'Path to the markdown file', type: 'string', demandOption: true })
      .option('output', { alias: 'o', describe: 'Output file path', type: 'string' })
      .option('overwrite', { alias: 'ow', describe: 'Overwrite existing alt attributes', type: 'boolean', default: false })
      .parse();

    try {
      const markdownContent = await fs.readFile(argv.file, 'utf8');
      const updatedMarkdown = await processImages({
        markdownContent: markdownContent,
        apiKey: process.env.OPENAI_API_KEY,
        overwrite: argv.overwrite
      });

      if (argv.output) {
        await fs.writeFile(argv.output, updatedMarkdown);
        console.log(`Updated markdown written to ${argv.output}`);
      } else {
        console.log(updatedMarkdown);
      }
    } catch (error) {
      console.error('Failed to execute script:', error);
    }
  };

  main();
}
