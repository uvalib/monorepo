/* eslint-disable camelcase */
import { Webpage } from './Webpage.js';
import { DrupalSearchData } from './DrupalSearchData.js';

export function parseWebpage(page: { id: any; title: any; body: { processed: any; }; path: { alias: any; }; }){
  return new Webpage({
    id: page.id,
    uuid: page.id,
    title: page.title,
    body: page.body.processed,
    description: page.body.processed,
    path: page.path.alias,
    link: `https://library.virginia.edu${page.path.alias}`
  })
}
export class WebpageData extends DrupalSearchData {

  type: string = "page";

  public items: Webpage[] = [];

  _parseResults(n: any) {
    // Setup Library results
    this.items = n.data.map(parseWebpage)
    this.meta.totalResults = n.meta.count;
  }

}