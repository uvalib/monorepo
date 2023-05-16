import{a as t,b as e,y as s}from"./query-assigned-elements-9f2025bb.js";import"./ArticlesData-fb86ab76.js";import{a as i}from"./LibrariesData-5c1972f9.js";import{B as r}from"./BentoSection-1a4a1a7d.js";var a;function n(t){return s`  
      ${t.link?s`
        <div class="bento-section-title"><a href="${t.link}">${t.title}</a></div>
      `:s`
        <div class="bento-section-title"><a href="http://library.virginia.edu/hours#${t.slug}">${t.title}</a></div>
      `}
      <div class="bento-section-desc"><!-- put todays hours here --></div>
    `}class o extends r{constructor(){super(),a.set(this,void 0),this.title="Libraries",t(this,a,new i,"f")}updated(t){super.updated(t),t.has("query")&&(this.loading=!0,e(this,a,"f").query=this.query,e(this,a,"f").fetchData().then((()=>{this.items=e(this,a,"f").items,this.loading=!1})))}renderBriefItem(t){return n(t)}}a=new WeakMap;export{o as L,n as r};
