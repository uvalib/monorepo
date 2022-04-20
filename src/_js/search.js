import {LitElement, html} from 'lit';
import './result.js';

class UVALibFacetedSearch extends LitElement {
    static properties = {
        config: {type: Object}, // Config where collections are defined (along with their available search indexes)
        queryString: {attribute: true, reflect: true}, // Query string to filter on (using search Library)
        items: {type: Array, attribute: false},  // Items given Library,query,collection,etc
        selectLibrary: {type: Boolean, attribute: true}, // Allow for Library selection in interface
        searchLibrary: {attribute: true, reflect: true}, // Selected Library for searching
        selectedCollection: {attribute: true, reflect: true} // Selected collection to provide items from
    }
    constructor() {
        super();

        this.queryString = '';
        this._submitEnabled = false;
        this.selectLibrary = false;

        this.config = {
            searchLibraries: {
                fuse: {
                    title: 'Fuse.js',
                    url: 'https://fusejs.io/',
                    description: 'Fuse.js is a powerful, lightweight fuzzy-search library, with zero dependencies.'
                },
                mini: {},
                lunr: {},
                flex: {
                    title: 'FlexSearch',
                    url: 'https://github.com/nextapps-de/flexsearch/#readme',
                    description: "Web's fastest and most memory-flexible full-text search library with zero dependencies."
                }
            },
            collections: {
                years: {
                    path: "/year/",
                    fields: ['title','year','searchContent'],
                    title: "Years",
                    list: '/years.json',
                    indexes: {
                        flex:{src:'/yearsFlexIndex.json'},
                        fuse:{src:'/yearsFuseIndex.json'},
                        mini:{src:'/yearsMiniIndex.json'},
                        lunr:{src:'/yearsLunrIndex.json'},
                    }
                },
                books: {
                    path: "/book/",
                    fields: ['title','year','full'],
                    title: "Books",
                    list: '/books.json',
                    indexes: {
                        flex:{src:'/booksFlexIndex.json'},
                        fuse:{src:'/booksFuseIndex.json'},
                        mini:{src:'/booksMiniIndex.json'},
                        lunr:{src:'/booksLunrIndex.json'}
                    }
                },
                revisions: {
                    path: "/revision/",
                    fields: ['title','year','full','book'],
                    title: "Revisions",
                    list: 'revisions.json',
                    indexes: {
                        flex:{src:'/revisionsFlexIndex.json'},
                        fuse:{src:'/revisionsFuseIndex.json'},
                        mini:{src:'/revisionsMiniIndex.json'},
                        lunr:{src:'/revisionsLunrIndex.json'}
                    }
                }
            }
        }        
    }
    connectedCallback() {
        super.connectedCallback();
    }
    firstUpdated() {
        super.firstUpdated();
        this.searchLibrary = "fuse";
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

    _loadIndexes(lib, parseJSON=true){
        let promises = [];
        // Load the search indexes for the collections
        Object.values(this.config.collections).forEach(coll=>{
            console.info(`Need to load index (${lib}) for ${coll.title}`);
            promises.push(
                fetch(coll.indexes[lib].src)
                    .then( r=>parseJSON?r.json():r.text() )
                    .then(data=>{
                        coll.indexes[lib].idxData = data;
                        console.info(`Search index (${lib}) for collection ${coll.title} added`);
                    })
            );
        },this);
        return Promise.all(promises);
    }
    _loadListins(){
        let promises = [];
        Object.values(this.config.collections).forEach(coll=>{
            console.info(`Get listing for collection '${coll.title}' if we don't already have it`);
            if (!coll.listData && coll.list) promises.push( 
                fetch(coll.list)
                    .then(r=>r.json())
                    .then(data=>coll.listData = data) 
            );
        },this);
        return Promise.all(promises);
    }

    _setupLunr(){
        this._cleanupLibrary();
        let promises = [];
        // library doesn't support es6 module yet
        function setup() {
            return new Promise(function(resolve,reject){
                let script = document.createElement('script');
                script.onload = resolve;
                script.setAttribute('src','https://unpkg.com/lunr/lunr.js');
                script.id = "lunr";
                document.head.appendChild(script);                
            });
        }
        promises.push(
            setup().then(function(){
                this.lunr = window.lunr;
                console.info('Lunr library loaded');
            }.bind(this))
        );

        // fetch the searlized lunr indexes
        promises.push( this._loadIndexes('lunr') );

        // Lunr needs the initial collection as well
        promises.push( this._loadListins() );

        return Promise.all(promises).then(()=>{
            // load the index properly now that we have both the index data and the library
            Object.values(this.config.collections).forEach(coll=>{
                coll.indexes.lunr.idx = this.lunr.Index.load( coll.indexes.lunr.idxData )
                delete coll.indexes.lunr.idxData;  // cleanup our footprint once loaded
                console.info(`Lunr index parsed for ${coll.title}`);
             }, this);
        },this);        

    };
    _setupFlex(){
        this._cleanupLibrary();
        let promises = [];
        // Load the Fuse search library
        promises.push(
            import('flexsearch/src/document.js')
            .then(function(i) {this.FlexSearch = i.default}.bind(this) )
            .then(function(){
                console.info('FlexSearch library loaded');
            }.bind(this) ) 
        );

        // fetch the searlized fuse indexes
        promises.push( this._loadIndexes('flex') );

        // once we have our data, we need to create indexes with fuse
        return Promise.all(promises).then(()=>{
            // load the index properly now that we have both the index data and the library
            Object.values(this.config.collections).forEach(coll=>{
                coll.indexes.flex.idx = new this.FlexSearch(
                    {
                        id: "id",
                        index: coll.indexes.flex.idxData.fields //['title','year','full']
                    }
                )
                const key = coll.indexes.flex.idxData.key;
                coll.indexes.flex.idx.import( key, coll.indexes.flex.idxData[key] );
                delete coll.indexes.flex.idxData; // cleanup our footprint once loaded
                console.info(`Flex index parsed for ${coll.title}`);
            }, this);
        }, this);
    };
    _setupFuse(){
        this._cleanupLibrary();
        let promises = [];
        // Load the Fuse search library
        promises.push(
            import('fuse.js')
            .then(function(i) {this.Fuse = i.default}.bind(this) )
            .then(function(){
                console.info('Fuse library loaded');
            }.bind(this) ) 
        );

        // fetch the searlized fuse indexes
        promises.push( this._loadIndexes('fuse') );

        // fuse needs the initial collection as well
        promises.push( this._loadListins() );

        // once we have our data, we need to create indexes with fuse
        return Promise.all(promises).then(()=>{
            // load the index properly now that we have both the index data and the library
            Object.values(this.config.collections).forEach(coll=>{
                coll.indexes.fuse.idx = new this.Fuse(
                    coll.listData,
                    {}, // fuse options
                    this.Fuse.parseIndex(coll.indexes.fuse.idxData)
                )
                delete coll.indexes.fuse.idxData; // cleanup our footprint once loaded
                console.info(`Fuse index parsed for ${coll.title}`);
            }, this);
        }, this);
    };
    _setupMini(){
        this._cleanupLibrary();
        let promises = [];
        promises.push(
            import('minisearch')
                .then(function(i){this.MiniSearch = i.default}.bind(this) )
                .then(function(){
                    console.info('MiniSearch library loaded');
                })
        );

        // fetch the searlized mini indexes
        promises.push( this._loadIndexes('mini', false) );

        return Promise.all(promises).then(()=>{

           // load the index properly now that we have both the index data and the library
           Object.values(this.config.collections).forEach(coll=>{
                coll.indexes.mini.idx = this.MiniSearch.loadJSON( coll.indexes.mini.idxData, {fields: coll.fields} )
                delete coll.indexes.mini.idxData;  // cleanup our footprint once loaded
                console.info(`Fuse index parsed for ${coll.title}`);
            }, this);


        },this);
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
                case "flex":
                    this._setupFlex(); break;
            };
            this.searchLibrary = e.target.value;
            
        }
    }
    _searchFuse(){
        console.info(`search fuse index for results using querystring '${this.queryString}'`);
        // search for each collection (for search lib and query)
        Object.values(this.config.collections).forEach(coll=>{
            coll.indexes.fuse.results = coll.indexes.fuse.idx.search(this.queryString).map(r=>{
                // try to normalize the results for templates
                r.item.refIndex = r.refIndex;                
                return r.item;
            });
            console.info(coll.indexes.fuse.results);
        });
    }
    _searchFlex(){
        console.info(`search flex index for results using querystring '${this.queryString}'`);
        // search for each collection (for search lib and query)
        Object.values(this.config.collections).forEach(coll=>{
            coll.indexes.flex.results = coll.indexes.flex.idx.search(this.queryString).map(r=>{
                // try to normalize the results for templates
                r.item.refIndex = r.refIndex;                
                return r.item;
            });
            console.info(coll.indexes.flex.results);
        });        
    }
    _searchLunr(){
        console.info('search lunr index for results using querystring');
        // search for each collection (for search lib and query)
        Object.values(this.config.collections).forEach(coll=>{
            coll.indexes.lunr.results = coll.indexes.lunr.idx.search(this.queryString).map(r=>{
                // join with the items data as it's not returned from index for listing
                r.id = r.ref;
                return {...coll.listData.find(item=>item.id===r.id), ...r};
            });
            console.info(coll.indexes.lunr.results);
            console.info(coll.listData);
        });
    }
    _searchMini(){
        console.info('search mini index for results using querystring');
        // search for each collection (for search lib and query)
        Object.values(this.config.collections).forEach(coll=>{
            coll.indexes.mini.results = coll.indexes.mini.idx.search(this.queryString);
            console.info(coll.indexes.mini.results);
        });
    }
    _search(){
        switch(this.searchLibrary) {
            case "lunr": this._searchLunr(); break;
            case "fuse": this._searchFuse(); break;
            case "flex": this._searchFlex(); break;
            case "mini": this._searchMini();
        }
    }
    _setQueryString(e) {
        this.queryString = e.target.value;
        console.info(`Search query set to ${e.target.value}`);
        this._search();
    }

    render() {
        return html`
        <!-- The Available Search Libraries to pick from (depending on the indexes we have available from the selected collection) -->
        ${this.selectLibrary?html`
        <sl-radio-group label="Select a search library" fieldset style="display: inline-block;">
            <sl-radio-button name="slib" value="fuse" ?checked="${this.searchLibrary === 'fuse'}" @sl-change="${this._libChanged}">Fuse</sl-radio-button>
            <sl-radio-button name="slib" value="lunr" ?checked="${this.searchLibrary === 'lunr'}" @sl-change="${this._libChanged}">Lunr</sl-radio-button>
            <sl-radio-button name="slib" value="mini" ?checked="${this.searchLibrary === 'mini'}" @sl-change="${this._libChanged}">MiniSearch</sl-radio-button>
            <sl-radio-button name="slib" value="flex" ?checked="${this.searchLibrary === 'flex'}" @sl-change="${this._libChanged}">FlexSearch</sl-radio-button>
        </sl-radio-group>        
        `:''}

        <div id="searchbox" style="margin-top:15px; margin-bottom:15px;" >
            <sl-input placeholder="Type to search" @sl-change="${this._setQueryString}"></sl-input>
        </div>

        <!-- listing of tabs for each collection of items to search -->
        <sl-tab-group>
            <!-- Tabs to select from -->
            ${ Object.keys(this.config.collections).map(colId=>{
                const col = this.config.collections[colId];
                return html`<sl-tab slot="nav" panel="${colId}" style="position:relative">${col.title}
                        ${this.searchLibrary && col.indexes[this.searchLibrary].results && this.queryString? html`
                        <sl-badge pill style="position:absolute;top:0px;right:-5px;">${col.indexes[this.searchLibrary].results.length}</sl-badge>
                        `:''}
                    </sl-tab>`
            })}
            <!-- Tab containers -->
            ${ Object.keys(this.config.collections).map(collId=>{
                const coll = this.config.collections[collId];
                return html`
                <sl-tab-panel name="${collId}">
                    <h2>${coll.title}</h2>
                    ${this.searchLibrary && coll.indexes[this.searchLibrary].results && coll.indexes[this.searchLibrary].results.length>0? html`
                        <div id="results">
                        ${coll.indexes[this.searchLibrary].results.map(item=>{
                            return html`
                                <uvalib-result .item="${item}"></uvalib-result>
                            `} )}
                        </div>
                    `:html`
                        <p>Need to search for something and/or current search returned no results!</p>
                    `}
                </sl-tab-panel>
                `;
            })}
        </sl-tab-group>
        `;
    }
}
customElements.define('uvalib-faceted-search', UVALibFacetedSearch);