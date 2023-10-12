import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { SearchLibrary } from './SearchLibrary.js';

export class SiteSearchIndex extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--site-search-index-text-color, #000);
    }
  `;

  constructor() {
    super();
    const sl = new SearchLibrary();
    fetch('/demo/searchIndex.json')
      .then(r=>r.text())
      .then( function(data:any){
        sl.loadFromString(data);
        console.log( sl.performSearch("Jefferson") );
      }.bind(this) );
  }

  render() {
    return html`
      <h2>Sample Search Results!</h2>
      <button>increment</button>
    `;
  }
}
