import { html, css, LitElement, adoptStyles } from 'lit';
import { property } from 'lit/decorators.js';
import "@uvalib/site-header/site-header.js";
import ("@uvalib/site-footer/site-footer.js");  // footer at the bottom of the page so can be dynamicly/async loaded
import { Colors, AccessibleSheet, MainStyleSheet, W3CSSSheet } from "@uvalib/site-style";

export class SitePage extends LitElement {

  @property({ type: String, attribute: "root-link-domain" }) rootLinkDomain: string = "https://www.library.virginia.edu";

  static override styles = css`
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
  `;

  // Method to add a link to the head
  addStylesheetToHead() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.media = 'all';
    link.href = 'https://use.typekit.net/oym8nvz.css';
    document.head.appendChild(link);
  } 

  // Method to handle slot change
  handleSlotChange() {
    const slot = this.shadowRoot!.querySelector('slot[name="pre-footer"]') as HTMLSlotElement;
    const assignedNodes = slot.assignedNodes();
    const container = this.shadowRoot!.querySelector('.pre-footer-container') as HTMLElement;
    if (assignedNodes.length > 0) {
      container.setAttribute('has-content', '');
    } else {
      container.removeAttribute('has-content');
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this.renderRoot as ShadowRoot, [ AccessibleSheet, MainStyleSheet, W3CSSSheet, SitePage.styles]);
  }

  // Define the styles for the <html> element
  static htmlStyles = css`
    html {
      ${ Colors }
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
  `;

  // Method to set styles on the <html> element
  setHtmlStyles() {
    this.addStylesheetToHead();
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(SitePage.htmlStyles.cssText);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, AccessibleSheet, MainStyleSheet, styleSheet];
  }

  // Call the method when the component is first updated
  override firstUpdated() {
    this.setHtmlStyles();
    const slot = this.shadowRoot!.querySelector('slot[name="pre-footer"]') as HTMLSlotElement;
    slot.addEventListener('slotchange', () => this.handleSlotChange());
    this.handleSlotChange(); // Initial check
  }

  render() {
    return html`
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
    `;
  }
}
