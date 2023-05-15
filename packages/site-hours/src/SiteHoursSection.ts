
/* eslint-disable no-nested-ternary */
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { SiteStyle } from '@uvalib/site-style';
import { LibrariesData, Library } from '@uvalib/data-wrap';
import { Hours } from '@uvalib/data-wrap/dist/src/Hours';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { printTimesForLibrary, sortLibraries } from './utils';

// Main class for SiteHoursSection
export class SiteHoursSection extends SiteStyle {

  // Formatted date property
  @property({type:String}) formattedDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/New_York' }).format( new Date() );

  // Place type property
  @property({type:String, attribute:"place-type"}) placeType = null;

  // limited property flags
  @property({type:Boolean}) limited = false;

  // Libraries array property
  @property({type:Array}) libraries: Library[] = [];

  // Class constructor, initializes libraries data
  constructor() {
    super();
    const libraries = new LibrariesData();
    this.initializeLibrariesData(libraries).catch(error => {
      console.error("Error initializing libraries data:", error);
    });
  }
  
  // Initialize libraries data and fetch hours
  async initializeLibrariesData(libraries: LibrariesData) {
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
    } catch (error) {
      console.error("Error fetching data or hours:", error);
    }
  }

  // Print raw dates
  private _printRawDates(lib:Library){
    return printTimesForLibrary(lib);
  }

  // Render method for the component
  render() {
    return html`
      <div class="home-hours-block">
        <div id="homehoursdate" class="home-hour-date">${this.formattedDate}</div>
        <h3 class="hour-head">Today's hours</h3>
        <dl class="dl--inline hours-locations">
          ${this.libraries.map(lib=>html`
            <dt class="location">${lib.shortTitle? lib.shortTitle:lib.title}</dt>
            <dd class="hours">${lib.hours? 
              lib.hours.rawDates? 
                this._printRawDates(lib)
                :html`
              
                `
            :lib.siteLink && lib.siteLink.uri? html`
                <a href="${lib.siteLink.uri}">See site</a>
              `:lib.hoursInformation?
                unsafeHTML(lib.hoursInformation.processed):
                html`
                  Something went wrong!
                `}</dd>
          `)}
        </dl>
        <p class="hours-see-all"><a href="/hours">See all hours and locations</a></p>
      </div>
    `;
  }
}