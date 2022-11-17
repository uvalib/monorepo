import { GeneralSearchResult } from './GeneralSearchResult.js'

export class LibGuidesData {

    query: string = "";

    constructor(init: {query: string}){
      // setup initial parameters
      if (init.query) this.query = init.query;
    }

    items: GeneralSearchResult[] = [];
  
    // eslint-disable-next-line class-methods-use-this
    async fetchData(){
      return fetch(`https://api.library.virginia.edu/libguides/srch_process_cs.php?q=${this.query}&action=580&search_source_id=0&layout=tab&start=0&group_id=0&guide_id=0&f_group_id=&f_guide_type_id=&f_guide_owner_id=&f_guide_tag_ids=&f_guide_subject_ids=&sort=_score`)
        .then(r=>r.json())
        .then(d=>{
          this.#parseResults(d.data.results);
          return this.items;
        })
    }

    #parseResults(data: string){
      const dummydiv = document.createElement('div');
      dummydiv.innerHTML = data;
console.log(dummydiv);      
      const resultNodes = dummydiv.querySelectorAll('.s-srch-result');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-console
      this.items = Array.from(resultNodes).map((node)=>({
        title: node.querySelector('.s-srch-result-title')?.innerHTML.replace(/\s\s/g, ' '),
        description: node.querySelectorAll('.s-srch-result-meta')[1]?.innerHTML.replace(/\s\s/g, ' '),
        link:""
      }));
      dummydiv.remove();
      // this.items = [{title:"bar",description:"foo",link:"https://bar.foo"}];
    }
  
  }