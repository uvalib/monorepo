import{G as t}from"./GeneralSearchResult-331b56d5.js";import{G as e}from"./ArticlesData-e9b81d53.js";class i extends t{setHours(t){this.hours=t}getHoursCalIds(){let t=new Array;return this.hoursId&&t.push(parseInt(this.hoursId)),this.children&&this.children.forEach((e=>{e.hoursId&&t.push(parseInt(e.hoursId))})),t}async fetchHours(){if(!this.hoursId)throw new Error("hoursId is undefined")}constructor(t){super(t)}async getChildren(){}async getParent(){}}function s(t){var e,s,r,a;return new i({id:t.id,uuid:t.id,title:t.attributes.title,body:null===(e=t.attributes.body)||void 0===e?void 0:e.processed,description:null===(s=t.attributes.body)||void 0===s?void 0:s.processed,shortTitle:t.attributes.field_short_title,placeType:t.attributes.field_type_basic,contactForm:t.attributes.field_contact_form,donorDescription:t.attributes.field_donor_description,donorTitle:t.attributes.field_donor_title,emailAddress:t.attributes.field_email_address,hoursInformation:t.attributes.field_hours_information,hoursId:t.attributes.field_libcal_id,libraryFeed:t.attributes.field_library_feed,link:null===(r=t.attributes.field_library_site_link)||void 0===r?void 0:r.uri,siteLink:null===(a=t.attributes.field_library_site_link)||void 0===a?void 0:a.uri.replace("internal:","https://www.library.virginia.edu"),fmKey:t.attributes.field_location_key,location:t.attributes.field_fm_location?{lat:t.attributes.field_fm_location.lat,lng:t.attributes.field_fm_location.lng}:void 0,mygroupId:t.attributes.field_mygroup_id,phoneNumber:t.attributes.field_phone_number,socialMedia:t.attributes.field_social_media?t.attributes.field_social_media.map((t=>({uri:t.uri,title:t.title}))):void 0,slug:t.attributes.field_slug,zipCode:t.attributes.field_zip_code,googleMyBusiness:t.attributes.field_google_my_business,parent:t.relationships.field_parent&&t.relationships.field_parent.data&&t.relationships.field_parent.data.id?t.relationships.field_parent.data.id:void 0,closureOverride:t.attributes.field_closure_override})}class r extends e{constructor(t){super(),this.drupalEndpointURL=window&&window.location&&window.location.hostname&&("library.virginia.edu"===window.location.hostname||"www.library.virginia.edu"===window.location.hostname||"library-drupal-dev-1.internal.lib.virginia.edu"===window.location.hostname)?"/jsonapi/":"https://api.library.virginia.edu/drupal/jsonapi/",this.type="",this.types=[]}makeQueryString(){let t=this.query?`filter[fulltext]=${this.query}&`:"";return t+=this.limit?`page[limit]=${this.limit}&`:"",this.types&&this.types.length>0?(t+="filter[types-group][group][conjunction]=OR",this.types.forEach((e=>{t+=`&filter[${e}-filter][condition][path]=type&filter[${e}-filter][condition][value]=${e}`,t+=`&filter[${e}-filter][condition][memberOf]=types-group`})),t):this.type?`filter[type]=${this.type}&${t}`:t}makeURL(){return`${this.drupalEndpointURL}?${this.makeQueryString()}`.replace(/^(.*)\?$/,"$1")}async fetchData(t){t&&t.limit&&(this.limit=t.limit);const e=await this.fetchWithRetry(this.makeURL());if(!e.ok)throw new Error(`Failed to fetch data from ${this.makeURL()}`);const i=await e.json();return this.parseResults(i),{items:this.items,meta:this.meta}}parseResults(t){this.items=t.data?t.data.map((t=>({title:t.attributes.title,description:t.attributes.body?t.attributes.body.value:null}))):[],this.meta.totalResults=t.data&&t.data.meta?t.data.meta.count:0}}const a="https://library.virginia.edu/search/content";class n extends r{constructor(t){super(),this.drupalEndpointURL=`${this.drupalEndpointURL}index/default_index`}parseResults(t){super.parseResults(t)}}class o extends t{constructor(t){super(t)}}function l(t){const e=new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",year:"numeric",month:"2-digit",day:"2-digit"}),[{value:i},,{value:s},,{value:r}]=e.formatToParts(t);return`${r}-${i}-${s}`}class d extends e{constructor(t){super(),this.items=[],this.ids=[],Object.assign(this,t)}async fetchHours(t,e){let i;e&&Math.trunc(e)>0?(i=new Date(t),i.setDate(t.getDate()+Math.trunc(e))):i=new Date(t);const s=`&from=${l(t)}&to=${l(i)}`;return this.fetchData(s,t,e)}async fetchData(t=void 0,e,i){const s={};for(let t=0;e&&i&&t<=i;t++){const i=new Date(e);i.setDate(i.getDate()+t);const r=l(i);s[r]={status:" "}}return await this.fetchWithRetry(`${"https://cal.lib.virginia.edu/api/1.0/hours/[[calIds]]?iid=863&key=e4b27d40b7099e8e392113da2f8bf30a".replace("[[calIds]]",this.ids.join(","))}${t?`&${t}`:""}`).then((t=>t.json())).then((t=>t.map((t=>(t=function(t){return new o({id:t.lid,title:t.name,description:t.desc,link:t.url,rawDates:t.dates})}(t),t.rawDates=Object.assign({},s,t.rawDates),t)))))}}class u extends n{constructor(){super(...arguments),this.type="library",this.items=[]}parseResults(t){this.items=t.data.map(s)}async getLibrary(t,e=!1){return(this.items&&this.items.length>0?Promise.resolve(this.items):this.fetchData()).then((e=>{if(e){return this.items.find((e=>e.slug===t))}return null})).then((i=>e&&i?this.getChildren(t).then((()=>i)):i))}async getChildren(t){return this.getLibrary(t).then((t=>t?(t.children||(t.children=this.items.filter((e=>e.parent===t.id))),t.children):null))}async fetchHours(t=new Date,e,i){return i||(i=this.items.map((t=>t.hoursId)).filter((t=>null!==t)).map((t=>parseInt(t,10)))),new d({ids:i}).fetchHours(t,e).then((t=>{this.items.forEach((e=>{e.hoursId&&e.setHours(t.find((t=>parseInt(t.id,10)===parseInt(e.hoursId,10))))}))}))}}export{n as D,i as L,a as W,u as a,s as p};