import{_ as e,a as t,F as i,O as s,o,h as l,D as a,x as n,y as r,c as d,g as h,s as c,z as p,f as u,e as b,w as x,v,B as f,C as g,E as y,n as $,r as m,t as k,u as S,G as O,I,J as C,K as w,L as A,M as H,N as E,P as T,Q as V,R as F,T as z,U as D,V as B,W as P,X as M,p as L}from"../../fast-design-system-d046069d.js";import{d as _,h as j}from"../../size-b693d30e.js";import{a as W,S as N,u as G,s as R,e as K,i as U,r as X}from"../../strings-197a3030.js";import{n as q,o as Y,i as J,l as Q,p as Z,k as ee,h as te,g as ie,a as se,s as oe,m as le}from"../../focus-3563f905.js";import{d as ae}from"../../display-058af2ce.js";import{f as ne,S as re}from"../../match-media-stylesheet-behavior-575be983.js";import{e as de}from"../../elevation-63298dfb.js";import{F as he}from"../../form-associated-0ae06292.js";import{w as ce}from"../../when-46682a8a.js";class pe{}function ue(e){return q(e)&&("option"===e.getAttribute("role")||e instanceof HTMLOptionElement)}e([t({attribute:"aria-atomic"})],pe.prototype,"ariaAtomic",void 0),e([t({attribute:"aria-busy"})],pe.prototype,"ariaBusy",void 0),e([t({attribute:"aria-controls"})],pe.prototype,"ariaControls",void 0),e([t({attribute:"aria-current"})],pe.prototype,"ariaCurrent",void 0),e([t({attribute:"aria-describedby"})],pe.prototype,"ariaDescribedby",void 0),e([t({attribute:"aria-details"})],pe.prototype,"ariaDetails",void 0),e([t({attribute:"aria-disabled"})],pe.prototype,"ariaDisabled",void 0),e([t({attribute:"aria-errormessage"})],pe.prototype,"ariaErrormessage",void 0),e([t({attribute:"aria-flowto"})],pe.prototype,"ariaFlowto",void 0),e([t({attribute:"aria-haspopup"})],pe.prototype,"ariaHaspopup",void 0),e([t({attribute:"aria-hidden"})],pe.prototype,"ariaHidden",void 0),e([t({attribute:"aria-invalid"})],pe.prototype,"ariaInvalid",void 0),e([t({attribute:"aria-keyshortcuts"})],pe.prototype,"ariaKeyshortcuts",void 0),e([t({attribute:"aria-label"})],pe.prototype,"ariaLabel",void 0),e([t({attribute:"aria-labelledby"})],pe.prototype,"ariaLabelledby",void 0),e([t({attribute:"aria-live"})],pe.prototype,"ariaLive",void 0),e([t({attribute:"aria-owns"})],pe.prototype,"ariaOwns",void 0),e([t({attribute:"aria-relevant"})],pe.prototype,"ariaRelevant",void 0),e([t({attribute:"aria-roledescription"})],pe.prototype,"ariaRoledescription",void 0);class be extends i{constructor(e,t,i,s){super(),this.defaultSelected=!1,this.dirtySelected=!1,this.selected=this.defaultSelected,this.dirtyValue=!1,e&&(this.textContent=e),t&&(this.initialValue=t),i&&(this.defaultSelected=i),s&&(this.selected=s),this.proxy=new Option(`${this.textContent}`,this.initialValue,this.defaultSelected,this.selected),this.proxy.disabled=this.disabled}checkedChanged(e,t){this.ariaChecked="boolean"!=typeof t?null:t?"true":"false"}contentChanged(e,t){this.proxy instanceof HTMLOptionElement&&(this.proxy.textContent=this.textContent),this.$emit("contentchange",null,{bubbles:!0})}defaultSelectedChanged(){this.dirtySelected||(this.selected=this.defaultSelected,this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.defaultSelected))}disabledChanged(e,t){this.ariaDisabled=this.disabled?"true":"false",this.proxy instanceof HTMLOptionElement&&(this.proxy.disabled=this.disabled)}selectedAttributeChanged(){this.defaultSelected=this.selectedAttribute,this.proxy instanceof HTMLOptionElement&&(this.proxy.defaultSelected=this.defaultSelected)}selectedChanged(){this.ariaSelected=this.selected?"true":"false",this.dirtySelected||(this.dirtySelected=!0),this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.selected)}initialValueChanged(e,t){this.dirtyValue||(this.value=this.initialValue,this.dirtyValue=!1)}get label(){var e;return null!==(e=this.value)&&void 0!==e?e:this.text}get text(){var e,t;return null!==(t=null===(e=this.textContent)||void 0===e?void 0:e.replace(/\s+/g," ").trim())&&void 0!==t?t:""}set value(e){const t=`${null!=e?e:""}`;this._value=t,this.dirtyValue=!0,this.proxy instanceof HTMLOptionElement&&(this.proxy.value=t),s.notify(this,"value")}get value(){var e;return s.track(this,"value"),null!==(e=this._value)&&void 0!==e?e:this.text}get form(){return this.proxy?this.proxy.form:null}}e([o],be.prototype,"checked",void 0),e([o],be.prototype,"content",void 0),e([o],be.prototype,"defaultSelected",void 0),e([t({mode:"boolean"})],be.prototype,"disabled",void 0),e([t({attribute:"selected",mode:"boolean"})],be.prototype,"selectedAttribute",void 0),e([o],be.prototype,"selected",void 0),e([t({attribute:"value",mode:"fromView"})],be.prototype,"initialValue",void 0);class xe{}e([o],xe.prototype,"ariaChecked",void 0),e([o],xe.prototype,"ariaPosInSet",void 0),e([o],xe.prototype,"ariaSelected",void 0),e([o],xe.prototype,"ariaSetSize",void 0),W(xe,pe),W(be,N,xe);class ve extends i{constructor(){super(...arguments),this._options=[],this.selectedIndex=-1,this.selectedOptions=[],this.shouldSkipFocus=!1,this.typeaheadBuffer="",this.typeaheadExpired=!0,this.typeaheadTimeout=-1}get firstSelectedOption(){var e;return null!==(e=this.selectedOptions[0])&&void 0!==e?e:null}get hasSelectableOptions(){return this.options.length>0&&!this.options.every((e=>e.disabled))}get length(){var e,t;return null!==(t=null===(e=this.options)||void 0===e?void 0:e.length)&&void 0!==t?t:0}get options(){return s.track(this,"options"),this._options}set options(e){this._options=e,s.notify(this,"options")}get typeAheadExpired(){return this.typeaheadExpired}set typeAheadExpired(e){this.typeaheadExpired=e}clickHandler(e){const t=e.target.closest("option,[role=option]");if(t&&!t.disabled)return this.selectedIndex=this.options.indexOf(t),!0}focusAndScrollOptionIntoView(e=this.firstSelectedOption){this.contains(document.activeElement)&&null!==e&&(e.focus(),requestAnimationFrame((()=>{e.scrollIntoView({block:"nearest"})})))}focusinHandler(e){this.shouldSkipFocus||e.target!==e.currentTarget||(this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}getTypeaheadMatches(){const e=this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&"),t=new RegExp(`^${e}`,"gi");return this.options.filter((e=>e.text.trim().match(t)))}getSelectableIndex(e=this.selectedIndex,t){const i=e>t?-1:e<t?1:0,s=e+i;let o=null;switch(i){case-1:o=this.options.reduceRight(((e,t,i)=>!e&&!t.disabled&&i<s?t:e),o);break;case 1:o=this.options.reduce(((e,t,i)=>!e&&!t.disabled&&i>s?t:e),o)}return this.options.indexOf(o)}handleChange(e,t){if("selected"===t)ve.slottedOptionFilter(e)&&(this.selectedIndex=this.options.indexOf(e)),this.setSelectedOptions()}handleTypeAhead(e){this.typeaheadTimeout&&window.clearTimeout(this.typeaheadTimeout),this.typeaheadTimeout=window.setTimeout((()=>this.typeaheadExpired=!0),ve.TYPE_AHEAD_TIMEOUT_MS),e.length>1||(this.typeaheadBuffer=`${this.typeaheadExpired?"":this.typeaheadBuffer}${e}`)}keydownHandler(e){if(this.disabled)return!0;this.shouldSkipFocus=!1;const t=e.key;switch(t){case se:e.shiftKey||(e.preventDefault(),this.selectFirstOption());break;case ie:e.shiftKey||(e.preventDefault(),this.selectNextOption());break;case te:e.shiftKey||(e.preventDefault(),this.selectPreviousOption());break;case ee:e.preventDefault(),this.selectLastOption();break;case Z:return this.focusAndScrollOptionIntoView(),!0;case Q:case J:return!0;case Y:if(this.typeaheadExpired)return!0;default:return 1===t.length&&this.handleTypeAhead(`${t}`),!0}}mousedownHandler(e){return this.shouldSkipFocus=!this.contains(document.activeElement),!0}multipleChanged(e,t){this.ariaMultiSelectable=t?"true":null}selectedIndexChanged(e,t){var i;if(this.hasSelectableOptions){if((null===(i=this.options[this.selectedIndex])||void 0===i?void 0:i.disabled)&&"number"==typeof e){const i=this.getSelectableIndex(e,t),s=i>-1?i:e;return this.selectedIndex=s,void(t===s&&this.selectedIndexChanged(t,s))}this.setSelectedOptions()}else this.selectedIndex=-1}selectedOptionsChanged(e,t){var i;const o=t.filter(ve.slottedOptionFilter);null===(i=this.options)||void 0===i||i.forEach((e=>{const t=s.getNotifier(e);t.unsubscribe(this,"selected"),e.selected=o.includes(e),t.subscribe(this,"selected")}))}selectFirstOption(){var e,t;this.disabled||(this.selectedIndex=null!==(t=null===(e=this.options)||void 0===e?void 0:e.findIndex((e=>!e.disabled)))&&void 0!==t?t:-1)}selectLastOption(){this.disabled||(this.selectedIndex=function(e,t){let i=e.length;for(;i--;)if(t(e[i],i,e))return i;return-1}(this.options,(e=>!e.disabled)))}selectNextOption(){!this.disabled&&this.selectedIndex<this.options.length-1&&(this.selectedIndex+=1)}selectPreviousOption(){!this.disabled&&this.selectedIndex>0&&(this.selectedIndex=this.selectedIndex-1)}setDefaultSelectedOption(){var e,t;this.selectedIndex=null!==(t=null===(e=this.options)||void 0===e?void 0:e.findIndex((e=>e.defaultSelected)))&&void 0!==t?t:-1}setSelectedOptions(){var e,t,i;(null===(e=this.options)||void 0===e?void 0:e.length)&&(this.selectedOptions=[this.options[this.selectedIndex]],this.ariaActiveDescendant=null!==(i=null===(t=this.firstSelectedOption)||void 0===t?void 0:t.id)&&void 0!==i?i:"",this.focusAndScrollOptionIntoView())}slottedOptionsChanged(e,t){this.options=t.reduce(((e,t)=>(ue(t)&&e.push(t),e)),[]);const i=`${this.options.length}`;this.options.forEach(((e,t)=>{e.id||(e.id=G("option-")),e.ariaPosInSet=`${t+1}`,e.ariaSetSize=i})),this.$fastController.isConnected&&(this.setSelectedOptions(),this.setDefaultSelectedOption())}typeaheadBufferChanged(e,t){if(this.$fastController.isConnected){const e=this.getTypeaheadMatches();if(e.length){const t=this.options.indexOf(e[0]);t>-1&&(this.selectedIndex=t)}this.typeaheadExpired=!1}}}ve.slottedOptionFilter=e=>ue(e)&&!e.hidden,ve.TYPE_AHEAD_TIMEOUT_MS=1e3,e([t({mode:"boolean"})],ve.prototype,"disabled",void 0),e([o],ve.prototype,"selectedIndex",void 0),e([o],ve.prototype,"selectedOptions",void 0),e([o],ve.prototype,"slottedOptions",void 0),e([o],ve.prototype,"typeaheadBuffer",void 0);class fe{}e([o],fe.prototype,"ariaActiveDescendant",void 0),e([o],fe.prototype,"ariaDisabled",void 0),e([o],fe.prototype,"ariaExpanded",void 0),e([o],fe.prototype,"ariaMultiSelectable",void 0),W(fe,pe),W(ve,fe);const ge="above",ye="below";class $e extends ve{constructor(){super(...arguments),this.activeIndex=-1,this.rangeStartIndex=-1}get activeOption(){return this.options[this.activeIndex]}get checkedOptions(){var e;return null===(e=this.options)||void 0===e?void 0:e.filter((e=>e.checked))}get firstSelectedOptionIndex(){return this.options.indexOf(this.firstSelectedOption)}activeIndexChanged(e,t){var i,s;this.ariaActiveDescendant=null!==(s=null===(i=this.options[t])||void 0===i?void 0:i.id)&&void 0!==s?s:"",this.focusAndScrollOptionIntoView()}checkActiveIndex(){if(!this.multiple)return;const e=this.activeOption;e&&(e.checked=!0)}checkFirstOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex+1),this.options.forEach(((e,t)=>{e.checked=U(t,this.rangeStartIndex)}))):this.uncheckAllOptions(),this.activeIndex=0,this.checkActiveIndex()}checkLastOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex),this.options.forEach(((e,t)=>{e.checked=U(t,this.rangeStartIndex,this.options.length)}))):this.uncheckAllOptions(),this.activeIndex=this.options.length-1,this.checkActiveIndex()}connectedCallback(){super.connectedCallback(),this.addEventListener("focusout",this.focusoutHandler)}disconnectedCallback(){this.removeEventListener("focusout",this.focusoutHandler),super.disconnectedCallback()}checkNextOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex),this.options.forEach(((e,t)=>{e.checked=U(t,this.rangeStartIndex,this.activeIndex+1)}))):this.uncheckAllOptions(),this.activeIndex+=this.activeIndex<this.options.length-1?1:0,this.checkActiveIndex()}checkPreviousOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex),1===this.checkedOptions.length&&(this.rangeStartIndex+=1),this.options.forEach(((e,t)=>{e.checked=U(t,this.activeIndex,this.rangeStartIndex)}))):this.uncheckAllOptions(),this.activeIndex-=this.activeIndex>0?1:0,this.checkActiveIndex()}clickHandler(e){var t;if(!this.multiple)return super.clickHandler(e);const i=null===(t=e.target)||void 0===t?void 0:t.closest("[role=option]");return i&&!i.disabled?(this.uncheckAllOptions(),this.activeIndex=this.options.indexOf(i),this.checkActiveIndex(),this.toggleSelectedForAllCheckedOptions(),!0):void 0}focusAndScrollOptionIntoView(){super.focusAndScrollOptionIntoView(this.activeOption)}focusinHandler(e){if(!this.multiple)return super.focusinHandler(e);this.shouldSkipFocus||e.target!==e.currentTarget||(this.uncheckAllOptions(),-1===this.activeIndex&&(this.activeIndex=-1!==this.firstSelectedOptionIndex?this.firstSelectedOptionIndex:0),this.checkActiveIndex(),this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}focusoutHandler(e){this.multiple&&this.uncheckAllOptions()}keydownHandler(e){if(!this.multiple)return super.keydownHandler(e);if(this.disabled)return!0;const{key:t,shiftKey:i}=e;switch(this.shouldSkipFocus=!1,t){case se:return void this.checkFirstOption(i);case ie:return void this.checkNextOption(i);case te:return void this.checkPreviousOption(i);case ee:return void this.checkLastOption(i);case Z:return this.focusAndScrollOptionIntoView(),!0;case J:return this.uncheckAllOptions(),this.checkActiveIndex(),!0;case Y:if(e.preventDefault(),this.typeAheadExpired)return void this.toggleSelectedForAllCheckedOptions();default:return 1===t.length&&this.handleTypeAhead(`${t}`),!0}}mousedownHandler(e){if(e.offsetX>=0&&e.offsetX<=this.scrollWidth)return super.mousedownHandler(e)}multipleChanged(e,t){var i;this.ariaMultiSelectable=t?"true":null,null===(i=this.options)||void 0===i||i.forEach((e=>{e.checked=!t&&void 0})),this.setSelectedOptions()}setSelectedOptions(){this.multiple?this.$fastController.isConnected&&this.options&&(this.selectedOptions=this.options.filter((e=>e.selected)),this.focusAndScrollOptionIntoView()):super.setSelectedOptions()}sizeChanged(e,t){var i;const s=Math.max(0,parseInt(null!==(i=null==t?void 0:t.toFixed())&&void 0!==i?i:"",10));s!==t&&a.queueUpdate((()=>{this.size=s}))}toggleSelectedForAllCheckedOptions(){const e=this.checkedOptions.filter((e=>!e.disabled)),t=!e.every((e=>e.selected));e.forEach((e=>e.selected=t)),this.selectedIndex=this.options.indexOf(e[e.length-1]),this.setSelectedOptions()}typeaheadBufferChanged(e,t){if(this.multiple){if(this.$fastController.isConnected){const e=this.getTypeaheadMatches(),t=this.options.indexOf(e[0]);t>-1&&(this.activeIndex=t,this.uncheckAllOptions(),this.checkActiveIndex()),this.typeAheadExpired=!1}}else super.typeaheadBufferChanged(e,t)}uncheckAllOptions(e=!1){this.options.forEach((e=>e.checked=!this.multiple&&void 0)),e||(this.rangeStartIndex=-1)}}e([o],$e.prototype,"activeIndex",void 0),e([t({mode:"boolean"})],$e.prototype,"multiple",void 0),e([t({converter:n})],$e.prototype,"size",void 0);class me extends $e{}class ke extends(he(me)){constructor(){super(...arguments),this.proxy=document.createElement("select")}}let Se=class extends ke{constructor(){super(...arguments),this.open=!1,this.forcedPosition=!1,this.listboxId=G("listbox-"),this.maxHeight=0}openChanged(e,t){if(this.collapsible){if(this.open)return this.ariaControls=this.listboxId,this.ariaExpanded="true",this.setPositioning(),this.focusAndScrollOptionIntoView(),this.indexWhenOpened=this.selectedIndex,void a.queueUpdate((()=>this.focus()));this.ariaControls="",this.ariaExpanded="false"}}get collapsible(){return!(this.multiple||"number"==typeof this.size)}get value(){return s.track(this,"value"),this._value}set value(e){var t,i,o,l,a,n,r;const d=`${this._value}`;if(null===(t=this._options)||void 0===t?void 0:t.length){const t=this._options.findIndex((t=>t.value===e)),s=null!==(o=null===(i=this._options[this.selectedIndex])||void 0===i?void 0:i.value)&&void 0!==o?o:null,d=null!==(a=null===(l=this._options[t])||void 0===l?void 0:l.value)&&void 0!==a?a:null;-1!==t&&s===d||(e="",this.selectedIndex=t),e=null!==(r=null===(n=this.firstSelectedOption)||void 0===n?void 0:n.value)&&void 0!==r?r:e}d!==e&&(this._value=e,super.valueChanged(d,e),s.notify(this,"value"),this.updateDisplayValue())}updateValue(e){var t,i;this.$fastController.isConnected&&(this.value=null!==(i=null===(t=this.firstSelectedOption)||void 0===t?void 0:t.value)&&void 0!==i?i:""),e&&(this.$emit("input"),this.$emit("change",this,{bubbles:!0,composed:void 0}))}selectedIndexChanged(e,t){super.selectedIndexChanged(e,t),this.updateValue()}positionChanged(e,t){this.positionAttribute=t,this.setPositioning()}setPositioning(){const e=this.getBoundingClientRect(),t=window.innerHeight-e.bottom;this.position=this.forcedPosition?this.positionAttribute:e.top>t?ge:ye,this.positionAttribute=this.forcedPosition?this.positionAttribute:this.position,this.maxHeight=this.position===ge?~~e.top:~~t}get displayValue(){var e,t;return s.track(this,"displayValue"),null!==(t=null===(e=this.firstSelectedOption)||void 0===e?void 0:e.text)&&void 0!==t?t:""}disabledChanged(e,t){super.disabledChanged&&super.disabledChanged(e,t),this.ariaDisabled=this.disabled?"true":"false"}formResetCallback(){this.setProxyOptions(),super.setDefaultSelectedOption(),-1===this.selectedIndex&&(this.selectedIndex=0)}clickHandler(e){if(!this.disabled){if(this.open){const t=e.target.closest("option,[role=option]");if(t&&t.disabled)return}return super.clickHandler(e),this.open=this.collapsible&&!this.open,this.open||this.indexWhenOpened===this.selectedIndex||this.updateValue(!0),!0}}focusoutHandler(e){var t;if(super.focusoutHandler(e),!this.open)return!0;const i=e.relatedTarget;this.isSameNode(i)?this.focus():(null===(t=this.options)||void 0===t?void 0:t.includes(i))||(this.open=!1,this.indexWhenOpened!==this.selectedIndex&&this.updateValue(!0))}handleChange(e,t){super.handleChange(e,t),"value"===t&&this.updateValue()}slottedOptionsChanged(e,t){this.options.forEach((e=>{s.getNotifier(e).unsubscribe(this,"value")})),super.slottedOptionsChanged(e,t),this.options.forEach((e=>{s.getNotifier(e).subscribe(this,"value")})),this.setProxyOptions(),this.updateValue()}mousedownHandler(e){var t;return e.offsetX>=0&&e.offsetX<=(null===(t=this.listbox)||void 0===t?void 0:t.scrollWidth)?super.mousedownHandler(e):this.collapsible}multipleChanged(e,t){super.multipleChanged(e,t),this.proxy&&(this.proxy.multiple=t)}selectedOptionsChanged(e,t){var i;super.selectedOptionsChanged(e,t),null===(i=this.options)||void 0===i||i.forEach(((e,t)=>{var i;const s=null===(i=this.proxy)||void 0===i?void 0:i.options.item(t);s&&(s.selected=e.selected)}))}setDefaultSelectedOption(){var e;const t=null!==(e=this.options)&&void 0!==e?e:Array.from(this.children).filter(ve.slottedOptionFilter),i=null==t?void 0:t.findIndex((e=>e.hasAttribute("selected")||e.selected||e.value===this.value));this.selectedIndex=-1===i?0:i}setProxyOptions(){this.proxy instanceof HTMLSelectElement&&this.options&&(this.proxy.options.length=0,this.options.forEach((e=>{const t=e.proxy||(e instanceof HTMLOptionElement?e.cloneNode():null);t&&this.proxy.options.add(t)})))}keydownHandler(e){super.keydownHandler(e);const t=e.key||e.key.charCodeAt(0);switch(t){case Y:e.preventDefault(),this.collapsible&&this.typeAheadExpired&&(this.open=!this.open);break;case se:case ee:e.preventDefault();break;case Q:e.preventDefault(),this.open=!this.open;break;case J:this.collapsible&&this.open&&(e.preventDefault(),this.open=!1);break;case Z:return this.collapsible&&this.open&&(e.preventDefault(),this.open=!1),!0}return this.open||this.indexWhenOpened===this.selectedIndex||(this.updateValue(!0),this.indexWhenOpened=this.selectedIndex),!(t===ie||t===te)}connectedCallback(){super.connectedCallback(),this.forcedPosition=!!this.positionAttribute,this.addEventListener("contentchange",this.updateDisplayValue)}disconnectedCallback(){this.removeEventListener("contentchange",this.updateDisplayValue),super.disconnectedCallback()}sizeChanged(e,t){super.sizeChanged(e,t),this.proxy&&(this.proxy.size=t)}updateDisplayValue(){this.collapsible&&s.notify(this,"displayValue")}};e([t({attribute:"open",mode:"boolean"})],Se.prototype,"open",void 0),e([r],Se.prototype,"collapsible",null),e([o],Se.prototype,"control",void 0),e([t({attribute:"position"})],Se.prototype,"positionAttribute",void 0),e([o],Se.prototype,"position",void 0),e([o],Se.prototype,"maxHeight",void 0);class Oe{}e([o],Oe.prototype,"ariaControls",void 0),W(Oe,fe),W(Se,N,Oe);const Ie=be.compose({baseName:"option",template:(e,t)=>l`
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
        ${K(e,t)}
    </template>
`,styles:(e,t)=>d`
        ${ae("inline-flex")} :host {
            align-items: center;
            font-family: ${m};
            border-radius: calc(${u} * 1px);
            border: calc(${v} * 1px) solid transparent;
            box-sizing: border-box;
            background: ${H};
            color: ${$};
            cursor: pointer;
            flex: 0 0 auto;
            fill: currentcolor;
            font-size: ${k};
            height: calc(${j} * 1px);
            line-height: ${S};
            margin: 0 calc((${b} - ${v}) * 1px);
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
            background: ${F};
        }

        :host([aria-selected="true"]) {
            background: ${y};
            color: ${z};
        }

        :host(:not([disabled])[aria-selected="true"]:hover) {
            background: ${I};
            color: ${D};
        }

        :host(:not([disabled])[aria-selected="true"]:active) {
            background: ${T};
            color: ${B};
        }

        :host([disabled]) {
            cursor: ${_};
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
            border-color: ${x};
        }

        :host([aria-checked="true"][aria-selected="true"]) {
            border-color: ${x};
            box-shadow: 0 0 0 calc(${v} * 2 * 1px) inset
                ${C};
        }
    `.withBehaviors(ne(d`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${re.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${re.Highlight};
                    color: ${re.HighlightText};
                }

                :host([disabled]),
                :host([disabled][aria-selected="false"]:hover) {
                    background: ${re.Canvas};
                    color: ${re.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }

                :host([aria-checked="true"][aria-selected="false"]) {
                    background: ${re.ButtonFace};
                    color: ${re.ButtonText};
                    border-color: ${re.ButtonText};
                }

                :host([aria-checked="true"][aria-selected="true"]),
                :host([aria-checked="true"][aria-selected="true"]:hover) {
                    background: ${re.Highlight};
                    color: ${re.HighlightText};
                    border-color: ${re.ButtonText};
                }
            `))});class Ce extends Se{constructor(){super(...arguments),this.listboxScrollWidth=""}connectedCallback(){super.connectedCallback(),this.listbox&&h.setValueFor(this.listbox,P)}get listboxMaxHeight(){return Math.floor(this.maxHeight/M.getValueFor(this)).toString()}listboxScrollWidthChanged(){this.updateComputedStylesheet()}get selectSize(){var e;return`${null!==(e=this.size)&&void 0!==e?e:this.multiple?4:0}`}multipleChanged(e,t){super.multipleChanged(e,t),this.updateComputedStylesheet()}maxHeightChanged(e,t){this.collapsible&&this.updateComputedStylesheet()}setPositioning(){super.setPositioning(),this.updateComputedStylesheet()}sizeChanged(e,t){super.sizeChanged(e,t),this.updateComputedStylesheet(),this.collapsible?requestAnimationFrame((()=>{this.listbox.style.setProperty("display","flex"),this.listbox.style.setProperty("overflow","visible"),this.listbox.style.setProperty("visibility","hidden"),this.listbox.style.setProperty("width","auto"),this.listbox.hidden=!1,this.listboxScrollWidth=`${this.listbox.scrollWidth}`,this.listbox.hidden=!0,this.listbox.style.removeProperty("display"),this.listbox.style.removeProperty("overflow"),this.listbox.style.removeProperty("visibility"),this.listbox.style.removeProperty("width")})):this.listboxScrollWidth=""}updateComputedStylesheet(){this.computedStylesheet&&this.$fastController.removeStyles(this.computedStylesheet),this.computedStylesheet=d`
            :host {
                --listbox-max-height: ${this.listboxMaxHeight};
                --listbox-scroll-width: ${this.listboxScrollWidth};
                --size: ${this.selectSize};
            }
        `,this.$fastController.addStyles(this.computedStylesheet)}}e([o],Ce.prototype,"listboxScrollWidth",void 0);const we=Ce.compose({baseName:"select",baseClass:Se,template:(e,t)=>l`
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
        ${ce((e=>e.collapsible),l`
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
                    ${K(e,t)}
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
                ${oe({filter:ve.slottedOptionFilter,flatten:!0,property:"slottedOptions"})}
            ></slot>
        </div>
    </template>
`,styles:(e,t)=>{const i=e.name===e.tagFor(Se);return d`
        ${ae("inline-flex")}

        :host {
            --elevation: 14;
            background: ${g};
            border-radius: calc(${u} * 1px);
            border: calc(${c} * 1px) solid ${y};
            box-sizing: border-box;
            color: ${$};
            font-family: ${m};
            height: calc(${j} * 1px);
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

        ${((e,t)=>{const i=e.tagFor(be),s=e.name===e.tagFor($e)?"":".listbox";return d`
        ${s?"":ae("inline-flex")}

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
                border-color: ${x};
                box-shadow: 0 0 0
                    calc((${v} - ${c}) * 1px)
                    ${x} inset;
            }

            :host([disabled]) ::slotted(*) {
                cursor: ${_};
                opacity: ${f};
                pointer-events: none;
            }
        `}

        ${s||":host([size])"} {
            max-height: calc(
                (var(--size) * ${j} + (${b} * ${c} * 2)) * 1px
            );
            overflow-y: auto;
        }

        :host([size="0"]) ${s} {
            max-height: none;
        }
    `.withBehaviors(ne(d`
                :host(:not([multiple]):${le}) ::slotted(${i}[aria-selected="true"]),
                :host([multiple]:${le}) ::slotted(${i}[aria-checked="true"]) {
                    border-color: ${re.ButtonText};
                    box-shadow: 0 0 0 calc(${v} * 1px) inset ${re.HighlightText};
                }

                :host(:not([multiple]):${le}) ::slotted(${i}[aria-selected="true"]) {
                    background: ${re.Highlight};
                    color: ${re.HighlightText};
                    fill: currentcolor;
                }

                ::slotted(${i}[aria-selected="true"]:not([aria-checked="true"])) {
                    background: ${re.Highlight};
                    border-color: ${re.HighlightText};
                    color: ${re.HighlightText};
                }
            `))})(e)}

        :host .listbox {
            ${de}
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
                (var(--listbox-max-height) * ${j} + var(--stroke-size)) * 1px
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

        :host(:${le}) {
            border-color: ${x};
        }

        :host(:not([size]):not([multiple]):not([open]):${le}),
        :host([multiple]:${le}),
        :host([size]:${le}) {
            box-shadow: 0 0 0 calc(${v} * 1px) ${x};
        }

        :host(:not([multiple]):not([size]):${le}) ::slotted(${e.tagFor(be)}[aria-selected="true"]:not([disabled])) {
            box-shadow: 0 0 0 calc(${v} * 1px) inset ${C};
            border-color: ${x};
            background: ${w};
            color: ${A};
        }

        :host([disabled]) {
            cursor: ${_};
            opacity: ${f};
        }

        :host([disabled]) .control {
            cursor: ${_};
            user-select: none;
        }

        :host([disabled]:hover) {
            background: ${H};
            color: ${$};
            fill: currentcolor;
        }

        :host(:not([disabled])) .control:active {
            background: ${E};
            border-color: ${T};
            border-radius: calc(${u} * 1px);
        }

        :host([open][position="above"]) .listbox {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom: 0;
            bottom: calc(${j} * 1px);
        }

        :host([open][position="below"]) .listbox {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            border-top: 0;
            top: calc(${j} * 1px);
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
            ${de}
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
    `.withBehaviors(ne(d`
                :host(:not([disabled]):hover),
                :host(:not([disabled]):active) {
                    border-color: ${re.Highlight};
                }

                :host(:not([disabled]):${le}) {
                    background-color: ${re.ButtonFace};
                    box-shadow: 0 0 0 calc(${v} * 1px) ${re.Highlight};
                    color: ${re.ButtonText};
                    fill: currentcolor;
                    forced-color-adjust: none;
                }

                :host(:not([disabled]):${le}) .listbox {
                    background: ${re.ButtonFace};
                }

                :host([disabled]) {
                    border-color: ${re.GrayText};
                    background-color: ${re.ButtonFace};
                    color: ${re.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                    forced-color-adjust: none;
                }

                :host([disabled]:hover) {
                    background: ${re.ButtonFace};
                }

                :host([disabled]) .control {
                    color: ${re.GrayText};
                    border-color: ${re.GrayText};
                }

                :host([disabled]) .control .select-indicator {
                    fill: ${re.GrayText};
                }

                :host(:${le}) ::slotted([aria-selected="true"][role="option"]),
                :host(:${le}) ::slotted(option[aria-selected="true"]),
                :host(:${le}) ::slotted([aria-selected="true"][role="option"]:not([disabled])) {
                    background: ${re.Highlight};
                    border-color: ${re.ButtonText};
                    box-shadow: 0 0 0 calc(${v} * 1px) inset ${re.HighlightText};
                    color: ${re.HighlightText};
                    fill: currentcolor;
                }

                .start,
                .end,
                .indicator,
                .select-indicator,
                ::slotted(svg) {
                    color: ${re.ButtonText};
                    fill: currentcolor;
                }
            `))},indicator:'\n        <svg\n            class="select-indicator"\n            part="select-indicator"\n            viewBox="0 0 12 7"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"\n            />\n        </svg>\n    '});L().withPrefix("site").register(we({}),Ie({}));
