import{F as e,O as t,_ as i,o as s,a as o,h as l,D as n,y as a,z as d,c as r,g as h,m as c,B as p,f as u,e as x,x as b,w as v,C as f,E as g,G as $,n as y,u as m,t as k,v as S,I as O,J as I,K as C,L as w,M as A,N as H,P as T,Q as E,R as V,T as z,U as F,V as D,W as P,X as B,Y as M,p as L,s as _}from"../../SiteStyleMapping-51203cca.js";import{d as j,h as W}from"../../size-468cfd3b.js";import{A as N}from"../../aria-global-43630e0f.js";import{a as G,S as K,s as R,e as U,r as X}from"../../apply-mixins-fe151c16.js";import{n as q,o as Y,i as J,l as Q,p as Z,k as ee,h as te,g as ie,a as se,s as oe,m as le}from"../../focus-030c5e12.js";import{u as ne,i as ae}from"../../strings-f6cb2a49.js";import{d as de}from"../../display-058af2ce.js";import{f as re,S as he}from"../../match-media-stylesheet-behavior-575be983.js";import{e as ce}from"../../elevation-63298dfb.js";import{F as pe}from"../../form-associated-b8833a72.js";import{w as ue}from"../../when-46682a8a.js";function xe(e){return q(e)&&("option"===e.getAttribute("role")||e instanceof HTMLOptionElement)}class be extends e{constructor(e,t,i,s){super(),this.defaultSelected=!1,this.dirtySelected=!1,this.selected=this.defaultSelected,this.dirtyValue=!1,e&&(this.textContent=e),t&&(this.initialValue=t),i&&(this.defaultSelected=i),s&&(this.selected=s),this.proxy=new Option(`${this.textContent}`,this.initialValue,this.defaultSelected,this.selected),this.proxy.disabled=this.disabled}checkedChanged(e,t){this.ariaChecked="boolean"!=typeof t?null:t?"true":"false"}contentChanged(e,t){this.proxy instanceof HTMLOptionElement&&(this.proxy.textContent=this.textContent),this.$emit("contentchange",null,{bubbles:!0})}defaultSelectedChanged(){this.dirtySelected||(this.selected=this.defaultSelected,this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.defaultSelected))}disabledChanged(e,t){this.ariaDisabled=this.disabled?"true":"false",this.proxy instanceof HTMLOptionElement&&(this.proxy.disabled=this.disabled)}selectedAttributeChanged(){this.defaultSelected=this.selectedAttribute,this.proxy instanceof HTMLOptionElement&&(this.proxy.defaultSelected=this.defaultSelected)}selectedChanged(){this.ariaSelected=this.selected?"true":"false",this.dirtySelected||(this.dirtySelected=!0),this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.selected)}initialValueChanged(e,t){this.dirtyValue||(this.value=this.initialValue,this.dirtyValue=!1)}get label(){var e;return null!==(e=this.value)&&void 0!==e?e:this.text}get text(){var e,t;return null!==(t=null===(e=this.textContent)||void 0===e?void 0:e.replace(/\s+/g," ").trim())&&void 0!==t?t:""}set value(e){const i=`${null!=e?e:""}`;this._value=i,this.dirtyValue=!0,this.proxy instanceof HTMLOptionElement&&(this.proxy.value=i),t.notify(this,"value")}get value(){var e;return t.track(this,"value"),null!==(e=this._value)&&void 0!==e?e:this.text}get form(){return this.proxy?this.proxy.form:null}}i([s],be.prototype,"checked",void 0),i([s],be.prototype,"content",void 0),i([s],be.prototype,"defaultSelected",void 0),i([o({mode:"boolean"})],be.prototype,"disabled",void 0),i([o({attribute:"selected",mode:"boolean"})],be.prototype,"selectedAttribute",void 0),i([s],be.prototype,"selected",void 0),i([o({attribute:"value",mode:"fromView"})],be.prototype,"initialValue",void 0);class ve{}i([s],ve.prototype,"ariaChecked",void 0),i([s],ve.prototype,"ariaPosInSet",void 0),i([s],ve.prototype,"ariaSelected",void 0),i([s],ve.prototype,"ariaSetSize",void 0),G(ve,N),G(be,K,ve);class fe extends e{constructor(){super(...arguments),this._options=[],this.selectedIndex=-1,this.selectedOptions=[],this.shouldSkipFocus=!1,this.typeaheadBuffer="",this.typeaheadExpired=!0,this.typeaheadTimeout=-1}get firstSelectedOption(){var e;return null!==(e=this.selectedOptions[0])&&void 0!==e?e:null}get hasSelectableOptions(){return this.options.length>0&&!this.options.every((e=>e.disabled))}get length(){var e,t;return null!==(t=null===(e=this.options)||void 0===e?void 0:e.length)&&void 0!==t?t:0}get options(){return t.track(this,"options"),this._options}set options(e){this._options=e,t.notify(this,"options")}get typeAheadExpired(){return this.typeaheadExpired}set typeAheadExpired(e){this.typeaheadExpired=e}clickHandler(e){const t=e.target.closest("option,[role=option]");if(t&&!t.disabled)return this.selectedIndex=this.options.indexOf(t),!0}focusAndScrollOptionIntoView(e=this.firstSelectedOption){this.contains(document.activeElement)&&null!==e&&(e.focus(),requestAnimationFrame((()=>{e.scrollIntoView({block:"nearest"})})))}focusinHandler(e){this.shouldSkipFocus||e.target!==e.currentTarget||(this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}getTypeaheadMatches(){const e=this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&"),t=new RegExp(`^${e}`,"gi");return this.options.filter((e=>e.text.trim().match(t)))}getSelectableIndex(e=this.selectedIndex,t){const i=e>t?-1:e<t?1:0,s=e+i;let o=null;switch(i){case-1:o=this.options.reduceRight(((e,t,i)=>!e&&!t.disabled&&i<s?t:e),o);break;case 1:o=this.options.reduce(((e,t,i)=>!e&&!t.disabled&&i>s?t:e),o)}return this.options.indexOf(o)}handleChange(e,t){if("selected"===t)fe.slottedOptionFilter(e)&&(this.selectedIndex=this.options.indexOf(e)),this.setSelectedOptions()}handleTypeAhead(e){this.typeaheadTimeout&&window.clearTimeout(this.typeaheadTimeout),this.typeaheadTimeout=window.setTimeout((()=>this.typeaheadExpired=!0),fe.TYPE_AHEAD_TIMEOUT_MS),e.length>1||(this.typeaheadBuffer=`${this.typeaheadExpired?"":this.typeaheadBuffer}${e}`)}keydownHandler(e){if(this.disabled)return!0;this.shouldSkipFocus=!1;const t=e.key;switch(t){case se:e.shiftKey||(e.preventDefault(),this.selectFirstOption());break;case ie:e.shiftKey||(e.preventDefault(),this.selectNextOption());break;case te:e.shiftKey||(e.preventDefault(),this.selectPreviousOption());break;case ee:e.preventDefault(),this.selectLastOption();break;case Z:return this.focusAndScrollOptionIntoView(),!0;case Q:case J:return!0;case Y:if(this.typeaheadExpired)return!0;default:return 1===t.length&&this.handleTypeAhead(`${t}`),!0}}mousedownHandler(e){return this.shouldSkipFocus=!this.contains(document.activeElement),!0}multipleChanged(e,t){this.ariaMultiSelectable=t?"true":null}selectedIndexChanged(e,t){var i;if(this.hasSelectableOptions){if((null===(i=this.options[this.selectedIndex])||void 0===i?void 0:i.disabled)&&"number"==typeof e){const i=this.getSelectableIndex(e,t),s=i>-1?i:e;return this.selectedIndex=s,void(t===s&&this.selectedIndexChanged(t,s))}this.setSelectedOptions()}else this.selectedIndex=-1}selectedOptionsChanged(e,i){var s;const o=i.filter(fe.slottedOptionFilter);null===(s=this.options)||void 0===s||s.forEach((e=>{const i=t.getNotifier(e);i.unsubscribe(this,"selected"),e.selected=o.includes(e),i.subscribe(this,"selected")}))}selectFirstOption(){var e,t;this.disabled||(this.selectedIndex=null!==(t=null===(e=this.options)||void 0===e?void 0:e.findIndex((e=>!e.disabled)))&&void 0!==t?t:-1)}selectLastOption(){this.disabled||(this.selectedIndex=function(e,t){let i=e.length;for(;i--;)if(t(e[i],i,e))return i;return-1}(this.options,(e=>!e.disabled)))}selectNextOption(){!this.disabled&&this.selectedIndex<this.options.length-1&&(this.selectedIndex+=1)}selectPreviousOption(){!this.disabled&&this.selectedIndex>0&&(this.selectedIndex=this.selectedIndex-1)}setDefaultSelectedOption(){var e,t;this.selectedIndex=null!==(t=null===(e=this.options)||void 0===e?void 0:e.findIndex((e=>e.defaultSelected)))&&void 0!==t?t:-1}setSelectedOptions(){var e,t,i;(null===(e=this.options)||void 0===e?void 0:e.length)&&(this.selectedOptions=[this.options[this.selectedIndex]],this.ariaActiveDescendant=null!==(i=null===(t=this.firstSelectedOption)||void 0===t?void 0:t.id)&&void 0!==i?i:"",this.focusAndScrollOptionIntoView())}slottedOptionsChanged(e,t){this.options=t.reduce(((e,t)=>(xe(t)&&e.push(t),e)),[]);const i=`${this.options.length}`;this.options.forEach(((e,t)=>{e.id||(e.id=ne("option-")),e.ariaPosInSet=`${t+1}`,e.ariaSetSize=i})),this.$fastController.isConnected&&(this.setSelectedOptions(),this.setDefaultSelectedOption())}typeaheadBufferChanged(e,t){if(this.$fastController.isConnected){const e=this.getTypeaheadMatches();if(e.length){const t=this.options.indexOf(e[0]);t>-1&&(this.selectedIndex=t)}this.typeaheadExpired=!1}}}fe.slottedOptionFilter=e=>xe(e)&&!e.hidden,fe.TYPE_AHEAD_TIMEOUT_MS=1e3,i([o({mode:"boolean"})],fe.prototype,"disabled",void 0),i([s],fe.prototype,"selectedIndex",void 0),i([s],fe.prototype,"selectedOptions",void 0),i([s],fe.prototype,"slottedOptions",void 0),i([s],fe.prototype,"typeaheadBuffer",void 0);class ge{}i([s],ge.prototype,"ariaActiveDescendant",void 0),i([s],ge.prototype,"ariaDisabled",void 0),i([s],ge.prototype,"ariaExpanded",void 0),i([s],ge.prototype,"ariaMultiSelectable",void 0),G(ge,N),G(fe,ge);const $e="above",ye="below";class me extends fe{constructor(){super(...arguments),this.activeIndex=-1,this.rangeStartIndex=-1}get activeOption(){return this.options[this.activeIndex]}get checkedOptions(){var e;return null===(e=this.options)||void 0===e?void 0:e.filter((e=>e.checked))}get firstSelectedOptionIndex(){return this.options.indexOf(this.firstSelectedOption)}activeIndexChanged(e,t){var i,s;this.ariaActiveDescendant=null!==(s=null===(i=this.options[t])||void 0===i?void 0:i.id)&&void 0!==s?s:"",this.focusAndScrollOptionIntoView()}checkActiveIndex(){if(!this.multiple)return;const e=this.activeOption;e&&(e.checked=!0)}checkFirstOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex+1),this.options.forEach(((e,t)=>{e.checked=ae(t,this.rangeStartIndex)}))):this.uncheckAllOptions(),this.activeIndex=0,this.checkActiveIndex()}checkLastOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex),this.options.forEach(((e,t)=>{e.checked=ae(t,this.rangeStartIndex,this.options.length)}))):this.uncheckAllOptions(),this.activeIndex=this.options.length-1,this.checkActiveIndex()}connectedCallback(){super.connectedCallback(),this.addEventListener("focusout",this.focusoutHandler)}disconnectedCallback(){this.removeEventListener("focusout",this.focusoutHandler),super.disconnectedCallback()}checkNextOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex),this.options.forEach(((e,t)=>{e.checked=ae(t,this.rangeStartIndex,this.activeIndex+1)}))):this.uncheckAllOptions(),this.activeIndex+=this.activeIndex<this.options.length-1?1:0,this.checkActiveIndex()}checkPreviousOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex),1===this.checkedOptions.length&&(this.rangeStartIndex+=1),this.options.forEach(((e,t)=>{e.checked=ae(t,this.activeIndex,this.rangeStartIndex)}))):this.uncheckAllOptions(),this.activeIndex-=this.activeIndex>0?1:0,this.checkActiveIndex()}clickHandler(e){var t;if(!this.multiple)return super.clickHandler(e);const i=null===(t=e.target)||void 0===t?void 0:t.closest("[role=option]");return i&&!i.disabled?(this.uncheckAllOptions(),this.activeIndex=this.options.indexOf(i),this.checkActiveIndex(),this.toggleSelectedForAllCheckedOptions(),!0):void 0}focusAndScrollOptionIntoView(){super.focusAndScrollOptionIntoView(this.activeOption)}focusinHandler(e){if(!this.multiple)return super.focusinHandler(e);this.shouldSkipFocus||e.target!==e.currentTarget||(this.uncheckAllOptions(),-1===this.activeIndex&&(this.activeIndex=-1!==this.firstSelectedOptionIndex?this.firstSelectedOptionIndex:0),this.checkActiveIndex(),this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}focusoutHandler(e){this.multiple&&this.uncheckAllOptions()}keydownHandler(e){if(!this.multiple)return super.keydownHandler(e);if(this.disabled)return!0;const{key:t,shiftKey:i}=e;switch(this.shouldSkipFocus=!1,t){case se:return void this.checkFirstOption(i);case ie:return void this.checkNextOption(i);case te:return void this.checkPreviousOption(i);case ee:return void this.checkLastOption(i);case Z:return this.focusAndScrollOptionIntoView(),!0;case J:return this.uncheckAllOptions(),this.checkActiveIndex(),!0;case Y:if(e.preventDefault(),this.typeAheadExpired)return void this.toggleSelectedForAllCheckedOptions();default:return 1===t.length&&this.handleTypeAhead(`${t}`),!0}}mousedownHandler(e){if(e.offsetX>=0&&e.offsetX<=this.scrollWidth)return super.mousedownHandler(e)}multipleChanged(e,t){var i;this.ariaMultiSelectable=t?"true":null,null===(i=this.options)||void 0===i||i.forEach((e=>{e.checked=!t&&void 0})),this.setSelectedOptions()}setSelectedOptions(){this.multiple?this.$fastController.isConnected&&this.options&&(this.selectedOptions=this.options.filter((e=>e.selected)),this.focusAndScrollOptionIntoView()):super.setSelectedOptions()}sizeChanged(e,t){var i;const s=Math.max(0,parseInt(null!==(i=null==t?void 0:t.toFixed())&&void 0!==i?i:"",10));s!==t&&n.queueUpdate((()=>{this.size=s}))}toggleSelectedForAllCheckedOptions(){const e=this.checkedOptions.filter((e=>!e.disabled)),t=!e.every((e=>e.selected));e.forEach((e=>e.selected=t)),this.selectedIndex=this.options.indexOf(e[e.length-1]),this.setSelectedOptions()}typeaheadBufferChanged(e,t){if(this.multiple){if(this.$fastController.isConnected){const e=this.getTypeaheadMatches(),t=this.options.indexOf(e[0]);t>-1&&(this.activeIndex=t,this.uncheckAllOptions(),this.checkActiveIndex()),this.typeAheadExpired=!1}}else super.typeaheadBufferChanged(e,t)}uncheckAllOptions(e=!1){this.options.forEach((e=>e.checked=!this.multiple&&void 0)),e||(this.rangeStartIndex=-1)}}i([s],me.prototype,"activeIndex",void 0),i([o({mode:"boolean"})],me.prototype,"multiple",void 0),i([o({converter:a})],me.prototype,"size",void 0);class ke extends me{}class Se extends(pe(ke)){constructor(){super(...arguments),this.proxy=document.createElement("select")}}let Oe=class extends Se{constructor(){super(...arguments),this.open=!1,this.forcedPosition=!1,this.listboxId=ne("listbox-"),this.maxHeight=0}openChanged(e,t){if(this.collapsible){if(this.open)return this.ariaControls=this.listboxId,this.ariaExpanded="true",this.setPositioning(),this.focusAndScrollOptionIntoView(),this.indexWhenOpened=this.selectedIndex,void n.queueUpdate((()=>this.focus()));this.ariaControls="",this.ariaExpanded="false"}}get collapsible(){return!(this.multiple||"number"==typeof this.size)}get value(){return t.track(this,"value"),this._value}set value(e){var i,s,o,l,n,a,d;const r=`${this._value}`;if(null===(i=this._options)||void 0===i?void 0:i.length){const t=this._options.findIndex((t=>t.value===e)),i=null!==(o=null===(s=this._options[this.selectedIndex])||void 0===s?void 0:s.value)&&void 0!==o?o:null,r=null!==(n=null===(l=this._options[t])||void 0===l?void 0:l.value)&&void 0!==n?n:null;-1!==t&&i===r||(e="",this.selectedIndex=t),e=null!==(d=null===(a=this.firstSelectedOption)||void 0===a?void 0:a.value)&&void 0!==d?d:e}r!==e&&(this._value=e,super.valueChanged(r,e),t.notify(this,"value"),this.updateDisplayValue())}updateValue(e){var t,i;this.$fastController.isConnected&&(this.value=null!==(i=null===(t=this.firstSelectedOption)||void 0===t?void 0:t.value)&&void 0!==i?i:""),e&&(this.$emit("input"),this.$emit("change",this,{bubbles:!0,composed:void 0}))}selectedIndexChanged(e,t){super.selectedIndexChanged(e,t),this.updateValue()}positionChanged(e,t){this.positionAttribute=t,this.setPositioning()}setPositioning(){const e=this.getBoundingClientRect(),t=window.innerHeight-e.bottom;this.position=this.forcedPosition?this.positionAttribute:e.top>t?$e:ye,this.positionAttribute=this.forcedPosition?this.positionAttribute:this.position,this.maxHeight=this.position===$e?~~e.top:~~t}get displayValue(){var e,i;return t.track(this,"displayValue"),null!==(i=null===(e=this.firstSelectedOption)||void 0===e?void 0:e.text)&&void 0!==i?i:""}disabledChanged(e,t){super.disabledChanged&&super.disabledChanged(e,t),this.ariaDisabled=this.disabled?"true":"false"}formResetCallback(){this.setProxyOptions(),super.setDefaultSelectedOption(),-1===this.selectedIndex&&(this.selectedIndex=0)}clickHandler(e){if(!this.disabled){if(this.open){const t=e.target.closest("option,[role=option]");if(t&&t.disabled)return}return super.clickHandler(e),this.open=this.collapsible&&!this.open,this.open||this.indexWhenOpened===this.selectedIndex||this.updateValue(!0),!0}}focusoutHandler(e){var t;if(super.focusoutHandler(e),!this.open)return!0;const i=e.relatedTarget;this.isSameNode(i)?this.focus():(null===(t=this.options)||void 0===t?void 0:t.includes(i))||(this.open=!1,this.indexWhenOpened!==this.selectedIndex&&this.updateValue(!0))}handleChange(e,t){super.handleChange(e,t),"value"===t&&this.updateValue()}slottedOptionsChanged(e,i){this.options.forEach((e=>{t.getNotifier(e).unsubscribe(this,"value")})),super.slottedOptionsChanged(e,i),this.options.forEach((e=>{t.getNotifier(e).subscribe(this,"value")})),this.setProxyOptions(),this.updateValue()}mousedownHandler(e){var t;return e.offsetX>=0&&e.offsetX<=(null===(t=this.listbox)||void 0===t?void 0:t.scrollWidth)?super.mousedownHandler(e):this.collapsible}multipleChanged(e,t){super.multipleChanged(e,t),this.proxy&&(this.proxy.multiple=t)}selectedOptionsChanged(e,t){var i;super.selectedOptionsChanged(e,t),null===(i=this.options)||void 0===i||i.forEach(((e,t)=>{var i;const s=null===(i=this.proxy)||void 0===i?void 0:i.options.item(t);s&&(s.selected=e.selected)}))}setDefaultSelectedOption(){var e;const t=null!==(e=this.options)&&void 0!==e?e:Array.from(this.children).filter(fe.slottedOptionFilter),i=null==t?void 0:t.findIndex((e=>e.hasAttribute("selected")||e.selected||e.value===this.value));this.selectedIndex=-1===i?0:i}setProxyOptions(){this.proxy instanceof HTMLSelectElement&&this.options&&(this.proxy.options.length=0,this.options.forEach((e=>{const t=e.proxy||(e instanceof HTMLOptionElement?e.cloneNode():null);t&&this.proxy.options.add(t)})))}keydownHandler(e){super.keydownHandler(e);const t=e.key||e.key.charCodeAt(0);switch(t){case Y:e.preventDefault(),this.collapsible&&this.typeAheadExpired&&(this.open=!this.open);break;case se:case ee:e.preventDefault();break;case Q:e.preventDefault(),this.open=!this.open;break;case J:this.collapsible&&this.open&&(e.preventDefault(),this.open=!1);break;case Z:return this.collapsible&&this.open&&(e.preventDefault(),this.open=!1),!0}return this.open||this.indexWhenOpened===this.selectedIndex||(this.updateValue(!0),this.indexWhenOpened=this.selectedIndex),!(t===ie||t===te)}connectedCallback(){super.connectedCallback(),this.forcedPosition=!!this.positionAttribute,this.addEventListener("contentchange",this.updateDisplayValue)}disconnectedCallback(){this.removeEventListener("contentchange",this.updateDisplayValue),super.disconnectedCallback()}sizeChanged(e,t){super.sizeChanged(e,t),this.proxy&&(this.proxy.size=t)}updateDisplayValue(){this.collapsible&&t.notify(this,"displayValue")}};i([o({attribute:"open",mode:"boolean"})],Oe.prototype,"open",void 0),i([d],Oe.prototype,"collapsible",null),i([s],Oe.prototype,"control",void 0),i([o({attribute:"position"})],Oe.prototype,"positionAttribute",void 0),i([s],Oe.prototype,"position",void 0),i([s],Oe.prototype,"maxHeight",void 0);class Ie{}i([s],Ie.prototype,"ariaControls",void 0),G(Ie,ge),G(Oe,K,Ie);const Ce=(e,t)=>{const i=e.name===e.tagFor(Oe);return r`
        ${de("inline-flex")}

        :host {
            --elevation: 14;
            background: ${g};
            border-radius: calc(${u} * 1px);
            border: calc(${c} * 1px) solid ${$};
            box-sizing: border-box;
            color: ${y};
            font-family: ${m};
            height: calc(${W} * 1px);
            position: relative;
            user-select: none;
            min-width: 250px;
            outline: none;
            vertical-align: top;
        }

        ${i?r`
            :host(:not([aria-haspopup])) {
                --elevation: 0;
                border: 0;
                height: auto;
                min-width: 0;
            }
        `:""}

        ${((e,t)=>{const i=e.tagFor(be),s=e.name===e.tagFor(me)?"":".listbox";return r`
        ${s?"":de("inline-flex")}

        :host ${s} {
            background: ${h};
            border: calc(${c} * 1px) solid ${p};
            border-radius: calc(${u} * 1px);
            box-sizing: border-box;
            flex-direction: column;
            padding: calc(${x} * 1px) 0;
        }

        ${s?"":r`
            :host(:focus-within:not([disabled])) {
                border-color: ${b};
                box-shadow: 0 0 0
                    calc((${v} - ${c}) * 1px)
                    ${b} inset;
            }

            :host([disabled]) ::slotted(*) {
                cursor: ${j};
                opacity: ${f};
                pointer-events: none;
            }
        `}

        ${s||":host([size])"} {
            max-height: calc(
                (var(--size) * ${W} + (${x} * ${c} * 2)) * 1px
            );
            overflow-y: auto;
        }

        :host([size="0"]) ${s} {
            max-height: none;
        }
    `.withBehaviors(re(r`
                :host(:not([multiple]):${le}) ::slotted(${i}[aria-selected="true"]),
                :host([multiple]:${le}) ::slotted(${i}[aria-checked="true"]) {
                    border-color: ${he.ButtonText};
                    box-shadow: 0 0 0 calc(${v} * 1px) inset ${he.HighlightText};
                }

                :host(:not([multiple]):${le}) ::slotted(${i}[aria-selected="true"]) {
                    background: ${he.Highlight};
                    color: ${he.HighlightText};
                    fill: currentcolor;
                }

                ::slotted(${i}[aria-selected="true"]:not([aria-checked="true"])) {
                    background: ${he.Highlight};
                    border-color: ${he.HighlightText};
                    color: ${he.HighlightText};
                }
            `))})(e)}

        :host .listbox {
            ${ce}
            border: none;
            display: flex;
            left: 0;
            position: absolute;
            width: 100%;
            z-index: 1;
        }

        .control + .listbox {
            --stroke-size: calc(${x} * ${c} * 2);
            max-height: calc(
                (var(--listbox-max-height) * ${W} + var(--stroke-size)) * 1px
            );
        }

        ${i?r`
            :host(:not([aria-haspopup])) .listbox {
                left: auto;
                position: static;
                z-index: auto;
            }
        `:""}

        .listbox[hidden] {
            display: none;
        }

        .control {
            align-items: center;
            box-sizing: border-box;
            cursor: pointer;
            display: flex;
            font-size: ${k};
            font-family: inherit;
            line-height: ${S};
            min-height: 100%;
            padding: 0 calc(${x} * 2.25px);
            width: 100%;
        }

        :host(:not([disabled]):hover) {
            background: ${O};
            border-color: ${I};
        }

        :host(:${le}) {
            border-color: ${b};
        }

        :host(:not([size]):not([multiple]):not([open]):${le}),
        :host([multiple]:${le}),
        :host([size]:${le}) {
            box-shadow: 0 0 0 calc(${v} * 1px) ${b};
        }

        :host(:not([multiple]):not([size]):${le}) ::slotted(${e.tagFor(be)}[aria-selected="true"]:not([disabled])) {
            box-shadow: 0 0 0 calc(${v} * 1px) inset ${C};
            border-color: ${b};
            background: ${w};
            color: ${A};
        }

        :host([disabled]) {
            cursor: ${j};
            opacity: ${f};
        }

        :host([disabled]) .control {
            cursor: ${j};
            user-select: none;
        }

        :host([disabled]:hover) {
            background: ${H};
            color: ${y};
            fill: currentcolor;
        }

        :host(:not([disabled])) .control:active {
            background: ${T};
            border-color: ${E};
            border-radius: calc(${u} * 1px);
        }

        :host([open][position="above"]) .listbox {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom: 0;
            bottom: calc(${W} * 1px);
        }

        :host([open][position="below"]) .listbox {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            border-top: 0;
            top: calc(${W} * 1px);
        }

        .selected-value {
            flex: 1 1 auto;
            font-family: inherit;
            min-width: calc(var(--listbox-scroll-width, 0) - (${x} * 4) * 1px);
            overflow: hidden;
            text-align: start;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .indicator {
            flex: 0 0 auto;
            margin-inline-start: 1em;
        }

        slot[name="listbox"] {
            display: none;
            width: 100%;
        }

        :host([open]) slot[name="listbox"] {
            display: flex;
            position: absolute;
            ${ce}
        }

        .end {
            margin-inline-start: auto;
        }

        .start,
        .end,
        .indicator,
        .select-indicator,
        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            fill: currentcolor;
            height: 1em;
            min-height: calc(${x} * 4px);
            min-width: calc(${x} * 4px);
            width: 1em;
        }

        ::slotted([role="option"]),
        ::slotted(option) {
            flex: 0 0 auto;
        }
    `.withBehaviors(re(r`
                :host(:not([disabled]):hover),
                :host(:not([disabled]):active) {
                    border-color: ${he.Highlight};
                }

                :host(:not([disabled]):${le}) {
                    background-color: ${he.ButtonFace};
                    box-shadow: 0 0 0 calc(${v} * 1px) ${he.Highlight};
                    color: ${he.ButtonText};
                    fill: currentcolor;
                    forced-color-adjust: none;
                }

                :host(:not([disabled]):${le}) .listbox {
                    background: ${he.ButtonFace};
                }

                :host([disabled]) {
                    border-color: ${he.GrayText};
                    background-color: ${he.ButtonFace};
                    color: ${he.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                    forced-color-adjust: none;
                }

                :host([disabled]:hover) {
                    background: ${he.ButtonFace};
                }

                :host([disabled]) .control {
                    color: ${he.GrayText};
                    border-color: ${he.GrayText};
                }

                :host([disabled]) .control .select-indicator {
                    fill: ${he.GrayText};
                }

                :host(:${le}) ::slotted([aria-selected="true"][role="option"]),
                :host(:${le}) ::slotted(option[aria-selected="true"]),
                :host(:${le}) ::slotted([aria-selected="true"][role="option"]:not([disabled])) {
                    background: ${he.Highlight};
                    border-color: ${he.ButtonText};
                    box-shadow: 0 0 0 calc(${v} * 1px) inset ${he.HighlightText};
                    color: ${he.HighlightText};
                    fill: currentcolor;
                }

                .start,
                .end,
                .indicator,
                .select-indicator,
                ::slotted(svg) {
                    color: ${he.ButtonText};
                    fill: currentcolor;
                }
            `))},we=(e,t)=>r`
        ${de("inline-flex")} :host {
            align-items: center;
            font-family: ${m};
            border-radius: calc(${u} * 1px);
            border: calc(${v} * 1px) solid transparent;
            box-sizing: border-box;
            background: ${H};
            color: ${y};
            cursor: pointer;
            flex: 0 0 auto;
            fill: currentcolor;
            font-size: ${k};
            height: calc(${W} * 1px);
            line-height: ${S};
            margin: 0 calc((${x} - ${v}) * 1px);
            outline: none;
            overflow: hidden;
            padding: 0 1ch;
            user-select: none;
            white-space: nowrap;
        }

        :host(:not([disabled]):not([aria-selected="true"]):hover) {
            background: ${V};
        }

        :host(:not([disabled]):not([aria-selected="true"]):active) {
            background: ${z};
        }

        :host([aria-selected="true"]) {
            background: ${$};
            color: ${F};
        }

        :host(:not([disabled])[aria-selected="true"]:hover) {
            background: ${I};
            color: ${D};
        }

        :host(:not([disabled])[aria-selected="true"]:active) {
            background: ${E};
            color: ${P};
        }

        :host([disabled]) {
            cursor: ${j};
            opacity: ${f};
        }

        .content {
            grid-column-start: 2;
            justify-self: start;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .start,
        .end,
        ::slotted(svg) {
            display: flex;
        }

        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            height: calc(${x} * 4px);
            width: calc(${x} * 4px);
        }

        ::slotted([slot="end"]) {
            margin-inline-start: 1ch;
        }

        ::slotted([slot="start"]) {
            margin-inline-end: 1ch;
        }

        :host([aria-checked="true"][aria-selected="false"]) {
            border-color: ${b};
        }

        :host([aria-checked="true"][aria-selected="true"]) {
            border-color: ${b};
            box-shadow: 0 0 0 calc(${v} * 2 * 1px) inset
                ${C};
        }
    `.withBehaviors(re(r`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${he.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${he.Highlight};
                    color: ${he.HighlightText};
                }

                :host([disabled]),
                :host([disabled][aria-selected="false"]:hover) {
                    background: ${he.Canvas};
                    color: ${he.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }

                :host([aria-checked="true"][aria-selected="false"]) {
                    background: ${he.ButtonFace};
                    color: ${he.ButtonText};
                    border-color: ${he.ButtonText};
                }

                :host([aria-checked="true"][aria-selected="true"]),
                :host([aria-checked="true"][aria-selected="true"]:hover) {
                    background: ${he.Highlight};
                    color: ${he.HighlightText};
                    border-color: ${he.ButtonText};
                }
            `)),Ae=be.compose({baseName:"option",template:(e,t)=>l`
    <template
        aria-checked="${e=>e.ariaChecked}"
        aria-disabled="${e=>e.ariaDisabled}"
        aria-posinset="${e=>e.ariaPosInSet}"
        aria-selected="${e=>e.ariaSelected}"
        aria-setsize="${e=>e.ariaSetSize}"
        class="${e=>[e.checked&&"checked",e.selected&&"selected",e.disabled&&"disabled"].filter(Boolean).join(" ")}"
        role="option"
    >
        ${R(e,t)}
        <span class="content" part="content">
            <slot ${oe("content")}></slot>
        </span>
        ${U(e,t)}
    </template>
`,styles:we});class He extends Oe{constructor(){super(...arguments),this.listboxScrollWidth=""}connectedCallback(){super.connectedCallback(),this.listbox&&h.setValueFor(this.listbox,B)}get listboxMaxHeight(){return Math.floor(this.maxHeight/M.getValueFor(this)).toString()}listboxScrollWidthChanged(){this.updateComputedStylesheet()}get selectSize(){var e;return`${null!==(e=this.size)&&void 0!==e?e:this.multiple?4:0}`}multipleChanged(e,t){super.multipleChanged(e,t),this.updateComputedStylesheet()}maxHeightChanged(e,t){this.collapsible&&this.updateComputedStylesheet()}setPositioning(){super.setPositioning(),this.updateComputedStylesheet()}sizeChanged(e,t){super.sizeChanged(e,t),this.updateComputedStylesheet(),this.collapsible?requestAnimationFrame((()=>{this.listbox.style.setProperty("display","flex"),this.listbox.style.setProperty("overflow","visible"),this.listbox.style.setProperty("visibility","hidden"),this.listbox.style.setProperty("width","auto"),this.listbox.hidden=!1,this.listboxScrollWidth=`${this.listbox.scrollWidth}`,this.listbox.hidden=!0,this.listbox.style.removeProperty("display"),this.listbox.style.removeProperty("overflow"),this.listbox.style.removeProperty("visibility"),this.listbox.style.removeProperty("width")})):this.listboxScrollWidth=""}updateComputedStylesheet(){this.computedStylesheet&&this.$fastController.removeStyles(this.computedStylesheet),this.computedStylesheet=r`
            :host {
                --listbox-max-height: ${this.listboxMaxHeight};
                --listbox-scroll-width: ${this.listboxScrollWidth};
                --size: ${this.selectSize};
            }
        `,this.$fastController.addStyles(this.computedStylesheet)}}i([s],He.prototype,"listboxScrollWidth",void 0);const Te=He.compose({baseName:"select",baseClass:Oe,template:(e,t)=>l`
    <template
        class="${e=>[e.collapsible&&"collapsible",e.collapsible&&e.open&&"open",e.disabled&&"disabled",e.collapsible&&e.position].filter(Boolean).join(" ")}"
        aria-activedescendant="${e=>e.ariaActiveDescendant}"
        aria-controls="${e=>e.ariaControls}"
        aria-disabled="${e=>e.ariaDisabled}"
        aria-expanded="${e=>e.ariaExpanded}"
        aria-haspopup="${e=>e.collapsible?"listbox":null}"
        aria-multiselectable="${e=>e.ariaMultiSelectable}"
        ?open="${e=>e.open}"
        role="combobox"
        tabindex="${e=>e.disabled?null:"0"}"
        @click="${(e,t)=>e.clickHandler(t.event)}"
        @focusin="${(e,t)=>e.focusinHandler(t.event)}"
        @focusout="${(e,t)=>e.focusoutHandler(t.event)}"
        @keydown="${(e,t)=>e.keydownHandler(t.event)}"
        @mousedown="${(e,t)=>e.mousedownHandler(t.event)}"
    >
        ${ue((e=>e.collapsible),l`
                <div
                    class="control"
                    part="control"
                    ?disabled="${e=>e.disabled}"
                    ${X("control")}
                >
                    ${R(e,t)}
                    <slot name="button-container">
                        <div class="selected-value" part="selected-value">
                            <slot name="selected-value">${e=>e.displayValue}</slot>
                        </div>
                        <div aria-hidden="true" class="indicator" part="indicator">
                            <slot name="indicator">
                                ${t.indicator||""}
                            </slot>
                        </div>
                    </slot>
                    ${U(e,t)}
                </div>
            `)}
        <div
            class="listbox"
            id="${e=>e.listboxId}"
            part="listbox"
            role="listbox"
            ?disabled="${e=>e.disabled}"
            ?hidden="${e=>!!e.collapsible&&!e.open}"
            ${X("listbox")}
        >
            <slot
                ${oe({filter:fe.slottedOptionFilter,flatten:!0,property:"slottedOptions"})}
            ></slot>
        </div>
    </template>
`,styles:Ce,indicator:'\n        <svg\n            class="select-indicator"\n            part="select-indicator"\n            viewBox="0 0 12 7"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"\n            />\n        </svg>\n    '});L().withPrefix("site").register(Te({styles:(e,t)=>r`
                ${_}
                ${Ce(e)}
                :host .listbox {
                    background: var(--uva-grey-lightest);
                }
            `}),Ae({styles:(e,t)=>r`
                ${_}
                ${we()}
            `}));
