import {
    provideFASTDesignSystem,
    fastDataGridCell, dataGridCellStyles,
    fastDataGridRow, dataGridRowStyles,
    fastDataGrid, dataGridStyles,
} from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";
import { styleMap } from './SiteStyleMapping.js';

provideFASTDesignSystem()
    .withPrefix("site")
    .register(
        fastDataGridCell({
            // eslint-disable-next-line arrow-body-style
            styles: (context, definition) => css` 
                ${ dataGridCellStyles(context, definition) } 
                ${ styleMap }
            `
        }),
        fastDataGridRow({
            styles: (context, definition) => css`
                ${ dataGridRowStyles(context, definition) }
                ${ styleMap }     
            `
        }),
        fastDataGrid({
            styles: (context, definition) => css`
                ${ dataGridStyles(context, definition) }
                ${ styleMap }          
            `
        })
    );