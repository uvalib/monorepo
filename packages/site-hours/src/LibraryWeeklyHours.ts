import { html, LitElement, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import { SiteStyle } from '@uvalib/site-style';
import '@uvalib/site-components/site-button.js';
import { LibrariesData, Library } from '@uvalib/data-wrap';

export class LibraryWeeklyHours extends SiteStyle {
  
  // A `week-count` of 0 is default and means 'this week', 1 is next week and -1 is last week.
  @property({type:Number, attribute:"week-count", reflect: true}) weekCount = 0;

  @property({type:String, attribute:"library-slug"}) librarySlug?:string;

  @property({type:Object}) weekStart?:Date;

  @property({type:Object}) weekEnd?:Date;

  @property({type:Object}) library?:Library;

  librariesData:LibrariesData;

  constructor(){
    super();
    this.librariesData = new LibrariesData();
    this.setSelectedWeek();
  }

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

  protected getHours() {
    if ( this.library && this.librariesData ) {
      const ids = this.library.getHoursCalIds()
      this.librariesData.fetchHours(this.weekStart,6,ids).then(()=>{
        this.requestUpdate();
      })
    }
  }

  protected getLibraryData() {
    if (this.librarySlug) {
      console.log("get data!")
      this.librariesData.getLibrary(this.librarySlug,true).then(lib=>{
        if (lib) {
          this.library = lib;
          this.getHours();
        }
      })
    }
  }

  render() {
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
        <site-button @click="${ ()=>this.weekCount-- }">Previous week</site-button>
        <div class="heading-h${this.headingLevelStart}" role="heading" aria-level="${this.headingLevelStart}">
          ${this.dateFormat(this.weekStart)} - ${this.dateFormat(this.weekEnd)}
        </div>
        <site-button @click="${ ()=>this.weekCount++ }">Next week</site-button>
      </div>
      <table ?hidden="${!this.librarySlug}" class="weekly-hours-body-section">
        <thead>
          <tr>
            <th colspan="2" scope="col"><span class="visually-hidden">Day</span></th>
            ${(this.library && this.library.hours && this.library.hours.rawDates)? Object.entries(this.library.hours.rawDates).map(([k,v])=>html`
              <th scope="col" aria-current="false" aria-label="${ this.stringDateFormat(k,0) }">
                <div class="date-header">
                  <span class="date-header-month">${ this.stringDateFormat(k,1) }</span>
                  <span class="date-header-day">${ this.stringDateFormat(k,2) }</span>
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
                <td aria-label="2pm to 8pm">${ this.printTimes(v) }</td>
              `):""}
            </tr>          
          `:''}

          ${(this.library && this.library.children )? this.library.children.map(l=>html`
            <tr>
              <th scope="row" colspan="2" aria-label="${l.title}"><a class="css-20nh0y" href="/locations-and-hours/hatcher-library/ask-librarian-desk">${l.title}</a></th>
              ${(l.hours && l.hours.rawDates)? Object.entries(l.hours.rawDates).map(([k,v])=>html`
                <td aria-label="2pm to 8pm">${ this.printTimes(v) }</td>
              `):""}
            </tr>          
          `):""}
        </tbody>
      </table>

    `;
  }

  protected printTimes(day: any){
    if (day.hours) {
      return day.hours.map((h: { from: string; to: string; })=>html`
        ${h.from} - ${h.to}
      `);
    } 
    if (day.status) {
      return day.status.replace('24hours', '24 Hours');
    }
    return "";
  }

  protected stringDateFormat(dateString:string, format:number){
    const dateObj = new Date(dateString);
    const formats: Intl.DateTimeFormatOptions[] = [
      { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' },
      { month: 'short', day: 'numeric', timeZone: 'UTC' },
      { weekday: 'long', timeZone: 'UTC' }
    ]
    return dateObj.toLocaleDateString('en-US', formats[format]);
  }

  protected dateFormat(date:Date = new Date(), long:boolean = false){
    const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(date);
    return formattedDate.replace(',', '.');
  }

  setSelectedWeek() {
    const start = this.getCurrentWeekStart();
    start.setDate( start.getDate() + this.weekCount*7 );
    this.weekStart = start;
    const end = new Date(this.weekStart);
    end.setDate( end.getDate() + 6 );
    this.weekEnd = end;
  }

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
