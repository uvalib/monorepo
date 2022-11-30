/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import { GeneralSearchResult } from './GeneralSearchResult.js';

const drupalSearchEndpointURL = "https://api.library.virginia.edu/drupal/jsonapi/index/default_index";

export class DrupalSearchData {

    query: string = "";

    type: string = "";

    items: GeneralSearchResult[] = [];
  
    _makeURL(){
      return `${drupalSearchEndpointURL}?${this.query?`filter[fulltext]=${this.query}&`:""}${this.type?`filter[type]=${this.type}`:""}`
    }

    async fetchData(){
      return fetch(this._makeURL())
        .then(r=>r.json())
        .then(data=>{
          this._parseResults(data);
        })
    }

    // eslint-disable-next-line class-methods-use-this
    _parseResults(d: any) {
      console.log(d);

      // Setup generic results
      this.items = d.data.map((n: { attributes: {
        body: any; title: any; 
      }; })=>({
        title: n.attributes.title,
        description: n.attributes.body? n.attributes.body.value:null
      }))

    }

  }