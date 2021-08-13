//import 'lit-virtualizer';
import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLight.css.js';
import '@uvalib/uvalib-page/uvalib-page.js';
import './uvalib-catalog-light-home.js';


export class UvalibCatalogLight extends LitElement {
  static get properties() {
    return {
      authorizing:  {type: Boolean},
      iskiosk: {type: Boolean}
    };
  }

  static get styles() {
    return [css`
[hidden] {
  display: none;
}    
    `,style];
    this.authorizing = false;
  }

  constructor() {
    super();
    this.authorizing = false;
    this.iskiosk = false;
  }

  firstUpdated() {
    // These items should be loaded after everything else
    import('@uvalib/uvalib-spinner/uvalib-spinner.js').then(()=>{
      import('@uvalib/uvalib-scroll-to-top/uvalib-scroll-to-top.js');
    })    
  }

  render() {
    return html`

<uvalib-spinner ?hidden="${!this.authorizing}" message="Authorizing..." overlay></uvalib-spinner>

<uvalib-page nofooter nolinks>    
  <div tabindex="-1" id="app" role="application">
    <div tabindex="-1" class="v4-content" id="v4-main">
      <h1>Search</h1>
      <uvalib-catalog-light-home ?iskiosk="${this.iskiosk}"></uvalib-catalog-light-home>
      <uvalib-scroll-to-top></uvalib-scroll-to-top>
    </div>
  </div>
</uvalib-page> 
    `;
  }

}
