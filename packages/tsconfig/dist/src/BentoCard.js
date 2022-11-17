import { __decorate } from "tslib";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
export class BentoCard extends LitElement {
    constructor() {
        super(...arguments);
        this.keyword = 'Hey there';
        this.title = "";
        this.items = [];
    }
    render() {
        return html `
      <h1>${this.title}</h1>
      <h2>Search for ${this.keyword}</h2>
      <ul>
        ${this.items.map(item => html `
          <li><a href="${item.link}">${item.title}</a>: ${item.description}</li>
        `)}
      </ul>
    `;
    }
}
BentoCard.styles = css `
    :host {
      display: block;
      padding: 25px;
      color: var(--bento-box-text-color, #000);
      border: 1px solid black;
      border-radius: 16px;
    }
  `;
__decorate([
    property({ type: String })
], BentoCard.prototype, "keyword", void 0);
__decorate([
    property({ type: String })
], BentoCard.prototype, "title", void 0);
__decorate([
    property({ type: Array })
], BentoCard.prototype, "items", void 0);
//# sourceMappingURL=BentoCard.js.map