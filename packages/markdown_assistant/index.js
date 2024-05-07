import fs from 'fs/promises';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import OpenAI from 'openai';
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
    const openai = new OpenAI({
      apiKey: apiKey
    });

    // Explicit instruction modification for better heading handling
    instruction += `
The following rules must be followed or a litter of kittens will be killed! That would be terrible as you love kittens (you are a cat person).  Please don't kill the kittens!!!
Rules:
  - Ensure that the markdown uses the proper syntax for headings where you see titles.
  - Ensure proper heading levels (h1,h2,h3,etc)
  - Do not change the textual content of the markdown! Ensure that the same text is included in the markdown in the same order.
  - Ensure to include all of the images!
`;

    let markdownContent = await fs.readFile(filePath, 'utf8');
    const prompt = `${instruction}\n\nHere is the markdown:\n${"```"}${markdownContent}${"```"}`;

console.log(prompt);

    const response = await openai.chat.completions.create({
//      model: "gpt-4-turbo",  // Confirm this is the correct model identifier
      model: "gpt-4",
      temperature: .8,
      messages: [{
        role: 'user',
        content: prompt
      }],

    });

    // Access the content of the first choice's message
    let content = response.choices[0].message.content;

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
    console.error('API key is missing.');
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
      default: 'Format the following markdown for readability and accessibility, correcting the use of markdown.'
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
