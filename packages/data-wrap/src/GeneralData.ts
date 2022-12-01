import { GeneralSearchResult } from './GeneralSearchResult.js'

export class GeneralData {

    query: string = "";

    items: GeneralSearchResult[] = [];

    limit: Number | null = null

    async fetchData(){
      this.items = []
      return Promise.resolve(this.items);
    }

}