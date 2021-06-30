import { html, css, LitElement } from 'lit-element';
import '@uvalib/uvalib-logos/uvalib-logos.js';
import style from './UvalibHeader.css.js';

export class UvalibHeader extends LitElement {
  static get styles() {
    return [style];
  }

  static get properties() {
    return {
      homelink: { type: String },
      simple: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.homelink = "https://library.virginia.edu"
  }

  render() {
    return html`  
<header>
  <div id="container">
    <a href="${this.homelink}"><uvalib-logos>University of Virginia Library</uvalib-logos></a>
  </div>
</header>
    `;
  }
}
