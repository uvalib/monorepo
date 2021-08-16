import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLightDetails.css.js';
import { catalogState } from './UvalibCatalogLightState.js';
import { observeState } from 'lit-element-state';
import '@uvalib/uvalib-spinner/uvalib-spinner.js';
import '@uvalib/uvalib-button/uvalib-button.js';
import '@uvalib/uvalib-icon/uvalib-icon.js';

export class UvalibCatalogLightDetails extends observeState(LitElement) {

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
    catalogState.focusedItem = catalogState.pools.uva_library.lastResults.find(item=>item.resultIndex === this.item.resultIndex-1);
console.log("select last search result");
  }
  _clearFocusedItem(){
    catalogState.focusedItem = null;
console.log("reset selected search to bring back results");    
  }

  render() {
    return html`
      ${this.item? html`
      <div class="details">    
          <div class="working" ?hidden="${!this.loading}">
            <uvalib-spinner message="Looking up details..."></uvalib-spinner>
          </div>       
          <div ?hidden="${this.loading}">

            <div class="item-view">
              <div class="detail-header">
                <span class="paging">

                  <span class=v4-pager>
                      <uvalib-button mode="small" ?disabled="${this.item.searchIndex === 0}"  @click="${this._selectLastItem}}" aria-label="previous result">
                        <uvalib-icon icon-id="uvalib:general:arrowleft" ></uvalib-icon>
                      </uvalib-button>
                      <span class="page-info">
                        {{$utils.formatNum(page)}} of {{$utils.formatNum(total)}}
                      </span>
                      <V4Button mode="small"  :disabled="!nextAvailable" @click="$emit('next')" aria-label="next result">
                        <i class="fal fa-arrow-right"></i>
                      </V4Button>
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
                  <SearchHitHeader v-bind:link="false" :hit="details" :pool="details.source" from="DETAIL"/>
                  <abbr class="unapi-id" :title="details.itemURL"></abbr>
                  <div class="info">
                      <div v-if="itemMessage(details.source)" class="ra-box ra-fiy pad-top" v-html="itemMessage(details.source)">
                      </div>
                      <dl class="fields">
                        <template v-if="details.header.author">
                            <dt class="label">{{details.header.author.label}}:</dt>
                            <dd class="value">
                              <V4LinksList id="author-links" :inline="true" :links="getBrowseLinks('author', details.header.author.value)" />
                            </dd>
                        </template>
                        <template v-for="(field,idx) in allDisplayFields"  :key="lv{idx}">
                            <dt class="label">{{field.label}}:</dt>
                            <dd class="value">
                              <V4LinksList v-if="field.type == 'subject'" :id="{field.type}-links"
                                  :links="getBrowseLinks('subject', field.value)" />
                              <span class="related" v-else-if="field.type=='related-url'">
                                  <div class="related-item" v-for="(v,idx) in field.value" :key="related-{idx}">
                                    <a :id="rl-{idx}" class="link-button" :href="v.url" target="_blank">{{v.label}}</a>
                                  </div>
                              </span>
                              <span class="copyright" v-else-if="field.type=='copyright'">
                                  <img :aria-label="{field.item} icon" :src="copyrightIconSrc(field)">
                                  <a :href="field.value" target="_blank">{{field.item}}</a>
                                  <a  v-if="field.name == 'copyright_and_permissions'" class="cr-note"
                                    href="https://www.library.virginia.edu/policies/use-of-materials" target="_blank"
                                  >
                                    More about Rights and Permissions<i style="margin-left:5px;" class="fal fa-external-link-alt"></i>
                                  </a>
                              </span>
                              <TruncatedText v-else :id="{details.identifier}-{field.label}"
                                  :text="$utils.fieldValueString(field)" :limit="fieldLimit(field)" />
                            </dd>
                        </template>
                        <template v-if="accessURLField && !isKiosk">
                            <dt class="label">{{accessURLField.label}}:</dt>
                            <dd class="value">
                              <AccessURLDetails mode="full" :title="details.header.title" :pool="details.source" :urls="accessURLField.value" />
                            </dd>
                        </template>
                        <dt class="label">Citations:</dt>
                        <dd class="value">
                            <CitationsList />
                        </dd>
                        <template v-if="hasExtLink">
                            <dd></dd>
                            <dt class="value more">
                              <a :href="extDetailURL" target="_blank" @click="extDetailClicked">
                                  More Details<i style="margin-left:5px;" class="fal fa-external-link-alt"></i>
                              </a>
                            </dt>
                        </template>
                      </dl>
                      <template v-if="marcXML">
                        <AccordionContent class="marc" id="maxc-xml">
                            <template v-slot:title>MARC XML</template>
                            <pre class="xml">{{marcXML}}</pre>
                        </AccordionContent>
                      </template>
                  </div>
                </div>
                <DigitalContent />
                <template v-if="details.source != 'images'">
                  <Availability v-if="hasAvailability(details.source)" :titleId="details.identifier" />
                  <ShelfBrowse v-if="!details.searching" :hit="details" :pool="details.source" :target="browseTarget"/>
                </template>
            </div>            
            <!--<ItemView v-else />-->
          </div>  
      </div>
      `:''}
    `;
  }

}