import { LitElement } from 'lit';
import "@uvalib/site-header/site-header.js";
import "@uvalib/site-components/site-tabs.js";
import "@uvalib/site-components/site-select.js";
import "@uvalib/bento-box/bento-box.js";
import "@uvalib/bento-box/events-section.js";
import "playground-elements/playground-ide.js";
export declare class SiteMock extends LitElement {
    title: string;
    selectedToy: string;
    example: any;
    toys: any;
    static styles: import("lit").CSSResult;
    constructor();
    private selectToy;
    private mkPlayground;
    private loadExample;
    render(): import("lit").TemplateResult<1>;
}
