const mammoth = require('mammoth');
const TurndownService = require('turndown');
const fs = require('fs');
const path = require('path');

const turndownService = new TurndownService();

// Retrieve the file path from the command line arguments
const docxPath = process.argv[2];

if (!docxPath) {
    console.error('Please provide a .docx file path as an argument.');
    process.exit(1);
}

mammoth.convertToHtml({path: docxPath})
    .then(result => {
        const html = result.value;
        const messages = result.messages;
        console.log(messages);

        // Convert the HTML to markdown
        const markdown = turndownService.turndown(html);

        // Derive the new file path
        const parsedPath = path.parse(docxPath);
        const newFilePath = path.join(parsedPath.dir, `${parsedPath.name}.md`);

        // Write the markdown to a file
        fs.writeFileSync(newFilePath, markdown);

        console.log(`Markdown file created at ${newFilePath}`);
    })
    .catch(err => {
        console.error('An error occurred:', err);
    });
