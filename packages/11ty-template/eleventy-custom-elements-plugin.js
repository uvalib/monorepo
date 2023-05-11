const fs = require('fs').promises;
const YAML = require('yaml');

class CustomElementsPlugin {
  constructor(config) {
    this.config = config;
  }

  initArguments = {};
  configFunction = (eleventyConfig) => {
    let customElements;

    // Read and parse the YAML file once
    fs.readFile('custom-elements.yaml', 'utf8')
      .then((yaml) => {
        customElements = YAML.parse(yaml);
      })
      .catch((err) => {
        console.error(`Failed to read or parse custom-elements.yaml: ${err}`);
      });

    eleventyConfig.addTransform('addCustomElements', (content, outputPath) => {
      console.log(`Transforming ${outputPath}`);
      if (outputPath.endsWith('.html')) {
        let scripts = '';
    
        for (const [name, cdnUrl] of Object.entries(customElements)) {
          // Only add script if the custom element tag is found in the content
          if (content.includes(`<${name}>`)) {
            const script = `
              <script type="module" src="${cdnUrl.replace("{version}", this.config.version)}"></script>
            `;
            scripts += script;
          }
        }

        return content + scripts;
      }
      return content;
    });
  };
}

module.exports = CustomElementsPlugin;
