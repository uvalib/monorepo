import { html, LitElement, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import { LibraryColors } from './SiteStyleColors.js';

export class SiteStyle extends LitElement {

  @property({ type: Boolean, attribute: "no-shadow-dom" }) noShadowDom = false;  // default is to have a shadowDom

  @property({ type: Object }) imports: {[key: string]: string} = {};

  @property({ type: String }) importedStyles: string = "";

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
