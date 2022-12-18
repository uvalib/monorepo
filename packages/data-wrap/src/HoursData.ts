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
export class HoursData extends GeneralData {

  public items: Hours[] = [];

  public ids: number[] = [];

  constructor(init?:Partial<HoursData>) {
    super();
    Object.assign(this, init);
  }

  // eslint-disable-next-line class-methods-use-this
  async fetchData(){
    return fetch(hoursEndpointURL.replace("[[calIds]]",this.ids.join(',')))
          .then(res=>res.json())
          .then(hoursData=>hoursData.map((hours: Partial<Hours> | undefined)=>parseHours(hours)));
  }

}