import { Hours } from "./Hours.js";

const libcalURL = "https://api3.libcal.com/api_hours_grid.php?iid=863&format=json&weeks=1";

export class Library {
    public id: string | undefined;

    public uuid: string | undefined;

    public title: string | undefined;

    public body: string | undefined;

    public description: string | undefined;

    public shortTitle: string | undefined;

    public placeType: string | undefined;

    public contactForm: string | undefined;

    public donorDescription: string | undefined;

    public donorTitle: string | undefined;

    public emailAddress: string | undefined;

    public hoursInformation: {processed: string} | undefined;

    public hoursId: string | undefined;

    public libraryFeed: string | undefined;

    public link: string | undefined;

    public siteLink: {title: string, uri: string} | undefined;

    public mainImage: { alt: string; url: string; uuid: string; } | undefined;

    public fmKey: string | undefined;

    public location: { lat: string; lng: string; } | undefined | null;

    public mygroupId: string | undefined;

    public phoneNumber: string | undefined;

    public socialMedia: { uri: string; title: string; }[] | undefined | null;

    public slug: string | undefined;

    public zipCode: string | undefined;

    public googleMyBusiness: boolean | undefined;

    public parent: string | undefined;

    public closureOverride: number | undefined; 

    public hours: Hours | undefined;

    public setHours(h: Hours | undefined) {
        this.hours = h;
    }

//    public async fetchHours() {
//        if (this.hoursId) {
//
//        }
//        else throw new Error(`hoursId is undefined`);
//    }

    constructor(init?:Partial<Library>) {
        Object.assign(this, init);
    }
}

export function parse(lib: { id: any; attributes: { title: any; body: { processed: any; }; field_short_title: any; field_type_basic: any; field_contact_form: any; field_donor_description: any; field_donor_title: any; field_email_address: any; field_hours_information: any; field_libcal_id: any; field_library_feed: any; field_library_site_link: any; field_location_key: any; field_fm_location: { lat: any; lng: any; }; field_mygroup_id: any; field_phone_number: any; field_social_media: { uri: any; title: any; }[]; field_slug: any; field_zip_code: any; field_google_my_business: any; field_parent: { data: { id: any; }; }; field_closure_override: any; }; }){
    return new Library({
      id: lib.id,
      uuid: lib.id,
      title: lib.attributes.title,
      body: lib.attributes.body.processed,
      description: lib.attributes.body.processed,
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
      siteLink: lib.attributes.field_library_site_link?.uri,
  // URL is missing from images in this feed
  //      mainImage: lib.attributes.field_main_image? {
  //        alt: lib.attributes.field_main_image.data[0].meta.alt,
  //        url: lib.attributes.field_main_image.data[0].meta.
  //        uuid: lib.attributes.field_main_image.data[0].id
  //      }:null
      fmKey: lib.attributes.field_location_key,
      location: lib.attributes.field_fm_location? {
        lat: lib.attributes.field_fm_location.lat,
        lng: lib.attributes.field_fm_location.lng
      }:null,
      mygroupId: lib.attributes.field_mygroup_id,
      phoneNumber: lib.attributes.field_phone_number,
      socialMedia: lib.attributes.field_social_media? 
        lib.attributes.field_social_media.map((sm: { uri: any; title: any; })=>({uri:sm.uri, title:sm.title})):null,
      slug: lib.attributes.field_slug,
      zipCode: lib.attributes.field_zip_code,
      googleMyBusiness: lib.attributes.field_google_my_business,
      parent: lib.attributes.field_parent && lib.attributes.field_parent.data && lib.attributes.field_parent.data.id? 
        lib.attributes.field_parent.data.id: null,
      closureOverride: lib.attributes.field_closure_override
    })
  }