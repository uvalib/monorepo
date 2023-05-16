import { G as GeneralSearchResult } from './GeneralSearchResult-835c7dd8.js';
import { G as GeneralData } from './ArticlesData-40bc37f5.js';

class Library extends GeneralSearchResult {
    setHours(h) {
        this.hours = h;
    }
    getHoursCalIds() {
        let ids = new Array();
        if (this.hoursId)
            ids.push(parseInt(this.hoursId));
        if (this.children)
            this.children.forEach((c) => {
                if (c.hoursId)
                    ids.push(parseInt(c.hoursId));
            });
        return ids;
    }
    async fetchHours() {
        if (this.hoursId) ;
        else
            throw new Error(`hoursId is undefined`);
    }
    constructor(init) {
        super(init);
    }
    async getChildren() {
        // Get children logic here
    }
    async getParent() {
        // Get parent logic here
    }
}
function parse(lib) {
    var _a, _b, _c, _d;
    return new Library({
        id: lib.id,
        uuid: lib.id,
        title: lib.attributes.title,
        body: (_a = lib.attributes.body) === null || _a === void 0 ? void 0 : _a.processed,
        description: (_b = lib.attributes.body) === null || _b === void 0 ? void 0 : _b.processed,
        shortTitle: lib.attributes.field_short_title,
        placeType: lib.attributes.field_type_basic,
        contactForm: lib.attributes.field_contact_form,
        donorDescription: lib.attributes.field_donor_description,
        donorTitle: lib.attributes.field_donor_title,
        emailAddress: lib.attributes.field_email_address,
        hoursInformation: lib.attributes.field_hours_information,
        hoursId: lib.attributes.field_libcal_id,
        libraryFeed: lib.attributes.field_library_feed,
        link: (_c = lib.attributes.field_library_site_link) === null || _c === void 0 ? void 0 : _c.uri,
        siteLink: (_d = lib.attributes.field_library_site_link) === null || _d === void 0 ? void 0 : _d.uri,
        fmKey: lib.attributes.field_location_key,
        location: lib.attributes.field_fm_location ? {
            lat: lib.attributes.field_fm_location.lat,
            lng: lib.attributes.field_fm_location.lng
        } : undefined,
        mygroupId: lib.attributes.field_mygroup_id,
        phoneNumber: lib.attributes.field_phone_number,
        socialMedia: lib.attributes.field_social_media ?
            lib.attributes.field_social_media.map((sm) => ({ uri: sm.uri, title: sm.title })) :
            undefined,
        slug: lib.attributes.field_slug,
        zipCode: lib.attributes.field_zip_code,
        googleMyBusiness: lib.attributes.field_google_my_business,
        parent: lib.relationships.field_parent && lib.relationships.field_parent.data && lib.relationships.field_parent.data.id ?
            lib.relationships.field_parent.data.id :
            undefined,
        closureOverride: lib.attributes.field_closure_override
    });
}

