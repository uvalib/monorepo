import { Plugin } from "eleventy";
import { readFileSync } from "fs";
import { YAML } from "yaml";

export default class CustomElementsPlugin implements Plugin {
  constructor(private readonly config: {
    version: string;
  }) {}

  async onInit() {
    const yaml = readFileSync("custom-elements.yaml", "utf8");
    const customElements = YAML.parse(yaml);

    for (const [name, cdnUrl] of Object.entries(customElements)) {
      const script = `
        <script src="${cdnUrl.replace("{version}", this.config.version)}"></script>
      `;
      this.site.head.append(script);
    }
  }
}
