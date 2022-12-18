import { GeneralData } from './GeneralData.js';

export class LibGuidesData extends GeneralData {

    protected readonly libGuidesAPIURL = "https://api.library.virginia.edu/libguides/srch_process_cs.php?action=580&search_source_id=0&layout=tab&start=0&group_id=0&guide_id=0&f_group_id=&f_guide_type_id=&f_guide_owner_id=&f_guide_tag_ids=&f_guide_subject_ids=&sort=_score";
  
    // eslint-disable-next-line class-methods-use-this
    async fetchData(params?:{limit?:number}){
      return fetch(`${this.libGuidesAPIURL}&q=${this.query}`)
        .then(r=>r.json())
        .then(d=>{
          this.meta.url = d.data.fulllink;
          this.parseResults(d.data.results);
          return {items:this.items.slice(0,params&&params.limit? params.limit:this.limit), meta:this.meta};
        })
    }

    // just putting this here in case we need to adjust the markup returned here
    // eslint-disable-next-line class-methods-use-this
    protected descriptionMarkupFix(data: string){
      return data;
    }

    protected parseResults(data: string){
      const detachedDiv = document.createElement('div');
      detachedDiv.innerHTML = data;    
      const resultNodes = detachedDiv.querySelectorAll('.s-srch-result');
      this.items = Array.from(resultNodes).map((node)=>({
        title: node.querySelector('.s-srch-result-title')?.innerHTML.replace(/\s\s/g, ' '),
        description: this.descriptionMarkupFix( node.querySelectorAll('.s-srch-result-meta')[1]?.innerHTML.replace(/\s\s/g, ' ') ),
        link:""
      })).slice(0);
      
      detachedDiv.remove();
    }
  
  }