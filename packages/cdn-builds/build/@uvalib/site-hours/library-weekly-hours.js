import { _ as __decorate, y, e } from '../../query-assigned-elements-cb6980e1.js';
import { S as SiteStyle } from '../../SiteStyle-725ba497.js';
import '../../site-button-691e2763.js';
import '../../ArticlesData-40bc37f5.js';
import { a as LibrariesData } from '../../LibrariesData-25322609.js';
import { p as printTimes, s as stringDateFormat } from '../../utils-077f75dc.js';
import '../../SiteStyleMapping-b3f47ce3.js';
import '../../size-694374d3.js';
import '../../display-26e2ea35.js';
import '../../focus-7fe93afd.js';
import '../../match-media-stylesheet-behavior-5f2c3a3c.js';
import '../../apply-mixins-fa470210.js';
import '../../form-associated-179d4596.js';
import '../../aria-global-42249961.js';
import '../../GeneralSearchResult-835c7dd8.js';

// Main class for LibraryWeeklyHours
class LibraryWeeklyHours extends SiteStyle {
    // Class constructor, initializes librariesData and sets selected week
    constructor() {
        super();
        // A `week-count` of 0 is default and means 'this week', 1 is next week and -1 is last week.
        // Reflect property changes to attribute
        this.weekCount = 0;
        this.librariesData = new LibrariesData();
        this.setSelectedWeek();
    }
    // Triggered every time a property changes
    updated(_changedProperties) {
        if (_changedProperties.has('weekCount')) {
            this.setSelectedWeek();
        }
        if (_changedProperties.has('librarySlug')) {
            this.getLibraryData();
        }
        if (_changedProperties.has('weekStart')) {
            this.getHours();
        }
    }
    // Fetch library hours based on week start
    async getHours() {
        if (this.library && this.librariesData) {
            const ids = this.library.getHoursCalIds();
            try {
                await this.librariesData.fetchHours(this.weekStart, 6, ids);
                this.requestUpdate();
            }
            catch (error) {
                console.error("Error fetching hours:", error);
            }
        }
    }
    // Fetch library data based on library slug
    async getLibraryData() {
        if (this.librarySlug) {
            try {
                const lib = await this.librariesData.getLibrary(this.librarySlug, true);
                if (lib) {
                    this.library = lib;
                    this.getHours();
                }
            }
            catch (error) {
                console.error("Error fetching library data:", error);
            }
        }
    }
    // Render method for the component
    render() {
        return y `
      <style>
        :host, site-hours {
          display:block;
          width: 100%;
          min-height: 100vh;
        }
        [hidden] {
          display: none !important;
        }
        .weekly-hours-header-section {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          text-align: center;
        }
        div[role="heading"] {
          flex: 1;
        }
      </style>
      
      <div ?hidden="${!this.librarySlug}" class="weekly-hours-header-section">
        <site-button @click="${() => this.weekCount--}">Previous week</site-button>
        <div class="heading-h${this.headingLevelStart}" role="heading" aria-level="${this.headingLevelStart}">
          ${this.dateFormat(this.weekStart)} - ${this.dateFormat(this.weekEnd)}
        </div>
        <site-button @click="${() => this.weekCount++}">Next week</site-button>
      </div>
      <table ?hidden="${!this.librarySlug}" class="weekly-hours-body-section">
        <thead>
          <colgroup>
            <col class="location-column">
            <col>
            <col>
            <col>
            <col>
            <col>
            <col>
            <col>
          </colgroup>
          <tr>
            <th colspan="2" scope="col"><span class="visually-hidden">Day</span></th>
            ${(this.library && this.library.hours && this.library.hours.rawDates) ? Object.entries(this.library.hours.rawDates).map(([k, v]) => y `
              <th scope="col" aria-current="false" aria-label="${this.stringDateFormat(k, 0)}">
                <div class="date-header">
                  <span class="date-header-month">${this.stringDateFormat(k, 1)}</span>
                  <span class="date-header-day">${this.stringDateFormat(k, 2)}</span>
                </div>
              </th>            
            `) : ""}
          </tr>
        </thead>
        <tbody>
          ${(this.library && this.library.hours) ? y `
            <tr>
              <th scope="row" colspan="2" aria-label="Building hours">Building hours</th>
              ${(this.library && this.library.hours && this.library.hours.rawDates) ? Object.entries(this.library.hours.rawDates).map(([k, v]) => y `
                <td aria-label="2pm to 8pm">${this.printTimes(v)}</td>
              `) : ""}
            </tr>          
          ` : ''}

          ${(this.library && this.library.children) ? this.library.children.map(l => y `
            <tr>
              <th scope="row" colspan="2" aria-label="${l.title}"><a class="css-20nh0y" href="/locations-and-hours/hatcher-library/ask-librarian-desk">${l.title}</a></th>
              ${(l.hours && l.hours.rawDates) ? Object.entries(l.hours.rawDates).map(([k, v]) => y `
                <td aria-label="2pm to 8pm">${this.printTimes(v)}</td>
              `) : ""}
            </tr>          
          `) : ""}
        </tbody>
      </table>

    `;
    }
    // Helper function to print times
    printTimes(day) {
        return printTimes(day);
    }
    // Helper function for string date format
    stringDateFormat(dateString, format) {
        return stringDateFormat(dateString, format);
    }
    // Helper function for date format
    dateFormat(date = new Date(), long = false) {
        const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(date);
        return formattedDate.replace(',', '.');
    }
    // Set selected week based on weekCount
    setSelectedWeek() {
        const start = this.getCurrentWeekStart();
        start.setDate(start.getDate() + this.weekCount * 7);
        this.weekStart = start;
        const end = new Date(this.weekStart);
        end.setDate(end.getDate() + 6);
        this.weekEnd = end;
    }
    // Get the start of the current week, defaults to today's date
    getCurrentWeekStart(today = new Date()) {
        // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
        const currentDayOfWeek = today.getDay();
        // Calculate the number of days to subtract to get to last Sunday
        const daysToSubtract = currentDayOfWeek === 0 ? 0 : currentDayOfWeek;
        // Create a new date object for last Sunday or today if today is Sunday
        const lastSunday = new Date(today);
        lastSunday.setDate(today.getDate() - daysToSubtract);
        return lastSunday;
    }
}
__decorate([
    e({ type: Number, attribute: "week-count", reflect: true })
], LibraryWeeklyHours.prototype, "weekCount", void 0);
__decorate([
    e({ type: String, attribute: "library-slug" })
], LibraryWeeklyHours.prototype, "librarySlug", void 0);
__decorate([
    e({ type: Object })
], LibraryWeeklyHours.prototype, "weekStart", void 0);
__decorate([
    e({ type: Object })
], LibraryWeeklyHours.prototype, "weekEnd", void 0);
__decorate([
    e({ type: Object })
], LibraryWeeklyHours.prototype, "library", void 0);

window.customElements.define('library-weekly-hours', LibraryWeeklyHours);
