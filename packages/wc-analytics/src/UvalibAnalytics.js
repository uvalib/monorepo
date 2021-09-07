import { html, css, LitElement } from 'lit';

export class UvalibAnalytics extends LitElement {

  static get properties() {
    return {
      matomoURL: { type: String },
      matomoId: { type: Number },
    };
  }

  constructor() {
    super();
    this.matomoURL = "https://analytics.lib.virginia.edu/";
  }

  firstUpdated() {
    this._initMatomo();
    document.addEventListener("uvalib-analytics-search", this._logSearch.bind(this));
    document.addEventListener("uvalib-analytics-event", this._logEvent.bind(this));
    document.addEventListener("uvalib-analytics-pageview", this._logPageView.bind(this));
  }

  _logPageView(e) {
    let customTitle = e.detail? e.detail.customTitle:null;
    console.info(`Page view: ${customTitle}`);
    if (this.matomoTracker) this.matomoTracker.trackPageView(customTitle);
  }

  _logSearch(e) {
    console.info(`Search event: ${e.detail.searchQuery} ${e.detail.searchCategory} ${e.detail.resultCount}`);
    if (this.matomoTracker) this.matomoTracker.trackSiteSearch(e.detail.searchQuery, e.detail.searchCategory, e.detail.resultCount); 
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
      import(`${this.matomoURL}matomo.js`).then(function(){
        console.log("Loaded Matomo!");
        this.matomoTracker = Matomo.getTracker(`${this.matomoURL}matomo.php`, this.matomoId.toString());
      }.bind(this))
    }
  }

}
