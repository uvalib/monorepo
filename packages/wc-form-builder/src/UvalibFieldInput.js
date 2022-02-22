import { html, css, LitElement } from 'lit';
import { UvalibField } from './UvalibFieldGeneric.js';

export class UvalibFieldInput extends UvalibFieldGeneric {
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
    return html`
    <div class="form-field">
      <label class="field-label" for="${ this.element.webform_key  }">${ this.element.title }
        ${ this._isRequired(this.element)? html`<span class="required" aria-hidden="true">*</span><span class="hidden">required</span>`:'' }
      </label>
      ${ this._hasDescription(this.element)? html`<div class="descriptive-text">${ this.element.description.markup }</div>`:'' }
      <input type="${ this.element.type }" id="${ this.element.webform_key }" name="${ this.element.name }" ?required="${ this._isRequired(this.element) }" aria-required="${ this._ariaRequired(this.element) }" value="${this.element.value}" @change="${ this._changedValue }" aria-invalid="${ this._ariaInvalid }" aria-describedby="${ this._ariaDescribedBy }" min="${ this.element.min }" step="${ this.element.step }"/>
      <div id="${ this._ariaDescribedBy }" class="uvalib-icon-exclamation-circle validation-message" ?hidden="${ this._hideMessage }"><span ?hidden="${ this._syntaxInvalid }">${ this.element.required_error }</span> <span ?hidden="${ !this._syntaxInvalid }">${ this.element.syntax_error }</span></div>
    </div>    
    `;
  }
}

window.customElements.define('uvalib-field-input', UvalibFieldInput);
