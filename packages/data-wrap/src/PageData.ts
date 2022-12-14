/* eslint-disable camelcase */
import { Page, parse } from './Page.js';
import { DrupalSearchData, WebSearchPageURL } from './DrupalSearchData.js';

export class PageData extends DrupalSearchData {

  type: string = "page";

  public items: Page[] = [];

  _parseResults(n: any) {
    // parse out the excerpts that are located in a meta section of the response
    n.data.forEach((res: { attributes: { drupal_internal__nid: any; }; meta: any; }) => {
      const id = res.attributes.drupal_internal__nid;
      const meta = n.meta.extra_data[id];
      res.meta = meta;
    });
    // Setup Library results
    this.items = n.data.map(parse)
    this.meta.totalResults = n.meta.count;
    this.meta.url = `${WebSearchPageURL}?keys=${ this.query }`
  }

}