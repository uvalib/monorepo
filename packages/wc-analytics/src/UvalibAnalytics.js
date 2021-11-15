import { html, css, LitElement } from 'lit';

export class UvalibAnalytics extends LitElement {

  static get properties() {
    return {
      matomoURL: { type: String },
      matomoId: { type: Number },
      spa: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.matomoURL = "https://analytics.lib.virginia.edu/";
    this.spa = false;
  }

  firstUpdated() {
    this._initMatomo();
    document.addEventListener("uvalib-analytics-search", this._logSearch.bind(this));
    document.addEventListener("uvalib-analytics-event", this._logEvent.bind(this));
    document.addEventListener("uvalib-analytics-pageview", this._logPageView.bind(this));
  }

  _logPageView(e) {
    let customTitle = e.detail? 
      e.detail.customTitle:
      document.querySelector('title').text;
    let referrer = e.detail && e.detail.referrer? 
      e.detail.referrer.contains('http')?
        e.detail.referrer:
        document.location.origin+e.detail.referrer:
      document.referrer;
    this.matomoTracker.setDocumentTitle(customTitle);
    this.matomoTracker.setReferrerUrl(referrer);
    if (this.matomoTracker) this.matomoTracker.trackPageView(customTitle);
  }

  _logSearch(e) {
    console.info(`Search event: ${e.detail.searchQuery} ${e.detail.searchCategory} ${e.detail.resultCount}`);
    if (this.matomoTracker) this.matomoTracker.trackSiteSearch(e.detail.searchQuery, e.detail.searchCategory, e.detail.resultCount.toString() ); 
  }

  _logEvent(e) {
    if (e.detail) {
      // used to be e.detail.track
      if (!e.detail.event && e.detail.track) e.detail.event = e.detail.track;
      console.info(`Custom event: ${e.detail.event.join('--')}`);
      if (this.matomoTracker) this.matomoTracker.trackEvent(...e.detail.event);
    }
  }

  _initMatomo() {
    if (this.matomoId) {
      this.matomoPaq = window._paq = window._paq || [];
      if (!this.spa) {
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
      }
      _paq.push(['setTrackerUrl', `${this.matomoURL}matomo.php`]);
      _paq.push(['setSiteId', this.matomoId.toString()]);
      import(`${this.matomoURL}matomo.js`).then(function(){
        console.log("Loaded Matomo!");
        this.matomoTracker = Matomo.getTracker(`${this.matomoURL}matomo.php`, this.matomoId.toString());
      }.bind(this))
    }
  }

}
