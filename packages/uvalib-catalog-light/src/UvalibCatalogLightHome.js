//import 'lit-virtualizer';
import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLightHome.css.js';
import '@uvalib/uvalib-button/uvalib-button.js';

export class UvalibCatalogLightHome extends LitElement {
  static get properties() {
    return {
      searching: {type: Boolean},
      basicSearch: {type: Boolean}
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
    this.searching = false;
    this.basicSearch = true;
  }

  firstUpdated() {
    import('@uvalib/uvalib-spinner/uvalib-spinner.js');
  }

  _submitSearch(e) {
    console.log("search submitted");
  }

  render() {
    return html`
<div class="home">
  <uvalib-spinner ?hidden=${!this.searching} message="Searching..." overlay></uvalib-spinner>
  <div class="search-panel pure-form">
    ${this.basicSearch? html`
      <label class="screen-reader-text" for="search">Search Virgo for books, articles, and more.</label>
      <label class="screen-reader-text" for="source-select">Search in</label>
      <div class="basic-search">
          <input class="basic"
            @keyup = "${(e)=>{if(e.key === 'Enter') this._submitSearch()}}"
            autocomplete="off"
            type="text"
            id="search"
            placeholder="Search Virgo for books, articles, and more"
          >
          <uvalib-button @click="${this._submitSearch}" class="search" mode="primary">Search</uvalib-button>
      </div>
    `:''} 
  </div>
  <Welcome  v-if="isHomePage && hasResults==false" />
  <SearchResults/>
 </div> 
    `;
  }

}
