import { GeneralSearchResult } from './GeneralSearchResult.js';
import { Hours } from './Hours.js';

export class Library extends GeneralSearchResult {
  public uuid?: string;
  public body?: string;
  public shortTitle?: string;
  public placeType?: string;
  public contactForm?: string;
  public donorDescription?: string;
  public donorTitle?: string;
  public emailAddress?: string;
  public hoursInformation?: { processed: string };
  public hoursId?: string;
  public libraryFeed?: string;
  public siteLink?: { title: string; uri: string };
  public mainImage?: { alt: string; url: string; uuid: string };
  public fmKey?: string;
  public location?: { lat: string; lng: string };
  public mygroupId?: string;
  public phoneNumber?: string;
  public socialMedia?: { uri: string; title: string }[];
  public slug?: string;
  public zipCode?: string;
  public googleMyBusiness?: boolean;
  public parent?: string;
  public children?: Library[];
  public closureOverride?: number;
  public hours?: Hours;

  public setHours(h?: Hours) {
    this.hours = h;
  }

  public getHoursCalIds() {
    let ids: number[] = new Array();
    if (this.hoursId) ids.push(parseInt(this.hoursId));
    if (this.children)
      this.children.forEach((c) => {
        if (c.hoursId) ids.push(parseInt(c.hoursId));
      });
    return ids;
  }

  public async fetchHours() {
    if (this.hoursId) {
      // Fetch hours logic here
    } else throw new Error(`hoursId is undefined`);
  }

  constructor(init?: Partial<Library>) {
    super(init);
  }

  public async getChildren() {
    // Get children logic here
  }

  public async getParent() {
    // Get parent logic here
  }
}

export function parse(lib: {
  relationships: any;
  id: any;
  attributes: {
    title: any;
    body: { processed: any };
    field_short_title: any;
    field_type_basic: any;
    field_contact_form: any;
    field_donor_description: any;
    field_donor_title: any;
    field_email_address: any;
    field_hours_information: any;
    field_libcal_id: any;
    field_library_feed: any;
    field_library_site_link: { uri: any };
    field_location_key: any;
    field_fm_location: { lat: any; lng: any };
    field_mygroup_id: any;
    field_phone_number: any;
    field_social_media: { uri: any; title: any }[];
    field_slug: any;
    field_zip_code: any;
    field_google_my_business: any;
    field_parent: { data: { id: string | undefined } };
    field_closure_override: any;
  };
}) {
  return new Library({
    id: lib.id,
    uuid: lib.id,
    title: lib.attributes.title,
    body: lib.attributes.body?.processed,
    description: lib.attributes.body?.processed,
    shortTitle: lib.attributes.field_short_title,
    placeType: lib.attributes.field_type_basic,
    contactForm: lib.attributes.field_contact_form,
    donorDescription: lib.attributes.field_donor_description,
    donorTitle: lib.attributes.field_donor_title,
    emailAddress: lib.attributes.field_email_address,
    hoursInformation: lib.attributes.field_hours_information,
    hoursId: lib.attributes.field_libcal_id,
    libraryFeed: lib.attributes.field_library_feed,
    link: lib.attributes.field_library_site_link?.uri,
    siteLink: lib.attributes.field_library_site_link?.uri.replace("internal:","https://www.library.virginia.edu"),
    fmKey: lib.attributes.field_location_key,
    location: lib.attributes.field_fm_location ? {
      lat: lib.attributes.field_fm_location.lat,
      lng: lib.attributes.field_fm_location.lng
    } : undefined,
    mygroupId: lib.attributes.field_mygroup_id,
    phoneNumber: lib.attributes.field_phone_number,
    socialMedia: lib.attributes.field_social_media ?
      lib.attributes.field_social_media.map((sm: { uri: any; title: any }) => ({ uri: sm.uri, title: sm.title })) :
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

