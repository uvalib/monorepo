import { GeneralSearchResult } from './GeneralSearchResult.js'

export class GeneralData {

    query: string = "";

    items: GeneralSearchResult[] = [];

    async fetchData(){
      this.items = []
    }

}