import { html, LitElement } from 'lit';
import { LibraryColors } from './SiteStyleColors.js';

export class SiteStyle extends LitElement {
  static get styles() {
    return [
      LibraryColors
    ]
  }

  render() {
    return html`<slot></slot>`
  }
}
