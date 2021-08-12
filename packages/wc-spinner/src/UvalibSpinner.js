import { html, css, LitElement } from 'lit-element';
import style from './UvalibSpinner.css.js';

export class UvalibSpinner extends LitElement {
  static get styles() {
    return [style, css`
      :host {
        display: block;
      }
    `];
  }

  static get properties() {
    return {
      message: { type: String },
      overlay: { type: Boolean },
      dots: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.message = "";
    this.overlay = false;
    this.dots = false;
  }

  render() {
    return html`
      ${this.overlay? html`
      <div class="v4-spinner-overlay">
        <div class="v4-spinner"  class="${this.dots? 'border':''}">
          ${this.dots? html`
            <h3 ?hidden="${!this.message}">${this.message}</h3>
            <div class="spinner-animation">
              <div class="bounce1" :style="{backgroundColor: color}"></div>
              <div class="bounce2" :style="{backgroundColor: color}"></div>
              <div class="bounce3" :style="{backgroundColor: color}"></div>
            </div>    
          `:html`
            <div class="book">
              <div class="book-page"></div>
              <div class="book-page"></div>
              <div class="book-page"></div>
              <p>Searching...</p>
            </div>
          `}
        </div>
      </div>
      `:html`
      <div class="v4-spinner embed">
        <h3 ?hidden="${!this.message}">${this.message}</h3>
        <div class="spinner-animation">
          <div class="bounce1" :style="{backgroundColor: color}"></div>
          <div class="bounce2" :style="{backgroundColor: color}"></div>
          <div class="bounce3" :style="{backgroundColor: color}"></div>
        </div>
      </div>
      `}    
    `;
  }
}
