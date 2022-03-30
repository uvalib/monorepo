import { html, css, LitElement } from 'lit';
import {UvalibAnalyticsMixin} from '@uvalib/uvalib-analytics/src/analyticsMixin.js';
import './UvalibModalImageButton.js';
import '@uvalib/uvalib-icon/uvalib-icon.js';
import style from './UvalibImage.css.js';

export class UvalibImage extends UvalibAnalyticsMixin(LitElement) {
  static get styles() {
    return [style];
  }

  static get properties() {
    return {
      src: { type: String },
      alt: { type: String },
      _enlargable: { type: Boolean },
      enlargable: { type: Boolean },
      enlargableMinWidth: { type: Number },
      title: { type: String },
      loading: {type: String }
    };
  }

  constructor() {
    super();
    this.enlargableMinWidth = 768;
    this.enlargable = false;
    this._enlargable = false;
    this.loading = "lazy";
    this.setAttribute('tabindex',0);
    this.addEventListener('focus', this.focus);

  }

  _getScreenWidth() {  
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  _handleResize() {
    this._enlargable = this.enlargable && this._getScreenWidth() >= this.enlargableMinWidth;
  }

  firstUpdated() {
    if (!this.alt && this.alt!="") console.error("uvalib-image needs an alt attribute even if it is empty!");
    this._img = this.shadowRoot.querySelector('img');
    this.setAttribute("aria-label",this.alt);
    this._handleResize();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._handleResize.bind(this) );
  }
  disconnectedCallback() {
    window.removeEventListener('resize', this._handleResize.bind(this) );
    super.disconnectedCallback();
  }

  render() {
    return (this.alt||this.alt=="")?
      html`
      <div class="wrapper">
        ${this._enlargable? html`<uvalib-modal-image-button alt="Enlarge image of ${this.alt}" src="${this.src}" title="${this.title}"><uvalib-icon icon-id="uvalib:general:searchplus" aria-label="enlarge image" role="image"></uvalib-icon></uvalib-modal-image-button>`:''}
        <div id="image" ?enlargable="${this._enlargable}" @click="${this.enlarge}"><img loading="${this.loading}" src="${this.src}" title="${this.title || this.alt}" /></div>
      </div>  
      `:
      html`<!-- uvalib-image needs an alt attribute even if it is empty! -->`;
  }

  focus() {
    console.log("focused");
    if (!this.button) this.button = this.shadowRoot.querySelector('uvalib-modal-image-button');
    if (this.button) this.button.focus();
  }

  enlarge() {
    if (this._enlargable) {
      if (!this.button) this.button = this.shadowRoot.querySelector('uvalib-modal-image-button');
      this.button.enlarge();
    }
  }
}
