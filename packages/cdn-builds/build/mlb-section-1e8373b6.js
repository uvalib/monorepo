import{_ as e,n as t,a as s,b as i,x as r}from"./property-88ac5898.js";import{o as n}from"./unsafe-html-882321a0.js";import{M as a}from"./MLBData-584bb28f.js";import"./ArticlesData-4e187389.js";import{B as l}from"./BentoSection-7cbd507d.js";import"./document-77724c06.js";import"./GeneralSearchResult-331b56d5.js";import"./SiteStyle-4bb8cd6a.js";import"./AccessibleStyles-1e7f8a0a.js";var d;class o extends l{constructor(){super(),d.set(this,void 0),this.items=[],this.embedded=!1,this.meta={totalResults:0},this.title="Modern Library Bibliography",s(this,d,new a({query:""}),"f"),this.limit=5}updated(e){if(super.updated(e),e.has("query")||e.has("indexYear")){if(this.loading=!0,this.indexYear){const e=`https://mlbib.library.virginia.edu/json/${this.indexYear}.json`;s(this,d,new a({query:this.query,indexes:[e]}),"f")}else s(this,d,new a({query:this.query}),"f");i(this,d,"f").fetchData().then((e=>{this.items=e.items,this.meta=e.meta,this.loading=!1}))}}highlight(e,t){const{query:s}=this,i=s.split(" ");let r="",n=-1;for(let t=0;t<i.length&&-1===n;t++){const s=new RegExp(`\\b${i[t]}\\b`,"i");n=e.search(s)}if(-1!==n){let s=Math.max(n-t,0),a=Math.min(n+i[0].length+t,e.length);" "!==e[s]&&-1!==e.lastIndexOf(" ",s)&&(s=e.lastIndexOf(" ",s))," "!==e[a]&&-1!==e.indexOf(" ",a)&&(a=e.indexOf(" ",a)),r=e.substring(s,a)}else r=e.substring(0,2*t);for(let e of i){const t=new RegExp(`(${e})`,"gi");r=r.replace(t,"<mark>$1</mark>")}return r}renderItems(){return this.items.map((e=>r`
      <li class="bs-results--list--entry">
        <a href="${e.link?e.link:""}" class="bento-section-title">${e.title}</a>
        ${e.description?r`
          <div class="bento-section-desc">
            ${e.year&&!String(e.id).startsWith("anchor")?r`
              <mlb-section embedded .query="${this.query}" indexYear="${e.year}"></mlb-section>
            `:r`${n(this.highlight(e.description,60))}`}  <!-- Adjust the limit as needed -->
          </div>
        `:""}
      </li>
    `))}render(){return r`
      <div class="bs-results--header">
      </div>

      <div class="bs-results--body">
          ${this.loading?r`<site-spinner></site-spinner>`:r`
            <p id="no-results" ?hidden="${!this.isEmptySearch||this.loading}">${this.noResultDescribe}</p>
          `}

          ${this.embedded?r`
            <ul ?hidden="${this.isEmptySearch}" class="bs-results--list">
              ${this.renderItems()}
            </ul>
          `:r`
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">
              ${this.renderItems()}
            </ol>
          `}
      </div>
    `}}d=new WeakMap,e([t({type:Array})],o.prototype,"items",void 0),e([t({type:Number})],o.prototype,"indexYear",void 0),e([t({type:Boolean})],o.prototype,"embedded",void 0),window.customElements.define("mlb-section",o);
