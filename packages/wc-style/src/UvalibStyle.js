import { html, css, LitElement } from 'lit-element';
import colors from '@uvalib/web-styles/css/wc-styles.css.js';

export class UvalibStyle extends LitElement {
  static get styles() {
    return [
      colors,
      css`
        :host {
          display: block;
          color: var(--uvalib-brand-blue);
        }
      `,
    ];
  }

  static get properties() {
    return {
      //      title: { type: String },
      //      counter: { type: Number },
    };
  }

  constructor() {
    super();
    //  this.title = 'Hey there';
    //  this.counter = 5;
  }

  //__increment() {
  //  this.counter += 1;
  //}

  render() {
    return html` <slot></slot> `;
    //    return html`
    //      <h2>${this.title} Nr. ${this.counter}!</h2>
    //      <button @click=${this.__increment}>increment</button>
    //    `;
  }
}
