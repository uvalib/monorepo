import{_ as s,e as t,a as i,b as e,x as a}from"./query-assigned-elements-23ba9e4f.js";import{C as l}from"./ArticlesData-c1e511c9.js";import{B as r}from"./BentoSection-3ae60287.js";import"./unsafe-html-b3407b2c.js";import"./SiteStyle-86c89e81.js";var o;class u extends r{constructor(){super(),o.set(this,void 0),this.items=[],this.meta={totalResults:0},this.title="Virgo Catalog",i(this,o,new l({query:""}),"f"),this.limit=5}updated(s){super.updated(s),(s.has("query")||s.has("limit"))&&(this.loading=!0,e(this,o,"f").query=this.query,e(this,o,"f").fetchData({limit:this.limit}).then((s=>{this.items=s.items,this.meta=s.meta,this.loading=!1})))}render(){var s,t,i;return a`
        <div class="bs-results--header">
            <h3>${this.title}</h3>
            <div ?hidden="${!this.isEmptySearch}"><a href="${null===(t=null===(s=this.meta)||void 0===s?void 0:s.url)||void 0===t?void 0:t.replace(/(.*)\?.*/,"$1")}" class="uvalib-button">Search Virgo</a></div>
            <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method='get' style="display:inline">
              ${this.meta.url&&this.meta.url.indexOf("?")>0?[...new URLSearchParams(this.meta.url.replace(/^.*\?/,""))].map((s=>a`
                          <input type="hidden" name="${s[0]}" value="${s[1]}" />
                        `)):""}
              <button type="submit" class="uvalib-button">See all <span class="bs-results--qty">${null!==(i=this.meta.totalResults)&&void 0!==i?i:0}</span> results</button>
            </form>
        </div>
  
        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <p ?hidden="${this.isEmptySearch}">Books, journals, manuscripts &amp; archival material, maps, music and sound recordings, theses and dissertations, and videos.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">
  
            ${this.items.map((s=>{var t;return a`
              <li class="bs-results--list--entry"><a href="${null!==(t=s.link)&&void 0!==t?t:""}" class="bs-results--title">${s.title}</a>
                <ul class="ul-0">
                  ${s.author?a`<li class="bs-results--author li-1">${s.author.join("; ")}</li>`:""}
                    <ul class="ul-1">
                      ${s.datePublished?a`<li class="bs-results--date li-1">${s.datePublished.toLocaleDateString("en-US")}</li>`:""}
                      ${s.format&&s.format.length>0?a`<li class="bs-results--format li-1" aria-label="${s.format.join("/")}">${s.format.join("/")}</li>`:""}
                    </ul>
                </ul>
              </li>
            `}))}
  
            </ol>
        </div>
    `}}o=new WeakMap,s([t({type:Array})],u.prototype,"items",void 0),window.customElements.define("catalog-section",u);
