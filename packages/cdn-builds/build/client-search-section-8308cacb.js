import{x as e}from"./lit-element-9e1ac43c.js";import{a as t}from"./ArticlesData-e6785a6b.js";import{B as i,r as s}from"./BentoSection-db7960ed.js";import{G as r}from"./GeneralSearchResult-331b56d5.js";import"./query-assigned-elements-f7cc377b.js";import"./unsafe-html-9171da0a.js";import"./SiteStyle-d4ac8580.js";window.customElements.define("client-search-section",class extends i{constructor(){super(),this.meta={totalResults:0},this.filenames=[],this.staticIndexURL="/demo/searchIndex.json",this.title="UVA BOV Minutes",this.limit=5}updated(e){super.updated(e),e.has("query")&&this.performSearch()}async firstUpdated(){try{this.loading=!0;const e=await fetch(this.staticIndexURL),i=await e.json();this.filenames=i.filenames,this.index=new t({document:{id:"id",index:["content"],store:["title","year"]}});for(let e in i.index)this.index.import(e,i.index[e]);this.loading=!1,this.performSearch()}catch(e){console.error(`Error loading search index: ${e}`),this.loading=!1}}extractYearAndMonth(e){const[t,i]=e.split("-");return{year:t,month:i}}generateTitleAndDescription(e){const{year:t,month:i}=this.extractYearAndMonth(e),s=["January","February","March","April","May","June","July","August","September","October","November","December"][parseInt(i)-1];return{title:`Minutes from ${s} ${t}`,description:`Detailed minutes recorded in ${s} ${t}`}}performSearch(){if(console.log("Attempt a search"),this.query&&this.index){const e=this.index.search(this.query,{enrich:!0});console.log(e),this.items=e.flatMap((e=>e.result)).map((e=>{const t=this.filenames[parseInt(e.id)],{title:i,description:s}=this.generateTitleAndDescription(t);return new r({id:t,title:i,description:s,link:`/minutes/${t.replace(".md","")}`})}))}else this.items=[]}renderBriefItem(e){return s({link:e.filename,title:e.title,description:e.year})}render(){return e`
      <div class="bs-results--header">
      </div>

      <div class="bs-results--body">
          ${this.loading?e`<site-spinner></site-spinner>`:e`
            <p id="no-results" ?hidden="${!this.isEmptySearch||this.loading}">${this.noResultDescribe}</p>
          `}

            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">
              ${this.items.map((t=>e`
                <li class="bs-results--list--entry">
                  <a href="${t.link?t.link:""}" class="bento-section-title">${t.title}</a>
                  ${t.description?e`
                    <div class="bento-section-desc">${t.description}</div>
                  `:""}
                </li>
              `))}
            </ol>
      </div>
    `}});
