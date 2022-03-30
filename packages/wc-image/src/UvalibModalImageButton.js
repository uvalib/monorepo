import { html, css, LitElement } from 'lit';
import {UvalibAnalyticsMixin} from '@uvalib/uvalib-analytics/src/analyticsMixin.js';
import '@uvalib/uvalib-icon/uvalib-icon.js';
import style from './UvalibModalImageButton.css.js';
import BigPicture from 'bigpicture/src/BigPicture.js';

export class UvalibModalImageButton extends UvalibAnalyticsMixin(LitElement) {
  static get styles() {
    return [style];
  }

  static get properties() {
    return {
      src: { type: String },
      alt: { type: String },
      title: { type: String },
      loading: {type: String }
    };
  }

  constructor() {
    super();
    this.loading = "lazy";
    this.setAttribute('tabindex',0);
    this.addEventListener('focus', this.focus);
  }

  _getScreenWidth() {  
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  firstUpdated() {
    if (!this.alt && this.alt!="") console.error("uvalib-image needs an alt attribute even if it is empty!");
  }

  render() {
    return (this.alt||this.alt=="")?
      html`<button class="wrapper" @click="${this.enlarge}" aria-label="Enlarge image of ${this.alt}"><slot></slot></button>`:
      html`<!-- uvalib-image needs an alt attribute even if it is empty! -->`;
  }

  focus() {
    console.log("focused");
    this.shadowRoot.querySelector('button').focus();
  }

  enlarge() {
      BigPicture({
        el: this,
        imgSrc: this.src, 
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

window.customElements.define('uvalib-modal-image-button', UvalibModalImageButton);