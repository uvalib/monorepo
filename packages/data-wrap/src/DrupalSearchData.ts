import { DrupalData } from './DrupalData.js';

export const WebSearchPageURL = "https://library.virginia.edu/search/content";

export class DrupalSearchData extends DrupalData {

    protected drupalEndpointURL: string = `${ this.drupalEndpointURL }index/default_index`;
  
    constructor(init?:Partial<DrupalSearchData>) {
      super();
      Object.assign(this, init);
    }

  }