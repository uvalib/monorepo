import { html } from 'lit';
import { LibraryBaseHours } from './LibraryBaseHours';

// Main class for LibraryWeeklyHours
export class LibraryWeeklyHours extends LibraryBaseHours {

  // Render method for the component
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
        <button class="uvalib-button uvalib-button--basic" @click="${ ()=>{if (this.weekCount !== null) this.weekCount--;} }">Previous week</button>
        <div class="heading-h${this.headingLevelStart}" role="heading" aria-level="${this.headingLevelStart}">
          ${this.dateFormat(this.weekStart)} - ${this.dateFormat(this.weekEnd)}
        </div>
        <button class="uvalib-button uvalib-button--basic" @click="${ ()=>{if (this.weekCount !== null) this.weekCount++;} }">Next week</button>
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
              <th scope="col" aria-current="false" aria-label="${ this.stringDateFormat(k,0) }" class="${k === this.todayString ? 'today' : ''}">
                <div class="date-header">
                  <div class="date--mobile">
                    <div class="date-header-day">${ this.stringDateFormat(k,2) }</div>
                    <div class="date-header-month">${ this.stringDateFormat(k,1) }</div>
                  </div>
                </div>
              </th>            
            `):html`
              ${(this.library && Array.isArray(this.library.children) && this.library.children.length>0 && this.library.children[0].hours && this.library.children[0].hours.rawDates)? Object.entries(this.library.children[0].hours.rawDates).map(([k,v])=>html`
                <th scope="col" aria-current="false" aria-label="${ this.stringDateFormat(k,0) }" class="${k === this.todayString ? 'today' : ''}">
                  <div class="date-header">
                    <div class="date--mobile">
                      <div class="date-header-day">${ this.stringDateFormat(k,2) }</div>
                      <div class="date-header-month">${ this.stringDateFormat(k,1) }</div>
                    </div>
                  </div>
                </th>            
              `):""}            
            `}
          </tr>
        </thead>
        <tbody>
          ${(this.library && this.library.hours )? html`
            <tr>
              <th scope="row" colspan="2" aria-label="Building hours">Building hours</th>
              ${(this.library && this.library.hours && this.library.hours.rawDates)? Object.entries(this.library.hours.rawDates).map(([k,v])=>html`
                <td aria-label="${ this.printTimes(v) }" class="${k === this.todayString ? 'today' : ''}">
                  <div class="date--mobile">
                    <div class="date-header-day">${ this.stringDateFormat(k,2) }</div>
                    <div class="date-header-month">${ this.stringDateFormat(k,1) }</div>
                  </div>
                  ${ this.printTimes(v) }
                </td>
              `):""}
            </tr>          
          `:''}

          ${(this.library && this.library.children )? this.library.children.map(l=>html`
            <tr>
              <th scope="row" colspan="2" aria-label="${l.title}">
                ${l.siteLink? html`
                <a class="lib-space-link" href="${l.siteLink.uri}">${l.title}</a>            
                `:html`
                <span class="lib-space">${l.title}</span>
                `}
              </th>  
              ${(l.hours && l.hours.rawDates)? Object.entries(l.hours.rawDates).map(([k,v])=>html`
                <td aria-label="${ this.printTimes(v) }" class="${k === this.todayString ? 'today' : ''}">
                  <div class="date--mobile">
                    <div class="date-header-day">${ this.stringDateFormat(k,2) }</div>
                    <div class="date-header-month">${ this.stringDateFormat(k,1) }</div>
                  </div>
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

}
