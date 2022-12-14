import { GeneralSearchResult } from './GeneralSearchResult.js';
import { GeneralSearchMeta } from './GeneralSearchMeta.js';

export const WebSearchPageURL = "https://library-drupal-dev.internal.lib.virginia.edu/search/content";

const drupalSearchEndpointURL = "https://api.library.virginia.edu/drupal/jsonapi/index/default_index";

export class DrupalSearchData {

    query: string = "";

    limit: number = 25;

    type: string = "";

    types: string[] = [];

    items: GeneralSearchResult[] = [];

    meta: GeneralSearchMeta = {totalResults:0};
  
    protected makeQueryString(){
      if (this.types && this.types.length>0) {
        return `${this.query?`filter[fulltext]=${this.query}&`:""}${this.type?`filter[type]=${this.type}&page[limit]=${this.limit}`:''}`;
      } 
      return `${this.query?`filter[fulltext]=${this.query}&`:""}${this.type?`filter[type]=${this.type}&page[limit]=${this.limit}`:''}`;
    }

    protected makeURL(){
      return `${drupalSearchEndpointURL}?${this.makeQueryString()}`
    }

    async fetchData(params?:{limit?:number}){
      if (params && params.limit) this.limit = params.limit;
      return fetch(this.makeURL())
        .then(r=>r.json())
        .then(data=>{
          this._parseResults(data);         
          return {items:this.items, meta:this.meta};
        })
    }

    _parseResults(d: any) {
      // Setup generic results
      this.items = d.data.map((n: { attributes: {
        body: any; title: any; 
      }; })=>({
        title: n.attributes.title,
        description: n.attributes.body? n.attributes.body.value:null
      }))
      this.meta.totalResults = d.data.meta? d.data.meta.count:0;
    }

  }