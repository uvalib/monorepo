import { html, css, LitElement } from 'lit';
import { UvalibField } from './UvalibField.js';

export class UvalibFieldHTMLMarkup extends UvalibField {
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
    return (this.element && this.element.markup)? html`this.element.markup`:'';
  }
}

window.customElements.define('uvalib-field-html-markup', UvalibFieldHTMLMarkup);
