import { _ as __decorate, a as __classPrivateFieldSet, b as __classPrivateFieldGet, x, e } from './query-assigned-elements-66a11629.js';
import './ArticlesData-9f3aa85f.js';
import { E as EventsData } from './EventsData-8792be9b.js';
import { B as BentoSection } from './BentoSection-4119efbf.js';
import './GeneralSearchResult-835c7dd8.js';
import './unsafe-html-ce449b42.js';
import './SiteStyle-5d4bc111.js';

var _EventsSection_eventsData;
class EventsSection extends BentoSection {
    constructor() {
        super();
        this.items = [];
        _EventsSection_eventsData.set(this, void 0);
        this.title = "";
        __classPrivateFieldSet(this, _EventsSection_eventsData, new EventsData(), "f");
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        if (_changedProperties.has('query') || _changedProperties.has('limit') || _changedProperties.has('category')) {
            this.loading = true;
            __classPrivateFieldGet(this, _EventsSection_eventsData, "f").query = this.query;
            __classPrivateFieldGet(this, _EventsSection_eventsData, "f").limit = this.limit;
            __classPrivateFieldGet(this, _EventsSection_eventsData, "f").category = this.category;
            __classPrivateFieldGet(this, _EventsSection_eventsData, "f").fetchData().then(results => {
                this.items = results.items;
                this.loading = false;
            });
        }
    }
    static formatDate(day) {
        return x `
        <span id="homehoursMonth" class="event--month">${new Intl.DateTimeFormat('en-US', { month: "short", timeZone: 'America/New_York' }).format(day)}</span>
        <span id="homehoursDay" class="event--day">${new Intl.DateTimeFormat('en-US', { day: "numeric", timeZone: 'America/New_York' }).format(day)}</span>
        <span id="homehoursWeekDay" class="event--wkday">${new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/New_York' }).format(day)}</span>      
    `;
    }
    static isSameDay(date1, date2) {
        return (date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate());
    }
    static dateRange(_start, _end) {
        const start = _start ? new Date(_start) : new Date();
        const end = _end ? new Date(_end) : new Date();
        if (EventsSection.isSameDay(start, end))
            return EventsSection.formatDate(start);
        return x `${EventsSection.formatDate(start)} - ${EventsSection.formatDate(end)}`;
    }
    static timeRange(_start, _end) {
        return `${new Intl.DateTimeFormat('en-US', { hour: "numeric", minute: "2-digit", timeZone: 'America/New_York' }).format(_start)} - ${new Intl.DateTimeFormat('en-US', { hour: "numeric", minute: "2-digit", timeZoneName: "short", timeZone: 'America/New_York' }).format(_end)}`;
    }
    render() {
        return x `
${this.title ? x `<h2>${this.limitTitle(this.title)}</h2>` : ''}
<div class="event-container">
  ${this.loading ? x `<site-spinner></site-spinner>` : ''}
  ${this.items.map((event) => x `
    <div class="event">
      <a href="${event.link}" class="event-url">
        <h4 class="event-title">${this.limitTitle(event.title)}</h4>
        <p class="event-date">${EventsSection.dateRange(event.start, event.end)}</p>
        <p class="event-time">${EventsSection.timeRange(event.start, event.end)}</p>
      </a>
    </div>  
  `)}
  <slot name="see-more"></slot>
</div>  
      
    `;
    }
}
_EventsSection_eventsData = new WeakMap();
__decorate([
    e({ type: String })
], EventsSection.prototype, "category", void 0);
__decorate([
    e({ type: Array })
], EventsSection.prototype, "items", void 0);

window.customElements.define('events-section', EventsSection);
