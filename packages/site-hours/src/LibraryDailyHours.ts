import { html } from 'lit';
import { LibraryBaseHours } from './LibraryBaseHours';

// Main class for LibraryDailyHours
export class LibraryDailyHours extends LibraryBaseHours {

  constructor(){
    super();
    this.mode = 'daily';
  }

  // Render method for the component
  render() {

    // Render the widget with the appropriate slots
    return html`
      <div class="daily-hours-widget">
        ${(this.library && this.library.hours )? html`
            <div class="daily-hours-listing">
              <span class="daily-hours-label">Building:</span>
              <span class="daily-hours">${(this.library && this.library.hours && this.library.hours.rawDates)? Object.entries(this.library.hours.rawDates).map(([k,v])=>html`${ 
                  this.printTimes(v) 
                }`):""}</span>
            </div>          
        `:''}

        ${(this.library && this.library.children )? this.library.children.map(l=>html`
            <div class="daily-hours-listing">
              <span class="daily-hours-label">${l.title}:</span> 
              <span class="daily-hours">${(l.hours && l.hours.rawDates)? Object.entries(l.hours.rawDates).map(([k,v])=>html`${ 
                  this.printTimes(v) 
                }`):""}</span>
            </div>          
        `):""}
      </div>
    `;
  }

}
