/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class BentoCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--bento-box-text-color, #000);
    }
  `;

  @property({ type: String }) keyword = 'Hey there';

  @property({ type: Number }) counter = 5;

  __increment() {
    this.counter += 1;
  }

  render() {
    return html`
      <h2>${this.keyword} Nr. ${this.counter}!</h2>
      <button @click=${this.__increment}>increment</button>
    `;
  }
}
