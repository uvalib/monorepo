/* eslint-disable max-classes-per-file */
import { GeneralData } from './GeneralData.js';

import { GeneralSearchResult } from './GeneralSearchResult.js';

const eventsEndpointURL = "https://api2.libcal.com/1.0/events?key=c45a1428103ed000ba4025e9970edf54&iid=863&cal_id=4299&limit=600&campus=&category=&days=365";
const eventsSearchEndpointURL = "https://api2.libcal.com/1.0/event_search?key=c45a1428103ed000ba4025e9970edf54&iid=863&cal_id=4299&limit=600&campus=&category=&days=365";

export class EventsData extends GeneralData {

    query: string = "";

    type: string = "";

    items: GeneralSearchResult[] = [];

    #endpointURL(){
      return (this.query)?
        `${eventsSearchEndpointURL}&search=${this.query}`:eventsEndpointURL;
    }

    async fetchData(){
      return fetch(this.#endpointURL())
        .then(r=>r.json())
        .then(data=>{
          this._parseResults(data);
        })
    }

    // eslint-disable-next-line class-methods-use-this
    _parseResults(d: any) {

      console.log(d)
      // Setup generic results
      this.items = d.events.map((e: { title: any; description: any; url: { public: any; }; })=>({
        title: e.title,
        description: e.description,
        link: e.url.public
      }))

    }
}