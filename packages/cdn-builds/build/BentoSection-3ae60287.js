import{i as e,_ as i,e as t,s as o,x as n}from"./query-assigned-elements-23ba9e4f.js";import{o as r}from"./unsafe-html-b3407b2c.js";import{S as a}from"./SiteStyle-86c89e81.js";var s=e`
    :host {
        --bento-section-padding: 25px;
        --bento-section-border-color: black;
        --bento-section-border-width: 1px;
        --bento-section-border-radius: 16px;
    }

    :host {
        display: block;
        padding: var(--bento-section-padding);
        color: var(--uva-text-color-base, #000);
        border: var(--bento-section-border-width) solid var(--bento-section-border-color);
        border-radius: var(--bento-section-border-radius);
    }

    [hidden] {
        display: none;
    }
`;class d extends o{constructor(){super(),this.message="",this.overlay=!1,this.book=!1,this.role="status",this.message?this.label=this.message:this.label="loading"}render(){return n`
        <div class="${this.overlay?"v4-spinner-overlay":"v4-spinner embed"}" aria-hidden="true">
          <div class="${this.overlay?"v4-spinner "+(this.book?"border":""):""}">
            ${this.book?n`
              <div class="book">
                <div class="book-page"></div>
                <div class="book-page"></div>
                <div class="book-page"></div>
                <p>${this.message?this.message:"Searching"}...</p>
              </div>             
            `:n`
              ${this.message?n`<h3>${this.message}</h3>`:""}              
              <div class="spinner-animation">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
              </div>                         
            `}
          </div>
        </div>  
      `}}function l(e){return n`
      ${e.link?n`
        <div class="bento-section-title"><a href="${e.link}">${r(e.title)}</a></div>
      `:n`
        <div class="bento-section-title">${r(e.title)}</div>
      `}
      <div class="bento-section-desc">${r(e.description)}</div>
    `}d.styles=e`
    :host {
      display: block;
    }

    .spinner-animation > div {
      background-color: var(--site-spinner-color, var(--uvalib-brand-orange-base, orange));
      height: var(--site-spinner-size, 18px);
      width: var(--site-spinner-size, 18px);
    }

    div.v4-spinner-overlay {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      background: var(--site-spinner-overlay-background, rgba(0, 0, 0, 0.1));
    }

    div.v4-spinner {
      background: white;
      margin: 12vw auto;
      text-align: center;
      padding: 10px 150px 25px 150px;
      display: inline-block;
      font-weight: bold;
      color: var(--uva-text-color-base);
      box-shadow: var(--box-shadow);
    }

    div.v4-spinner.embed {
      box-shadow: none;
      padding: 0;
      margin: 0;
      background: transparent;
    }

    @media only screen and (min-width: 768px) {
      div.v4-spinner {
        padding: 40px 90px;
      }
    }

    @media only screen and (max-width: 768px) {
      div.v4-spinner {
        width: 95%;
        padding: 40px 0;
        margin-top: 30%;
      }
    }

    div.v4-spinner h1 {
      color: var(--uva-text-color-base);
      border: none;
    }

    .spinner-animation {
      margin: 0 auto;
      width: 80px;
      text-align: center;
    }

    .spinner-animation > div {
      width: 18px;
      height: 18px;
      border-radius: 100%;
      display: inline-block;
      -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
      animation: sk-bouncedelay 1.4s infinite ease-in-out both;
      margin: 0 2px;
    }

    .spinner-animation .bounce1 {
      -webkit-animation-delay: -0.32s;
      animation-delay: -0.32s;
    }

    .spinner-animation .bounce2 {
      -webkit-animation-delay: -0.16s;
      animation-delay: -0.16s;
    }

    @-webkit-keyframes sk-bouncedelay {
      0%, 80%, 100% { -webkit-transform: scale(0) }
      40% { -webkit-transform: scale(1.0) }
    }
    @keyframes sk-bouncedelay {
      0%, 80%, 100% {
        -webkit-transform: scale(0);
        transform: scale(0);
      } 40% {
        -webkit-transform: scale(1.0);
        transform: scale(1.0);
      }
    }

    /**  PAGE FLIP ANIMATION **/
    .book {
      top: 50%;
      transform: translateY(-4%);
      position: relative;
      margin: 0 auto;
      border: 5px solid var(--uvalib-brand-orange-base);
      width: 140px;
      height: 80px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: center;
      align-content: stretch;
      align-items: center;
    }

    .book-page {
      position: absolute;
      left: 50%;
      top: -5px;
      margin: 0 auto;
      border-top: 5px solid var(--uvalib-brand-orange-base);
      border-bottom: 5px solid var(--uvalib-brand-orange-base);
      border-right: 5px solid var(--uvalib-brand-orange-base);
      background: #fff;
      width: 70px;
      height: 80px;
      transform-origin: 0% 50%;
      animation: flip 1.2s infinite linear;
      animation-fill-mode: forwards;
    }

    .book-page:nth-child(1) {
      z-index: -1;
      animation-delay: 0s;
    }

    .book-page:nth-child(2) {
      z-index: -2;
      animation-delay: 0.5s;
    }

    .book-page:nth-child(3) {
      z-index: -3;
      animation-delay: 1s;
    }

    div.v4-spinner .book p {
      color: var(--uva-text-color-base, black);
      border: none;
      font-size: 1.25em;
      margin: 0 0 10px 0;
    }

    @keyframes flip {
      0% {
          transform: perspective(600px) rotateY(0deg);
      }
      20% {
        background: #e6e6e6;
      }
      29.9% {
        background: #e6e6e6;
      }
      30% {
        transform: perspective(200px) rotateY(-90deg);
        background: #fff;
      }
      54.999% {
        opacity: 1;
      }
      55% {
        opacity: 0;
      }
      60% {
        transform: perspective(200px) rotateY(-180deg);
        background: #fff;
      }
      100% {
        transform: perspective(200px) rotateY(-180deg);
        background: #fff;
      }
    }
  `,i([t({type:String})],d.prototype,"message",void 0),i([t({type:Boolean})],d.prototype,"overlay",void 0),i([t({type:Boolean})],d.prototype,"book",void 0),i([t({type:String,reflect:!0})],d.prototype,"role",void 0),i([t({type:String,reflect:!0,attribute:"aria-label"})],d.prototype,"label",void 0),window.customElements.define("site-spinner",d);class p extends a{constructor(){super(...arguments),this.query="",this.limit=0,this.title="",this.label="",this.items=[],this.loading=!1,this.noResultDescribe="",this.isEmptySearch=!0}static get styles(){return[...super.styles,s]}updated(e){(e.has("items")||e.has("loading"))&&(this.isEmptySearch=this.loading||!this.items||0===this.items.length)}renderBriefItem(e){return l(e)}limitTitle(e){return this.maxTitleLength&&e&&e.length>=this.maxTitleLength?`${e.substring(0,this.maxTitleLength)}…`:e}render(){return n`
      <h1>${this.limitTitle(this.title)}</h1>
      <h2 ?hidden="${this.loading}">${this.label?this.label:`Search for ${this.query}`}</h2>
      ${this.loading?n`<site-spinner></site-spinner>`:""}
      <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe?this.noResultDescribe:`No results found for "${this.query}"`}</p>
      <ul ?hidden="${this.loading}">
        ${this.items.map((e=>n`
          <li>
            ${this.renderBriefItem(e)}
          </li>
        `))}
      </ul>
    `}}i([t({type:String})],p.prototype,"query",void 0),i([t({type:Number})],p.prototype,"limit",void 0),i([t({type:String})],p.prototype,"title",void 0),i([t({type:Number,attribute:"max-title-length"})],p.prototype,"maxTitleLength",void 0),i([t({type:String})],p.prototype,"label",void 0),i([t({type:Array})],p.prototype,"items",void 0),i([t({type:Boolean})],p.prototype,"loading",void 0),i([t({type:String,attribute:"no-result-describe"})],p.prototype,"noResultDescribe",void 0),i([t({type:Boolean,attribute:"is-empty-search"})],p.prototype,"isEmptySearch",void 0);export{p as B,l as r};
