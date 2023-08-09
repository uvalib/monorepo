#!/usr/bin/env node

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { IndexCreator, IndexType } from './indexCreator';

const argv = yargs(hideBin(process.argv)).options({
  'outputIndex': { type: 'string', demandOption: true, description: 'Output path for the search index' },
  'inputDir': { type: 'string', demandOption: true, description: 'Input directory for the markdown files' },
  'indexType': { type: 'string', choices: ['flexsearch', 'fuse'], default: 'flexsearch', description: 'Indexing library to use (flexsearch or fuse)' },
}).argv as { [x: string]: unknown; outputIndex: string; inputDir: string; indexType: IndexType; _: (string | number)[]; $0: string; };

const indexCreator = new IndexCreator(argv.inputDir, argv.outputIndex, argv.indexType);
indexCreator.createIndex();
