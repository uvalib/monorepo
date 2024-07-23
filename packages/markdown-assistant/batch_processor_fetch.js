import fs from 'fs';
import OpenAI from 'openai';
import path from 'path';

async function checkBatchStatus(batchId) {
  const openai = new OpenAI();
  const batch = await openai.batches.retrieve(batchId);
  return batch;
}

async function downloadBatchResults(fileId, batchFileMappings) {
  const openai = new OpenAI();
  const fileContentResponse = await openai.files.content(fileId);

  // Convert the response to text
  const fileContent = await fileContentResponse.text();
  const lines = fileContent.split('\n').filter(line => line.trim());

  console.log('Lines received:', lines);

  // Process each line as a separate response
  lines.forEach((line, index) => {
    console.log(`Processing line ${index}: ${line}`);
    const json = JSON.parse(line);
    const content = json.response ? json.response.body.choices[0].message.content : null;
    if (content) {
      const outputFilePath = batchFileMappings[json.custom_id]?.outputFilePath;
      console.log(`Writing content to ${outputFilePath}`);
      if (!outputFilePath) {
        console.error(`No output file path found for custom_id: ${json.custom_id}`);
      } else {
        fs.writeFileSync(outputFilePath, content);
        console.log(`Batch result written to ${outputFilePath}`);
      }
    }
  });
}

async function processAllBatchFiles(batchFilePaths) {
  const batchFileMappings = {};

  for (const filePath of batchFilePaths) {
    const fileName = path.basename(filePath, '.md');
    const metadataFilePath = `${filePath}.batch.jsonl.metadata.json`;

    try {
      const metadataContent = fs.readFileSync(metadataFilePath, 'utf8');
      const metadata = JSON.parse(metadataContent);
      const { batchId, customId, originalOutputPath } = metadata;

      if (!batchId) {
        console.log(`File ${fileName} does not have a batch ID.`);
        continue;
      }

      batchFileMappings[customId] = { outputFilePath: originalOutputPath };

      const batchStatus = await checkBatchStatus(batchId);
      console.log(`Current status for batch ${batchId}: ${batchStatus.status}`);

      if (batchStatus.status === 'completed') {
        await downloadBatchResults(batchStatus.output_file_id, batchFileMappings);
      } else {
        console.log(`Batch ${batchId} is not completed yet.`);
      }
    } catch (error) {
      console.error(`Error processing ${metadataFilePath}:`, error);
    }
  }
}

async function main() {
  const inputPath = process.argv[2];
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
