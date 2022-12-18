/* eslint-disable camelcase */
import { Library, parse } from './Library.js';
import { DrupalSearchData } from './DrupalSearchData.js';
import { HoursData } from './HoursData.js'

export class LibrariesData extends DrupalSearchData {

  protected type: string = "library";

  public items: Library[] = [];

  _parseResults(n: any) {
    // Setup Library results
    this.items = n.data.map(parse)
  }

  // While individual Library entities should be able to fetch their own hours, we 
  // need to be able to make a single api fetch when necessary (to save on network data)
  async fetchHours(){
    const hoursIds = this.items.map(lib=>lib.hoursId).filter(id=>id!==null).map(id=>parseInt(<string>id, 10));
    return new HoursData({ids:hoursIds}).fetchData()
      .then((hours: any)=>{
        this.items.forEach(library=>{
          // Libraries can get their own hours but we are spoon feeding them in this case so we can make one request for all
          if (library.hoursId) library.setHours( hours.find((h: { id: string | undefined; })=>parseInt(<string>h.id, 10)===parseInt(<string>library.hoursId, 10) ) );
        })
      });
  }

}