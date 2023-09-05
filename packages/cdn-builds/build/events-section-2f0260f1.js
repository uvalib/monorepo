import{_ as e,a as t,b as i,e as a}from"./query-assigned-elements-ba719eec.js";import{x as s}from"./lit-element-b1a1c7e4.js";import"./ArticlesData-e9b81d53.js";import{E as n}from"./EventsData-52bf7bf4.js";import{B as r}from"./BentoSection-04bc3f2f.js";import"./GeneralSearchResult-331b56d5.js";import"./unsafe-html-d2a53643.js";import"./SiteStyle-00ee8f65.js";var o;class m extends r{constructor(){super(),this.items=[],o.set(this,void 0),this.title="",t(this,o,new n,"f")}updated(e){super.updated(e),(e.has("query")||e.has("limit")||e.has("category"))&&(this.loading=!0,i(this,o,"f").query=this.query,i(this,o,"f").limit=this.limit,i(this,o,"f").category=this.category,i(this,o,"f").fetchData().then((e=>{this.items=e.items,this.loading=!1})))}static formatDate(e){return s`
        <span id="homehoursMonth" class="event--month">${new Intl.DateTimeFormat("en-US",{month:"short",timeZone:"America/New_York"}).format(e)}</span>
        <span id="homehoursDay" class="event--day">${new Intl.DateTimeFormat("en-US",{day:"numeric",timeZone:"America/New_York"}).format(e)}</span>
        <span id="homehoursWeekDay" class="event--wkday">${new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:"America/New_York"}).format(e)}</span>      
    `}static isSameDay(e,t,i="America/New_York"){function a(e){return e.toLocaleDateString("en-US",{timeZone:i})}return a(e)===a(t)}static dateRange(e,t){const i=e?new Date(e):new Date,a=t?new Date(t):new Date;return m.isSameDay(i,a)?m.formatDate(i):s`${m.formatDate(i)} - ${m.formatDate(a)}`}static timeRange(e,t){return`${new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"}).format(e)} - ${new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",timeZoneName:"short",timeZone:"America/New_York"}).format(t)}`}render(){return s`
${this.title?s`<h2>${this.limitTitle(this.title)}</h2>`:""}
<div class="event-container">
  ${this.loading?s`<site-spinner></site-spinner>`:""}
  ${this.items.map((e=>s`
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
      
    `}}o=new WeakMap,e([a({type:String})],m.prototype,"category",void 0),e([a({type:Array})],m.prototype,"items",void 0),window.customElements.define("events-section",m);
