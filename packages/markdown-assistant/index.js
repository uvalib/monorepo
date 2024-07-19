import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { loadEnv, createBatchFile, processMarkdown, readBatchOutput } from './utils.js';
import fs from 'fs/promises';
import path from 'path';

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

  const processFile = async (filePath) => {
    const batchFilePath = `${filePath}.batch.jsonl`;

    let outputPath = options.output;
    if (!outputPath) {
      const parsedPath = path.parse(filePath);
      outputPath = path.join(parsedPath.dir, `${parsedPath.name}.out${parsedPath.ext}`);
    }

    if (options.batch) {
      const batchOutput = await readBatchOutput(batchFilePath);
      if (batchOutput) {
        console.log(batchOutput);
        if (outputPath) {
          await fs.writeFile(outputPath, batchOutput);
          console.log(`Output written to ${outputPath}`);
        }
      } else {
        await createBatchFile({
          filePath: filePath,
          instruction: instruction,
          output: batchFilePath,
          originalOutputPath: outputPath // Store the original output path in the batch file
        });
      }
    } else {
      const formattedContent = await processMarkdown({
        apiKey: process.env.OPENAI_API_KEY,
        filePath: filePath,
        instruction: instruction
      });

      if (outputPath) {
        await fs.writeFile(outputPath, formattedContent);
        console.log(`Output written to ${outputPath}`);
      } else {
        console.log(formattedContent);
      }
    }
  };

  const stats = await fs.stat(options.file);
  if (stats.isDirectory()) {
    const files = await fs.readdir(options.file);
    for (const file of files) {
      const filePath = path.join(options.file, file);
      if (path.extname(filePath) === '.md') {
        await processFile(filePath);
      }
    }
  } else {
    await processFile(options.file);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = yargs(hideBin(process.argv))
    .option('file', { alias: 'f', describe: 'Path to the markdown file or directory', type: 'string', demandOption: true })
    .option('instruction', { alias: 'i', describe: 'Instruction to process the markdown', type: 'string', default: 'Please format this markdown correctly.' })
    .option('output', { alias: 'o', describe: 'Output file path', type: 'string' })
    .option('batch', { alias: 'b', describe: 'Create a batch file and use output if present', type: 'boolean', default: false })
    .parse();

  formatMarkdown(argv).catch(e => console.error(e));
}
