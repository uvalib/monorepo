import { VirgoResult } from './VirgoResult.js'
import { GeneralSearchMeta } from './GeneralSearchMeta.js';
import { VirgoUtils } from './VirgoUtils.js';
import { GeneralData } from './GeneralData.js';

export class ArticlesData extends GeneralData {

    items: VirgoResult[] = [];

    static readonly articlePoolURL: string = "https://pool-eds-ws.internal.lib.virginia.edu/api/search";

    static readonly articleLinkBaseURL: string = "https://search.lib.virginia.edu/sources/articles/items";

    async fetchData(params?:{limit?:number}){
      return VirgoUtils.fetchData(ArticlesData.articlePoolURL, ArticlesData.articleLinkBaseURL, this.query, params&&params.limit? params.limit:this.limit)
                .then((results:{meta: GeneralSearchMeta, items: VirgoResult[]})=>{
                  // eslint-disable-next-line no-param-reassign
                  results.meta.url = `https://search.lib.virginia.edu/?q=keyword:+{${this.query}}&pool=articles`
                  this.items = results.items;
                  this.meta = results.meta;                  
                  return results;
                });
    }

  }