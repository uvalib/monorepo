import { hoursEndpointURL, Hours } from './Hours.js';
import { GeneralData } from './GeneralData.js';

export function parseHours(hoursData: any){
  return new Hours({
    id: hoursData.lid,
    title: hoursData.name,
    description: hoursData.desc,
    link: hoursData.url,
    rawDates: hoursData.dates
  })
}

function formatLocalSSDate(date:Date) {
  // SS expects dates to be formatted to YYYY-MM-DD format in Eastern Time
  const dtf = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' });
  const [{ value: month },,{ value: day },,{ value: year }] = dtf.formatToParts(date);
  return `${year}-${month}-${day}`;
}

export class HoursData extends GeneralData {

  public items: Hours[] = [];

  public ids: number[] = [];

  constructor(init?:Partial<HoursData>) {
    super();
    Object.assign(this, init);
  }

  async fetchHours(startDate:Date, count:number|undefined) {
    let end;
    if (count && Math.trunc(count)>0) {
      end = new Date(startDate);
      end.setDate(startDate.getDate() + Math.trunc(count));
    } else
      end = new Date(startDate);
    const qsa = `&from=${ formatLocalSSDate(startDate) }&to=${ formatLocalSSDate( end ) }`;
    return this.fetchData(qsa);
  }

  // eslint-disable-next-line class-methods-use-this
  async fetchData(qsa:string|undefined=undefined){
    return fetch( `${ hoursEndpointURL.replace("[[calIds]]",this.ids.join(',')) }${ qsa? `&${qsa}`:'' }` )
          .then(res=>res.json())
          .then(hoursData=>hoursData.map((hours: Partial<Hours> | undefined)=>parseHours(hours)));
  }

}