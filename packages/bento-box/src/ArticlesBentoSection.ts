/* eslint-disable @typescript-eslint/no-unused-vars */
import { GeneralSearchResult, GeneralSearchMeta, ArticlesData } from '@uvalib/data-wrap';
import { PropertyValueMap, html } from 'lit';
import { BentoSection } from './BentoSection.js'

export class ArticlesBentoSection extends BentoSection {

  #articlesData: ArticlesData;

  meta: GeneralSearchMeta = {totalResults:0};

  constructor(){
    super();
    this.title = "Article";
    this.#articlesData = new ArticlesData({query:""})
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      if (_changedProperties.has('query') || _changedProperties.has('query')) {
        this.loading = true;
        this.#articlesData.query = this.query;
        this.#articlesData.fetchData({limit:<number|undefined>this.limit})
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
            <h3>${this.title}</h3>
            ${this.meta.url && this.meta.totalResults && this.meta.totalResults>0? html`
            <form action="${this.meta.url}" method='get' style="display:inline">
              ${ this.meta.url.indexOf('?')>0? 
                    [...new URLSearchParams( this.meta.url.replace(/^.*\?/,'') )].map((values)=>html`
                      <input type="hidden" name="${values[0]}" value="${values[1]}" />
                    `)
                    :'' }
              <button type="submit" class="uvalib-button">See all <span class="bs-results--qty">${this.meta.totalResults}</span> results</button>            
            </form>
            `:''}
        </div>

        <div class="bs-results--body">
            <p>An aggregation of tens of millions of articles made available through Library subscriptions.</p>
            <ol class="bs-results--list">

            ${this.items.map(result=>html`
                <li class="bs-results--list--entry"><a href="${result.link}" class="bs-results--title">${result.title}</a>
                    <ul class="ul-0">
                        <li class="bs-results--author li-1">List author</li>
                        <ul class="ul-1">
                            <li class="bs-results--date li-1">Pub date </li>
                            <li class="bs-results--format li-1" aria-label="[insert-format]">book/CD/film/PDF</li>
                        </ul>
                        <li class="bs-results--teaser li-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ex nulla, dignissim sed mollis eu, viverra sit amet nulla. Maecenas cursus rhoncus pellentesque.</li>
                    </ul>
                </li>
            `)}    
            </ol>
        </div> 
    `;
  }

}