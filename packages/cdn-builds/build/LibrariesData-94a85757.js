import{G as t}from"./GeneralSearchResult-331b56d5.js";import{G as e}from"./ArticlesData-f873435f.js";class i extends t{setHours(t){if(!t)throw new Error("Invalid Hours object provided.");this.hours=t}getHoursCalIds(){let t=[];if(this.hoursId){const e=parseInt(this.hoursId);if(isNaN(e))throw new Error(`Invalid hoursId value: ${this.hoursId}`);t.push(e)}return this.children&&this.children.forEach((e=>{if(e.hoursId){const i=parseInt(e.hoursId);if(isNaN(i))throw new Error(`Invalid hoursId value for child: ${e.hoursId}`);t.push(i)}})),t}async fetchHours(t,e,i=!1){if(!this.hoursId)throw new Error("hoursId is undefined");Promise.resolve().then((function(){return h})).then((i=>{const s=i.HoursData;if(void 0!==this.hoursId){new s({ids:[parseInt(this.hoursId)]}).fetchHours(t,e).then((t=>{console.log(t),this.setHours(t[0])}))}}))}constructor(t){super(t)}async getChildren(){}async getParent(){}}function s(t){var e,s,r,a,n,o,l,u,d,h;if(!t||!t.id||!t.attributes.title)throw new Error("Invalid library data provided.");return new i({id:t.id,uuid:t.id,title:t.attributes.title,body:null===(e=t.attributes.body)||void 0===e?void 0:e.processed,description:null===(s=t.attributes.body)||void 0===s?void 0:s.processed,shortTitle:t.attributes.field_short_title,placeType:t.attributes.field_type_basic,contactForm:t.attributes.field_contact_form,donorDescription:t.attributes.field_donor_description,donorTitle:t.attributes.field_donor_title,emailAddress:t.attributes.field_email_address,hoursInformation:t.attributes.field_hours_information,hoursId:t.attributes.field_libcal_id,libraryFeed:t.attributes.field_library_feed,link:null===(r=t.attributes.field_library_site_link)||void 0===r?void 0:r.uri,siteLink:{title:null!==(n=null===(a=t.attributes.field_library_site_link)||void 0===a?void 0:a.uri)&&void 0!==n?n:"",uri:null!==(l=null===(o=t.attributes.field_library_site_link)||void 0===o?void 0:o.uri.replace("internal:",""))&&void 0!==l?l:""},fmKey:t.attributes.field_location_key,location:t.attributes.field_fm_location?{lat:t.attributes.field_fm_location.lat,lng:t.attributes.field_fm_location.lng}:void 0,mygroupId:t.attributes.field_mygroup_id,phoneNumber:t.attributes.field_phone_number,socialMedia:null===(u=t.attributes.field_social_media)||void 0===u?void 0:u.map((t=>({uri:t.uri,title:t.title}))),slug:t.attributes.field_slug,zipCode:t.attributes.field_zip_code,googleMyBusiness:t.attributes.field_google_my_business,parent:null===(h=null===(d=t.relationships.field_parent)||void 0===d?void 0:d.data)||void 0===h?void 0:h.id,closureOverride:t.attributes.field_closure_override,priorityPlacement:t.attributes.field_priority_placement})}class r extends e{constructor(t){super(),this.drupalEndpointURL="/jsonapi/index/default_index",this.type="",this.types=[]}makeQueryString(){let t=this.query?`filter[fulltext]=${this.query}&`:"";return t+=this.limit?`page[limit]=${this.limit}&`:"",this.types&&this.types.length>0?(t+="filter[types-group][group][conjunction]=OR",this.types.forEach((e=>{t+=`&filter[${e}-filter][condition][path]=type&filter[${e}-filter][condition][value]=${e}`,t+=`&filter[${e}-filter][condition][memberOf]=types-group`})),t):this.type?`filter[type]=${this.type}&${t}`:t}makeURL(){return`${this.drupalEndpointURL}?${this.makeQueryString()}`.replace(/^(.*)\?$/,"$1")}async fetchData(t){t&&t.limit&&(this.limit=t.limit);const e=await this.fetchWithRetry(this.makeURL());if(!e.ok)throw new Error(`Failed to fetch data from ${this.makeURL()}`);const i=await e.json();return this.parseResults(i),{items:this.items,meta:this.meta}}parseResults(t){this.items=t.data?t.data.map((t=>({title:t.attributes.title,description:t.attributes.body?t.attributes.body.value:null}))):[],this.meta.totalResults=t.data&&t.data.meta?t.data.meta.count:0}}const a="https://library.virginia.edu/search/content";class n extends r{constructor(t){super(),this.drupalEndpointURL=`${this.drupalEndpointURL}`}parseResults(t){super.parseResults(t)}}class o extends t{constructor(t){super(t),this.nextClosingTime=null,this.nextOpeningTime=null,this.isOpen=null}}function l(t){return new o({id:t.lid,title:t.name,description:t.desc,link:t.url,rawDates:t.dates})}function u(t){const e=new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",year:"numeric",month:"2-digit",day:"2-digit"}),[{value:i},,{value:s},,{value:r}]=e.formatToParts(t);return`${r}-${i}-${s}`}class d extends e{constructor(t){super(),this.items=[],this.ids=[],Object.assign(this,t)}async fetchHours(t,e,i=!1){let s;e&&Math.trunc(e)>0?(s=new Date(t),s.setDate(t.getDate()+Math.trunc(e))):s=new Date(t);const r=`&from=${u(t)}&to=${u(s)}`;return this.fetchHoursData(r,t,e,i)}async fetchHoursData(t=void 0,e,i,s=!1){const r={};for(let t=0;e&&i&&t<=i;t++){const i=new Date(e);i.setDate(i.getDate()+t);const s=u(i);r[s]={status:" "}}return await this.fetchWithRetry(`${"https://cal.lib.virginia.edu/api/1.0/hours/[[calIds]]?iid=863&key=e4b27d40b7099e8e392113da2f8bf30a".replace("[[calIds]]",this.ids.join(","))}${t?`&${t}`:""}`).then((t=>t.json())).then((async t=>Promise.all(t.map((async t=>{var e,i;let a=l(t);if(a.rawDates=Object.assign({},r,null==a?void 0:a.rawDates),s&&t){const s=await import("./HoursDataExtra-02073601.js"),r=function(t){const e=new o({id:t.id,title:t.title,description:t.description,link:t.link,rawDates:t.rawDates}),i="number"==typeof e.id?e.id:void 0,s=new d({items:[e],ids:i?[i]:[]});return s}(t);a.nextClosingTime=null===(e=s.getNextClosingTime(r))||void 0===e?void 0:e.toJSDate(),a.nextOpeningTime=null===(i=s.getNextOpeningTime(r))||void 0===i?void 0:i.toJSDate(),a.isOpen=s.isOpenNow(r)}return a})))))}}var h=Object.freeze({__proto__:null,HoursData:d,parseHours:l});class c extends n{constructor(){super(...arguments),this.type="library",this.items=[]}parseResults(t){this.items=t.data.map(s)}async getLibrary(t,e=!1){return(this.items&&this.items.length>0?Promise.resolve(this.items):this.fetchData()).then((e=>{if(e){return this.items.find((e=>e.slug===t))}return null})).then((i=>e&&i?this.getChildren(t).then((()=>i)):i))}async getChildren(t){return this.getLibrary(t).then((t=>t?(t.children||(t.children=this.items.filter((e=>e.parent===t.id))),t.children):null))}async fetchHours(t=new Date,e,i){return i||(i=this.items.map((t=>t.hoursId)).filter((t=>null!==t)).map((t=>parseInt(t,10)))),new d({ids:i}).fetchHours(t,e).then((t=>{this.items.forEach((e=>{if(e.hoursId){console.log("hours"),console.log(t);const i=t.find((t=>parseInt(t.id,10)===parseInt(e.hoursId,10)));i?e.setHours(i):console.warn(`No matching hours found for library with hoursId: ${e.hoursId}`)}}))}))}}export{n as D,i as L,a as W,c as a,s as p};