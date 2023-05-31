import { x } from './query-assigned-elements-66a11629.js';
import './ArticlesData-9f3aa85f.js';
import { L as Library, W as WebSearchPageURL } from './LibrariesData-a59266c8.js';
import { W as WebsiteData, a as Person } from './WebsiteData-0a44c4d4.js';
import { B as BentoSection, r as renderBriefItem$2 } from './BentoSection-4119efbf.js';
import { r as renderBriefItem$1 } from './LibrariesSection-3bdcb1c1.js';
import './GeneralSearchResult-835c7dd8.js';
import './unsafe-html-ce449b42.js';
import './SiteStyle-5d4bc111.js';

function renderBriefItem(item) {
    return x `  
      <div class="bento-section-title"><a href="${item.link}">${item.title}</a></div>
      <div class="bento-section-desc">${item.jobTitle}</div>
    `;
}
new WeakMap();

/* eslint-disable @typescript-eslint/no-unused-vars */
class WebsiteSection extends BentoSection {
    constructor() {
        super();
        this.meta = { totalResults: 0 };
        this.title = "Website";
        this.websearch = new WebsiteData();
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        if (_changedProperties.has('query')) {
            this.loading = true;
            this.websearch.query = this.query;
            this.websearch.fetchData({ limit: this.limit })
                .then((data) => {
                this.items = data.items;
                this.meta = data.meta;
                this.loading = false;
            });
        }
    }
    // eslint-disable-next-line class-methods-use-this
    renderBriefItem(item) {
        if (item instanceof Library)
            return renderBriefItem$1(item);
        if (item instanceof Person)
            return renderBriefItem(item);
        return renderBriefItem$2(item);
    }
    render() {
        return x `
    <style>
      [hidden] { display: none !important; }
    </style>
        <div class="bs-results--header">
            <h3>${this.title}</h3>
            <div ?hidden="${!this.isEmptySearch}"><a href="${WebSearchPageURL}" class="uvalib-button">Search Library website</a></div>
            <form ?hidden="${this.isEmptySearch}" action="${this.meta.url}" method='get' style="display:inline">
              ${this.meta.url && this.meta.url.indexOf('?') > 0 ?
            [...new URLSearchParams(this.meta.url.replace(/^.*\?/, ''))].map((values) => x `
                      <input type="hidden" name="${values[0]}" value="${values[1]}" />
                    `)
            : ''}
              <button type="submit" class="uvalib-button">See all <span class="bs-results--qty">${this.meta.totalResults}</span> results</button>            
            </form>            
        </div>
        <div class="bs-results--body">
            <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>
            <p ?hidden="${this.isEmptySearch}">Results from the main Library website.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

              ${this.items.map(result => x `
                <li>${this.renderBriefItem(result)}</li>
              `)}

            </ol>
        </div>   
    `;
    }
}

window.customElements.define('website-section', WebsiteSection);
