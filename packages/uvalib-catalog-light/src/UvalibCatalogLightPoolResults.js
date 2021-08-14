import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLightPoolResults.css.js';
import { catalogState } from './UvalibCatalogLightState.js';
import { observeState } from 'lit-element-state';
import '@uvalib/uvalib-button/uvalib-button.js';

export class UvalibCatalogLightPoolResults extends observeState(LitElement) {
  static get properties() {
    return {
   
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
   
  }

  firstUpdated() {
  }

  render() {
    return html`
<div class="pool-results">
   <div class="pool-header">
      <div class="desc" v-html="selectedResults.pool.description">${(catalogState.pools && catalogState.pools.uva_library)? catalogState.pools.uva_library.description:''}</div>
   </div>
   ${catalogState.pools && !catalogState.searching? html`
      <div  class="hits" role="region" aria-label="search results">
         <div class="hits-content" role="list">
            ${catalogState.pools.uva_library.lastResults.map((hit,index)=>html`
               <div role="listitem" class="hit-wrapper">
                  <SearchHit :pool="selectedResults.pool.id" :count="hit.number" :hit="hit"/>
               </div>            
            `)}
         </div>
      </div>
      <span role="toolbar"  v-if="selectedResults.hits.length > 0">
            <V4Button v-if="hasMoreHits" mode="primary" @click="loadMoreResults">
               <span v-if="loadingMore">
                  <V4Spinner v-if="loadingMore" color="white"/>
               </span>
               <span v-else>Load More Results</span>
            </V4Button>
      </span>   
   `:''}
      </div>
    `;
  }

}
