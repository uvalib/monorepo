import{_ as e,a as t,b as a,y as i,e as s}from"./query-assigned-elements-9f2025bb.js";import"./ArticlesData-fb86ab76.js";import{E as n}from"./EventsData-56db42dd.js";import{B as r}from"./BentoSection-1a4a1a7d.js";import"./GeneralSearchResult-331b56d5.js";import"./unsafe-html-deeaec8d.js";import"./SiteStyle-d7ea4a7e.js";var o;class m extends r{constructor(){super(),this.items=[],o.set(this,void 0),this.title="",t(this,o,new n,"f")}updated(e){super.updated(e),(e.has("query")||e.has("limit")||e.has("category"))&&(this.loading=!0,a(this,o,"f").query=this.query,a(this,o,"f").limit=this.limit,a(this,o,"f").category=this.category,a(this,o,"f").fetchData().then((e=>{this.items=e.items,this.loading=!1})))}static formatDate(e){return i`
        <span id="homehoursMonth" class="event--month">${new Intl.DateTimeFormat("en-US",{month:"short",timeZone:"America/New_York"}).format(e)}</span>
        <span id="homehoursDay" class="event--day">${new Intl.DateTimeFormat("en-US",{day:"numeric",timeZone:"America/New_York"}).format(e)}</span>
        <span id="homehoursWeekDay" class="event--wkday">${new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"America/New_York"}).format(e)}</span>      
    `}static isSameDay(e,t){return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate()}static dateRange(e,t){const a=e?new Date(e):new Date,s=t?new Date(t):new Date;return m.isSameDay(a,s)?m.formatDate(a):i`${m.formatDate(a)} - ${m.formatDate(s)}`}static timeRange(e,t){return`${new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"}).format(e)} - ${new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",timeZoneName:"short",timeZone:"America/New_York"}).format(t)}`}render(){return i`
${this.title?i`<h2>${this.limitTitle(this.title)}</h2>`:""}
<div class="event-container">
  ${this.loading?i`<site-spinner></site-spinner>`:""}
  ${this.items.map((e=>i`
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
