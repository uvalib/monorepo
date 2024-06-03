# Markdown Processor

This package provides scripts to process markdown files using the OpenAI API. It includes functionalities to format markdown, generate metadata, and ensure accessibility of images with alt text. The package supports batch processing to handle multiple requests efficiently.

## Prerequisites

- Node.js
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository:

   CCC
   git clone <repository_url>
   CCC

2. Navigate to the project directory and install dependencies:

   CCC
   cd markdown-processor
   npm install
   CCC

3. Create a `.env` file in the root directory with your OpenAI API key:

   CCC
   OPENAI_API_KEY=your_openai_api_key
   CCC

## Usage

### Format Markdown

Format a markdown file using OpenAI API.

#### Command

   CCC
   node index.js --file path/to/markdown.md [--instruction "Custom instruction"] [--output path/to/output.md] [--batch] [--use-batch-output]
   CCC

#### Options

- `--file, -f`: Path to the markdown file (required)
- `--instruction, -i`: Custom instruction for formatting the markdown
- `--output, -o`: Path to the output file
- `--batch, -b`: Create a batch file instead of sending a request
- `--use-batch-output, -u`: Use the output from the batch file if present

### Generate Metadata

Generate JSON-LD metadata for a markdown file.

#### Command

   CCC
   node metadata.js --file path/to/markdown.md [--instruction "Custom instruction"] [--output path/to/output.md] [--embed] [--batch] [--use-batch-output]
   CCC

#### Options

- `--file, -f`: Path to the markdown file (required)
- `--instruction, -i`: Custom instruction for generating metadata
- `--output, -o`: Path to the output file
- `--embed, -e`: Embed JSON-LD metadata into the original markdown
- `--batch, -b`: Create a batch file instead of sending a request
- `--use-batch-output, -u`: Use the output from the batch file if present

### Ensure Image Accessibility

Add or overwrite alt text for images in a markdown file based on accessibility guidelines.

#### Command

   CCC
   node a11y-images-alt.js --file path/to/markdown.md [--output path/to/output.md] [--overwrite] [--batch] [--use-batch-output]
   CCC

#### Options

- `--file, -f`: Path to the markdown file (required)
- `--output, -o`: Path to the output file
- `--overwrite, -ow`: Overwrite existing alt attributes
- `--batch, -b`: Create a batch file instead of sending a request
- `--use-batch-output, -u`: Use the output from the batch file if present

### Batch Processor

Process batch files created by the above scripts.

#### Command

   CCC
   node batch_processor.js --input path/to/batch_file_or_directory
   CCC

#### Options

- `--input, -i`: Path to the batch file or directory containing batch files (required)

## Example Workflows

### Formatting Markdown and Using Batch Output

1. Create a batch file for formatting markdown:

   CCC
   node index.js --file path/to/markdown.md --batch --output path/to/batch_file.batch.jsonl
   CCC

2. Process the batch file:

   CCC
   node batch_processor.js --input path/to/batch_file.batch.jsonl
   CCC

3. Use the output from the batch file:

   CCC
   node index.js --file path/to/markdown.md --use-batch-output --output path/to/formatted_output.md
   CCC

### Generating Metadata and Using Batch Output

1. Create a batch file for generating metadata:

   CCC
   node metadata.js --file path/to/markdown.md --batch --output path/to/batch_file.batch.jsonl
   CCC

2. Process the batch file:

   CCC
   node batch_processor.js --input path/to/batch_file.batch.jsonl
   CCC

3. Use the output from the batch file:

   CCC
   node metadata.js --file path/to/markdown.md --use-batch-output --output path/to/metadata_output.md
   CCC

### Ensuring Image Accessibility and Using Batch Output

1. Create a batch file for ensuring image accessibility:

   CCC
   node a11y-images-alt.js --file path/to/markdown.md --batch --output path/to/batch_file.batch.jsonl
   CCC

2. Process the batch file:

   CCC
   node batch_processor.js --input path/to/batch_file.batch.jsonl
   CCC

3. Use the output from the batch file:

   CCC
   node a11y-images-alt.js --file path/to/markdown.md --use-batch-output --output path/to/updated_markdown.md
   CCC

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.
