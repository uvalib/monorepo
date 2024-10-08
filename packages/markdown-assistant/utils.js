// utils.js
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { unified } from 'unified';
import markdown from 'remark-parse';
import stringify from 'remark-stringify';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

export async function loadEnv() {
  const envPath = path.resolve(path.dirname(import.meta.url.replace('file://', '')), '../../.env');
  try {
    await fs.access(envPath);
    dotenv.config({ path: envPath });
    console.log('.env file loaded successfully.');
    return true;
  } catch {
    console.log('.env file not found, skipping dotenv configuration.');
    return false;
  }
}

export async function createBatchFile({ filePath, instruction, output, originalOutputPath, model }) {
  const markdownContent = await fs.readFile(filePath, 'utf8');
  const prompt = `${instruction}\n\nHere is the markdown:\n***${markdownContent}***`;
  const customId = uuidv4();

  const batchRequest = {
    custom_id: customId,
    method: "POST",
    url: "/v1/chat/completions",
    body: {
      model: model,
      temperature: 0.8,
      messages: [{ role: 'user', content: prompt }]
    }
  };

  const batchFilePath = `${filePath}.batch.jsonl`;

  // Append the request line to the batch file
  await fs.appendFile(batchFilePath, JSON.stringify(batchRequest) + '\n');

  // Save the metadata
  const metadataFilePath = `${batchFilePath}.metadata.json`;
  const metadata = { originalOutputPath };
  await fs.writeFile(metadataFilePath, JSON.stringify(metadata, null, 2));

  console.log(`Batch request written to ${batchFilePath}`);
}

export async function processMarkdown({ apiKey, filePath, instruction, model }) {
  const openai = new OpenAI({ apiKey });

  const markdownContent = await fs.readFile(filePath, 'utf8');
  const prompt = `${instruction}\n\nHere is the markdown:\n***${markdownContent}***`;

  const response = await openai.chat.completions.create({
    model: model,
    temperature: 0.8,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.choices[0].message.content;
  const parsedMarkdown = await unified().use(markdown).use(stringify).process(content);
  return String(parsedMarkdown);
}

export async function readBatchOutput(batchFilePath) {
  try {
    // Check if the batch file exists
    await fs.access(batchFilePath);
    
    const batchContent = await fs.readFile(batchFilePath, 'utf8');
    const lines = batchContent.split('\n').filter(line => line.trim());
    const outputs = lines.map(line => {
      try {
        const json = JSON.parse(line);
        return json.response ? json.response.body.choices[0].message.content : null;
      } catch (e) {
        return null;
      }
    }).filter(content => content);

    return outputs.join('\n');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Batch file does not exist yet.');
      return null;
    }
    console.error('Error reading batch output:', error);
    return null;
  }
}
