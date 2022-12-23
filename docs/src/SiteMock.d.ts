import { LitElement } from 'lit';
import "@uvalib/bento-box/bento-box.js";
import "playground-elements/playground-ide.js";
export declare class SiteMock extends LitElement {
    title: string;
    selectedToy: string;
    example: any;
    toys: any;
    static styles: import("lit").CSSResult;
    private selectToy;
    private loadExample;
    render(): import("lit").TemplateResult<1>;
}
