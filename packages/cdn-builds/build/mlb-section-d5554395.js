import{_ as t,e,a as s,b as i}from"./query-assigned-elements-ba719eec.js";import{x as r}from"./lit-element-b1a1c7e4.js";import{M as n}from"./MLBData-58477626.js";import"./ArticlesData-e9b81d53.js";import{B as a}from"./BentoSection-04bc3f2f.js";import"./GeneralSearchResult-331b56d5.js";import"./unsafe-html-d2a53643.js";import"./SiteStyle-00ee8f65.js";var h;class o extends a{constructor(){super(),h.set(this,void 0),this.items=[],this.meta={totalResults:0},this.title="Modern Library Bibliography",s(this,h,new n({query:""}),"f"),this.limit=5}updated(t){if(super.updated(t),t.has("query")||t.has("indexYear")){if(this.loading=!0,this.indexYear){const t=`https://mlbib.library.virginia.edu/json/${this.indexYear}.json`;s(this,h,new n({query:this.query,indexes:[t]}),"f")}else s(this,h,new n({query:this.query}),"f");i(this,h,"f").fetchData().then((t=>{this.items=t.items,this.meta=t.meta,this.loading=!1}))}}highlight(t){const{query:e}=this,s=e.split(" "),i={snippet:"",match:""};for(let e=0;e<s.length;e++){const r=new RegExp(`\\b${s[e]}\\b`,"i"),n=t.search(r);if(-1!==n){const r=Math.max(n-30,0),a=Math.min(n+30,t.length-1);i.snippet=t.substring(r,a),i.match=s[e];break}}return""===i.snippet&&(i.snippet=t.substring(0,60)),i.snippet}render(){return r`
        <div class="bs-results--header">
        </div>

        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

              ${this.items.map((t=>r`
                <li class="bs-results--list--entry">
                  <a href="${t.link?t.link:""}" class="bento-section-title">${t.title}</a>
                  ${t.description?r`
                    <div class="bento-section-desc">
                      ${t.year&&!String(t.id).startsWith("anchor")?r`
                        <mlb-section embedded .query="${this.query}" indexYear="${t.year}"></mlb-section>
                      `:this.highlight(t.description)}
                    </div>
                  `:""}
                </li>
              `))}

            </ol>
        </div>
    `}}h=new WeakMap,t([e({type:Array})],o.prototype,"items",void 0),t([e({type:Number})],o.prototype,"indexYear",void 0),window.customElements.define("mlb-section",o);
