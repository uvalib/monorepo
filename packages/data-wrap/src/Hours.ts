export const hoursEndpointURL = "https://cal.lib.virginia.edu/api/1.0/hours/[[calIds]]?iid=863&key=e4b27d40b7099e8e392113da2f8bf30a";

export class Hours {
    public id: string | undefined;

    public title: string | undefined;

    public description: string | undefined;

    public link: string | undefined;

    public rawDates: any | undefined; 

//    public async fetchHours() {
//        if (this.hoursId) {
//
//        }
//        else throw new Error(`hoursId is undefined`);
//    }

    constructor(init?:Partial<Hours>) {
        Object.assign(this, init);
    }
}