import { G as GeneralSearchResult } from './GeneralSearchResult-835c7dd8.js';
import { D as DrupalSearchData, p as parse$2, W as WebSearchPageURL } from './LibrariesData-a59266c8.js';

class Page extends GeneralSearchResult {
    constructor(init) {
        super(init);
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
class Person extends GeneralSearchResult {
    constructor(init) {
        super(init);
    }
}
function parse(person) {
    var _a, _b, _c;
    return new Person({
        id: person.id,
        uuid: person.id,
        title: person.attributes.title,
        name: person.attributes.title,
        jobTitle: person.attributes.field_uva_ldap_title,
        description: ((_a = person.attributes.body) === null || _a === void 0 ? void 0 : _a.processed) || '',
        path: (_b = person.attributes.path) === null || _b === void 0 ? void 0 : _b.alias,
        link: `http://library.virginia.edu${(_c = person.attributes.path) === null || _c === void 0 ? void 0 : _c.alias}`,
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
    parseResults(d) {
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

export { Page as P, WebsiteData as W, Person as a, parse as b, parse$1 as p };
