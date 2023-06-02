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
        const yamlPath = path.join(__dirname, 'custom-elements.yaml');
        const yaml = fs.readFileSync(yamlPath, "utf8");
        const customElements = YAML.parse(yaml);
        let scripts = '';
    
        for (const [name, cdnUrl] of Object.entries(customElements)) {
          // Only add script if the custom element tag is found in the content
          if (content.includes(`<${name}`)) {
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
