import { GeneralSearchResult } from './GeneralSearchResult.js'
import { VirgoUtils } from './VirgoUtils.js';


export class ArticlesData {

    query: string = "";

    items: GeneralSearchResult[] = [];

    readonly articlePoolURL: string = "https://pool-eds-ws.internal.lib.virginia.edu/api/search";

    readonly articleLinkBaseURL: string = "https://search.lib.virginia.edu/sources/articles/items";

    constructor(init: {query: string}){
      // setup initial parameters
      if (init.query) this.query = init.query;
    }

    async fetchData(){
      return VirgoUtils.fetchData(this.articlePoolURL, this.articleLinkBaseURL, this.query)

    }


  }