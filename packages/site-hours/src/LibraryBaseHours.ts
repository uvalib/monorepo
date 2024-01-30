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
  
  private intervalId: number | undefined;

  // LibrariesData instance
  librariesData:LibrariesData;

  // Class constructor, initializes librariesData and sets selected week
  constructor(){
    super();

    // Calculate today's date (and recalculate it every 10 minutes)
    let today = new Date();
    this.todayString = today.toISOString().split('T')[0];

    this.intervalId = window.setInterval(()=>{
      today = new Date();
      this.todayString = today.toISOString().split('T')[0];
    }, this.refreshEvery );

    this.librariesData = new LibrariesData();
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
/*     
    if (this.library && this.weekStart) {
      const count = this.mode === 'weekly' ? 6 : 2;      
      return this.library.fetchHours(this.weekStart, count, true);
    }
*/    

    if (this.library && this.librariesData) {
//console.log(this.library)      
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
          await this.getHours();
        }
      } catch (error) {
        console.error("Error fetching library data:", error);
      }
    }
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
