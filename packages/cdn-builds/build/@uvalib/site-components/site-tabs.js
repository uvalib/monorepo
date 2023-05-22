import{h as t,F as e,_ as a,a as i,o as s,c as o,u as r,t as n,v as c,n as l,e as d,G as h,f as b,a2 as v,m as u,C as p,N as g,r as f,a3 as m,a4 as I,a5 as x,a6 as $,a7 as T,x as w,w as y,d as k,p as A,s as j}from"../../SiteStyleMapping-f1ccf68c.js";import{d as C}from"../../display-058af2ce.js";import{h as z,d as P}from"../../size-3ecfc7b7.js";import{f as R,S as E}from"../../match-media-stylesheet-behavior-575be983.js";import{s as H,r as B,e as F,u as D,w as L,a as O,S as N}from"../../strings-09538f4a.js";import{s as S,b as G,c as K,g as M,h as X,k as Y,a as _,m as q}from"../../focus-03f3e890.js";import{w as J}from"../../when-46682a8a.js";class Q extends e{}a([i({mode:"boolean"})],Q.prototype,"disabled",void 0);const U="horizontal";class V extends e{constructor(){super(...arguments),this.orientation=U,this.activeindicator=!0,this.showActiveIndicator=!0,this.prevActiveTabIndex=0,this.activeTabIndex=0,this.ticking=!1,this.change=()=>{this.$emit("change",this.activetab)},this.isDisabledElement=t=>"true"===t.getAttribute("aria-disabled"),this.isFocusableElement=t=>!this.isDisabledElement(t),this.setTabs=()=>{const t="gridColumn",e="gridRow",a=this.isHorizontal()?t:e;this.activeTabIndex=this.getActiveIndex(),this.showActiveIndicator=!1,this.tabs.forEach(((i,s)=>{if("tab"===i.slot){const t=this.activeTabIndex===s&&this.isFocusableElement(i);this.activeindicator&&this.isFocusableElement(i)&&(this.showActiveIndicator=!0);const e=this.tabIds[s],a=this.tabpanelIds[s];i.setAttribute("id",e),i.setAttribute("aria-selected",t?"true":"false"),i.setAttribute("aria-controls",a),i.addEventListener("click",this.handleTabClick),i.addEventListener("keydown",this.handleTabKeyDown),i.setAttribute("tabindex",t?"0":"-1"),t&&(this.activetab=i)}i.style[t]="",i.style[e]="",i.style[a]=`${s+1}`,this.isHorizontal()?i.classList.remove("vertical"):i.classList.add("vertical")}))},this.setTabPanels=()=>{this.tabpanels.forEach(((t,e)=>{const a=this.tabIds[e],i=this.tabpanelIds[e];t.setAttribute("id",i),t.setAttribute("aria-labelledby",a),this.activeTabIndex!==e?t.setAttribute("hidden",""):t.removeAttribute("hidden")}))},this.handleTabClick=t=>{const e=t.currentTarget;1===e.nodeType&&this.isFocusableElement(e)&&(this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=this.tabs.indexOf(e),this.setComponent())},this.handleTabKeyDown=t=>{if(this.isHorizontal())switch(t.key){case K:t.preventDefault(),this.adjustBackward(t);break;case G:t.preventDefault(),this.adjustForward(t)}else switch(t.key){case X:t.preventDefault(),this.adjustBackward(t);break;case M:t.preventDefault(),this.adjustForward(t)}switch(t.key){case _:t.preventDefault(),this.adjust(-this.activeTabIndex);break;case Y:t.preventDefault(),this.adjust(this.tabs.length-this.activeTabIndex-1)}},this.adjustForward=t=>{const e=this.tabs;let a=0;for(a=this.activetab?e.indexOf(this.activetab)+1:1,a===e.length&&(a=0);a<e.length&&e.length>1;){if(this.isFocusableElement(e[a])){this.moveToTabByIndex(e,a);break}if(this.activetab&&a===e.indexOf(this.activetab))break;a+1>=e.length?a=0:a+=1}},this.adjustBackward=t=>{const e=this.tabs;let a=0;for(a=this.activetab?e.indexOf(this.activetab)-1:0,a=a<0?e.length-1:a;a>=0&&e.length>1;){if(this.isFocusableElement(e[a])){this.moveToTabByIndex(e,a);break}a-1<0?a=e.length-1:a-=1}},this.moveToTabByIndex=(t,e)=>{const a=t[e];this.activetab=a,this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=e,a.focus(),this.setComponent()}}orientationChanged(){this.$fastController.isConnected&&(this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}activeidChanged(t,e){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.prevActiveTabIndex=this.tabs.findIndex((e=>e.id===t)),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabsChanged(){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabpanelsChanged(){this.$fastController.isConnected&&this.tabpanels.length<=this.tabs.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}getActiveIndex(){return void 0!==this.activeid?-1===this.tabIds.indexOf(this.activeid)?0:this.tabIds.indexOf(this.activeid):0}getTabIds(){return this.tabs.map((t=>{var e;return null!==(e=t.getAttribute("id"))&&void 0!==e?e:`tab-${D()}`}))}getTabPanelIds(){return this.tabpanels.map((t=>{var e;return null!==(e=t.getAttribute("id"))&&void 0!==e?e:`panel-${D()}`}))}setComponent(){this.activeTabIndex!==this.prevActiveTabIndex&&(this.activeid=this.tabIds[this.activeTabIndex],this.focusTab(),this.change())}isHorizontal(){return this.orientation===U}handleActiveIndicatorPosition(){this.showActiveIndicator&&this.activeindicator&&this.activeTabIndex!==this.prevActiveTabIndex&&(this.ticking?this.ticking=!1:(this.ticking=!0,this.animateActiveIndicator()))}animateActiveIndicator(){this.ticking=!0;const t=this.isHorizontal()?"gridColumn":"gridRow",e=this.isHorizontal()?"translateX":"translateY",a=this.isHorizontal()?"offsetLeft":"offsetTop",i=this.activeIndicatorRef[a];this.activeIndicatorRef.style[t]=`${this.activeTabIndex+1}`;const s=this.activeIndicatorRef[a];this.activeIndicatorRef.style[t]=`${this.prevActiveTabIndex+1}`;const o=s-i;this.activeIndicatorRef.style.transform=`${e}(${o}px)`,this.activeIndicatorRef.classList.add("activeIndicatorTransition"),this.activeIndicatorRef.addEventListener("transitionend",(()=>{this.ticking=!1,this.activeIndicatorRef.style[t]=`${this.activeTabIndex+1}`,this.activeIndicatorRef.style.transform=`${e}(0px)`,this.activeIndicatorRef.classList.remove("activeIndicatorTransition")}))}adjust(t){this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=L(0,this.tabs.length-1,this.activeTabIndex+t),this.setComponent()}focusTab(){this.tabs[this.activeTabIndex].focus()}connectedCallback(){super.connectedCallback(),this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.activeTabIndex=this.getActiveIndex()}}a([i],V.prototype,"orientation",void 0),a([i],V.prototype,"activeid",void 0),a([s],V.prototype,"tabs",void 0),a([s],V.prototype,"tabpanels",void 0),a([i({mode:"boolean"})],V.prototype,"activeindicator",void 0),a([s],V.prototype,"activeIndicatorRef",void 0),a([s],V.prototype,"showActiveIndicator",void 0),O(V,N);const W=(t,e)=>o`
        ${C("grid")} :host {
            box-sizing: border-box;
            font-family: ${r};
            font-size: ${n};
            line-height: ${c};
            color: ${l};
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
            padding: calc(${d} * 4px) calc(${d} * 4px) 0;
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
            background: ${h};
            margin-top: 10px;
            border-radius: calc(${b} * 1px)
                calc(${b} * 1px) 0 0;
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
            padding: 0 calc(${d} * 4px)
                calc((${z} - ${d}) * 1px) 0;
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
            background: ${h};
            margin-top: 0;
            border-radius: 0 calc(${b} * 1px)
                calc(${b} * 1px) 0;
        }

        :host([orientation="vertical"]) .activeIndicatorTransition {
            transition: transform 0.2s linear;
        }
    `.withBehaviors(R(o`
                .activeIndicator,
                :host([orientation="vertical"]) .activeIndicator {
                    forced-color-adjust: none;
                    background: ${E.Highlight};
                }
            `)),Z=(t,e)=>o`
    ${C("inline-flex")} :host {
        box-sizing: border-box;
        font-family: ${r};
        font-size: ${n};
        line-height: ${c};
        height: calc(${z} * 1px);
        padding: calc(${d} * 5px) calc(${d} * 4px);
        color: ${v};
        fill: currentcolor;
        border-radius: calc(${b} * 1px);
        border: calc(${u} * 1px) solid transparent;
        align-items: center;
        justify-content: center;
        grid-row: 1;
        cursor: pointer;
    }

    :host(:hover) {
        color: ${l};
        fill: currentcolor;
    }

    :host(:active) {
        color: ${l};
        fill: currentcolor;
    }

    :host([disabled]) {
        cursor: ${P};
        opacity: ${p};
    }

    :host([disabled]:hover) {
        color: ${v};
        background: ${g};
    }

    :host([aria-selected="true"]) {
        background: ${f};
        color: ${m};
        fill: currentcolor;
    }

    :host([aria-selected="true"]:hover) {
        background: ${I};
        color: ${x};
        fill: currentcolor;
    }

    :host([aria-selected="true"]:active) {
        background: ${$};
        color: ${T};
        fill: currentcolor;
    }

    :host(:${q}) {
        outline: none;
        border: calc(${u} * 1px) solid ${w};
        box-shadow: 0 0 0 calc((${y} - ${u}) * 1px)
            ${w};
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
        color: ${l};
    }

    :host(.vertical:active) {
        color: ${l};
    }

    :host(.vertical:hover[aria-selected="true"]) {
    }
`.withBehaviors(R(o`
            :host {
                forced-color-adjust: none;
                border-color: transparent;
                color: ${E.ButtonText};
                fill: currentcolor;
            }
            :host(:hover),
            :host(.vertical:hover),
            :host([aria-selected="true"]:hover) {
                background: ${E.Highlight};
                color: ${E.HighlightText};
                fill: currentcolor;
            }
            :host([aria-selected="true"]) {
                background: ${E.HighlightText};
                color: ${E.Highlight};
                fill: currentcolor;
            }
            :host(:${q}) {
                border-color: ${E.ButtonText};
                box-shadow: none;
            }
            :host([disabled]),
            :host([disabled]:hover) {
                opacity: 1;
                color: ${E.GrayText};
                background: ${E.ButtonFace};
            }
        `)),tt=Q.compose({baseName:"tab",template:(e,a)=>t`
    <template slot="tab" role="tab" aria-disabled="${t=>t.disabled}">
        <slot></slot>
    </template>
`,styles:Z}),et=(t,e)=>o`
    ${C("block")} :host {
        box-sizing: border-box;
        font-size: ${n};
        line-height: ${c};
        padding: 0 calc((6 + (${d} * 2 * ${k})) * 1px);
    }
`,at=class extends e{}.compose({baseName:"tab-panel",template:(e,a)=>t`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`,styles:et}),it=V.compose({baseName:"tabs",template:(e,a)=>t`
    <template class="${t=>t.orientation}">
        ${H(e,a)}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${S("tabs")}></slot>

            ${J((t=>t.showActiveIndicator),t`
                    <div
                        ${B("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `)}
        </div>
        ${F(e,a)}
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${S("tabpanels")}></slot>
        </div>
    </template>
`,styles:W});A().withPrefix("site").register(tt({styles:(t,e)=>o`
                ${Z()}
                ${j}
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
            `}),at({styles:(t,e)=>o`
                ${et()}
                ${j}
            `}),it({styles:(t,e)=>o`
                ${W()}
                ${j}      
            `}));
