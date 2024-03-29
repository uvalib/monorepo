/* eslint-disable camelcase */
import { Person, parse } from './Person.js';
import { DrupalSearchData } from './DrupalSearchData.js';

export class PersonData extends DrupalSearchData {

  protected type: string = "person";

  public items: Person[] = [];

  protected parseResults(n: any) {
    // parse out the excerpts that are located in a meta section of the response
    n.data.forEach((res: { attributes: { drupal_internal__nid: any; }; meta: any; }) => {
      const id = res.attributes.drupal_internal__nid;
      const meta = n.meta.extra_data[id];
      res.meta = meta;
    });
    // Setup Library results
    this.items = n.data.map(parse)
    this.meta.totalResults = n.meta.count;
    this.meta.url = `https://library.virginia.edu/search/node?keys=${ this.query }`
  }

}