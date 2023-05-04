/* eslint-disable no-console */
import { GeneralSearchMeta } from "./GeneralSearchMeta.js";
import { VirgoResult } from "./VirgoResult.js";

export class VirgoUtils {
  static readonly authURL: string = "https://search.lib.virginia.edu/authorize";

  static async guestAuthToken() {
    const options: RequestInit = {
      method: "POST",
    };

    const data = await fetch(this.authURL, options).then((r) => r.text());

    if (data !== undefined) {
      return `Bearer ${data}`;
    }
    return "";
  }

  static async fetchData(searchURL: string, linkBaseURL: string, query?: string, limit: number = 5) {
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": await VirgoUtils.guestAuthToken(),
      },
      body: JSON.stringify({
        query: `keyword: {${query === undefined ? "" : query}}`,
        pagination: {
          start: 0,
          rows: limit,
        },
        sort: {
          sort_id: "SortRelevance",
          order: "desc",
        },
        filters: [
          {
            pool_id: "uva_library",
            facets: [],
          },
        ],
      }),
    };


    try {
      const response = await fetch(searchURL, options);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const data = await response.json();
      // console.log("API Response Data:", data); // Add this line to log the response data
      const results = VirgoUtils.parseResults(linkBaseURL, data);
      return results;
    } catch (error) {
      console.error(`Error in fetchData: ${(error as Error).message}`);
      return { items: [], meta: { totalResults: 0 } };
    }
    
  }

  static parseResults(linkBaseURL: string, { group_list = [], pagination = {} }: any) {   
    const items = group_list.map((g: any) => {
      if (g.count === 1) {
        const hit = g.record_list[0];
        const id = hit.fields.find((f: any) => f.type === "identifier")?.value;
        const virgoLink = id ? `${linkBaseURL}/${id}` : undefined;
        const datePublishedField = hit.fields.find((f: any) => f.name === "published_date");
        const datePublished = datePublishedField
          ? new Date(Date.UTC.apply(null, datePublishedField.value.split("-")))
          : undefined;
        const authors = this.truncateAuthors(hit.fields.filter((f: any) => f.type === "author"));
        const item: VirgoResult = {
          id,
          title: hit.fields.find((f: any) => f.type === "title")?.value,
          description: ``,
          link: virgoLink,
          author: authors,
          datePublished,
          publicationType: hit.fields.filter((f: any) => f.name === "pub_type").map((a: any) => a.value),
          format: hit.fields.filter((f: any) => f.name === "format").map((a: any) => a.value),
        };
        return item;
      }

      return null;
    }).filter((item: VirgoResult | null) => item !== null);

    const meta: GeneralSearchMeta = {
      totalResults: pagination? pagination.total : 0,
    };

    return { items, meta };
  }

  static truncateAuthors(authors: any[]): any[] {
    let truncated = authors.map((a: any) => a.value);
    const maxLength = 5;
    if (truncated.length > maxLength) {
      const extraCount = truncated.length - maxLength;
      truncated = truncated.slice(0, maxLength).concat(`and ${extraCount} more`);
    }
    return truncated;
  }
}
