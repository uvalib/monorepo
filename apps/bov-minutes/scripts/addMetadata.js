const path = require('path');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const matter = require('gray-matter');

const argv = yargs(hideBin(process.argv))
  .option('dir', {
    type: 'string',
    description: 'Directory of markdown files',
    demandOption: true,
  })
  .argv;

// Get all markdown files in the provided directory
const files = fs.readdirSync(argv.dir).filter(file => path.extname(file) === '.md');

console.log(`Found ${files.length} markdown files.`);

files.forEach((file, index) => {
  // Parse the filename to get the year and month
  let splitFile = file.split('-');
  const year = splitFile.shift();
  let month = splitFile.shift();
  
  // If there are additional data in filename, get that as well
  const restOfFile = splitFile.join('-');

  // Check if the month is valid (i.e., a number between 1 and 12)
  if (month.includes('.md')) {
    month = month.split('.')[0]; // remove the .md part
  }
  month = parseInt(month, 10);
  if (isNaN(month) || month < 1 || month > 12) {
    console.error(`Invalid month in file: ${file}`);
    return; // skip processing for this file
  }

  // Read the content of the markdown file
  const rawContent = fs.readFileSync(path.join(argv.dir, file), 'utf8');

  // Parse the existing front matter and content
  let { data, content } = matter(rawContent);

  // Update the front matter
  data = {
    ...data,
    layout: 'minutesLayout',
    year: year,
    month: month,
    tags: ['minutes'],
  };

  // Combine the updated front matter with the content
  const newContent = matter.stringify(content, data);

  // Overwrite the file with the new content
  fs.writeFileSync(path.join(argv.dir, file), newContent);

  console.log(`Processed file ${index + 1} of ${files.length}: ${file}`);
});

console.log(`All markdown files processed.`);
