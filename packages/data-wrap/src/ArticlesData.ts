import { VirgoResult } from './VirgoResult.js';
import { GeneralSearchMeta } from './GeneralSearchMeta.js';
import { VirgoUtils } from './VirgoUtils.js';
import { GeneralData } from './GeneralData.js';

export class ArticlesData extends GeneralData {
  items: VirgoResult[] = [];

  static readonly articlePoolURL: string = "https://pool-eds-ws.internal.lib.virginia.edu/api/search";
  static readonly articleLinkBaseURL: string = "https://search.lib.virginia.edu/sources/articles/items";

  async fetchData(params?: { limit?: number }): Promise<{ meta: GeneralSearchMeta; items: VirgoResult[] }> {
    const limit = params?.limit ?? this.limit;
    const results = await VirgoUtils.fetchData(ArticlesData.articlePoolURL, ArticlesData.articleLinkBaseURL, this.query, limit);

    results.meta.url = `https://search.lib.virginia.edu/?q=keyword:+{${this.query}}&pool=articles`;
    this.items = results.items;
    this.meta = results.meta;

    return results;
  }
}
