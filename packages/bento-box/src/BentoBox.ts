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

  @property({ type: String, attribute: "search-describe" }) searchDescribe = "This page searches Virgo, Virgo articles, subject guides, and the Library website.";

  @property({ type: String, attribute: "no-result-describe" }) noResultDescribe = "No results found.";

  @property({ type: String }) placeholder = 'Search anything...'; 

  @property({ type: Array }) boxes = ['catalog','articles','libguides','website'];

  constructor() {
    super();
    window.onpopstate = (event) => {
      this.query = event.state && event.state.query? event.state.query:'';
    }
  }

  firstUpdated(changedProperties: Map<string | number | symbol, unknown>): void {
      super.firstUpdated(changedProperties);

      // set query from url, done here so it overwrites query set via dom attribute
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('query')) this.query = <string>urlParams.get('query');

  }

  render() {
    return html`
  <style>
    [hidden] { display: none !important; }
  </style>

  <bento-search .describe="${this.searchDescribe}" class="bento-search-bar" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" id="searchBox" .query="${this.query}" @search="${this.search}" .placeholder="${this.placeholder}"></bento-search>

  <div class="bs-header" ?hidden="${!this.query}">
    <h2>You searched for <span class="bs-search-term">${this.query}</span></h2>
    <p>Here are the results:</p>
  </div>

  <div class="bs-results-container" ?hidden="${!this.query}">

    ${this.boxes.map(box=>{
        switch (box) {
          case 'mlb':
            import('./mlb-section.js');
            return html`<mlb-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></mlb-section>`;
          case 'catalog':
            import('./catalog-section.js');
            return html`<catalog-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></catalog-section>`;
          case 'articles':
            import('./articles-section.js');
            return html`<articles-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></articles-section>`;
          case 'website':
            import('./website-section.js');
            return html`<website-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></website-section>`;
          case 'libguides':
            import('./libguides-section.js');
            return html`<libguides-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></libguides-section>`;
          case 'talk':
            import('./bento-section.js');
            return html`<bento-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}" title="Talk to a subject expert"></bento-section>`;
          case 'libraries':
            import('./libraries-section.js');
            return html`<libraries-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></libraries-section>`;
          case 'events':
            import('./events-section.js');
            return html`<events-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" title="Events" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}">
                          <p slot="see-more" class="event-see-all"><a href="https://cal.lib.virginia.edu/events">See all Library events</a></p>
                        </events-section>`;
          default:
            console.error("Requesting a Bento section that does not exist");
            return '';
        }

      } )}  

  </div>


    `;
  }

  search(e: { target: BentoSearch }){
    this.query = e.target.query;
    // eslint-disable-next-line no-restricted-globals
    history.pushState({query: this.query}, `Search for this.query`, `?query=${this.query}`);
  }
}
