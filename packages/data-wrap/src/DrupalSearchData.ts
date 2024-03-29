import { DrupalData } from './DrupalData.js';

export const WebSearchPageURL = 'https://library.virginia.edu/search/content';

export class DrupalSearchData extends DrupalData {
  protected drupalEndpointURL: string = `${this.drupalEndpointURL}`;

  constructor(init?: Partial<DrupalSearchData>) {
    super();
  }

  protected parseResults(d: any) {
    super.parseResults(d);
  }
}
