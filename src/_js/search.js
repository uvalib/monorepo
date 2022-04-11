
import {LitElement, html} from 'lit';

class UVALibFacetedSearch extends LitElement {
    static properties = {
        config: {type: Object},
        queryString: {attribute: true, reflect: true},
        items: {type: Array, attribute: false},
        selectLibrary: {type: Boolean, attribute: true},
        searchLibrary: {attribute: true, reflect: true}
    }
    constructor() {
        super();
        this.queryString = '';
        this._submitEnabled = false;
        this.selectLibrary = false;

        

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
    firstUpdated() {
        super.firstUpdated();
        this.searchLibrary = "fuse";
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

    _cleanupLibrary(){
        if (this.Fuse) {
            this.Fuse = null;
            console.info('Fuse unloaded');
        }
        if (this.MiniSearch) {
            this.MiniSearch = null;
            console.info('MiniSearch unloaded');
        }
        if (this.lunr) {
            this.lunr = null;
            document.getElementById('lunr').remove();
            console.info('Lunr unloaded');
        }
    }
    _setupLunr(){
        this._cleanupLibrary();
        // library doesn't support es6 module yet
        let script = document.createElement('script');
        script.onload = function(){
            this.lunr = window.lunr;
            console.info('Lunr library loaded');
        }.bind(this);
        script.setAttribute('src','https://unpkg.com/lunr/lunr.js');
        script.id = "lunr";
        document.head.appendChild(script);
    };
    _setupFuse(){
        this._cleanupLibrary();
        import('fuse.js')
            .then(function(i) {this.Fuse = i.default}.bind(this) )
            .then(function(){
                console.info('Fuse library loaded');
            }.bind(this) );
    };
    _setupMini(){
        this._cleanupLibrary();
        import('minisearch')
            .then(function(i){this.MiniSearch = i.default}.bind(this) )
            .then(function(){
                console.info('MiniSearch library loaded');
            });
    };
    _libChanged(e){
        if (e.target.checked) {
            console.info(`lib selected ${e.target.value}`);
            switch (e.target.value) {
                case "lunr":
                    this._setupLunr(); break;
                case "fuse":
                    this._setupFuse(); break;
                case "mini":
                    this._setupMini(); break;
            };
            this.searchLibrary = e.target.value;
            
        }
    }

    render() {
        return html`
        ${this.selectLibrary?html`
        <sl-radio-group label="Select a search library" fieldset>
            <sl-radio-button name="slib" value="fuse" ?checked="${this.searchLibrary === 'fuse'}" @sl-change="${this._libChanged}">Fuse</sl-radio-button>
            <sl-radio-button name="slib" value="lunr" ?checked="${this.searchLibrary === 'lunr'}" @sl-change="${this._libChanged}">Lunr</sl-radio-button>
            <sl-radio-button name="slib" value="mini" ?checked="${this.searchLibrary === 'mini'}" @sl-change="${this._libChanged}">MiniSearch</sl-radio-button>
        </sl-radio-group>        
        `:''}
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