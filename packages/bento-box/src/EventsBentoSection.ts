/* eslint-disable @typescript-eslint/no-unused-vars */
import { PropertyValueMap } from 'lit';
import { EventsData } from '@uvalib/data-wrap';
import { BentoSection } from './BentoSection.js'

export class EventsBentoSection extends BentoSection {

  #eventsData: EventsData;

  constructor(){
    super();
    this.title = "Events";
    this.#eventsData = new EventsData();
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      if (_changedProperties.has('query')) {
        this.loading = true;
        this.#eventsData.query = this.query;
        this.#eventsData.fetchData().then(()=>{
          this.items = this.#eventsData.items;
          this.loading = false;
        })
      }
  }

}
