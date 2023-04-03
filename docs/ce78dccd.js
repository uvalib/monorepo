import { G as GeneralData, c as DrupalSearchData, B as BentoSection, a as __classPrivateFieldSet, b as __classPrivateFieldGet, y } from './24c62c57.js';

class Library {
    setHours(h) {
        this.hours = h;
    }
    getHoursCalIds() {
        let ids = new Array();
        if (this.hoursId)
            ids.push(parseInt(this.hoursId));
        if (this.children)
            this.children.forEach(c => { if (c.hoursId)
                ids.push(parseInt(c.hoursId)); });
        return ids;
    }
    async fetchHours() {
        if (this.hoursId) ;
        else
            throw new Error(`hoursId is undefined`);
    }
    constructor(init) {
        Object.assign(this, init);
    }
    async getChildren() { }
    async getParent() { }
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
        // URL is missing from images in this feed
        //      mainImage: lib.attributes.field_main_image? {
        //        alt: lib.attributes.field_main_image.data[0].meta.alt,
        //        url: lib.attributes.field_main_image.data[0].meta.
        //        uuid: lib.attributes.field_main_image.data[0].id
        //      }:null
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

const hoursEndpointURL = "https://cal.lib.virginia.edu/api/1.0/hours/[[calIds]]?iid=863&key=e4b27d40b7099e8e392113da2f8bf30a";
class Hours {
    //    public async fetchHours() {
    //        if (this.hoursId) {
    //
    //        }
    //        else throw new Error(`hoursId is undefined`);
    //    }
    constructor(init) {
        Object.assign(this, init);
    }
}

function parseHours(hoursData) {
    return new Hours({
        id: hoursData.lid,
        title: hoursData.name,
        description: hoursData.desc,
        link: hoursData.url,
        rawDates: hoursData.dates
    });
}
function formatLocalSSDate(date) {
    // SS expects dates to be formatted to YYYY-MM-DD format in Eastern Time
    const dtf = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' });
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
        else
            end = new Date(startDate);
        const qsa = `&from=${formatLocalSSDate(startDate)}&to=${formatLocalSSDate(end)}`;
        return this.fetchData(qsa);
    }
    // eslint-disable-next-line class-methods-use-this
    async fetchData(qsa = undefined) {
        return fetch(`${hoursEndpointURL.replace("[[calIds]]", this.ids.join(','))}${qsa ? `&${qsa}` : ''}`)
            .then(res => res.json())
            .then(hoursData => hoursData.map((hours) => parseHours(hours)));
    }
}

/* eslint-disable camelcase */
class LibrariesData extends DrupalSearchData {
    constructor() {
        super(...arguments);
        this.type = "library";
        this.items = [];
    }
    _parseResults(n) {
        // Setup Library results
        this.items = n.data.map(parse);
    }
    async getLibrary(id, children = false) {
        const promise = this.items && this.items.length > 0 ?
            Promise.resolve(this.items) :
            this.fetchData();
        return promise.then(libs => {
            if (libs) {
                const lib = this.items.find(lib => lib.slug === id);
                return lib;
            }
            return null;
        }).then(lib => {
            if (children && lib)
                return this.getChildren(id).then(() => lib);
            return lib;
        });
    }
    async getChildren(libId) {
        return this.getLibrary(libId).then(lib => {
            if (lib) {
                if (lib.children)
                    return lib.children;
                // eslint-disable-next-line no-param-reassign
                lib.children = this.items.filter(l => l.parent === lib.id);
                return lib.children;
            }
            else {
                return null;
            }
        });
    }
    // While individual Library entities should be able to fetch their own hours, we 
    // need to be able to make a single api fetch when necessary (to save on network data)
    async fetchHours(start = new Date(), count, hoursIds) {
        if (!hoursIds)
            hoursIds = this.items.map(lib => lib.hoursId).filter(id => id !== null).map(id => parseInt(id, 10));
        return new HoursData({ ids: hoursIds }).fetchHours(start, count)
            .then((hours) => {
            this.items.forEach(library => {
                // Libraries can get their own hours but we are spoon feeding them in this case so we can make one request for all
                if (library.hoursId)
                    library.setHours(hours.find((h) => parseInt(h.id, 10) === parseInt(library.hoursId, 10)));
            });
        });
    }
}

var _LibrariesSection_librariesData;
function renderBriefItem(item) {
    return y `  
      ${item.link ? y `
        <div class="bento-section-title"><a href="${item.link}">${item.title}</a></div>
      ` : y `
        <div class="bento-section-title"><a href="http://library.virginia.edu/hours#${item.slug}">${item.title}</a></div>
      `}
      <div class="bento-section-desc"><!-- put todays hours here --></div>
    `;
}
class LibrariesSection extends BentoSection {
    constructor() {
        super();
        _LibrariesSection_librariesData.set(this, void 0);
        this.title = "Libraries";
        __classPrivateFieldSet(this, _LibrariesSection_librariesData, new LibrariesData(), "f");
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        if (_changedProperties.has('query')) {
            this.loading = true;
            __classPrivateFieldGet(this, _LibrariesSection_librariesData, "f").query = this.query;
            __classPrivateFieldGet(this, _LibrariesSection_librariesData, "f").fetchData().then(() => {
                this.items = __classPrivateFieldGet(this, _LibrariesSection_librariesData, "f").items;
                this.loading = false;
            });
        }
    }
    // eslint-disable-next-line class-methods-use-this
    renderBriefItem(item) {
        return renderBriefItem(item);
    }
}
_LibrariesSection_librariesData = new WeakMap();

export { Library as L, LibrariesSection as a, parse as p, renderBriefItem as r };
