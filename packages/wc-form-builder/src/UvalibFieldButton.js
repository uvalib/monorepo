import { html, css, LitElement } from 'lit';
import '@uvalib/uvalib-button/uvalib-button.js';
import { UvalibField } from './UvalibField.js';

export class UvalibFieldButton extends UvalibField {
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
