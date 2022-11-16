/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import './bento-card.js';
import './virgo-bento-card.js';
import './bento-search.js';
import { BentoSearch } from './BentoSearch.js';

export class BentoBox extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--bento-box-text-color, #000);
    }
  `;

  @property({ type: String }) keyword = '';

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <bento-search id="searchBox" .keyword="${this.keyword}" @search="${this.search}"></bento-search>
      <virgo-bento-card .keyword="${this.keyword}"></virgo-bento-card>
      <bento-card .keyword="${this.keyword}" title="Virgo: Articles"></bento-card>
      <bento-card .keyword="${this.keyword}" title="Library Website"></bento-card>
      <bento-card .keyword="${this.keyword}" title="LibGuides"></bento-card>
      <bento-card .keyword="${this.keyword}" title="Talk to a subject expert"></bento-card>
    `;
  }

  search(e: { target: BentoSearch }){
    this.keyword = e.target.keyword;
  }
}
