/// <reference path="../declarations.d.ts" />

type IndexType = 'flexsearch' | 'fuse';

interface FlexSearchResult {
  field: string;
  result: Array<{
    id: number;
  }>;
}

export class SearchLibrary {
  private index: any;
  private filenames: string[];
  private indexType: IndexType;

  constructor() {
    this.filenames = [];
    this.indexType = 'flexsearch'; // Default value
  }

  async loadFromString(indexString: string) {
    const parsedContent = JSON.parse(indexString);
    this.indexType = parsedContent.indexType;
    this.filenames = parsedContent.filenames;
  
    if (this.indexType === 'flexsearch') {
      const { Document } = await import('flexsearch');

      this.index = new Document({
        document: {
          id: "id",
          index: ["content"],
          store: ["title", "year"]
        }
      });
  
      // Import all keys from the exported index
      for (let key in parsedContent.index) {
        this.index.import(key, parsedContent.index[key]);
      }
    } else if (this.indexType === 'fuse') {
      //const Fuse = await import('fuse.js');
      //const { default: Fuse } = await import('fuse.js');
      //const { default: Fuse } = await import('fuse.js');

      //this.index = new Fuse.default(parsedContent.index, { keys: ['text'] });
      //this.index = new Fuse(parsedContent.index, { keys: ['text'] });
      const { default: FuseAny } = await import('fuse.js');
      const Fuse = FuseAny as any;
      this.index = new Fuse(parsedContent.index, { keys: ['text'] });

    }
  }
 
  performSearch(query: string): string[] {
    let results: any[] = [];
    if (this.indexType === 'flexsearch') {
//console.log(this.index)      
      const searchResults = this.index.search(query, {enrich: true});
console.log(JSON.stringify(searchResults))      

      results = searchResults.flatMap((result: FlexSearchResult) => result.result);
//console.log(results);
    } else if (this.indexType === 'fuse') {
      results = this.index.search(query).map((item: any) => item.refIndex);
    }

    return results.map((result: any) => this.filenames[result.id]);
  }

}
