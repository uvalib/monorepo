/* eslint-disable camelcase */
import { Page, parse } from './Page.js';
import { DrupalSearchData, WebSearchPageURL } from './DrupalSearchData.js';

type PageDataNode = {
  data: any[];
  meta: {
    extra_data: { [id: string]: any };
    count: number;
  };
};

export class PageData extends DrupalSearchData {
  protected type: string = "page";

  public items: Page[] = [];

  protected parseResults(n: PageDataNode) {
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
