import { p as parse$3, b as parse$4 } from './WebsiteData-0a44c4d4.js';
import { D as DrupalSearchData, W as WebSearchPageURL } from './LibrariesData-a59266c8.js';
import { G as GeneralSearchResult } from './GeneralSearchResult-835c7dd8.js';
import { G as GeneralData } from './ArticlesData-9f3aa85f.js';

/* eslint-disable camelcase */
class PageData extends DrupalSearchData {
    constructor() {
        super(...arguments);
        this.type = "page";
        this.items = [];
    }
    parseResults(n) {
        n.data.forEach((res) => {
            const { attributes: { drupal_internal__nid }, meta } = res;
            const id = drupal_internal__nid;
            const newMeta = n.meta.extra_data[id];
            res.meta = newMeta;
        });
        // Setup Library results
        this.items = n.data.map(parse$3);
        this.meta.totalResults = n.meta.count;
        this.meta.url = `${WebSearchPageURL}?keys=${this.query}`;
    }
}

class VirgoResult extends GeneralSearchResult {
    constructor(init) {
        super(init);
    }
}

/* eslint-disable camelcase */
class PersonData extends DrupalSearchData {
    constructor() {
        super(...arguments);
        this.type = "person";
        this.items = [];
    }
    parseResults(n) {
        // parse out the excerpts that are located in a meta section of the response
        n.data.forEach((res) => {
            const id = res.attributes.drupal_internal__nid;
            const meta = n.meta.extra_data[id];
            res.meta = meta;
        });
        // Setup Library results
        this.items = n.data.map(parse$4);
        this.meta.totalResults = n.meta.count;
        this.meta.url = `https://library.virginia.edu/search/node?keys=${this.query}`;
    }
}

// generic node, similar fields that all node types might share
class DHatNode {
    constructor(init) {
        Object.assign(this, init);
    }
}
function parse$2(tool) {
    return new DHatNode({
        id: tool.title,
        title: tool.title,
        type: tool.Type.toLowerCase(),
        description: tool.Body,
        images: tool['Featured Image'] ? [{ alt: tool['Featured Image'].alt, url: tool['Featured Image'].src }] : undefined,
        materials: tool['MAO Materials'] ? tool['MAO Materials'].split(',') : undefined,
        link: `https://dh.library.virginia.edu${tool.Path}`
    });
}

function parseWebLinks(person) {
    let links;
    if (person.blogTitles && person.blogURLs) {
        const titles = person.blogTitles.split(',');
        const urls = person.blogURLs.split(',');
        links = titles.map((title, index) => ({ title, url: urls[index], type: "blog" }));
    }
    if (person.otherLinkTitles && person.otherLinkURLs) {
        if (!links)
            links = [];
        const titles = person.otherLinkTitles.split(',');
        const urls = person.otherLinkURLs.split(',');
        links = links.concat(titles.map((title, index) => ({ title, url: urls[index], type: "other" })));
    }
    if (person.publicationLinkTitles && person.publicationLinkURLs) {
        if (!links)
            links = [];
        const titles = person.publicationLinkTitles.split(',');
        const urls = person.publicationLinkURLs.split(',');
        links = links.concat(titles.map((title, index) => ({ title, url: urls[index], type: "publication" })));
    }
    return links;
}
function parse$1(person) {
    const pep = parse$2(person);
    pep.webLinks = parseWebLinks(person);
    pep.email = person.Email;
    pep.name = person.Name;
    pep.computingId = person["UVA ID"];
    return pep;
}

function parse(tool) {
    const event = parse$2(tool);
    event.location = tool.Location;
    event.affiliatedUVA = (!(tool['Not UVa Affiliated'] === "Not UVa"));
    event.certificate = (!(tool['Certificate Event'] === "no"));
    event.eventType = tool['Event Type'];
    return event;
}

class DHatData extends GeneralData {
    constructor(init) {
        super();
        this.items = [];
        this.limit = 10000;
        // type types of nodes we know about and how to parse them
        this.types = {
            "Organization": parse$2,
            "Profile": parse$1,
            "Tool": parse$2,
            "News": parse$2,
            "Event": parse,
            "Relationship": parse$2,
            "job": parse$2,
            "Basic page": parse$2,
            "Course": parse$2
        };
        Object.assign(this, init);
    }
    async fetchData() {
        // This should be fetched live from the site under normal conditions
        return fetch('https://api.library.virginia.edu/dh/node-listing')
            .then(r => r.json())
            .then((DHData) => this.parseResults(DHData));
    }
    // eslint-disable-next-line class-methods-use-this
    parseResults(d) {
        this.items = d.nodes.filter((n) => Object.keys(this.types).includes(n.node.Type))
            // eslint-disable-next-line arrow-body-style
            .map((n) => {
            if (Object.keys(this.types).includes(n.node.Type))
                return this.types[n.node.Type](n.node);
            return parse$2(n.node);
        });
        return { items: this.items.slice(0, this.limit), meta: { totalResults: this.items.length } };
    }
}

export { DHatData as D, PageData as P, VirgoResult as V, PersonData as a };
