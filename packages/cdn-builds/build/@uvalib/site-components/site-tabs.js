import{h as t,F as e,_ as i,a,o as s,c as o,u as r,t as n,v as c,n as l,e as d,G as h,f as b,a1 as v,m as u,C as p,N as g,r as f,a2 as m,a3 as x,a4 as I,a5 as $,a6 as T,x as w,w as y,d as k,p as A,s as j}from"../../SiteStyleMapping-51203cca.js";import{d as C}from"../../display-058af2ce.js";import{h as z,d as P}from"../../size-468cfd3b.js";import{f as R,S as E}from"../../match-media-stylesheet-behavior-575be983.js";import{s as H,r as B,e as D,a as F,S as L}from"../../apply-mixins-fe151c16.js";import{s as O,b as N,c as S,g as G,h as K,k as M,a as X,m as Y}from"../../focus-030c5e12.js";import{u as _,w as q}from"../../strings-f6cb2a49.js";import{w as J}from"../../when-46682a8a.js";class Q extends e{}i([a({mode:"boolean"})],Q.prototype,"disabled",void 0);const U="horizontal";class V extends e{constructor(){super(...arguments),this.orientation=U,this.activeindicator=!0,this.showActiveIndicator=!0,this.prevActiveTabIndex=0,this.activeTabIndex=0,this.ticking=!1,this.change=()=>{this.$emit("change",this.activetab)},this.isDisabledElement=t=>"true"===t.getAttribute("aria-disabled"),this.isFocusableElement=t=>!this.isDisabledElement(t),this.setTabs=()=>{const t="gridColumn",e="gridRow",i=this.isHorizontal()?t:e;this.activeTabIndex=this.getActiveIndex(),this.showActiveIndicator=!1,this.tabs.forEach(((a,s)=>{if("tab"===a.slot){const t=this.activeTabIndex===s&&this.isFocusableElement(a);this.activeindicator&&this.isFocusableElement(a)&&(this.showActiveIndicator=!0);const e=this.tabIds[s],i=this.tabpanelIds[s];a.setAttribute("id",e),a.setAttribute("aria-selected",t?"true":"false"),a.setAttribute("aria-controls",i),a.addEventListener("click",this.handleTabClick),a.addEventListener("keydown",this.handleTabKeyDown),a.setAttribute("tabindex",t?"0":"-1"),t&&(this.activetab=a)}a.style[t]="",a.style[e]="",a.style[i]=`${s+1}`,this.isHorizontal()?a.classList.remove("vertical"):a.classList.add("vertical")}))},this.setTabPanels=()=>{this.tabpanels.forEach(((t,e)=>{const i=this.tabIds[e],a=this.tabpanelIds[e];t.setAttribute("id",a),t.setAttribute("aria-labelledby",i),this.activeTabIndex!==e?t.setAttribute("hidden",""):t.removeAttribute("hidden")}))},this.handleTabClick=t=>{const e=t.currentTarget;1===e.nodeType&&this.isFocusableElement(e)&&(this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=this.tabs.indexOf(e),this.setComponent())},this.handleTabKeyDown=t=>{if(this.isHorizontal())switch(t.key){case S:t.preventDefault(),this.adjustBackward(t);break;case N:t.preventDefault(),this.adjustForward(t)}else switch(t.key){case K:t.preventDefault(),this.adjustBackward(t);break;case G:t.preventDefault(),this.adjustForward(t)}switch(t.key){case X:t.preventDefault(),this.adjust(-this.activeTabIndex);break;case M:t.preventDefault(),this.adjust(this.tabs.length-this.activeTabIndex-1)}},this.adjustForward=t=>{const e=this.tabs;let i=0;for(i=this.activetab?e.indexOf(this.activetab)+1:1,i===e.length&&(i=0);i<e.length&&e.length>1;){if(this.isFocusableElement(e[i])){this.moveToTabByIndex(e,i);break}if(this.activetab&&i===e.indexOf(this.activetab))break;i+1>=e.length?i=0:i+=1}},this.adjustBackward=t=>{const e=this.tabs;let i=0;for(i=this.activetab?e.indexOf(this.activetab)-1:0,i=i<0?e.length-1:i;i>=0&&e.length>1;){if(this.isFocusableElement(e[i])){this.moveToTabByIndex(e,i);break}i-1<0?i=e.length-1:i-=1}},this.moveToTabByIndex=(t,e)=>{const i=t[e];this.activetab=i,this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=e,i.focus(),this.setComponent()}}orientationChanged(){this.$fastController.isConnected&&(this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}activeidChanged(t,e){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.prevActiveTabIndex=this.tabs.findIndex((e=>e.id===t)),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabsChanged(){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabpanelsChanged(){this.$fastController.isConnected&&this.tabpanels.length<=this.tabs.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}getActiveIndex(){return void 0!==this.activeid?-1===this.tabIds.indexOf(this.activeid)?0:this.tabIds.indexOf(this.activeid):0}getTabIds(){return this.tabs.map((t=>{var e;return null!==(e=t.getAttribute("id"))&&void 0!==e?e:`tab-${_()}`}))}getTabPanelIds(){return this.tabpanels.map((t=>{var e;return null!==(e=t.getAttribute("id"))&&void 0!==e?e:`panel-${_()}`}))}setComponent(){this.activeTabIndex!==this.prevActiveTabIndex&&(this.activeid=this.tabIds[this.activeTabIndex],this.focusTab(),this.change())}isHorizontal(){return this.orientation===U}handleActiveIndicatorPosition(){this.showActiveIndicator&&this.activeindicator&&this.activeTabIndex!==this.prevActiveTabIndex&&(this.ticking?this.ticking=!1:(this.ticking=!0,this.animateActiveIndicator()))}animateActiveIndicator(){this.ticking=!0;const t=this.isHorizontal()?"gridColumn":"gridRow",e=this.isHorizontal()?"translateX":"translateY",i=this.isHorizontal()?"offsetLeft":"offsetTop",a=this.activeIndicatorRef[i];this.activeIndicatorRef.style[t]=`${this.activeTabIndex+1}`;const s=this.activeIndicatorRef[i];this.activeIndicatorRef.style[t]=`${this.prevActiveTabIndex+1}`;const o=s-a;this.activeIndicatorRef.style.transform=`${e}(${o}px)`,this.activeIndicatorRef.classList.add("activeIndicatorTransition"),this.activeIndicatorRef.addEventListener("transitionend",(()=>{this.ticking=!1,this.activeIndicatorRef.style[t]=`${this.activeTabIndex+1}`,this.activeIndicatorRef.style.transform=`${e}(0px)`,this.activeIndicatorRef.classList.remove("activeIndicatorTransition")}))}adjust(t){this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=q(0,this.tabs.length-1,this.activeTabIndex+t),this.setComponent()}focusTab(){this.tabs[this.activeTabIndex].focus()}connectedCallback(){super.connectedCallback(),this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.activeTabIndex=this.getActiveIndex()}}i([a],V.prototype,"orientation",void 0),i([a],V.prototype,"activeid",void 0),i([s],V.prototype,"tabs",void 0),i([s],V.prototype,"tabpanels",void 0),i([a({mode:"boolean"})],V.prototype,"activeindicator",void 0),i([s],V.prototype,"activeIndicatorRef",void 0),i([s],V.prototype,"showActiveIndicator",void 0),F(V,L);const W=(t,e)=>o`
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
        background: ${x};
        color: ${I};
        fill: currentcolor;
    }

    :host([aria-selected="true"]:active) {
        background: ${$};
        color: ${T};
        fill: currentcolor;
    }

    :host(:${Y}) {
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
            :host(:${Y}) {
                border-color: ${E.ButtonText};
                box-shadow: none;
            }
            :host([disabled]),
            :host([disabled]:hover) {
                opacity: 1;
                color: ${E.GrayText};
                background: ${E.ButtonFace};
            }
        `)),tt=Q.compose({baseName:"tab",template:(e,i)=>t`
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
`,it=class extends e{}.compose({baseName:"tab-panel",template:(e,i)=>t`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`,styles:et}),at=V.compose({baseName:"tabs",template:(e,i)=>t`
    <template class="${t=>t.orientation}">
        ${H(e,i)}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${O("tabs")}></slot>

            ${J((t=>t.showActiveIndicator),t`
                    <div
                        ${B("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `)}
        </div>
        ${D(e,i)}
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${O("tabpanels")}></slot>
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
            `}),it({styles:(t,e)=>o`
                ${et()}
                ${j}
            `}),at({styles:(t,e)=>o`
                ${W()}
                ${j}      
            `}));
