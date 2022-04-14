
import {LitElement, html} from 'lit';
import 'itemsjs/dist/itemsjs.min.js';

class UVALibFacetedBrowse extends LitElement {
    static properties = {
        config: {type: Object}, // Config where collections are defined (along with their available search indexes)
        queryString: {attribute: true, reflect: true}, // Query string to filter on (using search Library)
        items: {type: Array, attribute: false},  // Items given Library,query,collection,etc
        search: {type: Object},
        selectedTypes: {type: Array}
    }

    constructor() {
        super();
        this.queryString = '';
        this.config = {
        }   
        this.items = [];     

        fetch('/yearsBooksRevisions.json')
            .then(r=>r.json())
            .then(this._loadItemsJs.bind(this));
    }

    connectedCallback() {
        super.connectedCallback();
    }
    firstUpdated() {
        super.firstUpdated();
    }

    _loadItemsJs(data) {
        console.log(data);
        this._itemsjs = itemsjs(data, {
            sortings: {
                title_asc: {
                  field: 'title',
                  order: 'asc'
                }
            },
            aggregations: {
                type: {
                  title: 'Type',
                  size: 10
                }
            },
            searchableFields: ['title', 'year', 'generalFirst']
        })
        this._filter();
//        console.log( this._itemsjs.search() );
//        console.log( this._itemsjs.aggregation( {name:'type'} ) );
    }

    _setQueryString(e) {
        this.queryString = e.target.value;
        console.info(`Search query set to ${e.target.value}`);
        this._filter();
    }
    _filter(){
        let options = {}
        if (this.queryString) options.query = this.queryString;
        if (this.selectedTypes) options.filters = {type:this.selectedTypes};
        this.search = this._itemsjs.search(options)
        this.items = this.search.data.items;

        console.info(this.search)
    }

    _setType(e){
        this.selectedTypes = e.target.value;
        this._filter();
        console.info(`Type facet set to `);
        console.info(e.target.value)
    }

    render() {
        return html`
        <div id="searchbox" style="margin-top:15px; margin-bottom:15px;" >
            <sl-input placeholder="Type to search" @sl-change="${this._setQueryString}"></sl-input>
        </div>

        <sl-select placeholder="Filter by Type" multiple clearable @sl-change="${this._setType}">
            ${(this.search && this.search.data)?
                this.search.data.aggregations.type.buckets.map(type=>{
                    return type.doc_count>0?
                        html`<sl-menu-item value="${type.key}">${type.key} (${type.doc_count})</sl-menu-item>`:''
                }):''  }
        </sl-select>

        <ul>
            ${this.items.map(item=>html`
                <li><strong>${item.type}</strong> <a href="/${item.type}/${item.id}.html">${item.title}</a></li>
            `)}
        </ul>
        `;
    }
}
customElements.define('uvalib-faceted-browse', UVALibFacetedBrowse);