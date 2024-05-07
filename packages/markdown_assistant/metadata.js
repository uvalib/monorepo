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

const processMarkdown = async (apiKey, filePath, instruction, embed) => {
  try {
    const openai = new OpenAI({
      apiKey: apiKey
    });

    // Explicit instruction modification for better heading handling
    instruction += `
The metadata should take the following form:
${"```"}
{
  "@context": "...",
  "@type": "...",
  "name": "...",
  "startDate": "...",
  "endDate": "...",
  "location": {...}
  },
  "organizer": {...},
  "keywords": "keyword1, keyword2, ...",
  "description": "...",
  "attendee": [...],
  "about": [{...},{...}]
  },
  "url": "..."
}
${"```"}

The following rules must be followed or a litter of kittens will be killed! That would be terrible as you love kittens (you are a cat person).  Please don't kill the kittens!!!
Rules:
- Only return the metadata for this document! 
- Never make up if the data is not in the document or is not known to be true.
- Be sure to list all of the attendees.
- Please be as thorough as possible and use your knowledge of UVA to extend the metadata!
- Don't try to format the data that you return by wrapping it in '${"```"}'
- Ensure that you return valid json-ld using the schema.org vocabulary.
`;

    let markdownContent = await fs.readFile(filePath, 'utf8');
    const prompt = `${instruction}\n\nHere is the markdown:\n${"```"}${markdownContent}${"```"}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",  // Confirm this is the correct model identifier
//      model: "gpt-4",
      temperature: .8,
      messages: [{
        role: 'user',
        content: prompt
      }],

    });

    // Access the content of the first choice's message
    let content = response.choices[0].message.content;

    if (embed) {
      // Embed the JSON-LD metadata into the original markdown content
      content = `\n<script type="application/ld+json">\n${content}\n</script>\n` + markdownContent;
    }

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
      default: 'You are a metadata expert that specializes in schema.org and json-ld. You are very knowledgeable about the University of Virginia'
    })
    .option('output', {
      alias: 'o',
      describe: 'Output file path',
      type: 'string'
    })
    .option('embed', {
      alias: 'e',
      type: 'boolean',
      describe: 'Embed JSON-LD metadata into the original markdown',
      default: false
    })
    .parse();

  try {
    const result = await processMarkdown(process.env.OPENAI_API_KEY, argv.file, argv.instruction, argv.embed);
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
