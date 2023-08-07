#!/usr/bin/env node

const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { Index } = require('flexsearch');

const argv = yargs(hideBin(process.argv))
  .option('indexFile', {
    type: 'string',
    description: 'Path to the search index file',
    demandOption: true,
  })
  .option('searchQuery', {
    type: 'string',
    description: 'Search query',
    demandOption: true,
  })
  .argv;

const loadIndex = () => {
  try {
    const rawContent = fs.readFileSync(argv.indexFile, 'utf8');
    return JSON.parse(rawContent);
  } catch (error) {
    console.error(`Error reading search index: ${error}`);
    process.exit(1);
  }
};

const performSearch = (index, query) => {
  const results = index.search(query);
  console.log(`Search results for "${query}":\n${JSON.stringify(results, null, 2)}`);
};

const main = () => {
  const exportedIndex = loadIndex();
  const index = new Index();

  // Import all keys from the exported index
  for (let key in exportedIndex) {
    index.import(key, exportedIndex[key]);
  }

  performSearch(index, argv.searchQuery);
};

main();
