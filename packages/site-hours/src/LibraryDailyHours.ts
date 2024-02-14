import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { LibraryBaseHours } from './LibraryBaseHours';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

// Main class for LibraryDailyHours
export class LibraryDailyHours extends LibraryBaseHours {

  @property({ type: String, attribute: "closed-message" }) closedMessage = "Closed";
  @property({ type: String, attribute: "open-message" }) openMessage = "Open";

  constructor() {
    super();
    this.mode = 'daily';
  }

  async firstUpdated() {
    await super.firstUpdated();
    const openSlot = this.shadowRoot!.querySelector('slot[name="open"]') as HTMLSlotElement | null;
    const closedSlot = this.shadowRoot!.querySelector('slot[name="closed"]') as HTMLSlotElement | null;
  
    if (openSlot) {
      openSlot.addEventListener('slotchange', () => {
        const openNodes = openSlot.assignedNodes({ flatten: true });
        this.openMessage = openNodes.length > 0 ? openNodes[0].textContent || "Open" : "Open";
      });
    }
  
    if (closedSlot) {
      closedSlot.addEventListener('slotchange', () => {
        const closedNodes = closedSlot.assignedNodes({ flatten: true });
        this.closedMessage = closedNodes.length > 0 ? closedNodes[0].textContent || "Closed" : "Closed";
      });
    }
  }  

  protected updated(_changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(_changedProperties);
    if (_changedProperties.has('todayTimeString')) {
      this.requestUpdate();
    }
  }

  // Render method for the component
  render() {
    // Get today's date in New York timezone
    const date = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' });
    const [month, day, year] = date.split('/');
    const today = `${year}-${month}-${day}`;

    // Render the widget with the appropriate slots
    return html`
      <div class="daily-hours-widget">
        ${(this.library && this.library.hours) ? html`
          <div class="daily-hours-listing">
            <span class="daily-hours-closed-status" ?hidden=${this.library.hours && this.library.hours.rawDates && this.isOpen(this.library.hours.rawDates)}>${unsafeHTML(this.closedMessage)}</span>
            <span class="daily-hours-open-status" ?hidden=${!(this.library.hours && this.library.hours.rawDates && this.isOpen(this.library.hours.rawDates))}>${unsafeHTML(this.openMessage)}</span>
            <span class="daily-hours-label">Building: </span>
            <span class="daily-hours">${this.library && this.library.hours && this.library.hours.rawDates ? Object.entries(this.library.hours.rawDates).map(([k, v]) => k === today ? html`${this.printTimes(v)}` : "") : ""}</span>
          </div>
        ` : ''}

        ${(this.library && this.library.children) ? this.library.children.map(l => html`
          <div class="daily-hours-listing">
            <span class="daily-hours-closed-status" ?hidden=${l.hours && l.hours.rawDates && this.isOpen(l.hours.rawDates)}>${unsafeHTML(this.closedMessage)}</span>
            <span class="daily-hours-open-status" ?hidden=${!(l.hours && l.hours.rawDates && this.isOpen(l.hours.rawDates))}>${unsafeHTML(this.openMessage)}</span>
            <span class="daily-hours-label">${l.title}:</span>
            <span class="daily-hours">${l.hours && l.hours.rawDates ? Object.entries(l.hours.rawDates).map(([k, v]) => k === today ? html`${this.printTimes(v)}` : "") : ""}</span>
          </div>
        `) : ""}
      </div>
    `;
  }
}
