import { GeneralSearchResult } from './GeneralSearchResult.js';
import { GeneralSearchMeta } from './GeneralSearchMeta.js';

const drupalSearchEndpointURL = "https://api.library.virginia.edu/drupal/jsonapi/index/default_index";

export class DrupalSearchData {

    query: string = "";

    limit: number = 25;

    type: string = "";

    items: GeneralSearchResult[] = [];

    meta: GeneralSearchMeta = {totalResults:0};
  
    _makeURL(){
      return `${drupalSearchEndpointURL}?${this.query?`filter[fulltext]=${this.query}&`:""}${this.type?`filter[type]=${this.type}&page[limit]=${this.limit}`:""}`
    }

    async fetchData(params?:{limit?:number}){
      if (params && params.limit) this.limit = params.limit;
      return fetch(this._makeURL())
        .then(r=>r.json())
        .then(data=>{
          this._parseResults(data);
console.log(this.items)          
          return {items:this.items, meta:this.meta};
        })
//        .then(d=>{
//          this.meta.url = d.data.fulllink;
//          this.#parseResults(d.data.results);
//          return {items:this.items, meta:this.meta};
//        })



    }

    _parseResults(d: any) {
      // Setup generic results
      this.items = d.data.map((n: { attributes: {
        body: any; title: any; 
      }; })=>({
        title: n.attributes.title,
        description: n.attributes.body? n.attributes.body.value:null
      }))
      this.meta.totalResults = d.data.meta.count;
    }

  }