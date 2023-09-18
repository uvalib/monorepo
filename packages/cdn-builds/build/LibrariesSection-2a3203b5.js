import{a as t,b as e}from"./query-assigned-elements-f7cc377b.js";import{x as s}from"./lit-element-9e1ac43c.js";import"./ArticlesData-e6785a6b.js";import{a as i}from"./LibrariesData-3da1b00d.js";import{B as r}from"./BentoSection-db7960ed.js";var a;function o(t){return s`  
      ${t.link?s`
        <div class="bento-section-title"><a href="${t.link}">${t.title}</a></div>
      `:s`
        <div class="bento-section-title"><a href="http://library.virginia.edu/hours#${t.slug}">${t.title}</a></div>
      `}
      <div class="bento-section-desc"><!-- put todays hours here --></div>
    `}class n extends r{constructor(){super(),a.set(this,void 0),this.title="Libraries",t(this,a,new i,"f")}updated(t){super.updated(t),t.has("query")&&(this.loading=!0,e(this,a,"f").query=this.query,e(this,a,"f").fetchData().then((()=>{this.items=e(this,a,"f").items,this.loading=!1})))}renderBriefItem(t){return o(t)}}a=new WeakMap;export{n as L,o as r};
