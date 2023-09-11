import { LitElement } from 'lit';

type Constructor<T = {}> = new (...args: any[]) => T;

export const SiteAnalyticsMixin = (superClass: Constructor<LitElement>): Constructor<LitElement> => {
    class SiteAnalyticsMixinClass extends superClass {
        analyticsEvent(events: any[], eventTarget: EventTarget | null = null) {
            let target = eventTarget as this || this;
            target.dispatchEvent(new CustomEvent("site-analytics-event", {
                detail: {event:events}, bubbles: true, composed: true
            }));
        }
        analyticsSearch(query: string, category: string | null = null, count: number | null = null, eventTarget: EventTarget | null = null) {
            let target = eventTarget as this || this;        
            target.dispatchEvent(new CustomEvent("site-analytics-search", {
                detail: {searchQuery:query, searchCategory:category, resultCount:count}, bubbles: true, composed: true
            }));
        }
    }

    return SiteAnalyticsMixinClass;
};
