/* eslint-disable camelcase */
import { parseJSON } from 'date-fns';
import { Event } from './EventInterface.js';
import { GeneralData } from './GeneralData.js';

const eventsEndpointURL = "https://api2.libcal.com/1.0/events?key=c45a1428103ed000ba4025e9970edf54&iid=863&cal_id=4299&limit=600&campus=&category=&days=365";
const eventsSearchEndpointURL = "https://api2.libcal.com/1.0/event_search?key=c45a1428103ed000ba4025e9970edf54&iid=863&cal_id=4299&limit=600&campus=&category=&days=365";

export function parseEvent(event: {
  description: any;
  url: any;
  location: any;
  campus: any;
  category: any;
  owner: any;
  calendar: any;
  registration: any;
  has_registration_opened: any;
  has_registration_closed: any;
  seats: any;
  seats_taken: any;
  physical_seats: any;
  physical_seats_taken: any;
  online_seats: any;
  online_seats_taken: any;
  wait_list: any;
  featured_image: any;
  future_dates: any;
  registration_cost: any;
  more_info: any;
  setup_time: any;
  teardown_time: any; id: any; title: any; allday: any; start: string | number | Date; end: string | number | Date; 
}){
  return {
    id: event.id, 
    title: event.title, 
    allday: event.allday, 
    start: (event.start)? parseJSON( event.start ).getTime() : null, 
    end: (event.end)? parseJSON( event.end ).getTime() : null, 
    description: event.description, 
    link: event.url.public, 
    location: event.location.name, 
    campusLocation: event.campus, 
    category: event.category.name, 
    owner: event.owner.name, 
    calendar: {name: event.calendar.name, url: event.calendar.public}, 
    registration: event.registration, 
    registrationOpen: event.has_registration_opened, 
    registrationClosed: event.has_registration_closed, 
    seats: event.seats, 
    seatsTaken: event.seats_taken, 
    physicalSeats: event.physical_seats, 
    physicalSeatsTaken: event.physical_seats_taken, 
    onlineSeats: event.online_seats, 
    onlineSeatsTaken: event.online_seats_taken, 
    waitList: event.wait_list, 
    image: event.featured_image, 
    futureDates: event.future_dates.map((fe: { event_id: any; start: string | number | Date; })=>({id: fe.event_id, start: parseJSON( fe.start ).getTime() })), 
    registrationCost: event.registration_cost, 
    moreInfo: event.more_info, 
    setupTime: event.setup_time,
    teardownTime: event.teardown_time 
  }
}

export class EventsData extends GeneralData {

    category: string | undefined;

    items: Event[] = [];

    #endpointURL(){
      let params = this.query?`&search=${this.query}`:'';
      params += this.limit?`&limit=${this.limit}`:'';
      params += this.category?`&category=${this.category}`:'';
      return this.query?
        `${eventsSearchEndpointURL}${params}`:`${eventsEndpointURL}${params}`;
    }

    async fetchData(){
      return fetch(this.#endpointURL())
        .then(r=>r.json())
        .then(data=>{
          this._parseResults(data);
          return this.items;
        })
    }

    _parseResults(d: any) {
      // Setup Library results
      this.items = d.events.map(parseEvent)
    }

}