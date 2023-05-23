import{_ as t,x as e,e as r}from"./query-assigned-elements-23ba9e4f.js";import{S as a}from"./SiteStyle-86c89e81.js";import"./ArticlesData-c1e511c9.js";import{a as s}from"./LibrariesData-77dcc00d.js";import{p as i,s as o}from"./utils-1a1560f5.js";class l extends a{constructor(){super(),this.weekCount=0,this.librariesData=new s,this.setSelectedWeek()}updated(t){t.has("weekCount")&&this.setSelectedWeek(),t.has("librarySlug")&&this.getLibraryData(),t.has("weekStart")&&this.getHours()}async getHours(){if(this.library&&this.librariesData){const t=this.library.getHoursCalIds();try{await this.librariesData.fetchHours(this.weekStart,6,t),this.requestUpdate()}catch(t){console.error("Error fetching hours:",t)}}}async getLibraryData(){if(this.librarySlug)try{const t=await this.librariesData.getLibrary(this.librarySlug,!0);t&&(this.library=t,this.getHours())}catch(t){console.error("Error fetching library data:",t)}}render(){return e`
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
        <button class="uvalib-button uvalib-button--basic" @click="${()=>this.weekCount--}">Previous week</button>
        <div class="heading-h${this.headingLevelStart}" role="heading" aria-level="${this.headingLevelStart}">
          ${this.dateFormat(this.weekStart)} - ${this.dateFormat(this.weekEnd)}
        </div>
        <button class="uvalib-button uvalib-button--basic" @click="${()=>this.weekCount++}">Next week</button>
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
            ${this.library&&this.library.hours&&this.library.hours.rawDates?Object.entries(this.library.hours.rawDates).map((([t,r])=>e`
              <th scope="col" aria-current="false" aria-label="${this.stringDateFormat(t,0)}">
                <div class="date-header">
                  <span class="date-header-month">${this.stringDateFormat(t,1)}</span>
                  <span class="date-header-day">${this.stringDateFormat(t,2)}</span>
                </div>
              </th>            
            `)):""}
          </tr>
        </thead>
        <tbody>
          ${this.library&&this.library.hours?e`
            <tr>
              <th scope="row" colspan="2" aria-label="Building hours">Building hours</th>
              ${this.library&&this.library.hours&&this.library.hours.rawDates?Object.entries(this.library.hours.rawDates).map((([t,r])=>e`
                <td aria-label="2pm to 8pm">${this.printTimes(r)}</td>
              `)):""}
            </tr>          
          `:""}

          ${this.library&&this.library.children?this.library.children.map((t=>e`
            <tr>
              <th scope="row" colspan="2" aria-label="${t.title}"><a class="css-20nh0y" href="/locations-and-hours/hatcher-library/ask-librarian-desk">${t.title}</a></th>
              ${t.hours&&t.hours.rawDates?Object.entries(t.hours.rawDates).map((([t,r])=>e`
                <td aria-label="2pm to 8pm">${this.printTimes(r)}</td>
              `)):""}
            </tr>          
          `)):""}
        </tbody>
      </table>

    `}printTimes(t){return i(t)}stringDateFormat(t,e){return o(t,e)}dateFormat(t=new Date,e=!1){return new Intl.DateTimeFormat("en-US",{year:"numeric",month:"short",day:"2-digit"}).format(t).replace(",",".")}setSelectedWeek(){const t=this.getCurrentWeekStart();t.setDate(t.getDate()+7*this.weekCount),this.weekStart=t;const e=new Date(this.weekStart);e.setDate(e.getDate()+6),this.weekEnd=e}getCurrentWeekStart(t=new Date){const e=t.getDay(),r=0===e?0:e,a=new Date(t);return a.setDate(t.getDate()-r),a}}t([r({type:Number,attribute:"week-count",reflect:!0})],l.prototype,"weekCount",void 0),t([r({type:String,attribute:"library-slug"})],l.prototype,"librarySlug",void 0),t([r({type:Object})],l.prototype,"weekStart",void 0),t([r({type:Object})],l.prototype,"weekEnd",void 0),t([r({type:Object})],l.prototype,"library",void 0),window.customElements.define("library-weekly-hours",l);
