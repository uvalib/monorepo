/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import './bento-card.js';
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

  render() {
    return html`
      <bento-search id="searchBox" .keyword="${this.keyword}" @search="${this.search}"></bento-search>
      <bento-card .keyword="${this.keyword}" sourcetitle="Virgo: Catalog"></bento-card>
      <bento-card .keyword="${this.keyword}" sourcetitle="Virgo: Articles"></bento-card>
      <bento-card .keyword="${this.keyword}" sourcetitle="Library Website"></bento-card>
      <bento-card .keyword="${this.keyword}" sourcetitle="LibGuides"></bento-card>
      <bento-card .keyword="${this.keyword}" sourcetitle="Talk to a subject expert"></bento-card>
    `;
  }

  search(e: { target: BentoSearch }){
    this.keyword = e.target.keyword;
  }
}
