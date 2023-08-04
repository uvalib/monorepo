import{_ as e,e as t}from"./query-assigned-elements-ba719eec.js";import{i as s,x as i}from"./lit-element-b1a1c7e4.js";import{S as r}from"./SiteStyle-00ee8f65.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var o=s`
    :host {
        display: block;
        padding: 25px;
        color: var(--uva-text-color-base, #000);
      }
`;class n extends r{constructor(){super(...arguments),this.query="",this.describe="",this.sourceTitle="UVA Library",this.placeholder="Search everything..."}static get styles(){return[...super.styles,o]}render(){return i`

<form action="https://search.lib.virginia.edu/search" id="searchForm" method="get" @submit="${this.search}">
<span class="icon-search"></span>
	<input name="q" id="search" type="text" aria-label="${this.placeholder}" placeholder="${this.placeholder}" .value="${this.query}" />
	<button type="submit" class="uvalib-button-home-search" aria-label="Search" @submit="${this.search}"></button>
</form>
<p>${this.describe}</p>

    `}search(e){e.preventDefault(),this.query=this.inputEl.value,this.dispatchEvent(new Event("search",{bubbles:!0,composed:!0}))}}e([
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function(e,t){return(({finisher:e,descriptor:t})=>(s,i)=>{var r;if(void 0===i){const i=null!==(r=s.originalKey)&&void 0!==r?r:s.key,o=null!=t?{kind:"method",placement:"prototype",key:i,descriptor:t(s.key)}:{...s,key:i};return null!=e&&(o.finisher=function(t){e(t,i)}),o}{const r=s.constructor;void 0!==t&&Object.defineProperty(s,i,t(i)),null==e||e(r,i)}})({descriptor:s=>{const i={get(){var t,s;return null!==(s=null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(e))&&void 0!==s?s:null},enumerable:!0,configurable:!0};if(t){const t="symbol"==typeof s?Symbol():"__"+s;i.get=function(){var s,i;return void 0===this[t]&&(this[t]=null!==(i=null===(s=this.renderRoot)||void 0===s?void 0:s.querySelector(e))&&void 0!==i?i:null),this[t]}}return i}})}("input#search")],n.prototype,"inputEl",void 0),e([t({type:String})],n.prototype,"query",void 0),e([t({type:String})],n.prototype,"describe",void 0),e([t({type:String,attribute:"source-title"})],n.prototype,"sourceTitle",void 0),e([t({type:String})],n.prototype,"placeholder",void 0),window.customElements.define("bento-search",n);var l=s`
    :host {
        display: block;
        padding: 25px;
        color: var(--uva-text-color-base, #000);
    }
`;class a extends r{static get styles(){return[...super.styles,l]}constructor(){super(),this.query="",this.limit=5,this.searchDescribe="This page searches Virgo, Virgo articles, subject guides, and the Library website.",this.noResultDescribe="No results found.",this.placeholder="Search anything...",this.boxes=["catalog","articles","libguides","website"],window.onpopstate=e=>{this.query=e.state&&e.state.query?e.state.query:""}}firstUpdated(){super.firstUpdated();const e=new URLSearchParams(window.location.search);e.has("query")&&(this.query=e.get("query"))}render(){return i`
  <style>
    [hidden] { display: none !important; }
  </style>

  <bento-search .describe="${this.searchDescribe}" class="bento-search-bar" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" id="searchBox" .query="${this.query}" @search="${this.search}" .placeholder="${this.placeholder}"></bento-search>

  <div class="bs-header" ?hidden="${!this.query}">
    <h2>You searched for <span class="bs-search-term">${this.query}</span></h2>
    <p>Here are the results:</p>
  </div>

  <div class="bs-results-container" ?hidden="${!this.query}">

    ${this.boxes.map((e=>{switch(e){case"mlb":return import("./mlb-section-57a96f22.js"),i`<mlb-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></mlb-section>`;case"catalog":return import("./catalog-section-ededa387.js"),i`<catalog-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></catalog-section>`;case"articles":return import("./articles-section-82a87ff5.js"),i`<articles-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></articles-section>`;case"website":return import("./website-section-2bbb6181.js"),i`<website-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></website-section>`;case"libguides":return import("./libguides-section-073ef8e2.js"),i`<libguides-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></libguides-section>`;case"talk":return import("./bento-section-69c555de.js"),i`<bento-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}" title="Talk to a subject expert"></bento-section>`;case"libraries":return import("./libraries-section-46a51e65.js"),i`<libraries-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></libraries-section>`;case"events":return import("./events-section-39980a06.js"),i`<events-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" title="Events" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}">
                          <p slot="see-more" class="event-see-all"><a href="https://cal.lib.virginia.edu/events">See all Library events</a></p>
                        </events-section>`;default:return console.error("Requesting a Bento section that does not exist"),""}}))}  

  </div>


    `}search(e){this.query=e.target.query,history.pushState({query:this.query},"Search for this.query",`?query=${this.query}`)}}e([t({type:String})],a.prototype,"query",void 0),e([t({type:Number})],a.prototype,"limit",void 0),e([t({type:String,attribute:"search-describe"})],a.prototype,"searchDescribe",void 0),e([t({type:String,attribute:"no-result-describe"})],a.prototype,"noResultDescribe",void 0),e([t({type:String})],a.prototype,"placeholder",void 0),e([t({type:Array})],a.prototype,"boxes",void 0),window.customElements.define("bento-box",a);
