import { html, css, LitElement } from 'lit-element';
import '@uvalib/uvalib-header/uvalib-header.js';
import '@uvalib/uvalib-footer/uvalib-footer.js';
import style from './UvalibPage.css.js';

export class UvalibPage extends LitElement {
  static get styles() {
    return style;
  }

  static get properties() {
    return {
      hassidebar: { type: Boolean }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    window.document.body.removeAttribute('unresolved');
    this.hassidebar = false;
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
  }

  firstUpdated() {
    this._checkForSideSlotted();
  }

  // See if the sidebar has been slotted so that we can display or not
  _checkForSideSlotted() {
    let sideslots = [
      this.shadowRoot.querySelector("#side-nav"),
      this.shadowRoot.querySelector("#side-aside")
    ];
//    this.hassidebar = 
//      sideslots[0].assignedNodes()?.length ||
//      aside[1].assignedNodes()?.length;
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
      <uvalib-header><slot name="header"></slot></uvalib-header>
      <div id="center">
        <main><slot></slot></main>
        <div id="sidebar" ?hidden="${!this.hassidebar}">
          <nav><slot id="side-nav" name="side-nav"></slot></nav>
          <aside><slot id="side-aside" name="side-aside"></slot></aside>
        </div>
      </div>
      <uvalib-footer><slot name="footer"></slot></uvalib-footer>
    </div>
    `;
  }
}
