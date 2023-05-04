// BentoSectionStyle.ts
// This module contains styles for the BentoSection component.

import { css } from 'lit';

export default css`
    :host {
        --bento-section-padding: 25px;
        --bento-section-border-color: black;
        --bento-section-border-width: 1px;
        --bento-section-border-radius: 16px;
    }

    :host {
        display: block;
        padding: var(--bento-section-padding);
        color: var(--uva-text-color-base, #000);
        border: var(--bento-section-border-width) solid var(--bento-section-border-color);
        border-radius: var(--bento-section-border-radius);
    }

    [hidden] {
        display: none;
    }
`;