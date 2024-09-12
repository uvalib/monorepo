import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import Sites from '@uvalib/webSiteInfo/listing.js';

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
  event: any[];
}

export class SiteAnalytics extends LitElement {
  static styles = css`
    :host {
      display: none;
    }
  `;

  @property({ type: String }) matomoURL: string = "https://analytics.lib.virginia.edu/";
  @property({ type: Number }) matomoId?: number;
  @property({ type: Boolean }) spa: boolean = false;
  @property({ type: Object }) variables: any = null;

  private matomoTracker?: any;

  firstUpdated() {
    // If matomoId is not provided, find the correct one based on the current URL
    if (!this.matomoId) {
      this.matomoId = this.getMatomoIdFromCurrentUrl();
    }
    
    this.initMatomo();

    // Add event listeners
    document.addEventListener("site-analytics-search", this.logSearch.bind(this) as EventListener);
    document.addEventListener("site-analytics-event", this.logEvent.bind(this) as EventListener);
    document.addEventListener("site-analytics-pageview", this.logPageView.bind(this) as EventListener);
  }

  private getMatomoIdFromCurrentUrl(): number | undefined {
    const currentUrl = window.location.href;

    // Find the matching site based on the current URL
    const matchedSite = Sites.find(site =>
      site.urls?.some(url => currentUrl.startsWith(url))
    );

    // If no match is found, use the "matomoDefault" site's ID
    const defaultSite = Sites.find(site => site.matomoDefault === true);

    return matchedSite?.matomoSiteId || defaultSite?.matomoSiteId;
  }

  private logPageView(e: CustomEvent<PageViewDetail>) {
    if (!this.matomoTracker) return;

    const customTitle = e.detail?.customTitle || document.querySelector('title')?.text || "";
    const referrer = e.detail?.referrer?.startsWith('http') ? e.detail.referrer : document.location.origin + (e.detail?.referrer || document.referrer);

    this.matomoTracker.setDocumentTitle(customTitle);
    this.matomoTracker.setReferrerUrl(referrer);
    this.matomoTracker.trackPageView(customTitle);
  }

  private logSearch(e: CustomEvent<SearchDetail>) {
    if (this.matomoTracker) {
      this.matomoTracker.trackSiteSearch(e.detail.searchQuery, e.detail.searchCategory, e.detail.resultCount.toString());
    }
  }

  private logEvent(e: CustomEvent<EventDetail>) {
    if (e.detail && Array.isArray(e.detail.event) && this.matomoTracker) {
      this.matomoTracker.trackEvent(...e.detail.event);
    }
  }

  private initMatomo() {
    if (!this.matomoId) return;

    const _paq: any[] = window._paq = window._paq || [];
    if (!this.spa) {
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
    }
    _paq.push(['setTrackerUrl', `${this.matomoURL}matomo.php`]);
    _paq.push(['setSiteId', this.matomoId.toString()]);

    if (this.variables) {
      for (const key in this.variables) {
        _paq.push(['setCustomDimension', key, this.variables[key]]);
      }
    }

    const scriptElement = document.createElement('script');
    scriptElement.src = `${this.matomoURL}matomo.js`;
    document.head.appendChild(scriptElement);

    this.getTracker(1000);
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
