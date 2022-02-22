import { html, css, LitElement } from 'lit';

export class UvalibFieldGeneric extends LitElement {
  static get styles() {
    return css`
    `;
  }

  static get properties() {
    return {
      /* Makes sure each field component can be tabbed into */
      tabindex: { type: Number, reflect: true},
      element: { type: Object },
      value: { type: String, reflect: true },
      invalidValues: { type: Boolean, reflect: true },
      requiredError: { type: String, reflect: true },
      syntaxErrors: { type: String, reflect: true },
      disabled: { type: Boolean },

      type: { type: String },
      key: { type: String },
      label: { type: String }
    };
  }

  updated(changedProps) {
    if ( changedProps.has('element') ) {
      this._parseElement();
      this._dispatchEvent('elementUpdate', {element: this.element});
    };
  }

  constructor() {
    super();
    this.tabindex = 0;
    this.invalidValues = false;
    this.disabled = false;
  }

  _dispatchEvent(name, detail={}){
    if (name) {
      this.dispatchEvent(new CustomEvent(name, { detail: detail, bubbles: true, composed: true }));      
    }
  }

  render() {
    return html`
    `;
  }

  _parseElement() {
    if (this.element) {
      this.type = this.element.type || null;
      this.key = this.element['webform_key'] || null;
      this.label = this.element['submit__label'] || null;
    }
  }

  _isRequired(el) {
    // if the input field is actually being hidden then we shouldn't require a value for it
    if (el) {
      return (el.required || el._required);
    } else {
      return false;
    }
  } 
  
  _ariaRequired(el) {
    return (this._isRequired(el)) ? 'true' : 'false';
  }

  _hasDescription(el) {
    return (el.description && el.description.markup && el.description.markup!='');
  }

  _changedValue(e) {
    if (this.element.type == "datetime") {
      // Input values are fine as is. So do nothing, e.g. validation is handled when form is submitted.
    } else if (this.element.type == "datelist") {
      // Input values are fine as is. So do nothing, e.g. validation is handled when form is submitted.
    } else if (this.element.type == "webform_custom_composite") {
      // Input values are fine as is. So do nothing, e.g. validation is handled when form is submitted.
    } else {
      // trim leading and trailing whitespace from the content entered
      this.value = this.shadowRoot.querySelector('#'+this.element.webform_key).value.trim();
      this.shadowRoot.querySelector('#'+this.element.webform_key).value = this.value;
    }
    // Note: composed is necessary for a select list value that may alter what displays on a form, e.g. the format input on the purchase form
    this.dispatchEvent(new CustomEvent('changedValue', {detail: {field_id: this.element.webform_key, value: this.value}, bubbles: true, composed: true}));
  }

}
