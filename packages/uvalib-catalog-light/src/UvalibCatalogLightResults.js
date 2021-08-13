import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLightResults.css.js';
import { catalogState } from './UvalibCatalogLightState.js';
import { observeState } from 'lit-element-state';
import '@uvalib/uvalib-button/uvalib-button.js';

export class UvalibCatalogLightResults extends observeState(LitElement) {
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
   catalogState.pools=null;
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
            <SaveSearch v-if="isSignedIn"/>
            <SignInRequired v-else id="save-signin-modal" act="save-search"/>
         </span>      
      `:''}
   </div>

    <div class="results-wrapper" >
       <FacetSidebar />
       <div class="results-main">
          <div class="pool-tabs">
             <V4Button v-for="(r,idx) in sourceTabs" :key="idx"
                class="pool" v-bind:class="{showing: idx == selectedResultsIdx}"
                mode="text" @click="resultsButtonClicked(idx)"
             >
                <span>
                   <span class="pool">{{r.pool.name}}</span>
                   <span :aria-label="${`has r.total results`}" class="total">({{$utils.formatNum(r.total) || '0'}})</span>
                </span>
             </V4Button>
             <V4Select v-if="results.length > maxTabs" :selections="otherSources" v-bind:attached="false" pad="4px 8px"
                :background="otherSrcBkg" :color="otherSrcColor" alignment="right"
                placeholder="More"
                @changed="poolSelected"
                v-model="otherSrcSelection"/>
          </div>
          <PoolResultDetail v-if="selectedResultsIdx > -1" />
          <div  v-if="total == 0 && selectedResultsIdx == -1" class="none">
             No results found
          </div>
       </div>
    </div>
</div>
    `;
  }

}
