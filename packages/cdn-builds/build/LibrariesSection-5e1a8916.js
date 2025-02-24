import{a as t,b as e,x as i}from"./property-4490ebb8.js";import"./document-77724c06.js";import"./ArticlesData-ef19c3aa.js";import{a as s}from"./LibrariesData-d7300118.js";import{B as r}from"./BentoSection-e700f572.js";var a;function o(t){return i`  
      ${t.link?i`
        <div class="bento-section-title"><a href="${t.link}">${t.title}</a></div>
      `:i`
        <div class="bento-section-title"><a href="http://library.virginia.edu/hours#${t.slug}">${t.title}</a></div>
      `}
      <div class="bento-section-desc"><!-- put todays hours here --></div>
    `}class n extends r{constructor(){super(),a.set(this,void 0),this.title="Libraries",t(this,a,new s,"f")}updated(t){super.updated(t),t.has("query")&&(this.loading=!0,e(this,a,"f").query=this.query,e(this,a,"f").fetchData().then((()=>{this.items=e(this,a,"f").items,this.loading=!1})))}renderBriefItem(t){return o(t)}}a=new WeakMap;export{n as L,o as r};
