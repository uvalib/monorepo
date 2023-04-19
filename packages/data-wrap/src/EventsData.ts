/* eslint-disable camelcase */
import { Event, parseEvent } from './Event.js';
import { GeneralData } from './GeneralData.js';

const eventsEndpointURL = "https://api2.libcal.com/1.0/events?key=c45a1428103ed000ba4025e9970edf54&iid=863&cal_id=4299&limit=600&campus=&category=&days=365";
const eventsSearchEndpointURL = "https://api2.libcal.com/1.0/event_search?key=c45a1428103ed000ba4025e9970edf54&iid=863&cal_id=4299&limit=600&campus=&category=&days=365";

export class EventsData extends GeneralData {

    public category?: string;

    items: Event[] = [];

    constructor(init?:Partial<EventsData>) {
      super();
      Object.assign(this, init);
    }

    private endpointURL(){
      let params = this.query?`&search=${this.query}`:'';
      params += this.limit?`&limit=${this.limit}`:'';
      params += this.category?`&category=${this.category}`:'';
      return this.query?
        `${eventsSearchEndpointURL}${params}`:`${eventsEndpointURL}${params}`;
    }

    async fetchData(){
      return this.fetchWithRetry(this.endpointURL())
        .then(r=>r.json())
        .then(data=>{
          this._parseResults(data);
          return {items: this.items, meta: this.meta};
        })
    }

    _parseResults(d: any) {
      // Setup Library results
      this.items = d.events.map(parseEvent)
      this.meta.totalResults = d.events.length;
    }

}