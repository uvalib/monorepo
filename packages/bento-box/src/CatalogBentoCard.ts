/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, PropertyValueMap } from 'lit';
import { GeneralSearchResult, CatalogData } from '@uvalib/data-wrap';
import { BentoCard } from './BentoCard.js'

export class CatalogBentoCard extends BentoCard {

  #catalogData: CatalogData;

  constructor(){
    super();
    this.title = "Virgo: Catalog";
    this.#catalogData = new CatalogData({query:""})
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      if (_changedProperties.has('keyword')) {
        this.#catalogData.query = this.keyword;
        this.#catalogData.fetchData()
          .then((data: GeneralSearchResult[])=>{this.items = data});
      }
  }

}
