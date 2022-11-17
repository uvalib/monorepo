import { LitElement } from 'lit';
import './bento-card.js';
import './virgo-bento-card.js';
import './libguides-bento-card.js';
import './bento-search.js';
import { BentoSearch } from './BentoSearch.js';
export declare class BentoBox extends LitElement {
    static styles: import("lit").CSSResult;
    keyword: string;
    createRenderRoot(): this;
    render(): import("lit").TemplateResult<1>;
    search(e: {
        target: BentoSearch;
    }): void;
}
