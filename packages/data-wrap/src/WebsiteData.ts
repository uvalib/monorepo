/* eslint-disable camelcase */
import { Webpage } from './Webpage.js';
import { Person } from './Person.js';
import { DrupalSearchData } from './DrupalSearchData.js';

export class WebsiteData extends DrupalSearchData {

  public items: (Webpage|Person)[] = [];

  public types: string[] = ["page","person"];

  
}