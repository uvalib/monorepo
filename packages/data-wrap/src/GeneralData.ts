import { GeneralSearchResult } from './GeneralSearchResult.js';
import { GeneralSearchMeta } from './GeneralSearchMeta.js';

export class GeneralData {

    public query?: string;

    public items: GeneralSearchResult[] = [];

    public meta: GeneralSearchMeta = {totalResults:0};

    public limit?: number;

    constructor(init?:Partial<GeneralData>) {
      Object.assign(this, init);
    }

    async fetchData(){
      this.items = []
      return Promise.resolve({items: this.items, meta: this.meta});
    }

}