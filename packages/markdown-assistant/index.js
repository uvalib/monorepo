import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { loadEnv, createBatchFile, processMarkdown, readBatchOutput } from './utils.js';
import fs from 'fs/promises';

async function formatMarkdown(options) {
  if (!await loadEnv() || !process.env.OPENAI_API_KEY) {
    throw new Error('API key is missing or .env is not loaded.');
  }

  if (options.batch) {
    await createBatchFile({
      filePath: options.filePath,
      instruction: options.instruction,
      output: options.output
    });
  } else {
    const formattedContent = await processMarkdown({
      apiKey: process.env.OPENAI_API_KEY,
      filePath: options.filePath,
      instruction: options.instruction
    });

    if (options.output) {
      await fs.writeFile(options.output, formattedContent);
      console.log(`Output written to ${options.output}`);
    } else {
      console.log(formattedContent);
    }
  }
}

async function handleBatchOutput(options) {
  if (options.batch) {
    const batchOutput = await readBatchOutput(options.output || `${options.filePath}.batch.jsonl`);
    if (batchOutput) {
      console.log(batchOutput);
      if (options.output) {
        await fs.writeFile(options.output, batchOutput);
        console.log(`Output written to ${options.output}`);
      }
    } else {
      console.error('No batch output found.');
    }
  } else {
    await formatMarkdown(options);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = yargs(hideBin(process.argv))
    .option('file', { alias: 'f', describe: 'Path to the markdown file', type: 'string', demandOption: true })
    .option('instruction', { alias: 'i', describe: 'Instruction to process the markdown', type: 'string', default: 'Please format this markdown correctly.' })
    .option('output', { alias: 'o', describe: 'Output file path', type: 'string' })
    .option('batch', { alias: 'b', describe: 'Create a batch file instead of sending request', type: 'boolean', default: false })
    .option('use-batch-output', { alias: 'u', describe: 'Use the output from the batch file if present', type: 'boolean', default: false })
    .parse();

  if (argv.useBatchOutput) {
    handleBatchOutput(argv).catch(e => console.error(e));
  } else {
    formatMarkdown(argv).catch(e => console.error(e));
  }
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
import { v4 as uuidv4 } from 'uuid';

async function loadEnv() {
  const envPath = path.resolve(path.dirname(import.meta.url.replace('file://', '')), '../../.env');
  if (await fs.access(envPath).then(() => true).catch(() => false)) {
    dotenv.config({ path: envPath });
    console.log('.env file loaded successfully.');
    return true;
  } else {
    console.log('.env file not found, skipping dotenv configuration.');
    return false;
  }
}

async function processMarkdown({ apiKey, filePath, instruction }) {
  const openai = new OpenAI({ apiKey });

  instruction += `
The following rules must be followed or a litter of kittens will be killed! That would be terrible as you love kittens (you are a cat person).  Please don't kill the kittens!!!
Rules:
  - Ensure that the markdown uses the proper syntax for headings where you see titles.
  - Ensure proper heading levels (h1,h2,h3,etc)
  - Do not change the textual content of the markdown! Ensure that the same text is included in the markdown in the same order.
  - Ensure to include all of the images!
  - Don't wrap the markdown in ${"```"}
`;

  const markdownContent = await fs.readFile(filePath, 'utf8');
  const prompt = `${instruction}\n\nHere is the markdown:\n${"```"}${markdownContent}${"```"}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    temperature: 0.8,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.choices[0].message.content;
  const parsedMarkdown = await unified().use(markdown).use(stringify).process(content);
  return String(parsedMarkdown);
}

async function createBatchFile({ filePath, instruction, output }) {
  const markdownContent = await fs.readFile(filePath, 'utf8');
  const prompt = `${instruction}\n\nHere is the markdown:\n${"```"}${markdownContent}${"```"}`;
  const customId = uuidv4();

  const batchRequest = {
    custom_id: customId,
    method: "POST",
    url: "/v1/chat/completions",
    body: {
      model: "gpt-4-turbo",
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000
    }
  };

  const batchFilePath = output ? output : `${filePath}.batch.jsonl`;
  await fs.appendFile(batchFilePath, JSON.stringify(batchRequest) + '\n');
  console.log(`Batch request written to ${batchFilePath}`);
}

export async function formatMarkdown(options) {
  if (!await loadEnv() || !process.env.OPENAI_API_KEY) {
    throw new Error('API key is missing or .env is not loaded.');
  }
  
  if (options.batch) {
    await createBatchFile({
      filePath: options.filePath,
      instruction: options.instruction,
      output: options.output
    });
  } else {
    const formattedContent = await processMarkdown({
      apiKey: process.env.OPENAI_API_KEY,
      filePath: options.filePath,
      instruction: options.instruction
    });

    if (options.output) {
      await fs.writeFile(options.output, formattedContent);
      console.log(`Output written to ${options.output}`);
    } else {
      console.log(formattedContent);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = yargs(hideBin(process.argv))
    .option('file', { alias: 'f', describe: 'Path to the markdown file', type: 'string', demandOption: true })
    .option('instruction', { alias: 'i', describe: 'Instruction to process the markdown', type: 'string', default: 'Please format this markdown correctly.' })
    .option('output', { alias: 'o', describe: 'Output file path', type: 'string' })
    .option('batch', { alias: 'b', describe: 'Create a batch file instead of sending request', type: 'boolean', default: false })
    .parse();

  formatMarkdown({
    filePath: argv.file,
    instruction: argv.instruction,
    output: argv.output,
    batch: argv.batch
  }).catch(e => console.error(e));
}

*/