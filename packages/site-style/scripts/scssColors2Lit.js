const fs = require('fs');
const path = require('path');

// Path to the SCSS file in the node_modules
const scssFilePath = path.join(__dirname, '..', 'node_modules', 'drupal_library_theme', 'src', 'scss', 'base', '_colors.scss');

// Read the SCSS file
const scssContent = fs.readFileSync(scssFilePath, 'utf8');

// Extract SCSS variables using a regex
const variableMatches = scssContent.match(/\$[a-z-]+:\s*#[0-9a-fA-F]+;/g);

if (!variableMatches) {
    console.error("No SCSS variables found.");
    process.exit(1);
}

// Transform SCSS variables to LitElement CSS format
const transformedContent = variableMatches.map(variable => {
    const [name, value] = variable.split(':');
    return `--${name.trim().slice(1)}: ${value.trim()};`;
}).join('\n');

// Wrap the transformed content in a LitElement CSS module
const outputContent = `
import { css } from 'lit';
export const Colors = css\`
  ${transformedContent}
\`;

export const LibraryColors = css\`
:host {
  \$\{Colors\}

  /* UVA White */
  --uva-white: #fff;
  --uva-black: #000;
}
\`;

export const ColorsSheet = new CSSStyleSheet();
ColorsSheet.replaceSync(\`
  \$\{LibraryColors\}
\`);
`;

// Write the transformed content to a new file
const outputPath = path.join(__dirname, '..', 'src', 'LibraryColors.ts');
fs.writeFileSync(outputPath, outputContent);

console.log(`SCSS variables transformed and written to ${outputPath}`);
