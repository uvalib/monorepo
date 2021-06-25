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
//      title: { type: String },
//      counter: { type: Number },
    };
  }

  constructor() {
    super();
//    this.title = 'Hey there';
//    this.counter = 5;
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

//  __increment() {
//    this.counter += 1;
//  }

  render() {
    return html`
    <div id="container">
      <uvalib-header></uvalib-header>
      <main><slot></slot></main>
      <uvalib-footer></uvalib-footer>
    </div>
    `;
  }
}
