/* eslint-disable no-console */
import { GeneralSearchMeta } from "./GeneralSearchMeta.js";
import { VirgoResult } from "./VirgoResult.js";

export class VirgoUtils {


  static readonly authURL: string = "https://search.lib.virginia.edu/authorize"

  static async guestAuthToken() {
    const options = {
      method: "POST"
    }

    const data = await fetch(this.authURL, options)
    .then(r=>r.text())

    if (data !== undefined){
      return `Bearer ${data}`
    }
    return ""
  }

  static async fetchData(searchURL:string, linkBaseURL:string, query?:string, limit:number=5){
    const options = {
      method: "POST",
      headers: {
      Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": await VirgoUtils.guestAuthToken()

      },
      body: JSON.stringify(
        {
          "query": `keyword: {${ query===undefined?"":query  }}`,
          "pagination": {
            "start": 0,
            "rows": limit
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

    const data = await fetch(searchURL, options)
      .then(r=>r.json())

    const results:{items:VirgoResult[],meta:GeneralSearchMeta} = VirgoUtils.parseResults(linkBaseURL, data);
    return results;
  }

  static parseResults(linkBaseURL: string, data: any){
    const items:VirgoResult[] = []
    const meta:GeneralSearchMeta = data.pagination && data.pagination.total?
                                    {totalResults: data.pagination.total}:{totalResults:0};
    if (data.group_list !== undefined) {
      data.group_list.forEach((g: any) =>{
        if (g.count === 1) {
          const hit = g.record_list[0]
          const id = hit.fields.find((f: any)=> f.type === "identifier").value
          const virgoLink = id ? `${linkBaseURL}/${id}` : undefined
          const datePublished = hit.fields.find((f: any)=> f.name === "published_date")
//          console.log(hit);
          const item: VirgoResult = {
            id: hit.fields.find((f: any)=> f.type === "identifier").value,
            title:  hit.fields.find((f: any)=> f.type === "title").value,
            description: ``,
            link: virgoLink,
            author: hit.fields.filter((f: any)=> f.type === "author")
                              .map((a: any)=> (a.value)),
            datePublished: datePublished ? new Date( Date.UTC.apply(null, datePublished.value.split('-') )) : undefined,
            publicationType: hit.fields.filter((f: any)=> f.name === "pub_type").map((a: any)=>(a.value)),
            format: hit.fields.filter((f: any)=>f.name==="format").map((a: any)=>(a.value))
          }
          items.push(item)

        } else {
          console.log("handle grouped item")
        }

      })
    }
//    console.log(items)
    return {items, meta}
  }


}