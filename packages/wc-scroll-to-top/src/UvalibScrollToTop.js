import { html, css, LitElement } from 'lit-element';
import '@uvalib/uvalib-icon/uvalib-icon.js';
import style from './UvalibScrollToTop.css.js';
import { UvalibAnalyticsMixin } from '@uvalib/uvalib-analytics/src/analyticsMixin.js';

export class UvalibScrollToTop extends UvalibAnalyticsMixin(LitElement) {
  static get styles() {
    return [css`
      :host {
        display: block;
      }
    `, style];
  }

  static get properties() {
    return {
      offsetTrigger: {type: Number},
      scrolling: {type: Boolean},
      showScrollTop: {type: Boolean},
      _mobile: {type: Boolean}
    };
  }

  constructor() {
    super();
    this.showScrollTop = false;
    this.scrolling = false;
    this.offsetTrigger = 100;
  }

  firstUpdated() { 
    document.addEventListener(
      'scroll',
      function(){this.scrolling = true}.bind(this),
      { passive: true }
    );
    setInterval(function (){
      if (this.scrolling) {
        this.scrolling = false;
        if (window.scrollY >= this.offsetTrigger) this.showScrollTop = true;
        else this.showScrollTop = false;
      }
    }.bind(this), 300);
  }

  //When the user clicks on the button, scroll to the top of the document
  _topFunction() {
    document.body.scrollTop = 0; // For Chrome, Safari and Opera
    document.documentElement.scrollTop = 0; // For IE and Firefox
    window.focus();
    this._analyticsEvent(['uvalibScrollTop','backtotop']);
  }

  render() {
    return html`
    <div ?show="${this.showScrollTop}" role="button" ?mobile="${()=>{}}"
    @click="${this._topFunction}" tab-index="0" aria-label="scroll to top of page"
    class="scroll-to-top">
      <uvalib-icon icon-id="uvalib:general:angleup"></uvalib-icon>
    </div>    
    `;
  }
}
