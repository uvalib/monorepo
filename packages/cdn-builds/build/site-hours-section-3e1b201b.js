import{_ as e,e as t}from"./query-assigned-elements-ba719eec.js";import{x as i}from"./lit-element-b1a1c7e4.js";import{S as r}from"./SiteStyle-00ee8f65.js";import"./ArticlesData-e9b81d53.js";import{a as s}from"./LibrariesData-e7eafeda.js";import{o as a}from"./unsafe-html-d2a53643.js";import{a as o,b as l}from"./utils-088fd548.js";class n extends r{constructor(){super(),this.formattedDate=new Intl.DateTimeFormat("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",timeZone:"America/New_York"}).format(new Date),this.placeType=null,this.limited=!1,this.libraries=[];const e=new s;this.initializeLibrariesData(e).catch((e=>{console.error("Error initializing libraries data:",e)}))}async initializeLibrariesData(e){try{await e.fetchData(),await e.fetchHours(),this.libraries=o(e.items.filter((e=>!this.placeType||e.placeType===this.placeType)).filter((e=>!this.limited||"Library"===e.placeType&&e.hours))),this.dispatchEvent(new CustomEvent("got-library-hours",{detail:{message:"fetched hours for libraries"},bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("got-libraries",{detail:{message:"fetched libraries"},bubbles:!0,composed:!0}))}catch(e){console.error("Error fetching data or hours:",e)}}_printRawDates(e){return l(e)}render(){return i`
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
    `}}e([t({type:String})],n.prototype,"formattedDate",void 0),e([t({type:String,attribute:"place-type"})],n.prototype,"placeType",void 0),e([t({type:Boolean})],n.prototype,"limited",void 0),e([t({type:Array})],n.prototype,"libraries",void 0),window.customElements.define("site-hours-section",n);
