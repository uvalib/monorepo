import{_ as t,n as s,a as e,b as i}from"./property-fe2d5cc5.js";import"./document-77724c06.js";import{A as l}from"./ArticlesData-c115d7bf.js";import{x as a}from"./lit-element-ab109411.js";import{B as r}from"./BentoSection-69928e80.js";import"./unsafe-html-e63196f7.js";import"./SiteStyle-8d6e2da7.js";var n;class o extends r{constructor(){super(),n.set(this,void 0),this.items=[],this.meta={totalResults:0},this.title="Article",e(this,n,new l({query:""}),"f")}updated(t){super.updated(t),t.has("query")&&(this.loading=!0,i(this,n,"f").query=this.query,i(this,n,"f").fetchData({limit:this.limit}).then((t=>{this.items=t.items,this.meta=t.meta,this.loading=!1})))}renderHiddenInput(t,s){return a`<input type="hidden" name="${t}" value="${s}" />`}renderAuthor(t){return a`<li class="bs-results--author li-1">${t.join("; ")}</li>`}renderPublicationDetails(t){return a`
      ${t.datePublished?a`<li class="bs-results--date li-1">${t.datePublished.toLocaleDateString("en-US")}</li>`:""}
      ${t.publicationType&&t.publicationType.length>0?a`<li class="bs-results--format li-1" aria-label="${t.publicationType.join("/")}">${t.publicationType.join("/")}</li>`:""}
    `}render(){var t,s;return a`
      <div class="bs-results--header">
        <h3>${this.title}</h3>
        <div ?hidden="${!this.isEmptySearch}"><a href="${null===(s=null===(t=this.meta)||void 0===t?void 0:t.url)||void 0===s?void 0:s.replace(/(.*)\?.*/,"$1")}" class="uvalib-button">Search articles</a></div>
        <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method='get' style="display:inline">
          ${this.meta.url&&this.meta.url.indexOf("?")>0?[...new URLSearchParams(this.meta.url.replace(/^.*\?/,""))].map((([t,s])=>this.renderHiddenInput(t,s))):""}
          <button type="submit" class="uvalib-button">See all <span class="bs-results--qty">${this.meta.totalResults}</span> results</button>
        </form>
      </div>

      <div class="bs-results--body">
        <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
        <p ?hidden="${this.isEmptySearch}">An aggregation of tens of millions of articles made available through Library subscriptions.</p>
        <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">
          ${this.items.map((t=>a`
            <li class="bs-results--list--entry">
              <a href="${t.link?t.link:""}" class="bs-results--title">${t.title}</a>
              <ul class="ul-0">
                ${t.author?this.renderAuthor(t.author):""}
                <ul class="ul-1">
                  ${this.renderPublicationDetails(t)}
                </ul>
              </ul>
            </li>
          `))}
        </ol>
      </div>
    `}}n=new WeakMap,t([s({type:Array})],o.prototype,"items",void 0),window.customElements.define("articles-section",o);
