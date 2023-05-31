import { i, _ as __decorate, e, s, x } from '../../query-assigned-elements-66a11629.js';

// colors from https://github.com/uvalib/uvalib-drupal-theme/blob/main/scss/base/_colors.scss
// need to setup a dependency and process to autosync from that authority
const SiteButtonStyle = i `
:host {
  font-family: franklin-gothic-urw, Arial, Helvetica, sans-serif;
}

.uvalib-button {
  font-size: 1em;
  appearance: none;
  border: 0;
  cursor: pointer;
  display: inline-block;
  margin: 0.8em 0.4em;
  padding: 0.6rem 1.25rem;
  text-align: center;
  text-decoration: none;
  width: 100%;
  background-color: #007BAC;
  color: #fff;
  border-radius: 5px;
  text-transform: uppercase;
  border-radius: 5px;
}

.uvalib-button:visited, .uvalib-button--visited {
  color: #fff;
}

a.uvalib_link--button {
  display: inline-block;
  margin: 0.5em;
  padding: 0.88em;
  background-color: #007BAC;
  border-radius: 5px;
  text-decoration: underline;
  color: #fff;
}

.uvalib-button:hover, .uvalib-button--hovered {
  background-color: #005679;
}

a:hover,
a.uvalib-button--hovered {
  text-decoration: none;
}

.uvalib-button:active, .uvalib-button--activated {
  background-color: #232D4B;
}

a ::slotted(i) {
  padding: 2px 4px;
  text-decoration: none;
}

a.uvalib_link--button:hover ::slotted(i),
a.uvalib-button--hovered ::slotted(i) {
  text-decoration: underline;
}

/* Disabled Buttons */
.uvalib-button:disabled, .uvalib-button[disabled] {
  background-color: #DADADA;
  color: #fff;
  pointer-events: none;
  box-shadow: none;
}

/* Default Subtle Buttons & Link Buttons */
.uvalib-button--subtle {
  background-color: #BFE7F7;
  color: #4F4F4F;
  box-shadow: inset 0 0 0 2px #007BAC;
}

.uvalib-button--subtle:hover, 
.uvalib-button--subtle.uvalib-button--hovered {
  background-color: #91D8F2;
  box-shadow: inset 0 0 0 2px #007BAC;
}

.uvalib-button--subtle:active,
.uvalib-button--subtle.uvalib-button--activated {
  background-color: #55C4EC;
  box-shadow: inset 0 0 0 2px #007BAC;
}

/* Default Basic Buttons */
.uvalib-button--basic {
  background-color: #DADADA;
  color: #4F4F4F;
  box-shadow: inset 0 0 0 2px #808080;
}

.uvalib-button--basic:hover,
.uvalib-button--basic.uvalib-button--hovered {
  background-color: #F1F1F1;
  box-shadow: inset 0 0 0 2px #808080;
}

.uvalib-button--basic:active,
.uvalib-button--basic.uvalib-button--activated {
  background-color: #4F4F4F;
  color: #fff;
  box-shadow: inset 0 0 0 2px #2B2B2B;
}

/* Outline Buttons */
.uvalib-button--outline {
  background-color: transparent;
  box-shadow: inset 0 0 0 2px #007BAC;
  color: #007BAC;
}

.uvalib-button--outline.uvalib-button--hovered,
.uvalib-button--outline:hover {
  background-color: transparent;
  box-shadow: inset 0 0 0 2px #005679;
  color: #005679;
}

.uvalib-button--outline.uvalib-button--activated,
.uvalib-button--outline:active {
  background-color: transparent;
  box-shadow: inset 0 0 0 2px #232D4B;
  color: #232D4B;
}

.uvalib-button--outline:disabled,
.uvalib-button--outline[disabled] {
  background-color: transparent;
  box-shadow: inset 0 0 0 2px #DADADA;
  color: #DADADA;
}

/* Outline Inverse Buttons */
.uvalib-button--outline.uvalib-button--inverse {
  box-shadow: inset 0 0 0 2px #fff;
  color: #fff;
}

a.uvalib-button-inverse {
  color: #fff;
}

.uvalib-button--outline.uvalib-button--inverse.uvalib-button--hovered,
.uvalib-button--outline.uvalib-button--inverse:hover {
  box-shadow: inset 0 0 0 2px #DADADA;
  color: #DADADA;
}

.uvalib-button--outline.uvalib-button--inverse.uvalib-button--activated,
.uvalib-button--outline.uvalib-button--inverse:active {
  background-color: transparent;
  box-shadow: inset 0 0 0 2px #fff;
  color: #fff;
}

.uvalib-button--outline.uvalib-button--inverse:disabled,
.uvalib-button--outline.uvalib-button--inverse[disabled] {
  background-color: transparent;
  box-shadow: inset 0 0 0 2px #808080;
  color: #808080;
}

/* Alternate Buttons */
.uvalib-button--alt {
  background-color: #E57200;
  color: #2B2B2B;
}

.uvalib-button--alt:hover,
.uvalib-button--alt.uvalib-button--hovered {
  background-color: #B35900;
  color: #fff;
}

.uvalib-button--alt:active,
.uvalib-button--alt.uvalib-button--activated {
  background-color: #854200;
  color: #fff;
}

/* button sizes */
.uvalib-button--small {
  border-radius: 0.25rem;
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
}

.uvalib-button--large {
  border-radius: 0.25rem;
  font-size: 1.33rem;
  padding: 1rem 1.5rem;
}

/* buttons for mobile */
@media (min-width: 30em) {
  .uvalib-button {
    width: auto;
  }
}
`;

