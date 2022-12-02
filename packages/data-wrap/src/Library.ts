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

    public hoursInformation: string | undefined;

    public hoursId: string | undefined;

    public libraryFeed: string | undefined;

    public link: string | undefined;

    public siteLink: string | undefined;

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