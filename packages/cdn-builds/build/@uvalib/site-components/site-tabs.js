import{s as t}from"../../SiteStyleMapping-e54fbdcc.js";import{h as e,F as a,_ as i,a as s,o,c as r,r as n,t as c,u as l,n as d,e as h,E as b,f as v,a1 as u,s as p,B as g,M as f,q as m,a2 as I,a3 as x,a4 as $,a5 as T,a6 as w,w as y,v as k,d as A,p as j}from"../../fast-design-system-d046069d.js";import{d as C}from"../../display-058af2ce.js";import{h as z,d as P}from"../../size-8b386e71.js";import{f as E,S as R}from"../../match-media-stylesheet-behavior-575be983.js";import{s as B,r as H,e as F,u as D,w as L,a as O,S}from"../../strings-197a3030.js";import{s as N,b as K,c as M,g as q,h as G,k as X,a as Y,m as _}from"../../focus-3563f905.js";import{w as J}from"../../when-46682a8a.js";class Q extends a{}i([s({mode:"boolean"})],Q.prototype,"disabled",void 0);const U="horizontal";class V extends a{constructor(){super(...arguments),this.orientation=U,this.activeindicator=!0,this.showActiveIndicator=!0,this.prevActiveTabIndex=0,this.activeTabIndex=0,this.ticking=!1,this.change=()=>{this.$emit("change",this.activetab)},this.isDisabledElement=t=>"true"===t.getAttribute("aria-disabled"),this.isFocusableElement=t=>!this.isDisabledElement(t),this.setTabs=()=>{const t="gridColumn",e="gridRow",a=this.isHorizontal()?t:e;this.activeTabIndex=this.getActiveIndex(),this.showActiveIndicator=!1,this.tabs.forEach(((i,s)=>{if("tab"===i.slot){const t=this.activeTabIndex===s&&this.isFocusableElement(i);this.activeindicator&&this.isFocusableElement(i)&&(this.showActiveIndicator=!0);const e=this.tabIds[s],a=this.tabpanelIds[s];i.setAttribute("id",e),i.setAttribute("aria-selected",t?"true":"false"),i.setAttribute("aria-controls",a),i.addEventListener("click",this.handleTabClick),i.addEventListener("keydown",this.handleTabKeyDown),i.setAttribute("tabindex",t?"0":"-1"),t&&(this.activetab=i)}i.style[t]="",i.style[e]="",i.style[a]=`${s+1}`,this.isHorizontal()?i.classList.remove("vertical"):i.classList.add("vertical")}))},this.setTabPanels=()=>{this.tabpanels.forEach(((t,e)=>{const a=this.tabIds[e],i=this.tabpanelIds[e];t.setAttribute("id",i),t.setAttribute("aria-labelledby",a),this.activeTabIndex!==e?t.setAttribute("hidden",""):t.removeAttribute("hidden")}))},this.handleTabClick=t=>{const e=t.currentTarget;1===e.nodeType&&this.isFocusableElement(e)&&(this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=this.tabs.indexOf(e),this.setComponent())},this.handleTabKeyDown=t=>{if(this.isHorizontal())switch(t.key){case M:t.preventDefault(),this.adjustBackward(t);break;case K:t.preventDefault(),this.adjustForward(t)}else switch(t.key){case G:t.preventDefault(),this.adjustBackward(t);break;case q:t.preventDefault(),this.adjustForward(t)}switch(t.key){case Y:t.preventDefault(),this.adjust(-this.activeTabIndex);break;case X:t.preventDefault(),this.adjust(this.tabs.length-this.activeTabIndex-1)}},this.adjustForward=t=>{const e=this.tabs;let a=0;for(a=this.activetab?e.indexOf(this.activetab)+1:1,a===e.length&&(a=0);a<e.length&&e.length>1;){if(this.isFocusableElement(e[a])){this.moveToTabByIndex(e,a);break}if(this.activetab&&a===e.indexOf(this.activetab))break;a+1>=e.length?a=0:a+=1}},this.adjustBackward=t=>{const e=this.tabs;let a=0;for(a=this.activetab?e.indexOf(this.activetab)-1:0,a=a<0?e.length-1:a;a>=0&&e.length>1;){if(this.isFocusableElement(e[a])){this.moveToTabByIndex(e,a);break}a-1<0?a=e.length-1:a-=1}},this.moveToTabByIndex=(t,e)=>{const a=t[e];this.activetab=a,this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=e,a.focus(),this.setComponent()}}orientationChanged(){this.$fastController.isConnected&&(this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}activeidChanged(t,e){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.prevActiveTabIndex=this.tabs.findIndex((e=>e.id===t)),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabsChanged(){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabpanelsChanged(){this.$fastController.isConnected&&this.tabpanels.length<=this.tabs.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}getActiveIndex(){return void 0!==this.activeid?-1===this.tabIds.indexOf(this.activeid)?0:this.tabIds.indexOf(this.activeid):0}getTabIds(){return this.tabs.map((t=>{var e;return null!==(e=t.getAttribute("id"))&&void 0!==e?e:`tab-${D()}`}))}getTabPanelIds(){return this.tabpanels.map((t=>{var e;return null!==(e=t.getAttribute("id"))&&void 0!==e?e:`panel-${D()}`}))}setComponent(){this.activeTabIndex!==this.prevActiveTabIndex&&(this.activeid=this.tabIds[this.activeTabIndex],this.focusTab(),this.change())}isHorizontal(){return this.orientation===U}handleActiveIndicatorPosition(){this.showActiveIndicator&&this.activeindicator&&this.activeTabIndex!==this.prevActiveTabIndex&&(this.ticking?this.ticking=!1:(this.ticking=!0,this.animateActiveIndicator()))}animateActiveIndicator(){this.ticking=!0;const t=this.isHorizontal()?"gridColumn":"gridRow",e=this.isHorizontal()?"translateX":"translateY",a=this.isHorizontal()?"offsetLeft":"offsetTop",i=this.activeIndicatorRef[a];this.activeIndicatorRef.style[t]=`${this.activeTabIndex+1}`;const s=this.activeIndicatorRef[a];this.activeIndicatorRef.style[t]=`${this.prevActiveTabIndex+1}`;const o=s-i;this.activeIndicatorRef.style.transform=`${e}(${o}px)`,this.activeIndicatorRef.classList.add("activeIndicatorTransition"),this.activeIndicatorRef.addEventListener("transitionend",(()=>{this.ticking=!1,this.activeIndicatorRef.style[t]=`${this.activeTabIndex+1}`,this.activeIndicatorRef.style.transform=`${e}(0px)`,this.activeIndicatorRef.classList.remove("activeIndicatorTransition")}))}adjust(t){this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=L(0,this.tabs.length-1,this.activeTabIndex+t),this.setComponent()}focusTab(){this.tabs[this.activeTabIndex].focus()}connectedCallback(){super.connectedCallback(),this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.activeTabIndex=this.getActiveIndex()}}i([s],V.prototype,"orientation",void 0),i([s],V.prototype,"activeid",void 0),i([o],V.prototype,"tabs",void 0),i([o],V.prototype,"tabpanels",void 0),i([s({mode:"boolean"})],V.prototype,"activeindicator",void 0),i([o],V.prototype,"activeIndicatorRef",void 0),i([o],V.prototype,"showActiveIndicator",void 0),O(V,S);const W=(t,e)=>r`
        ${C("grid")} :host {
            box-sizing: border-box;
            font-family: ${n};
            font-size: ${c};
            line-height: ${l};
            color: ${d};
            grid-template-columns: auto 1fr auto;
            grid-template-rows: auto 1fr;
        }

        .tablist {
            display: grid;
            grid-template-rows: auto auto;
            grid-template-columns: auto;
            position: relative;
            width: max-content;
            align-self: end;
            padding: calc(${h} * 4px) calc(${h} * 4px) 0;
            box-sizing: border-box;
        }

        .start,
        .end {
            align-self: center;
        }

        .activeIndicator {
            grid-row: 2;
            grid-column: 1;
            width: 100%;
            height: 5px;
            justify-self: center;
            background: ${b};
            margin-top: 10px;
            border-radius: calc(${v} * 1px)
                calc(${v} * 1px) 0 0;
        }

        .activeIndicatorTransition {
            transition: transform 0.2s ease-in-out;
        }

        .tabpanel {
            grid-row: 2;
            grid-column-start: 1;
            grid-column-end: 4;
            position: relative;
        }

        :host([orientation="vertical"]) {
            grid-template-rows: auto 1fr auto;
            grid-template-columns: auto 1fr;
        }

        :host([orientation="vertical"]) .tablist {
            grid-row-start: 2;
            grid-row-end: 2;
            display: grid;
            grid-template-rows: auto;
            grid-template-columns: auto 1fr;
            position: relative;
            width: max-content;
            justify-self: end;
            align-self: flex-start;
            width: 100%;
            padding: 0 calc(${h} * 4px)
                calc((${z} - ${h}) * 1px) 0;
        }

        :host([orientation="vertical"]) .tabpanel {
            grid-column: 2;
            grid-row-start: 1;
            grid-row-end: 4;
        }

        :host([orientation="vertical"]) .end {
            grid-row: 3;
        }

        :host([orientation="vertical"]) .activeIndicator {
            grid-column: 1;
            grid-row: 1;
            width: 5px;
            height: 100%;
            margin-inline-end: 10px;
            align-self: center;
            background: ${b};
            margin-top: 0;
            border-radius: 0 calc(${v} * 1px)
                calc(${v} * 1px) 0;
        }

        :host([orientation="vertical"]) .activeIndicatorTransition {
            transition: transform 0.2s linear;
        }
    `.withBehaviors(E(r`
                .activeIndicator,
                :host([orientation="vertical"]) .activeIndicator {
                    forced-color-adjust: none;
                    background: ${R.Highlight};
                }
            `)),Z=(t,e)=>r`
    ${C("inline-flex")} :host {
        box-sizing: border-box;
        font-family: ${n};
        font-size: ${c};
        line-height: ${l};
        height: calc(${z} * 1px);
        padding: calc(${h} * 5px) calc(${h} * 4px);
        color: ${u};
        fill: currentcolor;
        border-radius: calc(${v} * 1px);
        border: calc(${p} * 1px) solid transparent;
        align-items: center;
        justify-content: center;
        grid-row: 1;
        cursor: pointer;
    }

    :host(:hover) {
        color: ${d};
        fill: currentcolor;
    }

    :host(:active) {
        color: ${d};
        fill: currentcolor;
    }

    :host([disabled]) {
        cursor: ${P};
        opacity: ${g};
    }

    :host([disabled]:hover) {
        color: ${u};
        background: ${f};
    }

    :host([aria-selected="true"]) {
        background: ${m};
        color: ${I};
        fill: currentcolor;
    }

    :host([aria-selected="true"]:hover) {
        background: ${x};
        color: ${$};
        fill: currentcolor;
    }

    :host([aria-selected="true"]:active) {
        background: ${T};
        color: ${w};
        fill: currentcolor;
    }

    :host(:${_}) {
        outline: none;
        border: calc(${p} * 1px) solid ${y};
        box-shadow: 0 0 0 calc((${k} - ${p}) * 1px)
            ${y};
    }

    :host(:focus) {
        outline: none;
    }

    :host(.vertical) {
        justify-content: end;
        grid-column: 2;
    }

    :host(.vertical[aria-selected="true"]) {
        z-index: 2;
    }

    :host(.vertical:hover) {
        color: ${d};
    }

    :host(.vertical:active) {
        color: ${d};
    }

    :host(.vertical:hover[aria-selected="true"]) {
    }
`.withBehaviors(E(r`
            :host {
                forced-color-adjust: none;
                border-color: transparent;
                color: ${R.ButtonText};
                fill: currentcolor;
            }
            :host(:hover),
            :host(.vertical:hover),
            :host([aria-selected="true"]:hover) {
                background: ${R.Highlight};
                color: ${R.HighlightText};
                fill: currentcolor;
            }
            :host([aria-selected="true"]) {
                background: ${R.HighlightText};
                color: ${R.Highlight};
                fill: currentcolor;
            }
            :host(:${_}) {
                border-color: ${R.ButtonText};
                box-shadow: none;
            }
            :host([disabled]),
            :host([disabled]:hover) {
                opacity: 1;
                color: ${R.GrayText};
                background: ${R.ButtonFace};
            }
        `)),tt=Q.compose({baseName:"tab",template:(t,a)=>e`
    <template slot="tab" role="tab" aria-disabled="${t=>t.disabled}">
        <slot></slot>
    </template>
`,styles:Z}),et=(t,e)=>r`
    ${C("block")} :host {
        box-sizing: border-box;
        font-size: ${c};
        line-height: ${l};
        padding: 0 calc((6 + (${h} * 2 * ${A})) * 1px);
    }
`,at=class extends a{}.compose({baseName:"tab-panel",template:(t,a)=>e`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`,styles:et}),it=V.compose({baseName:"tabs",template:(t,a)=>e`
    <template class="${t=>t.orientation}">
        ${B(t,a)}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${N("tabs")}></slot>

            ${J((t=>t.showActiveIndicator),e`
                    <div
                        ${H("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `)}
        </div>
        ${F(t,a)}
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${N("tabpanels")}></slot>
        </div>
    </template>
`,styles:W});j().withPrefix("site").register(tt({styles:(e,a)=>r`
                ${Z()}
                ${t}
                :host {
                    /* relevent styles from .uvalib-button style in current drupal theme */
                    background-color: var(--uva-blue-alt-base, lightblue);
                    color: var(--uva-white, white);
                    text-transform: uppercase;
                }
                :host([aria-selected="true"]) {
                    background-color: var(--uva-brand-blue-base, blue);
                    color: var(--uva-white, white);
                }
                :host([aria-selected="true"]:hover) {
                    background: ;
                    color: var(--uva-white, white);
                }
                :host(:hover) {
                    background-color: var(--uva-blue-alt-dark, darkblue);
                    color: var(--uva-white, white);
                }
            `}),at({styles:(e,a)=>r`
                ${et()}
                ${t}
            `}),it({styles:(e,a)=>r`
                ${W()}
                ${t}      
            `}));
