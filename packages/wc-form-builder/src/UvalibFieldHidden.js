import { html, css, LitElement } from 'lit';
import { UvalibField } from './UvalibField.js';

export class UvalibFieldHidden extends UvalibField {
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
  }

  render() {
    console.log("hidden field element:");
    console.log(this.element);
    return html`
      <div class="form-field">
        <input type="${ this.element.type }" id="${ this.element.webform_key } name="${ this.element.name }" value="${this.element.value}" @change="_changedValue"/>
      </div>
    `;
  }
}

window.customElements.define('uvalib-field-hidden', UvalibFieldHidden);
