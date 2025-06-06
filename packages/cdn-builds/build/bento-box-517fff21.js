import{i as e,_ as s,x as t,n as i}from"./property-88ac5898.js";import{e as r}from"./query-92f449e5.js";import{S as o}from"./SiteStyle-4bb8cd6a.js";import"./AccessibleStyles-1e7f8a0a.js";var l=e`
    :host {
        display: block;
        padding: 25px;
        color: var(--uva-text-color-base, #000);
      }
`;class n extends o{constructor(){super(...arguments),this.query="",this.describe="",this.sourceTitle="UVA Library",this.placeholder="Search everything..."}static get styles(){return[...super.styles,l]}render(){return t`

<form action="https://search.lib.virginia.edu/search" id="searchForm" method="get" @submit="${this.search}">
<span class="icon-search"></span>
	<input name="q" id="search" type="text" aria-label="${this.placeholder}" placeholder="${this.placeholder}" .value="${this.query}" />
	<button type="submit" class="uvalib-button-home-search" aria-label="Search" @submit="${this.search}"></button>
</form>
<p>${this.describe}</p>

    `}search(e){e.preventDefault(),this.query=this.inputEl.value,this.dispatchEvent(new Event("search",{bubbles:!0,composed:!0}))}}s([r("input#search")],n.prototype,"inputEl",void 0),s([i({type:String})],n.prototype,"query",void 0),s([i({type:String})],n.prototype,"describe",void 0),s([i({type:String,attribute:"source-title"})],n.prototype,"sourceTitle",void 0),s([i({type:String})],n.prototype,"placeholder",void 0),window.customElements.define("bento-search",n);var a=e`
    :host {
        display: block;
        padding: 25px;
        color: var(--uva-text-color-base, #000);
    }
`;class c extends o{static get styles(){return[...super.styles,a]}constructor(){super(),this.query="",this.limit=5,this.searchDescribe="This page searches Virgo, Virgo articles, subject guides, and the Library website.",this.noResultDescribe="No results found.",this.placeholder="Search anything...",this.boxes=["catalog","articles","libguides","website"],window.onpopstate=e=>{this.query=e.state&&e.state.query?e.state.query:""}}firstUpdated(e){super.firstUpdated(e);const s=new URLSearchParams(window.location.search);s.has("query")&&(this.query=s.get("query"))}render(){return t`
  <style>
    [hidden] { display: none !important; }
  </style>

  <bento-search .describe="${this.searchDescribe}" class="bento-search-bar" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" id="searchBox" .query="${this.query}" @search="${this.search}" .placeholder="${this.placeholder}"></bento-search>

  <div class="bs-header" ?hidden="${!this.query}">
    <h2>You searched for <span class="bs-search-term">${this.query}</span></h2>
    <p>Here are the results:</p>
  </div>

  <div class="bs-results-container" ?hidden="${!this.query}">

    ${this.boxes.map((e=>{switch(e){case"client-search":return import("./client-search-section-79051bb5.js"),t`<client-search-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></client-search-section>`;case"mlb":return import("./mlb-section-1e8373b6.js"),t`<mlb-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></mlb-section>`;case"catalog":return import("./catalog-section-3d843931.js"),t`<catalog-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></catalog-section>`;case"articles":return import("./articles-section-febc7247.js"),t`<articles-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></articles-section>`;case"website":return import("./website-section-dd8d4f48.js"),t`<website-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></website-section>`;case"libguides":return import("./libguides-section-2e99acbf.js"),t`<libguides-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></libguides-section>`;case"talk":return import("./bento-section-6785e146.js"),t`<bento-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}" title="Talk to a subject expert"></bento-section>`;case"libraries":return import("./libraries-section-f1b83755.js"),t`<libraries-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></libraries-section>`;case"events":return import("./events-section-a86f84cd.js"),t`<events-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" title="Events" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}">
                          <p slot="see-more" class="event-see-all"><a href="https://cal.lib.virginia.edu/events">See all Library events</a></p>
                        </events-section>`;default:return console.error("Requesting a Bento section that does not exist"),""}}))}  

  </div>


    `}search(e){this.query=e.target.query,history.pushState({query:this.query},"Search for this.query",`?query=${this.query}`)}}s([i({type:String})],c.prototype,"query",void 0),s([i({type:Number})],c.prototype,"limit",void 0),s([i({type:String,attribute:"search-describe"})],c.prototype,"searchDescribe",void 0),s([i({type:String,attribute:"no-result-describe"})],c.prototype,"noResultDescribe",void 0),s([i({type:String})],c.prototype,"placeholder",void 0),s([i({type:Array})],c.prototype,"boxes",void 0),window.customElements.define("bento-box",c);
