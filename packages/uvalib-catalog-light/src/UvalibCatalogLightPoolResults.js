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
       <div v-if="hasLogo" class="source-logo">
          <a v-if="hasURL" :href="poolExtURL(selectedResults.pool.id)" target="_blank">
             <img class ="logo" :src="poolLogo(selectedResults.pool.id)">
          </a>
           <img v-else class ="logo" :src="poolLogo(selectedResults.pool.id)">
       </div>
       <SearchFilters />
       <div class="sort-section">
          <V4Sort :pool="selectedResults.pool" />
       </div>
    </div>
    <template v-if="!searching">
       <div  v-if="selectedResults.hits.length == 0" class="hit-wrapper none">
          <div class="timeout" v-if="selectedResults.statusCode == 408">
             <span>Search timed out</span>
             <p class="note">
                Sorry, the source providing this data took too long to respond.  You may wish to try your search again, or try a different search.
                If the problem persists, <a href='https://www.library.virginia.edu/askalibrarian' target='_blank'>Ask a Librarian</a> may be able to help.
             </p>
             <V4Button mode="primary" @click="retrySearch">Retry Search</V4Button>
          </div>
          <template v-else>
             <span>No results found</span>
             <p class="error" v-if="selectedResults.statusCode != 200 && selectedResults.statusMessage">
                {{selectedResults.statusMessage}}
             </p>
             <ExpandSearch />
          </template>
       </div>
       <div v-else class="hits" role="region" aria-label="search results">
          <ul v-if="selectedResults.pool.mode=='image'" class="image hits-content" role="list">
             <li role="listitem" v-for="hit in selectedResults.hits" class="image hit-wrapper" :key="img-hit.identifier">
                <ImageSearchHit :pool="selectedResults.pool.id" :hit="hit"/>
             </li>
          </ul>
          <div v-else class="hits-content" role="list">
             <div role="listitem" v-for="hit in selectedResults.hits" class="hit-wrapper" :key="hit-hit.number}-hit.identifier">
                <SearchHit :pool="selectedResults.pool.id" :count="hit.number" :hit="hit"/>
             </div>
          </div>
       </div>
       <span role="toolbar"  v-if="selectedResults.hits.length > 0">
          <ExpandSearch class="expand-panel" />

          <V4Button v-if="hasMoreHits" mode="primary" @click="loadMoreResults">
             <span v-if="loadingMore">
                <V4Spinner v-if="loadingMore" color="white"/>
             </span>
             <span v-else>Load More Results</span>
          </V4Button>
       </span>
    </template>
 </div>
    `;
  }

}
