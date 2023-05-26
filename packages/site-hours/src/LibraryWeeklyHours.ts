import { html, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import { SiteStyle } from '@uvalib/site-style';
import { LibrariesData, Library } from '@uvalib/data-wrap';
import { printTimes, stringDateFormat } from './utils';

// Main class for LibraryWeeklyHours
export class LibraryWeeklyHours extends SiteStyle {

  // A `week-count` of 0 is default and means 'this week', 1 is next week and -1 is last week.
  // Reflect property changes to attribute
  @property({type:Number, attribute:"week-count", reflect: true}) weekCount = 0;

  // Library slug property
  @property({type:String, attribute:"library-slug"}) librarySlug?:string;

  // Week start and end date properties
  @property({type:Object}) weekStart?:Date;
  @property({type:Object}) weekEnd?:Date;

  // Library object property
  @property({type:Object}) library?:Library;

  // LibrariesData instance
  librariesData:LibrariesData;

  // Class constructor, initializes librariesData and sets selected week
  constructor(){
    super();
    this.librariesData = new LibrariesData();
    this.setSelectedWeek();
  }

  // Triggered every time a property changes
  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if ( _changedProperties.has('weekCount') ) {
      this.setSelectedWeek();
    }
    if ( _changedProperties.has('librarySlug') ) {
      this.getLibraryData();
    }
    if ( _changedProperties.has('weekStart') ) {
      this.getHours();
    }
  }

  // Fetch library hours based on week start
  protected async getHours() {
    if (this.library && this.librariesData) {
      const ids = this.library.getHoursCalIds();
      try {
        await this.librariesData.fetchHours(this.weekStart,6,ids);
        this.requestUpdate();
      } catch (error) {
        console.error("Error fetching hours:", error);
      }
    }
  }

  // Fetch library data based on library slug
  protected async getLibraryData() {
    if (this.librarySlug) {
      try {
        const lib = await this.librariesData.getLibrary(this.librarySlug, true);
        if (lib) {
          this.library = lib;
          this.getHours();
        }
      } catch (error) {
        console.error("Error fetching library data:", error);
      }
    }
  }

  // Render method for the component
  render() {
    // Calculate today's date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    return html`
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
        <button class="uvalib-button uvalib-button--basic" @click="${ ()=>this.weekCount-- }">Previous week</button>
        <div class="heading-h${this.headingLevelStart}" role="heading" aria-level="${this.headingLevelStart}">
          ${this.dateFormat(this.weekStart)} - ${this.dateFormat(this.weekEnd)}
        </div>
        <button class="uvalib-button uvalib-button--basic" @click="${ ()=>this.weekCount++ }">Next week</button>
      </div>
      <table ?hidden="${!this.librarySlug}" class="weekly-hours-body-section">
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
        <thead>
          <tr>
            <th colspan="2" scope="col"><span class="visually-hidden">Day</span></th>
            ${(this.library && this.library.hours && this.library.hours.rawDates)? Object.entries(this.library.hours.rawDates).map(([k,v])=>html`
              <th scope="col" aria-current="false" aria-label="${ this.stringDateFormat(k,0) }">
                <div class="date-header">
                  <span class="date-header-day">${ this.stringDateFormat(k,2) }</span>,
                  <span class="date-header-month">${ this.stringDateFormat(k,1) }</span>
                </div>
              </th>            
            `):""}
            ${(this.library && Array.isArray(this.library.children) && this.library.children.length>0 && this.library.children[0].hours && this.library.children[0].hours.rawDates)? Object.entries(this.library.children[0].hours.rawDates).map(([k,v])=>html`
              <th scope="col" aria-current="false" aria-label="${ this.stringDateFormat(k,0) }" class="${k === todayString ? 'today' : ''}">
                <div class="date-header">
                  <span class="date-header-day">${ this.stringDateFormat(k,2) }</span>,
                  <span class="date-header-month">${ this.stringDateFormat(k,1) }</span>
                </div>
              </th>            
            `):""}
          </tr>
        </thead>
        <tbody>
          ${(this.library && this.library.hours )? html`
            <tr>
              <th scope="row" colspan="2" aria-label="Building hours">Building hours</th>
              ${(this.library && this.library.hours && this.library.hours.rawDates)? Object.entries(this.library.hours.rawDates).map(([k,v])=>html`
                <td aria-label="${ this.printTimes(v) }" class="${k === todayString ? 'today' : ''}">
                  <span class="date-header-day">${ this.stringDateFormat(k,2) }</span>,
                  <span class="date-header-month">${ this.stringDateFormat(k,1) }</span>
                  ${ this.printTimes(v) }
                </td>
              `):""}
            </tr>          
          `:''}

          ${(this.library && this.library.children )? this.library.children.map(l=>html`
            <tr>
              <th scope="row" colspan="2" aria-label="${l.title}"><a class="css-20nh0y" href="/locations-and-hours/hatcher-library/ask-librarian-desk">${l.title}</a></th>
              ${(l.hours && l.hours.rawDates)? Object.entries(l.hours.rawDates).map(([k,v])=>html`
                <td aria-label="${ this.printTimes(v) }" class="${k === todayString ? 'today' : ''}">
                  <span class="date-header-day">${ this.stringDateFormat(k,2) }</span>,
                  <span class="date-header-month">${ this.stringDateFormat(k,1) }</span>
                  ${ this.printTimes(v) }
                </td>
              `):""}
              ${(l.hours && l.hours.rawDates && l.hours.rawDates.length < 7)? Array.apply(null, Array(7-l.hours.rawDates.length)).map(()=>html`<td></td>`):""}

            </tr>          
          `):""}
        </tbody>
      </table>

    `;
  }

  // Helper function to print times
  protected printTimes(day: any){
    return printTimes(day);
  }
  
  // Helper function for string date format
  protected stringDateFormat(dateString:string, format:number){
    return stringDateFormat(dateString, format);
  }

  // Helper function for date format
  protected dateFormat(date:Date = new Date(), long:boolean = false){
    const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(date);
    return formattedDate.replace(',', '.');
  }

  // Set selected week based on weekCount
  setSelectedWeek() {
    const start = this.getCurrentWeekStart();
    start.setDate( start.getDate() + this.weekCount*7 );
    this.weekStart = start;
    const end = new Date(this.weekStart);
    end.setDate( end.getDate() + 6 );
    this.weekEnd = end;
  }

  // Get the start of the current week, defaults to today's date
  getCurrentWeekStart(today:Date = new Date()) {

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
