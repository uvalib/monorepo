import{a as t,b as i,y as e}from"./2ce5e5c8.js";import{G as s}from"./7a7ec51d.js";import{B as r}from"./908d7932.js";class a{setHours(t){this.hours=t}constructor(t){Object.assign(this,t)}}function l(t){var i,e;return new a({id:t.id,uuid:t.id,title:t.attributes.title,body:t.attributes.body.processed,description:t.attributes.body.processed,shortTitle:t.attributes.field_short_title,placeType:t.attributes.field_type_basic,contactForm:t.attributes.field_contact_form,donorDescription:t.attributes.field_donor_description,donorTitle:t.attributes.field_donor_title,emailAddress:t.attributes.field_email_address,hoursInformation:t.attributes.field_hours_information,hoursId:t.attributes.field_libcal_id,libraryFeed:t.attributes.field_library_feed,link:null===(i=t.attributes.field_library_site_link)||void 0===i?void 0:i.uri,siteLink:null===(e=t.attributes.field_library_site_link)||void 0===e?void 0:e.uri,fmKey:t.attributes.field_location_key,location:t.attributes.field_fm_location?{lat:t.attributes.field_fm_location.lat,lng:t.attributes.field_fm_location.lng}:null,mygroupId:t.attributes.field_mygroup_id,phoneNumber:t.attributes.field_phone_number,socialMedia:t.attributes.field_social_media?t.attributes.field_social_media.map((t=>({uri:t.uri,title:t.title}))):null,slug:t.attributes.field_slug,zipCode:t.attributes.field_zip_code,googleMyBusiness:t.attributes.field_google_my_business,parent:t.attributes.field_parent&&t.attributes.field_parent.data&&t.attributes.field_parent.data.id?t.attributes.field_parent.data.id:null,closureOverride:t.attributes.field_closure_override})}const o="https://library.virginia.edu/search/content";class n{constructor(){this.query="",this.limit=25,this.type="",this.types=[],this.items=[],this.meta={totalResults:0}}makeQueryString(){if(this.types&&this.types.length>0){let t=this.query?`filter[fulltext]=${this.query}&`:"";return t+=this.limit?`page[limit]=${this.limit}&`:"",t+="filter[types-group][group][conjunction]=OR",this.types.forEach((i=>{t+=`&filter[${i}-filter][condition][path]=type&filter[${i}-filter][condition][value]=${i}`,t+=`&filter[${i}-filter][condition][memberOf]=types-group`})),t}return`${this.query?`filter[fulltext]=${this.query}&`:""}${this.type?`filter[type]=${this.type}&page[limit]=${this.limit}`:""}`}makeURL(){return`https://api.library.virginia.edu/drupal/jsonapi/index/default_index?${this.makeQueryString()}`}async fetchData(t){return t&&t.limit&&(this.limit=t.limit),fetch(this.makeURL()).then((t=>t.json())).then((t=>(this._parseResults(t),{items:this.items,meta:this.meta})))}_parseResults(t){this.items=t.data?t.data.map((t=>({title:t.attributes.title,description:t.attributes.body?t.attributes.body.value:null}))):[],this.meta.totalResults=t.data&&t.data.meta?t.data.meta.count:0}}class u{constructor(t){Object.assign(this,t)}}class d extends s{constructor(t){super(),this.type="hours",this.items=[],this.ids=[],Object.assign(this,t)}async fetchData(){return fetch("https://cal.lib.virginia.edu/api/1.0/hours/[[calIds]]?key=e4b27d40b7099e8e392113da2f8bf30a".replace("[[calIds]]",this.ids.join(","))).then((t=>t.json())).then((t=>(console.log(t),t.map((t=>function(t){return new u({id:t.lid,title:t.name,description:t.desc,link:t.url,rawDates:t.dates})}(t))))))}}class c extends n{constructor(){super(...arguments),this.type="library",this.items=[]}_parseResults(t){this.items=t.data.map(l)}async fetchHours(){const t=this.items.map((t=>t.hoursId)).filter((t=>null!==t)).map((t=>parseInt(t,10)));return new d({ids:t}).fetchData().then((t=>{console.log(t),this.items.forEach((i=>{i.hoursId&&i.setHours(t.find((t=>parseInt(t.id,10)===parseInt(i.hoursId,10))))})),console.log(this.items)}))}}var h;function f(t){return console.log(t),e` ${t.link?e` <div class="bento-section-title"><a href="${t.link}">${t.title}</a></div> `:e` <div class="bento-section-title"><a href="http://library.virginia.edu/hours#${t.slug}">${t.title}</a></div> `} <div class="bento-section-desc"></div> `}class p extends r{constructor(){super(),h.set(this,void 0),this.title="Libraries",t(this,h,new c,"f")}updated(t){super.updated(t),t.has("query")&&(this.loading=!0,i(this,h,"f").query=this.query,i(this,h,"f").fetchData().then((()=>{console.log(i(this,h,"f")),this.items=i(this,h,"f").items,this.loading=!1})))}renderBriefItem(t){return f(t)}}h=new WeakMap;export{n as D,a as L,o as W,p as a,l as p,f as r};