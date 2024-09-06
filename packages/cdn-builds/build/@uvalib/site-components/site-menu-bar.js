import{i as t,_ as e,n as o,s as i,x as s}from"../../property-4490ebb8.js";
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class n extends HTMLElement{static get version(){return"24.0.0"}}customElements.define("vaadin-lumo-styles",n);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const r=window,a=r.ShadowRoot&&(void 0===r.ShadyCSS||r.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,l=Symbol(),d=new WeakMap;let c=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==l)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(a&&void 0===t){const o=void 0!==e&&1===e.length;o&&(t=d.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&d.set(e,t))}return t}toString(){return this.cssText}};const h=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,o,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+t[i+1]),t[0]);return new c(o,t,l)},u=a?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return(t=>new c("string"==typeof t?t:t+"",void 0,l))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var p;const m=window,_=m.trustedTypes,f=_?_.emptyScript:"",v=m.reactiveElementPolyfillSupport,y={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=null!==t;break;case Number:o=null===t?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch(t){o=null}}return o}},g=(t,e)=>e!==t&&(e==e||t==t),b={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:g},w="finalized";let A=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,o)=>{const i=this._$Ep(o,e);void 0!==i&&(this._$Ev.set(i,o),t.push(i))})),t}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const o="symbol"==typeof t?Symbol():"__"+t,i=this.getPropertyDescriptor(t,o,e);void 0!==i&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,e,o){return{get(){return this[e]},set(i){const s=this[t];this[e]=i,this.requestUpdate(t,s,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||b}static finalize(){if(this.hasOwnProperty(w))return!1;this[w]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const o of e)this.createProperty(o,t[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const t of o)e.unshift(u(t))}else void 0!==t&&e.push(u(t));return e}static _$Ep(t,e){const o=e.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,o;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(o=t.hostConnected)||void 0===o||o.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{a?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const o=document.createElement("style"),i=r.litNonce;void 0!==i&&o.setAttribute("nonce",i),o.textContent=e.cssText,t.appendChild(o)}))})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$EO(t,e,o=b){var i;const s=this.constructor._$Ep(t,o);if(void 0!==s&&!0===o.reflect){const n=(void 0!==(null===(i=o.converter)||void 0===i?void 0:i.toAttribute)?o.converter:y).toAttribute(e,o.type);this._$El=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$El=null}}_$AK(t,e){var o;const i=this.constructor,s=i._$Ev.get(t);if(void 0!==s&&this._$El!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(o=t.converter)||void 0===o?void 0:o.fromAttribute)?t.converter:y;this._$El=s,this[s]=n.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,o){let i=!0;void 0!==t&&(((o=o||this.constructor.getPropertyOptions(t)).hasChanged||g)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===o.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,o))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(o)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(o)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var x;A[w]=!0,A.elementProperties=new Map,A.elementStyles=[],A.shadowRootOptions={mode:"open"},null==v||v({ReactiveElement:A}),(null!==(p=m.reactiveElementVersions)&&void 0!==p?p:m.reactiveElementVersions=[]).push("1.6.3");const C=window,E=C.trustedTypes,P=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,O="$lit$",S=`lit$${(Math.random()+"").slice(9)}$`,T="?"+S,k=`<${T}>`,N=document,M=()=>N.createComment(""),L=t=>null===t||"object"!=typeof t&&"function"!=typeof t,I=Array.isArray,z="[ \t\n\f\r]",$=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,D=/>/g,B=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,U=/"/g,F=/^(?:script|style|textarea|title)$/i,j=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),Y=new WeakMap,q=N.createTreeWalker(N,129,null,!1);function W(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==P?P.createHTML(e):e}const K=(t,e)=>{const o=t.length-1,i=[];let s,n=2===e?"<svg>":"",r=$;for(let e=0;e<o;e++){const o=t[e];let a,l,d=-1,c=0;for(;c<o.length&&(r.lastIndex=c,l=r.exec(o),null!==l);)c=r.lastIndex,r===$?"!--"===l[1]?r=R:void 0!==l[1]?r=D:void 0!==l[2]?(F.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=B):void 0!==l[3]&&(r=B):r===B?">"===l[0]?(r=null!=s?s:$,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?B:'"'===l[3]?U:H):r===U||r===H?r=B:r===R||r===D?r=$:(r=B,s=void 0);const h=r===B&&t[e+1].startsWith("/>")?" ":"";n+=r===$?o+k:d>=0?(i.push(a),o.slice(0,d)+O+o.slice(d)+S+h):o+S+(-2===d?(i.push(void 0),e):h)}return[W(t,n+(t[o]||"<?>")+(2===e?"</svg>":"")),i]};class G{constructor({strings:t,_$litType$:e},o){let i;this.parts=[];let s=0,n=0;const r=t.length-1,a=this.parts,[l,d]=K(t,e);if(this.el=G.createElement(l,o),q.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(i=q.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes()){const t=[];for(const e of i.getAttributeNames())if(e.endsWith(O)||e.startsWith(S)){const o=d[n++];if(t.push(e),void 0!==o){const t=i.getAttribute(o.toLowerCase()+O).split(S),e=/([.?@])?(.*)/.exec(o);a.push({type:1,index:s,name:e[2],strings:t,ctor:"."===e[1]?tt:"?"===e[1]?ot:"@"===e[1]?it:Q})}else a.push({type:6,index:s})}for(const e of t)i.removeAttribute(e)}if(F.test(i.tagName)){const t=i.textContent.split(S),e=t.length-1;if(e>0){i.textContent=E?E.emptyScript:"";for(let o=0;o<e;o++)i.append(t[o],M()),q.nextNode(),a.push({type:2,index:++s});i.append(t[e],M())}}}else if(8===i.nodeType)if(i.data===T)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=i.data.indexOf(S,t+1));)a.push({type:7,index:s}),t+=S.length-1}s++}}static createElement(t,e){const o=N.createElement("template");return o.innerHTML=t,o}}function J(t,e,o=t,i){var s,n,r,a;if(e===j)return e;let l=void 0!==i?null===(s=o._$Co)||void 0===s?void 0:s[i]:o._$Cl;const d=L(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===d?l=void 0:(l=new d(t),l._$AT(t,o,i)),void 0!==i?(null!==(r=(a=o)._$Co)&&void 0!==r?r:a._$Co=[])[i]=l:o._$Cl=l),void 0!==l&&(e=J(t,l._$AS(t,e.values),l,i)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:o},parts:i}=this._$AD,s=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:N).importNode(o,!0);q.currentNode=s;let n=q.nextNode(),r=0,a=0,l=i[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new Z(n,n.nextSibling,this,t):1===l.type?e=new l.ctor(n,l.name,l.strings,this,t):6===l.type&&(e=new st(n,this,t)),this._$AV.push(e),l=i[++a]}r!==(null==l?void 0:l.index)&&(n=q.nextNode(),r++)}return q.currentNode=N,s}v(t){let e=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}}class Z{constructor(t,e,o,i){var s;this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=i,this._$Cp=null===(s=null==i?void 0:i.isConnected)||void 0===s||s}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),L(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==j&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>I(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==V&&L(this._$AH)?this._$AA.nextSibling.data=t:this.$(N.createTextNode(t)),this._$AH=t}g(t){var e;const{values:o,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(W(i.h,i.h[0]),this.options)),i);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===s)this._$AH.v(o);else{const t=new X(s,this),e=t.u(this.options);t.v(o),this.$(e),this._$AH=t}}_$AC(t){let e=Y.get(t.strings);return void 0===e&&Y.set(t.strings,e=new G(t)),e}T(t){I(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,i=0;for(const s of t)i===e.length?e.push(o=new Z(this.k(M()),this.k(M()),this,this.options)):o=e[i],o._$AI(s),i++;i<e.length&&(this._$AR(o&&o._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var o;for(null===(o=this._$AP)||void 0===o||o.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Q{constructor(t,e,o,i,s){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=s,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=V}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,o,i){const s=this.strings;let n=!1;if(void 0===s)t=J(this,t,e,0),n=!L(t)||t!==this._$AH&&t!==j,n&&(this._$AH=t);else{const i=t;let r,a;for(t=s[0],r=0;r<s.length-1;r++)a=J(this,i[o+r],e,r),a===j&&(a=this._$AH[r]),n||(n=!L(a)||a!==this._$AH[r]),a===V?t=V:t!==V&&(t+=(null!=a?a:"")+s[r+1]),this._$AH[r]=a}n&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}const et=E?E.emptyScript:"";class ot extends Q{constructor(){super(...arguments),this.type=4}j(t){t&&t!==V?this.element.setAttribute(this.name,et):this.element.removeAttribute(this.name)}}class it extends Q{constructor(t,e,o,i,s){super(t,e,o,i,s),this.type=5}_$AI(t,e=this){var o;if((t=null!==(o=J(this,t,e,0))&&void 0!==o?o:V)===j)return;const i=this._$AH,s=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==V&&(i===V||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,o;"function"==typeof this._$AH?this._$AH.call(null!==(o=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==o?o:this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const nt=C.litHtmlPolyfillSupport;null==nt||nt(G,Z),(null!==(x=C.litHtmlVersions)&&void 0!==x?x:C.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var rt,at;class lt extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const o=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=o.firstChild),o}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,o)=>{var i,s;const n=null!==(i=null==o?void 0:o.renderBefore)&&void 0!==i?i:e;let r=n._$litPart$;if(void 0===r){const t=null!==(s=null==o?void 0:o.renderBefore)&&void 0!==s?s:null;n._$litPart$=r=new Z(e.insertBefore(M(),t),t,void 0,null!=o?o:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return j}}lt.finalized=!0,lt._$litElement$=!0,null===(rt=globalThis.litElementHydrateSupport)||void 0===rt||rt.call(globalThis,{LitElement:lt});const dt=globalThis.litElementPolyfillSupport;null==dt||dt({LitElement:lt}),(null!==(at=globalThis.litElementVersions)&&void 0!==at?at:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ct=t=>class extends t{static get properties(){return{_theme:{type:String,readOnly:!0}}}static get observedAttributes(){return[...super.observedAttributes,"theme"]}attributeChangedCallback(t,e,o){super.attributeChangedCallback(t,e,o),"theme"===t&&this._set_theme(o)}}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,ht=[];function ut(t){return t&&Object.prototype.hasOwnProperty.call(t,"__themes")}function pt(t,e,o={}){var i;t&&(i=t,ut(customElements.get(i))&&console.warn(`The custom element definition for "${t}"\n      was finalized before a style module was registered.\n      Make sure to add component specific style modules before\n      importing the corresponding custom element.`)),e=function(t=[]){return[t].flat(1/0).filter((t=>t instanceof c||(console.warn("An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`."),!1)))}(e),window.Vaadin&&window.Vaadin.styleModules?window.Vaadin.styleModules.registerStyles(t,e,o):ht.push({themeFor:t,styles:e,include:o.include,moduleId:o.moduleId})}function mt(){return window.Vaadin&&window.Vaadin.styleModules?window.Vaadin.styleModules.getAllThemes():ht}function _t(t=""){let e=0;return t.startsWith("lumo-")||t.startsWith("material-")?e=1:t.startsWith("vaadin-")&&(e=2),e}function ft(t){const e=[];return t.include&&[].concat(t.include).forEach((t=>{const o=mt().find((e=>e.moduleId===t));o?e.push(...ft(o),...o.styles):console.warn(`Included moduleId ${t} not found in style registry`)}),t.styles),e}function vt(t){const e=`${t}-default-theme`,o=mt().filter((o=>o.moduleId!==e&&function(t,e){return(t||"").split(" ").some((t=>new RegExp(`^${t.split("*").join(".*")}$`,"u").test(e)))}(o.themeFor,t))).map((t=>({...t,styles:[...ft(t),...t.styles],includePriority:_t(t.moduleId)}))).sort(((t,e)=>e.includePriority-t.includePriority));return o.length>0?o:mt().filter((t=>t.moduleId===e))}const yt=t=>class extends(ct(t)){static finalize(){if(super.finalize(),this.elementStyles)return;const t=this.prototype._template;t&&!ut(this)&&function(t,e){const o=document.createElement("style");o.innerHTML=t.map((t=>t.cssText)).join("\n"),e.content.appendChild(o)}(this.getStylesForThis(),t)}static finalizeStyles(t){const e=this.getStylesForThis();return t?[...super.finalizeStyles(t),...e]:e}static getStylesForThis(){const t=Object.getPrototypeOf(this.prototype),e=(t?t.constructor.__themes:[])||[];this.__themes=[...e,...vt(this.is)];const o=this.__themes.flatMap((t=>t.styles));return o.filter(((t,e)=>e===o.lastIndexOf(t)))}}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,gt=h`
  :host {
    /* Base (background) */
    --lumo-base-color: #fff;

    /* Tint */
    --lumo-tint-5pct: hsla(0, 0%, 100%, 0.3);
    --lumo-tint-10pct: hsla(0, 0%, 100%, 0.37);
    --lumo-tint-20pct: hsla(0, 0%, 100%, 0.44);
    --lumo-tint-30pct: hsla(0, 0%, 100%, 0.5);
    --lumo-tint-40pct: hsla(0, 0%, 100%, 0.57);
    --lumo-tint-50pct: hsla(0, 0%, 100%, 0.64);
    --lumo-tint-60pct: hsla(0, 0%, 100%, 0.7);
    --lumo-tint-70pct: hsla(0, 0%, 100%, 0.77);
    --lumo-tint-80pct: hsla(0, 0%, 100%, 0.84);
    --lumo-tint-90pct: hsla(0, 0%, 100%, 0.9);
    --lumo-tint: #fff;

    /* Shade */
    --lumo-shade-5pct: hsla(214, 61%, 25%, 0.05);
    --lumo-shade-10pct: hsla(214, 57%, 24%, 0.1);
    --lumo-shade-20pct: hsla(214, 53%, 23%, 0.16);
    --lumo-shade-30pct: hsla(214, 50%, 22%, 0.26);
    --lumo-shade-40pct: hsla(214, 47%, 21%, 0.38);
    --lumo-shade-50pct: hsla(214, 45%, 20%, 0.52);
    --lumo-shade-60pct: hsla(214, 43%, 19%, 0.6);
    --lumo-shade-70pct: hsla(214, 42%, 18%, 0.69);
    --lumo-shade-80pct: hsla(214, 41%, 17%, 0.83);
    --lumo-shade-90pct: hsla(214, 40%, 16%, 0.94);
    --lumo-shade: hsl(214, 35%, 15%);

    /* Contrast */
    --lumo-contrast-5pct: var(--lumo-shade-5pct);
    --lumo-contrast-10pct: var(--lumo-shade-10pct);
    --lumo-contrast-20pct: var(--lumo-shade-20pct);
    --lumo-contrast-30pct: var(--lumo-shade-30pct);
    --lumo-contrast-40pct: var(--lumo-shade-40pct);
    --lumo-contrast-50pct: var(--lumo-shade-50pct);
    --lumo-contrast-60pct: var(--lumo-shade-60pct);
    --lumo-contrast-70pct: var(--lumo-shade-70pct);
    --lumo-contrast-80pct: var(--lumo-shade-80pct);
    --lumo-contrast-90pct: var(--lumo-shade-90pct);
    --lumo-contrast: var(--lumo-shade);

    /* Text */
    --lumo-header-text-color: var(--lumo-contrast);
    --lumo-body-text-color: var(--lumo-contrast-90pct);
    --lumo-secondary-text-color: var(--lumo-contrast-70pct);
    --lumo-tertiary-text-color: var(--lumo-contrast-50pct);
    --lumo-disabled-text-color: var(--lumo-contrast-30pct);

    /* Primary */
    --lumo-primary-color: hsl(214, 100%, 48%);
    --lumo-primary-color-50pct: hsla(214, 100%, 49%, 0.76);
    --lumo-primary-color-10pct: hsla(214, 100%, 60%, 0.13);
    --lumo-primary-text-color: hsl(214, 100%, 43%);
    --lumo-primary-contrast-color: #fff;

    /* Error */
    --lumo-error-color: hsl(3, 85%, 48%);
    --lumo-error-color-50pct: hsla(3, 85%, 49%, 0.5);
    --lumo-error-color-10pct: hsla(3, 85%, 49%, 0.1);
    --lumo-error-text-color: hsl(3, 89%, 42%);
    --lumo-error-contrast-color: #fff;

    /* Success */
    --lumo-success-color: hsl(145, 72%, 30%);
    --lumo-success-color-50pct: hsla(145, 72%, 31%, 0.5);
    --lumo-success-color-10pct: hsla(145, 72%, 31%, 0.1);
    --lumo-success-text-color: hsl(145, 85%, 25%);
    --lumo-success-contrast-color: #fff;
  }
`,bt=document.createElement("template");bt.innerHTML=`<style>${gt.toString().replace(":host","html")}</style>`,document.head.appendChild(bt.content);pt("",h`
  [theme~='dark'] {
    /* Base (background) */
    --lumo-base-color: hsl(214, 35%, 21%);

    /* Tint */
    --lumo-tint-5pct: hsla(214, 65%, 85%, 0.06);
    --lumo-tint-10pct: hsla(214, 60%, 80%, 0.14);
    --lumo-tint-20pct: hsla(214, 64%, 82%, 0.23);
    --lumo-tint-30pct: hsla(214, 69%, 84%, 0.32);
    --lumo-tint-40pct: hsla(214, 73%, 86%, 0.41);
    --lumo-tint-50pct: hsla(214, 78%, 88%, 0.5);
    --lumo-tint-60pct: hsla(214, 82%, 90%, 0.58);
    --lumo-tint-70pct: hsla(214, 87%, 92%, 0.69);
    --lumo-tint-80pct: hsla(214, 91%, 94%, 0.8);
    --lumo-tint-90pct: hsla(214, 96%, 96%, 0.9);
    --lumo-tint: hsl(214, 100%, 98%);

    /* Shade */
    --lumo-shade-5pct: hsla(214, 0%, 0%, 0.07);
    --lumo-shade-10pct: hsla(214, 4%, 2%, 0.15);
    --lumo-shade-20pct: hsla(214, 8%, 4%, 0.23);
    --lumo-shade-30pct: hsla(214, 12%, 6%, 0.32);
    --lumo-shade-40pct: hsla(214, 16%, 8%, 0.41);
    --lumo-shade-50pct: hsla(214, 20%, 10%, 0.5);
    --lumo-shade-60pct: hsla(214, 24%, 12%, 0.6);
    --lumo-shade-70pct: hsla(214, 28%, 13%, 0.7);
    --lumo-shade-80pct: hsla(214, 32%, 13%, 0.8);
    --lumo-shade-90pct: hsla(214, 33%, 13%, 0.9);
    --lumo-shade: hsl(214, 33%, 13%);

    /* Contrast */
    --lumo-contrast-5pct: var(--lumo-tint-5pct);
    --lumo-contrast-10pct: var(--lumo-tint-10pct);
    --lumo-contrast-20pct: var(--lumo-tint-20pct);
    --lumo-contrast-30pct: var(--lumo-tint-30pct);
    --lumo-contrast-40pct: var(--lumo-tint-40pct);
    --lumo-contrast-50pct: var(--lumo-tint-50pct);
    --lumo-contrast-60pct: var(--lumo-tint-60pct);
    --lumo-contrast-70pct: var(--lumo-tint-70pct);
    --lumo-contrast-80pct: var(--lumo-tint-80pct);
    --lumo-contrast-90pct: var(--lumo-tint-90pct);
    --lumo-contrast: var(--lumo-tint);

    /* Text */
    --lumo-header-text-color: var(--lumo-contrast);
    --lumo-body-text-color: var(--lumo-contrast-90pct);
    --lumo-secondary-text-color: var(--lumo-contrast-70pct);
    --lumo-tertiary-text-color: var(--lumo-contrast-50pct);
    --lumo-disabled-text-color: var(--lumo-contrast-30pct);

    /* Primary */
    --lumo-primary-color: hsl(214, 90%, 48%);
    --lumo-primary-color-50pct: hsla(214, 90%, 70%, 0.69);
    --lumo-primary-color-10pct: hsla(214, 90%, 55%, 0.13);
    --lumo-primary-text-color: hsl(214, 90%, 77%);
    --lumo-primary-contrast-color: #fff;

    /* Error */
    --lumo-error-color: hsl(3, 79%, 49%);
    --lumo-error-color-50pct: hsla(3, 75%, 62%, 0.5);
    --lumo-error-color-10pct: hsla(3, 75%, 62%, 0.14);
    --lumo-error-text-color: hsl(3, 100%, 80%);

    /* Success */
    --lumo-success-color: hsl(145, 72%, 30%);
    --lumo-success-color-50pct: hsla(145, 92%, 51%, 0.5);
    --lumo-success-color-10pct: hsla(145, 92%, 51%, 0.1);
    --lumo-success-text-color: hsl(145, 85%, 46%);
  }

  html {
    color: var(--lumo-body-text-color);
    background-color: var(--lumo-base-color);
    color-scheme: light;
  }

  [theme~='dark'] {
    color: var(--lumo-body-text-color);
    background-color: var(--lumo-base-color);
    color-scheme: dark;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--lumo-header-text-color);
  }

  a:where(:any-link) {
    color: var(--lumo-primary-text-color);
  }

  a:not(:any-link) {
    color: var(--lumo-disabled-text-color);
  }

  blockquote {
    color: var(--lumo-secondary-text-color);
  }

  code,
  pre {
    background-color: var(--lumo-contrast-10pct);
    border-radius: var(--lumo-border-radius-m);
  }
`,{moduleId:"lumo-color"});
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const wt=h`
  :host {
    --lumo-size-xs: 1.625rem;
    --lumo-size-s: 1.875rem;
    --lumo-size-m: 2.25rem;
    --lumo-size-l: 2.75rem;
    --lumo-size-xl: 3.5rem;

    /* Icons */
    --lumo-icon-size-s: 1.25em;
    --lumo-icon-size-m: 1.5em;
    --lumo-icon-size-l: 2.25em;
    /* For backwards compatibility */
    --lumo-icon-size: var(--lumo-icon-size-m);
  }
`,At=document.createElement("template");At.innerHTML=`<style>${wt.toString().replace(":host","html")}</style>`,document.head.appendChild(At.content);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const xt=h`
  :host {
    /* Square */
    --lumo-space-xs: 0.25rem;
    --lumo-space-s: 0.5rem;
    --lumo-space-m: 1rem;
    --lumo-space-l: 1.5rem;
    --lumo-space-xl: 2.5rem;

    /* Wide */
    --lumo-space-wide-xs: calc(var(--lumo-space-xs) / 2) var(--lumo-space-xs);
    --lumo-space-wide-s: calc(var(--lumo-space-s) / 2) var(--lumo-space-s);
    --lumo-space-wide-m: calc(var(--lumo-space-m) / 2) var(--lumo-space-m);
    --lumo-space-wide-l: calc(var(--lumo-space-l) / 2) var(--lumo-space-l);
    --lumo-space-wide-xl: calc(var(--lumo-space-xl) / 2) var(--lumo-space-xl);

    /* Tall */
    --lumo-space-tall-xs: var(--lumo-space-xs) calc(var(--lumo-space-xs) / 2);
    --lumo-space-tall-s: var(--lumo-space-s) calc(var(--lumo-space-s) / 2);
    --lumo-space-tall-m: var(--lumo-space-m) calc(var(--lumo-space-m) / 2);
    --lumo-space-tall-l: var(--lumo-space-l) calc(var(--lumo-space-l) / 2);
    --lumo-space-tall-xl: var(--lumo-space-xl) calc(var(--lumo-space-xl) / 2);
  }
`,Ct=document.createElement("template");Ct.innerHTML=`<style>${xt.toString().replace(":host","html")}</style>`,document.head.appendChild(Ct.content);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Et=h`
  :host {
    /* Border radius */
    --lumo-border-radius-s: 0.25em; /* Checkbox, badge, date-picker year indicator, etc */
    --lumo-border-radius-m: var(--lumo-border-radius, 0.25em); /* Button, text field, menu overlay, etc */
    --lumo-border-radius-l: 0.5em; /* Dialog, notification, etc */

    /* Shadow */
    --lumo-box-shadow-xs: 0 1px 4px -1px var(--lumo-shade-50pct);
    --lumo-box-shadow-s: 0 2px 4px -1px var(--lumo-shade-20pct), 0 3px 12px -1px var(--lumo-shade-30pct);
    --lumo-box-shadow-m: 0 2px 6px -1px var(--lumo-shade-20pct), 0 8px 24px -4px var(--lumo-shade-40pct);
    --lumo-box-shadow-l: 0 3px 18px -2px var(--lumo-shade-20pct), 0 12px 48px -6px var(--lumo-shade-40pct);
    --lumo-box-shadow-xl: 0 4px 24px -3px var(--lumo-shade-20pct), 0 18px 64px -8px var(--lumo-shade-40pct);

    /* Clickable element cursor */
    --lumo-clickable-cursor: default;
  }
`;h`
  html {
    --vaadin-checkbox-size: calc(var(--lumo-size-m) / 2);
    --vaadin-radio-button-size: calc(var(--lumo-size-m) / 2);
    --vaadin-input-field-border-radius: var(--lumo-border-radius-m);
  }
`;const Pt=document.createElement("template");Pt.innerHTML=`<style>${Et.toString().replace(":host","html")}$</style>`,document.head.appendChild(Pt.content);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Ot=h`
  :host {
    /* prettier-ignore */
    --lumo-font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

    /* Font sizes */
    --lumo-font-size-xxs: 0.75rem;
    --lumo-font-size-xs: 0.8125rem;
    --lumo-font-size-s: 0.875rem;
    --lumo-font-size-m: 1rem;
    --lumo-font-size-l: 1.125rem;
    --lumo-font-size-xl: 1.375rem;
    --lumo-font-size-xxl: 1.75rem;
    --lumo-font-size-xxxl: 2.5rem;

    /* Line heights */
    --lumo-line-height-xs: 1.25;
    --lumo-line-height-s: 1.375;
    --lumo-line-height-m: 1.625;
  }
