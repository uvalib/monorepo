import{x as e}from"./query-assigned-elements-23ba9e4f.js";import"./ArticlesData-c1e511c9.js";import{L as t,W as s}from"./LibrariesData-77dcc00d.js";import{W as i,a}from"./WebsiteData-73f9055d.js";import{B as r,r as n}from"./BentoSection-3ae60287.js";import{r as l}from"./LibrariesSection-8c44a2a0.js";import"./GeneralSearchResult-331b56d5.js";import"./unsafe-html-b3407b2c.js";import"./SiteStyle-86c89e81.js";new WeakMap;window.customElements.define("website-section",class extends r{constructor(){super(),this.meta={totalResults:0},this.title="Website",this.websearch=new i}updated(e){super.updated(e),e.has("query")&&(this.loading=!0,this.websearch.query=this.query,this.websearch.fetchData({limit:this.limit}).then((e=>{this.items=e.items,this.meta=e.meta,this.loading=!1})))}renderBriefItem(s){return s instanceof t?l(s):s instanceof a?function(t){return e`  
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
