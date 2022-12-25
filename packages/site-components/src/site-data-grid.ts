import {
    provideFASTDesignSystem,
    fastDataGridCell,
    fastDataGridRow,
    fastDataGrid
} from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";

provideFASTDesignSystem()
    .withPrefix("site")
    .register(
        fastDataGridCell({
            styles: (context, definition) => css`
:host {
    padding: calc(var(--design-unit) * 1px) calc(var(--design-unit) * 3px);
    box-sizing: border-box;
    line-height: var(--type-ramp-base-line-height);
    font-weight: 400;
    border: transparent calc(var(--stroke-width) * 1px) solid;
    overflow: hidden;
    white-space: nowrap;
    border-radius: calc(var(--control-corner-radius) * 1px);
}            
            `
        }),
        fastDataGridRow({
            styles: (context, definition) => css`
:host {
    display: grid;
    padding: 1px 0px;
    box-sizing: border-box;
    width: 100%;
    border-bottom: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
}            
            `
        }),
        fastDataGrid({
            styles: (context, definition) => css`
:host {
    display: flex;
    position: relative;
    flex-direction: column;
}            
            `
        })
    );