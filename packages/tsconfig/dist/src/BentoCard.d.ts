import { LitElement } from 'lit';
import { GeneralSearchResult } from '@uvalib/data-wrap';
export declare class BentoCard extends LitElement {
    static styles: import("lit").CSSResult;
    keyword: string;
    title: string;
    items: GeneralSearchResult[];
    render(): import("lit").TemplateResult<1>;
}
