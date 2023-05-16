import { h as html, F as FoundationElement, _ as __decorate, a as attr, c as css, b as baseHeightMultiplier, d as density, e as designUnit, t as typeRampBaseFontSize, n as neutralForegroundRest, f as controlCornerRadius, p as provideFASTDesignSystem, s as styleMap } from '../../SiteStyleMapping-b3f47ce3.js';
import { D as DirectionalStyleSheetBehavior } from '../../direction-06026784.js';
import { d as display } from '../../display-26e2ea35.js';
import { w as when } from '../../when-189f5ef4.js';

/**
 * The template for {@link @microsoft/fast-foundation#Avatar} component.
 * @public
 */
const avatarTemplate = (context, definition) => html `
    <div
        class="backplate ${x => x.shape}"
        part="backplate"
        style="${x => x.fill ? `background-color: var(--avatar-fill-${x.fill});` : void 0}"
    >
        <a
            class="link"
            part="link"
            href="${x => (x.link ? x.link : void 0)}"
            style="${x => (x.color ? `color: var(--avatar-color-${x.color});` : void 0)}"
        >
            <slot name="media" part="media">${definition.media || ""}</slot>
            <slot class="content" part="content"><slot>
        </a>
    </div>
    <slot name="badge" part="badge"></slot>
`;

/**
 * An Avatar Custom HTML Element
 *
 * @slot media - Used for media such as an image
 * @slot - The default slot for avatar text, commonly a name or initials
 * @slot badge - Used to provide a badge, such as a status badge
 * @csspart backplate - The wrapping container for the avatar
 * @csspart link - The avatar link
 * @csspart media - The media slot
 * @csspart content - The default slot
 *
 * @public
 */
let Avatar$1 = class Avatar extends FoundationElement {
    /**
     * Internal
     */
    connectedCallback() {
        super.connectedCallback();
        if (!this.shape) {
            this.shape = "circle";
        }
    }
};
__decorate([
    attr
], Avatar$1.prototype, "fill", void 0);
__decorate([
    attr
], Avatar$1.prototype, "color", void 0);
__decorate([
    attr
], Avatar$1.prototype, "link", void 0);
__decorate([
    attr
], Avatar$1.prototype, "shape", void 0);

/**
 * A Badge Custom HTML Element.
 * @slot - The default slot for the badge
 * @csspart control - The element representing the badge, which wraps the default slot
 *
 * @public
 */
class Badge extends FoundationElement {
    constructor() {
        super(...arguments);
        this.generateBadgeStyle = () => {
            if (!this.fill && !this.color) {
                return;
            }
            const fill = `background-color: var(--badge-fill-${this.fill});`;
            const color = `color: var(--badge-color-${this.color});`;
            if (this.fill && !this.color) {
                return fill;
            }
            else if (this.color && !this.fill) {
                return color;
            }
            else {
                return `${color} ${fill}`;
            }
        };
    }
}
__decorate([
    attr({ attribute: "fill" })
], Badge.prototype, "fill", void 0);
__decorate([
    attr({ attribute: "color" })
], Badge.prototype, "color", void 0);
__decorate([
    attr({ mode: "boolean" })
], Badge.prototype, "circular", void 0);

const rtl = (context, definition) => css `
    ::slotted(${context.tagFor(Badge)}) {
        left: 0;
    }
`;
const ltr = (context, definition) => css `
    ::slotted(${context.tagFor(Badge)}) {
        right: 0;
    }
`;
/**
 * Styles for Avatar
 * @public
 */
const avatarStyles = (context, definition) => css `
        ${display("flex")} :host {
            position: relative;
            height: var(--avatar-size, var(--avatar-size-default));
            max-width: var(--avatar-size, var(--avatar-size-default));
            --avatar-size-default: calc(
                (
                        (${baseHeightMultiplier} + ${density}) * ${designUnit} +
                            ((${designUnit} * 8) - 40)
                    ) * 1px
            );
            --avatar-text-size: ${typeRampBaseFontSize};
            --avatar-text-ratio: ${designUnit};
        }

        .link {
            text-decoration: none;
            color: ${neutralForegroundRest};
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            min-width: 100%;
        }

        .square {
            border-radius: calc(${controlCornerRadius} * 1px);
            min-width: 100%;
            overflow: hidden;
        }

        .circle {
            border-radius: 100%;
            min-width: 100%;
            overflow: hidden;
        }

        .backplate {
            position: relative;
            display: flex;
        }

        .media,
        ::slotted(img) {
            max-width: 100%;
            position: absolute;
            display: block;
        }

        .content {
            font-size: calc(
                (var(--avatar-text-size) + var(--avatar-size, var(--avatar-size-default))) /
                    var(--avatar-text-ratio)
            );
            line-height: var(--avatar-size, var(--avatar-size-default));
            display: block;
            min-height: var(--avatar-size, var(--avatar-size-default));
        }

        ::slotted(${context.tagFor(Badge)}) {
            position: absolute;
            display: block;
        }
    `.withBehaviors(new DirectionalStyleSheetBehavior(ltr(context), rtl(context)));

/**
 * The FAST Avatar Class
 * @public
 *
 */
class Avatar extends Avatar$1 {
}
__decorate([
    attr({ attribute: "src" })
], Avatar.prototype, "imgSrc", void 0);
__decorate([
    attr
], Avatar.prototype, "alt", void 0);
/**
 * The FAST Avatar Template for Images
 *  @public
 *
 */
const imgTemplate = html `
    ${when(x => x.imgSrc, html `
            <img
                src="${x => x.imgSrc}"
                alt="${x => x.alt}"
                slot="media"
                class="media"
                part="media"
            />
        `)}
`;
/**
 * A function that returns a {@link @microsoft/fast-foundation#Avatar} registration for configuring the component with a DesignSystem.
 *  {@link @microsoft/fast-foundation#avatarTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-avatar>`
 */
const fastAvatar = Avatar.compose({
    baseName: "avatar",
    baseClass: Avatar$1,
    template: avatarTemplate,
    styles: avatarStyles,
    media: imgTemplate,
    shadowOptions: {
        delegatesFocus: true,
    },
});

provideFASTDesignSystem()
    .withPrefix("site")
    .register(fastAvatar({
    // eslint-disable-next-line arrow-body-style
    styles: (context, definition) => css `
                ${styleMap}
                ${avatarStyles(context)}
            `
}));
