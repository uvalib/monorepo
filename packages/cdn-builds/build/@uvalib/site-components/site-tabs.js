import { h as html, F as FoundationElement, _ as __decorate, a as attr, o as observable, c as css, u as bodyFont, t as typeRampBaseFontSize, v as typeRampBaseLineHeight, n as neutralForegroundRest, e as designUnit, G as accentFillRest, f as controlCornerRadius, a2 as neutralForegroundHint, m as strokeWidth, C as disabledOpacity, N as neutralFillStealthRest, r as neutralFillRest, a3 as accentForegroundRest, a4 as neutralFillHover, a5 as accentForegroundHover, a6 as neutralFillActive, a7 as accentForegroundActive, x as focusStrokeOuter, w as focusStrokeWidth, d as density, p as provideFASTDesignSystem, s as styleMap } from '../../SiteStyleMapping-5e16ab05.js';
import { d as display } from '../../display-26e2ea35.js';
import { h as heightNumber, d as disabledCursor } from '../../size-eacfc77a.js';
import { f as forcedColorsStylesheetBehavior, S as SystemColors } from '../../match-media-stylesheet-behavior-5f2c3a3c.js';
import { s as startSlotTemplate, r as ref, e as endSlotTemplate, u as uniqueId, w as wrapInBounds, a as applyMixins, S as StartEnd } from '../../strings-f7a0f37b.js';
import { s as slotted, b as keyArrowRight, c as keyArrowLeft, g as keyArrowDown, h as keyArrowUp, k as keyEnd, a as keyHome, m as focusVisible } from '../../focus-21960583.js';
import { w as when } from '../../when-189f5ef4.js';

/**
 * The template for the {@link @microsoft/fast-foundation#TabPanel} component.
 * @public
 */
const tabPanelTemplate = (context, definition) => html `
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;

/**
 * A TabPanel Component to be used with {@link @microsoft/fast-foundation#(Tabs:class)}
 *
 * @slot - The default slot for the tabpanel content
 *
 * @public
 */
class TabPanel extends FoundationElement {
}

/**
 * The template for the {@link @microsoft/fast-foundation#Tab} component.
 * @public
 */
const tabTemplate = (context, definition) => html `
    <template slot="tab" role="tab" aria-disabled="${x => x.disabled}">
        <slot></slot>
    </template>
`;

/**
 * A Tab Component to be used with {@link @microsoft/fast-foundation#(Tabs:class)}
 *
 * @slot - The default slot for the tab content
 *
 * @public
 */
class Tab extends FoundationElement {
}
__decorate([
    attr({ mode: "boolean" })
], Tab.prototype, "disabled", void 0);

/**
 * The template for the {@link @microsoft/fast-foundation#(Tabs:class)} component.
 * @public
 */
const tabsTemplate = (context, definition) => html `
    <template class="${x => x.orientation}">
        ${startSlotTemplate(context, definition)}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${slotted("tabs")}></slot>

            ${when(x => x.showActiveIndicator, html `
                    <div
                        ${ref("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `)}
        </div>
        ${endSlotTemplate(context, definition)}
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${slotted("tabpanels")}></slot>
        </div>
    </template>
