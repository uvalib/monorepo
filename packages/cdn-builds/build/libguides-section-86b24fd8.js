import{a as s,b as t,y as e}from"./query-assigned-elements-9f2025bb.js";import{o as i}from"./unsafe-html-deeaec8d.js";import"./ArticlesData-fb86ab76.js";import{L as a}from"./LibGuidesData-d57d39ac.js";import{B as l}from"./BentoSection-1a4a1a7d.js";import"./SiteStyle-d7ea4a7e.js";var r;r=new WeakMap,window.customElements.define("libguides-section",class extends l{constructor(){super(),r.set(this,void 0),this.meta={totalResults:0},this.title="Subject Guides",s(this,r,new a({query:""}),"f")}updated(s){super.updated(s),s.has("query")&&(this.loading=!0,t(this,r,"f").query=this.query,t(this,r,"f").fetchData({limit:this.limit}).then((s=>{this.items=s.items,this.meta=s.meta,this.loading=!1})))}render(){var s,t;return e`
        <div class="bs-results--header">
            <h3>${this.title}</h3>
            <div ?hidden="${!this.isEmptySearch}"><a href="${null===(t=null===(s=this.meta)||void 0===s?void 0:s.url)||void 0===t?void 0:t.replace(/(.*)\?.*/,"$1")}" class="uvalib-button">Search Guides</a></div>
            <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method='get' style="display:inline">
              ${this.meta.url&&this.meta.url.indexOf("?")>0?[...new URLSearchParams(this.meta.url.replace(/^.*\?/,""))].map((s=>e`
                      <input type="hidden" name="${s[0]}" value="${s[1]}" />
                    `)):""}
              <button type="submit" class="uvalib-button">See all results</button>            
            </form>
        </div>

        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <p ?hidden="${this.isEmptySearch}">Subject guides contain topic-specific information to help with research and coursework.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

              ${this.items.map((s=>e`
                <li class="bs-results--list--entry bs-results-title"><span class="bs-results--title">${i(s.title)}</span>
                    <ul class="ul-0">
                        <li class="bs-results--teaser li-1">${i(s.description)}</li>
                    </ul>
                </li>
              `))}
            </ol>
        </div>  
    `}});
