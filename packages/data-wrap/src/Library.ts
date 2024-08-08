import { GeneralSearchResult } from './GeneralSearchResult.js';
import { Hours } from './Hours.js';

//const SITE_LINK_BASE = "https://www.library.virginia.edu";
const SITE_LINK_BASE = "";

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
  public priorityPlacement?: number;

  public setHours(h?: Hours) {
    if (!h) {
      throw new Error("Invalid Hours object provided.");
    }
    this.hours = h;
  }

  public getHoursCalIds() {
    let ids: number[] = [];
    if (this.hoursId) {
      const parsedId = parseInt(this.hoursId);
      if (isNaN(parsedId)) {
        throw new Error(`Invalid hoursId value: ${this.hoursId}`);
      }
      ids.push(parsedId);
    }

    if (this.children) {
      this.children.forEach((c) => {
        if (c.hoursId) {
          const parsedChildId = parseInt(c.hoursId);
          if (isNaN(parsedChildId)) {
            throw new Error(`Invalid hoursId value for child: ${c.hoursId}`);
          }
          ids.push(parsedChildId);
        }
      });
    }

    return ids;
  }

  public async fetchHours(startDate: Date, count: number | undefined, extra: boolean = false) {
    if (!this.hoursId) {
      throw new Error(`hoursId is undefined`);
    } else  {
      import("./HoursData.js").then((module) => {
        const HoursData = module.HoursData;
        if (this.hoursId !== undefined) {
          const hoursData = new HoursData({ ids: [parseInt(this.hoursId)] });
          hoursData.fetchHours(startDate, count).then((hours) => {
//            console.log(hours)
            this.setHours(hours[0]);
          });
        }
      });
    }

    // If you fetch from an API:
    // try {
    //   const response = await fetch(YOUR_API_ENDPOINT);
    //   const data = await response.json();
    //   // Handle the data here
    // } catch (error) {
    //   throw new Error("Failed to fetch hours: " + error.message);
    // }
  }

  constructor(init?: Partial<Library>) {
    super(init);
  }

  public async getChildren() {
    // Error handling should be similar to fetchHours
  }

  public async getParent() {
    // Error handling should be similar to fetchHours
  }
}

interface ApiResponseShape {
  relationships: {
    field_parent?: {
      data?: {
        id?: string;
      };
    };
  };
  id: string;
  attributes: {
    title: string;
    body?: { processed: string };
    field_short_title?: string;
    field_type_basic?: string;
    field_contact_form?: string;
    field_donor_description?: string;
    field_donor_title?: string;
    field_email_address?: string;
    field_hours_information?: { processed: string };
    field_libcal_id?: string;
    field_library_feed?: string;
    field_library_site_link?: { uri: string };
    field_location_key?: string;
    field_fm_location?: { lat: string; lng: string };
    field_mygroup_id?: string;
    field_phone_number?: string;
    field_social_media?: { uri: string; title: string }[];
    field_slug?: string;
    field_zip_code?: string;
    field_google_my_business?: boolean;
    field_closure_override?: number;
    field_priority_placement?: number;
  };
}

export function parse(lib: ApiResponseShape): Library {
  if (!lib || !lib.id || !lib.attributes.title) {
    throw new Error("Invalid library data provided.");
  }

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
    siteLink: {
      title: lib.attributes.field_library_site_link?.uri ?? "", 
      uri: lib.attributes.field_library_site_link?.uri.replace("internal:", SITE_LINK_BASE) ?? ""
    },
    fmKey: lib.attributes.field_location_key,
    location: lib.attributes.field_fm_location ? {
      lat: lib.attributes.field_fm_location.lat,
      lng: lib.attributes.field_fm_location.lng
    } : undefined,
    mygroupId: lib.attributes.field_mygroup_id,
    phoneNumber: lib.attributes.field_phone_number,
    socialMedia: lib.attributes.field_social_media?.map(sm => ({ uri: sm.uri, title: sm.title })),
    slug: lib.attributes.field_slug,
    zipCode: lib.attributes.field_zip_code,
    googleMyBusiness: lib.attributes.field_google_my_business,
    parent: lib.relationships.field_parent?.data?.id,
    closureOverride: lib.attributes.field_closure_override,
    priorityPlacement: lib.attributes.field_priority_placement
  });
}
