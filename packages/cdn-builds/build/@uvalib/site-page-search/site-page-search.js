import{_ as e,n as t}from"../../query-assigned-elements-8ef6cca7.js";import{i as s,s as r,x as i}from"../../lit-element-9e1ac43c.js";import{i as n}from"../../query-4707daa1.js";class a extends r{constructor(){super(...arguments),this.caseSensitive=!1,this.query="",this.queryStringParam="",this.disabled=!1,this.currentIndex=0,this.originalContent="",this.handleShortcutKey=e=>{(e.metaKey||e.ctrlKey)&&"f"===e.key&&(e.preventDefault(),this.disabled=!1,this.mark(this.query),setTimeout((()=>{this.searchInput.focus()}),10)),!e.metaKey&&!e.ctrlKey||"g"!==e.key||e.shiftKey||(e.preventDefault(),this.handleNext()),(e.metaKey||e.ctrlKey)&&"g"===e.key&&e.shiftKey&&(e.preventDefault(),this.handlePrev())}}get searchCount(){return this.results&&0!==this.results.length?`${this.currentIndex+1}/${this.results.length}`:""}connectedCallback(){super.connectedCallback(),this.storeOriginalContent(),this.updateQueryFromURL(),document.addEventListener("keydown",this.handleShortcutKey)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this.handleShortcutKey)}storeOriginalContent(){this.originalContent=this.innerHTML}updateQueryFromURL(){if(this.queryStringParam){const e=new URLSearchParams(window.location.search);e.has(this.queryStringParam)&&(this.disabled=!1,this.query=e.get(this.queryStringParam)||"",this.search(this.query))}}updateURL(){if(this.queryStringParam){const e=new URL(window.location.href),t=new URLSearchParams(e.search);this.query&&!this.disabled?t.set(this.queryStringParam,this.query):t.delete(this.queryStringParam),e.search=t.toString(),window.history.replaceState({},"",e.toString())}}handleInput(e){this.query=e.target.value,this.search(this.query),this.updateURL()}updated(e){e.has("query")&&(this.search(this.query),this.updateURL()),e.has("disabled")&&(this.updateURL(),this.disabled?this.unmark():this.mark(this.query))}mark(e){if(!e)return;this.innerHTML=this.originalContent;e.split(/\s+/).filter(Boolean).forEach((e=>{const t=new RegExp(`(${e})`,this.caseSensitive?"g":"gi"),s=e=>{if(3===e.nodeType&&e.parentNode&&"MARK"!==e.parentNode.nodeName){const s=Array.from(e.nodeValue.matchAll(t));if(s.length>0){let t=0;s.forEach((s=>{const r=s.index,i=r+s[0].length,n=e.nodeValue.slice(t,r),a=e.nodeValue.slice(r,i);n&&e.parentNode.insertBefore(document.createTextNode(n),e);const h=document.createElement("mark");h.textContent=a,e.parentNode.insertBefore(h,e),t=i}));const r=e.nodeValue.slice(t);r&&e.parentNode.insertBefore(document.createTextNode(r),e),e.parentNode.removeChild(e)}}else for(let t=0;t<e.childNodes.length;t++)s(e.childNodes[t])};s(this)})),this.results=this.querySelectorAll("mark"),this.currentIndex=0,this.jumpTo(),this.dispatchEvent(new CustomEvent("search-initiated"))}unmark(){this.querySelectorAll("mark").forEach((e=>{const t=e.parentNode;if(t){for(;e.firstChild;)t.insertBefore(e.firstChild,e);t.removeChild(e)}})),this.dispatchEvent(new CustomEvent("search-cleared"))}search(e){this.unmark(),this.mark(e)}jumpTo(){if(this.results&&this.results.length){const e=this.results[this.currentIndex];this.results.forEach((e=>e.classList.remove("current"))),e.classList.add("current"),e.scrollIntoView({behavior:"smooth",block:"center"}),this.requestUpdate()}}handleNext(){this.results&&this.results.length&&(this.currentIndex=(this.currentIndex+1)%this.results.length,this.jumpTo(),this.dispatchEvent(new CustomEvent("search-next")))}handlePrev(){this.results&&this.results.length&&(this.currentIndex=(this.currentIndex-1+this.results.length)%this.results.length,this.jumpTo(),this.dispatchEvent(new CustomEvent("search-prev")))}render(){return i`
      <div class="header" ?hidden=${this.disabled}>
        Search:
        <input type="search" .value=${this.query} @input=${this.handleInput}>
        <span>${this.searchCount}</span>
        <button @click=${this.handlePrev}>&uarr;</button>
        <button @click=${this.handleNext}>&darr;</button>
        <button @click=${()=>{this.disabled=!0}}>✖</button>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    `}}a.styles=s`
    .header {
      padding: 10px;
      width: 100%;
      background: #eee;
      position: fixed;
      top: 0;
      left: 0;
    }
    .content {
      margin-top: 50px;
    }
    .header[hidden] {
      display: none;
    }
  `,e([t({type:Boolean,attribute:"case-sensitive"})],a.prototype,"caseSensitive",void 0),e([t({type:String})],a.prototype,"query",void 0),e([t({type:String,attribute:"query-string-param"})],a.prototype,"queryStringParam",void 0),e([t({type:Boolean})],a.prototype,"disabled",void 0),e([n('input[type="search"]')],a.prototype,"searchInput",void 0),window.customElements.define("site-page-search",a);