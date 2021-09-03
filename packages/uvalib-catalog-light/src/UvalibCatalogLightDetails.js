import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLightDetails.css.js';
import { catalogState } from './UvalibCatalogLightState.js';
import { observeState } from 'lit-element-state';
import '@uvalib/uvalib-spinner/uvalib-spinner.js';
import '@uvalib/uvalib-button/uvalib-button.js';
import { UvalibAnalyticsMixin } from '@uvalib/uvalib-analytics/src/analyticsMixin.js';

export class UvalibCatalogLightDetails extends observeState( UvalibAnalyticsMixin(LitElement) ) {

  static get properties() {
    return {
      item: {type: Object},
      loading: {type: Boolean}
    };
  }

  set item(value) {
    if (value) {
      let old = {...this._item};
      this._item = value;
      this.loading = true;
      this._item.fetchItem()
        .then((data)=>{
          this.loading = false;
          this.requestUpdate('item', old);    
        });
      this.requestUpdate('item', old);
    }
  }
  get item() {
    return this._item;
  }

  constructor() {
    super();
    this.item=null;
    this.loading = false;
  }

  static get styles() {
    return [css`
      :host {
        display: block;
      }
      [hidden] {
        display: none;
      }
    `,style];
  }

  _selectLastItem(){
    this._analyticsEvent(["catalogDetailPage","selectLastItem",this.item.id]);
    catalogState.focusedItem = catalogState.pools.uva_library.lastResults.find(item=>item.resultIndex === this.item.resultIndex-1);
  }
  _selectNextItem(){
    this._analyticsEvent(["catalogDetailPage","selectNextItem",this.item.id]);
    catalogState.focusedItem = catalogState.pools.uva_library.lastResults.find(item=>item.resultIndex === this.item.resultIndex+1);
  }
  _clearFocusedItem(){
    this._analyticsEvent(["catalogDetailPage","clearDetailItem",this.item.id]);
    catalogState.focusedItem = null;  
  }

  render() {
    return html`
      ${this.item? html`
      <div class="details">    
          <div class="working" ?hidden="${!this.loading}">
            <uvalib-spinner dots message="Looking up details..."></uvalib-spinner>
          </div>       
          <div ?hidden="${this.loading}">

            <div class="item-view">
              <div class="detail-header">
                <span class="paging">
                  <span class=v4-pager>
                    <uvalib-button mode="small" ?disabled="${false && this.item.resultIndex === 0}"  @click="${this._selectLastItem}}" aria-label="previous result">Previous</uvalib-button>
                    <span class="page-info">${(this.item.resultIndex+1).toLocaleString()} of ${catalogState.pools.uva_library.lastResultCount.toLocaleString()}</span>
                    <uvalib-button mode="small" ?disabled="${false && this.item.resultIndex < catalogState.pools.uva_library.lastResultCount}" @click="${this._selectNextItem}" aria-label="next result">Next</uvalib-button>
                  </span>
                  <!--<V4Pager :total="selectedResults.total" :page="selectedHit.number"
                        :prevAvailable="prevHitAvailable" :nextAvailable="nextHitAvailable"
                        @next="nextHitClicked" @prior="priorHitClicked"/>-->

                  <div class="back">
                    <uvalib-button mode="text" @click="${this._clearFocusedItem}">Return to search results</uvalib-button>
                  </div>
                </span>
              </div>
              <div class="details-content">

                <div class="header-wrapper">
                  <div class="title-wrapper">
                    <div class="full-title">
                      <span class="count-wrap">
                        <span class="count">${(this.item.resultIndex+1).toLocaleString()}</span>
                      </span>
                      <span class="hit-title">${this.item.title}</span>
                    </div>
                  </div>
                  <div ?hidden=${!this.item.author} class="author-wrapper">
                    ${this.item.author[0]}
                    <!--<TruncatedText :id="{hit.identifier}-author"
                        :text="hit.header.author_display" :limit="authorTruncateLength" />-->
                  </div>
                </div>
                <!--<SearchHitHeader v-bind:link="false" :hit="details" :pool="details.source" from="DETAIL"/>-->
                  
                <!--<abbr class="unapi-id" :title="details.itemURL"></abbr>-->
                <div class="info">
                  <!--<div v-if="itemMessage(details.source)" class="ra-box ra-fiy pad-top" v-html="itemMessage(details.source)"></div>-->
                  <dl class="fields">
                    ${this.item.fields.author && this.item.fields.author.length>0? html`
                      <dt class="label">${this.item.fields.author[0].label}:</dt>
                      <dd class="value">
                        ${this.item.fields.author.map(f=>f.value).join(this.item.fields.author[0].separator)}
                        <!--<V4LinksList id="author-links" :inline="true" :links="getBrowseLinks('author', details.header.author.value)" />-->
                      </dd>                    
                    `:''}
                    ${Object.keys(this.item.fields).filter(k=>k!='author'&&k!='full_record').map(k=>{
                      let fieldset = this.item.fields[k];
                      return html`
                      <dt class="label">${fieldset[0].label}:</dt>
                      <dd class="value">
                          ${fieldset[0].type==='subject'? 
                            // if type is subject
                            fieldset.map(f=>f.value).join(fieldset[0].separator):
                            // else if type is copyright
                            fieldset[0].type==='copyright'?'':
                            // else 
                            fieldset.map(f=>f.value).join(fieldset[0].separator)}
                            <!--<TruncatedText v-else :id="{details.identifier}-{field.label}"
                            :text="$utils.fieldValueString(field)" :limit="fieldLimit(field)" />-->
                      </dd>
                      `}
                    )}  
<!--                    
                        <dt class="label">Citations:</dt>
                        <dd class="value">
                            <CitationsList />
                        </dd>
-->
                      </dl>
                  </div>
                </div>
            </div>            
            <!--<ItemView v-else />-->
          </div>  
      </div>
      `:''}
    `;
  }

}