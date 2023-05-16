import { h as html, F as FoundationElement, _ as __decorate, a as attr, o as observable, O as Observable, c as css, u as bodyFont, t as typeRampBaseFontSize, v as typeRampBaseLineHeight, r as neutralFillRest, n as neutralForegroundRest, f as controlCornerRadius, e as designUnit, d as density, m as strokeWidth, a3 as neutralFillHover, a5 as neutralFillActive, x as focusStrokeOuter, w as focusStrokeWidth, G as accentFillRest, U as foregroundOnAccentRest, J as accentFillHover, V as foregroundOnAccentHover, Q as accentFillActive, W as foregroundOnAccentActive, K as focusStrokeInner, a2 as accentForegroundRest, a4 as accentForegroundHover, a6 as accentForegroundActive, N as neutralFillStealthRest, R as neutralFillStealthHover, T as neutralFillStealthActive, C as disabledOpacity, p as provideFASTDesignSystem, s as styleMap } from './SiteStyleMapping-b3f47ce3.js';
import { h as heightNumber, d as disabledCursor } from './size-694374d3.js';
import { d as display } from './display-26e2ea35.js';
import { s as slotted, m as focusVisible } from './focus-7fe93afd.js';
import { f as forcedColorsStylesheetBehavior, S as SystemColors } from './match-media-stylesheet-behavior-5f2c3a3c.js';
import { r as ref, s as startSlotTemplate, e as endSlotTemplate, a as applyMixins, S as StartEnd } from './apply-mixins-fa470210.js';
import { F as FormAssociated } from './form-associated-179d4596.js';
import { A as ARIAGlobalStatesAndProperties } from './aria-global-42249961.js';

/**
 * The template for the {@link @microsoft/fast-foundation#(Button:class)} component.
 * @public
 */
const buttonTemplate = (context, definition) => html `
    <button
        class="control"
        part="control"
        ?autofocus="${x => x.autofocus}"
        ?disabled="${x => x.disabled}"
        form="${x => x.formId}"
        formaction="${x => x.formaction}"
        formenctype="${x => x.formenctype}"
        formmethod="${x => x.formmethod}"
        formnovalidate="${x => x.formnovalidate}"
        formtarget="${x => x.formtarget}"
        name="${x => x.name}"
        type="${x => x.type}"
        value="${x => x.value}"
        aria-atomic="${x => x.ariaAtomic}"
        aria-busy="${x => x.ariaBusy}"
        aria-controls="${x => x.ariaControls}"
        aria-current="${x => x.ariaCurrent}"
        aria-describedby="${x => x.ariaDescribedby}"
        aria-details="${x => x.ariaDetails}"
        aria-disabled="${x => x.ariaDisabled}"
        aria-errormessage="${x => x.ariaErrormessage}"
        aria-expanded="${x => x.ariaExpanded}"
        aria-flowto="${x => x.ariaFlowto}"
        aria-haspopup="${x => x.ariaHaspopup}"
        aria-hidden="${x => x.ariaHidden}"
        aria-invalid="${x => x.ariaInvalid}"
        aria-keyshortcuts="${x => x.ariaKeyshortcuts}"
        aria-label="${x => x.ariaLabel}"
        aria-labelledby="${x => x.ariaLabelledby}"
        aria-live="${x => x.ariaLive}"
        aria-owns="${x => x.ariaOwns}"
        aria-pressed="${x => x.ariaPressed}"
        aria-relevant="${x => x.ariaRelevant}"
        aria-roledescription="${x => x.ariaRoledescription}"
        ${ref("control")}
    >
        ${startSlotTemplate(context, definition)}
        <span class="content" part="content">
            <slot ${slotted("defaultSlottedContent")}></slot>
        </span>
        ${endSlotTemplate(context, definition)}
    </button>
`;

class _Button extends FoundationElement {
}
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Button:class)} component.
 *
 * @internal
 */
class FormAssociatedButton extends FormAssociated(_Button) {
    constructor() {
        super(...arguments);
        this.proxy = document.createElement("input");
    }
}

