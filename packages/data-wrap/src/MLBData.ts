import Document from "flexsearch/dist/module/document.js";
import { mlbExtrasURL, mlbYearsURL, MLBib } from './MLBib.js';
import { GeneralData } from './GeneralData.js';
import { GeneralSearchResult } from "./GeneralSearchResult.js";
import { GeneralSearchMeta } from "./GeneralSearchMeta.js";

/**
 * Parses MLB data and returns an instance of MLBib.
 * @param mlbData - The MLB data to parse.
 * @returns An instance of MLBib.
 */
export function parseMLB(mlbData: any, query: string): MLBib {

console.log(mlbData);

  const linkBase = mlbData.id.match(/^\d+$/) 
    ? `https://mlbib.library.virginia.edu/year/${mlbData.id}.html?query=${query}` 
    : mlbData.id.startsWith("anchor") && mlbData.doc.year
      ? `https://mlbib.library.virginia.edu/${mlbData.id.replace("anchor-",`year/${mlbData.doc.year}.html#`)}`
      : `https://mlbib.library.virginia.edu/${mlbData.id}.html?query=${query}`;

  return new MLBib({
    id: mlbData.id,
    title: mlbData.doc.title,
    description: mlbData.doc.plainText,
    year: mlbData.doc.year,
    link: linkBase
  });
}

export class MLBData extends GeneralData {
  private searchIndex: Document = new Document({
    document: {
      id: "id",
      index: ["plainText"],
      store: ["title", "year", "plainText"]
    }
  });

  public searchReady: boolean = false;
  public items: MLBib[] = [];
  public ids: number[] = [];

  // Add the indexes property to the class
  public indexes: string[] = [];

  constructor(init?: Partial<MLBData>) {
    super();
    Object.assign(this, init);

    // If no indexes are provided, default to the existing ones
    if (!this.indexes.length) {
      this.indexes = [mlbExtrasURL, mlbYearsURL];
    }

    this.initSearchIndex();
  }

  /**
   * Initializes the search index by fetching data from the provided URLs.
   */
  private async initSearchIndex(): Promise<void> {
    try {
      // Fetch data from the provided URLs
      const fetchedData = await Promise.all(this.indexes.map(url => fetch(url).then(r => r.json())));

      // Flatten the fetched data arrays and add them to the search index
      fetchedData.flat().forEach((element: any) => {
        this.searchIndex.add(element);
      });

      this.searchReady = true;
    } catch (error) {
      console.error("Error initializing search index:", error);
    }
  }

  /**
   * Fetches data and waits for the search index to be ready.
   * @returns An object containing the search results and meta data.
   */
  async fetchData(): Promise<{ items: GeneralSearchResult[]; meta: GeneralSearchMeta; }> {
    const waitForTrue = async (): Promise<{ items: GeneralSearchResult[]; meta: GeneralSearchMeta; }> => {
        while (!this.searchReady) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const results = this.searchIndex.search(this.query || '', { enrich: true });

        // Check if results and results[0] are defined
        if (!results || !results[0] || !results[0].result) {
            console.warn("No search results found or unexpected result structure.");
            return { items: [], meta: {} };
        }

        const items = results[0].result.map((res: any) => parseMLB(res, this.query));
        return { items, meta: {} };
    }

    return waitForTrue();
  }



}
