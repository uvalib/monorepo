import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLight.css.js';
import { Catalog } from '@uvalib/data-models/lib/catalog.js';
import '@spectrum-web-components/bundle/elements.js';
import '@uvalib/uvalib-page/uvalib-page.js';

export class UvalibCatalogLight extends LitElement {
  static get properties() {
    return {
      pools: { type: Object },
      query: { type: String },
      lastQuery: { type: String },
      totalResultCount: { type: Number },
      loadingResults: { type: Boolean },
    };
  }

  static get styles() {
    return [style];
  }

  constructor() {
    super();
    this.catalog = new Catalog({ devMode: true });
  }

  render() {
    return html`
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
          <sp-radio-group selected="first" name="example">
            <sp-radio value="first">Everything</sp-radio>
            <sp-radio value="second">Catalog Only</sp-radio>
            <sp-radio value="third">Articles Only</sp-radio>
            <sp-radio value="fourth">Images Only</sp-radio>
          </sp-radio-group>

          <sp-progress-circle
            label="Loading search results now."
            indeterminate
            size="large"
            ?hidden="${!this.loadingResults}"
          ></sp-progress-circle>
          ${this.pools
            ? html`
                <div id="results">
                  <div id="search-summary" class="summary">
                    <div class="query">
                      Showing ${this.totalResultCount} results for:
                    </div>
                    <div class="qs">keyword: ${this.lastQuery}</div>
                  </div>
                  <sp-tabs selected="${this.pools[0].id}" quiet>
                    ${this.pools.map(
                      pool => html`
                        <sp-tab
                          label="${pool.name} (${pool.lastResultCount
                            ? pool.lastResultCount
                            : '0'})"
                          value="${pool.id}"
                        ></sp-tab>
                      `
                    )}
                    ${this.pools.map(
                      pool => html`
                        <sp-tab-panel value="${pool.id}">
                          <ul>
                            ${pool.lastResults['group_list'].map(
                              group => html`
                                <li>
                                  ${group['record_list'][0].fields.find(
                                    field => field.name.indexOf('title') > -1
                                  ).value}
                                </li>
                              `
                            )}
                          </ul>
                        </sp-tab-panel>
                      `
                    )}
                  </sp-tabs>
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
    `;
  }

  _searchBtnClick() {
    this.query = this.shadowRoot.getElementById('q').value;
    console.info(`Value of query field is ${this.query}`);
    this.loadingResults = true;
    this.catalog.fetchResults({ rows: 5, keyword: this.query }).then(res => {
      this.loadingResults = false;
      this.pools = this.catalog.lastPools;
      console.log('pools');
      console.log(this.pools);
      this.totalResultCount = this.catalog.lastResultCount;
      this.lastQuery = this.query;
    });
  }
}
