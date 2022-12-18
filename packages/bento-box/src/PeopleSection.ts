/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
import { PropertyValueMap, html } from 'lit';
import { PersonData, Person } from '@uvalib/data-wrap';
import { BentoSection } from './BentoSection.js'

export function renderBriefItem(item: Person) {
  return html`  
      <div class="bento-section-title"><a href="${item.link}">${item.title}</a></div>
      <div class="bento-section-desc">${item.jobTitle}</div>
    `;          
}

export class PeopleSection extends BentoSection {

  #personData: PersonData;

  constructor(){
    super();
    this.title = "Library Staff";
    this.#personData = new PersonData();
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      super.updated(_changedProperties);
      if (_changedProperties.has('query')) {
        this.loading = true;
        this.#personData.query = this.query;
        this.#personData.fetchData().then(()=>{
          this.items = this.#personData.items;
          this.loading = false;
        })
      }
  }

  // eslint-disable-next-line class-methods-use-this
  renderBriefItem(item: Person) {
    return renderBriefItem(item);
  }

}
