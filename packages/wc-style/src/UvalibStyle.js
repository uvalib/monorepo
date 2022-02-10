import { html, css, LitElement } from 'lit';
import dark from '@uvalib/web-styles/css/theme-dark.css.js';
import light from '@uvalib/web-styles/css/theme-light.css.js';

export class UvalibStyle extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--uvalib-style-text-color, #000);
      }
    `;
  }

  static get properties() {
    return {
      dark: {type: Boolean, reflect: true},
      light: {type: Boolean, reflect: true}
    };
  }

  constructor() {
    super();
    
    // defaults
    this.dark = false;
    this.light = true;
  }

  setLight() {
      document.body.classList.add('sl-theme-light');
      document.body.classList.remove('sl-theme-dark');
      let styleNode = document.querySelector('head style[id="uvalib-theme-light"]');
      if (!styleNode) {
        styleNode = document.createElement('style')
        styleNode.id = "uvalib-theme-light";
        document.head.appendChild(styleNode);
      }
      styleNode.textContent = light.toString();
  }

  setDark() {
      document.body.classList.add('sl-theme-dark');
      document.body.classList.remove('sl-theme-light');
      let styleNode = document.querySelector('head style[id="uvalib-theme-dark"]');
      if (!styleNode) {
        styleNode = document.createElement('style')
        styleNode.id = "uvalib-theme-dark";
        document.head.appendChild(styleNode);
      }
      styleNode.textContent = dark.toString();
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.dark) this.setDark();
    else if (this.light) this.setLight();
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}
