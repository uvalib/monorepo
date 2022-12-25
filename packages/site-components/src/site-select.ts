import {
    provideFASTDesignSystem,
    fastSelect,
    fastOption,
} from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";

provideFASTDesignSystem()
    .withPrefix("site")
    .register(
        fastSelect({
            styles: (context, definition) => css`
:host {
    display: inline-flex;
    --elevation: 14;
    background: var(--neutral-fill-input-rest);
    border-radius: calc(var(--control-corner-radius) * 1px);
    border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-rest);
    box-sizing: border-box;
    color: var(--neutral-foreground-rest);
    font-family: var(--body-font);
    height: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px);
    position: relative;
    user-select: none;
    min-width: 250px;
    outline: none;
    vertical-align: top;
}

.control {
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    font-size: var(--type-ramp-base-font-size);
    font-family: inherit;
    line-height: var(--type-ramp-base-line-height);
    min-height: 100%;
    padding: 0 calc(var(--design-unit) * 2.25px);
    width: 100%;
}

.selected-value {
    flex: 1 1 auto;
    font-family: inherit;
    text-align: start;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

div {
    display: block;
}

.start, .end, .indicator, .select-indicator, ::slotted(svg) {
    fill: currentcolor;
    height: 1em;
    min-height: calc(var(--design-unit) * 4px);
    min-width: calc(var(--design-unit) * 4px);
    width: 1em;
}

.indicator {
    flex: 0 0 auto;
    margin-inline-start: 1em;
}

.listbox[hidden] {
    display: none;
}

.listbox {
    box-shadow: 0 0 calc((var(--elevation) * 0.225px) + 2px) rgba(0, 0, 0, calc(0.11 * (2 - var(--background-luminance, 1)))), 0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px)) rgba(0, 0, 0, calc(0.13 * (2 - var(--background-luminance, 1))));
    background: var(--neutral-layer-floating);
    border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-rest);
    border-radius: calc(var(--control-corner-radius) * 1px);
    box-sizing: border-box;
    display: inline-flex;
    flex-direction: column;
    left: 0px;
    max-height: calc(var(--max-height) - ((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px));
    padding: calc(var(--design-unit) * 1px) 0;
    overflow-y: auto;
    position: absolute;
    width: 100%;
    z-index: 1;
}
            `
        }), 
        fastOption({
            styles: (context, definition) => css`
:host {
    display: inline-flex;
    align-items: center;
    font-family: var(--body-font);
    border-radius: calc(var(--control-corner-radius) * 1px);
    border: calc(var(--focus-stroke-width) * 1px) solid var(--neutral-layer-floating);
    box-sizing: border-box;
    color: var(--neutral-foreground-rest);
    cursor: pointer;
    flex: 0 0 auto;
    fill: currentcolor;
    font-size: var(--type-ramp-base-font-size);
    height: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px);
    line-height: var(--type-ramp-base-line-height);
    margin: 0 calc((var(--design-unit) - var(--focus-stroke-width)) * 1px);
    outline: none;
    overflow: hidden;
    padding: 0px 1ch;
    user-select: none;
    white-space: nowrap;
} 

:host([aria-selected="true"]) {
    background: var(--accent-fill-rest);
    color: var(--foreground-on-accent-rest);
}

.content {
    grid-column-start: 2;
    justify-self: start;
    overflow: hidden;
    text-overflow: ellipsis;
}
            `})
    );