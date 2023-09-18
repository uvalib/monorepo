// SiteNavMainItem.ts
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import SiteNavMainStyle from './SiteNavMainStyle.js';

interface NavItem {
  title: string;
  url?: string;
  below?: NavItem[];
}

export class SiteNavMainItem extends LitElement {

  static styles = SiteNavMainStyle;

  @property({ type: Object }) item!: NavItem;

  render() {
    return html`
      <li role="menuitem">
        ${this.item.url ? html`<a href="${this.item.url}" title="${this.item.title}">${this.item.title}</a>` : html`<button type="button">${this.item.title}</button>`}
        ${this.item.below && this.item.below.length ? html`
          <ul>
            ${this.item.below.map((subItem: NavItem) => html`<site-nav-main-item .item="${subItem}"></site-nav-main-item>`)}
          </ul>
        ` : ''}
      </li>
    `;
  }
}
