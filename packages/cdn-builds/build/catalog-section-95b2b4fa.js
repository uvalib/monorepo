import { _ as __decorate, e, a as __classPrivateFieldSet, b as __classPrivateFieldGet, x } from './query-assigned-elements-66a11629.js';
import { C as CatalogData } from './ArticlesData-9f3aa85f.js';
import { B as BentoSection } from './BentoSection-4119efbf.js';
import './unsafe-html-ce449b42.js';
import './SiteStyle-5d4bc111.js';

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
        var _a, _b, _c;
        return x `
        <div class="bs-results--header">
            <h3>${this.title}</h3>
            <div ?hidden="${!this.isEmptySearch}"><a href="${(_b = (_a = this.meta) === null || _a === void 0 ? void 0 : _a.url) === null || _b === void 0 ? void 0 : _b.replace(/(.*)\?.*/, "$1")}" class="uvalib-button">Search Virgo</a></div>
            <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method='get' style="display:inline">
              ${this.meta.url && this.meta.url.indexOf('?') > 0
            ? [...new URLSearchParams(this.meta.url.replace(/^.*\?/, ''))].map((values) => x `
                          <input type="hidden" name="${values[0]}" value="${values[1]}" />
                        `)
            : ''}
              <button type="submit" class="uvalib-button">See all <span class="bs-results--qty">${(_c = this.meta.totalResults) !== null && _c !== void 0 ? _c : 0}</span> results</button>
            </form>
        </div>
  
        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <p ?hidden="${this.isEmptySearch}">Books, journals, manuscripts &amp; archival material, maps, music and sound recordings, theses and dissertations, and videos.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">
  
            ${this.items.map(result => {
            var _a;
            return x `
              <li class="bs-results--list--entry"><a href="${(_a = result.link) !== null && _a !== void 0 ? _a : ''}" class="bs-results--title">${result.title}</a>
                <ul class="ul-0">
                  ${result.author ? x `<li class="bs-results--author li-1">${result.author.join('; ')}</li>` : ''}
                    <ul class="ul-1">
                      ${result.datePublished ? x `<li class="bs-results--date li-1">${result.datePublished.toLocaleDateString("en-US")}</li>` : ''}
                      ${result.format && result.format.length > 0 ? x `<li class="bs-results--format li-1" aria-label="${result.format.join('/')}">${result.format.join('/')}</li>` : ''}
                    </ul>
                </ul>
              </li>
            `;
        })}
  
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
