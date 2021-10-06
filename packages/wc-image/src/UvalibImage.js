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
//    this.setAttribute('role',"img");
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
        ${this._enlargable? html`<button @click="${this.enlarge}" ><uvalib-icon icon-id="uvalib:general:searchplus" aria-label="enlarge image" role="image"></uvalib-icon></button>`:''}
        <div id="image" ?enlargable="${this._enlargable}" @click="${this.enlarge}"><img loading="${this.loading}" src="${this.src}" title="${this.title || this.alt}" /></div>
      </div>  
      `:
      html`<!-- uvalib-image needs an alt attribute even if it is empty! -->`;
  }

  focus() {
    console.log("focused");
    this.shadowRoot.querySelector('button').focus();
    this.scrollIntoView();
  }

  enlarge() {
    if (this._enlargable) {
      BigPicture({
        el: this._img, 
        animationEnd: ()=>{ 
          document.querySelector('#bp_caption').style.display = "none";
          let closeButton = document.querySelector('#bp_container .bp-x');
          let icon = closeButton.querySelector('svg');
          let title = document.createElement('title');
          title.id="title";
          title.setAttribute('lang','en');
          title.textContent = "Close";
          icon.appendChild(title);
          icon.setAttribute('aria-labeledby','title');
          closeButton.focus();
        },
        onClose: function(){ 
          this.focus(); 
        }.bind(this)
      });
    }
  }
}
