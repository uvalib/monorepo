import{_ as t,e as s,a as e,b as i,y as l}from"./query-assigned-elements-9f2025bb.js";import{A as a}from"./ArticlesData-fb86ab76.js";import{B as r}from"./BentoSection-1a4a1a7d.js";import"./unsafe-html-deeaec8d.js";import"./SiteStyle-d7ea4a7e.js";var n;class u extends r{constructor(){super(),n.set(this,void 0),this.items=[],this.meta={totalResults:0},this.title="Article",e(this,n,new a({query:""}),"f")}updated(t){super.updated(t),t.has("query")&&(this.loading=!0,i(this,n,"f").query=this.query,i(this,n,"f").fetchData({limit:this.limit}).then((t=>{this.items=t.items,this.meta=t.meta,this.loading=!1})))}renderHiddenInput(t,s){return l`<input type="hidden" name="${t}" value="${s}" />`}renderAuthor(t){return l`<li class="bs-results--author li-1">${t.join("; ")}</li>`}renderPublicationDetails(t){return l`
      ${t.datePublished?l`<li class="bs-results--date li-1">${t.datePublished.toLocaleDateString("en-US")}</li>`:""}
      ${t.publicationType&&t.publicationType.length>0?l`<li class="bs-results--format li-1" aria-label="${t.publicationType.join("/")}">${t.publicationType.join("/")}</li>`:""}
    `}render(){var t,s;return l`
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
          ${this.items.map((t=>l`
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
    `}}n=new WeakMap,t([s({type:Array})],u.prototype,"items",void 0),window.customElements.define("articles-section",u);
