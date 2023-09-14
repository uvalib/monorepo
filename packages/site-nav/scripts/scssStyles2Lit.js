/*
A bit of a manual process currently
this script scyncs the styles used in drupal (maintained by our designer) to a test css module
Then you use that locally in the demo, then use Chrome dev tools to show unused parts to cleanup.
Then perhaps use chatGPT to replace instances of colors that are maintained as css custom properties
<rant> yes, things could be so much more organized if we thought about development for the organization instead of on a project by project basis. </rant>
*/

const sass = require('sass');
const fs = require('fs-extra');
const path = require('path');
const postcss = require('postcss');
const prettify = require('postcss-prettify');

// Get the directory of the current script
const scriptDir = path.dirname(__filename);

const ROOT_URL = 'https://www.library.virginia.edu/themes/uvalib-drupal-theme/css';

function adjustUrlPaths(css, rootUrl) {
  return css.replace(/url\(['"]?(.*?)['"]?\)/g, (match, url) => {
    if (url.startsWith('http') || url.startsWith('data:')) {
      return match; // If it's already an absolute URL or a data URL, don't change it
    } else if (url.startsWith('/')) {
      return `url(${rootUrl}${url})`; // Root-relative URL
    } else if (url.startsWith('./')) {
      return `url(${rootUrl}/${url.substring(2)})`; // Relative URL
    } else if (url.startsWith('../')) {
      // Handle the '../' case by removing the last segment from the root URL
      const adjustedRoot = rootUrl.substring(0, rootUrl.lastIndexOf('/'));
      return `url(${adjustedRoot}/${url.substring(3)})`;
    } else {
      return match; // If it doesn't match any of the above, return the original
    }
  });
}




// Define paths relative to the script's directory
const inputSCSSPath = path.join(
  scriptDir,
  './style.scss'
);
const outputModulePath = path.join(scriptDir, '../src/StyleSync.ts');

// Compile SCSS to CSS
const result = sass.renderSync({
  file: inputSCSSPath,
  outputStyle: 'expanded', // Use 'expanded' for a more readable output
});

// Get the compiled CSS as a string
let cssContent = result.css.toString();

// Adjust the URLs in the CSS
cssContent = adjustUrlPaths(cssContent, ROOT_URL);

// Format the CSS using postcss
postcss([prettify])
  .process(cssContent, { from: undefined })
  .then(result => {
    cssContent = result.css;

    // Transform the CSS into a module
    const moduleContent = `
import { css } from 'lit';

export default css\`
${cssContent}
\`;
`;

    // Write the module to the final output path
    fs.writeFileSync(outputModulePath, moduleContent);

    console.log(`SCSS compiled and module created at ${outputModulePath}`);
  })
  .catch(error => {
    console.error(`Error during CSS formatting: ${error}`);
  });
