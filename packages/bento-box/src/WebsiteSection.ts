/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, PropertyValueMap } from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { WebsiteData, GeneralSearchResult, GeneralSearchMeta, WebSearchPageURL } from '@uvalib/data-wrap';
import { BentoSection } from './BentoSection.js';

import { Library } from '@uvalib/data-wrap';
import { renderBriefItem } from './BentoSection.js';
import { renderBriefItem as renderBriefLibraryItem } from './LibrariesSection.js';

export class WebsiteSection extends BentoSection {

  private websearch: WebsiteData;

  meta: GeneralSearchMeta = {totalResults:0}

  constructor(){
    super();
    this.title = "Website";
    this.websearch = new WebsiteData();
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      super.updated(_changedProperties);
      if (_changedProperties.has('query')) {
        this.loading = true;
        this.websearch.query = this.query;
        this.websearch.fetchData({limit: <number|undefined>this.limit})
          .then((data: {meta: GeneralSearchMeta, items: GeneralSearchResult[]} )=>{
console.log(data);            
            this.items = data.items;
            this.meta = data.meta;
            this.loading = false;
          });

      }
  }

  // eslint-disable-next-line class-methods-use-this
  renderBriefItem(item: any) {
    if ( item instanceof Library )
      return renderBriefLibraryItem(item);
    return renderBriefItem(item);
  }

  render() {
    return html`
    <style>
      [hidden] { display: none !important; }
    </style>
        <div class="bs-results--header">
            <h3>${this.title}</h3>
            <div ?hidden="${!this.isEmptySearch}"><a href="${WebSearchPageURL}" class="uvalib-button">Search Library website</a></div>
            <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method='get' style="display:inline">
              ${ this.meta.url && this.meta.url.indexOf('?')>0? 
                    [...new URLSearchParams( this.meta.url.replace(/^.*\?/,'') )].map((values)=>html`
                      <input type="hidden" name="${values[0]}" value="${values[1]}" />
                    `)
                    :'' }
              <button type="submit" class="uvalib-button">See all <span class="bs-results--qty">${this.meta.totalResults}</span> results</button>            
            </form>            
        </div>
        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <p ?hidden="${this.isEmptySearch}">Results from the main Library website.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

              ${this.items.map(result=>this.renderBriefItem(result))}

            </ol>
        </div>   
    `
  }

}
