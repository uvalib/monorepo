/* eslint-disable no-nested-ternary */
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { SiteStyle } from '@uvalib/site-style';
import { LibrariesData, Library } from '@uvalib/data-wrap';
import { Hours } from '@uvalib/data-wrap/dist/src/Hours';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { printTimesForLibrary } from './utils';

/**
 * Function to sort libraries based on priorityPlacement and title.
 * Libraries with defined priorityPlacement come first, sorted by the value.
 * Libraries without priorityPlacement come later and are sorted by their title.
 */
function sortLibraries(libs: Library[]) {
  return libs.sort((a, b) => {
    if (a.priorityPlacement && b.priorityPlacement) {
      // Check if both titles are defined before comparing
      if (a.title && b.title) {
        return a.priorityPlacement - b.priorityPlacement || a.title.localeCompare(b.title);
      }
      return a.priorityPlacement - b.priorityPlacement;
    }
    if (a.priorityPlacement && !b.priorityPlacement) {
      return -1;
    }
    if (!a.priorityPlacement && b.priorityPlacement) {
      return 1;
    }
    // Check if both titles are defined before comparing
    if (a.title && b.title) {
      return a.title.localeCompare(b.title);
    }
    return 0; // If titles are not defined, consider them equal
  });
}


/**
 * SiteHoursSection class represents a component that displays the hours of various locations.
 * It extends the SiteStyle class to inherit styling functionalities.
 */
export class SiteHoursSection extends SiteStyle {
  
  // The current date formatted for display
  @property({type:String}) formattedDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/New_York' }).format( new Date() );
  
  // Type of place (like 'Library', 'Cafe', etc.) to filter libraries
  @property({type:String, attribute:"place-type"}) placeType = null;
  
  // Flag to filter libraries based on priorityPlacement 
  @property({type:Boolean}) limited = false;
  
  // List of libraries fetched and processed
  @property({type:Array}) libraries: Library[] = [];

  // Constructor initializes data fetching
  constructor() {
    super();
    const libraries = new LibrariesData();
    this.initializeLibrariesData(libraries).catch(error => {
      console.error("Error initializing libraries data:", error);
    });
  }
  
  /**
   * Fetch libraries data, filter based on specified criteria, and then sort.
   */
  async initializeLibrariesData(libraries: LibrariesData) {
    try {
      await libraries.fetchData();
      await libraries.fetchHours();

      console.log(libraries.items);
      this.libraries = sortLibraries(libraries.items
        .filter(lib => this.placeType ? lib.placeType === this.placeType : true)
        .filter(lib => this.limited ? lib.priorityPlacement && lib.priorityPlacement > 0 : true));
      console.log(this.libraries);

      // Dispatch custom events to notify other components or listeners
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

  // Helper function to format raw date-times for a library
  private _printRawDates(lib:Library){
    return printTimesForLibrary(lib);
  }

  // Component render function to define its HTML structure
  render() {
    return html`
      <div class="home-hours-block">
        <div id="homehoursdate" class="home-hour-date">${this.formattedDate}</div>
        <h3 class="hour-head">Today's hours</h3>
        <dl class="dl--inline hours-locations">
          ${this.libraries.map(lib => html`
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
