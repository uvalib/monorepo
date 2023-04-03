import { c as DrupalSearchData, W as WebSearchPageURL, y, B as BentoSection, r as renderBriefItem$2 } from './24c62c57.js';
import { p as parse$2, L as Library, r as renderBriefItem$1 } from './ce78dccd.js';

class Page {
    constructor(init) {
        Object.assign(this, init);
    }
}
function parse$1(page) {
    var _a;
    return new Page({
        id: page.id,
        uuid: page.id,
        title: page.attributes.title,
        body: (_a = page.attributes.body) === null || _a === void 0 ? void 0 : _a.processed,
        description: page.meta && page.meta.excerpt ? page.meta.excerpt.replace(/<(\/?)strong>/g, "<$1mark>") : "",
        path: page.attributes.path.alias,
        link: `http://library.virginia.edu${page.attributes.path.alias}`
    });
}

/* eslint-disable camelcase */
class Person {
    constructor(init) {
        Object.assign(this, init);
    }
}
function parse(person) {
    return new Person({
        id: person.id,
        uuid: person.id,
        title: person.attributes.title,
        name: person.attributes.title,
        jobTitle: person.attributes.field_uva_ldap_title,
        description: person.attributes.body ? person.attributes.body.processed : '',
        path: person.attributes.path.alias,
        link: `http://library.virginia.edu${person.attributes.path.alias}`,
        computingId: person.attributes.field_computing_id,
        email: person.attributes.field_uva_ldap_email
    });
}

/* eslint-disable camelcase */
class WebsiteData extends DrupalSearchData {
    constructor() {
        super(...arguments);
        this.items = [];
        this.types = ["page", "person", "library"];
    }
    _parseResults(d) {
        var _a;
        // parse out the excerpts that are located in a meta section of the response
        d.data.forEach((res) => {
            const id = res.attributes.drupal_internal__nid;
            const meta = d.meta.extra_data[id];
            res.meta = meta;
        });
        // Setup generic results
        this.items = d.data ? d.data.map((n) => {
            if (n.type === 'node--page')
                return parse$1(n);
            if (n.type === 'node--person')
                return parse(n);
            if (n.type === 'node--library')
                return parse$2(n);
            return {
                title: n.attributes.title,
                description: n.attributes.body ? n.attributes.body.value : null
            };
        }) : [];
        // eslint-disable-next-line no-nested-ternary
        this.meta.totalResults = ((_a = d.data) === null || _a === void 0 ? void 0 : _a.meta) ? d.data.meta.count :
            d.meta ? d.meta.count : 0;
        this.meta.url = `${WebSearchPageURL}?search_api_fulltext=${this.query}`;
    }
}

function renderBriefItem(item) {
    return y `  
      <div class="bento-section-title"><a href="${item.link}">${item.title}</a></div>
      <div class="bento-section-desc">${item.jobTitle}</div>
    `;
}

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
