import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLight.css.js';
import { catalogState } from './UvalibCatalogLightState.js';
import { observeState } from 'lit-element-state';
import '@uvalib/uvalib-page/uvalib-page.js';
import './uvalib-catalog-light-home.js';
import { router } from 'lit-element-router';

export class UvalibCatalogLight extends router( observeState(LitElement) ) {
  static get properties() {
    return {
      iskiosk: {type: Boolean},
      route: { type: String },
      params: { type: Object },
      id: {type: String},
      domain: {type: String},
      build: {type:String}
    };
  }

  static get routes() {
    return [{
      name: 'home',
      pattern: '',
    },{
      name: 'results',
      pattern: "results/:searchquery"
    }];
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
    this.route = '';
    this.params = {};
  }

  router(route, params) {
    this.route = route;
    this.params = params;
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

<uvalib-spinner dots ?hidden="${!catalogState.authorizing}" message="Authorizing..." overlay></uvalib-spinner>

<h1>${this.params.searchquery}</h1>

<uvalib-page nofooter nolinks>    
  <div tabindex="-1" id="app" role="application">
    <div tabindex="-1" class="v4-content" id="v4-main">
      <h1 ?hidden="${catalogState.focusedItem}">Search</h1>
      <uvalib-catalog-light-home ?iskiosk="${catalogState.iskiosk}"></uvalib-catalog-light-home>
      <uvalib-scroll-to-top></uvalib-scroll-to-top>
    </div>
  </div>
</uvalib-page>
<div class="buildstatus" style="opacity: .25">${this.build}</div>
    `;
  }

}