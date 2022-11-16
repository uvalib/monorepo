import { GeneralSearchResult } from './GeneralSearchResult.js'

export class VirgoData {

    items: GeneralSearchResult[]  = [];
  
    async fetchData(){
      // This should be fetched live from the site under normal conditions
      this.items = [{title:"foo",description:"bar",link:"https://foo.bar"}]
      return Promise.resolve(this.items);
    }
  
  }