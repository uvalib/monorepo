declare module 'flexsearch/dist/module/document.js' {
    class Document {
      constructor(options: Record<string, unknown>);
  
      add(data: any): void;
      search(query: string, options?: Record<string, unknown>): any;
    }
  
    export default Document;
  }
  