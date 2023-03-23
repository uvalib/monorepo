/* eslint-disable lit/no-value-attribute */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, PropertyValueMap } from 'lit';
import { MLBib, GeneralSearchMeta, MLBData, GeneralSearchResult } from '@uvalib/data-wrap';
// import { VirgoResult, GeneralSearchMeta, CatalogData } from '@uvalib/data-wrap';
import { property } from 'lit/decorators.js';
import { BentoSection } from './BentoSection.js';

export class MLBSection extends BentoSection {

  #mlbData: MLBData;

  @property({ type: Array }) items: MLBib[] = [];

  meta: GeneralSearchMeta = {totalResults:0};

  constructor(){
    super();
    this.title = "Modern Library Bibliography";
    this.#mlbData = new MLBData({query:""})
    this.limit = 5;
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      super.updated(_changedProperties);
      if (_changedProperties.has('query') ) {
        this.loading = true;
        this.#mlbData.query = this.query;
        this.#mlbData.fetchData()
          .then((data: {meta: GeneralSearchMeta, items: GeneralSearchResult[]} )=>{
            this.items = data.items;
            this.meta = data.meta;
            this.loading = false;
          });
      }
  }

  render() {
    return html`
        <div class="bs-results--header">
        </div>

        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <p ?hidden="${this.isEmptySearch}">Books, journals, manuscripts &amp; archival material, maps, music and sound recordings, theses and dissertations, and videos.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

            ${this.items.map(result=>html`
              <li class="bs-results--list--entry"><a href="${result.link? result.link:''}" class="bs-results--title">${result.title}</a>
                <ul class="ul-0">
                  ${result.title? html`<li class="bs-results--author li-1">${result.title}</li>`:''}
                    <ul class="ul-1">
                      
                    </ul>
                </ul>
              </li>
            `)}

            </ol>
        </div>
    `;
  }

}
