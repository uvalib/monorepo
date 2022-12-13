/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, css } from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { property } from 'lit/decorators.js';
import { GeneralSearchResult } from '@uvalib/data-wrap';
import { SiteStyle } from '@uvalib/site-style';
import BentoSectionStyle from './BentoSectionStyle.js';
import '@uvalib/wait-spinner/wait-spinner.js';

export class BentoSection extends SiteStyle {
  static get styles() {
    return [
      ...super.styles,
      BentoSectionStyle
    ]
  }

  @property({ type: String }) query = '';

  @property({ type: Number }) limit: number|null = null;

  @property({ type: String }) title = "";

  @property({ type: String }) label: string|null = null;

  @property({ type: Array }) items: GeneralSearchResult[] = [];

  @property({ type: Boolean }) loading = false;

  @property({ type: String, attribute: "no-result-describe" }) noResultDescribe = "";

  protected isEmptySearch(){
    return this.loading || (this.items && this.items.length === 0);
  }

  render() {
    return html`
      <h1>${this.title}</h1>
      ${this.label==null || this.label!==""? html`
        <h2 ?hidden="${this.loading}">${this.label? this.label:html`Search for ${this.query}`}</h2>
      `:''}
      ${this.loading? html`<wait-spinner></wait-spinner>`:''}
      <p id="no-results" ?hidden="${this.isEmptySearch()}">${this.noResultDescribe}</p>
      <ul ?hidden="${this.loading}">
        ${this.items.map(item=>html`
          <li>
            ${item.link? html`
              <div ?hidden="${!this.title}" class="bento-section-title"><a href="${item.link}">${unsafeHTML(item.title)}</a></div>
            `:html`
              <div ?hidden="${!this.title}" class="bento-section-title">${unsafeHTML(item.title)}</div>
            `}
            <div class="bento-section-desc">${unsafeHTML(item.description)}</div>
          </li>
        `)}

      </ul>
    `;
  }
}