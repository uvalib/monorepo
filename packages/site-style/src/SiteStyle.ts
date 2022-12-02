/* eslint-disable import/no-extraneous-dependencies */
import { html, LitElement, render } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property } from 'lit/decorators.js';
import { LibraryColors } from './SiteStyleColors.js';
import { LibraryVariables } from './SiteStyleVariables.js'

export class SiteStyle extends LitElement {

  @property({ type: Boolean, attribute: "no-shadow-dom" }) noShadowDom = false;  // default is to have a shadowDom

  @property({ type: Boolean, attribute: "no-style" }) noStyle = false; // default to have default styles applied

  @property({ type: Object }) imports: {[key: string]: string} = {};

  @property({ type: String }) importedStyles: string = "";

  #styleNode: HTMLElement|null = null;

  static get styles() {
    // need to figure out how to dynamically load these (or not)
    return [
      LibraryColors, LibraryVariables
    ];
  }

  protected firstUpdated(): void {
    if (this.imports && !this.noStyle) {
      Object.keys(this.imports).forEach(key=>{
        if (this.imports[key]) {
          const imp: string = this.imports[key];
          import(imp).then(css=>{
            this.importedStyles += css.default.toString().replace(/:host/,key.toLowerCase());
          } )
        }
      });
    }      
  }


  connectedCallback(): void {
    super.connectedCallback();    
    if (this.noShadowDom && !this.noStyle) {
      // this is such a hack, pushing water uphill...
      this.#styleNode = document.createElement('style');
      this.appendChild(this.#styleNode); 
      render(html`${ Object.getPrototypeOf(this).constructor.styles.map((s: { toString: () => any; }) => s.toString().replace(/:host/m,this.tagName.toLowerCase() ) ) }`,this.#styleNode);
    }
  }

  createRenderRoot() {
    if (this.noShadowDom) {
      return this;
    }
    return super.createRenderRoot();
  }

  render() {
    return html`

      ${this.noShadowDom?'':html`<slot></slot>`}
    `;
  }
}
