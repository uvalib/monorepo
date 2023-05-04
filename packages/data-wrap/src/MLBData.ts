import Document from "flexsearch/dist/module/document.js";
import { mlbExtrasURL, mlbYearsURL, MLBib } from './MLBib.js';
import { GeneralData } from './GeneralData.js';
import { GeneralSearchResult } from "./GeneralSearchResult.js";
import { GeneralSearchMeta } from "./GeneralSearchMeta.js";

export function parseMLB(mlbData: any) {
  return new MLBib({
    id: mlbData.id,
    title: mlbData.doc.title,
    description: mlbData.doc.plainText,
    link: (mlbData.id.match(/^\d+$/)) ?
      `https://mlbib.library.virginia.edu/year/${mlbData.id}.html` :
      `https://mlbib.library.virginia.edu/${mlbData.id}.html`
  })
}

export class MLBData extends GeneralData {
  private searchIndex: Document = new Document({
    document: {
      id: "id",
      index: ["plainText"],
      store: ["title", "plainText"]
    }
  });

  public searchReady: boolean = false;

  public items: MLBib[] = [];

  public ids: number[] = [];

  constructor(init?: Partial<MLBData>) {
    super();
    Object.assign(this, init);
    this.initSearchIndex();
  }

  private async initSearchIndex() {
    try {
      const [mlbExtras, mlbYears] = await Promise.all([
        fetch(mlbExtrasURL).then(r => r.json()),
        fetch(mlbYearsURL).then(r => r.json())
      ]);

      [...mlbExtras, ...mlbYears].forEach((element: any) => {
        this.searchIndex.add(element);
      });

      this.searchReady = true;
    } catch (error) {
      console.error("Error initializing search index:", error);
    }
  }

  async fetchData(): Promise<{ items: GeneralSearchResult[]; meta: GeneralSearchMeta; }> {
    const waitForTrue = async (): Promise<{ items: GeneralSearchResult[]; meta: GeneralSearchMeta; }> => {
      while (!this.searchReady) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const results = this.searchIndex.search(this.query || '', { enrich: true });
      const items = results[0].result.map((res: any) => parseMLB(res));
      return { items, meta: {} };
    }

    return waitForTrue();
  }
}
