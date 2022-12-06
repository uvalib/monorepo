/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
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

  @property({ type: Number }) limit = 5;

  @property({ type: Array }) boxes = ['catalog','articles','libguides','website'];

  render() {
    return html`
  <style>
    [hidden] {display:none;}
  </style>

  <bento-search class="bento-search-bar" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" id="searchBox" .query="${this.query}" @search="${this.search}"></bento-search>

  <div class="bs-header" ?hidden="${!this.query}">
    <h2>You searched for <span class="bs-search-term">${this.query}</span></h2>
    <p>Here are the results:</p>
  </div>

  <div class="bs-results-container" ?hidden="${!this.query}">

    ${this.boxes.map(box=>{
        switch (box) {
          case 'catalog':
            import('./catalog-bento-section.js');
            return html`<catalog-bento-section class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" .limit="${this.limit}" .query="${this.query}"></catalog-bento-section>`;
          case 'articles':
            import('./articles-bento-section.js');
            return html`<articles-bento-section class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" .limit="${this.limit}" .query="${this.query}"></articles-bento-section>`;
          case 'website':
            import('./website-bento-section.js');
            return html`<website-bento-section class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" .limit="${this.limit}" .query="${this.query}"></website-bento-section>`;
          case 'libguides':
            import('./libguides-bento-section.js');
            return html`<libguides-bento-section class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" .limit="${this.limit}" .query="${this.query}"></libguides-bento-section>`;
          case 'talk':
            import('./bento-section.js');
            return html`<bento-section class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" .limit="${this.limit}" .query="${this.query}" title="Talk to a subject expert"></bento-section>`;
          case 'libraries':
            import('./libraries-bento-section.js');
            return html`<libraries-bento-section class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" .limit="${this.limit}" .query="${this.query}"></libraries-bento-section>`;
          case 'events':
            import('./events-section.js');
            return html`<events-section class="bs-results--block" title="Events" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" .limit="${this.limit}" .query="${this.query}">
                          <p slot="see-more" class="event-see-all"><a href="https://cal.lib.virginia.edu/events">See all Library events</a></p>
                        </events-section>`;
          default:
            console.error("Requesting a Bento section that does not exist");
            return '';
        }

      } )}  

    <div class="bs-results--block">
        <div class="bs-results--header">
            <h3>Website</h3>
            <button class="uvalib-button">See all <span class="bs-results--qty">123465789</span> results</button>
        </div>
        <div class="bs-results--body">
            <p>Results from the main Library website.</p>
            <ol class="bs-results--list">
                <li class="bs-results--list--entry"><a href="#" class="bs-results--title">Title</a>
                    <ul class="ul-0">
                        <li class="bs-results--teaser li-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ex nulla, dignissim sed mollis eu, viverra sit amet nulla. Maecenas cursus rhoncus pellentesque.</li>
                    </ul>
                </li>
                <li class="bs-results--list--entry"><a href="#" class="bs-results--title">Title</a>
                    <ul class="ul-0">
                        <li class="bs-results--teaser li-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ex nulla, dignissim sed mollis eu, viverra sit amet nulla. Maecenas cursus rhoncus pellentesque.</li>
                    </ul>
                </li>
                <li class="bs-results--list--entry"><a href="#" class="bs-results--title">Title</a>
                    <ul class="ul-0">
                        <li class="bs-results--teaser li-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ex nulla, dignissim sed mollis eu, viverra sit amet nulla. Maecenas cursus rhoncus pellentesque.</li>
                    </ul>
                </li>
            </ol>
        </div>
    </div>
  </div>


    `;
  }

  search(e: { target: BentoSearch }){
    this.query = e.target.query;
  }
}
