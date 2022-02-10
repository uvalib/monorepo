import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLite.css.js';
import { catalogState } from './UvalibCatalogLiteState.js';
import { observeState } from 'lit-element-state';
import '@uvalib/uvalib-page/uvalib-page.js';
import './uvalib-catalog-lite-home.js';
import '@uvalib/uvalib-style/uvalib-style.js';

export class UvalibCatalogLite extends observeState(LitElement) {
  static get properties() {
    return {
      iskiosk: {type: Boolean},
      id: {type: String},
      domain: {type: String},
      build: {type:String}
    };
  }

  static get styles() {
    return [css`
      [hidden] {
        display: none;
      }    
    `,style];
  }

  constructor() {
    super();
    this.iskiosk = false;
  }

  firstUpdated() {
    // These items should be loaded after everything else
    import('@uvalib/uvalib-spinner/uvalib-spinner.js').then(()=>{
      import('@uvalib/uvalib-scroll-to-top/uvalib-scroll-to-top.js');
    })  
    catalogState.iskiosk = this.iskiosk;  
  }

  render() {
    return html`
<uvalib-style>
  <uvalib-spinner dots ?hidden="${!catalogState.authorizing}" message="Authorizing..." overlay></uvalib-spinner>

  <uvalib-page nofooter nolinks>    
    <div tabindex="-1" id="app" role="application">
      <div tabindex="-1" class="v4-content" id="v4-main">
        <h1 ?hidden="${catalogState.focusedItem}">Search</h1>
        <uvalib-catalog-lite-home ?iskiosk="${catalogState.iskiosk}"></uvalib-catalog-lite-home>
        <uvalib-scroll-to-top></uvalib-scroll-to-top>
      </div>
    </div>
  </uvalib-page>
  <div class="buildstatus" style="opacity: .25; text-align: center;">${this.build}</div>
</uvalib-style>
    `;
  }

}