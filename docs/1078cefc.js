import{G as s,B as t,a as e,b as i,y as r,o as l}from"./d0e72d69.js";class a extends s{constructor(){super(...arguments),this.libGuidesAPIURL="https://api.library.virginia.edu/libguides/srch_process_cs.php?action=580&search_source_id=0&layout=tab&start=0&group_id=0&guide_id=0&f_group_id=&f_guide_type_id=&f_guide_owner_id=&f_guide_tag_ids=&f_guide_subject_ids=&sort=_score"}async fetchData(s){return fetch(`${this.libGuidesAPIURL}&q=${this.query}`).then((s=>s.json())).then((t=>(this.meta.url=t.data.fulllink,this.parseResults(t.data.results),{items:this.items.slice(0,s&&s.limit?s.limit:this.limit),meta:this.meta})))}descriptionMarkupFix(s){return s}parseResults(s){const t=document.createElement("div");t.innerHTML=s;const e=t.querySelectorAll(".s-srch-result");this.items=Array.from(e).map((s=>{var t,e;return{title:null===(t=s.querySelector(".s-srch-result-title"))||void 0===t?void 0:t.innerHTML.replace(/\s\s/g," "),description:this.descriptionMarkupFix(null===(e=s.querySelectorAll(".s-srch-result-meta")[1])||void 0===e?void 0:e.innerHTML.replace(/\s\s/g," ")),link:""}})).slice(0),t.remove()}}var u;u=new WeakMap,window.customElements.define("libguides-section",class extends t{constructor(){super(),u.set(this,void 0),this.meta={totalResults:0},this.title="Subject Guides",e(this,u,new a({query:""}),"f")}updated(s){super.updated(s),s.has("query")&&(this.loading=!0,i(this,u,"f").query=this.query,i(this,u,"f").fetchData({limit:this.limit}).then((s=>{this.items=s.items,this.meta=s.meta,this.loading=!1})))}render(){var s,t;return r` <div class="bs-results--header"> <h3>${this.title}</h3> <div ?hidden="${!this.isEmptySearch}"><a href="${null===(t=null===(s=this.meta)||void 0===s?void 0:s.url)||void 0===t?void 0:t.replace(/(.*)\?.*/,"$1")}" class="uvalib-button">Search Guides</a></div> <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method="get" style="display:inline"> ${this.meta.url&&this.meta.url.indexOf("?")>0?[...new URLSearchParams(this.meta.url.replace(/^.*\?/,""))].map((s=>r` <input type="hidden" name="${s[0]}" value="${s[1]}"> `)):""} <button type="submit" class="uvalib-button">See all results</button> </form> </div> <div class="bs-results--body"> <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p> <p ?hidden="${this.isEmptySearch}">Subject guides contain topic-specific information to help with research and coursework.</p> <ol ?hidden="${this.isEmptySearch}" class="bs-results--list"> ${this.items.map((s=>r` <li class="bs-results--list--entry bs-results-title"><span class="bs-results--title">${l(s.title)}</span> <ul class="ul-0"> <li class="bs-results--teaser li-1">${l(s.description)}</li> </ul> </li> `))} </ol> </div> `}});