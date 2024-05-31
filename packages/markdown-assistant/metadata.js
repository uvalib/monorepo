import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { loadEnv, createBatchFile, processMarkdown } from './utils.js';
import fs from 'fs/promises';

async function processMetadata(options) {
  if (!await loadEnv() || !process.env.OPENAI_API_KEY) {
    throw new Error('API key is missing or .env is not loaded.');
  }

  const instruction = `
The metadata should take the following form:
${"```"}
{
  "@context": "...",
  "@type": "...",
  "name": "...",
  "startDate": "...",
  "endDate": "...",
  "location": {...},
  "organizer": {...},
  "keywords": "keyword1, keyword2, ...",
  "description": "...",
  "attendee": [...],
  "about": [{...},{...}]
}
${"```"}

The following rules must be followed:
- Only return the metadata for this document!
- Never make up data if it is not in the document or not known to be true.
- Be sure to list all of the attendees.
- Please be as thorough as possible.
- Ensure that you return valid json-ld using the schema.org vocabulary.
- Do not wrap the metadata in ${"```"}.
` + options.instruction;

  if (options.batch) {
    await createBatchFile({
      filePath: options.filePath,
      instruction: instruction,
      output: options.output
    });
  } else {
    const content = await processMarkdown({
      apiKey: process.env.OPENAI_API_KEY,
      filePath: options.filePath,
      instruction: instruction
    });

    if (options.embed) {
      const markdownContent = await fs.readFile(options.filePath, 'utf8');
      content = `\n<script type="application/ld+json">\n${content}\n</script>\n` + markdownContent;
    }

    const finalContent = await processMarkdown({
      apiKey: process.env.OPENAI_API_KEY,
      filePath: options.filePath,
      instruction: content
    });

    if (options.output) {
      await fs.writeFile(options.output, finalContent);
      console.log(`Output written to ${options.output}`);
    } else {
      console.log(finalContent);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = yargs(hideBin(process.argv))
    .option('file', { alias: 'f', describe: 'Path to the markdown file', type: 'string', demandOption: true })
    .option('instruction', { alias: 'i', describe: 'Instruction to process the markdown', type: 'string', default: 'You are a metadata expert that specializes in schema.org and json-ld. You are very knowledgeable about the University of Virginia.' })
    .option('output', { alias: 'o', describe: 'Output file path', type: 'string' })
    .option('embed', { alias: 'e', type: 'boolean', describe: 'Embed JSON-LD metadata into the original markdown', default: false })
    .option('batch', { alias: 'b', describe: 'Create a batch file instead of sending request', type: 'boolean', default: false })
    .parse();

  processMetadata({
    filePath: argv.file,
    instruction: argv.instruction,
    embed: argv.embed,
    output: argv.output,
    batch: argv.batch
  }).catch(e => console.error(e));
}







/*
import fs from 'fs/promises';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { unified } from 'unified';
import markdown from 'remark-parse';
import stringify from 'remark-stringify';

// Load environment variables
const loadEnv = async () => {
  const envPath = path.resolve(path.dirname(import.meta.url.replace('file://', '')), '../../.env');
  try {
    await fs.access(envPath);
    dotenv.config({ path: envPath });
    console.log('.env file loaded successfully.');
    return true;
  } catch {
    console.log('.env file not found, skipping dotenv configuration.');
    return false;
  }
};

export const processMarkdown = async ({ apiKey, filePath, instruction, embed, output }) => {
  try {
    const openai = new OpenAI({
      apiKey: apiKey
    });

    // Enhance instruction with metadata rules
    instruction += `
The metadata should take the following form:
${"```"}
{
  "@context": "...",
  "@type": "...",
  "name": "...",
  "startDate": "...",
  "endDate": "...",
  "location": {...},
  "organizer": {...},
  "keywords": "keyword1, keyword2, ...",
  "description": "...",
  "attendee": [...],
  "about": [{...},{...}]
}
${"```"}

The following rules must be followed:
- Only return the metadata for this document!
- Never make up data if it is not in the document or not known to be true.
- Be sure to list all of the attendees.
- Please be as thorough as possible.
- Ensure that you return valid json-ld using the schema.org vocabulary.
- Do not wrap the metadata in ${"```"}.
`;

    let markdownContent = await fs.readFile(filePath, 'utf8');
    const prompt = `${instruction}\n\nHere is the markdown:\n${"```"}${markdownContent}${"```"}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.8,
      messages: [{ role: 'user', content: prompt }],
    });

    let content = response.choices[0].message.content;

    if (embed) {
      content = `\n<script type="application/ld+json">\n${content}\n</script>\n` + markdownContent;
    }

    const parsedMarkdown = await unified()
      .use(markdown)
      .use(stringify)
      .process(content);

    const finalContent = String(parsedMarkdown);

    if (output) {
      await fs.writeFile(output, finalContent);
      console.log(`Output written to ${output}`);
    }

    return finalContent;
  } catch (error) {
    console.error('Error processing markdown:', error);
    throw error;
  }
};



if (import.meta.url === `file://${process.argv[1]}`) {
  const main = async () => {
    const envLoaded = await loadEnv();
    if (!envLoaded || !process.env.OPENAI_API_KEY) {
      console.error('API key is missing.');
      return;
    }

    const argv = yargs(hideBin(process.argv))
      .option('file', {
        alias: 'f',
        describe: 'Path to the markdown file',
        type: 'string',
        demandOption: true
      })
      .option('instruction', {
        alias: 'i',
        describe: 'Instruction to process the markdown',
        type: 'string',
        default: 'You are a metadata expert that specializes in schema.org and json-ld. You are very knowledgeable about the University of Virginia.'
      })
      .option('output', {
        alias: 'o',
        describe: 'Output file path',
        type: 'string'
      })
      .option('embed', {
        alias: 'e',
        type: 'boolean',
        describe: 'Embed JSON-LD metadata into the original markdown',
        default: false
      })
      .parse();

    await processMarkdown({
      apiKey: process.env.OPENAI_API_KEY,
      filePath: argv.file,
      instruction: argv.instruction,
      embed: argv.embed,
      output: argv.output
    }).catch(error => {
      console.error('Failed to execute script:', error);
    });
  };

  main();
}
*/
