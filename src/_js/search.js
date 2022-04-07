import {LitElement, html} from 'lit';
import '@vaadin/vaadin-virtual-list';
import Fuse from 'fuse.js';

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

        this.config = {
            indexes:[
                {src:'/booksIndex.json'},
                {src:'/revisionsIndex.json'},
                {src:'/yearsIndex.json'}
            ]
        }
    }
    connectedCallback() {
        super.connectedCallback();
//        this.load()
//            .then(function(){
//                this.search();
//            }.bind(this))
    }
    load() {        
        return this.config.indexes.map(function(idx){
            return fetch(idx.src)
                .then((r)=>r.json());
        }.bind(this));
//        return fetch(this.src)
//            .then(response => response.json())
//            .then(function(data){
//                this._itemjsSearch = itemsjs( data, {});
//            }.bind(this));
    }
    search() {
//        this._results = this._itemjsSearch.search();
//        console.log(this._itemjsSearch.search());
    }
    _triggerEvent(){
        const event = new Event('my-event', {bubbles: true, composed: true});
        myElement.dispatchEvent(event);
    }
    render() {
        return html`
        <sl-tab-group>
            <sl-tab slot="nav" panel="years">Years</sl-tab>
            <sl-tab slot="nav" panel="books">Books</sl-tab>
            <sl-tab slot="nav" panel="revisions">Revisions</sl-tab>
        
            <sl-tab-panel name="years">This is the years tab panel.</sl-tab-panel>
            <sl-tab-panel name="books">This is the books tab panel.</sl-tab-panel>
            <sl-tab-panel name="revisions">This is the revisions tab panel.</sl-tab-panel>
        </sl-tab-group>        
        `;
    }
}
customElements.define('uvalib-faceted-search-browse', UVALibFacetedSearch);