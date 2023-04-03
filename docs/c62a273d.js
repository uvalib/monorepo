import { G as GeneralData, B as BentoSection, a as __classPrivateFieldSet, b as __classPrivateFieldGet, y, o } from './24c62c57.js';

class LibGuidesData extends GeneralData {
    constructor() {
        super(...arguments);
        this.libGuidesAPIURL = "https://api.library.virginia.edu/libguides/srch_process_cs.php?action=580&search_source_id=0&layout=tab&start=0&group_id=0&guide_id=0&f_group_id=&f_guide_type_id=&f_guide_owner_id=&f_guide_tag_ids=&f_guide_subject_ids=&sort=_score";
    }
    // eslint-disable-next-line class-methods-use-this
    async fetchData(params) {
        return fetch(`${this.libGuidesAPIURL}&q=${this.query}`)
            .then(r => r.json())
            .then(d => {
            this.meta.url = d.data.fulllink;
            this.parseResults(d.data.results);
            return { items: this.items.slice(0, params && params.limit ? params.limit : this.limit), meta: this.meta };
        });
    }
    // just putting this here in case we need to adjust the markup returned here
    // eslint-disable-next-line class-methods-use-this
    descriptionMarkupFix(data) {
        return data;
    }
    parseResults(data) {
        const detachedDiv = document.createElement('div');
        detachedDiv.innerHTML = data;
        const resultNodes = detachedDiv.querySelectorAll('.s-srch-result');
        this.items = Array.from(resultNodes).map((node) => {
            var _a, _b;
            return ({
                title: (_a = node.querySelector('.s-srch-result-title')) === null || _a === void 0 ? void 0 : _a.innerHTML.replace(/\s\s/g, ' '),
                description: this.descriptionMarkupFix((_b = node.querySelectorAll('.s-srch-result-meta')[1]) === null || _b === void 0 ? void 0 : _b.innerHTML.replace(/\s\s/g, ' ')),
                link: ""
            });
        }).slice(0);
        detachedDiv.remove();
    }
}

var _LibGuidesSection_libGuidesData;
class LibGuidesSection extends BentoSection {
    constructor() {
        super();
        _LibGuidesSection_libGuidesData.set(this, void 0);
        this.meta = { totalResults: 0 };
        this.title = "Subject Guides";
        __classPrivateFieldSet(this, _LibGuidesSection_libGuidesData, new LibGuidesData({ query: "" }), "f");
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        if (_changedProperties.has('query')) {
            this.loading = true;
            __classPrivateFieldGet(this, _LibGuidesSection_libGuidesData, "f").query = this.query;
            __classPrivateFieldGet(this, _LibGuidesSection_libGuidesData, "f").fetchData({ limit: this.limit })
                .then((data) => {
                this.items = data.items;
                this.meta = data.meta;
                this.loading = false;
            });
        }
    }
    render() {
        var _a, _b;
        return y `
        <div class="bs-results--header">
            <h3>${this.title}</h3>
            <div ?hidden="${!this.isEmptySearch}"><a href="${(_b = (_a = this.meta) === null || _a === void 0 ? void 0 : _a.url) === null || _b === void 0 ? void 0 : _b.replace(/(.*)\?.*/, "$1")}" class="uvalib-button">Search Guides</a></div>
            <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method='get' style="display:inline">
              ${this.meta.url && this.meta.url.indexOf('?') > 0 ?
            [...new URLSearchParams(this.meta.url.replace(/^.*\?/, ''))].map((values) => y `
                      <input type="hidden" name="${values[0]}" value="${values[1]}" />
                    `)
            : ''}
              <button type="submit" class="uvalib-button">See all results</button>            
            </form>
        </div>

        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <p ?hidden="${this.isEmptySearch}">Subject guides contain topic-specific information to help with research and coursework.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

              ${this.items.map(result => y `
                <li class="bs-results--list--entry bs-results-title"><span class="bs-results--title">${o(result.title)}</span>
                    <ul class="ul-0">
                        <li class="bs-results--teaser li-1">${o(result.description)}</li>
                    </ul>
                </li>
              `)}
            </ol>
        </div>  
    `;
    }
}
_LibGuidesSection_libGuidesData = new WeakMap();

window.customElements.define('libguides-section', LibGuidesSection);
