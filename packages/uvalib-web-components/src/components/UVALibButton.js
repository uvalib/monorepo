import { LitElement, html, css } from 'lit';
import { uswdsStyles } from '../styles/uswds-styles.js';

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
    uswdsStyles,
    css`
      /* ...custom styles... */
    `
  ];

  render() {
    const classes = ['usa-button'];
    if (this.big) classes.push('usa-button--big');
    if (this.unstyled) classes.push('usa-button--unstyled');
    if (this.secondary) classes.push('usa-button--secondary');
    if (this.accentCool) classes.push('usa-button--accent-cool');
    if (this.accentWarm) classes.push('usa-button--accent-warm');
    if (this.base) classes.push('usa-button--base');
    if (this.outline) classes.push('usa-button--outline');
    if (this.outlineInverse) classes.push('usa-button--outline', 'usa-button--inverse');
    if (this.hover) classes.push('usa-button--hover');
    if (this.active) classes.push('usa-button--active');
    if (this.focus) classes.push('usa-focus');
    return html`
      <button class="${classes.join(' ')}" type="button" ?disabled=${this.disabled}>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('uvalib-button', UVALibButton);
