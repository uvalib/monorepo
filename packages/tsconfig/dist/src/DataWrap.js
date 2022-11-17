import { __decorate } from "tslib";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
export class DataWrap extends LitElement {
    constructor() {
        super(...arguments);
        this.auto = false;
    }
    fetchResults() {
        // eslint-disable-next-line no-console
        console.log("call to fetch results!");
        if (this.url) {
            const url = new URL(this.url);
            if (this.params)
                for (const [k, v] of Object.entries(this.params)) {
                    url.searchParams.set(k, v);
                }
            fetch(url.toString()).then(r => r.json()).then(d => { this.lastResponse = d; });
            if (this.poll)
                setTimeout(() => { this.fetchResults(); }, this.poll);
        }
    }
    updated(changedProperties) {
        if (this.auto) {
            if (changedProperties.has('auto') || changedProperties.has('url') || changedProperties.has('params') || changedProperties.has('poll'))
                this.fetchResults();
        }
        if (this.lastResponse)
            this.dispatchEvent(new Event('response', { bubbles: true, composed: true }));
    }
}
__decorate([
    property({ type: Boolean })
], DataWrap.prototype, "auto", void 0);
__decorate([
    property({ type: String })
], DataWrap.prototype, "url", void 0);
__decorate([
    property({ type: Object })
], DataWrap.prototype, "params", void 0);
__decorate([
    property({ type: Number, attribute: "debounce-duration" })
], DataWrap.prototype, "debounceDuration", void 0);
__decorate([
    property({ type: Number })
], DataWrap.prototype, "poll", void 0);
__decorate([
    property({ type: Object })
], DataWrap.prototype, "lastResponse", void 0);
//# sourceMappingURL=DataWrap.js.map