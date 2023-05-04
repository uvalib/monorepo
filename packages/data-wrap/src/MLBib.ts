import { GeneralSearchResult } from "./GeneralSearchResult";

export const hoursEndpointURL = "https://cal.lib.virginia.edu/api/1.0/hours/[[calIds]]?iid=863&key=e4b27d40b7099e8e392113da2f8bf30a";

export const mlbExtrasURL = "https://mlbib.library.virginia.edu/json/extras.json";

export const mlbYearsURL = "https://mlbib.library.virginia.edu/json/years.json";

export class MLBib extends GeneralSearchResult {

    constructor(init?:Partial<MLBib>) {
        super(init);
    }
}