`;

/**
 * The orientation of the {@link @microsoft/fast-foundation#(Tabs:class)} component
 * @public
 */
const TabsOrientation = {
    vertical: "vertical",
    horizontal: "horizontal",
};
/**
 * A Tabs Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#tablist | ARIA tablist }.
 *
 * @slot start - Content which can be provided before the tablist element
 * @slot end - Content which can be provided after the tablist element
 * @slot tab - The slot for tabs
 * @slot tabpanel - The slot for tabpanels
 * @csspart tablist - The element wrapping for the tabs
 * @csspart tab - The tab slot
 * @csspart activeIndicator - The visual indicator
 * @csspart tabpanel - The tabpanel slot
 * @fires change - Fires a custom 'change' event when a tab is clicked or during keyboard navigation
 *
 * @public
 */
class Tabs extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * The orientation
         * @public
         * @remarks
         * HTML Attribute: orientation
         */
        this.orientation = TabsOrientation.horizontal;
        /**
         * Whether or not to show the active indicator
         * @public
         * @remarks
         * HTML Attribute: activeindicator
         */
        this.activeindicator = true;
        /**
         * @internal
         */
        this.showActiveIndicator = true;
        this.prevActiveTabIndex = 0;
        this.activeTabIndex = 0;
        this.ticking = false;
        this.change = () => {
            this.$emit("change", this.activetab);
        };
        this.isDisabledElement = (el) => {
            return el.getAttribute("aria-disabled") === "true";
        };
        this.isFocusableElement = (el) => {
            return !this.isDisabledElement(el);
        };
        this.setTabs = () => {
            const gridHorizontalProperty = "gridColumn";
            const gridVerticalProperty = "gridRow";
            const gridProperty = this.isHorizontal()
                ? gridHorizontalProperty
                : gridVerticalProperty;
            this.activeTabIndex = this.getActiveIndex();
            this.showActiveIndicator = false;
            this.tabs.forEach((tab, index) => {
                if (tab.slot === "tab") {
                    const isActiveTab = this.activeTabIndex === index && this.isFocusableElement(tab);
                    if (this.activeindicator && this.isFocusableElement(tab)) {
                        this.showActiveIndicator = true;
                    }
                    const tabId = this.tabIds[index];
                    const tabpanelId = this.tabpanelIds[index];
                    tab.setAttribute("id", tabId);
                    tab.setAttribute("aria-selected", isActiveTab ? "true" : "false");
                    tab.setAttribute("aria-controls", tabpanelId);
                    tab.addEventListener("click", this.handleTabClick);
                    tab.addEventListener("keydown", this.handleTabKeyDown);
                    tab.setAttribute("tabindex", isActiveTab ? "0" : "-1");
                    if (isActiveTab) {
                        this.activetab = tab;
                    }
                }
                // If the original property isn't emptied out,
                // the next set will morph into a grid-area style setting that is not what we want
                tab.style[gridHorizontalProperty] = "";
                tab.style[gridVerticalProperty] = "";
                tab.style[gridProperty] = `${index + 1}`;
                !this.isHorizontal()
                    ? tab.classList.add("vertical")
                    : tab.classList.remove("vertical");
            });
        };
        this.setTabPanels = () => {
            this.tabpanels.forEach((tabpanel, index) => {
                const tabId = this.tabIds[index];
                const tabpanelId = this.tabpanelIds[index];
                tabpanel.setAttribute("id", tabpanelId);
                tabpanel.setAttribute("aria-labelledby", tabId);
                this.activeTabIndex !== index
                    ? tabpanel.setAttribute("hidden", "")
                    : tabpanel.removeAttribute("hidden");
            });
        };
        this.handleTabClick = (event) => {
            const selectedTab = event.currentTarget;
            if (selectedTab.nodeType === 1 && this.isFocusableElement(selectedTab)) {
                this.prevActiveTabIndex = this.activeTabIndex;
                this.activeTabIndex = this.tabs.indexOf(selectedTab);
                this.setComponent();
            }
        };
        this.handleTabKeyDown = (event) => {
            if (this.isHorizontal()) {
                switch (event.key) {
                    case keyArrowLeft:
                        event.preventDefault();
                        this.adjustBackward(event);
                        break;
                    case keyArrowRight:
                        event.preventDefault();
                        this.adjustForward(event);
                        break;
                }
            }
            else {
                switch (event.key) {
                    case keyArrowUp:
                        event.preventDefault();
                        this.adjustBackward(event);
                        break;
                    case keyArrowDown:
                        event.preventDefault();
                        this.adjustForward(event);
                        break;
                }
            }
            switch (event.key) {
                case keyHome:
                    event.preventDefault();
                    this.adjust(-this.activeTabIndex);
                    break;
                case keyEnd:
                    event.preventDefault();
                    this.adjust(this.tabs.length - this.activeTabIndex - 1);
                    break;
            }
        };
        this.adjustForward = (e) => {
            const group = this.tabs;
            let index = 0;
            index = this.activetab ? group.indexOf(this.activetab) + 1 : 1;
            if (index === group.length) {
                index = 0;
            }
            while (index < group.length && group.length > 1) {
                if (this.isFocusableElement(group[index])) {
                    this.moveToTabByIndex(group, index);
                    break;
                }
                else if (this.activetab && index === group.indexOf(this.activetab)) {
                    break;
                }
                else if (index + 1 >= group.length) {
                    index = 0;
                }
                else {
                    index += 1;
                }
            }
        };
        this.adjustBackward = (e) => {
            const group = this.tabs;
            let index = 0;
            index = this.activetab ? group.indexOf(this.activetab) - 1 : 0;
            index = index < 0 ? group.length - 1 : index;
            while (index >= 0 && group.length > 1) {
                if (this.isFocusableElement(group[index])) {
                    this.moveToTabByIndex(group, index);
                    break;
                }
                else if (index - 1 < 0) {
                    index = group.length - 1;
                }
                else {
                    index -= 1;
                }
            }
        };
        this.moveToTabByIndex = (group, index) => {
            const tab = group[index];
            this.activetab = tab;
            this.prevActiveTabIndex = this.activeTabIndex;
            this.activeTabIndex = index;
            tab.focus();
            this.setComponent();
        };
    }
    /**
     * @internal
     */
    orientationChanged() {
        if (this.$fastController.isConnected) {
            this.setTabs();
            this.setTabPanels();
            this.handleActiveIndicatorPosition();
        }
    }
    /**
     * @internal
     */
    activeidChanged(oldValue, newValue) {
        if (this.$fastController.isConnected &&
            this.tabs.length <= this.tabpanels.length) {
            this.prevActiveTabIndex = this.tabs.findIndex((item) => item.id === oldValue);
            this.setTabs();
            this.setTabPanels();
            this.handleActiveIndicatorPosition();
        }
    }
    /**
     * @internal
     */
    tabsChanged() {
        if (this.$fastController.isConnected &&
            this.tabs.length <= this.tabpanels.length) {
            this.tabIds = this.getTabIds();
            this.tabpanelIds = this.getTabPanelIds();
            this.setTabs();
            this.setTabPanels();
            this.handleActiveIndicatorPosition();
        }
    }
    /**
     * @internal
     */
    tabpanelsChanged() {
        if (this.$fastController.isConnected &&
            this.tabpanels.length <= this.tabs.length) {
            this.tabIds = this.getTabIds();
            this.tabpanelIds = this.getTabPanelIds();
            this.setTabs();
            this.setTabPanels();
            this.handleActiveIndicatorPosition();
        }
    }
    getActiveIndex() {
        const id = this.activeid;
        if (id !== undefined) {
            return this.tabIds.indexOf(this.activeid) === -1
                ? 0
                : this.tabIds.indexOf(this.activeid);
        }
        else {
            return 0;
        }
    }
    getTabIds() {
        return this.tabs.map((tab) => {
            var _a;
            return (_a = tab.getAttribute("id")) !== null && _a !== void 0 ? _a : `tab-${uniqueId()}`;
        });
    }
    getTabPanelIds() {
        return this.tabpanels.map((tabPanel) => {
            var _a;
            return (_a = tabPanel.getAttribute("id")) !== null && _a !== void 0 ? _a : `panel-${uniqueId()}`;
        });
    }
    setComponent() {
        if (this.activeTabIndex !== this.prevActiveTabIndex) {
            this.activeid = this.tabIds[this.activeTabIndex];
            this.focusTab();
            this.change();
        }
    }
    isHorizontal() {
        return this.orientation === TabsOrientation.horizontal;
    }
    handleActiveIndicatorPosition() {
        // Ignore if we click twice on the same tab
        if (this.showActiveIndicator &&
            this.activeindicator &&
            this.activeTabIndex !== this.prevActiveTabIndex) {
            if (this.ticking) {
                this.ticking = false;
            }
            else {
                this.ticking = true;
                this.animateActiveIndicator();
            }
        }
    }
    animateActiveIndicator() {
        this.ticking = true;
        const gridProperty = this.isHorizontal() ? "gridColumn" : "gridRow";
        const translateProperty = this.isHorizontal()
            ? "translateX"
            : "translateY";
        const offsetProperty = this.isHorizontal() ? "offsetLeft" : "offsetTop";
        const prev = this.activeIndicatorRef[offsetProperty];
        this.activeIndicatorRef.style[gridProperty] = `${this.activeTabIndex + 1}`;
        const next = this.activeIndicatorRef[offsetProperty];
        this.activeIndicatorRef.style[gridProperty] = `${this.prevActiveTabIndex + 1}`;
        const dif = next - prev;
        this.activeIndicatorRef.style.transform = `${translateProperty}(${dif}px)`;
        this.activeIndicatorRef.classList.add("activeIndicatorTransition");
        this.activeIndicatorRef.addEventListener("transitionend", () => {
            this.ticking = false;
            this.activeIndicatorRef.style[gridProperty] = `${this.activeTabIndex + 1}`;
            this.activeIndicatorRef.style.transform = `${translateProperty}(0px)`;
            this.activeIndicatorRef.classList.remove("activeIndicatorTransition");
        });
    }
    /**
     * The adjust method for FASTTabs
     * @public
     * @remarks
     * This method allows the active index to be adjusted by numerical increments
     */
    adjust(adjustment) {
        this.prevActiveTabIndex = this.activeTabIndex;
        this.activeTabIndex = wrapInBounds(0, this.tabs.length - 1, this.activeTabIndex + adjustment);
        this.setComponent();
    }
    focusTab() {
        this.tabs[this.activeTabIndex].focus();
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        this.tabIds = this.getTabIds();
        this.tabpanelIds = this.getTabPanelIds();
        this.activeTabIndex = this.getActiveIndex();
    }
}
__decorate([
    attr
], Tabs.prototype, "orientation", void 0);
__decorate([
    attr
], Tabs.prototype, "activeid", void 0);
__decorate([
    observable
], Tabs.prototype, "tabs", void 0);
__decorate([
    observable
], Tabs.prototype, "tabpanels", void 0);
__decorate([
    attr({ mode: "boolean" })
], Tabs.prototype, "activeindicator", void 0);
__decorate([
    observable
], Tabs.prototype, "activeIndicatorRef", void 0);
__decorate([
    observable
], Tabs.prototype, "showActiveIndicator", void 0);
applyMixins(Tabs, StartEnd);

/**
 * Styles for Tabs
 * @public
 */
const tabsStyles = (context, definition) => css `
        ${display("grid")} :host {
            box-sizing: border-box;
            font-family: ${bodyFont};
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
            color: ${neutralForegroundRest};
            grid-template-columns: auto 1fr auto;
            grid-template-rows: auto 1fr;
        }

        .tablist {
            display: grid;
            grid-template-rows: auto auto;
            grid-template-columns: auto;
            position: relative;
            width: max-content;
            align-self: end;
            padding: calc(${designUnit} * 4px) calc(${designUnit} * 4px) 0;
            box-sizing: border-box;
        }

        .start,
        .end {
            align-self: center;
        }

        .activeIndicator {
            grid-row: 2;
            grid-column: 1;
            width: 100%;
            height: 5px;
            justify-self: center;
            background: ${accentFillRest};
            margin-top: 10px;
            border-radius: calc(${controlCornerRadius} * 1px)
                calc(${controlCornerRadius} * 1px) 0 0;
        }

        .activeIndicatorTransition {
            transition: transform 0.2s ease-in-out;
        }

        .tabpanel {
            grid-row: 2;
            grid-column-start: 1;
            grid-column-end: 4;
            position: relative;
        }

        :host([orientation="vertical"]) {
            grid-template-rows: auto 1fr auto;
            grid-template-columns: auto 1fr;
        }

        :host([orientation="vertical"]) .tablist {
            grid-row-start: 2;
            grid-row-end: 2;
            display: grid;
            grid-template-rows: auto;
            grid-template-columns: auto 1fr;
            position: relative;
            width: max-content;
            justify-self: end;
            align-self: flex-start;
            width: 100%;
            padding: 0 calc(${designUnit} * 4px)
                calc((${heightNumber} - ${designUnit}) * 1px) 0;
        }

        :host([orientation="vertical"]) .tabpanel {
            grid-column: 2;
            grid-row-start: 1;
            grid-row-end: 4;
        }

        :host([orientation="vertical"]) .end {
            grid-row: 3;
        }

        :host([orientation="vertical"]) .activeIndicator {
            grid-column: 1;
            grid-row: 1;
            width: 5px;
            height: 100%;
            margin-inline-end: 10px;
            align-self: center;
            background: ${accentFillRest};
            margin-top: 0;
            border-radius: 0 calc(${controlCornerRadius} * 1px)
                calc(${controlCornerRadius} * 1px) 0;
        }

        :host([orientation="vertical"]) .activeIndicatorTransition {
            transition: transform 0.2s linear;
        }
    `.withBehaviors(forcedColorsStylesheetBehavior(css `
                .activeIndicator,
                :host([orientation="vertical"]) .activeIndicator {
                    forced-color-adjust: none;
                    background: ${SystemColors.Highlight};
                }
            `));

/**
 * Styles for Tab
 * @public
 */
const tabStyles = (context, definition) => css `
    ${display("inline-flex")} :host {
        box-sizing: border-box;
        font-family: ${bodyFont};
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        height: calc(${heightNumber} * 1px);
        padding: calc(${designUnit} * 5px) calc(${designUnit} * 4px);
        color: ${neutralForegroundHint};
        fill: currentcolor;
        border-radius: calc(${controlCornerRadius} * 1px);
        border: calc(${strokeWidth} * 1px) solid transparent;
        align-items: center;
        justify-content: center;
        grid-row: 1;
        cursor: pointer;
    }

    :host(:hover) {
        color: ${neutralForegroundRest};
        fill: currentcolor;
    }

    :host(:active) {
        color: ${neutralForegroundRest};
        fill: currentcolor;
    }

    :host([disabled]) {
        cursor: ${disabledCursor};
        opacity: ${disabledOpacity};
    }

    :host([disabled]:hover) {
        color: ${neutralForegroundHint};
        background: ${neutralFillStealthRest};
    }

    :host([aria-selected="true"]) {
        background: ${neutralFillRest};
        color: ${accentForegroundRest};
        fill: currentcolor;
    }

    :host([aria-selected="true"]:hover) {
        background: ${neutralFillHover};
        color: ${accentForegroundHover};
        fill: currentcolor;
    }

    :host([aria-selected="true"]:active) {
        background: ${neutralFillActive};
        color: ${accentForegroundActive};
        fill: currentcolor;
    }

    :host(:${focusVisible}) {
        outline: none;
        border: calc(${strokeWidth} * 1px) solid ${focusStrokeOuter};
        box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px)
            ${focusStrokeOuter};
    }

    :host(:focus) {
        outline: none;
    }

    :host(.vertical) {
        justify-content: end;
        grid-column: 2;
    }

    :host(.vertical[aria-selected="true"]) {
        z-index: 2;
    }

    :host(.vertical:hover) {
        color: ${neutralForegroundRest};
    }

    :host(.vertical:active) {
        color: ${neutralForegroundRest};
    }

    :host(.vertical:hover[aria-selected="true"]) {
    }
