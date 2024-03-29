import { html } from 'lit';
import { property, query } from 'lit/decorators.js';

import { SiteStyle } from '@uvalib/site-style';
import BentoSearchStyle from './BentoSearchStyle.js';

export class BentoSearch extends SiteStyle {
  static get styles() {
    return [
      ...super.styles,
      BentoSearchStyle
    ]
  }

  @query('input#search')
  inputEl!: HTMLInputElement;

  @property({ type: String }) query = '';

  @property({ type: String }) describe = '';

  @property({ type: String, attribute: "source-title"}) sourceTitle = 'UVA Library';

  @property({ type: String }) placeholder = 'Search everything...'; 

  render() {
    return html`

<form action="https://search.lib.virginia.edu/search" id="searchForm" method="get" @submit="${this.search}">
<span class="icon-search"></span>
	<input name="q" id="search" type="text" aria-label="${ this.placeholder }" placeholder="${ this.placeholder }" .value="${this.query}" />
	<button type="submit" class="uvalib-button-home-search" aria-label="Search" @submit="${this.search}"></button>
</form>
<p>${this.describe}</p>

    `;
  }

  search(e: { preventDefault: () => void; }) {
    e.preventDefault();
    this.query = this.inputEl.value;
    this.dispatchEvent(new Event('search', { bubbles: true, composed: true }));
  }
  
}
