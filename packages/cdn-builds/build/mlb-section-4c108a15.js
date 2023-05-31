import { _ as __decorate, e, a as __classPrivateFieldSet, b as __classPrivateFieldGet, x } from './query-assigned-elements-66a11629.js';
import { M as MLBData } from './MLBData-df790ab6.js';
import './ArticlesData-9f3aa85f.js';
import { B as BentoSection } from './BentoSection-4119efbf.js';
import './GeneralSearchResult-835c7dd8.js';
import './unsafe-html-ce449b42.js';
import './SiteStyle-5d4bc111.js';

var _MLBSection_mlbData;
class MLBSection extends BentoSection {
    constructor() {
        super();
        _MLBSection_mlbData.set(this, void 0);
        this.items = [];
        this.meta = { totalResults: 0 };
        this.title = "Modern Library Bibliography";
        __classPrivateFieldSet(this, _MLBSection_mlbData, new MLBData({ query: "" }), "f");
        this.limit = 5;
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        if (_changedProperties.has('query')) {
            this.loading = true;
            __classPrivateFieldGet(this, _MLBSection_mlbData, "f").query = this.query;
            __classPrivateFieldGet(this, _MLBSection_mlbData, "f").fetchData()
                .then((data) => {
                this.items = data.items;
                this.meta = data.meta;
                this.loading = false;
            });
        }
    }
    highlight(text) {
        const { query } = this;
        const words = query.split(" ");
        const result = { snippet: "", match: "" };
        for (let i = 0; i < words.length; i++) {
            const regex = new RegExp(`\\b${words[i]}\\b`, "i");
            const index = text.search(regex);
            if (index !== -1) {
                const startIndex = Math.max(index - 30, 0);
                const endIndex = Math.min(index + 30, text.length - 1);
                result.snippet = text.substring(startIndex, endIndex);
                result.match = words[i];
                break;
            }
        }
        if (result.snippet === "") {
            result.snippet = text.substring(0, 60);
        }
        console.log(result);
        return result.snippet;
    }
    render() {
        return x `
        <div class="bs-results--header">
        </div>

        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

            ${this.items.map(result => x `
              <li class="bs-results--list--entry">
                <a href="${result.link ? result.link : ''}" class="bento-section-title">${result.title}</a>
                ${result.description ? x `<div class="bento-section-desc">${this.highlight(result.description)}</div>` : ''}
              </li>
            `)}

            </ol>
        </div>
    `;
    }
}
_MLBSection_mlbData = new WeakMap();
__decorate([
    e({ type: Array })
], MLBSection.prototype, "items", void 0);

window.customElements.define('mlb-section', MLBSection);
