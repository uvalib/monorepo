import * as fs from 'fs';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { SearchLibrary } from './SearchLibrary.js';

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
  }).argv as { [x: string]: unknown; indexFile: string; searchQuery: string; _: (string | number)[]; $0: string; };

  const main = async () => { // Mark the main function as async
    const searchLib = new SearchLibrary();
  
    try {
      const indexString = fs.readFileSync(argv.indexFile, 'utf8');
      await searchLib.loadFromString(indexString); // Wait for the promise to resolve
      const results = searchLib.performSearch(argv.searchQuery);
      console.log(`Search results for "${argv.searchQuery}":`);
      results.forEach((result) => {
        console.log(result);
      });
    } catch (error) {
      console.error(`Error: ${error}`);
      process.exit(1);
    }
  };
  
  main();
  