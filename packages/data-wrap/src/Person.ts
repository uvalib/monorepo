export class Person {
    public id?: string | undefined;

    public uuid?: string | undefined;

    public title: string | undefined;

    public body: string | undefined;

    public description: string | undefined;

    public path?: string | undefined;

    public link: string | undefined;

    constructor(init?:Partial<Person>) {
        Object.assign(this, init);
    }
}

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