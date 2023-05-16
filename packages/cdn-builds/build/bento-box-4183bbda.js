import { i as i$1, _ as __decorate, y, e } from './query-assigned-elements-cb6980e1.js';
import { S as SiteStyle } from './SiteStyle-725ba497.js';

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o=({finisher:e,descriptor:t})=>(o,n)=>{var r;if(void 0===n){const n=null!==(r=o.originalKey)&&void 0!==r?r:o.key,i=null!=t?{kind:"method",placement:"prototype",key:n,descriptor:t(o.key)}:{...o,key:n};return null!=e&&(i.finisher=function(t){e(t,n);}),i}{const r=o.constructor;void 0!==t&&Object.defineProperty(o,n,t(n)),null==e||e(r,n);}};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function i(i,n){return o({descriptor:o=>{const t={get(){var o,n;return null!==(n=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(i))&&void 0!==n?n:null},enumerable:!0,configurable:!0};if(n){const n="symbol"==typeof o?Symbol():"__"+o;t.get=function(){var o,t;return void 0===this[n]&&(this[n]=null!==(t=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(i))&&void 0!==t?t:null),this[n]};}return t}})}

var BentoSearchStyle = i$1 `
    :host {
        display: block;
        padding: 25px;
        color: var(--uva-text-color-base, #000);
      }
`;

class BentoSearch extends SiteStyle {
    constructor() {
        super(...arguments);
        this.query = '';
        this.describe = '';
        this.sourceTitle = 'UVA Library';
        this.placeholder = 'Search everything...';
    }
    static get styles() {
        return [
            ...super.styles,
            BentoSearchStyle
        ];
    }
    render() {
        return y `

<form action="https://search.lib.virginia.edu/search" id="searchForm" method="get" @submit="${this.search}">
<span class="icon-search"></span>
	<input name="q" id="search" type="text" aria-label="${this.placeholder}" placeholder="${this.placeholder}" .value="${this.query}" />
	<button type="submit" class="uvalib-button-home-search" aria-label="Search" @submit="${this.search}"></button>
</form>
<p>${this.describe}</p>

    `;
    }
    search(e) {
        e.preventDefault();
        this.query = this.inputEl.value;
        this.dispatchEvent(new Event('search', { bubbles: true, composed: true }));
    }
}
__decorate([
    i('input#search')
], BentoSearch.prototype, "inputEl", void 0);
__decorate([
    e({ type: String })
], BentoSearch.prototype, "query", void 0);
__decorate([
    e({ type: String })
], BentoSearch.prototype, "describe", void 0);
__decorate([
    e({ type: String, attribute: "source-title" })
], BentoSearch.prototype, "sourceTitle", void 0);
__decorate([
    e({ type: String })
], BentoSearch.prototype, "placeholder", void 0);

window.customElements.define('bento-search', BentoSearch);

var BentoBoxStyle = i$1 `
    :host {
        display: block;
        padding: 25px;
        color: var(--uva-text-color-base, #000);
    }
`;

class BentoBox extends SiteStyle {
    static get styles() {
        return [
            ...super.styles,
            BentoBoxStyle
        ];
    }
    constructor() {
        super();
        this.query = '';
        this.limit = 5;
        this.searchDescribe = "This page searches Virgo, Virgo articles, subject guides, and the Library website.";
        this.noResultDescribe = "No results found.";
        this.placeholder = 'Search anything...';
        this.boxes = ['catalog', 'articles', 'libguides', 'website'];
        window.onpopstate = (event) => {
            this.query = event.state && event.state.query ? event.state.query : '';
        };
    }
    firstUpdated() {
        super.firstUpdated();
        // set query from url, done here so it overwrites query set via dom attribute
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('query'))
            this.query = urlParams.get('query');
    }
    render() {
        return y `
  <style>
    [hidden] { display: none !important; }
  </style>

  <bento-search .describe="${this.searchDescribe}" class="bento-search-bar" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" id="searchBox" .query="${this.query}" @search="${this.search}" .placeholder="${this.placeholder}"></bento-search>

  <div class="bs-header" ?hidden="${!this.query}">
    <h2>You searched for <span class="bs-search-term">${this.query}</span></h2>
    <p>Here are the results:</p>
  </div>

  <div class="bs-results-container" ?hidden="${!this.query}">

    ${this.boxes.map(box => {
            switch (box) {
                case 'mlb':
                    import('./mlb-section-fa54172e.js');
                    return y `<mlb-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></mlb-section>`;
                case 'catalog':
                    import('./catalog-section-335b14d6.js');
                    return y `<catalog-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></catalog-section>`;
                case 'articles':
                    import('./articles-section-bf55619e.js');
                    return y `<articles-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></articles-section>`;
                case 'website':
                    import('./website-section-72ba2ad5.js');
                    return y `<website-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></website-section>`;
                case 'libguides':
                    import('./libguides-section-f9d186fe.js');
                    return y `<libguides-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></libguides-section>`;
                case 'talk':
                    import('./bento-section-8d0477a0.js');
                    return y `<bento-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}" title="Talk to a subject expert"></bento-section>`;
                case 'libraries':
                    import('./libraries-section-25126055.js');
                    return y `<libraries-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></libraries-section>`;
                case 'events':
                    import('./events-section-e6e67ce6.js');
                    return y `<events-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" title="Events" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}">
                          <p slot="see-more" class="event-see-all"><a href="https://cal.lib.virginia.edu/events">See all Library events</a></p>
                        </events-section>`;
                default:
                    console.error("Requesting a Bento section that does not exist");
                    return '';
            }
        })}  

  </div>


    `;
    }
    search(e) {
        this.query = e.target.query;
        // eslint-disable-next-line no-restricted-globals
        history.pushState({ query: this.query }, `Search for this.query`, `?query=${this.query}`);
    }
}
__decorate([
    e({ type: String })
], BentoBox.prototype, "query", void 0);
__decorate([
    e({ type: Number })
], BentoBox.prototype, "limit", void 0);
__decorate([
    e({ type: String, attribute: "search-describe" })
], BentoBox.prototype, "searchDescribe", void 0);
__decorate([
    e({ type: String, attribute: "no-result-describe" })
], BentoBox.prototype, "noResultDescribe", void 0);
__decorate([
    e({ type: String })
], BentoBox.prototype, "placeholder", void 0);
__decorate([
    e({ type: Array })
], BentoBox.prototype, "boxes", void 0);

window.customElements.define('bento-box', BentoBox);
