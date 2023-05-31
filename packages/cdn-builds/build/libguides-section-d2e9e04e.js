import { a as __classPrivateFieldSet, b as __classPrivateFieldGet, x } from './query-assigned-elements-66a11629.js';
import { o } from './unsafe-html-ce449b42.js';
import './ArticlesData-9f3aa85f.js';
import { L as LibGuidesData } from './LibGuidesData-21de2aa9.js';
import { B as BentoSection } from './BentoSection-4119efbf.js';
import './SiteStyle-5d4bc111.js';

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
        return x `
        <div class="bs-results--header">
            <h3>${this.title}</h3>
            <div ?hidden="${!this.isEmptySearch}"><a href="${(_b = (_a = this.meta) === null || _a === void 0 ? void 0 : _a.url) === null || _b === void 0 ? void 0 : _b.replace(/(.*)\?.*/, "$1")}" class="uvalib-button">Search Guides</a></div>
            <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method='get' style="display:inline">
              ${this.meta.url && this.meta.url.indexOf('?') > 0 ?
            [...new URLSearchParams(this.meta.url.replace(/^.*\?/, ''))].map((values) => x `
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

              ${this.items.map(result => x `
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
