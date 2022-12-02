const libcalURL = "https://api3.libcal.com/api_hours_grid.php?iid=863&format=json&weeks=1";

export class Library {
    id: string | undefined;

    uuid: string | undefined;

    title: string | undefined;

    body: string | undefined;

    description: string | undefined;

    shortTitle: string | undefined;

    placeType: string | undefined;

    contactForm: string | undefined;

    donorDescription: string | undefined;

    donorTitle: string | undefined;

    emailAddress: string | undefined;

    hoursInformation: string | undefined;

    libcalId: string | undefined;

    libraryFeed: string | undefined;

    link: string | undefined;

    siteLink: string | undefined;

    mainImage: { alt: string; url: string; uuid: string; } | undefined;

    fmKey: string | undefined;

    location: { lat: string; lng: string; } | undefined | null;

    mygroupId: string | undefined;

    phoneNumber: string | undefined;

    socialMedia: { uri: string; title: string; }[] | undefined | null;

    slug: string | undefined;

    zipCode: string | undefined;

    googleMyBusiness: boolean | undefined;

    parent: string | undefined;

    closureOverride: number | undefined; 

    async fetchHours() {
        if (this.libcalId) {

        }
        else throw new Error(`libcalId is undefined`);
    }

    constructor(init?:Partial<Library>) {
        Object.assign(this, init);
    }
}