/**
 * A Button Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | <button> element }.
 *
 * @slot start - Content which can be provided before the button content
 * @slot end - Content which can be provided after the button content
 * @slot - The default slot for button content
 * @csspart control - The button element
 * @csspart content - The element wrapping button content
 *
 * @public
 */
let Button$1 = class Button extends FormAssociatedButton {
    constructor() {
        super(...arguments);
        /**
         * Prevent events to propagate if disabled and has no slotted content wrapped in HTML elements
         * @internal
         */
        this.handleClick = (e) => {
            var _a;
            if (this.disabled && ((_a = this.defaultSlottedContent) === null || _a === void 0 ? void 0 : _a.length) <= 1) {
                e.stopPropagation();
            }
        };
        /**
         * Submits the parent form
         */
        this.handleSubmission = () => {
            if (!this.form) {
                return;
            }
            const attached = this.proxy.isConnected;
            if (!attached) {
                this.attachProxy();
            }
            // Browser support for requestSubmit is not comprehensive
            // so click the proxy if it isn't supported
            typeof this.form.requestSubmit === "function"
                ? this.form.requestSubmit(this.proxy)
                : this.proxy.click();
            if (!attached) {
                this.detachProxy();
            }
        };
        /**
         * Resets the parent form
         */
        this.handleFormReset = () => {
            var _a;
            (_a = this.form) === null || _a === void 0 ? void 0 : _a.reset();
        };
        /**
         * Overrides the focus call for where delegatesFocus is unsupported.
         * This check works for Chrome, Edge Chromium, FireFox, and Safari
         * Relevant PR on the Firefox browser: https://phabricator.services.mozilla.com/D123858
         */
        this.handleUnsupportedDelegatesFocus = () => {
            var _a;
            // Check to see if delegatesFocus is supported
            if (window.ShadowRoot &&
                !window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus") &&
                ((_a = this.$fastController.definition.shadowOptions) === null || _a === void 0 ? void 0 : _a.delegatesFocus)) {
                this.focus = () => {
                    this.control.focus();
                };
            }
        };
    }
    formactionChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.formAction = this.formaction;
        }
    }
    formenctypeChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.formEnctype = this.formenctype;
        }
    }
    formmethodChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.formMethod = this.formmethod;
        }
    }
    formnovalidateChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.formNoValidate = this.formnovalidate;
        }
    }
    formtargetChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.formTarget = this.formtarget;
        }
    }
    typeChanged(previous, next) {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.type = this.type;
        }
        next === "submit" && this.addEventListener("click", this.handleSubmission);
        previous === "submit" && this.removeEventListener("click", this.handleSubmission);
        next === "reset" && this.addEventListener("click", this.handleFormReset);
        previous === "reset" && this.removeEventListener("click", this.handleFormReset);
    }
    /** {@inheritDoc (FormAssociated:interface).validate} */
    validate() {
        super.validate(this.control);
    }
    /**
     * @internal
     */
    connectedCallback() {
        var _a;
        super.connectedCallback();
        this.proxy.setAttribute("type", this.type);
        this.handleUnsupportedDelegatesFocus();
        const elements = Array.from((_a = this.control) === null || _a === void 0 ? void 0 : _a.children);
        if (elements) {
            elements.forEach((span) => {
                span.addEventListener("click", this.handleClick);
            });
        }
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        var _a;
        super.disconnectedCallback();
        const elements = Array.from((_a = this.control) === null || _a === void 0 ? void 0 : _a.children);
        if (elements) {
            elements.forEach((span) => {
                span.removeEventListener("click", this.handleClick);
            });
        }
    }
};
__decorate([
    attr({ mode: "boolean" })
], Button$1.prototype, "autofocus", void 0);
__decorate([
    attr({ attribute: "form" })
], Button$1.prototype, "formId", void 0);
__decorate([
    attr
], Button$1.prototype, "formaction", void 0);
__decorate([
    attr
], Button$1.prototype, "formenctype", void 0);
__decorate([
    attr
], Button$1.prototype, "formmethod", void 0);
__decorate([
    attr({ mode: "boolean" })
], Button$1.prototype, "formnovalidate", void 0);
__decorate([
    attr
], Button$1.prototype, "formtarget", void 0);
__decorate([
    attr
], Button$1.prototype, "type", void 0);
__decorate([
    observable
], Button$1.prototype, "defaultSlottedContent", void 0);
/**
 * Includes ARIA states and properties relating to the ARIA button role
 *
 * @public
 */
