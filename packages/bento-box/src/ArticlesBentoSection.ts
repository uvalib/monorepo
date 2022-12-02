/* eslint-disable @typescript-eslint/no-unused-vars */
import { GeneralSearchResult, ArticlesData } from '@uvalib/data-wrap';
import { PropertyValueMap } from 'lit';
import { BentoSection } from './BentoSection.js'

export class ArticlesBentoSection extends BentoSection {

  #articlesData: ArticlesData;

  constructor(){
    super();
    this.title = "Virgo: Articles";
    this.#articlesData = new ArticlesData({query:""})
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      if (_changedProperties.has('query')) {
        this.loading = true;
        this.#articlesData.query = this.query;
        this.#articlesData.fetchData()
          .then((data: GeneralSearchResult[])=>{
            this.items = data;
            this.loading = false;
          });
      }
  }

}
