# js-search

`js-search` is a library to search through indexed markdown documents. It can be used both in command-line environments and in client-side applications. The tool leverages the powerful search capabilities of FlexSearch and Fuse.js and provides an easy way to index and query documents.

## Features

- Index markdown documents from a directory
- Efficiently search through indexed documents using FlexSearch or Fuse.js
- Support for client-side search
- Include filenames in the search index for easy reference to original documents
- Can be integrated with different environments including browsers

## Installation

Ensure you have Node.js and npm installed, then run:

```
npm install @uvalib/js-search
```

## Usage

### Index Creation

#### Command-Line

Use the `createIndex.js` script to create an index from markdown documents in a specified directory.

```
npx createSearchIndex --inputDir /path/to/markdown/files --outputIndex /path/to/output/index.json --indexType fuse
```

#### Programmatically

You can also create an index programmatically using the `IndexCreator` class. Provide the input directory and output index file path.

```
import { IndexCreator } from '@uvalib/js-search';

const inputDir = './path/to/markdown/files';
const outputIndex = './path/to/output/index.json';

const indexCreator = new IndexCreator(inputDir, outputIndex);
indexCreator.createIndex();
```

### Performing Searches

#### Command-Line

Use the `searchIndex.js` script to perform searches on an existing index from the command line.

```
./searchIndex.js --indexFile /path/to/index.json --searchQuery "your search query"
```

#### Client-Side

You can use the `SearchLibrary` class to perform searches in client-side applications.

```
import { SearchLibrary } from '@uvalib/js-search';

const searchLib = new SearchLibrary();
searchLib.loadFromString(indexString);
const results = searchLib.performSearch('your search query');
```

## Configuration

- **inputDir**: Directory containing the markdown documents to index.
- **outputIndex**: Path where the search index file should be created.

### Search Libraries

js-search uses FlexSearch by default but also supports Fuse.js. It is designed to be flexible to work in different environments including browsers.

## Development

Clone the repository and install the dependencies:

```
git clone https://github.com/your/repo
cd js-search
npm install
```

Build the project:

```
npm run build
```

Run tests (if available):

```
npm test
```
