import { y } from './query-assigned-elements-cb6980e1.js';
import './ArticlesData-40bc37f5.js';
import { L as Library, W as WebSearchPageURL } from './LibrariesData-25322609.js';
import { W as WebsiteData, a as Person } from './WebsiteData-0918a8ab.js';
import { B as BentoSection, r as renderBriefItem$2 } from './BentoSection-cfa39fab.js';
import { r as renderBriefItem$1 } from './LibrariesSection-3c55954b.js';
import './GeneralSearchResult-835c7dd8.js';
import './unsafe-html-96df994e.js';
import './SiteStyle-725ba497.js';

function renderBriefItem(item) {
    return y `  
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
        return y `
    <style>
      [hidden] { display: none !important; }
    </style>
        <div class="bs-results--header">
            <h3>${this.title}</h3>
            <div ?hidden="${!this.isEmptySearch}"><a href="${WebSearchPageURL}" class="uvalib-button">Search Library website</a></div>
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
            <p ?hidden="${this.isEmptySearch}">Results from the main Library website.</p>
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">

              ${this.items.map(result => y `
                <li>${this.renderBriefItem(result)}</li>
              `)}

            </ol>
        </div>   
    `;
    }
}

window.customElements.define('website-section', WebsiteSection);
