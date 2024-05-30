import{_ as t,n as s,a as i,b as e}from"./property-8648e151.js";import{x as a}from"./lit-element-ab109411.js";import"./document-77724c06.js";import{C as l}from"./ArticlesData-f873435f.js";import{B as r}from"./BentoSection-7c57d088.js";import"./unsafe-html-e63196f7.js";import"./SiteStyle-ee7ab697.js";var o;class h extends r{constructor(){super(),o.set(this,void 0),this.items=[],this.meta={totalResults:0},this.title="Virgo Catalog",i(this,o,new l({query:""}),"f"),this.limit=5}updated(t){super.updated(t),(t.has("query")||t.has("limit"))&&(this.loading=!0,e(this,o,"f").query=this.query,e(this,o,"f").fetchData({limit:this.limit}).then((t=>{this.items=t.items,this.meta=t.meta,this.loading=!1})))}render(){var t,s,i;return a`
        <div class="bs-results--header">
            <h3>${this.title}</h3>
            <div ?hidden="${!this.isEmptySearch}"><a href="${null===(s=null===(t=this.meta)||void 0===t?void 0:t.url)||void 0===s?void 0:s.replace(/(.*)\?.*/,"$1")}" class="uvalib-button">Search Virgo</a></div>
            <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method='get' style="display:inline">
              ${this.meta.url&&this.meta.url.indexOf("?")>0?[...new URLSearchParams(this.meta.url.replace(/^.*\?/,""))].map((t=>a`
                          <input type="hidden" name="${t[0]}" value="${t[1]}" />
                        `)):""}
              <button type="submit" class="uvalib-button">See all <span class="bs-results--qty">${null!==(i=this.meta.totalResults)&&void 0!==i?i:0}</span> results</button>
            </form>
        </div>
  
        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <p ?hidden="${this.isEmptySearch}">Books, journals, manuscripts &amp; archival material, maps, music and sound recordings, theses and dissertations, and videos.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">
  
            ${this.items.map((t=>{var s;return a`
              <li class="bs-results--list--entry"><a href="${null!==(s=t.link)&&void 0!==s?s:""}" class="bs-results--title">${t.title}</a>
                <ul class="ul-0">
                  ${t.author?a`<li class="bs-results--author li-1">${t.author.join("; ")}</li>`:""}
                    <ul class="ul-1">
                      ${t.datePublished?a`<li class="bs-results--date li-1">${t.datePublished.toLocaleDateString("en-US")}</li>`:""}
                      ${t.format&&t.format.length>0?a`<li class="bs-results--format li-1" aria-label="${t.format.join("/")}">${t.format.join("/")}</li>`:""}
                    </ul>
                </ul>
              </li>
            `}))}
  
            </ol>
        </div>
    `}}o=new WeakMap,t([s({type:Array})],h.prototype,"items",void 0),window.customElements.define("catalog-section",h);
