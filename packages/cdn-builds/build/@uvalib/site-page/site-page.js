import{i as e,_ as t,n as o,s as i,S as n,x as a}from"../../property-88ac5898.js";import"../../site-header-e3d8db17.js";import{C as s,M as r,W as d}from"../../SiteStyle-4bb8cd6a.js";import{A as l}from"../../AccessibleStyles-1e7f8a0a.js";import("../../site-footer-ad56cc6e.js");class c extends i{constructor(){super(...arguments),this.rootLinkDomain="https://www.library.virginia.edu"}addStylesheetToHead(){const e=document.createElement("link");e.rel="stylesheet",e.media="all",e.href="https://use.typekit.net/oym8nvz.css",document.head.appendChild(e)}handleSlotChange(){const e=this.shadowRoot.querySelector('slot[name="pre-footer"]').assignedNodes(),t=this.shadowRoot.querySelector(".pre-footer-container");e.length>0?t.setAttribute("has-content",""):t.removeAttribute("has-content")}connectedCallback(){super.connectedCallback(),n(this.renderRoot,[l,r,d,c.styles])}setHtmlStyles(){this.addStylesheetToHead();const e=new CSSStyleSheet;e.replaceSync(c.htmlStyles.cssText),document.adoptedStyleSheets=[...document.adoptedStyleSheets,l,r,e]}firstUpdated(){this.setHtmlStyles();this.shadowRoot.querySelector('slot[name="pre-footer"]').addEventListener("slotchange",(()=>this.handleSlotChange())),this.handleSlotChange()}render(){return a`
      <a href="#main-content" class="visually-hidden focusable skip-link">
				Skip to main content
			</a>
      <div class="page-wrapper w3-col w3-clear w3-animate-opacity w3-text-theme ">
        <site-header root-link-domain="${this.rootLinkDomain}"></site-header>
        <div id="main-content" class="w3-row main-container-inner none">
          <div id="main-container-inner" class="w3-row main-container-inner none">
            <div class="w3-col w3-clear w3-row-padding">
					    <div id="main-content" class="w3-col main-box w3css-content breadcrumb-found" role="main" data-once="body">
						    <div class="d8-fade w3-mobile ">
                  <slot></slot>
                </div>
              </div>
            </div>  
          </div>
        </div>
        <site-footer root-link-domain="${this.rootLinkDomain}">
          <div slot="pre-footer" class="pre-footer-container"><slot name="pre-footer"></slot></div>
        </site-footer>
      </div>  
    `}}c.styles=e`
    :host {
      display:block;
    }
    site-footer, site-header {
      width: 100%;
      display: block;
    }
    @media (min-width: 993px) {
      #main-container-inner .breadcrumb-found {
        margin-top: 0 !important;
      }
    }
    .pre-footer-container {
      display: none;
    }
    .pre-footer-container[has-content] {
      display: block;
    }
  `,c.htmlStyles=e`
    html {
      ${s}
      color: var(--uva-grey-darkest, #2B2B2B);
      overflow-x: hidden;
    }
    html, body {
      font-display: swap;
      font-size: 17px !important;
    }
    * {
      font-family: franklin-gothic-urw, Arial, Helvetica, sans-serif !important;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      overflow: auto;
      min-height: 100vh;
      text-rendering: optimizeSpeed;
      line-height: 1.5;
      margin: 0;
    }
  `,t([o({type:String,attribute:"root-link-domain"})],c.prototype,"rootLinkDomain",void 0),window.customElements.define("site-page",c);
