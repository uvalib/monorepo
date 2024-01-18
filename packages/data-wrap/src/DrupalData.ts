import { GeneralData } from './GeneralData.js';

export class DrupalData extends GeneralData {
  protected drupalEndpointURL = `/jsonapi/index/default_index`;
//    window && window.location && window.location.hostname &&
//    (window.location.hostname === 'library.virginia.edu' ||
//      window.location.hostname === 'www.library.virginia.edu' ||
//      window.location.hostname === 'library-drupal-dev-1.internal.lib.virginia.edu' ||
//      window.location.hostname === 'library-drupal-dev.internal.lib.virginia.edu') ||
//      window.location.hostname === 'uvalib-drupal-theme.ddev.site'
//      ? `/jsonapi/index/default_index`
//      : 'https://5570499q1i.execute-api.us-east-2.amazonaws.com/1_1_2/drupal';

  protected type: string = '';

  public types: string[] = [];

  constructor(init?: Partial<DrupalData>) {
    super();
  }

  protected makeQueryString() {
    let qs = this.query ? `filter[fulltext]=${this.query}&` : '';
    qs += this.limit ? `page[limit]=${this.limit}&` : '';

    if (this.types && this.types.length > 0) {
      qs += 'filter[types-group][group][conjunction]=OR';
      this.types.forEach((t) => {
        qs += `&filter[${t}-filter][condition][path]=type&filter[${t}-filter][condition][value]=${t}`;
        qs += `&filter[${t}-filter][condition][memberOf]=types-group`;
      });
      return qs;
    }

    return this.type ? `filter[type]=${this.type}&${qs}` : qs;
  }

  protected makeURL() {
    return `${this.drupalEndpointURL}?${this.makeQueryString()}`.replace(/^(.*)\?$/, '$1');
  }

  async fetchData(params?: { limit?: number }): Promise<{ items: any[]; meta: any }> {
    if (params && params.limit) this.limit = params.limit;
    const response = await this.fetchWithRetry(this.makeURL());

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${this.makeURL()}`);
    }

    const data = await response.json();
    this.parseResults(data);

    return { items: this.items, meta: this.meta };
  }

  protected parseResults(d: any) {
    this.items = d.data
      ? d.data.map((n: { attributes: { body: any; title: any } }) => ({
          title: n.attributes.title,
          description: n.attributes.body ? n.attributes.body.value : null,
        }))
      : [];
    this.meta.totalResults = d.data && d.data.meta ? d.data.meta.count : 0;
  }
}
