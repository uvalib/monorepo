import { html, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import { SiteStyle } from '@uvalib/site-style';
import { LibrariesData, Library } from '@uvalib/data-wrap';
import { printTimes, stringDateFormat } from './utils';

// Main class for LibraryBaseHours
export class LibraryBaseHours extends SiteStyle {

  @property({type: String, attribute: "mode"}) mode: 'daily' | 'weekly' = 'weekly';

  // A `week-count` of 0 is default and means 'this week', 1 is next week and -1 is last week.
  // Reflect property changes to attribute
  @property({type:Number, attribute:"week-count", reflect: true}) weekCount = 0;

  // Library slug property
  @property({type:String, attribute:"library-slug"}) librarySlug?:string;

  @property({type:Number, attribute:"refresh-every"}) refreshEvery = 1000*60*10;

  // Week start and end date properties
  @property({type:Object}) weekStart?:Date;
  @property({type:Object}) weekEnd?:Date;

  // Library object property
  @property({type:Object}) library?:Library;

  @property({type:String}) todayString:string;
  @property({type:String}) todayTimeString:string;

  // Loading state property
  @property({type: Boolean}) loading = false;

  private intervalId: number | undefined;

  // Loading counter
  private _loadingCount = 0;

  // LibrariesData instance
  librariesData:LibrariesData;

  // Class constructor, initializes librariesData and sets selected week
  constructor(){
    super();
    // Calculate today's date (and recalculate it every 10 minutes)
    let today = new Date();
    this.todayString = today.toISOString().split('T')[0];
    this.todayTimeString = today.getTime().toString();
    this.librariesData = new LibrariesData();
  }

  firstUpdated(){
    console.log(this.refreshEvery);
    this.intervalId = window.setInterval(()=>{
      console.log("refreshing today")
      let today = new Date();
      this.todayString = today.toISOString().split('T')[0];
      this.todayTimeString = today.getTime().toString();
    }, this.refreshEvery );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  // Triggered every time a property changes
  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if ( _changedProperties.has('weekCount') || _changedProperties.has('mode') || _changedProperties.has('todayString') ) {
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
      this._loadingCount++;
      this.loading = true;
      const ids = this.library.getHoursCalIds();
      try {
        if (this.mode === 'weekly') {
          await this.librariesData.fetchHours(this.weekStart, 6, ids);
        } else {
          // For daily mode, fetch hours for today only
          await this.librariesData.fetchHours(this.weekStart, 2, ids);
        }
        this.requestUpdate();
      } catch (error) {
        console.error("Error fetching hours:", error);
      } finally {
        this._loadingCount--;
        this.loading = this._loadingCount > 0;
      }
    }
  }

  // Fetch library data based on library slug
  protected async getLibraryData() {
    if (this.librarySlug) {
      this._loadingCount++;
      this.loading = true;
      try {
        const lib = await this.librariesData.getLibrary(this.librarySlug, true);
        if (lib) {
          this.library = lib;
          await this.getHours();
        }
      } catch (error) {
        console.error("Error fetching library data:", error);
      } finally {
        this._loadingCount--;
        this.loading = this._loadingCount > 0;
      }
    }
  }

  protected isOpen(rawDates: any, now: any = new Date()): boolean {
    const timeZone = 'America/New_York';
  
    // Convert 'now' to New York timezone
    let currentDate = new Date(now.toLocaleString('en-US', { timeZone: timeZone }));
  
    // Format currentDate to match the rawDates keys
    const dateString = currentDate.toISOString().split('T')[0];
  
    console.log(`Current time (NY timezone): ${currentDate}`);
  
    // Check if the current date's information is available
    const todayInfo = rawDates[dateString];
    if (!todayInfo) {
      console.log('No information available for today.');
      return false; // Library info for the current date is not available
    }
  
    // Check if the library is open 24 hours
    if (todayInfo.status === '24hours') {
      console.log('Library is open 24 hours today.');
      return true;
    }
  
    // If the library has open hours, check against them
    if (todayInfo.status === 'open' && todayInfo.hours) {
      for (const hours of todayInfo.hours) {
        // Format the time strings to a recognized format (e.g., "10:00 AM")
        const formattedFromTime = hours.from.replace(/(am|pm)/, ' $1').toUpperCase();
        const formattedToTime = hours.to.replace(/(am|pm)/, ' $1').toUpperCase();
  
        let from = new Date(`${dateString} ${formattedFromTime}`);
        let to = new Date(`${dateString} ${formattedToTime}`);
  
        console.log(`Checking hours: from ${from} to ${to}`);
  
        // If closing time is after midnight (e.g., '2:00am'), adjust 'to' to the next day
        if (to.getHours() < from.getHours()) {
          to.setDate(to.getDate() + 1);
          console.log(`Adjusted 'to' time for after midnight: ${to}`);
        }
  
        // Check if the current time is within the hours interval
        if (currentDate >= from && currentDate <= to) {
          console.log('Library is currently open.');
          return true; // Currently within open hours
        }
      }
      console.log('Library is currently closed.');
    } else {
      console.log('Library status is not "open" or no hours provided.');
    }
  
    return false; // Not open 24 hours and not within any specified hours range
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
    if (this.mode === 'weekly') {
      start.setDate(start.getDate() + this.weekCount * 7);
      this.weekStart = start;
      const end = new Date(this.weekStart);
      end.setDate(end.getDate() + 6);
      this.weekEnd = end;
    } else {
      let start = new Date();
      start.setDate(start.getDate() - 1); // Set start to yesterday
      let end = new Date();
      end.setDate(end.getDate() + 1); // Set end to tomorrow
      this.weekEnd = end;
      this.weekStart = start;
    }
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
