/* eslint-disable no-nested-ternary */
import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { SiteStyle } from '@uvalib/site-style';
import { LibrariesData, Library } from '@uvalib/data-wrap';
import { Hours } from '@uvalib/data-wrap/dist/src/Hours';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

export class SiteHoursSection extends SiteStyle {

  @property({type:String}) formattedDate = "Wednesday, December 7";

  @property({type:String, attribute:"place-type"}) placeType = null;

  @property({type:Boolean}) unlimited = false;
  
  @property({type:Array}) libraries: Library[] = [];

  constructor() {
    super();
    // get todays hours
    const libraries = new LibrariesData();
    libraries.fetchData().then(()=>{
      libraries.fetchHours().then(()=>{
        // get todays hours and bind them up to the dom
        this.libraries = libraries.items
                .filter(lib=>this.placeType? lib.placeType===this.placeType:true)
                .filter(lib=>this.unlimited? true:lib.hours || lib.hoursInformation)
                .sort((a,b) => ( (a.title?a.title:'') > (b.title?b.title:'') )? 1:-1);
      })
    })
  }

  // eslint-disable-next-line class-methods-use-this
  private _printRawDates(lib:Library){
    if (lib && lib.hours && lib.hours.rawDates) {
      const hours = <Hours> lib.hours;
      const today = <{hours:Array<{from: string, to: string}>|null, status:string|null}> Object.values(hours.rawDates)[0]
      if (today.hours) {
        return today.hours.map((h: { from: string; to: string; })=>html`
        ${h.from} - ${h.to}
      `);
      } 
      if (today.status) {
        return today.status.replace('24hours', '24 Hours');
      }
      return "";
    }
    return "";
  }

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
