/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import { GeneralSearchResult } from './GeneralSearchResult.js';
import { Library} from './Library.js';

const librariesEndpointURL = "https://api.library.virginia.edu/drupal/libs?_format=json";

export class LibrariesData {

    #fuse: object | unknown = null;

    query: string = "";

    items: GeneralSearchResult[] = [];

    libraries: Library[] = [];
  
    async fetchData(){
      return fetch(librariesEndpointURL)
        .then(r=>r.json())
        .then(data=>{
          this.#parseResults(data);
          return this.libraries;
        })
    }

    async search(query: string){
      const fuse = await import('fuse.js');
      // eslint-disable-next-line no-new, new-cap
      const fs = new fuse.default<Library>(this.libraries, {threshold:0.0, keys:['body','title']}); // ,'shortTitle','donorTitle']});
      return fs.search(query).map(({ item })=>item);
    }

    // eslint-disable-next-line class-methods-use-this
    #parseResults(d: any) {
      this.libraries = d.map((l: {
        field_closure_override: string[] | any[];
        field_parent: string[] | any[];
        field_google_my_business: string[] | any[];
        field_zip_code: string[] | any[];
        field_slug: string[] | any[];
        field_social_media: string[] | any[];
        field_phone_number: string[] | any[];
        field_mygroup_id: string[] | any[];
        field_fm_location: string[] | any[];
        field_facilities_management_key: string[] | any[];
        field_main_image: string[] | any[];
        field_library_site_link: string[] | any[];
        field_library_feed: any[];
        field_libcal_id: any[];
        field_hours_information: any[];
        field_donor_description: any[];
        field_email_address: any[];
        field_donor_title: any[];
        field_contact_form: any[];
        field_type_basic: any[];
        field_short_title: any[];
        body: any[];
        title: any[];
        uuid: any[]; 
        nid: any[]; 
      })=>({
          id: this.#getValue(l.nid),
          uuid: this.#getValue(l.uuid),
          title: this.#getValue(l.title),
          body: this.#getValue(l.body),
          shortTitle: this.#getValue(l.field_short_title),
          placeType: this.#getValue(l.field_type_basic),
          contactForm: this.#getValue(l.field_contact_form),
          donorDescription: this.#getValue(l.field_donor_description),
          donorTitle: this.#getValue(l.field_donor_title),
          emailAddress: this.#getValue(l.field_email_address),
          hoursInformation: this.#getValue(l.field_hours_information),
          libcalID: this.#getValue(l.field_libcal_id),
          libraryFeed: this.#getValue(l.field_library_feed),
          siteLink: this.#getValue(l.field_library_site_link),
          mainImage: this.#getValue(l.field_main_image),
          fmKey: this.#getValue(l.field_facilities_management_key),
          location: this.#getValue(l.field_fm_location),
          mygroupID: this.#getValue(l.field_mygroup_id),
          phoneNumber: this.#getValue(l.field_phone_number),
          socialMedia: this.#getValue(l.field_social_media),
          slug: this.#getValue(l.field_slug),
          zipCode: this.#getValue(l.field_zip_code),
          googleMyBusiness: this.#getValue(l.field_google_my_business),
          parent: this.#getValue(l.field_parent),
          closureOverride: this.#getValue(l.field_closure_override)
        }))
    }

    // eslint-disable-next-line class-methods-use-this
    #getValue(props: string[] | any[]){
      return props.map(prop=>prop.value?
                prop.value:
                prop.url? // an image
                  {
                    alt:prop.alt,
                    url:prop.url,
                    uuid:prop.target_uuid
                  }:
                  prop.uri? // social media?
                    {
                      uri: prop.uri,
                      title: prop.title
                    }:
                    null);
    }
  }