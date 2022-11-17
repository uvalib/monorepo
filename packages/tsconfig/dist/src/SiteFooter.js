import { __decorate } from "tslib";
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
export class SiteFooter extends LitElement {
    constructor() {
        super(...arguments);
        this.title = 'Hey there';
        this.counter = 5;
    }
    __increment() {
        this.counter += 1;
    }
    render() {
        return html `
      <h2>${this.title} Nr. ${this.counter}!</h2>
      <button @click=${this.__increment}>increment</button>
    `;
    }
}
SiteFooter.styles = css `
    :host {
      display: block;
      padding: 25px;
      color: var(--site-footer-text-color, #000);
    }
  `;
__decorate([
    property({ type: String })
], SiteFooter.prototype, "title", void 0);
__decorate([
    property({ type: Number })
], SiteFooter.prototype, "counter", void 0);
//# sourceMappingURL=SiteFooter.js.map