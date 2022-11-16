/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, PropertyValueMap } from 'lit';
import { VirgoData } from '@uvalib/data-wrap';
import { GeneralSearchResult } from '@uvalib/data-wrap';
import { BentoCard } from './BentoCard.js'

export class VirgoBentoCard extends BentoCard {

  #virgoData: VirgoData;

  constructor(){
    super();
    this.title = "Virgo";
    this.#virgoData = new VirgoData()
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      if (_changedProperties.has('keyword')) {
        this.#virgoData.fetchData()
          .then((data: GeneralSearchResult[])=>{this.items = data});
      }
  }

}
