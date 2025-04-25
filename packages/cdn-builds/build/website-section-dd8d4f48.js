import{x as t}from"./property-88ac5898.js";import"./document-77724c06.js";import"./ArticlesData-4e187389.js";import{L as e,W as s}from"./LibrariesData-31437421.js";import{W as i,b as a}from"./WebsiteData-8a534ce8.js";import{B as r,r as l}from"./BentoSection-7cbd507d.js";import{r as n}from"./LibrariesSection-c9c596cd.js";import"./GeneralSearchResult-331b56d5.js";import"./unsafe-html-882321a0.js";import"./SiteStyle-4bb8cd6a.js";import"./AccessibleStyles-1e7f8a0a.js";new WeakMap;window.customElements.define("website-section",class extends r{constructor(){super(),this.meta={totalResults:0},this.title="Website",this.websearch=new i}updated(t){super.updated(t),t.has("query")&&(this.loading=!0,this.websearch.query=this.query,this.websearch.fetchData({limit:this.limit}).then((t=>{this.items=t.items,this.meta=t.meta,this.loading=!1})))}renderBriefItem(s){return s instanceof e?n(s):s instanceof a?function(e){return t`  
      <div class="bento-section-title"><a href="${e.link}">${e.title}</a></div>
      <div class="bento-section-desc">${e.jobTitle}</div>
    `}(s):l(s)}render(){return t`
    <style>
      [hidden] { display: none !important; }
    </style>
        <div class="bs-results--header">
            <h3>${this.title}</h3>
            <div ?hidden="${!this.isEmptySearch}"><a href="${s}" class="uvalib-button">Search Library website</a></div>
            <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method='get' style="display:inline">
              ${this.meta.url&&this.meta.url.indexOf("?")>0?[...new URLSearchParams(this.meta.url.replace(/^.*\?/,""))].map((e=>t`
                      <input type="hidden" name="${e[0]}" value="${e[1]}" />
                    `)):""}
              <button type="submit" class="uvalib-button">See all <span class="bs-results--qty">${this.meta.totalResults}</span> results</button>            
            </form>            
        </div>
        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <p ?hidden="${this.isEmptySearch}">Results from the main Library website.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

              ${this.items.map((e=>t`
                <li>${this.renderBriefItem(e)}</li>
              `))}

            </ol>
        </div>   
    `}});
