import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { loadEnv, createBatchFile, processMarkdown, readBatchOutput } from './utils.js';
import fs from 'fs/promises';

async function formatMarkdown(options) {
  if (!await loadEnv() || !process.env.OPENAI_API_KEY) {
    throw new Error('API key is missing or .env is not loaded.');
  }

  let instruction = options.instruction || 'Please format this markdown correctly for the web site.';

  instruction += `
  The following rules must be followed or a litter of kittens will be killed! That would be terrible as you love kittens (you are a cat person). Please don't kill the kittens!!!
  Rules:
    - Ensure that the markdown uses the proper syntax for headings where you see titles.
    - Ensure proper heading levels (h1,h2,h3,etc)
    - Do not change the textual content of the markdown! Ensure that the same text is included in the markdown in the same order.
    - Ensure to include all of the images!
    - Don't wrap the markdown in ${"```"}
  `;

  const batchFilePath = `${options.file}.batch.jsonl`;

  if (options.batch) {
    const batchOutput = await readBatchOutput(batchFilePath);
    if (batchOutput) {
      console.log(batchOutput);
      if (options.output) {
        await fs.writeFile(options.output, batchOutput);
        console.log(`Output written to ${options.output}`);
      }
    } else {
      await createBatchFile({
        filePath: options.file,
        instruction: instruction,
        output: batchFilePath,
        originalOutputPath: options.output // Store the original output path in the batch file
      });
    }
  } else {
    const formattedContent = await processMarkdown({
      apiKey: process.env.OPENAI_API_KEY,
      filePath: options.file,
      instruction: instruction
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
    .option('batch', { alias: 'b', describe: 'Create a batch file and use output if present', type: 'boolean', default: false })
    .parse();

  formatMarkdown(argv).catch(e => console.error(e));
}
