/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, PropertyValueMap } from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { WebpageData, GeneralSearchResult, GeneralSearchMeta } from '@uvalib/data-wrap';
import { BentoSection } from './BentoSection.js'

export class WebsiteBentoSection extends BentoSection {

  private websearch: WebpageData;

  meta: GeneralSearchMeta = {totalResults:0}

  constructor(){
    super();
    this.title = "Website";
    this.websearch = new WebpageData();
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      if (_changedProperties.has('query')) {
        this.loading = true;
        this.websearch.query = this.query;
        this.websearch.fetchData({limit: <number|undefined>this.limit})
          .then((data: {meta: GeneralSearchMeta, items: GeneralSearchResult[]} )=>{
            this.items = data.items;
            this.meta = data.meta;
            this.loading = false;
          });

//        })
      }
  }

  render() {
    return html`
    <div class="bs-results--block">
        <div class="bs-results--header">
            <h3>${this.title}</h3>
            <form action="${this.meta.url}" method='get' style="display:inline">
              ${ this.meta.url && this.meta.url.indexOf('?')>0? 
                    [...new URLSearchParams( this.meta.url.replace(/^.*\?/,'') )].map((values)=>html`
                      <input type="hidden" name="${values[0]}" value="${values[1]}" />
                    `)
                    :'' }
              <button type="submit" class="uvalib-button">See all <span class="bs-results--qty">${this.meta.totalResults}</span> results</button>            
            </form>            
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
    `
  }

}
