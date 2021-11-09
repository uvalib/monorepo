import { c as css, L as LitElement, h as html } from './lit-element-b0aa61ba.js';
import './uvalib-logos-370b2f10.js';

var style = css`
@import url("https://use.typekit.net/tgy5tlj.css");:host{display:block;font-family:franklin-gothic-urw,arial,sans-serif;font-weight:500;margin:0;padding:0;width:100%}header{background-color:#232d4b;color:#fff;flex-direction:column;height:60px;margin:0;padding:0}#container,header{align-items:center;display:flex}#container{flex-direction:row;max-width:1200px;width:100%}#container a{padding:.625em}.spacer{flex:1}uvalib-icon{fill:#fff}a,a:link,a:visited{color:inherit}
/*# sourceMappingURL=src/UvalibHeader.css.map */
`;

import('./uvalib-icon-d71aa8c2.js');

class UvalibHeader extends LitElement {
  static get styles() {
    return [style];
  }

  static get properties() {
    return {
      homelink: { type: String },
      simple: { type: Boolean },
      nolinks: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.homelink = 'https://library.virginia.edu';
    this.simple = false;
    this.nolinks = false;
  }

  render() {
    return html`  
<header>
  <div id="container">
    <div>${
      this.nolinks
        ? html`<uvalib-logos>University of Virginia Library</uvalib-logos>`
        : html`<a href="${this.homelink}"><uvalib-logos>University of Virginia Library</uvalib-logos></a></div>`
    }
    <div class="spacer"></div>
    <div id="topLinks" ?hidden="${this.nolinks}">
      <a href="${
        this.homelink
      }/askalibrarian"><uvalib-icon icon-id="uvalib:general:commentdots"></uvalib-icon> Ask a Librarian</a>
    </div>
  </div>
</header>
    `;
  }
}

customElements.define('uvalib-header', UvalibHeader);
