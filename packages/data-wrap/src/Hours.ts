import { GeneralSearchResult } from "./GeneralSearchResult";

export const hoursEndpointURL = "https://cal.lib.virginia.edu/api/1.0/hours/[[calIds]]?iid=863&key=e4b27d40b7099e8e392113da2f8bf30a";

export class Hours extends GeneralSearchResult {
  public rawDates: any | undefined;
  public nextClosingTime: Date | null = null;
  public nextOpeningTime: Date | null = null;
  public isOpen: Number | null = null;

  constructor(init?: Partial<Hours>) {
    super(init);
  }
}
