# Markdown Assistant

This project provides tools to process and format markdown files using OpenAI's GPT models. The primary script, `index.js`, allows for both batch and individual file processing, with options for custom instructions and output handling.

## Prerequisites

- Node.js
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository.
2. Install dependencies using npm or yarn:
   
   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Usage

### Command Line Options

- `--file, -f`: Path to the markdown file or directory (required).
- `--instruction, -i`: Instruction to process the markdown (default: 'Please format this markdown correctly.').
- `--output, -o`: Output file path (optional).
- `--batch, -b`: Create a batch file and use output if present (default: false).
- `--model, -m`: Model to use for processing (default: 'gpt-4o-mini').
- `--overwrite, -w`: Overwrite the input file with the processed content (default: false).

### Examples

#### Process a Single File

To process a single markdown file and output the result to a new file:

```
node index.js --file path/to/file.md --output path/to/output.md
```

#### Process a Directory of Files

To process all markdown files in a directory:

```
node index.js --file path/to/directory --batch
```

#### Overwrite the Original File

To overwrite the original markdown file with the processed content:

```
node index.js --file path/to/file.md --overwrite
```

#### Custom Instruction

To provide a custom instruction for processing:

```
node index.js --file path/to/file.md --instruction "Your custom instruction here"
```

### Batch Processing Scripts

#### `batch_processor_submit.js`

This script is used to submit batch jobs to OpenAI.

```
node batch_processor_submit.js --input path/to/batch_file.jsonl
```

#### `batch_processor_fetch.js`

This script is used to fetch results from previously submitted batch jobs.

```
node batch_processor_fetch.js --input path/to/batch_file.jsonl
```

### Metadata Processing

#### `metadata.js`

This script processes metadata for markdown files. It extracts metadata and appends it to the markdown files.

```
node metadata.js --file path/to/markdown_file.md
```

### Accessibility Image Alt Text

#### `a11y-images-alt.js`

This script generates alt text for images in markdown files to improve accessibility.

```
node a11y-images-alt.js --file path/to/markdown_file.md
```

## Additional Information

- The script processes up to 10 files concurrently to avoid rate limits.
- It will only process files containing the comment `<!-- llmformatted -->` unless the `--overwrite` flag is set.
- If rate limits are encountered, the script will pause and retry after a minute.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
