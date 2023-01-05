import { Person } from './Person.js';

export class DHatPerson extends Person {}

export function parse(person: { [x: string]: any; title: any; Name: any; Email: any; }){
    return new DHatPerson({
      id: person.title,
      title: person.title,
      name: person.Name,
      email: person.Email,
      computingId: person["UVA ID"]
    })
}