# PDF2TEI Transcription Workspace

This workspace is dedicated to transcribing a book into TEI (Text Encoding Initiative) format. It provides a simple script to split a source PDF into individual page PDFs, which can then be transcribed and annotated.

## Overview

- **Splitting script**: The `index.js` script (exposed as `pdf-split`) splits any input PDF into single-page PDF files.
- **Transcription**: Transcriptions are collected in a separate file (`transcription.md`), using ChatGPT prompts. This README will host the full list of prompts and notes.

## Prerequisites

- Node.js (>=14)
- pnpm package manager

## Installation

```bash
cd apps/pdf2tei
pnpm install
```

## Usage

Split a source PDF into pages:

```bash
pnpm split path/to/book.pdf -o pages
```

- `path/to/book.pdf`: Path to the source PDF file.
- `-o pages`: Directory where individual page PDFs will be written.

Output filenames follow the pattern `<basename>-page-<n>.pdf`.

## Transcription Workflow

1. Review the generated page PDFs in the `pages` directory.
2. Transcribe each page into the master transcription file (`transcription.md`).
3. Use the ChatGPT prompts listed below to guide transcription accuracy and TEI encoding.

## ChatGPT Prompts

> Add each prompt you used here, in chronological order. Include context and instructions for each page or section.

### Prompts for page by page transcription

```text
Imagine that you are a University Librarian and are an expert at PDF ebook to TEI transcription.
Attached are the ebook pdf that you are going to transcribe and an example tei document that is in the tei format we want.

You will transcribe this book, page by page to the best of your ability.
Be sure to markup images and describe them.  I will add links to the exported images afterwards.

Don't worry about the tei document markup, we are only transcribing these pages for body elements currently.

Let me know when you are ready for the first page.
```

```text
Please only transcribe what is in the source pdf.  At the end of this document you added "Bookman"
```

```text
When it appears that the paragraph or section continues to the next page, leave the closing tags off and remember where you left off for the next pages encoding. (leave off </p></div> in this case and leave off <div><p> in the next pages processing.  Do this for all of the pages that I give to you for transcription.
```

```text
Ok, we need to start over, be sure to start each page with the page break <pb n='1'/> (where in this case the page is 1).
```

```text
Ok, we need to start over as we also need <lb/> elements to denote line breaks.
See the sample tei document for any other rules that we need for this transcription.
```

## Project Structure

```text
apps/pdf2tei/
├── index.js        # CLI script to split PDF
├── pages/          # Output directory for single-page PDFs
├── transcription.md # Master transcript with TEI markup
└── README.md       # This document
```

---

Feel free to expand this README with additional notes, prompts, or instructions as the transcription project evolves.