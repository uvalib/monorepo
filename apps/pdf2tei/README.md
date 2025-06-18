# PDF2TEI Transcription Workspace

This workspace is dedicated to transcribing a book into TEI (Text Encoding Initiative) format. It provides a simple script to split a source PDF into individual page PDFs, which can then be transcribed and annotated.

## Overview

- **Splitting script** (`pdf-split`) – split a PDF into single-page PDFs.
- **Outline detection** (`pdf-outline`) – analyse the full PDF and generate *book.outline.json* with page-range metadata for front/body/back and each chapter/article.
- **Front builder** (`pdf-front`) – produce a validated `<teiHeader>` and `<front>` element from the pages marked as front matter.
- **Per-page transcription** (`pdf-transcribe`, `batchTranscribe.js`) – convert body pages into TEI fragments.
- **Assembler** (`tei-assemble`) – merge header, front, body and back fragments into a complete TEI document.

### One-command view

```text
book.pdf ──► outline  ──► front  ──► transcribe pages  ──► assemble  ──► final-transcription.tei.xml
```

## Prerequisites

- Node.js (>=14)
- pnpm package manager

## Installation

```bash
cd apps/pdf2tei
pnpm install
```

## Quick-start (end-to-end)

```bash
# 0. API key
export OPENAI_API_KEY=your_key

# 1. Detect outline
pnpm outline book.pdf            # → book.outline.json

# 2. Build header + front matter
pnpm front -p book.pdf -o book.outline.json   # → book.teiHeader.xml + book.front.xml

# 3. (Optional) Split PDF if you want page-by-page files
pnpm split book.pdf -o book-pages

# 4. Transcribe body pages (existing workflow)
node batchTranscribe.js          # writes fragments/, then
pnpm merge                       # merges into tei.xml (<body>)

# 5. Assemble everything
pnpm assemble \
  --header book.teiHeader.xml \
  --front  book.front.xml \
  --body   tei.xml \
  -o final-transcription.tei.xml
```

At this point **final-transcription.tei.xml** is a complete TEI P5 document ready for QA.

## Usage

Split a source PDF into pages:

```bash
pnpm split path/to/book.pdf -o pages
```

- `path/to/book.pdf`: Path to the source PDF file.
- `-o pages`: Directory where individual page PDFs will be written.

Output filenames follow the pattern `<basename>-page-<n>.pdf`.

Transcribe a single page into a TEI fragment:

```bash
# load API key (or add to .env)
export OPENAI_API_KEY=your_key_here

# via npm script
pnpm transcribe pages/book-page-1.pdf --page-number 1 --prior-tags "<p>" --output fragment-1.xml

# via global bin
pdf-transcribe pages/book-page-1.pdf -n 1 -p "<p>" -o fragment-1.xml
```

- `--page-number`, `-n`: (required) The page number to tag in the TEI.
- `--prior-tags`, `-p`: (optional) Open tag context from the previous page (e.g., `<p>`).
- `--output`, `-o`: (optional) File to write the TEI fragment; defaults to stdout.

Output will be a TEI XML fragment starting with `<pb n="1"/>` and including any open/closed tags as per the transcription rules.

### Batch Transcription

Process multiple pages in sequence, passing open-tag context from one to the next:

```bash
# Ensure pages live in book-pages/ and you have a .env with OPENAI_API_KEY
pnpm exec node batchTranscribe.js
```

By default it starts at `book-pages/book-page-7.pdf` → page 1, then iterates through all PDFs in numeric order, writing JSON fragments to `fragments/`.

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
├── index.js            # CLI script to split PDF
├── transcribe.js       # Single-page TEI transcription script
├── batchTranscribe.js  # Batch processing script over multiple pages
├── outlineBook.js      # Generate outline JSON (front/body/back ranges)
├── frontBuilder.js     # Create <teiHeader> and <front> fragments
├── mergeFragments.js   # Merge page-level TEI fragments into <body>
├── assembleTei.js      # Assemble final TEI document
├── pages/              # Output of split (single-page PDFs)
├── book-pages/         # Manually provisioned pages for transcription
├── fragments/          # JSON fragments output by batchTranscribe.js
├── transcription.md    # Master transcript with TEI markup (optional)
└── README.md           # This document
```

---

Feel free to expand this README with additional notes, prompts, or instructions as the transcription project evolves.
