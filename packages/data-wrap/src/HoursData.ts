import { hoursEndpointURL, Hours } from './Hours.js';
import { GeneralData } from './GeneralData.js';

export function parseHours(hoursData: any){
  return new Hours(hoursData)
}
export class HoursData extends GeneralData {

  public type: string = "hours";

  public items: Hours[] = [];

  public ids: number[] = [];

//  _parseResults(n: any) {
//    // Setup Library results
//    this.items = n.data.map(parseHours)
//  }

  constructor(init?:Partial<HoursData>) {
    super();
    Object.assign(this, init);
  }

  // eslint-disable-next-line class-methods-use-this
  async fetchData(){
    return fetch(hoursEndpointURL.replace("[[calIds]]",this.ids.join(',')))
          .then(res=>res.json())
          .then(hoursData=>{
            console.log(hoursData)
            return hoursData;
          });
  }

}