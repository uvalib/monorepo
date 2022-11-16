/* eslint-disable @typescript-eslint/no-unused-vars */
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class DataWrap extends LitElement {

    @property({ type: Boolean }) auto = false;

    @property({ type: String }) url: string | undefined;

    @property({ type: Object }) params: Object | undefined;

    @property({ type: Number, attribute: "debounce-duration"}) debounceDuration: Number | undefined;

    @property({ type: Number}) poll: number | undefined;

    @property({ type: Object }) lastResponse: Object | undefined;

    fetchResults() {
        // eslint-disable-next-line no-console
        console.log("call to fetch results!")       
        if (this.url) {
            const url = new URL(this.url);
            if (this.params)
                for (const [k,v] of Object.entries(this.params)) {
                    url.searchParams.set(k,v);
                }
            fetch(url.toString()).then(r=>r.json()).then(d=>{this.lastResponse = d});
            if (this.poll) setTimeout(()=> {this.fetchResults();}, this.poll)
        }
    }

    updated(changedProperties: Map<string, unknown>) {
        if (this.auto) {
            if (changedProperties.has('auto') || changedProperties.has('url') || changedProperties.has('params') || changedProperties.has('poll')) 
                this.fetchResults();
        }
        if (this.lastResponse) this.dispatchEvent(new Event('response', {bubbles: true, composed: true}))
    }

}


