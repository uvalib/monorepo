const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const { DateTime } = require('luxon');

async function processFiles(directory) {
  const files = await fs.readdir(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = await fs.stat(filePath);
    if (stat.isFile() && filePath.endsWith('.md')) {
      const content = await fs.readFile(filePath, 'utf-8');
      if (!content.startsWith('---')) {
        try {
          const updatedContent = processContent(content);
          await fs.writeFile(filePath, updatedContent, 'utf-8');
        } catch (err) {
          console.error(`Error processing file ${filePath}`, err);
        }
      } else {
        console.log(`Skipping file ${filePath} as it already contains front matter`);
      }
    }
  }
}

function processContent(content) {
  const jsonldMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!jsonldMatch) {
    console.log('No JSON-LD found');
    return content;
  }

  const jsonldString = jsonldMatch[1];
  console.log('Extracted JSON-LD:', jsonldString);

  // Sanitize the JSON-LD string
  const sanitizedJsonldString = jsonldString.replace(/\\([[\]{}])/g, '$1');
  console.log('Sanitized JSON-LD:', sanitizedJsonldString);

  let jsonld;
  try {
    jsonld = JSON.parse(sanitizedJsonldString);
  } catch (err) {
    console.error('Error parsing JSON-LD:', sanitizedJsonldString, err);
    throw err;
  }

  const frontmatter = generateFrontmatter(jsonld);
  const updatedContent = content.replace(jsonldMatch[0], '');

  return `---\n${yaml.dump(frontmatter)}---\n\n${updatedContent}`;
}

function generateFrontmatter(jsonld) {
  const startDate = jsonld.startDate ? DateTime.fromISO(jsonld.startDate).toFormat('MMMM d, yyyy') : '';
  const title = jsonld.name + (startDate ? ` (${startDate})` : '');

  const frontmatter = {
    layout: 'minutesLayout',
    year: new Date(jsonld.startDate).getFullYear(),
    month: new Date(jsonld.startDate).getMonth() + 1,
    tags: ['minutes'],
    title: title,
    ...jsonld,
  };

  // Clean up frontmatter
  delete frontmatter['@context'];
  delete frontmatter['@type'];
  delete frontmatter.startDate;
  delete frontmatter.endDate;

  return frontmatter;
}

const directory = process.argv[2];
if (!directory) {
  console.error('Please provide a directory path');
  process.exit(1);
}

processFiles(directory)
  .then(() => console.log('Processing completed'))
  .catch(err => console.error('Error processing files', err));
