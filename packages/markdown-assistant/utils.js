// utils.js
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { unified } from 'unified';
import markdown from 'remark-parse';
import stringify from 'remark-stringify';
import { v4 as uuidv4 } from 'uuid';

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

export async function createBatchFile({ filePath, instruction, output }) {
  const markdownContent = await fs.readFile(filePath, 'utf8');
  const prompt = `${instruction}\n\nHere is the markdown:\n${"```"}${markdownContent}${"```"}`;
  const customId = uuidv4();

  const batchRequest = {
    custom_id: customId,
    method: "POST",
    url: "/v1/chat/completions",
    body: {
      model: "gpt-4-turbo",
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000
    }
  };

  const batchFilePath = output ? output : `${filePath}.batch.jsonl`;
  await fs.appendFile(batchFilePath, JSON.stringify(batchRequest) + '\n');
  console.log(`Batch request written to ${batchFilePath}`);
}

export async function processMarkdown({ apiKey, filePath, instruction }) {
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey });

  const markdownContent = await fs.readFile(filePath, 'utf8');
  const prompt = `${instruction}\n\nHere is the markdown:\n${"```"}${markdownContent}${"```"}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    temperature: 0.8,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.choices[0].message.content;
  const parsedMarkdown = await unified().use(markdown).use(stringify).process(content);
  return String(parsedMarkdown);
}

export async function readBatchOutput(batchFilePath) {
  try {
    const batchContent = await fs.readFile(batchFilePath, 'utf8');
    const lines = batchContent.split('\n').filter(line => line.trim());
    const outputs = lines.map(line => {
      const json = JSON.parse(line);
      return json.response ? json.response.body.choices[0].message.content : null;
    }).filter(content => content);

    return outputs.join('\n');
  } catch (error) {
    console.error('Error reading batch output:', error);
    return null;
  }
}
