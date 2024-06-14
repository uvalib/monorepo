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

async function checkBatchStatus(batchId) {
  const openai = new OpenAI();
  const batch = await openai.batches.retrieve(batchId);
  return batch;
}

async function downloadBatchResults(fileId, batchFilePath) {
  const openai = new OpenAI();
  const fileContentResponse = await openai.files.content(fileId);

  // Convert the response to text
  const fileContent = await fileContentResponse.text();
  const lines = fileContent.split('\n').filter(line => line.trim());

  // Read the original output path from the metadata file
  const metadataFilePath = `${batchFilePath}.metadata.json`;
  const metadataContent = fs.readFileSync(metadataFilePath, 'utf8');
  const metadata = JSON.parse(metadataContent);
  const originalOutputPath = metadata.originalOutputPath;

  if (!originalOutputPath) {
    throw new Error('Original output path not found in metadata file.');
  }

  // Extract and write only the response choice content to the original output path
  const results = lines.map(line => {
    const json = JSON.parse(line);
    return json.response ? json.response.body.choices[0].message.content : null;
  }).filter(content => content).join('\n');

  fs.writeFileSync(originalOutputPath, results);
  console.log(`Batch results written to ${originalOutputPath}`);
}

async function processBatchFile(batchFilePath) {
  const uploadedFile = await uploadBatchFile(batchFilePath);
  console.log('Batch file uploaded:', uploadedFile);

  const batch = await createBatch(uploadedFile);
  console.log('Batch created:', batch);

  let batchStatus;
  do {
    console.log('Checking batch status...');
    batchStatus = await checkBatchStatus(batch.id);
    console.log('Current status:', batchStatus.status);

    if (batchStatus.status === 'completed') {
      await downloadBatchResults(batchStatus.output_file_id, batchFilePath);
      break;
    } else if (['failed', 'cancelled', 'expired'].includes(batchStatus.status)) {
      console.error('Batch processing failed or cancelled:', batchStatus);
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 1 minute before checking again
  } while (true);
}

async function processAllBatchFiles(batchFilePaths) {
  for (const batchFilePath of batchFilePaths) {
    await processBatchFile(batchFilePath).catch(e => console.error(`Error processing ${batchFilePath}:`, e));
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
      .filter(file => file.endsWith('.batch.jsonl'))
      .map(file => path.join(inputPath, file));
  } else {
    console.error('Invalid input path. Must be a file or directory.');
    process.exit(1);
  }

  await processAllBatchFiles(batchFilePaths);
}

main().catch(e => console.error(e));
