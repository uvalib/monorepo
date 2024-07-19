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
  const metadataFilePath = `${batchFilePath}.metadata.json`;
  let metadata = {};

  // Check if the metadata file exists
  if (fs.existsSync(metadataFilePath)) {
    const metadataContent = fs.readFileSync(metadataFilePath, 'utf8');
    metadata = JSON.parse(metadataContent);
  }

  // If the batch is not submitted yet, submit it
  if (!metadata.batchId) {
    const uploadedFile = await uploadBatchFile(batchFilePath);
    console.log('Batch file uploaded:', uploadedFile);

    const batch = await createBatch(uploadedFile);
    console.log('Batch created:', batch);

    // Save the batch ID to the metadata file
    metadata.batchId = batch.id;
    fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
  }

  // Check the batch status
  const batchStatus = await checkBatchStatus(metadata.batchId);
  console.log('Current status:', batchStatus.status);

  if (batchStatus.status === 'completed') {
    await downloadBatchResults(batchStatus.output_file_id, batchFilePath);
    // Cleanup the batch file and metadata file
    fs.unlinkSync(batchFilePath);
    fs.unlinkSync(metadataFilePath);
    console.log(`Batch file ${batchFilePath} and metadata file ${metadataFilePath} have been removed.`);
  } else if (['failed', 'cancelled', 'expired'].includes(batchStatus.status)) {
    console.error('Batch processing failed or cancelled:', batchStatus);
    // Cleanup the batch file and metadata file
    fs.unlinkSync(batchFilePath);
    fs.unlinkSync(metadataFilePath);
    console.log(`Batch file ${batchFilePath} and metadata file ${metadataFilePath} have been removed.`);
  }
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
