import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLightResults.css.js';
import { catalogState } from './UvalibCatalogLightState.js';
import { observeState } from 'lit-element-state';
import '@uvalib/uvalib-button/uvalib-button.js';

export class UvalibCatalogLightResults extends observeState(LitElement) {
  static get properties() {
    return {
      searching: {type: Boolean},
      basicSearch: {type: Boolean},
      hasresults: {type: Boolean},
      iskiosk: {type: Boolean}
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
    this.hasresult = false;
    this.iskiosk = false;
  }

  firstUpdated() {
  }

  render() {
    return html`
<div ?hidden="${!this.hasresults}" tabindex="-1" id="results-container" class="search-results" aria-describedby="search-summary">
    <div class="results-header" role="heading" aria-level="2">
       <template v-if="showSummary">
          <div id="search-summary" class="summary">
             <div class="query">Showing {{$utils.formatNum(total)}} results for:</div>
             <div class="qs">{{queryString}}</div>
          </div>
          <span class="buttons" role="toolbar">
             <V4Button mode="text" @click="resetSearch" >Reset Search</V4Button>
             <SaveSearch v-if="isSignedIn"/>
             <SignInRequired v-else id="save-signin-modal" act="save-search"/>
          </span>
       </template>
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
