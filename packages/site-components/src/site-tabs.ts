import {
    provideFASTDesignSystem,
    fastTab,
    fastTabPanel,
    fastTabs
} from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";


provideFASTDesignSystem()
    .withPrefix("site")
    .register(
        fastTab({
            styles: (context, definition) => css`
/* Button style */
:host {
    font-size: 1em;
    appearance: none;
    border: 0;
    cursor: pointer;
    display: inline-block;
    margin: 0.8em 0.4em;
    padding: 0.6rem 1.25rem;
    text-align: center;
    text-decoration: none;
    background-color: #007BAC;
    color: #fff;
    border-radius: 5px;
    text-transform: uppercase;
    border-radius: 5px;
}
:host(:hover) {
  background-color: #005679;
}
:host([aria-selected="true"]) {
  background-color: #005679;
}
            `,
        }),
        fastTabPanel({
            styles: (context, definition) => css``
        }),
        fastTabs({
            styles: (context, definition) => css``
        })
    );