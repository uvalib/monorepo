export interface Library { 
    id: string[] | undefined;
    uuid: string[] | undefined;
    title: string[] | undefined;
    body: string[] | undefined;
    shortTitle: string[] | undefined;
    placeType: string[] | undefined;
    contactForm: string[] | undefined;
    donorDescription: string[] | undefined;
    donorTitle: string[] | undefined;
    emailAddress: string[] | undefined;
    hoursInformation: string[] | undefined;
    libcalId: string[] | undefined;
    libraryFeed: string[] | undefined;
    siteLink: string[] | undefined;
    mainImage: {alt: string, url: string, uuid: string}[] | undefined;
    fmKey: string[] | undefined;
    location: {lat:string, lng:string}[] | undefined;
    mygroupId: string[] | undefined;
    phoneNumber: string[] | undefined;
    socialMedia: {uri: string, title: string}[] | undefined;
    slug: string[] | undefined;
    zipCode: string[] | undefined;
    googleMyBusiness: boolean[] | undefined;
    parent: string[] | undefined;
    closureOverride: number[] | undefined;
}