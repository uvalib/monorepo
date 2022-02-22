import { html, css, LitElement } from 'lit';
import '@uvalib/uvalib-button/uvalib-button.js';
import { UvalibField, UvalibFieldGeneric } from './UvalibFieldGeneric.js';

export class UvalibFieldButton extends UvalibFieldGeneric {
  static get styles() {
    return css`
    `;
  }

  static get properties() {
    return {
    };
  }

  constructor() {
    super();
    this.label = "submit";
  }

  render() {
    return html`
      <uvalib-button id="${this.key}" name="${this.label}" ?disabled="${this.disabled}">${this.label}</uvalib-button>
    `;
  }
}

window.customElements.define('uvalib-field-button', UvalibFieldButton);
