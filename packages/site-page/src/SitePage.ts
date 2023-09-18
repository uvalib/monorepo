import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import "@uvalib/site-header/site-header.js";
import ("@uvalib/site-footer/site-footer.js");  // at the bottom so can be dynamicly/async loaded

export class SitePage extends LitElement {
  static styles = css`
    :host {
      display:block;
    }
  `;


  render() {
    return html`
      <site-header></site-header>
      <slot></slot>
      <site-footer></site-footer>
    `;
  }
}
