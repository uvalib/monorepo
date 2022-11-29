/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { GeneralSearchResult } from '@uvalib/data-wrap';
import { SiteStyle } from '@uvalib/site-style';
import BentoCardStyle from './BentoCardStyle.js';

export class BentoCard extends SiteStyle {
  static get styles() {
    return [
      ...super.styles,
      BentoCardStyle
    ]
  }

  @property({ type: String }) keyword = '';

  @property({ type: String }) title = "";

  @property({ type: Array }) items: GeneralSearchResult[] = [];

  render() {
    return html`
      <h1>${this.title}</h1>
      <h2>Search for ${this.keyword}</h2>
      <ul>
        ${this.items.map(item=>html`
          <li>${item.link? html`
          <a href="${item.link}">${item.title}</a>: ${item.description}
          `:html`
          ${item.title}: ${item.description}
          `}</li>
        `)}

      </ul>
    `;
  }
}

