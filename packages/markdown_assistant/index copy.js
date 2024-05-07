import fs from 'fs/promises';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ChatOpenAI as ChatAI } from "@langchain/openai";
import dotenv from 'dotenv';
import path from 'path';
import { unified } from 'unified';
import markdown from 'remark-parse';
import stringify from 'remark-stringify';

// Load environment variables
const loadEnv = async () => {
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
};

const processMarkdown = async (apiKey, filePath, instruction) => {
  try {
    const chatModel = new ChatAI({
      apiKey: apiKey,
      temperature: 0.0,  // Use a low temperature for more deterministic outputs
      model: "gpt-4"
    });
    let markdownContent = await fs.readFile(filePath, 'utf8');

    // Explicit instruction modification for better heading handling
    instruction += " Ensure that the markdown uses the proper syntax for headings.";

    const response = await chatModel.invoke(`${instruction}\n\n${markdownContent}`);
    let content = response.content;

    // Simple post-processing to convert bold lines to headers
    content = content.split('\n').map(line => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return '## ' + line.slice(2, -2);  // Convert to H2 headers, adjust as needed
      }
      return line;
    }).join('\n');

    const parsedMarkdown = await unified()
      .use(markdown)
      .use(stringify)
      .process(content);

    return String(parsedMarkdown);
  } catch (error) {
    console.error('Error processing markdown:', error);
    throw error;
  }
};

const main = async () => {
  const envLoaded = await loadEnv();
  if (!envLoaded || !process.env.OPENAI_API_KEY) {
    console.error('API key for LangChain is missing.');
    return;
  }

  const argv = yargs(hideBin(process.argv))
    .option('file', {
      alias: 'f',
      describe: 'Path to the markdown file',
      type: 'string',
      demandOption: true
    })
    .option('instruction', {
      alias: 'i',
      describe: 'Instruction to process the markdown',
      type: 'string',
      default: 'Format the markdown for readability and accessibility for display on the web, correcting the use of markdown but be sure not the change the content and only make content corrections where obvious errors and/or typos occur.'
    })
    .option('output', {
      alias: 'o',
      describe: 'Output file path',
      type: 'string'
    })
    .parse();

  try {
    const result = await processMarkdown(process.env.OPENAI_API_KEY, argv.file, argv.instruction);
    if (argv.output) {
      await fs.writeFile(argv.output, result);
      console.log(`Output written to ${argv.output}`);
    } else {
      console.log(result);
    }
  } catch (error) {
    console.error('Failed to execute script:', error);
  }
};

main();
