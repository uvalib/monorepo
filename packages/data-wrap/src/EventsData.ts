/* eslint-disable camelcase */
import { Event, parseEvent } from './Event.js';
import { GeneralData } from './GeneralData.js';

export class EventsData extends GeneralData {
  public category?: string;

  public calId: string = '4299'; // Default calId
  
  public lid: string = '863'; // Default lid (iid)
  
  public limit: number = 600; // Default limit
  
  public date?: string;
  
  public days?: number = 365; // Default days
  
  items: Event[] = [];

  constructor(init?: Partial<EventsData>) {
    super();
    Object.assign(this, init);
  }

  private endpointURL() {
    const baseUrl = 'https://api2.libcal.com/1.0/';
    const endpoint = this.query ? 'event_search' : 'events';
    let params = `?key=c45a1428103ed000ba4025e9970edf54&iid=${this.lid}&cal_id=${this.calId}&campus=&days=${this.days}${this.date ? `&date=${this.date}` : ''}`;
    params += `&limit=${this.limit}`; // Use the limit property
    if (this.query) params += `&search=${encodeURIComponent(this.query)}`;
    if (this.category) params += `&category=${this.category}`;
    return `${baseUrl}${endpoint}${params}`;
  }

  async fetchData() {
    return this.fetchWithRetry(this.endpointURL())
      .then((r) => r.json())
      .then((data) => {
        this._parseResults(data);
        return { items: this.items, meta: this.meta };
      });
  }

  _parseResults(d: any) {
    // Setup Library results
    this.items = d.events.map(parseEvent);
    this.meta.totalResults = d.events.length;
  }
}