class DrupalData extends GeneralData {
    constructor(init) {
        super();
        this.drupalEndpointURL = window && window.location && window.location.hostname &&
            (window.location.hostname === 'library.virginia.edu' ||
                window.location.hostname === 'www.library.virginia.edu' ||
                window.location.hostname === 'library-drupal-dev-1.internal.lib.virginia.edu')
            ? `/jsonapi/`
            : 'https://api.library.virginia.edu/drupal/jsonapi/';
        this.type = '';
        this.types = [];
    }
    makeQueryString() {
        let qs = this.query ? `filter[fulltext]=${this.query}&` : '';
        qs += this.limit ? `page[limit]=${this.limit}&` : '';
        if (this.types && this.types.length > 0) {
            qs += 'filter[types-group][group][conjunction]=OR';
            this.types.forEach((t) => {
                qs += `&filter[${t}-filter][condition][path]=type&filter[${t}-filter][condition][value]=${t}`;
                qs += `&filter[${t}-filter][condition][memberOf]=types-group`;
            });
            return qs;
        }
        return this.type ? `filter[type]=${this.type}&${qs}` : qs;
    }
    makeURL() {
        return `${this.drupalEndpointURL}?${this.makeQueryString()}`.replace(/^(.*)\?$/, '$1');
    }
    async fetchData(params) {
        if (params && params.limit)
            this.limit = params.limit;
        const response = await this.fetchWithRetry(this.makeURL());
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${this.makeURL()}`);
        }
        const data = await response.json();
        this.parseResults(data);
        return { items: this.items, meta: this.meta };
    }
    parseResults(d) {
        this.items = d.data
            ? d.data.map((n) => ({
                title: n.attributes.title,
                description: n.attributes.body ? n.attributes.body.value : null,
            }))
            : [];
        this.meta.totalResults = d.data && d.data.meta ? d.data.meta.count : 0;
    }
}

const WebSearchPageURL = 'https://library.virginia.edu/search/content';
class DrupalSearchData extends DrupalData {
    constructor(init) {
        super();
        this.drupalEndpointURL = `${this.drupalEndpointURL}index/default_index`;
    }
    parseResults(d) {
        super.parseResults(d);
    }
}

const hoursEndpointURL = "https://cal.lib.virginia.edu/api/1.0/hours/[[calIds]]?iid=863&key=e4b27d40b7099e8e392113da2f8bf30a";
class Hours extends GeneralSearchResult {
    constructor(init) {
        super(init);
    }
}

function parseHours(hoursData) {
    return new Hours({
        id: hoursData.lid,
        title: hoursData.name,
        description: hoursData.desc,
        link: hoursData.url,
        rawDates: hoursData.dates,
    });
}
function formatLocalSSDate(date) {
    // SS expects dates to be formatted to YYYY-MM-DD format in Eastern Time
    const dtf = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const [{ value: month }, , { value: day }, , { value: year }] = dtf.formatToParts(date);
    return `${year}-${month}-${day}`;
}
class HoursData extends GeneralData {
    constructor(init) {
        super();
        this.items = [];
        this.ids = [];
        Object.assign(this, init);
    }
    async fetchHours(startDate, count) {
        let end;
        if (count && Math.trunc(count) > 0) {
            end = new Date(startDate);
            end.setDate(startDate.getDate() + Math.trunc(count));
        }
        else {
            end = new Date(startDate);
        }
        const qsa = `&from=${formatLocalSSDate(startDate)}&to=${formatLocalSSDate(end)}`;
        return this.fetchData(qsa);
    }
    // eslint-disable-next-line class-methods-use-this
    async fetchData(qsa = undefined) {
        return this.fetchWithRetry(`${hoursEndpointURL.replace('[[calIds]]', this.ids.join(','))}${qsa ? `&${qsa}` : ''}`)
            .then((res) => res.json())
            .then((hoursData) => hoursData.map((hours) => parseHours(hours)));
    }
}

/* eslint-disable camelcase */
class LibrariesData extends DrupalSearchData {
    constructor() {
        super(...arguments);
        this.type = 'library';
        this.items = [];
    }
    parseResults(n) {
        // Setup Library results
        this.items = n.data.map(parse);
    }
    async getLibrary(id, children = false) {
        const promise = this.items && this.items.length > 0 ? Promise.resolve(this.items) : this.fetchData();
        return promise
            .then((libs) => {
            if (libs) {
                const lib = this.items.find((lib) => lib.slug === id);
                return lib;
            }
            return null;
        })
            .then((lib) => {
            if (children && lib)
                return this.getChildren(id).then(() => lib);
            return lib;
        });
    }
    async getChildren(libId) {
        return this.getLibrary(libId).then((lib) => {
            if (lib) {
                if (lib.children)
                    return lib.children;
                // eslint-disable-next-line no-param-reassign
                lib.children = this.items.filter((l) => l.parent === lib.id);
                return lib.children;
            }
            return null;
        });
    }
    // While individual Library entities should be able to fetch their own hours, we
    // need to be able to make a single api fetch when necessary (to save on network data)
    async fetchHours(start = new Date(), count, hoursIds) {
        if (!hoursIds)
            hoursIds = this.items
                .map((lib) => lib.hoursId)
                .filter((id) => id !== null)
                .map((id) => parseInt(id, 10));
        return new HoursData({ ids: hoursIds })
            .fetchHours(start, count)
            .then((hours) => {
            this.items.forEach((library) => {
                // Libraries can get their own hours, but we are spoon-feeding them in this case so we can make one request for all
                if (library.hoursId)
                    library.setHours(hours.find((h) => parseInt(h.id, 10) === parseInt(library.hoursId, 10)));
            });
        });
    }
}

export { DrupalSearchData as D, Library as L, WebSearchPageURL as W, LibrariesData as a, parse as p };
