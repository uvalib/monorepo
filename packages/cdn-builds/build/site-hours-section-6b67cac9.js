import{_ as e,x as t,e as i}from"./query-assigned-elements-23ba9e4f.js";import{S as r}from"./SiteStyle-86c89e81.js";import"./ArticlesData-c1e511c9.js";import{a as s}from"./LibrariesData-b18bb140.js";import{o as a}from"./unsafe-html-b3407b2c.js";import{a as o,b as l}from"./utils-0869e652.js";class n extends r{constructor(){super(),this.formattedDate=new Intl.DateTimeFormat("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",timeZone:"America/New_York"}).format(new Date),this.placeType=null,this.limited=!1,this.libraries=[];const e=new s;this.initializeLibrariesData(e).catch((e=>{console.error("Error initializing libraries data:",e)}))}async initializeLibrariesData(e){try{await e.fetchData(),await e.fetchHours(),this.libraries=o(e.items.filter((e=>!this.placeType||e.placeType===this.placeType)).filter((e=>!this.limited||"Library"===e.placeType&&e.hours))),this.dispatchEvent(new CustomEvent("got-library-hours",{detail:{message:"fetched hours for libraries"},bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("got-libraries",{detail:{message:"fetched libraries"},bubbles:!0,composed:!0}))}catch(e){console.error("Error fetching data or hours:",e)}}_printRawDates(e){return l(e)}render(){return t`
      <div class="home-hours-block">
        <div id="homehoursdate" class="home-hour-date">${this.formattedDate}</div>
        <h3 class="hour-head">Today's hours</h3>
        <dl class="dl--inline hours-locations">
          ${this.libraries.map((e=>t`
            <dt class="location">${e.shortTitle?e.shortTitle:e.title}</dt>
            <dd class="hours">${e.hours?e.hours.rawDates?this._printRawDates(e):t`
              
                `:e.siteLink&&e.siteLink.uri?t`
                <a href="${e.siteLink.uri}">See site</a>
              `:e.hoursInformation?a(e.hoursInformation.processed):t`
                  Something went wrong!
                `}</dd>
          `))}
        </dl>
        <p class="hours-see-all"><a href="/hours">See all hours and locations</a></p>
      </div>
    `}}e([i({type:String})],n.prototype,"formattedDate",void 0),e([i({type:String,attribute:"place-type"})],n.prototype,"placeType",void 0),e([i({type:Boolean})],n.prototype,"limited",void 0),e([i({type:Array})],n.prototype,"libraries",void 0),window.customElements.define("site-hours-section",n);
