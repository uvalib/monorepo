#!/usr/bin/env node

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { IndexCreator } from './IndexCreator';

const argv = yargs(hideBin(process.argv)).options({
    'outputIndex': { type: 'string', demandOption: true, description: 'Output path for the search index' },
    'inputDir': { type: 'string', demandOption: true, description: 'Input directory for the markdown files' },
  }).argv as { [x: string]: unknown; outputIndex: string; inputDir: string; _: (string | number)[]; $0: string; };
  
const indexCreator = new IndexCreator(argv.inputDir, argv.outputIndex);
indexCreator.createIndex();
