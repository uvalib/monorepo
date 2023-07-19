# DOCX to Markdown Conversion Tool

This command-line tool allows you to convert Microsoft Word (.docx) files into Markdown format. It's built with Node.js and makes use of libraries such as `mammoth` for DOCX to HTML conversion and `turndown` for HTML to Markdown conversion.

## Installation

Assuming you have Node.js and npm installed, you can install the package by cloning the repository and installing its dependencies:

```bash
git clone <repository-url>
cd <repository-directory>
npm install
```

## Usage

To convert one or multiple files, you can use the `convert.js` script:

```bash
node convert.js file1.docx file2.docx --outdir /path/to/output/dir
```

The script accepts any number of file paths or glob patterns as positional arguments. The `--outdir` option can be used to specify the output directory for the Markdown files. If no output directory is provided, the Markdown files will be placed in the same directory as their corresponding DOCX files.

You can also use the `--overwrite` option to overwrite existing Markdown files. If this flag is not set and a Markdown file already exists with the same name as a DOCX file, the script will skip the conversion for that file and log a message to the console.

Here are a few more examples of how you can use the script:

```bash
# Convert a single file and place the output in the same directory
node convert.js file.docx

# Convert multiple files and place the outputs in a specific directory
node convert.js file1.docx file2.docx --outdir /path/to/output/dir

# Overwrite existing Markdown files
node convert.js file.docx --overwrite
```

If any warnings occur during the conversion (e.g., due to unrecognized styles in the DOCX files), they will be printed to the console.
