/* eslint-disable camelcase */
export class Person {
    public id?: string;

    public uuid?: string;

    public title?: string;

    public name?: string;

    public description?: string;

    public path?: string;

    public link?: string;

    public jobTitle?: string[]; 

    public computingId?: string;

    public email?: string;

    constructor(init?:Partial<Person>) {
        Object.assign(this, init);
    }
}

export function parse(person: { id: any; attributes: { title: any; field_uva_ldap_title: any; body: { processed: string | undefined; }; path: { alias: any; }; field_computing_id: any; field_uva_ldap_email: any; }; }){
    return new Person({
      id: person.id,
      uuid: person.id,
      title: person.attributes.title,
      name: person.attributes.title,
      jobTitle: person.attributes.field_uva_ldap_title,
      description: person.attributes.body? person.attributes.body.processed:'',
      path: person.attributes.path.alias,
      link: `http://library.virginia.edu${person.attributes.path.alias}`,
      computingId: person.attributes.field_computing_id,
      email: person.attributes.field_uva_ldap_email
    })
  }