import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { loadEnv, createBatchFile, processMarkdown, readBatchOutput } from './utils.js';
import fs from 'fs/promises';
import path from 'path';

const DEFAULT_MODEL = 'gpt-4o-mini';
const CHUNK_SIZE = 10;
const LLM_COMMENT = '<!-- llmformatted -->';

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
    - Format tables and tabular data properly!
    - Ensure that there is adequate spacing to help with readability of the text! 
    - Don't wrap the markdown in ***
    - return only the resulting markdown in your result, no additional messages, and don't wrap the markdown in any way.
  `;

  async function processFile(filePath) {
    const batchFilePath = `${filePath}.batch.jsonl`;
    const outputFilePath = options.overwrite ? filePath : (options.output || filePath.replace(/\.md$/, '.out.md'));

    // Check if the file has already been formatted if not overwriting
    if (!options.overwrite) {
      const content = await fs.readFile(filePath, 'utf8');
      if (content.includes(LLM_COMMENT)) {
        console.log(`Skipping already formatted file: ${filePath}`);
        return;
      }
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
          instruction,
          output: batchFilePath,
          originalOutputPath: outputFilePath,
          model: options.model
        });
      }
    } else {
      let formattedContent;
      while (true) {
        try {
          formattedContent = await processMarkdown({
            apiKey: process.env.OPENAI_API_KEY,
            filePath,
            instruction,
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

      const outputContent = `${LLM_COMMENT}\n${formattedContent}`;
      await fs.writeFile(outputFilePath, outputContent);
      console.log(`Output written to ${outputFilePath}`);
    }
  }

  async function processFilesInChunks(files) {
    for (let i = 0; i < files.length; i += CHUNK_SIZE) {
      const chunk = files.slice(i, i + CHUNK_SIZE);
      await Promise.all(chunk.map(file => processFile(file)));
    }
  }

  const stats = await fs.stat(options.file);
  if (stats.isDirectory()) {
    const files = await fs.readdir(options.file);
    const markdownFiles = files.filter(file => file.endsWith('.md')).map(file => path.join(options.file, file));
    await processFilesInChunks(markdownFiles);
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
    .option('model', { alias: 'm', describe: 'Model to use for processing', type: 'string', default: DEFAULT_MODEL })
    .option('overwrite', { alias: 'w', describe: 'Overwrite the input file with the formatted content', type: 'boolean', default: false })
    .parse();

  formatMarkdown(argv).catch(e => console.error(e));
}
