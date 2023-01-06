import {
    provideFASTDesignSystem,
    fastCard, cardStyles
} from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";
import { styleMap } from './SiteStyleMapping.js';

provideFASTDesignSystem()
    .withPrefix("site")
    .register(
        fastCard({
            // eslint-disable-next-line arrow-body-style
            styles: (context, definition) => css`
                ${ styleMap }
                ${ cardStyles(context,definition) }
                :host {
                    padding: 10px;
                    --fill-color: var(--uva-grey-lightest, lightgrey) !important;
                }
            `
        })
    );