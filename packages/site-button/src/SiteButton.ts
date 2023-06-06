import { property } from 'lit/decorators.js';
import { LitElement, html, css, CSSResult, TemplateResult } from 'lit';
import { SiteButtonStyle } from './SiteButtonStyle.js';

export class SiteButton extends LitElement {
  static get styles() {
    return [
        SiteButtonStyle
    ];
  }
  //static styles: CSSResult = SiteButtonStyle;

  @property({ type: String }) label = "Push me!";

  @property({ type: Boolean }) alt = false;

  @property({ type: Boolean }) basic = false;

  @property({ type: Boolean }) subtle = false;

  @property({ type: Boolean }) outline = false;

  @property({ type: Boolean }) inverse = false;

  @property({ type: Boolean }) small = false;

  @property({ type: Boolean }) large = false;

  @property({ type: Boolean }) disabled = false;

  @property({ type: String }) href = null;

  // for testing
  @property({ type: Boolean }) visited = false;

  @property({ type: Boolean }) hovered = false;

  @property({ type: Boolean }) activated = false

  render(): TemplateResult {
    return this.href ? this.renderAnchor() : this.renderButton();
  }

  private renderButton(): TemplateResult {
    return html`
      <button
        part="button"
        class=${this.computeClass()}
        ?disabled=${this.disabled}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        role="button"
      >
        <slot>${this.label}</slot>
      </button>
    `;
  }

  private renderAnchor(): TemplateResult {
    return html`
      <a
        part="button"
        href=${this.href}
        class=${this.computeClass()}
        ?disabled=${this.disabled}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        role="button"
      >
        <slot>${this.label}</slot>
      </a>
    `;
  }

  private computeClass(): string {
    let classes = 'uvalib-button';
    if (this.basic) classes += ' uvalib-button--basic';
    if (this.alt) classes += ' uvalib-button--alt';
    if (this.subtle) classes += ' uvalib-button--subtle';
    if (this.outline) classes += ' uvalib-button--outline';
    if (this.inverse) classes += ' uvalib-button--inverse';
    if (this.small) classes += ' uvalib-button--small';
    if (this.large) classes += ' uvalib-button--large';
    
    if (this.visited) classes += ' uvalib-button--visited';
    if (this.hovered) classes += ' uvalib-button--hovered';
    if (this.activated) classes += ' uvalib-button--activated';
    return classes;
  }
}

