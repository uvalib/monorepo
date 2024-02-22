import{x as t}from"./lit-element-9e1ac43c.js";import{_ as e,n as r}from"./query-assigned-elements-8ef6cca7.js";import{S as i}from"./SiteStyle-35a18246.js";import"./document-77724c06.js";import"./ArticlesData-75bbe436.js";import{a}from"./LibrariesData-ca49b23e.js";import{p as s,s as o}from"./utils-1067e33d.js";class l extends i{constructor(){super(),this.mode="weekly",this.weekCount=0,this.refreshEvery=6e5;let t=new Date;this.todayString=t.toISOString().split("T")[0],this.todayTimeString=t.getTime().toString(),this.librariesData=new a}firstUpdated(){console.log(this.refreshEvery),this.intervalId=window.setInterval((()=>{console.log("refreshing today");let t=new Date;this.todayString=t.toISOString().split("T")[0],this.todayTimeString=t.getTime().toString()}),this.refreshEvery)}disconnectedCallback(){super.disconnectedCallback(),void 0!==this.intervalId&&(window.clearInterval(this.intervalId),this.intervalId=void 0)}updated(t){(t.has("weekCount")||t.has("mode")||t.has("todayString"))&&this.setSelectedWeek(),t.has("librarySlug")&&this.getLibraryData(),t.has("weekStart")&&this.getHours()}async getHours(){if(this.library&&this.librariesData){const t=this.library.getHoursCalIds();try{"weekly"===this.mode?await this.librariesData.fetchHours(this.weekStart,6,t):await this.librariesData.fetchHours(this.weekStart,2,t),this.requestUpdate()}catch(t){console.error("Error fetching hours:",t)}}}async getLibraryData(){if(this.librarySlug)try{const t=await this.librariesData.getLibrary(this.librarySlug,!0);t&&(this.library=t,await this.getHours())}catch(t){console.error("Error fetching library data:",t)}}isOpen(t,e=new Date){let r=new Date(e.toLocaleString("en-US",{timeZone:"America/New_York"}));const i=r.toISOString().split("T")[0];console.log(`Current time (NY timezone): ${r}`);const a=t[i];if(!a)return console.log("No information available for today."),!1;if("24hours"===a.status)return console.log("Library is open 24 hours today."),!0;if("open"===a.status&&a.hours){for(const t of a.hours){const e=t.from.replace(/(am|pm)/," $1").toUpperCase(),a=t.to.replace(/(am|pm)/," $1").toUpperCase();let s=new Date(`${i} ${e}`),o=new Date(`${i} ${a}`);if(console.log(`Checking hours: from ${s} to ${o}`),o.getHours()<s.getHours()&&(o.setDate(o.getDate()+1),console.log(`Adjusted 'to' time for after midnight: ${o}`)),r>=s&&r<=o)return console.log("Library is currently open."),!0}console.log("Library is currently closed.")}else console.log('Library status is not "open" or no hours provided.');return!1}printTimes(t){return s(t)}stringDateFormat(t,e){return o(t,e)}dateFormat(t=new Date,e=!1){return new Intl.DateTimeFormat("en-US",{year:"numeric",month:"short",day:"2-digit"}).format(t).replace(",",".")}setSelectedWeek(){const t=this.getCurrentWeekStart();if("weekly"===this.mode){t.setDate(t.getDate()+7*this.weekCount),this.weekStart=t;const e=new Date(this.weekStart);e.setDate(e.getDate()+6),this.weekEnd=e}else{let t=new Date;t.setDate(t.getDate()-1);let e=new Date;e.setDate(e.getDate()+1),this.weekEnd=e,this.weekStart=t}}getCurrentWeekStart(t=new Date){const e=t.getDay(),r=0===e?0:e,i=new Date(t);return i.setDate(t.getDate()-r),i}}e([r({type:String,attribute:"mode"})],l.prototype,"mode",void 0),e([r({type:Number,attribute:"week-count",reflect:!0})],l.prototype,"weekCount",void 0),e([r({type:String,attribute:"library-slug"})],l.prototype,"librarySlug",void 0),e([r({type:Number,attribute:"refresh-every"})],l.prototype,"refreshEvery",void 0),e([r({type:Object})],l.prototype,"weekStart",void 0),e([r({type:Object})],l.prototype,"weekEnd",void 0),e([r({type:Object})],l.prototype,"library",void 0),e([r({type:String})],l.prototype,"todayString",void 0),e([r({type:String})],l.prototype,"todayTimeString",void 0);window.customElements.define("library-weekly-hours",class extends l{render(){return t`
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
            ${this.library&&this.library.hours&&this.library.hours.rawDates?Object.entries(this.library.hours.rawDates).map((([e,r])=>t`
              <th scope="col" aria-current="false" aria-label="${this.stringDateFormat(e,0)}" class="${e===this.todayString?"today":""}">
                <div class="date-header">
                  <div class="date--mobile">
                    <div class="date-header-day">${this.stringDateFormat(e,2)}</div>
                    <div class="date-header-month">${this.stringDateFormat(e,1)}</div>
                  </div>
                </div>
              </th>            
            `)):t`
              ${this.library&&Array.isArray(this.library.children)&&this.library.children.length>0&&this.library.children[0].hours&&this.library.children[0].hours.rawDates?Object.entries(this.library.children[0].hours.rawDates).map((([e,r])=>t`
                <th scope="col" aria-current="false" aria-label="${this.stringDateFormat(e,0)}" class="${e===this.todayString?"today":""}">
                  <div class="date-header">
                    <div class="date--mobile">
                      <div class="date-header-day">${this.stringDateFormat(e,2)}</div>
                      <div class="date-header-month">${this.stringDateFormat(e,1)}</div>
                    </div>
                  </div>
                </th>            
              `)):""}            
            `}
          </tr>
        </thead>
        <tbody>
          ${this.library&&this.library.hours?t`
            <tr>
              <th scope="row" colspan="2" aria-label="Building hours">Building hours</th>
              ${this.library&&this.library.hours&&this.library.hours.rawDates?Object.entries(this.library.hours.rawDates).map((([e,r])=>t`
                <td aria-label="${this.printTimes(r)}" class="${e===this.todayString?"today":""}">
                  <div class="date--mobile">
                    <div class="date-header-day">${this.stringDateFormat(e,2)}</div>
                    <div class="date-header-month">${this.stringDateFormat(e,1)}</div>
                  </div>
                  ${this.printTimes(r)}
                </td>
              `)):""}
            </tr>          
          `:""}

          ${this.library&&this.library.children?this.library.children.map((e=>t`
            <tr>
              <th scope="row" colspan="2" aria-label="${e.title}">
                ${e.siteLink?t`
                <a class="lib-space-link" href="${e.siteLink}">${e.title}</a>            
                `:t`
                <span class="lib-space">${e.title}</span>
                `}
              </th>  
              ${e.hours&&e.hours.rawDates?Object.entries(e.hours.rawDates).map((([e,r])=>t`
                <td aria-label="${this.printTimes(r)}" class="${e===this.todayString?"today":""}">
                  <div class="date--mobile">
                    <div class="date-header-day">${this.stringDateFormat(e,2)}</div>
                    <div class="date-header-month">${this.stringDateFormat(e,1)}</div>
                  </div>
                  ${this.printTimes(r)}
                </td>
              `)):""}
              ${e.hours&&e.hours.rawDates&&e.hours.rawDates.length<7?Array.apply(null,Array(7-e.hours.rawDates.length)).map((()=>t`<td></td>`)):""}

            </tr>          
          `)):""}
        </tbody>
      </table>

    `}});
