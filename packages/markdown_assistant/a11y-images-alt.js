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

function findTextContext(node, ancestors) {
  let beforeText = '';
  let afterText = '';
  if (ancestors.length > 0) {
    const parent = ancestors[ancestors.length - 1];
    const index = parent.children.indexOf(node);

    // Find previous text before image
    for (let i = index - 1; i >= 0; i--) {
      const child = parent.children[i];
      if (child.type === 'paragraph' && child.children && child.children.some(child => child.type === 'text')) {
        beforeText = child.children.find(child => child.type === 'text').value;
        break;
      } else if (child.type === 'text') {
        beforeText = child.value;
        break;
      }
    }

    // Find next text after image
    for (let i = index + 1; i < parent.children.length; i++) {
      const child = parent.children[i];
      if (child.type === 'paragraph' && child.children && child.children.some(child => child.type === 'text')) {
        afterText = child.children.find(child => child.type === 'text').value;
        break;
      } else if (child.type === 'text') {
        afterText = child.value;
        break;
      }
    }
  }
  return { beforeText, afterText };
}


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

const processImages = async (markdownContent, openai, overwrite) => {
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
      Use the surrounding text to help (text in the image may also show up in text near the image): '${beforeText}' and '${afterText}'.`;
      console.log(prompt);
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        temperature: 0.8,
        messages: [{
          role: 'user',
          content: [{
            type: 'text',
            text: 'What’s in this image?'
          }, {
            type: 'image_url',
            image_url: {url:`data:image/jpeg;base64,${base64Image}`}
          }]
        }],
        max_tokens: 300
      });

      if (response.choices && response.choices.length > 0) {
        node.alt = response.choices[0].message.content;
      }
    }
  }

  return parser.stringify(tree);
};

const main = async () => {
  const envLoaded = await loadEnv();
  if (!envLoaded || !process.env.OPENAI_API_KEY) {
    console.error('API key is missing.');
    return;
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const argv = yargs(hideBin(process.argv))
    .option('file', { alias: 'f', describe: 'Path to the markdown file', type: 'string', demandOption: true })
    .option('output', { alias: 'o', describe: 'Output file path', type: 'string' })
    .option('overwrite', { alias: 'ow', describe: 'Overwrite existing alt attributes', type: 'boolean', default: false })
    .parse();

  try {
    const markdownContent = await fs.readFile(argv.file, 'utf8');
    const updatedMarkdown = await processImages(markdownContent, openai, argv.overwrite);

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
