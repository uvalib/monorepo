import { GeneralSearchResult } from './GeneralSearchResult.js'

// needs a q (query) parameter appended onto the end!
const libGuidesAPIURL = "https://api.library.virginia.edu/libguides/srch_process_cs.php?action=580&search_source_id=0&layout=tab&start=0&group_id=0&guide_id=0&f_group_id=&f_guide_type_id=&f_guide_owner_id=&f_guide_tag_ids=&f_guide_subject_ids=&sort=_score"
export class LibGuidesData {

    query: string = "";

    constructor(init: {query: string}){
      // setup initial parameters
      if (init.query) this.query = init.query;
    }

    items: GeneralSearchResult[] = [];
  
    // eslint-disable-next-line class-methods-use-this
    async fetchData(){
      return fetch(`${libGuidesAPIURL}&q=${this.query}`)
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