`.withBehaviors(forcedColorsStylesheetBehavior(css `
            :host {
                forced-color-adjust: none;
                border-color: transparent;
                color: ${SystemColors.ButtonText};
                fill: currentcolor;
            }
            :host(:hover),
            :host(.vertical:hover),
            :host([aria-selected="true"]:hover) {
                background: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
                fill: currentcolor;
            }
            :host([aria-selected="true"]) {
                background: ${SystemColors.HighlightText};
                color: ${SystemColors.Highlight};
                fill: currentcolor;
            }
            :host(:${focusVisible}) {
                border-color: ${SystemColors.ButtonText};
                box-shadow: none;
            }
            :host([disabled]),
            :host([disabled]:hover) {
                opacity: 1;
                color: ${SystemColors.GrayText};
                background: ${SystemColors.ButtonFace};
            }
        `));

/**
 * A function that returns a {@link @microsoft/fast-foundation#Tab} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#tabTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-tab>`
 */
const fastTab = Tab.compose({
    baseName: "tab",
    template: tabTemplate,
    styles: tabStyles,
});

/**
 * Styles for Tab Panel
 * @public
 */
const tabPanelStyles = (context, definition) => css `
    ${display("block")} :host {
        box-sizing: border-box;
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        padding: 0 calc((6 + (${designUnit} * 2 * ${density})) * 1px);
    }
`;

