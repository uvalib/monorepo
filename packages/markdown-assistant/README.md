# Markdown Processor

This package provides scripts to process markdown files using the OpenAI API. It includes functionalities to format markdown, generate metadata, and ensure accessibility of images with alt text. The package supports batch processing to handle multiple requests efficiently.

## Prerequisites

- Node.js
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository:

   ```
   git clone <repository_url>
   ```

2. Navigate to the project directory and install dependencies:

   ```
   cd markdown-processor
   npm install
   ```

3. Create a `.env` file in the root directory with your OpenAI API key:

   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

## Usage

### Format Markdown

Format a markdown file or all markdown files in a directory using OpenAI API.

#### Command

   ```
   node index.js --file path/to/markdown.md [--instruction "Custom instruction"] [--output path/to/output.md] [--batch]
   ```

#### Options

- `--file, -f`: Path to the markdown file or directory containing markdown files (required)
- `--instruction, -i`: Custom instruction for formatting the markdown
- `--output, -o`: Path to the output file. If not provided, the output file will be the input filename with `.out` added before the extension.
- `--batch, -b`: Create a batch file and use output if present

### Generate Metadata

Generate JSON-LD metadata for a markdown file or all markdown files in a directory.

#### Command

   ```
   node metadata.js --file path/to/markdown.md [--instruction "Custom instruction"] [--output path/to/output.md] [--embed] [--batch]
   ```

#### Options

- `--file, -f`: Path to the markdown file or directory containing markdown files (required)
- `--instruction, -i`: Custom instruction for generating metadata
- `--output, -o`: Path to the output file. If not provided, the output file will be the input filename with `.out` added before the extension.
- `--embed, -e`: Embed JSON-LD metadata into the original markdown
- `--batch, -b`: Create a batch file and use output if present

### Ensure Image Accessibility

Add or overwrite alt text for images in a markdown file or all markdown files in a directory based on accessibility guidelines.

#### Command

   ```
   node a11y-images-alt.js --file path/to/markdown.md [--output path/to/output.md] [--overwrite] [--batch]
   ```

#### Options

- `--file, -f`: Path to the markdown file or directory containing markdown files (required)
- `--output, -o`: Path to the output file. If not provided, the output file will be the input filename with `.out` added before the extension.
- `--overwrite, -ow`: Overwrite existing alt attributes
- `--batch, -b`: Create a batch file and use output if present

### Batch Processor

Process batch files created by the above scripts. The batch processor will submit new jobs, check for completed jobs, output the results, and clean up the batch files of completed jobs.

#### Command

   ```
   node batch_processor.js --input path/to/batch_file_or_directory
   ```

#### Options

- `--input, -i`: Path to the batch file or directory containing batch files (required)

## Example Workflows

### Formatting Markdown and Using Batch Output

1. Create a batch file for formatting markdown:

   ```
   node index.js --file path/to/markdown.md --batch
   ```

2. Process the batch file:

   ```
   node batch_processor.js --input path/to/markdown.md.batch.jsonl
   ```

3. The next time you run the script with the `--batch` option, it will use the batch output if present:

   ```
   node index.js --file path/to/markdown.md --batch
   ```

### Generating Metadata and Using Batch Output

1. Create a batch file for generating metadata:

   ```
   node metadata.js --file path/to/markdown.md --batch
   ```

2. Process the batch file:

   ```
   node batch_processor.js --input path/to/markdown.md.batch.jsonl
   ```

3. The next time you run the script with the `--batch` option, it will use the batch output if present:

   ```
   node metadata.js --file path/to/markdown.md --batch
   ```

### Ensuring Image Accessibility and Using Batch Output

1. Create a batch file for ensuring image accessibility:

   ```
   node a11y-images-alt.js --file path/to/markdown.md --batch
   ```

2. Process the batch file:

   ```
   node batch_processor.js --input path/to/markdown.md.batch.jsonl
   ```

3. The next time you run the script with the `--batch` option, it will use the batch output if present:

   ```
   node a11y-images-alt.js --file path/to/markdown.md --batch
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.
