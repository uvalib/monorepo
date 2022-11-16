/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { GeneralSearchResult } from '@uvalib/data-wrap/dist/src/connections/GeneralSearchResult.js';

export class BentoCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--bento-box-text-color, #000);
      border: 1px solid black;
      border-radius: 16px;
    }
  `;

  @property({ type: String }) keyword = 'Hey there';

  @property({ type: String }) title = "";

  @property({ type: Array }) items: GeneralSearchResult[] = [];

  render() {
    return html`
      <h1>${this.title}</h1>
      <h2>Search for ${this.keyword}</h2>
      <ul>
        ${this.items.map(item=>html`
          <li><a href="${item.link}">${item.title}</a>: ${item.description}</li>
        `)}
      </ul>
    `;
  }
}

