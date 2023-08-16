import{x as e}from"./lit-element-b1a1c7e4.js";import"./ArticlesData-e9b81d53.js";import{L as t,W as s}from"./LibrariesData-e69ab511.js";import{W as i,a}from"./WebsiteData-de73d146.js";import{B as r,r as n}from"./BentoSection-4595ae76.js";import{r as l}from"./LibrariesSection-dc6ef4e6.js";import"./query-assigned-elements-ba719eec.js";import"./GeneralSearchResult-331b56d5.js";import"./unsafe-html-d2a53643.js";import"./SiteStyle-00ee8f65.js";new WeakMap;window.customElements.define("website-section",class extends r{constructor(){super(),this.meta={totalResults:0},this.title="Website",this.websearch=new i}updated(e){super.updated(e),e.has("query")&&(this.loading=!0,this.websearch.query=this.query,this.websearch.fetchData({limit:this.limit}).then((e=>{this.items=e.items,this.meta=e.meta,this.loading=!1})))}renderBriefItem(s){return s instanceof t?l(s):s instanceof a?function(t){return e`  
      <div class="bento-section-title"><a href="${t.link}">${t.title}</a></div>
      <div class="bento-section-desc">${t.jobTitle}</div>
    `}(s):n(s)}render(){return e`
    <style>
      [hidden] { display: none !important; }
    </style>
        <div class="bs-results--header">
            <h3>${this.title}</h3>
            <div ?hidden="${!this.isEmptySearch}"><a href="${s}" class="uvalib-button">Search Library website</a></div>
            <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method='get' style="display:inline">
              ${this.meta.url&&this.meta.url.indexOf("?")>0?[...new URLSearchParams(this.meta.url.replace(/^.*\?/,""))].map((t=>e`
                      <input type="hidden" name="${t[0]}" value="${t[1]}" />
                    `)):""}
              <button type="submit" class="uvalib-button">See all <span class="bs-results--qty">${this.meta.totalResults}</span> results</button>            
            </form>            
        </div>
        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <p ?hidden="${this.isEmptySearch}">Results from the main Library website.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

              ${this.items.map((t=>e`
                <li>${this.renderBriefItem(t)}</li>
              `))}

            </ol>
        </div>   
    `}});
