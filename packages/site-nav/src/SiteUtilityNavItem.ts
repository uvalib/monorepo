import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class SiteUtilityNavItem extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--site-nav-text-color, #000);
    }
  `;

  @property({ type: String }) href = null;

  render() {
    return html`
      <li role="menuitem" class="li-0">
        <a href="${this.href}"><slot></slot></a>
      </li>
    `;
  }
}
