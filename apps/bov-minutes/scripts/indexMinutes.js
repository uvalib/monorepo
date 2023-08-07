#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { Index } = require('flexsearch');

const argv = yargs(hideBin(process.argv))
  .option('outputIndex', {
    type: 'string',
    description: 'Output path for the search index',
    demandOption: true,
  })
  .option('inputDir', {
    type: 'string',
    description: 'Input directory for the markdown files',
    demandOption: true,
  })
  .argv;

const index = new Index({
  charset: "latin",
  preset: 'match',
  tokenize: 'strict',
  cache: false
});

const processFile = (file) => {
  const filePath = path.join(argv.inputDir, file);
  const rawContent = fs.readFileSync(filePath, 'utf8');

  const { data, content } = matter(rawContent);

  if (data && content && content.trim() !== '' && Object.keys(data).length > 0) {
    const docToAdd = {
      id: filePath,
      text: content,
    };
//    console.log(`Adding document: ${JSON.stringify(docToAdd, null, 2)}`);
    index.add(docToAdd.id, docToAdd.text);
  }
};

fs.readdir(argv.inputDir, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err}`);
    process.exit(1);
  }

  const markdownFiles = files.filter((file) => path.extname(file) === '.md');

  for (let file of markdownFiles) {
    processFile(file);
  }

  //console.log(JSON.stringify(index))
  const numberOfKeysToExport = 4 //Object.keys(index).length * 3 + 3;
  //console.log(numberOfKeysToExport)

  let count = 0;
  const exportedIndex = {};

  index.export((key, data) => {
    console.log(key)
    exportedIndex[key] = data;
    count += 1;

    if (count === numberOfKeysToExport) {
      console.log("DONE")
      try {
        fs.writeFileSync(argv.outputIndex, JSON.stringify(exportedIndex));
        console.log(`Search index written to ${argv.outputIndex}.`);
      } catch (error) {
        console.error(`Error writing search index: ${error}`);
      }
    }
  });
});
