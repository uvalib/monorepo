import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLiteResults.css.js';
import { catalogState } from './UvalibCatalogLiteState.js';
import { observeState } from 'lit-element-state';
import '@uvalib/uvalib-button/uvalib-button.js';
import './uvalib-catalog-lite-pool-results.js';

export class UvalibCatalogLiteResults extends observeState(LitElement) {
  static get properties() {
    return {
      showSummary: {type:Boolean}
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
   this.showSummary = true;
  }

  firstUpdated() {
  }

  _resetSearch() {
   catalogState.searching=false;
   catalogState.basicSearch=true;
   catalogState.hasresults=false;
   catalogState.userSearched=false;
   catalogState.rawQueryString="";
  }

  render() {
    return html`
<div ?hidden="${!catalogState.hasresults}" tabindex="-1" id="results-container" class="search-results" aria-describedby="search-summary">
   <div class="results-header" role="heading" aria-level="2">
      ${(this.showSummary && catalogState.pools)? html`
         <div id="search-summary" class="summary">
            <div class="query">Showing ${catalogState.pools.uva_library.lastResultCount.toLocaleString()} results for:</div>
            <div class="qs">keyword: ${catalogState.pools.uva_library.lastKeyword}</div>
         </div>
         <span class="buttons" role="toolbar">
            <uvalib-button mode="text" @click="${this._resetSearch}" >Reset Search</uvalib-button>
         </span>      
      `:''}
   </div>

    <div class="results-wrapper" >
       <div class="results-main">
          ${(catalogState.pools && catalogState.pools.uva_library.lastResultCount===0)? html`
            <div  v-if="total == 0 && selectedResultsIdx == -1" class="none">
               No results found
            </div>
          `:html`
            <uvalib-catalog-lite-pool-results></uvalib-catalog-lite-pool-results>
          `}
       </div>
    </div>
</div>
    `;
  }

}
