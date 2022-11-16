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

  render() {
    return html`
      <h2>Search for ${this.keyword}</h2>
    `;
  }
}
