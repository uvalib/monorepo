import { html, LitElement, css } from 'lit';
import { property } from 'lit/decorators.js';

export class SiteIcon extends LitElement {
  @property()
  name = '';

  static get styles() {
    return css`
      :host {
        display: inline-block;
        width: var(--site-icon-width, 24px); 
        height: var(--site-icon-height, 24px);
        fill: var(--site-icon-fill, currentColor);
      }
      svg {
        width: 100%;
        height: 100%;
      }
      svg::part(icon) {
        fill: inherit;
      }
    `;
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.name  && this.shadowRoot) {
      const { icon } = await import(`./icons/${this.name}.js`);
      this.shadowRoot.innerHTML = icon;
      this.shadowRoot.querySelector('svg')?.setAttribute('part', 'icon');
    }
  }
}
