import {
    provideFASTDesignSystem,
    fastAvatar, avatarStyles
} from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";
import { styleMap } from './SiteStyleMapping.js';

provideFASTDesignSystem()
    .withPrefix("site")
    .register(
        fastAvatar({
            // eslint-disable-next-line arrow-body-style
            styles: (context, definition) => css`
                ${ styleMap }
                ${ avatarStyles(context,definition) }
            `
        })
    );