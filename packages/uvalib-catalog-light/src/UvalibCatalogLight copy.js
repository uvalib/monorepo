import 'lit-virtualizer';
import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLight.css.js';
import { Catalog } from '@uvalib/data-models/lib/catalog.js';
import '@spectrum-web-components/bundle/elements.js';
import '@uvalib/uvalib-page/uvalib-page.js';
import './uvalib-catalog-light-result.js';

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
<uvalib-page nofooter nolinks class="coral--light">
<sp-theme scale="large" color="light">
  <h1>Search</h1>
  <sp-field-label for="name-0"
    >Search Virgo for books, articles, and more.</sp-field-label
  >
  <sp-textfield @keyup="${e=>{if (e.key === 'Enter') {this._searchBtnClick()}} }"
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
          <div class="results-header" role="heading" aria-level="2">
            <div id="search-summary" class="summary">
                <div class="query">Showing {{$utils.formatNum(total)}} results for:</div>
                <div class="qs">{{queryString}}</div>
            </div>
            <span class="buttons" role="toolbar">
                <V4Button mode="text" @click="resetSearch" >Reset Search</V4Button>
                <SaveSearch v-if="isSignedIn"/>
                <SignInRequired v-else id="save-signin-modal" act="save-search"/>
            </span>
          </div>

          <lit-virtualizer class="hits-content" role="list"
              .scrollTarget=${window}
              .items=${this.results}
              .renderItem=${(result,index) => html`
                <div role="listitem" class="hit-wrapper">
                  <uvalib-catalog-light-result  .index="${index}" .result="${result}"></uvalib-catalog-light-result>
                </div>
              `}>
          </lit-virtualizer>
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
