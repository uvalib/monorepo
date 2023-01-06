import {
    provideFASTDesignSystem,
    fastSelect, selectStyles,
    fastOption, optionStyles,
} from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";
import { styleMap } from './SiteStyleMapping.js';

provideFASTDesignSystem()
    .withPrefix("site")
    .register(
        fastSelect({
            styles: (context, definition) => css`
                ${ styleMap }
                ${ selectStyles(context,definition) }
                :host .listbox {
                    background: var(--uva-grey-lightest);
                }
            `
        }), 
        fastOption({
            styles: (context, definition) => css`
                ${ styleMap }
                ${ optionStyles(context,definition) }
            `})
    );