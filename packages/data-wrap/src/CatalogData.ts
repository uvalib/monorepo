import { GeneralSearchMeta } from './GeneralSearchMeta.js';
import { VirgoResult } from './VirgoResult.js';
import { VirgoUtils } from './VirgoUtils.js';
import { GeneralData } from './GeneralData.js';

export class CatalogData extends GeneralData{

    items: VirgoResult[] = [];

    static readonly virgoCatalogPoolURL = "https://pool-solr-ws-uva-library.internal.lib.virginia.edu/api/search"

    static readonly catalogLinkBase: string = "https://search.lib.virginia.edu/sources/uva_library/items"

    async fetchData(params?:{limit?:number}){
      return VirgoUtils.fetchData(CatalogData.virgoCatalogPoolURL, CatalogData.catalogLinkBase, this.query, params&&params.limit? params.limit:this.limit)
                .then((results:{meta: GeneralSearchMeta, items: VirgoResult[]})=>{
                  // eslint-disable-next-line no-param-reassign
                  results.meta.url = `https://search.lib.virginia.edu/?q=${this.query}&pool=uva_library`

                  this.items = results.items;
                  this.meta = results.meta;
                  return results;
                });
    }
  }