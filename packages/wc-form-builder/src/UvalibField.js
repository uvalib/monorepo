import { html, css, LitElement } from 'lit';

export class UvalibField extends LitElement {
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

}
