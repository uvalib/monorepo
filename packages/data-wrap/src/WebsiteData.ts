/* eslint-disable camelcase */
import { Page, parsePage } from './Page.js';
import { Person, parsePerson } from './Person.js';
import { DrupalSearchData, WebSearchPageURL } from './DrupalSearchData.js';

export class WebsiteData extends DrupalSearchData {

  public items: (Page|Person)[] = [];

  public types: string[] = ["page","person"];

  _parseResults(d: any) {
    // parse out the excerpts that are located in a meta section of the response
    d.data.forEach((res: { attributes: { drupal_internal__nid: any; }; meta: any; }) => {
      const id = res.attributes.drupal_internal__nid;
      const meta = d.meta.extra_data[id];
      res.meta = meta;
    });    
    // Setup generic results
    this.items = d.data? d.data.map((n: any)=>{
      if(n.type === 'node--page')
        return parsePage(n);
      if(n.type === 'node--person')
        return parsePerson(n);
      return {
        title: n.attributes.title,
        description: n.attributes.body? n.attributes.body.value:null
      }
    }):[]
console.log(d)    
    // eslint-disable-next-line no-nested-ternary
    this.meta.totalResults = d.data?.meta? d.data.meta.count:
                                d.meta? d.meta.count:0;
    this.meta.url = `${WebSearchPageURL}?search_api_fulltext=${ this.query }`
  }
}