/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, PropertyValueMap } from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { Library, LibrariesData, GeneralSearchResult } from '@uvalib/data-wrap';
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
