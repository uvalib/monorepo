import { VirgoResult } from './VirgoResult.js'
import { GeneralSearchMeta } from './GeneralSearchMeta.js';
import { VirgoUtils } from './VirgoUtils.js';

export class ArticlesData {

    query: string = "";

    items: VirgoResult[] = [];

    limit: number = 5;

    meta: GeneralSearchMeta = {totalResults:0};

    readonly articlePoolURL: string = "https://pool-eds-ws.internal.lib.virginia.edu/api/search";

    readonly articleLinkBaseURL: string = "https://search.lib.virginia.edu/sources/articles/items";

    constructor(init: {query: string}){
      // setup initial parameters
      if (init.query) this.query = init.query;
    }

    async fetchData(params?:{limit?:number}){
      return VirgoUtils.fetchData(this.articlePoolURL, this.articleLinkBaseURL, this.query, params&&params.limit? params.limit:this.limit)
                .then((results:{meta: GeneralSearchMeta, items: VirgoResult[]})=>{
                  // eslint-disable-next-line no-param-reassign
                  results.meta.url = `https://search.lib.virginia.edu/?q=keyword:+{${this.query}}&pool=articles`
                  this.items = results.items;
                  this.meta = results.meta;                  
                  return results;
                });
    }


  }