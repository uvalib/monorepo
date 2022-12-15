/* eslint-disable camelcase */
export class Person {
    public id?: string | undefined;

    public uuid?: string | undefined;

    public title: string | undefined;

    public body: string | undefined;

    public description: string | undefined;

    public path?: string | undefined;

    public link: string | undefined;

    public jobTitle?: string[]; 

    constructor(init?:Partial<Person>) {
        Object.assign(this, init);
    }
}

export function parse(person: { id: any; attributes: {
  field_uva_ldap_title: string[] | undefined; title: any; body: { processed: any; }; path: { alias: any; }; 
}; }){
    return new Person({
      id: person.id,
      uuid: person.id,
      title: person.attributes.title,
      jobTitle: person.attributes.field_uva_ldap_title,
      body: person.attributes.body? person.attributes.body.processed:'',
      description: person.attributes.body? person.attributes.body.processed:'',
      path: person.attributes.path.alias,
      link: `http://library.virginia.edu${person.attributes.path.alias}`
    })
  }