/**
 * A function that returns a {@link @microsoft/fast-foundation#TabPanel} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#tabPanelTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-tab-panel>`
 */
const fastTabPanel = TabPanel.compose({
    baseName: "tab-panel",
    template: tabPanelTemplate,
    styles: tabPanelStyles,
});

/**
 * A function that returns a {@link @microsoft/fast-foundation#Tabs} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#tabsTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-tabs>`
 */
const fastTabs = Tabs.compose({
    baseName: "tabs",
    template: tabsTemplate,
    styles: tabsStyles,
});

provideFASTDesignSystem()
    .withPrefix("site")
    .register(fastTab({
    styles: (context, definition) => css `
                ${tabStyles()}
                ${styleMap}
                :host {
                    /* relevent styles from .uvalib-button style in current drupal theme */
                    background-color: var(--uva-blue-alt-base, lightblue);
                    color: var(--uva-white, white);
                    text-transform: uppercase;
                }
                :host([aria-selected="true"]) {
                    background-color: var(--uva-brand-blue-base, blue);
                    color: var(--uva-white, white);
                }
                :host([aria-selected="true"]:hover) {
                    background: ;
                    color: var(--uva-white, white);
                }
                :host(:hover) {
                    background-color: var(--uva-blue-alt-dark, darkblue);
                    color: var(--uva-white, white);
                }
            `,
}), fastTabPanel({
    styles: (context, definition) => css `
                ${tabPanelStyles()}
                ${styleMap}
            `
}), fastTabs({
    styles: (context, definition) => css `
                ${tabsStyles()}
                ${styleMap}      
            `
}));
