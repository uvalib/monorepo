import { i, _ as __decorate, e, s, x } from './query-assigned-elements-66a11629.js';
import { o } from './unsafe-html-ce449b42.js';
import { S as SiteStyle } from './SiteStyle-5d4bc111.js';

// BentoSectionStyle.ts
// This module contains styles for the BentoSection component.
var BentoSectionStyle = i `
    :host {
        --bento-section-padding: 25px;
        --bento-section-border-color: black;
        --bento-section-border-width: 1px;
        --bento-section-border-radius: 16px;
    }

    :host {
        display: block;
        padding: var(--bento-section-padding);
        color: var(--uva-text-color-base, #000);
        border: var(--bento-section-border-width) solid var(--bento-section-border-color);
        border-radius: var(--bento-section-border-radius);
    }

    [hidden] {
        display: none;
    }
`;

class SiteSpinner extends s {
    constructor() {
        super();
        this.message = '';
        this.overlay = false;
        this.book = false;
        this.role = "status";
        if (this.message)
            this.label = this.message;
        else
            this.label = "loading";
    }
    render() {
        return x `
        <div class="${this.overlay ? "v4-spinner-overlay" : "v4-spinner embed"}" aria-hidden="true">
          <div class="${this.overlay ? `v4-spinner ${this.book ? 'border' : ''}` : ''}">
            ${this.book ? x `
              <div class="book">
                <div class="book-page"></div>
                <div class="book-page"></div>
                <div class="book-page"></div>
                <p>${this.message ? this.message : "Searching"}...</p>
              </div>             
            ` : x `
              ${this.message ? x `<h3>${this.message}</h3>` : ''}              
              <div class="spinner-animation">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
              </div>                         
            `}
          </div>
        </div>  
      `;
    }
}
SiteSpinner.styles = i `
    :host {
      display: block;
    }

    .spinner-animation > div {
      background-color: var(--site-spinner-color, var(--uvalib-brand-orange-base, orange));
      height: var(--site-spinner-size, 18px);
      width: var(--site-spinner-size, 18px);
    }

    div.v4-spinner-overlay {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      background: var(--site-spinner-overlay-background, rgba(0, 0, 0, 0.1));
    }

    div.v4-spinner {
      background: white;
      margin: 12vw auto;
      text-align: center;
      padding: 10px 150px 25px 150px;
      display: inline-block;
      font-weight: bold;
      color: var(--uva-text-color-base);
      box-shadow: var(--box-shadow);
    }

    div.v4-spinner.embed {
      box-shadow: none;
      padding: 0;
      margin: 0;
      background: transparent;
    }

    @media only screen and (min-width: 768px) {
      div.v4-spinner {
        padding: 40px 90px;
      }
    }

    @media only screen and (max-width: 768px) {
      div.v4-spinner {
        width: 95%;
        padding: 40px 0;
        margin-top: 30%;
      }
    }

    div.v4-spinner h1 {
      color: var(--uva-text-color-base);
      border: none;
    }

    .spinner-animation {
      margin: 0 auto;
      width: 80px;
      text-align: center;
    }

    .spinner-animation > div {
      width: 18px;
      height: 18px;
      border-radius: 100%;
      display: inline-block;
      -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
      animation: sk-bouncedelay 1.4s infinite ease-in-out both;
      margin: 0 2px;
    }

    .spinner-animation .bounce1 {
      -webkit-animation-delay: -0.32s;
      animation-delay: -0.32s;
    }

    .spinner-animation .bounce2 {
      -webkit-animation-delay: -0.16s;
      animation-delay: -0.16s;
    }

    @-webkit-keyframes sk-bouncedelay {
      0%, 80%, 100% { -webkit-transform: scale(0) }
      40% { -webkit-transform: scale(1.0) }
    }
    @keyframes sk-bouncedelay {
      0%, 80%, 100% {
        -webkit-transform: scale(0);
        transform: scale(0);
      } 40% {
        -webkit-transform: scale(1.0);
        transform: scale(1.0);
      }
    }

    /**  PAGE FLIP ANIMATION **/
    .book {
      top: 50%;
      transform: translateY(-4%);
      position: relative;
      margin: 0 auto;
      border: 5px solid var(--uvalib-brand-orange-base);
      width: 140px;
      height: 80px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: center;
      align-content: stretch;
      align-items: center;
    }

    .book-page {
      position: absolute;
      left: 50%;
      top: -5px;
      margin: 0 auto;
      border-top: 5px solid var(--uvalib-brand-orange-base);
      border-bottom: 5px solid var(--uvalib-brand-orange-base);
      border-right: 5px solid var(--uvalib-brand-orange-base);
      background: #fff;
      width: 70px;
      height: 80px;
      transform-origin: 0% 50%;
      animation: flip 1.2s infinite linear;
      animation-fill-mode: forwards;
    }

    .book-page:nth-child(1) {
      z-index: -1;
      animation-delay: 0s;
    }

    .book-page:nth-child(2) {
      z-index: -2;
      animation-delay: 0.5s;
    }

    .book-page:nth-child(3) {
      z-index: -3;
      animation-delay: 1s;
    }

    div.v4-spinner .book p {
      color: var(--uva-text-color-base, black);
      border: none;
      font-size: 1.25em;
      margin: 0 0 10px 0;
    }

    @keyframes flip {
      0% {
          transform: perspective(600px) rotateY(0deg);
      }
      20% {
        background: #e6e6e6;
      }
      29.9% {
        background: #e6e6e6;
      }
      30% {
        transform: perspective(200px) rotateY(-90deg);
        background: #fff;
      }
      54.999% {
        opacity: 1;
      }
      55% {
        opacity: 0;
      }
      60% {
        transform: perspective(200px) rotateY(-180deg);
        background: #fff;
      }
      100% {
        transform: perspective(200px) rotateY(-180deg);
        background: #fff;
      }
    }
  `;