`;pt("",h`
  body,
  :host {
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    line-height: var(--lumo-line-height-m);
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  small,
  [theme~='font-size-s'] {
    font-size: var(--lumo-font-size-s);
    line-height: var(--lumo-line-height-s);
  }

  [theme~='font-size-xs'] {
    font-size: var(--lumo-font-size-xs);
    line-height: var(--lumo-line-height-xs);
  }

  :where(h1, h2, h3, h4, h5, h6) {
    font-weight: 600;
    line-height: var(--lumo-line-height-xs);
    margin: 0;
  }

  :where(h1) {
    font-size: var(--lumo-font-size-xxxl);
  }

  :where(h2) {
    font-size: var(--lumo-font-size-xxl);
  }

  :where(h3) {
    font-size: var(--lumo-font-size-xl);
  }

  :where(h4) {
    font-size: var(--lumo-font-size-l);
  }

  :where(h5) {
    font-size: var(--lumo-font-size-m);
  }

  :where(h6) {
    font-size: var(--lumo-font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  p,
  blockquote {
    margin-top: 0.5em;
    margin-bottom: 0.75em;
  }

  a {
    text-decoration: none;
  }

  a:where(:any-link):hover {
    text-decoration: underline;
  }

  hr {
    display: block;
    align-self: stretch;
    height: 1px;
    border: 0;
    padding: 0;
    margin: var(--lumo-space-s) calc(var(--lumo-border-radius-m) / 2);
    background-color: var(--lumo-contrast-10pct);
  }

  blockquote {
    border-left: 2px solid var(--lumo-contrast-30pct);
  }

  b,
  strong {
    font-weight: 600;
  }

  /* RTL specific styles */
  blockquote[dir='rtl'] {
    border-left: none;
    border-right: 2px solid var(--lumo-contrast-30pct);
  }
`,{moduleId:"lumo-typography"});const St=document.createElement("template");St.innerHTML=`<style>${Ot.toString().replace(":host","html")}</style>`,document.head.appendChild(St.content);const Tt=h`
  :host {
    /* Sizing */
    --lumo-button-size: var(--lumo-size-m);
    min-width: calc(var(--lumo-button-size) * 2);
    height: var(--lumo-button-size);
    padding: 0 calc(var(--lumo-button-size) / 3 + var(--lumo-border-radius-m) / 2);
    margin: var(--lumo-space-xs) 0;
    box-sizing: border-box;
    /* Style */
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    font-weight: 500;
    color: var(--_lumo-button-color, var(--lumo-primary-text-color));
    background-color: var(--_lumo-button-background-color, var(--lumo-contrast-5pct));
    border-radius: var(--lumo-border-radius-m);
    cursor: var(--lumo-clickable-cursor);
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    flex-shrink: 0;
  }

  /* Set only for the internal parts so we don't affect the host vertical alignment */
  [part='label'],
  [part='prefix'],
  [part='suffix'] {
    line-height: var(--lumo-line-height-xs);
  }

  [part='label'] {
    padding: calc(var(--lumo-button-size) / 6) 0;
  }

  :host([theme~='small']) {
    font-size: var(--lumo-font-size-s);
    --lumo-button-size: var(--lumo-size-s);
  }

  :host([theme~='large']) {
    font-size: var(--lumo-font-size-l);
    --lumo-button-size: var(--lumo-size-l);
  }

  /* For interaction states */
  :host::before,
  :host::after {
    content: '';
    /* We rely on the host always being relative */
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: currentColor;
    border-radius: inherit;
    opacity: 0;
    pointer-events: none;
  }

  /* Hover */

  @media (any-hover: hover) {
    :host(:hover)::before {
      opacity: 0.02;
    }
  }

  /* Active */

  :host::after {
    transition: opacity 1.4s, transform 0.1s;
    filter: blur(8px);
  }

  :host([active])::before {
    opacity: 0.05;
    transition-duration: 0s;
  }

  :host([active])::after {
    opacity: 0.1;
    transition-duration: 0s, 0s;
    transform: scale(0);
  }

  /* Keyboard focus */

  :host([focus-ring]) {
    box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
  }

  :host([theme~='primary'][focus-ring]) {
    box-shadow: 0 0 0 1px var(--lumo-base-color), 0 0 0 3px var(--lumo-primary-color-50pct);
  }

  /* Types (primary, tertiary, tertiary-inline */

  :host([theme~='tertiary']),
  :host([theme~='tertiary-inline']) {
    background-color: transparent !important;
    min-width: 0;
  }

  :host([theme~='tertiary']) {
    padding: 0 calc(var(--lumo-button-size) / 6);
  }

  :host([theme~='tertiary-inline'])::before {
    display: none;
  }

  :host([theme~='tertiary-inline']) {
    margin: 0;
    height: auto;
    padding: 0;
    line-height: inherit;
    font-size: inherit;
  }

  :host([theme~='tertiary-inline']) [part='label'] {
    padding: 0;
    overflow: visible;
    line-height: inherit;
  }

  :host([theme~='primary']) {
    background-color: var(--_lumo-button-primary-background-color, var(--lumo-primary-color));
    color: var(--_lumo-button-primary-color, var(--lumo-primary-contrast-color));
    font-weight: 600;
    min-width: calc(var(--lumo-button-size) * 2.5);
  }

  :host([theme~='primary'])::before {
    background-color: black;
  }

  @media (any-hover: hover) {
    :host([theme~='primary']:hover)::before {
      opacity: 0.05;
    }
  }

  :host([theme~='primary'][active])::before {
    opacity: 0.1;
  }

  :host([theme~='primary'][active])::after {
    opacity: 0.2;
  }

  /* Colors (success, error, contrast) */

  :host([theme~='success']) {
    color: var(--lumo-success-text-color);
  }

  :host([theme~='success'][theme~='primary']) {
    background-color: var(--lumo-success-color);
    color: var(--lumo-success-contrast-color);
  }

  :host([theme~='error']) {
    color: var(--lumo-error-text-color);
  }

  :host([theme~='error'][theme~='primary']) {
    background-color: var(--lumo-error-color);
    color: var(--lumo-error-contrast-color);
  }

  :host([theme~='contrast']) {
    color: var(--lumo-contrast);
  }

  :host([theme~='contrast'][theme~='primary']) {
    background-color: var(--lumo-contrast);
    color: var(--lumo-base-color);
  }

  /* Disabled state. Keep selectors after other color variants. */

  :host([disabled]) {
    pointer-events: none;
    color: var(--lumo-disabled-text-color);
  }

  :host([theme~='primary'][disabled]) {
    background-color: var(--lumo-contrast-30pct);
    color: var(--lumo-base-color);
  }

  :host([theme~='primary'][disabled]) [part] {
    opacity: 0.7;
  }

  /* Icons */

  [part] ::slotted(vaadin-icon) {
    display: inline-block;
    width: var(--lumo-icon-size-m);
    height: var(--lumo-icon-size-m);
  }

  /* Vaadin icons are based on a 16x16 grid (unlike Lumo and Material icons with 24x24), so they look too big by default */
  [part] ::slotted(vaadin-icon[icon^='vaadin:']) {
    padding: 0.25em;
    box-sizing: border-box !important;
  }

  [part='prefix'] {
    margin-left: -0.25em;
    margin-right: 0.25em;
  }

  [part='suffix'] {
    margin-left: 0.25em;
    margin-right: -0.25em;
  }

  /* Icon-only */

  :host([theme~='icon']:not([theme~='tertiary-inline'])) {
    min-width: var(--lumo-button-size);
    padding-left: calc(var(--lumo-button-size) / 4);
    padding-right: calc(var(--lumo-button-size) / 4);
  }

  :host([theme~='icon']) [part='prefix'],
  :host([theme~='icon']) [part='suffix'] {
    margin-left: 0;
    margin-right: 0;
  }

  /* RTL specific styles */

  :host([dir='rtl']) [part='prefix'] {
    margin-left: 0.25em;
    margin-right: -0.25em;
  }

  :host([dir='rtl']) [part='suffix'] {
    margin-left: -0.25em;
    margin-right: 0.25em;
  }

  :host([dir='rtl'][theme~='icon']) [part='prefix'],
  :host([dir='rtl'][theme~='icon']) [part='suffix'] {
    margin-left: 0;
    margin-right: 0;
  }
`;pt("vaadin-button",Tt,{moduleId:"lumo-button"});pt("vaadin-menu-bar-button",[Tt,h`
  :host {
    margin: calc(var(--lumo-space-xs) / 2);
    margin-left: 0;
    border-radius: 0;
  }

  [part='label'] {
    width: 100%;
  }

  /* NOTE(web-padawan): avoid using shorthand padding property for IE11 */
  [part='label'] ::slotted(vaadin-menu-bar-item) {
    justify-content: center;
    background-color: transparent;
    height: var(--lumo-button-size);
    margin: 0 calc((var(--lumo-size-m) / 3 + var(--lumo-border-radius-m) / 2) * -1);
    padding-left: calc(var(--lumo-size-m) / 3 + var(--lumo-border-radius-m) / 2);
    padding-right: calc(var(--lumo-size-m) / 3 + var(--lumo-border-radius-m) / 2);
  }

  :host([theme~='small']) [part='label'] ::slotted(vaadin-menu-bar-item) {
    min-height: var(--lumo-size-s);
    margin: 0 calc((var(--lumo-size-s) / 3 + var(--lumo-border-radius-m) / 2) * -1);
    padding-left: calc(var(--lumo-size-s) / 3 + var(--lumo-border-radius-m) / 2);
    padding-right: calc(var(--lumo-size-s) / 3 + var(--lumo-border-radius-m) / 2);
  }

  :host([theme~='tertiary']) [part='label'] ::slotted(vaadin-menu-bar-item) {
    margin: 0 calc((var(--lumo-button-size) / 6) * -1);
    padding-left: calc(var(--lumo-button-size) / 6);
    padding-right: calc(var(--lumo-button-size) / 6);
  }

  :host([theme~='tertiary-inline']) {
    margin-top: calc(var(--lumo-space-xs) / 2);
    margin-bottom: calc(var(--lumo-space-xs) / 2);
    margin-right: calc(var(--lumo-space-xs) / 2);
  }

  :host([theme~='tertiary-inline']) [part='label'] ::slotted(vaadin-menu-bar-item) {
    margin: 0;
    padding: 0;
  }

  :host(:first-of-type) {
    border-radius: var(--lumo-border-radius-m) 0 0 var(--lumo-border-radius-m);

    /* Needed to retain the focus-ring with border-radius */
    margin-left: calc(var(--lumo-space-xs) / 2);
  }

  :host(:nth-last-of-type(2)),
  :host([slot='overflow']) {
    border-radius: 0 var(--lumo-border-radius-m) var(--lumo-border-radius-m) 0;
  }

  :host([theme~='tertiary']),
  :host([theme~='tertiary-inline']) {
    border-radius: var(--lumo-border-radius-m);
  }

  :host([slot='overflow']) {
    min-width: var(--lumo-button-size);
    padding-left: calc(var(--lumo-button-size) / 4);
    padding-right: calc(var(--lumo-button-size) / 4);
  }

  :host([slot='overflow']) ::slotted(*) {
    font-size: var(--lumo-font-size-xl);
  }

  :host([slot='overflow']) [part='prefix'],
  :host([slot='overflow']) [part='suffix'] {
    margin-left: 0;
    margin-right: 0;
  }

  /* RTL styles */
  :host([dir='rtl']) {
    margin-left: calc(var(--lumo-space-xs) / 2);
    margin-right: 0;
    border-radius: 0;
  }

  :host([dir='rtl']:first-of-type) {
    border-radius: 0 var(--lumo-border-radius-m) var(--lumo-border-radius-m) 0;
    margin-right: calc(var(--lumo-space-xs) / 2);
  }

  :host([dir='rtl']:nth-last-of-type(2)),
  :host([dir='rtl'][slot='overflow']) {
    border-radius: var(--lumo-border-radius-m) 0 0 var(--lumo-border-radius-m);
  }
`],{moduleId:"lumo-menu-bar-button"}),
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
window.JSCompiler_renameProperty=function(t,e){return t};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let kt,Nt,Mt=/(url\()([^)]*)(\))/g,Lt=/(^\/[^\/])|(^#)|(^[\w-\d]*:)/;function It(t,e){if(t&&Lt.test(t))return t;if("//"===t)return t;if(void 0===kt){kt=!1;try{const t=new URL("b","http://a");t.pathname="c%20d",kt="http://a/c%20d"===t.href}catch(t){}}if(e||(e=document.baseURI||window.location.href),kt)try{return new URL(t,e).href}catch(e){return t}return Nt||(Nt=document.implementation.createHTMLDocument("temp"),Nt.base=Nt.createElement("base"),Nt.head.appendChild(Nt.base),Nt.anchor=Nt.createElement("a"),Nt.body.appendChild(Nt.anchor)),Nt.base.href=e,Nt.anchor.href=t,Nt.anchor.href||t}function zt(t,e){return t.replace(Mt,(function(t,o,i,s){return o+"'"+It(i.replace(/["']/g,""),e)+"'"+s}))}function $t(t){return t.substring(0,t.lastIndexOf("/")+1)}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const Rt=!window.ShadyDOM||!window.ShadyDOM.inUse;Boolean(!window.ShadyCSS||window.ShadyCSS.nativeCss);const Dt=Rt&&"adoptedStyleSheets"in Document.prototype&&"replaceSync"in CSSStyleSheet.prototype&&(()=>{try{const t=new CSSStyleSheet;t.replaceSync("");const e=document.createElement("div");return e.attachShadow({mode:"open"}),e.shadowRoot.adoptedStyleSheets=[t],e.shadowRoot.adoptedStyleSheets[0]===t}catch(t){return!1}})();let Bt=window.Polymer&&window.Polymer.rootPath||$t(document.baseURI||window.location.href),Ht=window.Polymer&&window.Polymer.sanitizeDOMValue||void 0;window.Polymer&&window.Polymer.setPassiveTouchGestures;let Ut=window.Polymer&&window.Polymer.strictTemplatePolicy||!1,Ft=window.Polymer&&window.Polymer.allowTemplateFromDomModule||!1,jt=window.Polymer&&window.Polymer.legacyOptimizations||!1,Vt=window.Polymer&&window.Polymer.legacyWarnings||!1,Yt=window.Polymer&&window.Polymer.syncInitialRender||!1,qt=window.Polymer&&window.Polymer.legacyUndefined||!1,Wt=window.Polymer&&window.Polymer.orderedComputed||!1,Kt=window.Polymer&&window.Polymer.removeNestedTemplates||!1,Gt=window.Polymer&&window.Polymer.fastDomIf||!1;window.Polymer&&window.Polymer.suppressTemplateNotifications,window.Polymer&&window.Polymer.legacyNoObservedAttributes;let Jt=window.Polymer&&window.Polymer.useAdoptedStyleSheetsWithBuiltCSS||!1,Xt=0;
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const Zt=function(t){let e=t.__mixinApplications;e||(e=new WeakMap,t.__mixinApplications=e);let o=Xt++;return function(i){let s=i.__mixinSet;if(s&&s[o])return i;let n=e,r=n.get(i);if(!r){r=t(i),n.set(i,r);let e=Object.create(r.__mixinSet||s||null);e[o]=!0,r.__mixinSet=e}return r}};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/let Qt={},te={};function ee(t,e){Qt[t]=te[t.toLowerCase()]=e}function oe(t){return Qt[t]||te[t.toLowerCase()]}class ie extends HTMLElement{static get observedAttributes(){return["id"]}static import(t,e){if(t){let o=oe(t);return o&&e?o.querySelector(e):o}return null}attributeChangedCallback(t,e,o,i){e!==o&&this.register()}get assetpath(){if(!this.__assetpath){const t=window.HTMLImports&&HTMLImports.importForElement?HTMLImports.importForElement(this)||document:this.ownerDocument,e=It(this.getAttribute("assetpath")||"",t.baseURI);this.__assetpath=$t(e)}return this.__assetpath}register(t){if(t=t||this.id){if(Ut&&void 0!==oe(t))throw ee(t,null),new Error(`strictTemplatePolicy: dom-module ${t} re-registered`);this.id=t,ee(t,this),(e=this).querySelector("style")&&console.warn("dom-module %s has style outside template",e.id)}var e}}ie.prototype.modules=Qt,customElements.define("dom-module",ie);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const se="link[rel=import][type~=css]",ne="include",re="shady-unscoped";function ae(t){return ie.import(t)}function le(t){const e=zt((t.body?t.body:t).textContent,t.baseURI),o=document.createElement("style");return o.textContent=e,o}function de(t){const e=t.trim().split(/\s+/),o=[];for(let t=0;t<e.length;t++)o.push(...ce(e[t]));return o}function ce(t){const e=ae(t);if(!e)return console.warn("Could not find style data in module named",t),[];if(void 0===e._styles){const t=[];t.push(...ue(e));const o=e.querySelector("template");o&&t.push(...he(o,e.assetpath)),e._styles=t}return e._styles}function he(t,e){if(!t._styles){const o=[],i=t.content.querySelectorAll("style");for(let t=0;t<i.length;t++){let s=i[t],n=s.getAttribute(ne);n&&o.push(...de(n).filter((function(t,e,o){return o.indexOf(t)===e}))),e&&(s.textContent=zt(s.textContent,e)),o.push(s)}t._styles=o}return t._styles}function ue(t){const e=[],o=t.querySelectorAll(se);for(let t=0;t<o.length;t++){let i=o[t];if(i.import){const t=i.import,o=i.hasAttribute(re);if(o&&!t._unscopedStyle){const e=le(t);e.setAttribute(re,""),t._unscopedStyle=e}else t._style||(t._style=le(t));e.push(o?t._unscopedStyle:t._style)}}return e}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const pe=window.ShadyDOM&&window.ShadyDOM.noPatch&&window.ShadyDOM.wrap?window.ShadyDOM.wrap:window.ShadyDOM?t=>ShadyDOM.patch(t):t=>t;
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/function me(t){return t.indexOf(".")>=0}function _e(t){let e=t.indexOf(".");return-1===e?t:t.slice(0,e)}function fe(t,e){return 0===e.indexOf(t+".")}function ve(t,e,o){return e+o.slice(t.length)}function ye(t){if(Array.isArray(t)){let e=[];for(let o=0;o<t.length;o++){let i=t[o].toString().split(".");for(let t=0;t<i.length;t++)e.push(i[t])}return e.join(".")}return t}function ge(t){return Array.isArray(t)?ye(t).split("."):t.toString().split(".")}function be(t,e,o){let i=t,s=ge(e);for(let t=0;t<s.length;t++){if(!i)return;i=i[s[t]]}return o&&(o.path=s.join(".")),i}function we(t,e,o){let i=t,s=ge(e),n=s[s.length-1];if(s.length>1){for(let t=0;t<s.length-1;t++){if(i=i[s[t]],!i)return}i[n]=o}else i[e]=o;return s.join(".")}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const Ae={},xe=/-[a-z]/g,Ce=/([A-Z])/g;function Ee(t){return Ae[t]||(Ae[t]=t.indexOf("-")<0?t:t.replace(xe,(t=>t[1].toUpperCase())))}function Pe(t){return Ae[t]||(Ae[t]=t.replace(Ce,"-$1").toLowerCase())}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/let Oe=0,Se=0,Te=[],ke=0,Ne=!1,Me=document.createTextNode("");new window.MutationObserver((function(){Ne=!1;const t=Te.length;for(let e=0;e<t;e++){let t=Te[e];if(t)try{t()}catch(t){setTimeout((()=>{throw t}))}}Te.splice(0,t),Se+=t})).observe(Me,{characterData:!0});const Le={run:t=>(Ne||(Ne=!0,Me.textContent=ke++),Te.push(t),Oe++),cancel(t){const e=t-Se;if(e>=0){if(!Te[e])throw new Error("invalid async handle: "+t);Te[e]=null}}},Ie=Le,ze=Zt((t=>class extends t{static createProperties(t){const e=this.prototype;for(let o in t)o in e||e._createPropertyAccessor(o)}static attributeNameForProperty(t){return t.toLowerCase()}static typeForProperty(t){}_createPropertyAccessor(t,e){this._addPropertyToAttributeMap(t),this.hasOwnProperty(JSCompiler_renameProperty("__dataHasAccessor",this))||(this.__dataHasAccessor=Object.assign({},this.__dataHasAccessor)),this.__dataHasAccessor[t]||(this.__dataHasAccessor[t]=!0,this._definePropertyAccessor(t,e))}_addPropertyToAttributeMap(t){this.hasOwnProperty(JSCompiler_renameProperty("__dataAttributes",this))||(this.__dataAttributes=Object.assign({},this.__dataAttributes));let e=this.__dataAttributes[t];return e||(e=this.constructor.attributeNameForProperty(t),this.__dataAttributes[e]=t),e}_definePropertyAccessor(t,e){Object.defineProperty(this,t,{get(){return this.__data[t]},set:e?function(){}:function(e){this._setPendingProperty(t,e,!0)&&this._invalidateProperties()}})}constructor(){super(),this.__dataEnabled=!1,this.__dataReady=!1,this.__dataInvalid=!1,this.__data={},this.__dataPending=null,this.__dataOld=null,this.__dataInstanceProps=null,this.__dataCounter=0,this.__serializing=!1,this._initializeProperties()}ready(){this.__dataReady=!0,this._flushProperties()}_initializeProperties(){for(let t in this.__dataHasAccessor)this.hasOwnProperty(t)&&(this.__dataInstanceProps=this.__dataInstanceProps||{},this.__dataInstanceProps[t]=this[t],delete this[t])}_initializeInstanceProperties(t){Object.assign(this,t)}_setProperty(t,e){this._setPendingProperty(t,e)&&this._invalidateProperties()}_getProperty(t){return this.__data[t]}_setPendingProperty(t,e,o){let i=this.__data[t],s=this._shouldPropertyChange(t,e,i);return s&&(this.__dataPending||(this.__dataPending={},this.__dataOld={}),this.__dataOld&&!(t in this.__dataOld)&&(this.__dataOld[t]=i),this.__data[t]=e,this.__dataPending[t]=e),s}_isPropertyPending(t){return!(!this.__dataPending||!this.__dataPending.hasOwnProperty(t))}_invalidateProperties(){!this.__dataInvalid&&this.__dataReady&&(this.__dataInvalid=!0,Ie.run((()=>{this.__dataInvalid&&(this.__dataInvalid=!1,this._flushProperties())})))}_enableProperties(){this.__dataEnabled||(this.__dataEnabled=!0,this.__dataInstanceProps&&(this._initializeInstanceProperties(this.__dataInstanceProps),this.__dataInstanceProps=null),this.ready())}_flushProperties(){this.__dataCounter++;const t=this.__data,e=this.__dataPending,o=this.__dataOld;this._shouldPropertiesChange(t,e,o)&&(this.__dataPending=null,this.__dataOld=null,this._propertiesChanged(t,e,o)),this.__dataCounter--}_shouldPropertiesChange(t,e,o){return Boolean(e)}_propertiesChanged(t,e,o){}_shouldPropertyChange(t,e,o){return o!==e&&(o==o||e==e)}attributeChangedCallback(t,e,o,i){e!==o&&this._attributeToProperty(t,o),super.attributeChangedCallback&&super.attributeChangedCallback(t,e,o,i)}_attributeToProperty(t,e,o){if(!this.__serializing){const i=this.__dataAttributes,s=i&&i[t]||t;this[s]=this._deserializeValue(e,o||this.constructor.typeForProperty(s))}}_propertyToAttribute(t,e,o){this.__serializing=!0,o=arguments.length<3?this[t]:o,this._valueToNodeAttribute(this,o,e||this.constructor.attributeNameForProperty(t)),this.__serializing=!1}_valueToNodeAttribute(t,e,o){const i=this._serializeValue(e);"class"!==o&&"name"!==o&&"slot"!==o||(t=pe(t)),void 0===i?t.removeAttribute(o):t.setAttribute(o,""===i&&window.trustedTypes?window.trustedTypes.emptyScript:i)}_serializeValue(t){return"boolean"==typeof t?t?"":void 0:null!=t?t.toString():void 0}_deserializeValue(t,e){switch(e){case Boolean:return null!==t;case Number:return Number(t);default:return t}}})),$e={};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/let Re=HTMLElement.prototype;for(;Re;){let t=Object.getOwnPropertyNames(Re);for(let e=0;e<t.length;e++)$e[t[e]]=!0;Re=Object.getPrototypeOf(Re)}const De=window.trustedTypes?t=>trustedTypes.isHTML(t)||trustedTypes.isScript(t)||trustedTypes.isScriptURL(t):()=>!1;const Be=Zt((t=>{const e=ze(t);return class extends e{static createPropertiesForAttributes(){let t=this.observedAttributes;for(let e=0;e<t.length;e++)this.prototype._createPropertyAccessor(Ee(t[e]))}static attributeNameForProperty(t){return Pe(t)}_initializeProperties(){this.__dataProto&&(this._initializeProtoProperties(this.__dataProto),this.__dataProto=null),super._initializeProperties()}_initializeProtoProperties(t){for(let e in t)this._setProperty(e,t[e])}_ensureAttribute(t,e){const o=this;o.hasAttribute(t)||this._valueToNodeAttribute(o,e,t)}_serializeValue(t){if("object"==typeof t){if(t instanceof Date)return t.toString();if(t){if(De(t))return t;try{return JSON.stringify(t)}catch(t){return""}}}return super._serializeValue(t)}_deserializeValue(t,e){let o;switch(e){case Object:try{o=JSON.parse(t)}catch(e){o=t}break;case Array:try{o=JSON.parse(t)}catch(e){o=null,console.warn(`Polymer::Attributes: couldn't decode Array as JSON: ${t}`)}break;case Date:o=isNaN(t)?String(t):Number(t),o=new Date(o);break;default:o=super._deserializeValue(t,e)}return o}_definePropertyAccessor(t,e){!function(t,e){if(!$e[e]){let o=t[e];void 0!==o&&(t.__data?t._setPendingProperty(e,o):(t.__dataProto?t.hasOwnProperty(JSCompiler_renameProperty("__dataProto",t))||(t.__dataProto=Object.create(t.__dataProto)):t.__dataProto={},t.__dataProto[e]=o))}}(this,t),super._definePropertyAccessor(t,e)}_hasAccessor(t){return this.__dataHasAccessor&&this.__dataHasAccessor[t]}_isPropertyPending(t){return Boolean(this.__dataPending&&t in this.__dataPending)}}})),He={"dom-if":!0,"dom-repeat":!0};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/let Ue=!1,Fe=!1;function je(t){(function(){if(!Ue){Ue=!0;const t=document.createElement("textarea");t.placeholder="a",Fe=t.placeholder===t.textContent}return Fe})()&&"textarea"===t.localName&&t.placeholder&&t.placeholder===t.textContent&&(t.textContent=null)}const Ve=(()=>{const t=window.trustedTypes&&window.trustedTypes.createPolicy("polymer-template-event-attribute-policy",{createScript:t=>t});return(e,o,i)=>{const s=o.getAttribute(i);t&&i.startsWith("on-")?e.setAttribute(i,t.createScript(s,i)):e.setAttribute(i,s)}})();function Ye(t){let e=t.getAttribute("is");if(e&&He[e]){let o=t;for(o.removeAttribute("is"),t=o.ownerDocument.createElement(e),o.parentNode.replaceChild(t,o),t.appendChild(o);o.attributes.length;){const{name:e}=o.attributes[0];Ve(t,o,e),o.removeAttribute(e)}}return t}function qe(t,e){let o=e.parentInfo&&qe(t,e.parentInfo);if(!o)return t;for(let t=o.firstChild,i=0;t;t=t.nextSibling)if(e.parentIndex===i++)return t}function We(t,e,o,i){i.id&&(e[i.id]=o)}function Ke(t,e,o){if(o.events&&o.events.length)for(let i,s=0,n=o.events;s<n.length&&(i=n[s]);s++)t._addMethodEventListenerToNode(e,i.name,i.value,t)}function Ge(t,e,o,i){o.templateInfo&&(e._templateInfo=o.templateInfo,e._parentTemplateInfo=i)}const Je=Zt((t=>class extends t{static _parseTemplate(t,e){if(!t._templateInfo){let o=t._templateInfo={};o.nodeInfoList=[],o.nestedTemplate=Boolean(e),o.stripWhiteSpace=e&&e.stripWhiteSpace||t.hasAttribute&&t.hasAttribute("strip-whitespace"),this._parseTemplateContent(t,o,{parent:null})}return t._templateInfo}static _parseTemplateContent(t,e,o){return this._parseTemplateNode(t.content,e,o)}static _parseTemplateNode(t,e,o){let i=!1,s=t;return"template"!=s.localName||s.hasAttribute("preserve-content")?"slot"===s.localName&&(e.hasInsertionPoint=!0):i=this._parseTemplateNestedTemplate(s,e,o)||i,je(s),s.firstChild&&this._parseTemplateChildNodes(s,e,o),s.hasAttributes&&s.hasAttributes()&&(i=this._parseTemplateNodeAttributes(s,e,o)||i),i||o.noted}static _parseTemplateChildNodes(t,e,o){if("script"!==t.localName&&"style"!==t.localName)for(let i,s=t.firstChild,n=0;s;s=i){if("template"==s.localName&&(s=Ye(s)),i=s.nextSibling,s.nodeType===Node.TEXT_NODE){let o=i;for(;o&&o.nodeType===Node.TEXT_NODE;)s.textContent+=o.textContent,i=o.nextSibling,t.removeChild(o),o=i;if(e.stripWhiteSpace&&!s.textContent.trim()){t.removeChild(s);continue}}let r={parentIndex:n,parentInfo:o};this._parseTemplateNode(s,e,r)&&(r.infoIndex=e.nodeInfoList.push(r)-1),s.parentNode&&n++}}static _parseTemplateNestedTemplate(t,e,o){let i=t,s=this._parseTemplate(i,e);return(s.content=i.content.ownerDocument.createDocumentFragment()).appendChild(i.content),o.templateInfo=s,!0}static _parseTemplateNodeAttributes(t,e,o){let i=!1,s=Array.from(t.attributes);for(let n,r=s.length-1;n=s[r];r--)i=this._parseTemplateNodeAttribute(t,e,o,n.name,n.value)||i;return i}static _parseTemplateNodeAttribute(t,e,o,i,s){return"on-"===i.slice(0,3)?(t.removeAttribute(i),o.events=o.events||[],o.events.push({name:i.slice(3),value:s}),!0):"id"===i&&(o.id=s,!0)}static _contentForTemplate(t){let e=t._templateInfo;return e&&e.content||t.content}_stampTemplate(t,e){t&&!t.content&&window.HTMLTemplateElement&&HTMLTemplateElement.decorate&&HTMLTemplateElement.decorate(t);let o=(e=e||this.constructor._parseTemplate(t)).nodeInfoList,i=e.content||t.content,s=document.importNode(i,!0);s.__noInsertionPoint=!e.hasInsertionPoint;let n=s.nodeList=new Array(o.length);s.$={};for(let t,i=0,r=o.length;i<r&&(t=o[i]);i++){let o=n[i]=qe(s,t);We(0,s.$,o,t),Ge(0,o,t,e),Ke(this,o,t)}return s}_addMethodEventListenerToNode(t,e,o,i){let s=function(t,e,o){return t=t._methodHost||t,function(e){t[o]?t[o](e,e.detail):console.warn("listener method `"+o+"` not defined")}}(i=i||t,0,o);return this._addEventListenerToNode(t,e,s),s}_addEventListenerToNode(t,e,o){t.addEventListener(e,o)}_removeEventListenerFromNode(t,e,o){t.removeEventListener(e,o)}}));
/**
 * @fileoverview
 * @suppress {checkPrototypalTypes}
 * @license Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */let Xe=0;const Ze=[],Qe={COMPUTE:"__computeEffects",REFLECT:"__reflectEffects",NOTIFY:"__notifyEffects",PROPAGATE:"__propagateEffects",OBSERVE:"__observeEffects",READ_ONLY:"__readOnly"},to="__computeInfo",eo=/[A-Z]/;function oo(t,e,o){let i=t[e];if(i){if(!t.hasOwnProperty(e)&&(i=t[e]=Object.create(t[e]),o))for(let t in i){let e=i[t],o=i[t]=Array(e.length);for(let t=0;t<e.length;t++)o[t]=e[t]}}else i=t[e]={};return i}function io(t,e,o,i,s,n){if(e){let r=!1;const a=Xe++;for(let l in o){let d=e[s?_e(l):l];if(d)for(let e,c=0,h=d.length;c<h&&(e=d[c]);c++)e.info&&e.info.lastRun===a||s&&!no(l,e.trigger)||(e.info&&(e.info.lastRun=a),e.fn(t,l,o,i,e.info,s,n),r=!0)}return r}return!1}function so(t,e,o,i,s,n,r,a){let l=!1,d=e[r?_e(i):i];if(d)for(let e,c=0,h=d.length;c<h&&(e=d[c]);c++)e.info&&e.info.lastRun===o||r&&!no(i,e.trigger)||(e.info&&(e.info.lastRun=o),e.fn(t,i,s,n,e.info,r,a),l=!0);return l}function no(t,e){if(e){let o=e.name;return o==t||!(!e.structured||!function(t,e){return 0===t.indexOf(e+".")}(o,t))||!(!e.wildcard||!fe(o,t))}return!0}function ro(t,e,o,i,s){let n="string"==typeof s.method?t[s.method]:s.method,r=s.property;n?n.call(t,t.__data[r],i[r]):s.dynamicFn||console.warn("observer method `"+s.method+"` not defined")}function ao(t,e,o){let i=_e(e);if(i!==e){return lo(t,Pe(i)+"-changed",o[e],e),!0}return!1}function lo(t,e,o,i){let s={value:o,queueProperty:!0};i&&(s.path=i),pe(t).dispatchEvent(new CustomEvent(e,{detail:s}))}function co(t,e,o,i,s,n){let r=(n?_e(e):e)!=e?e:null,a=r?be(t,r):t.__data[e];r&&void 0===a&&(a=o[e]),lo(t,s.eventName,a,r)}function ho(t,e,o,i,s){let n=t.__data[e];Ht&&(n=Ht(n,s.attrName,"attribute",t)),t._propertyToAttribute(e,s.attrName,n)}function uo(t,e,o,i){let s=t[Qe.COMPUTE];if(s)if(Wt){Xe++;const n=function(t){let e=t.constructor.__orderedComputedDeps;if(!e){e=new Map;const o=t[Qe.COMPUTE];let i,{counts:s,ready:n,total:r}=function(t){const e=t[to],o={},i=t[Qe.COMPUTE],s=[];let n=0;for(let t in e){const i=e[t];n+=o[t]=i.args.filter((t=>!t.literal)).length+(i.dynamicFn?1:0)}for(let t in i)e[t]||s.push(t);return{counts:o,ready:s,total:n}}(t);for(;i=n.shift();){e.set(i,e.size);const t=o[i];t&&t.forEach((t=>{const e=t.info.methodInfo;--r,0==--s[e]&&n.push(e)}))}if(0!==r){const e=t;console.warn(`Computed graph for ${e.localName} incomplete; circular?`)}t.constructor.__orderedComputedDeps=e}return e}(t),r=[];for(let t in e)mo(t,s,r,n,i);let a;for(;a=r.shift();)_o(t,"",e,o,a)&&mo(a.methodInfo,s,r,n,i);Object.assign(o,t.__dataOld),Object.assign(e,t.__dataPending),t.__dataPending=null}else{let n=e;for(;io(t,s,n,o,i);)Object.assign(o,t.__dataOld),Object.assign(e,t.__dataPending),n=t.__dataPending,t.__dataPending=null}}const po=(t,e,o)=>{let i=0,s=e.length-1,n=-1;for(;i<=s;){const r=i+s>>1,a=o.get(e[r].methodInfo)-o.get(t.methodInfo);if(a<0)i=r+1;else{if(!(a>0)){n=r;break}s=r-1}}n<0&&(n=s+1),e.splice(n,0,t)},mo=(t,e,o,i,s)=>{const n=e[s?_e(t):t];if(n)for(let e=0;e<n.length;e++){const r=n[e];r.info.lastRun===Xe||s&&!no(t,r.trigger)||(r.info.lastRun=Xe,po(r.info,o,i))}};function _o(t,e,o,i,s){let n=Ao(t,e,o,i,s);if(n===Ze)return!1;let r=s.methodInfo;return t.__dataHasAccessor&&t.__dataHasAccessor[r]?t._setPendingProperty(r,n,!0):(t[r]=n,!1)}function fo(t,e,o,i,s,n,r){o.bindings=o.bindings||[];let a={kind:i,target:s,parts:n,literal:r,isCompound:1!==n.length};if(o.bindings.push(a),function(t){return Boolean(t.target)&&"attribute"!=t.kind&&"text"!=t.kind&&!t.isCompound&&"{"===t.parts[0].mode}(a)){let{event:t,negate:e}=a.parts[0];a.listenerEvent=t||Pe(s)+"-changed",a.listenerNegate=e}let l=e.nodeInfoList.length;for(let o=0;o<a.parts.length;o++){let i=a.parts[o];i.compoundIndex=o,vo(t,e,a,i,l)}}function vo(t,e,o,i,s){if(!i.literal)if("attribute"===o.kind&&"-"===o.target[0])console.warn("Cannot set attribute "+o.target+' because "-" is not a valid attribute starting character');else{let n=i.dependencies,r={index:s,binding:o,part:i,evaluator:t};for(let o=0;o<n.length;o++){let i=n[o];"string"==typeof i&&(i=To(i),i.wildcard=!0),t._addTemplatePropertyEffect(e,i.rootProperty,{fn:yo,info:r,trigger:i})}}}function yo(t,e,o,i,s,n,r){let a=r[s.index],l=s.binding,d=s.part;if(n&&d.source&&e.length>d.source.length&&"property"==l.kind&&!l.isCompound&&a.__isPropertyEffectsClient&&a.__dataHasAccessor&&a.__dataHasAccessor[l.target]){let i=o[e];e=ve(d.source,l.target,e),a._setPendingPropertyOrPath(e,i,!1,!0)&&t._enqueueClient(a)}else{let r=s.evaluator._evaluateBinding(t,d,e,o,i,n);r!==Ze&&function(t,e,o,i,s){s=function(t,e,o,i){if(o.isCompound){let s=t.__dataCompoundStorage[o.target];s[i.compoundIndex]=e,e=s.join("")}"attribute"!==o.kind&&("textContent"!==o.target&&("value"!==o.target||"input"!==t.localName&&"textarea"!==t.localName)||(e=null==e?"":e));return e}(e,s,o,i),Ht&&(s=Ht(s,o.target,o.kind,e));if("attribute"==o.kind)t._valueToNodeAttribute(e,s,o.target);else{let i=o.target;e.__isPropertyEffectsClient&&e.__dataHasAccessor&&e.__dataHasAccessor[i]?e[Qe.READ_ONLY]&&e[Qe.READ_ONLY][i]||e._setPendingProperty(i,s)&&t._enqueueClient(e):t._setUnmanagedPropertyToNode(e,i,s)}}(t,a,l,d,r)}}function go(t,e){if(e.isCompound){let o=t.__dataCompoundStorage||(t.__dataCompoundStorage={}),i=e.parts,s=new Array(i.length);for(let t=0;t<i.length;t++)s[t]=i[t].literal;let n=e.target;o[n]=s,e.literal&&"property"==e.kind&&("className"===n&&(t=pe(t)),t[n]=e.literal)}}function bo(t,e,o){if(o.listenerEvent){let i=o.parts[0];t.addEventListener(o.listenerEvent,(function(t){!function(t,e,o,i,s){let n,r=t.detail,a=r&&r.path;a?(i=ve(o,i,a),n=r&&r.value):n=t.currentTarget[o],n=s?!n:n,e[Qe.READ_ONLY]&&e[Qe.READ_ONLY][i]||!e._setPendingPropertyOrPath(i,n,!0,Boolean(a))||r&&r.queueProperty||e._invalidateProperties()}(t,e,o.target,i.source,i.negate)}))}}function wo(t,e,o,i,s,n){n=e.static||n&&("object"!=typeof n||n[e.methodName]);let r={methodName:e.methodName,args:e.args,methodInfo:s,dynamicFn:n};for(let s,n=0;n<e.args.length&&(s=e.args[n]);n++)s.literal||t._addPropertyEffect(s.rootProperty,o,{fn:i,info:r,trigger:s});return n&&t._addPropertyEffect(e.methodName,o,{fn:i,info:r}),r}function Ao(t,e,o,i,s){let n=t._methodHost||t,r=n[s.methodName];if(r){let i=t._marshalArgs(s.args,e,o);return i===Ze?Ze:r.apply(n,i)}s.dynamicFn||console.warn("method `"+s.methodName+"` not defined")}const xo=[],Co="(?:[a-zA-Z_$][\\w.:$\\-*]*)",Eo="(?:("+Co+"|(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)|(?:(?:'(?:[^'\\\\]|\\\\.)*')|(?:\"(?:[^\"\\\\]|\\\\.)*\")))\\s*)",Po=new RegExp("(\\[\\[|{{)\\s*(?:(!)\\s*)?"+("("+Co+"\\s*"+("(?:\\(\\s*(?:"+("(?:"+Eo+"(?:,\\s*"+Eo+")*)")+"?)\\)\\s*)")+"?)")+"(?:]]|}})","g");function Oo(t){let e="";for(let o=0;o<t.length;o++){e+=t[o].literal||""}return e}function So(t){let e=t.match(/([^\s]+?)\(([\s\S]*)\)/);if(e){let t={methodName:e[1],static:!0,args:xo};if(e[2].trim()){return function(t,e){return e.args=t.map((function(t){let o=To(t);return o.literal||(e.static=!1),o}),this),e}(e[2].replace(/\\,/g,"&comma;").split(","),t)}return t}return null}function To(t){let e=t.trim().replace(/&comma;/g,",").replace(/\\(.)/g,"$1"),o={name:e,value:"",literal:!1},i=e[0];switch("-"===i&&(i=e[1]),i>="0"&&i<="9"&&(i="#"),i){case"'":case'"':o.value=e.slice(1,-1),o.literal=!0;break;case"#":o.value=Number(e),o.literal=!0}return o.literal||(o.rootProperty=_e(e),o.structured=me(e),o.structured&&(o.wildcard=".*"==e.slice(-2),o.wildcard&&(o.name=e.slice(0,-2)))),o}function ko(t,e,o){let i=be(t,o);return void 0===i&&(i=e[o]),i}function No(t,e,o,i){const s={indexSplices:i};qt&&!t._overrideLegacyUndefined&&(e.splices=s),t.notifyPath(o+".splices",s),t.notifyPath(o+".length",e.length),qt&&!t._overrideLegacyUndefined&&(s.indexSplices=[])}function Mo(t,e,o,i,s,n){No(t,e,o,[{index:i,addedCount:s,removed:n,object:e,type:"splice"}])}const Lo=Zt((t=>{const e=Je(Be(t));return class extends e{constructor(){super(),this.__isPropertyEffectsClient=!0,this.__dataClientsReady,this.__dataPendingClients,this.__dataToNotify,this.__dataLinkedPaths,this.__dataHasPaths,this.__dataCompoundStorage,this.__dataHost,this.__dataTemp,this.__dataClientsInitialized,this.__data,this.__dataPending,this.__dataOld,this.__computeEffects,this.__computeInfo,this.__reflectEffects,this.__notifyEffects,this.__propagateEffects,this.__observeEffects,this.__readOnly,this.__templateInfo,this._overrideLegacyUndefined}get PROPERTY_EFFECT_TYPES(){return Qe}_initializeProperties(){super._initializeProperties(),this._registerHost(),this.__dataClientsReady=!1,this.__dataPendingClients=null,this.__dataToNotify=null,this.__dataLinkedPaths=null,this.__dataHasPaths=!1,this.__dataCompoundStorage=this.__dataCompoundStorage||null,this.__dataHost=this.__dataHost||null,this.__dataTemp={},this.__dataClientsInitialized=!1}_registerHost(){if(Io.length){let t=Io[Io.length-1];t._enqueueClient(this),this.__dataHost=t}}_initializeProtoProperties(t){this.__data=Object.create(t),this.__dataPending=Object.create(t),this.__dataOld={}}_initializeInstanceProperties(t){let e=this[Qe.READ_ONLY];for(let o in t)e&&e[o]||(this.__dataPending=this.__dataPending||{},this.__dataOld=this.__dataOld||{},this.__data[o]=this.__dataPending[o]=t[o])}_addPropertyEffect(t,e,o){this._createPropertyAccessor(t,e==Qe.READ_ONLY);let i=oo(this,e,!0)[t];i||(i=this[e][t]=[]),i.push(o)}_removePropertyEffect(t,e,o){let i=oo(this,e,!0)[t],s=i.indexOf(o);s>=0&&i.splice(s,1)}_hasPropertyEffect(t,e){let o=this[e];return Boolean(o&&o[t])}_hasReadOnlyEffect(t){return this._hasPropertyEffect(t,Qe.READ_ONLY)}_hasNotifyEffect(t){return this._hasPropertyEffect(t,Qe.NOTIFY)}_hasReflectEffect(t){return this._hasPropertyEffect(t,Qe.REFLECT)}_hasComputedEffect(t){return this._hasPropertyEffect(t,Qe.COMPUTE)}_setPendingPropertyOrPath(t,e,o,i){if(i||_e(Array.isArray(t)?t[0]:t)!==t){if(!i){let o=be(this,t);if(!(t=we(this,t,e))||!super._shouldPropertyChange(t,e,o))return!1}if(this.__dataHasPaths=!0,this._setPendingProperty(t,e,o))return function(t,e,o){let i=t.__dataLinkedPaths;if(i){let s;for(let n in i){let r=i[n];fe(n,e)?(s=ve(n,r,e),t._setPendingPropertyOrPath(s,o,!0,!0)):fe(r,e)&&(s=ve(r,n,e),t._setPendingPropertyOrPath(s,o,!0,!0))}}}(this,t,e),!0}else{if(this.__dataHasAccessor&&this.__dataHasAccessor[t])return this._setPendingProperty(t,e,o);this[t]=e}return!1}_setUnmanagedPropertyToNode(t,e,o){o===t[e]&&"object"!=typeof o||("className"===e&&(t=pe(t)),t[e]=o)}_setPendingProperty(t,e,o){let i=this.__dataHasPaths&&me(t),s=i?this.__dataTemp:this.__data;return!!this._shouldPropertyChange(t,e,s[t])&&(this.__dataPending||(this.__dataPending={},this.__dataOld={}),t in this.__dataOld||(this.__dataOld[t]=this.__data[t]),i?this.__dataTemp[t]=e:this.__data[t]=e,this.__dataPending[t]=e,(i||this[Qe.NOTIFY]&&this[Qe.NOTIFY][t])&&(this.__dataToNotify=this.__dataToNotify||{},this.__dataToNotify[t]=o),!0)}_setProperty(t,e){this._setPendingProperty(t,e,!0)&&this._invalidateProperties()}_invalidateProperties(){this.__dataReady&&this._flushProperties()}_enqueueClient(t){this.__dataPendingClients=this.__dataPendingClients||[],t!==this&&this.__dataPendingClients.push(t)}_flushClients(){this.__dataClientsReady?this.__enableOrFlushClients():(this.__dataClientsReady=!0,this._readyClients(),this.__dataReady=!0)}__enableOrFlushClients(){let t=this.__dataPendingClients;if(t){this.__dataPendingClients=null;for(let e=0;e<t.length;e++){let o=t[e];o.__dataEnabled?o.__dataPending&&o._flushProperties():o._enableProperties()}}}_readyClients(){this.__enableOrFlushClients()}setProperties(t,e){for(let o in t)!e&&this[Qe.READ_ONLY]&&this[Qe.READ_ONLY][o]||this._setPendingPropertyOrPath(o,t[o],!0);this._invalidateProperties()}ready(){this._flushProperties(),this.__dataClientsReady||this._flushClients(),this.__dataPending&&this._flushProperties()}_propertiesChanged(t,e,o){let i,s=this.__dataHasPaths;this.__dataHasPaths=!1,uo(this,e,o,s),i=this.__dataToNotify,this.__dataToNotify=null,this._propagatePropertyChanges(e,o,s),this._flushClients(),io(this,this[Qe.REFLECT],e,o,s),io(this,this[Qe.OBSERVE],e,o,s),i&&function(t,e,o,i,s){let n,r,a=t[Qe.NOTIFY],l=Xe++;for(let r in e)e[r]&&(a&&so(t,a,l,r,o,i,s)||s&&ao(t,r,o))&&(n=!0);n&&(r=t.__dataHost)&&r._invalidateProperties&&r._invalidateProperties()}(this,i,e,o,s),1==this.__dataCounter&&(this.__dataTemp={})}_propagatePropertyChanges(t,e,o){this[Qe.PROPAGATE]&&io(this,this[Qe.PROPAGATE],t,e,o),this.__templateInfo&&this._runEffectsForTemplate(this.__templateInfo,t,e,o)}_runEffectsForTemplate(t,e,o,i){const s=(e,i)=>{io(this,t.propertyEffects,e,o,i,t.nodeList);for(let s=t.firstChild;s;s=s.nextSibling)this._runEffectsForTemplate(s,e,o,i)};t.runEffects?t.runEffects(s,e,i):s(e,i)}linkPaths(t,e){t=ye(t),e=ye(e),this.__dataLinkedPaths=this.__dataLinkedPaths||{},this.__dataLinkedPaths[t]=e}unlinkPaths(t){t=ye(t),this.__dataLinkedPaths&&delete this.__dataLinkedPaths[t]}notifySplices(t,e){let o={path:""};No(this,be(this,t,o),o.path,e)}get(t,e){return be(e||this,t)}set(t,e,o){o?we(o,t,e):this[Qe.READ_ONLY]&&this[Qe.READ_ONLY][t]||this._setPendingPropertyOrPath(t,e,!0)&&this._invalidateProperties()}push(t,...e){let o={path:""},i=be(this,t,o),s=i.length,n=i.push(...e);return e.length&&Mo(this,i,o.path,s,e.length,[]),n}pop(t){let e={path:""},o=be(this,t,e),i=Boolean(o.length),s=o.pop();return i&&Mo(this,o,e.path,o.length,0,[s]),s}splice(t,e,o,...i){let s,n={path:""},r=be(this,t,n);return e<0?e=r.length-Math.floor(-e):e&&(e=Math.floor(e)),s=2===arguments.length?r.splice(e):r.splice(e,o,...i),(i.length||s.length)&&Mo(this,r,n.path,e,i.length,s),s}shift(t){let e={path:""},o=be(this,t,e),i=Boolean(o.length),s=o.shift();return i&&Mo(this,o,e.path,0,0,[s]),s}unshift(t,...e){let o={path:""},i=be(this,t,o),s=i.unshift(...e);return e.length&&Mo(this,i,o.path,0,e.length,[]),s}notifyPath(t,e){let o;if(1==arguments.length){let i={path:""};e=be(this,t,i),o=i.path}else o=Array.isArray(t)?ye(t):t;this._setPendingPropertyOrPath(o,e,!0,!0)&&this._invalidateProperties()}_createReadOnlyProperty(t,e){var o;this._addPropertyEffect(t,Qe.READ_ONLY),e&&(this["_set"+(o=t,o[0].toUpperCase()+o.substring(1))]=function(e){this._setProperty(t,e)})}_createPropertyObserver(t,e,o){let i={property:t,method:e,dynamicFn:Boolean(o)};this._addPropertyEffect(t,Qe.OBSERVE,{fn:ro,info:i,trigger:{name:t}}),o&&this._addPropertyEffect(e,Qe.OBSERVE,{fn:ro,info:i,trigger:{name:e}})}_createMethodObserver(t,e){let o=So(t);if(!o)throw new Error("Malformed observer expression '"+t+"'");wo(this,o,Qe.OBSERVE,Ao,null,e)}_createNotifyingProperty(t){this._addPropertyEffect(t,Qe.NOTIFY,{fn:co,info:{eventName:Pe(t)+"-changed",property:t}})}_createReflectedProperty(t){let e=this.constructor.attributeNameForProperty(t);"-"===e[0]?console.warn("Property "+t+" cannot be reflected to attribute "+e+' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.'):this._addPropertyEffect(t,Qe.REFLECT,{fn:ho,info:{attrName:e}})}_createComputedProperty(t,e,o){let i=So(e);if(!i)throw new Error("Malformed computed expression '"+e+"'");const s=wo(this,i,Qe.COMPUTE,_o,t,o);oo(this,to)[t]=s}_marshalArgs(t,e,o){const i=this.__data,s=[];for(let n=0,r=t.length;n<r;n++){let{name:r,structured:a,wildcard:l,value:d,literal:c}=t[n];if(!c)if(l){const t=fe(r,e),s=ko(i,o,t?e:r);d={path:t?e:r,value:s,base:t?be(i,r):s}}else d=a?ko(i,o,r):i[r];if(qt&&!this._overrideLegacyUndefined&&void 0===d&&t.length>1)return Ze;s[n]=d}return s}static addPropertyEffect(t,e,o){this.prototype._addPropertyEffect(t,e,o)}static createPropertyObserver(t,e,o){this.prototype._createPropertyObserver(t,e,o)}static createMethodObserver(t,e){this.prototype._createMethodObserver(t,e)}static createNotifyingProperty(t){this.prototype._createNotifyingProperty(t)}static createReadOnlyProperty(t,e){this.prototype._createReadOnlyProperty(t,e)}static createReflectedProperty(t){this.prototype._createReflectedProperty(t)}static createComputedProperty(t,e,o){this.prototype._createComputedProperty(t,e,o)}static bindTemplate(t){return this.prototype._bindTemplate(t)}_bindTemplate(t,e){let o=this.constructor._parseTemplate(t),i=this.__preBoundTemplateInfo==o;if(!i)for(let t in o.propertyEffects)this._createPropertyAccessor(t);if(e)if(o=Object.create(o),o.wasPreBound=i,this.__templateInfo){const e=t._parentTemplateInfo||this.__templateInfo,i=e.lastChild;o.parent=e,e.lastChild=o,o.previousSibling=i,i?i.nextSibling=o:e.firstChild=o}else this.__templateInfo=o;else this.__preBoundTemplateInfo=o;return o}static _addTemplatePropertyEffect(t,e,o){(t.hostProps=t.hostProps||{})[e]=!0;let i=t.propertyEffects=t.propertyEffects||{};(i[e]=i[e]||[]).push(o)}_stampTemplate(t,e){e=e||this._bindTemplate(t,!0),Io.push(this);let o=super._stampTemplate(t,e);if(Io.pop(),e.nodeList=o.nodeList,!e.wasPreBound){let t=e.childNodes=[];for(let e=o.firstChild;e;e=e.nextSibling)t.push(e)}return o.templateInfo=e,function(t,e){let{nodeList:o,nodeInfoList:i}=e;if(i.length)for(let e=0;e<i.length;e++){let s=i[e],n=o[e],r=s.bindings;if(r)for(let e=0;e<r.length;e++){let o=r[e];go(n,o),bo(n,t,o)}n.__dataHost=t}}(this,e),this.__dataClientsReady&&(this._runEffectsForTemplate(e,this.__data,null,!1),this._flushClients()),o}_removeBoundDom(t){const e=t.templateInfo,{previousSibling:o,nextSibling:i,parent:s}=e;o?o.nextSibling=i:s&&(s.firstChild=i),i?i.previousSibling=o:s&&(s.lastChild=o),e.nextSibling=e.previousSibling=null;let n=e.childNodes;for(let t=0;t<n.length;t++){let e=n[t];pe(pe(e).parentNode).removeChild(e)}}static _parseTemplateNode(t,o,i){let s=e._parseTemplateNode.call(this,t,o,i);if(t.nodeType===Node.TEXT_NODE){let e=this._parseBindings(t.textContent,o);e&&(t.textContent=Oo(e)||" ",fo(this,o,i,"text","textContent",e),s=!0)}return s}static _parseTemplateNodeAttribute(t,o,i,s,n){let r=this._parseBindings(n,o);if(r){let e=s,n="property";eo.test(s)?n="attribute":"$"==s[s.length-1]&&(s=s.slice(0,-1),n="attribute");let a=Oo(r);return a&&"attribute"==n&&("class"==s&&t.hasAttribute("class")&&(a+=" "+t.getAttribute(s)),t.setAttribute(s,a)),"attribute"==n&&"disable-upgrade$"==e&&t.setAttribute(s,""),"input"===t.localName&&"value"===e&&t.setAttribute(e,""),t.removeAttribute(e),"property"===n&&(s=Ee(s)),fo(this,o,i,n,s,r,a),!0}return e._parseTemplateNodeAttribute.call(this,t,o,i,s,n)}static _parseTemplateNestedTemplate(t,o,i){let s=e._parseTemplateNestedTemplate.call(this,t,o,i);const n=t.parentNode,r=i.templateInfo,a="dom-if"===n.localName,l="dom-repeat"===n.localName;Kt&&(a||l)&&(n.removeChild(t),(i=i.parentInfo).templateInfo=r,i.noted=!0,s=!1);let d=r.hostProps;if(Gt&&a)d&&(o.hostProps=Object.assign(o.hostProps||{},d),Kt||(i.parentInfo.noted=!0));else{let t="{";for(let e in d){fo(this,o,i,"property","_host_"+e,[{mode:t,source:e,dependencies:[e],hostProp:!0}])}}return s}static _parseBindings(t,e){let o,i=[],s=0;for(;null!==(o=Po.exec(t));){o.index>s&&i.push({literal:t.slice(s,o.index)});let n=o[1][0],r=Boolean(o[2]),a=o[3].trim(),l=!1,d="",c=-1;"{"==n&&(c=a.indexOf("::"))>0&&(d=a.substring(c+2),a=a.substring(0,c),l=!0);let h=So(a),u=[];if(h){let{args:t,methodName:o}=h;for(let e=0;e<t.length;e++){let o=t[e];o.literal||u.push(o)}let i=e.dynamicFns;(i&&i[o]||h.static)&&(u.push(o),h.dynamicFn=!0)}else u.push(a);i.push({source:a,mode:n,negate:r,customEvent:l,signature:h,dependencies:u,event:d}),s=Po.lastIndex}if(s&&s<t.length){let e=t.substring(s);e&&i.push({literal:e})}return i.length?i:null}static _evaluateBinding(t,e,o,i,s,n){let r;return r=e.signature?Ao(t,o,i,0,e.signature):o!=e.source?be(t,e.source):n&&me(o)?be(t,o):t.__data[o],e.negate&&(r=!r),r}}})),Io=[];const zo=Zt((t=>{const e=ze(t);function o(t){const e=Object.getPrototypeOf(t);return e.prototype instanceof s?e:null}function i(t){if(!t.hasOwnProperty(JSCompiler_renameProperty("__ownProperties",t))){let e=null;if(t.hasOwnProperty(JSCompiler_renameProperty("properties",t))){const o=t.properties;o&&(e=
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function(t){const e={};for(let o in t){const i=t[o];e[o]="function"==typeof i?{type:i}:i}return e}(o))}t.__ownProperties=e}return t.__ownProperties}class s extends e{static get observedAttributes(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__observedAttributes",this))){this.prototype;const t=this._properties;this.__observedAttributes=t?Object.keys(t).map((t=>this.prototype._addPropertyToAttributeMap(t))):[]}return this.__observedAttributes}static finalize(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__finalized",this))){const t=o(this);t&&t.finalize(),this.__finalized=!0,this._finalizeClass()}}static _finalizeClass(){const t=i(this);t&&this.createProperties(t)}static get _properties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__properties",this))){const t=o(this);this.__properties=Object.assign({},t&&t._properties,i(this))}return this.__properties}static typeForProperty(t){const e=this._properties[t];return e&&e.type}_initializeProperties(){this.constructor.finalize(),super._initializeProperties()}connectedCallback(){super.connectedCallback&&super.connectedCallback(),this._enableProperties()}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback()}}return s})),$o=window.ShadyCSS&&window.ShadyCSS.cssBuild,Ro=Zt((t=>{const e=zo(Lo(t));function o(t,e,o,i){o.computed&&(o.readOnly=!0),o.computed&&(t._hasReadOnlyEffect(e)?console.warn(`Cannot redefine computed property '${e}'.`):t._createComputedProperty(e,o.computed,i)),o.readOnly&&!t._hasReadOnlyEffect(e)?t._createReadOnlyProperty(e,!o.computed):!1===o.readOnly&&t._hasReadOnlyEffect(e)&&console.warn(`Cannot make readOnly property '${e}' non-readOnly.`),o.reflectToAttribute&&!t._hasReflectEffect(e)?t._createReflectedProperty(e):!1===o.reflectToAttribute&&t._hasReflectEffect(e)&&console.warn(`Cannot make reflected property '${e}' non-reflected.`),o.notify&&!t._hasNotifyEffect(e)?t._createNotifyingProperty(e):!1===o.notify&&t._hasNotifyEffect(e)&&console.warn(`Cannot make notify property '${e}' non-notify.`),o.observer&&t._createPropertyObserver(e,o.observer,i[o.observer]),t._addPropertyToAttributeMap(e)}function i(t,e,o,i){if(!$o){const s=e.content.querySelectorAll("style"),n=he(e),r=function(t){let e=ae(t);return e?ue(e):[]}(o),a=e.content.firstElementChild;for(let o=0;o<r.length;o++){let s=r[o];s.textContent=t._processStyleText(s.textContent,i),e.content.insertBefore(s,a)}let l=0;for(let e=0;e<n.length;e++){let o=n[e],r=s[l];r!==o?(o=o.cloneNode(!0),r.parentNode.insertBefore(o,r)):l++,o.textContent=t._processStyleText(o.textContent,i)}}if(window.ShadyCSS&&window.ShadyCSS.prepareTemplate(e,o),Jt&&$o&&Dt){const o=e.content.querySelectorAll("style");if(o){let e="";Array.from(o).forEach((t=>{e+=t.textContent,t.parentNode.removeChild(t)})),t._styleSheet=new CSSStyleSheet,t._styleSheet.replaceSync(e)}}}return class extends e{static get polymerElementVersion(){return"3.5.1"}static _finalizeClass(){e._finalizeClass.call(this);const t=((o=this).hasOwnProperty(JSCompiler_renameProperty("__ownObservers",o))||(o.__ownObservers=o.hasOwnProperty(JSCompiler_renameProperty("observers",o))?o.observers:null),o.__ownObservers);var o;t&&this.createObservers(t,this._properties),this._prepareTemplate()}static _prepareTemplate(){let t=this.template;t&&("string"==typeof t?(console.error("template getter must return HTMLTemplateElement"),t=null):jt||(t=t.cloneNode(!0))),this.prototype._template=t}static createProperties(t){for(let e in t)o(this.prototype,e,t[e],t)}static createObservers(t,e){const o=this.prototype;for(let i=0;i<t.length;i++)o._createMethodObserver(t[i],e)}static get template(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_template",this))){let t=this.prototype.hasOwnProperty(JSCompiler_renameProperty("_template",this.prototype))?this.prototype._template:void 0;"function"==typeof t&&(t=t()),this._template=void 0!==t?t:this.hasOwnProperty(JSCompiler_renameProperty("is",this))&&function(t){let e=null;if(t&&(!Ut||Ft)&&(e=ie.import(t,"template"),Ut&&!e))throw new Error(`strictTemplatePolicy: expecting dom-module or null template for ${t}`);return e}(this.is)||Object.getPrototypeOf(this.prototype).constructor.template}return this._template}static set template(t){this._template=t}static get importPath(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_importPath",this))){const t=this.importMeta;if(t)this._importPath=$t(t.url);else{const t=ie.import(this.is);this._importPath=t&&t.assetpath||Object.getPrototypeOf(this.prototype).constructor.importPath}}return this._importPath}constructor(){super(),this._template,this._importPath,this.rootPath,this.importPath,this.root,this.$}_initializeProperties(){this.constructor.finalize(),this.constructor._finalizeTemplate(this.localName),super._initializeProperties(),this.rootPath=Bt,this.importPath=this.constructor.importPath;let t=function(t){if(!t.hasOwnProperty(JSCompiler_renameProperty("__propertyDefaults",t))){t.__propertyDefaults=null;let e=t._properties;for(let o in e){let i=e[o];"value"in i&&(t.__propertyDefaults=t.__propertyDefaults||{},t.__propertyDefaults[o]=i)}}return t.__propertyDefaults}(this.constructor);if(t)for(let e in t){let o=t[e];if(this._canApplyPropertyDefault(e)){let t="function"==typeof o.value?o.value.call(this):o.value;this._hasAccessor(e)?this._setPendingProperty(e,t,!0):this[e]=t}}}_canApplyPropertyDefault(t){return!this.hasOwnProperty(t)}static _processStyleText(t,e){return zt(t,e)}static _finalizeTemplate(t){const e=this.prototype._template;if(e&&!e.__polymerFinalized){e.__polymerFinalized=!0;const o=this.importPath;i(this,e,t,o?It(o):""),this.prototype._bindTemplate(e)}}connectedCallback(){window.ShadyCSS&&this._template&&window.ShadyCSS.styleElement(this),super.connectedCallback()}ready(){this._template&&(this.root=this._stampTemplate(this._template),this.$=this.root.$),super.ready()}_readyClients(){this._template&&(this.root=this._attachDom(this.root)),super._readyClients()}_attachDom(t){const e=pe(this);if(e.attachShadow)return t?(e.shadowRoot||(e.attachShadow({mode:"open",shadyUpgradeFragment:t}),e.shadowRoot.appendChild(t),this.constructor._styleSheet&&(e.shadowRoot.adoptedStyleSheets=[this.constructor._styleSheet])),Yt&&window.ShadyDOM&&window.ShadyDOM.flushInitial(e.shadowRoot),e.shadowRoot):null;throw new Error("ShadowDOM not available. PolymerElement can create dom as children instead of in ShadowDOM by setting `this.root = this;` before `ready`.")}updateStyles(t){window.ShadyCSS&&window.ShadyCSS.styleSubtree(this,t)}resolveUrl(t,e){return!e&&this.importPath&&(e=It(this.importPath)),It(t,e)}static _parseTemplateContent(t,o,i){return o.dynamicFns=o.dynamicFns||this._properties,e._parseTemplateContent.call(this,t,o,i)}static _addTemplatePropertyEffect(t,o,i){return!Vt||o in this._properties||i.info.part.signature&&i.info.part.signature.static||i.info.part.hostProp||t.nestedTemplate||console.warn(`Property '${o}' used in template but not declared in 'properties'; attribute will not be observed.`),e._addTemplatePropertyEffect.call(this,t,o,i)}}})),Do=window.trustedTypes&&trustedTypes.createPolicy("polymer-html-literal",{createHTML:t=>t});
/**
 * @fileoverview
 * @suppress {checkPrototypalTypes}
 * @license Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */class Bo{constructor(t,e){Fo(t,e);const o=e.reduce(((e,o,i)=>e+Ho(o)+t[i+1]),t[0]);this.value=o.toString()}toString(){return this.value}}function Ho(t){if(t instanceof Bo)return t.value;throw new Error(`non-literal value passed to Polymer's htmlLiteral function: ${t}`)}const Uo=function(t,...e){Fo(t,e);const o=document.createElement("template");let i=e.reduce(((e,o,i)=>e+function(t){if(t instanceof HTMLTemplateElement)return t.innerHTML;if(t instanceof Bo)return Ho(t);throw new Error(`non-template value passed to Polymer's html function: ${t}`)}(o)+t[i+1]),t[0]);return Do&&(i=Do.createHTML(i)),o.innerHTML=i,o},Fo=(t,e)=>{if(!Array.isArray(t)||!Array.isArray(t.raw)||e.length!==t.length-1)throw new TypeError("Invalid call to the html template tag")},jo=Ro(HTMLElement),Vo=Zt((t=>class extends t{constructor(){super(),this.__controllers=new Set}connectedCallback(){super.connectedCallback(),this.__controllers.forEach((t=>{t.hostConnected&&t.hostConnected()}))}disconnectedCallback(){super.disconnectedCallback(),this.__controllers.forEach((t=>{t.hostDisconnected&&t.hostDisconnected()}))}addController(t){this.__controllers.add(t),void 0!==this.$&&this.isConnected&&t.hostConnected&&t.hostConnected()}removeController(t){this.__controllers.delete(t)}})),Yo=/\/\*\*\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i,qo=window.Vaadin&&window.Vaadin.Flow&&window.Vaadin.Flow.clients;function Wo(t,e){if("function"!=typeof t)return;const o=Yo.exec(t.toString());if(o)try{t=new Function(o[1])}catch(t){console.log("vaadin-development-mode-detector: uncommentAndRun() failed",t)}return t(e)}window.Vaadin=window.Vaadin||{};const Ko=function(t,e){if(window.Vaadin.developmentMode)return Wo(t,e)};function Go(){}void 0===window.Vaadin.developmentMode&&(window.Vaadin.developmentMode=function(){try{return!!localStorage.getItem("vaadin.developmentmode.force")||["localhost","127.0.0.1"].indexOf(window.location.hostname)>=0&&(qo?!(qo&&Object.keys(qo).map((t=>qo[t])).filter((t=>t.productionMode)).length>0):!Wo((function(){return!0})))}catch(t){return!1}}());
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
let Jo=0,Xo=0;const Zo=[];let Qo=0,ti=!1;const ei=document.createTextNode("");new window.MutationObserver((function(){ti=!1;const t=Zo.length;for(let e=0;e<t;e++){const t=Zo[e];if(t)try{t()}catch(t){setTimeout((()=>{throw t}))}}Zo.splice(0,t),Xo+=t})).observe(ei,{characterData:!0});const oi={after:t=>({run:e=>window.setTimeout(e,t),cancel(t){window.clearTimeout(t)}}),run:(t,e)=>window.setTimeout(t,e),cancel(t){window.clearTimeout(t)}},ii={run:t=>window.requestIdleCallback?window.requestIdleCallback(t):window.setTimeout(t,16),cancel(t){window.cancelIdleCallback?window.cancelIdleCallback(t):window.clearTimeout(t)}},si={run(t){ti||(ti=!0,ei.textContent=Qo,Qo+=1),Zo.push(t);const e=Jo;return Jo+=1,e},cancel(t){const e=t-Xo;if(e>=0){if(!Zo[e])throw new Error(`invalid async handle: ${t}`);Zo[e]=null}}},ni=new Set;class ri{static debounce(t,e,o){return t instanceof ri?t._cancelAsync():t=new ri,t.setConfig(e,o),t}constructor(){this._asyncModule=null,this._callback=null,this._timer=null}setConfig(t,e){this._asyncModule=t,this._callback=e,this._timer=this._asyncModule.run((()=>{this._timer=null,ni.delete(this),this._callback()}))}cancel(){this.isActive()&&(this._cancelAsync(),ni.delete(this))}_cancelAsync(){this.isActive()&&(this._asyncModule.cancel(this._timer),this._timer=null)}flush(){this.isActive()&&(this.cancel(),this._callback())}isActive(){return null!=this._timer}}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ai=[];function li(t,e,o=t.getAttribute("dir")){e?t.setAttribute("dir",e):null!=o&&t.removeAttribute("dir")}function di(){return document.documentElement.getAttribute("dir")}new MutationObserver((function(){const t=di();ai.forEach((e=>{li(e,t)}))})).observe(document.documentElement,{attributes:!0,attributeFilter:["dir"]});const ci=t=>class extends t{static get properties(){return{dir:{type:String,value:"",reflectToAttribute:!0,converter:{fromAttribute:t=>t||"",toAttribute:t=>""===t?null:t}}}}get __isRTL(){return"rtl"===this.getAttribute("dir")}connectedCallback(){super.connectedCallback(),this.hasAttribute("dir")&&!this.__restoreSubscription||(this.__subscribe(),li(this,di(),null))}attributeChangedCallback(t,e,o){if(super.attributeChangedCallback(t,e,o),"dir"!==t)return;const i=di(),s=o===i&&-1===ai.indexOf(this),n=!o&&e&&-1===ai.indexOf(this),r=o!==i&&e===i;s||n?(this.__subscribe(),li(this,i,o)):r&&this.__unsubscribe()}disconnectedCallback(){super.disconnectedCallback(),this.__restoreSubscription=ai.includes(this),this.__unsubscribe()}_valueToNodeAttribute(t,e,o){("dir"!==o||""!==e||t.hasAttribute("dir"))&&super._valueToNodeAttribute(t,e,o)}_attributeToProperty(t,e,o){"dir"!==t||e?super._attributeToProperty(t,e,o):this.dir=""}__subscribe(){ai.includes(this)||ai.push(this)}__unsubscribe(){ai.includes(this)&&ai.splice(ai.indexOf(this),1)}}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;let hi;window.Vaadin||(window.Vaadin={}),window.Vaadin.registrations||(window.Vaadin.registrations=[]),window.Vaadin.developmentModeCallback||(window.Vaadin.developmentModeCallback={}),window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]=function(){Ko(Go)};const ui=new Set,pi=t=>class extends(ci(t)){static get version(){return"24.0.0"}static finalize(){super.finalize();const{is:t}=this;var e;t&&!ui.has(t)&&(window.Vaadin.registrations.push(this),ui.add(t),window.Vaadin.developmentModeCallback&&(hi=ri.debounce(hi,ii,(()=>{window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]()})),e=hi,ni.add(e)))}constructor(){super(),null===document.doctype&&console.warn('Vaadin components require the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.')}}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/;function mi(t,e,o){return{index:t,removed:e,addedCount:o}}const _i=0,fi=1,vi=2,yi=3;function gi(t,e,o,i,s,n){let r,a=0,l=0,d=Math.min(o-e,n-s);if(0==e&&0==s&&(a=function(t,e,o){for(let i=0;i<o;i++)if(!bi(t[i],e[i]))return i;return o}(t,i,d)),o==t.length&&n==i.length&&(l=function(t,e,o){let i=t.length,s=e.length,n=0;for(;n<o&&bi(t[--i],e[--s]);)n++;return n}(t,i,d-a)),s+=a,n-=l,(o-=l)-(e+=a)==0&&n-s==0)return[];if(e==o){for(r=mi(e,[],0);s<n;)r.removed.push(i[s++]);return[r]}if(s==n)return[mi(e,[],o-e)];let c=function(t){let e=t.length-1,o=t[0].length-1,i=t[e][o],s=[];for(;e>0||o>0;){if(0==e){s.push(vi),o--;continue}if(0==o){s.push(yi),e--;continue}let n,r=t[e-1][o-1],a=t[e-1][o],l=t[e][o-1];n=a<l?a<r?a:r:l<r?l:r,n==r?(r==i?s.push(_i):(s.push(fi),i=r),e--,o--):n==a?(s.push(yi),e--,i=a):(s.push(vi),o--,i=l)}return s.reverse(),s}(function(t,e,o,i,s,n){let r=n-s+1,a=o-e+1,l=new Array(r);for(let t=0;t<r;t++)l[t]=new Array(a),l[t][0]=t;for(let t=0;t<a;t++)l[0][t]=t;for(let o=1;o<r;o++)for(let n=1;n<a;n++)if(bi(t[e+n-1],i[s+o-1]))l[o][n]=l[o-1][n-1];else{let t=l[o-1][n]+1,e=l[o][n-1]+1;l[o][n]=t<e?t:e}return l}(t,e,o,i,s,n));r=void 0;let h=[],u=e,p=s;for(let t=0;t<c.length;t++)switch(c[t]){case _i:r&&(h.push(r),r=void 0),u++,p++;break;case fi:r||(r=mi(u,[],0)),r.addedCount++,u++,r.removed.push(i[p]),p++;break;case vi:r||(r=mi(u,[],0)),r.addedCount++,u++;break;case yi:r||(r=mi(u,[],0)),r.removed.push(i[p]),p++}return r&&h.push(r),h}function bi(t,e){return t===e}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/function wi(t){return"slot"===t.localName}let Ai=class{static getFlattenedNodes(t){const e=pe(t);return wi(t)?e.assignedNodes({flatten:!0}):Array.from(e.childNodes).map((t=>wi(t)?pe(t).assignedNodes({flatten:!0}):[t])).reduce(((t,e)=>t.concat(e)),[])}constructor(t,e){this._shadyChildrenObserver=null,this._nativeChildrenObserver=null,this._connected=!1,this._target=t,this.callback=e,this._effectiveNodes=[],this._observer=null,this._scheduled=!1,this._boundSchedule=()=>{this._schedule()},this.connect(),this._schedule()}connect(){wi(this._target)?this._listenSlots([this._target]):pe(this._target).children&&(this._listenSlots(pe(this._target).children),window.ShadyDOM?this._shadyChildrenObserver=window.ShadyDOM.observeChildren(this._target,(t=>{this._processMutations(t)})):(this._nativeChildrenObserver=new MutationObserver((t=>{this._processMutations(t)})),this._nativeChildrenObserver.observe(this._target,{childList:!0}))),this._connected=!0}disconnect(){wi(this._target)?this._unlistenSlots([this._target]):pe(this._target).children&&(this._unlistenSlots(pe(this._target).children),window.ShadyDOM&&this._shadyChildrenObserver?(window.ShadyDOM.unobserveChildren(this._shadyChildrenObserver),this._shadyChildrenObserver=null):this._nativeChildrenObserver&&(this._nativeChildrenObserver.disconnect(),this._nativeChildrenObserver=null)),this._connected=!1}_schedule(){this._scheduled||(this._scheduled=!0,Le.run((()=>this.flush())))}_processMutations(t){this._processSlotMutations(t),this.flush()}_processSlotMutations(t){if(t)for(let e=0;e<t.length;e++){let o=t[e];o.addedNodes&&this._listenSlots(o.addedNodes),o.removedNodes&&this._unlistenSlots(o.removedNodes)}}flush(){if(!this._connected)return!1;window.ShadyDOM&&ShadyDOM.flush(),this._nativeChildrenObserver?this._processSlotMutations(this._nativeChildrenObserver.takeRecords()):this._shadyChildrenObserver&&this._processSlotMutations(this._shadyChildrenObserver.takeRecords()),this._scheduled=!1;let t={target:this._target,addedNodes:[],removedNodes:[]},e=this.constructor.getFlattenedNodes(this._target),o=(i=e,s=this._effectiveNodes,gi(i,0,i.length,s,0,s.length));var i,s;for(let e,i=0;i<o.length&&(e=o[i]);i++)for(let o,i=0;i<e.removed.length&&(o=e.removed[i]);i++)t.removedNodes.push(o);for(let i,s=0;s<o.length&&(i=o[s]);s++)for(let o=i.index;o<i.index+i.addedCount;o++)t.addedNodes.push(e[o]);this._effectiveNodes=e;let n=!1;return(t.addedNodes.length||t.removedNodes.length)&&(n=!0,this.callback.call(this._target,t)),n}_listenSlots(t){for(let e=0;e<t.length;e++){let o=t[e];wi(o)&&o.addEventListener("slotchange",this._boundSchedule)}}_unlistenSlots(t){for(let e=0;e<t.length;e++){let o=t[e];wi(o)&&o.removeEventListener("slotchange",this._boundSchedule)}}};
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
let xi=0;
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Ci extends EventTarget{static generateId(t,e){return`${e||"default"}-${t.localName}-${xi++}`}constructor(t,e,o,i={}){super();const{initializer:s,multiple:n,observe:r,useUniqueId:a}=i;this.host=t,this.slotName=e,this.tagName=o,this.observe="boolean"!=typeof r||r,this.multiple="boolean"==typeof n&&n,this.slotInitializer=s,n&&(this.nodes=[]),a&&(this.defaultId=this.constructor.generateId(t,e))}hostConnected(){this.initialized||(this.multiple?this.initMultiple():this.initSingle(),this.observe&&this.observeSlot(),this.initialized=!0)}initSingle(){let t=this.getSlotChild();t?(this.node=t,this.initAddedNode(t)):(t=this.attachDefaultNode(),this.initNode(t))}initMultiple(){const t=this.getSlotChildren();if(0===t.length){const t=this.attachDefaultNode();this.nodes=[t],this.initNode(t)}else this.nodes=t,t.forEach((t=>{this.initAddedNode(t)}))}attachDefaultNode(){const{host:t,slotName:e,tagName:o}=this;let i=this.defaultNode;return!i&&o&&(i=document.createElement(o),i instanceof Element&&(""!==e&&i.setAttribute("slot",e),this.node=i,this.defaultNode=i)),i&&t.appendChild(i),i}getSlotChildren(){const{slotName:t}=this;return Array.from(this.host.childNodes).filter((e=>e.nodeType===Node.ELEMENT_NODE&&e.slot===t||e.nodeType===Node.TEXT_NODE&&e.textContent.trim()&&""===t))}getSlotChild(){return this.getSlotChildren()[0]}initNode(t){const{slotInitializer:e}=this;e&&e(t,this.host)}initCustomNode(t){}teardownNode(t){}initAddedNode(t){t!==this.defaultNode&&(this.initCustomNode(t),this.initNode(t))}observeSlot(){const{slotName:t}=this,e=""===t?"slot:not([name])":`slot[name=${t}]`,o=this.host.shadowRoot.querySelector(e);this.__slotObserver=new Ai(o,(t=>{const e=this.multiple?this.nodes:[this.node],o=t.addedNodes.filter((t=>!function(t){return t.nodeType===Node.TEXT_NODE&&""===t.textContent.trim()}(t)&&!e.includes(t)));t.removedNodes.length&&t.removedNodes.forEach((t=>{this.teardownNode(t)})),o&&o.length>0&&(e.forEach((t=>{t&&t.isConnected&&t.parentNode.removeChild(t)})),this.multiple?(this.nodes=o,o.forEach((t=>{this.initAddedNode(t)}))):(this.node=o[0],this.initAddedNode(this.node)))}))}}
/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class Ei extends Ci{constructor(t){super(t,"tooltip"),this.setTarget(t)}initCustomNode(t){t.target=this.target,void 0!==this.context&&(t.context=this.context),void 0!==this.manual&&(t.manual=this.manual),void 0!==this.opened&&(t.opened=this.opened),void 0!==this.position&&(t._position=this.position),void 0!==this.shouldShow&&(t.shouldShow=this.shouldShow)}setContext(t){this.context=t;const e=this.node;e&&(e.context=t)}setManual(t){this.manual=t;const e=this.node;e&&(e.manual=t)}setOpened(t){this.opened=t;const e=this.node;e&&(e.opened=t)}setPosition(t){this.position=t;const e=this.node;e&&(e._position=t)}setShouldShow(t){this.shouldShow=t;const e=this.node;e&&(e.shouldShow=t)}setTarget(t){this.target=t;const e=this.node;e&&(e.target=t)}}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const Pi=h`
  :host {
    display: inline-block;
    position: relative;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* Aligns the button with form fields when placed on the same line.
  Note, to make it work, the form fields should have the same "::before" pseudo-element. */
  .vaadin-button-container::before {
    content: '\\2003';
    display: inline-block;
    width: 0;
    max-height: 100%;
  }

  .vaadin-button-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 100%;
    min-height: inherit;
    text-shadow: inherit;
  }

  [part='prefix'],
  [part='suffix'] {
    flex: none;
  }

  [part='label'] {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`,Oi=Zt((t=>class extends t{static get properties(){return{disabled:{type:Boolean,value:!1,observer:"_disabledChanged",reflectToAttribute:!0}}}_disabledChanged(t){this._setAriaDisabled(t)}_setAriaDisabled(t){t?this.setAttribute("aria-disabled","true"):this.removeAttribute("aria-disabled")}click(){this.disabled||super.click()}})),Si=!1,Ti=t=>t,ki="string"==typeof document.head.style.touchAction,Ni="__polymerGestures",Mi="__polymerGesturesHandled",Li="__polymerGesturesTouchAction",Ii=["mousedown","mousemove","mouseup","click"],zi=[0,1,4,2],$i=function(){try{return 1===new MouseEvent("test",{buttons:1}).buttons}catch(t){return!1}}();function Ri(t){return Ii.indexOf(t)>-1}let Di=!1;function Bi(t){if(!Ri(t)&&"touchend"!==t)return ki&&Di&&Si?{passive:!0}:void 0}!function(){try{const t=Object.defineProperty({},"passive",{get(){Di=!0}});window.addEventListener("test",null,t),window.removeEventListener("test",null,t)}catch(t){}}();const Hi=navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/u),Ui={button:!0,command:!0,fieldset:!0,input:!0,keygen:!0,optgroup:!0,option:!0,select:!0,textarea:!0};function Fi(t){const e=t.type;if(!Ri(e))return!1;if("mousemove"===e){let e=void 0===t.buttons?1:t.buttons;return t instanceof window.MouseEvent&&!$i&&(e=zi[t.which]||0),Boolean(1&e)}return 0===(void 0===t.button?0:t.button)}const ji={mouse:{target:null,mouseIgnoreJob:null},touch:{x:0,y:0,id:-1,scrollDecided:!1}};function Vi(t,e,o){t.movefn=e,t.upfn=o,document.addEventListener("mousemove",e),document.addEventListener("mouseup",o)}function Yi(t){document.removeEventListener("mousemove",t.movefn),document.removeEventListener("mouseup",t.upfn),t.movefn=null,t.upfn=null}const qi=window.ShadyDOM&&window.ShadyDOM.noPatch?window.ShadyDOM.composedPath:t=>t.composedPath&&t.composedPath()||[],Wi={},Ki=[];function Gi(t){const e=qi(t);return e.length>0?e[0]:t.target}function Ji(t){const e=t.type,o=t.currentTarget[Ni];if(!o)return;const i=o[e];if(!i)return;if(!t[Mi]&&(t[Mi]={},e.startsWith("touch"))){const o=t.changedTouches[0];if("touchstart"===e&&1===t.touches.length&&(ji.touch.id=o.identifier),ji.touch.id!==o.identifier)return;ki||"touchstart"!==e&&"touchmove"!==e||function(t){const e=t.changedTouches[0],o=t.type;if("touchstart"===o)ji.touch.x=e.clientX,ji.touch.y=e.clientY,ji.touch.scrollDecided=!1;else if("touchmove"===o){if(ji.touch.scrollDecided)return;ji.touch.scrollDecided=!0;const o=function(t){let e="auto";const o=qi(t);for(let t,i=0;i<o.length;i++)if(t=o[i],t[Li]){e=t[Li];break}return e}(t);let i=!1;const s=Math.abs(ji.touch.x-e.clientX),n=Math.abs(ji.touch.y-e.clientY);t.cancelable&&("none"===o?i=!0:"pan-x"===o?i=n>s:"pan-y"===o&&(i=s>n)),i?t.preventDefault():es("track")}}(t)}const s=t[Mi];if(!s.skip){for(let e,o=0;o<Ki.length;o++)e=Ki[o],i[e.name]&&!s[e.name]&&e.flow&&e.flow.start.indexOf(t.type)>-1&&e.reset&&e.reset();for(let o,n=0;n<Ki.length;n++)o=Ki[n],i[o.name]&&!s[o.name]&&(s[o.name]=!0,o[e](t))}}function Xi(t,e,o){return!!Wi[e]&&(function(t,e,o){const i=Wi[e],s=i.deps,n=i.name;let r=t[Ni];r||(t[Ni]=r={});for(let e,o,i=0;i<s.length;i++)e=s[i],Hi&&Ri(e)&&"click"!==e||(o=r[e],o||(r[e]=o={_count:0}),0===o._count&&t.addEventListener(e,Ji,Bi(e)),o[n]=(o[n]||0)+1,o._count=(o._count||0)+1);t.addEventListener(e,o),i.touchAction&&function(t,e){ki&&t instanceof HTMLElement&&si.run((()=>{t.style.touchAction=e}));t[Li]=e}(t,i.touchAction)}(t,e,o),!0)}function Zi(t,e,o){return!!Wi[e]&&(function(t,e,o){const i=Wi[e],s=i.deps,n=i.name,r=t[Ni];if(r)for(let e,o,i=0;i<s.length;i++)e=s[i],o=r[e],o&&o[n]&&(o[n]=(o[n]||1)-1,o._count=(o._count||1)-1,0===o._count&&t.removeEventListener(e,Ji,Bi(e)));t.removeEventListener(e,o)}(t,e,o),!0)}function Qi(t){Ki.push(t),t.emits.forEach((e=>{Wi[e]=t}))}function ts(t,e,o){const i=new Event(e,{bubbles:!0,cancelable:!0,composed:!0});if(i.detail=o,Ti(t).dispatchEvent(i),i.defaultPrevented){const t=o.preventer||o.sourceEvent;t&&t.preventDefault&&t.preventDefault()}}function es(t){const e=function(t){for(let e,o=0;o<Ki.length;o++){e=Ki[o];for(let o,i=0;i<e.emits.length;i++)if(o=e.emits[i],o===t)return e}return null}(t);e.info&&(e.info.prevent=!0)}function os(t,e,o,i){e&&ts(e,t,{x:o.clientX,y:o.clientY,sourceEvent:o,preventer:i,prevent:t=>es(t)})}function is(t,e,o){if(t.prevent)return!1;if(t.started)return!0;const i=Math.abs(t.x-e),s=Math.abs(t.y-o);return i>=5||s>=5}function ss(t,e,o){if(!e)return;const i=t.moves[t.moves.length-2],s=t.moves[t.moves.length-1],n=s.x-t.x,r=s.y-t.y;let a,l=0;i&&(a=s.x-i.x,l=s.y-i.y),ts(e,"track",{state:t.state,x:o.clientX,y:o.clientY,dx:n,dy:r,ddx:a,ddy:l,sourceEvent:o,hover:()=>function(t,e){let o=document.elementFromPoint(t,e),i=o;for(;i&&i.shadowRoot&&!window.ShadyDOM;){const s=i;if(i=i.shadowRoot.elementFromPoint(t,e),s===i)break;i&&(o=i)}return o}(o.clientX,o.clientY)})}function ns(t,e,o){const i=Math.abs(e.clientX-t.x),s=Math.abs(e.clientY-t.y),n=Gi(o||e);!n||Ui[n.localName]&&n.hasAttribute("disabled")||(isNaN(i)||isNaN(s)||i<=25&&s<=25||function(t){if("click"===t.type){if(0===t.detail)return!0;const e=Gi(t);if(!e.nodeType||e.nodeType!==Node.ELEMENT_NODE)return!0;const o=e.getBoundingClientRect(),i=t.pageX,s=t.pageY;return!(i>=o.left&&i<=o.right&&s>=o.top&&s<=o.bottom)}return!1}(e))&&(t.prevent||ts(n,"tap",{x:e.clientX,y:e.clientY,sourceEvent:e,preventer:o}))}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */Qi({name:"downup",deps:["mousedown","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["down","up"],info:{movefn:null,upfn:null},reset(){Yi(this.info)},mousedown(t){if(!Fi(t))return;const e=Gi(t),o=this;Vi(this.info,(t=>{Fi(t)||(os("up",e,t),Yi(o.info))}),(t=>{Fi(t)&&os("up",e,t),Yi(o.info)})),os("down",e,t)},touchstart(t){os("down",Gi(t),t.changedTouches[0],t)},touchend(t){os("up",Gi(t),t.changedTouches[0],t)}}),Qi({name:"track",touchAction:"none",deps:["mousedown","touchstart","touchmove","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["track"],info:{x:0,y:0,state:"start",started:!1,moves:[],addMove(t){this.moves.length>2&&this.moves.shift(),this.moves.push(t)},movefn:null,upfn:null,prevent:!1},reset(){this.info.state="start",this.info.started=!1,this.info.moves=[],this.info.x=0,this.info.y=0,this.info.prevent=!1,Yi(this.info)},mousedown(t){if(!Fi(t))return;const e=Gi(t),o=this,i=t=>{const i=t.clientX,s=t.clientY;is(o.info,i,s)&&(o.info.state=o.info.started?"mouseup"===t.type?"end":"track":"start","start"===o.info.state&&es("tap"),o.info.addMove({x:i,y:s}),Fi(t)||(o.info.state="end",Yi(o.info)),e&&ss(o.info,e,t),o.info.started=!0)};Vi(this.info,i,(t=>{o.info.started&&i(t),Yi(o.info)})),this.info.x=t.clientX,this.info.y=t.clientY},touchstart(t){const e=t.changedTouches[0];this.info.x=e.clientX,this.info.y=e.clientY},touchmove(t){const e=Gi(t),o=t.changedTouches[0],i=o.clientX,s=o.clientY;is(this.info,i,s)&&("start"===this.info.state&&es("tap"),this.info.addMove({x:i,y:s}),ss(this.info,e,o),this.info.state="track",this.info.started=!0)},touchend(t){const e=Gi(t),o=t.changedTouches[0];this.info.started&&(this.info.state="end",this.info.addMove({x:o.clientX,y:o.clientY}),ss(this.info,e,o))}}),Qi({name:"tap",deps:["mousedown","click","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["click","touchend"]},emits:["tap"],info:{x:NaN,y:NaN,prevent:!1},reset(){this.info.x=NaN,this.info.y=NaN,this.info.prevent=!1},mousedown(t){Fi(t)&&(this.info.x=t.clientX,this.info.y=t.clientY)},click(t){Fi(t)&&ns(this.info,t)},touchstart(t){const e=t.changedTouches[0];this.info.x=e.clientX,this.info.y=e.clientY},touchend(t){ns(this.info,t.changedTouches[0],t)}});const rs=Zt((t=>class extends t{ready(){super.ready(),this.addEventListener("keydown",(t=>{this._onKeyDown(t)})),this.addEventListener("keyup",(t=>{this._onKeyUp(t)}))}_onKeyDown(t){switch(t.key){case"Enter":this._onEnter(t);break;case"Escape":this._onEscape(t)}}_onKeyUp(t){}_onEnter(t){}_onEscape(t){}})),as=t=>class extends(Oi(rs(t))){get _activeKeys(){return[" "]}ready(){super.ready(),Xi(this,"down",(t=>{this._shouldSetActive(t)&&this._setActive(!0)})),Xi(this,"up",(()=>{this._setActive(!1)}))}disconnectedCallback(){super.disconnectedCallback(),this._setActive(!1)}_shouldSetActive(t){return!this.disabled}_onKeyDown(t){super._onKeyDown(t),this._shouldSetActive(t)&&this._activeKeys.includes(t.key)&&(this._setActive(!0),document.addEventListener("keyup",(t=>{this._activeKeys.includes(t.key)&&this._setActive(!1)}),{once:!0}))}_setActive(t){this.toggleAttribute("active",t)}}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */let ls=!1;function ds(){return ls}function cs(t){const e=t.style;if("hidden"===e.visibility||"none"===e.display)return!0;const o=window.getComputedStyle(t);return"hidden"===o.visibility||"none"===o.display}function hs(t,e){const o=Math.max(t.tabIndex,0),i=Math.max(e.tabIndex,0);return 0===o||0===i?i>o:o>i}function us(t){const e=t.length;if(e<2)return t;const o=Math.ceil(e/2);return function(t,e){const o=[];for(;t.length>0&&e.length>0;)hs(t[0],e[0])?o.push(e.shift()):o.push(t.shift());return o.concat(t,e)}(us(t.slice(0,o)),us(t.slice(o)))}function ps(t){return null===t.offsetParent||cs(t)}function ms(t){return t.getRootNode().activeElement===t}function _s(t,e){if(t.nodeType!==Node.ELEMENT_NODE||cs(t))return!1;const o=t,i=function(t){if(!function(t){return!t.matches('[tabindex="-1"]')&&(t.matches("input, select, textarea, button, object")?t.matches(":not([disabled])"):t.matches("a[href], area[href], iframe, [tabindex], [contentEditable]"))}(t))return-1;const e=t.getAttribute("tabindex")||0;return Number(e)}(o);let s=i>0;i>=0&&e.push(o);let n=[];return n="slot"===o.localName?o.assignedNodes({flatten:!0}):(o.shadowRoot||o).children,[...n].forEach((t=>{s=_s(t,e)||s})),s}window.addEventListener("keydown",(()=>{ls=!0}),{capture:!0}),window.addEventListener("mousedown",(()=>{ls=!1}),{capture:!0});
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const fs=Zt((t=>class extends t{get _keyboardActive(){return ds()}ready(){this.addEventListener("focusin",(t=>{this._shouldSetFocus(t)&&this._setFocused(!0)})),this.addEventListener("focusout",(t=>{this._shouldRemoveFocus(t)&&this._setFocused(!1)})),super.ready()}disconnectedCallback(){super.disconnectedCallback(),this.hasAttribute("focused")&&this._setFocused(!1)}_setFocused(t){this.toggleAttribute("focused",t),this.toggleAttribute("focus-ring",t&&this._keyboardActive)}_shouldSetFocus(t){return!0}_shouldRemoveFocus(t){return!0}})),vs=t=>class extends(Oi(t)){static get properties(){return{tabindex:{type:Number,reflectToAttribute:!0,observer:"_tabindexChanged"},_lastTabIndex:{type:Number}}}_disabledChanged(t,e){super._disabledChanged(t,e),t?(void 0!==this.tabindex&&(this._lastTabIndex=this.tabindex),this.tabindex=-1):e&&(this.tabindex=this._lastTabIndex)}_tabindexChanged(t){this.disabled&&-1!==t&&(this._lastTabIndex=t,this.tabindex=-1)}}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,ys=t=>class extends(as(vs(fs(t)))){static get properties(){return{tabindex:{type:Number,value:0,reflectToAttribute:!0}}}get _activeKeys(){return["Enter"," "]}ready(){super.ready(),this.hasAttribute("role")||this.setAttribute("role","button")}_onKeyDown(t){super._onKeyDown(t),this._activeKeys.includes(t.key)&&(t.preventDefault(),this.click())}}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */pt("vaadin-button",Pi,{moduleId:"vaadin-button-styles"});class gs extends(ys(pi(yt(Vo(jo))))){static get is(){return"vaadin-button"}static get template(){return(t=>t`
  <div class="vaadin-button-container">
    <span part="prefix" aria-hidden="true">
      <slot name="prefix"></slot>
    </span>
    <span part="label">
      <slot></slot>
    </span>
    <span part="suffix" aria-hidden="true">
      <slot name="suffix"></slot>
    </span>
  </div>
  <slot name="tooltip"></slot>
`
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */)(Uo)}ready(){super.ready(),this._tooltipController=new Ei(this),this.addController(this._tooltipController)}}customElements.define(gs.is,gs),
/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
pt("vaadin-menu-bar-button",h`
    :host {
      flex-shrink: 0;
    }

    :host([slot='overflow']) {
      margin-inline-end: 0;
    }

    [part='label'] ::slotted(vaadin-menu-bar-item) {
      position: relative;
      z-index: 1;
    }
  `,{moduleId:"vaadin-menu-bar-button-styles"});class bs extends gs{static get is(){return"vaadin-menu-bar-button"}}customElements.define(bs.is,bs);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ws=document.createElement("template");ws.innerHTML='\n  <style>\n    @font-face {\n      font-family: \'lumo-icons\';\n      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABEgAAsAAAAAIjQAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIslek9TLzIAAAFEAAAAQwAAAFZAIUuKY21hcAAAAYgAAAD4AAADrsCU8d5nbHlmAAACgAAAC2cAABeAWri7U2hlYWQAAA3oAAAAMAAAADZa/6SsaGhlYQAADhgAAAAdAAAAJAbpA35obXR4AAAOOAAAABAAAACspBAAAGxvY2EAAA5IAAAAWAAAAFh57oA4bWF4cAAADqAAAAAfAAAAIAFKAXBuYW1lAAAOwAAAATEAAAIuUUJZCHBvc3QAAA/0AAABKwAAAelm8SzVeJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYGS+yDiBgZWBgamKaQ8DA0MPhGZ8wGDIyAQUZWBlZsAKAtJcUxgcXjG+0mIO+p/FEMUcxDANKMwIkgMABn8MLQB4nO3SWW6DMABF0UtwCEnIPM/zhLK8LqhfXRybSP14XUYtHV9hGYQwQBNIo3cUIPkhQeM7rib1ekqnXg981XuC1qvy84lzojleh3puxL0hPjGjRU473teloEefAUNGjJkwZcacBUtWrNmwZceeA0dOnLlw5cadB09elPGhGf+j0NTI/65KfXerT6JhqKnpRKtgOpuqaTrtKjPUlqHmhto21I7pL6i6hlqY3q7qGWrfUAeGOjTUkaGODXViqFNDnRnq3FAXhro01JWhrg11Y6hbQ90Z6t5QD4Z6NNSToZ4N9WKoV0O9GerdUB+G+jTUl6GWRvkL24BkEXictVh9bFvVFb/nxvbz+7Rf/N6zHcd2bCfP+Wic1Z9N0jpNHCD9SNqqoVBgbQoMjY+pjA4hNnWa2pV1rHSIif0DGkyT2k10Kmu1Cag6huj4ZpqYBHSqJsTEJgZCG3TaVBFv595nO3ZIv4RIrPPuvefe884599zzO/cRF8G/tgn6CFFImNgkR0ggX8wlspbhSSWSdrC5ozd30s2dw5afzvgtyz9/zG9t1hV4RtF1pXolowvtzc2z6L2aYUQM45jKH9WDTvd1LRDoDASYWhfTzTyvboXz6uZX4ARX5wrF39y+HM2+CJ8d0pkyqBIqoze3D12ez4DrFoYzxI8dWwMrDlZ2DMqQAR9AROsJU+2smlTPaTTco52BVxXa2a2+I8vvqd2dVHm1LoPeTn/AZPRYGthDYOeZjBjKoFsVGulR3lGU95SeCK44oHU7MhWUGUKZDT3oSUcG2GWuh+EDDfUYA/jhIhl0TOsJNYSEu7mQmi3UzfXwZKA4BsVsHLXQYGgJW95qEtpJ1VcW9HiTriZBlFEqxsDjA09yCNUoQxxwd7KWSTt2y3GTKifkqHRCoWZc3m11Wa/dKdFgXD4kSYfkeJBKd8KMz7J8dZn/cGRCcLGDnA2Ge3bKzcvlnTDNthFWLH7Xt80ua5FMjA4WKelWv5Xo16vHuYzpRbJhhdVlftuRK0VlR27D9lu5TF0DPBi60OrHNO0AfP/uRWvhn/U3LXICE+nh+3IHPUJ8JE6GyBjZQLbjGchlrSgYngF8zyrIF4NJD3atUcgWsWunGN/UHX5B5/yg7uF87Nqp4Gf52F3gH73DjEZNRoqCKAr9giQJp5rGJABpiVE2htNhW9R8nw0jqYjCYcY4LIjwYNScf4WN06IZnZCEqsI4cFaQbo4Z1TsZBx40YhXkHOecaYE5oY37IIQ+iJJ+UsDYSun5MuRSBRZRUUhlY2DqOGajOR6zrSU/5My6l2DnusH1GQgnw5BZP7iuYM/ahcfQ7Z8y51ddfutvuwNqWQ0cBYr8fj0U0vsHpwerVaB2sWhXT2NExi2r1KUE2tUuVMnkepVQrxTmpQrZTG4iu8he8iPyM3KcPE/+RP5KPoE2CEAKclCBzXATxkYOtUY/o961PWRqsj0chRrHFBbtrjP9/P0ven5pcbRdpL94vfsy33e5+izuwz3nFLFPVNayPZx/jdG1fOChflFRvYzsW6L18efgLrSWIgvcqnGJYi4skO4xREURjbDuxKke5v0T3Mrzkt2fi31uyZlLLrqIpEuXXsMlgw442Jb0GAxjS1DM20kBoCzHLXm/jEm0IltdcvU0fEW24jgiwwRjVd9u4NJHcIyoHJcwvyVqgqj5hqBJ1ZWSJryh9p56UWhX1XbhRbW2ZopuZWsQd5y8mEQ8M+C6xjRYxZbDKWf5AgY+Qq/l6wSPk16zDFjowYuu+wjx13mfkxbyDDxadYT/LijZyI0THB+6yfLaWsRcO82zo9mWTNtpO18qlorZoIVMwSN40tky5DOQ1MCIAe24mvlsuwIIxPb10+uXDQ4uWz/9m3rj+ql7p6bufZARuPVq5tXtsn6KwfP8Jy0TeWOyNhUJN6mhX5rkUTtUppQWEMNTqEdaCGKFYKJaQrCE4JtDLYOlNEKmO5kBTPGY2A0N2sY3+dVlo1N9ycBsIGtOjQ2p/tlZvzo0ur4v6cOh8NTospB7U/X40KahoU3bGIH97dnwmtHlYffVG3R1YOwKM2vNhrPhCT5zk64sG53oS4b31aYjqe/B7+kQiXBN+b6h21hNUPMq29B8CU4elINdygMPKF1B+WBTG7Z9ZshpN/xwEuuDQZR+nuoo4CDaAiiwXmLpmukMQyPf/JMclqgL1ixZQ/nnP2VbdUODFGt2fgBvL123rlLYu/6A9ckb7F3K0/CyBMEu6aQoPscroCcacVehvyQyCZAsizsWWBkoLC+WAiWnOksLKaeuQDzGuqSk42aiYTiJ4zf9afl17SrqaTO1f+XlZAfIuYcq7/IqYMaMrksOJ6vHkOCPDq943xcCnHqVD9pHFRpMqSPXrIua1WNs+tOz1U+ciTCDpPk+c4QYJIHnYhxP/kVPAq+ahFpVhPcHp8qyarhiF+HsBU9Hrl+UZa876fbKipL0KqB6OdUveErgtOI97fZ63ae9SvWU6k2w1JfwqnUbHsYcFCJFrC/W12zIMMirWYEHxMPs6LGYSdkSZ5TsNP9PCpwnWC3HKZ1lydNjWHC2Mn3l6vL0dHn1ldP3LTSrX+vKrBqv7KmMr8p0SR6P1NqF63or6XRlIyO90f7+kf7+myOhvt4tq7f09oUiTc2/dycGgqFQcCDRLYmi1NL7fk0CknVMxEg/cdfs/TnpJMNkgqwj17B8beVazSrVbU4lG67IZYOCnWrYy3yBR9cyWcChywos3LJBEdhhFoAdYjiw0rLGm0xU5OzoGm5/ZfmHjVZpNNg6SznzGKDdwv2cCtVn6Eaxo12cfxLprpVtTcZ6hVx6dow7Yq7e8LXO8PY9Jgjoze9yCtU5FNbegcKkQMdCbt9au/te4Ebe0jkc0ukUL32eYnTpNs20h0KpUOhZPYwVcfhZnfdqeCvDfXiuCbAoYWcXERPc/mDQD3/hdF+wK4i/xv3kYfprIpAuMkk2kW3kdtS0kBIKpZwp8KxmsCyfM1MFzAss9LBkDxRyThiaqTLwKYKJVTwmWTudMyz+yks09346MDh4m72yOxCKrt1XMlQ1qPVlTEVVQ1ofdK/sCWjtZu9qGwZ8YZ9PPWlo1IV3eW3+U0aXblP39zrt+JPf6UhEQ1rUjNBULN+utyuaDNW34kpAVuSOeMTyWbSNWnooFu+QFNWQ4d/Ox4IPWx41fP/fB/Rjeoz08ezPA9TysMtmnOXfGN7Ui3xIYLDALrlDLOP09qtJuY2OeL0+QZXdRnR1nxRVBF/SOyKKPpcrn9mWzH4rH9IidE+PTNU2182+hOgSItrE1slByS24vaLvJpxOqe4Pduf3HJkZ+jLqUz9rRzB7p8gKcgWZwV1L8JtUS5Z2JxZSOCuBoMTQihMzLbCPA0KqGMAljRQjONklW/wjnXKy8vxT/Elvm3/KiMUMOoV0/vnDYlhec0SMKtt3/kKMyOt33tj2bqxQLsTjSGLl+EAsNhCnTyRGktW55EgCn/A4PlnWn+Mg8bgZrWqHxTbPwMuyy1u5YeZF2SUM7JRhddwRgiRuxpmgJmxn9ZW7XpcF3ViX/ar6ptRpGJ0S9Adg4qhb9sI3vbL7qNJV/y4i07t5TZBiho1imFoMz3gED+CtjYUxvP4SOxov4bFoNPg5aR1e+G4UgDPoedJTpogyCJ7oYvRqoVS0MQAy+CoNEdTDUjok5ZHZL/WtjV7rFj3PKQE3iKp7ou+rIxN3b9LB1dGjeT4cvKo3FrnWpYpuaFd/h3dtV8UeKN1Y9hpR3dt4p0H/zKuPQq0kZQUIIpuDfoiETsnIk+gCWMJZUXHtE8V9LkUc2TE8vOMbO4ax/MACabzyaGXc7u3FBr11ThBdB8SIeMAlCntG2KThHSPsaj2Dc9KNyY2a0KZ7ODaTHoRiFkeYz+shZBpCS4X6471KKKnuHd84edfk5F37d1XO5bbkcltu2ZLNbvnPXiUVAnVvprJrP+NObryjxrllS65md6Tm6wzFHRR4dY3QUUjb7MgxaIixU8hspi98fl/Xc+IB4iU66eCVL9YfAfahiSUt4TONS8x0D8W7u8vd3fGWx6OXlM/U1IoU/s61PGhpyXRFa3eReq2qG56lvmYtXavCC1iN7lbiBpWxXHU+cSlztVLVz0tVN600fVsLxaVDknhYioeoXP3t4lqV1r79MAw0GCI1FTL1YIGzPL1MMlJ9ZsN9P7lvA2yr9ZFUzwzPrVgxN/x/SS+chwB4nGNgZGBgAOLPrYdY4vltvjJwM78AijDUqG5oRND/XzNPZboF5HIwMIFEAU/lC+J4nGNgZGBgDvqfBSRfMAAB81QGRgZUoA0AVvYDbwAAAHicY2BgYGB+MTQwAM8EJo8AAAAAAE4AmgDoAQoBLAFOAXABmgHEAe4CGgKcAugEmgS8BNYE8gUOBSoFegXQBf4GRAZmBrYHGAeQCBgIUghqCP4JRgm+CdoKBAo+CoQKugr0C1QLmgvAeJxjYGRgYNBmTGEQZQABJiDmAkIGhv9gPgMAGJQBvAB4nG2RPU7DMBiG3/QP0UoIBGJh8QILavozdmRo9w7d09RpUzlx5LgVvQMn4BAcgoEzcAgOwVvzSZVQbcnf48fvFysJgGt8IcJxROiG9TgauODuj5ukG+EW+UG4jR4ehTv0Q+EunjER7uEWmk+IWpc0d3gVbuAKb8JN+nfhFvlDuI17fAp36L+Fu1jgR7iHp+jF7Arbz1Nb1nO93pnEncSJFtrVuS3VKB6e5EyX2iVer9TyoOr9eux9pjJnCzW1pdfGWFU5u9WpjzfeV5PBIBMfp7aAwQ4FLPrIkbKWqDHn+67pDRK4s4lzbsEux5qHvcIIMb/nueSMyTKkE3jWFdNLHLjW2PPmMa1Hxn3GjGW/wjT0HtOG09JU4WxLk9LH2ISuiv9twJn9y8fh9uIXI+BknAAAAHicbY7ZboMwEEW5CVBCSLrv+76kfJRjTwHFsdGAG+Xvy5JUfehIHp0rnxmNN/D6ir3/a4YBhvARIMQOIowQY4wEE0yxiz3s4wCHOMIxTnCKM5zjApe4wjVucIs73OMBj3jCM17wije84wMzfHqJ0EVmUkmmJo77oOmrHvfIRZbXsTCZplTZldlgb3TYGVHProwFs11t1A57tcON2rErR3PBqcwF1/6ctI6k0GSU4JHMSS6WghdJQ99sTbfuN7QLJ9vQ37dNrgyktnIxlDYLJNuqitpRbYWKFNuyDT6pog6oOYKHtKakeakqKjHXpPwlGRcsC+OqxLIiJpXqoqqDMreG2l5bv9Ri3TRX+c23DZna9WFFgmXuO6Ps1Jm/w6ErW8N3FbHn/QC444j0AA==) format(\'woff\');\n      font-weight: normal;\n      font-style: normal;\n    }\n\n    html {\n      --lumo-icons-align-center: "\\ea01";\n      --lumo-icons-align-left: "\\ea02";\n      --lumo-icons-align-right: "\\ea03";\n      --lumo-icons-angle-down: "\\ea04";\n      --lumo-icons-angle-left: "\\ea05";\n      --lumo-icons-angle-right: "\\ea06";\n      --lumo-icons-angle-up: "\\ea07";\n      --lumo-icons-arrow-down: "\\ea08";\n      --lumo-icons-arrow-left: "\\ea09";\n      --lumo-icons-arrow-right: "\\ea0a";\n      --lumo-icons-arrow-up: "\\ea0b";\n      --lumo-icons-bar-chart: "\\ea0c";\n      --lumo-icons-bell: "\\ea0d";\n      --lumo-icons-calendar: "\\ea0e";\n      --lumo-icons-checkmark: "\\ea0f";\n      --lumo-icons-chevron-down: "\\ea10";\n      --lumo-icons-chevron-left: "\\ea11";\n      --lumo-icons-chevron-right: "\\ea12";\n      --lumo-icons-chevron-up: "\\ea13";\n      --lumo-icons-clock: "\\ea14";\n      --lumo-icons-cog: "\\ea15";\n      --lumo-icons-cross: "\\ea16";\n      --lumo-icons-download: "\\ea17";\n      --lumo-icons-dropdown: "\\ea18";\n      --lumo-icons-edit: "\\ea19";\n      --lumo-icons-error: "\\ea1a";\n      --lumo-icons-eye: "\\ea1b";\n      --lumo-icons-eye-disabled: "\\ea1c";\n      --lumo-icons-menu: "\\ea1d";\n      --lumo-icons-minus: "\\ea1e";\n      --lumo-icons-ordered-list: "\\ea1f";\n      --lumo-icons-phone: "\\ea20";\n      --lumo-icons-photo: "\\ea21";\n      --lumo-icons-play: "\\ea22";\n      --lumo-icons-plus: "\\ea23";\n      --lumo-icons-redo: "\\ea24";\n      --lumo-icons-reload: "\\ea25";\n      --lumo-icons-search: "\\ea26";\n      --lumo-icons-undo: "\\ea27";\n      --lumo-icons-unordered-list: "\\ea28";\n      --lumo-icons-upload: "\\ea29";\n      --lumo-icons-user: "\\ea2a";\n    }\n  </style>\n',document.head.appendChild(ws.content);const As=h`
  :host {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    line-height: var(--lumo-line-height-xs);
    padding: 0.5em calc(var(--lumo-space-l) + var(--lumo-border-radius-m) / 4) 0.5em
      var(--_lumo-list-box-item-padding-left, calc(var(--lumo-border-radius-m) / 4));
    min-height: var(--lumo-size-m);
    outline: none;
    border-radius: var(--lumo-border-radius-m);
    cursor: var(--lumo-clickable-cursor);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: var(--lumo-primary-color-10pct);
  }

  /* Checkmark */
  [part='checkmark']::before {
    display: var(--_lumo-item-selected-icon-display, none);
    content: var(--lumo-icons-checkmark);
    font-family: lumo-icons;
    font-size: var(--lumo-icon-size-m);
    line-height: 1;
    font-weight: normal;
    width: 1em;
    height: 1em;
    margin: calc((1 - var(--lumo-line-height-xs)) * var(--lumo-font-size-m) / 2) 0;
    color: var(--lumo-primary-text-color);
    flex: none;
    opacity: 0;
    transition: transform 0.2s cubic-bezier(0.12, 0.32, 0.54, 2), opacity 0.1s;
  }

  :host([selected]) [part='checkmark']::before {
    opacity: 1;
  }

  :host([active]:not([selected])) [part='checkmark']::before {
    transform: scale(0.8);
    opacity: 0;
    transition-duration: 0s;
  }

  [part='content'] {
    flex: auto;
  }

  /* Disabled */
  :host([disabled]) {
    color: var(--lumo-disabled-text-color);
    cursor: default;
    pointer-events: none;
  }

  /* TODO a workaround until we have "focus-follows-mouse". After that, use the hover style for focus-ring as well */
  @media (any-hover: hover) {
    :host(:hover:not([disabled])) {
      background-color: var(--lumo-primary-color-10pct);
    }

    :host([focus-ring]:not([disabled])) {
      box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
    }
  }

  /* RTL specific styles */
  :host([dir='rtl']) {
    padding-left: calc(var(--lumo-space-l) + var(--lumo-border-radius-m) / 4);
    padding-right: var(--_lumo-list-box-item-padding-left, calc(var(--lumo-border-radius-m) / 4));
  }

  /* Slotted icons */
  :host ::slotted(vaadin-icon) {
    width: var(--lumo-icon-size-m);
    height: var(--lumo-icon-size-m);
  }
`;pt("vaadin-item",As,{moduleId:"lumo-item"});const xs=h`
  /* :hover needed to workaround https://github.com/vaadin/web-components/issues/3133 */
  :host(:hover) {
    user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
  }

  :host([role='menuitem'][menu-item-checked]) [part='checkmark']::before {
    opacity: 1;
  }

  :host([aria-haspopup='true'])::after {
    font-family: lumo-icons;
    font-size: var(--lumo-icon-size-xs);
    content: var(--lumo-icons-angle-right);
    color: var(--lumo-tertiary-text-color);
  }

  :host(:not([dir='rtl'])[aria-haspopup='true'])::after {
    margin-right: calc(var(--lumo-space-m) * -1);
    padding-left: var(--lumo-space-m);
  }

  :host([expanded]) {
    background-color: var(--lumo-primary-color-10pct);
  }

  /* RTL styles */
  :host([dir='rtl'][aria-haspopup='true'])::after {
    content: var(--lumo-icons-angle-left);
    margin-left: calc(var(--lumo-space-m) * -1);
    padding-right: var(--lumo-space-m);
  }
`;pt("vaadin-context-menu-item",[As,xs],{moduleId:"lumo-context-menu-item"});pt("vaadin-menu-bar-item",[As,xs,h`
  [part='content'] {
    display: flex;
    /* tweak to inherit centering from menu bar button */
    align-items: inherit;
    justify-content: inherit;
  }

  [part='content'] ::slotted(vaadin-icon) {
    display: inline-block;
    width: var(--lumo-icon-size-m);
    height: var(--lumo-icon-size-m);
  }

  [part='content'] ::slotted(vaadin-icon[icon^='vaadin:']) {
    padding: var(--lumo-space-xs);
    box-sizing: border-box !important;
  }
`],{moduleId:"lumo-menu-bar-item"});const Cs=h`
  :host {
    -webkit-tap-highlight-color: transparent;
    --_lumo-item-selected-icon-display: var(--_lumo-list-box-item-selected-icon-display, block);
  }

  /* Dividers */
  [part='items'] ::slotted(hr) {
    height: 1px;
    border: 0;
    padding: 0;
    margin: var(--lumo-space-s) var(--lumo-border-radius-m);
    background-color: var(--lumo-contrast-10pct);
  }
`;pt("vaadin-list-box",Cs,{moduleId:"lumo-list-box"});const Es=h`
  :host {
    --_lumo-list-box-item-selected-icon-display: block;
  }

  /* Normal item */
  [part='items'] ::slotted([role='menuitem']) {
    -webkit-tap-highlight-color: var(--lumo-primary-color-10pct);
    cursor: default;
    outline: none;
    border-radius: var(--lumo-border-radius-m);
    padding-left: calc(var(--lumo-border-radius-m) / 4);
    padding-right: calc(var(--lumo-space-l) + var(--lumo-border-radius-m) / 4);
  }

  /* Hovered item */
  /* TODO a workaround until we have "focus-follows-mouse". After that, use the hover style for focus-ring as well */
  [part='items'] ::slotted([role='menuitem']:hover:not([disabled])),
  [part='items'] ::slotted([role='menuitem'][expanded]:not([disabled])) {
    background-color: var(--lumo-primary-color-10pct);
  }

  /* RTL styles */
  :host([dir='rtl']) [part='items'] ::slotted([role='menuitem']) {
    padding-left: calc(var(--lumo-space-l) + var(--lumo-border-radius-m) / 4);
    padding-right: calc(var(--lumo-border-radius-m) / 4);
  }

  /* Focused item */
  @media (pointer: coarse) {
    [part='items'] ::slotted([role='menuitem']:hover:not([expanded]):not([disabled])) {
      background-color: transparent;
    }
  }
`;pt("vaadin-context-menu-list-box",[Cs,Es],{moduleId:"lumo-context-menu-list-box"}),pt("vaadin-menu-bar-list-box",[Cs,Es],{moduleId:"lumo-menu-bar-list-box"});
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Ps=h`
  :host {
    top: var(--lumo-space-m);
    right: var(--lumo-space-m);
    bottom: var(--lumo-space-m);
    left: var(--lumo-space-m);
    /* Workaround for Edge issue (only on Surface), where an overflowing vaadin-list-box inside vaadin-select-overlay makes the overlay transparent */
    /* stylelint-disable-next-line */
    outline: 0px solid transparent;
  }

  [part='overlay'] {
    background-color: var(--lumo-base-color);
    background-image: linear-gradient(var(--lumo-tint-5pct), var(--lumo-tint-5pct));
    border-radius: var(--lumo-border-radius-m);
    box-shadow: 0 0 0 1px var(--lumo-shade-5pct), var(--lumo-box-shadow-m);
    color: var(--lumo-body-text-color);
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    font-weight: 400;
    line-height: var(--lumo-line-height-m);
    letter-spacing: 0;
    text-transform: none;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  [part='content'] {
    padding: var(--lumo-space-xs);
  }

  [part='backdrop'] {
    background-color: var(--lumo-shade-20pct);
    animation: 0.2s lumo-overlay-backdrop-enter both;
    will-change: opacity;
  }

  @keyframes lumo-overlay-backdrop-enter {
    0% {
      opacity: 0;
    }
  }

  :host([closing]) [part='backdrop'] {
    animation: 0.2s lumo-overlay-backdrop-exit both;
  }

  @keyframes lumo-overlay-backdrop-exit {
    100% {
      opacity: 0;
    }
  }

  @keyframes lumo-overlay-dummy-animation {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 1;
    }
  }
`;pt("",Ps,{moduleId:"lumo-overlay"});
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Os=h`
  :host([opening]),
  :host([closing]) {
    animation: 0.14s lumo-overlay-dummy-animation;
  }

  [part='overlay'] {
    will-change: opacity, transform;
  }

  :host([opening]) [part='overlay'] {
    animation: 0.1s lumo-menu-overlay-enter ease-out both;
  }

  @keyframes lumo-menu-overlay-enter {
    0% {
      opacity: 0;
      transform: translateY(-4px);
    }
  }

  :host([closing]) [part='overlay'] {
    animation: 0.1s lumo-menu-overlay-exit both;
  }

  @keyframes lumo-menu-overlay-exit {
    100% {
      opacity: 0;
    }
  }
`;pt("",Os,{moduleId:"lumo-menu-overlay-core"});const Ss=[Ps,Os,h`
  /* Small viewport (bottom sheet) styles */
  /* Use direct media queries instead of the state attributes ([phone] and [fullscreen]) provided by the elements */
  @media (max-width: 420px), (max-height: 420px) {
    :host {
      top: 0 !important;
      right: 0 !important;
      bottom: var(--vaadin-overlay-viewport-bottom, 0) !important;
      left: 0 !important;
      align-items: stretch !important;
      justify-content: flex-end !important;
    }

    [part='overlay'] {
      max-height: 50vh;
      width: 100vw;
      border-radius: 0;
      box-shadow: var(--lumo-box-shadow-xl);
    }

    /* The content part scrolls instead of the overlay part, because of the gradient fade-out */
    [part='content'] {
      padding: 30px var(--lumo-space-m);
      max-height: inherit;
      box-sizing: border-box;
      -webkit-overflow-scrolling: touch;
      overflow: auto;
      -webkit-mask-image: linear-gradient(transparent, #000 40px, #000 calc(100% - 40px), transparent);
      mask-image: linear-gradient(transparent, #000 40px, #000 calc(100% - 40px), transparent);
    }

    [part='backdrop'] {
      display: block;
    }

    /* Animations */

    :host([opening]) [part='overlay'] {
      animation: 0.2s lumo-mobile-menu-overlay-enter cubic-bezier(0.215, 0.61, 0.355, 1) both;
    }

    :host([closing]),
    :host([closing]) [part='backdrop'] {
      animation-delay: 0.14s;
    }

    :host([closing]) [part='overlay'] {
      animation: 0.14s 0.14s lumo-mobile-menu-overlay-exit cubic-bezier(0.55, 0.055, 0.675, 0.19) both;
    }
  }

  @keyframes lumo-mobile-menu-overlay-enter {
    0% {
      transform: translateY(150%);
    }
  }

  @keyframes lumo-mobile-menu-overlay-exit {
    100% {
      transform: translateY(150%);
    }
  }
`];pt("",Ss,{moduleId:"lumo-menu-overlay"});const Ts=h`
  :host([phone]) {
    top: 0 !important;
    right: 0 !important;
    bottom: var(--vaadin-overlay-viewport-bottom) !important;
    left: 0 !important;
    align-items: stretch;
    justify-content: flex-end;
  }

  /* TODO These style overrides should not be needed.
   We should instead offer a way to have non-selectable items inside the context menu. */

  :host {
    --_lumo-list-box-item-selected-icon-display: none;
    --_lumo-list-box-item-padding-left: calc(var(--lumo-space-m) + var(--lumo-border-radius-m) / 4);
  }

  [part='overlay'] {
    outline: none;
  }
`;pt("vaadin-context-menu-overlay",[Ss,Ts],{moduleId:"lumo-context-menu-overlay"});pt("vaadin-menu-bar-overlay",[Ss,Ts,h`
  :host(:first-of-type) {
    padding-top: var(--lumo-space-xs);
  }
`],{moduleId:"lumo-menu-bar-overlay"}),pt("vaadin-menu-bar",h`
    :host([has-single-button]) ::slotted(vaadin-menu-bar-button) {
      border-radius: var(--lumo-border-radius-m);
    }

    :host([theme~='end-aligned']) ::slotted(vaadin-menu-bar-button:first-of-type),
    :host([theme~='end-aligned'][has-single-button]) ::slotted(vaadin-menu-bar-button) {
      margin-inline-start: auto;
    }
  `,{moduleId:"lumo-menu-bar"}),pt("vaadin-overlay",Ps,{moduleId:"lumo-vaadin-overlay"});
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let ks=!1,Ns=[],Ms=[];function Ls(){ks=!0,requestAnimationFrame((function(){ks=!1,function(t){for(;t.length;)Is(t.shift())}(Ns),setTimeout((function(){!function(t){for(let e=0,o=t.length;e<o;e++)Is(t.shift())}(Ms)}))}))}function Is(t){const e=t[0],o=t[1],i=t[2];try{o.apply(e,i)}catch(t){setTimeout((()=>{throw t}))}}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const zs=t=>t.test(navigator.userAgent),$s=t=>t.test(navigator.platform);zs(/Android/u),zs(/Chrome/u)&&/Google Inc/u.test(navigator.vendor),zs(/Firefox/u);const Rs=$s(/^iPad/u)||$s(/^Mac/u)&&navigator.maxTouchPoints>1,Ds=$s(/^iPhone/u)||Rs;zs(/^((?!chrome|android).)*safari/iu);const Bs=(()=>{try{return document.createEvent("TouchEvent"),!0}catch(t){return!1}})(),Hs=[];
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class Us{constructor(t){this.host=t,this.__trapNode=null,this.__onKeyDown=this.__onKeyDown.bind(this)}get __focusableElements(){return function(t){const e=[];return _s(t,e)?us(e):e}(this.__trapNode)}get __focusedElementIndex(){const t=this.__focusableElements;return t.indexOf(t.filter(ms).pop())}hostConnected(){document.addEventListener("keydown",this.__onKeyDown)}hostDisconnected(){document.removeEventListener("keydown",this.__onKeyDown)}trapFocus(t){if(this.__trapNode=t,0===this.__focusableElements.length)throw this.__trapNode=null,new Error("The trap node should have at least one focusable descendant or be focusable itself.");Hs.push(this),-1===this.__focusedElementIndex&&this.__focusableElements[0].focus()}releaseFocus(){this.__trapNode=null,Hs.pop()}__onKeyDown(t){if(this.__trapNode&&this===Array.from(Hs).pop()&&"Tab"===t.key){t.preventDefault();const e=t.shiftKey;this.__focusNextElement(e)}}__focusNextElement(t=!1){const e=this.__focusableElements,o=t?-1:1,i=this.__focusedElementIndex,s=e[(e.length+i+o)%e.length];s.focus(),"input"===s.localName&&s.select()}}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */function Fs(t){window.Vaadin&&window.Vaadin.templateRendererCallback?window.Vaadin.templateRendererCallback(t):t.querySelector("template")&&console.warn(`WARNING: <template> inside <${t.localName}> is no longer supported. Import @vaadin/polymer-legacy-adapter/template-renderer.js to enable compatibility.`)}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class js extends(yt(ci(Vo(jo)))){static get template(){return Uo`
      <style>
        :host {
          z-index: 200;
          position: fixed;

          /* Despite of what the names say, <vaadin-overlay> is just a container
          for position/sizing/alignment. The actual overlay is the overlay part. */

          /* Default position constraints: the entire viewport. Note: themes can
          override this to introduce gaps between the overlay and the viewport. */
          top: 0;
          right: 0;
          bottom: var(--vaadin-overlay-viewport-bottom);
          left: 0;

          /* Use flexbox alignment for the overlay part. */
          display: flex;
          flex-direction: column; /* makes dropdowns sizing easier */
          /* Align to center by default. */
          align-items: center;
          justify-content: center;

          /* Allow centering when max-width/max-height applies. */
          margin: auto;

          /* The host is not clickable, only the overlay part is. */
          pointer-events: none;

          /* Remove tap highlight on touch devices. */
          -webkit-tap-highlight-color: transparent;

          /* CSS API for host */
          --vaadin-overlay-viewport-bottom: 0;
        }

        :host([hidden]),
        :host(:not([opened]):not([closing])) {
          display: none !important;
        }

        [part='overlay'] {
          -webkit-overflow-scrolling: touch;
          overflow: auto;
          pointer-events: auto;

          /* Prevent overflowing the host in MSIE 11 */
          max-width: 100%;
          box-sizing: border-box;

          -webkit-tap-highlight-color: initial; /* reenable tap highlight inside */
        }

        [part='backdrop'] {
          z-index: -1;
          content: '';
          background: rgba(0, 0, 0, 0.5);
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          pointer-events: auto;
        }
      </style>

      <div id="backdrop" part="backdrop" hidden$="[[!withBackdrop]]"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `}static get is(){return"vaadin-overlay"}static get properties(){return{opened:{type:Boolean,notify:!0,observer:"_openedChanged",reflectToAttribute:!0},owner:Element,renderer:Function,withBackdrop:{type:Boolean,value:!1,reflectToAttribute:!0},model:Object,modeless:{type:Boolean,value:!1,reflectToAttribute:!0,observer:"_modelessChanged"},hidden:{type:Boolean,reflectToAttribute:!0,observer:"_hiddenChanged"},focusTrap:{type:Boolean,value:!1},restoreFocusOnClose:{type:Boolean,value:!1},restoreFocusNode:{type:HTMLElement},_mouseDownInside:{type:Boolean},_mouseUpInside:{type:Boolean},_oldOwner:Element,_oldModel:Object,_oldRenderer:Object,_oldOpened:Boolean}}static get observers(){return["_rendererOrDataChanged(renderer, owner, model, opened)"]}static get __attachedInstances(){return Array.from(document.body.children).filter((t=>t instanceof js&&!t.hasAttribute("closing"))).sort(((t,e)=>t.__zIndex-e.__zIndex||0))}constructor(){super(),this._boundMouseDownListener=this._mouseDownListener.bind(this),this._boundMouseUpListener=this._mouseUpListener.bind(this),this._boundOutsideClickListener=this._outsideClickListener.bind(this),this._boundKeydownListener=this._keydownListener.bind(this),Ds&&(this._boundIosResizeListener=()=>this._detectIosNavbar()),this.__focusTrapController=new Us(this)}get _last(){return this===js.__attachedInstances.pop()}ready(){super.ready(),this.addEventListener("click",(()=>{})),this.$.backdrop.addEventListener("click",(()=>{})),this.addController(this.__focusTrapController),Fs(this)}_detectIosNavbar(){if(!this.opened)return;const t=window.innerHeight,e=window.innerWidth>t,o=document.documentElement.clientHeight;e&&o>t?this.style.setProperty("--vaadin-overlay-viewport-bottom",o-t+"px"):this.style.setProperty("--vaadin-overlay-viewport-bottom","0")}close(t){const e=new CustomEvent("vaadin-overlay-close",{bubbles:!0,cancelable:!0,detail:{sourceEvent:t}});this.dispatchEvent(e),e.defaultPrevented||(this.opened=!1)}connectedCallback(){super.connectedCallback(),this._boundIosResizeListener&&(this._detectIosNavbar(),window.addEventListener("resize",this._boundIosResizeListener))}disconnectedCallback(){super.disconnectedCallback(),this._boundIosResizeListener&&window.removeEventListener("resize",this._boundIosResizeListener)}requestContentUpdate(){this.renderer&&this.renderer.call(this.owner,this,this.owner,this.model)}_mouseDownListener(t){this._mouseDownInside=t.composedPath().indexOf(this.$.overlay)>=0}_mouseUpListener(t){this._mouseUpInside=t.composedPath().indexOf(this.$.overlay)>=0}_shouldCloseOnOutsideClick(t){return this._last}_outsideClickListener(t){if(t.composedPath().includes(this.$.overlay)||this._mouseDownInside||this._mouseUpInside)return this._mouseDownInside=!1,void(this._mouseUpInside=!1);if(!this._shouldCloseOnOutsideClick(t))return;const e=new CustomEvent("vaadin-overlay-outside-click",{bubbles:!0,cancelable:!0,detail:{sourceEvent:t}});this.dispatchEvent(e),this.opened&&!e.defaultPrevented&&this.close(t)}_keydownListener(t){if(this._last&&(!this.modeless||t.composedPath().includes(this.$.overlay))&&"Escape"===t.key){const e=new CustomEvent("vaadin-overlay-escape-press",{bubbles:!0,cancelable:!0,detail:{sourceEvent:t}});this.dispatchEvent(e),this.opened&&!e.defaultPrevented&&this.close(t)}}_openedChanged(t,e){var o,i,s;t?(this.__restoreFocusNode=this._getActiveElement(),this._animatedOpening(),o=this,i=()=>{this.focusTrap&&this.__focusTrapController.trapFocus(this.$.overlay);const t=new CustomEvent("vaadin-overlay-open",{bubbles:!0});this.dispatchEvent(t)},ks||Ls(),Ms.push([o,i,s]),document.addEventListener("keydown",this._boundKeydownListener),this.modeless||this._addGlobalListeners()):e&&(this.focusTrap&&this.__focusTrapController.releaseFocus(),this._animatedClosing(),document.removeEventListener("keydown",this._boundKeydownListener),this.modeless||this._removeGlobalListeners())}_hiddenChanged(t){t&&this.hasAttribute("closing")&&this._flushAnimation("closing")}_shouldAnimate(){const t=getComputedStyle(this),e=t.getPropertyValue("animation-name");return!("none"===t.getPropertyValue("display"))&&e&&"none"!==e}_enqueueAnimation(t,e){const o=`__${t}Handler`,i=t=>{t&&t.target!==this||(e(),this.removeEventListener("animationend",i),delete this[o])};this[o]=i,this.addEventListener("animationend",i)}_flushAnimation(t){const e=`__${t}Handler`;"function"==typeof this[e]&&this[e]()}_animatedOpening(){this.parentNode===document.body&&this.hasAttribute("closing")&&this._flushAnimation("closing"),this._attachOverlay(),this.modeless||this._enterModalState(),this.setAttribute("opening",""),this._shouldAnimate()?this._enqueueAnimation("opening",(()=>{this._finishOpening()})):this._finishOpening()}_attachOverlay(){this._placeholder=document.createComment("vaadin-overlay-placeholder"),this.parentNode.insertBefore(this._placeholder,this),document.body.appendChild(this),this.bringToFront()}_finishOpening(){this.removeAttribute("opening")}_finishClosing(){this._detachOverlay(),this.$.overlay.style.removeProperty("pointer-events"),this.removeAttribute("closing"),this.dispatchEvent(new CustomEvent("vaadin-overlay-closed"))}_animatedClosing(){if(this.hasAttribute("opening")&&this._flushAnimation("opening"),this._placeholder){this._exitModalState();const t=this.restoreFocusNode||this.__restoreFocusNode;if(this.restoreFocusOnClose&&t){const e=this._getActiveElement();(e===document.body||this._deepContains(e))&&setTimeout((()=>t.focus())),this.__restoreFocusNode=null}this.setAttribute("closing",""),this.dispatchEvent(new CustomEvent("vaadin-overlay-closing")),this._shouldAnimate()?this._enqueueAnimation("closing",(()=>{this._finishClosing()})):this._finishClosing()}}_detachOverlay(){this._placeholder.parentNode.insertBefore(this,this._placeholder),this._placeholder.parentNode.removeChild(this._placeholder)}_modelessChanged(t){t?(this._removeGlobalListeners(),this._exitModalState()):this.opened&&(this._addGlobalListeners(),this._enterModalState())}_addGlobalListeners(){document.addEventListener("mousedown",this._boundMouseDownListener),document.addEventListener("mouseup",this._boundMouseUpListener),document.documentElement.addEventListener("click",this._boundOutsideClickListener,!0)}_enterModalState(){"none"!==document.body.style.pointerEvents&&(this._previousDocumentPointerEvents=document.body.style.pointerEvents,document.body.style.pointerEvents="none"),js.__attachedInstances.forEach((t=>{t!==this&&(t.shadowRoot.querySelector('[part="overlay"]').style.pointerEvents="none")}))}_removeGlobalListeners(){document.removeEventListener("mousedown",this._boundMouseDownListener),document.removeEventListener("mouseup",this._boundMouseUpListener),document.documentElement.removeEventListener("click",this._boundOutsideClickListener,!0)}_exitModalState(){void 0!==this._previousDocumentPointerEvents&&(document.body.style.pointerEvents=this._previousDocumentPointerEvents,delete this._previousDocumentPointerEvents);const t=js.__attachedInstances;let e;for(;(e=t.pop())&&(e===this||(e.shadowRoot.querySelector('[part="overlay"]').style.removeProperty("pointer-events"),e.modeless)););}_rendererOrDataChanged(t,e,o,i){const s=this._oldOwner!==e||this._oldModel!==o;this._oldModel=o,this._oldOwner=e;const n=this._oldRenderer!==t;this._oldRenderer=t;const r=this._oldOpened!==i;this._oldOpened=i,n&&(this.innerHTML="",delete this._$litPart$),i&&t&&(n||r||s)&&this.requestContentUpdate()}_getActiveElement(){let t=document.activeElement||document.body;for(;t.shadowRoot&&t.shadowRoot.activeElement;)t=t.shadowRoot.activeElement;return t}_deepContains(t){if(this.contains(t))return!0;let e=t;const o=t.ownerDocument;for(;e&&e!==o&&e!==this;)e=e.parentNode||e.host;return e===this}bringToFront(){let t="";const e=js.__attachedInstances.filter((t=>t!==this)).pop();if(e){t=e.__zIndex+1}this.style.zIndex=t,this.__zIndex=t||parseFloat(getComputedStyle(this).zIndex)}}customElements.define(js.is,js);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Vs=t=>class extends(as(fs(t))){static get properties(){return{_hasVaadinItemMixin:{value:!0},selected:{type:Boolean,value:!1,reflectToAttribute:!0,observer:"_selectedChanged"},_value:String}}get _activeKeys(){return["Enter"," "]}get value(){return void 0!==this._value?this._value:this.textContent.trim()}set value(t){this._value=t}ready(){super.ready();const t=this.getAttribute("value");null!==t&&(this.value=t)}focus(){this.disabled||(super.focus(),this._setFocused(!0))}_shouldSetActive(t){return!(this.disabled||"keydown"===t.type&&t.defaultPrevented)}_selectedChanged(t){this.setAttribute("aria-selected",t)}_disabledChanged(t){super._disabledChanged(t),t&&(this.selected=!1,this.blur())}_onKeyDown(t){super._onKeyDown(t),this._activeKeys.includes(t.key)&&!t.defaultPrevented&&(t.preventDefault(),this.click())}}
/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class Ys extends(Vs(yt(ci(jo)))){static get is(){return"vaadin-menu-bar-item"}static get template(){return Uo`
      <style>
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>
      <span part="checkmark" aria-hidden="true"></span>
      <div part="content">
        <slot></slot>
      </div>
    `}connectedCallback(){super.connectedCallback(),this.setAttribute("role","menuitem")}}customElements.define(Ys.is,Ys);
/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const qs=t=>class extends(rs(t)){get focused(){return(this._getItems()||[]).find(ms)}get _vertical(){return!0}focus(){const t=this._getItems();if(Array.isArray(t)){const e=this._getAvailableIndex(t,0,null,(t=>!ps(t)));e>=0&&t[e].focus()}}_getItems(){return Array.from(this.children)}_onKeyDown(t){if(super._onKeyDown(t),t.metaKey||t.ctrlKey)return;const{key:e}=t,o=this._getItems()||[],i=o.indexOf(this.focused);let s,n;const r=!this._vertical&&"rtl"===this.getAttribute("dir")?-1:1;this.__isPrevKey(e)?(n=-r,s=i-r):this.__isNextKey(e)?(n=r,s=i+r):"Home"===e?(n=1,s=0):"End"===e&&(n=-1,s=o.length-1),s=this._getAvailableIndex(o,s,n,(t=>!ps(t))),s>=0&&(t.preventDefault(),this._focus(s,!0))}__isPrevKey(t){return this._vertical?"ArrowUp"===t:"ArrowLeft"===t}__isNextKey(t){return this._vertical?"ArrowDown"===t:"ArrowRight"===t}_focus(t,e=!1){const o=this._getItems();this._focusItem(o[t],e)}_focusItem(t){t&&(t.focus(),t.setAttribute("focus-ring",""))}_getAvailableIndex(t,e,o,i){const s=t.length;let n=e;for(let e=0;"number"==typeof n&&e<s;e+=1,n+=o||1){n<0?n=s-1:n>=s&&(n=0);const e=t[n];if(!e.hasAttribute("disabled")&&this.__isMatchingItem(e,i))return n}return-1}__isMatchingItem(t,e){return"function"!=typeof e||e(t)}}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,Ws=t=>class extends(qs(t)){static get properties(){return{_hasVaadinListMixin:{value:!0},disabled:{type:Boolean,value:!1,reflectToAttribute:!0},selected:{type:Number,reflectToAttribute:!0,notify:!0},orientation:{type:String,reflectToAttribute:!0,value:""},items:{type:Array,readOnly:!0,notify:!0},_searchBuf:{type:String,value:""}}}static get observers(){return["_enhanceItems(items, orientation, selected, disabled)"]}get _isRTL(){return!this._vertical&&"rtl"===this.getAttribute("dir")}get _scrollerElement(){return console.warn(`Please implement the '_scrollerElement' property in <${this.localName}>`),this}get _vertical(){return"horizontal"!==this.orientation}focus(){this._observer&&this._observer.flush();const t=this.querySelector('[tabindex="0"]')||(this.items?this.items[0]:null);this._focusItem(t)}ready(){super.ready(),this.addEventListener("click",(t=>this._onClick(t))),this._observer=new Ai(this,(()=>{this._setItems(this._filterItems(Ai.getFlattenedNodes(this)))}))}_getItems(){return this.items}_enhanceItems(t,e,o,i){if(!i&&t){this.setAttribute("aria-orientation",e||"vertical"),t.forEach((t=>{e?t.setAttribute("orientation",e):t.removeAttribute("orientation")})),this._setFocusable(o||0);const i=t[o];t.forEach((t=>{t.selected=t===i})),i&&!i.disabled&&this._scrollToItem(o)}}_filterItems(t){return t.filter((t=>t._hasVaadinItemMixin))}_onClick(t){if(t.metaKey||t.shiftKey||t.ctrlKey||t.defaultPrevented)return;const e=this._filterItems(t.composedPath())[0];let o;e&&!e.disabled&&(o=this.items.indexOf(e))>=0&&(this.selected=o)}_searchKey(t,e){this._searchReset=ri.debounce(this._searchReset,oi.after(500),(()=>{this._searchBuf=""})),this._searchBuf+=e.toLowerCase(),this.items.some((t=>this.__isMatchingKey(t)))||(this._searchBuf=e.toLowerCase());const o=1===this._searchBuf.length?t+1:t;return this._getAvailableIndex(this.items,o,1,(t=>this.__isMatchingKey(t)&&"none"!==getComputedStyle(t).display))}__isMatchingKey(t){return t.textContent.replace(/[^\p{L}\p{Nd}]/gu,"").toLowerCase().startsWith(this._searchBuf)}_onKeyDown(t){if(t.metaKey||t.ctrlKey)return;const e=t.key,o=this.items.indexOf(this.focused);if(/[a-zA-Z0-9]/u.test(e)&&1===e.length){const t=this._searchKey(o,e);t>=0&&this._focus(t)}else super._onKeyDown(t)}_isItemHidden(t){return"none"===getComputedStyle(t).display}_setFocusable(t){t=this._getAvailableIndex(this.items,t,1);const e=this.items[t];this.items.forEach((t=>{t.tabIndex=t===e?0:-1}))}_focus(t){this.items.forEach(((e,o)=>{e.focused=o===t})),this._setFocusable(t),this._scrollToItem(t),super._focus(t)}_scrollToItem(t){const e=this.items[t];if(!e)return;const o=this._vertical?["top","bottom"]:this._isRTL?["right","left"]:["left","right"],i=this._scrollerElement.getBoundingClientRect(),s=(this.items[t+1]||e).getBoundingClientRect(),n=(this.items[t-1]||e).getBoundingClientRect();let r=0;!this._isRTL&&s[o[1]]>=i[o[1]]||this._isRTL&&s[o[1]]<=i[o[1]]?r=s[o[1]]-i[o[1]]:(!this._isRTL&&n[o[0]]<=i[o[0]]||this._isRTL&&n[o[0]]>=i[o[0]])&&(r=n[o[0]]-i[o[0]]),this._scroll(r)}_scroll(t){if(this._vertical)this._scrollerElement.scrollTop+=t;else{const e=this.getAttribute("dir")||"ltr",o=
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function(t,e){const{scrollLeft:o}=t;return"rtl"!==e?o:t.scrollWidth-t.clientWidth+o}(this._scrollerElement,e)+t;!function(t,e,o){t.scrollLeft="rtl"!==e?o:t.clientWidth-t.scrollWidth+o}(this._scrollerElement,e,o)}}}
/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class Ks extends(Ws(yt(ci(Vo(jo))))){static get is(){return"vaadin-menu-bar-list-box"}static get template(){return Uo`
      <style>
        :host {
          display: flex;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='items'] {
          height: 100%;
          width: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
      </style>
      <div part="items">
        <slot></slot>
      </div>
    `}static get properties(){return{orientation:{readOnly:!0}}}get _scrollerElement(){return this.shadowRoot.querySelector('[part="items"]')}ready(){super.ready(),this.setAttribute("role","menu")}}customElements.define(Ks.is,Ks);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Gs={start:"top",end:"bottom"},Js={start:"left",end:"right"},Xs=new ResizeObserver((t=>{setTimeout((()=>{t.forEach((t=>{t.target.__overlay&&t.target.__overlay._updatePosition()}))}))})),Zs=t=>class extends t{static get properties(){return{positionTarget:{type:Object,value:null},horizontalAlign:{type:String,value:"start"},verticalAlign:{type:String,value:"top"},noHorizontalOverlap:{type:Boolean,value:!1},noVerticalOverlap:{type:Boolean,value:!1},requiredVerticalSpace:{type:Number,value:0}}}static get observers(){return["__positionSettingsChanged(horizontalAlign, verticalAlign, noHorizontalOverlap, noVerticalOverlap, requiredVerticalSpace)","__overlayOpenedChanged(opened, positionTarget)"]}constructor(){super(),this.__onScroll=this.__onScroll.bind(this),this._updatePosition=this._updatePosition.bind(this)}connectedCallback(){super.connectedCallback(),this.opened&&this.__addUpdatePositionEventListeners()}disconnectedCallback(){super.disconnectedCallback(),this.__removeUpdatePositionEventListeners()}__addUpdatePositionEventListeners(){window.addEventListener("resize",this._updatePosition),this.__positionTargetAncestorRootNodes=function(t){const e=[];for(;t;){if(t.nodeType===Node.DOCUMENT_NODE){e.push(t);break}t.nodeType!==Node.DOCUMENT_FRAGMENT_NODE?t=t.assignedSlot?t.assignedSlot:t.parentNode:(e.push(t),t=t.host)}return e}(this.positionTarget),this.__positionTargetAncestorRootNodes.forEach((t=>{t.addEventListener("scroll",this.__onScroll,!0)}))}__removeUpdatePositionEventListeners(){window.removeEventListener("resize",this._updatePosition),this.__positionTargetAncestorRootNodes&&(this.__positionTargetAncestorRootNodes.forEach((t=>{t.removeEventListener("scroll",this.__onScroll,!0)})),this.__positionTargetAncestorRootNodes=null)}__overlayOpenedChanged(t,e){if(this.__removeUpdatePositionEventListeners(),e&&(e.__overlay=null,Xs.unobserve(e),t&&(this.__addUpdatePositionEventListeners(),e.__overlay=this,Xs.observe(e))),t){const t=getComputedStyle(this);this.__margins||(this.__margins={},["top","bottom","left","right"].forEach((e=>{this.__margins[e]=parseInt(t[e],10)}))),this.setAttribute("dir",t.direction),this._updatePosition(),requestAnimationFrame((()=>this._updatePosition()))}}__positionSettingsChanged(){this._updatePosition()}__onScroll(t){this.contains(t.target)||this._updatePosition()}_updatePosition(){if(!this.positionTarget||!this.opened)return;const t=this.positionTarget.getBoundingClientRect(),e=this.__shouldAlignStartVertically(t);this.style.justifyContent=e?"flex-start":"flex-end";const o=this.__isRTL,i=this.__shouldAlignStartHorizontally(t,o),s=!o&&i||o&&!i;this.style.alignItems=s?"flex-start":"flex-end";const n=this.getBoundingClientRect(),r=this.__calculatePositionInOneDimension(t,n,this.noVerticalOverlap,Gs,this,e),a=this.__calculatePositionInOneDimension(t,n,this.noHorizontalOverlap,Js,this,i);Object.assign(this.style,r,a),this.toggleAttribute("bottom-aligned",!e),this.toggleAttribute("top-aligned",e),this.toggleAttribute("end-aligned",!s),this.toggleAttribute("start-aligned",s)}__shouldAlignStartHorizontally(t,e){const o=Math.max(this.__oldContentWidth||0,this.$.overlay.offsetWidth);this.__oldContentWidth=this.$.overlay.offsetWidth;const i=Math.min(window.innerWidth,document.documentElement.clientWidth),s=!e&&"start"===this.horizontalAlign||e&&"end"===this.horizontalAlign;return this.__shouldAlignStart(t,o,i,this.__margins,s,this.noHorizontalOverlap,Js)}__shouldAlignStartVertically(t){const e=this.requiredVerticalSpace||Math.max(this.__oldContentHeight||0,this.$.overlay.offsetHeight);this.__oldContentHeight=this.$.overlay.offsetHeight;const o=Math.min(window.innerHeight,document.documentElement.clientHeight),i="top"===this.verticalAlign;return this.__shouldAlignStart(t,e,o,this.__margins,i,this.noVerticalOverlap,Gs)}__shouldAlignStart(t,e,o,i,s,n,r){const a=o-t[n?r.end:r.start]-i[r.end],l=t[n?r.start:r.end]-i[r.start],d=s?a:l;return s===(d>(s?l:a)||d>e)}__adjustBottomProperty(t,e,o){let i;if(t===e.end){if(e.end===Gs.end){const t=Math.min(window.innerHeight,document.documentElement.clientHeight);if(o>t&&this.__oldViewportHeight){i=o-(this.__oldViewportHeight-t)}this.__oldViewportHeight=t}if(e.end===Js.end){const t=Math.min(window.innerWidth,document.documentElement.clientWidth);if(o>t&&this.__oldViewportWidth){i=o-(this.__oldViewportWidth-t)}this.__oldViewportWidth=t}}return i}__calculatePositionInOneDimension(t,e,o,i,s,n){const r=n?i.start:i.end,a=n?i.end:i.start,l=parseFloat(s.style[r]||getComputedStyle(s)[r]),d=this.__adjustBottomProperty(r,i,l),c=e[n?i.start:i.end]-t[o===n?i.end:i.start];return{[r]:d?`${d}px`:`${l+c*(n?-1:1)}px`,[a]:""}}}
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,Qs=t=>class extends(Zs(t)){static get properties(){return{parentOverlay:{type:Object,readOnly:!0}}}static get observers(){return["_themeChanged(_theme)"]}ready(){super.ready(),this.addEventListener("keydown",(t=>{if(!t.defaultPrevented&&t.composedPath()[0]===this.$.overlay&&[38,40].indexOf(t.keyCode)>-1){const e=this.getFirstChild();e&&Array.isArray(e.items)&&e.items.length&&(t.preventDefault(),38===t.keyCode?e.items[e.items.length-1].focus():e.focus())}}))}getFirstChild(){return this.querySelector(":not(style):not(slot)")}_themeChanged(){this.close()}getBoundaries(){const t=this.getBoundingClientRect(),e=this.$.overlay.getBoundingClientRect();let o=t.bottom-e.height;const i=this.parentOverlay;if(i&&i.hasAttribute("bottom-aligned")){const t=getComputedStyle(i);o=o-parseFloat(t.bottom)-parseFloat(t.height)}return{xMax:t.right-e.width,xMin:t.left+e.width,yMax:o}}_updatePosition(){if(super._updatePosition(),this.positionTarget&&this.parentOverlay){const t=this.$.content,e=getComputedStyle(t);!!this.style.left?this.style.left=`${parseFloat(this.style.left)+parseFloat(e.paddingLeft)}px`:this.style.right=`${parseFloat(this.style.right)+parseFloat(e.paddingRight)}px`;!!this.style.bottom?this.style.bottom=parseFloat(this.style.bottom)-parseFloat(e.paddingBottom)+"px":this.style.top=parseFloat(this.style.top)-parseFloat(e.paddingTop)+"px"}}}
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,tn=h`
  :host {
    align-items: flex-start;
    justify-content: flex-start;
  }

  :host([right-aligned]),
  :host([end-aligned]) {
    align-items: flex-end;
  }

  :host([bottom-aligned]) {
    justify-content: flex-end;
  }

  [part='overlay'] {
    background-color: #fff;
  }
`
/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;pt("vaadin-menu-bar-overlay",tn,{moduleId:"vaadin-menu-bar-overlay-styles"});class en extends(Qs(js)){static get is(){return"vaadin-menu-bar-overlay"}}customElements.define(en.is,en),
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
Qi({name:"vaadin-contextmenu",deps:["touchstart","touchmove","touchend","contextmenu"],flow:{start:["touchstart","contextmenu"],end:["contextmenu"]},emits:["vaadin-contextmenu"],info:{sourceEvent:null},reset(){this.info.sourceEvent=null,this._cancelTimer(),this.info.touchJob=null,this.info.touchStartCoords=null},_cancelTimer(){this._timerId&&(clearTimeout(this._timerId),delete this._fired)},_setSourceEvent(t){this.info.sourceEvent=t;const e=t.composedPath();this.info.sourceEvent.__composedPath=e},touchstart(t){this._setSourceEvent(t),this.info.touchStartCoords={x:t.changedTouches[0].clientX,y:t.changedTouches[0].clientY};const e=t.composedPath()[0]||t.target;this._timerId=setTimeout((()=>{const o=t.changedTouches[0];t.shiftKey||(Ds&&(this._fired=!0,this.fire(e,o.clientX,o.clientY)),es("tap"))}),500)},touchmove(t){const e=this.info.touchStartCoords;(Math.abs(e.x-t.changedTouches[0].clientX)>15||Math.abs(e.y-t.changedTouches[0].clientY)>15)&&this._cancelTimer()},touchend(t){this._fired&&t.preventDefault(),this._cancelTimer()},contextmenu(t){t.shiftKey||(this._setSourceEvent(t),this.fire(t.target,t.clientX,t.clientY),es("tap"))},fire(t,e,o){const i=this.info.sourceEvent,s=new Event("vaadin-contextmenu",{bubbles:!0,cancelable:!0,composed:!0});s.detail={x:e,y:o,sourceEvent:i},t.dispatchEvent(s),s.defaultPrevented&&i&&i.preventDefault&&i.preventDefault()}}),
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
pt("vaadin-context-menu-overlay",tn,{moduleId:"vaadin-context-menu-overlay-styles"});class on extends(Qs(js)){static get is(){return"vaadin-context-menu-overlay"}}customElements.define(on.is,on);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class sn{constructor(t,e){this.query=t,this.callback=e,this._boundQueryHandler=this._queryHandler.bind(this)}hostConnected(){this._removeListener(),this._mediaQuery=window.matchMedia(this.query),this._addListener(),this._queryHandler(this._mediaQuery)}hostDisconnected(){this._removeListener()}_addListener(){this._mediaQuery&&this._mediaQuery.addListener(this._boundQueryHandler)}_removeListener(){this._mediaQuery&&this._mediaQuery.removeListener(this._boundQueryHandler),this._mediaQuery=null}_queryHandler(t){"function"==typeof this.callback&&this.callback(t.matches)}}
/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const nn=t=>class extends t{static get properties(){return{overlayClass:{type:String},_overlayElement:{type:Object}}}static get observers(){return["__updateOverlayClassNames(overlayClass, _overlayElement)"]}__updateOverlayClassNames(t,e){if(!e)return;if(void 0===t)return;const{classList:o}=e;if(this.__initialClasses||(this.__initialClasses=new Set(o)),Array.isArray(this.__previousClasses)){const t=this.__previousClasses.filter((t=>!this.__initialClasses.has(t)));t.length>0&&o.remove(...t)}const i="string"==typeof t?t.split(" "):[];i.length>0&&o.add(...i),this.__previousClasses=i}}
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class rn extends(Vs(yt(ci(jo)))){static get is(){return"vaadin-context-menu-item"}static get template(){return Uo`
      <style>
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>
      <span part="checkmark" aria-hidden="true"></span>
      <div part="content">
        <slot></slot>
      </div>
    `}ready(){super.ready(),this.setAttribute("role","menuitem")}}customElements.define(rn.is,rn);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class an extends(Ws(yt(ci(Vo(jo))))){static get is(){return"vaadin-context-menu-list-box"}static get template(){return Uo`
      <style>
        :host {
          display: flex;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='items'] {
          height: 100%;
          width: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
      </style>
      <div part="items">
        <slot></slot>
      </div>
    `}static get properties(){return{orientation:{readOnly:!0}}}get _scrollerElement(){return this.shadowRoot.querySelector('[part="items"]')}ready(){super.ready(),this.setAttribute("role","menu")}}customElements.define(an.is,an);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ln=t=>class extends t{static get properties(){return{items:Array}}get _tagNamePrefix(){return"vaadin-context-menu"}ready(){super.ready(),this.__itemsOutsideClickListener=t=>{t.composedPath().some((t=>t.localName===`${this._tagNamePrefix}-overlay`))||this.dispatchEvent(new CustomEvent("items-outside-click"))},this.addEventListener("items-outside-click",(()=>this.items&&this.close()))}connectedCallback(){super.connectedCallback(),document.documentElement.addEventListener("click",this.__itemsOutsideClickListener)}disconnectedCallback(){super.disconnectedCallback(),document.documentElement.removeEventListener("click",this.__itemsOutsideClickListener)}__forwardFocus(){const t=this.$.overlay,e=t.getFirstChild();if(t.parentOverlay){const o=t.parentOverlay.querySelector("[expanded]");o&&o.hasAttribute("focused")&&e?e.focus():t.$.overlay.focus()}else e&&e.focus()}__openSubMenu(t,e,o){t.items=e._item.children,t.listenOn=e,t.overlayClass=o;const i=this.$.overlay,s=t.$.overlay;s.positionTarget=e,s.noHorizontalOverlap=!0,s._setParentOverlay(i),i.hasAttribute("theme")?t.setAttribute("theme",i.getAttribute("theme")):t.removeAttribute("theme");t.$.overlay.$.content.style.minWidth="",e.dispatchEvent(new CustomEvent("opensubmenu",{detail:{children:e._item.children}}))}__createComponent(t){let e;return e=t.component instanceof HTMLElement?t.component:document.createElement(t.component||`${this._tagNamePrefix}-item`),e._hasVaadinItemMixin&&e.setAttribute("role","menuitem"),"hr"===e.localName?e.setAttribute("role","separator"):e.setAttribute("aria-haspopup","false"),this._setMenuItemTheme(e,t,this._theme),e._item=t,t.text&&(e.textContent=t.text),this.__toggleMenuComponentAttribute(e,"menu-item-checked",t.checked),this.__toggleMenuComponentAttribute(e,"disabled",t.disabled),t.children&&t.children.length&&(this.__updateExpanded(e,!1),e.setAttribute("aria-haspopup","true")),e}__initListBox(){const t=document.createElement(`${this._tagNamePrefix}-list-box`);return this._theme&&t.setAttribute("theme",this._theme),t.addEventListener("selected-changed",(e=>{const{value:o}=e.detail;if("number"==typeof o){const e=t.items[o]._item;e.children||this.dispatchEvent(new CustomEvent("item-selected",{detail:{value:e}})),t.selected=null}})),t}__initOverlay(){const t=this.$.overlay;t.$.backdrop.addEventListener("click",(()=>{this.close()})),t.addEventListener(Bs?"click":"mouseover",(t=>{this.__showSubMenu(t)})),t.addEventListener("keydown",(t=>{const{key:e}=t,o=this.__isRTL,i="ArrowRight"===e,s="ArrowLeft"===e;!o&&i||o&&s||"Enter"===e||" "===e?this.__showSubMenu(t):!o&&s||o&&i?(this.close(),this.listenOn.focus()):"Escape"!==e&&"Tab"!==e||this.dispatchEvent(new CustomEvent("close-all-menus"))}))}__initSubMenu(){const t=document.createElement(this.constructor.is);return t._modeless=!0,t.openOn="opensubmenu",t.setAttribute("hidden",""),this.addEventListener("opened-changed",(t=>{t.detail.value||this._subMenu.close()})),t.addEventListener("close-all-menus",(()=>{this.dispatchEvent(new CustomEvent("close-all-menus"))})),t.addEventListener("item-selected",(t=>{const{detail:e}=t;this.dispatchEvent(new CustomEvent("item-selected",{detail:e}))})),this.addEventListener("close-all-menus",(()=>{this.close()})),this.addEventListener("item-selected",(()=>{this.close()})),t.addEventListener("opened-changed",(t=>{if(!t.detail.value){const t=this._listBox.querySelector("[expanded]");t&&this.__updateExpanded(t,!1)}})),t}__showSubMenu(t,e=t.composedPath().find((t=>t.localName===`${this._tagNamePrefix}-item`))){if(!this.__openListenerActive)return;if(this.$.overlay.hasAttribute("opening"))return void requestAnimationFrame((()=>{this.__showSubMenu(t,e)}));const o=this._subMenu;if(e){const{children:t}=e._item;if(o.items!==t&&o.close(),!this.opened)return;if(t&&t.length){this.__updateExpanded(e,!0);const{overlayClass:t}=this;this.__openSubMenu(o,e,t)}else o.listenOn.focus()}}__itemsRenderer(t,e,{detail:o}){this.__initMenu(t,e);t.querySelector(this.constructor.is).closeOn=e.closeOn;const i=t.querySelector(`${this._tagNamePrefix}-list-box`);i.innerHTML="",[...o.children||e.items].forEach((t=>{const e=this.__createComponent(t);i.appendChild(e)}))}_setMenuItemTheme(t,e,o){let i=t.getAttribute("theme")||o;null!=e.theme&&(i=Array.isArray(e.theme)?e.theme.join(" "):e.theme),this.__updateTheme(t,i)}__toggleMenuComponentAttribute(t,e,o){o?(t.setAttribute(e,""),t[`__has-${e}`]=!0):t[`__has-${e}`]&&(t.removeAttribute(e),t[`__has-${e}`]=!1)}__initMenu(t,e){if(t.firstElementChild)this.__updateTheme(this._listBox,this._theme);else{this.__initOverlay();const e=this.__initListBox();this._listBox=e,t.appendChild(e);const o=this.__initSubMenu();this._subMenu=o,t.appendChild(o),requestAnimationFrame((()=>{this.__openListenerActive=!0}))}}__updateExpanded(t,e){t.setAttribute("aria-expanded",e.toString()),t.toggleAttribute("expanded",e)}__updateTheme(t,e){e?t.setAttribute("theme",e):t.removeAttribute("theme")}}
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class dn extends(nn(Vo(pi(ct(ln(jo)))))){static get template(){return Uo`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>

      <slot id="slot"></slot>

      <vaadin-context-menu-overlay
        id="overlay"
        on-opened-changed="_onOverlayOpened"
        on-vaadin-overlay-open="_onVaadinOverlayOpen"
        modeless="[[_modeless]]"
        with-backdrop="[[_phone]]"
        phone$="[[_phone]]"
        model="[[_context]]"
        theme$="[[_theme]]"
      ></vaadin-context-menu-overlay>
    `}static get is(){return"vaadin-context-menu"}static get properties(){return{selector:{type:String},opened:{type:Boolean,value:!1,notify:!0,readOnly:!0},openOn:{type:String,value:"vaadin-contextmenu"},listenOn:{type:Object,value(){return this}},closeOn:{type:String,value:"click",observer:"_closeOnChanged"},renderer:{type:Function},_modeless:{type:Boolean},_context:Object,_phone:{type:Boolean},_touch:{type:Boolean,value:Bs},_wide:{type:Boolean},_wideMediaQuery:{type:String,value:"(min-device-width: 750px)"}}}static get observers(){return["_openedChanged(opened)","_targetOrOpenOnChanged(listenOn, openOn)","_rendererChanged(renderer, items)","_touchOrWideChanged(_touch, _wide)"]}constructor(){super(),this._boundOpen=this.open.bind(this),this._boundClose=this.close.bind(this),this._boundPreventDefault=this._preventDefault.bind(this),this._boundOnGlobalContextMenu=this._onGlobalContextMenu.bind(this)}connectedCallback(){super.connectedCallback(),this.__boundOnScroll=this.__onScroll.bind(this),window.addEventListener("scroll",this.__boundOnScroll,!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("scroll",this.__boundOnScroll,!0),this.close()}ready(){super.ready(),this._overlayElement=this.$.overlay,this.addController(new sn(this._wideMediaQuery,(t=>{this._wide=t}))),Fs(this)}_onOverlayOpened(t){this._setOpened(t.detail.value),this.__alignOverlayPosition()}_onVaadinOverlayOpen(){this.__alignOverlayPosition(),this.$.overlay.style.opacity="",this.__forwardFocus()}_targetOrOpenOnChanged(t,e){this._oldListenOn&&this._oldOpenOn&&(this._unlisten(this._oldListenOn,this._oldOpenOn,this._boundOpen),this._oldListenOn.style.webkitTouchCallout="",this._oldListenOn.style.webkitUserSelect="",this._oldListenOn.style.userSelect="",this._oldListenOn=null,this._oldOpenOn=null),t&&e&&(this._listen(t,e,this._boundOpen),this._oldListenOn=t,this._oldOpenOn=e)}_touchOrWideChanged(t,e){this._phone=!e&&t}_setListenOnUserSelect(t){this.listenOn.style.webkitTouchCallout=t,this.listenOn.style.webkitUserSelect=t,this.listenOn.style.userSelect=t,document.getSelection().removeAllRanges()}_closeOnChanged(t,e){const o="vaadin-overlay-outside-click",i=this.$.overlay;e&&this._unlisten(i,e,this._boundClose),t?(this._listen(i,t,this._boundClose),i.removeEventListener(o,this._boundPreventDefault)):i.addEventListener(o,this._boundPreventDefault)}_preventDefault(t){t.preventDefault()}_openedChanged(t){t?(document.documentElement.addEventListener("contextmenu",this._boundOnGlobalContextMenu,!0),this._setListenOnUserSelect("none")):(document.documentElement.removeEventListener("contextmenu",this._boundOnGlobalContextMenu,!0),this._setListenOnUserSelect("")),this.$.overlay.opened=t}requestContentUpdate(){this._overlayElement&&this.renderer&&this._overlayElement.requestContentUpdate()}_rendererChanged(t,e){if(e){if(t)throw new Error("The items API cannot be used together with a renderer");"click"===this.closeOn&&(this.closeOn=""),t=this.__itemsRenderer}this.$.overlay.setProperties({owner:this,renderer:t})}close(){this._setOpened(!1)}_contextTarget(t){if(this.selector){const e=this.listenOn.querySelectorAll(this.selector);return Array.prototype.filter.call(e,(e=>t.composedPath().indexOf(e)>-1))[0]}return t.target}open(t){t&&!this.opened&&(this._context={detail:t.detail,target:this._contextTarget(t)},this._context.target&&(t.preventDefault(),t.stopPropagation(),this.__x=this._getEventCoordinate(t,"x"),this.__pageXOffset=window.pageXOffset,this.__y=this._getEventCoordinate(t,"y"),this.__pageYOffset=window.pageYOffset,this.$.overlay.style.opacity="0",this._setOpened(!0)))}__onScroll(){if(!this.opened)return;const t=window.pageYOffset-this.__pageYOffset,e=window.pageXOffset-this.__pageXOffset;this.__adjustPosition("left",-e),this.__adjustPosition("right",e),this.__adjustPosition("top",-t),this.__adjustPosition("bottom",t),this.__pageYOffset+=t,this.__pageXOffset+=e}__adjustPosition(t,e){const o=this.$.overlay.style;o[t]=`${(parseInt(o[t])||0)+e}px`}__alignOverlayPosition(){const t=this.$.overlay;if(t.positionTarget)return;const e=t.style;["top","right","bottom","left"].forEach((t=>e.removeProperty(t))),["right-aligned","end-aligned","bottom-aligned"].forEach((e=>t.removeAttribute(e)));const{xMax:o,xMin:i,yMax:s}=t.getBoundaries(),n=this.__x,r=this.__y,a=document.documentElement.clientWidth,l=document.documentElement.clientHeight;this.__isRTL?n>a/2||n>i?e.right=`${Math.max(0,a-n)}px`:(e.left=`${n}px`,this._setEndAligned(t)):n<a/2||n<o?e.left=`${n}px`:(e.right=`${Math.max(0,a-n)}px`,this._setEndAligned(t)),r<l/2||r<s?e.top=`${r}px`:(e.bottom=`${Math.max(0,l-r)}px`,t.setAttribute("bottom-aligned",""))}_setEndAligned(t){t.setAttribute("end-aligned",""),this.__isRTL||t.setAttribute("right-aligned","")}_getEventCoordinate(t,e){if(!(t.detail instanceof Object)){const o=`client${e.toUpperCase()}`,i=t.changedTouches?t.changedTouches[0][o]:t[o];if(0===i){const o=t.target.getBoundingClientRect();return"x"===e?o.left:o.top+o.height}return i}return t.detail[e]?t.detail[e]:t.detail.sourceEvent?this._getEventCoordinate(t.detail.sourceEvent,e):void 0}_listen(t,e,o){Wi[e]?Xi(t,e,o):t.addEventListener(e,o)}_unlisten(t,e,o){Wi[e]?Zi(t,e,o):t.removeEventListener(e,o)}_onGlobalContextMenu(t){t.shiftKey||(t.preventDefault(),this.close())}}customElements.define(dn.is,dn);
/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class cn extends dn{static get is(){return"vaadin-menu-bar-submenu"}static get template(){return Uo`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>

      <slot id="slot"></slot>

      <vaadin-menu-bar-overlay
        id="overlay"
        on-opened-changed="_onOverlayOpened"
        on-vaadin-overlay-open="_onVaadinOverlayOpen"
        modeless="[[_modeless]]"
        with-backdrop="[[_phone]]"
        phone$="[[_phone]]"
        model="[[_context]]"
        theme$="[[_theme]]"
      ></vaadin-menu-bar-overlay>
    `}constructor(){super(),this.openOn="opensubmenu"}get _tagNamePrefix(){return"vaadin-menu-bar"}_openedChanged(t){this.$.overlay.opened=t}close(){super.close(),this.hasAttribute("is-root")&&this.getRootNode().host._close()}}customElements.define(cn.is,cn);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const hn=new ResizeObserver((t=>{setTimeout((()=>{t.forEach((t=>{t.target.resizables?t.target.resizables.forEach((e=>{e._onResize(t.contentRect)})):t.target._onResize(t.contentRect)}))}))})),un=Zt((t=>class extends t{get _observeParent(){return!1}connectedCallback(){if(super.connectedCallback(),hn.observe(this),this._observeParent){const t=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;t.resizables||(t.resizables=new Set,hn.observe(t)),t.resizables.add(this),this.__parent=t}}disconnectedCallback(){super.disconnectedCallback(),hn.unobserve(this);const t=this.__parent;if(this._observeParent&&t){const e=t.resizables;e&&(e.delete(this),0===e.size&&hn.unobserve(t)),this.__parent=null}}_onResize(t){}})),pn=t=>class extends(qs(un(fs(Vo(t))))){static get properties(){return{openOnHover:{type:Boolean},_hasOverflow:{type:Boolean,value:!1},_overflow:{type:Object},_container:{type:Object}}}static get observers(){return["_itemsChanged(items, items.splices)","__hasOverflowChanged(_hasOverflow, _overflow)","__i18nChanged(i18n, _overflow)","_menuItemsChanged(items, _overflow, _container, items.splices)"]}constructor(){super(),this.__boundOnContextMenuKeydown=this.__onContextMenuKeydown.bind(this)}get focused(){return(this._getItems()||[]).find(ms)||this._expandedButton}get _vertical(){return!1}get _observeParent(){return!0}get _buttons(){return Array.from(this.querySelectorAll("vaadin-menu-bar-button"))}get _subMenu(){return this.shadowRoot.querySelector("vaadin-menu-bar-submenu")}ready(){super.ready(),this.setAttribute("role","menubar"),this._overflowController=new Ci(this,"overflow","vaadin-menu-bar-button",{initializer:t=>{t.setAttribute("hidden","");const e=document.createElement("div");e.setAttribute("aria-hidden","true"),e.innerHTML="&centerdot;".repeat(3),t.appendChild(e),this._overflow=t,this._initButtonAttrs(t)}}),this.addController(this._overflowController),this.addEventListener("mousedown",(()=>this._hideTooltip())),this.addEventListener("mouseleave",(()=>this._hideTooltip())),this._subMenu.addEventListener("item-selected",this.__onItemSelected.bind(this)),this._subMenu.addEventListener("close-all-menus",this.__onEscapeClose.bind(this));this._subMenu.$.overlay.addEventListener("keydown",this.__boundOnContextMenuKeydown);const t=this.shadowRoot.querySelector('[part="container"]');t.addEventListener("click",this.__onButtonClick.bind(this)),t.addEventListener("mouseover",(t=>this._onMouseOver(t))),this._container=t}_getItems(){return this._buttons}disconnectedCallback(){super.disconnectedCallback(),this._hideTooltip(!0)}_onResize(){this.__detectOverflow()}__hasOverflowChanged(t,e){e&&e.toggleAttribute("hidden",!t)}_menuItemsChanged(t,e,o){e&&o&&t!==this._oldItems&&(this._oldItems=t,this.__renderButtons(t))}__i18nChanged(t,e){e&&t&&void 0!==t.moreOptions&&(t.moreOptions?e.setAttribute("aria-label",t.moreOptions):e.removeAttribute("aria-label"))}__getOverflowCount(t){return t.item&&t.item.children&&t.item.children.length||0}__restoreButtons(t){t.forEach((t=>{t.disabled=t.item&&t.item.disabled||this.disabled,t.style.visibility="",t.style.position="";const e=t.item&&t.item.component;e instanceof HTMLElement&&"menuitem"===e.getAttribute("role")&&this.__restoreItem(t,e)})),this.__updateOverflow([])}__restoreItem(t,e){t.appendChild(e),e.removeAttribute("role"),e.removeAttribute("aria-expanded"),e.removeAttribute("aria-haspopup"),e.removeAttribute("tabindex")}__updateOverflow(t){this._overflow.item={children:t},this._hasOverflow=t.length>0}__setOverflowItems(t,e){const o=this._container;if(o.offsetWidth<o.scrollWidth){this._hasOverflow=!0;const i=this.__isRTL;let s;for(s=t.length;s>0;s--){const n=t[s-1],r=getComputedStyle(n);if(!i&&n.offsetLeft+n.offsetWidth<o.offsetWidth-e.offsetWidth||i&&n.offsetLeft>=e.offsetWidth)break;n.disabled=!0,n.style.visibility="hidden",n.style.position="absolute",n.style.width=r.width}const n=t.filter(((t,e)=>e>=s)).map((t=>t.item));this.__updateOverflow(n)}}__detectOverflow(){const t=this._overflow,e=this._buttons.filter((e=>e!==t)),o=this.__getOverflowCount(t);this.__restoreButtons(e),this.__setOverflowItems(e,t);const i=this.__getOverflowCount(t);o!==i&&this._subMenu.opened&&this._subMenu.close();const s=i===e.length||0===i&&1===e.length;this.toggleAttribute("has-single-button",s)}_removeButtons(){this._buttons.forEach((t=>{t!==this._overflow&&this.removeChild(t)}))}_initButton(t){const e=document.createElement("vaadin-menu-bar-button"),o={...t};if(e.item=o,t.component){const t=this.__getComponent(o);o.component=t,t.item=o,e.appendChild(t)}else t.text&&(e.textContent=t.text);return e}_initButtonAttrs(t){t.setAttribute("role","menuitem"),(t===this._overflow||t.item&&t.item.children)&&(t.setAttribute("aria-haspopup","true"),t.setAttribute("aria-expanded","false"))}_setButtonDisabled(t,e){t.disabled=e,t.setAttribute("tabindex",e?"-1":"0")}_setButtonTheme(t,e){let o=e;const i=t.item&&t.item.theme;null!=i&&(o=Array.isArray(i)?i.join(" "):i),o?t.setAttribute("theme",o):t.removeAttribute("theme")}__getComponent(t){const e=t.component;let o;const i=e instanceof HTMLElement;if(i&&"vaadin-menu-bar-item"===e.localName?o=e:(o=document.createElement("vaadin-menu-bar-item"),o.appendChild(i?e:document.createElement(e))),t.text){(o.firstChild||o).textContent=t.text}return o}__renderButtons(t=[]){this._removeButtons(),0!==t.length&&(t.forEach((t=>{const e=this._initButton(t);this.insertBefore(e,this._overflow),this._setButtonDisabled(e,t.disabled),this._initButtonAttrs(e),this._setButtonTheme(e,this._theme)})),this.__detectOverflow())}_showTooltip(t,e){const o=this._tooltipController.node;o&&o.isConnected&&(void 0===o.generator&&(o.generator=({item:t})=>t&&t.tooltip),this._subMenu.opened||(this._tooltipController.setTarget(t),this._tooltipController.setContext({item:t.item}),o._stateController.open({hover:e,focus:!e})))}_hideTooltip(t){const e=this._tooltipController&&this._tooltipController.node;e&&e._stateController.close(t)}_setExpanded(t,e){t.toggleAttribute("expanded",e),t.toggleAttribute("active",e),t.setAttribute("aria-expanded",e?"true":"false")}_setTabindex(t,e){t.setAttribute("tabindex",e?"0":"-1")}_focusItem(t,e){const o=e&&this.focused===this._expandedButton;o&&this._close(),super._focusItem(t,e),this._buttons.forEach((e=>{this._setTabindex(e,e===t)})),o&&t.item&&t.item.children?this.__openSubMenu(t,!0,{keepFocus:!0}):t===this._overflow?this._hideTooltip():this._showTooltip(t)}_getButtonFromEvent(t){return Array.from(t.composedPath()).find((t=>"vaadin-menu-bar-button"===t.localName))}_setFocused(t){if(t){const t=this.querySelector('[tabindex="0"]');t&&this._buttons.forEach((e=>{this._setTabindex(e,e===t),e===t&&e!==this._overflow&&ds()&&this._showTooltip(e)}))}else this._hideTooltip()}_onArrowDown(t){t.preventDefault();const e=this._getButtonFromEvent(t);e===this._expandedButton?this._focusFirstItem():this.__openSubMenu(e,!0)}_onArrowUp(t){t.preventDefault();const e=this._getButtonFromEvent(t);e===this._expandedButton?this._focusLastItem():this.__openSubMenu(e,!0,{focusLast:!0})}_onEscape(t){t.composedPath().includes(this._expandedButton)&&this._close(!0),this._hideTooltip(!0)}_onKeyDown(t){switch(t.key){case"ArrowDown":this._onArrowDown(t);break;case"ArrowUp":this._onArrowUp(t);break;default:super._onKeyDown(t)}}_itemsChanged(){const t=this._subMenu;t&&t.opened&&t.close()}_onMouseOver(t){const e=this._getButtonFromEvent(t);if(e){if(e!==this._expandedButton){const t=this._subMenu.opened;e.item.children&&(this.openOnHover||t)?this.__openSubMenu(e,!1):t&&this._close(),e===this._overflow||this.openOnHover&&e.item.children?this._hideTooltip():this._showTooltip(e,!0)}}else this._hideTooltip()}__onContextMenuKeydown(t){const e=Array.from(t.composedPath()).find((t=>t._item));if(e){const o=e.parentNode;38===t.keyCode&&e===o.items[0]&&this._close(!0),(37===t.keyCode||39===t.keyCode&&!e._item.children)&&(t.stopImmediatePropagation(),this._onKeyDown(t))}}__fireItemSelected(t){this.dispatchEvent(new CustomEvent("item-selected",{detail:{value:t}}))}__onButtonClick(t){t.stopPropagation();const e=this._getButtonFromEvent(t);e&&this.__openSubMenu(e,!1)}__openSubMenu(t,e,o={}){const i=this._subMenu,s=t.item;if(i.opened&&(this._close(),i.listenOn===t))return;const n=s&&s.children;if(!n||0===n.length)return void this.__fireItemSelected(s);i.items=n,i.listenOn=t;const r=i.$.overlay;r.positionTarget=t,r.noVerticalOverlap=!0,this._expandedButton=t,requestAnimationFrame((()=>{t.dispatchEvent(new CustomEvent("opensubmenu",{detail:{children:n}})),this._hideTooltip(!0),this._setExpanded(t,!0)})),this.style.pointerEvents="auto",r.addEventListener("vaadin-overlay-open",(()=>{o.focusLast&&this._focusLastItem(),o.keepFocus&&this._focusItem(this._expandedButton,!1),e||r.$.overlay.focus(),r._updatePosition()}),{once:!0})}_focusFirstItem(){this._subMenu.$.overlay.firstElementChild.focus()}_focusLastItem(){const t=this._subMenu.$.overlay.firstElementChild,e=t.items[t.items.length-1];e&&e.focus()}__onItemSelected(t){t.stopPropagation(),this._close(),this.__fireItemSelected(t.detail.value)}__onEscapeClose(){this.__deactivateButton(!0)}__deactivateButton(t){const e=this._expandedButton;e&&e.hasAttribute("expanded")&&(this._setExpanded(e,!1),t&&this._focusItem(e,!1),this._expandedButton=null)}_close(t){this.style.pointerEvents="",this.__deactivateButton(t),this._subMenu.opened&&this._subMenu.close()}}
/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class mn extends(pn(Oi(pi(yt(jo))))){static get template(){return Uo`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='container'] {
          position: relative;
          display: flex;
          width: 100%;
          flex-wrap: nowrap;
          overflow: hidden;
        }
      </style>

      <div part="container">
        <slot></slot>
        <slot name="overflow"></slot>
      </div>
      <vaadin-menu-bar-submenu is-root overlay-class="[[overlayClass]]"></vaadin-menu-bar-submenu>

      <slot name="tooltip"></slot>
    `}static get is(){return"vaadin-menu-bar"}static get properties(){return{items:{type:Array,value:()=>[]},i18n:{type:Object,value:()=>({moreOptions:"More options"})},overlayClass:{type:String}}}static get observers(){return["_themeChanged(_theme, _overflow, _container)"]}ready(){super.ready(),this._tooltipController=new Ei(this),this._tooltipController.setManual(!0),this.addController(this._tooltipController)}_disabledChanged(t,e){super._disabledChanged(t,e),e!==t&&this.__updateButtonsDisabled(t)}_themeChanged(t,e,o){e&&o&&(this._buttons.forEach((e=>this._setButtonTheme(e,t))),this.__detectOverflow()),t?this._subMenu.setAttribute("theme",t):this._subMenu.removeAttribute("theme")}__updateButtonsDisabled(t){this._buttons.forEach((e=>{e.disabled=t||e.item&&e.item.disabled}))}}customElements.define(mn.is,mn);class _n extends i{constructor(){super(...arguments),this.items=[{text:"View",href:"https://google.com"},{text:"Edit"},{text:"Share",children:[{text:"On social media",children:[{text:"Facebook"},{text:"Twitter"},{text:"Instagram"}]},{text:"By email"},{text:"Get link"}]},{text:"Move",children:[{text:"To folder"},{text:"To trash"}]},{text:"Duplicate"}],this.counter=5}itemSelected(t){t.detail.value.href&&(window.location=t.detail.value.href)}render(){return s`
      <vaadin-menu-bar .items="${this.items}" @item-selected="${this.itemSelected}"></vaadin-menu-bar>
    `}}_n.styles=t`
    :host {
      display: block;
      padding: 25px;
      color: var(--site-components-text-color, #000);
    }
  `,e([o({type:Object})],_n.prototype,"items",void 0),e([o({type:Number})],_n.prototype,"counter",void 0),window.customElements.define("site-menu-bar",_n);
