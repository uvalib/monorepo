import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { LibraryColors } from './SiteStyleColors.js';

export class SiteStyle extends LitElement {

  @property({ type: Boolean, attribute: "no-shadow-dom" }) noShadowDom = false;  // default is to have a shadowDom

  static get styles() {
    return [
      LibraryColors
    ]
  }

  createRenderRoot() {
    if (this.noShadowDom) {
      return this;
    }
    return super.createRenderRoot();
  }

  render() {
    return html`<slot></slot>`
  }
}
