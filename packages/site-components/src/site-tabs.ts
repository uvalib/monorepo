import {
    provideFASTDesignSystem,
    fastTab, tabStyles,
    fastTabPanel, tabPanelStyles,
    fastTabs, tabsStyles
} from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";
import { styleMap } from './SiteStyleMapping.js';

provideFASTDesignSystem()
    .withPrefix("site")
    .register(
        fastTab({
            styles: (context, definition) => css`
                ${ tabStyles(context, definition) }
                ${ styleMap }
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
        }),
        fastTabPanel({
            styles: (context, definition) => css`
                ${ tabPanelStyles(context, definition) }
                ${ styleMap }
            `
        }),
        fastTabs({
            styles: (context, definition) => css`
                ${ tabsStyles(context, definition) }
                ${ styleMap }      
            `
        })
    );