import { html, css, LitElement } from 'lit-element';
import '@uvalib/uvalib-header/uvalib-header.js';
import style from './UvalibPage.css.js';

export class UvalibPage extends LitElement {
  static get styles() {
    return style;
  }

  static get properties() {
    return {
      hassidebar: { type: Boolean },
      nofooter: { type: Boolean },
      nolinks: { type: Boolean },
      nolightdomstyle: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.nofooter = false;
    this.hassidebar = false;
    this.nolinks = false;
    this.nolightdomstyle = false;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // ensure that we don't have any padding/margins set in ancestors nodes
    let nodes = [];
    let element = this;
    while(element.parentNode) {
      nodes.unshift(element.parentNode);
      element = element.parentNode;
    }
    nodes.forEach((e)=>{
      if (e.style) {
        e.style.margin="0";
        e.style.padding="0";
      }
    });

    if (!this.nolightdomstyle) {
      // This is a bit of a no no but ::slotted only affects first level elements in light dom
      this.lightStyle = document.createElement("link");
      this.lightStyle.setAttribute('appendedlightdomstyle','');
      this.lightStyle.setAttribute('rel','stylesheet');
      this.lightStyle.setAttribute('href','https://unpkg.com/@uvalib/web-styles/css/styles.css');
      this.appendChild(this.lightStyle);
    }

  }

  firstUpdated() {
    window.document.body.removeAttribute('unresolved');
    this._checkForSideSlotted();
    if (!this.nofooter) import('@uvalib/uvalib-footer/uvalib-footer.js');
  }

  // See if the sidebar has been slotted so that we can display or not
  _checkForSideSlotted() {
    let sideslots = [
      this.shadowRoot.querySelector("#side-nav"),
      this.shadowRoot.querySelector("#side-aside")
    ];
    let slotsfilled = false;
    sideslots.forEach(function(s){
      slotsfilled = slotsfilled? slotsfilled:s.assignedNodes()?.length;
      s.addEventListener('slotchange', function(e){
        this._checkForSideSlotted();
      }.bind(this));
    }.bind(this));
    this.hassidebar = slotsfilled;
  }

  render() {
    return html`
    <div id="container">
      <uvalib-header ?nolinks="${this.nolinks}"><slot name="header"></slot></uvalib-header>
      <div id="center">
        <main><slot></slot></main>
        <div id="sidebar" ?hidden="${!this.hassidebar}">
          <nav><slot id="side-nav" name="side-nav"></slot></nav>
          <aside><slot id="side-aside" name="side-aside"></slot></aside>
        </div>
      </div>
      <uvalib-footer ?nolinks="${this.nolinks}" ?hidden="${this.nofooter}"><slot name="footer"></slot></uvalib-footer>
    </div>
    `;
  }
}
