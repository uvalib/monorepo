/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import { EventsData, Event } from '@uvalib/data-wrap';
import { isSameDay } from 'date-fns';
import { BentoSection } from './BentoSection.js';

export class EventsSection extends BentoSection {

  @property({ type: String }) category: string|undefined;

  @property({ type: Array }) items: Event[] = [];

  #eventsData: EventsData;

  constructor(){
    super();
    this.title = "";
    this.#eventsData = new EventsData();
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      if (_changedProperties.has('query') || _changedProperties.has('limit') || _changedProperties.has('category')) {
        this.loading = true;
        this.#eventsData.query = this.query;
        this.#eventsData.limit = this.limit;
        this.#eventsData.category = this.category;
        this.#eventsData.fetchData().then(items=>{
          this.items = items;
          this.loading = false;
        })
      }
  }

  // eslint-disable-next-line class-methods-use-this
  _dateRange(_start: number|undefined, _end: number|undefined){
    const start = _start? new Date(_start): new Date();
    const end = _end? new Date(_end): new Date();
    if (isSameDay(start, end))    
      return new Intl.DateTimeFormat('en-US', { month: "short", day: "numeric", year: "numeric", timeZone: 'America/New_York' }).format(start);
    return `${new Intl.DateTimeFormat('en-US', { month: "short", day: "numeric", timeZone: 'America/New_York' }).format(start)  } - ${  new Intl.DateTimeFormat('en-US', { month: "short", day: "numeric", year: "numeric", timeZone: 'America/New_York' }).format(end)}`;
  }

  // eslint-disable-next-line class-methods-use-this
  _timeRange(_start: any, _end:any){
    return `${new Intl.DateTimeFormat('en-US', { hour:"numeric", minute:"2-digit", timeZone: 'America/New_York' }).format(_start)  } - ${  new Intl.DateTimeFormat('en-US', { hour:"numeric", minute:"2-digit", timeZoneName:"short", timeZone: 'America/New_York' }).format(_end)}`
  }

  render() {
    return html`
${this.title? html`<h2>${this.title}</h2>`:''}
<div class="event-container">
  ${this.loading? html`<wait-spinner></wait-spinner>`:''}
  ${ this.items.map((event) =>html`
    <div class="event">
      <a href="${event.link}" class="event-url">
        <h4 class="event-title">${event.title}</h4>
        <p class="event-date">${this._dateRange(event.start, event.end)}</p>
        <p class="event-time">${this._timeRange(event.start, event.end)}</p>
      </a>
    </div>  
  `) }
  <slot name="see-more"></slot>
</div>  
      
    `;
  }

}
