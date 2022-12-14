/* eslint-disable lit/no-value-attribute */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, PropertyValueMap } from 'lit';
import { VirgoResult, GeneralSearchMeta, CatalogData } from '@uvalib/data-wrap';
import { property } from 'lit/decorators.js';
import { BentoSection } from './BentoSection.js';

export class CatalogBentoSection extends BentoSection {

  #catalogData: CatalogData;

  @property({ type: Array }) items: VirgoResult[] = [];

  meta: GeneralSearchMeta = {totalResults:0};

  constructor(){
    super();
    this.title = "Virgo Catalog";
    this.#catalogData = new CatalogData({query:""})
    this.limit = 5;
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      super.updated(_changedProperties);
      if (_changedProperties.has('query') || _changedProperties.has('limit')) {
        this.loading = true;
        this.#catalogData.query = this.query;
        this.#catalogData.fetchData({limit: <number|undefined>this.limit})
          .then((data: {meta: GeneralSearchMeta, items: VirgoResult[]} )=>{
console.log(data.items)            
            this.items = data.items;
            this.meta = data.meta;
            this.loading = false;
          });
      }
  }

  render() {
    console.log(this.items)
    return html`
        <div class="bs-results--header">
            <h3>${this.title}</h3>
            <div ?hidden="${!this.isEmptySearch}"><a href="${this.meta?.url?.replace(/(.*)\?.*/,"$1")}" class="uvalib-button">Search Virgo</a></div>
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
            <p ?hidden="${this.isEmptySearch}">Books, journals, manuscripts &amp; archival material, maps, music and sound recordings, theses and dissertations, and videos.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

            ${this.items.map(result=>html`
                <li class="bs-results--list--entry"><a href="${result.link? result.link:''}" class="bs-results--title">${result.title}</a>
                    <ul class="ul-0">
                      ${result.author? html`<li class="bs-results--author li-1">${result.author.join(', ')}</li>`:''}
                        <ul class="ul-1">
                            ${ result.datePublished? html`<li class="bs-results--date li-1">${ result.datePublished.toLocaleDateString("en-US") }</li>`:'' }
                            ${ result.format && result.format.length>0? html`<li class="bs-results--format li-1" aria-label="${ result.format.join('/') }">${ result.format.join('/') }</li>`:'' }
                        </ul>
<!-- I'm not sure we have teaser info for catalog results                        
                        <li class="bs-results--teaser li-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ex nulla, dignissim sed mollis eu, viverra sit amet nulla. Maecenas cursus rhoncus pellentesque.</li>
  -->
                    </ul>
                </li>            
            `)}

            </ol>
        </div>     
    `;
  }

}
