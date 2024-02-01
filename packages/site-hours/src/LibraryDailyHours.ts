import { html } from 'lit';
import { LibraryBaseHours } from './LibraryBaseHours';

// Main class for LibraryDailyHours
export class LibraryDailyHours extends LibraryBaseHours {

  constructor(){
    super();
    this.mode = 'daily';
  }

  protected updated(_changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(_changedProperties);
    if (_changedProperties.has('todayTimeString')) {
      this.requestUpdate();
    }
  }

  // Render method for the component
  render() {
    console.log(this.library);
    // Get today's date in New York timezone
    const date = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' });
    const [month, day, year] = date.split('/');
    const today = `${year}-${month}-${day}`;

    // Render the widget with the appropriate slots
    return html`
      <div class="daily-hours-widget">
        ${(this.library && this.library.hours )? html`
            <div class="daily-hours-listing">
              <span class="daily-hours-label">Building: </span>
              <span class="daily-hours">${(this.library && this.library.hours && this.library.hours.rawDates)? Object.entries(this.library.hours.rawDates).map(([k,v])=> k === today ? html`${ 
                this.printTimes(v) 
              }` : ""):""}</span>
            </div>          
        `:''}

        ${(this.library && this.library.children )? this.library.children.map(l=>html`
            <div class="daily-hours-listing">
              <span class="daily-hours-label">${l.title}:</span> 
              <span class="daily-hours">${(l.hours && l.hours.rawDates)? Object.entries(l.hours.rawDates).map(([k,v])=> k === today ? html`${ 
                  this.printTimes(v) 
                }`:""):""}</span>
            </div>          
        `):""}
      </div>
    `;
  }

}
