import{a as t,b as s}from"./query-assigned-elements-8ef6cca7.js";import{x as e}from"./lit-element-9e1ac43c.js";import{o as i}from"./unsafe-html-9171da0a.js";import"./document-77724c06.js";import"./ArticlesData-75bbe436.js";import{L as a}from"./LibGuidesData-b71a36e0.js";import{B as l}from"./BentoSection-42015d06.js";import"./SiteStyle-35a18246.js";var r;r=new WeakMap,window.customElements.define("libguides-section",class extends l{constructor(){super(),r.set(this,void 0),this.meta={totalResults:0},this.title="Subject Guides",t(this,r,new a({query:""}),"f")}updated(t){super.updated(t),t.has("query")&&(this.loading=!0,s(this,r,"f").query=this.query,s(this,r,"f").fetchData({limit:this.limit}).then((t=>{this.items=t.items,this.meta=t.meta,this.loading=!1})))}render(){var t,s;return e`
        <div class="bs-results--header">
            <h3>${this.title}</h3>
            <div ?hidden="${!this.isEmptySearch}"><a href="${null===(s=null===(t=this.meta)||void 0===t?void 0:t.url)||void 0===s?void 0:s.replace(/(.*)\?.*/,"$1")}" class="uvalib-button">Search Guides</a></div>
            <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method='get' style="display:inline">
              ${this.meta.url&&this.meta.url.indexOf("?")>0?[...new URLSearchParams(this.meta.url.replace(/^.*\?/,""))].map((t=>e`
                      <input type="hidden" name="${t[0]}" value="${t[1]}" />
                    `)):""}
              <button type="submit" class="uvalib-button">See all results</button>            
            </form>
        </div>

        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <p ?hidden="${this.isEmptySearch}">Subject guides contain topic-specific information to help with research and coursework.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

              ${this.items.map((t=>e`
                <li class="bs-results--list--entry bs-results-title"><span class="bs-results--title">${i(t.title)}</span>
                    <ul class="ul-0">
                        <li class="bs-results--teaser li-1">${i(t.description)}</li>
                    </ul>
                </li>
              `))}
            </ol>
        </div>  
    `}});
