import { h as html, F as FoundationElement, _ as __decorate, a as attr, o as observable, c as css, u as bodyFont, e as designUnit, C as disabledOpacity, E as neutralFillInputRest, f as controlCornerRadius, m as strokeWidth, B as neutralStrokeRest, I as neutralFillInputHover, Z as neutralStrokeHover, P as neutralFillInputActive, $ as neutralStrokeActive, g as fillColor, x as focusStrokeOuter, n as neutralForegroundRest, t as typeRampBaseFontSize, v as typeRampBaseLineHeight, U as foregroundOnAccentRest, G as accentFillRest, J as accentFillHover, V as foregroundOnAccentHover, Q as accentFillActive, W as foregroundOnAccentActive, p as provideFASTDesignSystem, s as styleMap } from '../../SiteStyleMapping-5e16ab05.js';
import { d as display } from '../../display-26e2ea35.js';
import { d as disabledCursor, h as heightNumber } from '../../size-eacfc77a.js';
import { s as slotted, o as keySpace, l as keyEnter, m as focusVisible } from '../../focus-21960583.js';
import { f as forcedColorsStylesheetBehavior, S as SystemColors } from '../../match-media-stylesheet-behavior-5f2c3a3c.js';
import { D as DirectionalStyleSheetBehavior } from '../../direction-06ea7156.js';
import { C as CheckableFormAssociated } from '../../form-associated-b47d00e0.js';

/**
 * The template for the {@link @microsoft/fast-foundation#(Switch:class)} component.
 * @public
 */
const switchTemplate = (context, definition) => html `
    <template
        role="switch"
        aria-checked="${x => x.checked}"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        tabindex="${x => (x.disabled ? null : 0)}"
        @keypress="${(x, c) => x.keypressHandler(c.event)}"
        @click="${(x, c) => x.clickHandler(c.event)}"
        class="${x => (x.checked ? "checked" : "")}"
    >
        <label
            part="label"
            class="${x => x.defaultSlottedNodes && x.defaultSlottedNodes.length
    ? "label"
    : "label label__hidden"}"
        >
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </label>
        <div part="switch" class="switch">
            <slot name="switch">${definition.switch || ""}</slot>
        </div>
        <span class="status-message" part="status-message">
            <span class="checked-message" part="checked-message">
                <slot name="checked-message"></slot>
            </span>
            <span class="unchecked-message" part="unchecked-message">
                <slot name="unchecked-message"></slot>
            </span>
        </span>
    </template>
`;

class _Switch extends FoundationElement {
}
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Switch:class)} component.
 *
 * @internal
 */
class FormAssociatedSwitch extends CheckableFormAssociated(_Switch) {
    constructor() {
        super(...arguments);
        this.proxy = document.createElement("input");
    }
}

/**
 * A Switch Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#switch | ARIA switch }.
 *
 * @slot - The deafult slot for the label
 * @slot checked-message - The message when in a checked state
 * @slot unchecked-message - The message when in an unchecked state
 * @csspart label - The label
 * @csspart switch - The element representing the switch, which wraps the indicator
 * @csspart status-message - The wrapper for the status messages
 * @csspart checked-message - The checked message
 * @csspart unchecked-message - The unchecked message
 * @fires change - Emits a custom change event when the checked state changes
 *
 * @public
 */
class Switch extends FormAssociatedSwitch {
    constructor() {
        super();
        /**
         * The element's value to be included in form submission when checked.
         * Default to "on" to reach parity with input[type="checkbox"]
         *
         * @internal
         */
        this.initialValue = "on";
        /**
         * @internal
         */
        this.keypressHandler = (e) => {
            if (this.readOnly) {
                return;
            }
            switch (e.key) {
                case keyEnter:
                case keySpace:
                    this.checked = !this.checked;
                    break;
            }
        };
        /**
         * @internal
         */
        this.clickHandler = (e) => {
            if (!this.disabled && !this.readOnly) {
                this.checked = !this.checked;
            }
        };
        this.proxy.setAttribute("type", "checkbox");
    }
    readOnlyChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.readOnly = this.readOnly;
        }
        this.readOnly
            ? this.classList.add("readonly")
            : this.classList.remove("readonly");
    }
    /**
     * @internal
     */
    checkedChanged(prev, next) {
        super.checkedChanged(prev, next);
        /**
         * @deprecated - this behavior already exists in the template and should not exist in the class.
         */
        this.checked ? this.classList.add("checked") : this.classList.remove("checked");
    }
}
__decorate([
    attr({ attribute: "readonly", mode: "boolean" })
], Switch.prototype, "readOnly", void 0);
__decorate([
    observable
], Switch.prototype, "defaultSlottedNodes", void 0);

/**
 * Styles for Switch
 * @public
 */
