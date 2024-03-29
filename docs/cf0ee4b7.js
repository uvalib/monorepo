import { _ as __decorate, e, B as BentoSection, a as __classPrivateFieldSet, A as ArticlesData, b as __classPrivateFieldGet, y } from './24c62c57.js';

var _ArticlesSection_articlesData;
class ArticlesSection extends BentoSection {
    constructor() {
        super();
        _ArticlesSection_articlesData.set(this, void 0);
        this.items = [];
        this.meta = { totalResults: 0 };
        this.title = "Article";
        __classPrivateFieldSet(this, _ArticlesSection_articlesData, new ArticlesData({ query: "" }), "f");
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        if (_changedProperties.has('query')) {
            this.loading = true;
            __classPrivateFieldGet(this, _ArticlesSection_articlesData, "f").query = this.query;
            __classPrivateFieldGet(this, _ArticlesSection_articlesData, "f").fetchData({ limit: this.limit })
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
            <div ?hidden="${!this.isEmptySearch}"><a href="${(_b = (_a = this.meta) === null || _a === void 0 ? void 0 : _a.url) === null || _b === void 0 ? void 0 : _b.replace(/(.*)\?.*/, "$1")}" class="uvalib-button">Search articles</a></div>
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
            <p ?hidden="${this.isEmptySearch}">An aggregation of tens of millions of articles made available through Library subscriptions.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

            ${this.items.map(result => y `
              <li class="bs-results--list--entry"><a href="${result.link ? result.link : ''}" class="bs-results--title">${result.title}</a>
                <ul class="ul-0">
                  ${result.author ? y `<li class="bs-results--author li-1">${result.author.join('; ')}</li>` : ''}
                    <ul class="ul-1">
                        ${result.datePublished ? y `<li class="bs-results--date li-1">${result.datePublished.toLocaleDateString("en-US")}</li>` : ''}
                        ${result.publicationType && result.publicationType.length > 0 ? y `<li class="bs-results--format li-1" aria-label="${result.publicationType.join('/')}">${result.publicationType.join('/')}</li>` : ''}
                    </ul>
                </ul>
              </li>
            `)}
            </ol>
        </div>
    `;
    }
}
_ArticlesSection_articlesData = new WeakMap();
__decorate([
    e({ type: Array })
], ArticlesSection.prototype, "items", void 0);

window.customElements.define('articles-section', ArticlesSection);
