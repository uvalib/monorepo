import { html, css, LitElement } from 'lit-element';
import '@uvalib/uvalib-header/uvalib-header.js';
import '@uvalib/uvalib-footer/uvalib-footer.js';
import style from './UvalibPage.css.js';

export class UvalibPage extends LitElement {
  static get styles() {
    return style;
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
  }

  render() {
    return html`
    <div id="container">
      <uvalib-header><slot name="header"></slot></uvalib-header>
      <div id="center">
        <main><slot></slot></main>
        <div id="sidebar">
          <nav><slot name="side-nav"></slot></nav>
          <aside><slot name="side-aside"></slot></aside>
        </div>
      </div>
      <uvalib-footer><slot name="footer"></slot></uvalib-footer>
    </div>
    `;
  }
}
