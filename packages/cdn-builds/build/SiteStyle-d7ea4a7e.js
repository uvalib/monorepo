import{i as a,_ as e,s as r,a as t,b as l,Z as u,y as o,e as v}from"./query-assigned-elements-9f2025bb.js";const n=a`
:host {
  /* UVA Brand Blue */
  --uva-brand-blue-lightest: #87B9D9;
  --uva-brand-blue-lighter: #3395D4;
  --uva-brand-blue-light: #0370B7;
  --uva-brand-blue-base: #232D4B;
  --uva-brand-blue-300: var(--uva-brand-blue-lightest);
  --uva-brand-blue-200: var(--uva-brand-blue-lighter);
  --uva-brand-blue-100: var(--uva-brand-blue-light);
  --uva-brand-blue: var(--uva-brand-blue-base);

  /* UVA Brand Orange */
  --uva-brand-orange-lightest: #FFEAD6;
  --uva-brand-orange-lighter: #FFC999;
  --uva-brand-orange-light: #FFB370;
  --uva-brand-orange-base: #E57200;
  --uva-brand-orange-dark: #B35900;
  --uva-brand-orange-darker: #854200;
  --uva-brand-orange-300: var(--uva-brand-orange-lightest);
  --uva-brand-orange-200: var(--uva-brand-orange-lighter);
  --uva-brand-orange-100: var(--uva-brand-orange-light);
  --uva-brand-orange: var(--uva-brand-orange-base);
  --uva-brand-orange-A: var(--uva-brand-orange-dark);
  --uva-brand-orange-B: var(--uva-brand-orange-darker);

  /* UVA Blue Alt */
  --uva-blue-alt-lightest: #BFE7F7;
  --uva-blue-alt-lighter: #91D8F2;
  --uva-blue-alt-light: #55C4EC;
  --uva-blue-alt-base: #007BAC;
  --uva-blue-alt-dark: #005679;
  --uva-blue-alt-darkest: #141E3C;
  --uva-blue-alt-400: #E6F2F7;
  --uva-blue-alt-300: var(--uva-blue-alt-lightest);
  --uva-blue-alt-200: var(--uva-blue-alt-lighter);
  --uva-blue-alt-100: var(--uva-blue-alt-light);
  --uva-blue-alt: var(--uva-blue-alt-base);
  --uva-blue-alt-A: var(--uva-blue-alt-dark);
  --uva-blue-alt-B: var(--uva-blue-alt-darkest);

  /* UVA Teal */
  --uva-teal-lightest: #C8F2F4;
  --uva-teal-light: #5BD7DE;
  --uva-teal-base: #25CAD3;
  --uva-teal-dark: #1DA1A8;
  --uva-teal-darker: #16777C;
  --uva-teal-200: var(--uva-teal-lightest);
  --uva-teal-100: var(--uva-teal-light);
  --uva-teal: var(--uva-teal-base);
  --uva-teal-A: var(--uva-teal-dark);
  --uva-teal-B: var(--uva-teal-darker);

  /* UVA Green */
  --uva-green-lightest: #DDEFDC;
  --uva-green-lighter: #89CC74;
  --uva-green-base: #62BB46;
  --uva-green-dark: #4E9737;
  --uva-green-200: var(--uva-green-lightest);
  --uva-green-100: var(--uva-green-lighter);
  --uva-green: var(--uva-green-base);
  --uva-green-A: var(--uva-green-dark);

  /* UVA Red */
  --uva-red-lightest: #FBCFDA;
  --uva-red-base: #EF3F6B;
  --uva-red-dark: #DF1E43;
  --uva-red-darker: #B30000;
  --uva-red-100: var(--uva-red-lightest);
  --uva-red: var(--uva-red-base);
  --uva-red-A: var(--uva-red-dark);
  --uva-red-B: var(--uva-red-darker);

  /* UVA Yellow */
  --uva-yellow-lightest: #FEF6C8;
  --uva-yellow-base: #ECC602;
  --uva-yellow-dark: #B99C02;
  --uva-yellow-100: var(--uva-yellow-lightest);
  --uva-yellow: var(--uva-yellow-base);
  --uva-yellow-A: var(--uva-yellow-dark);

  /* UVA Grey */
  --uva-grey-lightest: #F1F1F1;
  --uva-grey-light: #DADADA;
  --uva-grey-base: #808080;
  --uva-grey-dark: #4F4F4F;
  --uva-grey-darkest: #2B2B2B;
  --uva-grey-200: var(--uva-grey-lightest);
  --uva-grey-100: var(--uva-grey-light);
  --uva-grey: var(--uva-grey-base);
  --uva-grey-A: var(--uva-grey-dark);
  --uva-grey-B: var(--uva-grey-darkest);

  /* UVA Text Color */
  --uva-text-color-base: var(--uva-grey-A);
  --uva-text-color-dark: var(--uva-grey-B);

  /* UVA White */
  --uva-white: #fff;
}
`,i=a`
:host {
  --box-shadow:  0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  --box-shadow-light: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.12);
  --box-shadow-mid:  0 2px 4px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.12);
}
`,s=a`
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
`,d=a`
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
`;var b;class g extends r{constructor(){super(...arguments),this.noShadowDom=!1,this.noStyle=!1,this.imports={},this.importedStyles="",this.headingLevelStart=2,b.set(this,null)}resizeReactive(){import("./resize_controller-08b62fc4.js").then((({ResizeController:a})=>{this._resizeController=new a(this,{})}))}static get styles(){return[n,i,s,d]}firstUpdated(){this.imports&&!this.noStyle&&Object.keys(this.imports).forEach((a=>{if(this.imports[a]){const e=this.imports[a];import(e).then((e=>{this.importedStyles+=e.default.toString().replace(/:host/,a.toLowerCase())}))}}))}connectedCallback(){super.connectedCallback(),this.noShadowDom&&!this.noStyle&&(t(this,b,document.createElement("style"),"f"),this.appendChild(l(this,b,"f")),u(o`${Object.getPrototypeOf(this).constructor.styles.map((a=>a.toString().replace(/:host/m,this.tagName.toLowerCase())))}`,l(this,b,"f")))}createRenderRoot(){return this.noShadowDom?this:super.createRenderRoot()}render(){return o`
      ${this.noShadowDom?"":o`<slot></slot>`}
    `}}b=new WeakMap,e([v({type:Boolean,attribute:"no-shadow-dom"})],g.prototype,"noShadowDom",void 0),e([v({type:Boolean,attribute:"no-style"})],g.prototype,"noStyle",void 0),e([v({type:Object})],g.prototype,"imports",void 0),e([v({type:String})],g.prototype,"importedStyles",void 0),e([v({type:Number})],g.prototype,"headingLevelStart",void 0);export{g as S};
