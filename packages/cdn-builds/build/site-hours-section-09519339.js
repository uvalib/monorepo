import{_ as e,x as t,n as i}from"./property-88ac5898.js";import{S as r}from"./SiteStyle-4bb8cd6a.js";import"./AccessibleStyles-1e7f8a0a.js";import"./document-77724c06.js";import"./ArticlesData-4e187389.js";import{a as o}from"./LibrariesData-31437421.js";import{o as s}from"./unsafe-html-882321a0.js";import{a}from"./utils-be474c6d.js";class l extends r{constructor(){super(),this.formattedDate=new Intl.DateTimeFormat("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",timeZone:"America/New_York"}).format(new Date),this.placeType=null,this.limited=!1,this.libraries=[];const e=new o;this.initializeLibrariesData(e).catch((e=>{console.error("Error initializing libraries data:",e)}))}async initializeLibrariesData(e){try{await e.fetchData(),await e.fetchHours(),console.log(e.items),this.libraries=e.items.filter((e=>!this.placeType||e.placeType===this.placeType)).filter((e=>!this.limited||e.priorityPlacement&&e.priorityPlacement>0)).sort(((e,t)=>e.priorityPlacement&&t.priorityPlacement?e.title&&t.title?e.priorityPlacement-t.priorityPlacement||e.title.localeCompare(t.title):e.priorityPlacement-t.priorityPlacement:e.priorityPlacement&&!t.priorityPlacement?-1:!e.priorityPlacement&&t.priorityPlacement?1:e.title&&t.title?e.title.localeCompare(t.title):0)),console.log(this.libraries),this.dispatchEvent(new CustomEvent("got-library-hours",{detail:{message:"fetched hours for libraries"},bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("got-libraries",{detail:{message:"fetched libraries"},bubbles:!0,composed:!0}))}catch(e){console.error("Error fetching data or hours:",e)}}_printRawDates(e){return a(e)}render(){return t`
      <div class="home-hours-block">
        <div id="homehoursdate" class="home-hour-date">${this.formattedDate}</div>
        <h3 class="hour-head">Today's hours</h3>
        <dl class="dl--inline hours-locations">
          ${this.libraries.map((e=>t`
            <dt class="location">${e.shortTitle?e.shortTitle:e.title}</dt>
            <dd class="hours">${e.hours?e.hours.rawDates?this._printRawDates(e):t`
              
                `:e.siteLink&&e.siteLink.uri?t`
                <a href="${e.siteLink.uri}">See site</a>
              `:e.hoursInformation?s(e.hoursInformation.processed):t`
                  Something went wrong!
                `}</dd>
          `))}
        </dl>
        <p class="hours-see-all"><a href="/hours">See all hours and locations</a></p>
      </div>
    `}}e([i({type:String})],l.prototype,"formattedDate",void 0),e([i({type:String,attribute:"place-type"})],l.prototype,"placeType",void 0),e([i({type:Boolean})],l.prototype,"limited",void 0),e([i({type:Array})],l.prototype,"libraries",void 0),window.customElements.define("site-hours-section",l);
