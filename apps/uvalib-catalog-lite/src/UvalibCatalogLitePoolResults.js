import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLitePoolResults.css.js';
import { catalogState } from './UvalibCatalogLiteState.js';
import { observeState } from 'lit-element-state';
import '@uvalib/uvalib-button/uvalib-button.js';
import './uvalib-catalog-lite-result.js';


export class UvalibCatalogLitePoolResults extends observeState(LitElement) {
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

  render() {
    return html`
<div class="pool-results">
   <div class="pool-header">
      <div class="desc" v-html="selectedResults.pool.description">${(catalogState.pools && catalogState.pools.uva_library)? catalogState.pools.uva_library.description:''}</div>
   </div>
   ${catalogState.pools && !catalogState.searching? html`
      <div  class="hits" role="region" aria-label="search results">
         <div class="hits-content" role="list">
            ${catalogState.pools.uva_library.lastResults?
               catalogState.pools.uva_library.lastResults.map((hit,index)=>html`
               <div role="listitem" class="hit-wrapper">
                  <uvalib-catalog-lite-result .pool="${catalogState.pools.uva_library}" .result="${hit}" .index="${index+1}"></uvalib-catalog-lite-result>
               </div>            
            `):''}
         </div>
      </div>
      <span role="toolbar"  v-if="selectedResults.hits.length > 0">
         <uvalib-button ?hidden="${!catalogState.pools || !catalogState.pools.uva_library.hasMoreHits}" mode="primary" @click="${this._moreResults}">
            <span ?hidden="${!catalogState.searching}">
               <uvalib-spinner dots color="white"></uvalib-spinner>
            </span>
            <span ?hidden="${catalogState.searching}">Load More Results</span>
         </uvalib-button>
      </span>   
   `:''}
      </div>
    `;
  }

  _moreResults(){
console.log("more results...");     
      this.dispatchEvent( 
      new CustomEvent('moreresults', {
         composed: true,
         bubbles: true,
         detail: { }
      }));
  }
}
