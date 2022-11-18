import { GeneralSearchResult } from './GeneralSearchResult.js'
import { VirgoAuth } from './VirgoAuth.js';

const virgoCatalogPoolURL = "https://pool-solr-ws-uva-library.internal.lib.virginia.edu/api/search"

export class CatalogData {

    query: string = "";

    items: GeneralSearchResult[] = [];

    readonly virgoLinkBase: string = "https://search.lib.virginia.edu/sources/uva_library/items"

    constructor(init: {query: string}){
      // setup initial parameters
      if (init.query) this.query = init.query;
    }



    async fetchData(){
      this.items = []

      const options = {
        method: "POST",
        headers: {
        Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          "Authorization": await VirgoAuth.guestAuth()

        },
        body: JSON.stringify(
          {
            "query": `keyword: {${this.query}}`,
            "pagination": {
              "start": 0,
              "rows": 5
            },
            "sort": {
              "sort_id": "SortRelevance",
              "order": "desc"
            },
            "filters": [
              {
                "pool_id": "uva_library",
                "facets": []
              }
            ]
          }
        )
      }

      const data = await fetch(virgoCatalogPoolURL, options)
        .then(r=>r.json())

      this.#parseResults(data);
      return this.items;
    }

    #parseResults(data: any){
      if (data.group_list !== undefined) {
        data.group_list.forEach((g: any) =>{
          if (g.count === 1) {
            const hit = g.record_list[0]
            const id = hit.fields.find((f: any)=> f.type === "identifier").value
            const virgoLink = id ? `${this.virgoLinkBase}/${id}` : undefined
            const item: GeneralSearchResult = {
              title:  hit.fields.find((f: any)=> f.type === "title").value,
              description: "",
              link: virgoLink
            }
            this.items.push(item)

          } else {
            console.log("handle grouped item")
          }

        })
      }
      return this.items
    }


  }