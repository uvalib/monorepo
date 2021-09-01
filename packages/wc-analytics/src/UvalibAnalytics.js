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
  }

  _logSearch(e) {
    console.log(`Search event: ${e.detail.searchQuery} ${e.detail.searchCategory} ${e.detail.resultCount}`);
    if (this.matomoTracker) this.matomoTracker.trackSiteSearch(e.detail.searchQuery, e.detail.searchCategory, e.detail.resultCount); 
  }

  _logEvent(e) {
    console.log(`Custom event: ${e.detail.event.join('--')}`);
    if (this.matomoTracker) this.matomoTracker.trackEvent(...e.detail.event);
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
