import{_ as s,e as t,B as i,a as e,C as a,b as l,y as r}from"./a80d7389.js";var h;class o extends i{constructor(){super(),h.set(this,void 0),this.items=[],this.meta={totalResults:0},this.title="Virgo Catalog",e(this,h,new a({query:""}),"f"),this.limit=5}updated(s){super.updated(s),(s.has("query")||s.has("limit"))&&(this.loading=!0,l(this,h,"f").query=this.query,l(this,h,"f").fetchData({limit:this.limit}).then((s=>{this.items=s.items,this.meta=s.meta,this.loading=!1})))}render(){var s,t;return r` <div class="bs-results--header"> <h3>${this.title}</h3> <div ?hidden="${!this.isEmptySearch}"><a href="${null===(t=null===(s=this.meta)||void 0===s?void 0:s.url)||void 0===t?void 0:t.replace(/(.*)\?.*/,"$1")}" class="uvalib-button">Search Virgo</a></div> <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method="get" style="display:inline"> ${this.meta.url&&this.meta.url.indexOf("?")>0?[...new URLSearchParams(this.meta.url.replace(/^.*\?/,""))].map((s=>r` <input type="hidden" name="${s[0]}" value="${s[1]}"> `)):""} <button type="submit" class="uvalib-button">See all <span class="bs-results--qty">${this.meta.totalResults}</span> results</button> </form> </div> <div class="bs-results--body"> <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p> <p ?hidden="${this.isEmptySearch}">Books, journals, manuscripts &amp; archival material, maps, music and sound recordings, theses and dissertations, and videos.</p> <ol ?hidden="${this.isEmptySearch}" class="bs-results--list"> ${this.items.map((s=>r` <li class="bs-results--list--entry"><a href="${s.link?s.link:""}" class="bs-results--title">${s.title}</a> <ul class="ul-0"> ${s.author?r`<li class="bs-results--author li-1">${s.author.join(", ")}</li>`:""} <ul class="ul-1"> ${s.datePublished?r`<li class="bs-results--date li-1">${s.datePublished.toLocaleDateString("en-US")}</li>`:""} ${s.format&&s.format.length>0?r`<li class="bs-results--format li-1" aria-label="${s.format.join("/")}">${s.format.join("/")}</li>`:""} </ul> </ul> </li> `))} </ol> </div> `}}h=new WeakMap,s([t({type:Array})],o.prototype,"items",void 0),window.customElements.define("catalog-section",o);