import { GeneralSearchResult } from './GeneralSearchResult.js';
import { Library} from './Library.js';

const librariesEndpointURL = "https://api.library.virginia.edu/drupal/libs?_format=json";

export class LibrariesData {

    query: string = "";

    items: GeneralSearchResult[] = [];

    libraries: Library[] = [];
  
    async fetchData(){
      return fetch(librariesEndpointURL)
        .then(r=>r.json())
        .then(data=>{
          this.#parseResults(data);
          return this.libraries;
        })
    }

    // eslint-disable-next-line class-methods-use-this
    #parseResults(d: any) {
      // eslint-disable-next-line no-console
      console.log(d);
      this.libraries = d.map((l: {
        body: any;
        title: any;
        uuid: any; nid: any; 
      })=>({
          id: l.nid[0].value.toString(),
          uuid: l.uuid[0].value,
          title: l.title[0].value,
          body: l.body[0].value
        }))
    }
  
  }