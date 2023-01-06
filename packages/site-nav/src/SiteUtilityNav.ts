import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class SiteUtilityNav extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--site-nav-text-color, #000);
    }
  `;

  render() {
    return html`
<nav aria-labelledby="nav-label">
  <h2 class="visually-hidden" id="nav-label">Utility Nav-main</h2>
  <div id="utility-nav">
    <ul role="menu" class="ul-0">
      <slot></slot>
    </ul>
  </div>
</nav>
    `;
  }
}
