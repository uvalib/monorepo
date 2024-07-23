import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { loadEnv, createBatchFile, processMarkdown, readBatchOutput } from './utils.js';
import fs from 'fs/promises';
import path from 'path';

const DEFAULT_MODEL = 'gpt-4o-mini';

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
- Only return the metadata for this document!
- Never make up data if it is not in the document or not known to be true.
- Be sure to list all of the attendees.
- Please be as thorough as possible.
- Ensure that you return valid json-ld using the schema.org vocabulary.
- Do not wrap the metadata in ***
` + (options.instruction || '');

  async function processFile(filePath) {
    const batchFilePath = `${filePath}.batch.jsonl`;

    if (options.batch) {
      const batchOutput = await readBatchOutput(batchFilePath);
      if (batchOutput) {
        if (options.embed) {
          const markdownContent = await fs.readFile(filePath, 'utf8');
          const embeddedContent = `\n<script type="application/ld+json">\n${batchOutput}\n</script>\n` + markdownContent;
          console.log(embeddedContent);
          const outputPath = options.output || filePath.replace(/\.md$/, '.out.md');
          await fs.writeFile(outputPath, embeddedContent);
          console.log(`Output written to ${outputPath}`);
        } else {
          console.log(batchOutput);
          const outputPath = options.output || filePath.replace(/\.md$/, '.out.md');
          await fs.writeFile(outputPath, batchOutput);
          console.log(`Output written to ${outputPath}`);
        }
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
      const content = await processMarkdown({
        apiKey: process.env.OPENAI_API_KEY,
        filePath,
        instruction,
        model: options.model
      });

      if (options.embed) {
        const markdownContent = await fs.readFile(filePath, 'utf8');
        content = `\n<script type="application/ld+json">\n${content}\n</script>\n` + markdownContent;
      }

      const outputFilePath = options.output || filePath.replace(/\.md$/, '.out.md');
      await fs.writeFile(outputFilePath, content);
      console.log(`Output written to ${outputFilePath}`);
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
    .option('instruction', { alias: 'i', describe: 'Instruction to process the markdown', type: 'string', default: 'You are a metadata expert that specializes in schema.org and json-ld. You are very knowledgeable about the University of Virginia.' })
    .option('output', { alias: 'o', describe: 'Output file path', type: 'string' })
    .option('embed', { alias: 'e', type: 'boolean', describe: 'Embed JSON-LD metadata into the original markdown', default: false })
    .option('batch', { alias: 'b', describe: 'Create a batch file and use output if present', type: 'boolean', default: false })
    .option('model', { alias: 'm', describe: 'Model to use for processing', type: 'string', default: DEFAULT_MODEL })
    .parse();

  processMetadata(argv).catch(e => console.error(e));
}
