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

  @property({ type: String }) title = "";

  @property({ type: Array }) items: GeneralSearchResult[] = [];

  @property({ type: Boolean }) loading = false;

  render() {
    return html`
      <h1>${this.title}</h1>
      <h2 ?hidden="${this.loading}">Search for ${this.query}</h2>
      <wait-spinner ?hidden="${!this.loading}"></wait-spinner>
      <ul ?hidden="${this.loading}">
        ${this.items.map(item=>html`
          <li>${item.link? html`
          <a href="${item.link}">${unsafeHTML(item.title)}</a>: ${unsafeHTML(item.description)}
          `:html`
          ${unsafeHTML(item.title)}: ${unsafeHTML(item.description)}
          `}</li>
        `)}

      </ul>
    `;
  }
}