class DelegatesARIAButton {
}
__decorate([
    attr({ attribute: "aria-expanded" })
], DelegatesARIAButton.prototype, "ariaExpanded", void 0);
__decorate([
    attr({ attribute: "aria-pressed" })
], DelegatesARIAButton.prototype, "ariaPressed", void 0);
applyMixins(DelegatesARIAButton, ARIAGlobalStatesAndProperties);
applyMixins(Button$1, StartEnd, DelegatesARIAButton);

/**
 * A behavior to add or remove a stylesheet from an element based on a property. The behavior ensures that
 * styles are applied while the property matches and that styles are not applied if the property does
 * not match.
 *
 * @public
 */
class PropertyStyleSheetBehavior {
    /**
     * Constructs a {@link PropertyStyleSheetBehavior} instance.
     * @param propertyName - The property name to operate from.
     * @param value - The property value to operate from.
     * @param styles - The styles to coordinate with the property.
     */
    constructor(propertyName, value, styles) {
        this.propertyName = propertyName;
        this.value = value;
        this.styles = styles;
    }
    /**
     * Binds the behavior to the element.
     * @param elementInstance - The element for which the property is applied.
     */
    bind(elementInstance) {
        Observable.getNotifier(elementInstance).subscribe(this, this.propertyName);
        this.handleChange(elementInstance, this.propertyName);
    }
    /**
     * Unbinds the behavior from the element.
     * @param source - The element for which the behavior is unbinding.
     * @internal
     */
    unbind(source) {
        Observable.getNotifier(source).unsubscribe(this, this.propertyName);
        source.$fastController.removeStyles(this.styles);
    }
    /**
     * Change event for the provided element.
     * @param source - the element for which to attach or detach styles.
     * @param key - the key to lookup to know if the element already has the styles
     * @internal
     */
    handleChange(source, key) {
        if (source[key] === this.value) {
            source.$fastController.addStyles(this.styles);
        }
        else {
            source.$fastController.removeStyles(this.styles);
        }
    }
}

/**
 * @internal
 */
