/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, PropertyValueMap } from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { LibGuidesData, GeneralSearchResult, GeneralSearchMeta } from '@uvalib/data-wrap';
import { BentoSection } from './BentoSection.js'

export class LibGuidesSection extends BentoSection {

  #libGuidesData: LibGuidesData;
  
  meta: GeneralSearchMeta = {totalResults:0}

  constructor(){
    super();
    this.title = "Subject Guides";
    this.#libGuidesData = new LibGuidesData({query:""})
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      super.updated(_changedProperties);
      if (_changedProperties.has('query')) {
        this.loading = true;
        this.#libGuidesData.query = this.query;
        this.#libGuidesData.fetchData({limit: <number|undefined>this.limit})
          .then((data: {items:GeneralSearchResult[], meta:GeneralSearchMeta} )=>{
            this.items = data.items;
            this.meta = data.meta;
            this.loading = false;
          });
      }
  }

  render() {
    return html`
        <div class="bs-results--header">
            <h3>${this.title}</h3>
            <div ?hidden="${!this.isEmptySearch}"><a href="${this.meta?.url?.replace(/(.*)\?.*/,"$1")}" class="uvalib-button">Search Guides</a></div>
            <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method='get' style="display:inline">
              ${ this.meta.url && this.meta.url.indexOf('?')>0? 
                    [...new URLSearchParams( this.meta.url.replace(/^.*\?/,'') )].map((values)=>html`
                      <input type="hidden" name="${values[0]}" value="${values[1]}" />
                    `)
                    :'' }
              <button type="submit" class="uvalib-button">See all results</button>            
            </form>
        </div>

        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <p ?hidden="${this.isEmptySearch}">Subject guides contain topic-specific information to help with research and coursework.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

              ${this.items.map(result=>html`
                <li class="bs-results--list--entry bs-results-title"><span class="bs-results--title">${unsafeHTML(result.title)}</span>
                    <ul class="ul-0">
                        <li class="bs-results--teaser li-1">${unsafeHTML(result.description)}</li>
                    </ul>
                </li>
              `)}
            </ol>
        </div>  
    `;
  }

}
