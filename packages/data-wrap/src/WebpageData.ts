/* eslint-disable camelcase */
import { Webpage } from './Webpage.js';
import { DrupalSearchData, WebSearchPageURL } from './DrupalSearchData.js';



export function parseWebpage(page: {
  meta: any;
  attributes: any; id: any; title: any; body: { processed: any; }; path: { alias: any; }; 
}){
  return new Webpage({
    id: page.id,
    uuid: page.id,
    title: page.attributes.title,
    body: page.attributes.body.processed,
    description: page.meta && page.meta.excerpt? page.meta.excerpt.replace(/<(\/?)strong>/g,"<$1mark>"):"",
    path: page.attributes.path.alias,
    link: `http://library-drupal-dev-0.internal.lib.virginia.edu:8080${page.attributes.path.alias}`
  })
}
export class WebpageData extends DrupalSearchData {

  type: string = "page";

  public items: Webpage[] = [];

  _parseResults(n: any) {
    // parse out the excerpts that are located in a meta section of the response
    n.data.forEach((res: { attributes: { drupal_internal__nid: any; }; meta: any; }) => {
      const id = res.attributes.drupal_internal__nid;
      const meta = n.meta.extra_data[id];
      res.meta = meta;
    });
    // Setup Library results
    this.items = n.data.map(parseWebpage)
    this.meta.totalResults = n.meta.count;
    this.meta.url = `${WebSearchPageURL}?keys=${ this.query }`
  }

}