const BaseButtonStyles = css `
    ${display("inline-flex")} :host {
        font-family: ${bodyFont};
        outline: none;
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        height: calc(${heightNumber} * 1px);
        min-width: calc(${heightNumber} * 1px);
        background-color: ${neutralFillRest};
        color: ${neutralForegroundRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        fill: currentcolor;
        cursor: pointer;
    }

    .control {
        background: transparent;
        height: inherit;
        flex-grow: 1;
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: baseline;
        padding: 0 calc((10 + (${designUnit} * 2 * ${density})) * 1px);
        white-space: nowrap;
        outline: none;
        text-decoration: none;
        border: calc(${strokeWidth} * 1px) solid transparent;
        color: inherit;
        border-radius: inherit;
        fill: inherit;
        cursor: inherit;
        font-weight: inherit;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    :host(:hover) {
        background-color: ${neutralFillHover};
    }

    :host(:active) {
        background-color: ${neutralFillActive};
    }

    .control:${focusVisible} {
        border-color: ${focusStrokeOuter};
        box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${focusStrokeOuter} inset;
    }

    .control::-moz-focus-inner {
        border: 0;
    }

    .start,
    .content,
    .end {
        align-self: center;
    }

    .start,
    .end {
        display: flex;
    }

    .control.icon-only {
        padding: 0;
        line-height: 0;
    }

    ::slotted(svg) {
        ${
/* Glyph size and margin-left is temporary -
replace when adaptive typography is figured out */ ""} width: 16px;
        height: 16px;
        pointer-events: none;
    }

    .start {
        margin-inline-end: 11px;
    }

    .end {
        margin-inline-start: 11px;
    }
`.withBehaviors(forcedColorsStylesheetBehavior(css `
            :host .control {
              background-color: ${SystemColors.ButtonFace};
              border-color: ${SystemColors.ButtonText};
              color: ${SystemColors.ButtonText};
              fill: currentColor;
            }

            :host(:hover) .control {
              forced-color-adjust: none;
              background-color: ${SystemColors.Highlight};
              color: ${SystemColors.HighlightText};
            }

            .control:${focusVisible} {
              forced-color-adjust: none;
              background-color: ${SystemColors.Highlight};
              border-color: ${SystemColors.ButtonText};
              box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${SystemColors.ButtonText} inset;
              color: ${SystemColors.HighlightText};
            }

            .control:hover,
            :host([appearance="outline"]) .control:hover {
              border-color: ${SystemColors.ButtonText};
            }

            :host([href]) .control {
                border-color: ${SystemColors.LinkText};
                color: ${SystemColors.LinkText};
            }

            :host([href]) .control:hover,
            :host([href]) .control:${focusVisible}{
              forced-color-adjust: none;
              background: ${SystemColors.ButtonFace};
              border-color: ${SystemColors.LinkText};
              box-shadow: 0 0 0 1px ${SystemColors.LinkText} inset;
              color: ${SystemColors.LinkText};
              fill: currentColor;
            }
        `));
/**
 * @internal
 */
const AccentButtonStyles = css `
    :host([appearance="accent"]) {
        background: ${accentFillRest};
        color: ${foregroundOnAccentRest};
    }

    :host([appearance="accent"]:hover) {
        background: ${accentFillHover};
        color: ${foregroundOnAccentHover};
    }

    :host([appearance="accent"]:active) .control:active {
        background: ${accentFillActive};
        color: ${foregroundOnAccentActive};
    }

    :host([appearance="accent"]) .control:${focusVisible} {
        box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${focusStrokeOuter} inset,
            0 0 0 calc((${focusStrokeWidth} + ${strokeWidth}) * 1px) ${focusStrokeInner} inset;
    }
`.withBehaviors(forcedColorsStylesheetBehavior(css `
            :host([appearance="accent"]) .control {
                forced-color-adjust: none;
                background: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
            }

            :host([appearance="accent"]) .control:hover,
            :host([appearance="accent"]:active) .control:active {
                background: ${SystemColors.HighlightText};
                border-color: ${SystemColors.Highlight};
                color: ${SystemColors.Highlight};
            }

            :host([appearance="accent"]) .control:${focusVisible} {
                border-color: ${SystemColors.Highlight};
                box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.HighlightText} inset;
            }

            :host([appearance="accent"][href]) .control{
                background: ${SystemColors.LinkText};
                color: ${SystemColors.HighlightText};
            }

            :host([appearance="accent"][href]) .control:hover {
                background: ${SystemColors.ButtonFace};
                border-color: ${SystemColors.LinkText};
                box-shadow: none;
                color: ${SystemColors.LinkText};
                fill: currentColor;
            }

            :host([appearance="accent"][href]) .control:${focusVisible} {
                border-color: ${SystemColors.LinkText};
                box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.HighlightText} inset;
            }
        `));
/**
 * @internal
 */
