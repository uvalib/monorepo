import{s as t}from"../../SiteStyleMapping-3f0e5ae7.js";import{h as e,F as i,a,o as s,c as o,r,t as n,u as c,n as l,e as d,E as h,f as b,a0 as v,s as u,B as p,M as g,q as f,a1 as m,a2 as I,a3 as x,a4 as $,a5 as T,w,v as y,d as k,p as A}from"../../fast-design-system-b703147e.js";import{d as j}from"../../display-058af2ce.js";import{h as C,d as z}from"../../size-720798a2.js";import{f as E,S as P}from"../../match-media-stylesheet-behavior-575be983.js";import{_ as R}from"../../tslib.es6-6ae91544.js";import{s as B,r as H,e as D,u as F,w as L,a as O,S}from"../../strings-16ee6ca7.js";import{s as N,b as K,c as M,g as q,h as G,k as X,a as Y,m as _}from"../../focus-20c16bb0.js";import{w as J}from"../../when-46682a8a.js";class Q extends i{}R([a({mode:"boolean"})],Q.prototype,"disabled",void 0);const U="horizontal";class V extends i{constructor(){super(...arguments),this.orientation=U,this.activeindicator=!0,this.showActiveIndicator=!0,this.prevActiveTabIndex=0,this.activeTabIndex=0,this.ticking=!1,this.change=()=>{this.$emit("change",this.activetab)},this.isDisabledElement=t=>"true"===t.getAttribute("aria-disabled"),this.isFocusableElement=t=>!this.isDisabledElement(t),this.setTabs=()=>{const t="gridColumn",e="gridRow",i=this.isHorizontal()?t:e;this.activeTabIndex=this.getActiveIndex(),this.showActiveIndicator=!1,this.tabs.forEach(((a,s)=>{if("tab"===a.slot){const t=this.activeTabIndex===s&&this.isFocusableElement(a);this.activeindicator&&this.isFocusableElement(a)&&(this.showActiveIndicator=!0);const e=this.tabIds[s],i=this.tabpanelIds[s];a.setAttribute("id",e),a.setAttribute("aria-selected",t?"true":"false"),a.setAttribute("aria-controls",i),a.addEventListener("click",this.handleTabClick),a.addEventListener("keydown",this.handleTabKeyDown),a.setAttribute("tabindex",t?"0":"-1"),t&&(this.activetab=a)}a.style[t]="",a.style[e]="",a.style[i]=`${s+1}`,this.isHorizontal()?a.classList.remove("vertical"):a.classList.add("vertical")}))},this.setTabPanels=()=>{this.tabpanels.forEach(((t,e)=>{const i=this.tabIds[e],a=this.tabpanelIds[e];t.setAttribute("id",a),t.setAttribute("aria-labelledby",i),this.activeTabIndex!==e?t.setAttribute("hidden",""):t.removeAttribute("hidden")}))},this.handleTabClick=t=>{const e=t.currentTarget;1===e.nodeType&&this.isFocusableElement(e)&&(this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=this.tabs.indexOf(e),this.setComponent())},this.handleTabKeyDown=t=>{if(this.isHorizontal())switch(t.key){case M:t.preventDefault(),this.adjustBackward(t);break;case K:t.preventDefault(),this.adjustForward(t)}else switch(t.key){case G:t.preventDefault(),this.adjustBackward(t);break;case q:t.preventDefault(),this.adjustForward(t)}switch(t.key){case Y:t.preventDefault(),this.adjust(-this.activeTabIndex);break;case X:t.preventDefault(),this.adjust(this.tabs.length-this.activeTabIndex-1)}},this.adjustForward=t=>{const e=this.tabs;let i=0;for(i=this.activetab?e.indexOf(this.activetab)+1:1,i===e.length&&(i=0);i<e.length&&e.length>1;){if(this.isFocusableElement(e[i])){this.moveToTabByIndex(e,i);break}if(this.activetab&&i===e.indexOf(this.activetab))break;i+1>=e.length?i=0:i+=1}},this.adjustBackward=t=>{const e=this.tabs;let i=0;for(i=this.activetab?e.indexOf(this.activetab)-1:0,i=i<0?e.length-1:i;i>=0&&e.length>1;){if(this.isFocusableElement(e[i])){this.moveToTabByIndex(e,i);break}i-1<0?i=e.length-1:i-=1}},this.moveToTabByIndex=(t,e)=>{const i=t[e];this.activetab=i,this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=e,i.focus(),this.setComponent()}}orientationChanged(){this.$fastController.isConnected&&(this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}activeidChanged(t,e){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.prevActiveTabIndex=this.tabs.findIndex((e=>e.id===t)),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabsChanged(){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabpanelsChanged(){this.$fastController.isConnected&&this.tabpanels.length<=this.tabs.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}getActiveIndex(){return void 0!==this.activeid?-1===this.tabIds.indexOf(this.activeid)?0:this.tabIds.indexOf(this.activeid):0}getTabIds(){return this.tabs.map((t=>{var e;return null!==(e=t.getAttribute("id"))&&void 0!==e?e:`tab-${F()}`}))}getTabPanelIds(){return this.tabpanels.map((t=>{var e;return null!==(e=t.getAttribute("id"))&&void 0!==e?e:`panel-${F()}`}))}setComponent(){this.activeTabIndex!==this.prevActiveTabIndex&&(this.activeid=this.tabIds[this.activeTabIndex],this.focusTab(),this.change())}isHorizontal(){return this.orientation===U}handleActiveIndicatorPosition(){this.showActiveIndicator&&this.activeindicator&&this.activeTabIndex!==this.prevActiveTabIndex&&(this.ticking?this.ticking=!1:(this.ticking=!0,this.animateActiveIndicator()))}animateActiveIndicator(){this.ticking=!0;const t=this.isHorizontal()?"gridColumn":"gridRow",e=this.isHorizontal()?"translateX":"translateY",i=this.isHorizontal()?"offsetLeft":"offsetTop",a=this.activeIndicatorRef[i];this.activeIndicatorRef.style[t]=`${this.activeTabIndex+1}`;const s=this.activeIndicatorRef[i];this.activeIndicatorRef.style[t]=`${this.prevActiveTabIndex+1}`;const o=s-a;this.activeIndicatorRef.style.transform=`${e}(${o}px)`,this.activeIndicatorRef.classList.add("activeIndicatorTransition"),this.activeIndicatorRef.addEventListener("transitionend",(()=>{this.ticking=!1,this.activeIndicatorRef.style[t]=`${this.activeTabIndex+1}`,this.activeIndicatorRef.style.transform=`${e}(0px)`,this.activeIndicatorRef.classList.remove("activeIndicatorTransition")}))}adjust(t){this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=L(0,this.tabs.length-1,this.activeTabIndex+t),this.setComponent()}focusTab(){this.tabs[this.activeTabIndex].focus()}connectedCallback(){super.connectedCallback(),this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.activeTabIndex=this.getActiveIndex()}}R([a],V.prototype,"orientation",void 0),R([a],V.prototype,"activeid",void 0),R([s],V.prototype,"tabs",void 0),R([s],V.prototype,"tabpanels",void 0),R([a({mode:"boolean"})],V.prototype,"activeindicator",void 0),R([s],V.prototype,"activeIndicatorRef",void 0),R([s],V.prototype,"showActiveIndicator",void 0),O(V,S);const W=(t,e)=>o`
        ${j("grid")} :host {
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
                calc((${C} - ${d}) * 1px) 0;
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
    `.withBehaviors(E(o`
                .activeIndicator,
                :host([orientation="vertical"]) .activeIndicator {
                    forced-color-adjust: none;
                    background: ${P.Highlight};
                }
            `)),Z=(t,e)=>o`
    ${j("inline-flex")} :host {
        box-sizing: border-box;
        font-family: ${r};
        font-size: ${n};
        line-height: ${c};
        height: calc(${C} * 1px);
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
        cursor: ${z};
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

    :host(:${_}) {
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
`.withBehaviors(E(o`
            :host {
                forced-color-adjust: none;
                border-color: transparent;
                color: ${P.ButtonText};
                fill: currentcolor;
            }
            :host(:hover),
            :host(.vertical:hover),
            :host([aria-selected="true"]:hover) {
                background: ${P.Highlight};
                color: ${P.HighlightText};
                fill: currentcolor;
            }
            :host([aria-selected="true"]) {
                background: ${P.HighlightText};
                color: ${P.Highlight};
                fill: currentcolor;
            }
            :host(:${_}) {
                border-color: ${P.ButtonText};
                box-shadow: none;
            }
            :host([disabled]),
            :host([disabled]:hover) {
                opacity: 1;
                color: ${P.GrayText};
                background: ${P.ButtonFace};
            }
        `)),tt=Q.compose({baseName:"tab",template:(t,i)=>e`
    <template slot="tab" role="tab" aria-disabled="${t=>t.disabled}">
        <slot></slot>
    </template>
`,styles:Z}),et=(t,e)=>o`
    ${j("block")} :host {
        box-sizing: border-box;
        font-size: ${n};
        line-height: ${c};
        padding: 0 calc((6 + (${d} * 2 * ${k})) * 1px);
    }
`,it=class extends i{}.compose({baseName:"tab-panel",template:(t,i)=>e`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`,styles:et}),at=V.compose({baseName:"tabs",template:(t,i)=>e`
    <template class="${t=>t.orientation}">
        ${B(t,i)}
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
        ${D(t,i)}
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${N("tabpanels")}></slot>
        </div>
    </template>
`,styles:W});A().withPrefix("site").register(tt({styles:(e,i)=>o`
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
            `}),it({styles:(e,i)=>o`
                ${et()}
                ${t}
            `}),at({styles:(e,i)=>o`
                ${W()}
                ${t}      
            `}));
