import{_ as t,e as s,a as e,b as i,y as r}from"./query-assigned-elements-9f2025bb.js";import{M as a}from"./MLBData-d773849b.js";import"./ArticlesData-fb86ab76.js";import{B as n}from"./BentoSection-1a4a1a7d.js";import"./GeneralSearchResult-331b56d5.js";import"./unsafe-html-deeaec8d.js";import"./SiteStyle-d7ea4a7e.js";var l;class h extends n{constructor(){super(),l.set(this,void 0),this.items=[],this.meta={totalResults:0},this.title="Modern Library Bibliography",e(this,l,new a({query:""}),"f"),this.limit=5}updated(t){super.updated(t),t.has("query")&&(this.loading=!0,i(this,l,"f").query=this.query,i(this,l,"f").fetchData().then((t=>{this.items=t.items,this.meta=t.meta,this.loading=!1})))}highlight(t){const{query:s}=this,e=s.split(" "),i={snippet:"",match:""};for(let s=0;s<e.length;s++){const r=new RegExp(`\\b${e[s]}\\b`,"i"),a=t.search(r);if(-1!==a){const r=Math.max(a-30,0),n=Math.min(a+30,t.length-1);i.snippet=t.substring(r,n),i.match=e[s];break}}return""===i.snippet&&(i.snippet=t.substring(0,60)),console.log(i),i.snippet}render(){return r`
        <div class="bs-results--header">
        </div>

        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

            ${this.items.map((t=>r`
              <li class="bs-results--list--entry">
                <a href="${t.link?t.link:""}" class="bento-section-title">${t.title}</a>
                ${t.description?r`<div class="bento-section-desc">${this.highlight(t.description)}</div>`:""}
              </li>
            `))}

            </ol>
        </div>
    `}}l=new WeakMap,t([s({type:Array})],h.prototype,"items",void 0),window.customElements.define("mlb-section",h);
