import { html, css, LitElement } from 'lit-element';
import dark from '@uvalib/web-styles/css/theme-dark.css.js';
import light from '@uvalib/web-styles/css/theme-light.css.js';

export class UvalibStyle extends LitElement {

  static get properties() {
    return {
      dark: {type: Boolean},
      light: {type: Boolean}
    };
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
      styleNode.textContent = light.cssText;
  }

  setDark() {
      document.body.classList.add('sl-theme-dark');
      document.body.classList.remove('sl-theme-light');
  }

  constructor() {
    super();
    // defaults
    this.dark = false;
    this.light = true;
  }

  connectedCallback() {
    if (this.dark) this.setDark();
    else if (this.light) this.setLight();
  }

}
