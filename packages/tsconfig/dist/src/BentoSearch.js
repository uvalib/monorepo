import { __decorate } from "tslib";
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
export class BentoSearch extends LitElement {
    constructor() {
        super(...arguments);
        this.keyword = '';
        this.sourceTitle = 'UVA Library';
    }
    render() {
        return html `
      <input id="search" .value="${this.keyword}" @keyup="${(e) => { if (e.key === 'Enter' || e.keyCode === 13)
            this.search(); }}"></input>
      <button @click="${this.search}">Search</button>
    `;
    }
    search() {
        var _a;
        const input = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('search');
        this.keyword = input.value;
        this.dispatchEvent(new Event('search', { bubbles: true, composed: true }));
    }
}
BentoSearch.styles = css `
    :host {
      display: block;
      padding: 25px;
      color: var(--bento-box-text-color, #000);
    }
  `;
__decorate([
    property({ type: String })
], BentoSearch.prototype, "keyword", void 0);
__decorate([
    property({ type: String, attribute: "source-title" })
], BentoSearch.prototype, "sourceTitle", void 0);
//# sourceMappingURL=BentoSearch.js.map