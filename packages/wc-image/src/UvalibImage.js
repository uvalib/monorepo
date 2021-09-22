import { html, css, LitElement } from 'lit';
import {UvalibAnalyticsMixin} from '@uvalib/uvalib-analytics/src/analyticsMixin.js';
import '@uvalib/uvalib-icon/uvalib-icon.js';
import style from './UvalibImage.css.js';
import BigPicture from 'bigpicture/src/BigPicture.js';

export class UvalibImage extends UvalibAnalyticsMixin(LitElement) {
  static get styles() {
    return [style];
  }

  static get properties() {
    return {
      src: { type: String },
      alt: { type: String },
      enlargable: { type: Boolean },
      title: { type: String }
    };
  }

  constructor() {
    super();
    this.enlargable = false;
  }

  firstUpdated() {
    if (!this.alt) console.error("uvalib-image needs an alt attribute even if it is empty!");
    this._img = this.shadowRoot.querySelector('img');
  }

  render() {
    return this.alt?
      html`
        ${this.enlargable? html`<button @click="${this.enlarge}"><uvalib-icon icon-id="uvalib:general:plus" ></uvalib-icon><span class="sr-only">enlarge image</span></button>`:''}
        <span id="image" ?enlargable="${this.enlargable}" @click="${this.enlarge}"><img src="${this.src}" title="${this.title || this.alt}" alt="${this.alt}" /></span>
      `:
      html`<!-- uvalib-image needs an alt attribute even if it is empty! -->`;
  }

  enlarge() {
    if (this.enlargable) BigPicture({el: this._img});
  }
}