class SiteButton extends s {
    constructor() {
        super(...arguments);
        this.label = "Push me!";
        this.alt = false;
        this.basic = false;
        this.subtle = false;
        this.outline = false;
        this.inverse = false;
        this.small = false;
        this.large = false;
        this.disabled = false;
        this.href = null;
        // for testing
        this.visited = false;
        this.hovered = false;
        this.activated = false;
    }
    render() {
        return this.href ? this.renderAnchor() : this.renderButton();
    }
    renderButton() {
        return x `
      <button
        class=${this.computeClass()}
        ?disabled=${this.disabled}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        role="button"
      >
        <slot>${this.label}</slot>
      </button>
    `;
    }
    renderAnchor() {
        return x `
      <a
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
    computeClass() {
        let classes = 'uvalib-button';
        if (this.basic)
            classes += ' uvalib-button--basic';
        if (this.alt)
            classes += ' uvalib-button--alt';
        if (this.subtle)
            classes += ' uvalib-button--subtle';
        if (this.outline)
            classes += ' uvalib-button--outline';
        if (this.inverse)
            classes += ' uvalib-button--inverse';
        if (this.small)
            classes += ' uvalib-button--small';
        if (this.large)
            classes += ' uvalib-button--large';
        if (this.visited)
            classes += ' uvalib-button--visited';
        if (this.hovered)
            classes += ' uvalib-button--hovered';
        if (this.activated)
            classes += ' uvalib-button--activated';
        return classes;
    }
}
SiteButton.styles = SiteButtonStyle;
__decorate([
    e({ type: String })
], SiteButton.prototype, "label", void 0);
__decorate([
    e({ type: Boolean })
], SiteButton.prototype, "alt", void 0);
__decorate([
    e({ type: Boolean })
], SiteButton.prototype, "basic", void 0);
__decorate([
    e({ type: Boolean })
], SiteButton.prototype, "subtle", void 0);
__decorate([
    e({ type: Boolean })
], SiteButton.prototype, "outline", void 0);
__decorate([
    e({ type: Boolean })
], SiteButton.prototype, "inverse", void 0);
__decorate([
    e({ type: Boolean })
], SiteButton.prototype, "small", void 0);
__decorate([
    e({ type: Boolean })
], SiteButton.prototype, "large", void 0);
__decorate([
    e({ type: Boolean })
], SiteButton.prototype, "disabled", void 0);
__decorate([
    e({ type: String })
], SiteButton.prototype, "href", void 0);
__decorate([
    e({ type: Boolean })
], SiteButton.prototype, "visited", void 0);
__decorate([
    e({ type: Boolean })
], SiteButton.prototype, "hovered", void 0);
__decorate([
    e({ type: Boolean })
], SiteButton.prototype, "activated", void 0);

window.customElements.define('site-button', SiteButton);
