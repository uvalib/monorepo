import{_ as t,y as e,e as r}from"../../query-assigned-elements-9f2025bb.js";import{S as a}from"../../SiteStyle-d7ea4a7e.js";import"../../site-button-3569602b.js";import"../../ArticlesData-fb86ab76.js";import{a as s}from"../../LibrariesData-5c1972f9.js";import{p as i,s as o}from"../../utils-d42ef4cb.js";import"../../SiteStyleMapping-51203cca.js";import"../../size-468cfd3b.js";import"../../display-058af2ce.js";import"../../focus-030c5e12.js";import"../../match-media-stylesheet-behavior-575be983.js";import"../../apply-mixins-fe151c16.js";import"../../form-associated-b8833a72.js";import"../../aria-global-43630e0f.js";import"../../GeneralSearchResult-331b56d5.js";class l extends a{constructor(){super(),this.weekCount=0,this.librariesData=new s,this.setSelectedWeek()}updated(t){t.has("weekCount")&&this.setSelectedWeek(),t.has("librarySlug")&&this.getLibraryData(),t.has("weekStart")&&this.getHours()}async getHours(){if(this.library&&this.librariesData){const t=this.library.getHoursCalIds();try{await this.librariesData.fetchHours(this.weekStart,6,t),this.requestUpdate()}catch(t){console.error("Error fetching hours:",t)}}}async getLibraryData(){if(this.librarySlug)try{const t=await this.librariesData.getLibrary(this.librarySlug,!0);t&&(this.library=t,this.getHours())}catch(t){console.error("Error fetching library data:",t)}}render(){return e`
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
        <site-button @click="${()=>this.weekCount--}">Previous week</site-button>
        <div class="heading-h${this.headingLevelStart}" role="heading" aria-level="${this.headingLevelStart}">
          ${this.dateFormat(this.weekStart)} - ${this.dateFormat(this.weekEnd)}
        </div>
        <site-button @click="${()=>this.weekCount++}">Next week</site-button>
      </div>
      <table ?hidden="${!this.librarySlug}" class="weekly-hours-body-section">
        <thead>
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
