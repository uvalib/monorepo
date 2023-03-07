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
      super.updated(_changedProperties);
      if (_changedProperties.has('query') || _changedProperties.has('limit') || _changedProperties.has('category')) {
        this.loading = true;
        this.#eventsData.query = this.query;
        this.#eventsData.limit = this.limit;
        this.#eventsData.category = this.category;
        this.#eventsData.fetchData().then(results=>{
          this.items = results.items;
          this.loading = false;
        })
      }
  }

  static formatDate(day: Date|number|undefined){
    return html`
        <span id="homehoursMonth" class="event--month">${ new Intl.DateTimeFormat('en-US', { month: "short", timeZone: 'America/New_York' }).format(day) }</span>
        <span id="homehoursDay" class="event--day">${ new Intl.DateTimeFormat('en-US', { day: "numeric", timeZone: 'America/New_York' }).format(day) }</span>
        <span id="homehoursWeekDay" class="event--wkday">${ new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/New_York' }).format(day) }</span>      
    `
  }

  static dateRange(_start: number|undefined, _end: number|undefined){
    const start = _start? new Date(_start): new Date();
    const end = _end? new Date(_end): new Date();
    if (isSameDay(start, end))    
      return EventsSection.formatDate(start);
    return html`${ EventsSection.formatDate(start) } - ${ EventsSection.formatDate(end) }`;
  }

  static timeRange(_start: any, _end:any){
    return `${new Intl.DateTimeFormat('en-US', { hour:"numeric", minute:"2-digit", timeZone: 'America/New_York' }).format(_start)  } - ${  new Intl.DateTimeFormat('en-US', { hour:"numeric", minute:"2-digit", timeZoneName:"short", timeZone: 'America/New_York' }).format(_end)}`
  }

  render() {
    return html`
${this.title? html`<h2>${ this.limitTitle(this.title) }</h2>`:''}
<div class="event-container">
  ${this.loading? html`<site-spinner></site-spinner>`:''}
  ${ this.items.map((event) =>html`
    <div class="event">
      <a href="${event.link}" class="event-url">
        <h4 class="event-title">${ this.limitTitle(event.title) }</h4>
        <p class="event-date">${EventsSection.dateRange(event.start, event.end)}</p>
        <p class="event-time">${EventsSection.timeRange(event.start, event.end)}</p>
      </a>
    </div>  
  `) }
  <slot name="see-more"></slot>
</div>  
      
    `;
  }

}
