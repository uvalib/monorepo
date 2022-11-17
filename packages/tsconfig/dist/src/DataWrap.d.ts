import { LitElement } from 'lit';
export declare class DataWrap extends LitElement {
    auto: boolean;
    url: string | undefined;
    params: Object | undefined;
    debounceDuration: Number | undefined;
    poll: number | undefined;
    lastResponse: Object | undefined;
    fetchResults(): void;
    updated(changedProperties: Map<string, unknown>): void;
}
