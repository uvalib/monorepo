/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, PropertyValueMap } from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { Library, LibrariesData, GeneralSearchResult } from '@uvalib/data-wrap';
import { BentoCard } from './BentoCard.js'

export class LibrariesBentoCard extends BentoCard {

  #librariesData: LibrariesData;

  constructor(){
    super();
    this.title = "Libraries";
    this.#librariesData = new LibrariesData();
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      if (_changedProperties.has('keyword')) {
        this.#librariesData.fetchData().then(()=>{
          this.#librariesData.search(this.keyword)
            .then((data)=>{
              this.items = data.map(lib=><GeneralSearchResult>{title:(lib.title)?lib.title[0]:'', description:(lib.body)?lib.body[0]:''});
            });
        })
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
