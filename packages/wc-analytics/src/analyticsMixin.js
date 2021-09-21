export const UvalibAnalyticsMixin = (superClass) => class extends superClass {
    _analyticsEvent(events, eventTarget=null) {
        let target = eventTarget? eventTarget: this;
        target.dispatchEvent(new CustomEvent("uvalib-analytics-event", {
            detail: {event:events}, bubbles: true, composed: true
        }));
    }
    _analyticsSearch(query, category=null, count=null, eventTarget=null) {
        let target = eventTarget? eventTarget: this;        
        target.dispatchEvent(new CustomEvent("uvalib-analytics-search", {
            detail: {searchQuery:query, searchCategory:category, resultCount:count}, bubbles: true, composed: true
        }));
    }
};