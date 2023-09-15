// SiteNavMain.ts
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { SiteStyle } from '@uvalib/site-style';
import { SiteAnalyticsMixin } from '@uvalib/site-analytics/SiteAnalyticsMixin.js';
import './site-nav-main-item.js'; // Import the SiteNavMainItem component

export class SiteNavMain extends SiteAnalyticsMixin(SiteStyle) {

  static get styles() {
    return [
      ...super.styles,
      css``
    ];
  }

  @property({ type: Array }) items = [];

  render() {
    return html`
      <nav role="navigation" class="main-nav">
        <h2 class="visually-hidden">Main navigation</h2>
        <ul>
          ${this.items.map(item => html`<site-nav-main-item .item="${item}"></site-nav-main-item>`)}
        </ul>
      </nav>
    `;
  }
}
