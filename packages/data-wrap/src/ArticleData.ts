import { GeneralSearchResult } from './GeneralSearchResult.js'


export class ArticleData {

    query: string = "";

    readonly articlePoolAPIURL: string = "";

    constructor(init: {query: string}){
      // setup initial parameters
      if (init.query) this.query = init.query;
    }

    items: GeneralSearchResult[] = [];

    // eslint-disable-next-line class-methods-use-this
    async fetchData(){
      return fetch(`${this.articlePoolAPIURL}q=${this.query}`)
        .then(r=>r.json())
        .then(d=>{
          this.#parseResults(d.data.results);
          return this.items;
        })
    }

    #parseResults(data: string){
      const detachedDiv = document.createElement('div');
      detachedDiv.innerHTML = data;
      const resultNodes = detachedDiv.querySelectorAll('.s-srch-result');
      this.items = Array.from(resultNodes).map((node)=>({
        title: node.querySelector('.s-srch-result-title')?.innerHTML.replace(/\s\s/g, ' '),
        description: node.querySelectorAll('.s-srch-result-meta')[1]?.innerHTML.replace(/\s\s/g, ' '),
        link:""
      }));
      detachedDiv.remove();
    }


  }