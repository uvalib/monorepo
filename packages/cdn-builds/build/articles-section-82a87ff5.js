import{_ as t,e,a as s,b as i}from"./query-assigned-elements-ba719eec.js";import{A as l}from"./ArticlesData-e9b81d53.js";import{x as a}from"./lit-element-b1a1c7e4.js";import{B as r}from"./BentoSection-4595ae76.js";import"./unsafe-html-d2a53643.js";import"./SiteStyle-00ee8f65.js";var n;class u extends r{constructor(){super(),n.set(this,void 0),this.items=[],this.meta={totalResults:0},this.title="Article",s(this,n,new l({query:""}),"f")}updated(t){super.updated(t),t.has("query")&&(this.loading=!0,i(this,n,"f").query=this.query,i(this,n,"f").fetchData({limit:this.limit}).then((t=>{this.items=t.items,this.meta=t.meta,this.loading=!1})))}renderHiddenInput(t,e){return a`<input type="hidden" name="${t}" value="${e}" />`}renderAuthor(t){return a`<li class="bs-results--author li-1">${t.join("; ")}</li>`}renderPublicationDetails(t){return a`
      ${t.datePublished?a`<li class="bs-results--date li-1">${t.datePublished.toLocaleDateString("en-US")}</li>`:""}
      ${t.publicationType&&t.publicationType.length>0?a`<li class="bs-results--format li-1" aria-label="${t.publicationType.join("/")}">${t.publicationType.join("/")}</li>`:""}
    `}render(){var t,e;return a`
      <div class="bs-results--header">
        <h3>${this.title}</h3>
        <div ?hidden="${!this.isEmptySearch}"><a href="${null===(e=null===(t=this.meta)||void 0===t?void 0:t.url)||void 0===e?void 0:e.replace(/(.*)\?.*/,"$1")}" class="uvalib-button">Search articles</a></div>
        <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method='get' style="display:inline">
          ${this.meta.url&&this.meta.url.indexOf("?")>0?[...new URLSearchParams(this.meta.url.replace(/^.*\?/,""))].map((([t,e])=>this.renderHiddenInput(t,e))):""}
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
    `}}n=new WeakMap,t([e({type:Array})],u.prototype,"items",void 0),window.customElements.define("articles-section",u);