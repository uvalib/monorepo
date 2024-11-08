import{_ as t,n as e,x as i}from"./property-4490ebb8.js";import{S as r}from"./SiteStyle-3d98d4f6.js";import"./AccessibleStyles-e1ca487e.js";import"./document-77724c06.js";import"./ArticlesData-ef19c3aa.js";import{a}from"./LibrariesData-39b0f33e.js";import{p as s,s as o}from"./utils-c1bd667f.js";class l extends r{constructor(){super(),this.mode="weekly",this.weekCount=0,this.refreshEvery=6e5,this.loading=!1,this._loadingCount=0;let t=new Date;this.todayString=t.toISOString().split("T")[0],this.todayTimeString=t.getTime().toString(),this.librariesData=new a}firstUpdated(){console.log(this.refreshEvery),this.intervalId=window.setInterval((()=>{console.log("refreshing today");let t=new Date;this.todayString=t.toISOString().split("T")[0],this.todayTimeString=t.getTime().toString()}),this.refreshEvery)}disconnectedCallback(){super.disconnectedCallback(),void 0!==this.intervalId&&(window.clearInterval(this.intervalId),this.intervalId=void 0)}updated(t){(t.has("weekCount")||t.has("mode")||t.has("todayString"))&&this.setSelectedWeek(),t.has("librarySlug")&&this.getLibraryData(),t.has("weekStart")&&this.getHours()}async getHours(){if(this.library&&this.librariesData){this._loadingCount++,this.loading=!0;const t=this.library.getHoursCalIds();try{"weekly"===this.mode?await this.librariesData.fetchHours(this.weekStart,6,t):await this.librariesData.fetchHours(this.weekStart,2,t),this.requestUpdate()}catch(t){console.error("Error fetching hours:",t)}finally{this._loadingCount--,this.loading=this._loadingCount>0}}}async getLibraryData(){if(this.librarySlug){this._loadingCount++,this.loading=!0;try{const t=await this.librariesData.getLibrary(this.librarySlug,!0);t&&(this.library=t,await this.getHours())}catch(t){console.error("Error fetching library data:",t)}finally{this._loadingCount--,this.loading=this._loadingCount>0}}}isOpen(t,e=new Date){let i=new Date(e.toLocaleString("en-US",{timeZone:"America/New_York"}));const r=i.toISOString().split("T")[0];console.log(`Current time (NY timezone): ${i}`);const a=t[r];if(!a)return console.log("No information available for today."),!1;if("24hours"===a.status)return console.log("Library is open 24 hours today."),!0;if("open"===a.status&&a.hours){for(const t of a.hours){const e=t.from.replace(/(am|pm)/," $1").toUpperCase(),a=t.to.replace(/(am|pm)/," $1").toUpperCase();let s=new Date(`${r} ${e}`),o=new Date(`${r} ${a}`);if(console.log(`Checking hours: from ${s} to ${o}`),o.getHours()<s.getHours()&&(o.setDate(o.getDate()+1),console.log(`Adjusted 'to' time for after midnight: ${o}`)),i>=s&&i<=o)return console.log("Library is currently open."),!0}console.log("Library is currently closed.")}else console.log('Library status is not "open" or no hours provided.');return!1}printTimes(t){return s(t)}stringDateFormat(t,e){return o(t,e)}dateFormat(t=new Date,e=!1){return new Intl.DateTimeFormat("en-US",{year:"numeric",month:"short",day:"2-digit"}).format(t).replace(",",".")}setSelectedWeek(){const t=this.getCurrentWeekStart();if("weekly"===this.mode){t.setDate(t.getDate()+7*this.weekCount),this.weekStart=t;const e=new Date(this.weekStart);e.setDate(e.getDate()+6),this.weekEnd=e}else{let t=new Date;t.setDate(t.getDate()-1);let e=new Date;e.setDate(e.getDate()+1),this.weekEnd=e,this.weekStart=t}}getCurrentWeekStart(t=new Date){const e=t.getDay(),i=0===e?0:e,r=new Date(t);return r.setDate(t.getDate()-i),r}}t([e({type:String,attribute:"mode"})],l.prototype,"mode",void 0),t([e({type:Number,attribute:"week-count",reflect:!0})],l.prototype,"weekCount",void 0),t([e({type:String,attribute:"library-slug"})],l.prototype,"librarySlug",void 0),t([e({type:Number,attribute:"refresh-every"})],l.prototype,"refreshEvery",void 0),t([e({type:Object})],l.prototype,"weekStart",void 0),t([e({type:Object})],l.prototype,"weekEnd",void 0),t([e({type:Object})],l.prototype,"library",void 0),t([e({type:String})],l.prototype,"todayString",void 0),t([e({type:String})],l.prototype,"todayTimeString",void 0),t([e({type:Boolean})],l.prototype,"loading",void 0);window.customElements.define("library-weekly-hours",class extends l{render(){return i`
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
        <button class="uvalib-button uvalib-button--basic" @click="${()=>{null!==this.weekCount&&this.weekCount--}}">Previous week</button>
        <div class="heading-h${this.headingLevelStart}" role="heading" aria-level="${this.headingLevelStart}">
          ${this.dateFormat(this.weekStart)} - ${this.dateFormat(this.weekEnd)}
        </div>
        <button class="uvalib-button uvalib-button--basic" @click="${()=>{null!==this.weekCount&&this.weekCount++}}">Next week</button>
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
            ${this.library&&this.library.hours&&this.library.hours.rawDates?Object.entries(this.library.hours.rawDates).map((([t,e])=>i`
              <th scope="col" aria-current="false" aria-label="${this.stringDateFormat(t,0)}" class="${t===this.todayString?"today":""}">
                <div class="date-header">
                  <div class="date--mobile">
                    <div class="date-header-day">${this.stringDateFormat(t,2)}</div>
                    <div class="date-header-month">${this.stringDateFormat(t,1)}</div>
                  </div>
                </div>
              </th>            
            `)):i`
              ${this.library&&Array.isArray(this.library.children)&&this.library.children.length>0&&this.library.children[0].hours&&this.library.children[0].hours.rawDates?Object.entries(this.library.children[0].hours.rawDates).map((([t,e])=>i`
                <th scope="col" aria-current="false" aria-label="${this.stringDateFormat(t,0)}" class="${t===this.todayString?"today":""}">
                  <div class="date-header">
                    <div class="date--mobile">
                      <div class="date-header-day">${this.stringDateFormat(t,2)}</div>
                      <div class="date-header-month">${this.stringDateFormat(t,1)}</div>
                    </div>
                  </div>
                </th>            
              `)):""}            
            `}
          </tr>
        </thead>
        <tbody>
          ${this.library&&this.library.hours?i`
            <tr>
              <th scope="row" colspan="2" aria-label="Building hours">Building hours</th>
              ${this.library&&this.library.hours&&this.library.hours.rawDates?Object.entries(this.library.hours.rawDates).map((([t,e])=>i`
                <td aria-label="${this.printTimes(e)}" class="${t===this.todayString?"today":""}">
                  <div class="date--mobile">
                    <div class="date-header-day">${this.stringDateFormat(t,2)}</div>
                    <div class="date-header-month">${this.stringDateFormat(t,1)}</div>
                  </div>
                  ${this.printTimes(e)}
                </td>
              `)):""}
            </tr>          
          `:""}

          ${this.library&&this.library.children?this.library.children.map((t=>i`
            <tr>
              <th scope="row" colspan="2" aria-label="${t.title}">
                ${t.siteLink&&t.siteLink.uri?i`
                <a class="lib-space-link" href="${t.siteLink.uri}">${t.title}</a>            
                `:i`
                <span class="lib-space">${t.title}</span>
                `}
              </th>  
              ${t.hours&&t.hours.rawDates?Object.entries(t.hours.rawDates).map((([t,e])=>i`
                <td aria-label="${this.printTimes(e)}" class="${t===this.todayString?"today":""}">
                  <div class="date--mobile">
                    <div class="date-header-day">${this.stringDateFormat(t,2)}</div>
                    <div class="date-header-month">${this.stringDateFormat(t,1)}</div>
                  </div>
                  ${this.printTimes(e)}
                </td>
              `)):""}
              ${t.hours&&t.hours.rawDates&&t.hours.rawDates.length<7?Array.apply(null,Array(7-t.hours.rawDates.length)).map((()=>i`<td></td>`)):""}

            </tr>          
          `)):""}
        </tbody>
      </table>

    `}});
