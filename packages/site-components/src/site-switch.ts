import {
    provideFASTDesignSystem,
    fastSwitch, switchStyles
} from "@microsoft/fast-components";
import { styleMap } from './SiteStyleMapping.js';

provideFASTDesignSystem()
    .withPrefix("site")
    .register(
        fastSwitch({
            // eslint-disable-next-line arrow-body-style
            styles: (context, definition) => {
                return [styleMap,switchStyles(context,definition)];
            }
        })
    );