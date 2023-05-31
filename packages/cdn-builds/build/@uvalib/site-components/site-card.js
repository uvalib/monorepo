import { h as html, F as FoundationElement, c as css, g as fillColor, f as controlCornerRadius, i as composedParent, j as neutralFillLayerRecipe, p as provideFASTDesignSystem, s as styleMap } from '../../SiteStyleMapping-5e16ab05.js';
import { e as elevation } from '../../elevation-fb0d8a20.js';
import { d as display } from '../../display-26e2ea35.js';
import { f as forcedColorsStylesheetBehavior, S as SystemColors } from '../../match-media-stylesheet-behavior-5f2c3a3c.js';

/**
 * The template for the {@link @microsoft/fast-foundation#Card} component.
 * @public
 */
const cardTemplate = (context, definition) => html `
    <slot></slot>
`;

/**
 * An Card Custom HTML Element.
 *
 * @slot - The default slot for the card content
 *
 * @public
 */
let Card$1 = class Card extends FoundationElement {
};

/**
 * Styles for Card
 * @public
 */
const cardStyles = (context, definition) => css `
        ${display("block")} :host {
            --elevation: 4;
            display: block;
            contain: content;
            height: var(--card-height, 100%);
            width: var(--card-width, 100%);
            box-sizing: border-box;
            background: ${fillColor};
            border-radius: calc(${controlCornerRadius} * 1px);
            ${elevation}
        }
    `.withBehaviors(forcedColorsStylesheetBehavior(css `
                :host {
                    forced-color-adjust: none;
                    background: ${SystemColors.Canvas};
                    box-shadow: 0 0 0 1px ${SystemColors.CanvasText};
                }
            `));

/**
 * @internal
 */
class Card extends Card$1 {
    connectedCallback() {
        super.connectedCallback();
        const parent = composedParent(this);
        if (parent) {
            fillColor.setValueFor(this, (target) => neutralFillLayerRecipe
                .getValueFor(target)
                .evaluate(target, fillColor.getValueFor(parent)));
        }
    }
}
/**
 * A function that returns a {@link @microsoft/fast-foundation#Card} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#cardTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-card>`
 */
const fastCard = Card.compose({
    baseName: "card",
    baseClass: Card$1,
    template: cardTemplate,
    styles: cardStyles,
});

provideFASTDesignSystem()
    .withPrefix("site")
    .register(fastCard({
    // eslint-disable-next-line arrow-body-style
    styles: (context, definition) => css `
                ${styleMap}
                ${cardStyles()}
                :host {
                    padding: 10px;
                    --fill-color: var(--uva-grey-lightest, lightgrey) !important;
                }
            `
}));
