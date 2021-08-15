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
      <div ?hidden=${!this.result.author} class="author-wrapper">
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
            ${Object.keys(this.result.fields).map(function(fieldName){
              // convert from object to an array of fields
              return this.result.fields[fieldName];
            }.bind(this))
            .filter(fieldset=>{
              // already showed title and author
              return (fieldset[0].type === 'title')?false:
                      (fieldset[0].type === 'author')?false:
                      (fieldset[0].display === 'optional')?false:
                        true;
            })
            .map(fieldset=>{              
              let fields = fieldset[0]; 
              // return one field using seperator prop to join values
              return {
                name:fields.name,
                type:fields.type,
                label:fields.label,
                value:fieldset.map(f=>f.value).join( (fieldset[0].separator)?fieldset[0].separator:':' )
                    }
            })
            .map(field=>html`
              <dt>${field.label}:</dt>
              <dd>${field.value}
                 <!--<TruncatedText :id="{hit.identifier}-{field.name}"
                    :text="$utils.fieldValueString(field)" :limit="truncateLength"
                 />-->
              </dd>              
            `)}
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