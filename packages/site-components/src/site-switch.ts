import {
    provideFASTDesignSystem,
    fastSwitch, switchStyles
} from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";

provideFASTDesignSystem()
    .withPrefix("site")
    .register(
        fastSwitch({
            // eslint-disable-next-line arrow-body-style
            styles: (context, definition) => {
                return [switchStyles(context,definition),css`
/* Our custom css here - including mapping of custom css properties (design tokens) */
                `];
            }
        })
    );