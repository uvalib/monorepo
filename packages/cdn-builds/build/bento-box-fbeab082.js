import{_ as e,n as s}from"./query-assigned-elements-8ef6cca7.js";import{i as t,x as i}from"./lit-element-9e1ac43c.js";import{i as r}from"./query-4707daa1.js";import{S as o}from"./SiteStyle-35a18246.js";var l=t`
    :host {
        display: block;
        padding: 25px;
        color: var(--uva-text-color-base, #000);
      }
`;class n extends o{constructor(){super(...arguments),this.query="",this.describe="",this.sourceTitle="UVA Library",this.placeholder="Search everything..."}static get styles(){return[...super.styles,l]}render(){return i`

<form action="https://search.lib.virginia.edu/search" id="searchForm" method="get" @submit="${this.search}">
<span class="icon-search"></span>
	<input name="q" id="search" type="text" aria-label="${this.placeholder}" placeholder="${this.placeholder}" .value="${this.query}" />
	<button type="submit" class="uvalib-button-home-search" aria-label="Search" @submit="${this.search}"></button>
</form>
<p>${this.describe}</p>

    `}search(e){e.preventDefault(),this.query=this.inputEl.value,this.dispatchEvent(new Event("search",{bubbles:!0,composed:!0}))}}e([r("input#search")],n.prototype,"inputEl",void 0),e([s({type:String})],n.prototype,"query",void 0),e([s({type:String})],n.prototype,"describe",void 0),e([s({type:String,attribute:"source-title"})],n.prototype,"sourceTitle",void 0),e([s({type:String})],n.prototype,"placeholder",void 0),window.customElements.define("bento-search",n);var a=t`
    :host {
        display: block;
        padding: 25px;
        color: var(--uva-text-color-base, #000);
    }
`;class c extends o{static get styles(){return[...super.styles,a]}constructor(){super(),this.query="",this.limit=5,this.searchDescribe="This page searches Virgo, Virgo articles, subject guides, and the Library website.",this.noResultDescribe="No results found.",this.placeholder="Search anything...",this.boxes=["catalog","articles","libguides","website"],window.onpopstate=e=>{this.query=e.state&&e.state.query?e.state.query:""}}firstUpdated(e){super.firstUpdated(e);const s=new URLSearchParams(window.location.search);s.has("query")&&(this.query=s.get("query"))}render(){return i`
  <style>
    [hidden] { display: none !important; }
  </style>

  <bento-search .describe="${this.searchDescribe}" class="bento-search-bar" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" id="searchBox" .query="${this.query}" @search="${this.search}" .placeholder="${this.placeholder}"></bento-search>

  <div class="bs-header" ?hidden="${!this.query}">
    <h2>You searched for <span class="bs-search-term">${this.query}</span></h2>
    <p>Here are the results:</p>
  </div>

  <div class="bs-results-container" ?hidden="${!this.query}">

    ${this.boxes.map((e=>{switch(e){case"client-search":return import("./client-search-section-2ec7af16.js"),i`<client-search-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></client-search-section>`;case"mlb":return import("./mlb-section-9dde530d.js"),i`<mlb-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></mlb-section>`;case"catalog":return import("./catalog-section-0d076dff.js"),i`<catalog-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></catalog-section>`;case"articles":return import("./articles-section-699c9a02.js"),i`<articles-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></articles-section>`;case"website":return import("./website-section-104726f7.js"),i`<website-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></website-section>`;case"libguides":return import("./libguides-section-dfc9aecd.js"),i`<libguides-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></libguides-section>`;case"talk":return import("./bento-section-24ef4a5e.js"),i`<bento-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}" title="Talk to a subject expert"></bento-section>`;case"libraries":return import("./libraries-section-cf3a62dc.js"),i`<libraries-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></libraries-section>`;case"events":return import("./events-section-e58531f4.js"),i`<events-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" title="Events" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}">
                          <p slot="see-more" class="event-see-all"><a href="https://cal.lib.virginia.edu/events">See all Library events</a></p>
                        </events-section>`;default:return console.error("Requesting a Bento section that does not exist"),""}}))}  

  </div>


    `}search(e){this.query=e.target.query,history.pushState({query:this.query},"Search for this.query",`?query=${this.query}`)}}e([s({type:String})],c.prototype,"query",void 0),e([s({type:Number})],c.prototype,"limit",void 0),e([s({type:String,attribute:"search-describe"})],c.prototype,"searchDescribe",void 0),e([s({type:String,attribute:"no-result-describe"})],c.prototype,"noResultDescribe",void 0),e([s({type:String})],c.prototype,"placeholder",void 0),e([s({type:Array})],c.prototype,"boxes",void 0),window.customElements.define("bento-box",c);
