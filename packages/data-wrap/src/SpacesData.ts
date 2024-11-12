import { Space, parseSpace } from './Space.js';
import { GeneralData } from './GeneralData.js';
import { LibcalAuth } from './libcal-auth.js';

export class SpacesData extends GeneralData {
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

  items: Space[] = [];

  private auth: LibcalAuth;
  private baseUrl: string;

  constructor(auth: LibcalAuth, init?: Partial<SpacesData>) {
    super();
    this.auth = auth;
    this.baseUrl = auth.baseUrl;
    Object.assign(this, init);
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
      // If no date is provided, default to today's date
      const today = new Date().toISOString().split('T')[0];
      params.append('date', today);
    }
    params.append('days', String(this.days));
    params.append('limit', String(this.limit));
    params.append('page', String(this.page));
    params.append('formAnswers', String(this.formAnswers));
    params.append('checkInStatus', String(this.checkInStatus));
    params.append('include_tentative', this.includeTentative ? '1' : '0');
    params.append('include_cancel', this.includeCanceled ? '1' : '0');
    params.append('include_remote', String(this.includeRemote));

    return `${this.baseUrl}${endpoint}?${params.toString()}`;
  }

  async fetchData(): Promise<{ items: Space[]; meta: { totalResults?: number } }> {
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
    this.items = data.map(parseSpace);
    this.meta.totalResults = data.length;
  }
}
