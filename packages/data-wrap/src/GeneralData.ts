import { GeneralSearchResult } from './GeneralSearchResult.js';
import { GeneralSearchMeta } from './GeneralSearchMeta.js';

export class GeneralData {

    public query?: string;

    public items: GeneralSearchResult[] = [];

    public meta: GeneralSearchMeta = {totalResults:0};

    public limit?: number;

    public fetchRetries: number = 3;

    public fetchDelay: number = 1000;

    constructor(init?:Partial<GeneralData>) {
      Object.assign(this, init);
    }

    async fetchData(){
      this.items = []
      return Promise.resolve({items: this.items, meta: this.meta});
    }

    async fetchWithRetry(url: string, options: any = {}): Promise<Response> {
      const retry = async (attempt: number): Promise<Response> => {
        try {
          const response = await fetch(url, options);
          if (response.ok) {
            return response;
          }
          if (attempt < this.fetchRetries) {
            await new Promise(resolve => setTimeout(resolve, this.fetchDelay));
            return retry(attempt + 1);
          } 
          throw new Error(response.statusText);
        } catch (error) {
          if (attempt < this.fetchRetries) {
            await new Promise(resolve => setTimeout(resolve, this.fetchDelay));
            return retry(attempt + 1);
          } 
          throw error;
        }
      };
    
      return retry(1);
    }

}