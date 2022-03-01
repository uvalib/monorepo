import { html, css, LitElement } from 'lit';

export class UvalibAnalytics extends LitElement {

  static get properties() {
    return {
      matomoURL: { type: String },
      matomoId: { type: Number },
      spa: { type: Boolean },
      variables: { type: Object }
    };
  }

  constructor() {
    super();
    this.matomoURL = "https://analytics.lib.virginia.edu/";
    this.spa = false;
    this.variables = null;
  }

  firstUpdated() {
    this._initMatomo();
    document.addEventListener("uvalib-analytics-search", this._logSearch.bind(this));
    document.addEventListener("uvalib-analytics-event", this._logEvent.bind(this));
    document.addEventListener("uvalib-analytics-pageview", this._logPageView.bind(this));
  }

  _logPageView(e) {
    if (this.matomoTracker) {
      let customTitle = e.detail? 
        e.detail.customTitle:
        document.querySelector('title').text;
      let referrer = e.detail && e.detail.referrer? 
        e.detail.referrer.indexOf('http')>-1?
          e.detail.referrer:
          document.location.origin+e.detail.referrer:
        document.referrer;
      this.matomoTracker.setDocumentTitle(customTitle);
      this.matomoTracker.setReferrerUrl(referrer);
      this.matomoTracker.trackPageView(customTitle);
    }
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
      if ( this.variables ) {
        Object.keys(this.variables).forEach(key=>{
          _paq.push(['setCustomDimension', key, this.variables[key]]);
          console.info(`Defined Dimension ${key}`);
        });
      }


      this._matomoTracker = document.createElement('script');
      this._matomoTracker.setAttribute('src', `${this.matomoURL}matomo.js`);
      document.head.appendChild(this._matomoTracker);
      this._getTracker(1000);
    }
  }

  _getTracker(timeout) {
    if ( window.Matomo ) {
      console.log("Loaded Matomo!");
      this.matomoTracker = window.Matomo.getTracker(`${this.matomoURL}matomo.php`, this.matomoId.toString());
    } else {
      setTimeout(function(){this._getTracker(timeout+1000)}.bind(this), timeout);
    }
  }

}
