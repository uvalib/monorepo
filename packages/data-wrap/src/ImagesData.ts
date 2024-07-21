import { GeneralSearchMeta } from './GeneralSearchMeta.js';
import { VirgoResult } from './VirgoResult.js';
import { VirgoUtils } from './VirgoUtils.js';
import { GeneralData } from './GeneralData.js';

export class ImagesData extends GeneralData {
  items: VirgoResult[] = [];

  static readonly virgoImagesPoolURL = "https://pool-solr-ws-images.internal.lib.virginia.edu/api/search";
  static readonly catalogLinkBase: string = "https://search.lib.virginia.edu/sources/uva_library/items";

  async fetchData(params?: { limit?: number, fullMeta?: boolean }): Promise<{ meta: GeneralSearchMeta; items: VirgoResult[] }> {
    const limit = params?.limit ?? this.limit;
    // ToDo: Just a note that using `limit+1` is a hack to accommodate a bug in the upstream Virgo API
    const results = await VirgoUtils.fetchData(ImagesData.virgoImagesPoolURL, ImagesData.catalogLinkBase, this.query, limit+1);

    results.meta.url = `https://search.lib.virginia.edu/?q=${this.query}&pool=uva_library`;

    if (params?.fullMeta) {
      results.items.forEach((result: any) => {
        console.log(result);
      });
    }

    this.items = results.items;
    this.meta = results.meta;

    return results;
  }
}
