// @ts-ignore
import Document from "flexsearch/dist/module/document.js";

import { mlbExtrasURL, mlbYearsURL, MLBib } from './MLBib.js';
import { GeneralData } from './GeneralData.js';
import { GeneralSearchResult } from "./GeneralSearchResult.js";
import { GeneralSearchMeta } from "./GeneralSearchMeta.js";

export function parseMLB(mlbData: any){
  //console.log(mlbData)
  return new MLBib({
    id: mlbData.id,
    title: mlbData.doc.title,
    description: mlbData.doc.plainText,
    link: (mlbData.id.match(/^\d+$/))?
      `https://mlbib.library.virginia.edu/year/${mlbData.id}.html`:
      `https://mlbib.library.virginia.edu/${mlbData.id}.html`
  })
}
export class MLBData extends GeneralData {

  private searchIndex: Document = new Document({
    document: {
      id: "id",
      index: ["plainText"],
      store: ["title","plainText"]
    }
  });

  public searchReady: boolean = false;

  public items: MLBib[] = [];

  public ids: number[] = [];

  constructor(init?:Partial<MLBData>) {
    super();
    Object.assign(this, init);

    let indexReqs = [];
    // get the mlbExtras and add to the index
    indexReqs.push( 
      fetch(mlbExtrasURL).then(r=>r.json())
        .then(d=>{
          d.forEach((element: any) => {
            this.searchIndex.add(element);
          });
        }) 
    );
    // get the 
    indexReqs.push( 
      fetch(mlbYearsURL).then(r=>r.json())
        .then(d=>{
          d.forEach((element: any) => {
            this.searchIndex.add(element);
          });
        })
    );
    // Done loading the search index
    Promise.all(indexReqs).then(()=>{
      this.searchReady = true;
      this.searchIndex.search("mark", {enrich: true})
    })
  }

  // eslint-disable-next-line class-methods-use-this
  async fetchData(): Promise<{ items: GeneralSearchResult[]; meta: GeneralSearchMeta; }>{
    const that = this;
    function waitForTrue(): Promise<{ items: GeneralSearchResult[]; meta: GeneralSearchMeta; }> {
      return new Promise(resolve => {
        const checkIfTrue = () => {
          if (that.searchReady) {
            const results = that.searchIndex.search(that.query, {enrich: true});
            const items = results[0].result.map((res: any)=>parseMLB(res))
            resolve({items, meta:{} });
          } else {
            setTimeout(checkIfTrue, 100);
          }
        };
        checkIfTrue();
      });
    }
    return waitForTrue();
    
/*
    return new Promise(resolve => {
      const wait = setTimeout(() => {
        if (this.searchReady) {
          const results = this.searchIndex.search(this.query, {enrich: true});
          const items = results[0].result.map((res: any)=>parseMLB(res))
          resolve({items: items, meta:{} });
        }
        else wait();
      }, 300);
    });
*/
//    return fetch(hoursEndpointURL.replace("[[calIds]]",this.ids.join(',')))
//          .then(res=>res.json())
//          .then(hoursData=>hoursData.map((hours: Partial<MLBib> | undefined)=>parseMLB(hours)));
  }

}