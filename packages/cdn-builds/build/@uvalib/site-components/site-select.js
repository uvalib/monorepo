import{_ as e,a as t,F as i,O as s,o,h as l,D as a,y as n,z as r,c as d,g as h,m as c,B as p,f as u,e as b,x as v,w as x,C as f,E as g,G as y,n as $,u as m,t as k,v as S,I as O,J as I,K as C,L as w,M as A,N as H,P as T,Q as E,R as V,T as z,U as F,V as D,W as P,X as B,Y as M,p as L,s as _}from"../../SiteStyleMapping-f1ccf68c.js";import{d as j,h as W}from"../../size-3ecfc7b7.js";import{a as N,S as G,u as R,s as K,e as U,i as X,r as q}from"../../strings-09538f4a.js";import{n as Y,o as J,i as Q,l as Z,p as ee,k as te,h as ie,g as se,a as oe,s as le,m as ae}from"../../focus-03f3e890.js";import{d as ne}from"../../display-058af2ce.js";import{f as re,S as de}from"../../match-media-stylesheet-behavior-575be983.js";import{e as he}from"../../elevation-63298dfb.js";import{F as ce}from"../../form-associated-e5fa19d4.js";import{w as pe}from"../../when-46682a8a.js";class ue{}function be(e){return Y(e)&&("option"===e.getAttribute("role")||e instanceof HTMLOptionElement)}e([t({attribute:"aria-atomic"})],ue.prototype,"ariaAtomic",void 0),e([t({attribute:"aria-busy"})],ue.prototype,"ariaBusy",void 0),e([t({attribute:"aria-controls"})],ue.prototype,"ariaControls",void 0),e([t({attribute:"aria-current"})],ue.prototype,"ariaCurrent",void 0),e([t({attribute:"aria-describedby"})],ue.prototype,"ariaDescribedby",void 0),e([t({attribute:"aria-details"})],ue.prototype,"ariaDetails",void 0),e([t({attribute:"aria-disabled"})],ue.prototype,"ariaDisabled",void 0),e([t({attribute:"aria-errormessage"})],ue.prototype,"ariaErrormessage",void 0),e([t({attribute:"aria-flowto"})],ue.prototype,"ariaFlowto",void 0),e([t({attribute:"aria-haspopup"})],ue.prototype,"ariaHaspopup",void 0),e([t({attribute:"aria-hidden"})],ue.prototype,"ariaHidden",void 0),e([t({attribute:"aria-invalid"})],ue.prototype,"ariaInvalid",void 0),e([t({attribute:"aria-keyshortcuts"})],ue.prototype,"ariaKeyshortcuts",void 0),e([t({attribute:"aria-label"})],ue.prototype,"ariaLabel",void 0),e([t({attribute:"aria-labelledby"})],ue.prototype,"ariaLabelledby",void 0),e([t({attribute:"aria-live"})],ue.prototype,"ariaLive",void 0),e([t({attribute:"aria-owns"})],ue.prototype,"ariaOwns",void 0),e([t({attribute:"aria-relevant"})],ue.prototype,"ariaRelevant",void 0),e([t({attribute:"aria-roledescription"})],ue.prototype,"ariaRoledescription",void 0);class ve extends i{constructor(e,t,i,s){super(),this.defaultSelected=!1,this.dirtySelected=!1,this.selected=this.defaultSelected,this.dirtyValue=!1,e&&(this.textContent=e),t&&(this.initialValue=t),i&&(this.defaultSelected=i),s&&(this.selected=s),this.proxy=new Option(`${this.textContent}`,this.initialValue,this.defaultSelected,this.selected),this.proxy.disabled=this.disabled}checkedChanged(e,t){this.ariaChecked="boolean"!=typeof t?null:t?"true":"false"}contentChanged(e,t){this.proxy instanceof HTMLOptionElement&&(this.proxy.textContent=this.textContent),this.$emit("contentchange",null,{bubbles:!0})}defaultSelectedChanged(){this.dirtySelected||(this.selected=this.defaultSelected,this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.defaultSelected))}disabledChanged(e,t){this.ariaDisabled=this.disabled?"true":"false",this.proxy instanceof HTMLOptionElement&&(this.proxy.disabled=this.disabled)}selectedAttributeChanged(){this.defaultSelected=this.selectedAttribute,this.proxy instanceof HTMLOptionElement&&(this.proxy.defaultSelected=this.defaultSelected)}selectedChanged(){this.ariaSelected=this.selected?"true":"false",this.dirtySelected||(this.dirtySelected=!0),this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.selected)}initialValueChanged(e,t){this.dirtyValue||(this.value=this.initialValue,this.dirtyValue=!1)}get label(){var e;return null!==(e=this.value)&&void 0!==e?e:this.text}get text(){var e,t;return null!==(t=null===(e=this.textContent)||void 0===e?void 0:e.replace(/\s+/g," ").trim())&&void 0!==t?t:""}set value(e){const t=`${null!=e?e:""}`;this._value=t,this.dirtyValue=!0,this.proxy instanceof HTMLOptionElement&&(this.proxy.value=t),s.notify(this,"value")}get value(){var e;return s.track(this,"value"),null!==(e=this._value)&&void 0!==e?e:this.text}get form(){return this.proxy?this.proxy.form:null}}e([o],ve.prototype,"checked",void 0),e([o],ve.prototype,"content",void 0),e([o],ve.prototype,"defaultSelected",void 0),e([t({mode:"boolean"})],ve.prototype,"disabled",void 0),e([t({attribute:"selected",mode:"boolean"})],ve.prototype,"selectedAttribute",void 0),e([o],ve.prototype,"selected",void 0),e([t({attribute:"value",mode:"fromView"})],ve.prototype,"initialValue",void 0);class xe{}e([o],xe.prototype,"ariaChecked",void 0),e([o],xe.prototype,"ariaPosInSet",void 0),e([o],xe.prototype,"ariaSelected",void 0),e([o],xe.prototype,"ariaSetSize",void 0),N(xe,ue),N(ve,G,xe);class fe extends i{constructor(){super(...arguments),this._options=[],this.selectedIndex=-1,this.selectedOptions=[],this.shouldSkipFocus=!1,this.typeaheadBuffer="",this.typeaheadExpired=!0,this.typeaheadTimeout=-1}get firstSelectedOption(){var e;return null!==(e=this.selectedOptions[0])&&void 0!==e?e:null}get hasSelectableOptions(){return this.options.length>0&&!this.options.every((e=>e.disabled))}get length(){var e,t;return null!==(t=null===(e=this.options)||void 0===e?void 0:e.length)&&void 0!==t?t:0}get options(){return s.track(this,"options"),this._options}set options(e){this._options=e,s.notify(this,"options")}get typeAheadExpired(){return this.typeaheadExpired}set typeAheadExpired(e){this.typeaheadExpired=e}clickHandler(e){const t=e.target.closest("option,[role=option]");if(t&&!t.disabled)return this.selectedIndex=this.options.indexOf(t),!0}focusAndScrollOptionIntoView(e=this.firstSelectedOption){this.contains(document.activeElement)&&null!==e&&(e.focus(),requestAnimationFrame((()=>{e.scrollIntoView({block:"nearest"})})))}focusinHandler(e){this.shouldSkipFocus||e.target!==e.currentTarget||(this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}getTypeaheadMatches(){const e=this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&"),t=new RegExp(`^${e}`,"gi");return this.options.filter((e=>e.text.trim().match(t)))}getSelectableIndex(e=this.selectedIndex,t){const i=e>t?-1:e<t?1:0,s=e+i;let o=null;switch(i){case-1:o=this.options.reduceRight(((e,t,i)=>!e&&!t.disabled&&i<s?t:e),o);break;case 1:o=this.options.reduce(((e,t,i)=>!e&&!t.disabled&&i>s?t:e),o)}return this.options.indexOf(o)}handleChange(e,t){if("selected"===t)fe.slottedOptionFilter(e)&&(this.selectedIndex=this.options.indexOf(e)),this.setSelectedOptions()}handleTypeAhead(e){this.typeaheadTimeout&&window.clearTimeout(this.typeaheadTimeout),this.typeaheadTimeout=window.setTimeout((()=>this.typeaheadExpired=!0),fe.TYPE_AHEAD_TIMEOUT_MS),e.length>1||(this.typeaheadBuffer=`${this.typeaheadExpired?"":this.typeaheadBuffer}${e}`)}keydownHandler(e){if(this.disabled)return!0;this.shouldSkipFocus=!1;const t=e.key;switch(t){case oe:e.shiftKey||(e.preventDefault(),this.selectFirstOption());break;case se:e.shiftKey||(e.preventDefault(),this.selectNextOption());break;case ie:e.shiftKey||(e.preventDefault(),this.selectPreviousOption());break;case te:e.preventDefault(),this.selectLastOption();break;case ee:return this.focusAndScrollOptionIntoView(),!0;case Z:case Q:return!0;case J:if(this.typeaheadExpired)return!0;default:return 1===t.length&&this.handleTypeAhead(`${t}`),!0}}mousedownHandler(e){return this.shouldSkipFocus=!this.contains(document.activeElement),!0}multipleChanged(e,t){this.ariaMultiSelectable=t?"true":null}selectedIndexChanged(e,t){var i;if(this.hasSelectableOptions){if((null===(i=this.options[this.selectedIndex])||void 0===i?void 0:i.disabled)&&"number"==typeof e){const i=this.getSelectableIndex(e,t),s=i>-1?i:e;return this.selectedIndex=s,void(t===s&&this.selectedIndexChanged(t,s))}this.setSelectedOptions()}else this.selectedIndex=-1}selectedOptionsChanged(e,t){var i;const o=t.filter(fe.slottedOptionFilter);null===(i=this.options)||void 0===i||i.forEach((e=>{const t=s.getNotifier(e);t.unsubscribe(this,"selected"),e.selected=o.includes(e),t.subscribe(this,"selected")}))}selectFirstOption(){var e,t;this.disabled||(this.selectedIndex=null!==(t=null===(e=this.options)||void 0===e?void 0:e.findIndex((e=>!e.disabled)))&&void 0!==t?t:-1)}selectLastOption(){this.disabled||(this.selectedIndex=function(e,t){let i=e.length;for(;i--;)if(t(e[i],i,e))return i;return-1}(this.options,(e=>!e.disabled)))}selectNextOption(){!this.disabled&&this.selectedIndex<this.options.length-1&&(this.selectedIndex+=1)}selectPreviousOption(){!this.disabled&&this.selectedIndex>0&&(this.selectedIndex=this.selectedIndex-1)}setDefaultSelectedOption(){var e,t;this.selectedIndex=null!==(t=null===(e=this.options)||void 0===e?void 0:e.findIndex((e=>e.defaultSelected)))&&void 0!==t?t:-1}setSelectedOptions(){var e,t,i;(null===(e=this.options)||void 0===e?void 0:e.length)&&(this.selectedOptions=[this.options[this.selectedIndex]],this.ariaActiveDescendant=null!==(i=null===(t=this.firstSelectedOption)||void 0===t?void 0:t.id)&&void 0!==i?i:"",this.focusAndScrollOptionIntoView())}slottedOptionsChanged(e,t){this.options=t.reduce(((e,t)=>(be(t)&&e.push(t),e)),[]);const i=`${this.options.length}`;this.options.forEach(((e,t)=>{e.id||(e.id=R("option-")),e.ariaPosInSet=`${t+1}`,e.ariaSetSize=i})),this.$fastController.isConnected&&(this.setSelectedOptions(),this.setDefaultSelectedOption())}typeaheadBufferChanged(e,t){if(this.$fastController.isConnected){const e=this.getTypeaheadMatches();if(e.length){const t=this.options.indexOf(e[0]);t>-1&&(this.selectedIndex=t)}this.typeaheadExpired=!1}}}fe.slottedOptionFilter=e=>be(e)&&!e.hidden,fe.TYPE_AHEAD_TIMEOUT_MS=1e3,e([t({mode:"boolean"})],fe.prototype,"disabled",void 0),e([o],fe.prototype,"selectedIndex",void 0),e([o],fe.prototype,"selectedOptions",void 0),e([o],fe.prototype,"slottedOptions",void 0),e([o],fe.prototype,"typeaheadBuffer",void 0);class ge{}e([o],ge.prototype,"ariaActiveDescendant",void 0),e([o],ge.prototype,"ariaDisabled",void 0),e([o],ge.prototype,"ariaExpanded",void 0),e([o],ge.prototype,"ariaMultiSelectable",void 0),N(ge,ue),N(fe,ge);const ye="above",$e="below";class me extends fe{constructor(){super(...arguments),this.activeIndex=-1,this.rangeStartIndex=-1}get activeOption(){return this.options[this.activeIndex]}get checkedOptions(){var e;return null===(e=this.options)||void 0===e?void 0:e.filter((e=>e.checked))}get firstSelectedOptionIndex(){return this.options.indexOf(this.firstSelectedOption)}activeIndexChanged(e,t){var i,s;this.ariaActiveDescendant=null!==(s=null===(i=this.options[t])||void 0===i?void 0:i.id)&&void 0!==s?s:"",this.focusAndScrollOptionIntoView()}checkActiveIndex(){if(!this.multiple)return;const e=this.activeOption;e&&(e.checked=!0)}checkFirstOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex+1),this.options.forEach(((e,t)=>{e.checked=X(t,this.rangeStartIndex)}))):this.uncheckAllOptions(),this.activeIndex=0,this.checkActiveIndex()}checkLastOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex),this.options.forEach(((e,t)=>{e.checked=X(t,this.rangeStartIndex,this.options.length)}))):this.uncheckAllOptions(),this.activeIndex=this.options.length-1,this.checkActiveIndex()}connectedCallback(){super.connectedCallback(),this.addEventListener("focusout",this.focusoutHandler)}disconnectedCallback(){this.removeEventListener("focusout",this.focusoutHandler),super.disconnectedCallback()}checkNextOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex),this.options.forEach(((e,t)=>{e.checked=X(t,this.rangeStartIndex,this.activeIndex+1)}))):this.uncheckAllOptions(),this.activeIndex+=this.activeIndex<this.options.length-1?1:0,this.checkActiveIndex()}checkPreviousOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex),1===this.checkedOptions.length&&(this.rangeStartIndex+=1),this.options.forEach(((e,t)=>{e.checked=X(t,this.activeIndex,this.rangeStartIndex)}))):this.uncheckAllOptions(),this.activeIndex-=this.activeIndex>0?1:0,this.checkActiveIndex()}clickHandler(e){var t;if(!this.multiple)return super.clickHandler(e);const i=null===(t=e.target)||void 0===t?void 0:t.closest("[role=option]");return i&&!i.disabled?(this.uncheckAllOptions(),this.activeIndex=this.options.indexOf(i),this.checkActiveIndex(),this.toggleSelectedForAllCheckedOptions(),!0):void 0}focusAndScrollOptionIntoView(){super.focusAndScrollOptionIntoView(this.activeOption)}focusinHandler(e){if(!this.multiple)return super.focusinHandler(e);this.shouldSkipFocus||e.target!==e.currentTarget||(this.uncheckAllOptions(),-1===this.activeIndex&&(this.activeIndex=-1!==this.firstSelectedOptionIndex?this.firstSelectedOptionIndex:0),this.checkActiveIndex(),this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}focusoutHandler(e){this.multiple&&this.uncheckAllOptions()}keydownHandler(e){if(!this.multiple)return super.keydownHandler(e);if(this.disabled)return!0;const{key:t,shiftKey:i}=e;switch(this.shouldSkipFocus=!1,t){case oe:return void this.checkFirstOption(i);case se:return void this.checkNextOption(i);case ie:return void this.checkPreviousOption(i);case te:return void this.checkLastOption(i);case ee:return this.focusAndScrollOptionIntoView(),!0;case Q:return this.uncheckAllOptions(),this.checkActiveIndex(),!0;case J:if(e.preventDefault(),this.typeAheadExpired)return void this.toggleSelectedForAllCheckedOptions();default:return 1===t.length&&this.handleTypeAhead(`${t}`),!0}}mousedownHandler(e){if(e.offsetX>=0&&e.offsetX<=this.scrollWidth)return super.mousedownHandler(e)}multipleChanged(e,t){var i;this.ariaMultiSelectable=t?"true":null,null===(i=this.options)||void 0===i||i.forEach((e=>{e.checked=!t&&void 0})),this.setSelectedOptions()}setSelectedOptions(){this.multiple?this.$fastController.isConnected&&this.options&&(this.selectedOptions=this.options.filter((e=>e.selected)),this.focusAndScrollOptionIntoView()):super.setSelectedOptions()}sizeChanged(e,t){var i;const s=Math.max(0,parseInt(null!==(i=null==t?void 0:t.toFixed())&&void 0!==i?i:"",10));s!==t&&a.queueUpdate((()=>{this.size=s}))}toggleSelectedForAllCheckedOptions(){const e=this.checkedOptions.filter((e=>!e.disabled)),t=!e.every((e=>e.selected));e.forEach((e=>e.selected=t)),this.selectedIndex=this.options.indexOf(e[e.length-1]),this.setSelectedOptions()}typeaheadBufferChanged(e,t){if(this.multiple){if(this.$fastController.isConnected){const e=this.getTypeaheadMatches(),t=this.options.indexOf(e[0]);t>-1&&(this.activeIndex=t,this.uncheckAllOptions(),this.checkActiveIndex()),this.typeAheadExpired=!1}}else super.typeaheadBufferChanged(e,t)}uncheckAllOptions(e=!1){this.options.forEach((e=>e.checked=!this.multiple&&void 0)),e||(this.rangeStartIndex=-1)}}e([o],me.prototype,"activeIndex",void 0),e([t({mode:"boolean"})],me.prototype,"multiple",void 0),e([t({converter:n})],me.prototype,"size",void 0);class ke extends me{}class Se extends(ce(ke)){constructor(){super(...arguments),this.proxy=document.createElement("select")}}let Oe=class extends Se{constructor(){super(...arguments),this.open=!1,this.forcedPosition=!1,this.listboxId=R("listbox-"),this.maxHeight=0}openChanged(e,t){if(this.collapsible){if(this.open)return this.ariaControls=this.listboxId,this.ariaExpanded="true",this.setPositioning(),this.focusAndScrollOptionIntoView(),this.indexWhenOpened=this.selectedIndex,void a.queueUpdate((()=>this.focus()));this.ariaControls="",this.ariaExpanded="false"}}get collapsible(){return!(this.multiple||"number"==typeof this.size)}get value(){return s.track(this,"value"),this._value}set value(e){var t,i,o,l,a,n,r;const d=`${this._value}`;if(null===(t=this._options)||void 0===t?void 0:t.length){const t=this._options.findIndex((t=>t.value===e)),s=null!==(o=null===(i=this._options[this.selectedIndex])||void 0===i?void 0:i.value)&&void 0!==o?o:null,d=null!==(a=null===(l=this._options[t])||void 0===l?void 0:l.value)&&void 0!==a?a:null;-1!==t&&s===d||(e="",this.selectedIndex=t),e=null!==(r=null===(n=this.firstSelectedOption)||void 0===n?void 0:n.value)&&void 0!==r?r:e}d!==e&&(this._value=e,super.valueChanged(d,e),s.notify(this,"value"),this.updateDisplayValue())}updateValue(e){var t,i;this.$fastController.isConnected&&(this.value=null!==(i=null===(t=this.firstSelectedOption)||void 0===t?void 0:t.value)&&void 0!==i?i:""),e&&(this.$emit("input"),this.$emit("change",this,{bubbles:!0,composed:void 0}))}selectedIndexChanged(e,t){super.selectedIndexChanged(e,t),this.updateValue()}positionChanged(e,t){this.positionAttribute=t,this.setPositioning()}setPositioning(){const e=this.getBoundingClientRect(),t=window.innerHeight-e.bottom;this.position=this.forcedPosition?this.positionAttribute:e.top>t?ye:$e,this.positionAttribute=this.forcedPosition?this.positionAttribute:this.position,this.maxHeight=this.position===ye?~~e.top:~~t}get displayValue(){var e,t;return s.track(this,"displayValue"),null!==(t=null===(e=this.firstSelectedOption)||void 0===e?void 0:e.text)&&void 0!==t?t:""}disabledChanged(e,t){super.disabledChanged&&super.disabledChanged(e,t),this.ariaDisabled=this.disabled?"true":"false"}formResetCallback(){this.setProxyOptions(),super.setDefaultSelectedOption(),-1===this.selectedIndex&&(this.selectedIndex=0)}clickHandler(e){if(!this.disabled){if(this.open){const t=e.target.closest("option,[role=option]");if(t&&t.disabled)return}return super.clickHandler(e),this.open=this.collapsible&&!this.open,this.open||this.indexWhenOpened===this.selectedIndex||this.updateValue(!0),!0}}focusoutHandler(e){var t;if(super.focusoutHandler(e),!this.open)return!0;const i=e.relatedTarget;this.isSameNode(i)?this.focus():(null===(t=this.options)||void 0===t?void 0:t.includes(i))||(this.open=!1,this.indexWhenOpened!==this.selectedIndex&&this.updateValue(!0))}handleChange(e,t){super.handleChange(e,t),"value"===t&&this.updateValue()}slottedOptionsChanged(e,t){this.options.forEach((e=>{s.getNotifier(e).unsubscribe(this,"value")})),super.slottedOptionsChanged(e,t),this.options.forEach((e=>{s.getNotifier(e).subscribe(this,"value")})),this.setProxyOptions(),this.updateValue()}mousedownHandler(e){var t;return e.offsetX>=0&&e.offsetX<=(null===(t=this.listbox)||void 0===t?void 0:t.scrollWidth)?super.mousedownHandler(e):this.collapsible}multipleChanged(e,t){super.multipleChanged(e,t),this.proxy&&(this.proxy.multiple=t)}selectedOptionsChanged(e,t){var i;super.selectedOptionsChanged(e,t),null===(i=this.options)||void 0===i||i.forEach(((e,t)=>{var i;const s=null===(i=this.proxy)||void 0===i?void 0:i.options.item(t);s&&(s.selected=e.selected)}))}setDefaultSelectedOption(){var e;const t=null!==(e=this.options)&&void 0!==e?e:Array.from(this.children).filter(fe.slottedOptionFilter),i=null==t?void 0:t.findIndex((e=>e.hasAttribute("selected")||e.selected||e.value===this.value));this.selectedIndex=-1===i?0:i}setProxyOptions(){this.proxy instanceof HTMLSelectElement&&this.options&&(this.proxy.options.length=0,this.options.forEach((e=>{const t=e.proxy||(e instanceof HTMLOptionElement?e.cloneNode():null);t&&this.proxy.options.add(t)})))}keydownHandler(e){super.keydownHandler(e);const t=e.key||e.key.charCodeAt(0);switch(t){case J:e.preventDefault(),this.collapsible&&this.typeAheadExpired&&(this.open=!this.open);break;case oe:case te:e.preventDefault();break;case Z:e.preventDefault(),this.open=!this.open;break;case Q:this.collapsible&&this.open&&(e.preventDefault(),this.open=!1);break;case ee:return this.collapsible&&this.open&&(e.preventDefault(),this.open=!1),!0}return this.open||this.indexWhenOpened===this.selectedIndex||(this.updateValue(!0),this.indexWhenOpened=this.selectedIndex),!(t===se||t===ie)}connectedCallback(){super.connectedCallback(),this.forcedPosition=!!this.positionAttribute,this.addEventListener("contentchange",this.updateDisplayValue)}disconnectedCallback(){this.removeEventListener("contentchange",this.updateDisplayValue),super.disconnectedCallback()}sizeChanged(e,t){super.sizeChanged(e,t),this.proxy&&(this.proxy.size=t)}updateDisplayValue(){this.collapsible&&s.notify(this,"displayValue")}};e([t({attribute:"open",mode:"boolean"})],Oe.prototype,"open",void 0),e([r],Oe.prototype,"collapsible",null),e([o],Oe.prototype,"control",void 0),e([t({attribute:"position"})],Oe.prototype,"positionAttribute",void 0),e([o],Oe.prototype,"position",void 0),e([o],Oe.prototype,"maxHeight",void 0);class Ie{}e([o],Ie.prototype,"ariaControls",void 0),N(Ie,ge),N(Oe,G,Ie);const Ce=(e,t)=>{const i=e.name===e.tagFor(Oe);return d`
        ${ne("inline-flex")}

        :host {
            --elevation: 14;
            background: ${g};
            border-radius: calc(${u} * 1px);
            border: calc(${c} * 1px) solid ${y};
            box-sizing: border-box;
            color: ${$};
            font-family: ${m};
            height: calc(${W} * 1px);
            position: relative;
            user-select: none;
            min-width: 250px;
            outline: none;
            vertical-align: top;
        }

        ${i?d`
            :host(:not([aria-haspopup])) {
                --elevation: 0;
                border: 0;
                height: auto;
                min-width: 0;
            }
        `:""}

        ${((e,t)=>{const i=e.tagFor(ve),s=e.name===e.tagFor(me)?"":".listbox";return d`
        ${s?"":ne("inline-flex")}

        :host ${s} {
            background: ${h};
            border: calc(${c} * 1px) solid ${p};
            border-radius: calc(${u} * 1px);
            box-sizing: border-box;
            flex-direction: column;
            padding: calc(${b} * 1px) 0;
        }

        ${s?"":d`
            :host(:focus-within:not([disabled])) {
                border-color: ${v};
                box-shadow: 0 0 0
                    calc((${x} - ${c}) * 1px)
                    ${v} inset;
            }

            :host([disabled]) ::slotted(*) {
                cursor: ${j};
                opacity: ${f};
                pointer-events: none;
            }
        `}

        ${s||":host([size])"} {
            max-height: calc(
                (var(--size) * ${W} + (${b} * ${c} * 2)) * 1px
            );
            overflow-y: auto;
        }

        :host([size="0"]) ${s} {
            max-height: none;
        }
    `.withBehaviors(re(d`
                :host(:not([multiple]):${ae}) ::slotted(${i}[aria-selected="true"]),
                :host([multiple]:${ae}) ::slotted(${i}[aria-checked="true"]) {
                    border-color: ${de.ButtonText};
                    box-shadow: 0 0 0 calc(${x} * 1px) inset ${de.HighlightText};
                }

                :host(:not([multiple]):${ae}) ::slotted(${i}[aria-selected="true"]) {
                    background: ${de.Highlight};
                    color: ${de.HighlightText};
                    fill: currentcolor;
                }

                ::slotted(${i}[aria-selected="true"]:not([aria-checked="true"])) {
                    background: ${de.Highlight};
                    border-color: ${de.HighlightText};
                    color: ${de.HighlightText};
                }
            `))})(e)}

        :host .listbox {
            ${he}
            border: none;
            display: flex;
            left: 0;
            position: absolute;
            width: 100%;
            z-index: 1;
        }

        .control + .listbox {
            --stroke-size: calc(${b} * ${c} * 2);
            max-height: calc(
                (var(--listbox-max-height) * ${W} + var(--stroke-size)) * 1px
            );
        }

        ${i?d`
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
            padding: 0 calc(${b} * 2.25px);
            width: 100%;
        }

        :host(:not([disabled]):hover) {
            background: ${O};
            border-color: ${I};
        }

        :host(:${ae}) {
            border-color: ${v};
        }

        :host(:not([size]):not([multiple]):not([open]):${ae}),
        :host([multiple]:${ae}),
        :host([size]:${ae}) {
            box-shadow: 0 0 0 calc(${x} * 1px) ${v};
        }

        :host(:not([multiple]):not([size]):${ae}) ::slotted(${e.tagFor(ve)}[aria-selected="true"]:not([disabled])) {
            box-shadow: 0 0 0 calc(${x} * 1px) inset ${C};
            border-color: ${v};
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
            color: ${$};
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
            min-width: calc(var(--listbox-scroll-width, 0) - (${b} * 4) * 1px);
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
            ${he}
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
            min-height: calc(${b} * 4px);
            min-width: calc(${b} * 4px);
            width: 1em;
        }

        ::slotted([role="option"]),
        ::slotted(option) {
            flex: 0 0 auto;
        }
    `.withBehaviors(re(d`
                :host(:not([disabled]):hover),
                :host(:not([disabled]):active) {
                    border-color: ${de.Highlight};
                }

                :host(:not([disabled]):${ae}) {
                    background-color: ${de.ButtonFace};
                    box-shadow: 0 0 0 calc(${x} * 1px) ${de.Highlight};
                    color: ${de.ButtonText};
                    fill: currentcolor;
                    forced-color-adjust: none;
                }

                :host(:not([disabled]):${ae}) .listbox {
                    background: ${de.ButtonFace};
                }

                :host([disabled]) {
                    border-color: ${de.GrayText};
                    background-color: ${de.ButtonFace};
                    color: ${de.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                    forced-color-adjust: none;
                }

                :host([disabled]:hover) {
                    background: ${de.ButtonFace};
                }

                :host([disabled]) .control {
                    color: ${de.GrayText};
                    border-color: ${de.GrayText};
                }

                :host([disabled]) .control .select-indicator {
                    fill: ${de.GrayText};
                }

                :host(:${ae}) ::slotted([aria-selected="true"][role="option"]),
                :host(:${ae}) ::slotted(option[aria-selected="true"]),
                :host(:${ae}) ::slotted([aria-selected="true"][role="option"]:not([disabled])) {
                    background: ${de.Highlight};
                    border-color: ${de.ButtonText};
                    box-shadow: 0 0 0 calc(${x} * 1px) inset ${de.HighlightText};
                    color: ${de.HighlightText};
                    fill: currentcolor;
                }

                .start,
                .end,
                .indicator,
                .select-indicator,
                ::slotted(svg) {
                    color: ${de.ButtonText};
                    fill: currentcolor;
                }
            `))},we=(e,t)=>d`
        ${ne("inline-flex")} :host {
            align-items: center;
            font-family: ${m};
            border-radius: calc(${u} * 1px);
            border: calc(${x} * 1px) solid transparent;
            box-sizing: border-box;
            background: ${H};
            color: ${$};
            cursor: pointer;
            flex: 0 0 auto;
            fill: currentcolor;
            font-size: ${k};
            height: calc(${W} * 1px);
            line-height: ${S};
            margin: 0 calc((${b} - ${x}) * 1px);
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
            background: ${y};
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
            height: calc(${b} * 4px);
            width: calc(${b} * 4px);
        }

        ::slotted([slot="end"]) {
            margin-inline-start: 1ch;
        }

        ::slotted([slot="start"]) {
            margin-inline-end: 1ch;
        }

        :host([aria-checked="true"][aria-selected="false"]) {
            border-color: ${v};
        }

        :host([aria-checked="true"][aria-selected="true"]) {
            border-color: ${v};
            box-shadow: 0 0 0 calc(${x} * 2 * 1px) inset
                ${C};
        }
    `.withBehaviors(re(d`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${de.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${de.Highlight};
                    color: ${de.HighlightText};
                }

                :host([disabled]),
                :host([disabled][aria-selected="false"]:hover) {
                    background: ${de.Canvas};
                    color: ${de.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }

                :host([aria-checked="true"][aria-selected="false"]) {
                    background: ${de.ButtonFace};
                    color: ${de.ButtonText};
                    border-color: ${de.ButtonText};
                }

                :host([aria-checked="true"][aria-selected="true"]),
                :host([aria-checked="true"][aria-selected="true"]:hover) {
                    background: ${de.Highlight};
                    color: ${de.HighlightText};
                    border-color: ${de.ButtonText};
                }
            `)),Ae=ve.compose({baseName:"option",template:(e,t)=>l`
    <template
        aria-checked="${e=>e.ariaChecked}"
        aria-disabled="${e=>e.ariaDisabled}"
        aria-posinset="${e=>e.ariaPosInSet}"
        aria-selected="${e=>e.ariaSelected}"
        aria-setsize="${e=>e.ariaSetSize}"
        class="${e=>[e.checked&&"checked",e.selected&&"selected",e.disabled&&"disabled"].filter(Boolean).join(" ")}"
        role="option"
    >
        ${K(e,t)}
        <span class="content" part="content">
            <slot ${le("content")}></slot>
        </span>
        ${U(e,t)}
    </template>
`,styles:we});class He extends Oe{constructor(){super(...arguments),this.listboxScrollWidth=""}connectedCallback(){super.connectedCallback(),this.listbox&&h.setValueFor(this.listbox,B)}get listboxMaxHeight(){return Math.floor(this.maxHeight/M.getValueFor(this)).toString()}listboxScrollWidthChanged(){this.updateComputedStylesheet()}get selectSize(){var e;return`${null!==(e=this.size)&&void 0!==e?e:this.multiple?4:0}`}multipleChanged(e,t){super.multipleChanged(e,t),this.updateComputedStylesheet()}maxHeightChanged(e,t){this.collapsible&&this.updateComputedStylesheet()}setPositioning(){super.setPositioning(),this.updateComputedStylesheet()}sizeChanged(e,t){super.sizeChanged(e,t),this.updateComputedStylesheet(),this.collapsible?requestAnimationFrame((()=>{this.listbox.style.setProperty("display","flex"),this.listbox.style.setProperty("overflow","visible"),this.listbox.style.setProperty("visibility","hidden"),this.listbox.style.setProperty("width","auto"),this.listbox.hidden=!1,this.listboxScrollWidth=`${this.listbox.scrollWidth}`,this.listbox.hidden=!0,this.listbox.style.removeProperty("display"),this.listbox.style.removeProperty("overflow"),this.listbox.style.removeProperty("visibility"),this.listbox.style.removeProperty("width")})):this.listboxScrollWidth=""}updateComputedStylesheet(){this.computedStylesheet&&this.$fastController.removeStyles(this.computedStylesheet),this.computedStylesheet=d`
            :host {
                --listbox-max-height: ${this.listboxMaxHeight};
                --listbox-scroll-width: ${this.listboxScrollWidth};
                --size: ${this.selectSize};
            }
        `,this.$fastController.addStyles(this.computedStylesheet)}}e([o],He.prototype,"listboxScrollWidth",void 0);const Te=He.compose({baseName:"select",baseClass:Oe,template:(e,t)=>l`
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
        ${pe((e=>e.collapsible),l`
                <div
                    class="control"
                    part="control"
                    ?disabled="${e=>e.disabled}"
                    ${q("control")}
                >
                    ${K(e,t)}
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
            ${q("listbox")}
        >
            <slot
                ${le({filter:fe.slottedOptionFilter,flatten:!0,property:"slottedOptions"})}
            ></slot>
        </div>
    </template>
`,styles:Ce,indicator:'\n        <svg\n            class="select-indicator"\n            part="select-indicator"\n            viewBox="0 0 12 7"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"\n            />\n        </svg>\n    '});L().withPrefix("site").register(Te({styles:(e,t)=>d`
                ${_}
                ${Ce(e)}
                :host .listbox {
                    background: var(--uva-grey-lightest);
                }
            `}),Ae({styles:(e,t)=>d`
                ${_}
                ${we()}
            `}));
