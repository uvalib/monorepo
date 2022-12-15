import { GeneralSearchResult } from './GeneralSearchResult.js';
import { GeneralSearchMeta } from './GeneralSearchMeta.js';

export const WebSearchPageURL = "https://library.virginia.edu/search/content";

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
        // we are going to filter by multiple types
        // we need to use a condition group
        // https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/filtering#condition-groups
        let qs = this.query? `filter[fulltext]=${this.query}&`:'';
        qs += this.limit? `page[limit]=${this.limit}&`:'';
        // setup the group condition
        qs += `filter[types-group][group][conjunction]=OR`
        this.types.forEach(t=>{
          qs += `&filter[${t}-filter][condition][path]=type&filter[${t}-filter][condition][value]=${t}`;
          qs += `&filter[${t}-filter][condition][memberOf]=types-group`;
        })
        return qs;
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
      this.items = d.data? d.data.map((n: { attributes: {
        body: any; title: any; 
      }; })=>({
        title: n.attributes.title,
        description: n.attributes.body? n.attributes.body.value:null
      })):[]
      this.meta.totalResults = d.data && d.data.meta? d.data.meta.count:0;
    }

  }