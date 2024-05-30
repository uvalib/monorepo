import{_ as e,n as t}from"./property-8648e151.js";import{x as i}from"./lit-element-ab109411.js";import{S as r}from"./SiteStyle-ee7ab697.js";import"./document-77724c06.js";import"./ArticlesData-f873435f.js";import{a as o}from"./LibrariesData-94a85757.js";import{o as a}from"./unsafe-html-e63196f7.js";import{a as s}from"./utils-b258142e.js";class l extends r{constructor(){super(),this.formattedDate=new Intl.DateTimeFormat("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",timeZone:"America/New_York"}).format(new Date),this.placeType=null,this.limited=!1,this.libraries=[];const e=new o;this.initializeLibrariesData(e).catch((e=>{console.error("Error initializing libraries data:",e)}))}async initializeLibrariesData(e){try{await e.fetchData(),await e.fetchHours(),console.log(e.items),this.libraries=e.items.filter((e=>!this.placeType||e.placeType===this.placeType)).filter((e=>!this.limited||e.priorityPlacement&&e.priorityPlacement>0)).sort(((e,t)=>e.priorityPlacement&&t.priorityPlacement?e.title&&t.title?e.priorityPlacement-t.priorityPlacement||e.title.localeCompare(t.title):e.priorityPlacement-t.priorityPlacement:e.priorityPlacement&&!t.priorityPlacement?-1:!e.priorityPlacement&&t.priorityPlacement?1:e.title&&t.title?e.title.localeCompare(t.title):0)),console.log(this.libraries),this.dispatchEvent(new CustomEvent("got-library-hours",{detail:{message:"fetched hours for libraries"},bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("got-libraries",{detail:{message:"fetched libraries"},bubbles:!0,composed:!0}))}catch(e){console.error("Error fetching data or hours:",e)}}_printRawDates(e){return s(e)}render(){return i`
      <div class="home-hours-block">
        <div id="homehoursdate" class="home-hour-date">${this.formattedDate}</div>
        <h3 class="hour-head">Today's hours</h3>
        <dl class="dl--inline hours-locations">
          ${this.libraries.map((e=>i`
            <dt class="location">${e.shortTitle?e.shortTitle:e.title}</dt>
            <dd class="hours">${e.hours?e.hours.rawDates?this._printRawDates(e):i`
              
                `:e.siteLink&&e.siteLink.uri?i`
                <a href="${e.siteLink.uri}">See site</a>
              `:e.hoursInformation?a(e.hoursInformation.processed):i`
                  Something went wrong!
                `}</dd>
          `))}
        </dl>
        <p class="hours-see-all"><a href="/hours">See all hours and locations</a></p>
      </div>
    `}}e([t({type:String})],l.prototype,"formattedDate",void 0),e([t({type:String,attribute:"place-type"})],l.prototype,"placeType",void 0),e([t({type:Boolean})],l.prototype,"limited",void 0),e([t({type:Array})],l.prototype,"libraries",void 0),window.customElements.define("site-hours-section",l);