css `
    :host([appearance="hypertext"]) {
        font-size: inherit;
        line-height: inherit;
        height: auto;
        min-width: 0;
        background: transparent;
    }

    :host([appearance="hypertext"]) .control {
        display: inline;
        padding: 0;
        border: none;
        box-shadow: none;
        border-radius: 0;
        line-height: 1;
    }

    :host a.control:not(:link) {
        background-color: transparent;
        cursor: default;
    }
    :host([appearance="hypertext"]) .control:link,
    :host([appearance="hypertext"]) .control:visited {
        background: transparent;
        color: ${accentForegroundRest};
        border-bottom: calc(${strokeWidth} * 1px) solid ${accentForegroundRest};
    }

    :host([appearance="hypertext"]:hover),
    :host([appearance="hypertext"]) .control:hover {
        background: transparent;
        border-bottom-color: ${accentForegroundHover};
    }

    :host([appearance="hypertext"]:active),
    :host([appearance="hypertext"]) .control:active {
        background: transparent;
        border-bottom-color: ${accentForegroundActive};
    }

    :host([appearance="hypertext"]) .control:${focusVisible} {
        border-bottom: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
        margin-bottom: calc(calc(${strokeWidth} - ${focusStrokeWidth}) * 1px);
    }
`.withBehaviors(forcedColorsStylesheetBehavior(css `
            :host([appearance="hypertext"]:hover) {
                background-color: ${SystemColors.ButtonFace};
                color: ${SystemColors.ButtonText};
            }
            :host([appearance="hypertext"][href]) .control:hover,
            :host([appearance="hypertext"][href]) .control:active,
            :host([appearance="hypertext"][href]) .control:${focusVisible} {
                color: ${SystemColors.LinkText};
                border-bottom-color: ${SystemColors.LinkText};
                box-shadow: none;
            }
        `));
/**
 * @internal
 */
const LightweightButtonStyles = css `
    :host([appearance="lightweight"]) {
        background: transparent;
        color: ${accentForegroundRest};
    }

    :host([appearance="lightweight"]) .control {
        padding: 0;
        height: initial;
        border: none;
        box-shadow: none;
        border-radius: 0;
    }

    :host([appearance="lightweight"]:hover) {
        background: transparent;
        color: ${accentForegroundHover};
    }

    :host([appearance="lightweight"]:active) {
        background: transparent;
        color: ${accentForegroundActive};
    }

    :host([appearance="lightweight"]) .content {
        position: relative;
    }

    :host([appearance="lightweight"]) .content::before {
        content: "";
        display: block;
        height: calc(${strokeWidth} * 1px);
        position: absolute;
        top: calc(1em + 4px);
        width: 100%;
    }

    :host([appearance="lightweight"]:hover) .content::before {
        background: ${accentForegroundHover};
    }

    :host([appearance="lightweight"]:active) .content::before {
        background: ${accentForegroundActive};
    }

    :host([appearance="lightweight"]) .control:${focusVisible} .content::before {
        background: ${neutralForegroundRest};
        height: calc(${focusStrokeWidth} * 1px);
    }
`.withBehaviors(forcedColorsStylesheetBehavior(css `
            :host([appearance="lightweight"]) .control:hover,
            :host([appearance="lightweight"]) .control:${focusVisible} {
                forced-color-adjust: none;
                background: ${SystemColors.ButtonFace};
                color: ${SystemColors.Highlight};
            }
            :host([appearance="lightweight"]) .control:hover .content::before,
            :host([appearance="lightweight"]) .control:${focusVisible} .content::before {
                background: ${SystemColors.Highlight};
            }

            :host([appearance="lightweight"][href]) .control:hover,
            :host([appearance="lightweight"][href]) .control:${focusVisible} {
                background: ${SystemColors.ButtonFace};
                box-shadow: none;
                color: ${SystemColors.LinkText};
            }

            :host([appearance="lightweight"][href]) .control:hover .content::before,
            :host([appearance="lightweight"][href]) .control:${focusVisible} .content::before {
                background: ${SystemColors.LinkText};
            }
        `));
/**
 * @internal
 */
