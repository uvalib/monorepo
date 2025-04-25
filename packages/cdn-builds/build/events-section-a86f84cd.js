import{_ as e,a as t,b as i,x as a,n as s}from"./property-88ac5898.js";import"./document-77724c06.js";import"./ArticlesData-4e187389.js";import{E as n}from"./EventsData-412fd71c.js";import{B as r}from"./BentoSection-7cbd507d.js";import"./GeneralSearchResult-331b56d5.js";import"./index-57095fc0.js";import"./unsafe-html-882321a0.js";import"./SiteStyle-4bb8cd6a.js";import"./AccessibleStyles-1e7f8a0a.js";var o;class m extends r{constructor(){super(),this.items=[],o.set(this,void 0),this.title="",t(this,o,new n,"f")}updated(e){super.updated(e),(e.has("query")||e.has("limit")||e.has("category"))&&(this.loading=!0,i(this,o,"f").query=this.query,i(this,o,"f").limit=this.limit,i(this,o,"f").category=this.category,i(this,o,"f").fetchData().then((e=>{this.items=e.items,this.loading=!1})))}static formatDate(e){return a`
        <span id="homehoursMonth" class="event--month">${new Intl.DateTimeFormat("en-US",{month:"short",timeZone:"America/New_York"}).format(e)}</span>
        <span id="homehoursDay" class="event--day">${new Intl.DateTimeFormat("en-US",{day:"numeric",timeZone:"America/New_York"}).format(e)}</span>
        <span id="homehoursWeekDay" class="event--wkday">${new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"America/New_York"}).format(e)}</span>      
    `}static isSameDay(e,t,i="America/New_York"){function a(e){return e.toLocaleDateString("en-US",{timeZone:i})}return a(e)===a(t)}static dateRange(e,t){const i=e?new Date(e):new Date,s=t?new Date(t):new Date;return m.isSameDay(i,s)?m.formatDate(i):a`${m.formatDate(i)} - ${m.formatDate(s)}`}static timeRange(e,t){return`${new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"}).format(e)} - ${new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",timeZoneName:"short",timeZone:"America/New_York"}).format(t)}`}render(){return a`
${this.title?a`<h2>${this.limitTitle(this.title)}</h2>`:""}
<div class="event-container">
  ${this.loading?a`<site-spinner></site-spinner>`:""}
  ${this.items.map((e=>a`
    <div class="event">
      <a href="${e.link}" class="event-url">
        <h4 class="event-title">${this.limitTitle(e.title)}</h4>
        <p class="event-date">${m.dateRange(e.start,e.end)}</p>
        <p class="event-time">${m.timeRange(e.start,e.end)}</p>
      </a>
    </div>  
  `))}
  <slot name="see-more"></slot>
</div>  
      
    `}}o=new WeakMap,e([s({type:String})],m.prototype,"category",void 0),e([s({type:Array})],m.prototype,"items",void 0),window.customElements.define("events-section",m);
