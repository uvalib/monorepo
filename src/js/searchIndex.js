import { s, y } from './lit-element-6528530d.js';

class UVALibFacetedSearchIndex extends s {
    static properties = {
        config: {type: Object},
        queryString: {attribute: true, reflect: true},
        items: {type: Array, attribute: false}
    }
    constructor() {
        super();
        this.queryString = '';
        this._submitEnabled = false;
    }
    connectedCallback() {
        super.connectedCallback();
//        this.load()
//            .then(function(){
//                this.search();
//            }.bind(this))
    }
    load() {        
//        return fetch(this.src)
//            .then(response => response.json())
//            .then(function(data){
//                this._itemjsSearch = itemsjs( data, {});
//            }.bind(this));
    }
    search() {
        this._results = this._itemjsSearch.search();

        console.log(this._itemjsSearch.search());
    }
    _triggerEvent(){
        const event = new Event('my-event', {bubbles: true, composed: true});
        myElement.dispatchEvent(event);
    }
    render() {
        return y`<h1>Foo Bar</h1>`;
    }
}
customElements.define('uvalib-faceted-search-index', UVALibFacetedSearchIndex);
