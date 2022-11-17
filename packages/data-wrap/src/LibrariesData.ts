import { GeneralSearchResult } from './GeneralSearchResult.js';
import { Library} from './Library.js';

const librariesEndpointURL = "http://library-drupal-dev-0.internal.lib.virginia.edu:8080/libs?_format=json";

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
    }
  
  }