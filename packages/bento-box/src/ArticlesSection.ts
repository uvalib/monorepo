/* eslint-disable @typescript-eslint/no-unused-vars */
import { VirgoResult, GeneralSearchMeta, ArticlesData } from '@uvalib/data-wrap';
import { PropertyValueMap, html } from 'lit';
import { property } from 'lit/decorators.js';
import { BentoSection } from './BentoSection.js'

export class ArticlesSection extends BentoSection {

  #articlesData: ArticlesData;

  @property({ type: Array }) items: VirgoResult[] = [];

  meta: GeneralSearchMeta = {totalResults:0};

  constructor(){
    super();
    this.title = "Article";
    this.#articlesData = new ArticlesData({query:""})
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      super.updated(_changedProperties);
      if ( _changedProperties.has('query') ) {
        this.loading = true;
        this.#articlesData.query = this.query;
        this.#articlesData.fetchData({limit:<number|undefined>this.limit})
          .then((data: {meta: GeneralSearchMeta, items: VirgoResult[]} )=>{
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
            <div ?hidden="${!this.isEmptySearch}"><a href="${this.meta?.url?.replace(/(.*)\?.*/,"$1")}" class="uvalib-button">Search articles</a></div>
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
            <p ?hidden="${this.isEmptySearch}">An aggregation of tens of millions of articles made available through Library subscriptions.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

            ${this.items.map(result=>html`
              <li class="bs-results--list--entry"><a href="${result.link? result.link:''}" class="bs-results--title">${result.title}</a>
                <ul class="ul-0">
                  ${result.author? html`<li class="bs-results--author li-1">${result.author.join('; ')}</li>`:''}
                    <ul class="ul-1">
                        ${ result.datePublished? html`<li class="bs-results--date li-1">${ result.datePublished.toLocaleDateString("en-US") }</li>`:'' }
                        ${ result.publicationType && result.publicationType.length>0? html`<li class="bs-results--format li-1" aria-label="${ result.publicationType.join('/') }">${ result.publicationType.join('/') }</li>`:'' }
                    </ul>
                </ul>
              </li>
            `)}
            </ol>
        </div>
    `;
  }

}
