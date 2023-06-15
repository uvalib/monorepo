import{_ as t,x as e,e as a}from"./query-assigned-elements-23ba9e4f.js";import{S as r}from"./SiteStyle-86c89e81.js";import"./ArticlesData-c1e511c9.js";import{a as i}from"./LibrariesData-b18bb140.js";import{p as s,s as l}from"./utils-0869e652.js";class o extends r{constructor(){super(),this.weekCount=0;let t=new Date;this.todayString=t.toISOString().split("T")[0],this.intervalId=window.setInterval((()=>{t=new Date,this.todayString=t.toISOString().split("T")[0]}),6e5),this.librariesData=new i,this.setSelectedWeek()}disconnectedCallback(){super.disconnectedCallback(),void 0!==this.intervalId&&(window.clearInterval(this.intervalId),this.intervalId=void 0)}updated(t){t.has("weekCount")&&this.setSelectedWeek(),t.has("librarySlug")&&this.getLibraryData(),t.has("weekStart")&&this.getHours()}async getHours(){if(this.library&&this.librariesData){const t=this.library.getHoursCalIds();try{await this.librariesData.fetchHours(this.weekStart,6,t),this.requestUpdate()}catch(t){console.error("Error fetching hours:",t)}}}async getLibraryData(){if(this.librarySlug)try{const t=await this.librariesData.getLibrary(this.librarySlug,!0);t&&(this.library=t,await this.getHours())}catch(t){console.error("Error fetching library data:",t)}}render(){return e`
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
            ${this.library&&this.library.hours&&this.library.hours.rawDates?Object.entries(this.library.hours.rawDates).map((([t,a])=>e`
              <th scope="col" aria-current="false" aria-label="${this.stringDateFormat(t,0)}" class="${t===this.todayString?"today":""}">
                <div class="date-header">
                  <div class="date--mobile">
                    <div class="date-header-day">${this.stringDateFormat(t,2)}</div>
                    <div class="date-header-month">${this.stringDateFormat(t,1)}</div>
                  </div>
                </div>
              </th>            
            `)):e`
              ${this.library&&Array.isArray(this.library.children)&&this.library.children.length>0&&this.library.children[0].hours&&this.library.children[0].hours.rawDates?Object.entries(this.library.children[0].hours.rawDates).map((([t,a])=>e`
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
          ${this.library&&this.library.hours?e`
            <tr>
              <th scope="row" colspan="2" aria-label="Building hours">Building hours</th>
              ${this.library&&this.library.hours&&this.library.hours.rawDates?Object.entries(this.library.hours.rawDates).map((([t,a])=>e`
                <td aria-label="${this.printTimes(a)}" class="${t===this.todayString?"today":""}">
                  <div class="date--mobile">
                    <div class="date-header-day">${this.stringDateFormat(t,2)}</div>
                    <div class="date-header-month">${this.stringDateFormat(t,1)}</div>
                  </div>
                  ${this.printTimes(a)}
                </td>
              `)):""}
            </tr>          
          `:""}

          ${this.library&&this.library.children?this.library.children.map((t=>e`
            <tr>
              <th scope="row" colspan="2" aria-label="${t.title}">
                ${t.siteLink?e`
                <a class="lib-space-link" href="${t.siteLink}">${t.title}</a>            
                `:e`
                <span class="lib-space">${t.title}</span>
                `}
              </th>  
              ${t.hours&&t.hours.rawDates?Object.entries(t.hours.rawDates).map((([t,a])=>e`
                <td aria-label="${this.printTimes(a)}" class="${t===this.todayString?"today":""}">
                  <div class="date--mobile">
                    <div class="date-header-day">${this.stringDateFormat(t,2)}</div>
                    <div class="date-header-month">${this.stringDateFormat(t,1)}</div>
                  </div>
                  ${this.printTimes(a)}
                </td>
              `)):""}
              ${t.hours&&t.hours.rawDates&&t.hours.rawDates.length<7?Array.apply(null,Array(7-t.hours.rawDates.length)).map((()=>e`<td></td>`)):""}

            </tr>          
          `)):""}
        </tbody>
      </table>

    `}printTimes(t){return s(t)}stringDateFormat(t,e){return l(t,e)}dateFormat(t=new Date,e=!1){return new Intl.DateTimeFormat("en-US",{year:"numeric",month:"short",day:"2-digit"}).format(t).replace(",",".")}setSelectedWeek(){const t=this.getCurrentWeekStart();t.setDate(t.getDate()+7*this.weekCount),this.weekStart=t;const e=new Date(this.weekStart);e.setDate(e.getDate()+6),this.weekEnd=e}getCurrentWeekStart(t=new Date){const e=t.getDay(),a=0===e?0:e,r=new Date(t);return r.setDate(t.getDate()-a),r}}t([a({type:Number,attribute:"week-count",reflect:!0})],o.prototype,"weekCount",void 0),t([a({type:String,attribute:"library-slug"})],o.prototype,"librarySlug",void 0),t([a({type:Object})],o.prototype,"weekStart",void 0),t([a({type:Object})],o.prototype,"weekEnd",void 0),t([a({type:Object})],o.prototype,"library",void 0),t([a({type:String})],o.prototype,"todayString",void 0),window.customElements.define("library-weekly-hours",o);
