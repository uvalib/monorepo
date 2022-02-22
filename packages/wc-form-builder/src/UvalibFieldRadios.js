import { html, css, LitElement } from 'lit';
import { UvalibField } from './UvalibFieldGeneric.js';

export class UvalibFieldRadios extends UvalibFieldGeneric {
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
    <fieldset id="radioGroup" class="form-field">
      <legend class="field-label">${ this.element.title }
        ${ this._isRequired(this.element)? html`<span class="required" aria-hidden="true">*</span><span class="hidden">required</span>`:'' }
      </legend>
      ${ this._hasDescription(this.element)? html`<div class="descriptive-text"><span>${ html`this.element.description.markup` }</span></div>`:'' }
      <template is="dom-repeat" items="{{_getOptions(element)}}" as="option">
        <input type="radio" id$="[[_optionStripped(option)]]" name$="[[element.name]]" value$="[[option]]" on-change="_changedValue" checked$="{{_isChecked(option,element.value)}}">
        <label for$="[[_optionStripped(option)]]">[[option]]</label><br>
      </template>
      <div id="{{_ariaDescribedBy}}" class="uvalib-icon-exclamation-circle validation-message" hidden$="{{_hideMessage}}">[[element.required_error]]</div>
    </fieldset>    
    `;
  }
}

window.customElements.define('uvalib-field-radios', UvalibFieldRadios);
