import { hoursEndpointURL, Hours } from './Hours.js';
import { GeneralData } from './GeneralData.js';

export function parseHours(hoursData: any){
  return new Hours(hoursData)
}
export class HoursData extends GeneralData {

  public type: string = "hours";

  public items: Hours[] = [];

//  _parseResults(n: any) {
//    // Setup Library results
//    this.items = n.data.map(parseHours)
//  }

  async fetchHours(calIds: number[]){
    return fetch(hoursEndpointURL.replace("[[calIds]]",calIds.join(',')))
          .then(res=>res.json())
          .then(hoursData=>{
            console.log(hoursData)
          });
  }

}