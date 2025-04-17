import { LitElement, html, css } from 'lit';
import { uvalibStyles } from '../styles/uvalib-styles.js';

export class UVALibButton extends LitElement {
  static properties = {
    big: { type: Boolean, reflect: true },
    unstyled: { type: Boolean, reflect: true },
    secondary: { type: Boolean, reflect: true },
    accentCool: { type: Boolean, reflect: true, attribute: 'accent-cool' },
    accentWarm: { type: Boolean, reflect: true, attribute: 'accent-warm' },
    base: { type: Boolean, reflect: true },
    outline: { type: Boolean, reflect: true },
    outlineInverse: { type: Boolean, reflect: true, attribute: 'outline-inverse' },
    hover: { type: Boolean, reflect: true },
    active: { type: Boolean, reflect: true },
    focus: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true }
  };

  static styles = [
    uvalibStyles,
    css`
      /* ...custom styles... */
    `
  ];

  render() {
    const classes = ['uvalib-button'];
    if (this.big) classes.push('uvalib-button--big');
    if (this.unstyled) classes.push('uvalib-button--unstyled');
    if (this.secondary) classes.push('uvalib-button--secondary');
    if (this.accentCool) classes.push('uvalib-button--accent-cool');
    if (this.accentWarm) classes.push('uvalib-button--accent-warm');
    if (this.base) classes.push('uvalib-button--base');
    if (this.outline) classes.push('uvalib-button--outline');
    if (this.outlineInverse) classes.push('uvalib-button--outline', 'usa-button--inverse');
    if (this.hover) classes.push('uvalib-button--hover');
    if (this.active) classes.push('uvalib-button--active');
    if (this.focus) classes.push('uvalib-focus');
    return html`
      <button class="${classes.join(' ')}" type="button" ?disabled=${this.disabled}>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('uvalib-button', UVALibButton);
