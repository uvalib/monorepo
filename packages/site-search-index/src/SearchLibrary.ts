type IndexType = 'flexsearch' | 'fuse';

interface FlexSearchResult {
  field: string;
  result: Array<{
    id: number;
    // ... other properties if needed
  }>;
}

// @ts-ignore
//import FlexSearch from 'flexsearch';
//const { Document } = FlexSearch;

//import { Document } from 'flexsearch';

import Document from 'flexsearch/dist/module/document.js';

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
//      const { Document } = await import('flexsearch');
console.log('document:')
//console.log(FlexSearch);
console.log(Document);
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
      const Fuse = await import('fuse.js');
      //const { default: Fuse } = await import('fuse.js');
      this.index = new Fuse.default(parsedContent.index, { keys: ['text'] });
    }
  }
 
  performSearch(query: string): string[] {
    let results: any[] = [];
    if (this.indexType === 'flexsearch') {
console.log(this.index)      
      const searchResults = this.index.search(query, {enrich: true});
console.log(searchResults)      
      //results = searchResults.flatMap(result => result.result);
      results = searchResults.flatMap((result: FlexSearchResult) => result.result);
console.log(results);
    } else if (this.indexType === 'fuse') {
      results = this.index.search(query).map((item: any) => item.refIndex);
    }

    console.log(results);


    return results.map((result: any) => this.filenames[result.id]);
  }

}
