/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class BentoSearch extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--bento-box-text-color, #000);
    }
  `;

  @property({ type: String }) keyword = '';

  @property({ type: String, attribute: "source-title"}) sourceTitle = 'UVA Library';

  render() {
    return html`
      <input id="search" .value="${this.keyword}"></input>
      <button @click="${this.search}">Search</button>
    `;
  }

  search(){
    const input = <HTMLInputElement>this.shadowRoot?.getElementById('search');
    this.keyword = input.value;
    this.dispatchEvent(new Event('search',{bubbles: true, composed:true}))
  }
}
