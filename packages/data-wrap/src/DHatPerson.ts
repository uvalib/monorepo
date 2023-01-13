import { Person } from './Person.js';
import { parse as parseNode } from './DHatNode.js';

export class DHatPerson extends Person {}

function parseWebLinks(person: { [x: string]: any; title?: any; Name?: any; Email?: any; blogTitles?: any; blogURLs?: any; }){
  let links;
  if (person.blogTitles && person.blogURLs){
    const titles = person.blogTitles.split(',');
    const urls = person.blogURLs.split(',');
    links = titles.map((title:string, index:number)=>({title, url: urls[index], type:"blog"}));
  }
  if (person.otherLinkTitles && person.otherLinkURLs){
    if (!links) links = [];
    const titles = person.otherLinkTitles.split(',');
    const urls = person.otherLinkURLs.split(',');
    links = links.concat( titles.map((title:string, index:number)=>({title, url: urls[index], type:"other"})) );
  }
  if (person.publicationLinkTitles && person.publicationLinkURLs){
    if (!links) links = [];
    const titles = person.publicationLinkTitles.split(',');
    const urls = person.publicationLinkURLs.split(',');
    links = links.concat( titles.map((title:string, index:number)=>({title, url: urls[index], type:"publication"})) );
  }
  return links;
}

export function parse(person: { [x: string]: any; title: any; Name: any; Email: any; }){
  const pep = <DHatPerson>parseNode(person);
  pep.webLinks = parseWebLinks(person);
  pep.email = person.Email;
  pep.name = person.Name;
  pep.computingId = person["UVA ID"];
  return pep; 
}