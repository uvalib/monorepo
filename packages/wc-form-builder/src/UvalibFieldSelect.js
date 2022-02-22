import { html, css } from 'lit';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import { UvalibFieldGeneric } from './UvalibFieldGeneric.js';

export class UvalibFieldSelect extends UvalibFieldGeneric {
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
      <label class="field-label" for="${ this.element.webform_key }">${ this.element.title }
        ${ this._isRequired(this.element)? html`<span class="required" aria-hidden="true">*</span><span class="hidden">required</span>`:'' }
      </label>
      ${ this._hasDescription(this.element)? html`<div class="descriptive-text">${unsafeHTML(this.element.description.markup)}</div>`:'' }
      <select id="${this.element.webform_key}" name="${this.element.name}" ?required="${this._isRequired(this.element)}" aria-required="${this._ariaRequired(this.element)}" value="${this.element.value}" @change="${ this._changedValue }" aria-invalid="${this._ariaInvalid}" aria-describedby="${this._ariaDescribedBy}">
        ${ Object.values(this.element.options).filter(opt=>this._isValidOption(opt)).map(opt=>html`
            <option ?selected="${this._selectedValue(this.element, opt)}" value="${this._optionValue(opt)}">${opt}</option>
        `) }
      </select>
      <div id="${this._ariaDescribedBy}" class="uvalib-icon-exclamation-circle validation-message" ?hidden="${this._hideMessage}">${this.element.required_error}</div>
    </div>    
    `;
  }

  _selectedValue(el,option) {
    return (el.default_value && el.default_value==option);
  }

  _isValidOption(value) {
    // '- Select -' is a default assigned by the Drupal webform module. So we want to ignore this when generating our forms.
    return (value != '- Select -') ? true : false;
  }

  /**
   * Make sure that a select list with "choose one" or "select one" has an empty string value.
   * This makes sure that submitting the form doesn't see the prompt option as an allowed value
   * for a required input field.
   */
  _optionValue(opt) {
    var selectorPromptRegExp = /(choose|select) one/i;
    if (selectorPromptRegExp.test(opt)) {
      this.element.value = ""; // set value of input to empty to insure not valid during submission
      return "";
    } else {
      return opt;
    }
  }

}

window.customElements.define('uvalib-field-select', UvalibFieldSelect);
