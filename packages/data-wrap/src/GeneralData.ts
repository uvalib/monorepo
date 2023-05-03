import { GeneralSearchResult } from './GeneralSearchResult.js';
import { GeneralSearchMeta } from './GeneralSearchMeta.js';

export class GeneralData {

    public query?: string;

    public items: GeneralSearchResult[] = [];

    public meta: GeneralSearchMeta = {totalResults:0};

    public limit: number = 100;

    public fetchRetries: number = 3;

    public fetchDelay: number = 1000;

    constructor(init?:Partial<GeneralData>) {
      Object.assign(this, init);
    }

    async fetchData(){
      this.items = []
      return Promise.resolve({items: this.items, meta: this.meta});
    }

    async fetchWithRetry(url: string, options: Partial<RequestInit> = {}): Promise<Response> {
      return this.retry(async () => {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response;
      });
    }

    private async retry<T>(fn: () => Promise<T>, attempt: number = 1): Promise<T> {
      try {
        return await fn();
      } catch (error) {
        if (attempt < this.fetchRetries) {
          await new Promise(resolve => setTimeout(resolve, this.fetchDelay));
          return this.retry(fn, attempt + 1);
        }
        throw error;
      }
    }

}