import{_ as e,a as t,b as a,n as r}from"./query-assigned-elements-f7cc377b.js";import{i as o,s as i,D as l,x as n}from"./lit-element-9e1ac43c.js";const s=o`
:host {
  --uva-brand-blue-lightest: #87B9D9;;
--uva-brand-blue-lighter: #3395D4;;
--uva-brand-blue-light: #0370B7;;
--uva-brand-blue-base: #232D4B;;
--uva-brand-blue: #232D4B;;
--uva-brand-orange-lightest: #FFEAD6;;
--uva-brand-orange-lighter: #FFC999;;
--uva-brand-orange-light: #FFB370;;
--uva-brand-orange-base: #E57200;;
--uva-brand-orange-dark: #B35900;;
--uva-brand-orange-darker: #854200;;
--uva-brand-orange: #E57200;;
--uva-blue-alt-lightest: #BFE7F7;;
--uva-blue-alt-lighter: #91D8F2;;
--uva-blue-alt-light: #55C4EC;;
--uva-blue-alt-base: #007BAC;;
--uva-blue-alt-dark: #005679;;
--uva-blue-alt-darkest: #141E3C;;
--uva-blue-alt: #007BAC;;
--uva-teal-lightest: #C8F2F4;;
--uva-teal-light: #5BD7DE;;
--uva-teal-base: #25CAD3;;
--uva-teal-dark: #1DA1A8;;
--uva-teal-darker: #16777C;;
--uva-teal: #25CAD3;;
--uva-green-lightest: #DDEFDC;;
--uva-green-lighter: #89CC74;;
--uva-green-base: #62BB46;;
--uva-green-dark: #4E9737;;
--uva-green: #62BB46;;
--uva-red-lightest: #FBCFDA;;
--uva-red-base: #EF3F6B;;
--uva-red-dark: #DF1E43;;
--uva-red-darker: #B30000;;
--uva-red: #EF3F6B;;
--uva-yellow-lightest: #FEF6C8;;
--uva-yellow-base: #ECC602;;
--uva-yellow-dark: #B99C02;;
--uva-yellow: #ECC602;;
--uva-grey-lightest: #F1F1F1;;
--uva-grey-light: #DADADA;;
--uva-grey-base: #808080;;
--uva-grey-dark: #4F4F4F;;
--uva-grey-darkest: #2B2B2B;;
--uva-grey: #808080;;

  /* UVA White */
  --uva-white: #fff;
}
`,d=o`
:host {
  --box-shadow:  0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  --box-shadow-light: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.12);
  --box-shadow-mid:  0 2px 4px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.12);
}
`,h=o`
.w3-col, .w3-half, .w3-third, .w3-twothird, .w3-threequarter, .w3-quarter {
    float: left;
    width: 100%;
}
.w3-container:after, .w3-container:before, .w3-panel:after, .w3-panel:before, .w3-row:after, .w3-row:before, .w3-row-padding:after, .w3-row-padding:before, .w3-cell-row:before, .w3-cell-row:after, .w3-clear:after, .w3-clear:before, .w3-bar:before, .w3-bar:after {
    content: "";
    display: table;
    clear: both;
}
.w3-container, .w3-panel {
    padding: 0.01em 16px;
}
.w3-width-1360 {
    max-width: 1360px !important;
}
`,u=o`
* {
    font-family: franklin-gothic-urw, Arial, Helvetica, sans-serif !important;
}
*, *::before, *::after {
    box-sizing: border-box;
}
html, body, button, input, select, optgroup, textarea {
    color: #2B2B2B;
}
html, body {
    font-size: 17px !important;
}
body {
    min-height: 100vh;
    text-rendering: optimizeSpeed;
    line-height: 1.5;
}
input, button, textarea, select {
    font: inherit;
}

.hidden {
  display: none;
}

.visually-hidden {
  position: absolute !important;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  width: 1px;
  height: 1px;
  word-wrap: normal;
}

.visually-hidden.focusable:active,
.visually-hidden.focusable:focus {
  position: static !important;
  overflow: visible;
  clip: auto;
  width: auto;
  height: auto;
}

.invisible {
  visibility: hidden;
}
`;var p;class b extends i{constructor(){super(...arguments),this.noShadowDom=!1,this.noStyle=!1,this.imports={},this.importedStyles="",this.rootLinkDomain="https://www.library.virginia.edu",this.headingLevelStart=2,p.set(this,null)}resizeReactive(){import("./resize_controller-08b62fc4.js").then((({ResizeController:e})=>{this._resizeController=new e(this,{})}))}static get styles(){return[s,d,h,u]}firstUpdated(e){this.imports&&!this.noStyle&&Object.keys(this.imports).forEach((e=>{if(this.imports[e]){const t=this.imports[e];import(t).then((t=>{this.importedStyles+=t.default.toString().replace(/:host/,e.toLowerCase())}))}}))}connectedCallback(){super.connectedCallback(),this.noShadowDom&&!this.noStyle&&(t(this,p,document.createElement("style"),"f"),this.appendChild(a(this,p,"f")),l(n`${Object.getPrototypeOf(this).constructor.styles.map((e=>e.toString().replace(/:host/m,this.tagName.toLowerCase())))}`,a(this,p,"f")))}createRenderRoot(){return this.noShadowDom?this:super.createRenderRoot()}render(){return n`
      ${this.noShadowDom?"":n`<slot></slot>`}
    `}}p=new WeakMap,e([r({type:Boolean,attribute:"no-shadow-dom"})],b.prototype,"noShadowDom",void 0),e([r({type:Boolean,attribute:"no-style"})],b.prototype,"noStyle",void 0),e([r({type:Object})],b.prototype,"imports",void 0),e([r({type:String})],b.prototype,"importedStyles",void 0),e([r({type:String})],b.prototype,"rootLinkDomain",void 0),e([r({type:Number})],b.prototype,"headingLevelStart",void 0);export{b as S};
