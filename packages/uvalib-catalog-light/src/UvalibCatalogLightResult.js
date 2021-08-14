import { LitElement, html, css } from 'lit-element';
import style from './UvalibCatalogLightResult.css.js';

export class UvalibCatalogLightResult extends LitElement {
  static get properties() {
    return {
      result: {type: Object},
      index: {type: Number},
      pool: {type: Object}
    };
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

  render() {
    return html`
<div class="inner-hit-wrapper" class="hit">
  <div class="hit" data-identifier="${this.result.id}">
    <div class="header-wrapper">
      <div class="title-wrapper">
        <div class="full-title">
          <span class="count-wrap">
            <span class="count">${this.index}</span>
          </span>
          <span class="routerLink" @click="${this._detailClicked}">
            <span class="hit-title">${this.result.title}</span>
            <span ?hidden="${!this.result.subtitle}" class="hit-subtitle">${this.result.subtitle}</span>
          </span>
        </div>
      </div>
      <div v-if="hit.header.author_display" class="author-wrapper">
        ${this.result.author}
        <!--<TruncatedText :id="{hit.identifier}-author"
            :text="hit.header.author_display" :limit="authorTruncateLength" />-->
      </div>
    </div>
    <!--<SearchHitHeader :maxLen="60" :count="count" :hit="hit" :pool="pool" from="SEARCH"/>-->

    <div class="details-wrap">
      <div class="details">
        <div class="basic">
          <dl class="fields">
            
            <template v-for="(field,idx) in hit.basicFields">
                <template v-if="shouldDisplay(field)">
                   <dt :key="getKey(field,k{idx})">{{field.label}}:</dt>
                   <dd :key="getKey(field,v{idx})" >
                      <TruncatedText :id="{hit.identifier}-{field.name}"
                         :text="$utils.fieldValueString(field)" :limit="truncateLength"
                      />
                   </dd>
                </template>
             </template>
             <template v-if="accessURLField && !isKiosk">
                <dt class="label">{{accessURLField.label}}:</dt>
                <dd class="value">
                   <AccessURLDetails mode="brief" :title="hit.header.title" :pool="pool" :urls="accessURLField.value" />
                </dd>
             </template>
          </dl>
       </div>
       <router-link v-if="hit.cover_image" @mousedown="detailClicked"
          class="img-link" :to="detailsURL"  :aria-label="{hit.header.title}"
       >
          <img class="cover-img" v-if="hit.cover_image" aria-label=" " :src="hit.cover_image"/>
       </router-link>
    </div>
    <div class="digital-content">
       <V4DownloadButton v-if="pdfDownloadURL"
          icon="far fa-file-pdf" label="Download PDF" :url="pdfDownloadURL"
          :aria-label="download pdf for {hit.header.title}"
       />
       <V4DownloadButton v-if="ocrDownloadURL" icon="far fa-file-alt"
          label="Download OCR" :url="ocrDownloadURL"
          :aria-label="download ocr for {hit.header.title}"
       />
    </div>
 </div>    
    <!--<SearchHitDetail :hit="hit" :pool="pool"/>-->
  </div>
</div>
    `;
  }

}