import { _ as __decorate, e, B as BentoSection, a as __classPrivateFieldSet, C as CatalogData, b as __classPrivateFieldGet, y } from './24c62c57.js';

var _CatalogSection_catalogData;
class CatalogSection extends BentoSection {
    constructor() {
        super();
        _CatalogSection_catalogData.set(this, void 0);
        this.items = [];
        this.meta = { totalResults: 0 };
        this.title = "Virgo Catalog";
        __classPrivateFieldSet(this, _CatalogSection_catalogData, new CatalogData({ query: "" }), "f");
        this.limit = 5;
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        if (_changedProperties.has('query') || _changedProperties.has('limit')) {
            this.loading = true;
            __classPrivateFieldGet(this, _CatalogSection_catalogData, "f").query = this.query;
            __classPrivateFieldGet(this, _CatalogSection_catalogData, "f").fetchData({ limit: this.limit })
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
            <div ?hidden="${!this.isEmptySearch}"><a href="${(_b = (_a = this.meta) === null || _a === void 0 ? void 0 : _a.url) === null || _b === void 0 ? void 0 : _b.replace(/(.*)\?.*/, "$1")}" class="uvalib-button">Search Virgo</a></div>
            <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method='get' style="display:inline">
              ${this.meta.url && this.meta.url.indexOf('?') > 0 ?
            [...new URLSearchParams(this.meta.url.replace(/^.*\?/, ''))].map((values) => y `
                      <input type="hidden" name="${values[0]}" value="${values[1]}" />
                    `)
            : ''}
              <button type="submit" class="uvalib-button">See all <span class="bs-results--qty">${this.meta.totalResults}</span> results</button>
            </form>
        </div>

        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <p ?hidden="${this.isEmptySearch}">Books, journals, manuscripts &amp; archival material, maps, music and sound recordings, theses and dissertations, and videos.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

            ${this.items.map(result => y `
              <li class="bs-results--list--entry"><a href="${result.link ? result.link : ''}" class="bs-results--title">${result.title}</a>
                <ul class="ul-0">
                  ${result.author ? y `<li class="bs-results--author li-1">${result.author.join('; ')}</li>` : ''}
                    <ul class="ul-1">
                      ${result.datePublished ? y `<li class="bs-results--date li-1">${result.datePublished.toLocaleDateString("en-US")}</li>` : ''}
                      ${result.format && result.format.length > 0 ? y `<li class="bs-results--format li-1" aria-label="${result.format.join('/')}">${result.format.join('/')}</li>` : ''}
                    </ul>
                </ul>
              </li>
            `)}

            </ol>
        </div>
    `;
    }
}
_CatalogSection_catalogData = new WeakMap();
__decorate([
    e({ type: Array })
], CatalogSection.prototype, "items", void 0);

window.customElements.define('catalog-section', CatalogSection);
