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

  highlight(text: string) {
      const {query} = this;
      const words = query.split(" ");
      const result = { snippet: "", match: "" };
    
      for (let i = 0; i < words.length; i++) {
        const regex = new RegExp(`\\b${words[i]}\\b`, "i");
        const index = text.search(regex);
        if (index !== -1) {
          const startIndex = Math.max(index - 30, 0);
          const endIndex = Math.min(index + 30, text.length - 1);
          result.snippet = text.substring(startIndex, endIndex);
          result.match = words[i];
          break;
        }
      }
    
      if (result.snippet === "") {
        result.snippet = text.substring(0, 60);
      }
    
      console.log(result)
      return result.snippet;
  }

  render() {
    return html`
        <div class="bs-results--header">
        </div>

        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

            ${this.items.map(result=>html`
              <li class="bs-results--list--entry">
                <a href="${result.link? result.link:''}" class="bento-section-title">${result.title}</a>
                ${result.description? html`<div class="bento-section-desc">${ this.highlight(result.description) }</div>`:''}
              </li>
            `)}

            </ol>
        </div>
    `;
  }

}
