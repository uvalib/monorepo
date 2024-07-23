import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function uploadBatchFile(batchFilePath) {
  const openai = new OpenAI();
  const file = await openai.files.create({
    file: fs.createReadStream(batchFilePath),
    purpose: "batch",
  });
  return file;
}

async function createBatch(fileId) {
  const openai = new OpenAI();
  const batch = await openai.batches.create({
    input_file_id: fileId.id,
    endpoint: "/v1/chat/completions",
    completion_window: "24h"
  });
  return batch;
}

async function processBatchFile(batchFilePath, batchFileMappings) {
  const uploadedFile = await uploadBatchFile(batchFilePath);
  console.log('Batch file uploaded:', uploadedFile);

  const batch = await createBatch(uploadedFile);
  console.log('Batch created:', batch);

  // Save batch ID in all metadata files
  Object.values(batchFileMappings).forEach(({ metadataFilePath }) => {
    const metadataContent = fs.readFileSync(metadataFilePath, 'utf8');
    const metadata = JSON.parse(metadataContent);
    metadata.batchId = batch.id;
    fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
  });
}

async function processAllBatchFiles(batchFilePaths) {
  const batchFileMappings = {};
  const combinedBatchFilePath = 'combined_batch.jsonl';
  fs.writeFileSync(combinedBatchFilePath, ''); // Clear the file

  for (const filePath of batchFilePaths) {
    const fileName = path.basename(filePath, '.md');
    const batchFileName = `${filePath}.batch.jsonl`;
    const metadataFilePath = `${filePath}.batch.jsonl.metadata.json`;

    try {
      const metadataContent = fs.readFileSync(metadataFilePath, 'utf8');
      const metadata = JSON.parse(metadataContent);

      if (metadata.batchId) {
        console.log(`File ${fileName} already has a batch ID: ${metadata.batchId}`);
        continue;
      }

      const batchFileContent = fs.readFileSync(batchFileName, 'utf8');
      fs.appendFileSync(combinedBatchFilePath, batchFileContent);

      const lines = batchFileContent.split('\n').filter(line => line.trim());
      lines.forEach(line => {
        const request = JSON.parse(line);
        const customId = request.custom_id;
        batchFileMappings[customId] = {
          outputFilePath: metadata.originalOutputPath || filePath.replace(/\.md$/, '.out.md'),
          metadataFilePath
        };

        // Save custom_id in the metadata
        metadata.customId = customId;
        fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
      });
      console.log(`Added requests for ${fileName}`);

    } catch (error) {
      console.error(`Error processing ${metadataFilePath}:`, error);
    }
  }

  if (fs.existsSync(combinedBatchFilePath) && fs.statSync(combinedBatchFilePath).size > 0) {
    await processBatchFile(combinedBatchFilePath, batchFileMappings);
  }
}

async function main() {
  const argv = yargs(hideBin(process.argv))
    .option('input', { alias: 'i', describe: 'Path to the batch file or directory', type: 'string', demandOption: true })
    .parse();

  const inputPath = argv.input;
  const stats = fs.statSync(inputPath);

  let batchFilePaths = [];

  if (stats.isFile()) {
    batchFilePaths = [inputPath];
  } else if (stats.isDirectory()) {
    batchFilePaths = fs.readdirSync(inputPath)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(inputPath, file));
  } else {
    console.error('Invalid input path. Must be a file or directory.');
    process.exit(1);
  }

  await processAllBatchFiles(batchFilePaths);
}

main().catch(e => console.error(e));