const OutlineButtonStyles = css `
    :host([appearance="outline"]) {
        background: transparent;
        border-color: ${accentFillRest};
    }

    :host([appearance="outline"]:hover) {
        border-color: ${accentFillHover};
    }

    :host([appearance="outline"]:active) {
        border-color: ${accentFillActive};
    }

    :host([appearance="outline"]) .control {
        border-color: inherit;
    }

    :host([appearance="outline"]) .control:${focusVisible} {
        box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${focusStrokeOuter} inset;
        border-color: ${focusStrokeOuter};
    }
`.withBehaviors(forcedColorsStylesheetBehavior(css `
            :host([appearance="outline"]) .control {
                border-color: ${SystemColors.ButtonText};
            }
            :host([appearance="outline"]) .control:${focusVisible} {
              forced-color-adjust: none;
              background-color: ${SystemColors.Highlight};
              border-color: ${SystemColors.ButtonText};
              box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${SystemColors.ButtonText} inset;
              color: ${SystemColors.HighlightText};
              fill: currentColor;
            }
            :host([appearance="outline"][href]) .control {
                background: ${SystemColors.ButtonFace};
                border-color: ${SystemColors.LinkText};
                color: ${SystemColors.LinkText};
                fill: currentColor;
            }
            :host([appearance="outline"][href]) .control:hover,
            :host([appearance="outline"][href]) .control:${focusVisible} {
              forced-color-adjust: none;
              border-color: ${SystemColors.LinkText};
              box-shadow: 0 0 0 1px ${SystemColors.LinkText} inset;
            }
        `));
/**
 * @internal
 */
const StealthButtonStyles = css `
    :host([appearance="stealth"]) {
        background: ${neutralFillStealthRest};
    }

    :host([appearance="stealth"]:hover) {
        background: ${neutralFillStealthHover};
    }

    :host([appearance="stealth"]:active) {
        background: ${neutralFillStealthActive};
    }
`.withBehaviors(forcedColorsStylesheetBehavior(css `
            :host([appearance="stealth"]),
            :host([appearance="stealth"]) .control {
                forced-color-adjust: none;
                background: ${SystemColors.ButtonFace};
                border-color: transparent;
                color: ${SystemColors.ButtonText};
                fill: currentColor;
            }

            :host([appearance="stealth"]:hover) .control {
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"]:${focusVisible}) .control {
                background: ${SystemColors.Highlight};
                box-shadow: 0 0 0 1px ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"][href]) .control {
                color: ${SystemColors.LinkText};
            }

            :host([appearance="stealth"][href]:hover) .control,
            :host([appearance="stealth"][href]:${focusVisible}) .control {
                background: ${SystemColors.LinkText};
                border-color: ${SystemColors.LinkText};
                color: ${SystemColors.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"][href]:${focusVisible}) .control {
                forced-color-adjust: none;
                box-shadow: 0 0 0 1px ${SystemColors.LinkText};
            }
        `));

/**
 * Behavior that will conditionally apply a stylesheet based on the elements
 * appearance property
 *
 * @param value - The value of the appearance property
 * @param styles - The styles to be applied when condition matches
 *
 * @public
 */
function appearanceBehavior(value, styles) {
    return new PropertyStyleSheetBehavior("appearance", value, styles);
}

/**
 * Styles for Button
 * @public
 */
