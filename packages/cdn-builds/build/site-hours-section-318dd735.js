import { _ as __decorate, x, e } from './query-assigned-elements-66a11629.js';
import { S as SiteStyle } from './SiteStyle-5d4bc111.js';
import './ArticlesData-9f3aa85f.js';
import { a as LibrariesData } from './LibrariesData-a59266c8.js';
import { o } from './unsafe-html-ce449b42.js';
import { a as sortLibraries, b as printTimesForLibrary } from './utils-d8868732.js';

// Main class for SiteHoursSection
class SiteHoursSection extends SiteStyle {
    // Class constructor, initializes libraries data
    constructor() {
        super();
        // Formatted date property
        this.formattedDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/New_York' }).format(new Date());
        // Place type property
        this.placeType = null;
        // limited property flags
        this.limited = false;
        // Libraries array property
        this.libraries = [];
        const libraries = new LibrariesData();
        this.initializeLibrariesData(libraries).catch(error => {
            console.error("Error initializing libraries data:", error);
        });
    }
    // Initialize libraries data and fetch hours
    async initializeLibrariesData(libraries) {
        try {
            await libraries.fetchData();
            await libraries.fetchHours();
            // Filter and sort libraries
            this.libraries = sortLibraries(libraries.items
                .filter(lib => this.placeType ? lib.placeType === this.placeType : true)
                .filter(lib => this.limited ? lib.placeType === 'Library' && lib.hours : true));
            // Dispatch custom events
            this.dispatchEvent(new CustomEvent('got-library-hours', {
                detail: { message: 'fetched hours for libraries' },
                bubbles: true,
                composed: true
            }));
            this.dispatchEvent(new CustomEvent('got-libraries', {
                detail: { message: 'fetched libraries' },
                bubbles: true,
                composed: true
            }));
        }
        catch (error) {
            console.error("Error fetching data or hours:", error);
        }
    }
    // Print raw dates
    _printRawDates(lib) {
        return printTimesForLibrary(lib);
    }
    // Render method for the component
    render() {
        return x `
      <div class="home-hours-block">
        <div id="homehoursdate" class="home-hour-date">${this.formattedDate}</div>
        <h3 class="hour-head">Today's hours</h3>
        <dl class="dl--inline hours-locations">
          ${this.libraries.map(lib => x `
            <dt class="location">${lib.shortTitle ? lib.shortTitle : lib.title}</dt>
            <dd class="hours">${lib.hours ?
            lib.hours.rawDates ?
                this._printRawDates(lib)
                : x `
              
                `
            : lib.siteLink && lib.siteLink.uri ? x `
                <a href="${lib.siteLink.uri}">See site</a>
              ` : lib.hoursInformation ?
                o(lib.hoursInformation.processed) :
                x `
                  Something went wrong!
                `}</dd>
          `)}
        </dl>
        <p class="hours-see-all"><a href="/hours">See all hours and locations</a></p>
      </div>
    `;
    }
}
__decorate([
    e({ type: String })
], SiteHoursSection.prototype, "formattedDate", void 0);
__decorate([
    e({ type: String, attribute: "place-type" })
], SiteHoursSection.prototype, "placeType", void 0);
__decorate([
    e({ type: Boolean })
], SiteHoursSection.prototype, "limited", void 0);
__decorate([
    e({ type: Array })
], SiteHoursSection.prototype, "libraries", void 0);

window.customElements.define('site-hours-section', SiteHoursSection);