import { html, LitElement, css, TemplateResult } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement('site-icon')
export class SiteIcon extends LitElement {
  @property()
  name = '';

  @property({ type: Object })
  private iconTemplate?: TemplateResult;

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

  render() {
    return this.iconTemplate;
  }

  async updated(changedProps: Map<string | number | symbol, unknown>) {
    if (changedProps.has('name') && this.name) {
      const { icon } = await import(`./icons/${this.name}.js`);
      this.iconTemplate = icon;
      this.requestUpdate();
    }
  }
}
