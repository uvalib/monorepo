import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLightHome.css.js';
import { catalogState } from './UvalibCatalogLightState.js';
import { observeState } from 'lit-element-state';
import { Catalog } from '@uvalib/data-models/lib/catalog.js';
import '@uvalib/uvalib-button/uvalib-button.js';
//import './uvalib-catalog-light-details.js';

export class UvalibCatalogLightHome extends observeState(LitElement) {
  static get properties() {
    return {
      catalog: {type: Object}
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
    catalogState.searching = false;
    catalogState.basicSearch = true;
    catalogState.hasresults = false;
    catalogState.iskiosk = false;
    this._setupCatalog();
  }

  _setupCatalog(dev=false) {
    this.catalog = new Catalog();
    this.catalog.poolsPromise
      .then(pools=> {
        catalogState.pools=pools;
        catalogState.ready=true;
      });       
  }

  firstUpdated() {
    // These can wait for the rest of the page as they require interaction
    import('./uvalib-catalog-light-results.js').then(()=>{
      import('@uvalib/uvalib-spinner/uvalib-spinner.js').then(()=>{
        
      });
    });

    this.addEventListener('moreresults', function(){      
      this._getMore();
    }.bind(this));
    this.addEventListener('itemselected', function(e){
      let selectedId = e.detail.id;
      catalogState.focusedItem = catalogState.pools.uva_library.lastResults.find(item=>item.id === selectedId);
      document.body.scrollTop = 0; // For Chrome, Safari and Opera
      document.documentElement.scrollTop = 0; // For IE and Firefox
      window.focus();
    }.bind(this))
  }

  _getMore() {
    catalogState.userSearched = true;
    catalogState.pools.uva_library.getMore().then(res => {
      catalogState.pools = {...catalogState.pools, lastTs:new Date() };
      catalogState.hasresults = (catalogState.pools.uva_library.lastResults)? catalogState.pools.uva_library.lastResults.length > 0: false;          
    });
  }

  _submitSearch(e) {
    catalogState.rawQueryString = this.shadowRoot.getElementById('search').value;
    catalogState.userSearched = true;
    catalogState.searching = true;
    catalogState.pools.uva_library.fetchResults({ rows: 10, keyword: catalogState.rawQueryString }).then(res => {
      // now that we have some results, load up components needed
      import('./uvalib-catalog-light-details.js');
      catalogState.pools = {...catalogState.pools, lastTs:new Date() };
      catalogState.hasresults = (catalogState.pools.uva_library.lastResults)? catalogState.pools.uva_library.lastResults.length > 0: false;
      catalogState.searching = false;     
    });
  }

  render() {
    return html`
<div class="home">
  
  <uvalib-spinner ?hidden=${!catalogState.searching} message="Searching..." overlay></uvalib-spinner>
  <div class="search-panel pure-form" ?hidden="${catalogState.focusedItem}">
    ${catalogState.basicSearch? html`
      <label class="screen-reader-text" for="search">Search Virgo for books, articles, and more.</label>
      <label class="screen-reader-text" for="source-select">Search in</label>
      <div class="basic-search">
          <input class="basic"
            @keyup = "${(e)=>{if(e.key === 'Enter') this._submitSearch()}}"
            autocomplete="off"
            type="text"
            id="search"
            ?disabled=${!catalogState.ready}
            placeholder="Search Virgo for books, articles, and more"
            .value="${catalogState.rawQueryString}"
          >
          <uvalib-button @click="${this._submitSearch}" class="search" mode="primary">Search</uvalib-button>
      </div>
    `:''} 
  </div>
  <div class="welcome" ?hidden="${catalogState.hasresults || catalogState.focusedItem}">
    <h3 class="borders">Welcome to the newest version of the Virgo catalog</h3>
    <p>Virgo delivers high-quality search results through an easy-to-use interface that works on any device.</p>
    <p>You can use Virgo to conduct research, make requests, find and create Course Reserves, organize and share bookmarks, and set personal preferences for your own use of the system.</p>
    ${catalogState.iskiosk? '':html`
      <p><b>Need assistance?</b> <a href="https://www.library.virginia.edu/askalibrarian/">Ask a Librarian</a> web chat is happy to help with questions large and small.</p>
    `}
  </div>
  <uvalib-catalog-light-results ?hidden="${catalogState.focusedItem}"></uvalib-catalog-light-results>
  <uvalib-catalog-light-details .item="${catalogState.focusedItem}" ?hidden="${!catalogState.focusedItem}"></uvalib-catalog-light-details>
 </div> 
    `;
  }

}