const buttonStyles = (context, definition) => css `
        :host([disabled]),
        :host([disabled]:hover),
        :host([disabled]:active) {
            opacity: ${disabledOpacity};
            background-color: ${neutralFillRest};
            cursor: ${disabledCursor};
        }

        ${BaseButtonStyles}
    `.withBehaviors(forcedColorsStylesheetBehavior(css `
                :host([disabled]),
                :host([disabled]) .control,
                :host([disabled]:hover),
                :host([disabled]:active) {
                    forced-color-adjust: none;
                    background-color: ${SystemColors.ButtonFace};
                    border-color: ${SystemColors.GrayText};
                    color: ${SystemColors.GrayText};
                    cursor: ${disabledCursor};
                    opacity: 1;
                }
            `), appearanceBehavior("accent", css `
                :host([appearance="accent"][disabled]),
                :host([appearance="accent"][disabled]:hover),
                :host([appearance="accent"][disabled]:active) {
                    background: ${accentFillRest};
                }

                ${AccentButtonStyles}
            `.withBehaviors(forcedColorsStylesheetBehavior(css `
                        :host([appearance="accent"][disabled]) .control,
                        :host([appearance="accent"][disabled]) .control:hover {
                            background: ${SystemColors.ButtonFace};
                            border-color: ${SystemColors.GrayText};
                            color: ${SystemColors.GrayText};
                        }
                    `))), appearanceBehavior("lightweight", css `
                :host([appearance="lightweight"][disabled]:hover),
                :host([appearance="lightweight"][disabled]:active) {
                    background-color: transparent;
                    color: ${accentForegroundRest};
                }

                :host([appearance="lightweight"][disabled]) .content::before,
                :host([appearance="lightweight"][disabled]:hover) .content::before,
                :host([appearance="lightweight"][disabled]:active) .content::before {
                    background: transparent;
                }

                ${LightweightButtonStyles}
            `.withBehaviors(forcedColorsStylesheetBehavior(css `
                        :host([appearance="lightweight"].disabled) .control {
                            forced-color-adjust: none;
                            color: ${SystemColors.GrayText};
                        }

                        :host([appearance="lightweight"].disabled)
                            .control:hover
                            .content::before {
                            background: none;
                        }
                    `))), appearanceBehavior("outline", css `
                :host([appearance="outline"][disabled]),
                :host([appearance="outline"][disabled]:hover),
                :host([appearance="outline"][disabled]:active) {
                    background: transparent;
                    border-color: ${accentFillRest};
                }

                ${OutlineButtonStyles}
            `.withBehaviors(forcedColorsStylesheetBehavior(css `
                        :host([appearance="outline"][disabled]) .control {
                            border-color: ${SystemColors.GrayText};
                        }
                    `))), appearanceBehavior("stealth", css `
                :host([appearance="stealth"][disabled]),
                :host([appearance="stealth"][disabled]:hover),
                :host([appearance="stealth"][disabled]:active) {
                    background: ${neutralFillStealthRest};
                }

                ${StealthButtonStyles}
            `.withBehaviors(forcedColorsStylesheetBehavior(css `
                        :host([appearance="stealth"][disabled]) {
                            background: ${SystemColors.ButtonFace};
                        }

                        :host([appearance="stealth"][disabled]) .control {
                            background: ${SystemColors.ButtonFace};
                            border-color: transparent;
                            color: ${SystemColors.GrayText};
                        }
                    `))));

/**
 * @internal
 */
class Button extends Button$1 {
    constructor() {
        super(...arguments);
        /**
         * The appearance the button should have.
         *
         * @public
         * @remarks
         * HTML Attribute: appearance
         */
        this.appearance = "neutral";
    }
    /**
     * Applies 'icon-only' class when there is only an SVG in the default slot
     *
     * @public
     * @remarks
     */
    defaultSlottedContentChanged(oldValue, newValue) {
        const slottedElements = this.defaultSlottedContent.filter(x => x.nodeType === Node.ELEMENT_NODE);
        if (slottedElements.length === 1 && slottedElements[0] instanceof SVGElement) {
            this.control.classList.add("icon-only");
        }
        else {
            this.control.classList.remove("icon-only");
        }
    }
}
__decorate([
    attr
], Button.prototype, "appearance", void 0);
/**
 * A function that returns a {@link @microsoft/fast-foundation#Button} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#buttonTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-button>`
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
const fastButton = Button.compose({
    baseName: "button",
    baseClass: Button$1,
    template: buttonTemplate,
    styles: buttonStyles,
    shadowOptions: {
        delegatesFocus: true,
    },
});

provideFASTDesignSystem()
    .withPrefix("site")
    .register(fastButton({
    // eslint-disable-next-line arrow-body-style
    styles: (context, definition) => css `
                ${styleMap}
                ${buttonStyles()}
                :host {
                    --neutral-foreground-rest: var(--uva-white, white) !important;
                }
                .content {
                    text-transform: uppercase !important;
                }
            `
}));
