import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLight.css.js';
import { Catalog } from '@uvalib/data-models/lib/catalog.js';
import '@spectrum-web-components/bundle/elements.js';
import '@uvalib/uvalib-page/uvalib-page.js';
import '@vaadin/vaadin-virtual-list/vaadin-virtual-list.js';

export class UvalibCatalogLight extends LitElement {
  static get properties() {
    return {
      catalog: {type: Object},
      pool: { type: Object },
      query: { type: String },
      lastQuery: { type: String },
      totalResultCount: { type: Number },
      loadingResults: { type: Boolean },
      inactiveTimeout: { type: Number },
      configFile: {type: String},
      results: {type: Array}
    };
  }

  static get styles() {
    return [style];
  }

  constructor() {
    super();

    // Reset/Reload after a specified timeout of no activity
    this.inactiveTimeout = 420000;
    this._refreshTimeout();
    Object.keys(window).forEach(function(key) {
      if (/^on/.test(key)) {
          window.addEventListener(key.slice(2), event => {
              this._refreshTimeout();
          });
      }
    }.bind(this));

    this._setupCatalog();
  }

  firstUpdated(changedProperties) {
    if (this.configFile) {
      // Fetch env.json settings
      // This is a deployment requirement
      fetch(this.configFile).then(env=>{
        return this._setupCatalog( !!(env.id==="dev") );
      });
    }
  }

  _setupCatalog(dev=false) {
    this.catalog = new Catalog();
    return this.catalog.poolsPromise
      .then(pools=> this.pool=pools.uva_library);       
  }

  _refreshTimeout() {
    if (this._timeoutID) clearTimeout(this._timeoutID);
    this._timeoutID = setTimeout(()=>{
      location.reload();
    }, this.inactiveTimeout);
  }

  render() {
    return html`
${this.catalog? html`
<uvalib-page nofooter class="coral--light">
<sp-theme scale="large" color="light">
  <h1>Search</h1>
  <sp-field-label for="name-0"
    >Search Virgo for books, articles, and more.</sp-field-label
  >
  <sp-textfield
    id="q"
    placeholder="Search Virgo for books, articles, and more"
  ></sp-textfield>
  <sp-button @click="${this._searchBtnClick}">Search</sp-button>

  <sp-progress-circle
    label="Loading search results now."
    indeterminate
    size="large"
    ?hidden="${!this.loadingResults}"
  ></sp-progress-circle>

  ${this.results
    ? html`
        <div id="results">
          <div id="search-summary" class="summary">
            <div class="query">
              Showing ${this.totalResultCount} results for:
            </div>
            <div class="qs">keyword: ${this.lastQuery}</div>
          </div>

          <vaadin-virtual-list .items="${this.results}" .renderer="${(root, list, {item, index}) => {
            root.innerHTML = `
            <div class="hit" id="${item.id}">
            #${index}: ${item.fields.title_subtitle_edition.value}
            </div>
            `}}"></vaadin-virtual-list>
        </div>
      `
    : html`
        <div class="welcome" ?hidden="${this.loadingResults}">
          <h3>Welcome to the light version of the Virgo catalog</h3>
          <p>
            Virgo delivers high-quality search results through an
            easy-to-use interface that works on any device.
          </p>
          <p>
            You can use Virgo to conduct research, make requests, find
            and create Course Reserves, organize and share bookmarks,
            and set personal preferences for your own use of the system.
          </p>
          <p>
            <b>Need assistance?</b>
            <a href="https://www.library.virginia.edu/askalibrarian/"
              >Ask a Librarian</a
            >
            web chat is happy to help with questions large and small.
          </p>
        </div>
      `}
</sp-theme>
</uvalib-page>
`:''}   
    `;
  }

  _searchBtnClick() {
    this.query = this.shadowRoot.getElementById('q').value;
    console.info(`Value of query field is ${this.query}`);
    this.loadingResults = true;
    this.pool.fetchResults({ rows: 5, keyword: this.query }).then(res => {
      this._mergeResults(this.pool.lastResults);
      this.loadingResults = false;
    });
  }

  _mergeResults(lastResults) {
    console.log(lastResults);
    this.results = lastResults;
console.log(this.results);    
  }
}
