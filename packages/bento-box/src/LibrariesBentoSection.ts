/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
import { PropertyValueMap } from 'lit';
import { LibrariesData } from '@uvalib/data-wrap';
import { BentoSection } from './BentoSection.js'

export class LibrariesBentoSection extends BentoSection {

  #librariesData: LibrariesData;

  constructor(){
    super();
    this.title = "Libraries";
    this.#librariesData = new LibrariesData();
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      if (_changedProperties.has('query')) {
        this.loading = true;
        this.#librariesData.query = this.query;
        this.#librariesData.fetchData().then(()=>{
          console.log(this.#librariesData)
          this.items = this.#librariesData.items;
          this.loading = false;
        })
      }
  }

}