const switchStyles = (context, definition) => css `
        :host([hidden]) {
            display: none;
        }

        ${display("inline-flex")} :host {
            align-items: center;
            outline: none;
            font-family: ${bodyFont};
            margin: calc(${designUnit} * 1px) 0;
            ${
/*
 * Chromium likes to select label text or the default slot when
 * the checkbox is clicked. Maybe there is a better solution here?
 */ ""} user-select: none;
        }

        :host([disabled]) {
            opacity: ${disabledOpacity};
        }

        :host([disabled]) .label,
        :host([readonly]) .label,
        :host([readonly]) .switch,
        :host([disabled]) .switch {
            cursor: ${disabledCursor};
        }

        .switch {
            position: relative;
            outline: none;
            box-sizing: border-box;
            width: calc(${heightNumber} * 1px);
            height: calc((${heightNumber} / 2 + ${designUnit}) * 1px);
            background: ${neutralFillInputRest};
            border-radius: calc(${controlCornerRadius} * 1px);
            border: calc(${strokeWidth} * 1px) solid ${neutralStrokeRest};
        }

        .switch:hover {
            background: ${neutralFillInputHover};
            border-color: ${neutralStrokeHover};
            cursor: pointer;
        }

        host([disabled]) .switch:hover,
        host([readonly]) .switch:hover {
            background: ${neutralFillInputHover};
            border-color: ${neutralStrokeHover};
            cursor: ${disabledCursor};
        }

        :host(:not([disabled])) .switch:active {
            background: ${neutralFillInputActive};
            border-color: ${neutralStrokeActive};
        }

        :host(:${focusVisible}) .switch {
            box-shadow: 0 0 0 2px ${fillColor}, 0 0 0 4px ${focusStrokeOuter};
        }

        .checked-indicator {
            position: absolute;
            top: 5px;
            bottom: 5px;
            background: ${neutralForegroundRest};
            border-radius: calc(${controlCornerRadius} * 1px);
            transition: all 0.2s ease-in-out;
        }

        .status-message {
            color: ${neutralForegroundRest};
            cursor: pointer;
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
        }

        :host([disabled]) .status-message,
        :host([readonly]) .status-message {
            cursor: ${disabledCursor};
        }

        .label {
            color: ${neutralForegroundRest};
            margin-inline-end: calc(${designUnit} * 2px + 2px);
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
            cursor: pointer;
        }

        .label__hidden {
            display: none;
            visibility: hidden;
        }

        ::slotted([slot="checked-message"]),
        ::slotted([slot="unchecked-message"]) {
            margin-inline-start: calc(${designUnit} * 2px + 2px);
        }

        :host([aria-checked="true"]) .checked-indicator {
            background: ${foregroundOnAccentRest};
        }

        :host([aria-checked="true"]) .switch {
            background: ${accentFillRest};
            border-color: ${accentFillRest};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:hover {
            background: ${accentFillHover};
            border-color: ${accentFillHover};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator {
            background: ${foregroundOnAccentHover};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:active {
            background: ${accentFillActive};
            border-color: ${accentFillActive};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:active .checked-indicator {
            background: ${foregroundOnAccentActive};
        }

        :host([aria-checked="true"]:${focusVisible}:not([disabled])) .switch {
            box-shadow: 0 0 0 2px ${fillColor}, 0 0 0 4px ${focusStrokeOuter};
        }

        .unchecked-message {
            display: block;
        }

        .checked-message {
            display: none;
        }

        :host([aria-checked="true"]) .unchecked-message {
            display: none;
        }

        :host([aria-checked="true"]) .checked-message {
            display: block;
        }
    `.withBehaviors(forcedColorsStylesheetBehavior(css `
            .checked-indicator,
            :host(:not([disabled])) .switch:active .checked-indicator {
                forced-color-adjust: none;
                background: ${SystemColors.FieldText};
            }
            .switch {
                forced-color-adjust: none;
                background: ${SystemColors.Field};
                border-color: ${SystemColors.FieldText};
            }
            :host(:not([disabled])) .switch:hover {
                background: ${SystemColors.HighlightText};
                border-color: ${SystemColors.Highlight};
            }
            :host([aria-checked="true"]) .switch {
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.Highlight};
            }
            :host([aria-checked="true"]:not([disabled])) .switch:hover,
            :host(:not([disabled])) .switch:active {
                background: ${SystemColors.HighlightText};
                border-color: ${SystemColors.Highlight};
            }
            :host([aria-checked="true"]) .checked-indicator {
                background: ${SystemColors.HighlightText};
            }
            :host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator {
                background: ${SystemColors.Highlight};
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host(:${focusVisible}) .switch {
                border-color: ${SystemColors.Highlight};
                box-shadow: 0 0 0 2px ${SystemColors.Field}, 0 0 0 4px ${SystemColors.FieldText};
            }
            :host([aria-checked="true"]:${focusVisible}:not([disabled])) .switch {
                box-shadow: 0 0 0 2px ${SystemColors.Field}, 0 0 0 4px ${SystemColors.FieldText};
            }
            :host([disabled]) .checked-indicator {
                background: ${SystemColors.GrayText};
            }
            :host([disabled]) .switch {
                background: ${SystemColors.Field};
                border-color: ${SystemColors.GrayText};
            }
        `), new DirectionalStyleSheetBehavior(css `
                .checked-indicator {
                    left: 5px;
                    right: calc(((${heightNumber} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    left: calc(((${heightNumber} / 2) + 1) * 1px);
                    right: 5px;
                }
            `, css `
                .checked-indicator {
                    right: 5px;
                    left: calc(((${heightNumber} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    right: calc(((${heightNumber} / 2) + 1) * 1px);
                    left: 5px;
                }
            `));

/**
 * A function that returns a {@link @microsoft/fast-foundation#Switch} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#switchTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-switch>`
 */
const fastSwitch = Switch.compose({
    baseName: "switch",
    template: switchTemplate,
    styles: switchStyles,
    switch: /* html */ `
        <span class="checked-indicator" part="checked-indicator"></span>
    `,
});

provideFASTDesignSystem()
    .withPrefix("site")
    .register(fastSwitch({
    // eslint-disable-next-line arrow-body-style
    styles: (context, definition) => {
        return [styleMap, switchStyles()];
    }
}));
