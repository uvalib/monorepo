import { hoursEndpointURL, Hours } from './Hours.js';
import { GeneralData } from './GeneralData.js';

interface RawDates {
  [key: string]: {
    status: string;
    hours?: Array<{ from: string; to: string }>;
  };
}

export function parseHours(hoursData: any) {
  return new Hours({
    id: hoursData.lid,
    title: hoursData.name,
    description: hoursData.desc,
    link: hoursData.url,
    rawDates: hoursData.dates,
  });
}

function formatLocalSSDate(date: Date) {
  // SS expects dates to be formatted to YYYY-MM-DD format in Eastern Time
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const [{ value: month }, , { value: day }, , { value: year }] = dtf.formatToParts(date);
  return `${year}-${month}-${day}`;
}

export class HoursData extends GeneralData {
  public items: Hours[] = [];
  public ids: number[] = [];
  [key: string]: any;

  constructor(init?: Partial<HoursData>) {
    super();
    Object.assign(this, init);
  }

  async fetchHours(startDate: Date, count: number | undefined, extra: boolean = false) {
    let end;
    if (count && Math.trunc(count) > 0) {
      end = new Date(startDate);
      end.setDate(startDate.getDate() + Math.trunc(count));
    } else {
      end = new Date(startDate);
    }
    const qsa = `&from=${formatLocalSSDate(startDate)}&to=${formatLocalSSDate(end)}`;
    return this.fetchHoursData(qsa, startDate, count, extra);
  }

  

  async fetchHoursData(qsa: string | undefined = undefined, startDate?: Date, count?: number, extra: boolean = false) {
    const rawDates: RawDates = {};
    for (let i = 0; startDate && count && i <= count; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const formattedDate = formatLocalSSDate(date);
      rawDates[formattedDate] = { status: " " };
    }

    const rawData = await this.fetchWithRetry(`${hoursEndpointURL.replace('[[calIds]]', this.ids.join(','))}${qsa ? `&${qsa}` : ''}`)
      .then((res) => res.json())
      .then(async (hoursData) => Promise.all(hoursData.map(async (hours: Partial<Hours> | undefined) => {
        let returnHours: Partial<Hours> | undefined = parseHours(hours);
        returnHours.rawDates = Object.assign({}, rawDates, returnHours?.rawDates);
        
        if (extra && hours) {
          const extraHours = await import('./HoursDataExtra.js');
//          returnHours.nextClosingTime = extraHours.getNextClosingTime(hours as HoursData);
//          returnHours.nextOpeningTime = extraHours.getNextOpeningTime(hours as HoursData);
const hoursData: HoursData = convertHoursToHoursData(hours); // You'll need to implement this function
returnHours.nextClosingTime = extraHours.getNextClosingTime(hoursData)?.toJSDate();
returnHours.nextOpeningTime = extraHours.getNextOpeningTime(hoursData)?.toJSDate();
returnHours.isOpen = extraHours.isOpenNow(hoursData);
        }
        return returnHours;
        
//        return {items: [], meta: {totalResults: 0}};
      })));

    return rawData;
  }
}

function convertHoursToHoursData(hours: Partial<Hours>): HoursData {
  // Create a new instance of Hours
  const newHours: Hours = new Hours({
    id: hours.id,
    title: hours.title,
    description: hours.description,
    link: hours.link,
    rawDates: hours.rawDates,
  });

  // Check if newHours.id is a number
  const id = typeof newHours.id === 'number' ? newHours.id : undefined;

  // Create a new instance of HoursData
  const hoursData: HoursData = new HoursData({
    items: [newHours], // Assuming 'items' should be an array containing 'newHours'
    ids: id ? [id] : [], // If id is a number, add it to the array. Otherwise, leave the array empty.
    // Add other properties as needed
  });

  return hoursData;
}