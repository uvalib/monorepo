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

  constructor(init?: Partial<HoursData>) {
    super();
    Object.assign(this, init);
  }

  async fetchHours(startDate: Date, count: number | undefined) {
    let end;
    if (count && Math.trunc(count) > 0) {
      end = new Date(startDate);
      end.setDate(startDate.getDate() + Math.trunc(count));
    } else {
      end = new Date(startDate);
    }
    const qsa = `&from=${formatLocalSSDate(startDate)}&to=${formatLocalSSDate(end)}`;
    return this.fetchData(qsa, startDate, count);
  }

  // eslint-disable-next-line class-methods-use-this
  async fetchData(qsa: string | undefined = undefined, startDate?: Date, count?: number) {
    // Initialize rawDates with each date set to "closed"
    const rawDates: RawDates = {};
    for (let i = 0; startDate && count && i <= count; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const formattedDate = formatLocalSSDate(date);
      rawDates[formattedDate] = { status: " " };
    }
    
    const rawData = await this.fetchWithRetry(`${hoursEndpointURL.replace('[[calIds]]', this.ids.join(','))}${qsa ? `&${qsa}` : ''}`)
      .then((res) => res.json())
      .then((hoursData) => hoursData.map((hours: Partial<Hours> | undefined) => {
        // Update rawDates with data from API, or use initialized rawDates if no data
        hours = parseHours(hours);
        hours.rawDates = Object.assign({}, rawDates, hours.rawDates);
        return hours;
      }));

    return rawData;
  }

}
