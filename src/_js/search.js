import {LitElement, html} from 'lit';

class UVALibFacetedSearch extends LitElement {
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
        return html`<h1>Foo Bar</h1>`;
    }
}
customElements.define('uvalib-faceted-search', UVALibFacetedSearch);