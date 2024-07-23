import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { loadEnv, createBatchFile, processMarkdown, readBatchOutput } from './utils.js';
import fs from 'fs/promises';
import path from 'path';

const DEFAULT_MODEL = 'gpt-4o-mini';
const CHUNK_SIZE = 1;
const LLM_COMMENT = '<!-- llmmeta -->';

async function processMetadata(options) {
  if (!await loadEnv() || !process.env.OPENAI_API_KEY) {
    throw new Error('API key is missing or .env is not loaded.');
  }

  const instruction = `
The metadata should take the following form:
***
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
***

The following rules must be followed:
- Attempt to name the document appropriate to the content and metadata.
- Only return the metadata for this document!
- Never make up data if it is not in the document or not known to be true.
- Be sure to list all of the attendees.
- Please be as thorough as possible.
- Ensure that you return valid json-ld using the schema.org vocabulary.
- Do not wrap the metadata in ***
` + (options.instruction || '');

  async function processFile(filePath) {
    const batchFilePath = `${filePath}.batch.jsonl`;
    const outputFilePath = options.overwrite ? filePath : (options.output || filePath.replace(/\.md$/, '.out.md'));

    // Check if the file has already been formatted
    const content = await fs.readFile(filePath, 'utf8');
    if (content.includes(LLM_COMMENT)) {
      console.log(`Skipping already formatted file: ${filePath}`);
      return;
    }

    if (options.batch) {
      const batchOutput = await readBatchOutput(batchFilePath);
      if (batchOutput) {
        if (options.embed) {
          const markdownContent = await fs.readFile(filePath, 'utf8');
          const embeddedContent = `${LLM_COMMENT}\n<script type="application/ld+json">\n${batchOutput}\n</script>\n${markdownContent}`;
          await fs.writeFile(outputFilePath, embeddedContent);
          console.log(`Output written to ${outputFilePath}`);
        } else {
          const outputContent = `${LLM_COMMENT}\n${batchOutput}`;
          await fs.writeFile(outputFilePath, outputContent);
          console.log(`Output written to ${outputFilePath}`);
        }
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
      let metadataContent;
      while (true) {
        try {
          metadataContent = await processMarkdown({
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

      if (options.embed) {
        const markdownContent = await fs.readFile(filePath, 'utf8');
        metadataContent = `${LLM_COMMENT}\n<script type="application/ld+json">\n${metadataContent}\n</script>\n${markdownContent}`;
      } else {
        metadataContent = `${LLM_COMMENT}\n${metadataContent}`;
      }

      await fs.writeFile(outputFilePath, metadataContent);
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
    .option('instruction', { alias: 'i', describe: 'Instruction to process the markdown', type: 'string', default: 'You are a metadata expert that specializes in schema.org and json-ld. You are very knowledgeable about the University of Virginia.' })
    .option('output', { alias: 'o', describe: 'Output file path', type: 'string' })
    .option('embed', { alias: 'e', type: 'boolean', describe: 'Embed JSON-LD metadata into the original markdown', default: false })
    .option('batch', { alias: 'b', describe: 'Create a batch file and use output if present', type: 'boolean', default: false })
    .option('model', { alias: 'm', describe: 'Model to use for processing', type: 'string', default: DEFAULT_MODEL })
    .option('overwrite', { alias: 'w', describe: 'Overwrite the input file with the formatted content', type: 'boolean', default: false })
    .parse();

  processMetadata(argv).catch(e => console.error(e));
}
