type IndexType = 'flexsearch' | 'fuse';

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
      const { Index } = await import('flexsearch');
      this.index = new Index();
  
      // Import all keys from the exported index
      for (let key in parsedContent.index) {
        this.index.import(key, parsedContent.index[key]);
      }
    } else if (this.indexType === 'fuse') {
      const { default: Fuse } = await import('fuse.js');
      this.index = new Fuse(parsedContent.index, { keys: ['text'] }); // Use the actual index data
    }
  }  

  // Perform search
  performSearch(query: string): string[] {
    let results: any[] = [];
    if (this.indexType === 'flexsearch') {
      results = this.index.search(query, {enrich: true});
    } else if (this.indexType === 'fuse') {
      results = this.index.search(query).map((item: any) => item.refIndex);
    }

    return results.map((result: any) => this.filenames[result]);
  }
}
