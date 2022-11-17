/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, PropertyValueMap } from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
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
      if (_changedProperties.has('keyword')) {
        this.#libGuidesData.query = this.keyword;
        this.#libGuidesData.fetchData()
          .then((data: GeneralSearchResult[])=>{this.items = data});
      }
  }

  render() {
    return html`
      <h1>${unsafeHTML(this.title)}</h1>
      <h2>Search for ${this.keyword}</h2>
      <ul>
        ${this.items.map(item=>html`
          <li>
            ${unsafeHTML(item.title)}<br />
            ${unsafeHTML(item.description)}
          </li>
        `)}
      </ul>
    `;
  }  

}
