import { GeneralSearchMeta } from './GeneralSearchMeta.js';
import { VirgoResult } from './VirgoResult.js';
import { VirgoUtils } from './VirgoUtils.js';
import { GeneralData } from './GeneralData.js';

export class CatalogData extends GeneralData {
  items: VirgoResult[] = [];

  static readonly virgoCatalogPoolURL = "https://pool-solr-ws-uva-library.internal.lib.virginia.edu/api/search";
  static readonly catalogLinkBase: string = "https://search.lib.virginia.edu/sources/uva_library/items";

  async fetchData(params?: { limit?: number }): Promise<{ meta: GeneralSearchMeta; items: VirgoResult[] }> {
    const limit = params?.limit ?? this.limit;
    // ToDo: Just a note that using `limit+1` is a hack to accomodate a bug in the upstream Virgo API
    const results = await VirgoUtils.fetchData(CatalogData.virgoCatalogPoolURL, CatalogData.catalogLinkBase, this.query, limit+1);

    results.meta.url = `https://search.lib.virginia.edu/?q=${this.query}&pool=uva_library`;

    this.items = results.items;
    this.meta = results.meta;

    return results;
  }
}
