var _LibGuidesBentoCard_libGuidesData;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { LibGuidesData } from '@uvalib/data-wrap';
import { BentoCard } from './BentoCard.js';
export class LibGuidesBentoCard extends BentoCard {
    constructor() {
        super();
        _LibGuidesBentoCard_libGuidesData.set(this, void 0);
        this.title = "LibGuides";
        __classPrivateFieldSet(this, _LibGuidesBentoCard_libGuidesData, new LibGuidesData({ query: "" }), "f");
    }
    updated(_changedProperties) {
        if (_changedProperties.has('keyword')) {
            __classPrivateFieldGet(this, _LibGuidesBentoCard_libGuidesData, "f").query = this.keyword;
            __classPrivateFieldGet(this, _LibGuidesBentoCard_libGuidesData, "f").fetchData()
                .then((data) => { this.items = data; });
        }
    }
    render() {
        return html `
      <h1>${unsafeHTML(this.title)}</h1>
      <h2>Search for ${this.keyword}</h2>
      <ul>
        ${this.items.map(item => html `
          <li>
            ${unsafeHTML(item.title)}<br />
            ${unsafeHTML(item.description)}
          </li>
        `)}
      </ul>
    `;
    }
}
_LibGuidesBentoCard_libGuidesData = new WeakMap();
//# sourceMappingURL=LibGuidesBentoCard.js.map