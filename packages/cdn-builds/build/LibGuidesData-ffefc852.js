import{G as e}from"./ArticlesData-c1e511c9.js";class t extends e{constructor(){super(...arguments),this.libGuidesAPIURL="https://api.library.virginia.edu/libguides/srch_process_cs.php?action=580&search_source_id=0&layout=tab&start=0&group_id=0&guide_id=0&f_group_id=&f_guide_type_id=&f_guide_owner_id=&f_guide_tag_ids=&f_guide_subject_ids=&sort=_score"}async fetchData(e){return fetch(`${this.libGuidesAPIURL}&q=${this.query}`).then((e=>e.json())).then((t=>(this.meta.url=t.data.fulllink,this.parseResults(t.data.results),{items:this.items.slice(0,e&&e.limit?e.limit:this.limit),meta:this.meta})))}descriptionMarkupFix(e){return e}parseResults(e){const t=document.createElement("div");t.innerHTML=e;const i=t.querySelectorAll(".s-srch-result");this.items=Array.from(i).map((e=>{var t,i;return{title:null===(t=e.querySelector(".s-srch-result-title"))||void 0===t?void 0:t.innerHTML.replace(/\s\s/g," "),description:this.descriptionMarkupFix(null===(i=e.querySelectorAll(".s-srch-result-meta")[1])||void 0===i?void 0:i.innerHTML.replace(/\s\s/g," ")),link:""}})).slice(0),t.remove()}}export{t as L};