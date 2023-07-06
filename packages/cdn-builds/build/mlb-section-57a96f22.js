import{_ as t,e as s,a as e,b as i}from"./query-assigned-elements-ba719eec.js";import{x as r}from"./lit-element-b1a1c7e4.js";import{M as a}from"./MLBData-94ca29a7.js";import"./ArticlesData-e9b81d53.js";import{B as n}from"./BentoSection-4595ae76.js";import"./GeneralSearchResult-331b56d5.js";import"./unsafe-html-d2a53643.js";import"./SiteStyle-00ee8f65.js";var l;class o extends n{constructor(){super(),l.set(this,void 0),this.items=[],this.meta={totalResults:0},this.title="Modern Library Bibliography",e(this,l,new a({query:""}),"f"),this.limit=5}updated(t){super.updated(t),t.has("query")&&(this.loading=!0,i(this,l,"f").query=this.query,i(this,l,"f").fetchData().then((t=>{this.items=t.items,this.meta=t.meta,this.loading=!1})))}highlight(t){const{query:s}=this,e=s.split(" "),i={snippet:"",match:""};for(let s=0;s<e.length;s++){const r=new RegExp(`\\b${e[s]}\\b`,"i"),a=t.search(r);if(-1!==a){const r=Math.max(a-30,0),n=Math.min(a+30,t.length-1);i.snippet=t.substring(r,n),i.match=e[s];break}}return""===i.snippet&&(i.snippet=t.substring(0,60)),console.log(i),i.snippet}render(){return r`
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
    `}}l=new WeakMap,t([s({type:Array})],o.prototype,"items",void 0),window.customElements.define("mlb-section",o);
