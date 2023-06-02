/* eslint-disable camelcase */
import { News, parse } from './News.js';
import { WebSearchPageURL } from './DrupalSearchData.js';
import { PageData, PageDataNode } from './PageData.js';

type NewsDataNode = PageDataNode;

export class NewsData extends PageData {
  protected type: string = "article";

  public items: News[] = [];

  protected parseResults(n: NewsDataNode) {
    n.data.forEach((res: { attributes: { drupal_internal__nid: any }; meta: any }) => {
      const { attributes: { drupal_internal__nid }, meta } = res;
      const id = drupal_internal__nid;
      const newMeta = n.meta.extra_data[id];
      res.meta = newMeta;
    });
  
    // Setup Library results
    this.items = n.data.map(parse);
    this.meta.totalResults = n.meta.count;
    this.meta.url = `${WebSearchPageURL}?keys=${this.query}`;
  }
  
}
