/* eslint-disable @typescript-eslint/no-unused-vars */
import { html } from 'lit';
import { property } from 'lit/decorators.js';

import './bento-search.js';
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

  @property({ type: String }) query = '';

  @property({ type: Array }) boxes = ['catalog','articles','libraries','website','libguides','talk'];

  render() {
    return html`
      <bento-search .noShadowDom="${this.noShadowDom}" id="searchBox" .query="${this.query}" @search="${this.search}"></bento-search>
      ${this.boxes.map(box=>{
        // eslint-disable-next-line default-case
        switch (box) {
          case 'catalog':
            import('./catalog-bento-card.js');
            return html`<catalog-bento-card .noShadowDom="${this.noShadowDom}" .query="${this.query}"></catalog-bento-card>`;
          case 'articles':
            import('./bento-card.js');
            return html`<bento-card .noShadowDom="${this.noShadowDom}" .query="${this.query}" title="Virgo: Articles"></bento-card>`;
          case 'website':
            import('./bento-card.js');
            return html`<bento-card .noShadowDom="${this.noShadowDom}" .query="${this.query}" title="Library Website"></bento-card>`;
          case 'libguides':
            import('./libguides-bento-card.js');
            return html`<libguides-bento-card .noShadowDom="${this.noShadowDom}" .query="${this.query}"></libguides-bento-card>`;  
          case 'talk':
            import('./bento-card.js');
            return html`<bento-card .noShadowDom="${this.noShadowDom}" .query="${this.query}" title="Talk to a subject expert"></bento-card>`;
          case 'libraries':
            import('./libraries-bento-card.js');
            return html`<libraries-bento-card .noShadowDom="${this.noShadowDom}" .query="${this.query}"></libraries-bento-card>`;
        }
      })}
      

    `;
  }

  search(e: { target: BentoSearch }){
    this.query = e.target.query;
  }
}
