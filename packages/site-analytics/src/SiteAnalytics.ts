import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

// Extend the global Window interface
declare global {
  interface Window {
    _paq: any[];
    Matomo: any;
  }
}

interface PageViewDetail {
  customTitle?: string;
  referrer?: string;
}

interface SearchDetail {
  searchQuery: string;
  searchCategory?: string;
  resultCount: number;
}

interface EventDetail {
  event: any[]; // This is based on the usage, but you might want to refine this type
}


export class SiteAnalytics extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  @property({ type: String }) matomoURL: string = "https://analytics.lib.virginia.edu/";
  @property({ type: Number }) matomoId?: number;
  @property({ type: Boolean }) spa: boolean = false;
  @property({ type: Object }) variables: any = null;

  private matomoTracker?: any;

  firstUpdated() {
    this.initMatomo();

    // Explicitly type the event listeners
    document.addEventListener("site-analytics-search", this.logSearch.bind(this) as EventListener);
    document.addEventListener("site-analytics-event", this.logEvent.bind(this) as EventListener);
    document.addEventListener("site-analytics-pageview", this.logPageView.bind(this) as EventListener);
  }

  private logPageView(e: CustomEvent<PageViewDetail>) {
    if (this.matomoTracker) {
      let customTitle = e.detail ? e.detail.customTitle : document.querySelector('title')?.text;
      let referrer = e.detail && e.detail.referrer ? 
        e.detail.referrer.indexOf('http') > -1 ? e.detail.referrer : document.location.origin + e.detail.referrer : document.referrer;
      this.matomoTracker.setDocumentTitle(customTitle || "");
      this.matomoTracker.setReferrerUrl(referrer);
      this.matomoTracker.trackPageView(customTitle || "");
    }
  }

  private logSearch(e: CustomEvent<SearchDetail>) {
    if (this.matomoTracker) this.matomoTracker.trackSiteSearch(e.detail.searchQuery, e.detail.searchCategory, e.detail.resultCount.toString());
  }

  private logEvent(e: CustomEvent<EventDetail>) {
    if (e.detail && Array.isArray(e.detail.event) && this.matomoTracker) {
      this.matomoTracker.trackEvent(...e.detail.event);
    }
  }

  private initMatomo() {
    if (this.matomoId) {
      const _paq: any[] = window._paq = window._paq || [];
      if (!this.spa) {
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
      }
      _paq.push(['setTrackerUrl', `${this.matomoURL}matomo.php`]);
      _paq.push(['setSiteId', this.matomoId.toString()]);
      if (this.variables) {
        Object.keys(this.variables).forEach(key => {
          _paq.push(['setCustomDimension', key, this.variables[key]]);
        });
      }

      const scriptElement = document.createElement('script');
      scriptElement.setAttribute('src', `${this.matomoURL}matomo.js`);
      document.head.appendChild(scriptElement);
      this.getTracker(1000);
    }
  }

  private getTracker(timeout: number) {
    if (window.Matomo) {
      this.matomoTracker = window.Matomo.getTracker(`${this.matomoURL}matomo.php`, this.matomoId!.toString());
    } else {
      setTimeout(() => this.getTracker(timeout + 1000), timeout);
    }
  }

  render() {
    return html``; // No visual representation, just the analytics logic
  }
}
