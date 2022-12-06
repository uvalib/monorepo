import { GeneralSearchMeta } from './GeneralSearchMeta.js';
import { GeneralSearchResult } from './GeneralSearchResult.js'
import { VirgoUtils } from './VirgoUtils.js';


export class CatalogData {

    query: string = "";

    limit: number = 5;

    items: GeneralSearchResult[] = [];
    
    meta: GeneralSearchMeta = {totalResults:0};

    readonly virgoCatalogPoolURL = "https://pool-solr-ws-uva-library.internal.lib.virginia.edu/api/search"

    readonly catalogLinkBase: string = "https://search.lib.virginia.edu/sources/uva_library/items"


    constructor(init: {query: string}){
      // setup initial parameters
      if (init.query) this.query = init.query;
    }

    async fetchData(params?:{limit?:number}){
      return VirgoUtils.fetchData(this.virgoCatalogPoolURL, this.catalogLinkBase, this.query, params&&params.limit? params.limit:this.limit)
                .then((results:{meta: GeneralSearchMeta, items: GeneralSearchResult[]})=>{
                  // eslint-disable-next-line no-param-reassign
                  results.meta.url = `https://search.lib.virginia.edu/?q=${this.query}&pool=uva_library`
                  this.items = results.items;
                  this.meta = results.meta;
                  return results;
                });
    }
  }