import { html, LitElement, render } from 'lit';
import { property } from 'lit/decorators.js';
import { LibraryColors } from './SiteStyleColors.js';

export class SiteStyle extends LitElement {

  @property({ type: Boolean, attribute: "no-shadow-dom" }) noShadowDom = false;  // default is to have a shadowDom

  @property({ type: Object }) imports: {[key: string]: string} = {};

  @property({ type: String }) importedStyles: string = "";

  #styleNode: HTMLElement|null = null;

  static get styles() {
    return [
      LibraryColors
    ]
  }

  protected firstUpdated(): void {
    if (this.imports) {
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

  createRenderRoot() {
    if (this.noShadowDom) {
      // this is such a hack, pushing water uphill...
      this.#styleNode = document.createElement('style');
      this.appendChild(this.#styleNode); 
      render(html`${ Object.getPrototypeOf(this).constructor.styles.map((s: { toString: () => any; }) => s.toString().replace(/:host/m,this.tagName.toLowerCase() ) ) }`,this.#styleNode);
      return this;
    }
    return super.createRenderRoot();
  }

  render() {
    return html`
      <style>
        ${this.noShadowDom?html`${LibraryColors.toString().replace(/:host/,this.tagName.toLowerCase())}`:''}
        ${this.importedStyles}
      </style>
      ${this.noShadowDom?'':html`<slot></slot>`}
    `;
  }
}