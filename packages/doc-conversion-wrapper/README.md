# DOCX to Markdown Conversion Tool

This command-line tool allows you to convert Microsoft Word (.docx) files and Text Encoding Initiative (.tei) files into Markdown format. It's built with Node.js and makes use of libraries such as `mammoth` for DOCX to HTML conversion, Docker and Saxon-HE for .tei to HTML conversion and `turndown` for HTML to Markdown conversion.

## Installation

Assuming you have Node.js, npm, and Docker installed, you can install the package by cloning the repository and installing its dependencies:

```
git clone <repository-url>
cd <repository-directory>
npm install
```

To build the Docker images required for this tool, you can use the `build` script defined in the `package.json` file:

```
npm run build
```

## Usage

You can use the `doc2md` command to convert one or multiple files. The command accepts any number of file paths or glob patterns as positional arguments. The `--outdir` option can be used to specify the output directory for the Markdown files. If no output directory is provided, the Markdown files will be placed in the same directory as their corresponding DOCX or .tei files.

You can also use the `--overwrite` option to overwrite existing Markdown files. If this flag is not set and a Markdown file already exists with the same name as a DOCX or .tei file, the script will skip the conversion for that file and log a message to the console.

```
npx doc2md file1.docx file2.tei --outdir /path/to/output/dir --overwrite
```

Here are a few more examples of how you can use the command:

```
# Convert a single file and place the output in the same directory
npx doc2md file.docx

# Convert multiple files and place the outputs in a specific directory
npx doc2md file1.docx file2.tei --outdir /path/to/output/dir

# Overwrite existing Markdown files
npx doc2md file.docx --overwrite
```

If any warnings occur during the conversion (e.g., due to unrecognized styles in the DOCX files), they will be printed to the console.
