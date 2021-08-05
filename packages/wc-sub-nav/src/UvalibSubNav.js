import { html, css, LitElement } from 'lit-element';
import style from './UvalibSubNav.css.js';

export class UvalibSubNav extends LitElement {
  static get styles() {
    return [style];
  }

  static get properties() {
    return {
      title: { type: String },
    };
  }

  render() {
    return html`
      <div id="content">
        <h4>${this.title}</h4>
        <ul>
          <slot></slot>
        </ul>
      </div>
    `;
  }
}
