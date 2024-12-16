import { SpaceBooking, parseSpaceBooking, SpaceLocation, parseSpaceLocation } from './Spaces.js';
import { GeneralData } from './GeneralData.js';
import { LibcalAuth } from './libcal-auth.js';

export class SpacesData extends GeneralData {
  // Existing properties...
  public locationId?: number;
  public categoryId?: number;
  public spaceId?: number | number[];
  public email?: string;
  public date?: string; // Format: YYYY-MM-DD
  public days: number = 0; // Default to 0
  public limit: number = 20; // Default limit
  public page: number = 1; // Default page
  public formAnswers: number = 0; // Default 0
  public checkInStatus: number = 0; // Default 0
  public includeTentative: boolean = true; // Default true
  public includeCanceled: boolean = true; // Default true
  public includeRemote: number = 0; // Default 0

  items: SpaceBooking[] = [];
  locations: SpaceLocation[] = [];

  private auth: LibcalAuth;
  private baseUrl: string;

  constructor(init?: Partial<SpacesData>, auth?: LibcalAuth) {
    super();
    Object.assign(this, init);

    if (auth) {
      this.auth = auth;
    } else {
      // Use default client ID and secret from environment variables or secure storage
      const defaultClientId = '1658';
      const defaultClientSecret = 'd3625b897e1c69282faa8914bbdf0d03';
      const defaultBaseUrl = 'https://cal.lib.virginia.edu/api/1.1';

      this.auth = new LibcalAuth(defaultClientId, defaultClientSecret, defaultBaseUrl);
    }

    this.baseUrl = this.auth.baseUrl;
  }

  private endpointURL(): string {
    const endpoint = '/space/bookings';
    const params = new URLSearchParams();

    if (this.spaceId) {
      const eid = Array.isArray(this.spaceId) ? this.spaceId.join(',') : String(this.spaceId);
      params.append('eid', eid);
    }

    if (this.categoryId) params.append('cid', String(this.categoryId));
    if (this.locationId) params.append('lid', String(this.locationId));
    if (this.email) params.append('email', this.email);
    if (this.date) params.append('date', this.date);
    else {
      const today = new Date().toISOString().split('T')[0];
      params.append('date', today);
    }
    params.append('days', String(this.days));

    // Uncomment parameters as needed
    // params.append('limit', String(this.limit));
    // params.append('page', String(this.page));
    // params.append('formAnswers', String(this.formAnswers));
    // params.append('checkInStatus', String(this.checkInStatus));
    // params.append('include_tentative', this.includeTentative ? '1' : '0');
    // params.append('include_cancel', this.includeCanceled ? '1' : '0');
    // params.append('include_remote', String(this.includeRemote));

    return `${this.baseUrl}${endpoint}?${params.toString()}`;
  }

  async fetchData(): Promise<{ items: SpaceBooking[]; meta: { totalResults?: number } }> {
    const url = this.endpointURL();
    const response = await this.auth.authenticatedFetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch space bookings: ${response.statusText}`);
    }
    const data = await response.json();
    this._parseResults(data);
    return { items: this.items, meta: this.meta };
  }

  private _parseResults(data: any): void {
    // data is an array of bookings
    this.items = data.map(parseSpaceBooking);
    this.meta.totalResults = data.length;
  }

  /** fetch space locations */
  async fetchLocations(options?: { details?: number; adminOnly?: number }): Promise<SpaceLocation[]> {
    const endpoint = '/space/locations';
    const params = new URLSearchParams();

    if (options?.details !== undefined) {
      params.append('details', String(options.details));
    }

    if (options?.adminOnly !== undefined) {
      params.append('admin_only', String(options.adminOnly));
    }

    const url = `${this.baseUrl}${endpoint}?${params.toString()}`;
    const response = await this.auth.authenticatedFetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch space locations: ${response.statusText}`);
    }

    const data = await response.json();
    this.locations = data.map(parseSpaceLocation);
    return this.locations;
  }
}
