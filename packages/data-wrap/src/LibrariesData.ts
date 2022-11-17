/* eslint-disable camelcase */
import { GeneralSearchResult } from './GeneralSearchResult.js';
import { Library} from './Library.js';

const librariesEndpointURL = "https://api.library.virginia.edu/drupal/libs?_format=json";

export class LibrariesData {

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

    // eslint-disable-next-line class-methods-use-this
    #parseResults(d: any) {
      // eslint-disable-next-line no-console
      console.log(d);
      this.libraries = d.map((l: {
        field_main_image: string | any[];
        field_library_site_link: string | any[];
        field_library_feed: any;
        field_libcal_id: any
        field_hours_information: any;
        field_donor_description: any;
        field_email_address: any;
        field_donor_title: any;
        field_contact_form: any;
        field_type_basic: any;
        field_short_title: any;
        body: any;
        title: any;
        uuid: any; nid: any; 
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
          //mainImage: this.#getValue(l.field_main_image),
        }))
    }

    // eslint-disable-next-line class-methods-use-this
    #getValue(prop: string | any[]){
      return prop && prop.length>0? 
        prop[0].value: 
        null;
    }
  
  }