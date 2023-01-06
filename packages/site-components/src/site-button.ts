import {
    provideFASTDesignSystem,
    fastButton, buttonStyles
} from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";
import { styleMap } from './SiteStyleMapping.js';

provideFASTDesignSystem()
    .withPrefix("site")
    .register(
        fastButton({
            // eslint-disable-next-line arrow-body-style
            styles: (context, definition) => css`
                ${ styleMap }
                ${ buttonStyles(context,definition) }
                :host {
                    --neutral-foreground-rest: var(--uva-white, white) !important;
                }
                .content {
                    text-transform: uppercase !important;
                }
            `
        })
    );