__decorate([
    e({ type: String })
], SiteSpinner.prototype, "message", void 0);
__decorate([
    e({ type: Boolean })
], SiteSpinner.prototype, "overlay", void 0);
__decorate([
    e({ type: Boolean })
], SiteSpinner.prototype, "book", void 0);
__decorate([
    e({ type: String, reflect: true })
], SiteSpinner.prototype, "role", void 0);
__decorate([
    e({ type: String, reflect: true, attribute: 'aria-label' })
], SiteSpinner.prototype, "label", void 0);

window.customElements.define('site-spinner', SiteSpinner);

function renderBriefItem(item) {
    return x `
      ${item.link ? x `
        <div class="bento-section-title"><a href="${item.link}">${o(item.title)}</a></div>
      ` : x `
        <div class="bento-section-title">${o(item.title)}</div>
      `}
      <div class="bento-section-desc">${o(item.description)}</div>
    `;
}
class BentoSection extends SiteStyle {
    constructor() {
        super(...arguments);
        this.query = '';
        this.limit = 0;
        this.title = "";
        this.label = '';
        this.items = [];
        this.loading = false;
        this.noResultDescribe = "";
        this.isEmptySearch = true;
    }
    static get styles() {
        return [
            ...super.styles,
            BentoSectionStyle
        ];
    }
    updated(_changedProperties) {
        if (_changedProperties.has('items') || _changedProperties.has('loading')) {
            this.isEmptySearch = this.loading || !this.items || this.items.length === 0;
        }
    }
    // eslint-disable-next-line class-methods-use-this
    renderBriefItem(item) {
        return renderBriefItem(item);
    }
    limitTitle(title) {
        if (this.maxTitleLength && title && title.length >= this.maxTitleLength)
            return `${title.substring(0, this.maxTitleLength)}…`;
        return title;
    }
    render() {
        return x `
      <h1>${this.limitTitle(this.title)}</h1>
      <h2 ?hidden="${this.loading}">${this.label ? this.label : `Search for ${this.query}`}</h2>
      ${this.loading ? x `<site-spinner></site-spinner>` : ''}
      <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe ? this.noResultDescribe : `No results found for "${this.query}"`}</p>
      <ul ?hidden="${this.loading}">
        ${this.items.map(item => x `
          <li>
            ${this.renderBriefItem(item)}
          </li>
        `)}
      </ul>
    `;
    }
}
__decorate([
    e({ type: String })
], BentoSection.prototype, "query", void 0);
__decorate([
    e({ type: Number })
], BentoSection.prototype, "limit", void 0);
__decorate([
    e({ type: String })
], BentoSection.prototype, "title", void 0);
__decorate([
    e({ type: Number, attribute: "max-title-length" })
], BentoSection.prototype, "maxTitleLength", void 0);
__decorate([
    e({ type: String })
], BentoSection.prototype, "label", void 0);
__decorate([
    e({ type: Array })
], BentoSection.prototype, "items", void 0);
__decorate([
    e({ type: Boolean })
], BentoSection.prototype, "loading", void 0);
__decorate([
    e({ type: String, attribute: "no-result-describe" })
], BentoSection.prototype, "noResultDescribe", void 0);
__decorate([
    e({ type: Boolean, attribute: "is-empty-search" })
], BentoSection.prototype, "isEmptySearch", void 0);

export { BentoSection as B, renderBriefItem as r };
