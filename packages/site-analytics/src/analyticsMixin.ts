import { LitElement } from 'lit';

type Constructor<T = {}> = new (...args: any[]) => T;

export const SiteAnalyticsMixin = (superClass: Constructor<LitElement>): Constructor<LitElement> => {
    class SiteAnalyticsMixinClass extends superClass {
        /**
         * Dispatches a custom event for analytics tracking.
         * @param events - Array of events to be logged.
         * @param eventTarget - Optional target for the event dispatch.
         */
        analyticsEvent(events: any[], eventTarget: EventTarget | null = null) {
            const target = eventTarget as this || this;
            target.dispatchEvent(new CustomEvent("site-analytics-event", {
                detail: { event: events },
                bubbles: true,
                composed: true
            }));
        }

        /**
         * Dispatches a custom event for search analytics tracking.
         * @param query - The search query string.
         * @param category - Optional search category.
         * @param count - Optional result count.
         * @param eventTarget - Optional target for the event dispatch.
         */
        analyticsSearch(query: string, category: string | null = null, count: number | null = null, eventTarget: EventTarget | null = null) {
            const target = eventTarget as this || this;        
            target.dispatchEvent(new CustomEvent("site-analytics-search", {
                detail: { searchQuery: query, searchCategory: category, resultCount: count },
                bubbles: true,
                composed: true
            }));
        }
    }

    return SiteAnalyticsMixinClass;
};
