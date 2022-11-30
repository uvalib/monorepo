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
      <bento-search ?no-shadow-dom="${this.noShadowDom}" id="searchBox" .query="${this.query}" @search="${this.search}"></bento-search>
      ${this.boxes.map(box=>{
        // eslint-disable-next-line default-case
        switch (box) {
          case 'catalog':
            import('./catalog-bento-section.js');
            return html`<catalog-bento-section ?no-shadow-dom="${this.noShadowDom}" .query="${this.query}"></catalog-bento-section>`;
          case 'articles':
            import('./bento-section.js');
            return html`<bento-section ?no-shadow-dom="${this.noShadowDom}" .query="${this.query}" title="Virgo: Articles"></bento-section>`;
          case 'website':
            import('./bento-section.js');
            return html`<bento-section ?no-shadow-dom="${this.noShadowDom}" .query="${this.query}" title="Library Website"></bento-section>`;
          case 'libguides':
            import('./libguides-bento-section.js');
            return html`<libguides-bento-section ?no-shadow-dom="${this.noShadowDom}" .query="${this.query}"></libguides-bento-section>`;  
          case 'talk':
            import('./bento-section.js');
            return html`<bento-section ?no-shadow-dom="${this.noShadowDom}" .query="${this.query}" title="Talk to a subject expert"></bento-section>`;
          case 'libraries':
            import('./libraries-bento-section.js');
            return html`<libraries-bento-section ?no-shadow-dom="${this.noShadowDom}" .query="${this.query}"></libraries-bento-section>`;
        }
      })}
      

    `;
  }

  search(e: { target: BentoSearch }){
    this.query = e.target.query;
  }
}
