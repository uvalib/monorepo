/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { SiteStyle } from '@uvalib/site-style';
import BentoSearchStyle from './BentoSearchStyle.js';

export class BentoSearch extends SiteStyle {
  static get styles() {
    return [
      ...super.styles,
      BentoSearchStyle
    ]
  }

  @property({ type: String }) query = '';

  @property({ type: String, attribute: "source-title"}) sourceTitle = 'UVA Library';

  render() {
    return html`
      <input id="search" .value="${this.query}" @keyup="${(e: { key: string; keyCode: number; })=>{if (e.key === 'Enter' || e.keyCode === 13) this.search()}}"></input>
      <button @click="${this.search}">Search</button>
    `;
  }

  search(){
    const input = <HTMLInputElement>this.renderRoot?.querySelector('#search');
    this.query = input.value;
    this.dispatchEvent(new Event('search',{bubbles: true, composed:true}))
  }
}
