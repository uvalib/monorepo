import { html, css, LitElement } from 'lit-element';
import '@uvalib/uvalib-logos/uvalib-logos.js';
import('@uvalib/uvalib-icon/uvalib-icon.js');
import style from './UvalibHeader.css.js';

export class UvalibHeader extends LitElement {
  static get styles() {
    return [style];
  }

  static get properties() {
    return {
      homelink: { type: String },
      simple: { type: Boolean },
      nolinks: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.homelink = "https://library.virginia.edu"
    this.simple = false;
    this.nolinks = false;
  }

  render() {
    return html`  
<header>
  <div id="container">
    <div>${this.nolinks? ``:`<a href="${this.homelink}">`}<uvalib-logos>University of Virginia Library</uvalib-logos>${this.nolinks? ``:`</a>`}</div>
    <div class="spacer"></div>
    <div id="topLinks" ?hidden="${this.nolinks}">
      <a href="${this.homelink}/askalibrarian"><uvalib-icon icon-id="uvalib:general:commentdots"></uvalib-icon> Ask a Librarian</a>
    </div>
  </div>
</header>
    `;
  }
}
