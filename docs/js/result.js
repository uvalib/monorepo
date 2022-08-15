import { s, $ } from './lit-element-90518c22.js';

class UVALibResult extends s {
    static properties = {
        item: {type: Object}
    }

    constructor() {
        super();
        this.item = {};
    }

    connectedCallback() {
        super.connectedCallback();
    }

    render() {
        return $`
        <div class="result" >
            <strong>${this.item.type}</strong> <a href="/${this.item.type}/${this.item.id}.html">${this.item.title}</a>
        </div>
        `;
    }
}
customElements.define('uvalib-result', UVALibResult);
