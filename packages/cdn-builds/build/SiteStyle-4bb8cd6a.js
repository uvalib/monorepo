import{i as e,_ as t,s as r,a as o,b as i,B as n,x as a,n as s}from"./property-88ac5898.js";const l=e`
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
`,d=e`
:host {
  ${l}

  /* UVA White */
  --uva-white: #fff;
  --uva-black: #000;
}
`;(new CSSStyleSheet).replaceSync(`\n  ${d}\n`);const c=e`
:host {
  --box-shadow:  0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  --box-shadow-light: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.12);
  --box-shadow-mid:  0 2px 4px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.12);
}
`,h=e`
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
.w3-animate-opacity {
    animation: opac 0.6s;
    animation-timing-function: cubic-bezier(0.1, 0.9, 2, 0.1);
}
.w3-row-padding, .w3-row-padding > .w3-half, .w3-row-padding > .w3-third, .w3-row-padding > .w3-twothird, .w3-row-padding > .w3-threequarter, .w3-row-padding > .w3-quarter, .w3-row-padding > .w3-col {
    padding: 0 8px;
}
`,b=new CSSStyleSheet;b.replaceSync(`\n  ${h}\n`);const f=e`
* {
    font-family: franklin-gothic-urw, Arial, Helvetica, sans-serif !important;
}
*, *::before, *::after {
    box-sizing: border-box;
}
button, input, select, optgroup, textarea {
    color: var(--uva-grey-darkest, #2B2B2B);
}
input, button, textarea, select {
    font: inherit;
}
body, h1, h2, h3, .event-container .event-url .event-date .event--day, h4, .rds-articles h2, .library-hours .uva-library--hours .weekly-hours-header-section .heading-h2, .staff-directory .staff-directory-row .staff-directory-name, .about-uva-library .fact-grid .fact-card--details dd, footer .footer--main .block h2, p, .about-uva-library .fact-grid .fact-card--details dt, figure, blockquote, dl, dd {
    margin: 0;
}
h1, .h1 {
    font-size: 2.488rem !important;
    font-weight: 500;
    color: #232D4B !important;
    line-height: 1.15;
}
h1, h2, .h1, .h2, .news-page .views-row h2:first-of-type, .view-news-full-feed-of-blog-articlces .views-row h2:first-of-type {
    font-weight: 700;
}
h1, .h1, h2, .h2, .news-page .views-row h2:first-of-type, .view-news-full-feed-of-blog-articlces .views-row h2:first-of-type, h3, .event-container .event-url .event-date .event--day, .h3, .library-hours .uva-library--locations .view-content .views-row h2, .staff-bio .field--name-field-uva-ldap-title, .uvalib-bento-search .bs-header h2, .uvalib-bento-search .bs-header p, .exhibitions .current .view-content .views-field-title {
    margin-top: 3rem;
    margin-bottom: 1rem;
}
h4, .rds-articles h2, .library-hours .uva-library--hours .weekly-hours-header-section .heading-h2, .staff-directory .staff-directory-row .staff-directory-name, .about-uva-library .fact-grid .fact-card--details dd, footer .footer--main .block h2, .h4, .sustainable-scholarship .sustainable-links a, .staff-bio .block > h2, .staff-bio .field__label, .news-page .views-row h2, .view-news-full-feed-of-blog-articlces .views-row h2, .block-field-blocknodearticlebody h2 {
    font-size: 1.44rem !important;
    font-weight: 500;
    color: #232D4B !important;
    line-height: 1.15;
}
h4, .rds-articles h2, .library-hours .uva-library--hours .weekly-hours-header-section .heading-h2, .staff-directory .staff-directory-row .staff-directory-name, .about-uva-library .fact-grid .fact-card--details dd, footer .footer--main .block h2, .h4, .sustainable-scholarship .sustainable-links a, .staff-bio .block > h2, .staff-bio .field__label, .news-page .views-row h2, .view-news-full-feed-of-blog-articlces .views-row h2, .block-field-blocknodearticlebody h2, h5, .rds-section .rds-recent--articles ul li a, .rds-articles h3, .about-uva-library .visit-grid .visit-container .hover-block p, .about-uva-library .visit-grid .visit-container .hover-block .fact-grid .fact-card--details dt, .about-uva-library .fact-grid .fact-card--details .visit-grid .visit-container .hover-block dt, .event-container .event-url .event-date .event--month, .event-container .event-url .event-date .event--wkday, .site-sidebar--subnav nav ul li, .h5, .rds-section .neighborhood-teaser .n-t-contents h4, .rds-section .neighborhood-teaser .n-t-contents .rds-articles h2, .rds-articles .rds-section .neighborhood-teaser .n-t-contents h2, .library-hours .three-col .hover-block h3, .how-do-i-main .view-content .item-list ul li a, .how-do-i-detail .view-content h2, .staff-bio .field--name-field-uva-ldap-title .field__item:last-child, .uvalib-bento-search .bs-results-container .bs-results--block .bs-results--header h3, .exhibitions .permanent .view-content .views-row .views-field-title, .exhibitions .view-exhibitions-past .view-content .views-row .views-field-title, .uvalibrary-spaces .rerserve-container .reserve-location h3, .rp-using .neighborhood-teaser .n-t-frame .n-t-contents h4, .home-page .home-hours-block .hour-head, .jumpmenu ul li {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}
.hidden {
  display: none;
}
.invisible {
  visibility: hidden;
}
a, span a {
    color: var(--uva-blue-alt-dark, #005679);
    text-decoration: underline;
}
#header, #copyright, .close-nav, .mobile-nav, #page-title, #highlighted, .page-wrapper, #footer-menu, #top-container, #main-container, #bottom-container, #footer-container, .search-slide-wrapper, .main-navigation-wrapper, #top-container .top-box > div, #footer-container .footer-box > div, #bottom-container-inner .bottom-box > div {
    background-color: white;
}
.search-slide-inner, .header-inner, .main-navigation-inner-h, .welcome-text-inner, .highlighted-inner, .top-container-inner, .page-title-inner, .main-container-inner, .bottom-container-inner, .footer-container-inner, .footer-menu-inner, .copyright-inner {
    float: none;
    max-width: 1600px;
    margin: 0 auto;
}
svg {
    display: inline-block;
    width: 17px;
    height: 17px;
    position: relative;
    top: 4px;
    left: -5px;
}
img {
    max-width: 100%;
    height: auto;
    vertical-align: middle;
}
img, picture {
    max-width: 100%;
    display: block;
}
.main-container-inner .first-sidebar, .main-container-inner .w3css-content, .main-container-inner .second-sidebar, .top-container-inner .first-top, .top-container-inner .second-top, .top-container-inner .third-top, .bottom-container-inner .first-bottom, .bottom-container-inner .second-bottom, .bottom-container-inner .third-bottom, .bottom-container-inner .forth-bottom, .footer-container-inner .first-footer, .footer-container-inner .second-footer, .footer-container-inner .third-footer {
    margin-bottom: 12px;
    margin-top: 12px;
}
.top-container-inner .first-top, .top-container-inner .second-top, .top-container-inner .third-top, .main-container-inner .first-sidebar, .main-container-inner .w3css-content, .main-container-inner .second-sidebar, .bottom-container-inner .first-bottom, .bottom-container-inner .second-bottom, .bottom-container-inner .third-bottom, .bottom-container-inner .forth-bottom, .footer-container-inner .first-footer, .footer-container-inner .second-footer, .footer-container-inner .third-footer {
    float: left;
}
.top-container-inner .first-top > div, .top-container-inner .second-top > div, .top-container-inner .third-top > div, .main-container-inner .first-sidebar > div, .main-container-inner .w3css-content > div, .main-container-inner .second-sidebar > div, .bottom-container-inner .first-bottom > div, .bottom-container-inner .second-bottom > div, .bottom-container-inner .third-bottom > div, .bottom-container-inner .forth-bottom > div, .footer-container-inner .first-footer > div, .footer-container-inner .second-footer > div, .footer-container-inner .third-footer > div {
    float: left;
    height: 100%;
    width: 100% !important;
    padding: 24px !important;
}
.layout--onecol .layout__region {
    width: 100%;
}
`,p=new CSSStyleSheet;var u;p.replaceSync(`\n  ${f}\n`);class v extends r{constructor(){super(...arguments),this.noShadowDom=!1,this.noStyle=!1,this.imports={},this.importedStyles="",this.rootLinkDomain="https://www.library.virginia.edu",this.headingLevelStart=2,u.set(this,null)}resizeReactive(){import("./resize_controller-08b62fc4.js").then((({ResizeController:e})=>{this._resizeController=new e(this,{})}))}static get styles(){return[d,c,h,f]}firstUpdated(e){this.imports&&!this.noStyle&&Object.keys(this.imports).forEach((e=>{if(this.imports[e]){const t=this.imports[e];import(t).then((t=>{this.importedStyles+=t.default.toString().replace(/:host/,e.toLowerCase())}))}}))}connectedCallback(){super.connectedCallback(),this.noShadowDom&&!this.noStyle&&(o(this,u,document.createElement("style"),"f"),this.appendChild(i(this,u,"f")),n(a`${Object.getPrototypeOf(this).constructor.styles.map((e=>e.toString().replace(/:host/m,this.tagName.toLowerCase())))}`,i(this,u,"f")))}createRenderRoot(){return this.noShadowDom?this:super.createRenderRoot()}render(){return a`
      ${this.noShadowDom?"":a`<slot></slot>`}
    `}}u=new WeakMap,t([s({type:Boolean,attribute:"no-shadow-dom"})],v.prototype,"noShadowDom",void 0),t([s({type:Boolean,attribute:"no-style"})],v.prototype,"noStyle",void 0),t([s({type:Object})],v.prototype,"imports",void 0),t([s({type:String})],v.prototype,"importedStyles",void 0),t([s({type:String})],v.prototype,"rootLinkDomain",void 0),t([s({type:Number})],v.prototype,"headingLevelStart",void 0);export{l as C,p as M,v as S,b as W};
