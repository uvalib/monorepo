import { LitElement } from 'lit';

type Constructor<T = {}> = new (...args: any[]) => T;

// Define the interface for the mixin
export interface ISiteAnalyticsMixin {
    analyticsEvent(events: any[], eventTarget?: EventTarget | null): void;
    analyticsSearch(query: string, category?: string | null, count?: number | null, eventTarget?: EventTarget | null): void;
}

export const SiteAnalyticsMixin = <T extends Constructor<LitElement>>(superClass: T) => {

  class SiteAnalyticsMixinClass extends (superClass as Constructor<HTMLElement & LitElement>) implements ISiteAnalyticsMixin {  
//  class SiteAnalyticsMixinClass extends superClass implements ISiteAnalyticsMixin {
    analyticsEvent(events: any[], eventTarget: EventTarget | null = null) {
        const target = eventTarget as this || this;
        target.dispatchEvent(new CustomEvent("site-analytics-event", {
            detail: { event: events },
            bubbles: true,
            composed: true
        }));
    }

    analyticsSearch(query: string, category: string | null = null, count: number | null = null, eventTarget: EventTarget | null = null) {
        const target = eventTarget as this || this;        
        target.dispatchEvent(new CustomEvent("site-analytics-search", {
            detail: { searchQuery: query, searchCategory: category, resultCount: count },
            bubbles: true,
            composed: true
        }));
    }
  }

  // Cast return type to your mixin's interface intersected with the superClass type
//  return SiteAnalyticsMixinClass as Constructor<ISiteAnalyticsMixin> & T;
  return SiteAnalyticsMixinClass as unknown as T & Constructor<ISiteAnalyticsMixin & LitElement>;

}
