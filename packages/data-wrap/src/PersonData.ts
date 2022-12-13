/* eslint-disable camelcase */
import { Person } from './Person.js';
import { DrupalSearchData } from './DrupalSearchData.js';

export function parsePerson(person: { id: any; attributes: { title: any; body: { processed: any; }; path: { alias: any; }; }; }){
  return new Person({
    id: person.id,
    uuid: person.id,
    title: person.attributes.title,
    body: person.attributes.body? person.attributes.body.processed:'',
    description: person.attributes.body? person.attributes.body.processed:'',
    path: person.attributes.path.alias,
    link: `http://library-drupal-dev-0.internal.lib.virginia.edu:8080${person.attributes.path.alias}`
  })
}
export class PersonData extends DrupalSearchData {

  type: string = "person";

  public items: Person[] = [];

  _parseResults(n: any) {
    // parse out the excerpts that are located in a meta section of the response
    n.data.forEach((res: { attributes: { drupal_internal__nid: any; }; meta: any; }) => {
      const id = res.attributes.drupal_internal__nid;
      const meta = n.meta.extra_data[id];
      res.meta = meta;
    });
    // Setup Library results
    this.items = n.data.map(parsePerson)
    this.meta.totalResults = n.meta.count;
    this.meta.url = `https://library-drupal-dev.internal.lib.virginia.edu/search/node?keys=${ this.query }`
  }

}