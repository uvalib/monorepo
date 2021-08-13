import 'lit-virtualizer';
import { LitElement, html, css } from 'lit-element';
import '@spectrum-web-components/bundle/elements.js';

export class UvalibCatalogLightResult extends LitElement {
  static get properties() {
    return {
      result: {type: Object},
      index: {type: Number}
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  render() {
    return html`
    <div>${this.result.title}</div>
    `;
  }

}
