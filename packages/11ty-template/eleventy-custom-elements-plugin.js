const path = require('path');
const fs = require("fs");
const YAML = require("yaml");

class CustomElementsPlugin {
  constructor(config) {
    this.config = config;
  }

  initArguments = {};
  configFunction = (eleventyConfig) => {

    eleventyConfig.addTransform('addCustomElements', (content, outputPath) => {
      console.log(`Transforming ${outputPath}`);
      if (outputPath.endsWith('.html')) {
        const yamlPath = path.resolve(__dirname, 'node_modules', '@uvalib', 'cdn-builds', 'src', 'map.yml');
        const yaml = fs.readFileSync(yamlPath, "utf8");
        const customElements = YAML.parse(yaml);
        let scripts = '';
    
        for (const [name, cdnUrl] of Object.entries(customElements)) {
          // Only add script if the custom element tag is found in the content
          if (content.includes(`<${name}`)) {
            let finalUrl = cdnUrl;
            if (this.config.version === 'latest') {
              finalUrl = cdnUrl.replace('cdn-v{version}', 'latest');
            } else {
              finalUrl = cdnUrl.replace('{version}', this.config.version);
            }
            const script = `
              <script type="module" src="${finalUrl}"></script>
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
