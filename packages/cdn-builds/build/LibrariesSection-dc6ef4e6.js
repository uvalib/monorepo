import{a as t,b as e}from"./query-assigned-elements-ba719eec.js";import{x as s}from"./lit-element-b1a1c7e4.js";import"./ArticlesData-e9b81d53.js";import{a as i}from"./LibrariesData-e69ab511.js";import{B as r}from"./BentoSection-4595ae76.js";var a;function o(t){return s`  
      ${t.link?s`
        <div class="bento-section-title"><a href="${t.link}">${t.title}</a></div>
      `:s`
        <div class="bento-section-title"><a href="http://library.virginia.edu/hours#${t.slug}">${t.title}</a></div>
      `}
      <div class="bento-section-desc"><!-- put todays hours here --></div>
    `}class n extends r{constructor(){super(),a.set(this,void 0),this.title="Libraries",t(this,a,new i,"f")}updated(t){super.updated(t),t.has("query")&&(this.loading=!0,e(this,a,"f").query=this.query,e(this,a,"f").fetchData().then((()=>{this.items=e(this,a,"f").items,this.loading=!1})))}renderBriefItem(t){return o(t)}}a=new WeakMap;export{n as L,o as r};
