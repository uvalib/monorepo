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

async function downloadBatchResults(fileId) {
  const openai = new OpenAI();
  const fileContent = await openai.files.content(fileId);
  const outputPath = path.resolve(process.cwd(), 'batch_output.jsonl');
  fs.writeFileSync(outputPath, fileContent);
  console.log(`Batch results written to ${outputPath}`);
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

    // Update the batch file with the current status
    const batchFileContent = JSON.parse(fs.readFileSync(batchFilePath, 'utf8'));
    batchFileContent.status = batchStatus.status;
    fs.writeFileSync(batchFilePath, JSON.stringify(batchFileContent, null, 2));

    if (batchStatus.status === 'completed') {
      await downloadBatchResults(batchStatus.output_file_id);
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
