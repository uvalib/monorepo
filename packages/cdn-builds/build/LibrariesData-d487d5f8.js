import{G as t}from"./GeneralSearchResult-331b56d5.js";import{G as i}from"./ArticlesData-22a8170a.js";class e extends t{setHours(t){if(!t)throw new Error("Invalid Hours object provided.");this.hours=t}getHoursCalIds(){let t=[];if(this.hoursId){const i=parseInt(this.hoursId);if(isNaN(i))throw new Error(`Invalid hoursId value: ${this.hoursId}`);t.push(i)}return this.children&&this.children.forEach((i=>{if(i.hoursId){const e=parseInt(i.hoursId);if(isNaN(e))throw new Error(`Invalid hoursId value for child: ${i.hoursId}`);t.push(e)}})),t}async fetchHours(){if(!this.hoursId)throw new Error("hoursId is undefined")}constructor(t){super(t)}async getChildren(){}async getParent(){}}function r(t){var i,r,s,a,n,o,l,d,u,h;if(!t||!t.id||!t.attributes.title)throw new Error("Invalid library data provided.");return new e({id:t.id,uuid:t.id,title:t.attributes.title,body:null===(i=t.attributes.body)||void 0===i?void 0:i.processed,description:null===(r=t.attributes.body)||void 0===r?void 0:r.processed,shortTitle:t.attributes.field_short_title,placeType:t.attributes.field_type_basic,contactForm:t.attributes.field_contact_form,donorDescription:t.attributes.field_donor_description,donorTitle:t.attributes.field_donor_title,emailAddress:t.attributes.field_email_address,hoursInformation:t.attributes.field_hours_information,hoursId:t.attributes.field_libcal_id,libraryFeed:t.attributes.field_library_feed,link:null===(s=t.attributes.field_library_site_link)||void 0===s?void 0:s.uri,siteLink:{title:null!==(n=null===(a=t.attributes.field_library_site_link)||void 0===a?void 0:a.uri)&&void 0!==n?n:"",uri:null!==(l=null===(o=t.attributes.field_library_site_link)||void 0===o?void 0:o.uri.replace("internal:","https://www.library.virginia.edu"))&&void 0!==l?l:""},fmKey:t.attributes.field_location_key,location:t.attributes.field_fm_location?{lat:t.attributes.field_fm_location.lat,lng:t.attributes.field_fm_location.lng}:void 0,mygroupId:t.attributes.field_mygroup_id,phoneNumber:t.attributes.field_phone_number,socialMedia:null===(d=t.attributes.field_social_media)||void 0===d?void 0:d.map((t=>({uri:t.uri,title:t.title}))),slug:t.attributes.field_slug,zipCode:t.attributes.field_zip_code,googleMyBusiness:t.attributes.field_google_my_business,parent:null===(h=null===(u=t.relationships.field_parent)||void 0===u?void 0:u.data)||void 0===h?void 0:h.id,closureOverride:t.attributes.field_closure_override,priorityPlacement:t.attributes.field_priority_placement})}class s extends i{constructor(t){super(),this.drupalEndpointURL=window&&window.location&&window.location.hostname&&("library.virginia.edu"===window.location.hostname||"www.library.virginia.edu"===window.location.hostname||"library-drupal-dev-1.internal.lib.virginia.edu"===window.location.hostname||"library-drupal-dev.internal.lib.virginia.edu"===window.location.hostname)?"/jsonapi/":"https://api.library.virginia.edu/drupal/jsonapi/",this.type="",this.types=[]}makeQueryString(){let t=this.query?`filter[fulltext]=${this.query}&`:"";return t+=this.limit?`page[limit]=${this.limit}&`:"",this.types&&this.types.length>0?(t+="filter[types-group][group][conjunction]=OR",this.types.forEach((i=>{t+=`&filter[${i}-filter][condition][path]=type&filter[${i}-filter][condition][value]=${i}`,t+=`&filter[${i}-filter][condition][memberOf]=types-group`})),t):this.type?`filter[type]=${this.type}&${t}`:t}makeURL(){return`${this.drupalEndpointURL}?${this.makeQueryString()}`.replace(/^(.*)\?$/,"$1")}async fetchData(t){t&&t.limit&&(this.limit=t.limit);const i=await this.fetchWithRetry(this.makeURL());if(!i.ok)throw new Error(`Failed to fetch data from ${this.makeURL()}`);const e=await i.json();return this.parseResults(e),{items:this.items,meta:this.meta}}parseResults(t){this.items=t.data?t.data.map((t=>({title:t.attributes.title,description:t.attributes.body?t.attributes.body.value:null}))):[],this.meta.totalResults=t.data&&t.data.meta?t.data.meta.count:0}}const a="https://library.virginia.edu/search/content";class n extends s{constructor(t){super(),this.drupalEndpointURL=`${this.drupalEndpointURL}index/default_index`}parseResults(t){super.parseResults(t)}}class o extends t{constructor(t){super(t)}}function l(t){const i=new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",year:"numeric",month:"2-digit",day:"2-digit"}),[{value:e},,{value:r},,{value:s}]=i.formatToParts(t);return`${s}-${e}-${r}`}class d extends i{constructor(t){super(),this.items=[],this.ids=[],Object.assign(this,t)}async fetchHours(t,i){let e;i&&Math.trunc(i)>0?(e=new Date(t),e.setDate(t.getDate()+Math.trunc(i))):e=new Date(t);const r=`&from=${l(t)}&to=${l(e)}`;return this.fetchData(r,t,i)}async fetchData(t=void 0,i,e){const r={};for(let t=0;i&&e&&t<=e;t++){const e=new Date(i);e.setDate(e.getDate()+t);const s=l(e);r[s]={status:" "}}return await this.fetchWithRetry(`${"https://cal.lib.virginia.edu/api/1.0/hours/[[calIds]]?iid=863&key=e4b27d40b7099e8e392113da2f8bf30a".replace("[[calIds]]",this.ids.join(","))}${t?`&${t}`:""}`).then((t=>t.json())).then((t=>t.map((t=>(t=function(t){return new o({id:t.lid,title:t.name,description:t.desc,link:t.url,rawDates:t.dates})}(t),t.rawDates=Object.assign({},r,t.rawDates),t)))))}}class u extends n{constructor(){super(...arguments),this.type="library",this.items=[]}parseResults(t){this.items=t.data.map(r)}async getLibrary(t,i=!1){return(this.items&&this.items.length>0?Promise.resolve(this.items):this.fetchData()).then((i=>{if(i){return this.items.find((i=>i.slug===t))}return null})).then((e=>i&&e?this.getChildren(t).then((()=>e)):e))}async getChildren(t){return this.getLibrary(t).then((t=>t?(t.children||(t.children=this.items.filter((i=>i.parent===t.id))),t.children):null))}async fetchHours(t=new Date,i,e){return e||(e=this.items.map((t=>t.hoursId)).filter((t=>null!==t)).map((t=>parseInt(t,10)))),new d({ids:e}).fetchHours(t,i).then((t=>{this.items.forEach((i=>{if(i.hoursId){const e=t.find((t=>parseInt(t.id,10)===parseInt(i.hoursId,10)));e?i.setHours(e):console.warn(`No matching hours found for library with hoursId: ${i.hoursId}`)}}))}))}}export{n as D,e as L,a as W,u as a,r as p};