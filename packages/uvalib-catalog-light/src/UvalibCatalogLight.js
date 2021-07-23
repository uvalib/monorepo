import { LitElement, html, css } from 'lit-element';
import style from '@uvalib/web-styles/css/styles.css.js';
import { Catalog } from '@uvalib/data-models/lib/catalog.js';
import '@lion/input/lion-input.js';
import '@uvalib/uvalib-header/uvalib-header.js';

export class UvalibCatalogLight extends LitElement {
  static get properties() {
    return {
      pools: { type: Object },
    };
  }

  static get styles() {
    return [style, css`
      :host {}
    `];
  }

  constructor() {
    super();
    this.catalog = new Catalog({devMode:true});
    this.pools = [];
    this.catalog.poolsPromise.then(pools=>{
      this.pools = this.catalog.lastPools;
    });
  }

  render() {
    return html`
      <uvalib-header></uvalib-header>
      <main>
        <h1>UVA Library Catalog Light</h1>
        <ul>
          ${this.pools.map(pool => html`<li>${pool.name}</li>`)}
        </ul>

        <lion-input>
          <label slot="label">Search Virgo for books, articles, and more.</label>
        </lion-input>
        
      </main>
    `;
  }
}
