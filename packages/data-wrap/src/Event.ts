import { parseJSON } from 'date-fns';

/* eslint-disable camelcase */
export class Event { 

    public id?: number;

    public title?: string;

    public allday?: boolean;

    public start?: number;

    public end?: number;

    public description?: string;
    
    public link?: string;

    public location?: string;

    public campusLocation?: string;
    
    public category?: string;
    
    public owner?: string;

    public presenter?: string;
    
    public calendar?: {name: string, url: string};
    
    public registration?: boolean;

    public registrationOpen?: boolean;

    public registrationClosed?: boolean;

    public seats?: number;

    public seatsTaken?: number;

    public physicalSeats?: number;

    public physicalSeatsTaken?: number;

    public onlineSeats?: number;

    public onlineSeatsTaken?: number;

    public waitList?: boolean;
    
    public image?: string;

    public futureDates?: { id: number, start: number }[];
    
    public registrationCost?: number;

    public moreInfo?: string;
    
    public setupTime?: number;
    
    public teardownTime?: number;

    constructor(init?:Partial<Event>) {
        Object.assign(this, init);
    }

}

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