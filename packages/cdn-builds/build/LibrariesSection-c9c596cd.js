import{a as t,b as e,x as i}from"./property-88ac5898.js";import"./document-77724c06.js";import"./ArticlesData-4e187389.js";import{a as s}from"./LibrariesData-31437421.js";import{B as r}from"./BentoSection-7cbd507d.js";var a;function o(t){return i`  
      ${t.link?i`
        <div class="bento-section-title"><a href="${t.link}">${t.title}</a></div>
      `:i`
        <div class="bento-section-title"><a href="http://library.virginia.edu/hours#${t.slug}">${t.title}</a></div>
      `}
      <div class="bento-section-desc"><!-- put todays hours here --></div>
    `}class n extends r{constructor(){super(),a.set(this,void 0),this.title="Libraries",t(this,a,new s,"f")}updated(t){super.updated(t),t.has("query")&&(this.loading=!0,e(this,a,"f").query=this.query,e(this,a,"f").fetchData().then((()=>{this.items=e(this,a,"f").items,this.loading=!1})))}renderBriefItem(t){return o(t)}}a=new WeakMap;export{n as L,o as r};
