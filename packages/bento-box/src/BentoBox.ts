/* eslint-disable @typescript-eslint/no-unused-vars */
import { html } from 'lit';
import { property } from 'lit/decorators.js';

import './bento-card.js';
import './catalog-bento-card.js';
import './libguides-bento-card.js';
import './bento-search.js';
import './libraries-bento-card.js';
import { SiteStyle } from '@uvalib/site-style';
import { BentoSearch } from './BentoSearch.js';
import BentoBoxStyle from './BentoBoxStyle.js';

export class BentoBox extends SiteStyle {

  static get styles() {
    return [
      ...super.styles,
      BentoBoxStyle
    ]
  }

  @property({ type: String }) keyword = '';

  render() {
    return html`
      <bento-search .noShadowDom="${this.noShadowDom}" id="searchBox" .keyword="${this.keyword}" @search="${this.search}"></bento-search>
      <catalog-bento-card .noShadowDom="${this.noShadowDom}" .keyword="${this.keyword}"></catalog-bento-card>
      <bento-card .noShadowDom="${this.noShadowDom}" .keyword="${this.keyword}" title="Virgo: Articles"></bento-card>
      <bento-card .noShadowDom="${this.noShadowDom}" .keyword="${this.keyword}" title="Library Website"></bento-card>
      <libguides-bento-card .noShadowDom="${this.noShadowDom}" .keyword="${this.keyword}"></libguides-bento-card>
      <bento-card .noShadowDom="${this.noShadowDom}" .keyword="${this.keyword}" title="Talk to a subject expert"></bento-card>
      <libraries-bento-card .noShadowDom="${this.noShadowDom}" .keyword="${this.keyword}"></libraries-bento-card>

    `;
  }

  search(e: { target: BentoSearch }){
    this.keyword = e.target.keyword;
  }
}
