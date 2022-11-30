/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, PropertyValueMap } from 'lit';
import { LibGuidesData, GeneralSearchResult } from '@uvalib/data-wrap';
import { BentoCard } from './BentoCard.js'

export class LibGuidesBentoCard extends BentoCard {

  #libGuidesData: LibGuidesData;

  constructor(){
    super();
    this.title = "LibGuides";
    this.#libGuidesData = new LibGuidesData({query:""})
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      if (_changedProperties.has('query')) {
        this.loading = true;
        this.#libGuidesData.query = this.query;
        this.#libGuidesData.fetchData()
          .then((data: GeneralSearchResult[])=>{
            this.items = data;
            this.loading = false;
          });
      }
  }

}
