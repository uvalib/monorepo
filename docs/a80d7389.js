var e=function(t,i){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])},e(t,i)};function t(t,i){if("function"!=typeof i&&null!==i)throw new TypeError("Class extends value "+String(i)+" is not a constructor or null");function o(){this.constructor=t}e(t,i),t.prototype=null===i?Object.create(i):(o.prototype=i.prototype,new o)}var i=function(){return i=Object.assign||function(e){for(var t,i=1,o=arguments.length;i<o;i++)for(var r in t=arguments[i])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},i.apply(this,arguments)};function o(e,t,i,o){var r,n=arguments.length,s=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(n<3?r(s):n>3?r(t,i,s):r(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s}function r(e){var t="function"==typeof Symbol&&Symbol.iterator,i=t&&e[t],o=0;if(i)return i.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&o>=e.length&&(e=void 0),{value:e&&e[o++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function n(e,t,i,o){if("a"===i&&!o)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!o:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===i?o:"a"===i?o.call(e):o?o.value:t.get(e)}function s(e,t,i,o,r){if("m"===o)throw new TypeError("Private method is not writable");if("a"===o&&!r)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!r:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===o?r.call(e,i):r?r.value=i:t.set(e,i),i
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}const a=window,l=a.ShadowRoot&&(void 0===a.ShadyCSS||a.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,d=Symbol(),c=new WeakMap;let h=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==d)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(l&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=c.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&c.set(t,e))}return e}toString(){return this.cssText}};const u=(e,...t)=>{const i=1===e.length?e[0]:t.reduce(((t,i,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1]),e[0]);return new h(i,e,d)},p=l?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new h("string"==typeof e?e:e+"",void 0,d))(t)})(e):e
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var m;const f=window,g=f.trustedTypes,v=g?g.emptyScript:"",b=f.reactiveElementPolyfillSupport,y={toAttribute(e,t){switch(t){case Boolean:e=e?v:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},x=(e,t)=>t!==e&&(t==t||e==e),w={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:x};let k=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(e){var t;this.finalize(),(null!==(t=this.h)&&void 0!==t?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach(((t,i)=>{const o=this._$Ep(i,t);void 0!==o&&(this._$Ev.set(o,i),e.push(o))})),e}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const i="symbol"==typeof e?Symbol():"__"+e,o=this.getPropertyDescriptor(e,i,t);void 0!==o&&Object.defineProperty(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(o){const r=this[e];this[t]=o,this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||w}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),void 0!==e.h&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const e=this.properties,t=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const i of t)this.createProperty(i,e[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(p(e))}else void 0!==e&&t.push(p(e));return t}static _$Ep(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}u(){var e;this._$E_=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(e=this.constructor.h)||void 0===e||e.forEach((e=>e(this)))}addController(e){var t,i;(null!==(t=this._$ES)&&void 0!==t?t:this._$ES=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&(null===(i=e.hostConnected)||void 0===i||i.call(e))}removeController(e){var t;null===(t=this._$ES)||void 0===t||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])}))}createRenderRoot(){var e;const t=null!==(e=this.shadowRoot)&&void 0!==e?e:this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{l?e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):t.forEach((t=>{const i=document.createElement("style"),o=a.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=t.cssText,e.appendChild(i)}))})(t,this.constructor.elementStyles),t}connectedCallback(){var e;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostConnected)||void 0===t?void 0:t.call(e)}))}enableUpdating(e){}disconnectedCallback(){var e;null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostDisconnected)||void 0===t?void 0:t.call(e)}))}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$EO(e,t,i=w){var o;const r=this.constructor._$Ep(e,i);if(void 0!==r&&!0===i.reflect){const n=(void 0!==(null===(o=i.converter)||void 0===o?void 0:o.toAttribute)?i.converter:y).toAttribute(t,i.type);this._$El=e,null==n?this.removeAttribute(r):this.setAttribute(r,n),this._$El=null}}_$AK(e,t){var i;const o=this.constructor,r=o._$Ev.get(e);if(void 0!==r&&this._$El!==r){const e=o.getPropertyOptions(r),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==(null===(i=e.converter)||void 0===i?void 0:i.fromAttribute)?e.converter:y;this._$El=r,this[r]=n.fromAttribute(t,e.type),this._$El=null}}requestUpdate(e,t,i){let o=!0;void 0!==e&&(((i=i||this.constructor.getPropertyOptions(e)).hasChanged||x)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),!0===i.reflect&&this._$El!==e&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(e,i))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((e,t)=>this[t]=e)),this._$Ei=void 0);let t=!1;const i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostUpdate)||void 0===t?void 0:t.call(e)})),this.update(i)):this._$Ek()}catch(e){throw t=!1,this._$Ek(),e}t&&this._$AE(i)}willUpdate(e){}_$AE(e){var t;null===(t=this._$ES)||void 0===t||t.forEach((e=>{var t;return null===(t=e.hostUpdated)||void 0===t?void 0:t.call(e)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){void 0!==this._$EC&&(this._$EC.forEach(((e,t)=>this._$EO(t,this[t],e))),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var C;k.finalized=!0,k.elementProperties=new Map,k.elementStyles=[],k.shadowRootOptions={mode:"open"},null==b||b({ReactiveElement:k}),(null!==(m=f.reactiveElementVersions)&&void 0!==m?m:f.reactiveElementVersions=[]).push("1.4.2");const $=window,_=$.trustedTypes,S=_?_.createPolicy("lit-html",{createHTML:e=>e}):void 0,T=`lit$${(Math.random()+"").slice(9)}$`,E="?"+T,A=`<${E}>`,I=document,O=(e="")=>I.createComment(e),L=e=>null===e||"object"!=typeof e&&"function"!=typeof e,F=Array.isArray,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,D=/>/g,z=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),P=/'/g,N=/"/g,H=/^(?:script|style|textarea|title)$/i,B=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),V=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),U=new WeakMap,W=I.createTreeWalker(I,129,null,!1),q=(e,t)=>{const i=e.length-1,o=[];let r,n=2===t?"<svg>":"",s=M;for(let t=0;t<i;t++){const i=e[t];let a,l,d=-1,c=0;for(;c<i.length&&(s.lastIndex=c,l=s.exec(i),null!==l);)c=s.lastIndex,s===M?"!--"===l[1]?s=R:void 0!==l[1]?s=D:void 0!==l[2]?(H.test(l[2])&&(r=RegExp("</"+l[2],"g")),s=z):void 0!==l[3]&&(s=z):s===z?">"===l[0]?(s=null!=r?r:M,d=-1):void 0===l[1]?d=-2:(d=s.lastIndex-l[2].length,a=l[1],s=void 0===l[3]?z:'"'===l[3]?N:P):s===N||s===P?s=z:s===R||s===D?s=M:(s=z,r=void 0);const h=s===z&&e[t+1].startsWith("/>")?" ":"";n+=s===M?i+A:d>=0?(o.push(a),i.slice(0,d)+"$lit$"+i.slice(d)+T+h):i+T+(-2===d?(o.push(void 0),t):h)}const a=n+(e[i]||"<?>")+(2===t?"</svg>":"");if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==S?S.createHTML(a):a,o]};class G{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let r=0,n=0;const s=e.length-1,a=this.parts,[l,d]=q(e,t);if(this.el=G.createElement(l,i),W.currentNode=this.el.content,2===t){const e=this.el.content,t=e.firstChild;t.remove(),e.append(...t.childNodes)}for(;null!==(o=W.nextNode())&&a.length<s;){if(1===o.nodeType){if(o.hasAttributes()){const e=[];for(const t of o.getAttributeNames())if(t.endsWith("$lit$")||t.startsWith(T)){const i=d[n++];if(e.push(t),void 0!==i){const e=o.getAttribute(i.toLowerCase()+"$lit$").split(T),t=/([.?@])?(.*)/.exec(i);a.push({type:1,index:r,name:t[2],strings:e,ctor:"."===t[1]?Q:"?"===t[1]?ee:"@"===t[1]?te:Y})}else a.push({type:6,index:r})}for(const t of e)o.removeAttribute(t)}if(H.test(o.tagName)){const e=o.textContent.split(T),t=e.length-1;if(t>0){o.textContent=_?_.emptyScript:"";for(let i=0;i<t;i++)o.append(e[i],O()),W.nextNode(),a.push({type:2,index:++r});o.append(e[t],O())}}}else if(8===o.nodeType)if(o.data===E)a.push({type:2,index:r});else{let e=-1;for(;-1!==(e=o.data.indexOf(T,e+1));)a.push({type:7,index:r}),e+=T.length-1}r++}}static createElement(e,t){const i=I.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,o){var r,n,s,a;if(t===V)return t;let l=void 0!==o?null===(r=i._$Co)||void 0===r?void 0:r[o]:i._$Cl;const d=L(t)?void 0:t._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===d?l=void 0:(l=new d(e),l._$AT(e,i,o)),void 0!==o?(null!==(s=(a=i)._$Co)&&void 0!==s?s:a._$Co=[])[o]=l:i._$Cl=l),void 0!==l&&(t=X(e,l._$AS(e,t.values),l,o)),t}class K{constructor(e,t){this.u=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(e){var t;const{el:{content:i},parts:o}=this._$AD,r=(null!==(t=null==e?void 0:e.creationScope)&&void 0!==t?t:I).importNode(i,!0);W.currentNode=r;let n=W.nextNode(),s=0,a=0,l=o[0];for(;void 0!==l;){if(s===l.index){let t;2===l.type?t=new Z(n,n.nextSibling,this,e):1===l.type?t=new l.ctor(n,l.name,l.strings,this,e):6===l.type&&(t=new ie(n,this,e)),this.u.push(t),l=o[++a]}s!==(null==l?void 0:l.index)&&(n=W.nextNode(),s++)}return r}p(e){let t=0;for(const i of this.u)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Z{constructor(e,t,i,o){var r;this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cm=null===(r=null==o?void 0:o.isConnected)||void 0===r||r}get _$AU(){var e,t;return null!==(t=null===(e=this._$AM)||void 0===e?void 0:e._$AU)&&void 0!==t?t:this._$Cm}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),L(e)?e===j||null==e||""===e?(this._$AH!==j&&this._$AR(),this._$AH=j):e!==this._$AH&&e!==V&&this.g(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>F(e)||"function"==typeof(null==e?void 0:e[Symbol.iterator]))(e)?this.k(e):this.g(e)}O(e,t=this._$AB){return this._$AA.parentNode.insertBefore(e,t)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}g(e){this._$AH!==j&&L(this._$AH)?this._$AA.nextSibling.data=e:this.T(I.createTextNode(e)),this._$AH=e}$(e){var t;const{values:i,_$litType$:o}=e,r="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=G.createElement(o.h,this.options)),o);if((null===(t=this._$AH)||void 0===t?void 0:t._$AD)===r)this._$AH.p(i);else{const e=new K(r,this),t=e.v(this.options);e.p(i),this.T(t),this._$AH=e}}_$AC(e){let t=U.get(e.strings);return void 0===t&&U.set(e.strings,t=new G(e)),t}k(e){F(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,o=0;for(const r of e)o===t.length?t.push(i=new Z(this.O(O()),this.O(O()),this,this.options)):i=t[o],i._$AI(r),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){var t;void 0===this._$AM&&(this._$Cm=e,null===(t=this._$AP)||void 0===t||t.call(this,e))}}class Y{constructor(e,t,i,o,r){this.type=1,this._$AH=j,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,i,o){const r=this.strings;let n=!1;if(void 0===r)e=X(this,e,t,0),n=!L(e)||e!==this._$AH&&e!==V,n&&(this._$AH=e);else{const o=e;let s,a;for(e=r[0],s=0;s<r.length-1;s++)a=X(this,o[i+s],t,s),a===V&&(a=this._$AH[s]),n||(n=!L(a)||a!==this._$AH[s]),a===j?e=j:e!==j&&(e+=(null!=a?a:"")+r[s+1]),this._$AH[s]=a}n&&!o&&this.j(e)}j(e){e===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}}class Q extends Y{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===j?void 0:e}}const J=_?_.emptyScript:"";class ee extends Y{constructor(){super(...arguments),this.type=4}j(e){e&&e!==j?this.element.setAttribute(this.name,J):this.element.removeAttribute(this.name)}}class te extends Y{constructor(e,t,i,o,r){super(e,t,i,o,r),this.type=5}_$AI(e,t=this){var i;if((e=null!==(i=X(this,e,t,0))&&void 0!==i?i:j)===V)return;const o=this._$AH,r=e===j&&o!==j||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,n=e!==j&&(o===j||r);r&&this.element.removeEventListener(this.name,this,o),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(t=this.options)||void 0===t?void 0:t.host)&&void 0!==i?i:this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const oe=$.litHtmlPolyfillSupport;null==oe||oe(G,Z),(null!==(C=$.litHtmlVersions)&&void 0!==C?C:$.litHtmlVersions=[]).push("2.4.0");const re=(e,t,i)=>{var o,r;const n=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:t;let s=n._$litPart$;if(void 0===s){const e=null!==(r=null==i?void 0:i.renderBefore)&&void 0!==r?r:null;n._$litPart$=s=new Z(t.insertBefore(O(),e),e,void 0,null!=i?i:{})}return s._$AI(e),s};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ne,se;let ae=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;const i=super.createRenderRoot();return null!==(e=(t=this.renderOptions).renderBefore)&&void 0!==e||(t.renderBefore=i.firstChild),i}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=re(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!1)}render(){return V}};ae.finalized=!0,ae._$litElement$=!0,null===(ne=globalThis.litElementHydrateSupport)||void 0===ne||ne.call(globalThis,{LitElement:ae});const le=globalThis.litElementPolyfillSupport;null==le||le({LitElement:ae}),(null!==(se=globalThis.litElementVersions)&&void 0!==se?se:globalThis.litElementVersions=[]).push("3.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de=e=>t=>"function"==typeof t?((e,t)=>(customElements.define(e,t),t))(e,t):((e,t)=>{const{kind:i,elements:o}=t;return{kind:i,elements:o,finisher(t){customElements.define(e,t)}}})(e,t)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,ce=(e,t)=>"method"===t.kind&&t.descriptor&&!("value"in t.descriptor)?{...t,finisher(i){i.createProperty(t.key,e)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){"function"==typeof t.initializer&&(this[t.key]=t.initializer.call(this))},finisher(i){i.createProperty(t.key,e)}};function he(e){return(t,i)=>void 0!==i?((e,t,i)=>{t.constructor.createProperty(i,e)})(e,t,i):ce(e,t)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ue(e){return he({...e,state:!0})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pe=({finisher:e,descriptor:t})=>(i,o)=>{var r;if(void 0===o){const o=null!==(r=i.originalKey)&&void 0!==r?r:i.key,n=null!=t?{kind:"method",placement:"prototype",key:o,descriptor:t(i.key)}:{...i,key:o};return null!=e&&(n.finisher=function(t){e(t,o)}),n}{const r=i.constructor;void 0!==t&&Object.defineProperty(i,o,t(o)),null==e||e(r,o)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;function me(e){return pe({finisher:(t,i)=>{Object.assign(t.prototype[i],e)}})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function fe(e,t){return pe({descriptor:i=>{const o={get(){var t,i;return null!==(i=null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(e))&&void 0!==i?i:null},enumerable:!0,configurable:!0};if(t){const t="symbol"==typeof i?Symbol():"__"+i;o.get=function(){var i,o;return void 0===this[t]&&(this[t]=null!==(o=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(e))&&void 0!==o?o:null),this[t]}}return o}})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ge(e){return pe({descriptor:t=>({async get(){var t;return await this.updateComplete,null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(e)},enumerable:!0,configurable:!0})})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ve;const be=null!=(null===(ve=window.HTMLSlotElement)||void 0===ve?void 0:ve.prototype.assignedElements)?(e,t)=>e.assignedElements(t):(e,t)=>e.assignedNodes(t).filter((e=>e.nodeType===Node.ELEMENT_NODE));
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ye(e,t,i){let o,r=e;return"object"==typeof e?(r=e.slot,o=e):o={flatten:t},i?function(e){const{slot:t,selector:i}=null!=e?e:{};return pe({descriptor:o=>({get(){var o;const r="slot"+(t?`[name=${t}]`:":not([name])"),n=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(r),s=null!=n?be(n,e):[];return i?s.filter((e=>e.matches(i))):s},enumerable:!0,configurable:!0})})}({slot:r,flatten:t,selector:i}):pe({descriptor:e=>({get(){var e,t;const i="slot"+(r?`[name=${r}]`:":not([name])"),n=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(i);return null!==(t=null==n?void 0:n.assignedNodes(o))&&void 0!==t?t:[]},enumerable:!0,configurable:!0})})
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}const xe=1,we=2,ke=3,Ce=4,$e=e=>(...t)=>({_$litDirective$:e,values:t});let _e=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},Se=class extends _e{constructor(e){if(super(e),this.it=j,e.type!==we)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===j||null==e)return this._t=void 0,this.it=e;if(e===V)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Se.directiveName="unsafeHTML",Se.resultType=1;const Te=$e(Se);class Ee extends ae{render(){return B` <div id="pre_header" class="w3-col w3-clear w3-theme-l5"> <div id="pre_header-inner" class="w3-row pre_header-inner w3-width-1360"> <section class="views-element-container alert-sitewide-lvl4 w3-block w3-block-wrapper block-views block-views-blockalert4-published-sitewide-block-1" id="block-uvalibrary-v2a-views-block-alert4-published-sitewide-block-1"> <div> <div class="uva-alert--sitewide view view-alert4-published-sitewide view-id-alert4_published_sitewide view-display-id-block_1 js-view-dom-id-96ab9ea9272ee605d9b31310c4122d2c05e78303f30d7fdcdf9e122499f8369f"> </div> </div> </section> </div> </div> `}}Ee.styles=u`:host{display:block;padding:25px;color:var(--site-alert-text-color,#000)}`,window.customElements.define("site-alert",Ee);const Ae=u`:host{--uva-brand-blue-lightest:#87B9D9;--uva-brand-blue-lighter:#3395D4;--uva-brand-blue-light:#0370B7;--uva-brand-blue-base:#232D4B;--uva-brand-blue-300:var(--uva-brand-blue-lightest);--uva-brand-blue-200:var(--uva-brand-blue-lighter);--uva-brand-blue-100:var(--uva-brand-blue-light);--uva-brand-blue:var(--uva-brand-blue-base);--uva-brand-orange-lightest:#FFEAD6;--uva-brand-orange-lighter:#FFC999;--uva-brand-orange-light:#FFB370;--uva-brand-orange-base:#E57200;--uva-brand-orange-dark:#B35900;--uva-brand-orange-darker:#854200;--uva-brand-orange-300:var(--uva-brand-orange-lightest);--uva-brand-orange-200:var(--uva-brand-orange-lighter);--uva-brand-orange-100:var(--uva-brand-orange-light);--uva-brand-orange:var(--uva-brand-orange-base);--uva-brand-orange-A:var(--uva-brand-orange-dark);--uva-brand-orange-B:var(--uva-brand-orange-darker);--uva-blue-alt-lightest:#BFE7F7;--uva-blue-alt-lighter:#91D8F2;--uva-blue-alt-light:#55C4EC;--uva-blue-alt-base:#007BAC;--uva-blue-alt-dark:#005679;--uva-blue-alt-darkest:#141E3C;--uva-blue-alt-400:#E6F2F7;--uva-blue-alt-300:var(--uva-blue-alt-lightest);--uva-blue-alt-200:var(--uva-blue-alt-lighter);--uva-blue-alt-100:var(--uva-blue-alt-light);--uva-blue-alt:var(--uva-blue-alt-base);--uva-blue-alt-A:var(--uva-blue-alt-dark);--uva-blue-alt-B:var(--uva-blue-alt-darkest);--uva-teal-lightest:#C8F2F4;--uva-teal-light:#5BD7DE;--uva-teal-base:#25CAD3;--uva-teal-dark:#1DA1A8;--uva-teal-darker:#16777C;--uva-teal-200:var(--uva-teal-lightest);--uva-teal-100:var(--uva-teal-light);--uva-teal:var(--uva-teal-base);--uva-teal-A:var(--uva-teal-dark);--uva-teal-B:var(--uva-teal-darker);--uva-green-lightest:#DDEFDC;--uva-green-lighter:#89CC74;--uva-green-base:#62BB46;--uva-green-dark:#4E9737;--uva-green-200:var(--uva-green-lightest);--uva-green-100:var(--uva-green-lighter);--uva-green:var(--uva-green-base);--uva-green-A:var(--uva-green-dark);--uva-red-lightest:#FBCFDA;--uva-red-base:#EF3F6B;--uva-red-dark:#DF1E43;--uva-red-darker:#B30000;--uva-red-100:var(--uva-red-lightest);--uva-red:var(--uva-red-base);--uva-red-A:var(--uva-red-dark);--uva-red-B:var(--uva-red-darker);--uva-yellow-lightest:#FEF6C8;--uva-yellow-base:#ECC602;--uva-yellow-dark:#B99C02;--uva-yellow-100:var(--uva-yellow-lightest);--uva-yellow:var(--uva-yellow-base);--uva-yellow-A:var(--uva-yellow-dark);--uva-grey-lightest:#F1F1F1;--uva-grey-light:#DADADA;--uva-grey-base:#808080;--uva-grey-dark:#4F4F4F;--uva-grey-darkest:#2B2B2B;--uva-grey-200:var(--uva-grey-lightest);--uva-grey-100:var(--uva-grey-light);--uva-grey:var(--uva-grey-base);--uva-grey-A:var(--uva-grey-dark);--uva-grey-B:var(--uva-grey-darkest);--uva-text-color-base:var(--uva-grey-A);--uva-text-color-dark:var(--uva-grey-B);--uva-white:#fff}`,Ie=u`:host{--box-shadow:0 3px 6px rgba(0, 0, 0, 0.16),0 3px 6px rgba(0, 0, 0, 0.23);--box-shadow-light:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.12);--box-shadow-mid:0 2px 4px rgba(0, 0, 0, 0.10),0 2px 4px rgba(0, 0, 0, 0.12)}`,Oe=u`.w3-col,.w3-half,.w3-quarter,.w3-third,.w3-threequarter,.w3-twothird{float:left;width:100%}.w3-bar:after,.w3-bar:before,.w3-cell-row:after,.w3-cell-row:before,.w3-clear:after,.w3-clear:before,.w3-container:after,.w3-container:before,.w3-panel:after,.w3-panel:before,.w3-row-padding:after,.w3-row-padding:before,.w3-row:after,.w3-row:before{content:"";display:table;clear:both}.w3-container,.w3-panel{padding:.01em 16px}.w3-width-1360{max-width:1360px!important}`,Le=u`*{font-family:franklin-gothic-urw,Arial,Helvetica,sans-serif!important}*,::after,::before{box-sizing:border-box}body,button,html,input,optgroup,select,textarea{color:#2b2b2b}body,html{font-size:17px!important}body{min-height:100vh;text-rendering:optimizeSpeed;line-height:1.5}button,input,select,textarea{font:inherit}`;var Fe;class Me extends ae{constructor(){super(...arguments),this.noShadowDom=!1,this.noStyle=!1,this.imports={},this.importedStyles="",Fe.set(this,null)}resizeReactive(){import("./08b62fc4.js").then((({ResizeController:e})=>{this._resizeController=new e(this,{})}))}static get styles(){return[Ae,Ie,Oe,Le]}firstUpdated(){this.imports&&!this.noStyle&&Object.keys(this.imports).forEach((e=>{if(this.imports[e]){const t=this.imports[e];import(t).then((t=>{this.importedStyles+=t.default.toString().replace(/:host/,e.toLowerCase())}))}}))}connectedCallback(){super.connectedCallback(),this.noShadowDom&&!this.noStyle&&(s(this,Fe,document.createElement("style"),"f"),this.appendChild(n(this,Fe,"f")),re(B`${Object.getPrototypeOf(this).constructor.styles.map((e=>e.toString().replace(/:host/m,this.tagName.toLowerCase())))}`,n(this,Fe,"f")))}createRenderRoot(){return this.noShadowDom?this:super.createRenderRoot()}render(){return B` ${this.noShadowDom?"":B`<slot></slot>`} `}}Fe=new WeakMap,o([he({type:Boolean,attribute:"no-shadow-dom"})],Me.prototype,"noShadowDom",void 0),o([he({type:Boolean,attribute:"no-style"})],Me.prototype,"noStyle",void 0),o([he({type:Object})],Me.prototype,"imports",void 0),o([he({type:String})],Me.prototype,"importedStyles",void 0);var Re=u`:host{display:block}*{font-family:franklin-gothic-urw,Arial,Helvetica,sans-serif!important}*,::after,::before{box-sizing:border-box}#header{background-color:#fff;background-color:#fff!important;padding:.5rem 0}#header .site-name-slogan{display:none}#header #block-uvalibrary-branding{margin-top:-40px}#header a.site-logo{text-decoration:none!important}#header a.site-logo img{max-width:225px}#header #header-inner{display:grid;grid-template-columns:225px 1fr}#header #header-inner .block-system-branding-block{grid-area:1/1/2/2;width:max-content}#header #header-inner .utility-nav{grid-area:1/2/2/3}.header-inner{float:none;max-width:1600px;margin:0 auto!important}.open-mobile-menu{display:none}#utility-nav ul:first-of-type{display:flex;list-style-type:none;gap:1.5rem}#utility-nav a{color:#232d4b!important}a:not([class]){text-decoration-skip-ink:auto}ul li a{text-decoration:underline!important}.visually-hidden{position:absolute!important;overflow:hidden;clip:rect(1px,1px,1px,1px);width:1px;height:1px;word-wrap:normal}#utility-nav{float:right}@media (max-width:992px){#header a.site-logo img{margin-left:1rem}#header #header-inner{display:initial;grid-template-columns:none}#header .header-inner{flex-direction:row;justify-content:space-between}}`;window.customElements.define("site-header",class extends Me{static get styles(){return[...super.styles,Re]}render(){return B` <site-alert></site-alert> <header id="header" class="w3-col w3-clear w3-theme-l4 none" role="banner" aria-label="Site header"> <div id="header-inner" class="w3-container header-inner w3-width-1360"> <button id="openmobilemenu" tabindex="0" class="open-mobile-menu" aria-label="open menu"> <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="bevel"> <line x1="3" y1="12" x2="21" y2="12"></line> <line x1="3" y1="6" x2="21" y2="6"></line> <line x1="3" y1="18" x2="21" y2="18"></line> </svg> </button> <nav role="navigation" aria-labelledby="block-uvalibrary-v2a-utilitynavmain-menu" id="block-uvalibrary-v2a-utilitynavmain" class="utility-nav"> <h2 class="visually-hidden" id="block-uvalibrary-v2a-utilitynavmain-menu">Utility Nav-main</h2> <div id="utility-nav"> <ul role="menu"> <li role="menuitem"> <a href="https://search.lib.virginia.edu/account" title="My account">My account</a> </li> <li role="menuitem"> <a href="/askalibrarian" title="Ask a Librarian" data-drupal-link-system-path="node/807">Ask a Librarian</a> </li> <li role="menuitem"> <a href="/hours" title="Hours" data-drupal-link-system-path="node/1118">Hours</a> </li> <li role="menuitem"> <a href="/support-library" title="Give" data-drupal-link-system-path="node/1676">Give</a> </li> <li role="menuitem"> <a href="/status#alerts" title="Alerts" data-drupal-link-system-path="node/1641">Alerts</a> </li> <li role="menuitem"> <a href="/search" title="Search" data-drupal-link-system-path="node/837">Search</a> </li> </ul> </div> </nav> <section id="block-uvalibrary-v2a-branding" class="w3-block w3-block-wrapper block-system block-system-branding-block"> <a href="/" title="Home" rel="home" class="site-logo"> <img src="https://library.virginia.edu/sites/default/files/2022-09/library_rgb.png" alt="Home"> </a> <div class="site-name-slogan"></div> </section> <section id="block-analyticstrackingcode" class="w3-block w3-block-wrapper block-block-content block-block-contente9ac28b3-1917-44d0-9461-cb23e685c626"> <div class="layout layout--onecol"> <div class="layout__region layout__region--content"> <section class="w3-block w3-block-wrapper block-layout-builder block-field-blockblock-contentbasicbody"> <div class="clearfix text-formatted field field--name-body field--type-text-with-summary field--label-hidden field__item"> <uvalib-analytics matomoId="10"> <noscript><p><img src="https://analytics.lib.virginia.edu/matomo.php?idsite=10&rec=1" style="border:0" alt=""></p></noscript> </uvalib-analytics> <script type="module" src="https://unpkg.internal.lib.virginia.edu/v0.0.12/uvalib-analytics.js"></script></div> </section> </div> </div> </section> </div> </header> `}});const De=function(){if("undefined"!=typeof globalThis)return globalThis;if("undefined"!=typeof global)return global;if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;try{return new Function("return this")()}catch(e){return{}}}();void 0===De.trustedTypes&&(De.trustedTypes={createPolicy:(e,t)=>t});const ze={configurable:!1,enumerable:!1,writable:!1};void 0===De.FAST&&Reflect.defineProperty(De,"FAST",Object.assign({value:Object.create(null)},ze));const Pe=De.FAST;if(void 0===Pe.getById){const e=Object.create(null);Reflect.defineProperty(Pe,"getById",Object.assign({value(t,i){let o=e[t];return void 0===o&&(o=i?e[t]=i():null),o}},ze))}const Ne=Object.freeze([]);function He(){const e=new WeakMap;return function(t){let i=e.get(t);if(void 0===i){let o=Reflect.getPrototypeOf(t);for(;void 0===i&&null!==o;)i=e.get(o),o=Reflect.getPrototypeOf(o);i=void 0===i?[]:i.slice(0),e.set(t,i)}return i}}const Be=De.FAST.getById(1,(()=>{const e=[],t=[];function i(){if(t.length)throw t.shift()}function o(e){try{e.call()}catch(e){t.push(e),setTimeout(i,0)}}function r(){let t=0;for(;t<e.length;)if(o(e[t]),t++,t>1024){for(let i=0,o=e.length-t;i<o;i++)e[i]=e[i+t];e.length-=t,t=0}e.length=0}return Object.freeze({enqueue:function(t){e.length<1&&De.requestAnimationFrame(r),e.push(t)},process:r})})),Ve=De.trustedTypes.createPolicy("fast-html",{createHTML:e=>e});let je=Ve;const Ue=`fast-${Math.random().toString(36).substring(2,8)}`,We=`${Ue}{`,qe=`}${Ue}`,Ge=Object.freeze({supportsAdoptedStyleSheets:Array.isArray(document.adoptedStyleSheets)&&"replace"in CSSStyleSheet.prototype,setHTMLPolicy(e){if(je!==Ve)throw new Error("The HTML policy can only be set once.");je=e},createHTML:e=>je.createHTML(e),isMarker:e=>e&&8===e.nodeType&&e.data.startsWith(Ue),extractDirectiveIndexFromMarker:e=>parseInt(e.data.replace(`${Ue}:`,"")),createInterpolationPlaceholder:e=>`${We}${e}${qe}`,createCustomAttributePlaceholder(e,t){return`${e}="${this.createInterpolationPlaceholder(t)}"`},createBlockPlaceholder:e=>`\x3c!--${Ue}:${e}--\x3e`,queueUpdate:Be.enqueue,processUpdates:Be.process,nextUpdate:()=>new Promise(Be.enqueue),setAttribute(e,t,i){null==i?e.removeAttribute(t):e.setAttribute(t,i)},setBooleanAttribute(e,t,i){i?e.setAttribute(t,""):e.removeAttribute(t)},removeChildNodes(e){for(let t=e.firstChild;null!==t;t=e.firstChild)e.removeChild(t)},createTemplateWalker:e=>document.createTreeWalker(e,133,null,!1)});class Xe{constructor(e,t){this.sub1=void 0,this.sub2=void 0,this.spillover=void 0,this.source=e,this.sub1=t}has(e){return void 0===this.spillover?this.sub1===e||this.sub2===e:-1!==this.spillover.indexOf(e)}subscribe(e){const t=this.spillover;if(void 0===t){if(this.has(e))return;if(void 0===this.sub1)return void(this.sub1=e);if(void 0===this.sub2)return void(this.sub2=e);this.spillover=[this.sub1,this.sub2,e],this.sub1=void 0,this.sub2=void 0}else{-1===t.indexOf(e)&&t.push(e)}}unsubscribe(e){const t=this.spillover;if(void 0===t)this.sub1===e?this.sub1=void 0:this.sub2===e&&(this.sub2=void 0);else{const i=t.indexOf(e);-1!==i&&t.splice(i,1)}}notify(e){const t=this.spillover,i=this.source;if(void 0===t){const t=this.sub1,o=this.sub2;void 0!==t&&t.handleChange(i,e),void 0!==o&&o.handleChange(i,e)}else for(let o=0,r=t.length;o<r;++o)t[o].handleChange(i,e)}}class Ke{constructor(e){this.subscribers={},this.sourceSubscribers=null,this.source=e}notify(e){var t;const i=this.subscribers[e];void 0!==i&&i.notify(e),null===(t=this.sourceSubscribers)||void 0===t||t.notify(e)}subscribe(e,t){var i;if(t){let i=this.subscribers[t];void 0===i&&(this.subscribers[t]=i=new Xe(this.source)),i.subscribe(e)}else this.sourceSubscribers=null!==(i=this.sourceSubscribers)&&void 0!==i?i:new Xe(this.source),this.sourceSubscribers.subscribe(e)}unsubscribe(e,t){var i;if(t){const i=this.subscribers[t];void 0!==i&&i.unsubscribe(e)}else null===(i=this.sourceSubscribers)||void 0===i||i.unsubscribe(e)}}const Ze=Pe.getById(2,(()=>{const e=/(:|&&|\|\||if)/,t=new WeakMap,i=Ge.queueUpdate;let o,r=e=>{throw new Error("Must call enableArrayObservation before observing arrays.")};function n(e){let i=e.$fastController||t.get(e);return void 0===i&&(Array.isArray(e)?i=r(e):t.set(e,i=new Ke(e))),i}const s=He();class a{constructor(e){this.name=e,this.field=`_${e}`,this.callback=`${e}Changed`}getValue(e){return void 0!==o&&o.watch(e,this.name),e[this.field]}setValue(e,t){const i=this.field,o=e[i];if(o!==t){e[i]=t;const r=e[this.callback];"function"==typeof r&&r.call(e,o,t),n(e).notify(this.name)}}}class l extends Xe{constructor(e,t,i=!1){super(e,t),this.binding=e,this.isVolatileBinding=i,this.needsRefresh=!0,this.needsQueue=!0,this.first=this,this.last=null,this.propertySource=void 0,this.propertyName=void 0,this.notifier=void 0,this.next=void 0}observe(e,t){this.needsRefresh&&null!==this.last&&this.disconnect();const i=o;o=this.needsRefresh?this:void 0,this.needsRefresh=this.isVolatileBinding;const r=this.binding(e,t);return o=i,r}disconnect(){if(null!==this.last){let e=this.first;for(;void 0!==e;)e.notifier.unsubscribe(this,e.propertyName),e=e.next;this.last=null,this.needsRefresh=this.needsQueue=!0}}watch(e,t){const i=this.last,r=n(e),s=null===i?this.first:{};if(s.propertySource=e,s.propertyName=t,s.notifier=r,r.subscribe(this,t),null!==i){if(!this.needsRefresh){let t;o=void 0,t=i.propertySource[i.propertyName],o=this,e===t&&(this.needsRefresh=!0)}i.next=s}this.last=s}handleChange(){this.needsQueue&&(this.needsQueue=!1,i(this))}call(){null!==this.last&&(this.needsQueue=!0,this.notify(this))}records(){let e=this.first;return{next:()=>{const t=e;return void 0===t?{value:void 0,done:!0}:(e=e.next,{value:t,done:!1})},[Symbol.iterator]:function(){return this}}}}return Object.freeze({setArrayObserverFactory(e){r=e},getNotifier:n,track(e,t){void 0!==o&&o.watch(e,t)},trackVolatile(){void 0!==o&&(o.needsRefresh=!0)},notify(e,t){n(e).notify(t)},defineProperty(e,t){"string"==typeof t&&(t=new a(t)),s(e).push(t),Reflect.defineProperty(e,t.name,{enumerable:!0,get:function(){return t.getValue(this)},set:function(e){t.setValue(this,e)}})},getAccessors:s,binding(e,t,i=this.isVolatileBinding(e)){return new l(e,t,i)},isVolatileBinding:t=>e.test(t.toString())})}));function Ye(e,t){Ze.defineProperty(e,t)}const Qe=Pe.getById(3,(()=>{let e=null;return{get:()=>e,set(t){e=t}}}));class Je{constructor(){this.index=0,this.length=0,this.parent=null,this.parentContext=null}get event(){return Qe.get()}get isEven(){return this.index%2==0}get isOdd(){return this.index%2!=0}get isFirst(){return 0===this.index}get isInMiddle(){return!this.isFirst&&!this.isLast}get isLast(){return this.index===this.length-1}static setEvent(e){Qe.set(e)}}Ze.defineProperty(Je.prototype,"index"),Ze.defineProperty(Je.prototype,"length");const et=Object.seal(new Je);class tt{constructor(){this.targetIndex=0}}class it extends tt{constructor(){super(...arguments),this.createPlaceholder=Ge.createInterpolationPlaceholder}}class ot extends tt{constructor(e,t,i){super(),this.name=e,this.behavior=t,this.options=i}createPlaceholder(e){return Ge.createCustomAttributePlaceholder(this.name,e)}createBehavior(e){return new this.behavior(e,this.options)}}function rt(e,t){this.source=e,this.context=t,null===this.bindingObserver&&(this.bindingObserver=Ze.binding(this.binding,this,this.isBindingVolatile)),this.updateTarget(this.bindingObserver.observe(e,t))}function nt(e,t){this.source=e,this.context=t,this.target.addEventListener(this.targetName,this)}function st(){this.bindingObserver.disconnect(),this.source=null,this.context=null}function at(){this.bindingObserver.disconnect(),this.source=null,this.context=null;const e=this.target.$fastView;void 0!==e&&e.isComposed&&(e.unbind(),e.needsBindOnly=!0)}function lt(){this.target.removeEventListener(this.targetName,this),this.source=null,this.context=null}function dt(e){Ge.setAttribute(this.target,this.targetName,e)}function ct(e){Ge.setBooleanAttribute(this.target,this.targetName,e)}function ht(e){if(null==e&&(e=""),e.create){this.target.textContent="";let t=this.target.$fastView;void 0===t?t=e.create():this.target.$fastTemplate!==e&&(t.isComposed&&(t.remove(),t.unbind()),t=e.create()),t.isComposed?t.needsBindOnly&&(t.needsBindOnly=!1,t.bind(this.source,this.context)):(t.isComposed=!0,t.bind(this.source,this.context),t.insertBefore(this.target),this.target.$fastView=t,this.target.$fastTemplate=e)}else{const t=this.target.$fastView;void 0!==t&&t.isComposed&&(t.isComposed=!1,t.remove(),t.needsBindOnly?t.needsBindOnly=!1:t.unbind()),this.target.textContent=e}}function ut(e){this.target[this.targetName]=e}function pt(e){const t=this.classVersions||Object.create(null),i=this.target;let o=this.version||0;if(null!=e&&e.length){const r=e.split(/\s+/);for(let e=0,n=r.length;e<n;++e){const n=r[e];""!==n&&(t[n]=o,i.classList.add(n))}}if(this.classVersions=t,this.version=o+1,0!==o){o-=1;for(const e in t)t[e]===o&&i.classList.remove(e)}}class mt extends it{constructor(e){super(),this.binding=e,this.bind=rt,this.unbind=st,this.updateTarget=dt,this.isBindingVolatile=Ze.isVolatileBinding(this.binding)}get targetName(){return this.originalTargetName}set targetName(e){if(this.originalTargetName=e,void 0!==e)switch(e[0]){case":":if(this.cleanedTargetName=e.substr(1),this.updateTarget=ut,"innerHTML"===this.cleanedTargetName){const e=this.binding;this.binding=(t,i)=>Ge.createHTML(e(t,i))}break;case"?":this.cleanedTargetName=e.substr(1),this.updateTarget=ct;break;case"@":this.cleanedTargetName=e.substr(1),this.bind=nt,this.unbind=lt;break;default:this.cleanedTargetName=e,"class"===e&&(this.updateTarget=pt)}}targetAtContent(){this.updateTarget=ht,this.unbind=at}createBehavior(e){return new ft(e,this.binding,this.isBindingVolatile,this.bind,this.unbind,this.updateTarget,this.cleanedTargetName)}}class ft{constructor(e,t,i,o,r,n,s){this.source=null,this.context=null,this.bindingObserver=null,this.target=e,this.binding=t,this.isBindingVolatile=i,this.bind=o,this.unbind=r,this.updateTarget=n,this.targetName=s}handleChange(){this.updateTarget(this.bindingObserver.observe(this.source,this.context))}handleEvent(e){Je.setEvent(e);const t=this.binding(this.source,this.context);Je.setEvent(null),!0!==t&&e.preventDefault()}}let gt=null;class vt{addFactory(e){e.targetIndex=this.targetIndex,this.behaviorFactories.push(e)}captureContentBinding(e){e.targetAtContent(),this.addFactory(e)}reset(){this.behaviorFactories=[],this.targetIndex=-1}release(){gt=this}static borrow(e){const t=gt||new vt;return t.directives=e,t.reset(),gt=null,t}}function bt(e){if(1===e.length)return e[0];let t;const i=e.length,o=e.map((e=>"string"==typeof e?()=>e:(t=e.targetName||t,e.binding))),r=new mt(((e,t)=>{let r="";for(let n=0;n<i;++n)r+=o[n](e,t);return r}));return r.targetName=t,r}const yt=qe.length;function xt(e,t){const i=t.split(We);if(1===i.length)return null;const o=[];for(let t=0,r=i.length;t<r;++t){const r=i[t],n=r.indexOf(qe);let s;if(-1===n)s=r;else{const t=parseInt(r.substring(0,n));o.push(e.directives[t]),s=r.substring(n+yt)}""!==s&&o.push(s)}return o}function wt(e,t,i=!1){const o=t.attributes;for(let r=0,n=o.length;r<n;++r){const s=o[r],a=s.value,l=xt(e,a);let d=null;null===l?i&&(d=new mt((()=>a)),d.targetName=s.name):d=bt(l),null!==d&&(t.removeAttributeNode(s),r--,n--,e.addFactory(d))}}function kt(e,t,i){const o=xt(e,t.textContent);if(null!==o){let r=t;for(let n=0,s=o.length;n<s;++n){const s=o[n],a=0===n?t:r.parentNode.insertBefore(document.createTextNode(""),r.nextSibling);"string"==typeof s?a.textContent=s:(a.textContent=" ",e.captureContentBinding(s)),r=a,e.targetIndex++,a!==t&&i.nextNode()}e.targetIndex--}}const Ct=document.createRange();class $t{constructor(e,t){this.fragment=e,this.behaviors=t,this.source=null,this.context=null,this.firstChild=e.firstChild,this.lastChild=e.lastChild}appendTo(e){e.appendChild(this.fragment)}insertBefore(e){if(this.fragment.hasChildNodes())e.parentNode.insertBefore(this.fragment,e);else{const t=this.lastChild;if(e.previousSibling===t)return;const i=e.parentNode;let o,r=this.firstChild;for(;r!==t;)o=r.nextSibling,i.insertBefore(r,e),r=o;i.insertBefore(t,e)}}remove(){const e=this.fragment,t=this.lastChild;let i,o=this.firstChild;for(;o!==t;)i=o.nextSibling,e.appendChild(o),o=i;e.appendChild(t)}dispose(){const e=this.firstChild.parentNode,t=this.lastChild;let i,o=this.firstChild;for(;o!==t;)i=o.nextSibling,e.removeChild(o),o=i;e.removeChild(t);const r=this.behaviors,n=this.source;for(let e=0,t=r.length;e<t;++e)r[e].unbind(n)}bind(e,t){const i=this.behaviors;if(this.source!==e)if(null!==this.source){const o=this.source;this.source=e,this.context=t;for(let r=0,n=i.length;r<n;++r){const n=i[r];n.unbind(o),n.bind(e,t)}}else{this.source=e,this.context=t;for(let o=0,r=i.length;o<r;++o)i[o].bind(e,t)}}unbind(){if(null===this.source)return;const e=this.behaviors,t=this.source;for(let i=0,o=e.length;i<o;++i)e[i].unbind(t);this.source=null}static disposeContiguousBatch(e){if(0!==e.length){Ct.setStartBefore(e[0].firstChild),Ct.setEndAfter(e[e.length-1].lastChild),Ct.deleteContents();for(let t=0,i=e.length;t<i;++t){const i=e[t],o=i.behaviors,r=i.source;for(let e=0,t=o.length;e<t;++e)o[e].unbind(r)}}}}class _t{constructor(e,t){this.behaviorCount=0,this.hasHostBehaviors=!1,this.fragment=null,this.targetOffset=0,this.viewBehaviorFactories=null,this.hostBehaviorFactories=null,this.html=e,this.directives=t}create(e){if(null===this.fragment){let e;const t=this.html;if("string"==typeof t){e=document.createElement("template"),e.innerHTML=Ge.createHTML(t);const i=e.content.firstElementChild;null!==i&&"TEMPLATE"===i.tagName&&(e=i)}else e=t;const i=function(e,t){const i=e.content;document.adoptNode(i);const o=vt.borrow(t);wt(o,e,!0);const r=o.behaviorFactories;o.reset();const n=Ge.createTemplateWalker(i);let s;for(;s=n.nextNode();)switch(o.targetIndex++,s.nodeType){case 1:wt(o,s);break;case 3:kt(o,s,n);break;case 8:Ge.isMarker(s)&&o.addFactory(t[Ge.extractDirectiveIndexFromMarker(s)])}let a=0;(Ge.isMarker(i.firstChild)||1===i.childNodes.length&&t.length)&&(i.insertBefore(document.createComment(""),i.firstChild),a=-1);const l=o.behaviorFactories;return o.release(),{fragment:i,viewBehaviorFactories:l,hostBehaviorFactories:r,targetOffset:a}}(e,this.directives);this.fragment=i.fragment,this.viewBehaviorFactories=i.viewBehaviorFactories,this.hostBehaviorFactories=i.hostBehaviorFactories,this.targetOffset=i.targetOffset,this.behaviorCount=this.viewBehaviorFactories.length+this.hostBehaviorFactories.length,this.hasHostBehaviors=this.hostBehaviorFactories.length>0}const t=this.fragment.cloneNode(!0),i=this.viewBehaviorFactories,o=new Array(this.behaviorCount),r=Ge.createTemplateWalker(t);let n=0,s=this.targetOffset,a=r.nextNode();for(let e=i.length;n<e;++n){const e=i[n],t=e.targetIndex;for(;null!==a;){if(s===t){o[n]=e.createBehavior(a);break}a=r.nextNode(),s++}}if(this.hasHostBehaviors){const t=this.hostBehaviorFactories;for(let i=0,r=t.length;i<r;++i,++n)o[n]=t[i].createBehavior(e)}return new $t(t,o)}render(e,t,i){"string"==typeof t&&(t=document.getElementById(t)),void 0===i&&(i=t);const o=this.create(i);return o.bind(e,et),o.appendTo(t),o}}const St=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function Tt(e,...t){const i=[];let o="";for(let r=0,n=e.length-1;r<n;++r){const n=e[r];let s=t[r];if(o+=n,s instanceof _t){const e=s;s=()=>e}if("function"==typeof s&&(s=new mt(s)),s instanceof it){const e=St.exec(n);null!==e&&(s.targetName=e[2])}s instanceof tt?(o+=s.createPlaceholder(i.length),i.push(s)):o+=s}return o+=e[e.length-1],new _t(o,i)}class Et{constructor(){this.targets=new WeakSet}addStylesTo(e){this.targets.add(e)}removeStylesFrom(e){this.targets.delete(e)}isAttachedTo(e){return this.targets.has(e)}withBehaviors(...e){return this.behaviors=null===this.behaviors?e:this.behaviors.concat(e),this}}function At(e){return e.map((e=>e instanceof Et?At(e.styles):[e])).reduce(((e,t)=>e.concat(t)),[])}function It(e){return e.map((e=>e instanceof Et?e.behaviors:null)).reduce(((e,t)=>null===t?e:(null===e&&(e=[]),e.concat(t))),null)}Et.create=(()=>{if(Ge.supportsAdoptedStyleSheets){const e=new Map;return t=>new Ot(t,e)}return e=>new Ft(e)})();class Ot extends Et{constructor(e,t){super(),this.styles=e,this.styleSheetCache=t,this._styleSheets=void 0,this.behaviors=It(e)}get styleSheets(){if(void 0===this._styleSheets){const e=this.styles,t=this.styleSheetCache;this._styleSheets=At(e).map((e=>{if(e instanceof CSSStyleSheet)return e;let i=t.get(e);return void 0===i&&(i=new CSSStyleSheet,i.replaceSync(e),t.set(e,i)),i}))}return this._styleSheets}addStylesTo(e){e.adoptedStyleSheets=[...e.adoptedStyleSheets,...this.styleSheets],super.addStylesTo(e)}removeStylesFrom(e){const t=this.styleSheets;e.adoptedStyleSheets=e.adoptedStyleSheets.filter((e=>-1===t.indexOf(e))),super.removeStylesFrom(e)}}let Lt=0;class Ft extends Et{constructor(e){super(),this.styles=e,this.behaviors=null,this.behaviors=It(e),this.styleSheets=At(e),this.styleClass="fast-style-class-"+ ++Lt}addStylesTo(e){const t=this.styleSheets,i=this.styleClass;e=this.normalizeTarget(e);for(let o=0;o<t.length;o++){const r=document.createElement("style");r.innerHTML=t[o],r.className=i,e.append(r)}super.addStylesTo(e)}removeStylesFrom(e){const t=(e=this.normalizeTarget(e)).querySelectorAll(`.${this.styleClass}`);for(let i=0,o=t.length;i<o;++i)e.removeChild(t[i]);super.removeStylesFrom(e)}isAttachedTo(e){return super.isAttachedTo(this.normalizeTarget(e))}normalizeTarget(e){return e===document?document.body:e}}const Mt=Object.freeze({locate:He()}),Rt={toView:e=>e?"true":"false",fromView:e=>null!=e&&"false"!==e&&!1!==e&&0!==e},Dt={toView(e){if(null==e)return null;const t=1*e;return isNaN(t)?null:t.toString()},fromView(e){if(null==e)return null;const t=1*e;return isNaN(t)?null:t}};class zt{constructor(e,t,i=t.toLowerCase(),o="reflect",r){this.guards=new Set,this.Owner=e,this.name=t,this.attribute=i,this.mode=o,this.converter=r,this.fieldName=`_${t}`,this.callbackName=`${t}Changed`,this.hasCallback=this.callbackName in e.prototype,"boolean"===o&&void 0===r&&(this.converter=Rt)}setValue(e,t){const i=e[this.fieldName],o=this.converter;void 0!==o&&(t=o.fromView(t)),i!==t&&(e[this.fieldName]=t,this.tryReflectToAttribute(e),this.hasCallback&&e[this.callbackName](i,t),e.$fastController.notify(this.name))}getValue(e){return Ze.track(e,this.name),e[this.fieldName]}onAttributeChangedCallback(e,t){this.guards.has(e)||(this.guards.add(e),this.setValue(e,t),this.guards.delete(e))}tryReflectToAttribute(e){const t=this.mode,i=this.guards;i.has(e)||"fromView"===t||Ge.queueUpdate((()=>{i.add(e);const o=e[this.fieldName];switch(t){case"reflect":const t=this.converter;Ge.setAttribute(e,this.attribute,void 0!==t?t.toView(o):o);break;case"boolean":Ge.setBooleanAttribute(e,this.attribute,o)}i.delete(e)}))}static collect(e,...t){const i=[];t.push(Mt.locate(e));for(let o=0,r=t.length;o<r;++o){const r=t[o];if(void 0!==r)for(let t=0,o=r.length;t<o;++t){const o=r[t];"string"==typeof o?i.push(new zt(e,o)):i.push(new zt(e,o.property,o.attribute,o.mode,o.converter))}}return i}}function Pt(e,t){let i;function o(e,t){arguments.length>1&&(i.property=t),Mt.locate(e.constructor).push(i)}return arguments.length>1?(i={},void o(e,t)):(i=void 0===e?{}:e,o)}const Nt={mode:"open"},Ht={},Bt=Pe.getById(4,(()=>{const e=new Map;return Object.freeze({register:t=>!e.has(t.type)&&(e.set(t.type,t),!0),getByType:t=>e.get(t)})}));class Vt{constructor(e,t=e.definition){"string"==typeof t&&(t={name:t}),this.type=e,this.name=t.name,this.template=t.template;const i=zt.collect(e,t.attributes),o=new Array(i.length),r={},n={};for(let e=0,t=i.length;e<t;++e){const t=i[e];o[e]=t.attribute,r[t.name]=t,n[t.attribute]=t}this.attributes=i,this.observedAttributes=o,this.propertyLookup=r,this.attributeLookup=n,this.shadowOptions=void 0===t.shadowOptions?Nt:null===t.shadowOptions?void 0:Object.assign(Object.assign({},Nt),t.shadowOptions),this.elementOptions=void 0===t.elementOptions?Ht:Object.assign(Object.assign({},Ht),t.elementOptions),this.styles=void 0===t.styles?void 0:Array.isArray(t.styles)?Et.create(t.styles):t.styles instanceof Et?t.styles:Et.create([t.styles])}get isDefined(){return!!Bt.getByType(this.type)}define(e=customElements){const t=this.type;if(Bt.register(this)){const e=this.attributes,i=t.prototype;for(let t=0,o=e.length;t<o;++t)Ze.defineProperty(i,e[t]);Reflect.defineProperty(t,"observedAttributes",{value:this.observedAttributes,enumerable:!0})}return e.get(this.name)||e.define(this.name,t,this.elementOptions),this}}Vt.forType=Bt.getByType;const jt=new WeakMap,Ut={bubbles:!0,composed:!0,cancelable:!0};function Wt(e){return e.shadowRoot||jt.get(e)||null}class qt extends Ke{constructor(e,t){super(e),this.boundObservables=null,this.behaviors=null,this.needsInitialization=!0,this._template=null,this._styles=null,this._isConnected=!1,this.$fastController=this,this.view=null,this.element=e,this.definition=t;const i=t.shadowOptions;if(void 0!==i){const t=e.attachShadow(i);"closed"===i.mode&&jt.set(e,t)}const o=Ze.getAccessors(e);if(o.length>0){const t=this.boundObservables=Object.create(null);for(let i=0,r=o.length;i<r;++i){const r=o[i].name,n=e[r];void 0!==n&&(delete e[r],t[r]=n)}}}get isConnected(){return Ze.track(this,"isConnected"),this._isConnected}setIsConnected(e){this._isConnected=e,Ze.notify(this,"isConnected")}get template(){return this._template}set template(e){this._template!==e&&(this._template=e,this.needsInitialization||this.renderTemplate(e))}get styles(){return this._styles}set styles(e){this._styles!==e&&(null!==this._styles&&this.removeStyles(this._styles),this._styles=e,this.needsInitialization||null===e||this.addStyles(e))}addStyles(e){const t=Wt(this.element)||this.element.getRootNode();if(e instanceof HTMLStyleElement)t.append(e);else if(!e.isAttachedTo(t)){const i=e.behaviors;e.addStylesTo(t),null!==i&&this.addBehaviors(i)}}removeStyles(e){const t=Wt(this.element)||this.element.getRootNode();if(e instanceof HTMLStyleElement)t.removeChild(e);else if(e.isAttachedTo(t)){const i=e.behaviors;e.removeStylesFrom(t),null!==i&&this.removeBehaviors(i)}}addBehaviors(e){const t=this.behaviors||(this.behaviors=new Map),i=e.length,o=[];for(let r=0;r<i;++r){const i=e[r];t.has(i)?t.set(i,t.get(i)+1):(t.set(i,1),o.push(i))}if(this._isConnected){const e=this.element;for(let t=0;t<o.length;++t)o[t].bind(e,et)}}removeBehaviors(e,t=!1){const i=this.behaviors;if(null===i)return;const o=e.length,r=[];for(let n=0;n<o;++n){const o=e[n];if(i.has(o)){const e=i.get(o)-1;0===e||t?i.delete(o)&&r.push(o):i.set(o,e)}}if(this._isConnected){const e=this.element;for(let t=0;t<r.length;++t)r[t].unbind(e)}}onConnectedCallback(){if(this._isConnected)return;const e=this.element;this.needsInitialization?this.finishInitialization():null!==this.view&&this.view.bind(e,et);const t=this.behaviors;if(null!==t)for(const[i]of t)i.bind(e,et);this.setIsConnected(!0)}onDisconnectedCallback(){if(!this._isConnected)return;this.setIsConnected(!1);const e=this.view;null!==e&&e.unbind();const t=this.behaviors;if(null!==t){const e=this.element;for(const[i]of t)i.unbind(e)}}onAttributeChangedCallback(e,t,i){const o=this.definition.attributeLookup[e];void 0!==o&&o.onAttributeChangedCallback(this.element,i)}emit(e,t,i){return!!this._isConnected&&this.element.dispatchEvent(new CustomEvent(e,Object.assign(Object.assign({detail:t},Ut),i)))}finishInitialization(){const e=this.element,t=this.boundObservables;if(null!==t){const i=Object.keys(t);for(let o=0,r=i.length;o<r;++o){const r=i[o];e[r]=t[r]}this.boundObservables=null}const i=this.definition;null===this._template&&(this.element.resolveTemplate?this._template=this.element.resolveTemplate():i.template&&(this._template=i.template||null)),null!==this._template&&this.renderTemplate(this._template),null===this._styles&&(this.element.resolveStyles?this._styles=this.element.resolveStyles():i.styles&&(this._styles=i.styles||null)),null!==this._styles&&this.addStyles(this._styles),this.needsInitialization=!1}renderTemplate(e){const t=this.element,i=Wt(t)||t;null!==this.view?(this.view.dispose(),this.view=null):this.needsInitialization||Ge.removeChildNodes(i),e&&(this.view=e.render(t,i,t))}static forCustomElement(e){const t=e.$fastController;if(void 0!==t)return t;const i=Vt.forType(e.constructor);if(void 0===i)throw new Error("Missing FASTElement definition.");return e.$fastController=new qt(e,i)}}function Gt(e){return class extends e{constructor(){super(),qt.forCustomElement(this)}$emit(e,t,i){return this.$fastController.emit(e,t,i)}connectedCallback(){this.$fastController.onConnectedCallback()}disconnectedCallback(){this.$fastController.onDisconnectedCallback()}attributeChangedCallback(e,t,i){this.$fastController.onAttributeChangedCallback(e,t,i)}}}const Xt=Object.assign(Gt(HTMLElement),{from:e=>Gt(e),define:(e,t)=>new Vt(e,t).define().type});class Kt{createCSS(){return""}createBehavior(){}}function Zt(e,t){const i=[];let o="";const r=[];for(let n=0,s=e.length-1;n<s;++n){o+=e[n];let s=t[n];if(s instanceof Kt){const e=s.createBehavior();s=s.createCSS(),e&&r.push(e)}s instanceof Et||s instanceof CSSStyleSheet?(""!==o.trim()&&(i.push(o),o=""),i.push(s)):o+=s}return o+=e[e.length-1],""!==o.trim()&&i.push(o),{styles:i,behaviors:r}}function Yt(e,...t){const{styles:i,behaviors:o}=Zt(e,t),r=Et.create(i);return o.length&&r.withBehaviors(...o),r}class Qt extends Kt{constructor(e,t){super(),this.behaviors=t,this.css="";const i=e.reduce(((e,t)=>("string"==typeof t?this.css+=t:e.push(t),e)),[]);i.length&&(this.styles=Et.create(i))}createBehavior(){return this}createCSS(){return this.css}bind(e){this.styles&&e.$fastController.addStyles(this.styles),this.behaviors.length&&e.$fastController.addBehaviors(this.behaviors)}unbind(e){this.styles&&e.$fastController.removeStyles(this.styles),this.behaviors.length&&e.$fastController.removeBehaviors(this.behaviors)}}function Jt(e,...t){const{styles:i,behaviors:o}=Zt(e,t);return new Qt(i,o)}function ei(e,t,i){return{index:e,removed:t,addedCount:i}}function ti(e,t,i,o,r,n){let s=0,a=0;const l=Math.min(i-t,n-r);if(0===t&&0===r&&(s=function(e,t,i){for(let o=0;o<i;++o)if(e[o]!==t[o])return o;return i}(e,o,l)),i===e.length&&n===o.length&&(a=function(e,t,i){let o=e.length,r=t.length,n=0;for(;n<i&&e[--o]===t[--r];)n++;return n}(e,o,l-s)),r+=s,n-=a,(i-=a)-(t+=s)==0&&n-r==0)return Ne;if(t===i){const e=ei(t,[],0);for(;r<n;)e.removed.push(o[r++]);return[e]}if(r===n)return[ei(t,[],i-t)];const d=function(e){let t=e.length-1,i=e[0].length-1,o=e[t][i];const r=[];for(;t>0||i>0;){if(0===t){r.push(2),i--;continue}if(0===i){r.push(3),t--;continue}const n=e[t-1][i-1],s=e[t-1][i],a=e[t][i-1];let l;l=s<a?s<n?s:n:a<n?a:n,l===n?(n===o?r.push(0):(r.push(1),o=n),t--,i--):l===s?(r.push(3),t--,o=s):(r.push(2),i--,o=a)}return r.reverse(),r}(function(e,t,i,o,r,n){const s=n-r+1,a=i-t+1,l=new Array(s);let d,c;for(let e=0;e<s;++e)l[e]=new Array(a),l[e][0]=e;for(let e=0;e<a;++e)l[0][e]=e;for(let i=1;i<s;++i)for(let n=1;n<a;++n)e[t+n-1]===o[r+i-1]?l[i][n]=l[i-1][n-1]:(d=l[i-1][n]+1,c=l[i][n-1]+1,l[i][n]=d<c?d:c);return l}(e,t,i,o,r,n)),c=[];let h,u=t,p=r;for(let e=0;e<d.length;++e)switch(d[e]){case 0:void 0!==h&&(c.push(h),h=void 0),u++,p++;break;case 1:void 0===h&&(h=ei(u,[],0)),h.addedCount++,u++,h.removed.push(o[p]),p++;break;case 2:void 0===h&&(h=ei(u,[],0)),h.addedCount++,u++;break;case 3:void 0===h&&(h=ei(u,[],0)),h.removed.push(o[p]),p++}return void 0!==h&&c.push(h),c}const ii=Array.prototype.push;function oi(e,t,i,o){const r=ei(t,i,o);let n=!1,s=0;for(let t=0;t<e.length;t++){const i=e[t];if(i.index+=s,n)continue;const o=(a=r.index,l=r.index+r.removed.length,d=i.index,c=i.index+i.addedCount,l<d||c<a?-1:l===d||c===a?0:a<d?l<c?l-d:c-d:c<l?c-a:l-a);if(o>=0){e.splice(t,1),t--,s-=i.addedCount-i.removed.length,r.addedCount+=i.addedCount-o;const a=r.removed.length+i.removed.length-o;if(r.addedCount||a){let e=i.removed;if(r.index<i.index){const t=r.removed.slice(0,i.index-r.index);ii.apply(t,e),e=t}if(r.index+r.removed.length>i.index+i.addedCount){const t=r.removed.slice(i.index+i.addedCount-r.index);ii.apply(e,t)}r.removed=e,i.index<r.index&&(r.index=i.index)}else n=!0}else if(r.index<i.index){n=!0,e.splice(t,0,r),t++;const o=r.addedCount-r.removed.length;i.index+=o,s+=o}}var a,l,d,c;n||e.push(r)}function ri(e,t){let i=[];const o=function(e){const t=[];for(let i=0,o=e.length;i<o;i++){const o=e[i];oi(t,o.index,o.removed,o.addedCount)}return t}(t);for(let t=0,r=o.length;t<r;++t){const r=o[t];1!==r.addedCount||1!==r.removed.length?i=i.concat(ti(e,r.index,r.index+r.addedCount,r.removed,0,r.removed.length)):r.removed[0]!==e[r.index]&&i.push(r)}return i}let ni=!1;function si(e,t){let i=e.index;const o=t.length;return i>o?i=o-e.addedCount:i<0&&(i=o+e.removed.length+i-e.addedCount),i<0&&(i=0),e.index=i,e}class ai extends Xe{constructor(e){super(e),this.oldCollection=void 0,this.splices=void 0,this.needsQueue=!0,this.call=this.flush,Reflect.defineProperty(e,"$fastController",{value:this,enumerable:!1})}subscribe(e){this.flush(),super.subscribe(e)}addSplice(e){void 0===this.splices?this.splices=[e]:this.splices.push(e),this.needsQueue&&(this.needsQueue=!1,Ge.queueUpdate(this))}reset(e){this.oldCollection=e,this.needsQueue&&(this.needsQueue=!1,Ge.queueUpdate(this))}flush(){const e=this.splices,t=this.oldCollection;if(void 0===e&&void 0===t)return;this.needsQueue=!0,this.splices=void 0,this.oldCollection=void 0;const i=void 0===t?ri(this.source,e):ti(this.source,0,this.source.length,t,0,t.length);this.notify(i)}}class li{constructor(e,t){this.target=e,this.propertyName=t}bind(e){e[this.propertyName]=this.target}unbind(){}}function di(e){return new ot("fast-ref",li,e)}function ci(e,t){const i="function"==typeof t?t:()=>t;return(t,o)=>e(t,o)?i(t,o):null}const hi=Object.freeze({positioning:!1,recycle:!0});function ui(e,t,i,o){e.bind(t[i],o)}function pi(e,t,i,o){const r=Object.create(o);r.index=i,r.length=t.length,e.bind(t[i],r)}class mi{constructor(e,t,i,o,r,n){this.location=e,this.itemsBinding=t,this.templateBinding=o,this.options=n,this.source=null,this.views=[],this.items=null,this.itemsObserver=null,this.originalContext=void 0,this.childContext=void 0,this.bindView=ui,this.itemsBindingObserver=Ze.binding(t,this,i),this.templateBindingObserver=Ze.binding(o,this,r),n.positioning&&(this.bindView=pi)}bind(e,t){this.source=e,this.originalContext=t,this.childContext=Object.create(t),this.childContext.parent=e,this.childContext.parentContext=this.originalContext,this.items=this.itemsBindingObserver.observe(e,this.originalContext),this.template=this.templateBindingObserver.observe(e,this.originalContext),this.observeItems(!0),this.refreshAllViews()}unbind(){this.source=null,this.items=null,null!==this.itemsObserver&&this.itemsObserver.unsubscribe(this),this.unbindAllViews(),this.itemsBindingObserver.disconnect(),this.templateBindingObserver.disconnect()}handleChange(e,t){e===this.itemsBinding?(this.items=this.itemsBindingObserver.observe(this.source,this.originalContext),this.observeItems(),this.refreshAllViews()):e===this.templateBinding?(this.template=this.templateBindingObserver.observe(this.source,this.originalContext),this.refreshAllViews(!0)):this.updateViews(t)}observeItems(e=!1){if(!this.items)return void(this.items=Ne);const t=this.itemsObserver,i=this.itemsObserver=Ze.getNotifier(this.items),o=t!==i;o&&null!==t&&t.unsubscribe(this),(o||e)&&i.subscribe(this)}updateViews(e){const t=this.childContext,i=this.views,o=this.bindView,r=this.items,n=this.template,s=this.options.recycle,a=[];let l=0,d=0;for(let c=0,h=e.length;c<h;++c){const h=e[c],u=h.removed;let p=0,m=h.index;const f=m+h.addedCount,g=i.splice(h.index,u.length),v=d=a.length+g.length;for(;m<f;++m){const e=i[m],c=e?e.firstChild:this.location;let h;s&&d>0?(p<=v&&g.length>0?(h=g[p],p++):(h=a[l],l++),d--):h=n.create(),i.splice(m,0,h),o(h,r,m,t),h.insertBefore(c)}g[p]&&a.push(...g.slice(p))}for(let e=l,t=a.length;e<t;++e)a[e].dispose();if(this.options.positioning)for(let e=0,t=i.length;e<t;++e){const o=i[e].context;o.length=t,o.index=e}}refreshAllViews(e=!1){const t=this.items,i=this.childContext,o=this.template,r=this.location,n=this.bindView;let s=t.length,a=this.views,l=a.length;if(0!==s&&!e&&this.options.recycle||($t.disposeContiguousBatch(a),l=0),0===l){this.views=a=new Array(s);for(let e=0;e<s;++e){const s=o.create();n(s,t,e,i),a[e]=s,s.insertBefore(r)}}else{let e=0;for(;e<s;++e)if(e<l){n(a[e],t,e,i)}else{const s=o.create();n(s,t,e,i),a.push(s),s.insertBefore(r)}const d=a.splice(e,l-e);for(e=0,s=d.length;e<s;++e)d[e].dispose()}}unbindAllViews(){const e=this.views;for(let t=0,i=e.length;t<i;++t)e[t].unbind()}}class fi extends tt{constructor(e,t,i){super(),this.itemsBinding=e,this.templateBinding=t,this.options=i,this.createPlaceholder=Ge.createBlockPlaceholder,function(){if(ni)return;ni=!0,Ze.setArrayObserverFactory((e=>new ai(e)));const e=Array.prototype;if(e.$fastPatch)return;Reflect.defineProperty(e,"$fastPatch",{value:1,enumerable:!1});const t=e.pop,i=e.push,o=e.reverse,r=e.shift,n=e.sort,s=e.splice,a=e.unshift;e.pop=function(){const e=this.length>0,i=t.apply(this,arguments),o=this.$fastController;return void 0!==o&&e&&o.addSplice(ei(this.length,[i],0)),i},e.push=function(){const e=i.apply(this,arguments),t=this.$fastController;return void 0!==t&&t.addSplice(si(ei(this.length-arguments.length,[],arguments.length),this)),e},e.reverse=function(){let e;const t=this.$fastController;void 0!==t&&(t.flush(),e=this.slice());const i=o.apply(this,arguments);return void 0!==t&&t.reset(e),i},e.shift=function(){const e=this.length>0,t=r.apply(this,arguments),i=this.$fastController;return void 0!==i&&e&&i.addSplice(ei(0,[t],0)),t},e.sort=function(){let e;const t=this.$fastController;void 0!==t&&(t.flush(),e=this.slice());const i=n.apply(this,arguments);return void 0!==t&&t.reset(e),i},e.splice=function(){const e=s.apply(this,arguments),t=this.$fastController;return void 0!==t&&t.addSplice(si(ei(+arguments[0],e,arguments.length>2?arguments.length-2:0),this)),e},e.unshift=function(){const e=a.apply(this,arguments),t=this.$fastController;return void 0!==t&&t.addSplice(si(ei(0,[],arguments.length),this)),e}}(),this.isItemsBindingVolatile=Ze.isVolatileBinding(e),this.isTemplateBindingVolatile=Ze.isVolatileBinding(t)}createBehavior(e){return new mi(e,this.itemsBinding,this.isItemsBindingVolatile,this.templateBinding,this.isTemplateBindingVolatile,this.options)}}function gi(e,t,i=hi){return new fi(e,"function"==typeof t?t:()=>t,Object.assign(Object.assign({},hi),i))}function vi(e){return e?function(t,i,o){return 1===t.nodeType&&t.matches(e)}:function(e,t,i){return 1===e.nodeType}}class bi{constructor(e,t){this.target=e,this.options=t,this.source=null}bind(e){const t=this.options.property;this.shouldUpdate=Ze.getAccessors(e).some((e=>e.name===t)),this.source=e,this.updateTarget(this.computeNodes()),this.shouldUpdate&&this.observe()}unbind(){this.updateTarget(Ne),this.source=null,this.shouldUpdate&&this.disconnect()}handleEvent(){this.updateTarget(this.computeNodes())}computeNodes(){let e=this.getNodes();return void 0!==this.options.filter&&(e=e.filter(this.options.filter)),e}updateTarget(e){this.source[this.options.property]=e}}class yi extends bi{constructor(e,t){super(e,t)}observe(){this.target.addEventListener("slotchange",this)}disconnect(){this.target.removeEventListener("slotchange",this)}getNodes(){return this.target.assignedNodes(this.options)}}function xi(e){return"string"==typeof e&&(e={property:e}),new ot("fast-slotted",yi,e)}class wi extends bi{constructor(e,t){super(e,t),this.observer=null,t.childList=!0}observe(){null===this.observer&&(this.observer=new MutationObserver(this.handleEvent.bind(this))),this.observer.observe(this.target,this.options)}disconnect(){this.observer.disconnect()}getNodes(){return"subtree"in this.options?Array.from(this.target.querySelectorAll(this.options.selector)):Array.from(this.target.childNodes)}}function ki(e){return"string"==typeof e&&(e={property:e}),new ot("fast-children",wi,e)}class Ci{handleStartContentChange(){this.startContainer.classList.toggle("start",this.start.assignedNodes().length>0)}handleEndContentChange(){this.endContainer.classList.toggle("end",this.end.assignedNodes().length>0)}}const $i=(e,t)=>Tt`
    <span
        part="end"
        ${di("endContainer")}
        class=${e=>t.end?"end":void 0}
    >
        <slot name="end" ${di("end")} @slotchange="${e=>e.handleEndContentChange()}">
            ${t.end||""}
        </slot>
    </span>
`,_i=(e,t)=>Tt`
    <span
        part="start"
        ${di("startContainer")}
        class="${e=>t.start?"start":void 0}"
    >
        <slot
            name="start"
            ${di("start")}
            @slotchange="${e=>e.handleStartContentChange()}"
        >
            ${t.start||""}
        </slot>
    </span>
`,Si=Tt`
    <span part="end" ${di("endContainer")}>
        <slot
            name="end"
            ${di("end")}
            @slotchange="${e=>e.handleEndContentChange()}"
        ></slot>
    </span>
`,Ti=Tt`
    <span part="start" ${di("startContainer")}>
        <slot
            name="start"
            ${di("start")}
            @slotchange="${e=>e.handleStartContentChange()}"
        ></slot>
    </span>
`;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function Ei(e,t,i,o){var r,n=arguments.length,s=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(n<3?r(s):n>3?r(t,i,s):r(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s}const Ai=new Map;"metadata"in Reflect||(Reflect.metadata=function(e,t){return function(i){Reflect.defineMetadata(e,t,i)}},Reflect.defineMetadata=function(e,t,i){let o=Ai.get(i);void 0===o&&Ai.set(i,o=new Map),o.set(e,t)},Reflect.getOwnMetadata=function(e,t){const i=Ai.get(t);if(void 0!==i)return i.get(e)});class Ii{constructor(e,t){this.container=e,this.key=t}instance(e){return this.registerResolver(0,e)}singleton(e){return this.registerResolver(1,e)}transient(e){return this.registerResolver(2,e)}callback(e){return this.registerResolver(3,e)}cachedCallback(e){return this.registerResolver(3,Qi(e))}aliasTo(e){return this.registerResolver(5,e)}registerResolver(e,t){const{container:i,key:o}=this;return this.container=this.key=void 0,i.registerResolver(o,new Hi(o,e,t))}}function Oi(e){const t=e.slice(),i=Object.keys(e),o=i.length;let r;for(let n=0;n<o;++n)r=i[n],so(r)||(t[r]=e[r]);return t}const Li=Object.freeze({none(e){throw Error(`${e.toString()} not registered, did you forget to add @singleton()?`)},singleton:e=>new Hi(e,1,e),transient:e=>new Hi(e,2,e)}),Fi=Object.freeze({default:Object.freeze({parentLocator:()=>null,responsibleForOwnerRequests:!1,defaultResolver:Li.singleton})}),Mi=new Map;function Ri(e){return t=>Reflect.getOwnMetadata(e,t)}let Di=null;const zi=Object.freeze({createContainer:e=>new Zi(null,Object.assign({},Fi.default,e)),findResponsibleContainer(e){const t=e.$$container$$;return t&&t.responsibleForOwnerRequests?t:zi.findParentContainer(e)},findParentContainer(e){const t=new CustomEvent(Xi,{bubbles:!0,composed:!0,cancelable:!0,detail:{container:void 0}});return e.dispatchEvent(t),t.detail.container||zi.getOrCreateDOMContainer()},getOrCreateDOMContainer:(e,t)=>e?e.$$container$$||new Zi(e,Object.assign({},Fi.default,t,{parentLocator:zi.findParentContainer})):Di||(Di=new Zi(null,Object.assign({},Fi.default,t,{parentLocator:()=>null}))),getDesignParamtypes:Ri("design:paramtypes"),getAnnotationParamtypes:Ri("di:paramtypes"),getOrCreateAnnotationParamTypes(e){let t=this.getAnnotationParamtypes(e);return void 0===t&&Reflect.defineMetadata("di:paramtypes",t=[],e),t},getDependencies(e){let t=Mi.get(e);if(void 0===t){const i=e.inject;if(void 0===i){const i=zi.getDesignParamtypes(e),o=zi.getAnnotationParamtypes(e);if(void 0===i)if(void 0===o){const i=Object.getPrototypeOf(e);t="function"==typeof i&&i!==Function.prototype?Oi(zi.getDependencies(i)):[]}else t=Oi(o);else if(void 0===o)t=Oi(i);else{t=Oi(i);let e,r=o.length;for(let i=0;i<r;++i)e=o[i],void 0!==e&&(t[i]=e);const n=Object.keys(o);let s;r=n.length;for(let e=0;e<r;++e)s=n[e],so(s)||(t[s]=o[s])}}else t=Oi(i);Mi.set(e,t)}return t},defineProperty(e,t,i,o=!1){const r=`$di_${t}`;Reflect.defineProperty(e,t,{get:function(){let e=this[r];if(void 0===e){const n=this instanceof HTMLElement?zi.findResponsibleContainer(this):zi.getOrCreateDOMContainer();if(e=n.get(i),this[r]=e,o&&this instanceof Xt){const o=this.$fastController,n=()=>{zi.findResponsibleContainer(this).get(i)!==this[r]&&(this[r]=e,o.notify(t))};o.subscribe({handleChange:n},"isConnected")}}return e}})},createInterface(e,t){const i="function"==typeof e?e:t,o="string"==typeof e?e:e&&"friendlyName"in e&&e.friendlyName||io,r="string"!=typeof e&&(e&&"respectConnection"in e&&e.respectConnection||!1),n=function(e,t,i){if(null==e||void 0!==new.target)throw new Error(`No registration for interface: '${n.friendlyName}'`);if(t)zi.defineProperty(e,t,n,r);else{zi.getOrCreateAnnotationParamTypes(e)[i]=n}};return n.$isInterface=!0,n.friendlyName=null==o?"(anonymous)":o,null!=i&&(n.register=function(e,t){return i(new Ii(e,null!=t?t:n))}),n.toString=function(){return`InterfaceSymbol<${n.friendlyName}>`},n},inject:(...e)=>function(t,i,o){if("number"==typeof o){const i=zi.getOrCreateAnnotationParamTypes(t),r=e[0];void 0!==r&&(i[o]=r)}else if(i)zi.defineProperty(t,i,e[0]);else{const i=o?zi.getOrCreateAnnotationParamTypes(o.value):zi.getOrCreateAnnotationParamTypes(t);let r;for(let t=0;t<e.length;++t)r=e[t],void 0!==r&&(i[t]=r)}},transient:e=>(e.register=function(t){return Ji.transient(e,e).register(t)},e.registerInRequestor=!1,e),singleton:(e,t=Ni)=>(e.register=function(t){return Ji.singleton(e,e).register(t)},e.registerInRequestor=t.scoped,e)}),Pi=zi.createInterface("Container");zi.inject;const Ni={scoped:!1};class Hi{constructor(e,t,i){this.key=e,this.strategy=t,this.state=i,this.resolving=!1}get $isResolver(){return!0}register(e){return e.registerResolver(this.key,this)}resolve(e,t){switch(this.strategy){case 0:return this.state;case 1:if(this.resolving)throw new Error(`Cyclic dependency found: ${this.state.name}`);return this.resolving=!0,this.state=e.getFactory(this.state).construct(t),this.strategy=0,this.resolving=!1,this.state;case 2:{const i=e.getFactory(this.state);if(null===i)throw new Error(`Resolver for ${String(this.key)} returned a null factory`);return i.construct(t)}case 3:return this.state(e,t,this);case 4:return this.state[0].resolve(e,t);case 5:return t.get(this.state);default:throw new Error(`Invalid resolver strategy specified: ${this.strategy}.`)}}getFactory(e){var t,i,o;switch(this.strategy){case 1:case 2:return e.getFactory(this.state);case 5:return null!==(o=null===(i=null===(t=e.getResolver(this.state))||void 0===t?void 0:t.getFactory)||void 0===i?void 0:i.call(t,e))&&void 0!==o?o:null;default:return null}}}function Bi(e){return this.get(e)}function Vi(e,t){return t(e)}class ji{constructor(e,t){this.Type=e,this.dependencies=t,this.transformers=null}construct(e,t){let i;return i=void 0===t?new this.Type(...this.dependencies.map(Bi,e)):new this.Type(...this.dependencies.map(Bi,e),...t),null==this.transformers?i:this.transformers.reduce(Vi,i)}registerTransformer(e){(this.transformers||(this.transformers=[])).push(e)}}const Ui={$isResolver:!0,resolve:(e,t)=>t};function Wi(e){return"function"==typeof e.register}function qi(e){return function(e){return Wi(e)&&"boolean"==typeof e.registerInRequestor}(e)&&e.registerInRequestor}const Gi=new Set(["Array","ArrayBuffer","Boolean","DataView","Date","Error","EvalError","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Number","Object","Promise","RangeError","ReferenceError","RegExp","Set","SharedArrayBuffer","String","SyntaxError","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","URIError","WeakMap","WeakSet"]),Xi="__DI_LOCATE_PARENT__",Ki=new Map;class Zi{constructor(e,t){this.owner=e,this.config=t,this._parent=void 0,this.registerDepth=0,this.context=null,null!==e&&(e.$$container$$=this),this.resolvers=new Map,this.resolvers.set(Pi,Ui),e instanceof Node&&e.addEventListener(Xi,(e=>{e.composedPath()[0]!==this.owner&&(e.detail.container=this,e.stopImmediatePropagation())}))}get parent(){return void 0===this._parent&&(this._parent=this.config.parentLocator(this.owner)),this._parent}get depth(){return null===this.parent?0:this.parent.depth+1}get responsibleForOwnerRequests(){return this.config.responsibleForOwnerRequests}registerWithContext(e,...t){return this.context=e,this.register(...t),this.context=null,this}register(...e){if(100==++this.registerDepth)throw new Error("Unable to autoregister dependency");let t,i,o,r,n;const s=this.context;for(let a=0,l=e.length;a<l;++a)if(t=e[a],oo(t))if(Wi(t))t.register(this,s);else if(void 0!==t.prototype)Ji.singleton(t,t).register(this);else for(i=Object.keys(t),r=0,n=i.length;r<n;++r)o=t[i[r]],oo(o)&&(Wi(o)?o.register(this,s):this.register(o));return--this.registerDepth,this}registerResolver(e,t){eo(e);const i=this.resolvers,o=i.get(e);return null==o?i.set(e,t):o instanceof Hi&&4===o.strategy?o.state.push(t):i.set(e,new Hi(e,4,[o,t])),t}registerTransformer(e,t){const i=this.getResolver(e);if(null==i)return!1;if(i.getFactory){const e=i.getFactory(this);return null!=e&&(e.registerTransformer(t),!0)}return!1}getResolver(e,t=!0){if(eo(e),void 0!==e.resolve)return e;let i,o=this;for(;null!=o;){if(i=o.resolvers.get(e),null!=i)return i;if(null==o.parent){const i=qi(e)?this:o;return t?this.jitRegister(e,i):null}o=o.parent}return null}has(e,t=!1){return!!this.resolvers.has(e)||!(!t||null==this.parent)&&this.parent.has(e,!0)}get(e){if(eo(e),e.$isResolver)return e.resolve(this,this);let t,i=this;for(;null!=i;){if(t=i.resolvers.get(e),null!=t)return t.resolve(i,this);if(null==i.parent){const o=qi(e)?this:i;return t=this.jitRegister(e,o),t.resolve(i,this)}i=i.parent}throw new Error(`Unable to resolve key: ${e}`)}getAll(e,t=!1){eo(e);const i=this;let o,r=i;if(t){let t=Ne;for(;null!=r;)o=r.resolvers.get(e),null!=o&&(t=t.concat(to(o,r,i))),r=r.parent;return t}for(;null!=r;){if(o=r.resolvers.get(e),null!=o)return to(o,r,i);if(r=r.parent,null==r)return Ne}return Ne}getFactory(e){let t=Ki.get(e);if(void 0===t){if(ro(e))throw new Error(`${e.name} is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.`);Ki.set(e,t=new ji(e,zi.getDependencies(e)))}return t}registerFactory(e,t){Ki.set(e,t)}createChild(e){return new Zi(null,Object.assign({},this.config,e,{parentLocator:()=>this}))}jitRegister(e,t){if("function"!=typeof e)throw new Error(`Attempted to jitRegister something that is not a constructor: '${e}'. Did you forget to register this dependency?`);if(Gi.has(e.name))throw new Error(`Attempted to jitRegister an intrinsic type: ${e.name}. Did you forget to add @inject(Key)`);if(Wi(e)){const i=e.register(t);if(!(i instanceof Object)||null==i.resolve){const i=t.resolvers.get(e);if(null!=i)return i;throw new Error("A valid resolver was not returned from the static register method")}return i}if(e.$isInterface)throw new Error(`Attempted to jitRegister an interface: ${e.friendlyName}`);{const i=this.config.defaultResolver(e,t);return t.resolvers.set(e,i),i}}}const Yi=new WeakMap;function Qi(e){return function(t,i,o){if(Yi.has(o))return Yi.get(o);const r=e(t,i,o);return Yi.set(o,r),r}}const Ji=Object.freeze({instance:(e,t)=>new Hi(e,0,t),singleton:(e,t)=>new Hi(e,1,t),transient:(e,t)=>new Hi(e,2,t),callback:(e,t)=>new Hi(e,3,t),cachedCallback:(e,t)=>new Hi(e,3,Qi(t)),aliasTo:(e,t)=>new Hi(t,5,e)});function eo(e){if(null==e)throw new Error("key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?")}function to(e,t,i){if(e instanceof Hi&&4===e.strategy){const o=e.state;let r=o.length;const n=new Array(r);for(;r--;)n[r]=o[r].resolve(t,i);return n}return[e.resolve(t,i)]}const io="(anonymous)";function oo(e){return"object"==typeof e&&null!==e||"function"==typeof e}const ro=function(){const e=new WeakMap;let t=!1,i="",o=0;return function(r){return t=e.get(r),void 0===t&&(i=r.toString(),o=i.length,t=o>=29&&o<=100&&125===i.charCodeAt(o-1)&&i.charCodeAt(o-2)<=32&&93===i.charCodeAt(o-3)&&101===i.charCodeAt(o-4)&&100===i.charCodeAt(o-5)&&111===i.charCodeAt(o-6)&&99===i.charCodeAt(o-7)&&32===i.charCodeAt(o-8)&&101===i.charCodeAt(o-9)&&118===i.charCodeAt(o-10)&&105===i.charCodeAt(o-11)&&116===i.charCodeAt(o-12)&&97===i.charCodeAt(o-13)&&110===i.charCodeAt(o-14)&&88===i.charCodeAt(o-15),e.set(r,t)),t}}(),no={};function so(e){switch(typeof e){case"number":return e>=0&&(0|e)===e;case"string":{const t=no[e];if(void 0!==t)return t;const i=e.length;if(0===i)return no[e]=!1;let o=0;for(let t=0;t<i;++t)if(o=e.charCodeAt(t),0===t&&48===o&&i>1||o<48||o>57)return no[e]=!1;return no[e]=!0}default:return!1}}function ao(e){return`${e.toLowerCase()}:presentation`}const lo=new Map,co=Object.freeze({define(e,t,i){const o=ao(e);void 0===lo.get(o)?lo.set(o,t):lo.set(o,!1),i.register(Ji.instance(o,t))},forTag(e,t){const i=ao(e),o=lo.get(i);if(!1===o){return zi.findResponsibleContainer(t).get(i)}return o||null}});class ho{constructor(e,t){this.template=e||null,this.styles=void 0===t?null:Array.isArray(t)?Et.create(t):t instanceof Et?t:Et.create([t])}applyTo(e){const t=e.$fastController;null===t.template&&(t.template=this.template),null===t.styles&&(t.styles=this.styles)}}class uo extends Xt{constructor(){super(...arguments),this._presentation=void 0}get $presentation(){return void 0===this._presentation&&(this._presentation=co.forTag(this.tagName,this)),this._presentation}templateChanged(){void 0!==this.template&&(this.$fastController.template=this.template)}stylesChanged(){void 0!==this.styles&&(this.$fastController.styles=this.styles)}connectedCallback(){null!==this.$presentation&&this.$presentation.applyTo(this),super.connectedCallback()}static compose(e){return(t={})=>new mo(this===uo?class extends uo{}:this,e,t)}}function po(e,t,i){return"function"==typeof e?e(t,i):e}Ei([Ye],uo.prototype,"template",void 0),Ei([Ye],uo.prototype,"styles",void 0);class mo{constructor(e,t,i){this.type=e,this.elementDefinition=t,this.overrideDefinition=i,this.definition=Object.assign(Object.assign({},this.elementDefinition),this.overrideDefinition)}register(e,t){const i=this.definition,o=this.overrideDefinition,r=`${i.prefix||t.elementPrefix}-${i.baseName}`;t.tryDefineElement({name:r,type:this.type,baseClass:this.elementDefinition.baseClass,callback:e=>{const t=new ho(po(i.template,e,i),po(i.styles,e,i));e.definePresentation(t);let r=po(i.shadowOptions,e,i);e.shadowRootMode&&(r?o.shadowOptions||(r.mode=e.shadowRootMode):null!==r&&(r={mode:e.shadowRootMode})),e.defineElement({elementOptions:po(i.elementOptions,e,i),shadowOptions:r,attributes:po(i.attributes,e,i)})}})}}function fo(e,...t){const i=Mt.locate(e);t.forEach((t=>{Object.getOwnPropertyNames(t.prototype).forEach((i=>{"constructor"!==i&&Object.defineProperty(e.prototype,i,Object.getOwnPropertyDescriptor(t.prototype,i))}));Mt.locate(t).forEach((e=>i.push(e)))}))}class go extends uo{constructor(){super(...arguments),this.headinglevel=2,this.expanded=!1,this.clickHandler=e=>{this.expanded=!this.expanded,this.change()},this.change=()=>{this.$emit("change")}}}Ei([Pt({attribute:"heading-level",mode:"fromView",converter:Dt})],go.prototype,"headinglevel",void 0),Ei([Pt({mode:"boolean"})],go.prototype,"expanded",void 0),Ei([Pt],go.prototype,"id",void 0),fo(go,Ci);const vo="horizontal",bo="vertical";function yo(...e){return e.every((e=>e instanceof HTMLElement))}let xo;var wo;!function(e){e[e.alt=18]="alt",e[e.arrowDown=40]="arrowDown",e[e.arrowLeft=37]="arrowLeft",e[e.arrowRight=39]="arrowRight",e[e.arrowUp=38]="arrowUp",e[e.back=8]="back",e[e.backSlash=220]="backSlash",e[e.break=19]="break",e[e.capsLock=20]="capsLock",e[e.closeBracket=221]="closeBracket",e[e.colon=186]="colon",e[e.colon2=59]="colon2",e[e.comma=188]="comma",e[e.ctrl=17]="ctrl",e[e.delete=46]="delete",e[e.end=35]="end",e[e.enter=13]="enter",e[e.equals=187]="equals",e[e.equals2=61]="equals2",e[e.equals3=107]="equals3",e[e.escape=27]="escape",e[e.forwardSlash=191]="forwardSlash",e[e.function1=112]="function1",e[e.function10=121]="function10",e[e.function11=122]="function11",e[e.function12=123]="function12",e[e.function2=113]="function2",e[e.function3=114]="function3",e[e.function4=115]="function4",e[e.function5=116]="function5",e[e.function6=117]="function6",e[e.function7=118]="function7",e[e.function8=119]="function8",e[e.function9=120]="function9",e[e.home=36]="home",e[e.insert=45]="insert",e[e.menu=93]="menu",e[e.minus=189]="minus",e[e.minus2=109]="minus2",e[e.numLock=144]="numLock",e[e.numPad0=96]="numPad0",e[e.numPad1=97]="numPad1",e[e.numPad2=98]="numPad2",e[e.numPad3=99]="numPad3",e[e.numPad4=100]="numPad4",e[e.numPad5=101]="numPad5",e[e.numPad6=102]="numPad6",e[e.numPad7=103]="numPad7",e[e.numPad8=104]="numPad8",e[e.numPad9=105]="numPad9",e[e.numPadDivide=111]="numPadDivide",e[e.numPadDot=110]="numPadDot",e[e.numPadMinus=109]="numPadMinus",e[e.numPadMultiply=106]="numPadMultiply",e[e.numPadPlus=107]="numPadPlus",e[e.openBracket=219]="openBracket",e[e.pageDown=34]="pageDown",e[e.pageUp=33]="pageUp",e[e.period=190]="period",e[e.print=44]="print",e[e.quote=222]="quote",e[e.scrollLock=145]="scrollLock",e[e.shift=16]="shift",e[e.space=32]="space",e[e.tab=9]="tab",e[e.tilde=192]="tilde",e[e.windowsLeft=91]="windowsLeft",e[e.windowsOpera=219]="windowsOpera",e[e.windowsRight=92]="windowsRight"}(wo||(wo={}));const ko={ArrowDown:"ArrowDown",ArrowLeft:"ArrowLeft",ArrowRight:"ArrowRight",ArrowUp:"ArrowUp"};var Co;function $o(e,t,i){return i<e?t:i>t?e:i}function _o(e,t,i){return Math.min(Math.max(i,e),t)}function So(e,t,i=0){return[t,i]=[t,i].sort(((e,t)=>e-t)),t<=e&&e<i}!function(e){e.ltr="ltr",e.rtl="rtl"}(Co||(Co={}));let To=0;function Eo(e=""){return`${e}${To++}`}var Ao;!function(e){e.Canvas="Canvas",e.CanvasText="CanvasText",e.LinkText="LinkText",e.VisitedText="VisitedText",e.ActiveText="ActiveText",e.ButtonFace="ButtonFace",e.ButtonText="ButtonText",e.Field="Field",e.FieldText="FieldText",e.Highlight="Highlight",e.HighlightText="HighlightText",e.GrayText="GrayText"}(Ao||(Ao={}));const Io="single",Oo="multi";class Lo extends uo{constructor(){super(...arguments),this.expandmode=Oo,this.activeItemIndex=0,this.change=()=>{this.$emit("change",this.activeid)},this.setItems=()=>{var e;if(0!==this.accordionItems.length&&(this.accordionIds=this.getItemIds(),this.accordionItems.forEach(((e,t)=>{e instanceof go&&(e.addEventListener("change",this.activeItemChange),this.isSingleExpandMode()&&(this.activeItemIndex!==t?e.expanded=!1:e.expanded=!0));const i=this.accordionIds[t];e.setAttribute("id","string"!=typeof i?`accordion-${t+1}`:i),this.activeid=this.accordionIds[this.activeItemIndex],e.addEventListener("keydown",this.handleItemKeyDown),e.addEventListener("focus",this.handleItemFocus)})),this.isSingleExpandMode())){(null!==(e=this.findExpandedItem())&&void 0!==e?e:this.accordionItems[0]).setAttribute("aria-disabled","true")}},this.removeItemListeners=e=>{e.forEach(((e,t)=>{e.removeEventListener("change",this.activeItemChange),e.removeEventListener("keydown",this.handleItemKeyDown),e.removeEventListener("focus",this.handleItemFocus)}))},this.activeItemChange=e=>{if(e.defaultPrevented||e.target!==e.currentTarget)return;e.preventDefault();const t=e.target;this.activeid=t.getAttribute("id"),this.isSingleExpandMode()&&(this.resetItems(),t.expanded=!0,t.setAttribute("aria-disabled","true"),this.accordionItems.forEach((e=>{e.hasAttribute("disabled")||e.id===this.activeid||e.removeAttribute("aria-disabled")}))),this.activeItemIndex=Array.from(this.accordionItems).indexOf(t),this.change()},this.handleItemKeyDown=e=>{if(e.target===e.currentTarget)switch(this.accordionIds=this.getItemIds(),e.key){case"ArrowUp":e.preventDefault(),this.adjust(-1);break;case"ArrowDown":e.preventDefault(),this.adjust(1);break;case"Home":this.activeItemIndex=0,this.focusItem();break;case"End":this.activeItemIndex=this.accordionItems.length-1,this.focusItem()}},this.handleItemFocus=e=>{if(e.target===e.currentTarget){const t=e.target,i=this.activeItemIndex=Array.from(this.accordionItems).indexOf(t);this.activeItemIndex!==i&&-1!==i&&(this.activeItemIndex=i,this.activeid=this.accordionIds[this.activeItemIndex])}}}accordionItemsChanged(e,t){this.$fastController.isConnected&&(this.removeItemListeners(e),this.setItems())}findExpandedItem(){for(let e=0;e<this.accordionItems.length;e++)if("true"===this.accordionItems[e].getAttribute("expanded"))return this.accordionItems[e];return null}resetItems(){this.accordionItems.forEach(((e,t)=>{e.expanded=!1}))}getItemIds(){return this.accordionItems.map((e=>e.getAttribute("id")))}isSingleExpandMode(){return this.expandmode===Io}adjust(e){this.activeItemIndex=$o(0,this.accordionItems.length-1,this.activeItemIndex+e),this.focusItem()}focusItem(){const e=this.accordionItems[this.activeItemIndex];e instanceof go&&e.expandbutton.focus()}}Ei([Pt({attribute:"expand-mode"})],Lo.prototype,"expandmode",void 0),Ei([Ye],Lo.prototype,"accordionItems",void 0);const Fo=(e,t)=>Tt`
    <a
        class="control"
        part="control"
        download="${e=>e.download}"
        href="${e=>e.href}"
        hreflang="${e=>e.hreflang}"
        ping="${e=>e.ping}"
        referrerpolicy="${e=>e.referrerpolicy}"
        rel="${e=>e.rel}"
        target="${e=>e.target}"
        type="${e=>e.type}"
        aria-atomic="${e=>e.ariaAtomic}"
        aria-busy="${e=>e.ariaBusy}"
        aria-controls="${e=>e.ariaControls}"
        aria-current="${e=>e.ariaCurrent}"
        aria-describedby="${e=>e.ariaDescribedby}"
        aria-details="${e=>e.ariaDetails}"
        aria-disabled="${e=>e.ariaDisabled}"
        aria-errormessage="${e=>e.ariaErrormessage}"
        aria-expanded="${e=>e.ariaExpanded}"
        aria-flowto="${e=>e.ariaFlowto}"
        aria-haspopup="${e=>e.ariaHaspopup}"
        aria-hidden="${e=>e.ariaHidden}"
        aria-invalid="${e=>e.ariaInvalid}"
        aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
        aria-label="${e=>e.ariaLabel}"
        aria-labelledby="${e=>e.ariaLabelledby}"
        aria-live="${e=>e.ariaLive}"
        aria-owns="${e=>e.ariaOwns}"
        aria-relevant="${e=>e.ariaRelevant}"
        aria-roledescription="${e=>e.ariaRoledescription}"
        ${di("control")}
    >
        ${_i(0,t)}
        <span class="content" part="content">
            <slot ${xi("defaultSlottedContent")}></slot>
        </span>
        ${$i(0,t)}
    </a>
`;class Mo{}Ei([Pt({attribute:"aria-atomic"})],Mo.prototype,"ariaAtomic",void 0),Ei([Pt({attribute:"aria-busy"})],Mo.prototype,"ariaBusy",void 0),Ei([Pt({attribute:"aria-controls"})],Mo.prototype,"ariaControls",void 0),Ei([Pt({attribute:"aria-current"})],Mo.prototype,"ariaCurrent",void 0),Ei([Pt({attribute:"aria-describedby"})],Mo.prototype,"ariaDescribedby",void 0),Ei([Pt({attribute:"aria-details"})],Mo.prototype,"ariaDetails",void 0),Ei([Pt({attribute:"aria-disabled"})],Mo.prototype,"ariaDisabled",void 0),Ei([Pt({attribute:"aria-errormessage"})],Mo.prototype,"ariaErrormessage",void 0),Ei([Pt({attribute:"aria-flowto"})],Mo.prototype,"ariaFlowto",void 0),Ei([Pt({attribute:"aria-haspopup"})],Mo.prototype,"ariaHaspopup",void 0),Ei([Pt({attribute:"aria-hidden"})],Mo.prototype,"ariaHidden",void 0),Ei([Pt({attribute:"aria-invalid"})],Mo.prototype,"ariaInvalid",void 0),Ei([Pt({attribute:"aria-keyshortcuts"})],Mo.prototype,"ariaKeyshortcuts",void 0),Ei([Pt({attribute:"aria-label"})],Mo.prototype,"ariaLabel",void 0),Ei([Pt({attribute:"aria-labelledby"})],Mo.prototype,"ariaLabelledby",void 0),Ei([Pt({attribute:"aria-live"})],Mo.prototype,"ariaLive",void 0),Ei([Pt({attribute:"aria-owns"})],Mo.prototype,"ariaOwns",void 0),Ei([Pt({attribute:"aria-relevant"})],Mo.prototype,"ariaRelevant",void 0),Ei([Pt({attribute:"aria-roledescription"})],Mo.prototype,"ariaRoledescription",void 0);let Ro=class extends uo{constructor(){super(...arguments),this.handleUnsupportedDelegatesFocus=()=>{var e;window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus")&&(null===(e=this.$fastController.definition.shadowOptions)||void 0===e?void 0:e.delegatesFocus)&&(this.focus=()=>{this.control.focus()})}}connectedCallback(){super.connectedCallback(),this.handleUnsupportedDelegatesFocus()}};Ei([Pt],Ro.prototype,"download",void 0),Ei([Pt],Ro.prototype,"href",void 0),Ei([Pt],Ro.prototype,"hreflang",void 0),Ei([Pt],Ro.prototype,"ping",void 0),Ei([Pt],Ro.prototype,"referrerpolicy",void 0),Ei([Pt],Ro.prototype,"rel",void 0),Ei([Pt],Ro.prototype,"target",void 0),Ei([Pt],Ro.prototype,"type",void 0),Ei([Ye],Ro.prototype,"defaultSlottedContent",void 0);class Do{}Ei([Pt({attribute:"aria-expanded"})],Do.prototype,"ariaExpanded",void 0),fo(Do,Mo),fo(Ro,Ci,Do);const zo=e=>{const t=e.closest("[dir]");return null!==t&&"rtl"===t.dir?Co.rtl:Co.ltr};class Po extends uo{constructor(){super(...arguments),this.anchor="",this.viewport="",this.horizontalPositioningMode="uncontrolled",this.horizontalDefaultPosition="unset",this.horizontalViewportLock=!1,this.horizontalInset=!1,this.horizontalScaling="content",this.verticalPositioningMode="uncontrolled",this.verticalDefaultPosition="unset",this.verticalViewportLock=!1,this.verticalInset=!1,this.verticalScaling="content",this.fixedPlacement=!1,this.autoUpdateMode="anchor",this.anchorElement=null,this.viewportElement=null,this.initialLayoutComplete=!1,this.resizeDetector=null,this.baseHorizontalOffset=0,this.baseVerticalOffset=0,this.pendingPositioningUpdate=!1,this.pendingReset=!1,this.currentDirection=Co.ltr,this.regionVisible=!1,this.forceUpdate=!1,this.updateThreshold=.5,this.update=()=>{this.pendingPositioningUpdate||this.requestPositionUpdates()},this.startObservers=()=>{this.stopObservers(),null!==this.anchorElement&&(this.requestPositionUpdates(),null!==this.resizeDetector&&(this.resizeDetector.observe(this.anchorElement),this.resizeDetector.observe(this)))},this.requestPositionUpdates=()=>{null===this.anchorElement||this.pendingPositioningUpdate||(Po.intersectionService.requestPosition(this,this.handleIntersection),Po.intersectionService.requestPosition(this.anchorElement,this.handleIntersection),null!==this.viewportElement&&Po.intersectionService.requestPosition(this.viewportElement,this.handleIntersection),this.pendingPositioningUpdate=!0)},this.stopObservers=()=>{this.pendingPositioningUpdate&&(this.pendingPositioningUpdate=!1,Po.intersectionService.cancelRequestPosition(this,this.handleIntersection),null!==this.anchorElement&&Po.intersectionService.cancelRequestPosition(this.anchorElement,this.handleIntersection),null!==this.viewportElement&&Po.intersectionService.cancelRequestPosition(this.viewportElement,this.handleIntersection)),null!==this.resizeDetector&&this.resizeDetector.disconnect()},this.getViewport=()=>"string"!=typeof this.viewport||""===this.viewport?document.documentElement:document.getElementById(this.viewport),this.getAnchor=()=>document.getElementById(this.anchor),this.handleIntersection=e=>{this.pendingPositioningUpdate&&(this.pendingPositioningUpdate=!1,this.applyIntersectionEntries(e)&&this.updateLayout())},this.applyIntersectionEntries=e=>{const t=e.find((e=>e.target===this)),i=e.find((e=>e.target===this.anchorElement)),o=e.find((e=>e.target===this.viewportElement));return void 0!==t&&void 0!==o&&void 0!==i&&(!!(!this.regionVisible||this.forceUpdate||void 0===this.regionRect||void 0===this.anchorRect||void 0===this.viewportRect||this.isRectDifferent(this.anchorRect,i.boundingClientRect)||this.isRectDifferent(this.viewportRect,o.boundingClientRect)||this.isRectDifferent(this.regionRect,t.boundingClientRect))&&(this.regionRect=t.boundingClientRect,this.anchorRect=i.boundingClientRect,this.viewportElement===document.documentElement?this.viewportRect=new DOMRectReadOnly(o.boundingClientRect.x+document.documentElement.scrollLeft,o.boundingClientRect.y+document.documentElement.scrollTop,o.boundingClientRect.width,o.boundingClientRect.height):this.viewportRect=o.boundingClientRect,this.updateRegionOffset(),this.forceUpdate=!1,!0))},this.updateRegionOffset=()=>{this.anchorRect&&this.regionRect&&(this.baseHorizontalOffset=this.baseHorizontalOffset+(this.anchorRect.left-this.regionRect.left)+(this.translateX-this.baseHorizontalOffset),this.baseVerticalOffset=this.baseVerticalOffset+(this.anchorRect.top-this.regionRect.top)+(this.translateY-this.baseVerticalOffset))},this.isRectDifferent=(e,t)=>Math.abs(e.top-t.top)>this.updateThreshold||Math.abs(e.right-t.right)>this.updateThreshold||Math.abs(e.bottom-t.bottom)>this.updateThreshold||Math.abs(e.left-t.left)>this.updateThreshold,this.handleResize=e=>{this.update()},this.reset=()=>{this.pendingReset&&(this.pendingReset=!1,null===this.anchorElement&&(this.anchorElement=this.getAnchor()),null===this.viewportElement&&(this.viewportElement=this.getViewport()),this.currentDirection=zo(this),this.startObservers())},this.updateLayout=()=>{let e,t;if("uncontrolled"!==this.horizontalPositioningMode){const e=this.getPositioningOptions(this.horizontalInset);if("center"===this.horizontalDefaultPosition)t="center";else if("unset"!==this.horizontalDefaultPosition){let e=this.horizontalDefaultPosition;if("start"===e||"end"===e){const t=zo(this);if(t!==this.currentDirection)return this.currentDirection=t,void this.initialize();e=this.currentDirection===Co.ltr?"start"===e?"left":"right":"start"===e?"right":"left"}switch(e){case"left":t=this.horizontalInset?"insetStart":"start";break;case"right":t=this.horizontalInset?"insetEnd":"end"}}const i=void 0!==this.horizontalThreshold?this.horizontalThreshold:void 0!==this.regionRect?this.regionRect.width:0,o=void 0!==this.anchorRect?this.anchorRect.left:0,r=void 0!==this.anchorRect?this.anchorRect.right:0,n=void 0!==this.anchorRect?this.anchorRect.width:0,s=void 0!==this.viewportRect?this.viewportRect.left:0,a=void 0!==this.viewportRect?this.viewportRect.right:0;(void 0===t||"locktodefault"!==this.horizontalPositioningMode&&this.getAvailableSpace(t,o,r,n,s,a)<i)&&(t=this.getAvailableSpace(e[0],o,r,n,s,a)>this.getAvailableSpace(e[1],o,r,n,s,a)?e[0]:e[1])}if("uncontrolled"!==this.verticalPositioningMode){const t=this.getPositioningOptions(this.verticalInset);if("center"===this.verticalDefaultPosition)e="center";else if("unset"!==this.verticalDefaultPosition)switch(this.verticalDefaultPosition){case"top":e=this.verticalInset?"insetStart":"start";break;case"bottom":e=this.verticalInset?"insetEnd":"end"}const i=void 0!==this.verticalThreshold?this.verticalThreshold:void 0!==this.regionRect?this.regionRect.height:0,o=void 0!==this.anchorRect?this.anchorRect.top:0,r=void 0!==this.anchorRect?this.anchorRect.bottom:0,n=void 0!==this.anchorRect?this.anchorRect.height:0,s=void 0!==this.viewportRect?this.viewportRect.top:0,a=void 0!==this.viewportRect?this.viewportRect.bottom:0;(void 0===e||"locktodefault"!==this.verticalPositioningMode&&this.getAvailableSpace(e,o,r,n,s,a)<i)&&(e=this.getAvailableSpace(t[0],o,r,n,s,a)>this.getAvailableSpace(t[1],o,r,n,s,a)?t[0]:t[1])}const i=this.getNextRegionDimension(t,e),o=this.horizontalPosition!==t||this.verticalPosition!==e;if(this.setHorizontalPosition(t,i),this.setVerticalPosition(e,i),this.updateRegionStyle(),!this.initialLayoutComplete)return this.initialLayoutComplete=!0,void this.requestPositionUpdates();this.regionVisible||(this.regionVisible=!0,this.style.removeProperty("pointer-events"),this.style.removeProperty("opacity"),this.classList.toggle("loaded",!0),this.$emit("loaded",this,{bubbles:!1})),this.updatePositionClasses(),o&&this.$emit("positionchange",this,{bubbles:!1})},this.updateRegionStyle=()=>{this.style.width=this.regionWidth,this.style.height=this.regionHeight,this.style.transform=`translate(${this.translateX}px, ${this.translateY}px)`},this.updatePositionClasses=()=>{this.classList.toggle("top","start"===this.verticalPosition),this.classList.toggle("bottom","end"===this.verticalPosition),this.classList.toggle("inset-top","insetStart"===this.verticalPosition),this.classList.toggle("inset-bottom","insetEnd"===this.verticalPosition),this.classList.toggle("vertical-center","center"===this.verticalPosition),this.classList.toggle("left","start"===this.horizontalPosition),this.classList.toggle("right","end"===this.horizontalPosition),this.classList.toggle("inset-left","insetStart"===this.horizontalPosition),this.classList.toggle("inset-right","insetEnd"===this.horizontalPosition),this.classList.toggle("horizontal-center","center"===this.horizontalPosition)},this.setHorizontalPosition=(e,t)=>{if(void 0===e||void 0===this.regionRect||void 0===this.anchorRect||void 0===this.viewportRect)return;let i=0;switch(this.horizontalScaling){case"anchor":case"fill":i=this.horizontalViewportLock?this.viewportRect.width:t.width,this.regionWidth=`${i}px`;break;case"content":i=this.regionRect.width,this.regionWidth="unset"}let o=0;switch(e){case"start":this.translateX=this.baseHorizontalOffset-i,this.horizontalViewportLock&&this.anchorRect.left>this.viewportRect.right&&(this.translateX=this.translateX-(this.anchorRect.left-this.viewportRect.right));break;case"insetStart":this.translateX=this.baseHorizontalOffset-i+this.anchorRect.width,this.horizontalViewportLock&&this.anchorRect.right>this.viewportRect.right&&(this.translateX=this.translateX-(this.anchorRect.right-this.viewportRect.right));break;case"insetEnd":this.translateX=this.baseHorizontalOffset,this.horizontalViewportLock&&this.anchorRect.left<this.viewportRect.left&&(this.translateX=this.translateX-(this.anchorRect.left-this.viewportRect.left));break;case"end":this.translateX=this.baseHorizontalOffset+this.anchorRect.width,this.horizontalViewportLock&&this.anchorRect.right<this.viewportRect.left&&(this.translateX=this.translateX-(this.anchorRect.right-this.viewportRect.left));break;case"center":if(o=(this.anchorRect.width-i)/2,this.translateX=this.baseHorizontalOffset+o,this.horizontalViewportLock){const e=this.anchorRect.left+o,t=this.anchorRect.right-o;e<this.viewportRect.left&&!(t>this.viewportRect.right)?this.translateX=this.translateX-(e-this.viewportRect.left):t>this.viewportRect.right&&!(e<this.viewportRect.left)&&(this.translateX=this.translateX-(t-this.viewportRect.right))}}this.horizontalPosition=e},this.setVerticalPosition=(e,t)=>{if(void 0===e||void 0===this.regionRect||void 0===this.anchorRect||void 0===this.viewportRect)return;let i=0;switch(this.verticalScaling){case"anchor":case"fill":i=this.verticalViewportLock?this.viewportRect.height:t.height,this.regionHeight=`${i}px`;break;case"content":i=this.regionRect.height,this.regionHeight="unset"}let o=0;switch(e){case"start":this.translateY=this.baseVerticalOffset-i,this.verticalViewportLock&&this.anchorRect.top>this.viewportRect.bottom&&(this.translateY=this.translateY-(this.anchorRect.top-this.viewportRect.bottom));break;case"insetStart":this.translateY=this.baseVerticalOffset-i+this.anchorRect.height,this.verticalViewportLock&&this.anchorRect.bottom>this.viewportRect.bottom&&(this.translateY=this.translateY-(this.anchorRect.bottom-this.viewportRect.bottom));break;case"insetEnd":this.translateY=this.baseVerticalOffset,this.verticalViewportLock&&this.anchorRect.top<this.viewportRect.top&&(this.translateY=this.translateY-(this.anchorRect.top-this.viewportRect.top));break;case"end":this.translateY=this.baseVerticalOffset+this.anchorRect.height,this.verticalViewportLock&&this.anchorRect.bottom<this.viewportRect.top&&(this.translateY=this.translateY-(this.anchorRect.bottom-this.viewportRect.top));break;case"center":if(o=(this.anchorRect.height-i)/2,this.translateY=this.baseVerticalOffset+o,this.verticalViewportLock){const e=this.anchorRect.top+o,t=this.anchorRect.bottom-o;e<this.viewportRect.top&&!(t>this.viewportRect.bottom)?this.translateY=this.translateY-(e-this.viewportRect.top):t>this.viewportRect.bottom&&!(e<this.viewportRect.top)&&(this.translateY=this.translateY-(t-this.viewportRect.bottom))}}this.verticalPosition=e},this.getPositioningOptions=e=>e?["insetStart","insetEnd"]:["start","end"],this.getAvailableSpace=(e,t,i,o,r,n)=>{const s=t-r,a=n-(t+o);switch(e){case"start":return s;case"insetStart":return s+o;case"insetEnd":return a+o;case"end":return a;case"center":return 2*Math.min(s,a)+o}},this.getNextRegionDimension=(e,t)=>{const i={height:void 0!==this.regionRect?this.regionRect.height:0,width:void 0!==this.regionRect?this.regionRect.width:0};return void 0!==e&&"fill"===this.horizontalScaling?i.width=this.getAvailableSpace(e,void 0!==this.anchorRect?this.anchorRect.left:0,void 0!==this.anchorRect?this.anchorRect.right:0,void 0!==this.anchorRect?this.anchorRect.width:0,void 0!==this.viewportRect?this.viewportRect.left:0,void 0!==this.viewportRect?this.viewportRect.right:0):"anchor"===this.horizontalScaling&&(i.width=void 0!==this.anchorRect?this.anchorRect.width:0),void 0!==t&&"fill"===this.verticalScaling?i.height=this.getAvailableSpace(t,void 0!==this.anchorRect?this.anchorRect.top:0,void 0!==this.anchorRect?this.anchorRect.bottom:0,void 0!==this.anchorRect?this.anchorRect.height:0,void 0!==this.viewportRect?this.viewportRect.top:0,void 0!==this.viewportRect?this.viewportRect.bottom:0):"anchor"===this.verticalScaling&&(i.height=void 0!==this.anchorRect?this.anchorRect.height:0),i},this.startAutoUpdateEventListeners=()=>{window.addEventListener("resize",this.update,{passive:!0}),window.addEventListener("scroll",this.update,{passive:!0,capture:!0}),null!==this.resizeDetector&&null!==this.viewportElement&&this.resizeDetector.observe(this.viewportElement)},this.stopAutoUpdateEventListeners=()=>{window.removeEventListener("resize",this.update),window.removeEventListener("scroll",this.update),null!==this.resizeDetector&&null!==this.viewportElement&&this.resizeDetector.unobserve(this.viewportElement)}}anchorChanged(){this.initialLayoutComplete&&(this.anchorElement=this.getAnchor())}viewportChanged(){this.initialLayoutComplete&&(this.viewportElement=this.getViewport())}horizontalPositioningModeChanged(){this.requestReset()}horizontalDefaultPositionChanged(){this.updateForAttributeChange()}horizontalViewportLockChanged(){this.updateForAttributeChange()}horizontalInsetChanged(){this.updateForAttributeChange()}horizontalThresholdChanged(){this.updateForAttributeChange()}horizontalScalingChanged(){this.updateForAttributeChange()}verticalPositioningModeChanged(){this.requestReset()}verticalDefaultPositionChanged(){this.updateForAttributeChange()}verticalViewportLockChanged(){this.updateForAttributeChange()}verticalInsetChanged(){this.updateForAttributeChange()}verticalThresholdChanged(){this.updateForAttributeChange()}verticalScalingChanged(){this.updateForAttributeChange()}fixedPlacementChanged(){this.$fastController.isConnected&&this.initialLayoutComplete&&this.initialize()}autoUpdateModeChanged(e,t){this.$fastController.isConnected&&this.initialLayoutComplete&&("auto"===e&&this.stopAutoUpdateEventListeners(),"auto"===t&&this.startAutoUpdateEventListeners())}anchorElementChanged(){this.requestReset()}viewportElementChanged(){this.$fastController.isConnected&&this.initialLayoutComplete&&this.initialize()}connectedCallback(){super.connectedCallback(),"auto"===this.autoUpdateMode&&this.startAutoUpdateEventListeners(),this.initialize()}disconnectedCallback(){super.disconnectedCallback(),"auto"===this.autoUpdateMode&&this.stopAutoUpdateEventListeners(),this.stopObservers(),this.disconnectResizeDetector()}adoptedCallback(){this.initialize()}disconnectResizeDetector(){null!==this.resizeDetector&&(this.resizeDetector.disconnect(),this.resizeDetector=null)}initializeResizeDetector(){this.disconnectResizeDetector(),this.resizeDetector=new window.ResizeObserver(this.handleResize)}updateForAttributeChange(){this.$fastController.isConnected&&this.initialLayoutComplete&&(this.forceUpdate=!0,this.update())}initialize(){this.initializeResizeDetector(),null===this.anchorElement&&(this.anchorElement=this.getAnchor()),this.requestReset()}requestReset(){this.$fastController.isConnected&&!1===this.pendingReset&&(this.setInitialState(),Ge.queueUpdate((()=>this.reset())),this.pendingReset=!0)}setInitialState(){this.initialLayoutComplete=!1,this.regionVisible=!1,this.translateX=0,this.translateY=0,this.baseHorizontalOffset=0,this.baseVerticalOffset=0,this.viewportRect=void 0,this.regionRect=void 0,this.anchorRect=void 0,this.verticalPosition=void 0,this.horizontalPosition=void 0,this.style.opacity="0",this.style.pointerEvents="none",this.forceUpdate=!1,this.style.position=this.fixedPlacement?"fixed":"absolute",this.updatePositionClasses(),this.updateRegionStyle()}}Po.intersectionService=new class{constructor(){this.intersectionDetector=null,this.observedElements=new Map,this.requestPosition=(e,t)=>{var i;null!==this.intersectionDetector&&(this.observedElements.has(e)?null===(i=this.observedElements.get(e))||void 0===i||i.push(t):(this.observedElements.set(e,[t]),this.intersectionDetector.observe(e)))},this.cancelRequestPosition=(e,t)=>{const i=this.observedElements.get(e);if(void 0!==i){const e=i.indexOf(t);-1!==e&&i.splice(e,1)}},this.initializeIntersectionDetector=()=>{De.IntersectionObserver&&(this.intersectionDetector=new IntersectionObserver(this.handleIntersection,{root:null,rootMargin:"0px",threshold:[0,1]}))},this.handleIntersection=e=>{if(null===this.intersectionDetector)return;const t=[],i=[];e.forEach((e=>{var o;null===(o=this.intersectionDetector)||void 0===o||o.unobserve(e.target);const r=this.observedElements.get(e.target);void 0!==r&&(r.forEach((o=>{let r=t.indexOf(o);-1===r&&(r=t.length,t.push(o),i.push([])),i[r].push(e)})),this.observedElements.delete(e.target))})),t.forEach(((e,t)=>{e(i[t])}))},this.initializeIntersectionDetector()}},Ei([Pt],Po.prototype,"anchor",void 0),Ei([Pt],Po.prototype,"viewport",void 0),Ei([Pt({attribute:"horizontal-positioning-mode"})],Po.prototype,"horizontalPositioningMode",void 0),Ei([Pt({attribute:"horizontal-default-position"})],Po.prototype,"horizontalDefaultPosition",void 0),Ei([Pt({attribute:"horizontal-viewport-lock",mode:"boolean"})],Po.prototype,"horizontalViewportLock",void 0),Ei([Pt({attribute:"horizontal-inset",mode:"boolean"})],Po.prototype,"horizontalInset",void 0),Ei([Pt({attribute:"horizontal-threshold"})],Po.prototype,"horizontalThreshold",void 0),Ei([Pt({attribute:"horizontal-scaling"})],Po.prototype,"horizontalScaling",void 0),Ei([Pt({attribute:"vertical-positioning-mode"})],Po.prototype,"verticalPositioningMode",void 0),Ei([Pt({attribute:"vertical-default-position"})],Po.prototype,"verticalDefaultPosition",void 0),Ei([Pt({attribute:"vertical-viewport-lock",mode:"boolean"})],Po.prototype,"verticalViewportLock",void 0),Ei([Pt({attribute:"vertical-inset",mode:"boolean"})],Po.prototype,"verticalInset",void 0),Ei([Pt({attribute:"vertical-threshold"})],Po.prototype,"verticalThreshold",void 0),Ei([Pt({attribute:"vertical-scaling"})],Po.prototype,"verticalScaling",void 0),Ei([Pt({attribute:"fixed-placement",mode:"boolean"})],Po.prototype,"fixedPlacement",void 0),Ei([Pt({attribute:"auto-update-mode"})],Po.prototype,"autoUpdateMode",void 0),Ei([Ye],Po.prototype,"anchorElement",void 0),Ei([Ye],Po.prototype,"viewportElement",void 0),Ei([Ye],Po.prototype,"initialLayoutComplete",void 0);const No={horizontalDefaultPosition:"center",horizontalPositioningMode:"locktodefault",horizontalInset:!1,horizontalScaling:"anchor"},Ho=Object.assign(Object.assign({},No),{verticalDefaultPosition:"top",verticalPositioningMode:"locktodefault",verticalInset:!1,verticalScaling:"content"}),Bo=Object.assign(Object.assign({},No),{verticalDefaultPosition:"bottom",verticalPositioningMode:"locktodefault",verticalInset:!1,verticalScaling:"content"}),Vo=Object.assign(Object.assign({},No),{verticalPositioningMode:"dynamic",verticalInset:!1,verticalScaling:"content"}),jo=Object.assign(Object.assign({},Ho),{verticalScaling:"fill"}),Uo=Object.assign(Object.assign({},Bo),{verticalScaling:"fill"}),Wo=Object.assign(Object.assign({},Vo),{verticalScaling:"fill"});let qo=class extends uo{connectedCallback(){super.connectedCallback(),this.shape||(this.shape="circle")}};Ei([Pt],qo.prototype,"fill",void 0),Ei([Pt],qo.prototype,"color",void 0),Ei([Pt],qo.prototype,"link",void 0),Ei([Pt],qo.prototype,"shape",void 0);class Go extends uo{constructor(){super(...arguments),this.generateBadgeStyle=()=>{if(!this.fill&&!this.color)return;const e=`background-color: var(--badge-fill-${this.fill});`,t=`color: var(--badge-color-${this.color});`;return this.fill&&!this.color?e:this.color&&!this.fill?t:`${t} ${e}`}}}Ei([Pt({attribute:"fill"})],Go.prototype,"fill",void 0),Ei([Pt({attribute:"color"})],Go.prototype,"color",void 0),Ei([Pt({mode:"boolean"})],Go.prototype,"circular",void 0);class Xo extends Ro{constructor(){super(...arguments),this.separator=!0}}Ei([Ye],Xo.prototype,"separator",void 0),fo(Xo,Ci,Do);class Ko extends uo{slottedBreadcrumbItemsChanged(){if(this.$fastController.isConnected){if(void 0===this.slottedBreadcrumbItems||0===this.slottedBreadcrumbItems.length)return;const e=this.slottedBreadcrumbItems[this.slottedBreadcrumbItems.length-1];this.slottedBreadcrumbItems.forEach((t=>{const i=t===e;this.setItemSeparator(t,i),this.setAriaCurrent(t,i)}))}}setItemSeparator(e,t){e instanceof Xo&&(e.separator=!t)}findChildWithHref(e){var t,i;return e.childElementCount>0?e.querySelector("a[href]"):(null===(t=e.shadowRoot)||void 0===t?void 0:t.childElementCount)?null===(i=e.shadowRoot)||void 0===i?void 0:i.querySelector("a[href]"):null}setAriaCurrent(e,t){const i=this.findChildWithHref(e);null===i&&e.hasAttribute("href")&&e instanceof Xo?t?e.setAttribute("aria-current","page"):e.removeAttribute("aria-current"):null!==i&&(t?i.setAttribute("aria-current","page"):i.removeAttribute("aria-current"))}}Ei([Ye],Ko.prototype,"slottedBreadcrumbItems",void 0);const Zo="ElementInternals"in window&&"setFormValue"in window.ElementInternals.prototype,Yo=new WeakMap;function Qo(e){const t=class extends e{constructor(...e){super(...e),this.dirtyValue=!1,this.disabled=!1,this.proxyEventsToBlock=["change","click"],this.proxyInitialized=!1,this.required=!1,this.initialValue=this.initialValue||"",this.elementInternals||(this.formResetCallback=this.formResetCallback.bind(this))}static get formAssociated(){return Zo}get validity(){return this.elementInternals?this.elementInternals.validity:this.proxy.validity}get form(){return this.elementInternals?this.elementInternals.form:this.proxy.form}get validationMessage(){return this.elementInternals?this.elementInternals.validationMessage:this.proxy.validationMessage}get willValidate(){return this.elementInternals?this.elementInternals.willValidate:this.proxy.willValidate}get labels(){if(this.elementInternals)return Object.freeze(Array.from(this.elementInternals.labels));if(this.proxy instanceof HTMLElement&&this.proxy.ownerDocument&&this.id){const e=this.proxy.labels,t=Array.from(this.proxy.getRootNode().querySelectorAll(`[for='${this.id}']`)),i=e?t.concat(Array.from(e)):t;return Object.freeze(i)}return Ne}valueChanged(e,t){this.dirtyValue=!0,this.proxy instanceof HTMLElement&&(this.proxy.value=this.value),this.currentValue=this.value,this.setFormValue(this.value),this.validate()}currentValueChanged(){this.value=this.currentValue}initialValueChanged(e,t){this.dirtyValue||(this.value=this.initialValue,this.dirtyValue=!1)}disabledChanged(e,t){this.proxy instanceof HTMLElement&&(this.proxy.disabled=this.disabled),Ge.queueUpdate((()=>this.classList.toggle("disabled",this.disabled)))}nameChanged(e,t){this.proxy instanceof HTMLElement&&(this.proxy.name=this.name)}requiredChanged(e,t){this.proxy instanceof HTMLElement&&(this.proxy.required=this.required),Ge.queueUpdate((()=>this.classList.toggle("required",this.required))),this.validate()}get elementInternals(){if(!Zo)return null;let e=Yo.get(this);return e||(e=this.attachInternals(),Yo.set(this,e)),e}connectedCallback(){super.connectedCallback(),this.addEventListener("keypress",this._keypressHandler),this.value||(this.value=this.initialValue,this.dirtyValue=!1),this.elementInternals||(this.attachProxy(),this.form&&this.form.addEventListener("reset",this.formResetCallback))}disconnectedCallback(){this.proxyEventsToBlock.forEach((e=>this.proxy.removeEventListener(e,this.stopPropagation))),!this.elementInternals&&this.form&&this.form.removeEventListener("reset",this.formResetCallback)}checkValidity(){return this.elementInternals?this.elementInternals.checkValidity():this.proxy.checkValidity()}reportValidity(){return this.elementInternals?this.elementInternals.reportValidity():this.proxy.reportValidity()}setValidity(e,t,i){this.elementInternals?this.elementInternals.setValidity(e,t,i):"string"==typeof t&&this.proxy.setCustomValidity(t)}formDisabledCallback(e){this.disabled=e}formResetCallback(){this.value=this.initialValue,this.dirtyValue=!1}attachProxy(){var e;this.proxyInitialized||(this.proxyInitialized=!0,this.proxy.style.display="none",this.proxyEventsToBlock.forEach((e=>this.proxy.addEventListener(e,this.stopPropagation))),this.proxy.disabled=this.disabled,this.proxy.required=this.required,"string"==typeof this.name&&(this.proxy.name=this.name),"string"==typeof this.value&&(this.proxy.value=this.value),this.proxy.setAttribute("slot","form-associated-proxy"),this.proxySlot=document.createElement("slot"),this.proxySlot.setAttribute("name","form-associated-proxy")),null===(e=this.shadowRoot)||void 0===e||e.appendChild(this.proxySlot),this.appendChild(this.proxy)}detachProxy(){var e;this.removeChild(this.proxy),null===(e=this.shadowRoot)||void 0===e||e.removeChild(this.proxySlot)}validate(e){this.proxy instanceof HTMLElement&&this.setValidity(this.proxy.validity,this.proxy.validationMessage,e)}setFormValue(e,t){this.elementInternals&&this.elementInternals.setFormValue(e,t||e)}_keypressHandler(e){if("Enter"===e.key)if(this.form instanceof HTMLFormElement){const e=this.form.querySelector("[type=submit]");null==e||e.click()}}stopPropagation(e){e.stopPropagation()}};return Pt({mode:"boolean"})(t.prototype,"disabled"),Pt({mode:"fromView",attribute:"value"})(t.prototype,"initialValue"),Pt({attribute:"current-value"})(t.prototype,"currentValue"),Pt(t.prototype,"name"),Pt({mode:"boolean"})(t.prototype,"required"),Ye(t.prototype,"value"),t}function Jo(e){class t extends(Qo(e)){}class i extends t{constructor(...e){super(e),this.dirtyChecked=!1,this.checkedAttribute=!1,this.checked=!1,this.dirtyChecked=!1}checkedAttributeChanged(){this.defaultChecked=this.checkedAttribute}defaultCheckedChanged(){this.dirtyChecked||(this.checked=this.defaultChecked,this.dirtyChecked=!1)}checkedChanged(e,t){this.dirtyChecked||(this.dirtyChecked=!0),this.currentChecked=this.checked,this.updateForm(),this.proxy instanceof HTMLInputElement&&(this.proxy.checked=this.checked),void 0!==e&&this.$emit("change"),this.validate()}currentCheckedChanged(e,t){this.checked=this.currentChecked}updateForm(){const e=this.checked?this.value:null;this.setFormValue(e,e)}connectedCallback(){super.connectedCallback(),this.updateForm()}formResetCallback(){super.formResetCallback(),this.checked=!!this.checkedAttribute,this.dirtyChecked=!1}}return Pt({attribute:"checked",mode:"boolean"})(i.prototype,"checkedAttribute"),Pt({attribute:"current-checked",converter:Rt})(i.prototype,"currentChecked"),Ye(i.prototype,"defaultChecked"),Ye(i.prototype,"checked"),i}class er extends uo{}class tr extends(Qo(er)){constructor(){super(...arguments),this.proxy=document.createElement("input")}}let ir=class extends tr{constructor(){super(...arguments),this.handleClick=e=>{var t;this.disabled&&(null===(t=this.defaultSlottedContent)||void 0===t?void 0:t.length)<=1&&e.stopPropagation()},this.handleSubmission=()=>{if(!this.form)return;const e=this.proxy.isConnected;e||this.attachProxy(),"function"==typeof this.form.requestSubmit?this.form.requestSubmit(this.proxy):this.proxy.click(),e||this.detachProxy()},this.handleFormReset=()=>{var e;null===(e=this.form)||void 0===e||e.reset()},this.handleUnsupportedDelegatesFocus=()=>{var e;window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus")&&(null===(e=this.$fastController.definition.shadowOptions)||void 0===e?void 0:e.delegatesFocus)&&(this.focus=()=>{this.control.focus()})}}formactionChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formAction=this.formaction)}formenctypeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formEnctype=this.formenctype)}formmethodChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formMethod=this.formmethod)}formnovalidateChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formNoValidate=this.formnovalidate)}formtargetChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formTarget=this.formtarget)}typeChanged(e,t){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type),"submit"===t&&this.addEventListener("click",this.handleSubmission),"submit"===e&&this.removeEventListener("click",this.handleSubmission),"reset"===t&&this.addEventListener("click",this.handleFormReset),"reset"===e&&this.removeEventListener("click",this.handleFormReset)}validate(){super.validate(this.control)}connectedCallback(){var e;super.connectedCallback(),this.proxy.setAttribute("type",this.type),this.handleUnsupportedDelegatesFocus();const t=Array.from(null===(e=this.control)||void 0===e?void 0:e.children);t&&t.forEach((e=>{e.addEventListener("click",this.handleClick)}))}disconnectedCallback(){var e;super.disconnectedCallback();const t=Array.from(null===(e=this.control)||void 0===e?void 0:e.children);t&&t.forEach((e=>{e.removeEventListener("click",this.handleClick)}))}};Ei([Pt({mode:"boolean"})],ir.prototype,"autofocus",void 0),Ei([Pt({attribute:"form"})],ir.prototype,"formId",void 0),Ei([Pt],ir.prototype,"formaction",void 0),Ei([Pt],ir.prototype,"formenctype",void 0),Ei([Pt],ir.prototype,"formmethod",void 0),Ei([Pt({mode:"boolean"})],ir.prototype,"formnovalidate",void 0),Ei([Pt],ir.prototype,"formtarget",void 0),Ei([Pt],ir.prototype,"type",void 0),Ei([Ye],ir.prototype,"defaultSlottedContent",void 0);class or{}Ei([Pt({attribute:"aria-expanded"})],or.prototype,"ariaExpanded",void 0),Ei([Pt({attribute:"aria-pressed"})],or.prototype,"ariaPressed",void 0),fo(or,Mo),fo(ir,Ci,or);class rr{constructor(e){if(this.dayFormat="numeric",this.weekdayFormat="long",this.monthFormat="long",this.yearFormat="numeric",this.date=new Date,e)for(const t in e){const i=e[t];"date"===t?this.date=this.getDateObject(i):this[t]=i}}getDateObject(e){if("string"==typeof e){const t=e.split(/[/-]/);return t.length<3?new Date:new Date(parseInt(t[2],10),parseInt(t[0],10)-1,parseInt(t[1],10))}if("day"in e&&"month"in e&&"year"in e){const{day:t,month:i,year:o}=e;return new Date(o,i-1,t)}return e}getDate(e=this.date,t={weekday:this.weekdayFormat,month:this.monthFormat,day:this.dayFormat,year:this.yearFormat},i=this.locale){const o=this.getDateObject(e),r=Object.assign({timeZone:"utc"},t);return new Intl.DateTimeFormat(i,r).format(o)}getDay(e=this.date.getDate(),t=this.dayFormat,i=this.locale){return this.getDate({month:1,day:e,year:2020},{day:t},i)}getMonth(e=this.date.getMonth()+1,t=this.monthFormat,i=this.locale){return this.getDate({month:e,day:2,year:2020},{month:t},i)}getYear(e=this.date.getFullYear(),t=this.yearFormat,i=this.locale){return this.getDate({month:2,day:2,year:e},{year:t},i)}getWeekday(e=0,t=this.weekdayFormat,i=this.locale){const o=`1-${e+1}-2017`;return this.getDate(o,{weekday:t},i)}getWeekdays(e=this.weekdayFormat,t=this.locale){return Array(7).fill(null).map(((i,o)=>this.getWeekday(o,e,t)))}}class nr extends uo{constructor(){super(...arguments),this.dateFormatter=new rr,this.readonly=!1,this.locale="en-US",this.month=(new Date).getMonth()+1,this.year=(new Date).getFullYear(),this.dayFormat="numeric",this.weekdayFormat="short",this.monthFormat="long",this.yearFormat="numeric",this.minWeeks=0,this.disabledDates="",this.selectedDates="",this.oneDayInMs=864e5}localeChanged(){this.dateFormatter.locale=this.locale}dayFormatChanged(){this.dateFormatter.dayFormat=this.dayFormat}weekdayFormatChanged(){this.dateFormatter.weekdayFormat=this.weekdayFormat}monthFormatChanged(){this.dateFormatter.monthFormat=this.monthFormat}yearFormatChanged(){this.dateFormatter.yearFormat=this.yearFormat}getMonthInfo(e=this.month,t=this.year){const i=e=>new Date(e.getFullYear(),e.getMonth(),1).getDay(),o=e=>{const t=new Date(e.getFullYear(),e.getMonth()+1,1);return new Date(t.getTime()-this.oneDayInMs).getDate()},r=new Date(t,e-1),n=new Date(t,e),s=new Date(t,e-2);return{length:o(r),month:e,start:i(r),year:t,previous:{length:o(s),month:s.getMonth()+1,start:i(s),year:s.getFullYear()},next:{length:o(n),month:n.getMonth()+1,start:i(n),year:n.getFullYear()}}}getDays(e=this.getMonthInfo(),t=this.minWeeks){t=t>10?10:t;const{start:i,length:o,previous:r,next:n}=e,s=[];let a=1-i;for(;a<o+1||s.length<t||s[s.length-1].length%7!=0;){const{month:t,year:i}=a<1?r:a>o?n:e,l=a<1?r.length+a:a>o?a-o:a,d=`${t}-${l}-${i}`,c={day:l,month:t,year:i,disabled:this.dateInString(d,this.disabledDates),selected:this.dateInString(d,this.selectedDates)},h=s[s.length-1];0===s.length||h.length%7==0?s.push([c]):h.push(c),a++}return s}dateInString(e,t){const i=t.split(",").map((e=>e.trim()));return e="string"==typeof e?e:`${e.getMonth()+1}-${e.getDate()}-${e.getFullYear()}`,i.some((t=>t===e))}getDayClassNames(e,t){const{day:i,month:o,year:r,disabled:n,selected:s}=e;return["day",t===`${o}-${i}-${r}`&&"today",this.month!==o&&"inactive",n&&"disabled",s&&"selected"].filter(Boolean).join(" ")}getWeekdayText(){const e=this.dateFormatter.getWeekdays().map((e=>({text:e})));if("long"!==this.weekdayFormat){const t=this.dateFormatter.getWeekdays("long");e.forEach(((e,i)=>{e.abbr=t[i]}))}return e}handleDateSelect(e,t){e.preventDefault,this.$emit("dateselected",t)}handleKeydown(e,t){return"Enter"===e.key&&this.handleDateSelect(e,t),!0}}Ei([Pt({mode:"boolean"})],nr.prototype,"readonly",void 0),Ei([Pt],nr.prototype,"locale",void 0),Ei([Pt({converter:Dt})],nr.prototype,"month",void 0),Ei([Pt({converter:Dt})],nr.prototype,"year",void 0),Ei([Pt({attribute:"day-format",mode:"fromView"})],nr.prototype,"dayFormat",void 0),Ei([Pt({attribute:"weekday-format",mode:"fromView"})],nr.prototype,"weekdayFormat",void 0),Ei([Pt({attribute:"month-format",mode:"fromView"})],nr.prototype,"monthFormat",void 0),Ei([Pt({attribute:"year-format",mode:"fromView"})],nr.prototype,"yearFormat",void 0),Ei([Pt({attribute:"min-weeks",converter:Dt})],nr.prototype,"minWeeks",void 0),Ei([Pt({attribute:"disabled-dates"})],nr.prototype,"disabledDates",void 0),Ei([Pt({attribute:"selected-dates"})],nr.prototype,"selectedDates",void 0);const sr="none",ar="default",lr="sticky",dr="default",cr="columnheader",hr="rowheader",ur="default",pr="header",mr="sticky-header";class fr extends uo{constructor(){super(...arguments),this.rowType=ur,this.rowData=null,this.columnDefinitions=null,this.isActiveRow=!1,this.cellsRepeatBehavior=null,this.cellsPlaceholder=null,this.focusColumnIndex=0,this.refocusOnLoad=!1,this.updateRowStyle=()=>{this.style.gridTemplateColumns=this.gridTemplateColumns}}gridTemplateColumnsChanged(){this.$fastController.isConnected&&this.updateRowStyle()}rowTypeChanged(){this.$fastController.isConnected&&this.updateItemTemplate()}rowDataChanged(){null!==this.rowData&&this.isActiveRow&&(this.refocusOnLoad=!0)}cellItemTemplateChanged(){this.updateItemTemplate()}headerCellItemTemplateChanged(){this.updateItemTemplate()}connectedCallback(){super.connectedCallback(),null===this.cellsRepeatBehavior&&(this.cellsPlaceholder=document.createComment(""),this.appendChild(this.cellsPlaceholder),this.updateItemTemplate(),this.cellsRepeatBehavior=new fi((e=>e.columnDefinitions),(e=>e.activeCellItemTemplate),{positioning:!0}).createBehavior(this.cellsPlaceholder),this.$fastController.addBehaviors([this.cellsRepeatBehavior])),this.addEventListener("cell-focused",this.handleCellFocus),this.addEventListener("focusout",this.handleFocusout),this.addEventListener("keydown",this.handleKeydown),this.updateRowStyle(),this.refocusOnLoad&&(this.refocusOnLoad=!1,this.cellElements.length>this.focusColumnIndex&&this.cellElements[this.focusColumnIndex].focus())}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("cell-focused",this.handleCellFocus),this.removeEventListener("focusout",this.handleFocusout),this.removeEventListener("keydown",this.handleKeydown)}handleFocusout(e){this.contains(e.target)||(this.isActiveRow=!1,this.focusColumnIndex=0)}handleCellFocus(e){this.isActiveRow=!0,this.focusColumnIndex=this.cellElements.indexOf(e.target),this.$emit("row-focused",this)}handleKeydown(e){if(e.defaultPrevented)return;let t=0;switch(e.key){case"ArrowLeft":t=Math.max(0,this.focusColumnIndex-1),this.cellElements[t].focus(),e.preventDefault();break;case"ArrowRight":t=Math.min(this.cellElements.length-1,this.focusColumnIndex+1),this.cellElements[t].focus(),e.preventDefault();break;case"Home":e.ctrlKey||(this.cellElements[0].focus(),e.preventDefault());break;case"End":e.ctrlKey||(this.cellElements[this.cellElements.length-1].focus(),e.preventDefault())}}updateItemTemplate(){this.activeCellItemTemplate=this.rowType===ur&&void 0!==this.cellItemTemplate?this.cellItemTemplate:this.rowType===ur&&void 0===this.cellItemTemplate?this.defaultCellItemTemplate:void 0!==this.headerCellItemTemplate?this.headerCellItemTemplate:this.defaultHeaderCellItemTemplate}}Ei([Pt({attribute:"grid-template-columns"})],fr.prototype,"gridTemplateColumns",void 0),Ei([Pt({attribute:"row-type"})],fr.prototype,"rowType",void 0),Ei([Ye],fr.prototype,"rowData",void 0),Ei([Ye],fr.prototype,"columnDefinitions",void 0),Ei([Ye],fr.prototype,"cellItemTemplate",void 0),Ei([Ye],fr.prototype,"headerCellItemTemplate",void 0),Ei([Ye],fr.prototype,"rowIndex",void 0),Ei([Ye],fr.prototype,"isActiveRow",void 0),Ei([Ye],fr.prototype,"activeCellItemTemplate",void 0),Ei([Ye],fr.prototype,"defaultCellItemTemplate",void 0),Ei([Ye],fr.prototype,"defaultHeaderCellItemTemplate",void 0),Ei([Ye],fr.prototype,"cellElements",void 0);class gr extends uo{constructor(){super(),this.noTabbing=!1,this.generateHeader=ar,this.rowsData=[],this.columnDefinitions=null,this.focusRowIndex=0,this.focusColumnIndex=0,this.rowsPlaceholder=null,this.generatedHeader=null,this.isUpdatingFocus=!1,this.pendingFocusUpdate=!1,this.rowindexUpdateQueued=!1,this.columnDefinitionsStale=!0,this.generatedGridTemplateColumns="",this.focusOnCell=(e,t,i)=>{if(0===this.rowElements.length)return this.focusRowIndex=0,void(this.focusColumnIndex=0);const o=Math.max(0,Math.min(this.rowElements.length-1,e)),r=this.rowElements[o].querySelectorAll('[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]'),n=r[Math.max(0,Math.min(r.length-1,t))];i&&this.scrollHeight!==this.clientHeight&&(o<this.focusRowIndex&&this.scrollTop>0||o>this.focusRowIndex&&this.scrollTop<this.scrollHeight-this.clientHeight)&&n.scrollIntoView({block:"center",inline:"center"}),n.focus()},this.onChildListChange=(e,t)=>{e&&e.length&&(e.forEach((e=>{e.addedNodes.forEach((e=>{1===e.nodeType&&"row"===e.getAttribute("role")&&(e.columnDefinitions=this.columnDefinitions)}))})),this.queueRowIndexUpdate())},this.queueRowIndexUpdate=()=>{this.rowindexUpdateQueued||(this.rowindexUpdateQueued=!0,Ge.queueUpdate(this.updateRowIndexes))},this.updateRowIndexes=()=>{let e=this.gridTemplateColumns;if(void 0===e){if(""===this.generatedGridTemplateColumns&&this.rowElements.length>0){const e=this.rowElements[0];this.generatedGridTemplateColumns=new Array(e.cellElements.length).fill("1fr").join(" ")}e=this.generatedGridTemplateColumns}this.rowElements.forEach(((t,i)=>{const o=t;o.rowIndex=i,o.gridTemplateColumns=e,this.columnDefinitionsStale&&(o.columnDefinitions=this.columnDefinitions)})),this.rowindexUpdateQueued=!1,this.columnDefinitionsStale=!1}}static generateTemplateColumns(e){let t="";return e.forEach((e=>{t=`${t}${""===t?"":" "}1fr`})),t}noTabbingChanged(){this.$fastController.isConnected&&(this.noTabbing?this.setAttribute("tabIndex","-1"):this.setAttribute("tabIndex",this.contains(document.activeElement)||this===document.activeElement?"-1":"0"))}generateHeaderChanged(){this.$fastController.isConnected&&this.toggleGeneratedHeader()}gridTemplateColumnsChanged(){this.$fastController.isConnected&&this.updateRowIndexes()}rowsDataChanged(){null===this.columnDefinitions&&this.rowsData.length>0&&(this.columnDefinitions=gr.generateColumns(this.rowsData[0])),this.$fastController.isConnected&&this.toggleGeneratedHeader()}columnDefinitionsChanged(){null!==this.columnDefinitions?(this.generatedGridTemplateColumns=gr.generateTemplateColumns(this.columnDefinitions),this.$fastController.isConnected&&(this.columnDefinitionsStale=!0,this.queueRowIndexUpdate())):this.generatedGridTemplateColumns=""}headerCellItemTemplateChanged(){this.$fastController.isConnected&&null!==this.generatedHeader&&(this.generatedHeader.headerCellItemTemplate=this.headerCellItemTemplate)}focusRowIndexChanged(){this.$fastController.isConnected&&this.queueFocusUpdate()}focusColumnIndexChanged(){this.$fastController.isConnected&&this.queueFocusUpdate()}connectedCallback(){super.connectedCallback(),void 0===this.rowItemTemplate&&(this.rowItemTemplate=this.defaultRowItemTemplate),this.rowsPlaceholder=document.createComment(""),this.appendChild(this.rowsPlaceholder),this.toggleGeneratedHeader(),this.rowsRepeatBehavior=new fi((e=>e.rowsData),(e=>e.rowItemTemplate),{positioning:!0}).createBehavior(this.rowsPlaceholder),this.$fastController.addBehaviors([this.rowsRepeatBehavior]),this.addEventListener("row-focused",this.handleRowFocus),this.addEventListener("focus",this.handleFocus),this.addEventListener("keydown",this.handleKeydown),this.addEventListener("focusout",this.handleFocusOut),this.observer=new MutationObserver(this.onChildListChange),this.observer.observe(this,{childList:!0}),this.noTabbing&&this.setAttribute("tabindex","-1"),Ge.queueUpdate(this.queueRowIndexUpdate)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("row-focused",this.handleRowFocus),this.removeEventListener("focus",this.handleFocus),this.removeEventListener("keydown",this.handleKeydown),this.removeEventListener("focusout",this.handleFocusOut),this.observer.disconnect(),this.rowsPlaceholder=null,this.generatedHeader=null}handleRowFocus(e){this.isUpdatingFocus=!0;const t=e.target;this.focusRowIndex=this.rowElements.indexOf(t),this.focusColumnIndex=t.focusColumnIndex,this.setAttribute("tabIndex","-1"),this.isUpdatingFocus=!1}handleFocus(e){this.focusOnCell(this.focusRowIndex,this.focusColumnIndex,!0)}handleFocusOut(e){null!==e.relatedTarget&&this.contains(e.relatedTarget)||this.setAttribute("tabIndex",this.noTabbing?"-1":"0")}handleKeydown(e){if(e.defaultPrevented)return;let t;const i=this.rowElements.length-1,o=this.offsetHeight+this.scrollTop,r=this.rowElements[i];switch(e.key){case"ArrowUp":e.preventDefault(),this.focusOnCell(this.focusRowIndex-1,this.focusColumnIndex,!0);break;case"ArrowDown":e.preventDefault(),this.focusOnCell(this.focusRowIndex+1,this.focusColumnIndex,!0);break;case"PageUp":if(e.preventDefault(),0===this.rowElements.length){this.focusOnCell(0,0,!1);break}if(0===this.focusRowIndex)return void this.focusOnCell(0,this.focusColumnIndex,!1);for(t=this.focusRowIndex-1;t>=0;t--){const e=this.rowElements[t];if(e.offsetTop<this.scrollTop){this.scrollTop=e.offsetTop+e.clientHeight-this.clientHeight;break}}this.focusOnCell(t,this.focusColumnIndex,!1);break;case"PageDown":if(e.preventDefault(),0===this.rowElements.length){this.focusOnCell(0,0,!1);break}if(this.focusRowIndex>=i||r.offsetTop+r.offsetHeight<=o)return void this.focusOnCell(i,this.focusColumnIndex,!1);for(t=this.focusRowIndex+1;t<=i;t++){const e=this.rowElements[t];if(e.offsetTop+e.offsetHeight>o){let t=0;this.generateHeader===lr&&null!==this.generatedHeader&&(t=this.generatedHeader.clientHeight),this.scrollTop=e.offsetTop-t;break}}this.focusOnCell(t,this.focusColumnIndex,!1);break;case"Home":e.ctrlKey&&(e.preventDefault(),this.focusOnCell(0,0,!0));break;case"End":e.ctrlKey&&null!==this.columnDefinitions&&(e.preventDefault(),this.focusOnCell(this.rowElements.length-1,this.columnDefinitions.length-1,!0))}}queueFocusUpdate(){this.isUpdatingFocus&&(this.contains(document.activeElement)||this===document.activeElement)||!1===this.pendingFocusUpdate&&(this.pendingFocusUpdate=!0,Ge.queueUpdate((()=>this.updateFocus())))}updateFocus(){this.pendingFocusUpdate=!1,this.focusOnCell(this.focusRowIndex,this.focusColumnIndex,!0)}toggleGeneratedHeader(){if(null!==this.generatedHeader&&(this.removeChild(this.generatedHeader),this.generatedHeader=null),this.generateHeader!==sr&&this.rowsData.length>0){const e=document.createElement(this.rowElementTag);return this.generatedHeader=e,this.generatedHeader.columnDefinitions=this.columnDefinitions,this.generatedHeader.gridTemplateColumns=this.gridTemplateColumns,this.generatedHeader.rowType=this.generateHeader===lr?mr:pr,void(null===this.firstChild&&null===this.rowsPlaceholder||this.insertBefore(e,null!==this.firstChild?this.firstChild:this.rowsPlaceholder))}}}gr.generateColumns=e=>Object.getOwnPropertyNames(e).map(((e,t)=>({columnDataKey:e,gridColumn:`${t}`}))),Ei([Pt({attribute:"no-tabbing",mode:"boolean"})],gr.prototype,"noTabbing",void 0),Ei([Pt({attribute:"generate-header"})],gr.prototype,"generateHeader",void 0),Ei([Pt({attribute:"grid-template-columns"})],gr.prototype,"gridTemplateColumns",void 0),Ei([Ye],gr.prototype,"rowsData",void 0),Ei([Ye],gr.prototype,"columnDefinitions",void 0),Ei([Ye],gr.prototype,"rowItemTemplate",void 0),Ei([Ye],gr.prototype,"cellItemTemplate",void 0),Ei([Ye],gr.prototype,"headerCellItemTemplate",void 0),Ei([Ye],gr.prototype,"focusRowIndex",void 0),Ei([Ye],gr.prototype,"focusColumnIndex",void 0),Ei([Ye],gr.prototype,"defaultRowItemTemplate",void 0),Ei([Ye],gr.prototype,"rowElementTag",void 0),Ei([Ye],gr.prototype,"rowElements",void 0);const vr=Tt`
    <template>
        ${e=>null===e.rowData||null===e.columnDefinition||null===e.columnDefinition.columnDataKey?null:e.rowData[e.columnDefinition.columnDataKey]}
    </template>
`,br=Tt`
    <template>
        ${e=>null===e.columnDefinition?null:void 0===e.columnDefinition.title?e.columnDefinition.columnDataKey:e.columnDefinition.title}
    </template>
`;class yr extends uo{constructor(){super(...arguments),this.cellType=dr,this.rowData=null,this.columnDefinition=null,this.isActiveCell=!1,this.customCellView=null,this.updateCellStyle=()=>{this.style.gridColumn=this.gridColumn}}cellTypeChanged(){this.$fastController.isConnected&&this.updateCellView()}gridColumnChanged(){this.$fastController.isConnected&&this.updateCellStyle()}columnDefinitionChanged(e,t){this.$fastController.isConnected&&this.updateCellView()}connectedCallback(){var e;super.connectedCallback(),this.addEventListener("focusin",this.handleFocusin),this.addEventListener("focusout",this.handleFocusout),this.addEventListener("keydown",this.handleKeydown),this.style.gridColumn=`${void 0===(null===(e=this.columnDefinition)||void 0===e?void 0:e.gridColumn)?0:this.columnDefinition.gridColumn}`,this.updateCellView(),this.updateCellStyle()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("focusin",this.handleFocusin),this.removeEventListener("focusout",this.handleFocusout),this.removeEventListener("keydown",this.handleKeydown),this.disconnectCellView()}handleFocusin(e){if(!this.isActiveCell){if(this.isActiveCell=!0,this.cellType===cr){if(null!==this.columnDefinition&&!0!==this.columnDefinition.headerCellInternalFocusQueue&&"function"==typeof this.columnDefinition.headerCellFocusTargetCallback){const e=this.columnDefinition.headerCellFocusTargetCallback(this);null!==e&&e.focus()}}else if(null!==this.columnDefinition&&!0!==this.columnDefinition.cellInternalFocusQueue&&"function"==typeof this.columnDefinition.cellFocusTargetCallback){const e=this.columnDefinition.cellFocusTargetCallback(this);null!==e&&e.focus()}this.$emit("cell-focused",this)}}handleFocusout(e){this===document.activeElement||this.contains(document.activeElement)||(this.isActiveCell=!1)}handleKeydown(e){if(!(e.defaultPrevented||null===this.columnDefinition||this.cellType===dr&&!0!==this.columnDefinition.cellInternalFocusQueue||this.cellType===cr&&!0!==this.columnDefinition.headerCellInternalFocusQueue))switch(e.key){case"Enter":case"F2":if(this.contains(document.activeElement)&&document.activeElement!==this)return;if(this.cellType===cr){if(void 0!==this.columnDefinition.headerCellFocusTargetCallback){const t=this.columnDefinition.headerCellFocusTargetCallback(this);null!==t&&t.focus(),e.preventDefault()}}else if(void 0!==this.columnDefinition.cellFocusTargetCallback){const t=this.columnDefinition.cellFocusTargetCallback(this);null!==t&&t.focus(),e.preventDefault()}break;case"Escape":this.contains(document.activeElement)&&document.activeElement!==this&&(this.focus(),e.preventDefault())}}updateCellView(){if(this.disconnectCellView(),null!==this.columnDefinition)switch(this.cellType){case cr:void 0!==this.columnDefinition.headerCellTemplate?this.customCellView=this.columnDefinition.headerCellTemplate.render(this,this):this.customCellView=br.render(this,this);break;case void 0:case hr:case dr:void 0!==this.columnDefinition.cellTemplate?this.customCellView=this.columnDefinition.cellTemplate.render(this,this):this.customCellView=vr.render(this,this)}}disconnectCellView(){null!==this.customCellView&&(this.customCellView.dispose(),this.customCellView=null)}}Ei([Pt({attribute:"cell-type"})],yr.prototype,"cellType",void 0),Ei([Pt({attribute:"grid-column"})],yr.prototype,"gridColumn",void 0),Ei([Ye],yr.prototype,"rowData",void 0),Ei([Ye],yr.prototype,"columnDefinition",void 0);const xr=Tt`
    <div
        class="title"
        part="title"
        aria-label="${e=>e.dateFormatter.getDate(`${e.month}-2-${e.year}`,{month:"long",year:"numeric"})}"
    >
        <span part="month">
            ${e=>e.dateFormatter.getMonth(e.month)}
        </span>
        <span part="year">${e=>e.dateFormatter.getYear(e.year)}</span>
    </div>
`,wr=(e,t)=>{const i=e.tagFor(fr);return Tt`
        <${i}
            class="week"
            part="week"
            role="row"
            role-type="default"
            grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
        >
        ${gi((e=>e),((e,t)=>{const i=e.tagFor(yr);return Tt`
        <${i}
            class="${(e,i)=>i.parentContext.parent.getDayClassNames(e,t)}"
            part="day"
            tabindex="-1"
            role="gridcell"
            grid-column="${(e,t)=>t.index+1}"
            @click="${(e,t)=>t.parentContext.parent.handleDateSelect(t.event,e)}"
            @keydown="${(e,t)=>t.parentContext.parent.handleKeydown(t.event,e)}"
            aria-label="${(e,t)=>t.parentContext.parent.dateFormatter.getDate(`${e.month}-${e.day}-${e.year}`,{month:"long",day:"numeric"})}"
        >
            <div
                class="date"
                part="${e=>t===`${e.month}-${e.day}-${e.year}`?"today":"date"}"
            >
                ${(e,t)=>t.parentContext.parent.dateFormatter.getDay(e.day)}
            </div>
            <slot name="${e=>e.month}-${e=>e.day}-${e=>e.year}"></slot>
        </${i}>
    `})(e,t),{positioning:!0})}
        </${i}>
    `},kr=(e,t)=>{const i=e.tagFor(gr),o=e.tagFor(fr);return Tt`
    <${i} class="days interact" part="days" generate-header="none">
        <${o}
            class="week-days"
            part="week-days"
            role="row"
            row-type="header"
            grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
        >
            ${gi((e=>e.getWeekdayText()),(e=>{const t=e.tagFor(yr);return Tt`
        <${t}
            class="week-day"
            part="week-day"
            tabindex="-1"
            grid-column="${(e,t)=>t.index+1}"
            abbr="${e=>e.abbr}"
        >
            ${e=>e.text}
        </${t}>
    `})(e),{positioning:!0})}
        </${o}>
        ${gi((e=>e.getDays()),wr(e,t))}
    </${i}>
`};let Cr=class extends uo{};class $r extends uo{}class _r extends(Jo($r)){constructor(){super(...arguments),this.proxy=document.createElement("input")}}class Sr extends _r{constructor(){super(),this.initialValue="on",this.indeterminate=!1,this.keypressHandler=e=>{if(!this.readOnly&&" "===e.key)this.indeterminate&&(this.indeterminate=!1),this.checked=!this.checked},this.clickHandler=e=>{this.disabled||this.readOnly||(this.indeterminate&&(this.indeterminate=!1),this.checked=!this.checked)},this.proxy.setAttribute("type","checkbox")}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly)}}function Tr(e){return yo(e)&&("option"===e.getAttribute("role")||e instanceof HTMLOptionElement)}Ei([Pt({attribute:"readonly",mode:"boolean"})],Sr.prototype,"readOnly",void 0),Ei([Ye],Sr.prototype,"defaultSlottedNodes",void 0),Ei([Ye],Sr.prototype,"indeterminate",void 0);class Er extends uo{constructor(e,t,i,o){super(),this.defaultSelected=!1,this.dirtySelected=!1,this.selected=this.defaultSelected,this.dirtyValue=!1,e&&(this.textContent=e),t&&(this.initialValue=t),i&&(this.defaultSelected=i),o&&(this.selected=o),this.proxy=new Option(`${this.textContent}`,this.initialValue,this.defaultSelected,this.selected),this.proxy.disabled=this.disabled}checkedChanged(e,t){this.ariaChecked="boolean"!=typeof t?null:t?"true":"false"}contentChanged(e,t){this.proxy instanceof HTMLOptionElement&&(this.proxy.textContent=this.textContent),this.$emit("contentchange",null,{bubbles:!0})}defaultSelectedChanged(){this.dirtySelected||(this.selected=this.defaultSelected,this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.defaultSelected))}disabledChanged(e,t){this.ariaDisabled=this.disabled?"true":"false",this.proxy instanceof HTMLOptionElement&&(this.proxy.disabled=this.disabled)}selectedAttributeChanged(){this.defaultSelected=this.selectedAttribute,this.proxy instanceof HTMLOptionElement&&(this.proxy.defaultSelected=this.defaultSelected)}selectedChanged(){this.ariaSelected=this.selected?"true":"false",this.dirtySelected||(this.dirtySelected=!0),this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.selected)}initialValueChanged(e,t){this.dirtyValue||(this.value=this.initialValue,this.dirtyValue=!1)}get label(){var e;return null!==(e=this.value)&&void 0!==e?e:this.text}get text(){var e,t;return null!==(t=null===(e=this.textContent)||void 0===e?void 0:e.replace(/\s+/g," ").trim())&&void 0!==t?t:""}set value(e){const t=`${null!=e?e:""}`;this._value=t,this.dirtyValue=!0,this.proxy instanceof HTMLOptionElement&&(this.proxy.value=t),Ze.notify(this,"value")}get value(){var e;return Ze.track(this,"value"),null!==(e=this._value)&&void 0!==e?e:this.text}get form(){return this.proxy?this.proxy.form:null}}Ei([Ye],Er.prototype,"checked",void 0),Ei([Ye],Er.prototype,"content",void 0),Ei([Ye],Er.prototype,"defaultSelected",void 0),Ei([Pt({mode:"boolean"})],Er.prototype,"disabled",void 0),Ei([Pt({attribute:"selected",mode:"boolean"})],Er.prototype,"selectedAttribute",void 0),Ei([Ye],Er.prototype,"selected",void 0),Ei([Pt({attribute:"value",mode:"fromView"})],Er.prototype,"initialValue",void 0);class Ar{}Ei([Ye],Ar.prototype,"ariaChecked",void 0),Ei([Ye],Ar.prototype,"ariaPosInSet",void 0),Ei([Ye],Ar.prototype,"ariaSelected",void 0),Ei([Ye],Ar.prototype,"ariaSetSize",void 0),fo(Ar,Mo),fo(Er,Ci,Ar);let Ir=class extends uo{constructor(){super(...arguments),this._options=[],this.selectedIndex=-1,this.selectedOptions=[],this.shouldSkipFocus=!1,this.typeaheadBuffer="",this.typeaheadExpired=!0,this.typeaheadTimeout=-1}get firstSelectedOption(){var e;return null!==(e=this.selectedOptions[0])&&void 0!==e?e:null}get hasSelectableOptions(){return this.options.length>0&&!this.options.every((e=>e.disabled))}get length(){var e,t;return null!==(t=null===(e=this.options)||void 0===e?void 0:e.length)&&void 0!==t?t:0}get options(){return Ze.track(this,"options"),this._options}set options(e){this._options=e,Ze.notify(this,"options")}get typeAheadExpired(){return this.typeaheadExpired}set typeAheadExpired(e){this.typeaheadExpired=e}clickHandler(e){const t=e.target.closest("option,[role=option]");if(t&&!t.disabled)return this.selectedIndex=this.options.indexOf(t),!0}focusAndScrollOptionIntoView(e=this.firstSelectedOption){this.contains(document.activeElement)&&null!==e&&(e.focus(),requestAnimationFrame((()=>{e.scrollIntoView({block:"nearest"})})))}focusinHandler(e){this.shouldSkipFocus||e.target!==e.currentTarget||(this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}getTypeaheadMatches(){const e=this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&"),t=new RegExp(`^${e}`,"gi");return this.options.filter((e=>e.text.trim().match(t)))}getSelectableIndex(e=this.selectedIndex,t){const i=e>t?-1:e<t?1:0,o=e+i;let r=null;switch(i){case-1:r=this.options.reduceRight(((e,t,i)=>!e&&!t.disabled&&i<o?t:e),r);break;case 1:r=this.options.reduce(((e,t,i)=>!e&&!t.disabled&&i>o?t:e),r)}return this.options.indexOf(r)}handleChange(e,t){if("selected"===t)Ir.slottedOptionFilter(e)&&(this.selectedIndex=this.options.indexOf(e)),this.setSelectedOptions()}handleTypeAhead(e){this.typeaheadTimeout&&window.clearTimeout(this.typeaheadTimeout),this.typeaheadTimeout=window.setTimeout((()=>this.typeaheadExpired=!0),Ir.TYPE_AHEAD_TIMEOUT_MS),e.length>1||(this.typeaheadBuffer=`${this.typeaheadExpired?"":this.typeaheadBuffer}${e}`)}keydownHandler(e){if(this.disabled)return!0;this.shouldSkipFocus=!1;const t=e.key;switch(t){case"Home":e.shiftKey||(e.preventDefault(),this.selectFirstOption());break;case"ArrowDown":e.shiftKey||(e.preventDefault(),this.selectNextOption());break;case"ArrowUp":e.shiftKey||(e.preventDefault(),this.selectPreviousOption());break;case"End":e.preventDefault(),this.selectLastOption();break;case"Tab":return this.focusAndScrollOptionIntoView(),!0;case"Enter":case"Escape":return!0;case" ":if(this.typeaheadExpired)return!0;default:return 1===t.length&&this.handleTypeAhead(`${t}`),!0}}mousedownHandler(e){return this.shouldSkipFocus=!this.contains(document.activeElement),!0}multipleChanged(e,t){this.ariaMultiSelectable=t?"true":null}selectedIndexChanged(e,t){var i;if(this.hasSelectableOptions){if((null===(i=this.options[this.selectedIndex])||void 0===i?void 0:i.disabled)&&"number"==typeof e){const i=this.getSelectableIndex(e,t),o=i>-1?i:e;return this.selectedIndex=o,void(t===o&&this.selectedIndexChanged(t,o))}this.setSelectedOptions()}else this.selectedIndex=-1}selectedOptionsChanged(e,t){var i;const o=t.filter(Ir.slottedOptionFilter);null===(i=this.options)||void 0===i||i.forEach((e=>{const t=Ze.getNotifier(e);t.unsubscribe(this,"selected"),e.selected=o.includes(e),t.subscribe(this,"selected")}))}selectFirstOption(){var e,t;this.disabled||(this.selectedIndex=null!==(t=null===(e=this.options)||void 0===e?void 0:e.findIndex((e=>!e.disabled)))&&void 0!==t?t:-1)}selectLastOption(){this.disabled||(this.selectedIndex=function(e,t){let i=e.length;for(;i--;)if(t(e[i],i,e))return i;return-1}(this.options,(e=>!e.disabled)))}selectNextOption(){!this.disabled&&this.selectedIndex<this.options.length-1&&(this.selectedIndex+=1)}selectPreviousOption(){!this.disabled&&this.selectedIndex>0&&(this.selectedIndex=this.selectedIndex-1)}setDefaultSelectedOption(){var e,t;this.selectedIndex=null!==(t=null===(e=this.options)||void 0===e?void 0:e.findIndex((e=>e.defaultSelected)))&&void 0!==t?t:-1}setSelectedOptions(){var e,t,i;(null===(e=this.options)||void 0===e?void 0:e.length)&&(this.selectedOptions=[this.options[this.selectedIndex]],this.ariaActiveDescendant=null!==(i=null===(t=this.firstSelectedOption)||void 0===t?void 0:t.id)&&void 0!==i?i:"",this.focusAndScrollOptionIntoView())}slottedOptionsChanged(e,t){this.options=t.reduce(((e,t)=>(Tr(t)&&e.push(t),e)),[]);const i=`${this.options.length}`;this.options.forEach(((e,t)=>{e.id||(e.id=Eo("option-")),e.ariaPosInSet=`${t+1}`,e.ariaSetSize=i})),this.$fastController.isConnected&&(this.setSelectedOptions(),this.setDefaultSelectedOption())}typeaheadBufferChanged(e,t){if(this.$fastController.isConnected){const e=this.getTypeaheadMatches();if(e.length){const t=this.options.indexOf(e[0]);t>-1&&(this.selectedIndex=t)}this.typeaheadExpired=!1}}};Ir.slottedOptionFilter=e=>Tr(e)&&!e.hidden,Ir.TYPE_AHEAD_TIMEOUT_MS=1e3,Ei([Pt({mode:"boolean"})],Ir.prototype,"disabled",void 0),Ei([Ye],Ir.prototype,"selectedIndex",void 0),Ei([Ye],Ir.prototype,"selectedOptions",void 0),Ei([Ye],Ir.prototype,"slottedOptions",void 0),Ei([Ye],Ir.prototype,"typeaheadBuffer",void 0);class Or{}Ei([Ye],Or.prototype,"ariaActiveDescendant",void 0),Ei([Ye],Or.prototype,"ariaDisabled",void 0),Ei([Ye],Or.prototype,"ariaExpanded",void 0),Ei([Ye],Or.prototype,"ariaMultiSelectable",void 0),fo(Or,Mo),fo(Ir,Or);const Lr="above",Fr="below";class Mr extends Ir{}class Rr extends(Qo(Mr)){constructor(){super(...arguments),this.proxy=document.createElement("input")}}const Dr="inline",zr="list",Pr="both",Nr="none";let Hr=class extends Rr{constructor(){super(...arguments),this._value="",this.filteredOptions=[],this.filter="",this.forcedPosition=!1,this.listboxId=Eo("listbox-"),this.maxHeight=0,this.open=!1}formResetCallback(){super.formResetCallback(),this.setDefaultSelectedOption(),this.updateValue()}validate(){super.validate(this.control)}get isAutocompleteInline(){return this.autocomplete===Dr||this.isAutocompleteBoth}get isAutocompleteList(){return this.autocomplete===zr||this.isAutocompleteBoth}get isAutocompleteBoth(){return this.autocomplete===Pr}openChanged(){if(this.open)return this.ariaControls=this.listboxId,this.ariaExpanded="true",this.setPositioning(),this.focusAndScrollOptionIntoView(),void Ge.queueUpdate((()=>this.focus()));this.ariaControls="",this.ariaExpanded="false"}get options(){return Ze.track(this,"options"),this.filteredOptions.length?this.filteredOptions:this._options}set options(e){this._options=e,Ze.notify(this,"options")}placeholderChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.placeholder=this.placeholder)}positionChanged(e,t){this.positionAttribute=t,this.setPositioning()}get value(){return Ze.track(this,"value"),this._value}set value(e){var t,i,o;const r=`${this._value}`;if(this.$fastController.isConnected&&this.options){const r=this.options.findIndex((t=>t.text.toLowerCase()===e.toLowerCase())),n=null===(t=this.options[this.selectedIndex])||void 0===t?void 0:t.text,s=null===(i=this.options[r])||void 0===i?void 0:i.text;this.selectedIndex=n!==s?r:this.selectedIndex,e=(null===(o=this.firstSelectedOption)||void 0===o?void 0:o.text)||e}r!==e&&(this._value=e,super.valueChanged(r,e),Ze.notify(this,"value"))}clickHandler(e){if(!this.disabled){if(this.open){const t=e.target.closest("option,[role=option]");if(!t||t.disabled)return;this.selectedOptions=[t],this.control.value=t.text,this.clearSelectionRange(),this.updateValue(!0)}return this.open=!this.open,this.open&&this.control.focus(),!0}}connectedCallback(){super.connectedCallback(),this.forcedPosition=!!this.positionAttribute,this.value&&(this.initialValue=this.value)}disabledChanged(e,t){super.disabledChanged&&super.disabledChanged(e,t),this.ariaDisabled=this.disabled?"true":"false"}filterOptions(){this.autocomplete&&this.autocomplete!==Nr||(this.filter="");const e=this.filter.toLowerCase();this.filteredOptions=this._options.filter((e=>e.text.toLowerCase().startsWith(this.filter.toLowerCase()))),this.isAutocompleteList&&(this.filteredOptions.length||e||(this.filteredOptions=this._options),this._options.forEach((e=>{e.hidden=!this.filteredOptions.includes(e)})))}focusAndScrollOptionIntoView(){this.contains(document.activeElement)&&(this.control.focus(),this.firstSelectedOption&&requestAnimationFrame((()=>{var e;null===(e=this.firstSelectedOption)||void 0===e||e.scrollIntoView({block:"nearest"})})))}focusoutHandler(e){if(this.syncValue(),!this.open)return!0;const t=e.relatedTarget;this.isSameNode(t)?this.focus():this.options&&this.options.includes(t)||(this.open=!1)}inputHandler(e){if(this.filter=this.control.value,this.filterOptions(),this.isAutocompleteInline||(this.selectedIndex=this.options.map((e=>e.text)).indexOf(this.control.value)),e.inputType.includes("deleteContent")||!this.filter.length)return!0;this.isAutocompleteList&&!this.open&&(this.open=!0),this.isAutocompleteInline&&(this.filteredOptions.length?(this.selectedOptions=[this.filteredOptions[0]],this.selectedIndex=this.options.indexOf(this.firstSelectedOption),this.setInlineSelection()):this.selectedIndex=-1)}keydownHandler(e){const t=e.key;if(e.ctrlKey||e.shiftKey)return!0;switch(t){case"Enter":this.syncValue(),this.isAutocompleteInline&&(this.filter=this.value),this.open=!1,this.clearSelectionRange();break;case"Escape":if(this.isAutocompleteInline||(this.selectedIndex=-1),this.open){this.open=!1;break}this.value="",this.control.value="",this.filter="",this.filterOptions();break;case"Tab":if(this.setInputToSelection(),!this.open)return!0;e.preventDefault(),this.open=!1;break;case"ArrowUp":case"ArrowDown":if(this.filterOptions(),!this.open){this.open=!0;break}this.filteredOptions.length>0&&super.keydownHandler(e),this.isAutocompleteInline&&this.setInlineSelection();break;default:return!0}}keyupHandler(e){switch(e.key){case"ArrowLeft":case"ArrowRight":case"Backspace":case"Delete":case"Home":case"End":this.filter=this.control.value,this.selectedIndex=-1,this.filterOptions()}}selectedIndexChanged(e,t){if(this.$fastController.isConnected){if((t=_o(-1,this.options.length-1,t))!==this.selectedIndex)return void(this.selectedIndex=t);super.selectedIndexChanged(e,t)}}selectPreviousOption(){!this.disabled&&this.selectedIndex>=0&&(this.selectedIndex=this.selectedIndex-1)}setDefaultSelectedOption(){if(this.$fastController.isConnected&&this.options){const e=this.options.findIndex((e=>null!==e.getAttribute("selected")||e.selected));this.selectedIndex=e,!this.dirtyValue&&this.firstSelectedOption&&(this.value=this.firstSelectedOption.text),this.setSelectedOptions()}}setInputToSelection(){this.firstSelectedOption&&(this.control.value=this.firstSelectedOption.text,this.control.focus())}setInlineSelection(){this.firstSelectedOption&&(this.setInputToSelection(),this.control.setSelectionRange(this.filter.length,this.control.value.length,"backward"))}syncValue(){var e;const t=this.selectedIndex>-1?null===(e=this.firstSelectedOption)||void 0===e?void 0:e.text:this.control.value;this.updateValue(this.value!==t)}setPositioning(){const e=this.getBoundingClientRect(),t=window.innerHeight-e.bottom;this.position=this.forcedPosition?this.positionAttribute:e.top>t?Lr:Fr,this.positionAttribute=this.forcedPosition?this.positionAttribute:this.position,this.maxHeight=this.position===Lr?~~e.top:~~t}selectedOptionsChanged(e,t){this.$fastController.isConnected&&this._options.forEach((e=>{e.selected=t.includes(e)}))}slottedOptionsChanged(e,t){super.slottedOptionsChanged(e,t),this.updateValue()}updateValue(e){var t;this.$fastController.isConnected&&(this.value=(null===(t=this.firstSelectedOption)||void 0===t?void 0:t.text)||this.control.value,this.control.value=this.value),e&&this.$emit("change")}clearSelectionRange(){const e=this.control.value.length;this.control.setSelectionRange(e,e)}};Ei([Pt({attribute:"autocomplete",mode:"fromView"})],Hr.prototype,"autocomplete",void 0),Ei([Ye],Hr.prototype,"maxHeight",void 0),Ei([Pt({attribute:"open",mode:"boolean"})],Hr.prototype,"open",void 0),Ei([Pt],Hr.prototype,"placeholder",void 0),Ei([Pt({attribute:"position"})],Hr.prototype,"positionAttribute",void 0),Ei([Ye],Hr.prototype,"position",void 0);class Br{}Ei([Ye],Br.prototype,"ariaAutoComplete",void 0),Ei([Ye],Br.prototype,"ariaControls",void 0),fo(Br,Or),fo(Hr,Ci,Br);function Vr(e){const t=e.parentElement;if(t)return t;{const t=e.getRootNode();if(t.host instanceof HTMLElement)return t.host}return null}const jr=document.createElement("div");class Ur{setProperty(e,t){Ge.queueUpdate((()=>this.target.setProperty(e,t)))}removeProperty(e){Ge.queueUpdate((()=>this.target.removeProperty(e)))}}class Wr extends Ur{constructor(){super();const e=new CSSStyleSheet;this.target=e.cssRules[e.insertRule(":root{}")].style,document.adoptedStyleSheets=[...document.adoptedStyleSheets,e]}}class qr extends Ur{constructor(){super(),this.style=document.createElement("style"),document.head.appendChild(this.style);const{sheet:e}=this.style;if(e){const t=e.insertRule(":root{}",e.cssRules.length);this.target=e.cssRules[t].style}}}class Gr{constructor(e){this.store=new Map,this.target=null;const t=e.$fastController;this.style=document.createElement("style"),t.addStyles(this.style),Ze.getNotifier(t).subscribe(this,"isConnected"),this.handleChange(t,"isConnected")}targetChanged(){if(null!==this.target)for(const[e,t]of this.store.entries())this.target.setProperty(e,t)}setProperty(e,t){this.store.set(e,t),Ge.queueUpdate((()=>{null!==this.target&&this.target.setProperty(e,t)}))}removeProperty(e){this.store.delete(e),Ge.queueUpdate((()=>{null!==this.target&&this.target.removeProperty(e)}))}handleChange(e,t){const{sheet:i}=this.style;if(i){const e=i.insertRule(":host{}",i.cssRules.length);this.target=i.cssRules[e].style}else this.target=null}}Ei([Ye],Gr.prototype,"target",void 0);class Xr{constructor(e){this.target=e.style}setProperty(e,t){Ge.queueUpdate((()=>this.target.setProperty(e,t)))}removeProperty(e){Ge.queueUpdate((()=>this.target.removeProperty(e)))}}class Kr{setProperty(e,t){Kr.properties[e]=t;for(const i of Kr.roots.values())Qr.getOrCreate(Kr.normalizeRoot(i)).setProperty(e,t)}removeProperty(e){delete Kr.properties[e];for(const t of Kr.roots.values())Qr.getOrCreate(Kr.normalizeRoot(t)).removeProperty(e)}static registerRoot(e){const{roots:t}=Kr;if(!t.has(e)){t.add(e);const i=Qr.getOrCreate(this.normalizeRoot(e));for(const e in Kr.properties)i.setProperty(e,Kr.properties[e])}}static unregisterRoot(e){const{roots:t}=Kr;if(t.has(e)){t.delete(e);const i=Qr.getOrCreate(Kr.normalizeRoot(e));for(const e in Kr.properties)i.removeProperty(e)}}static normalizeRoot(e){return e===jr?document:e}}Kr.roots=new Set,Kr.properties={};const Zr=new WeakMap,Yr=Ge.supportsAdoptedStyleSheets?class extends Ur{constructor(e){super();const t=new CSSStyleSheet;this.target=t.cssRules[t.insertRule(":host{}")].style,e.$fastController.addStyles(Et.create([t]))}}:Gr,Qr=Object.freeze({getOrCreate(e){if(Zr.has(e))return Zr.get(e);let t;return e===jr?t=new Kr:e instanceof Document?t=Ge.supportsAdoptedStyleSheets?new Wr:new qr:t=e instanceof Xt?new Yr(e):new Xr(e),Zr.set(e,t),t}});class Jr extends Kt{constructor(e){super(),this.subscribers=new WeakMap,this._appliedTo=new Set,this.name=e.name,null!==e.cssCustomPropertyName&&(this.cssCustomProperty=`--${e.cssCustomPropertyName}`,this.cssVar=`var(${this.cssCustomProperty})`),this.id=Jr.uniqueId(),Jr.tokensById.set(this.id,this)}get appliedTo(){return[...this._appliedTo]}static from(e){return new Jr({name:"string"==typeof e?e:e.name,cssCustomPropertyName:"string"==typeof e?e:void 0===e.cssCustomPropertyName?e.name:e.cssCustomPropertyName})}static isCSSDesignToken(e){return"string"==typeof e.cssCustomProperty}static isDerivedDesignTokenValue(e){return"function"==typeof e}static getTokenById(e){return Jr.tokensById.get(e)}getOrCreateSubscriberSet(e=this){return this.subscribers.get(e)||this.subscribers.set(e,new Set)&&this.subscribers.get(e)}createCSS(){return this.cssVar||""}getValueFor(e){const t=nn.getOrCreate(e).get(this);if(void 0!==t)return t;throw new Error(`Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${e} or an ancestor of ${e}.`)}setValueFor(e,t){return this._appliedTo.add(e),t instanceof Jr&&(t=this.alias(t)),nn.getOrCreate(e).set(this,t),this}deleteValueFor(e){return this._appliedTo.delete(e),nn.existsFor(e)&&nn.getOrCreate(e).delete(this),this}withDefault(e){return this.setValueFor(jr,e),this}subscribe(e,t){const i=this.getOrCreateSubscriberSet(t);t&&!nn.existsFor(t)&&nn.getOrCreate(t),i.has(e)||i.add(e)}unsubscribe(e,t){const i=this.subscribers.get(t||this);i&&i.has(e)&&i.delete(e)}notify(e){const t=Object.freeze({token:this,target:e});this.subscribers.has(this)&&this.subscribers.get(this).forEach((e=>e.handleChange(t))),this.subscribers.has(e)&&this.subscribers.get(e).forEach((e=>e.handleChange(t)))}alias(e){return t=>e.getValueFor(t)}}Jr.uniqueId=(()=>{let e=0;return()=>(e++,e.toString(16))})(),Jr.tokensById=new Map;class en{constructor(e,t,i){this.source=e,this.token=t,this.node=i,this.dependencies=new Set,this.observer=Ze.binding(e,this,!1),this.observer.handleChange=this.observer.call,this.handleChange()}disconnect(){this.observer.disconnect()}handleChange(){this.node.store.set(this.token,this.observer.observe(this.node.target,et))}}class tn{constructor(){this.values=new Map}set(e,t){this.values.get(e)!==t&&(this.values.set(e,t),Ze.getNotifier(this).notify(e.id))}get(e){return Ze.track(this,e.id),this.values.get(e)}delete(e){this.values.delete(e)}all(){return this.values.entries()}}const on=new WeakMap,rn=new WeakMap;class nn{constructor(e){this.target=e,this.store=new tn,this.children=[],this.assignedValues=new Map,this.reflecting=new Set,this.bindingObservers=new Map,this.tokenValueChangeHandler={handleChange:(e,t)=>{const i=Jr.getTokenById(t);if(i&&(i.notify(this.target),Jr.isCSSDesignToken(i))){const t=this.parent,o=this.isReflecting(i);if(t){const r=t.get(i),n=e.get(i);r===n||o?r===n&&o&&this.stopReflectToCSS(i):this.reflectToCSS(i)}else o||this.reflectToCSS(i)}}},on.set(e,this),Ze.getNotifier(this.store).subscribe(this.tokenValueChangeHandler),e instanceof Xt?e.$fastController.addBehaviors([this]):e.isConnected&&this.bind()}static getOrCreate(e){return on.get(e)||new nn(e)}static existsFor(e){return on.has(e)}static findParent(e){if(jr!==e.target){let t=Vr(e.target);for(;null!==t;){if(on.has(t))return on.get(t);t=Vr(t)}return nn.getOrCreate(jr)}return null}static findClosestAssignedNode(e,t){let i=t;do{if(i.has(e))return i;i=i.parent?i.parent:i.target!==jr?nn.getOrCreate(jr):null}while(null!==i);return null}get parent(){return rn.get(this)||null}has(e){return this.assignedValues.has(e)}get(e){const t=this.store.get(e);if(void 0!==t)return t;const i=this.getRaw(e);return void 0!==i?(this.hydrate(e,i),this.get(e)):void 0}getRaw(e){var t;return this.assignedValues.has(e)?this.assignedValues.get(e):null===(t=nn.findClosestAssignedNode(e,this))||void 0===t?void 0:t.getRaw(e)}set(e,t){Jr.isDerivedDesignTokenValue(this.assignedValues.get(e))&&this.tearDownBindingObserver(e),this.assignedValues.set(e,t),Jr.isDerivedDesignTokenValue(t)?this.setupBindingObserver(e,t):this.store.set(e,t)}delete(e){this.assignedValues.delete(e),this.tearDownBindingObserver(e);const t=this.getRaw(e);t?this.hydrate(e,t):this.store.delete(e)}bind(){const e=nn.findParent(this);e&&e.appendChild(this);for(const e of this.assignedValues.keys())e.notify(this.target)}unbind(){if(this.parent){rn.get(this).removeChild(this)}}appendChild(e){e.parent&&rn.get(e).removeChild(e);const t=this.children.filter((t=>e.contains(t)));rn.set(e,this),this.children.push(e),t.forEach((t=>e.appendChild(t))),Ze.getNotifier(this.store).subscribe(e);for(const[t,i]of this.store.all())e.hydrate(t,this.bindingObservers.has(t)?this.getRaw(t):i)}removeChild(e){const t=this.children.indexOf(e);return-1!==t&&this.children.splice(t,1),Ze.getNotifier(this.store).unsubscribe(e),e.parent===this&&rn.delete(e)}contains(e){return function(e,t){let i=t;for(;null!==i;){if(i===e)return!0;i=Vr(i)}return!1}(this.target,e.target)}reflectToCSS(e){this.isReflecting(e)||(this.reflecting.add(e),nn.cssCustomPropertyReflector.startReflection(e,this.target))}stopReflectToCSS(e){this.isReflecting(e)&&(this.reflecting.delete(e),nn.cssCustomPropertyReflector.stopReflection(e,this.target))}isReflecting(e){return this.reflecting.has(e)}handleChange(e,t){const i=Jr.getTokenById(t);i&&this.hydrate(i,this.getRaw(i))}hydrate(e,t){if(!this.has(e)){const i=this.bindingObservers.get(e);Jr.isDerivedDesignTokenValue(t)?i?i.source!==t&&(this.tearDownBindingObserver(e),this.setupBindingObserver(e,t)):this.setupBindingObserver(e,t):(i&&this.tearDownBindingObserver(e),this.store.set(e,t))}}setupBindingObserver(e,t){const i=new en(t,e,this);return this.bindingObservers.set(e,i),i}tearDownBindingObserver(e){return!!this.bindingObservers.has(e)&&(this.bindingObservers.get(e).disconnect(),this.bindingObservers.delete(e),!0)}}nn.cssCustomPropertyReflector=new class{startReflection(e,t){e.subscribe(this,t),this.handleChange({token:e,target:t})}stopReflection(e,t){e.unsubscribe(this,t),this.remove(e,t)}handleChange(e){const{token:t,target:i}=e;this.add(t,i)}add(e,t){Qr.getOrCreate(t).setProperty(e.cssCustomProperty,this.resolveCSSValue(nn.getOrCreate(t).get(e)))}remove(e,t){Qr.getOrCreate(t).removeProperty(e.cssCustomProperty)}resolveCSSValue(e){return e&&"function"==typeof e.createCSS?e.createCSS():e}},Ei([Ye],nn.prototype,"children",void 0);const sn=Object.freeze({create:function(e){return Jr.from(e)},notifyConnection:e=>!(!e.isConnected||!nn.existsFor(e))&&(nn.getOrCreate(e).bind(),!0),notifyDisconnection:e=>!(e.isConnected||!nn.existsFor(e))&&(nn.getOrCreate(e).unbind(),!0),registerRoot(e=jr){Kr.registerRoot(e)},unregisterRoot(e=jr){Kr.unregisterRoot(e)}}),an=Object.freeze({definitionCallbackOnly:null,ignoreDuplicate:Symbol()}),ln=new Map,dn=new Map;let cn=null;const hn=zi.createInterface((e=>e.cachedCallback((e=>(null===cn&&(cn=new pn(null,e)),cn))))),un=Object.freeze({tagFor:e=>dn.get(e),responsibleFor(e){const t=e.$$designSystem$$;if(t)return t;return zi.findResponsibleContainer(e).get(hn)},getOrCreate(e){if(!e)return null===cn&&(cn=zi.getOrCreateDOMContainer().get(hn)),cn;const t=e.$$designSystem$$;if(t)return t;const i=zi.getOrCreateDOMContainer(e);if(i.has(hn,!1))return i.get(hn);{const t=new pn(e,i);return i.register(Ji.instance(hn,t)),t}}});class pn{constructor(e,t){this.owner=e,this.container=t,this.designTokensInitialized=!1,this.prefix="fast",this.shadowRootMode=void 0,this.disambiguate=()=>an.definitionCallbackOnly,null!==e&&(e.$$designSystem$$=this)}withPrefix(e){return this.prefix=e,this}withShadowRootMode(e){return this.shadowRootMode=e,this}withElementDisambiguation(e){return this.disambiguate=e,this}withDesignTokenRoot(e){return this.designTokenRoot=e,this}register(...e){const t=this.container,i=[],o=this.disambiguate,r=this.shadowRootMode,n={elementPrefix:this.prefix,tryDefineElement(e,n,s){const a=function(e,t,i){return"string"==typeof e?{name:e,type:t,callback:i}:e}(e,n,s),{name:l,callback:d,baseClass:c}=a;let{type:h}=a,u=l,p=ln.get(u),m=!0;for(;p;){const e=o(u,h,p);switch(e){case an.ignoreDuplicate:return;case an.definitionCallbackOnly:m=!1,p=void 0;break;default:u=e,p=ln.get(u)}}m&&((dn.has(h)||h===uo)&&(h=class extends h{}),ln.set(u,h),dn.set(h,u),c&&dn.set(c,u)),i.push(new mn(t,u,h,r,d,m))}};this.designTokensInitialized||(this.designTokensInitialized=!0,null!==this.designTokenRoot&&sn.registerRoot(this.designTokenRoot)),t.registerWithContext(n,...e);for(const e of i)e.callback(e),e.willDefine&&null!==e.definition&&e.definition.define();return this}}class mn{constructor(e,t,i,o,r,n){this.container=e,this.name=t,this.type=i,this.shadowRootMode=o,this.callback=r,this.willDefine=n,this.definition=null}definePresentation(e){co.define(this.name,e,this.container)}defineElement(e){this.definition=new Vt(this.type,Object.assign(Object.assign({},e),{name:this.name}))}tagFor(e){return un.tagFor(e)}}
/*!
* tabbable 5.3.3
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
var fn=["input","select","textarea","a[href]","button","[tabindex]:not(slot)","audio[controls]","video[controls]",'[contenteditable]:not([contenteditable="false"])',"details>summary:first-of-type","details"],gn=fn.join(","),vn="undefined"==typeof Element,bn=vn?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,yn=!vn&&Element.prototype.getRootNode?function(e){return e.getRootNode()}:function(e){return e.ownerDocument},xn=function(e){return"INPUT"===e.tagName},wn=function(e){return function(e){return xn(e)&&"radio"===e.type}(e)&&!function(e){if(!e.name)return!0;var t,i=e.form||yn(e),o=function(e){return i.querySelectorAll('input[type="radio"][name="'+e+'"]')};if("undefined"!=typeof window&&void 0!==window.CSS&&"function"==typeof window.CSS.escape)t=o(window.CSS.escape(e.name));else try{t=o(e.name)}catch(e){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",e.message),!1}var r=function(e,t){for(var i=0;i<e.length;i++)if(e[i].checked&&e[i].form===t)return e[i]}(t,e.form);return!r||r===e}(e)},kn=function(e){var t=e.getBoundingClientRect(),i=t.width,o=t.height;return 0===i&&0===o},Cn=function(e,t){return!(t.disabled||function(e){return xn(e)&&"hidden"===e.type}(t)||function(e,t){var i=t.displayCheck,o=t.getShadowRoot;if("hidden"===getComputedStyle(e).visibility)return!0;var r=bn.call(e,"details>summary:first-of-type")?e.parentElement:e;if(bn.call(r,"details:not([open]) *"))return!0;var n=yn(e).host,s=(null==n?void 0:n.ownerDocument.contains(n))||e.ownerDocument.contains(e);if(i&&"full"!==i){if("non-zero-area"===i)return kn(e)}else{if("function"==typeof o){for(var a=e;e;){var l=e.parentElement,d=yn(e);if(l&&!l.shadowRoot&&!0===o(l))return kn(e);e=e.assignedSlot?e.assignedSlot:l||d===e.ownerDocument?l:d.host}e=a}if(s)return!e.getClientRects().length}return!1}(t,e)||function(e){return"DETAILS"===e.tagName&&Array.prototype.slice.apply(e.children).some((function(e){return"SUMMARY"===e.tagName}))}(t)||function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if("FIELDSET"===t.tagName&&t.disabled){for(var i=0;i<t.children.length;i++){var o=t.children.item(i);if("LEGEND"===o.tagName)return!!bn.call(t,"fieldset[disabled] *")||!o.contains(e)}return!0}t=t.parentElement}return!1}(t))},$n=function(e,t){return!(wn(t)||function(e,t){return e.tabIndex<0&&(t||/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||e.isContentEditable)&&isNaN(parseInt(e.getAttribute("tabindex"),10))?0:e.tabIndex}(t)<0||!Cn(e,t))},_n=function(e,t){if(t=t||{},!e)throw new Error("No node provided");return!1!==bn.call(e,gn)&&$n(t,e)},Sn=fn.concat("iframe").join(","),Tn=function(e,t){if(t=t||{},!e)throw new Error("No node provided");return!1!==bn.call(e,Sn)&&Cn(t,e)};class En extends uo{constructor(){super(...arguments),this.modal=!0,this.hidden=!1,this.trapFocus=!0,this.trapFocusChanged=()=>{this.$fastController.isConnected&&this.updateTrapFocus()},this.isTrappingFocus=!1,this.handleDocumentKeydown=e=>{if(!e.defaultPrevented&&!this.hidden)switch(e.key){case"Escape":this.dismiss(),e.preventDefault();break;case"Tab":this.handleTabKeyDown(e)}},this.handleDocumentFocus=e=>{!e.defaultPrevented&&this.shouldForceFocus(e.target)&&(this.focusFirstElement(),e.preventDefault())},this.handleTabKeyDown=e=>{if(!this.trapFocus||this.hidden)return;const t=this.getTabQueueBounds();return 0!==t.length?1===t.length?(t[0].focus(),void e.preventDefault()):void(e.shiftKey&&e.target===t[0]?(t[t.length-1].focus(),e.preventDefault()):e.shiftKey||e.target!==t[t.length-1]||(t[0].focus(),e.preventDefault())):void 0},this.getTabQueueBounds=()=>En.reduceTabbableItems([],this),this.focusFirstElement=()=>{const e=this.getTabQueueBounds();e.length>0?e[0].focus():this.dialog instanceof HTMLElement&&this.dialog.focus()},this.shouldForceFocus=e=>this.isTrappingFocus&&!this.contains(e),this.shouldTrapFocus=()=>this.trapFocus&&!this.hidden,this.updateTrapFocus=e=>{const t=void 0===e?this.shouldTrapFocus():e;t&&!this.isTrappingFocus?(this.isTrappingFocus=!0,document.addEventListener("focusin",this.handleDocumentFocus),Ge.queueUpdate((()=>{this.shouldForceFocus(document.activeElement)&&this.focusFirstElement()}))):!t&&this.isTrappingFocus&&(this.isTrappingFocus=!1,document.removeEventListener("focusin",this.handleDocumentFocus))}}dismiss(){this.$emit("dismiss"),this.$emit("cancel")}show(){this.hidden=!1}hide(){this.hidden=!0,this.$emit("close")}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this.handleDocumentKeydown),this.notifier=Ze.getNotifier(this),this.notifier.subscribe(this,"hidden"),this.updateTrapFocus()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this.handleDocumentKeydown),this.updateTrapFocus(!1),this.notifier.unsubscribe(this,"hidden")}handleChange(e,t){if("hidden"===t)this.updateTrapFocus()}static reduceTabbableItems(e,t){return"-1"===t.getAttribute("tabindex")?e:_n(t)||En.isFocusableFastElement(t)&&En.hasTabbableShadow(t)?(e.push(t),e):t.childElementCount?e.concat(Array.from(t.children).reduce(En.reduceTabbableItems,[])):e}static isFocusableFastElement(e){var t,i;return!!(null===(i=null===(t=e.$fastController)||void 0===t?void 0:t.definition.shadowOptions)||void 0===i?void 0:i.delegatesFocus)}static hasTabbableShadow(e){var t,i;return Array.from(null!==(i=null===(t=e.shadowRoot)||void 0===t?void 0:t.querySelectorAll("*"))&&void 0!==i?i:[]).some((e=>_n(e)))}}Ei([Pt({mode:"boolean"})],En.prototype,"modal",void 0),Ei([Pt({mode:"boolean"})],En.prototype,"hidden",void 0),Ei([Pt({attribute:"trap-focus",mode:"boolean"})],En.prototype,"trapFocus",void 0),Ei([Pt({attribute:"aria-describedby"})],En.prototype,"ariaDescribedby",void 0),Ei([Pt({attribute:"aria-labelledby"})],En.prototype,"ariaLabelledby",void 0),Ei([Pt({attribute:"aria-label"})],En.prototype,"ariaLabel",void 0);let An=class extends uo{connectedCallback(){super.connectedCallback(),this.setup()}disconnectedCallback(){super.disconnectedCallback(),this.details.removeEventListener("toggle",this.onToggle)}show(){this.details.open=!0}hide(){this.details.open=!1}toggle(){this.details.open=!this.details.open}setup(){this.onToggle=this.onToggle.bind(this),this.details.addEventListener("toggle",this.onToggle),this.expanded&&this.show()}onToggle(){this.expanded=this.details.open,this.$emit("toggle")}};Ei([Pt({mode:"boolean"})],An.prototype,"expanded",void 0),Ei([Pt],An.prototype,"title",void 0);const In="separator";class On extends uo{constructor(){super(...arguments),this.role=In,this.orientation=vo}}Ei([Pt],On.prototype,"role",void 0),Ei([Pt],On.prototype,"orientation",void 0);const Ln="next",Fn="previous";class Mn extends uo{constructor(){super(...arguments),this.hiddenFromAT=!0,this.direction=Ln}keyupHandler(e){if(!this.hiddenFromAT){const t=e.key;"Enter"!==t&&"Space"!==t||this.$emit("click",e),"Escape"===t&&this.blur()}}}Ei([Pt({mode:"boolean"})],Mn.prototype,"disabled",void 0),Ei([Pt({attribute:"aria-hidden",converter:Rt})],Mn.prototype,"hiddenFromAT",void 0),Ei([Pt],Mn.prototype,"direction",void 0);class Rn extends Ir{constructor(){super(...arguments),this.activeIndex=-1,this.rangeStartIndex=-1}get activeOption(){return this.options[this.activeIndex]}get checkedOptions(){var e;return null===(e=this.options)||void 0===e?void 0:e.filter((e=>e.checked))}get firstSelectedOptionIndex(){return this.options.indexOf(this.firstSelectedOption)}activeIndexChanged(e,t){var i,o;this.ariaActiveDescendant=null!==(o=null===(i=this.options[t])||void 0===i?void 0:i.id)&&void 0!==o?o:"",this.focusAndScrollOptionIntoView()}checkActiveIndex(){if(!this.multiple)return;const e=this.activeOption;e&&(e.checked=!0)}checkFirstOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex+1),this.options.forEach(((e,t)=>{e.checked=So(t,this.rangeStartIndex)}))):this.uncheckAllOptions(),this.activeIndex=0,this.checkActiveIndex()}checkLastOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex),this.options.forEach(((e,t)=>{e.checked=So(t,this.rangeStartIndex,this.options.length)}))):this.uncheckAllOptions(),this.activeIndex=this.options.length-1,this.checkActiveIndex()}connectedCallback(){super.connectedCallback(),this.addEventListener("focusout",this.focusoutHandler)}disconnectedCallback(){this.removeEventListener("focusout",this.focusoutHandler),super.disconnectedCallback()}checkNextOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex),this.options.forEach(((e,t)=>{e.checked=So(t,this.rangeStartIndex,this.activeIndex+1)}))):this.uncheckAllOptions(),this.activeIndex+=this.activeIndex<this.options.length-1?1:0,this.checkActiveIndex()}checkPreviousOption(e=!1){e?(-1===this.rangeStartIndex&&(this.rangeStartIndex=this.activeIndex),1===this.checkedOptions.length&&(this.rangeStartIndex+=1),this.options.forEach(((e,t)=>{e.checked=So(t,this.activeIndex,this.rangeStartIndex)}))):this.uncheckAllOptions(),this.activeIndex-=this.activeIndex>0?1:0,this.checkActiveIndex()}clickHandler(e){var t;if(!this.multiple)return super.clickHandler(e);const i=null===(t=e.target)||void 0===t?void 0:t.closest("[role=option]");return i&&!i.disabled?(this.uncheckAllOptions(),this.activeIndex=this.options.indexOf(i),this.checkActiveIndex(),this.toggleSelectedForAllCheckedOptions(),!0):void 0}focusAndScrollOptionIntoView(){super.focusAndScrollOptionIntoView(this.activeOption)}focusinHandler(e){if(!this.multiple)return super.focusinHandler(e);this.shouldSkipFocus||e.target!==e.currentTarget||(this.uncheckAllOptions(),-1===this.activeIndex&&(this.activeIndex=-1!==this.firstSelectedOptionIndex?this.firstSelectedOptionIndex:0),this.checkActiveIndex(),this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}focusoutHandler(e){this.multiple&&this.uncheckAllOptions()}keydownHandler(e){if(!this.multiple)return super.keydownHandler(e);if(this.disabled)return!0;const{key:t,shiftKey:i}=e;switch(this.shouldSkipFocus=!1,t){case"Home":return void this.checkFirstOption(i);case"ArrowDown":return void this.checkNextOption(i);case"ArrowUp":return void this.checkPreviousOption(i);case"End":return void this.checkLastOption(i);case"Tab":return this.focusAndScrollOptionIntoView(),!0;case"Escape":return this.uncheckAllOptions(),this.checkActiveIndex(),!0;case" ":if(e.preventDefault(),this.typeAheadExpired)return void this.toggleSelectedForAllCheckedOptions();default:return 1===t.length&&this.handleTypeAhead(`${t}`),!0}}mousedownHandler(e){if(e.offsetX>=0&&e.offsetX<=this.scrollWidth)return super.mousedownHandler(e)}multipleChanged(e,t){var i;this.ariaMultiSelectable=t?"true":null,null===(i=this.options)||void 0===i||i.forEach((e=>{e.checked=!t&&void 0})),this.setSelectedOptions()}setSelectedOptions(){this.multiple?this.$fastController.isConnected&&this.options&&(this.selectedOptions=this.options.filter((e=>e.selected)),this.focusAndScrollOptionIntoView()):super.setSelectedOptions()}sizeChanged(e,t){var i;const o=Math.max(0,parseInt(null!==(i=null==t?void 0:t.toFixed())&&void 0!==i?i:"",10));o!==t&&Ge.queueUpdate((()=>{this.size=o}))}toggleSelectedForAllCheckedOptions(){const e=this.checkedOptions.filter((e=>!e.disabled)),t=!e.every((e=>e.selected));e.forEach((e=>e.selected=t)),this.selectedIndex=this.options.indexOf(e[e.length-1]),this.setSelectedOptions()}typeaheadBufferChanged(e,t){if(this.multiple){if(this.$fastController.isConnected){const e=this.getTypeaheadMatches(),t=this.options.indexOf(e[0]);t>-1&&(this.activeIndex=t,this.uncheckAllOptions(),this.checkActiveIndex()),this.typeAheadExpired=!1}}else super.typeaheadBufferChanged(e,t)}uncheckAllOptions(e=!1){this.options.forEach((e=>e.checked=!this.multiple&&void 0)),e||(this.rangeStartIndex=-1)}}Ei([Ye],Rn.prototype,"activeIndex",void 0),Ei([Pt({mode:"boolean"})],Rn.prototype,"multiple",void 0),Ei([Pt({converter:Dt})],Rn.prototype,"size",void 0);let Dn=class extends uo{constructor(){super(...arguments),this.optionElements=[]}menuElementsChanged(){this.updateOptions()}headerElementsChanged(){this.updateOptions()}footerElementsChanged(){this.updateOptions()}updateOptions(){this.optionElements.splice(0,this.optionElements.length),this.addSlottedListItems(this.headerElements),this.addSlottedListItems(this.menuElements),this.addSlottedListItems(this.footerElements),this.$emit("optionsupdated",{bubbles:!1})}addSlottedListItems(e){void 0!==e&&e.forEach((e=>{1===e.nodeType&&"listitem"===e.getAttribute("role")&&(e.id=e.id||Eo("option-"),this.optionElements.push(e))}))}};Ei([Ye],Dn.prototype,"menuElements",void 0),Ei([Ye],Dn.prototype,"headerElements",void 0),Ei([Ye],Dn.prototype,"footerElements",void 0),Ei([Ye],Dn.prototype,"suggestionsAvailableText",void 0);const zn=Tt`
    <template>
        ${e=>e.value}
    </template>
`;class Pn extends uo{contentsTemplateChanged(){this.$fastController.isConnected&&this.updateView()}connectedCallback(){super.connectedCallback(),this.updateView()}disconnectedCallback(){super.disconnectedCallback(),this.disconnectView()}handleClick(e){return e.defaultPrevented||this.handleInvoked(),!1}handleInvoked(){this.$emit("pickeroptioninvoked")}updateView(){var e,t;this.disconnectView(),this.customView=null!==(t=null===(e=this.contentsTemplate)||void 0===e?void 0:e.render(this,this))&&void 0!==t?t:zn.render(this,this)}disconnectView(){var e;null===(e=this.customView)||void 0===e||e.dispose(),this.customView=void 0}}Ei([Pt({attribute:"value"})],Pn.prototype,"value",void 0),Ei([Ye],Pn.prototype,"contentsTemplate",void 0);class Nn extends uo{}const Hn=Tt`
    <template>
        ${e=>e.value}
    </template>
`;class Bn extends uo{contentsTemplateChanged(){this.$fastController.isConnected&&this.updateView()}connectedCallback(){super.connectedCallback(),this.updateView()}disconnectedCallback(){this.disconnectView(),super.disconnectedCallback()}handleKeyDown(e){return!e.defaultPrevented&&("Enter"!==e.key||(this.handleInvoke(),!1))}handleClick(e){return e.defaultPrevented||this.handleInvoke(),!1}handleInvoke(){this.$emit("pickeriteminvoked")}updateView(){var e,t;this.disconnectView(),this.customView=null!==(t=null===(e=this.contentsTemplate)||void 0===e?void 0:e.render(this,this))&&void 0!==t?t:Hn.render(this,this)}disconnectView(){var e;null===(e=this.customView)||void 0===e||e.dispose(),this.customView=void 0}}Ei([Pt({attribute:"value"})],Bn.prototype,"value",void 0),Ei([Ye],Bn.prototype,"contentsTemplate",void 0);class Vn extends uo{}class jn extends(Qo(Vn)){constructor(){super(...arguments),this.proxy=document.createElement("input")}}const Un=Tt`
    <input
        slot="input-region"
        role="combobox"
        type="text"
        autocapitalize="off"
        autocomplete="off"
        haspopup="list"
        aria-label="${e=>e.label}"
        aria-labelledby="${e=>e.labelledBy}"
        placeholder="${e=>e.placeholder}"
        ${di("inputElement")}
    ></input>
`;class Wn extends jn{constructor(){super(...arguments),this.selection="",this.filterSelected=!0,this.filterQuery=!0,this.noSuggestionsText="No suggestions available",this.suggestionsAvailableText="Suggestions available",this.loadingText="Loading suggestions",this.menuPlacement="bottom-fill",this.showLoading=!1,this.optionsList=[],this.filteredOptionsList=[],this.flyoutOpen=!1,this.menuFocusIndex=-1,this.showNoOptions=!1,this.selectedItems=[],this.inputElementView=null,this.handleTextInput=e=>{this.query=this.inputElement.value},this.handleInputClick=e=>{e.preventDefault(),this.toggleFlyout(!0)},this.setRegionProps=()=>{this.flyoutOpen&&(null!==this.region&&void 0!==this.region?this.region.anchorElement=this.inputElement:Ge.queueUpdate(this.setRegionProps))},this.configLookup={top:Ho,bottom:Bo,tallest:Vo,"top-fill":jo,"bottom-fill":Uo,"tallest-fill":Wo}}selectionChanged(){this.$fastController.isConnected&&(this.handleSelectionChange(),this.proxy instanceof HTMLInputElement&&(this.proxy.value=this.selection,this.validate()))}optionsChanged(){this.optionsList=this.options.split(",").map((e=>e.trim())).filter((e=>""!==e))}menuPlacementChanged(){this.$fastController.isConnected&&this.updateMenuConfig()}showLoadingChanged(){this.$fastController.isConnected&&Ge.queueUpdate((()=>{this.setFocusedOption(0)}))}listItemTemplateChanged(){this.updateListItemTemplate()}defaultListItemTemplateChanged(){this.updateListItemTemplate()}menuOptionTemplateChanged(){this.updateOptionTemplate()}defaultMenuOptionTemplateChanged(){this.updateOptionTemplate()}optionsListChanged(){this.updateFilteredOptions()}queryChanged(){this.$fastController.isConnected&&(this.inputElement.value!==this.query&&(this.inputElement.value=this.query),this.updateFilteredOptions(),this.$emit("querychange",{bubbles:!1}))}filteredOptionsListChanged(){this.$fastController.isConnected&&(this.showNoOptions=0===this.filteredOptionsList.length&&0===this.menuElement.querySelectorAll('[role="listitem"]').length,this.setFocusedOption(this.showNoOptions?-1:0))}flyoutOpenChanged(){this.flyoutOpen?(Ge.queueUpdate(this.setRegionProps),this.$emit("menuopening",{bubbles:!1})):this.$emit("menuclosing",{bubbles:!1})}showNoOptionsChanged(){this.$fastController.isConnected&&Ge.queueUpdate((()=>{this.setFocusedOption(0)}))}connectedCallback(){super.connectedCallback(),this.listElement=document.createElement(this.selectedListTag),this.appendChild(this.listElement),this.itemsPlaceholderElement=document.createComment(""),this.listElement.append(this.itemsPlaceholderElement),this.inputElementView=Un.render(this,this.listElement);const e=this.menuTag.toUpperCase();this.menuElement=Array.from(this.children).find((t=>t.tagName===e)),void 0===this.menuElement&&(this.menuElement=document.createElement(this.menuTag),this.appendChild(this.menuElement)),""===this.menuElement.id&&(this.menuElement.id=Eo("listbox-")),this.menuId=this.menuElement.id,this.optionsPlaceholder=document.createComment(""),this.menuElement.append(this.optionsPlaceholder),this.updateMenuConfig(),Ge.queueUpdate((()=>this.initialize()))}disconnectedCallback(){super.disconnectedCallback(),this.toggleFlyout(!1),this.inputElement.removeEventListener("input",this.handleTextInput),this.inputElement.removeEventListener("click",this.handleInputClick),null!==this.inputElementView&&(this.inputElementView.dispose(),this.inputElementView=null)}focus(){this.inputElement.focus()}initialize(){this.updateListItemTemplate(),this.updateOptionTemplate(),this.itemsRepeatBehavior=new fi((e=>e.selectedItems),(e=>e.activeListItemTemplate),{positioning:!0}).createBehavior(this.itemsPlaceholderElement),this.inputElement.addEventListener("input",this.handleTextInput),this.inputElement.addEventListener("click",this.handleInputClick),this.$fastController.addBehaviors([this.itemsRepeatBehavior]),this.menuElement.suggestionsAvailableText=this.suggestionsAvailableText,this.menuElement.addEventListener("optionsupdated",this.handleMenuOptionsUpdated),this.optionsRepeatBehavior=new fi((e=>e.filteredOptionsList),(e=>e.activeMenuOptionTemplate),{positioning:!0}).createBehavior(this.optionsPlaceholder),this.$fastController.addBehaviors([this.optionsRepeatBehavior]),this.handleSelectionChange()}toggleFlyout(e){if(this.flyoutOpen!==e){if(e&&document.activeElement===this.inputElement)return this.flyoutOpen=e,void Ge.queueUpdate((()=>{void 0!==this.menuElement?this.setFocusedOption(0):this.disableMenu()}));this.flyoutOpen=!1,this.disableMenu()}}handleMenuOptionsUpdated(e){e.preventDefault(),this.flyoutOpen&&this.setFocusedOption(0)}handleKeyDown(e){if(e.defaultPrevented)return!1;switch(e.key){case"ArrowDown":if(this.flyoutOpen){const e=this.flyoutOpen?Math.min(this.menuFocusIndex+1,this.menuElement.optionElements.length-1):0;this.setFocusedOption(e)}else this.toggleFlyout(!0);return!1;case"ArrowUp":if(this.flyoutOpen){const e=this.flyoutOpen?Math.max(this.menuFocusIndex-1,0):0;this.setFocusedOption(e)}else this.toggleFlyout(!0);return!1;case"Escape":return this.toggleFlyout(!1),!1;case"Enter":return-1!==this.menuFocusIndex&&this.menuElement.optionElements.length>this.menuFocusIndex&&this.menuElement.optionElements[this.menuFocusIndex].click(),!1;case"ArrowRight":return document.activeElement===this.inputElement||(this.incrementFocusedItem(1),!1);case"ArrowLeft":return 0!==this.inputElement.selectionStart||(this.incrementFocusedItem(-1),!1);case"Delete":case"Backspace":{if(null===document.activeElement)return!0;if(document.activeElement===this.inputElement)return 0!==this.inputElement.selectionStart||(this.selection=this.selectedItems.slice(0,this.selectedItems.length-1).toString(),this.toggleFlyout(!1),!1);const e=Array.from(this.listElement.children),t=e.indexOf(document.activeElement);return!(t>-1)||(this.selection=this.selectedItems.splice(t,1).toString(),Ge.queueUpdate((()=>{e[Math.min(e.length,t)].focus()})),!1)}}return this.toggleFlyout(!0),!0}handleFocusIn(e){return!1}handleFocusOut(e){return void 0!==this.menuElement&&this.menuElement.contains(e.relatedTarget)||this.toggleFlyout(!1),!1}handleSelectionChange(){this.selectedItems.toString()!==this.selection&&(this.selectedItems=""===this.selection?[]:this.selection.split(","),this.updateFilteredOptions(),Ge.queueUpdate((()=>{this.checkMaxItems()})),this.$emit("selectionchange",{bubbles:!1}))}handleRegionLoaded(e){Ge.queueUpdate((()=>{this.setFocusedOption(0),this.$emit("menuloaded",{bubbles:!1})}))}checkMaxItems(){if(void 0!==this.inputElement)if(void 0!==this.maxSelected&&this.selectedItems.length>=this.maxSelected){if(document.activeElement===this.inputElement){const e=Array.from(this.listElement.querySelectorAll("[role='listitem']"));e[e.length-1].focus()}this.inputElement.hidden=!0}else this.inputElement.hidden=!1}handleItemInvoke(e){if(e.defaultPrevented)return!1;if(e.target instanceof Bn){const t=Array.from(this.listElement.querySelectorAll("[role='listitem']")).indexOf(e.target);if(-1!==t){const e=this.selectedItems.slice();e.splice(t,1),this.selection=e.toString(),Ge.queueUpdate((()=>this.incrementFocusedItem(0)))}return!1}return!0}handleOptionInvoke(e){return!e.defaultPrevented&&(!(e.target instanceof Pn)||(void 0!==e.target.value&&(this.selection=`${this.selection}${""===this.selection?"":","}${e.target.value}`),this.inputElement.value="",this.query="",this.inputElement.focus(),this.toggleFlyout(!1),!1))}incrementFocusedItem(e){if(0===this.selectedItems.length)return void this.inputElement.focus();const t=Array.from(this.listElement.querySelectorAll("[role='listitem']"));if(null!==document.activeElement){let i=t.indexOf(document.activeElement);-1===i&&(i=t.length);const o=Math.min(t.length,Math.max(0,i+e));o===t.length?void 0!==this.maxSelected&&this.selectedItems.length>=this.maxSelected?t[o-1].focus():this.inputElement.focus():t[o].focus()}}disableMenu(){var e,t,i;this.menuFocusIndex=-1,this.menuFocusOptionId=void 0,null===(e=this.inputElement)||void 0===e||e.removeAttribute("aria-activedescendant"),null===(t=this.inputElement)||void 0===t||t.removeAttribute("aria-owns"),null===(i=this.inputElement)||void 0===i||i.removeAttribute("aria-expanded")}setFocusedOption(e){if(!this.flyoutOpen||-1===e||this.showNoOptions||this.showLoading)return void this.disableMenu();if(0===this.menuElement.optionElements.length)return;this.menuElement.optionElements.forEach((e=>{e.setAttribute("aria-selected","false")})),this.menuFocusIndex=e,this.menuFocusIndex>this.menuElement.optionElements.length-1&&(this.menuFocusIndex=this.menuElement.optionElements.length-1),this.menuFocusOptionId=this.menuElement.optionElements[this.menuFocusIndex].id,this.inputElement.setAttribute("aria-owns",this.menuId),this.inputElement.setAttribute("aria-expanded","true"),this.inputElement.setAttribute("aria-activedescendant",this.menuFocusOptionId);const t=this.menuElement.optionElements[this.menuFocusIndex];t.setAttribute("aria-selected","true"),this.menuElement.scrollTo(0,t.offsetTop)}updateListItemTemplate(){var e;this.activeListItemTemplate=null!==(e=this.listItemTemplate)&&void 0!==e?e:this.defaultListItemTemplate}updateOptionTemplate(){var e;this.activeMenuOptionTemplate=null!==(e=this.menuOptionTemplate)&&void 0!==e?e:this.defaultMenuOptionTemplate}updateFilteredOptions(){this.filteredOptionsList=this.optionsList.slice(0),this.filterSelected&&(this.filteredOptionsList=this.filteredOptionsList.filter((e=>-1===this.selectedItems.indexOf(e)))),this.filterQuery&&""!==this.query&&void 0!==this.query&&(this.filteredOptionsList=this.filteredOptionsList.filter((e=>-1!==e.indexOf(this.query))))}updateMenuConfig(){let e=this.configLookup[this.menuPlacement];null===e&&(e=Uo),this.menuConfig=Object.assign(Object.assign({},e),{autoUpdateMode:"auto",fixedPlacement:!0,horizontalViewportLock:!1,verticalViewportLock:!1})}}Ei([Pt({attribute:"selection"})],Wn.prototype,"selection",void 0),Ei([Pt({attribute:"options"})],Wn.prototype,"options",void 0),Ei([Pt({attribute:"filter-selected",mode:"boolean"})],Wn.prototype,"filterSelected",void 0),Ei([Pt({attribute:"filter-query",mode:"boolean"})],Wn.prototype,"filterQuery",void 0),Ei([Pt({attribute:"max-selected"})],Wn.prototype,"maxSelected",void 0),Ei([Pt({attribute:"no-suggestions-text"})],Wn.prototype,"noSuggestionsText",void 0),Ei([Pt({attribute:"suggestions-available-text"})],Wn.prototype,"suggestionsAvailableText",void 0),Ei([Pt({attribute:"loading-text"})],Wn.prototype,"loadingText",void 0),Ei([Pt({attribute:"label"})],Wn.prototype,"label",void 0),Ei([Pt({attribute:"labelledby"})],Wn.prototype,"labelledBy",void 0),Ei([Pt({attribute:"placeholder"})],Wn.prototype,"placeholder",void 0),Ei([Pt({attribute:"menu-placement"})],Wn.prototype,"menuPlacement",void 0),Ei([Ye],Wn.prototype,"showLoading",void 0),Ei([Ye],Wn.prototype,"listItemTemplate",void 0),Ei([Ye],Wn.prototype,"defaultListItemTemplate",void 0),Ei([Ye],Wn.prototype,"activeListItemTemplate",void 0),Ei([Ye],Wn.prototype,"menuOptionTemplate",void 0),Ei([Ye],Wn.prototype,"defaultMenuOptionTemplate",void 0),Ei([Ye],Wn.prototype,"activeMenuOptionTemplate",void 0),Ei([Ye],Wn.prototype,"listItemContentsTemplate",void 0),Ei([Ye],Wn.prototype,"menuOptionContentsTemplate",void 0),Ei([Ye],Wn.prototype,"optionsList",void 0),Ei([Ye],Wn.prototype,"query",void 0),Ei([Ye],Wn.prototype,"filteredOptionsList",void 0),Ei([Ye],Wn.prototype,"flyoutOpen",void 0),Ei([Ye],Wn.prototype,"menuId",void 0),Ei([Ye],Wn.prototype,"selectedListTag",void 0),Ei([Ye],Wn.prototype,"menuTag",void 0),Ei([Ye],Wn.prototype,"menuFocusIndex",void 0),Ei([Ye],Wn.prototype,"menuFocusOptionId",void 0),Ei([Ye],Wn.prototype,"showNoOptions",void 0),Ei([Ye],Wn.prototype,"menuConfig",void 0),Ei([Ye],Wn.prototype,"selectedItems",void 0);const qn="menuitem",Gn="menuitemcheckbox",Xn="menuitemradio",Kn={[qn]:"menuitem",[Gn]:"menuitemcheckbox",[Xn]:"menuitemradio"};class Zn extends uo{constructor(){super(...arguments),this.role=qn,this.hasSubmenu=!1,this.currentDirection=Co.ltr,this.focusSubmenuOnLoad=!1,this.handleMenuItemKeyDown=e=>{if(e.defaultPrevented)return!1;switch(e.key){case"Enter":case" ":return this.invoke(),!1;case"ArrowRight":return this.expandAndFocus(),!1;case"ArrowLeft":if(this.expanded)return this.expanded=!1,this.focus(),!1}return!0},this.handleMenuItemClick=e=>(e.defaultPrevented||this.disabled||this.invoke(),!1),this.submenuLoaded=()=>{this.focusSubmenuOnLoad&&(this.focusSubmenuOnLoad=!1,this.hasSubmenu&&(this.submenu.focus(),this.setAttribute("tabindex","-1")))},this.handleMouseOver=e=>(this.disabled||!this.hasSubmenu||this.expanded||(this.expanded=!0),!1),this.handleMouseOut=e=>(!this.expanded||this.contains(document.activeElement)||(this.expanded=!1),!1),this.expandAndFocus=()=>{this.hasSubmenu&&(this.focusSubmenuOnLoad=!0,this.expanded=!0)},this.invoke=()=>{if(!this.disabled)switch(this.role){case Gn:this.checked=!this.checked;break;case qn:this.updateSubmenu(),this.hasSubmenu?this.expandAndFocus():this.$emit("change");break;case Xn:this.checked||(this.checked=!0)}},this.updateSubmenu=()=>{this.submenu=this.domChildren().find((e=>"menu"===e.getAttribute("role"))),this.hasSubmenu=void 0!==this.submenu}}expandedChanged(e){if(this.$fastController.isConnected){if(void 0===this.submenu)return;!1===this.expanded?this.submenu.collapseExpandedItem():this.currentDirection=zo(this),this.$emit("expanded-change",this,{bubbles:!1})}}checkedChanged(e,t){this.$fastController.isConnected&&this.$emit("change")}connectedCallback(){super.connectedCallback(),Ge.queueUpdate((()=>{this.updateSubmenu()})),this.startColumnCount||(this.startColumnCount=1),this.observer=new MutationObserver(this.updateSubmenu)}disconnectedCallback(){super.disconnectedCallback(),this.submenu=void 0,void 0!==this.observer&&(this.observer.disconnect(),this.observer=void 0)}domChildren(){return Array.from(this.children).filter((e=>!e.hasAttribute("hidden")))}}Ei([Pt({mode:"boolean"})],Zn.prototype,"disabled",void 0),Ei([Pt({mode:"boolean"})],Zn.prototype,"expanded",void 0),Ei([Ye],Zn.prototype,"startColumnCount",void 0),Ei([Pt],Zn.prototype,"role",void 0),Ei([Pt({mode:"boolean"})],Zn.prototype,"checked",void 0),Ei([Ye],Zn.prototype,"submenuRegion",void 0),Ei([Ye],Zn.prototype,"hasSubmenu",void 0),Ei([Ye],Zn.prototype,"currentDirection",void 0),Ei([Ye],Zn.prototype,"submenu",void 0),fo(Zn,Ci);let Yn=class extends uo{constructor(){super(...arguments),this.expandedItem=null,this.focusIndex=-1,this.isNestedMenu=()=>null!==this.parentElement&&yo(this.parentElement)&&"menuitem"===this.parentElement.getAttribute("role"),this.handleFocusOut=e=>{if(!this.contains(e.relatedTarget)&&void 0!==this.menuItems){this.collapseExpandedItem();const e=this.menuItems.findIndex(this.isFocusableElement);this.menuItems[this.focusIndex].setAttribute("tabindex","-1"),this.menuItems[e].setAttribute("tabindex","0"),this.focusIndex=e}},this.handleItemFocus=e=>{const t=e.target;void 0!==this.menuItems&&t!==this.menuItems[this.focusIndex]&&(this.menuItems[this.focusIndex].setAttribute("tabindex","-1"),this.focusIndex=this.menuItems.indexOf(t),t.setAttribute("tabindex","0"))},this.handleExpandedChanged=e=>{if(e.defaultPrevented||null===e.target||void 0===this.menuItems||this.menuItems.indexOf(e.target)<0)return;e.preventDefault();const t=e.target;null===this.expandedItem||t!==this.expandedItem||!1!==t.expanded?t.expanded&&(null!==this.expandedItem&&this.expandedItem!==t&&(this.expandedItem.expanded=!1),this.menuItems[this.focusIndex].setAttribute("tabindex","-1"),this.expandedItem=t,this.focusIndex=this.menuItems.indexOf(t),t.setAttribute("tabindex","0")):this.expandedItem=null},this.removeItemListeners=()=>{void 0!==this.menuItems&&this.menuItems.forEach((e=>{e.removeEventListener("expanded-change",this.handleExpandedChanged),e.removeEventListener("focus",this.handleItemFocus)}))},this.setItems=()=>{const e=this.domChildren();this.removeItemListeners(),this.menuItems=e;const t=this.menuItems.filter(this.isMenuItemElement);t.length&&(this.focusIndex=0);const i=t.reduce(((e,t)=>{const i=function(e){const t=e.getAttribute("role"),i=e.querySelector("[slot=start]");return t!==qn&&null===i||t===qn&&null!==i?1:t!==qn&&null!==i?2:0}(t);return e>i?e:i}),0);t.forEach(((e,t)=>{e.setAttribute("tabindex",0===t?"0":"-1"),e.addEventListener("expanded-change",this.handleExpandedChanged),e.addEventListener("focus",this.handleItemFocus),e instanceof Zn&&(e.startColumnCount=i)}))},this.changeHandler=e=>{if(void 0===this.menuItems)return;const t=e.target,i=this.menuItems.indexOf(t);if(-1!==i&&"menuitemradio"===t.role&&!0===t.checked){for(let e=i-1;e>=0;--e){const t=this.menuItems[e],i=t.getAttribute("role");if(i===Xn&&(t.checked=!1),"separator"===i)break}const e=this.menuItems.length-1;for(let t=i+1;t<=e;++t){const e=this.menuItems[t],i=e.getAttribute("role");if(i===Xn&&(e.checked=!1),"separator"===i)break}}},this.isMenuItemElement=e=>yo(e)&&Yn.focusableElementRoles.hasOwnProperty(e.getAttribute("role")),this.isFocusableElement=e=>this.isMenuItemElement(e)}itemsChanged(e,t){this.$fastController.isConnected&&void 0!==this.menuItems&&this.setItems()}connectedCallback(){super.connectedCallback(),Ge.queueUpdate((()=>{this.setItems()})),this.addEventListener("change",this.changeHandler)}disconnectedCallback(){super.disconnectedCallback(),this.removeItemListeners(),this.menuItems=void 0,this.removeEventListener("change",this.changeHandler)}focus(){this.setFocus(0,1)}collapseExpandedItem(){null!==this.expandedItem&&(this.expandedItem.expanded=!1,this.expandedItem=null)}handleMenuKeyDown(e){if(!e.defaultPrevented&&void 0!==this.menuItems)switch(e.key){case"ArrowDown":return void this.setFocus(this.focusIndex+1,1);case"ArrowUp":return void this.setFocus(this.focusIndex-1,-1);case"End":return void this.setFocus(this.menuItems.length-1,-1);case"Home":return void this.setFocus(0,1);default:return!0}}domChildren(){return Array.from(this.children).filter((e=>!e.hasAttribute("hidden")))}setFocus(e,t){if(void 0!==this.menuItems)for(;e>=0&&e<this.menuItems.length;){const i=this.menuItems[e];if(this.isFocusableElement(i)){this.focusIndex>-1&&this.menuItems.length>=this.focusIndex-1&&this.menuItems[this.focusIndex].setAttribute("tabindex","-1"),this.focusIndex=e,i.setAttribute("tabindex","0"),i.focus();break}e+=t}}};Yn.focusableElementRoles=Kn,Ei([Ye],Yn.prototype,"items",void 0);class Qn extends uo{}class Jn extends(Qo(Qn)){constructor(){super(...arguments),this.proxy=document.createElement("input")}}const es="text";let ts=class extends Jn{constructor(){super(...arguments),this.type=es}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly,this.validate())}autofocusChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.autofocus=this.autofocus,this.validate())}placeholderChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.placeholder=this.placeholder)}typeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type,this.validate())}listChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.setAttribute("list",this.list),this.validate())}maxlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.maxLength=this.maxlength,this.validate())}minlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.minLength=this.minlength,this.validate())}patternChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.pattern=this.pattern,this.validate())}sizeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.size=this.size)}spellcheckChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.spellcheck=this.spellcheck)}connectedCallback(){super.connectedCallback(),this.proxy.setAttribute("type",this.type),this.validate(),this.autofocus&&Ge.queueUpdate((()=>{this.focus()}))}select(){this.control.select(),this.$emit("select")}handleTextInput(){this.value=this.control.value}handleChange(){this.$emit("change")}validate(){super.validate(this.control)}};Ei([Pt({attribute:"readonly",mode:"boolean"})],ts.prototype,"readOnly",void 0),Ei([Pt({mode:"boolean"})],ts.prototype,"autofocus",void 0),Ei([Pt],ts.prototype,"placeholder",void 0),Ei([Pt],ts.prototype,"type",void 0),Ei([Pt],ts.prototype,"list",void 0),Ei([Pt({converter:Dt})],ts.prototype,"maxlength",void 0),Ei([Pt({converter:Dt})],ts.prototype,"minlength",void 0),Ei([Pt],ts.prototype,"pattern",void 0),Ei([Pt({converter:Dt})],ts.prototype,"size",void 0),Ei([Pt({mode:"boolean"})],ts.prototype,"spellcheck",void 0),Ei([Ye],ts.prototype,"defaultSlottedNodes",void 0);class is{}fo(is,Mo),fo(ts,Ci,is);class os extends uo{}class rs extends(Qo(os)){constructor(){super(...arguments),this.proxy=document.createElement("input")}}let ns=class extends rs{constructor(){super(...arguments),this.hideStep=!1,this.step=1,this.isUserInput=!1}maxChanged(e,t){var i;this.max=Math.max(t,null!==(i=this.min)&&void 0!==i?i:t);const o=Math.min(this.min,this.max);void 0!==this.min&&this.min!==o&&(this.min=o),this.value=this.getValidValue(this.value)}minChanged(e,t){var i;this.min=Math.min(t,null!==(i=this.max)&&void 0!==i?i:t);const o=Math.max(this.min,this.max);void 0!==this.max&&this.max!==o&&(this.max=o),this.value=this.getValidValue(this.value)}get valueAsNumber(){return parseFloat(super.value)}set valueAsNumber(e){this.value=e.toString()}valueChanged(e,t){this.value=this.getValidValue(t),t===this.value&&(this.control&&!this.isUserInput&&(this.control.value=this.value),super.valueChanged(e,this.value),void 0===e||this.isUserInput||(this.$emit("input"),this.$emit("change")),this.isUserInput=!1)}validate(){super.validate(this.control)}getValidValue(e){var t,i;let o=parseFloat(parseFloat(e).toPrecision(12));return isNaN(o)?o="":(o=Math.min(o,null!==(t=this.max)&&void 0!==t?t:o),o=Math.max(o,null!==(i=this.min)&&void 0!==i?i:o).toString()),o}stepUp(){const e=parseFloat(this.value),t=isNaN(e)?this.min>0?this.min:this.max<0?this.max:this.min?0:this.step:e+this.step;this.value=t.toString()}stepDown(){const e=parseFloat(this.value),t=isNaN(e)?this.min>0?this.min:this.max<0?this.max:this.min?0:0-this.step:e-this.step;this.value=t.toString()}connectedCallback(){super.connectedCallback(),this.proxy.setAttribute("type","number"),this.validate(),this.control.value=this.value,this.autofocus&&Ge.queueUpdate((()=>{this.focus()}))}select(){this.control.select(),this.$emit("select")}handleTextInput(){this.control.value=this.control.value.replace(/[^0-9\-+e.]/g,""),this.isUserInput=!0,this.value=this.control.value}handleChange(){this.$emit("change")}handleKeyDown(e){switch(e.key){case"ArrowUp":return this.stepUp(),!1;case"ArrowDown":return this.stepDown(),!1}return!0}handleBlur(){this.control.value=this.value}};Ei([Pt({attribute:"readonly",mode:"boolean"})],ns.prototype,"readOnly",void 0),Ei([Pt({mode:"boolean"})],ns.prototype,"autofocus",void 0),Ei([Pt({attribute:"hide-step",mode:"boolean"})],ns.prototype,"hideStep",void 0),Ei([Pt],ns.prototype,"placeholder",void 0),Ei([Pt],ns.prototype,"list",void 0),Ei([Pt({converter:Dt})],ns.prototype,"maxlength",void 0),Ei([Pt({converter:Dt})],ns.prototype,"minlength",void 0),Ei([Pt({converter:Dt})],ns.prototype,"size",void 0),Ei([Pt({converter:Dt})],ns.prototype,"step",void 0),Ei([Pt({converter:Dt})],ns.prototype,"max",void 0),Ei([Pt({converter:Dt})],ns.prototype,"min",void 0),Ei([Ye],ns.prototype,"defaultSlottedNodes",void 0),fo(ns,Ci,is);class ss extends uo{constructor(){super(...arguments),this.percentComplete=0}valueChanged(){this.$fastController.isConnected&&this.updatePercentComplete()}minChanged(){this.$fastController.isConnected&&this.updatePercentComplete()}maxChanged(){this.$fastController.isConnected&&this.updatePercentComplete()}connectedCallback(){super.connectedCallback(),this.updatePercentComplete()}updatePercentComplete(){const e="number"==typeof this.min?this.min:0,t="number"==typeof this.max?this.max:100,i="number"==typeof this.value?this.value:0,o=t-e;this.percentComplete=0===o?0:Math.fround((i-e)/o*100)}}Ei([Pt({converter:Dt})],ss.prototype,"value",void 0),Ei([Pt({converter:Dt})],ss.prototype,"min",void 0),Ei([Pt({converter:Dt})],ss.prototype,"max",void 0),Ei([Pt({mode:"boolean"})],ss.prototype,"paused",void 0),Ei([Ye],ss.prototype,"percentComplete",void 0);class as extends uo{constructor(){super(...arguments),this.orientation=vo,this.radioChangeHandler=e=>{const t=e.target;t.checked&&(this.slottedRadioButtons.forEach((e=>{e!==t&&(e.checked=!1,this.isInsideFoundationToolbar||e.setAttribute("tabindex","-1"))})),this.selectedRadio=t,this.value=t.value,t.setAttribute("tabindex","0"),this.focusedRadio=t),e.stopPropagation()},this.moveToRadioByIndex=(e,t)=>{const i=e[t];this.isInsideToolbar||(i.setAttribute("tabindex","0"),i.readOnly?this.slottedRadioButtons.forEach((e=>{e!==i&&e.setAttribute("tabindex","-1")})):(i.checked=!0,this.selectedRadio=i)),this.focusedRadio=i,i.focus()},this.moveRightOffGroup=()=>{var e;null===(e=this.nextElementSibling)||void 0===e||e.focus()},this.moveLeftOffGroup=()=>{var e;null===(e=this.previousElementSibling)||void 0===e||e.focus()},this.focusOutHandler=e=>{const t=this.slottedRadioButtons,i=e.target,o=null!==i?t.indexOf(i):0,r=this.focusedRadio?t.indexOf(this.focusedRadio):-1;return(0===r&&o===r||r===t.length-1&&r===o)&&(this.selectedRadio?(this.focusedRadio=this.selectedRadio,this.isInsideFoundationToolbar||(this.selectedRadio.setAttribute("tabindex","0"),t.forEach((e=>{e!==this.selectedRadio&&e.setAttribute("tabindex","-1")})))):(this.focusedRadio=t[0],this.focusedRadio.setAttribute("tabindex","0"),t.forEach((e=>{e!==this.focusedRadio&&e.setAttribute("tabindex","-1")})))),!0},this.clickHandler=e=>{const t=e.target;if(t){const e=this.slottedRadioButtons;t.checked||0===e.indexOf(t)?(t.setAttribute("tabindex","0"),this.selectedRadio=t):(t.setAttribute("tabindex","-1"),this.selectedRadio=null),this.focusedRadio=t}e.preventDefault()},this.shouldMoveOffGroupToTheRight=(e,t,i)=>e===t.length&&this.isInsideToolbar&&"ArrowRight"===i,this.shouldMoveOffGroupToTheLeft=(e,t)=>(this.focusedRadio?e.indexOf(this.focusedRadio)-1:0)<0&&this.isInsideToolbar&&"ArrowLeft"===t,this.checkFocusedRadio=()=>{null===this.focusedRadio||this.focusedRadio.readOnly||this.focusedRadio.checked||(this.focusedRadio.checked=!0,this.focusedRadio.setAttribute("tabindex","0"),this.focusedRadio.focus(),this.selectedRadio=this.focusedRadio)},this.moveRight=e=>{const t=this.slottedRadioButtons;let i=0;if(i=this.focusedRadio?t.indexOf(this.focusedRadio)+1:1,this.shouldMoveOffGroupToTheRight(i,t,e.key))this.moveRightOffGroup();else for(i===t.length&&(i=0);i<t.length&&t.length>1;){if(!t[i].disabled){this.moveToRadioByIndex(t,i);break}if(this.focusedRadio&&i===t.indexOf(this.focusedRadio))break;if(i+1>=t.length){if(this.isInsideToolbar)break;i=0}else i+=1}},this.moveLeft=e=>{const t=this.slottedRadioButtons;let i=0;if(i=this.focusedRadio?t.indexOf(this.focusedRadio)-1:0,i=i<0?t.length-1:i,this.shouldMoveOffGroupToTheLeft(t,e.key))this.moveLeftOffGroup();else for(;i>=0&&t.length>1;){if(!t[i].disabled){this.moveToRadioByIndex(t,i);break}if(this.focusedRadio&&i===t.indexOf(this.focusedRadio))break;i-1<0?i=t.length-1:i-=1}},this.keydownHandler=e=>{const t=e.key;if(t in ko&&this.isInsideFoundationToolbar)return!0;switch(t){case"Enter":this.checkFocusedRadio();break;case"ArrowRight":case"ArrowDown":this.direction===Co.ltr?this.moveRight(e):this.moveLeft(e);break;case"ArrowLeft":case"ArrowUp":this.direction===Co.ltr?this.moveLeft(e):this.moveRight(e);break;default:return!0}}}readOnlyChanged(){void 0!==this.slottedRadioButtons&&this.slottedRadioButtons.forEach((e=>{this.readOnly?e.readOnly=!0:e.readOnly=!1}))}disabledChanged(){void 0!==this.slottedRadioButtons&&this.slottedRadioButtons.forEach((e=>{this.disabled?e.disabled=!0:e.disabled=!1}))}nameChanged(){this.slottedRadioButtons&&this.slottedRadioButtons.forEach((e=>{e.setAttribute("name",this.name)}))}valueChanged(){this.slottedRadioButtons&&this.slottedRadioButtons.forEach((e=>{e.value===this.value&&(e.checked=!0,this.selectedRadio=e)})),this.$emit("change")}slottedRadioButtonsChanged(e,t){this.slottedRadioButtons&&this.slottedRadioButtons.length>0&&this.setupRadioButtons()}get parentToolbar(){return this.closest('[role="toolbar"]')}get isInsideToolbar(){var e;return null!==(e=this.parentToolbar)&&void 0!==e&&e}get isInsideFoundationToolbar(){var e;return!!(null===(e=this.parentToolbar)||void 0===e?void 0:e.$fastController)}connectedCallback(){super.connectedCallback(),this.direction=zo(this),this.setupRadioButtons()}disconnectedCallback(){this.slottedRadioButtons.forEach((e=>{e.removeEventListener("change",this.radioChangeHandler)}))}setupRadioButtons(){const e=this.slottedRadioButtons.filter((e=>e.hasAttribute("checked"))),t=e?e.length:0;if(t>1){e[t-1].checked=!0}let i=!1;if(this.slottedRadioButtons.forEach((e=>{void 0!==this.name&&e.setAttribute("name",this.name),this.disabled&&(e.disabled=!0),this.readOnly&&(e.readOnly=!0),this.value&&this.value===e.value?(this.selectedRadio=e,this.focusedRadio=e,e.checked=!0,e.setAttribute("tabindex","0"),i=!0):(this.isInsideFoundationToolbar||e.setAttribute("tabindex","-1"),e.checked=!1),e.addEventListener("change",this.radioChangeHandler)})),void 0===this.value&&this.slottedRadioButtons.length>0){const e=this.slottedRadioButtons.filter((e=>e.hasAttribute("checked"))),t=null!==e?e.length:0;if(t>0&&!i){const i=e[t-1];i.checked=!0,this.focusedRadio=i,i.setAttribute("tabindex","0")}else this.slottedRadioButtons[0].setAttribute("tabindex","0"),this.focusedRadio=this.slottedRadioButtons[0]}}}Ei([Pt({attribute:"readonly",mode:"boolean"})],as.prototype,"readOnly",void 0),Ei([Pt({attribute:"disabled",mode:"boolean"})],as.prototype,"disabled",void 0),Ei([Pt],as.prototype,"name",void 0),Ei([Pt],as.prototype,"value",void 0),Ei([Pt],as.prototype,"orientation",void 0),Ei([Ye],as.prototype,"childItems",void 0),Ei([Ye],as.prototype,"slottedRadioButtons",void 0);class ls extends uo{}class ds extends(Jo(ls)){constructor(){super(...arguments),this.proxy=document.createElement("input")}}class cs extends ds{constructor(){super(),this.initialValue="on",this.keypressHandler=e=>{if(" "!==e.key)return!0;this.checked||this.readOnly||(this.checked=!0)},this.proxy.setAttribute("type","radio")}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly)}defaultCheckedChanged(){var e;this.$fastController.isConnected&&!this.dirtyChecked&&(this.isInsideRadioGroup()||(this.checked=null!==(e=this.defaultChecked)&&void 0!==e&&e,this.dirtyChecked=!1))}connectedCallback(){var e,t;super.connectedCallback(),this.validate(),"radiogroup"!==(null===(e=this.parentElement)||void 0===e?void 0:e.getAttribute("role"))&&null===this.getAttribute("tabindex")&&(this.disabled||this.setAttribute("tabindex","0")),this.checkedAttribute&&(this.dirtyChecked||this.isInsideRadioGroup()||(this.checked=null!==(t=this.defaultChecked)&&void 0!==t&&t,this.dirtyChecked=!1))}isInsideRadioGroup(){return null!==this.closest("[role=radiogroup]")}clickHandler(e){this.disabled||this.readOnly||this.checked||(this.checked=!0)}}Ei([Pt({attribute:"readonly",mode:"boolean"})],cs.prototype,"readOnly",void 0),Ei([Ye],cs.prototype,"name",void 0),Ei([Ye],cs.prototype,"defaultSlottedNodes",void 0);let hs=class extends uo{constructor(){super(...arguments),this.framesPerSecond=60,this.updatingItems=!1,this.speed=600,this.easing="ease-in-out",this.flippersHiddenFromAT=!1,this.scrolling=!1,this.resizeDetector=null}get frameTime(){return 1e3/this.framesPerSecond}scrollingChanged(e,t){if(this.scrollContainer){const e=1==this.scrolling?"scrollstart":"scrollend";this.$emit(e,this.scrollContainer.scrollLeft)}}get isRtl(){return this.scrollItems.length>1&&this.scrollItems[0].offsetLeft>this.scrollItems[1].offsetLeft}connectedCallback(){super.connectedCallback(),this.initializeResizeDetector()}disconnectedCallback(){this.disconnectResizeDetector(),super.disconnectedCallback()}scrollItemsChanged(e,t){t&&!this.updatingItems&&Ge.queueUpdate((()=>this.setStops()))}disconnectResizeDetector(){this.resizeDetector&&(this.resizeDetector.disconnect(),this.resizeDetector=null)}initializeResizeDetector(){this.disconnectResizeDetector(),this.resizeDetector=new window.ResizeObserver(this.resized.bind(this)),this.resizeDetector.observe(this)}updateScrollStops(){this.updatingItems=!0;const e=this.scrollItems.reduce(((e,t)=>t instanceof HTMLSlotElement?e.concat(t.assignedElements()):(e.push(t),e)),[]);this.scrollItems=e,this.updatingItems=!1}setStops(){this.updateScrollStops();const{scrollContainer:e}=this,{scrollLeft:t}=e,{width:i,left:o}=e.getBoundingClientRect();this.width=i;let r=0,n=this.scrollItems.map(((e,i)=>{const{left:n,width:s}=e.getBoundingClientRect(),a=Math.round(n+t-o),l=Math.round(a+s);return this.isRtl?-l:(r=l,0===i?0:a)})).concat(r);n=this.fixScrollMisalign(n),n.sort(((e,t)=>Math.abs(e)-Math.abs(t))),this.scrollStops=n,this.setFlippers()}fixScrollMisalign(e){if(this.isRtl&&e.some((e=>e>0))){e.sort(((e,t)=>t-e));const t=e[0];e=e.map((e=>e-t))}return e}setFlippers(){var e,t;const i=this.scrollContainer.scrollLeft;if(null===(e=this.previousFlipperContainer)||void 0===e||e.classList.toggle("disabled",0===i),this.scrollStops){const e=Math.abs(this.scrollStops[this.scrollStops.length-1]);null===(t=this.nextFlipperContainer)||void 0===t||t.classList.toggle("disabled",Math.abs(i)+this.width>=e)}}scrollInView(e,t=0,i){var o;if("number"!=typeof e&&e&&(e=this.scrollItems.findIndex((t=>t===e||t.contains(e)))),void 0!==e){i=null!=i?i:t;const{scrollContainer:r,scrollStops:n,scrollItems:s}=this,{scrollLeft:a}=this.scrollContainer,{width:l}=r.getBoundingClientRect(),d=n[e],{width:c}=s[e].getBoundingClientRect(),h=d+c,u=a+t>d;if(u||a+l-i<h){const e=[...n].sort(((e,t)=>u?t-e:e-t)),r=null!==(o=e.find((e=>u?e+t<d:e+l-(null!=i?i:0)>h)))&&void 0!==o?o:0;this.scrollToPosition(r)}}}keyupHandler(e){switch(e.key){case"ArrowLeft":this.scrollToPrevious();break;case"ArrowRight":this.scrollToNext()}}scrollToPrevious(){const e=this.scrollContainer.scrollLeft,t=this.scrollStops.findIndex(((t,i)=>t>=e&&(this.isRtl||i===this.scrollStops.length-1||this.scrollStops[i+1]>e))),i=Math.abs(this.scrollStops[t+1]);let o=this.scrollStops.findIndex((e=>Math.abs(e)+this.width>i));(o>=t||-1===o)&&(o=t>0?t-1:0),this.scrollToPosition(this.scrollStops[o],e)}scrollToNext(){const e=this.scrollContainer.scrollLeft,t=this.scrollStops.findIndex((t=>Math.abs(t)>=Math.abs(e))),i=this.scrollStops.findIndex((t=>Math.abs(e)+this.width<=Math.abs(t)));let o=t;i>t+2?o=i-2:t<this.scrollStops.length-2&&(o=t+1),this.scrollToPosition(this.scrollStops[o],e)}scrollToPosition(e,t=this.scrollContainer.scrollLeft){var i;if(this.scrolling)return;this.scrolling=!0;const o=null!==(i=this.duration)&&void 0!==i?i:Math.abs(e-t)/this.speed+"s";this.content.style.setProperty("transition-duration",o);const r=parseFloat(getComputedStyle(this.content).getPropertyValue("transition-duration")),n=t=>{t&&t.target!==t.currentTarget||(this.content.style.setProperty("transition-duration","0s"),this.content.style.removeProperty("transform"),this.scrollContainer.style.setProperty("scroll-behavior","auto"),this.scrollContainer.scrollLeft=e,this.setFlippers(),this.content.removeEventListener("transitionend",n),this.scrolling=!1)};if(0===r)return void n();this.content.addEventListener("transitionend",n);const s=this.scrollContainer.scrollWidth-this.scrollContainer.clientWidth;let a=this.scrollContainer.scrollLeft-Math.min(e,s);this.isRtl&&(a=this.scrollContainer.scrollLeft+Math.min(Math.abs(e),s)),this.content.style.setProperty("transition-property","transform"),this.content.style.setProperty("transition-timing-function",this.easing),this.content.style.setProperty("transform",`translateX(${a}px)`)}resized(){this.resizeTimeout&&(this.resizeTimeout=clearTimeout(this.resizeTimeout)),this.resizeTimeout=setTimeout((()=>{this.width=this.scrollContainer.offsetWidth,this.setFlippers()}),this.frameTime)}scrolled(){this.scrollTimeout&&(this.scrollTimeout=clearTimeout(this.scrollTimeout)),this.scrollTimeout=setTimeout((()=>{this.setFlippers()}),this.frameTime)}};Ei([Pt({converter:Dt})],hs.prototype,"speed",void 0),Ei([Pt],hs.prototype,"duration",void 0),Ei([Pt],hs.prototype,"easing",void 0),Ei([Pt({attribute:"flippers-hidden-from-at",converter:Rt})],hs.prototype,"flippersHiddenFromAT",void 0),Ei([Ye],hs.prototype,"scrolling",void 0),Ei([Ye],hs.prototype,"scrollItems",void 0),Ei([Pt({attribute:"view"})],hs.prototype,"view",void 0);function us(e,t,i){return e.nodeType!==Node.TEXT_NODE||"string"==typeof e.nodeValue&&!!e.nodeValue.trim().length}class ps extends uo{}class ms extends(Qo(ps)){constructor(){super(...arguments),this.proxy=document.createElement("input")}}let fs=class extends ms{readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly,this.validate())}autofocusChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.autofocus=this.autofocus,this.validate())}placeholderChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.placeholder=this.placeholder)}listChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.setAttribute("list",this.list),this.validate())}maxlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.maxLength=this.maxlength,this.validate())}minlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.minLength=this.minlength,this.validate())}patternChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.pattern=this.pattern,this.validate())}sizeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.size=this.size)}spellcheckChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.spellcheck=this.spellcheck)}connectedCallback(){super.connectedCallback(),this.validate(),this.autofocus&&Ge.queueUpdate((()=>{this.focus()}))}validate(){super.validate(this.control)}handleTextInput(){this.value=this.control.value}handleClearInput(){this.value="",this.control.focus(),this.handleChange()}handleChange(){this.$emit("change")}};Ei([Pt({attribute:"readonly",mode:"boolean"})],fs.prototype,"readOnly",void 0),Ei([Pt({mode:"boolean"})],fs.prototype,"autofocus",void 0),Ei([Pt],fs.prototype,"placeholder",void 0),Ei([Pt],fs.prototype,"list",void 0),Ei([Pt({converter:Dt})],fs.prototype,"maxlength",void 0),Ei([Pt({converter:Dt})],fs.prototype,"minlength",void 0),Ei([Pt],fs.prototype,"pattern",void 0),Ei([Pt({converter:Dt})],fs.prototype,"size",void 0),Ei([Pt({mode:"boolean"})],fs.prototype,"spellcheck",void 0),Ei([Ye],fs.prototype,"defaultSlottedNodes",void 0);class gs{}fo(gs,Mo),fo(fs,Ci,gs);class vs extends Rn{}class bs extends(Qo(vs)){constructor(){super(...arguments),this.proxy=document.createElement("select")}}let ys=class extends bs{constructor(){super(...arguments),this.open=!1,this.forcedPosition=!1,this.listboxId=Eo("listbox-"),this.maxHeight=0}openChanged(e,t){if(this.collapsible){if(this.open)return this.ariaControls=this.listboxId,this.ariaExpanded="true",this.setPositioning(),this.focusAndScrollOptionIntoView(),this.indexWhenOpened=this.selectedIndex,void Ge.queueUpdate((()=>this.focus()));this.ariaControls="",this.ariaExpanded="false"}}get collapsible(){return!(this.multiple||"number"==typeof this.size)}get value(){return Ze.track(this,"value"),this._value}set value(e){var t,i,o,r,n,s,a;const l=`${this._value}`;if(null===(t=this._options)||void 0===t?void 0:t.length){const t=this._options.findIndex((t=>t.value===e)),l=null!==(o=null===(i=this._options[this.selectedIndex])||void 0===i?void 0:i.value)&&void 0!==o?o:null,d=null!==(n=null===(r=this._options[t])||void 0===r?void 0:r.value)&&void 0!==n?n:null;-1!==t&&l===d||(e="",this.selectedIndex=t),e=null!==(a=null===(s=this.firstSelectedOption)||void 0===s?void 0:s.value)&&void 0!==a?a:e}l!==e&&(this._value=e,super.valueChanged(l,e),Ze.notify(this,"value"),this.updateDisplayValue())}updateValue(e){var t,i;this.$fastController.isConnected&&(this.value=null!==(i=null===(t=this.firstSelectedOption)||void 0===t?void 0:t.value)&&void 0!==i?i:""),e&&(this.$emit("input"),this.$emit("change",this,{bubbles:!0,composed:void 0}))}selectedIndexChanged(e,t){super.selectedIndexChanged(e,t),this.updateValue()}positionChanged(e,t){this.positionAttribute=t,this.setPositioning()}setPositioning(){const e=this.getBoundingClientRect(),t=window.innerHeight-e.bottom;this.position=this.forcedPosition?this.positionAttribute:e.top>t?Lr:Fr,this.positionAttribute=this.forcedPosition?this.positionAttribute:this.position,this.maxHeight=this.position===Lr?~~e.top:~~t}get displayValue(){var e,t;return Ze.track(this,"displayValue"),null!==(t=null===(e=this.firstSelectedOption)||void 0===e?void 0:e.text)&&void 0!==t?t:""}disabledChanged(e,t){super.disabledChanged&&super.disabledChanged(e,t),this.ariaDisabled=this.disabled?"true":"false"}formResetCallback(){this.setProxyOptions(),super.setDefaultSelectedOption(),-1===this.selectedIndex&&(this.selectedIndex=0)}clickHandler(e){if(!this.disabled){if(this.open){const t=e.target.closest("option,[role=option]");if(t&&t.disabled)return}return super.clickHandler(e),this.open=this.collapsible&&!this.open,this.open||this.indexWhenOpened===this.selectedIndex||this.updateValue(!0),!0}}focusoutHandler(e){var t;if(super.focusoutHandler(e),!this.open)return!0;const i=e.relatedTarget;this.isSameNode(i)?this.focus():(null===(t=this.options)||void 0===t?void 0:t.includes(i))||(this.open=!1,this.indexWhenOpened!==this.selectedIndex&&this.updateValue(!0))}handleChange(e,t){super.handleChange(e,t),"value"===t&&this.updateValue()}slottedOptionsChanged(e,t){this.options.forEach((e=>{Ze.getNotifier(e).unsubscribe(this,"value")})),super.slottedOptionsChanged(e,t),this.options.forEach((e=>{Ze.getNotifier(e).subscribe(this,"value")})),this.setProxyOptions(),this.updateValue()}mousedownHandler(e){var t;return e.offsetX>=0&&e.offsetX<=(null===(t=this.listbox)||void 0===t?void 0:t.scrollWidth)?super.mousedownHandler(e):this.collapsible}multipleChanged(e,t){super.multipleChanged(e,t),this.proxy&&(this.proxy.multiple=t)}selectedOptionsChanged(e,t){var i;super.selectedOptionsChanged(e,t),null===(i=this.options)||void 0===i||i.forEach(((e,t)=>{var i;const o=null===(i=this.proxy)||void 0===i?void 0:i.options.item(t);o&&(o.selected=e.selected)}))}setDefaultSelectedOption(){var e;const t=null!==(e=this.options)&&void 0!==e?e:Array.from(this.children).filter(Ir.slottedOptionFilter),i=null==t?void 0:t.findIndex((e=>e.hasAttribute("selected")||e.selected||e.value===this.value));this.selectedIndex=-1===i?0:i}setProxyOptions(){this.proxy instanceof HTMLSelectElement&&this.options&&(this.proxy.options.length=0,this.options.forEach((e=>{const t=e.proxy||(e instanceof HTMLOptionElement?e.cloneNode():null);t&&this.proxy.options.add(t)})))}keydownHandler(e){super.keydownHandler(e);const t=e.key||e.key.charCodeAt(0);switch(t){case" ":e.preventDefault(),this.collapsible&&this.typeAheadExpired&&(this.open=!this.open);break;case"Home":case"End":e.preventDefault();break;case"Enter":e.preventDefault(),this.open=!this.open;break;case"Escape":this.collapsible&&this.open&&(e.preventDefault(),this.open=!1);break;case"Tab":return this.collapsible&&this.open&&(e.preventDefault(),this.open=!1),!0}return this.open||this.indexWhenOpened===this.selectedIndex||(this.updateValue(!0),this.indexWhenOpened=this.selectedIndex),!("ArrowDown"===t||"ArrowUp"===t)}connectedCallback(){super.connectedCallback(),this.forcedPosition=!!this.positionAttribute,this.addEventListener("contentchange",this.updateDisplayValue)}disconnectedCallback(){this.removeEventListener("contentchange",this.updateDisplayValue),super.disconnectedCallback()}sizeChanged(e,t){super.sizeChanged(e,t),this.proxy&&(this.proxy.size=t)}updateDisplayValue(){this.collapsible&&Ze.notify(this,"displayValue")}};Ei([Pt({attribute:"open",mode:"boolean"})],ys.prototype,"open",void 0),Ei([function(e,t,i){return Object.assign({},i,{get:function(){return Ze.trackVolatile(),i.get.apply(this)}})}],ys.prototype,"collapsible",null),Ei([Ye],ys.prototype,"control",void 0),Ei([Pt({attribute:"position"})],ys.prototype,"positionAttribute",void 0),Ei([Ye],ys.prototype,"position",void 0),Ei([Ye],ys.prototype,"maxHeight",void 0);class xs{}Ei([Ye],xs.prototype,"ariaControls",void 0),fo(xs,Or),fo(ys,Ci,xs);class ws extends uo{constructor(){super(...arguments),this.shape="rect"}}Ei([Pt],ws.prototype,"fill",void 0),Ei([Pt],ws.prototype,"shape",void 0),Ei([Pt],ws.prototype,"pattern",void 0),Ei([Pt({mode:"boolean"})],ws.prototype,"shimmer",void 0);function ks(e,t,i,o){let r=_o(0,1,(e-t)/(i-t));return o===Co.rtl&&(r=1-r),r}const Cs={min:0,max:0,direction:Co.ltr,orientation:vo,disabled:!1};let $s=class extends uo{constructor(){super(...arguments),this.hideMark=!1,this.sliderDirection=Co.ltr,this.getSliderConfiguration=()=>{if(this.isSliderConfig(this.parentNode)){const e=this.parentNode,{min:t,max:i,direction:o,orientation:r,disabled:n}=e;void 0!==n&&(this.disabled=n),this.sliderDirection=o||Co.ltr,this.sliderOrientation=r||vo,this.sliderMaxPosition=i,this.sliderMinPosition=t}else this.sliderDirection=Cs.direction||Co.ltr,this.sliderOrientation=Cs.orientation,this.sliderMaxPosition=Cs.max,this.sliderMinPosition=Cs.min},this.positionAsStyle=()=>{const e=this.sliderDirection?this.sliderDirection:Co.ltr,t=ks(Number(this.position),Number(this.sliderMinPosition),Number(this.sliderMaxPosition));let i=Math.round(100*(1-t)),o=Math.round(100*t);return Number.isNaN(o)&&Number.isNaN(i)&&(i=50,o=50),this.sliderOrientation===vo?e===Co.rtl?`right: ${o}%; left: ${i}%;`:`left: ${o}%; right: ${i}%;`:`top: ${o}%; bottom: ${i}%;`}}positionChanged(){this.positionStyle=this.positionAsStyle()}sliderOrientationChanged(){}connectedCallback(){super.connectedCallback(),this.getSliderConfiguration(),this.positionStyle=this.positionAsStyle(),this.notifier=Ze.getNotifier(this.parentNode),this.notifier.subscribe(this,"orientation"),this.notifier.subscribe(this,"direction"),this.notifier.subscribe(this,"max"),this.notifier.subscribe(this,"min")}disconnectedCallback(){super.disconnectedCallback(),this.notifier.unsubscribe(this,"orientation"),this.notifier.unsubscribe(this,"direction"),this.notifier.unsubscribe(this,"max"),this.notifier.unsubscribe(this,"min")}handleChange(e,t){switch(t){case"direction":this.sliderDirection=e.direction;break;case"orientation":this.sliderOrientation=e.orientation;break;case"max":this.sliderMaxPosition=e.max;break;case"min":this.sliderMinPosition=e.min}this.positionStyle=this.positionAsStyle()}isSliderConfig(e){return void 0!==e.max&&void 0!==e.min}};Ei([Ye],$s.prototype,"positionStyle",void 0),Ei([Pt],$s.prototype,"position",void 0),Ei([Pt({attribute:"hide-mark",mode:"boolean"})],$s.prototype,"hideMark",void 0),Ei([Pt({attribute:"disabled",mode:"boolean"})],$s.prototype,"disabled",void 0),Ei([Ye],$s.prototype,"sliderOrientation",void 0),Ei([Ye],$s.prototype,"sliderMinPosition",void 0),Ei([Ye],$s.prototype,"sliderMaxPosition",void 0),Ei([Ye],$s.prototype,"sliderDirection",void 0);class _s extends uo{}class Ss extends(Qo(_s)){constructor(){super(...arguments),this.proxy=document.createElement("input")}}const Ts="single-value";class Es extends Ss{constructor(){super(...arguments),this.direction=Co.ltr,this.isDragging=!1,this.trackWidth=0,this.trackMinWidth=0,this.trackHeight=0,this.trackLeft=0,this.trackMinHeight=0,this.valueTextFormatter=()=>null,this.min=0,this.max=10,this.step=1,this.orientation=vo,this.mode=Ts,this.keypressHandler=e=>{if(!this.readOnly)if("Home"===e.key)e.preventDefault(),this.value=`${this.min}`;else if("End"===e.key)e.preventDefault(),this.value=`${this.max}`;else if(!e.shiftKey)switch(e.key){case"ArrowRight":case"ArrowUp":e.preventDefault(),this.increment();break;case"ArrowLeft":case"ArrowDown":e.preventDefault(),this.decrement()}},this.setupTrackConstraints=()=>{const e=this.track.getBoundingClientRect();this.trackWidth=this.track.clientWidth,this.trackMinWidth=this.track.clientLeft,this.trackHeight=e.bottom,this.trackMinHeight=e.top,this.trackLeft=this.getBoundingClientRect().left,0===this.trackWidth&&(this.trackWidth=1)},this.setupListeners=(e=!1)=>{const t=(e?"remove":"add")+"EventListener";this[t]("keydown",this.keypressHandler),this[t]("mousedown",this.handleMouseDown),this.thumb[t]("mousedown",this.handleThumbMouseDown,{passive:!0}),this.thumb[t]("touchstart",this.handleThumbMouseDown,{passive:!0}),e&&(this.handleMouseDown(null),this.handleThumbMouseDown(null))},this.initialValue="",this.handleThumbMouseDown=e=>{if(e){if(this.readOnly||this.disabled||e.defaultPrevented)return;e.target.focus()}const t=(null!==e?"add":"remove")+"EventListener";window[t]("mouseup",this.handleWindowMouseUp),window[t]("mousemove",this.handleMouseMove,{passive:!0}),window[t]("touchmove",this.handleMouseMove,{passive:!0}),window[t]("touchend",this.handleWindowMouseUp),this.isDragging=null!==e},this.handleMouseMove=e=>{if(this.readOnly||this.disabled||e.defaultPrevented)return;const t=window.TouchEvent&&e instanceof TouchEvent?e.touches[0]:e,i=this.orientation===vo?t.pageX-document.documentElement.scrollLeft-this.trackLeft:t.pageY-document.documentElement.scrollTop;this.value=`${this.calculateNewValue(i)}`},this.calculateNewValue=e=>{const t=ks(e,this.orientation===vo?this.trackMinWidth:this.trackMinHeight,this.orientation===vo?this.trackWidth:this.trackHeight,this.direction),i=(this.max-this.min)*t+this.min;return this.convertToConstrainedValue(i)},this.handleWindowMouseUp=e=>{this.stopDragging()},this.stopDragging=()=>{this.isDragging=!1,this.handleMouseDown(null),this.handleThumbMouseDown(null)},this.handleMouseDown=e=>{const t=(null!==e?"add":"remove")+"EventListener";if((null===e||!this.disabled&&!this.readOnly)&&(window[t]("mouseup",this.handleWindowMouseUp),window.document[t]("mouseleave",this.handleWindowMouseUp),window[t]("mousemove",this.handleMouseMove),e)){e.preventDefault(),this.setupTrackConstraints(),e.target.focus();const t=this.orientation===vo?e.pageX-document.documentElement.scrollLeft-this.trackLeft:e.pageY-document.documentElement.scrollTop;this.value=`${this.calculateNewValue(t)}`}},this.convertToConstrainedValue=e=>{isNaN(e)&&(e=this.min);let t=e-this.min;const i=t-Math.round(t/this.step)*(this.stepMultiplier*this.step)/this.stepMultiplier;return t=i>=Number(this.step)/2?t-i+Number(this.step):t-i,t+this.min}}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly)}get valueAsNumber(){return parseFloat(super.value)}set valueAsNumber(e){this.value=e.toString()}valueChanged(e,t){super.valueChanged(e,t),this.$fastController.isConnected&&this.setThumbPositionForOrientation(this.direction),this.$emit("change")}minChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.min=`${this.min}`),this.validate()}maxChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.max=`${this.max}`),this.validate()}stepChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.step=`${this.step}`),this.updateStepMultiplier(),this.validate()}orientationChanged(){this.$fastController.isConnected&&this.setThumbPositionForOrientation(this.direction)}connectedCallback(){super.connectedCallback(),this.proxy.setAttribute("type","range"),this.direction=zo(this),this.updateStepMultiplier(),this.setupTrackConstraints(),this.setupListeners(),this.setupDefaultValue(),this.setThumbPositionForOrientation(this.direction)}disconnectedCallback(){this.setupListeners(!0)}increment(){const e=this.direction!==Co.rtl&&this.orientation!==bo?Number(this.value)+Number(this.step):Number(this.value)-Number(this.step),t=this.convertToConstrainedValue(e),i=t<Number(this.max)?`${t}`:`${this.max}`;this.value=i}decrement(){const e=this.direction!==Co.rtl&&this.orientation!==bo?Number(this.value)-Number(this.step):Number(this.value)+Number(this.step),t=this.convertToConstrainedValue(e),i=t>Number(this.min)?`${t}`:`${this.min}`;this.value=i}setThumbPositionForOrientation(e){const t=100*(1-ks(Number(this.value),Number(this.min),Number(this.max),e));this.orientation===vo?this.position=this.isDragging?`right: ${t}%; transition: none;`:`right: ${t}%; transition: all 0.2s ease;`:this.position=this.isDragging?`bottom: ${t}%; transition: none;`:`bottom: ${t}%; transition: all 0.2s ease;`}updateStepMultiplier(){const e=this.step+"",t=this.step%1?e.length-e.indexOf(".")-1:0;this.stepMultiplier=Math.pow(10,t)}get midpoint(){return`${this.convertToConstrainedValue((this.max+this.min)/2)}`}setupDefaultValue(){if("string"==typeof this.value)if(0===this.value.length)this.initialValue=this.midpoint;else{const e=parseFloat(this.value);!Number.isNaN(e)&&(e<this.min||e>this.max)&&(this.value=this.midpoint)}}}Ei([Pt({attribute:"readonly",mode:"boolean"})],Es.prototype,"readOnly",void 0),Ei([Ye],Es.prototype,"direction",void 0),Ei([Ye],Es.prototype,"isDragging",void 0),Ei([Ye],Es.prototype,"position",void 0),Ei([Ye],Es.prototype,"trackWidth",void 0),Ei([Ye],Es.prototype,"trackMinWidth",void 0),Ei([Ye],Es.prototype,"trackHeight",void 0),Ei([Ye],Es.prototype,"trackLeft",void 0),Ei([Ye],Es.prototype,"trackMinHeight",void 0),Ei([Ye],Es.prototype,"valueTextFormatter",void 0),Ei([Pt({converter:Dt})],Es.prototype,"min",void 0),Ei([Pt({converter:Dt})],Es.prototype,"max",void 0),Ei([Pt({converter:Dt})],Es.prototype,"step",void 0),Ei([Pt],Es.prototype,"orientation",void 0),Ei([Pt],Es.prototype,"mode",void 0);class As extends uo{}class Is extends(Jo(As)){constructor(){super(...arguments),this.proxy=document.createElement("input")}}class Os extends Is{constructor(){super(),this.initialValue="on",this.keypressHandler=e=>{if(!this.readOnly)switch(e.key){case"Enter":case" ":this.checked=!this.checked}},this.clickHandler=e=>{this.disabled||this.readOnly||(this.checked=!this.checked)},this.proxy.setAttribute("type","checkbox")}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly),this.readOnly?this.classList.add("readonly"):this.classList.remove("readonly")}checkedChanged(e,t){super.checkedChanged(e,t),this.checked?this.classList.add("checked"):this.classList.remove("checked")}}Ei([Pt({attribute:"readonly",mode:"boolean"})],Os.prototype,"readOnly",void 0),Ei([Ye],Os.prototype,"defaultSlottedNodes",void 0);class Ls extends uo{}Ei([Pt({mode:"boolean"})],Ls.prototype,"disabled",void 0);const Fs="horizontal";class Ms extends uo{constructor(){super(...arguments),this.orientation=Fs,this.activeindicator=!0,this.showActiveIndicator=!0,this.prevActiveTabIndex=0,this.activeTabIndex=0,this.ticking=!1,this.change=()=>{this.$emit("change",this.activetab)},this.isDisabledElement=e=>"true"===e.getAttribute("aria-disabled"),this.isFocusableElement=e=>!this.isDisabledElement(e),this.setTabs=()=>{const e="gridColumn",t="gridRow",i=this.isHorizontal()?e:t;this.activeTabIndex=this.getActiveIndex(),this.showActiveIndicator=!1,this.tabs.forEach(((e,t)=>{if("tab"===e.slot){const i=this.activeTabIndex===t&&this.isFocusableElement(e);this.activeindicator&&this.isFocusableElement(e)&&(this.showActiveIndicator=!0);const o=this.tabIds[t],r=this.tabpanelIds[t];e.setAttribute("id",o),e.setAttribute("aria-selected",i?"true":"false"),e.setAttribute("aria-controls",r),e.addEventListener("click",this.handleTabClick),e.addEventListener("keydown",this.handleTabKeyDown),e.setAttribute("tabindex",i?"0":"-1"),i&&(this.activetab=e)}e.style.gridColumn="",e.style.gridRow="",e.style[i]=`${t+1}`,this.isHorizontal()?e.classList.remove("vertical"):e.classList.add("vertical")}))},this.setTabPanels=()=>{this.tabpanels.forEach(((e,t)=>{const i=this.tabIds[t],o=this.tabpanelIds[t];e.setAttribute("id",o),e.setAttribute("aria-labelledby",i),this.activeTabIndex!==t?e.setAttribute("hidden",""):e.removeAttribute("hidden")}))},this.handleTabClick=e=>{const t=e.currentTarget;1===t.nodeType&&this.isFocusableElement(t)&&(this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=this.tabs.indexOf(t),this.setComponent())},this.handleTabKeyDown=e=>{if(this.isHorizontal())switch(e.key){case"ArrowLeft":e.preventDefault(),this.adjustBackward(e);break;case"ArrowRight":e.preventDefault(),this.adjustForward(e)}else switch(e.key){case"ArrowUp":e.preventDefault(),this.adjustBackward(e);break;case"ArrowDown":e.preventDefault(),this.adjustForward(e)}switch(e.key){case"Home":e.preventDefault(),this.adjust(-this.activeTabIndex);break;case"End":e.preventDefault(),this.adjust(this.tabs.length-this.activeTabIndex-1)}},this.adjustForward=e=>{const t=this.tabs;let i=0;for(i=this.activetab?t.indexOf(this.activetab)+1:1,i===t.length&&(i=0);i<t.length&&t.length>1;){if(this.isFocusableElement(t[i])){this.moveToTabByIndex(t,i);break}if(this.activetab&&i===t.indexOf(this.activetab))break;i+1>=t.length?i=0:i+=1}},this.adjustBackward=e=>{const t=this.tabs;let i=0;for(i=this.activetab?t.indexOf(this.activetab)-1:0,i=i<0?t.length-1:i;i>=0&&t.length>1;){if(this.isFocusableElement(t[i])){this.moveToTabByIndex(t,i);break}i-1<0?i=t.length-1:i-=1}},this.moveToTabByIndex=(e,t)=>{const i=e[t];this.activetab=i,this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=t,i.focus(),this.setComponent()}}orientationChanged(){this.$fastController.isConnected&&(this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}activeidChanged(e,t){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.prevActiveTabIndex=this.tabs.findIndex((t=>t.id===e)),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabsChanged(){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabpanelsChanged(){this.$fastController.isConnected&&this.tabpanels.length<=this.tabs.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}getActiveIndex(){return void 0!==this.activeid?-1===this.tabIds.indexOf(this.activeid)?0:this.tabIds.indexOf(this.activeid):0}getTabIds(){return this.tabs.map((e=>{var t;return null!==(t=e.getAttribute("id"))&&void 0!==t?t:`tab-${Eo()}`}))}getTabPanelIds(){return this.tabpanels.map((e=>{var t;return null!==(t=e.getAttribute("id"))&&void 0!==t?t:`panel-${Eo()}`}))}setComponent(){this.activeTabIndex!==this.prevActiveTabIndex&&(this.activeid=this.tabIds[this.activeTabIndex],this.focusTab(),this.change())}isHorizontal(){return this.orientation===Fs}handleActiveIndicatorPosition(){this.showActiveIndicator&&this.activeindicator&&this.activeTabIndex!==this.prevActiveTabIndex&&(this.ticking?this.ticking=!1:(this.ticking=!0,this.animateActiveIndicator()))}animateActiveIndicator(){this.ticking=!0;const e=this.isHorizontal()?"gridColumn":"gridRow",t=this.isHorizontal()?"translateX":"translateY",i=this.isHorizontal()?"offsetLeft":"offsetTop",o=this.activeIndicatorRef[i];this.activeIndicatorRef.style[e]=`${this.activeTabIndex+1}`;const r=this.activeIndicatorRef[i];this.activeIndicatorRef.style[e]=`${this.prevActiveTabIndex+1}`;const n=r-o;this.activeIndicatorRef.style.transform=`${t}(${n}px)`,this.activeIndicatorRef.classList.add("activeIndicatorTransition"),this.activeIndicatorRef.addEventListener("transitionend",(()=>{this.ticking=!1,this.activeIndicatorRef.style[e]=`${this.activeTabIndex+1}`,this.activeIndicatorRef.style.transform=`${t}(0px)`,this.activeIndicatorRef.classList.remove("activeIndicatorTransition")}))}adjust(e){this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=$o(0,this.tabs.length-1,this.activeTabIndex+e),this.setComponent()}focusTab(){this.tabs[this.activeTabIndex].focus()}connectedCallback(){super.connectedCallback(),this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.activeTabIndex=this.getActiveIndex()}}Ei([Pt],Ms.prototype,"orientation",void 0),Ei([Pt],Ms.prototype,"activeid",void 0),Ei([Ye],Ms.prototype,"tabs",void 0),Ei([Ye],Ms.prototype,"tabpanels",void 0),Ei([Pt({mode:"boolean"})],Ms.prototype,"activeindicator",void 0),Ei([Ye],Ms.prototype,"activeIndicatorRef",void 0),Ei([Ye],Ms.prototype,"showActiveIndicator",void 0),fo(Ms,Ci);class Rs extends uo{}class Ds extends(Qo(Rs)){constructor(){super(...arguments),this.proxy=document.createElement("textarea")}}const zs="none";let Ps=class extends Ds{constructor(){super(...arguments),this.resize=zs,this.cols=20,this.handleTextInput=()=>{this.value=this.control.value}}readOnlyChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.readOnly=this.readOnly)}autofocusChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.autofocus=this.autofocus)}listChanged(){this.proxy instanceof HTMLTextAreaElement&&this.proxy.setAttribute("list",this.list)}maxlengthChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.maxLength=this.maxlength)}minlengthChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.minLength=this.minlength)}spellcheckChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.spellcheck=this.spellcheck)}select(){this.control.select(),this.$emit("select")}handleChange(){this.$emit("change")}validate(){super.validate(this.control)}};Ei([Pt({mode:"boolean"})],Ps.prototype,"readOnly",void 0),Ei([Pt],Ps.prototype,"resize",void 0),Ei([Pt({mode:"boolean"})],Ps.prototype,"autofocus",void 0),Ei([Pt({attribute:"form"})],Ps.prototype,"formId",void 0),Ei([Pt],Ps.prototype,"list",void 0),Ei([Pt({converter:Dt})],Ps.prototype,"maxlength",void 0),Ei([Pt({converter:Dt})],Ps.prototype,"minlength",void 0),Ei([Pt],Ps.prototype,"name",void 0),Ei([Pt],Ps.prototype,"placeholder",void 0),Ei([Pt({converter:Dt,mode:"fromView"})],Ps.prototype,"cols",void 0),Ei([Pt({converter:Dt,mode:"fromView"})],Ps.prototype,"rows",void 0),Ei([Pt({mode:"boolean"})],Ps.prototype,"spellcheck",void 0),Ei([Ye],Ps.prototype,"defaultSlottedNodes",void 0),fo(Ps,is);const Ns=Object.freeze({[ko.ArrowUp]:{[bo]:-1},[ko.ArrowDown]:{[bo]:1},[ko.ArrowLeft]:{[vo]:{[Co.ltr]:-1,[Co.rtl]:1}},[ko.ArrowRight]:{[vo]:{[Co.ltr]:1,[Co.rtl]:-1}}});let Hs=class extends uo{constructor(){super(...arguments),this._activeIndex=0,this.direction=Co.ltr,this.orientation=vo}get activeIndex(){return Ze.track(this,"activeIndex"),this._activeIndex}set activeIndex(e){this.$fastController.isConnected&&(this._activeIndex=_o(0,this.focusableElements.length-1,e),Ze.notify(this,"activeIndex"))}slottedItemsChanged(){this.$fastController.isConnected&&this.reduceFocusableElements()}clickHandler(e){var t;const i=null===(t=this.focusableElements)||void 0===t?void 0:t.indexOf(e.target);return i>-1&&this.activeIndex!==i&&this.setFocusedElement(i),!0}childItemsChanged(e,t){this.$fastController.isConnected&&this.reduceFocusableElements()}connectedCallback(){super.connectedCallback(),this.direction=zo(this)}focusinHandler(e){const t=e.relatedTarget;t&&!this.contains(t)&&this.setFocusedElement()}getDirectionalIncrementer(e){var t,i,o,r,n;return null!==(n=null!==(o=null===(i=null===(t=Ns[e])||void 0===t?void 0:t[this.orientation])||void 0===i?void 0:i[this.direction])&&void 0!==o?o:null===(r=Ns[e])||void 0===r?void 0:r[this.orientation])&&void 0!==n?n:0}keydownHandler(e){const t=e.key;if(!(t in ko)||e.defaultPrevented||e.shiftKey)return!0;const i=this.getDirectionalIncrementer(t);if(!i)return!e.target.closest("[role=radiogroup]");const o=this.activeIndex+i;return this.focusableElements[o]&&e.preventDefault(),this.setFocusedElement(o),!0}get allSlottedItems(){return[...this.start.assignedElements(),...this.slottedItems,...this.end.assignedElements()]}reduceFocusableElements(){var e;const t=null===(e=this.focusableElements)||void 0===e?void 0:e[this.activeIndex];this.focusableElements=this.allSlottedItems.reduce(Hs.reduceFocusableItems,[]);const i=this.focusableElements.indexOf(t);this.activeIndex=Math.max(0,i),this.setFocusableElements()}setFocusedElement(e=this.activeIndex){var t;this.activeIndex=e,this.setFocusableElements(),null===(t=this.focusableElements[this.activeIndex])||void 0===t||t.focus()}static reduceFocusableItems(e,t){var i,o,r,n;const s="radio"===t.getAttribute("role"),a=null===(o=null===(i=t.$fastController)||void 0===i?void 0:i.definition.shadowOptions)||void 0===o?void 0:o.delegatesFocus,l=Array.from(null!==(n=null===(r=t.shadowRoot)||void 0===r?void 0:r.querySelectorAll("*"))&&void 0!==n?n:[]).some((e=>Tn(e)));return t.hasAttribute("disabled")||t.hasAttribute("hidden")||!(Tn(t)||s||a||l)?t.childElementCount?e.concat(Array.from(t.children).reduce(Hs.reduceFocusableItems,[])):e:(e.push(t),e)}setFocusableElements(){this.$fastController.isConnected&&this.focusableElements.length>0&&this.focusableElements.forEach(((e,t)=>{e.tabIndex=this.activeIndex===t?0:-1}))}};Ei([Ye],Hs.prototype,"direction",void 0),Ei([Pt],Hs.prototype,"orientation",void 0),Ei([Ye],Hs.prototype,"slottedItems",void 0),Ei([Ye],Hs.prototype,"slottedLabel",void 0),Ei([Ye],Hs.prototype,"childItems",void 0);class Bs{}Ei([Pt({attribute:"aria-labelledby"})],Bs.prototype,"ariaLabelledby",void 0),Ei([Pt({attribute:"aria-label"})],Bs.prototype,"ariaLabel",void 0),fo(Bs,Mo),fo(Hs,Ci,Bs);const Vs="top",js="right",Us="bottom",Ws="left",qs="start",Gs="end",Xs="top-left",Ks="top-right",Zs="bottom-left",Ys="bottom-right",Qs="top-start",Js="top-end",ea="bottom-start",ta="bottom-end";class ia extends uo{constructor(){super(...arguments),this.anchor="",this.delay=300,this.autoUpdateMode="anchor",this.anchorElement=null,this.viewportElement=null,this.verticalPositioningMode="dynamic",this.horizontalPositioningMode="dynamic",this.horizontalInset="false",this.verticalInset="false",this.horizontalScaling="content",this.verticalScaling="content",this.verticalDefaultPosition=void 0,this.horizontalDefaultPosition=void 0,this.tooltipVisible=!1,this.currentDirection=Co.ltr,this.showDelayTimer=null,this.hideDelayTimer=null,this.isAnchorHoveredFocused=!1,this.isRegionHovered=!1,this.handlePositionChange=e=>{this.classList.toggle("top","start"===this.region.verticalPosition),this.classList.toggle("bottom","end"===this.region.verticalPosition),this.classList.toggle("inset-top","insetStart"===this.region.verticalPosition),this.classList.toggle("inset-bottom","insetEnd"===this.region.verticalPosition),this.classList.toggle("center-vertical","center"===this.region.verticalPosition),this.classList.toggle("left","start"===this.region.horizontalPosition),this.classList.toggle("right","end"===this.region.horizontalPosition),this.classList.toggle("inset-left","insetStart"===this.region.horizontalPosition),this.classList.toggle("inset-right","insetEnd"===this.region.horizontalPosition),this.classList.toggle("center-horizontal","center"===this.region.horizontalPosition)},this.handleRegionMouseOver=e=>{this.isRegionHovered=!0},this.handleRegionMouseOut=e=>{this.isRegionHovered=!1,this.startHideDelayTimer()},this.handleAnchorMouseOver=e=>{this.tooltipVisible?this.isAnchorHoveredFocused=!0:this.startShowDelayTimer()},this.handleAnchorMouseOut=e=>{this.isAnchorHoveredFocused=!1,this.clearShowDelayTimer(),this.startHideDelayTimer()},this.handleAnchorFocusIn=e=>{this.startShowDelayTimer()},this.handleAnchorFocusOut=e=>{this.isAnchorHoveredFocused=!1,this.clearShowDelayTimer(),this.startHideDelayTimer()},this.startHideDelayTimer=()=>{this.clearHideDelayTimer(),this.tooltipVisible&&(this.hideDelayTimer=window.setTimeout((()=>{this.updateTooltipVisibility()}),60))},this.clearHideDelayTimer=()=>{null!==this.hideDelayTimer&&(clearTimeout(this.hideDelayTimer),this.hideDelayTimer=null)},this.startShowDelayTimer=()=>{this.isAnchorHoveredFocused||(this.delay>1?null===this.showDelayTimer&&(this.showDelayTimer=window.setTimeout((()=>{this.startHover()}),this.delay)):this.startHover())},this.startHover=()=>{this.isAnchorHoveredFocused=!0,this.updateTooltipVisibility()},this.clearShowDelayTimer=()=>{null!==this.showDelayTimer&&(clearTimeout(this.showDelayTimer),this.showDelayTimer=null)},this.getAnchor=()=>{const e=this.getRootNode();return e instanceof ShadowRoot?e.getElementById(this.anchor):document.getElementById(this.anchor)},this.handleDocumentKeydown=e=>{if(!e.defaultPrevented&&this.tooltipVisible&&"Escape"===e.key)this.isAnchorHoveredFocused=!1,this.updateTooltipVisibility(),this.$emit("dismiss")},this.updateTooltipVisibility=()=>{if(!1===this.visible)this.hideTooltip();else{if(!0===this.visible)return void this.showTooltip();if(this.isAnchorHoveredFocused||this.isRegionHovered)return void this.showTooltip();this.hideTooltip()}},this.showTooltip=()=>{this.tooltipVisible||(this.currentDirection=zo(this),this.tooltipVisible=!0,document.addEventListener("keydown",this.handleDocumentKeydown),Ge.queueUpdate(this.setRegionProps))},this.hideTooltip=()=>{this.tooltipVisible&&(this.clearHideDelayTimer(),null!==this.region&&void 0!==this.region&&(this.region.removeEventListener("positionchange",this.handlePositionChange),this.region.viewportElement=null,this.region.anchorElement=null,this.region.removeEventListener("mouseover",this.handleRegionMouseOver),this.region.removeEventListener("mouseout",this.handleRegionMouseOut)),document.removeEventListener("keydown",this.handleDocumentKeydown),this.tooltipVisible=!1)},this.setRegionProps=()=>{this.tooltipVisible&&(this.region.viewportElement=this.viewportElement,this.region.anchorElement=this.anchorElement,this.region.addEventListener("positionchange",this.handlePositionChange),this.region.addEventListener("mouseover",this.handleRegionMouseOver,{passive:!0}),this.region.addEventListener("mouseout",this.handleRegionMouseOut,{passive:!0}))}}visibleChanged(){this.$fastController.isConnected&&(this.updateTooltipVisibility(),this.updateLayout())}anchorChanged(){this.$fastController.isConnected&&(this.anchorElement=this.getAnchor())}positionChanged(){this.$fastController.isConnected&&this.updateLayout()}anchorElementChanged(e){if(this.$fastController.isConnected){if(null!=e&&(e.removeEventListener("mouseover",this.handleAnchorMouseOver),e.removeEventListener("mouseout",this.handleAnchorMouseOut),e.removeEventListener("focusin",this.handleAnchorFocusIn),e.removeEventListener("focusout",this.handleAnchorFocusOut)),null!==this.anchorElement&&void 0!==this.anchorElement){this.anchorElement.addEventListener("mouseover",this.handleAnchorMouseOver,{passive:!0}),this.anchorElement.addEventListener("mouseout",this.handleAnchorMouseOut,{passive:!0}),this.anchorElement.addEventListener("focusin",this.handleAnchorFocusIn,{passive:!0}),this.anchorElement.addEventListener("focusout",this.handleAnchorFocusOut,{passive:!0});const e=this.anchorElement.id;null!==this.anchorElement.parentElement&&this.anchorElement.parentElement.querySelectorAll(":hover").forEach((t=>{t.id===e&&this.startShowDelayTimer()}))}null!==this.region&&void 0!==this.region&&this.tooltipVisible&&(this.region.anchorElement=this.anchorElement),this.updateLayout()}}viewportElementChanged(){null!==this.region&&void 0!==this.region&&(this.region.viewportElement=this.viewportElement),this.updateLayout()}connectedCallback(){super.connectedCallback(),this.anchorElement=this.getAnchor(),this.updateTooltipVisibility()}disconnectedCallback(){this.hideTooltip(),this.clearShowDelayTimer(),this.clearHideDelayTimer(),super.disconnectedCallback()}updateLayout(){switch(this.verticalPositioningMode="locktodefault",this.horizontalPositioningMode="locktodefault",this.position){case Vs:case Us:this.verticalDefaultPosition=this.position,this.horizontalDefaultPosition="center";break;case js:case Ws:case qs:case Gs:this.verticalDefaultPosition="center",this.horizontalDefaultPosition=this.position;break;case Xs:this.verticalDefaultPosition="top",this.horizontalDefaultPosition="left";break;case Ks:this.verticalDefaultPosition="top",this.horizontalDefaultPosition="right";break;case Zs:this.verticalDefaultPosition="bottom",this.horizontalDefaultPosition="left";break;case Ys:this.verticalDefaultPosition="bottom",this.horizontalDefaultPosition="right";break;case Qs:this.verticalDefaultPosition="top",this.horizontalDefaultPosition="start";break;case Js:this.verticalDefaultPosition="top",this.horizontalDefaultPosition="end";break;case ea:this.verticalDefaultPosition="bottom",this.horizontalDefaultPosition="start";break;case ta:this.verticalDefaultPosition="bottom",this.horizontalDefaultPosition="end";break;default:this.verticalPositioningMode="dynamic",this.horizontalPositioningMode="dynamic",this.verticalDefaultPosition=void 0,this.horizontalDefaultPosition="center"}}}Ei([Pt({mode:"boolean"})],ia.prototype,"visible",void 0),Ei([Pt],ia.prototype,"anchor",void 0),Ei([Pt],ia.prototype,"delay",void 0),Ei([Pt],ia.prototype,"position",void 0),Ei([Pt({attribute:"auto-update-mode"})],ia.prototype,"autoUpdateMode",void 0),Ei([Pt({attribute:"horizontal-viewport-lock"})],ia.prototype,"horizontalViewportLock",void 0),Ei([Pt({attribute:"vertical-viewport-lock"})],ia.prototype,"verticalViewportLock",void 0),Ei([Ye],ia.prototype,"anchorElement",void 0),Ei([Ye],ia.prototype,"viewportElement",void 0),Ei([Ye],ia.prototype,"verticalPositioningMode",void 0),Ei([Ye],ia.prototype,"horizontalPositioningMode",void 0),Ei([Ye],ia.prototype,"horizontalInset",void 0),Ei([Ye],ia.prototype,"verticalInset",void 0),Ei([Ye],ia.prototype,"horizontalScaling",void 0),Ei([Ye],ia.prototype,"verticalScaling",void 0),Ei([Ye],ia.prototype,"verticalDefaultPosition",void 0),Ei([Ye],ia.prototype,"horizontalDefaultPosition",void 0),Ei([Ye],ia.prototype,"tooltipVisible",void 0),Ei([Ye],ia.prototype,"currentDirection",void 0);function oa(e){return yo(e)&&"treeitem"===e.getAttribute("role")}class ra extends uo{constructor(){super(...arguments),this.expanded=!1,this.focusable=!1,this.isNestedItem=()=>oa(this.parentElement),this.handleExpandCollapseButtonClick=e=>{this.disabled||e.defaultPrevented||(this.expanded=!this.expanded)},this.handleFocus=e=>{this.setAttribute("tabindex","0")},this.handleBlur=e=>{this.setAttribute("tabindex","-1")}}expandedChanged(){this.$fastController.isConnected&&this.$emit("expanded-change",this)}selectedChanged(){this.$fastController.isConnected&&this.$emit("selected-change",this)}itemsChanged(e,t){this.$fastController.isConnected&&this.items.forEach((e=>{oa(e)&&(e.nested=!0)}))}static focusItem(e){e.focusable=!0,e.focus()}childItemLength(){const e=this.childItems.filter((e=>oa(e)));return e?e.length:0}}Ei([Pt({mode:"boolean"})],ra.prototype,"expanded",void 0),Ei([Pt({mode:"boolean"})],ra.prototype,"selected",void 0),Ei([Pt({mode:"boolean"})],ra.prototype,"disabled",void 0),Ei([Ye],ra.prototype,"focusable",void 0),Ei([Ye],ra.prototype,"childItems",void 0),Ei([Ye],ra.prototype,"items",void 0),Ei([Ye],ra.prototype,"nested",void 0),Ei([Ye],ra.prototype,"renderCollapsedChildren",void 0),fo(ra,Ci);class na extends uo{constructor(){super(...arguments),this.currentFocused=null,this.handleFocus=e=>{if(!(this.slottedTreeItems.length<1))return e.target===this?(null===this.currentFocused&&(this.currentFocused=this.getValidFocusableItem()),void(null!==this.currentFocused&&ra.focusItem(this.currentFocused))):void(this.contains(e.target)&&(this.setAttribute("tabindex","-1"),this.currentFocused=e.target))},this.handleBlur=e=>{e.target instanceof HTMLElement&&(null===e.relatedTarget||!this.contains(e.relatedTarget))&&this.setAttribute("tabindex","0")},this.handleKeyDown=e=>{if(e.defaultPrevented)return;if(this.slottedTreeItems.length<1)return!0;const t=this.getVisibleNodes();switch(e.key){case"Home":return void(t.length&&ra.focusItem(t[0]));case"End":return void(t.length&&ra.focusItem(t[t.length-1]));case"ArrowLeft":if(e.target&&this.isFocusableElement(e.target)){const t=e.target;t instanceof ra&&t.childItemLength()>0&&t.expanded?t.expanded=!1:t instanceof ra&&t.parentElement instanceof ra&&ra.focusItem(t.parentElement)}return!1;case"ArrowRight":if(e.target&&this.isFocusableElement(e.target)){const t=e.target;t instanceof ra&&t.childItemLength()>0&&!t.expanded?t.expanded=!0:t instanceof ra&&t.childItemLength()>0&&this.focusNextNode(1,e.target)}return;case"ArrowDown":return void(e.target&&this.isFocusableElement(e.target)&&this.focusNextNode(1,e.target));case"ArrowUp":return void(e.target&&this.isFocusableElement(e.target)&&this.focusNextNode(-1,e.target));case"Enter":return void this.handleClick(e)}return!0},this.handleSelectedChange=e=>{if(e.defaultPrevented)return;if(!(e.target instanceof Element&&oa(e.target)))return!0;const t=e.target;t.selected?(this.currentSelected&&this.currentSelected!==t&&(this.currentSelected.selected=!1),this.currentSelected=t):t.selected||this.currentSelected!==t||(this.currentSelected=null)},this.setItems=()=>{const e=this.treeView.querySelector("[aria-selected='true']");this.currentSelected=e,null!==this.currentFocused&&this.contains(this.currentFocused)||(this.currentFocused=this.getValidFocusableItem()),this.nested=this.checkForNestedItems();this.getVisibleNodes().forEach((e=>{oa(e)&&(e.nested=this.nested)}))},this.isFocusableElement=e=>oa(e),this.isSelectedElement=e=>e.selected}slottedTreeItemsChanged(){this.$fastController.isConnected&&this.setItems()}connectedCallback(){super.connectedCallback(),this.setAttribute("tabindex","0"),Ge.queueUpdate((()=>{this.setItems()}))}handleClick(e){if(e.defaultPrevented)return;if(!(e.target instanceof Element&&oa(e.target)))return!0;const t=e.target;t.disabled||(t.selected=!t.selected)}focusNextNode(e,t){const i=this.getVisibleNodes();if(!i)return;const o=i[i.indexOf(t)+e];yo(o)&&ra.focusItem(o)}getValidFocusableItem(){const e=this.getVisibleNodes();let t=e.findIndex(this.isSelectedElement);return-1===t&&(t=e.findIndex(this.isFocusableElement)),-1!==t?e[t]:null}checkForNestedItems(){return this.slottedTreeItems.some((e=>oa(e)&&e.querySelector("[role='treeitem']")))}getVisibleNodes(){return function(e,t){if(!e||!t||!yo(e))return;return Array.from(e.querySelectorAll(t)).filter((e=>null!==e.offsetParent))}(this,"[role='treeitem']")||[]}}Ei([Pt({attribute:"render-collapsed-nodes"})],na.prototype,"renderCollapsedNodes",void 0),Ei([Ye],na.prototype,"currentSelected",void 0),Ei([Ye],na.prototype,"slottedTreeItems",void 0);class sa{constructor(e){this.listenerCache=new WeakMap,this.query=e}bind(e){const{query:t}=this,i=this.constructListener(e);i.bind(t)(),t.addListener(i),this.listenerCache.set(e,i)}unbind(e){const t=this.listenerCache.get(e);t&&(this.query.removeListener(t),this.listenerCache.delete(e))}}class aa extends sa{constructor(e,t){super(e),this.styles=t}static with(e){return t=>new aa(e,t)}constructListener(e){let t=!1;const i=this.styles;return function(){const{matches:o}=this;o&&!t?(e.$fastController.addStyles(i),t=o):!o&&t&&(e.$fastController.removeStyles(i),t=o)}}unbind(e){super.unbind(e),e.$fastController.removeStyles(this.styles)}}const la=aa.with(window.matchMedia("(forced-colors)"));aa.with(window.matchMedia("(prefers-color-scheme: dark)")),aa.with(window.matchMedia("(prefers-color-scheme: light)"));class da{constructor(e,t,i){this.propertyName=e,this.value=t,this.styles=i}bind(e){Ze.getNotifier(e).subscribe(this,this.propertyName),this.handleChange(e,this.propertyName)}unbind(e){Ze.getNotifier(e).unsubscribe(this,this.propertyName),e.$fastController.removeStyles(this.styles)}handleChange(e,t){e[t]===this.value?e.$fastController.addStyles(this.styles):e.$fastController.removeStyles(this.styles)}}function ca(e){return`:host([hidden]){display:none}:host{display:${e}}`}const ha=function(){if("boolean"==typeof xo)return xo;if("undefined"==typeof window||!window.document||!window.document.createElement)return xo=!1,xo;const e=document.createElement("style"),t=function(){const e=document.querySelector('meta[property="csp-nonce"]');return e?e.getAttribute("content"):null}();null!==t&&e.setAttribute("nonce",t),document.head.appendChild(e);try{e.sheet.insertRule("foo:focus-visible {color:inherit}",0),xo=!0}catch(e){xo=!1}finally{document.head.removeChild(e)}return xo}()?"focus-visible":"focus";function ua(e,t,i){return isNaN(e)||e<=t?t:e>=i?i:e}function pa(e,t,i){return isNaN(e)||e<=t?0:e>=i?1:e/(i-t)}function ma(e,t,i){return isNaN(e)?t:t+e*(i-t)}function fa(e){return e*(Math.PI/180)}function ga(e,t,i){return isNaN(e)||e<=0?t:e>=1?i:t+e*(i-t)}function va(e,t,i){if(e<=0)return t%360;if(e>=1)return i%360;const o=(t-i+360)%360;return o<=(i-t+360)%360?(t-o*e+360)%360:(t+o*e+360)%360}function ba(e,t){const i=Math.pow(10,t);return Math.round(e*i)/i}class ya{constructor(e,t,i){this.h=e,this.s=t,this.l=i}static fromObject(e){return!e||isNaN(e.h)||isNaN(e.s)||isNaN(e.l)?null:new ya(e.h,e.s,e.l)}equalValue(e){return this.h===e.h&&this.s===e.s&&this.l===e.l}roundToPrecision(e){return new ya(ba(this.h,e),ba(this.s,e),ba(this.l,e))}toObject(){return{h:this.h,s:this.s,l:this.l}}}class xa{constructor(e,t,i){this.h=e,this.s=t,this.v=i}static fromObject(e){return!e||isNaN(e.h)||isNaN(e.s)||isNaN(e.v)?null:new xa(e.h,e.s,e.v)}equalValue(e){return this.h===e.h&&this.s===e.s&&this.v===e.v}roundToPrecision(e){return new xa(ba(this.h,e),ba(this.s,e),ba(this.v,e))}toObject(){return{h:this.h,s:this.s,v:this.v}}}class wa{constructor(e,t,i){this.l=e,this.a=t,this.b=i}static fromObject(e){return!e||isNaN(e.l)||isNaN(e.a)||isNaN(e.b)?null:new wa(e.l,e.a,e.b)}equalValue(e){return this.l===e.l&&this.a===e.a&&this.b===e.b}roundToPrecision(e){return new wa(ba(this.l,e),ba(this.a,e),ba(this.b,e))}toObject(){return{l:this.l,a:this.a,b:this.b}}}wa.epsilon=216/24389,wa.kappa=24389/27;class ka{constructor(e,t,i){this.l=e,this.c=t,this.h=i}static fromObject(e){return!e||isNaN(e.l)||isNaN(e.c)||isNaN(e.h)?null:new ka(e.l,e.c,e.h)}equalValue(e){return this.l===e.l&&this.c===e.c&&this.h===e.h}roundToPrecision(e){return new ka(ba(this.l,e),ba(this.c,e),ba(this.h,e))}toObject(){return{l:this.l,c:this.c,h:this.h}}}class Ca{constructor(e,t,i,o){this.r=e,this.g=t,this.b=i,this.a="number"!=typeof o||isNaN(o)?1:o}static fromObject(e){return!e||isNaN(e.r)||isNaN(e.g)||isNaN(e.b)?null:new Ca(e.r,e.g,e.b,e.a)}equalValue(e){return this.r===e.r&&this.g===e.g&&this.b===e.b&&this.a===e.a}toStringHexRGB(){return"#"+[this.r,this.g,this.b].map(this.formatHexValue).join("")}toStringHexRGBA(){return this.toStringHexRGB()+this.formatHexValue(this.a)}toStringHexARGB(){return"#"+[this.a,this.r,this.g,this.b].map(this.formatHexValue).join("")}toStringWebRGB(){return`rgb(${Math.round(ma(this.r,0,255))},${Math.round(ma(this.g,0,255))},${Math.round(ma(this.b,0,255))})`}toStringWebRGBA(){return`rgba(${Math.round(ma(this.r,0,255))},${Math.round(ma(this.g,0,255))},${Math.round(ma(this.b,0,255))},${ua(this.a,0,1)})`}roundToPrecision(e){return new Ca(ba(this.r,e),ba(this.g,e),ba(this.b,e),ba(this.a,e))}clamp(){return new Ca(ua(this.r,0,1),ua(this.g,0,1),ua(this.b,0,1),ua(this.a,0,1))}toObject(){return{r:this.r,g:this.g,b:this.b,a:this.a}}formatHexValue(e){return function(e){const t=Math.round(ua(e,0,255)).toString(16);return 1===t.length?"0"+t:t}(ma(e,0,255))}}class $a{constructor(e,t,i){this.x=e,this.y=t,this.z=i}static fromObject(e){return!e||isNaN(e.x)||isNaN(e.y)||isNaN(e.z)?null:new $a(e.x,e.y,e.z)}equalValue(e){return this.x===e.x&&this.y===e.y&&this.z===e.z}roundToPrecision(e){return new $a(ba(this.x,e),ba(this.y,e),ba(this.z,e))}toObject(){return{x:this.x,y:this.y,z:this.z}}}function _a(e){return.2126*e.r+.7152*e.g+.0722*e.b}function Sa(e){function t(e){return e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4)}return _a(new Ca(t(e.r),t(e.g),t(e.b),1))}$a.whitePoint=new $a(.95047,1,1.08883);const Ta=(e,t)=>(e+.05)/(t+.05);function Ea(e,t){const i=Sa(e),o=Sa(t);return i>o?Ta(i,o):Ta(o,i)}function Aa(e){const t=Math.max(e.r,e.g,e.b),i=Math.min(e.r,e.g,e.b),o=t-i;let r=0;0!==o&&(r=t===e.r?(e.g-e.b)/o%6*60:t===e.g?60*((e.b-e.r)/o+2):60*((e.r-e.g)/o+4)),r<0&&(r+=360);const n=(t+i)/2;let s=0;return 0!==o&&(s=o/(1-Math.abs(2*n-1))),new ya(r,s,n)}function Ia(e,t=1){const i=(1-Math.abs(2*e.l-1))*e.s,o=i*(1-Math.abs(e.h/60%2-1)),r=e.l-i/2;let n=0,s=0,a=0;return e.h<60?(n=i,s=o,a=0):e.h<120?(n=o,s=i,a=0):e.h<180?(n=0,s=i,a=o):e.h<240?(n=0,s=o,a=i):e.h<300?(n=o,s=0,a=i):e.h<360&&(n=i,s=0,a=o),new Ca(n+r,s+r,a+r,t)}function Oa(e){const t=Math.max(e.r,e.g,e.b),i=t-Math.min(e.r,e.g,e.b);let o=0;0!==i&&(o=t===e.r?(e.g-e.b)/i%6*60:t===e.g?60*((e.b-e.r)/i+2):60*((e.r-e.g)/i+4)),o<0&&(o+=360);let r=0;return 0!==t&&(r=i/t),new xa(o,r,t)}function La(e){let t=0;(Math.abs(e.b)>.001||Math.abs(e.a)>.001)&&(t=function(e){return e*(180/Math.PI)}(Math.atan2(e.b,e.a))),t<0&&(t+=360);const i=Math.sqrt(e.a*e.a+e.b*e.b);return new ka(e.l,i,t)}function Fa(e){function t(e){return e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)}const i=t(e.r),o=t(e.g),r=t(e.b);return new $a(.4124564*i+.3575761*o+.1804375*r,.2126729*i+.7151522*o+.072175*r,.0193339*i+.119192*o+.9503041*r)}function Ma(e,t=1){function i(e){return e<=.0031308?12.92*e:1.055*Math.pow(e,1/2.4)-.055}const o=i(3.2404542*e.x-1.5371385*e.y-.4985314*e.z),r=i(-.969266*e.x+1.8760108*e.y+.041556*e.z),n=i(.0556434*e.x-.2040259*e.y+1.0572252*e.z);return new Ca(o,r,n,t)}function Ra(e){return function(e){function t(e){return e>wa.epsilon?Math.pow(e,1/3):(wa.kappa*e+16)/116}const i=t(e.x/$a.whitePoint.x),o=t(e.y/$a.whitePoint.y),r=t(e.z/$a.whitePoint.z);return new wa(116*o-16,500*(i-o),200*(o-r))}(Fa(e))}function Da(e,t=1){return Ma(function(e){const t=(e.l+16)/116,i=t+e.a/500,o=t-e.b/200,r=Math.pow(i,3),n=Math.pow(t,3),s=Math.pow(o,3);let a=0;a=r>wa.epsilon?r:(116*i-16)/wa.kappa;let l=0;l=e.l>wa.epsilon*wa.kappa?n:e.l/wa.kappa;let d=0;return d=s>wa.epsilon?s:(116*o-16)/wa.kappa,a=$a.whitePoint.x*a,l=$a.whitePoint.y*l,d=$a.whitePoint.z*d,new $a(a,l,d)}(e),t)}function za(e){return La(Ra(e))}function Pa(e,t=1){return Da(function(e){let t=0,i=0;return 0!==e.h&&(t=Math.cos(fa(e.h))*e.c,i=Math.sin(fa(e.h))*e.c),new wa(e.l,t,i)}(e),t)}function Na(e,t,i=18){const o=za(e);let r=o.c+t*i;return r<0&&(r=0),Pa(new ka(o.l,r,o.h))}function Ha(e,t){return e*t}function Ba(e,t){return new Ca(Ha(e.r,t.r),Ha(e.g,t.g),Ha(e.b,t.b),1)}function Va(e,t){return ua(e<.5?2*t*e:1-2*(1-t)*(1-e),0,1)}function ja(e,t){return new Ca(Va(e.r,t.r),Va(e.g,t.g),Va(e.b,t.b),1)}var Ua,Wa;function qa(e,t,i,o){if(isNaN(e)||e<=0)return i;if(e>=1)return o;switch(t){case Wa.HSL:return Ia(function(e,t,i){return isNaN(e)||e<=0?t:e>=1?i:new ya(va(e,t.h,i.h),ga(e,t.s,i.s),ga(e,t.l,i.l))}(e,Aa(i),Aa(o)));case Wa.HSV:return function(e,t=1){const i=e.s*e.v,o=i*(1-Math.abs(e.h/60%2-1)),r=e.v-i;let n=0,s=0,a=0;return e.h<60?(n=i,s=o,a=0):e.h<120?(n=o,s=i,a=0):e.h<180?(n=0,s=i,a=o):e.h<240?(n=0,s=o,a=i):e.h<300?(n=o,s=0,a=i):e.h<360&&(n=i,s=0,a=o),new Ca(n+r,s+r,a+r,t)}(function(e,t,i){return isNaN(e)||e<=0?t:e>=1?i:new xa(va(e,t.h,i.h),ga(e,t.s,i.s),ga(e,t.v,i.v))}(e,Oa(i),Oa(o)));case Wa.XYZ:return Ma(function(e,t,i){return isNaN(e)||e<=0?t:e>=1?i:new $a(ga(e,t.x,i.x),ga(e,t.y,i.y),ga(e,t.z,i.z))}(e,Fa(i),Fa(o)));case Wa.LAB:return Da(function(e,t,i){return isNaN(e)||e<=0?t:e>=1?i:new wa(ga(e,t.l,i.l),ga(e,t.a,i.a),ga(e,t.b,i.b))}(e,Ra(i),Ra(o)));case Wa.LCH:return Pa(function(e,t,i){return isNaN(e)||e<=0?t:e>=1?i:new ka(ga(e,t.l,i.l),ga(e,t.c,i.c),va(e,t.h,i.h))}(e,za(i),za(o)));default:return function(e,t,i){return isNaN(e)||e<=0?t:e>=1?i:new Ca(ga(e,t.r,i.r),ga(e,t.g,i.g),ga(e,t.b,i.b),ga(e,t.a,i.a))}(e,i,o)}}!function(e){e[e.Burn=0]="Burn",e[e.Color=1]="Color",e[e.Darken=2]="Darken",e[e.Dodge=3]="Dodge",e[e.Lighten=4]="Lighten",e[e.Multiply=5]="Multiply",e[e.Overlay=6]="Overlay",e[e.Screen=7]="Screen"}(Ua||(Ua={})),function(e){e[e.RGB=0]="RGB",e[e.HSL=1]="HSL",e[e.HSV=2]="HSV",e[e.XYZ=3]="XYZ",e[e.LAB=4]="LAB",e[e.LCH=5]="LCH"}(Wa||(Wa={}));class Ga{constructor(e){if(null==e||0===e.length)throw new Error("The stops argument must be non-empty");this.stops=this.sortColorScaleStops(e)}static createBalancedColorScale(e){if(null==e||0===e.length)throw new Error("The colors argument must be non-empty");const t=new Array(e.length);for(let i=0;i<e.length;i++)0===i?t[i]={color:e[i],position:0}:i===e.length-1?t[i]={color:e[i],position:1}:t[i]={color:e[i],position:i*(1/(e.length-1))};return new Ga(t)}getColor(e,t=Wa.RGB){if(1===this.stops.length)return this.stops[0].color;if(e<=0)return this.stops[0].color;if(e>=1)return this.stops[this.stops.length-1].color;let i=0;for(let t=0;t<this.stops.length;t++)this.stops[t].position<=e&&(i=t);let o=i+1;o>=this.stops.length&&(o=this.stops.length-1);return qa((e-this.stops[i].position)*(1/(this.stops[o].position-this.stops[i].position)),t,this.stops[i].color,this.stops[o].color)}trim(e,t,i=Wa.RGB){if(e<0||t>1||t<e)throw new Error("Invalid bounds");if(e===t)return new Ga([{color:this.getColor(e,i),position:0}]);const o=[];for(let i=0;i<this.stops.length;i++)this.stops[i].position>=e&&this.stops[i].position<=t&&o.push(this.stops[i]);if(0===o.length)return new Ga([{color:this.getColor(e),position:e},{color:this.getColor(t),position:t}]);o[0].position!==e&&o.unshift({color:this.getColor(e),position:e}),o[o.length-1].position!==t&&o.push({color:this.getColor(t),position:t});const r=t-e,n=new Array(o.length);for(let t=0;t<o.length;t++)n[t]={color:o[t].color,position:(o[t].position-e)/r};return new Ga(n)}findNextColor(e,t,i=!1,o=Wa.RGB,r=.005,n=32){isNaN(e)||e<=0?e=0:e>=1&&(e=1);const s=this.getColor(e,o),a=i?0:1;if(Ea(s,this.getColor(a,o))<=t)return a;let l=i?0:e,d=i?e:0,c=a,h=0;for(;h<=n;){c=Math.abs(d-l)/2+l;const e=Ea(s,this.getColor(c,o));if(Math.abs(e-t)<=r)return c;e>t?i?l=c:d=c:i?d=c:l=c,h++}return c}clone(){const e=new Array(this.stops.length);for(let t=0;t<e.length;t++)e[t]={color:this.stops[t].color,position:this.stops[t].position};return new Ga(e)}sortColorScaleStops(e){return e.sort(((e,t)=>{const i=e.position,o=t.position;return i<o?-1:i>o?1:0}))}}const Xa=/^#((?:[0-9a-f]{6}|[0-9a-f]{3}))$/i;function Ka(e){const t=Xa.exec(e);if(null===t)return null;let i=t[1];if(3===i.length){const e=i.charAt(0),t=i.charAt(1),o=i.charAt(2);i=e.concat(e,t,t,o,o)}const o=parseInt(i,16);return isNaN(o)?null:new Ca(pa((16711680&o)>>>16,0,255),pa((65280&o)>>>8,0,255),pa(255&o,0,255),1)}class Za{constructor(e){this.config=Object.assign({},Za.defaultPaletteConfig,e),this.palette=[],this.updatePaletteColors()}updatePaletteGenerationValues(e){let t=!1;for(const i in e)this.config[i]&&(this.config[i].equalValue?this.config[i].equalValue(e[i])||(this.config[i]=e[i],t=!0):e[i]!==this.config[i]&&(this.config[i]=e[i],t=!0));return t&&this.updatePaletteColors(),t}updatePaletteColors(){const e=this.generatePaletteColorScale();for(let t=0;t<this.config.steps;t++)this.palette[t]=e.getColor(t/(this.config.steps-1),this.config.interpolationMode)}generatePaletteColorScale(){const e=Aa(this.config.baseColor),t=new Ga([{position:0,color:this.config.scaleColorLight},{position:.5,color:this.config.baseColor},{position:1,color:this.config.scaleColorDark}]).trim(this.config.clipLight,1-this.config.clipDark);let i=t.getColor(0),o=t.getColor(1);if(e.s>=this.config.saturationAdjustmentCutoff&&(i=Na(i,this.config.saturationLight),o=Na(o,this.config.saturationDark)),0!==this.config.multiplyLight){const e=Ba(this.config.baseColor,i);i=qa(this.config.multiplyLight,this.config.interpolationMode,i,e)}if(0!==this.config.multiplyDark){const e=Ba(this.config.baseColor,o);o=qa(this.config.multiplyDark,this.config.interpolationMode,o,e)}if(0!==this.config.overlayLight){const e=ja(this.config.baseColor,i);i=qa(this.config.overlayLight,this.config.interpolationMode,i,e)}if(0!==this.config.overlayDark){const e=ja(this.config.baseColor,o);o=qa(this.config.overlayDark,this.config.interpolationMode,o,e)}return this.config.baseScalePosition?this.config.baseScalePosition<=0?new Ga([{position:0,color:this.config.baseColor},{position:1,color:o.clamp()}]):this.config.baseScalePosition>=1?new Ga([{position:0,color:i.clamp()},{position:1,color:this.config.baseColor}]):new Ga([{position:0,color:i.clamp()},{position:this.config.baseScalePosition,color:this.config.baseColor},{position:1,color:o.clamp()}]):new Ga([{position:0,color:i.clamp()},{position:.5,color:this.config.baseColor},{position:1,color:o.clamp()}])}}Za.defaultPaletteConfig={baseColor:Ka("#808080"),steps:11,interpolationMode:Wa.RGB,scaleColorLight:new Ca(1,1,1,1),scaleColorDark:new Ca(0,0,0,1),clipLight:.185,clipDark:.16,saturationAdjustmentCutoff:.05,saturationLight:.35,saturationDark:1.25,overlayLight:0,overlayDark:.25,multiplyLight:0,multiplyDark:0,baseScalePosition:.5},Za.greyscalePaletteConfig={baseColor:Ka("#808080"),steps:11,interpolationMode:Wa.RGB,scaleColorLight:new Ca(1,1,1,1),scaleColorDark:new Ca(0,0,0,1),clipLight:0,clipDark:0,saturationAdjustmentCutoff:0,saturationLight:0,saturationDark:0,overlayLight:0,overlayDark:0,multiplyLight:0,multiplyDark:0,baseScalePosition:.5},Za.defaultPaletteConfig.scaleColorLight,Za.defaultPaletteConfig.scaleColorDark;class Ya{constructor(e){this.palette=[],this.config=Object.assign({},Ya.defaultPaletteConfig,e),this.regenPalettes()}regenPalettes(){let e=this.config.steps;(isNaN(e)||e<3)&&(e=3);const t=.14,i=new Ca(t,t,t,1),o=new Za(Object.assign(Object.assign({},Za.greyscalePaletteConfig),{baseColor:i,baseScalePosition:86/94,steps:e})).palette,r=(_a(this.config.baseColor)+Aa(this.config.baseColor).l)/2,n=this.matchRelativeLuminanceIndex(r,o)/(e-1),s=this.matchRelativeLuminanceIndex(t,o)/(e-1),a=Aa(this.config.baseColor),l=Ia(ya.fromObject({h:a.h,s:a.s,l:t})),d=Ia(ya.fromObject({h:a.h,s:a.s,l:.06})),c=new Array(5);c[0]={position:0,color:new Ca(1,1,1,1)},c[1]={position:n,color:this.config.baseColor},c[2]={position:s,color:l},c[3]={position:.99,color:d},c[4]={position:1,color:new Ca(0,0,0,1)};const h=new Ga(c);this.palette=new Array(e);for(let t=0;t<e;t++){const i=h.getColor(t/(e-1),Wa.RGB);this.palette[t]=i}}matchRelativeLuminanceIndex(e,t){let i=Number.MAX_VALUE,o=0,r=0;const n=t.length;for(;r<n;r++){const n=Math.abs(_a(t[r])-e);n<i&&(i=n,o=r)}return o}}function Qa(e,t){const i=e.relativeLuminance>t.relativeLuminance?e:t,o=e.relativeLuminance>t.relativeLuminance?t:e;return(i.relativeLuminance+.05)/(o.relativeLuminance+.05)}Ya.defaultPaletteConfig={baseColor:Ka("#808080"),steps:94};const Ja=Object.freeze({create:(e,t,i)=>new el(e,t,i),from:e=>new el(e.r,e.g,e.b)});class el extends Ca{constructor(e,t,i){super(e,t,i,1),this.toColorString=this.toStringHexRGB,this.contrast=Qa.bind(null,this),this.createCSS=this.toColorString,this.relativeLuminance=Sa(this)}static fromObject(e){return new el(e.r,e.g,e.b)}}function tl(e,t,i=0,o=e.length-1){if(o===i)return e[i];const r=Math.floor((o-i)/2)+i;return t(e[r])?tl(e,t,i,r):tl(e,t,r+1,o)}const il=(-.1+Math.sqrt(.21))/2;function ol(e){return function(e){return e.relativeLuminance<=il}(e)?-1:1}const rl=Object.freeze({create:function(e,t,i){return"number"==typeof e?rl.from(Ja.create(e,t,i)):rl.from(e)},from:function(e){return function(e){const t={r:0,g:0,b:0,toColorString:()=>"",contrast:()=>0,relativeLuminance:0};for(const i in t)if(typeof t[i]!=typeof e[i])return!1;return!0}(e)?nl.from(e):nl.from(Ja.create(e.r,e.g,e.b))}});class nl{constructor(e,t){this.closestIndexCache=new Map,this.source=e,this.swatches=t,this.reversedSwatches=Object.freeze([...this.swatches].reverse()),this.lastIndex=this.swatches.length-1}colorContrast(e,t,i,o){void 0===i&&(i=this.closestIndexOf(e));let r=this.swatches;const n=this.lastIndex;let s=i;void 0===o&&(o=ol(e));return-1===o&&(r=this.reversedSwatches,s=n-s),tl(r,(i=>Qa(e,i)>=t),s,n)}get(e){return this.swatches[e]||this.swatches[ua(e,0,this.lastIndex)]}closestIndexOf(e){if(this.closestIndexCache.has(e.relativeLuminance))return this.closestIndexCache.get(e.relativeLuminance);let t=this.swatches.indexOf(e);if(-1!==t)return this.closestIndexCache.set(e.relativeLuminance,t),t;const i=this.swatches.reduce(((t,i)=>Math.abs(i.relativeLuminance-e.relativeLuminance)<Math.abs(t.relativeLuminance-e.relativeLuminance)?i:t));return t=this.swatches.indexOf(i),this.closestIndexCache.set(e.relativeLuminance,t),t}static from(e){return new nl(e,Object.freeze(new Ya({baseColor:Ca.fromObject(e)}).palette.map((e=>{const t=Ka(e.toStringHexRGB());return Ja.create(t.r,t.g,t.b)}))))}}const sl=Ja.create(1,1,1),al=Ja.create(0,0,0),ll=Ja.from(Ka("#808080")),dl=Ja.from(Ka("#DA1A5F"));function cl(e){return Ja.create(e,e,e)}function hl(e,t,i,o,r,n){return Math.max(e.closestIndexOf(cl(t))+i,o,r,n)}const{create:ul}=sn;function pl(e){return sn.create({name:e,cssCustomPropertyName:null})}const ml=ul("body-font").withDefault('aktiv-grotesk, "Segoe UI", Arial, Helvetica, sans-serif'),fl=ul("base-height-multiplier").withDefault(10),gl=ul("base-horizontal-spacing-multiplier").withDefault(3),vl=ul("base-layer-luminance").withDefault(.23),bl=ul("control-corner-radius").withDefault(4),yl=ul("density").withDefault(0),xl=ul("design-unit").withDefault(4),wl=ul("direction").withDefault(Co.ltr),kl=ul("disabled-opacity").withDefault(.3),Cl=ul("stroke-width").withDefault(1),$l=ul("focus-stroke-width").withDefault(2),_l=ul("type-ramp-base-font-size").withDefault("14px"),Sl=ul("type-ramp-base-line-height").withDefault("20px"),Tl=ul("type-ramp-minus-1-font-size").withDefault("12px"),El=ul("type-ramp-minus-1-line-height").withDefault("16px"),Al=ul("type-ramp-minus-2-font-size").withDefault("10px"),Il=ul("type-ramp-minus-2-line-height").withDefault("16px"),Ol=ul("type-ramp-plus-1-font-size").withDefault("16px"),Ll=ul("type-ramp-plus-1-line-height").withDefault("24px"),Fl=ul("type-ramp-plus-2-font-size").withDefault("20px"),Ml=ul("type-ramp-plus-2-line-height").withDefault("28px"),Rl=ul("type-ramp-plus-3-font-size").withDefault("28px"),Dl=ul("type-ramp-plus-3-line-height").withDefault("36px"),zl=ul("type-ramp-plus-4-font-size").withDefault("34px"),Pl=ul("type-ramp-plus-4-line-height").withDefault("44px"),Nl=ul("type-ramp-plus-5-font-size").withDefault("46px"),Hl=ul("type-ramp-plus-5-line-height").withDefault("56px"),Bl=ul("type-ramp-plus-6-font-size").withDefault("60px"),Vl=ul("type-ramp-plus-6-line-height").withDefault("72px"),jl=pl("accent-fill-rest-delta").withDefault(0),Ul=pl("accent-fill-hover-delta").withDefault(4),Wl=pl("accent-fill-active-delta").withDefault(-5),ql=pl("accent-fill-focus-delta").withDefault(0),Gl=pl("accent-foreground-rest-delta").withDefault(0),Xl=pl("accent-foreground-hover-delta").withDefault(6),Kl=pl("accent-foreground-active-delta").withDefault(-4),Zl=pl("accent-foreground-focus-delta").withDefault(0),Yl=pl("neutral-fill-rest-delta").withDefault(7),Ql=pl("neutral-fill-hover-delta").withDefault(10),Jl=pl("neutral-fill-active-delta").withDefault(5),ed=pl("neutral-fill-focus-delta").withDefault(0),td=pl("neutral-fill-input-rest-delta").withDefault(0),id=pl("neutral-fill-input-hover-delta").withDefault(0),od=pl("neutral-fill-input-active-delta").withDefault(0),rd=pl("neutral-fill-input-focus-delta").withDefault(0),nd=pl("neutral-fill-stealth-rest-delta").withDefault(0),sd=pl("neutral-fill-stealth-hover-delta").withDefault(5),ad=pl("neutral-fill-stealth-active-delta").withDefault(3),ld=pl("neutral-fill-stealth-focus-delta").withDefault(0),dd=pl("neutral-fill-strong-rest-delta").withDefault(0),cd=pl("neutral-fill-strong-hover-delta").withDefault(8),hd=pl("neutral-fill-strong-active-delta").withDefault(-5),ud=pl("neutral-fill-strong-focus-delta").withDefault(0),pd=pl("neutral-fill-layer-rest-delta").withDefault(3),md=pl("neutral-stroke-rest-delta").withDefault(25),fd=pl("neutral-stroke-hover-delta").withDefault(40),gd=pl("neutral-stroke-active-delta").withDefault(16),vd=pl("neutral-stroke-focus-delta").withDefault(25),bd=pl("neutral-stroke-divider-rest-delta").withDefault(8),yd=ul("neutral-color").withDefault(ll),xd=pl("neutral-palette").withDefault((e=>rl.from(yd.getValueFor(e)))),wd=ul("accent-color").withDefault(dl),kd=pl("accent-palette").withDefault((e=>rl.from(wd.getValueFor(e)))),Cd=pl("neutral-layer-card-container-recipe").withDefault({evaluate:e=>{return t=xd.getValueFor(e),i=vl.getValueFor(e),o=pd.getValueFor(e),t.get(t.closestIndexOf(cl(i))+o);var t,i,o}});ul("neutral-layer-card-container").withDefault((e=>Cd.getValueFor(e).evaluate(e)));const $d=pl("neutral-layer-floating-recipe").withDefault({evaluate:e=>function(e,t,i){const o=e.closestIndexOf(cl(t))-i;return e.get(o-i)}(xd.getValueFor(e),vl.getValueFor(e),pd.getValueFor(e))}),_d=ul("neutral-layer-floating").withDefault((e=>$d.getValueFor(e).evaluate(e))),Sd=pl("neutral-layer-1-recipe").withDefault({evaluate:e=>function(e,t){return e.get(e.closestIndexOf(cl(t)))}(xd.getValueFor(e),vl.getValueFor(e))}),Td=ul("neutral-layer-1").withDefault((e=>Sd.getValueFor(e).evaluate(e))),Ed=pl("neutral-layer-2-recipe").withDefault({evaluate:e=>{return t=xd.getValueFor(e),i=vl.getValueFor(e),o=pd.getValueFor(e),r=Yl.getValueFor(e),n=Ql.getValueFor(e),s=Jl.getValueFor(e),t.get(hl(t,i,o,r,n,s));var t,i,o,r,n,s}});ul("neutral-layer-2").withDefault((e=>Ed.getValueFor(e).evaluate(e)));const Ad=pl("neutral-layer-3-recipe").withDefault({evaluate:e=>{return t=xd.getValueFor(e),i=vl.getValueFor(e),o=pd.getValueFor(e),r=Yl.getValueFor(e),n=Ql.getValueFor(e),s=Jl.getValueFor(e),t.get(hl(t,i,o,r,n,s)+o);var t,i,o,r,n,s}});ul("neutral-layer-3").withDefault((e=>Ad.getValueFor(e).evaluate(e)));const Id=pl("neutral-layer-4-recipe").withDefault({evaluate:e=>{return t=xd.getValueFor(e),i=vl.getValueFor(e),o=pd.getValueFor(e),r=Yl.getValueFor(e),n=Ql.getValueFor(e),s=Jl.getValueFor(e),t.get(hl(t,i,o,r,n,s)+2*o);var t,i,o,r,n,s}});ul("neutral-layer-4").withDefault((e=>Id.getValueFor(e).evaluate(e)));const Od=ul("fill-color").withDefault((e=>Td.getValueFor(e)));var Ld;!function(e){e[e.normal=4.5]="normal",e[e.large=7]="large"}(Ld||(Ld={}));const Fd=ul({name:"accent-fill-recipe",cssCustomPropertyName:null}).withDefault({evaluate:(e,t)=>function(e,t,i,o,r,n,s,a,l){const d=e.source,c=t.closestIndexOf(i)>=Math.max(s,a,l)?-1:1,h=e.closestIndexOf(d),u=h+-1*c*o,p=u+c*r,m=u+c*n;return{rest:e.get(u),hover:e.get(h),active:e.get(p),focus:e.get(m)}}(kd.getValueFor(e),xd.getValueFor(e),t||Od.getValueFor(e),Ul.getValueFor(e),Wl.getValueFor(e),ql.getValueFor(e),Yl.getValueFor(e),Ql.getValueFor(e),Jl.getValueFor(e))}),Md=ul("accent-fill-rest").withDefault((e=>Fd.getValueFor(e).evaluate(e).rest)),Rd=ul("accent-fill-hover").withDefault((e=>Fd.getValueFor(e).evaluate(e).hover)),Dd=ul("accent-fill-active").withDefault((e=>Fd.getValueFor(e).evaluate(e).active)),zd=ul("accent-fill-focus").withDefault((e=>Fd.getValueFor(e).evaluate(e).focus)),Pd=e=>(t,i)=>function(e,t){return e.contrast(sl)>=t?sl:al}(i||Md.getValueFor(t),e),Nd=pl("foreground-on-accent-recipe").withDefault({evaluate:(e,t)=>Pd(Ld.normal)(e,t)}),Hd=ul("foreground-on-accent-rest").withDefault((e=>Nd.getValueFor(e).evaluate(e,Md.getValueFor(e)))),Bd=ul("foreground-on-accent-hover").withDefault((e=>Nd.getValueFor(e).evaluate(e,Rd.getValueFor(e)))),Vd=ul("foreground-on-accent-active").withDefault((e=>Nd.getValueFor(e).evaluate(e,Dd.getValueFor(e)))),jd=ul("foreground-on-accent-focus").withDefault((e=>Nd.getValueFor(e).evaluate(e,zd.getValueFor(e)))),Ud=pl("foreground-on-accent-large-recipe").withDefault({evaluate:(e,t)=>Pd(Ld.large)(e,t)});ul("foreground-on-accent-rest-large").withDefault((e=>Ud.getValueFor(e).evaluate(e,Md.getValueFor(e)))),ul("foreground-on-accent-hover-large").withDefault((e=>Ud.getValueFor(e).evaluate(e,Rd.getValueFor(e)))),ul("foreground-on-accent-active-large").withDefault((e=>Ud.getValueFor(e).evaluate(e,Dd.getValueFor(e)))),ul("foreground-on-accent-focus-large").withDefault((e=>Ud.getValueFor(e).evaluate(e,zd.getValueFor(e))));const Wd=e=>(t,i)=>function(e,t,i,o,r,n,s){const a=e.source,l=e.closestIndexOf(a),d=ol(t),c=l+(1===d?Math.min(o,r):Math.max(d*o,d*r)),h=e.colorContrast(t,i,c,d),u=e.closestIndexOf(h),p=u+d*Math.abs(o-r);let m,f;return(1===d?o<r:d*o>d*r)?(m=u,f=p):(m=p,f=u),{rest:e.get(m),hover:e.get(f),active:e.get(m+d*n),focus:e.get(m+d*s)}}(kd.getValueFor(t),i||Od.getValueFor(t),e,Gl.getValueFor(t),Xl.getValueFor(t),Kl.getValueFor(t),Zl.getValueFor(t)),qd=ul({name:"accent-foreground-recipe",cssCustomPropertyName:null}).withDefault({evaluate:(e,t)=>Wd(Ld.normal)(e,t)}),Gd=ul("accent-foreground-rest").withDefault((e=>qd.getValueFor(e).evaluate(e).rest)),Xd=ul("accent-foreground-hover").withDefault((e=>qd.getValueFor(e).evaluate(e).hover)),Kd=ul("accent-foreground-active").withDefault((e=>qd.getValueFor(e).evaluate(e).active));ul("accent-foreground-focus").withDefault((e=>qd.getValueFor(e).evaluate(e).focus));const Zd=ul({name:"neutral-fill-recipe",cssCustomPropertyName:null}).withDefault({evaluate:(e,t)=>function(e,t,i,o,r,n){const s=e.closestIndexOf(t),a=s>=Math.max(i,o,r,n)?-1:1;return{rest:e.get(s+a*i),hover:e.get(s+a*o),active:e.get(s+a*r),focus:e.get(s+a*n)}}(xd.getValueFor(e),t||Od.getValueFor(e),Yl.getValueFor(e),Ql.getValueFor(e),Jl.getValueFor(e),ed.getValueFor(e))}),Yd=ul("neutral-fill-rest").withDefault((e=>Zd.getValueFor(e).evaluate(e).rest)),Qd=ul("neutral-fill-hover").withDefault((e=>Zd.getValueFor(e).evaluate(e).hover)),Jd=ul("neutral-fill-active").withDefault((e=>Zd.getValueFor(e).evaluate(e).active));ul("neutral-fill-focus").withDefault((e=>Zd.getValueFor(e).evaluate(e).focus));const ec=ul({name:"neutral-fill-input-recipe",cssCustomPropertyName:null}).withDefault({evaluate:(e,t)=>function(e,t,i,o,r,n){const s=ol(t),a=e.closestIndexOf(t);return{rest:e.get(a-s*i),hover:e.get(a-s*o),active:e.get(a-s*r),focus:e.get(a-s*n)}}(xd.getValueFor(e),t||Od.getValueFor(e),td.getValueFor(e),id.getValueFor(e),od.getValueFor(e),rd.getValueFor(e))}),tc=ul("neutral-fill-input-rest").withDefault((e=>ec.getValueFor(e).evaluate(e).rest)),ic=ul("neutral-fill-input-hover").withDefault((e=>ec.getValueFor(e).evaluate(e).hover)),oc=ul("neutral-fill-input-active").withDefault((e=>ec.getValueFor(e).evaluate(e).active));ul("neutral-fill-input-focus").withDefault((e=>ec.getValueFor(e).evaluate(e).focus));const rc=ul({name:"neutral-fill-stealth-recipe",cssCustomPropertyName:null}).withDefault({evaluate:(e,t)=>function(e,t,i,o,r,n,s,a,l,d){const c=Math.max(i,o,r,n,s,a,l,d),h=e.closestIndexOf(t),u=h>=c?-1:1;return{rest:e.get(h+u*i),hover:e.get(h+u*o),active:e.get(h+u*r),focus:e.get(h+u*n)}}(xd.getValueFor(e),t||Od.getValueFor(e),nd.getValueFor(e),sd.getValueFor(e),ad.getValueFor(e),ld.getValueFor(e),Yl.getValueFor(e),Ql.getValueFor(e),Jl.getValueFor(e),ed.getValueFor(e))}),nc=ul("neutral-fill-stealth-rest").withDefault((e=>rc.getValueFor(e).evaluate(e).rest)),sc=ul("neutral-fill-stealth-hover").withDefault((e=>rc.getValueFor(e).evaluate(e).hover)),ac=ul("neutral-fill-stealth-active").withDefault((e=>rc.getValueFor(e).evaluate(e).active)),lc=ul("neutral-fill-stealth-focus").withDefault((e=>rc.getValueFor(e).evaluate(e).focus)),dc=ul({name:"neutral-fill-strong-recipe",cssCustomPropertyName:null}).withDefault({evaluate:(e,t)=>function(e,t,i,o,r,n){const s=ol(t),a=e.closestIndexOf(e.colorContrast(t,4.5)),l=a+s*Math.abs(i-o);let d,c;return(1===s?i<o:s*i>s*o)?(d=a,c=l):(d=l,c=a),{rest:e.get(d),hover:e.get(c),active:e.get(d+s*r),focus:e.get(d+s*n)}}(xd.getValueFor(e),t||Od.getValueFor(e),dd.getValueFor(e),cd.getValueFor(e),hd.getValueFor(e),ud.getValueFor(e))});ul("neutral-fill-strong-rest").withDefault((e=>dc.getValueFor(e).evaluate(e).rest)),ul("neutral-fill-strong-hover").withDefault((e=>dc.getValueFor(e).evaluate(e).hover)),ul("neutral-fill-strong-active").withDefault((e=>dc.getValueFor(e).evaluate(e).active)),ul("neutral-fill-strong-focus").withDefault((e=>dc.getValueFor(e).evaluate(e).focus));const cc=pl("neutral-fill-layer-recipe").withDefault({evaluate:(e,t)=>function(e,t,i){const o=e.closestIndexOf(t);return e.get(o-(o<i?-1*i:i))}(xd.getValueFor(e),t||Od.getValueFor(e),pd.getValueFor(e))});ul("neutral-fill-layer-rest").withDefault((e=>cc.getValueFor(e).evaluate(e)));const hc=pl("focus-stroke-outer-recipe").withDefault({evaluate:e=>{return t=xd.getValueFor(e),i=Od.getValueFor(e),t.colorContrast(i,3.5);var t,i}}),uc=ul("focus-stroke-outer").withDefault((e=>hc.getValueFor(e).evaluate(e))),pc=pl("focus-stroke-inner-recipe").withDefault({evaluate:e=>{return t=kd.getValueFor(e),i=Od.getValueFor(e),o=uc.getValueFor(e),t.colorContrast(o,3.5,t.closestIndexOf(t.source),-1*ol(i));var t,i,o}}),mc=ul("focus-stroke-inner").withDefault((e=>pc.getValueFor(e).evaluate(e))),fc=pl("neutral-foreground-hint-recipe").withDefault({evaluate:e=>{return t=xd.getValueFor(e),i=Od.getValueFor(e),t.colorContrast(i,4.5);var t,i}}),gc=ul("neutral-foreground-hint").withDefault((e=>fc.getValueFor(e).evaluate(e))),vc=pl("neutral-foreground-recipe").withDefault({evaluate:e=>{return t=xd.getValueFor(e),i=Od.getValueFor(e),t.colorContrast(i,14);var t,i}}),bc=ul("neutral-foreground-rest").withDefault((e=>vc.getValueFor(e).evaluate(e))),yc=ul({name:"neutral-stroke-recipe",cssCustomPropertyName:null}).withDefault({evaluate:e=>function(e,t,i,o,r,n){const s=e.closestIndexOf(t),a=ol(t),l=s+a*i,d=l+a*(o-i),c=l+a*(r-i),h=l+a*(n-i);return{rest:e.get(l),hover:e.get(d),active:e.get(c),focus:e.get(h)}}(xd.getValueFor(e),Od.getValueFor(e),md.getValueFor(e),fd.getValueFor(e),gd.getValueFor(e),vd.getValueFor(e))}),xc=ul("neutral-stroke-rest").withDefault((e=>yc.getValueFor(e).evaluate(e).rest)),wc=ul("neutral-stroke-hover").withDefault((e=>yc.getValueFor(e).evaluate(e).hover)),kc=ul("neutral-stroke-active").withDefault((e=>yc.getValueFor(e).evaluate(e).active)),Cc=ul("neutral-stroke-focus").withDefault((e=>yc.getValueFor(e).evaluate(e).focus)),$c=pl("neutral-stroke-divider-recipe").withDefault({evaluate:(e,t)=>function(e,t,i){return e.get(e.closestIndexOf(t)+ol(t)*i)}(xd.getValueFor(e),t||Od.getValueFor(e),bd.getValueFor(e))}),_c=ul("neutral-stroke-divider-rest").withDefault((e=>$c.getValueFor(e).evaluate(e))),Sc=sn.create({name:"height-number",cssCustomPropertyName:null}).withDefault((e=>(fl.getValueFor(e)+yl.getValueFor(e))*xl.getValueFor(e))),Tc=Jt`(${fl} + ${yl}) * ${xl}`,Ec=(go.compose({baseName:"accordion-item",template:(e,t)=>Tt`
    <template class="${e=>e.expanded?"expanded":""}">
        <div
            class="heading"
            part="heading"
            role="heading"
            aria-level="${e=>e.headinglevel}"
        >
            <button
                class="button"
                part="button"
                ${di("expandbutton")}
                aria-expanded="${e=>e.expanded}"
                aria-controls="${e=>e.id}-panel"
                id="${e=>e.id}"
                @click="${(e,t)=>e.clickHandler(t.event)}"
            >
                <span class="heading-content" part="heading-content">
                    <slot name="heading"></slot>
                </span>
            </button>
            ${_i(0,t)}
            ${$i(0,t)}
            <span class="icon" part="icon" aria-hidden="true">
                <slot name="expanded-icon" part="expanded-icon">
                    ${t.expandedIcon||""}
                </slot>
                <slot name="collapsed-icon" part="collapsed-icon">
                    ${t.collapsedIcon||""}
                </slot>
            <span>
        </div>
        <div
            class="region"
            part="region"
            id="${e=>e.id}-panel"
            role="region"
            aria-labelledby="${e=>e.id}"
        >
            <slot></slot>
        </div>
    </template>
`,styles:(e,t)=>Yt`
        ${ca("flex")} :host {
            box-sizing: border-box;
            font-family: ${ml};
            flex-direction: column;
            font-size: ${Tl};
            line-height: ${El};
            border-bottom: calc(${Cl} * 1px) solid ${_c};
        }

        .region {
            display: none;
            padding: calc((6 + (${xl} * 2 * ${yl})) * 1px);
        }

        .heading {
            display: grid;
            position: relative;
            grid-template-columns: auto 1fr auto calc(${Tc} * 1px);
        }

        .button {
            appearance: none;
            border: none;
            background: none;
            grid-column: 2;
            grid-row: 1;
            outline: none;
            padding: 0 calc((6 + (${xl} * 2 * ${yl})) * 1px);
            text-align: left;
            height: calc(${Tc} * 1px);
            color: ${bc};
            cursor: pointer;
            font-family: inherit;
        }

        .button:hover {
            color: ${bc};
        }

        .button:active {
            color: ${bc};
        }

        .button::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            cursor: pointer;
        }

        .button:${ha}::before {
            outline: none;
            border: calc(${$l} * 1px) solid ${uc};
            border-radius: calc(${bl} * 1px);
        }

        :host([expanded]) .region {
            display: block;
        }

        .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            grid-column: 4;
            pointer-events: none;
            position: relative;
        }

        slot[name="expanded-icon"],
        slot[name="collapsed-icon"] {
            fill: ${Gd};
        }

        slot[name="collapsed-icon"] {
            display: flex;
        }

        :host([expanded]) slot[name="collapsed-icon"] {
            display: none;
        }

        slot[name="expanded-icon"] {
            display: none;
        }

        :host([expanded]) slot[name="expanded-icon"] {
            display: flex;
        }

        .start {
            display: flex;
            align-items: center;
            padding-inline-start: calc(${xl} * 1px);
            justify-content: center;
            grid-column: 1;
            position: relative;
        }

        .end {
            display: flex;
            align-items: center;
            justify-content: center;
            grid-column: 3;
            position: relative;
        }
    `.withBehaviors(la(Yt`
            .button:${ha}::before {
                border-color: ${Ao.Highlight};
            }
            :host slot[name="collapsed-icon"],
            :host([expanded]) slot[name="expanded-icon"] {
                fill: ${Ao.ButtonText};
            }
        `)),collapsedIcon:'\n        <svg\n            width="20"\n            height="20"\n            viewBox="0 0 20 20"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n                fill-rule="evenodd"\n                clip-rule="evenodd"\n                d="M16.22 3H3.78a.78.78 0 00-.78.78v12.44c0 .43.35.78.78.78h12.44c.43 0 .78-.35.78-.78V3.78a.78.78 0 00-.78-.78zM3.78 2h12.44C17.2 2 18 2.8 18 3.78v12.44c0 .98-.8 1.78-1.78 1.78H3.78C2.8 18 2 17.2 2 16.22V3.78C2 2.8 2.8 2 3.78 2zM11 9h3v2h-3v3H9v-3H6V9h3V6h2v3z"\n            />\n        </svg>\n    ',expandedIcon:'\n        <svg\n            width="20"\n            height="20"\n            viewBox="0 0 20 20"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n                fill-rule="evenodd"\n                clip-rule="evenodd"\n                d="M3.78 3h12.44c.43 0 .78.35.78.78v12.44c0 .43-.35.78-.78.78H3.78a.78.78 0 01-.78-.78V3.78c0-.43.35-.78.78-.78zm12.44-1H3.78C2.8 2 2 2.8 2 3.78v12.44C2 17.2 2.8 18 3.78 18h12.44c.98 0 1.78-.8 1.78-1.78V3.78C18 2.8 17.2 2 16.22 2zM14 9H6v2h8V9z"\n            />\n        </svg>\n    '}),Lo.compose({baseName:"accordion",template:(e,t)=>Tt`
    <template>
        <slot ${xi({property:"accordionItems",filter:vi()})}></slot>
        <slot name="item" part="item" ${xi("accordionItems")}></slot>
    </template>
`,styles:(e,t)=>Yt`
        ${ca("flex")} :host {
            box-sizing: border-box;
            flex-direction: column;
            font-family: ${ml};
            font-size: ${Tl};
            line-height: ${El};
            color: ${bc};
            border-top: calc(${Cl} * 1px) solid ${_c};
        }
    `}),"box-shadow: 0 0 calc((var(--elevation) * 0.225px) + 2px) rgba(0, 0, 0, calc(.11 * (2 - var(--background-luminance, 1)))), 0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px)) rgba(0, 0, 0, calc(.13 * (2 - var(--background-luminance, 1))));"),Ac=Yt`
    ${ca("inline-flex")} :host {
        font-family: ${ml};
        outline: none;
        font-size: ${_l};
        line-height: ${Sl};
        height: calc(${Tc} * 1px);
        min-width: calc(${Tc} * 1px);
        background-color: ${Yd};
        color: ${bc};
        border-radius: calc(${bl} * 1px);
        fill: currentcolor;
        cursor: pointer;
    }

    .control {
        background: transparent;
        height: inherit;
        flex-grow: 1;
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: baseline;
        padding: 0 calc((10 + (${xl} * 2 * ${yl})) * 1px);
        white-space: nowrap;
        outline: none;
        text-decoration: none;
        border: calc(${Cl} * 1px) solid transparent;
        color: inherit;
        border-radius: inherit;
        fill: inherit;
        cursor: inherit;
        font-weight: inherit;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    :host(:hover) {
        background-color: ${Qd};
    }

    :host(:active) {
        background-color: ${Jd};
    }

    .control:${ha} {
        border-color: ${uc};
        box-shadow: 0 0 0 calc((${$l} - ${Cl}) * 1px) ${uc} inset;
    }

    .control::-moz-focus-inner {
        border: 0;
    }

    .start,
    .content,
    .end {
        align-self: center;
    }

    .start,
    .end {
        display: flex;
    }

    .control.icon-only {
        padding: 0;
        line-height: 0;
    }

    ::slotted(svg) {
        ${""} width: 16px;
        height: 16px;
        pointer-events: none;
    }

    .start {
        margin-inline-end: 11px;
    }

    .end {
        margin-inline-start: 11px;
    }
`.withBehaviors(la(Yt`
            :host .control {
              background-color: ${Ao.ButtonFace};
              border-color: ${Ao.ButtonText};
              color: ${Ao.ButtonText};
              fill: currentColor;
            }

            :host(:hover) .control {
              forced-color-adjust: none;
              background-color: ${Ao.Highlight};
              color: ${Ao.HighlightText};
            }

            .control:${ha} {
              forced-color-adjust: none;
              background-color: ${Ao.Highlight};
              border-color: ${Ao.ButtonText};
              box-shadow: 0 0 0 calc((${$l} - ${Cl}) * 1px) ${Ao.ButtonText} inset;
              color: ${Ao.HighlightText};
            }

            .control:hover,
            :host([appearance="outline"]) .control:hover {
              border-color: ${Ao.ButtonText};
            }

            :host([href]) .control {
                border-color: ${Ao.LinkText};
                color: ${Ao.LinkText};
            }

            :host([href]) .control:hover,
            :host([href]) .control:${ha}{
              forced-color-adjust: none;
              background: ${Ao.ButtonFace};
              border-color: ${Ao.LinkText};
              box-shadow: 0 0 0 1px ${Ao.LinkText} inset;
              color: ${Ao.LinkText};
              fill: currentColor;
            }
        `)),Ic=Yt`
    :host([appearance="accent"]) {
        background: ${Md};
        color: ${Hd};
    }

    :host([appearance="accent"]:hover) {
        background: ${Rd};
        color: ${Bd};
    }

    :host([appearance="accent"]:active) .control:active {
        background: ${Dd};
        color: ${Vd};
    }

    :host([appearance="accent"]) .control:${ha} {
        box-shadow: 0 0 0 calc((${$l} - ${Cl}) * 1px) ${uc} inset,
            0 0 0 calc((${$l} + ${Cl}) * 1px) ${mc} inset;
    }
`.withBehaviors(la(Yt`
            :host([appearance="accent"]) .control {
                forced-color-adjust: none;
                background: ${Ao.Highlight};
                color: ${Ao.HighlightText};
            }

            :host([appearance="accent"]) .control:hover,
            :host([appearance="accent"]:active) .control:active {
                background: ${Ao.HighlightText};
                border-color: ${Ao.Highlight};
                color: ${Ao.Highlight};
            }

            :host([appearance="accent"]) .control:${ha} {
                border-color: ${Ao.Highlight};
                box-shadow: 0 0 0 calc(${$l} * 1px) ${Ao.HighlightText} inset;
            }

            :host([appearance="accent"][href]) .control{
                background: ${Ao.LinkText};
                color: ${Ao.HighlightText};
            }

            :host([appearance="accent"][href]) .control:hover {
                background: ${Ao.ButtonFace};
                border-color: ${Ao.LinkText};
                box-shadow: none;
                color: ${Ao.LinkText};
                fill: currentColor;
            }

            :host([appearance="accent"][href]) .control:${ha} {
                border-color: ${Ao.LinkText};
                box-shadow: 0 0 0 calc(${$l} * 1px) ${Ao.HighlightText} inset;
            }
        `)),Oc=Yt`
    :host([appearance="hypertext"]) {
        font-size: inherit;
        line-height: inherit;
        height: auto;
        min-width: 0;
        background: transparent;
    }

    :host([appearance="hypertext"]) .control {
        display: inline;
        padding: 0;
        border: none;
        box-shadow: none;
        border-radius: 0;
        line-height: 1;
    }

    :host a.control:not(:link) {
        background-color: transparent;
        cursor: default;
    }
    :host([appearance="hypertext"]) .control:link,
    :host([appearance="hypertext"]) .control:visited {
        background: transparent;
        color: ${Gd};
        border-bottom: calc(${Cl} * 1px) solid ${Gd};
    }

    :host([appearance="hypertext"]:hover),
    :host([appearance="hypertext"]) .control:hover {
        background: transparent;
        border-bottom-color: ${Xd};
    }

    :host([appearance="hypertext"]:active),
    :host([appearance="hypertext"]) .control:active {
        background: transparent;
        border-bottom-color: ${Kd};
    }

    :host([appearance="hypertext"]) .control:${ha} {
        border-bottom: calc(${$l} * 1px) solid ${uc};
        margin-bottom: calc(calc(${Cl} - ${$l}) * 1px);
    }
`.withBehaviors(la(Yt`
            :host([appearance="hypertext"]:hover) {
                background-color: ${Ao.ButtonFace};
                color: ${Ao.ButtonText};
            }
            :host([appearance="hypertext"][href]) .control:hover,
            :host([appearance="hypertext"][href]) .control:active,
            :host([appearance="hypertext"][href]) .control:${ha} {
                color: ${Ao.LinkText};
                border-bottom-color: ${Ao.LinkText};
                box-shadow: none;
            }
        `)),Lc=Yt`
    :host([appearance="lightweight"]) {
        background: transparent;
        color: ${Gd};
    }

    :host([appearance="lightweight"]) .control {
        padding: 0;
        height: initial;
        border: none;
        box-shadow: none;
        border-radius: 0;
    }

    :host([appearance="lightweight"]:hover) {
        background: transparent;
        color: ${Xd};
    }

    :host([appearance="lightweight"]:active) {
        background: transparent;
        color: ${Kd};
    }

    :host([appearance="lightweight"]) .content {
        position: relative;
    }

    :host([appearance="lightweight"]) .content::before {
        content: "";
        display: block;
        height: calc(${Cl} * 1px);
        position: absolute;
        top: calc(1em + 4px);
        width: 100%;
    }

    :host([appearance="lightweight"]:hover) .content::before {
        background: ${Xd};
    }

    :host([appearance="lightweight"]:active) .content::before {
        background: ${Kd};
    }

    :host([appearance="lightweight"]) .control:${ha} .content::before {
        background: ${bc};
        height: calc(${$l} * 1px);
    }
`.withBehaviors(la(Yt`
            :host([appearance="lightweight"]) .control:hover,
            :host([appearance="lightweight"]) .control:${ha} {
                forced-color-adjust: none;
                background: ${Ao.ButtonFace};
                color: ${Ao.Highlight};
            }
            :host([appearance="lightweight"]) .control:hover .content::before,
            :host([appearance="lightweight"]) .control:${ha} .content::before {
                background: ${Ao.Highlight};
            }

            :host([appearance="lightweight"][href]) .control:hover,
            :host([appearance="lightweight"][href]) .control:${ha} {
                background: ${Ao.ButtonFace};
                box-shadow: none;
                color: ${Ao.LinkText};
            }

            :host([appearance="lightweight"][href]) .control:hover .content::before,
            :host([appearance="lightweight"][href]) .control:${ha} .content::before {
                background: ${Ao.LinkText};
            }
        `)),Fc=Yt`
    :host([appearance="outline"]) {
        background: transparent;
        border-color: ${Md};
    }

    :host([appearance="outline"]:hover) {
        border-color: ${Rd};
    }

    :host([appearance="outline"]:active) {
        border-color: ${Dd};
    }

    :host([appearance="outline"]) .control {
        border-color: inherit;
    }

    :host([appearance="outline"]) .control:${ha} {
        box-shadow: 0 0 0 calc((${$l} - ${Cl}) * 1px) ${uc} inset;
        border-color: ${uc};
    }
`.withBehaviors(la(Yt`
            :host([appearance="outline"]) .control {
                border-color: ${Ao.ButtonText};
            }
            :host([appearance="outline"]) .control:${ha} {
              forced-color-adjust: none;
              background-color: ${Ao.Highlight};
              border-color: ${Ao.ButtonText};
              box-shadow: 0 0 0 calc((${$l} - ${Cl}) * 1px) ${Ao.ButtonText} inset;
              color: ${Ao.HighlightText};
              fill: currentColor;
            }
            :host([appearance="outline"][href]) .control {
                background: ${Ao.ButtonFace};
                border-color: ${Ao.LinkText};
                color: ${Ao.LinkText};
                fill: currentColor;
            }
            :host([appearance="outline"][href]) .control:hover,
            :host([appearance="outline"][href]) .control:${ha} {
              forced-color-adjust: none;
              border-color: ${Ao.LinkText};
              box-shadow: 0 0 0 1px ${Ao.LinkText} inset;
            }
        `)),Mc=Yt`
    :host([appearance="stealth"]) {
        background: ${nc};
    }

    :host([appearance="stealth"]:hover) {
        background: ${sc};
    }

    :host([appearance="stealth"]:active) {
        background: ${ac};
    }
`.withBehaviors(la(Yt`
            :host([appearance="stealth"]),
            :host([appearance="stealth"]) .control {
                forced-color-adjust: none;
                background: ${Ao.ButtonFace};
                border-color: transparent;
                color: ${Ao.ButtonText};
                fill: currentColor;
            }

            :host([appearance="stealth"]:hover) .control {
                background: ${Ao.Highlight};
                border-color: ${Ao.Highlight};
                color: ${Ao.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"]:${ha}) .control {
                background: ${Ao.Highlight};
                box-shadow: 0 0 0 1px ${Ao.Highlight};
                color: ${Ao.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"][href]) .control {
                color: ${Ao.LinkText};
            }

            :host([appearance="stealth"][href]:hover) .control,
            :host([appearance="stealth"][href]:${ha}) .control {
                background: ${Ao.LinkText};
                border-color: ${Ao.LinkText};
                color: ${Ao.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"][href]:${ha}) .control {
                forced-color-adjust: none;
                box-shadow: 0 0 0 1px ${Ao.LinkText};
            }
        `));class Rc{constructor(e,t){this.cache=new WeakMap,this.ltr=e,this.rtl=t}bind(e){this.attach(e)}unbind(e){const t=this.cache.get(e);t&&wl.unsubscribe(t)}attach(e){const t=this.cache.get(e)||new Dc(this.ltr,this.rtl,e),i=wl.getValueFor(e);wl.subscribe(t),t.attach(i),this.cache.set(e,t)}}class Dc{constructor(e,t,i){this.ltr=e,this.rtl=t,this.source=i,this.attached=null}handleChange({target:e,token:t}){this.attach(t.getValueFor(e))}attach(e){this.attached!==this[e]&&(null!==this.attached&&this.source.$fastController.removeStyles(this.attached),this.attached=this[e],null!==this.attached&&this.source.$fastController.addStyles(this.attached))}}function zc(e,t){return new da("appearance",e,t)}class Pc extends Ro{appearanceChanged(e,t){this.$fastController.isConnected&&(this.classList.remove(e),this.classList.add(t))}connectedCallback(){super.connectedCallback(),this.appearance||(this.appearance="neutral")}defaultSlottedContentChanged(e,t){const i=this.defaultSlottedContent.filter((e=>e.nodeType===Node.ELEMENT_NODE));1===i.length&&i[0]instanceof SVGElement?this.control.classList.add("icon-only"):this.control.classList.remove("icon-only")}}Ei([Pt],Pc.prototype,"appearance",void 0);Pc.compose({baseName:"anchor",baseClass:Ro,template:Fo,styles:(e,t)=>Yt`
        ${Ac}
    `.withBehaviors(zc("accent",Ic),zc("hypertext",Oc),zc("lightweight",Lc),zc("outline",Fc),zc("stealth",Mc)),shadowOptions:{delegatesFocus:!0}}),Po.compose({baseName:"anchored-region",template:(e,t)=>Tt`
    <template class="${e=>e.initialLayoutComplete?"loaded":""}">
        ${ci((e=>e.initialLayoutComplete),Tt`
                <slot></slot>
            `)}
    </template>
`,styles:(e,t)=>Yt`
    :host {
        contain: layout;
        display: block;
    }
`});const Nc=(e,t)=>Yt`
        ${ca("flex")} :host {
            position: relative;
            height: var(--avatar-size, var(--avatar-size-default));
            max-width: var(--avatar-size, var(--avatar-size-default));
            --avatar-size-default: calc(
                (
                        (${fl} + ${yl}) * ${xl} +
                            ((${xl} * 8) - 40)
                    ) * 1px
            );
            --avatar-text-size: ${_l};
            --avatar-text-ratio: ${xl};
        }

        .link {
            text-decoration: none;
            color: ${bc};
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            min-width: 100%;
        }

        .square {
            border-radius: calc(${bl} * 1px);
            min-width: 100%;
            overflow: hidden;
        }

        .circle {
            border-radius: 100%;
            min-width: 100%;
            overflow: hidden;
        }

        .backplate {
            position: relative;
            display: flex;
        }

        .media,
        ::slotted(img) {
            max-width: 100%;
            position: absolute;
            display: block;
        }

        .content {
            font-size: calc(
                (var(--avatar-text-size) + var(--avatar-size, var(--avatar-size-default))) /
                    var(--avatar-text-ratio)
            );
            line-height: var(--avatar-size, var(--avatar-size-default));
            display: block;
            min-height: var(--avatar-size, var(--avatar-size-default));
        }

        ::slotted(${e.tagFor(Go)}) {
            position: absolute;
            display: block;
        }
    `.withBehaviors(new Rc(((e,t)=>Yt`
    ::slotted(${e.tagFor(Go)}) {
        right: 0;
    }
`)(e),((e,t)=>Yt`
    ::slotted(${e.tagFor(Go)}) {
        left: 0;
    }
`)(e)));class Hc extends qo{}Ei([Pt({attribute:"src"})],Hc.prototype,"imgSrc",void 0),Ei([Pt],Hc.prototype,"alt",void 0);const Bc=Tt`
    ${ci((e=>e.imgSrc),Tt`
            <img
                src="${e=>e.imgSrc}"
                alt="${e=>e.alt}"
                slot="media"
                class="media"
                part="media"
            />
        `)}
`,Vc=Hc.compose({baseName:"avatar",baseClass:qo,template:(e,t)=>Tt`
    <div
        class="backplate ${e=>e.shape}"
        part="backplate"
        style="${e=>e.fill?`background-color: var(--avatar-fill-${e.fill});`:void 0}"
    >
        <a
            class="link"
            part="link"
            href="${e=>e.link?e.link:void 0}"
            style="${e=>e.color?`color: var(--avatar-color-${e.color});`:void 0}"
        >
            <slot name="media" part="media">${t.media||""}</slot>
            <slot class="content" part="content"><slot>
        </a>
    </div>
    <slot name="badge" part="badge"></slot>
`,styles:Nc,media:Bc,shadowOptions:{delegatesFocus:!0}});Go.compose({baseName:"badge",template:(e,t)=>Tt`
    <template class="${e=>e.circular?"circular":""}">
        <div class="control" part="control" style="${e=>e.generateBadgeStyle()}">
            <slot></slot>
        </div>
    </template>
`,styles:(e,t)=>Yt`
        ${ca("inline-block")} :host {
            box-sizing: border-box;
            font-family: ${ml};
            font-size: ${Tl};
            line-height: ${El};
        }

        .control {
            border-radius: calc(${bl} * 1px);
            padding: calc(((${xl} * 0.5) - ${Cl}) * 1px)
                calc((${xl} - ${Cl}) * 1px);
            color: ${Gd};
            font-weight: 600;
            border: calc(${Cl} * 1px) solid transparent;
        }

        .control[style] {
            font-weight: 400;
        }

        :host([circular]) .control {
            border-radius: 100px;
            padding: 0 calc(${xl} * 1px);
            height: calc((${Tc} - (${xl} * 3)) * 1px);
            min-width: calc((${Tc} - (${xl} * 3)) * 1px);
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
        }
    `}),Xo.compose({baseName:"breadcrumb-item",template:(e,t)=>Tt`
    <div role="listitem" class="listitem" part="listitem">
        ${ci((e=>e.href&&e.href.length>0),Tt`
                ${Fo(0,t)}
            `)}
        ${ci((e=>!e.href),Tt`
                ${_i(0,t)}
                <slot></slot>
                ${$i(0,t)}
            `)}
        ${ci((e=>e.separator),Tt`
                <span class="separator" part="separator" aria-hidden="true">
                    <slot name="separator">${t.separator||""}</slot>
                </span>
            `)}
    </div>
`,styles:(e,t)=>Yt`
    ${ca("inline-flex")} :host {
        background: transparent;
        box-sizing: border-box;
        font-family: ${ml};
        font-size: ${_l};
        fill: currentColor;
        line-height: ${Sl};
        min-width: calc(${Tc} * 1px);
        outline: none;
        color: ${bc}
    }

    .listitem {
        display: flex;
        align-items: center;
        width: max-content;
    }

    .separator {
        margin: 0 6px;
        display: flex;
    }

    .control {
        align-items: center;
        box-sizing: border-box;
        color: ${Gd};
        cursor: pointer;
        display: flex;
        fill: inherit;
        outline: none;
        text-decoration: none;
        white-space: nowrap;
    }

    .control:hover {
        color: ${Xd};
    }

    .control:active {
        color: ${Kd};
    }

    .control .content {
        position: relative;
    }

    .control .content::before {
        content: "";
        display: block;
        height: calc(${Cl} * 1px);
        left: 0;
        position: absolute;
        right: 0;
        top: calc(1em + 4px);
        width: 100%;
    }

    .control:hover .content::before {
        background: ${Xd};
    }

    .control:active .content::before {
        background: ${Kd};
    }

    .control:${ha} .content::before {
        background: ${bc};
        height: calc(${$l} * 1px);
    }

    .control:not([href]) {
        color: ${bc};
        cursor: default;
    }

    .control:not([href]) .content::before {
        background: none;
    }

    .start,
    .end {
        display: flex;
    }

    ::slotted(svg) {
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
    }

    .start {
        margin-inline-end: 6px;
    }

    .end {
        margin-inline-start: 6px;
    }
`.withBehaviors(la(Yt`
                .control:hover .content::before,
                .control:${ha} .content::before {
                    background: ${Ao.LinkText};
                }
                .start,
                .end {
                    fill: ${Ao.ButtonText};
                }
            `)),separator:"/",shadowOptions:{delegatesFocus:!0}}),Ko.compose({baseName:"breadcrumb",template:(e,t)=>Tt`
    <template role="navigation">
        <div role="list" class="list" part="list">
            <slot
                ${xi({property:"slottedBreadcrumbItems",filter:vi()})}
            ></slot>
        </div>
    </template>
`,styles:(e,t)=>Yt`
    ${ca("inline-block")} :host {
        box-sizing: border-box;
        font-family: ${ml};
        font-size: ${_l};
        line-height: ${Sl};
    }

    .list {
        display: flex;
        flex-wrap: wrap;
    }
`});let jc=class extends ir{constructor(){super(...arguments),this.appearance="neutral"}defaultSlottedContentChanged(e,t){const i=this.defaultSlottedContent.filter((e=>e.nodeType===Node.ELEMENT_NODE));1===i.length&&i[0]instanceof SVGElement?this.control.classList.add("icon-only"):this.control.classList.remove("icon-only")}};Ei([Pt],jc.prototype,"appearance",void 0);jc.compose({baseName:"button",baseClass:ir,template:(e,t)=>Tt`
    <button
        class="control"
        part="control"
        ?autofocus="${e=>e.autofocus}"
        ?disabled="${e=>e.disabled}"
        form="${e=>e.formId}"
        formaction="${e=>e.formaction}"
        formenctype="${e=>e.formenctype}"
        formmethod="${e=>e.formmethod}"
        formnovalidate="${e=>e.formnovalidate}"
        formtarget="${e=>e.formtarget}"
        name="${e=>e.name}"
        type="${e=>e.type}"
        value="${e=>e.value}"
        aria-atomic="${e=>e.ariaAtomic}"
        aria-busy="${e=>e.ariaBusy}"
        aria-controls="${e=>e.ariaControls}"
        aria-current="${e=>e.ariaCurrent}"
        aria-describedby="${e=>e.ariaDescribedby}"
        aria-details="${e=>e.ariaDetails}"
        aria-disabled="${e=>e.ariaDisabled}"
        aria-errormessage="${e=>e.ariaErrormessage}"
        aria-expanded="${e=>e.ariaExpanded}"
        aria-flowto="${e=>e.ariaFlowto}"
        aria-haspopup="${e=>e.ariaHaspopup}"
        aria-hidden="${e=>e.ariaHidden}"
        aria-invalid="${e=>e.ariaInvalid}"
        aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
        aria-label="${e=>e.ariaLabel}"
        aria-labelledby="${e=>e.ariaLabelledby}"
        aria-live="${e=>e.ariaLive}"
        aria-owns="${e=>e.ariaOwns}"
        aria-pressed="${e=>e.ariaPressed}"
        aria-relevant="${e=>e.ariaRelevant}"
        aria-roledescription="${e=>e.ariaRoledescription}"
        ${di("control")}
    >
        ${_i(0,t)}
        <span class="content" part="content">
            <slot ${xi("defaultSlottedContent")}></slot>
        </span>
        ${$i(0,t)}
    </button>
`,styles:(e,t)=>Yt`
        :host([disabled]),
        :host([disabled]:hover),
        :host([disabled]:active) {
            opacity: ${kl};
            background-color: ${Yd};
            cursor: ${"not-allowed"};
        }

        ${Ac}
    `.withBehaviors(la(Yt`
                :host([disabled]),
                :host([disabled]) .control,
                :host([disabled]:hover),
                :host([disabled]:active) {
                    forced-color-adjust: none;
                    background-color: ${Ao.ButtonFace};
                    border-color: ${Ao.GrayText};
                    color: ${Ao.GrayText};
                    cursor: ${"not-allowed"};
                    opacity: 1;
                }
            `),zc("accent",Yt`
                :host([appearance="accent"][disabled]),
                :host([appearance="accent"][disabled]:hover),
                :host([appearance="accent"][disabled]:active) {
                    background: ${Md};
                }

                ${Ic}
            `.withBehaviors(la(Yt`
                        :host([appearance="accent"][disabled]) .control,
                        :host([appearance="accent"][disabled]) .control:hover {
                            background: ${Ao.ButtonFace};
                            border-color: ${Ao.GrayText};
                            color: ${Ao.GrayText};
                        }
                    `))),zc("lightweight",Yt`
                :host([appearance="lightweight"][disabled]:hover),
                :host([appearance="lightweight"][disabled]:active) {
                    background-color: transparent;
                    color: ${Gd};
                }

                :host([appearance="lightweight"][disabled]) .content::before,
                :host([appearance="lightweight"][disabled]:hover) .content::before,
                :host([appearance="lightweight"][disabled]:active) .content::before {
                    background: transparent;
                }

                ${Lc}
            `.withBehaviors(la(Yt`
                        :host([appearance="lightweight"].disabled) .control {
                            forced-color-adjust: none;
                            color: ${Ao.GrayText};
                        }

                        :host([appearance="lightweight"].disabled)
                            .control:hover
                            .content::before {
                            background: none;
                        }
                    `))),zc("outline",Yt`
                :host([appearance="outline"][disabled]),
                :host([appearance="outline"][disabled]:hover),
                :host([appearance="outline"][disabled]:active) {
                    background: transparent;
                    border-color: ${Md};
                }

                ${Fc}
            `.withBehaviors(la(Yt`
                        :host([appearance="outline"][disabled]) .control {
                            border-color: ${Ao.GrayText};
                        }
                    `))),zc("stealth",Yt`
                :host([appearance="stealth"][disabled]),
                :host([appearance="stealth"][disabled]:hover),
                :host([appearance="stealth"][disabled]:active) {
                    background: ${nc};
                }

                ${Mc}
            `.withBehaviors(la(Yt`
                        :host([appearance="stealth"][disabled]) {
                            background: ${Ao.ButtonFace};
                        }

                        :host([appearance="stealth"][disabled]) .control {
                            background: ${Ao.ButtonFace};
                            border-color: transparent;
                            color: ${Ao.GrayText};
                        }
                    `)))),shadowOptions:{delegatesFocus:!0}});const Uc=Yt`
    ${ca("block")} :host {
        --cell-border: none;
        --cell-height: calc(${Tc} * 1px);
        --selected-day-outline: 1px solid ${Kd};
        --selected-day-color: ${Kd};
        --selected-day-background: ${Yd};
        --cell-padding: calc(${xl} * 1px);
        --disabled-day-opacity: ${kl};
        --inactive-day-opacity: ${kl};
        font-family: ${ml};
        font-size: ${_l};
        line-height: ${Sl};
        color: ${bc};
    }

    .title {
        font-size: ${Rl};
        line-height: ${Dl};
        padding: var(--cell-padding);
        text-align: center;
    }

    .week-days,
    .week {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-left: var(--cell-border, none);
        border-bottom: none;
        padding: 0;
    }

    .interact .week {
        grid-gap: calc(${xl} * 1px);
        margin-top: calc(${xl} * 1px);
    }

    .day,
    .week-day {
        border-bottom: var(--cell-border);
        border-right: var(--cell-border);
        padding: var(--cell-padding);
    }

    .week-day {
        text-align: center;
        border-radius: 0;
        border-top: var(--cell-border);
    }

    .day {
        box-sizing: border-box;
        vertical-align: top;
        outline-offset: -1px;
        line-height: var(--cell-line-height);
        white-space: normal;
    }

    .interact .day {
        background: ${Yd};
        cursor: pointer;
    }

    .day.inactive {
        background: var(--inactive-day-background);
        color: var(--inactive-day-color);
        opacity: var(--inactive-day-opacity);
        outline: var(--inactive-day-outline);
    }

    .day.disabled {
        background: var(--disabled-day-background);
        color: var(--disabled-day-color);
        cursor: ${"not-allowed"};
        opacity: var(--disabled-day-opacity);
        outline: var(--disabled-day-outline);
    }

    .day.selected {
        color: var(--selected-day-color);
        background: var(--selected-day-background);
        outline: var(--selected-day-outline);
    }

    .date {
        padding: var(--cell-padding);
        text-align: center;
    }

    .interact .today,
    .today {
        color: ${Vd};
        background: ${Kd};
    }

    .today.inactive .date {
        background: transparent;
        color: inherit;
        width: auto;
    }
`.withBehaviors(la(Yt`
            :host {
                --selected-day-outline: 1px solid ${Ao.Highlight};
            }

            .day,
            .week-day {
                background: ${Ao.Canvas};
                color: ${Ao.CanvasText};
                fill: currentcolor;
            }

            .day.selected {
                color: ${Ao.Highlight};
            }

            .today .date {
                background: ${Ao.Highlight};
                color: ${Ao.HighlightText};
            }
        `));nr.compose({baseName:"calendar",template:(e,t)=>{var i;const o=new Date,r=`${o.getMonth()+1}-${o.getDate()}-${o.getFullYear()}`;return Tt`
        <template>
            ${Ti}
            ${t.title instanceof Function?t.title(e,t):null!==(i=t.title)&&void 0!==i?i:""}
            <slot></slot>
            ${ci((e=>!1===e.readonly),kr(e,r))}
            ${ci((e=>!0===e.readonly),(e=>Tt`
        <div class="days" part="days">
            <div class="week-days" part="week-days">
                ${gi((e=>e.getWeekdayText()),Tt`
                        <div class="week-day" part="week-day" abbr="${e=>e.abbr}">
                            ${e=>e.text}
                        </div>
                    `)}
            </div>
            ${gi((e=>e.getDays()),Tt`
                    <div class="week">
                        ${gi((e=>e),Tt`
                                <div
                                    class="${(t,i)=>i.parentContext.parent.getDayClassNames(t,e)}"
                                    part="day"
                                    aria-label="${(e,t)=>t.parentContext.parent.dateFormatter.getDate(`${e.month}-${e.day}-${e.year}`,{month:"long",day:"numeric"})}"
                                >
                                    <div
                                        class="date"
                                        part="${t=>e===`${t.month}-${t.day}-${t.year}`?"today":"date"}"
                                    >
                                        ${(e,t)=>t.parentContext.parent.dateFormatter.getDay(e.day)}
                                    </div>
                                    <slot
                                        name="${e=>e.month}-${e=>e.day}-${e=>e.year}"
                                    ></slot>
                                </div>
                            `)}
                    </div>
                `)}
        </div>
    `)(r))}
            ${Si}
        </template>
    `},styles:Uc,title:xr});(class extends Cr{connectedCallback(){super.connectedCallback();const e=Vr(this);e&&Od.setValueFor(this,(t=>cc.getValueFor(t).evaluate(t,Od.getValueFor(e))))}}).compose({baseName:"card",baseClass:Cr,template:(e,t)=>Tt`
    <slot></slot>
`,styles:(e,t)=>Yt`
        ${ca("block")} :host {
            --elevation: 4;
            display: block;
            contain: content;
            height: var(--card-height, 100%);
            width: var(--card-width, 100%);
            box-sizing: border-box;
            background: ${Od};
            border-radius: calc(${bl} * 1px);
            ${Ec}
        }
    `.withBehaviors(la(Yt`
                :host {
                    forced-color-adjust: none;
                    background: ${Ao.Canvas};
                    box-shadow: 0 0 0 1px ${Ao.CanvasText};
                }
            `))}),Sr.compose({baseName:"checkbox",template:(e,t)=>Tt`
    <template
        role="checkbox"
        aria-checked="${e=>e.checked}"
        aria-required="${e=>e.required}"
        aria-disabled="${e=>e.disabled}"
        aria-readonly="${e=>e.readOnly}"
        tabindex="${e=>e.disabled?null:0}"
        @keypress="${(e,t)=>e.keypressHandler(t.event)}"
        @click="${(e,t)=>e.clickHandler(t.event)}"
        class="${e=>e.readOnly?"readonly":""} ${e=>e.checked?"checked":""} ${e=>e.indeterminate?"indeterminate":""}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${t.checkedIndicator||""}
            </slot>
            <slot name="indeterminate-indicator">
                ${t.indeterminateIndicator||""}
            </slot>
        </div>
        <label
            part="label"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot ${xi("defaultSlottedNodes")}></slot>
        </label>
    </template>
`,styles:(e,t)=>Yt`
        ${ca("inline-flex")} :host {
            align-items: center;
            outline: none;
            margin: calc(${xl} * 1px) 0;
            /* Chromium likes to select label text or the default slot when the checkbox is
                clicked. Maybe there is a better solution here? */
            user-select: none;
        }

        .control {
            position: relative;
            width: calc((${Tc} / 2 + ${xl}) * 1px);
            height: calc((${Tc} / 2 + ${xl}) * 1px);
            box-sizing: border-box;
            border-radius: calc(${bl} * 1px);
            border: calc(${Cl} * 1px) solid ${xc};
            background: ${tc};
            outline: none;
            cursor: pointer;
        }

        .label {
            font-family: ${ml};
            color: ${bc};
            padding-inline-start: calc(${xl} * 2px + 2px);
            margin-inline-end: calc(${xl} * 2px + 2px);
            cursor: pointer;
            font-size: ${_l};
            line-height: ${Sl};
        }

        .label__hidden {
            display: none;
            visibility: hidden;
        }

        .checked-indicator {
            width: 100%;
            height: 100%;
            display: block;
            fill: ${Hd};
            opacity: 0;
            pointer-events: none;
        }

        .indeterminate-indicator {
            border-radius: calc(${bl} * 1px);
            background: ${Hd};
            position: absolute;
            top: 50%;
            left: 50%;
            width: 50%;
            height: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
        }

        :host(:not([disabled])) .control:hover {
            background: ${ic};
            border-color: ${wc};
        }

        :host(:not([disabled])) .control:active {
            background: ${oc};
            border-color: ${kc};
        }

        :host(:${ha}) .control {
            box-shadow: 0 0 0 2px ${Od}, 0 0 0 4px ${uc};
        }

        :host([aria-checked="true"]) .control {
            background: ${Md};
            border: calc(${Cl} * 1px) solid ${Md};
        }

        :host([aria-checked="true"]:not([disabled])) .control:hover {
            background: ${Rd};
            border: calc(${Cl} * 1px) solid ${Rd};
        }

        :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator {
            fill: ${Bd};
        }

        :host([aria-checked="true"]:not([disabled])) .control:hover .indeterminate-indicator {
            background: ${Bd};
        }

        :host([aria-checked="true"]:not([disabled])) .control:active {
            background: ${Dd};
            border: calc(${Cl} * 1px) solid ${Dd};
        }

        :host([aria-checked="true"]:not([disabled])) .control:active .checked-indicator {
            fill: ${Vd};
        }

        :host([aria-checked="true"]:not([disabled])) .control:active .indeterminate-indicator {
            background: ${Vd};
        }

        :host([aria-checked="true"]:${ha}:not([disabled])) .control {
            box-shadow: 0 0 0 2px ${Od}, 0 0 0 4px ${uc};
        }


        :host([disabled]) .label,
        :host([readonly]) .label,
        :host([readonly]) .control,
        :host([disabled]) .control {
            cursor: ${"not-allowed"};
        }

        :host([aria-checked="true"]:not(.indeterminate)) .checked-indicator,
        :host(.indeterminate) .indeterminate-indicator {
            opacity: 1;
        }

        :host([disabled]) {
            opacity: ${kl};
        }
    `.withBehaviors(la(Yt`
            .control {
                forced-color-adjust: none;
                border-color: ${Ao.FieldText};
                background: ${Ao.Field};
            }
            .checked-indicator {
                fill: ${Ao.FieldText};
            }
            .indeterminate-indicator {
                background: ${Ao.FieldText};
            }
            :host(:not([disabled])) .control:hover, .control:active {
                border-color: ${Ao.Highlight};
                background: ${Ao.Field};
            }
            :host(:${ha}) .control {
                box-shadow: 0 0 0 2px ${Ao.Field}, 0 0 0 4px ${Ao.FieldText};
            }
            :host([aria-checked="true"]:${ha}:not([disabled])) .control {
                box-shadow: 0 0 0 2px ${Ao.Field}, 0 0 0 4px ${Ao.FieldText};
            }
            :host([aria-checked="true"]) .control {
                background: ${Ao.Highlight};
                border-color: ${Ao.Highlight};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover, .control:active {
                border-color: ${Ao.Highlight};
                background: ${Ao.HighlightText};
            }
            :host([aria-checked="true"]) .checked-indicator {
                fill: ${Ao.HighlightText};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator {
                fill: ${Ao.Highlight}
            }
            :host([aria-checked="true"]) .indeterminate-indicator {
                background: ${Ao.HighlightText};
            }
            :host([aria-checked="true"]) .control:hover .indeterminate-indicator {
                background: ${Ao.Highlight}
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host([disabled]) .control {
                forced-color-adjust: none;
                border-color: ${Ao.GrayText};
                background: ${Ao.Field};
            }
            :host([disabled]) .indeterminate-indicator,
            :host([aria-checked="true"][disabled]) .control:hover .indeterminate-indicator {
                forced-color-adjust: none;
                background: ${Ao.GrayText};
            }
            :host([disabled]) .checked-indicator,
            :host([aria-checked="true"][disabled]) .control:hover .checked-indicator {
                forced-color-adjust: none;
                fill: ${Ao.GrayText};
            }
        `)),checkedIndicator:'\n        <svg\n            part="checked-indicator"\n            class="checked-indicator"\n            viewBox="0 0 20 20"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n                fill-rule="evenodd"\n                clip-rule="evenodd"\n                d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"\n            />\n        </svg>\n    ',indeterminateIndicator:'\n        <div part="indeterminate-indicator" class="indeterminate-indicator"></div>\n    '});const Wc=(e,t)=>{const i=e.tagFor(Er),o=e.name===e.tagFor(Rn)?"":".listbox";return Yt`
        ${o?"":ca("inline-flex")}

        :host ${o} {
            background: ${Od};
            border: calc(${Cl} * 1px) solid ${xc};
            border-radius: calc(${bl} * 1px);
            box-sizing: border-box;
            flex-direction: column;
            padding: calc(${xl} * 1px) 0;
        }

        ${o?"":Yt`
            :host(:focus-within:not([disabled])) {
                border-color: ${uc};
                box-shadow: 0 0 0
                    calc((${$l} - ${Cl}) * 1px)
                    ${uc} inset;
            }

            :host([disabled]) ::slotted(*) {
                cursor: ${"not-allowed"};
                opacity: ${kl};
                pointer-events: none;
            }
        `}

        ${o||":host([size])"} {
            max-height: calc(
                (var(--size) * ${Tc} + (${xl} * ${Cl} * 2)) * 1px
            );
            overflow-y: auto;
        }

        :host([size="0"]) ${o} {
            max-height: none;
        }
    `.withBehaviors(la(Yt`
                :host(:not([multiple]):${ha}) ::slotted(${i}[aria-selected="true"]),
                :host([multiple]:${ha}) ::slotted(${i}[aria-checked="true"]) {
                    border-color: ${Ao.ButtonText};
                    box-shadow: 0 0 0 calc(${$l} * 1px) inset ${Ao.HighlightText};
                }

                :host(:not([multiple]):${ha}) ::slotted(${i}[aria-selected="true"]) {
                    background: ${Ao.Highlight};
                    color: ${Ao.HighlightText};
                    fill: currentcolor;
                }

                ::slotted(${i}[aria-selected="true"]:not([aria-checked="true"])) {
                    background: ${Ao.Highlight};
                    border-color: ${Ao.HighlightText};
                    color: ${Ao.HighlightText};
                }
            `))},qc=(e,t)=>{const i=e.name===e.tagFor(ys);return Yt`
        ${ca("inline-flex")}

        :host {
            --elevation: 14;
            background: ${tc};
            border-radius: calc(${bl} * 1px);
            border: calc(${Cl} * 1px) solid ${Md};
            box-sizing: border-box;
            color: ${bc};
            font-family: ${ml};
            height: calc(${Tc} * 1px);
            position: relative;
            user-select: none;
            min-width: 250px;
            outline: none;
            vertical-align: top;
        }

        ${i?Yt`
            :host(:not([aria-haspopup])) {
                --elevation: 0;
                border: 0;
                height: auto;
                min-width: 0;
            }
        `:""}

        ${Wc(e)}

        :host .listbox {
            ${Ec}
            border: none;
            display: flex;
            left: 0;
            position: absolute;
            width: 100%;
            z-index: 1;
        }

        .control + .listbox {
            --stroke-size: calc(${xl} * ${Cl} * 2);
            max-height: calc(
                (var(--listbox-max-height) * ${Tc} + var(--stroke-size)) * 1px
            );
        }

        ${i?Yt`
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
            font-size: ${_l};
            font-family: inherit;
            line-height: ${Sl};
            min-height: 100%;
            padding: 0 calc(${xl} * 2.25px);
            width: 100%;
        }

        :host(:not([disabled]):hover) {
            background: ${ic};
            border-color: ${Rd};
        }

        :host(:${ha}) {
            border-color: ${uc};
        }

        :host(:not([size]):not([multiple]):not([open]):${ha}),
        :host([multiple]:${ha}),
        :host([size]:${ha}) {
            box-shadow: 0 0 0 calc(${$l} * 1px) ${uc};
        }

        :host(:not([multiple]):not([size]):${ha}) ::slotted(${e.tagFor(Er)}[aria-selected="true"]:not([disabled])) {
            box-shadow: 0 0 0 calc(${$l} * 1px) inset ${mc};
            border-color: ${uc};
            background: ${zd};
            color: ${jd};
        }

        :host([disabled]) {
            cursor: ${"not-allowed"};
            opacity: ${kl};
        }

        :host([disabled]) .control {
            cursor: ${"not-allowed"};
            user-select: none;
        }

        :host([disabled]:hover) {
            background: ${nc};
            color: ${bc};
            fill: currentcolor;
        }

        :host(:not([disabled])) .control:active {
            background: ${oc};
            border-color: ${Dd};
            border-radius: calc(${bl} * 1px);
        }

        :host([open][position="above"]) .listbox {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom: 0;
            bottom: calc(${Tc} * 1px);
        }

        :host([open][position="below"]) .listbox {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            border-top: 0;
            top: calc(${Tc} * 1px);
        }

        .selected-value {
            flex: 1 1 auto;
            font-family: inherit;
            min-width: calc(var(--listbox-scroll-width, 0) - (${xl} * 4) * 1px);
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
            ${Ec}
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
            min-height: calc(${xl} * 4px);
            min-width: calc(${xl} * 4px);
            width: 1em;
        }

        ::slotted([role="option"]),
        ::slotted(option) {
            flex: 0 0 auto;
        }
    `.withBehaviors(la(Yt`
                :host(:not([disabled]):hover),
                :host(:not([disabled]):active) {
                    border-color: ${Ao.Highlight};
                }

                :host(:not([disabled]):${ha}) {
                    background-color: ${Ao.ButtonFace};
                    box-shadow: 0 0 0 calc(${$l} * 1px) ${Ao.Highlight};
                    color: ${Ao.ButtonText};
                    fill: currentcolor;
                    forced-color-adjust: none;
                }

                :host(:not([disabled]):${ha}) .listbox {
                    background: ${Ao.ButtonFace};
                }

                :host([disabled]) {
                    border-color: ${Ao.GrayText};
                    background-color: ${Ao.ButtonFace};
                    color: ${Ao.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                    forced-color-adjust: none;
                }

                :host([disabled]:hover) {
                    background: ${Ao.ButtonFace};
                }

                :host([disabled]) .control {
                    color: ${Ao.GrayText};
                    border-color: ${Ao.GrayText};
                }

                :host([disabled]) .control .select-indicator {
                    fill: ${Ao.GrayText};
                }

                :host(:${ha}) ::slotted([aria-selected="true"][role="option"]),
                :host(:${ha}) ::slotted(option[aria-selected="true"]),
                :host(:${ha}) ::slotted([aria-selected="true"][role="option"]:not([disabled])) {
                    background: ${Ao.Highlight};
                    border-color: ${Ao.ButtonText};
                    box-shadow: 0 0 0 calc(${$l} * 1px) inset ${Ao.HighlightText};
                    color: ${Ao.HighlightText};
                    fill: currentcolor;
                }

                .start,
                .end,
                .indicator,
                .select-indicator,
                ::slotted(svg) {
                    color: ${Ao.ButtonText};
                    fill: currentcolor;
                }
            `))};(class extends Hr{maxHeightChanged(e,t){this.updateComputedStylesheet()}updateComputedStylesheet(){this.computedStylesheet&&this.$fastController.removeStyles(this.computedStylesheet);const e=Math.floor(this.maxHeight/Sc.getValueFor(this)).toString();this.computedStylesheet=Yt`
            :host {
                --listbox-max-height: ${e};
            }
        `,this.$fastController.addStyles(this.computedStylesheet)}}).compose({baseName:"combobox",baseClass:Hr,template:(e,t)=>Tt`
    <template
        aria-disabled="${e=>e.ariaDisabled}"
        autocomplete="${e=>e.autocomplete}"
        class="${e=>e.open?"open":""} ${e=>e.disabled?"disabled":""} ${e=>e.position}"
        ?open="${e=>e.open}"
        tabindex="${e=>e.disabled?null:"0"}"
        @click="${(e,t)=>e.clickHandler(t.event)}"
        @focusout="${(e,t)=>e.focusoutHandler(t.event)}"
        @keydown="${(e,t)=>e.keydownHandler(t.event)}"
    >
        <div class="control" part="control">
            ${_i(0,t)}
            <slot name="control">
                <input
                    aria-activedescendant="${e=>e.open?e.ariaActiveDescendant:null}"
                    aria-autocomplete="${e=>e.ariaAutoComplete}"
                    aria-controls="${e=>e.ariaControls}"
                    aria-disabled="${e=>e.ariaDisabled}"
                    aria-expanded="${e=>e.ariaExpanded}"
                    aria-haspopup="listbox"
                    class="selected-value"
                    part="selected-value"
                    placeholder="${e=>e.placeholder}"
                    role="combobox"
                    type="text"
                    ?disabled="${e=>e.disabled}"
                    :value="${e=>e.value}"
                    @input="${(e,t)=>e.inputHandler(t.event)}"
                    @keyup="${(e,t)=>e.keyupHandler(t.event)}"
                    ${di("control")}
                />
                <div class="indicator" part="indicator" aria-hidden="true">
                    <slot name="indicator">
                        ${t.indicator||""}
                    </slot>
                </div>
            </slot>
            ${$i(0,t)}
        </div>
        <div
            class="listbox"
            id="${e=>e.listboxId}"
            part="listbox"
            role="listbox"
            ?disabled="${e=>e.disabled}"
            ?hidden="${e=>!e.open}"
            ${di("listbox")}
        >
            <slot
                ${xi({filter:Ir.slottedOptionFilter,flatten:!0,property:"slottedOptions"})}
            ></slot>
        </div>
    </template>
`,styles:(e,t)=>Yt`
    ${qc(e)}

    :host(:empty) .listbox {
        display: none;
    }

    :host([disabled]) *,
    :host([disabled]) {
        cursor: ${"not-allowed"};
        user-select: none;
    }

    .selected-value {
        -webkit-appearance: none;
        background: transparent;
        border: none;
        color: inherit;
        font-size: ${_l};
        line-height: ${Sl};
        height: calc(100% - (${Cl} * 1px));
        margin: auto 0;
        width: 100%;
    }

    .selected-value:hover,
    .selected-value:${ha},
    .selected-value:disabled,
    .selected-value:active {
        outline: none;
    }
`,shadowOptions:{delegatesFocus:!0},indicator:'\n        <svg\n            class="select-indicator"\n            part="select-indicator"\n            viewBox="0 0 12 7"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"\n            />\n        </svg>\n    '}),yr.compose({baseName:"data-grid-cell",template:(e,t)=>Tt`
        <template
            tabindex="-1"
            role="${e=>e.cellType&&"default"!==e.cellType?e.cellType:"gridcell"}"
            class="
            ${e=>"columnheader"===e.cellType?"column-header":"rowheader"===e.cellType?"row-header":""}
            "
        >
            <slot></slot>
        </template>
    `,styles:(e,t)=>Yt`
        :host {
            padding: calc(${xl} * 1px) calc(${xl} * 3px);
            color: ${bc};
            box-sizing: border-box;
            font-family: ${ml};
            font-size: ${_l};
            line-height: ${Sl};
            font-weight: 400;
            border: transparent calc(${$l} * 1px) solid;
            overflow: hidden;
            white-space: nowrap;
            border-radius: calc(${bl} * 1px);
        }

        :host(.column-header) {
            font-weight: 600;
        }

        :host(:${ha}) {
            border: ${uc} calc(${$l} * 1px) solid;
            outline: none;
            color: ${bc};
        }
    `.withBehaviors(la(Yt`
        :host {
            forced-color-adjust: none;
            border-color: transparent;
            background: ${Ao.Field};
            color: ${Ao.FieldText};
        }

        :host(:${ha}) {
            border-color: ${Ao.FieldText};
            box-shadow: 0 0 0 2px inset ${Ao.Field};
            color: ${Ao.FieldText};
        }
        `))}),fr.compose({baseName:"data-grid-row",template:(e,t)=>{const i=function(e){const t=e.tagFor(yr);return Tt`
    <${t}
        cell-type="${e=>e.isRowHeader?"rowheader":void 0}"
        grid-column="${(e,t)=>t.index+1}"
        :rowData="${(e,t)=>t.parent.rowData}"
        :columnDefinition="${e=>e}"
    ></${t}>
`}(e),o=function(e){const t=e.tagFor(yr);return Tt`
    <${t}
        cell-type="columnheader"
        grid-column="${(e,t)=>t.index+1}"
        :columnDefinition="${e=>e}"
    ></${t}>
`}(e);return Tt`
        <template
            role="row"
            class="${e=>"default"!==e.rowType?e.rowType:""}"
            :defaultCellItemTemplate="${i}"
            :defaultHeaderCellItemTemplate="${o}"
            ${ki({property:"cellElements",filter:vi('[role="cell"],[role="gridcell"],[role="columnheader"],[role="rowheader"]')})}
        >
            <slot ${xi("slottedCellElements")}></slot>
        </template>
    `},styles:(e,t)=>Yt`
    :host {
        display: grid;
        padding: 1px 0;
        box-sizing: border-box;
        width: 100%;
        border-bottom: calc(${Cl} * 1px) solid ${_c};
    }

    :host(.header) {
    }

    :host(.sticky-header) {
        background: ${Yd};
        position: sticky;
        top: 0;
    }
`}),gr.compose({baseName:"data-grid",template:(e,t)=>{const i=function(e){const t=e.tagFor(fr);return Tt`
    <${t}
        :rowData="${e=>e}"
        :cellItemTemplate="${(e,t)=>t.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(e,t)=>t.parent.headerCellItemTemplate}"
    ></${t}>
`}(e),o=e.tagFor(fr);return Tt`
        <template
            role="grid"
            tabindex="0"
            :rowElementTag="${()=>o}"
            :defaultRowItemTemplate="${i}"
            ${ki({property:"rowElements",filter:vi("[role=row]")})}
        >
            <slot></slot>
        </template>
    `},styles:(e,t)=>Yt`
    :host {
        display: flex;
        position: relative;
        flex-direction: column;
    }
`});const Gc={toView:e=>null==e?null:null==e?void 0:e.toColorString(),fromView(e){if(null==e)return null;const t=Ka(e);return t?Ja.create(t.r,t.g,t.b):null}},Xc=Yt`
    :host {
        background-color: ${Od};
        color: ${bc};
    }
`.withBehaviors(la(Yt`
            :host {
                background-color: ${Ao.ButtonFace};
                box-shadow: 0 0 0 1px ${Ao.CanvasText};
                color: ${Ao.ButtonText};
            }
        `));function Kc(e){return(t,i)=>{t[i+"Changed"]=function(t,i){null!=i?e.setValueFor(this,i):e.deleteValueFor(this)}}}class Zc extends uo{constructor(){super(),this.noPaint=!1;const e={handleChange:this.noPaintChanged.bind(this)};Ze.getNotifier(this).subscribe(e,"fillColor"),Ze.getNotifier(this).subscribe(e,"baseLayerLuminance")}noPaintChanged(){this.noPaint||void 0===this.fillColor&&!this.baseLayerLuminance?this.$fastController.removeStyles(Xc):this.$fastController.addStyles(Xc)}}Ei([Pt({attribute:"no-paint",mode:"boolean"})],Zc.prototype,"noPaint",void 0),Ei([Pt({attribute:"fill-color",converter:Gc}),Kc(Od)],Zc.prototype,"fillColor",void 0),Ei([Pt({attribute:"accent-color",converter:Gc,mode:"fromView"}),Kc(wd)],Zc.prototype,"accentColor",void 0),Ei([Pt({attribute:"neutral-color",converter:Gc,mode:"fromView"}),Kc(yd)],Zc.prototype,"neutralColor",void 0),Ei([Pt({converter:Dt}),Kc(yl)],Zc.prototype,"density",void 0),Ei([Pt({attribute:"design-unit",converter:Dt}),Kc(xl)],Zc.prototype,"designUnit",void 0),Ei([Pt({attribute:"direction"}),Kc(wl)],Zc.prototype,"direction",void 0),Ei([Pt({attribute:"base-height-multiplier",converter:Dt}),Kc(fl)],Zc.prototype,"baseHeightMultiplier",void 0),Ei([Pt({attribute:"base-horizontal-spacing-multiplier",converter:Dt}),Kc(gl)],Zc.prototype,"baseHorizontalSpacingMultiplier",void 0),Ei([Pt({attribute:"control-corner-radius",converter:Dt}),Kc(bl)],Zc.prototype,"controlCornerRadius",void 0),Ei([Pt({attribute:"stroke-width",converter:Dt}),Kc(Cl)],Zc.prototype,"strokeWidth",void 0),Ei([Pt({attribute:"focus-stroke-width",converter:Dt}),Kc($l)],Zc.prototype,"focusStrokeWidth",void 0),Ei([Pt({attribute:"disabled-opacity",converter:Dt}),Kc(kl)],Zc.prototype,"disabledOpacity",void 0),Ei([Pt({attribute:"type-ramp-minus-2-font-size"}),Kc(Al)],Zc.prototype,"typeRampMinus2FontSize",void 0),Ei([Pt({attribute:"type-ramp-minus-2-line-height"}),Kc(Il)],Zc.prototype,"typeRampMinus2LineHeight",void 0),Ei([Pt({attribute:"type-ramp-minus-1-font-size"}),Kc(Tl)],Zc.prototype,"typeRampMinus1FontSize",void 0),Ei([Pt({attribute:"type-ramp-minus-1-line-height"}),Kc(El)],Zc.prototype,"typeRampMinus1LineHeight",void 0),Ei([Pt({attribute:"type-ramp-base-font-size"}),Kc(_l)],Zc.prototype,"typeRampBaseFontSize",void 0),Ei([Pt({attribute:"type-ramp-base-line-height"}),Kc(Sl)],Zc.prototype,"typeRampBaseLineHeight",void 0),Ei([Pt({attribute:"type-ramp-plus-1-font-size"}),Kc(Ol)],Zc.prototype,"typeRampPlus1FontSize",void 0),Ei([Pt({attribute:"type-ramp-plus-1-line-height"}),Kc(Ll)],Zc.prototype,"typeRampPlus1LineHeight",void 0),Ei([Pt({attribute:"type-ramp-plus-2-font-size"}),Kc(Fl)],Zc.prototype,"typeRampPlus2FontSize",void 0),Ei([Pt({attribute:"type-ramp-plus-2-line-height"}),Kc(Ml)],Zc.prototype,"typeRampPlus2LineHeight",void 0),Ei([Pt({attribute:"type-ramp-plus-3-font-size"}),Kc(Rl)],Zc.prototype,"typeRampPlus3FontSize",void 0),Ei([Pt({attribute:"type-ramp-plus-3-line-height"}),Kc(Dl)],Zc.prototype,"typeRampPlus3LineHeight",void 0),Ei([Pt({attribute:"type-ramp-plus-4-font-size"}),Kc(zl)],Zc.prototype,"typeRampPlus4FontSize",void 0),Ei([Pt({attribute:"type-ramp-plus-4-line-height"}),Kc(Pl)],Zc.prototype,"typeRampPlus4LineHeight",void 0),Ei([Pt({attribute:"type-ramp-plus-5-font-size"}),Kc(Nl)],Zc.prototype,"typeRampPlus5FontSize",void 0),Ei([Pt({attribute:"type-ramp-plus-5-line-height"}),Kc(Hl)],Zc.prototype,"typeRampPlus5LineHeight",void 0),Ei([Pt({attribute:"type-ramp-plus-6-font-size"}),Kc(Bl)],Zc.prototype,"typeRampPlus6FontSize",void 0),Ei([Pt({attribute:"type-ramp-plus-6-line-height"}),Kc(Vl)],Zc.prototype,"typeRampPlus6LineHeight",void 0),Ei([Pt({attribute:"accent-fill-rest-delta",converter:Dt}),Kc(jl)],Zc.prototype,"accentFillRestDelta",void 0),Ei([Pt({attribute:"accent-fill-hover-delta",converter:Dt}),Kc(Ul)],Zc.prototype,"accentFillHoverDelta",void 0),Ei([Pt({attribute:"accent-fill-active-delta",converter:Dt}),Kc(Wl)],Zc.prototype,"accentFillActiveDelta",void 0),Ei([Pt({attribute:"accent-fill-focus-delta",converter:Dt}),Kc(ql)],Zc.prototype,"accentFillFocusDelta",void 0),Ei([Pt({attribute:"accent-foreground-rest-delta",converter:Dt}),Kc(Gl)],Zc.prototype,"accentForegroundRestDelta",void 0),Ei([Pt({attribute:"accent-foreground-hover-delta",converter:Dt}),Kc(Xl)],Zc.prototype,"accentForegroundHoverDelta",void 0),Ei([Pt({attribute:"accent-foreground-active-delta",converter:Dt}),Kc(Kl)],Zc.prototype,"accentForegroundActiveDelta",void 0),Ei([Pt({attribute:"accent-foreground-focus-delta",converter:Dt}),Kc(Zl)],Zc.prototype,"accentForegroundFocusDelta",void 0),Ei([Pt({attribute:"neutral-fill-rest-delta",converter:Dt}),Kc(Yl)],Zc.prototype,"neutralFillRestDelta",void 0),Ei([Pt({attribute:"neutral-fill-hover-delta",converter:Dt}),Kc(Ql)],Zc.prototype,"neutralFillHoverDelta",void 0),Ei([Pt({attribute:"neutral-fill-active-delta",converter:Dt}),Kc(Jl)],Zc.prototype,"neutralFillActiveDelta",void 0),Ei([Pt({attribute:"neutral-fill-focus-delta",converter:Dt}),Kc(ed)],Zc.prototype,"neutralFillFocusDelta",void 0),Ei([Pt({attribute:"neutral-fill-input-rest-delta",converter:Dt}),Kc(td)],Zc.prototype,"neutralFillInputRestDelta",void 0),Ei([Pt({attribute:"neutral-fill-input-hover-delta",converter:Dt}),Kc(id)],Zc.prototype,"neutralFillInputHoverDelta",void 0),Ei([Pt({attribute:"neutral-fill-input-active-delta",converter:Dt}),Kc(od)],Zc.prototype,"neutralFillInputActiveDelta",void 0),Ei([Pt({attribute:"neutral-fill-input-focus-delta",converter:Dt}),Kc(rd)],Zc.prototype,"neutralFillInputFocusDelta",void 0),Ei([Pt({attribute:"neutral-fill-stealth-rest-delta",converter:Dt}),Kc(nd)],Zc.prototype,"neutralFillStealthRestDelta",void 0),Ei([Pt({attribute:"neutral-fill-stealth-hover-delta",converter:Dt}),Kc(sd)],Zc.prototype,"neutralFillStealthHoverDelta",void 0),Ei([Pt({attribute:"neutral-fill-stealth-active-delta",converter:Dt}),Kc(ad)],Zc.prototype,"neutralFillStealthActiveDelta",void 0),Ei([Pt({attribute:"neutral-fill-stealth-focus-delta",converter:Dt}),Kc(ld)],Zc.prototype,"neutralFillStealthFocusDelta",void 0),Ei([Pt({attribute:"neutral-fill-strong-hover-delta",converter:Dt}),Kc(cd)],Zc.prototype,"neutralFillStrongHoverDelta",void 0),Ei([Pt({attribute:"neutral-fill-strong-active-delta",converter:Dt}),Kc(hd)],Zc.prototype,"neutralFillStrongActiveDelta",void 0),Ei([Pt({attribute:"neutral-fill-strong-focus-delta",converter:Dt}),Kc(ud)],Zc.prototype,"neutralFillStrongFocusDelta",void 0),Ei([Pt({attribute:"base-layer-luminance",converter:Dt}),Kc(vl)],Zc.prototype,"baseLayerLuminance",void 0),Ei([Pt({attribute:"neutral-fill-layer-rest-delta",converter:Dt}),Kc(pd)],Zc.prototype,"neutralFillLayerRestDelta",void 0),Ei([Pt({attribute:"neutral-stroke-divider-rest-delta",converter:Dt}),Kc(bd)],Zc.prototype,"neutralStrokeDividerRestDelta",void 0),Ei([Pt({attribute:"neutral-stroke-rest-delta",converter:Dt}),Kc(md)],Zc.prototype,"neutralStrokeRestDelta",void 0),Ei([Pt({attribute:"neutral-stroke-hover-delta",converter:Dt}),Kc(fd)],Zc.prototype,"neutralStrokeHoverDelta",void 0),Ei([Pt({attribute:"neutral-stroke-active-delta",converter:Dt}),Kc(gd)],Zc.prototype,"neutralStrokeActiveDelta",void 0),Ei([Pt({attribute:"neutral-stroke-focus-delta",converter:Dt}),Kc(vd)],Zc.prototype,"neutralStrokeFocusDelta",void 0);Zc.compose({baseName:"design-system-provider",template:(e,t)=>Tt`
    <slot></slot>
`,styles:(e,t)=>Yt`
    ${ca("block")}
`}),En.compose({baseName:"dialog",template:(e,t)=>Tt`
    <div class="positioning-region" part="positioning-region">
        ${ci((e=>e.modal),Tt`
                <div
                    class="overlay"
                    part="overlay"
                    role="presentation"
                    @click="${e=>e.dismiss()}"
                ></div>
            `)}
        <div
            role="dialog"
            tabindex="-1"
            class="control"
            part="control"
            aria-modal="${e=>e.modal}"
            aria-describedby="${e=>e.ariaDescribedby}"
            aria-labelledby="${e=>e.ariaLabelledby}"
            aria-label="${e=>e.ariaLabel}"
            ${di("dialog")}
        >
            <slot></slot>
        </div>
    </div>
`,styles:(e,t)=>Yt`
    :host([hidden]) {
        display: none;
    }

    :host {
        --elevation: 14;
        --dialog-height: 480px;
        --dialog-width: 640px;
        display: block;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        touch-action: none;
    }

    .positioning-region {
        display: flex;
        justify-content: center;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: auto;
    }

    .control {
        ${Ec}
        margin-top: auto;
        margin-bottom: auto;
        width: var(--dialog-width);
        height: var(--dialog-height);
        background-color: ${Od};
        z-index: 1;
        border-radius: calc(${bl} * 1px);
        border: calc(${Cl} * 1px) solid transparent;
    }
`});class Yc extends An{constructor(){super(...arguments),this.height=0,this.totalHeight=0}connectedCallback(){super.connectedCallback(),this.appearance||(this.appearance="accent")}appearanceChanged(e,t){e!==t&&(this.classList.add(t),this.classList.remove(e))}onToggle(){super.onToggle(),this.details.style.setProperty("height",`${this.disclosureHeight}px`)}setup(){super.setup();const e=()=>this.details.getBoundingClientRect().height;this.show(),this.totalHeight=e(),this.hide(),this.height=e(),this.expanded&&this.show()}get disclosureHeight(){return this.expanded?this.totalHeight:this.height}}Ei([Pt],Yc.prototype,"appearance",void 0);Yc.compose({baseName:"disclosure",baseClass:An,template:(e,t)=>Tt`
    <details class="disclosure" ${di("details")}>
        <summary
            class="invoker"
            role="button"
            aria-controls="disclosure-content"
            aria-expanded="${e=>e.expanded}"
        >
            <slot name="start"></slot>
            <slot name="title">${e=>e.title}</slot>
            <slot name="end"></slot>
        </summary>
        <div id="disclosure-content"><slot></slot></div>
    </details>
`,styles:(e,t)=>Yt`
    .disclosure {
        transition: height 0.35s;
    }

    .disclosure .invoker::-webkit-details-marker {
        display: none;
    }

    .disclosure .invoker {
        list-style-type: none;
    }

    :host([appearance="accent"]) .invoker {
        background: ${Md};
        color: ${Hd};
        font-family: ${ml};
        font-size: ${_l};
        border-radius: calc(${bl} * 1px);
        outline: none;
        cursor: pointer;
        margin: 16px 0;
        padding: 12px;
        max-width: max-content;
    }

    :host([appearance="accent"]) .invoker:active {
        background: ${Dd};
        color: ${Vd};
    }

    :host([appearance="accent"]) .invoker:hover {
        background: ${Rd};
        color: ${Bd};
    }

    :host([appearance="lightweight"]) .invoker {
        background: transparent;
        color: ${Gd};
        border-bottom: calc(${Cl} * 1px) solid ${Gd};
        cursor: pointer;
        width: max-content;
        margin: 16px 0;
    }

    :host([appearance="lightweight"]) .invoker:active {
        border-bottom-color: ${Kd};
    }

    :host([appearance="lightweight"]) .invoker:hover {
        border-bottom-color: ${Xd};
    }

    .disclosure[open] .invoker ~ * {
        animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
`}),On.compose({baseName:"divider",template:(e,t)=>Tt`
    <template role="${e=>e.role}" aria-orientation="${e=>e.orientation}"></template>
`,styles:(e,t)=>Yt`
        ${ca("block")} :host {
            box-sizing: content-box;
            height: 0;
            margin: calc(${xl} * 1px) 0;
            border-top: calc(${Cl} * 1px) solid ${_c};
            border-left: none;
        }

        :host([orientation="vertical"]) {
            height: 100%;
            margin: 0 calc(${xl} * 1px);
            border-top: none;
            border-left: calc(${Cl} * 1px) solid ${_c};
        }
    `}),Mn.compose({baseName:"flipper",template:(e,t)=>Tt`
    <template
        role="button"
        aria-disabled="${e=>!!e.disabled||void 0}"
        tabindex="${e=>e.hiddenFromAT?-1:0}"
        class="${e=>e.direction} ${e=>e.disabled?"disabled":""}"
        @keyup="${(e,t)=>e.keyupHandler(t.event)}"
    >
        ${ci((e=>e.direction===Ln),Tt`
                <span part="next" class="next">
                    <slot name="next">
                        ${t.next||""}
                    </slot>
                </span>
            `)}
        ${ci((e=>e.direction===Fn),Tt`
                <span part="previous" class="previous">
                    <slot name="previous">
                        ${t.previous||""}
                    </slot>
                </span>
            `)}
    </template>
`,styles:(e,t)=>Yt`
    ${ca("inline-flex")} :host {
        width: calc(${Tc} * 1px);
        height: calc(${Tc} * 1px);
        justify-content: center;
        align-items: center;
        margin: 0;
        position: relative;
        fill: currentcolor;
        color: ${Hd};
        background: transparent;
        outline: none;
        border: none;
        padding: 0;
    }

    :host::before {
        content: "";
        background: ${Md};
        border: calc(${Cl} * 1px) solid ${Md};
        border-radius: 50%;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        transition: all 0.1s ease-in-out;
    }

    .next,
    .previous {
        position: relative;
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
        display: grid;
    }

    :host([disabled]) {
        opacity: ${kl};
        cursor: ${"not-allowed"};
        fill: currentcolor;
        color: ${bc};
        pointer-events: none;
    }

    :host([disabled])::before,
    :host([disabled]:hover)::before,
    :host([disabled]:active)::before {
        background: ${nc};
        border-color: ${xc};
    }

    :host(:hover) {
        color: ${Bd};
    }

    :host(:hover)::before {
        background: ${Rd};
        border-color: ${Rd};
    }

    :host(:active) {
        color: ${Vd};
    }

    :host(:active)::before {
        background: ${Dd};
        border-color: ${Dd};
    }

    :host(:${ha}) {
        outline: none;
    }

    :host(:${ha})::before {
        box-shadow: 0 0 0 calc((${$l} - ${Cl}) * 1px) ${uc} inset,
            0 0 0 calc((${$l} + ${Cl}) * 1px) ${mc} inset;
        border-color: ${uc};
    }

    :host::-moz-focus-inner {
        border: 0;
    }
`.withBehaviors(la(Yt`
            :host {
                background: ${Ao.Canvas};
            }
            :host .next,
            :host .previous {
                color: ${Ao.ButtonText};
                fill: currentcolor;
            }
            :host::before {
                background: ${Ao.Canvas};
                border-color: ${Ao.ButtonText};
            }
            :host(:hover)::before {
                forced-color-adjust: none;
                background: ${Ao.Highlight};
                border-color: ${Ao.ButtonText};
                opacity: 1;
            }
            :host(:hover) .next,
            :host(:hover) .previous  {
                forced-color-adjust: none;
                color: ${Ao.HighlightText};
                fill: currentcolor;
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host([disabled])::before,
            :host([disabled]:hover)::before,
            :host([disabled]) .next,
            :host([disabled]) .previous {
                forced-color-adjust: none;
                background: ${Ao.Canvas};
                border-color: ${Ao.GrayText};
                color: ${Ao.GrayText};
                fill: ${Ao.GrayText};
            }
            :host(:${ha})::before {
                forced-color-adjust: none;
                border-color: ${Ao.Highlight};
                box-shadow: 0 0 0 calc((${$l} - ${Cl}) * 1px) ${Ao.Highlight} inset;
            }
        `)),next:'\n        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">\n            <path\n                d="M4.023 15.273L11.29 8 4.023.727l.704-.704L12.71 8l-7.984 7.977-.704-.704z"\n            />\n        </svg>\n    ',previous:'\n        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">\n            <path\n                d="M11.273 15.977L3.29 8 11.273.023l.704.704L4.71 8l7.266 7.273-.704.704z"\n            />\n        </svg>\n    '});const Qc=Yt`
    .scroll-prev {
        right: auto;
        left: 0;
    }

    .scroll.scroll-next::before,
    .scroll-next .scroll-action {
        left: auto;
        right: 0;
    }

    .scroll.scroll-next::before {
        background: linear-gradient(to right, transparent, var(--scroll-fade-next));
    }

    .scroll-next .scroll-action {
        transform: translate(50%, -50%);
    }
`,Jc=Yt`
    .scroll.scroll-next {
        right: auto;
        left: 0;
    }

    .scroll.scroll-next::before {
        background: linear-gradient(to right, var(--scroll-fade-next), transparent);
        left: auto;
        right: 0;
    }

    .scroll.scroll-prev::before {
        background: linear-gradient(to right, transparent, var(--scroll-fade-previous));
    }

    .scroll-prev .scroll-action {
        left: auto;
        right: 0;
        transform: translate(50%, -50%);
    }
`,eh=Yt`
    .scroll-area {
        position: relative;
    }

    div.scroll-view {
        overflow-x: hidden;
    }

    .scroll {
        bottom: 0;
        pointer-events: none;
        position: absolute;
        right: 0;
        top: 0;
        user-select: none;
        width: 100px;
    }

    .scroll.disabled {
        display: none;
    }

    .scroll::before,
    .scroll-action {
        left: 0;
        position: absolute;
    }

    .scroll::before {
        background: linear-gradient(to right, var(--scroll-fade-previous), transparent);
        content: "";
        display: block;
        height: 100%;
        width: 100%;
    }

    .scroll-action {
        pointer-events: auto;
        right: auto;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`.withBehaviors(new Rc(Qc,Jc));(class extends hs{connectedCallback(){super.connectedCallback(),"mobile"!==this.view&&this.$fastController.addStyles(eh)}}).compose({baseName:"horizontal-scroll",baseClass:hs,template:(e,t)=>{var i,o;return Tt`
    <template
        class="horizontal-scroll"
        @keyup="${(e,t)=>e.keyupHandler(t.event)}"
    >
        ${_i(0,t)}
        <div class="scroll-area" part="scroll-area">
            <div
                class="scroll-view"
                part="scroll-view"
                @scroll="${e=>e.scrolled()}"
                ${di("scrollContainer")}
            >
                <div class="content-container" part="content-container" ${di("content")}>
                    <slot
                        ${xi({property:"scrollItems",filter:vi()})}
                    ></slot>
                </div>
            </div>
            ${ci((e=>"mobile"!==e.view),Tt`
                    <div
                        class="scroll scroll-prev"
                        part="scroll-prev"
                        ${di("previousFlipperContainer")}
                    >
                        <div class="scroll-action" part="scroll-action-previous">
                            <slot name="previous-flipper">
                                ${t.previousFlipper instanceof Function?t.previousFlipper(e,t):null!==(i=t.previousFlipper)&&void 0!==i?i:""}
                            </slot>
                        </div>
                    </div>
                    <div
                        class="scroll scroll-next"
                        part="scroll-next"
                        ${di("nextFlipperContainer")}
                    >
                        <div class="scroll-action" part="scroll-action-next">
                            <slot name="next-flipper">
                                ${t.nextFlipper instanceof Function?t.nextFlipper(e,t):null!==(o=t.nextFlipper)&&void 0!==o?o:""}
                            </slot>
                        </div>
                    </div>
                `)}
        </div>
        ${$i(0,t)}
    </template>
`},styles:(e,t)=>Yt`
    ${ca("block")} :host {
        --scroll-align: center;
        --scroll-item-spacing: 5px;
        contain: layout;
        position: relative;
    }

    .scroll-view {
        overflow-x: auto;
        scrollbar-width: none;
    }

    ::-webkit-scrollbar {
        display: none;
    }

    .content-container {
        align-items: var(--scroll-align);
        display: inline-flex;
        flex-wrap: nowrap;
        position: relative;
    }

    .content-container ::slotted(*) {
        margin-right: var(--scroll-item-spacing);
    }

    .content-container ::slotted(*:last-child) {
        margin-right: 0;
    }
`,nextFlipper:e=>Tt`
        <${e.tagFor(Mn)}
            @click="${e=>e.scrollToNext()}"
            aria-hidden="${e=>e.flippersHiddenFromAT}"
        ></${e.tagFor(Mn)}>
    `,previousFlipper:e=>Tt`
        <${e.tagFor(Mn)}
            @click="${e=>e.scrollToPrevious()}"
            direction="previous"
            aria-hidden="${e=>e.flippersHiddenFromAT}"
        ></${e.tagFor(Mn)}>
    `});const th=(e,t)=>Yt`
        ${ca("inline-flex")} :host {
            align-items: center;
            font-family: ${ml};
            border-radius: calc(${bl} * 1px);
            border: calc(${$l} * 1px) solid transparent;
            box-sizing: border-box;
            background: ${nc};
            color: ${bc};
            cursor: pointer;
            flex: 0 0 auto;
            fill: currentcolor;
            font-size: ${_l};
            height: calc(${Tc} * 1px);
            line-height: ${Sl};
            margin: 0 calc((${xl} - ${$l}) * 1px);
            outline: none;
            overflow: hidden;
            padding: 0 1ch;
            user-select: none;
            white-space: nowrap;
        }

        :host(:not([disabled]):not([aria-selected="true"]):hover) {
            background: ${sc};
        }

        :host(:not([disabled]):not([aria-selected="true"]):active) {
            background: ${ac};
        }

        :host([aria-selected="true"]) {
            background: ${Md};
            color: ${Hd};
        }

        :host(:not([disabled])[aria-selected="true"]:hover) {
            background: ${Rd};
            color: ${Bd};
        }

        :host(:not([disabled])[aria-selected="true"]:active) {
            background: ${Dd};
            color: ${Vd};
        }

        :host([disabled]) {
            cursor: ${"not-allowed"};
            opacity: ${kl};
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
            height: calc(${xl} * 4px);
            width: calc(${xl} * 4px);
        }

        ::slotted([slot="end"]) {
            margin-inline-start: 1ch;
        }

        ::slotted([slot="start"]) {
            margin-inline-end: 1ch;
        }

        :host([aria-checked="true"][aria-selected="false"]) {
            border-color: ${uc};
        }

        :host([aria-checked="true"][aria-selected="true"]) {
            border-color: ${uc};
            box-shadow: 0 0 0 calc(${$l} * 2 * 1px) inset
                ${mc};
        }
    `.withBehaviors(la(Yt`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${Ao.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${Ao.Highlight};
                    color: ${Ao.HighlightText};
                }

                :host([disabled]),
                :host([disabled][aria-selected="false"]:hover) {
                    background: ${Ao.Canvas};
                    color: ${Ao.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }

                :host([aria-checked="true"][aria-selected="false"]) {
                    background: ${Ao.ButtonFace};
                    color: ${Ao.ButtonText};
                    border-color: ${Ao.ButtonText};
                }

                :host([aria-checked="true"][aria-selected="true"]),
                :host([aria-checked="true"][aria-selected="true"]:hover) {
                    background: ${Ao.Highlight};
                    color: ${Ao.HighlightText};
                    border-color: ${Ao.ButtonText};
                }
            `)),ih=Er.compose({baseName:"option",template:(e,t)=>Tt`
    <template
        aria-checked="${e=>e.ariaChecked}"
        aria-disabled="${e=>e.ariaDisabled}"
        aria-posinset="${e=>e.ariaPosInSet}"
        aria-selected="${e=>e.ariaSelected}"
        aria-setsize="${e=>e.ariaSetSize}"
        class="${e=>[e.checked&&"checked",e.selected&&"selected",e.disabled&&"disabled"].filter(Boolean).join(" ")}"
        role="option"
    >
        ${_i(0,t)}
        <span class="content" part="content">
            <slot ${xi("content")}></slot>
        </span>
        ${$i(0,t)}
    </template>
`,styles:th});(class extends Rn{sizeChanged(e,t){super.sizeChanged(e,t),this.updateComputedStylesheet()}updateComputedStylesheet(){this.computedStylesheet&&this.$fastController.removeStyles(this.computedStylesheet);const e=`${this.size}`;this.computedStylesheet=Yt`
            :host {
                --size: ${e};
            }
        `,this.$fastController.addStyles(this.computedStylesheet)}}).compose({baseName:"listbox",baseClass:Rn,template:(e,t)=>Tt`
    <template
        aria-activedescendant="${e=>e.ariaActiveDescendant}"
        aria-multiselectable="${e=>e.ariaMultiSelectable}"
        class="listbox"
        role="listbox"
        tabindex="${e=>e.disabled?null:"0"}"
        @click="${(e,t)=>e.clickHandler(t.event)}"
        @focusin="${(e,t)=>e.focusinHandler(t.event)}"
        @keydown="${(e,t)=>e.keydownHandler(t.event)}"
        @mousedown="${(e,t)=>e.mousedownHandler(t.event)}"
    >
        <slot
            ${xi({filter:Rn.slottedOptionFilter,flatten:!0,property:"slottedOptions"})}
        ></slot>
    </template>
`,styles:Wc}),Zn.compose({baseName:"menu-item",template:(e,t)=>Tt`
    <template
        role="${e=>e.role}"
        aria-haspopup="${e=>e.hasSubmenu?"menu":void 0}"
        aria-checked="${e=>e.role!==qn?e.checked:void 0}"
        aria-disabled="${e=>e.disabled}"
        aria-expanded="${e=>e.expanded}"
        @keydown="${(e,t)=>e.handleMenuItemKeyDown(t.event)}"
        @click="${(e,t)=>e.handleMenuItemClick(t.event)}"
        @mouseover="${(e,t)=>e.handleMouseOver(t.event)}"
        @mouseout="${(e,t)=>e.handleMouseOut(t.event)}"
        class="${e=>e.disabled?"disabled":""} ${e=>e.expanded?"expanded":""} ${e=>`indent-${e.startColumnCount}`}"
    >
            ${ci((e=>e.role===Gn),Tt`
                    <div part="input-container" class="input-container">
                        <span part="checkbox" class="checkbox">
                            <slot name="checkbox-indicator">
                                ${t.checkboxIndicator||""}
                            </slot>
                        </span>
                    </div>
                `)}
            ${ci((e=>e.role===Xn),Tt`
                    <div part="input-container" class="input-container">
                        <span part="radio" class="radio">
                            <slot name="radio-indicator">
                                ${t.radioIndicator||""}
                            </slot>
                        </span>
                    </div>
                `)}
        </div>
        ${_i(0,t)}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${$i(0,t)}
        ${ci((e=>e.hasSubmenu),Tt`
                <div
                    part="expand-collapse-glyph-container"
                    class="expand-collapse-glyph-container"
                >
                    <span part="expand-collapse" class="expand-collapse">
                        <slot name="expand-collapse-indicator">
                            ${t.expandCollapseGlyph||""}
                        </slot>
                    </span>
                </div>
            `)}
        ${ci((e=>e.expanded),Tt`
                <${e.tagFor(Po)}
                    :anchorElement="${e=>e}"
                    vertical-positioning-mode="dynamic"
                    vertical-default-position="bottom"
                    vertical-inset="true"
                    horizontal-positioning-mode="dynamic"
                    horizontal-default-position="end"
                    class="submenu-region"
                    dir="${e=>e.currentDirection}"
                    @loaded="${e=>e.submenuLoaded()}"
                    ${di("submenuRegion")}
                    part="submenu-region"
                >
                    <slot name="submenu"></slot>
                </${e.tagFor(Po)}>
            `)}
    </template>
`,styles:(e,t)=>Yt`
        ${ca("grid")} :host {
            contain: layout;
            overflow: visible;
            font-family: ${ml};
            outline: none;
            box-sizing: border-box;
            height: calc(${Tc} * 1px);
            grid-template-columns: minmax(42px, auto) 1fr minmax(42px, auto);
            grid-template-rows: auto;
            justify-items: center;
            align-items: center;
            padding: 0;
            margin: 0 calc(${xl} * 1px);
            white-space: nowrap;
            background: ${nc};
            color: ${bc};
            fill: currentcolor;
            cursor: pointer;
            font-size: ${_l};
            line-height: ${Sl};
            border-radius: calc(${bl} * 1px);
            border: calc(${$l} * 1px) solid transparent;
        }

        :host(:hover) {
            position: relative;
            z-index: 1;
        }

        :host(.indent-0) {
            grid-template-columns: auto 1fr minmax(42px, auto);
        }
        :host(.indent-0) .content {
            grid-column: 1;
            grid-row: 1;
            margin-inline-start: 10px;
        }
        :host(.indent-0) .expand-collapse-glyph-container {
            grid-column: 5;
            grid-row: 1;
        }
        :host(.indent-2) {
            grid-template-columns: minmax(42px, auto) minmax(42px, auto) 1fr minmax(42px, auto) minmax(42px, auto);
        }
        :host(.indent-2) .content {
            grid-column: 3;
            grid-row: 1;
            margin-inline-start: 10px;
        }
        :host(.indent-2) .expand-collapse-glyph-container {
            grid-column: 5;
            grid-row: 1;
        }
        :host(.indent-2) .start {
            grid-column: 2;
        }
        :host(.indent-2) .end {
            grid-column: 4;
        }

        :host(:${ha}) {
            border-color: ${uc};
            background: ${lc};
            color: ${bc};
        }

        :host(:hover) {
            background: ${sc};
            color: ${bc};
        }

        :host(:active) {
            background: ${ac};
        }

        :host([aria-checked="true"]),
        :host(.expanded) {
            background: ${Yd};
            color: ${bc};
        }

        :host([disabled]) {
            cursor: ${"not-allowed"};
            opacity: ${kl};
        }

        :host([disabled]:hover) {
            color: ${bc};
            fill: currentcolor;
            background: ${nc};
        }

        :host([disabled]:hover) .start,
        :host([disabled]:hover) .end,
        :host([disabled]:hover)::slotted(svg) {
            fill: ${bc};
        }

        .expand-collapse-glyph {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: 16px;
            height: 16px;
            fill: currentcolor;
        }

        .content {
            grid-column-start: 2;
            justify-self: start;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .start,
        .end {
            display: flex;
            justify-content: center;
        }

        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: 16px;
            height: 16px;
        }

        :host(:hover) .start,
        :host(:hover) .end,
        :host(:hover)::slotted(svg),
        :host(:active) .start,
        :host(:active) .end,
        :host(:active)::slotted(svg) {
            fill: ${bc};
        }

        :host(.indent-0[aria-haspopup="menu"]) {
            display: grid;
            grid-template-columns: minmax(42px, auto) auto 1fr minmax(42px, auto) minmax(42px, auto);
            align-items: center;
            min-height: 32px;
        }

        :host(.indent-1[aria-haspopup="menu"]),
        :host(.indent-1[role="menuitemcheckbox"]),
        :host(.indent-1[role="menuitemradio"]) {
            display: grid;
            grid-template-columns: minmax(42px, auto) auto 1fr minmax(42px, auto) minmax(42px, auto);
            align-items: center;
            min-height: 32px;
        }

        :host(.indent-2:not([aria-haspopup="menu"])) .end {
            grid-column: 5;
        }

        :host .input-container,
        :host .expand-collapse-glyph-container {
            display: none;
        }

        :host([aria-haspopup="menu"]) .expand-collapse-glyph-container,
        :host([role="menuitemcheckbox"]) .input-container,
        :host([role="menuitemradio"]) .input-container {
            display: grid;
            margin-inline-end: 10px;
        }

        :host([aria-haspopup="menu"]) .content,
        :host([role="menuitemcheckbox"]) .content,
        :host([role="menuitemradio"]) .content {
            grid-column-start: 3;
        }

        :host([aria-haspopup="menu"].indent-0) .content {
            grid-column-start: 1;
        }

        :host([aria-haspopup="menu"]) .end,
        :host([role="menuitemcheckbox"]) .end,
        :host([role="menuitemradio"]) .end {
            grid-column-start: 4;
        }

        :host .expand-collapse,
        :host .checkbox,
        :host .radio {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 20px;
            height: 20px;
            box-sizing: border-box;
            outline: none;
            margin-inline-start: 10px;
        }

        :host .checkbox,
        :host .radio {
            border: calc(${Cl} * 1px) solid ${bc};
        }

        :host([aria-checked="true"]) .checkbox,
        :host([aria-checked="true"]) .radio {
            background: ${Md};
            border-color: ${Md};
        }

        :host .checkbox {
            border-radius: calc(${bl} * 1px);
        }

        :host .radio {
            border-radius: 999px;
        }

        :host .checkbox-indicator,
        :host .radio-indicator,
        :host .expand-collapse-indicator,
        ::slotted([slot="checkbox-indicator"]),
        ::slotted([slot="radio-indicator"]),
        ::slotted([slot="expand-collapse-indicator"]) {
            display: none;
        }

        ::slotted([slot="end"]:not(svg)) {
            margin-inline-end: 10px;
            color: ${gc}
        }

        :host([aria-checked="true"]) .checkbox-indicator,
        :host([aria-checked="true"]) ::slotted([slot="checkbox-indicator"]) {
            width: 100%;
            height: 100%;
            display: block;
            fill: ${Hd};
            pointer-events: none;
        }

        :host([aria-checked="true"]) .radio-indicator {
            position: absolute;
            top: 4px;
            left: 4px;
            right: 4px;
            bottom: 4px;
            border-radius: 999px;
            display: block;
            background: ${Hd};
            pointer-events: none;
        }

        :host([aria-checked="true"]) ::slotted([slot="radio-indicator"]) {
            display: block;
            pointer-events: none;
        }
    `.withBehaviors(la(Yt`
            :host {
                border-color: transparent;
                color: ${Ao.ButtonText};
                forced-color-adjust: none;
            }

            :host(:hover) {
                background: ${Ao.Highlight};
                color: ${Ao.HighlightText};
            }

            :host(:hover) .start,
            :host(:hover) .end,
            :host(:hover)::slotted(svg),
            :host(:active) .start,
            :host(:active) .end,
            :host(:active)::slotted(svg) {
                fill: ${Ao.HighlightText};
            }

            :host(.expanded) {
                background: ${Ao.Highlight};
                border-color: ${Ao.Highlight};
                color: ${Ao.HighlightText};
            }

            :host(:${ha}) {
                background: ${Ao.Highlight};
                border-color: ${Ao.ButtonText};
                box-shadow: 0 0 0 calc(${$l} * 1px) inset ${Ao.HighlightText};
                color: ${Ao.HighlightText};
                fill: currentcolor;
            }

            :host([disabled]),
            :host([disabled]:hover),
            :host([disabled]:hover) .start,
            :host([disabled]:hover) .end,
            :host([disabled]:hover)::slotted(svg) {
                background: ${Ao.Canvas};
                color: ${Ao.GrayText};
                fill: currentcolor;
                opacity: 1;
            }

            :host .expanded-toggle,
            :host .checkbox,
            :host .radio{
                border-color: ${Ao.ButtonText};
                background: ${Ao.HighlightText};
            }

            :host([checked="true"]) .checkbox,
            :host([checked="true"]) .radio {
                background: ${Ao.HighlightText};
                border-color: ${Ao.HighlightText};
            }

            :host(:hover) .expanded-toggle,
            :host(:hover) .checkbox,
            :host(:hover) .radio,
            :host(:${ha}) .expanded-toggle,
            :host(:${ha}) .checkbox,
            :host(:${ha}) .radio,
            :host([checked="true"]:hover) .checkbox,
            :host([checked="true"]:hover) .radio,
            :host([checked="true"]:${ha}) .checkbox,
            :host([checked="true"]:${ha}) .radio {
                border-color: ${Ao.HighlightText};
            }

            :host([aria-checked="true"]) {
                background: ${Ao.Highlight};
                color: ${Ao.HighlightText};
            }

            :host([aria-checked="true"]) .checkbox-indicator,
            :host([aria-checked="true"]) ::slotted([slot="checkbox-indicator"]),
            :host([aria-checked="true"]) ::slotted([slot="radio-indicator"]) {
                fill: ${Ao.Highlight};
            }

            :host([aria-checked="true"]) .radio-indicator {
                background: ${Ao.Highlight};
            }

            ::slotted([slot="end"]:not(svg)) {
                color: ${Ao.ButtonText};
            }

            :host(:hover) ::slotted([slot="end"]:not(svg)),
            :host(:${ha}) ::slotted([slot="end"]:not(svg)) {
                color: ${Ao.HighlightText};
            }
        `),new Rc(Yt`
                .expand-collapse-glyph {
                    transform: rotate(0deg);
                }
            `,Yt`
                .expand-collapse-glyph {
                    transform: rotate(180deg);
                }
            `)),checkboxIndicator:'\n        <svg\n            part="checkbox-indicator"\n            class="checkbox-indicator"\n            viewBox="0 0 20 20"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n                fill-rule="evenodd"\n                clip-rule="evenodd"\n                d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"\n            />\n        </svg>\n    ',expandCollapseGlyph:'\n        <svg\n            viewBox="0 0 16 16"\n            xmlns="http://www.w3.org/2000/svg"\n            class="expand-collapse-glyph"\n            part="expand-collapse-glyph"\n        >\n            <path\n                d="M5.00001 12.3263C5.00124 12.5147 5.05566 12.699 5.15699 12.8578C5.25831 13.0167 5.40243 13.1437 5.57273 13.2242C5.74304 13.3047 5.9326 13.3354 6.11959 13.3128C6.30659 13.2902 6.4834 13.2152 6.62967 13.0965L10.8988 8.83532C11.0739 8.69473 11.2153 8.51658 11.3124 8.31402C11.4096 8.11146 11.46 7.88966 11.46 7.66499C11.46 7.44033 11.4096 7.21853 11.3124 7.01597C11.2153 6.81341 11.0739 6.63526 10.8988 6.49467L6.62967 2.22347C6.48274 2.10422 6.30501 2.02912 6.11712 2.00691C5.92923 1.9847 5.73889 2.01628 5.56823 2.09799C5.39757 2.17969 5.25358 2.30817 5.153 2.46849C5.05241 2.62882 4.99936 2.8144 5.00001 3.00369V12.3263Z"\n            />\n        </svg>\n    ',radioIndicator:'\n        <span part="radio-indicator" class="radio-indicator"></span>\n    '});(class extends Yn{connectedCallback(){super.connectedCallback(),Od.setValueFor(this,_d)}}).compose({baseName:"menu",template:(e,t)=>Tt`
    <template
        slot="${e=>e.slot?e.slot:e.isNestedMenu()?"submenu":void 0}"
        role="menu"
        @keydown="${(e,t)=>e.handleMenuKeyDown(t.event)}"
        @focusout="${(e,t)=>e.handleFocusOut(t.event)}"
    >
        <slot ${xi("items")}></slot>
    </template>
`,styles:(e,t)=>Yt`
        ${ca("block")} :host {
            --elevation: 11;
            background: ${Od};
            border: calc(${Cl} * 1px) solid transparent;
            ${Ec}
            margin: 0;
            border-radius: calc(${bl} * 1px);
            padding: calc(${xl} * 1px) 0;
            max-width: 368px;
            min-width: 64px;
        }

        :host([slot="submenu"]) {
            width: max-content;
            margin: 0 calc(${xl} * 1px);
        }

        ::slotted(hr) {
            box-sizing: content-box;
            height: 0;
            margin: 0;
            border: none;
            border-top: calc(${Cl} * 1px) solid ${_c};
        }
    `.withBehaviors(la(Yt`
                :host {
                    background: ${Ao.Canvas};
                    border-color: ${Ao.CanvasText};
                }
            `))});class oh extends ns{constructor(){super(...arguments),this.appearance="outline"}}Ei([Pt],oh.prototype,"appearance",void 0);oh.compose({baseName:"number-field",baseClass:ns,styles:(e,t)=>Yt`
    ${ca("inline-block")} :host {
        font-family: ${ml};
        outline: none;
        user-select: none;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: ${bc};
        background: ${tc};
        border-radius: calc(${bl} * 1px);
        border: calc(${Cl} * 1px) solid ${Md};
        height: calc(${Tc} * 1px);
        align-items: baseline;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        height: calc(100% - 4px);
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(${xl} * 2px + 1px);
        font-size: ${_l};
        line-height: ${Sl};
    }

    .control:hover,
    .control:${ha},
    .control:disabled,
    .control:active {
        outline: none;
    }

    .controls {
        opacity: 0;
    }

    .label {
        display: block;
        color: ${bc};
        cursor: pointer;
        font-size: ${_l};
        line-height: ${Sl};
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .start,
    .control,
    .controls,
    .end {
        align-self: center;
    }

    .start,
    .end {
        margin: auto;
        fill: currentcolor;
    }

    .step-up-glyph,
    .step-down-glyph {
        display: block;
        padding: 4px 10px;
        cursor: pointer;
    }

    .step-up-glyph:before,
    .step-down-glyph:before {
        content: '';
        display: block;
        border: solid transparent 6px;
    }

    .step-up-glyph:before {
        border-bottom-color: ${bc};
    }

    .step-down-glyph:before {
        border-top-color: ${bc};
    }

    ::slotted(svg) {
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
    }

    .start {
        margin-inline-start: 11px;
    }

    .end {
        margin-inline-end: 11px;
    }

    :host(:hover:not([disabled])) .root {
        background: ${ic};
        border-color: ${Rd};
    }

    :host(:active:not([disabled])) .root {
        background: ${ic};
        border-color: ${Dd};
    }

    :host(:focus-within:not([disabled])) .root {
        border-color: ${uc};
        box-shadow: 0 0 0 calc(${$l} * 1px) ${uc} inset;
    }

    :host(:hover:not([disabled])) .controls,
    :host(:focus-within:not([disabled])) .controls {
        opacity: 1;
    }

    :host([appearance="filled"]) .root {
        background: ${Yd};
    }

    :host([appearance="filled"]:hover:not([disabled])) .root {
        background: ${Qd};
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${"not-allowed"};
    }

    :host([disabled]) {
        opacity: ${kl};
    }

    :host([disabled]) .control {
        border-color: ${xc};
    }
`.withBehaviors(la(Yt`
                .root,
                :host([appearance="filled"]) .root {
                    forced-color-adjust: none;
                    background: ${Ao.Field};
                    border-color: ${Ao.FieldText};
                }
                :host(:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover) .root {
                    background: ${Ao.Field};
                    border-color: ${Ao.Highlight};
                }
                .start,
                .end {
                    fill: currentcolor;
                }
                :host([disabled]) {
                    opacity: 1;
                }
                :host([disabled]) .root,
                :host([appearance="filled"]:hover[disabled]) .root {
                    border-color: ${Ao.GrayText};
                    background: ${Ao.Field};
                }
                :host(:focus-within:enabled) .root {
                    border-color: ${Ao.Highlight};
                    box-shadow: 0 0 0 1px ${Ao.Highlight} inset;
                }
                input::placeholder {
                    color: ${Ao.GrayText};
                }
            `)),template:(e,t)=>Tt`
    <template class="${e=>e.readOnly?"readonly":""}">
        <label
            part="label"
            for="control"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot ${xi("defaultSlottedNodes")}></slot>
        </label>
        <div class="root" part="root">
            ${_i(0,t)}
            <input
                class="control"
                part="control"
                id="control"
                @input="${e=>e.handleTextInput()}"
                @change="${e=>e.handleChange()}"
                @keydown="${(e,t)=>e.handleKeyDown(t.event)}"
                @blur="${(e,t)=>e.handleBlur()}"
                ?autofocus="${e=>e.autofocus}"
                ?disabled="${e=>e.disabled}"
                list="${e=>e.list}"
                maxlength="${e=>e.maxlength}"
                minlength="${e=>e.minlength}"
                placeholder="${e=>e.placeholder}"
                ?readonly="${e=>e.readOnly}"
                ?required="${e=>e.required}"
                size="${e=>e.size}"
                type="text"
                inputmode="numeric"
                min="${e=>e.min}"
                max="${e=>e.max}"
                step="${e=>e.step}"
                aria-atomic="${e=>e.ariaAtomic}"
                aria-busy="${e=>e.ariaBusy}"
                aria-controls="${e=>e.ariaControls}"
                aria-current="${e=>e.ariaCurrent}"
                aria-describedby="${e=>e.ariaDescribedby}"
                aria-details="${e=>e.ariaDetails}"
                aria-disabled="${e=>e.ariaDisabled}"
                aria-errormessage="${e=>e.ariaErrormessage}"
                aria-flowto="${e=>e.ariaFlowto}"
                aria-haspopup="${e=>e.ariaHaspopup}"
                aria-hidden="${e=>e.ariaHidden}"
                aria-invalid="${e=>e.ariaInvalid}"
                aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
                aria-label="${e=>e.ariaLabel}"
                aria-labelledby="${e=>e.ariaLabelledby}"
                aria-live="${e=>e.ariaLive}"
                aria-owns="${e=>e.ariaOwns}"
                aria-relevant="${e=>e.ariaRelevant}"
                aria-roledescription="${e=>e.ariaRoledescription}"
                ${di("control")}
            />
            ${ci((e=>!e.hideStep&&!e.readOnly&&!e.disabled),Tt`
                    <div class="controls" part="controls">
                        <div class="step-up" part="step-up" @click="${e=>e.stepUp()}">
                            <slot name="step-up-glyph">
                                ${t.stepUpGlyph||""}
                            </slot>
                        </div>
                        <div
                            class="step-down"
                            part="step-down"
                            @click="${e=>e.stepDown()}"
                        >
                            <slot name="step-down-glyph">
                                ${t.stepDownGlyph||""}
                            </slot>
                        </div>
                    </div>
                `)}
            ${$i(0,t)}
        </div>
    </template>
`,shadowOptions:{delegatesFocus:!0},stepDownGlyph:'\n        <span class="step-down-glyph" part="step-down-glyph"></span>\n    ',stepUpGlyph:'\n        <span class="step-up-glyph" part="step-up-glyph"></span>\n    '}),Wn.compose({baseName:"picker",template:(e,t)=>{const i=e.tagFor(Po),o=e.tagFor(Dn),r=e.tagFor(Nn),n=e.tagFor(Nn),s=function(e){const t=e.tagFor(Bn);return Tt`
    <${t}
        value="${e=>e}"
        :contentsTemplate="${(e,t)=>t.parent.listItemContentsTemplate}"
    >
    </${t}>
    `}(e),a=function(e){const t=e.tagFor(Pn);return Tt`
    <${t}
        value="${e=>e}"
        :contentsTemplate="${(e,t)=>t.parent.menuOptionContentsTemplate}"
    >
    </${t}>
    `}(e);return Tt`
        <template
            :selectedListTag="${()=>r}"
            :menuTag="${()=>o}"
            :defaultListItemTemplate="${s}"
            :defaultMenuOptionTemplate="${a}"
            @focusin="${(e,t)=>e.handleFocusIn(t.event)}"
            @focusout="${(e,t)=>e.handleFocusOut(t.event)}"
            @keydown="${(e,t)=>e.handleKeyDown(t.event)}"
            @pickeriteminvoked="${(e,t)=>e.handleItemInvoke(t.event)}"
            @pickeroptioninvoked="${(e,t)=>e.handleOptionInvoke(t.event)}"
        >
            <slot name="list-region"></slot>

            ${ci((e=>e.flyoutOpen),Tt`
                <${i}
                    class="region"
                    part="region"
                    auto-update-mode="${e=>e.menuConfig.autoUpdateMode}"
                    fixed-placement="${e=>e.menuConfig.fixedPlacement}"
                    vertical-positioning-mode="${e=>e.menuConfig.verticalPositioningMode}"
                    vertical-default-position="${e=>e.menuConfig.verticalDefaultPosition}"
                    vertical-scaling="${e=>e.menuConfig.verticalScaling}"
                    vertical-inset="${e=>e.menuConfig.verticalInset}"
                    vertical-viewport-lock="${e=>e.menuConfig.verticalViewportLock}"
                    horizontal-positioning-mode="${e=>e.menuConfig.horizontalPositioningMode}"
                    horizontal-default-position="${e=>e.menuConfig.horizontalDefaultPosition}"
                    horizontal-scaling="${e=>e.menuConfig.horizontalScaling}"
                    horizontal-inset="${e=>e.menuConfig.horizontalInset}"
                    horizontal-viewport-lock="${e=>e.menuConfig.horizontalViewportLock}"
                    @loaded="${(e,t)=>e.handleRegionLoaded(t.event)}"
                    ${di("region")}
                >
                    ${ci((e=>!e.showNoOptions&&!e.showLoading),Tt`
                            <slot name="menu-region"></slot>
                        `)}
                    ${ci((e=>e.showNoOptions&&!e.showLoading),Tt`
                            <div class="no-options-display" part="no-options-display">
                                <slot name="no-options-region">
                                    ${e=>e.noSuggestionsText}
                                </slot>
                            </div>
                        `)}
                    ${ci((e=>e.showLoading),Tt`
                            <div class="loading-display" part="loading-display">
                                <slot name="loading-region">
                                    <${n}
                                        part="loading-progress"
                                        class="loading-progress
                                        slot="loading-region"
                                    ></${n}>
                                        ${e=>e.loadingText}
                                </slot>
                            </div>
                        `)}
                </${i}>
            `)}
        </template>
    `},styles:(e,t)=>Yt`
        .region {
            z-index: 1000;
            overflow: hidden;
            display: flex;
            font-family: ${ml};
            font-size: ${_l};
        }

        .loaded {
            opacity: 1;
            pointer-events: none;
        }

        .loading-display,
        .no-options-display {
            background: ${Od};
            width: 100%;
            min-height: calc(${Tc} * 1px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-items: center;
            padding: calc(${xl} * 1px);
        }

        .loading-progress {
            width: 42px;
            height: 42px;
        }

        .bottom {
            flex-direction: column;
        }

        .top {
            flex-direction: column-reverse;
        }
    `,shadowOptions:{}});(class extends Dn{connectedCallback(){Od.setValueFor(this,_d),super.connectedCallback()}}).compose({baseName:"picker-menu",baseClass:Dn,template:(e,t)=>Tt`
        <template role="list" slot="menu-region">
            <div class="options-display" part="options-display">
                <div class="header-region" part="header-region">
                    <slot name="header-region" ${xi("headerElements")}></slot>
                </div>

                <slot ${xi("menuElements")}></slot>
                <div class="footer-region" part="footer-region">
                    <slot name="footer-region" ${xi("footerElements")}></slot>
                </div>
                <div
                    role="alert"
                    aria-live="polite"
                    part="suggestions-available-alert"
                    class="suggestions-available-alert"
                >
                    ${e=>e.suggestionsAvailableText}
                </div>
            </div>
        </template>
    `,styles:(e,t)=>Yt`
        :host {
            background: ${Od};
            --elevation: 11;
            /* TODO: a mechanism to manage z-index across components
            https://github.com/microsoft/fast/issues/3813 */
            z-index: 1000;
            display: flex;
            width: 100%;
            max-height: 100%;
            min-height: 58px;
            box-sizing: border-box;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            pointer-events: auto;
            border-radius: calc(${bl} * 1px);
            padding: calc(${xl} * 1px) 0;
            border: calc(${Cl} * 1px) solid transparent;
            ${Ec}
        }

        .suggestions-available-alert {
            height: 0;
            opacity: 0;
            overflow: hidden;
        }
    `.withBehaviors(la(Yt`
                :host {
                    background: ${Ao.Canvas};
                    border-color: ${Ao.CanvasText};
                }
            `))}),Pn.compose({baseName:"picker-menu-option",template:(e,t)=>Tt`
        <template
            role="listitem"
            tabindex="-1"
            @click="${(e,t)=>e.handleClick(t.event)}"
        >
            <slot></slot>
        </template>
    `,styles:(e,t)=>Yt`
        :host {
            display: flex;
            align-items: center;
            justify-items: center;
            font-family: ${ml};
            border-radius: calc(${bl} * 1px);
            border: calc(${$l} * 1px) solid transparent;
            box-sizing: border-box;
            background: ${nc};
            color: ${bc};
            cursor: pointer;
            fill: currentcolor;
            font-size: ${_l};
            min-height: calc(${Tc} * 1px);
            line-height: ${Sl};
            margin: 0 calc(${xl} * 1px);
            outline: none;
            overflow: hidden;
            padding: 0 calc(${xl} * 2.25px);
            user-select: none;
            white-space: nowrap;
        }

        :host(:${ha}[role="listitem"]) {
            border-color: ${uc};
            background: ${lc};
        }

        :host(:hover) {
            background: ${sc};
        }

        :host(:active) {
            background: ${ac};
        }

        :host([aria-selected="true"]) {
            background: ${Md};
            color: ${Hd};
        }

        :host([aria-selected="true"]:hover) {
            background: ${Rd};
            color: ${Bd};
        }

        :host([aria-selected="true"]:active) {
            background: ${Dd};
            color: ${Vd};
        }
    `.withBehaviors(la(Yt`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${Ao.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${Ao.Highlight};
                    color: ${Ao.HighlightText};
                }

                :host([disabled]),
                :host([disabled]:not([aria-selected="true"]):hover) {
                    background: ${Ao.Canvas};
                    color: ${Ao.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }
            `))}),Nn.compose({baseName:"picker-list",template:(e,t)=>Tt`
        <template slot="list-region" role="list" class="picker-list">
            <slot></slot>
            <slot name="input-region"></slot>
        </template>
    `,styles:(e,t)=>Yt`
        :host {
            display: flex;
            flex-direction: row;
            column-gap: calc(${xl} * 1px);
            row-gap: calc(${xl} * 1px);
            flex-wrap: wrap;
        }

        ::slotted([role="combobox"]) {
            min-width: 260px;
            width: auto;
            box-sizing: border-box;
            color: ${bc};
            background: ${tc};
            border-radius: calc(${bl} * 1px);
            border: calc(${Cl} * 1px) solid ${Md};
            height: calc(${Tc} * 1px);
            font-family: ${ml};
            outline: none;
            user-select: none;
            font-size: ${_l};
            line-height: ${Sl};
            padding: 0 calc(${xl} * 2px + 1px);
        }

        ::slotted([role="combobox"]:active) { {
            background: ${ic};
            border-color: ${Dd};
        }

        ::slotted([role="combobox"]:focus-within) {
            border-color: ${uc};
            box-shadow: 0 0 0 1px ${uc} inset;
        }
    `.withBehaviors(la(Yt`
                ::slotted([role="combobox"]:active) {
                    background: ${Ao.Field};
                    border-color: ${Ao.Highlight};
                }
                ::slotted([role="combobox"]:focus-within) {
                    border-color: ${Ao.Highlight};
                    box-shadow: 0 0 0 1px ${Ao.Highlight} inset;
                }
                ::slotted(input:placeholder) {
                    color: ${Ao.GrayText};
                }
            `))}),Bn.compose({baseName:"picker-list-item",template:(e,t)=>Tt`
        <template
            role="listitem"
            tabindex="0"
            @click="${(e,t)=>e.handleClick(t.event)}"
            @keydown="${(e,t)=>e.handleKeyDown(t.event)}"
        >
            <slot></slot>
        </template>
    `,styles:(e,t)=>Yt`
        :host {
            display: flex;
            align-items: center;
            justify-items: center;
            font-family: ${ml};
            border-radius: calc(${bl} * 1px);
            border: calc(${$l} * 1px) solid transparent;
            box-sizing: border-box;
            background: ${nc};
            color: ${bc};
            cursor: pointer;
            fill: currentcolor;
            font-size: ${_l};
            height: calc(${Tc} * 1px);
            line-height: ${Sl};
            outline: none;
            overflow: hidden;
            padding: 0 calc(${xl} * 2.25px);
            user-select: none;
            white-space: nowrap;
        }

        :host(:hover) {
            background: ${sc};
        }

        :host(:active) {
            background: ${ac};
        }

        :host(:${ha}) {
            background: ${lc};
            border-color: ${uc};
        }

        :host([aria-selected="true"]) {
            background: ${Md};
            color: ${Vd};
        }
    `.withBehaviors(la(Yt`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${Ao.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${Ao.Highlight};
                    color: ${Ao.HighlightText};
                }

                :host([disabled]),
                :host([disabled]:not([aria-selected="true"]):hover) {
                    background: ${Ao.Canvas};
                    color: ${Ao.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }
            `))}),ss.compose({baseName:"progress-ring",template:(e,t)=>Tt`
    <template
        role="progressbar"
        aria-valuenow="${e=>e.value}"
        aria-valuemin="${e=>e.min}"
        aria-valuemax="${e=>e.max}"
        class="${e=>e.paused?"paused":""}"
    >
        ${ci((e=>"number"==typeof e.value),Tt`
                <svg
                    class="progress"
                    part="progress"
                    viewBox="0 0 16 16"
                    slot="determinate"
                >
                    <circle
                        class="background"
                        part="background"
                        cx="8px"
                        cy="8px"
                        r="7px"
                    ></circle>
                    <circle
                        class="determinate"
                        part="determinate"
                        style="stroke-dasharray: ${e=>44*e.percentComplete/100}px ${44}px"
                        cx="8px"
                        cy="8px"
                        r="7px"
                    ></circle>
                </svg>
            `)}
        ${ci((e=>"number"!=typeof e.value),Tt`
                <slot name="indeterminate" slot="indeterminate">
                    ${t.indeterminateIndicator||""}
                </slot>
            `)}
    </template>
`,styles:(e,t)=>Yt`
        ${ca("flex")} :host {
            align-items: center;
            outline: none;
            height: calc(${Tc} * 1px);
            width: calc(${Tc} * 1px);
            margin: calc(${Tc} * 1px) 0;
        }

        .progress {
            height: 100%;
            width: 100%;
        }

        .background {
            stroke: ${Yd};
            fill: none;
            stroke-width: 2px;
        }

        .determinate {
            stroke: ${Gd};
            fill: none;
            stroke-width: 2px;
            stroke-linecap: round;
            transform-origin: 50% 50%;
            transform: rotate(-90deg);
            transition: all 0.2s ease-in-out;
        }

        .indeterminate-indicator-1 {
            stroke: ${Gd};
            fill: none;
            stroke-width: 2px;
            stroke-linecap: round;
            transform-origin: 50% 50%;
            transform: rotate(-90deg);
            transition: all 0.2s ease-in-out;
            animation: spin-infinite 2s linear infinite;
        }

        :host([paused]) .indeterminate-indicator-1 {
            animation-play-state: paused;
            stroke: ${Yd};
        }

        :host([paused]) .determinate {
            stroke: ${gc};
        }

        @keyframes spin-infinite {
            0% {
                stroke-dasharray: 0.01px 43.97px;
                transform: rotate(0deg);
            }
            50% {
                stroke-dasharray: 21.99px 21.99px;
                transform: rotate(450deg);
            }
            100% {
                stroke-dasharray: 0.01px 43.97px;
                transform: rotate(1080deg);
            }
        }
    `.withBehaviors(la(Yt`
                .indeterminate-indicator-1,
                .determinate {
                    stroke: ${Ao.FieldText};
                }
                .background {
                    stroke: ${Ao.Field};
                }
                :host([paused]) .indeterminate-indicator-1 {
                    stroke: ${Ao.Field};
                }
                :host([paused]) .determinate {
                    stroke: ${Ao.GrayText};
                }
            `)),indeterminateIndicator:'\n        <svg class="progress" part="progress" viewBox="0 0 16 16">\n            <circle\n                class="background"\n                part="background"\n                cx="8px"\n                cy="8px"\n                r="7px"\n            ></circle>\n            <circle\n                class="indeterminate-indicator-1"\n                part="indeterminate-indicator-1"\n                cx="8px"\n                cy="8px"\n                r="7px"\n            ></circle>\n        </svg>\n    '}),ss.compose({baseName:"progress",template:(e,t)=>Tt`
    <template
        role="progressbar"
        aria-valuenow="${e=>e.value}"
        aria-valuemin="${e=>e.min}"
        aria-valuemax="${e=>e.max}"
        class="${e=>e.paused?"paused":""}"
    >
        ${ci((e=>"number"==typeof e.value),Tt`
                <div class="progress" part="progress" slot="determinate">
                    <div
                        class="determinate"
                        part="determinate"
                        style="width: ${e=>e.percentComplete}%"
                    ></div>
                </div>
            `)}
        ${ci((e=>"number"!=typeof e.value),Tt`
                <div class="progress" part="progress" slot="indeterminate">
                    <slot class="indeterminate" name="indeterminate">
                        ${t.indeterminateIndicator1||""}
                        ${t.indeterminateIndicator2||""}
                    </slot>
                </div>
            `)}
    </template>
`,styles:(e,t)=>Yt`
        ${ca("flex")} :host {
            align-items: center;
            outline: none;
            height: calc(${xl} * 1px);
            margin: calc(${xl} * 1px) 0;
        }

        .progress {
            background-color: ${Yd};
            border-radius: calc(${xl} * 1px);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            position: relative;
        }

        .determinate {
            background-color: ${Gd};
            border-radius: calc(${xl} * 1px);
            height: 100%;
            transition: all 0.2s ease-in-out;
            display: flex;
        }

        .indeterminate {
            height: 100%;
            border-radius: calc(${xl} * 1px);
            display: flex;
            width: 100%;
            position: relative;
            overflow: hidden;
        }

        .indeterminate-indicator-1 {
            position: absolute;
            opacity: 0;
            height: 100%;
            background-color: ${Gd};
            border-radius: calc(${xl} * 1px);
            animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
            width: 40%;
            animation: indeterminate-1 2s infinite;
        }

        .indeterminate-indicator-2 {
            position: absolute;
            opacity: 0;
            height: 100%;
            background-color: ${Gd};
            border-radius: calc(${xl} * 1px);
            animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
            width: 60%;
            animation: indeterminate-2 2s infinite;
        }

        :host([paused]) .indeterminate-indicator-1,
        :host([paused]) .indeterminate-indicator-2 {
            animation-play-state: paused;
            background-color: ${Yd};
        }

        :host([paused]) .determinate {
            background-color: ${gc};
        }

        @keyframes indeterminate-1 {
            0% {
                opacity: 1;
                transform: translateX(-100%);
            }
            70% {
                opacity: 1;
                transform: translateX(300%);
            }
            70.01% {
                opacity: 0;
            }
            100% {
                opacity: 0;
                transform: translateX(300%);
            }
        }

        @keyframes indeterminate-2 {
            0% {
                opacity: 0;
                transform: translateX(-150%);
            }
            29.99% {
                opacity: 0;
            }
            30% {
                opacity: 1;
                transform: translateX(-150%);
            }
            100% {
                transform: translateX(166.66%);
                opacity: 1;
            }
        }
    `.withBehaviors(la(Yt`
                .progress {
                    forced-color-adjust: none;
                    background-color: ${Ao.Field};
                    box-shadow: 0 0 0 1px inset ${Ao.FieldText};
                }
                .determinate,
                .indeterminate-indicator-1,
                .indeterminate-indicator-2 {
                    forced-color-adjust: none;
                    background-color: ${Ao.FieldText};
                }
                :host([paused]) .determinate,
                :host([paused]) .indeterminate-indicator-1,
                :host([paused]) .indeterminate-indicator-2 {
                    background-color: ${Ao.GrayText};
                }
            `)),indeterminateIndicator1:'\n        <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"></span>\n    ',indeterminateIndicator2:'\n        <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"></span>\n    '}),as.compose({baseName:"radio-group",template:(e,t)=>Tt`
    <template
        role="radiogroup"
        aria-disabled="${e=>e.disabled}"
        aria-readonly="${e=>e.readOnly}"
        @click="${(e,t)=>e.clickHandler(t.event)}"
        @keydown="${(e,t)=>e.keydownHandler(t.event)}"
        @focusout="${(e,t)=>e.focusOutHandler(t.event)}"
    >
        <slot name="label"></slot>
        <div
            class="positioning-region ${e=>e.orientation===vo?"horizontal":"vertical"}"
            part="positioning-region"
        >
            <slot
                ${xi({property:"slottedRadioButtons",filter:vi("[role=radio]")})}
            ></slot>
        </div>
    </template>
`,styles:(e,t)=>Yt`
    ${ca("flex")} :host {
        align-items: flex-start;
        margin: calc(${xl} * 1px) 0;
        flex-direction: column;
    }
    .positioning-region {
        display: flex;
        flex-wrap: wrap;
    }
    :host([orientation="vertical"]) .positioning-region {
        flex-direction: column;
    }
    :host([orientation="horizontal"]) .positioning-region {
        flex-direction: row;
    }
`}),cs.compose({baseName:"radio",template:(e,t)=>Tt`
    <template
        role="radio"
        class="${e=>e.checked?"checked":""} ${e=>e.readOnly?"readonly":""}"
        aria-checked="${e=>e.checked}"
        aria-required="${e=>e.required}"
        aria-disabled="${e=>e.disabled}"
        aria-readonly="${e=>e.readOnly}"
        @keypress="${(e,t)=>e.keypressHandler(t.event)}"
        @click="${(e,t)=>e.clickHandler(t.event)}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${t.checkedIndicator||""}
            </slot>
        </div>
        <label
            part="label"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot ${xi("defaultSlottedNodes")}></slot>
        </label>
    </template>
`,styles:(e,t)=>Yt`
        ${ca("inline-flex")} :host {
            --input-size: calc((${Tc} / 2) + ${xl});
            align-items: center;
            outline: none;
            margin: calc(${xl} * 1px) 0;
            /* Chromium likes to select label text or the default slot when
                the radio is clicked. Maybe there is a better solution here? */
            user-select: none;
            position: relative;
            flex-direction: row;
            transition: all 0.2s ease-in-out;
        }

        .control {
            position: relative;
            width: calc((${Tc} / 2 + ${xl}) * 1px);
            height: calc((${Tc} / 2 + ${xl}) * 1px);
            box-sizing: border-box;
            border-radius: 999px;
            border: calc(${Cl} * 1px) solid ${xc};
            background: ${tc};
            outline: none;
            cursor: pointer;
        }

        .label {
            font-family: ${ml};
            color: ${bc};
            padding-inline-start: calc(${xl} * 2px + 2px);
            margin-inline-end: calc(${xl} * 2px + 2px);
            cursor: pointer;
            font-size: ${_l};
            line-height: ${Sl};
        }

        .label__hidden {
            display: none;
            visibility: hidden;
        }

        .control, .checked-indicator {
            flex-shrink: 0;
        }

        .checked-indicator {
            position: absolute;
            top: 5px;
            left: 5px;
            right: 5px;
            bottom: 5px;
            border-radius: 999px;
            display: inline-block;
            background: ${Hd};
            fill: ${Hd};
            opacity: 0;
            pointer-events: none;
        }

        :host(:not([disabled])) .control:hover{
            background: ${ic};
            border-color: ${wc};
        }

        :host(:not([disabled])) .control:active {
            background: ${oc};
            border-color: ${kc};
        }

        :host(:${ha}) .control {
            box-shadow: 0 0 0 2px ${Od}, 0 0 0 4px ${uc};
        }

        :host([aria-checked="true"]) .control {
            background: ${Md};
            border: calc(${Cl} * 1px) solid ${Md};
        }

        :host([aria-checked="true"]:not([disabled])) .control:hover {
            background: ${Rd};
            border: calc(${Cl} * 1px) solid ${Rd};
        }

        :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator {
            background: ${Bd};
            fill: ${Bd};
        }

        :host([aria-checked="true"]:not([disabled])) .control:active {
            background: ${Dd};
            border: calc(${Cl} * 1px) solid ${Dd};
        }

        :host([aria-checked="true"]:not([disabled])) .control:active .checked-indicator {
            background: ${Vd};
            fill: ${Vd};
        }

        :host([aria-checked="true"]:${ha}:not([disabled])) .control {
            box-shadow: 0 0 0 2px ${Od}, 0 0 0 4px ${uc};
        }

        :host([disabled]) .label,
        :host([readonly]) .label,
        :host([readonly]) .control,
        :host([disabled]) .control {
            cursor: ${"not-allowed"};
        }

        :host([aria-checked="true"]) .checked-indicator {
            opacity: 1;
        }

        :host([disabled]) {
            opacity: ${kl};
        }
    `.withBehaviors(la(Yt`
            .control,
            :host([aria-checked="true"]:not([disabled])) .control {
                forced-color-adjust: none;
                border-color: ${Ao.FieldText};
                background: ${Ao.Field};
            }
            :host(:not([disabled])) .control:hover {
                border-color: ${Ao.Highlight};
                background: ${Ao.Field};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover,
            :host([aria-checked="true"]:not([disabled])) .control:active {
                border-color: ${Ao.Highlight};
                background: ${Ao.Highlight};
            }
            :host([aria-checked="true"]) .checked-indicator {
                background: ${Ao.Highlight};
                fill: ${Ao.Highlight};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator,
            :host([aria-checked="true"]:not([disabled])) .control:active .checked-indicator {
                background: ${Ao.HighlightText};
                fill: ${Ao.HighlightText};
            }
            :host(:${ha}) .control {
                border-color: ${Ao.Highlight};
                box-shadow: 0 0 0 2px ${Ao.Field}, 0 0 0 4px ${Ao.FieldText};
            }
            :host([aria-checked="true"]:${ha}:not([disabled])) .control {
                border-color: ${Ao.Highlight};
                box-shadow: 0 0 0 2px ${Ao.Field}, 0 0 0 4px ${Ao.FieldText};
            }
            :host([disabled]) {
                forced-color-adjust: none;
                opacity: 1;
            }
            :host([disabled]) .label {
                color: ${Ao.GrayText};
            }
            :host([disabled]) .control,
            :host([aria-checked="true"][disabled]) .control:hover, .control:active {
                background: ${Ao.Field};
                border-color: ${Ao.GrayText};
            }
            :host([disabled]) .checked-indicator,
            :host([aria-checked="true"][disabled]) .control:hover .checked-indicator {
                fill: ${Ao.GrayText};
                background: ${Ao.GrayText};
            }
        `)),checkedIndicator:'\n        <div part="checked-indicator" class="checked-indicator"></div>\n    '});const rh=sn.create("clear-button-hover").withDefault((e=>{const t=rc.getValueFor(e),i=Zd.getValueFor(e);return t.evaluate(e,i.evaluate(e).hover).hover})),nh=sn.create("clear-button-active").withDefault((e=>{const t=rc.getValueFor(e),i=Zd.getValueFor(e);return t.evaluate(e,i.evaluate(e).hover).active})),sh=(e,t)=>Yt`
    ${ca("inline-block")} :host {
        font-family: ${ml};
        outline: none;
        user-select: none;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: ${bc};
        background: ${tc};
        border-radius: calc(${bl} * 1px);
        border: calc(${Cl} * 1px) solid ${Md};
        height: calc(${Tc} * 1px);
        align-items: baseline;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        height: calc(100% - 4px);
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(${xl} * 2px + 1px);
        font-size: ${_l};
        line-height: ${Sl};
    }

    .control::-webkit-search-cancel-button {
        -webkit-appearance: none;
    }

    .control:hover,
    .control:${ha},
    .control:disabled,
    .control:active {
        outline: none;
    }

    .clear-button {
        height: calc(100% - 2px);
        opacity: 0;
        margin: 1px;
        background: transparent;
        color: ${bc};
        fill: currentcolor;
        border: none;
        border-radius: calc(${bl} * 1px);
        min-width: calc(${Tc} * 1px);
        font-size: ${_l};
        line-height: ${Sl};
        outline: none;
        font-family: ${ml};
        padding: 0 calc((10 + (${xl} * 2 * ${yl})) * 1px);
    }

    .clear-button:hover {
        background: ${sc};
    }

    .clear-button:active {
        background: ${ac};
    }

    :host([appearance="filled"]) .clear-button:hover {
        background: ${rh};
    }

    :host([appearance="filled"]) .clear-button:active {
        background: ${nh};
    }

    .input-wrapper {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
    }

    .label {
        display: block;
        color: ${bc};
        cursor: pointer;
        font-size: ${_l};
        line-height: ${Sl};
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .input-wrapper,
    .start,
    .end {
        align-self: center;
    }

    .start,
    .end {
        display: flex;
        margin: 1px;
        fill: currentcolor;
    }

    ::slotted([slot="end"]) {
        height: 100%
    }

    .end {
        margin-inline-end: 1px;
        height: calc(100% - 2px);
    }

    ::slotted(svg) {
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
        margin-inline-end: 11px;
        margin-inline-start: 11px;
        margin-top: auto;
        margin-bottom: auto;
    }

    :host(:hover:not([disabled])) .root {
        background: ${ic};
        border-color: ${Rd};
    }

    :host(:active:not([disabled])) .root {
        background: ${ic};
        border-color: ${Dd};
    }

    :host(:focus-within:not([disabled])) .root {
        border-color: ${uc};
        box-shadow: 0 0 0 1px ${uc} inset;
    }

    .clear-button__hidden {
        opacity: 0;
    }

    :host(:hover:not([disabled], [readOnly])) .clear-button,
    :host(:active:not([disabled], [readOnly])) .clear-button,
    :host(:focus-within:not([disabled], [readOnly])) .clear-button {
        opacity: 1;
    }

    :host(:hover:not([disabled], [readOnly])) .clear-button__hidden,
    :host(:active:not([disabled], [readOnly])) .clear-button__hidden,
    :host(:focus-within:not([disabled], [readOnly])) .clear-button__hidden {
        opacity: 0;
    }

    :host([appearance="filled"]) .root {
        background: ${Od};
    }

    :host([appearance="filled"]:hover:not([disabled])) .root {
        background: ${Qd};
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${"not-allowed"};
    }

    :host([disabled]) {
        opacity: ${kl};
    }

    :host([disabled]) .control {
        border-color: ${xc};
    }
`.withBehaviors(la(Yt`
                .root,
                :host([appearance="filled"]) .root {
                    forced-color-adjust: none;
                    background: ${Ao.Field};
                    border-color: ${Ao.FieldText};
                }
                :host(:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover) .root {
                    background: ${Ao.Field};
                    border-color: ${Ao.Highlight};
                }
                .start,
                .end {
                    fill: currentcolor;
                }
                :host([disabled]) {
                    opacity: 1;
                }
                :host([disabled]) .root,
                :host([appearance="filled"]:hover[disabled]) .root {
                    border-color: ${Ao.GrayText};
                    background: ${Ao.Field};
                }
                :host(:focus-within:enabled) .root {
                    border-color: ${Ao.Highlight};
                    box-shadow: 0 0 0 1px ${Ao.Highlight} inset;
                }
                input::placeholder {
                    color: ${Ao.GrayText};
                }
            `));class ah extends fs{constructor(){super(...arguments),this.appearance="outline"}}Ei([Pt],ah.prototype,"appearance",void 0);ah.compose({baseName:"search",baseClass:fs,template:(e,t)=>Tt`
    <template
        class="
            ${e=>e.readOnly?"readonly":""}
        "
    >
        <label
            part="label"
            for="control"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot
                ${xi({property:"defaultSlottedNodes",filter:us})}
            ></slot>
        </label>
        <div class="root" part="root" ${di("root")}>
            ${_i(0,t)}
            <div class="input-wrapper" part="input-wrapper">
                <input
                    class="control"
                    part="control"
                    id="control"
                    @input="${e=>e.handleTextInput()}"
                    @change="${e=>e.handleChange()}"
                    ?autofocus="${e=>e.autofocus}"
                    ?disabled="${e=>e.disabled}"
                    list="${e=>e.list}"
                    maxlength="${e=>e.maxlength}"
                    minlength="${e=>e.minlength}"
                    pattern="${e=>e.pattern}"
                    placeholder="${e=>e.placeholder}"
                    ?readonly="${e=>e.readOnly}"
                    ?required="${e=>e.required}"
                    size="${e=>e.size}"
                    ?spellcheck="${e=>e.spellcheck}"
                    :value="${e=>e.value}"
                    type="search"
                    aria-atomic="${e=>e.ariaAtomic}"
                    aria-busy="${e=>e.ariaBusy}"
                    aria-controls="${e=>e.ariaControls}"
                    aria-current="${e=>e.ariaCurrent}"
                    aria-describedby="${e=>e.ariaDescribedby}"
                    aria-details="${e=>e.ariaDetails}"
                    aria-disabled="${e=>e.ariaDisabled}"
                    aria-errormessage="${e=>e.ariaErrormessage}"
                    aria-flowto="${e=>e.ariaFlowto}"
                    aria-haspopup="${e=>e.ariaHaspopup}"
                    aria-hidden="${e=>e.ariaHidden}"
                    aria-invalid="${e=>e.ariaInvalid}"
                    aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
                    aria-label="${e=>e.ariaLabel}"
                    aria-labelledby="${e=>e.ariaLabelledby}"
                    aria-live="${e=>e.ariaLive}"
                    aria-owns="${e=>e.ariaOwns}"
                    aria-relevant="${e=>e.ariaRelevant}"
                    aria-roledescription="${e=>e.ariaRoledescription}"
                    ${di("control")}
                />
                <slot name="close-button">
                    <button
                        class="clear-button ${e=>e.value?"":"clear-button__hidden"}"
                        part="clear-button"
                        tabindex="-1"
                        @click=${e=>e.handleClearInput()}
                    >
                        <slot name="close-glyph">
                            <svg
                                width="9"
                                height="9"
                                viewBox="0 0 9 9"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0.146447 0.146447C0.338683 -0.0478972 0.645911 -0.0270359 0.853553 0.146447L4.5 3.793L8.14645 0.146447C8.34171 -0.0488155 8.65829 -0.0488155 8.85355 0.146447C9.04882 0.341709 9.04882 0.658291 8.85355 0.853553L5.207 4.5L8.85355 8.14645C9.05934 8.35223 9.03129 8.67582 8.85355 8.85355C8.67582 9.03129 8.35409 9.02703 8.14645 8.85355L4.5 5.207L0.853553 8.85355C0.658291 9.04882 0.341709 9.04882 0.146447 8.85355C-0.0488155 8.65829 -0.0488155 8.34171 0.146447 8.14645L3.793 4.5L0.146447 0.853553C-0.0268697 0.680237 -0.0457894 0.34079 0.146447 0.146447Z"
                                />
                            </svg>
                        </slot>
                    </button>
                </slot>
            </div>
            ${$i(0,t)}
        </div>
    </template>
`,styles:sh,shadowOptions:{delegatesFocus:!0}});class lh extends ys{constructor(){super(...arguments),this.listboxScrollWidth=""}connectedCallback(){super.connectedCallback(),this.listbox&&Od.setValueFor(this.listbox,_d)}get listboxMaxHeight(){return Math.floor(this.maxHeight/Sc.getValueFor(this)).toString()}listboxScrollWidthChanged(){this.updateComputedStylesheet()}get selectSize(){var e;return`${null!==(e=this.size)&&void 0!==e?e:this.multiple?4:0}`}multipleChanged(e,t){super.multipleChanged(e,t),this.updateComputedStylesheet()}maxHeightChanged(e,t){this.collapsible&&this.updateComputedStylesheet()}setPositioning(){super.setPositioning(),this.updateComputedStylesheet()}sizeChanged(e,t){super.sizeChanged(e,t),this.updateComputedStylesheet(),this.collapsible?requestAnimationFrame((()=>{this.listbox.style.setProperty("display","flex"),this.listbox.style.setProperty("overflow","visible"),this.listbox.style.setProperty("visibility","hidden"),this.listbox.style.setProperty("width","auto"),this.listbox.hidden=!1,this.listboxScrollWidth=`${this.listbox.scrollWidth}`,this.listbox.hidden=!0,this.listbox.style.removeProperty("display"),this.listbox.style.removeProperty("overflow"),this.listbox.style.removeProperty("visibility"),this.listbox.style.removeProperty("width")})):this.listboxScrollWidth=""}updateComputedStylesheet(){this.computedStylesheet&&this.$fastController.removeStyles(this.computedStylesheet),this.computedStylesheet=Yt`
            :host {
                --listbox-max-height: ${this.listboxMaxHeight};
                --listbox-scroll-width: ${this.listboxScrollWidth};
                --size: ${this.selectSize};
            }
        `,this.$fastController.addStyles(this.computedStylesheet)}}Ei([Ye],lh.prototype,"listboxScrollWidth",void 0);const dh=lh.compose({baseName:"select",baseClass:ys,template:(e,t)=>Tt`
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
        ${ci((e=>e.collapsible),Tt`
                <div
                    class="control"
                    part="control"
                    ?disabled="${e=>e.disabled}"
                    ${di("control")}
                >
                    ${_i(0,t)}
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
                    ${$i(0,t)}
                </div>
            `)}
        <div
            class="listbox"
            id="${e=>e.listboxId}"
            part="listbox"
            role="listbox"
            ?disabled="${e=>e.disabled}"
            ?hidden="${e=>!!e.collapsible&&!e.open}"
            ${di("listbox")}
        >
            <slot
                ${xi({filter:Ir.slottedOptionFilter,flatten:!0,property:"slottedOptions"})}
            ></slot>
        </div>
    </template>
`,styles:qc,indicator:'\n        <svg\n            class="select-indicator"\n            part="select-indicator"\n            viewBox="0 0 12 7"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"\n            />\n        </svg>\n    '}),ch=(ws.compose({baseName:"skeleton",template:(e,t)=>Tt`
    <template
        class="${e=>"circle"===e.shape?"circle":"rect"}"
        pattern="${e=>e.pattern}"
        ?shimmer="${e=>e.shimmer}"
    >
        ${ci((e=>!0===e.shimmer),Tt`
                <span class="shimmer"></span>
            `)}
        <object type="image/svg+xml" data="${e=>e.pattern}" role="presentation">
            <img class="pattern" src="${e=>e.pattern}" />
        </object>
        <slot></slot>
    </template>
`,styles:(e,t)=>Yt`
        ${ca("block")} :host {
            --skeleton-fill-default: #e1dfdd;
            overflow: hidden;
            width: 100%;
            position: relative;
            background-color: var(--skeleton-fill, var(--skeleton-fill-default));
            --skeleton-animation-gradient-default: linear-gradient(
                270deg,
                var(--skeleton-fill, var(--skeleton-fill-default)) 0%,
                #f3f2f1 51.13%,
                var(--skeleton-fill, var(--skeleton-fill-default)) 100%
            );
            --skeleton-animation-timing-default: ease-in-out;
        }

        :host([shape="rect"]) {
            border-radius: calc(${bl} * 1px);
        }

        :host([shape="circle"]) {
            border-radius: 100%;
            overflow: hidden;
        }

        object {
            position: absolute;
            width: 100%;
            height: auto;
            z-index: 2;
        }

        object img {
            width: 100%;
            height: auto;
        }

        ${ca("block")} span.shimmer {
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: var(
                --skeleton-animation-gradient,
                var(--skeleton-animation-gradient-default)
            );
            background-size: 0px 0px / 90% 100%;
            background-repeat: no-repeat;
            background-color: var(--skeleton-animation-fill, ${Yd});
            animation: shimmer 2s infinite;
            animation-timing-function: var(
                --skeleton-animation-timing,
                var(--skeleton-timing-default)
            );
            animation-direction: normal;
            z-index: 1;
        }

        ::slotted(svg) {
            z-index: 2;
        }

        ::slotted(.pattern) {
            width: 100%;
            height: 100%;
        }

        @keyframes shimmer {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(100%);
            }
        }
    `.withBehaviors(la(Yt`
                :host {
                    forced-color-adjust: none;
                    background-color: ${Ao.ButtonFace};
                    box-shadow: 0 0 0 1px ${Ao.ButtonText};
                }

                ${ca("block")} span.shimmer {
                    display: none;
                }
            `))}),Yt`
    :host {
        align-self: start;
        grid-row: 2;
        margin-top: -2px;
        height: calc((${Tc} / 2 + ${xl}) * 1px);
        width: auto;
    }
    .container {
        grid-template-rows: auto auto;
        grid-template-columns: 0;
    }
    .label {
        margin: 2px 0;
    }
`),hh=Yt`
    :host {
        justify-self: start;
        grid-column: 2;
        margin-left: 2px;
        height: auto;
        width: calc((${Tc} / 2 + ${xl}) * 1px);
    }
    .container {
        grid-template-columns: auto auto;
        grid-template-rows: 0;
        min-width: calc(var(--thumb-size) * 1px);
        height: calc(var(--thumb-size) * 1px);
    }
    .mark {
        transform: rotate(90deg);
        align-self: center;
    }
    .label {
        margin-left: calc((${xl} / 2) * 3px);
        align-self: center;
    }
`;(class extends $s{sliderOrientationChanged(){this.sliderOrientation===vo?(this.$fastController.addStyles(ch),this.$fastController.removeStyles(hh)):(this.$fastController.addStyles(hh),this.$fastController.removeStyles(ch))}}).compose({baseName:"slider-label",baseClass:$s,template:(e,t)=>Tt`
    <template
        aria-disabled="${e=>e.disabled}"
        class="${e=>e.sliderOrientation||vo}
            ${e=>e.disabled?"disabled":""}"
    >
        <div ${di("root")} part="root" class="root" style="${e=>e.positionStyle}">
            <div class="container">
                ${ci((e=>!e.hideMark),Tt`
                        <div class="mark"></div>
                    `)}
                <div class="label">
                    <slot></slot>
                </div>
            </div>
        </div>
    </template>
`,styles:(e,t)=>Yt`
        ${ca("block")} :host {
            font-family: ${ml};
            color: ${bc};
            fill: currentcolor;
        }
        .root {
            position: absolute;
            display: grid;
        }
        .container {
            display: grid;
            justify-self: center;
        }
        .label {
            justify-self: center;
            align-self: center;
            white-space: nowrap;
            max-width: 30px;
        }
        .mark {
            width: calc((${xl} / 4) * 1px);
            height: calc(${Tc} * 0.25 * 1px);
            background: ${xc};
            justify-self: center;
        }
        :host(.disabled) {
            opacity: ${kl};
        }
    `.withBehaviors(la(Yt`
                .mark {
                    forced-color-adjust: none;
                    background: ${Ao.FieldText};
                }
                :host(.disabled) {
                    forced-color-adjust: none;
                    opacity: 1;
                }
                :host(.disabled) .label {
                    color: ${Ao.GrayText};
                }
                :host(.disabled) .mark {
                    background: ${Ao.GrayText};
                }
            `))});const uh=Yt`
    .track-start {
        left: 0;
    }
`,ph=Yt`
    .track-start {
        right: 0;
    }
`,mh=(Es.compose({baseName:"slider",template:(e,t)=>Tt`
    <template
        role="slider"
        class="${e=>e.readOnly?"readonly":""}
        ${e=>e.orientation||vo}"
        tabindex="${e=>e.disabled?null:0}"
        aria-valuetext="${e=>e.valueTextFormatter(e.value)}"
        aria-valuenow="${e=>e.value}"
        aria-valuemin="${e=>e.min}"
        aria-valuemax="${e=>e.max}"
        aria-disabled="${e=>!!e.disabled||void 0}"
        aria-readonly="${e=>!!e.readOnly||void 0}"
        aria-orientation="${e=>e.orientation}"
        class="${e=>e.orientation}"
    >
        <div part="positioning-region" class="positioning-region">
            <div ${di("track")} part="track-container" class="track">
                <slot name="track"></slot>
                <div part="track-start" class="track-start" style="${e=>e.position}">
                    <slot name="track-start"></slot>
                </div>
            </div>
            <slot></slot>
            <div
                ${di("thumb")}
                part="thumb-container"
                class="thumb-container"
                style="${e=>e.position}"
            >
                <slot name="thumb">${t.thumb||""}</slot>
            </div>
        </div>
    </template>
`,styles:(e,t)=>Yt`
        :host([hidden]) {
            display: none;
        }

        ${ca("inline-grid")} :host {
            --thumb-size: calc(${Tc} * 0.5 - ${xl});
            --thumb-translate: calc(var(--thumb-size) * -0.5 + var(--track-width) / 2);
            --track-overhang: calc((${xl} / 2) * -1);
            --track-width: ${xl};
            --fast-slider-height: calc(var(--thumb-size) * 10);
            align-items: center;
            width: 100%;
            margin: calc(${xl} * 1px) 0;
            user-select: none;
            box-sizing: border-box;
            border-radius: calc(${bl} * 1px);
            outline: none;
            cursor: pointer;
        }
        :host([orientation="horizontal"]) .positioning-region {
            position: relative;
            margin: 0 8px;
            display: grid;
            grid-template-rows: calc(var(--thumb-size) * 1px) 1fr;
        }
        :host([orientation="vertical"]) .positioning-region {
            position: relative;
            margin: 0 8px;
            display: grid;
            height: 100%;
            grid-template-columns: calc(var(--thumb-size) * 1px) 1fr;
        }

        :host(:${ha}) .thumb-cursor {
            box-shadow: 0 0 0 2px ${Od}, 0 0 0 4px ${uc};
        }

        .thumb-container {
            position: absolute;
            height: calc(var(--thumb-size) * 1px);
            width: calc(var(--thumb-size) * 1px);
            transition: all 0.2s ease;
            color: ${bc};
            fill: currentcolor;
        }
        .thumb-cursor {
            border: none;
            width: calc(var(--thumb-size) * 1px);
            height: calc(var(--thumb-size) * 1px);
            background: ${bc};
            border-radius: calc(${bl} * 1px);
        }
        .thumb-cursor:hover {
            background: ${bc};
            border-color: ${wc};
        }
        .thumb-cursor:active {
            background: ${bc};
        }
        .track-start {
            background: ${Gd};
            position: absolute;
            height: 100%;
            left: 0;
            border-radius: calc(${bl} * 1px);
        }
        :host([orientation="horizontal"]) .thumb-container {
            transform: translateX(calc(var(--thumb-size) * 0.5px)) translateY(calc(var(--thumb-translate) * 1px));
        }
        :host([orientation="vertical"]) .thumb-container {
            transform: translateX(calc(var(--thumb-translate) * 1px)) translateY(calc(var(--thumb-size) * 0.5px));
        }
        :host([orientation="horizontal"]) {
            min-width: calc(var(--thumb-size) * 1px);
        }
        :host([orientation="horizontal"]) .track {
            right: calc(var(--track-overhang) * 1px);
            left: calc(var(--track-overhang) * 1px);
            align-self: start;
            height: calc(var(--track-width) * 1px);
        }
        :host([orientation="vertical"]) .track {
            top: calc(var(--track-overhang) * 1px);
            bottom: calc(var(--track-overhang) * 1px);
            width: calc(var(--track-width) * 1px);
            height: 100%;
        }
        .track {
            background: ${xc};
            position: absolute;
            border-radius: calc(${bl} * 1px);
        }
        :host([orientation="vertical"]) {
            height: calc(var(--fast-slider-height) * 1px);
            min-height: calc(var(--thumb-size) * 1px);
            min-width: calc(${xl} * 20px);
        }
        :host([orientation="vertical"]) .track-start {
            height: auto;
            width: 100%;
            top: 0;
        }
        :host([disabled]), :host([readonly]) {
            cursor: ${"not-allowed"};
        }
        :host([disabled]) {
            opacity: ${kl};
        }
    `.withBehaviors(new Rc(uh,ph),la(Yt`
                .thumb-cursor {
                    forced-color-adjust: none;
                    border-color: ${Ao.FieldText};
                    background: ${Ao.FieldText};
                }
                .thumb-cursor:hover,
                .thumb-cursor:active {
                    background: ${Ao.Highlight};
                }
                .track {
                    forced-color-adjust: none;
                    background: ${Ao.FieldText};
                }
                :host(:${ha}) .thumb-cursor {
                    border-color: ${Ao.Highlight};
                }
                :host([disabled]) {
                    opacity: 1;
                }
                :host([disabled]) .track,
                :host([disabled]) .thumb-cursor {
                    forced-color-adjust: none;
                    background: ${Ao.GrayText};
                }

                :host(:${ha}) .thumb-cursor {
                    background: ${Ao.Highlight};
                    border-color: ${Ao.Highlight};
                    box-shadow: 0 0 0 2px ${Ao.Field}, 0 0 0 4px ${Ao.FieldText};
                }
            `)),thumb:'\n        <div class="thumb-cursor"></div>\n    '}),Os.compose({baseName:"switch",template:(e,t)=>Tt`
    <template
        role="switch"
        aria-checked="${e=>e.checked}"
        aria-disabled="${e=>e.disabled}"
        aria-readonly="${e=>e.readOnly}"
        tabindex="${e=>e.disabled?null:0}"
        @keypress="${(e,t)=>e.keypressHandler(t.event)}"
        @click="${(e,t)=>e.clickHandler(t.event)}"
        class="${e=>e.checked?"checked":""}"
    >
        <label
            part="label"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot ${xi("defaultSlottedNodes")}></slot>
        </label>
        <div part="switch" class="switch">
            <slot name="switch">${t.switch||""}</slot>
        </div>
        <span class="status-message" part="status-message">
            <span class="checked-message" part="checked-message">
                <slot name="checked-message"></slot>
            </span>
            <span class="unchecked-message" part="unchecked-message">
                <slot name="unchecked-message"></slot>
            </span>
        </span>
    </template>
`,styles:(e,t)=>Yt`
        :host([hidden]) {
            display: none;
        }

        ${ca("inline-flex")} :host {
            align-items: center;
            outline: none;
            font-family: ${ml};
            margin: calc(${xl} * 1px) 0;
            ${""} user-select: none;
        }

        :host([disabled]) {
            opacity: ${kl};
        }

        :host([disabled]) .label,
        :host([readonly]) .label,
        :host([readonly]) .switch,
        :host([disabled]) .switch {
            cursor: ${"not-allowed"};
        }

        .switch {
            position: relative;
            outline: none;
            box-sizing: border-box;
            width: calc(${Tc} * 1px);
            height: calc((${Tc} / 2 + ${xl}) * 1px);
            background: ${tc};
            border-radius: calc(${bl} * 1px);
            border: calc(${Cl} * 1px) solid ${xc};
        }

        .switch:hover {
            background: ${ic};
            border-color: ${wc};
            cursor: pointer;
        }

        host([disabled]) .switch:hover,
        host([readonly]) .switch:hover {
            background: ${ic};
            border-color: ${wc};
            cursor: ${"not-allowed"};
        }

        :host(:not([disabled])) .switch:active {
            background: ${oc};
            border-color: ${kc};
        }

        :host(:${ha}) .switch {
            box-shadow: 0 0 0 2px ${Od}, 0 0 0 4px ${uc};
        }

        .checked-indicator {
            position: absolute;
            top: 5px;
            bottom: 5px;
            background: ${bc};
            border-radius: calc(${bl} * 1px);
            transition: all 0.2s ease-in-out;
        }

        .status-message {
            color: ${bc};
            cursor: pointer;
            font-size: ${_l};
            line-height: ${Sl};
        }

        :host([disabled]) .status-message,
        :host([readonly]) .status-message {
            cursor: ${"not-allowed"};
        }

        .label {
            color: ${bc};
            margin-inline-end: calc(${xl} * 2px + 2px);
            font-size: ${_l};
            line-height: ${Sl};
            cursor: pointer;
        }

        .label__hidden {
            display: none;
            visibility: hidden;
        }

        ::slotted([slot="checked-message"]),
        ::slotted([slot="unchecked-message"]) {
            margin-inline-start: calc(${xl} * 2px + 2px);
        }

        :host([aria-checked="true"]) .checked-indicator {
            background: ${Hd};
        }

        :host([aria-checked="true"]) .switch {
            background: ${Md};
            border-color: ${Md};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:hover {
            background: ${Rd};
            border-color: ${Rd};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator {
            background: ${Bd};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:active {
            background: ${Dd};
            border-color: ${Dd};
        }

        :host([aria-checked="true"]:not([disabled])) .switch:active .checked-indicator {
            background: ${Vd};
        }

        :host([aria-checked="true"]:${ha}:not([disabled])) .switch {
            box-shadow: 0 0 0 2px ${Od}, 0 0 0 4px ${uc};
        }

        .unchecked-message {
            display: block;
        }

        .checked-message {
            display: none;
        }

        :host([aria-checked="true"]) .unchecked-message {
            display: none;
        }

        :host([aria-checked="true"]) .checked-message {
            display: block;
        }
    `.withBehaviors(la(Yt`
            .checked-indicator,
            :host(:not([disabled])) .switch:active .checked-indicator {
                forced-color-adjust: none;
                background: ${Ao.FieldText};
            }
            .switch {
                forced-color-adjust: none;
                background: ${Ao.Field};
                border-color: ${Ao.FieldText};
            }
            :host(:not([disabled])) .switch:hover {
                background: ${Ao.HighlightText};
                border-color: ${Ao.Highlight};
            }
            :host([aria-checked="true"]) .switch {
                background: ${Ao.Highlight};
                border-color: ${Ao.Highlight};
            }
            :host([aria-checked="true"]:not([disabled])) .switch:hover,
            :host(:not([disabled])) .switch:active {
                background: ${Ao.HighlightText};
                border-color: ${Ao.Highlight};
            }
            :host([aria-checked="true"]) .checked-indicator {
                background: ${Ao.HighlightText};
            }
            :host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator {
                background: ${Ao.Highlight};
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host(:${ha}) .switch {
                border-color: ${Ao.Highlight};
                box-shadow: 0 0 0 2px ${Ao.Field}, 0 0 0 4px ${Ao.FieldText};
            }
            :host([aria-checked="true"]:${ha}:not([disabled])) .switch {
                box-shadow: 0 0 0 2px ${Ao.Field}, 0 0 0 4px ${Ao.FieldText};
            }
            :host([disabled]) .checked-indicator {
                background: ${Ao.GrayText};
            }
            :host([disabled]) .switch {
                background: ${Ao.Field};
                border-color: ${Ao.GrayText};
            }
        `),new Rc(Yt`
                .checked-indicator {
                    left: 5px;
                    right: calc(((${Tc} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    left: calc(((${Tc} / 2) + 1) * 1px);
                    right: 5px;
                }
            `,Yt`
                .checked-indicator {
                    right: 5px;
                    left: calc(((${Tc} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    right: calc(((${Tc} / 2) + 1) * 1px);
                    left: 5px;
                }
            `)),switch:'\n        <span class="checked-indicator" part="checked-indicator"></span>\n    '}),(e,t)=>Yt`
        ${ca("grid")} :host {
            box-sizing: border-box;
            font-family: ${ml};
            font-size: ${_l};
            line-height: ${Sl};
            color: ${bc};
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
            padding: calc(${xl} * 4px) calc(${xl} * 4px) 0;
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
            background: ${Md};
            margin-top: 10px;
            border-radius: calc(${bl} * 1px)
                calc(${bl} * 1px) 0 0;
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
            padding: 0 calc(${xl} * 4px)
                calc((${Tc} - ${xl}) * 1px) 0;
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
            background: ${Md};
            margin-top: 0;
            border-radius: 0 calc(${bl} * 1px)
                calc(${bl} * 1px) 0;
        }

        :host([orientation="vertical"]) .activeIndicatorTransition {
            transition: transform 0.2s linear;
        }
    `.withBehaviors(la(Yt`
                .activeIndicator,
                :host([orientation="vertical"]) .activeIndicator {
                    forced-color-adjust: none;
                    background: ${Ao.Highlight};
                }
            `))),fh=(e,t)=>Yt`
    ${ca("inline-flex")} :host {
        box-sizing: border-box;
        font-family: ${ml};
        font-size: ${_l};
        line-height: ${Sl};
        height: calc(${Tc} * 1px);
        padding: calc(${xl} * 5px) calc(${xl} * 4px);
        color: ${gc};
        fill: currentcolor;
        border-radius: calc(${bl} * 1px);
        border: calc(${Cl} * 1px) solid transparent;
        align-items: center;
        justify-content: center;
        grid-row: 1;
        cursor: pointer;
    }

    :host(:hover) {
        color: ${bc};
        fill: currentcolor;
    }

    :host(:active) {
        color: ${bc};
        fill: currentcolor;
    }

    :host([disabled]) {
        cursor: ${"not-allowed"};
        opacity: ${kl};
    }

    :host([disabled]:hover) {
        color: ${gc};
        background: ${nc};
    }

    :host([aria-selected="true"]) {
        background: ${Yd};
        color: ${Gd};
        fill: currentcolor;
    }

    :host([aria-selected="true"]:hover) {
        background: ${Qd};
        color: ${Xd};
        fill: currentcolor;
    }

    :host([aria-selected="true"]:active) {
        background: ${Jd};
        color: ${Kd};
        fill: currentcolor;
    }

    :host(:${ha}) {
        outline: none;
        border: calc(${Cl} * 1px) solid ${uc};
        box-shadow: 0 0 0 calc((${$l} - ${Cl}) * 1px)
            ${uc};
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
        color: ${bc};
    }

    :host(.vertical:active) {
        color: ${bc};
    }

    :host(.vertical:hover[aria-selected="true"]) {
    }
`.withBehaviors(la(Yt`
            :host {
                forced-color-adjust: none;
                border-color: transparent;
                color: ${Ao.ButtonText};
                fill: currentcolor;
            }
            :host(:hover),
            :host(.vertical:hover),
            :host([aria-selected="true"]:hover) {
                background: ${Ao.Highlight};
                color: ${Ao.HighlightText};
                fill: currentcolor;
            }
            :host([aria-selected="true"]) {
                background: ${Ao.HighlightText};
                color: ${Ao.Highlight};
                fill: currentcolor;
            }
            :host(:${ha}) {
                border-color: ${Ao.ButtonText};
                box-shadow: none;
            }
            :host([disabled]),
            :host([disabled]:hover) {
                opacity: 1;
                color: ${Ao.GrayText};
                background: ${Ao.ButtonFace};
            }
        `)),gh=Ls.compose({baseName:"tab",template:(e,t)=>Tt`
    <template slot="tab" role="tab" aria-disabled="${e=>e.disabled}">
        <slot></slot>
    </template>
`,styles:fh}),vh=(e,t)=>Yt`
    ${ca("block")} :host {
        box-sizing: border-box;
        font-size: ${_l};
        line-height: ${Sl};
        padding: 0 calc((6 + (${xl} * 2 * ${yl})) * 1px);
    }
`,bh=class extends uo{}.compose({baseName:"tab-panel",template:(e,t)=>Tt`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`,styles:vh}),yh=Ms.compose({baseName:"tabs",template:(e,t)=>Tt`
    <template class="${e=>e.orientation}">
        ${_i(0,t)}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${xi("tabs")}></slot>

            ${ci((e=>e.showActiveIndicator),Tt`
                    <div
                        ${di("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `)}
        </div>
        ${$i(0,t)}
        <div class="tabpanel">
            <slot name="tabpanel" part="tabpanel" ${xi("tabpanels")}></slot>
        </div>
    </template>
`,styles:mh});class xh extends Ps{constructor(){super(...arguments),this.appearance="outline"}}Ei([Pt],xh.prototype,"appearance",void 0);xh.compose({baseName:"text-area",baseClass:Ps,template:(e,t)=>Tt`
    <template
        class="
            ${e=>e.readOnly?"readonly":""}
            ${e=>e.resize!==zs?`resize-${e.resize}`:""}"
    >
        <label
            part="label"
            for="control"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot ${xi("defaultSlottedNodes")}></slot>
        </label>
        <textarea
            part="control"
            class="control"
            id="control"
            ?autofocus="${e=>e.autofocus}"
            cols="${e=>e.cols}"
            ?disabled="${e=>e.disabled}"
            form="${e=>e.form}"
            list="${e=>e.list}"
            maxlength="${e=>e.maxlength}"
            minlength="${e=>e.minlength}"
            name="${e=>e.name}"
            placeholder="${e=>e.placeholder}"
            ?readonly="${e=>e.readOnly}"
            ?required="${e=>e.required}"
            rows="${e=>e.rows}"
            ?spellcheck="${e=>e.spellcheck}"
            :value="${e=>e.value}"
            aria-atomic="${e=>e.ariaAtomic}"
            aria-busy="${e=>e.ariaBusy}"
            aria-controls="${e=>e.ariaControls}"
            aria-current="${e=>e.ariaCurrent}"
            aria-describedby="${e=>e.ariaDescribedby}"
            aria-details="${e=>e.ariaDetails}"
            aria-disabled="${e=>e.ariaDisabled}"
            aria-errormessage="${e=>e.ariaErrormessage}"
            aria-flowto="${e=>e.ariaFlowto}"
            aria-haspopup="${e=>e.ariaHaspopup}"
            aria-hidden="${e=>e.ariaHidden}"
            aria-invalid="${e=>e.ariaInvalid}"
            aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
            aria-label="${e=>e.ariaLabel}"
            aria-labelledby="${e=>e.ariaLabelledby}"
            aria-live="${e=>e.ariaLive}"
            aria-owns="${e=>e.ariaOwns}"
            aria-relevant="${e=>e.ariaRelevant}"
            aria-roledescription="${e=>e.ariaRoledescription}"
            @input="${(e,t)=>e.handleTextInput()}"
            @change="${e=>e.handleChange()}"
            ${di("control")}
        ></textarea>
    </template>
`,styles:(e,t)=>Yt`
    ${ca("inline-block")} :host {
        font-family: ${ml};
        outline: none;
        user-select: none;
    }

    .control {
        box-sizing: border-box;
        position: relative;
        color: ${bc};
        background: ${tc};
        border-radius: calc(${bl} * 1px);
        border: calc(${Cl} * 1px) solid ${Md};
        height: calc(${Tc} * 2px);
        font: inherit;
        font-size: ${_l};
        line-height: ${Sl};
        padding: calc(${xl} * 2px + 1px);
        width: 100%;
        resize: none;
    }

    .control:hover:enabled {
        background: ${ic};
        border-color: ${Rd};
    }

    .control:active:enabled {
        background: ${oc};
        border-color: ${Dd};
    }

    .control:hover,
    .control:${ha},
    .control:disabled,
    .control:active {
        outline: none;
    }

    :host(:focus-within) .control {
        border-color: ${uc};
        box-shadow: 0 0 0 1px ${uc} inset;
    }

    :host([appearance="filled"]) .control {
        background: ${Yd};
    }

    :host([appearance="filled"]:hover:not([disabled])) .control {
        background: ${Qd};
    }

    :host([resize="both"]) .control {
        resize: both;
    }

    :host([resize="horizontal"]) .control {
        resize: horizontal;
    }

    :host([resize="vertical"]) .control {
        resize: vertical;
    }

    .label {
        display: block;
        color: ${bc};
        cursor: pointer;
        font-size: ${_l};
        line-height: ${Sl};
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${"not-allowed"};
    }
    :host([disabled]) {
        opacity: ${kl};
    }
    :host([disabled]) .control {
        border-color: ${xc};
    }

    :host([cols]){
        width: initial;
    }

    :host([rows]) .control {
        height: initial;
    }
 `.withBehaviors(la(Yt`
                :host([disabled]) {
                    opacity: 1;
                }
            `)),shadowOptions:{delegatesFocus:!0}});let wh=class extends ts{constructor(){super(...arguments),this.appearance="outline"}};Ei([Pt],wh.prototype,"appearance",void 0);wh.compose({baseName:"text-field",baseClass:ts,template:(e,t)=>Tt`
    <template
        class="
            ${e=>e.readOnly?"readonly":""}
        "
    >
        <label
            part="label"
            for="control"
            class="${e=>e.defaultSlottedNodes&&e.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot
                ${xi({property:"defaultSlottedNodes",filter:us})}
            ></slot>
        </label>
        <div class="root" part="root">
            ${_i(0,t)}
            <input
                class="control"
                part="control"
                id="control"
                @input="${e=>e.handleTextInput()}"
                @change="${e=>e.handleChange()}"
                ?autofocus="${e=>e.autofocus}"
                ?disabled="${e=>e.disabled}"
                list="${e=>e.list}"
                maxlength="${e=>e.maxlength}"
                minlength="${e=>e.minlength}"
                pattern="${e=>e.pattern}"
                placeholder="${e=>e.placeholder}"
                ?readonly="${e=>e.readOnly}"
                ?required="${e=>e.required}"
                size="${e=>e.size}"
                ?spellcheck="${e=>e.spellcheck}"
                :value="${e=>e.value}"
                type="${e=>e.type}"
                aria-atomic="${e=>e.ariaAtomic}"
                aria-busy="${e=>e.ariaBusy}"
                aria-controls="${e=>e.ariaControls}"
                aria-current="${e=>e.ariaCurrent}"
                aria-describedby="${e=>e.ariaDescribedby}"
                aria-details="${e=>e.ariaDetails}"
                aria-disabled="${e=>e.ariaDisabled}"
                aria-errormessage="${e=>e.ariaErrormessage}"
                aria-flowto="${e=>e.ariaFlowto}"
                aria-haspopup="${e=>e.ariaHaspopup}"
                aria-hidden="${e=>e.ariaHidden}"
                aria-invalid="${e=>e.ariaInvalid}"
                aria-keyshortcuts="${e=>e.ariaKeyshortcuts}"
                aria-label="${e=>e.ariaLabel}"
                aria-labelledby="${e=>e.ariaLabelledby}"
                aria-live="${e=>e.ariaLive}"
                aria-owns="${e=>e.ariaOwns}"
                aria-relevant="${e=>e.ariaRelevant}"
                aria-roledescription="${e=>e.ariaRoledescription}"
                ${di("control")}
            />
            ${$i(0,t)}
        </div>
    </template>
`,styles:(e,t)=>Yt`
    ${ca("inline-block")} :host {
        font-family: ${ml};
        outline: none;
        user-select: none;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: ${bc};
        background: ${tc};
        border-radius: calc(${bl} * 1px);
        border: calc(${Cl} * 1px) solid ${Md};
        height: calc(${Tc} * 1px);
        align-items: baseline;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        height: calc(100% - 4px);
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(${xl} * 2px + 1px);
        font-size: ${_l};
        line-height: ${Sl};
    }

    .control:hover,
    .control:${ha},
    .control:disabled,
    .control:active {
        outline: none;
    }

    .label {
        display: block;
        color: ${bc};
        cursor: pointer;
        font-size: ${_l};
        line-height: ${Sl};
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .start,
    .control,
    .end {
        align-self: center;
    }

    .start,
    .end {
        display: flex;
        margin: auto;
        fill: currentcolor;
    }

    ::slotted(svg) {
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
    }

    .start {
        margin-inline-start: 11px;
    }

    .end {
        margin-inline-end: 11px;
    }

    :host(:hover:not([disabled])) .root {
        background: ${ic};
        border-color: ${Rd};
    }

    :host(:active:not([disabled])) .root {
        background: ${ic};
        border-color: ${Dd};
    }

    :host(:focus-within:not([disabled])) .root {
        border-color: ${uc};
        box-shadow: 0 0 0 calc(${$l} * 1px) ${uc} inset;
    }

    :host([appearance="filled"]) .root {
        background: ${Yd};
    }

    :host([appearance="filled"]:hover:not([disabled])) .root {
        background: ${Qd};
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${"not-allowed"};
    }

    :host([disabled]) {
        opacity: ${kl};
    }

    :host([disabled]) .control {
        border-color: ${xc};
    }
`.withBehaviors(la(Yt`
                .root,
                :host([appearance="filled"]) .root {
                    forced-color-adjust: none;
                    background: ${Ao.Field};
                    border-color: ${Ao.FieldText};
                }
                :host(:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover) .root {
                    background: ${Ao.Field};
                    border-color: ${Ao.Highlight};
                }
                .start,
                .end {
                    fill: currentcolor;
                }
                :host([disabled]) {
                    opacity: 1;
                }
                :host([disabled]) .root,
                :host([appearance="filled"]:hover[disabled]) .root {
                    border-color: ${Ao.GrayText};
                    background: ${Ao.Field};
                }
                :host(:focus-within:enabled) .root {
                    border-color: ${Ao.Highlight};
                    box-shadow: 0 0 0 1px ${Ao.Highlight} inset;
                }
                input::placeholder {
                    color: ${Ao.GrayText};
                }
            `)),shadowOptions:{delegatesFocus:!0}});(class extends Hs{connectedCallback(){super.connectedCallback();const e=Vr(this);e&&Od.setValueFor(this,(t=>cc.getValueFor(t).evaluate(t,Od.getValueFor(e))))}}).compose({baseName:"toolbar",baseClass:Hs,template:(e,t)=>Tt`
    <template
        aria-label="${e=>e.ariaLabel}"
        aria-labelledby="${e=>e.ariaLabelledby}"
        aria-orientation="${e=>e.orientation}"
        orientation="${e=>e.orientation}"
        role="toolbar"
        @click="${(e,t)=>e.clickHandler(t.event)}"
        @focusin="${(e,t)=>e.focusinHandler(t.event)}"
        @keydown="${(e,t)=>e.keydownHandler(t.event)}"
        ${ki({property:"childItems",attributeFilter:["disabled","hidden"],filter:vi(),subtree:!0})}
    >
        <slot name="label"></slot>
        <div class="positioning-region" part="positioning-region">
            ${_i(0,t)}
            <slot
                ${xi({filter:vi(),property:"slottedItems"})}
            ></slot>
            ${$i(0,t)}
        </div>
    </template>
`,styles:(e,t)=>Yt`
        ${ca("inline-flex")} :host {
            --toolbar-item-gap: calc(
                (var(--design-unit) + calc(var(--density) + 2)) * 1px
            );
            background-color: ${Od};
            border-radius: calc(${bl} * 1px);
            fill: currentcolor;
            padding: var(--toolbar-item-gap);
        }

        :host(${ha}) {
            outline: calc(${Cl} * 1px) solid ${Cc};
        }

        .positioning-region {
            align-items: flex-start;
            display: inline-flex;
            flex-flow: row wrap;
            justify-content: flex-start;
        }

        :host([orientation="vertical"]) .positioning-region {
            flex-direction: column;
        }

        ::slotted(:not([slot])) {
            flex: 0 0 auto;
            margin: 0 var(--toolbar-item-gap);
        }

        :host([orientation="vertical"]) ::slotted(:not([slot])) {
            margin: var(--toolbar-item-gap) 0;
        }

        .start,
        .end {
            display: flex;
            margin: auto;
            margin-inline: 0;
        }

        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: 16px;
            height: 16px;
        }
    `.withBehaviors(la(Yt`
            :host(:${ha}) {
                box-shadow: 0 0 0 calc(${$l} * 1px) ${Ao.Highlight};
                color: ${Ao.ButtonText};
                forced-color-adjust: none;
            }
        `)),shadowOptions:{delegatesFocus:!0}}),ia.compose({baseName:"tooltip",template:(e,t)=>Tt`
        ${ci((e=>e.tooltipVisible),Tt`
            <${e.tagFor(Po)}
                fixed-placement="true"
                auto-update-mode="${e=>e.autoUpdateMode}"
                vertical-positioning-mode="${e=>e.verticalPositioningMode}"
                vertical-default-position="${e=>e.verticalDefaultPosition}"
                vertical-inset="${e=>e.verticalInset}"
                vertical-scaling="${e=>e.verticalScaling}"
                horizontal-positioning-mode="${e=>e.horizontalPositioningMode}"
                horizontal-default-position="${e=>e.horizontalDefaultPosition}"
                horizontal-scaling="${e=>e.horizontalScaling}"
                horizontal-inset="${e=>e.horizontalInset}"
                vertical-viewport-lock="${e=>e.horizontalViewportLock}"
                horizontal-viewport-lock="${e=>e.verticalViewportLock}"
                dir="${e=>e.currentDirection}"
                ${di("region")}
            >
                <div class="tooltip" part="tooltip" role="tooltip">
                    <slot></slot>
                </div>
            </${e.tagFor(Po)}>
        `)}
    `,styles:(e,t)=>{const i=e.tagFor(Po);return Yt`
            :host {
                contain: size;
                overflow: visible;
                height: 0;
                width: 0;
            }

            .tooltip {
                box-sizing: border-box;
                border-radius: calc(${bl} * 1px);
                border: calc(${Cl} * 1px) solid ${uc};
                box-shadow: 0 0 0 1px ${uc} inset;
                background: ${Yd};
                color: ${bc};
                padding: 4px;
                height: fit-content;
                width: fit-content;
                font-family: ${ml};
                font-size: ${_l};
                line-height: ${Sl};
                white-space: nowrap;
                /* TODO: a mechanism to manage z-index across components
                    https://github.com/microsoft/fast/issues/3813 */
                z-index: 10000;
            }

            ${i} {
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: visible;
                flex-direction: row;
            }

            ${i}.right,
            ${i}.left {
                flex-direction: column;
            }

            ${i}.top .tooltip {
                margin-bottom: 4px;
            }

            ${i}.bottom .tooltip {
                margin-top: 4px;
            }

            ${i}.left .tooltip {
                margin-right: 4px;
            }

            ${i}.right .tooltip {
                margin-left: 4px;
            }

            ${i}.top.left .tooltip,
            ${i}.top.right .tooltip {
                margin-bottom: 0px;
            }

            ${i}.bottom.left .tooltip,
            ${i}.bottom.right .tooltip {
                margin-top: 0px;
            }

            ${i}.top.left .tooltip,
            ${i}.bottom.left .tooltip {
                margin-right: 0px;
            }

            ${i}.top.right .tooltip,
            ${i}.bottom.right .tooltip {
                margin-left: 0px;
            }

        `.withBehaviors(la(Yt`
                :host([disabled]) {
                    opacity: 1;
                }
            `))}});const kh=Yt`
    .expand-collapse-glyph {
        transform: rotate(0deg);
    }
    :host(.nested) .expand-collapse-button {
        left: var(--expand-collapse-button-nested-width, calc(${Tc} * -1px));
    }
    :host([selected])::after {
        left: calc(${$l} * 1px);
    }
    :host([expanded]) > .positioning-region .expand-collapse-glyph {
        transform: rotate(45deg);
    }
`,Ch=Yt`
    .expand-collapse-glyph {
        transform: rotate(180deg);
    }
    :host(.nested) .expand-collapse-button {
        right: var(--expand-collapse-button-nested-width, calc(${Tc} * -1px));
    }
    :host([selected])::after {
        right: calc(${$l} * 1px);
    }
    :host([expanded]) > .positioning-region .expand-collapse-glyph {
        transform: rotate(135deg);
    }
`,$h=Jt`((${fl} / 2) * ${xl}) + ((${xl} * ${yl}) / 2)`,_h=sn.create("tree-item-expand-collapse-hover").withDefault((e=>{const t=rc.getValueFor(e);return t.evaluate(e,t.evaluate(e).hover).hover})),Sh=sn.create("tree-item-expand-collapse-selected-hover").withDefault((e=>{const t=Zd.getValueFor(e);return rc.getValueFor(e).evaluate(e,t.evaluate(e).rest).hover}));ra.compose({baseName:"tree-item",template:(e,t)=>Tt`
    <template
        role="treeitem"
        slot="${e=>e.isNestedItem()?"item":void 0}"
        tabindex="-1"
        class="${e=>e.expanded?"expanded":""} ${e=>e.selected?"selected":""} ${e=>e.nested?"nested":""}
            ${e=>e.disabled?"disabled":""}"
        aria-expanded="${e=>e.childItems&&e.childItemLength()>0?e.expanded:void 0}"
        aria-selected="${e=>e.selected}"
        aria-disabled="${e=>e.disabled}"
        @focusin="${(e,t)=>e.handleFocus(t.event)}"
        @focusout="${(e,t)=>e.handleBlur(t.event)}"
        ${ki({property:"childItems",filter:vi()})}
    >
        <div class="positioning-region" part="positioning-region">
            <div class="content-region" part="content-region">
                ${ci((e=>e.childItems&&e.childItemLength()>0),Tt`
                        <div
                            aria-hidden="true"
                            class="expand-collapse-button"
                            part="expand-collapse-button"
                            @click="${(e,t)=>e.handleExpandCollapseButtonClick(t.event)}"
                            ${di("expandCollapseButton")}
                        >
                            <slot name="expand-collapse-glyph">
                                ${t.expandCollapseGlyph||""}
                            </slot>
                        </div>
                    `)}
                ${_i(0,t)}
                <slot></slot>
                ${$i(0,t)}
            </div>
        </div>
        ${ci((e=>e.childItems&&e.childItemLength()>0&&(e.expanded||e.renderCollapsedChildren)),Tt`
                <div role="group" class="items" part="items">
                    <slot name="item" ${xi("items")}></slot>
                </div>
            `)}
    </template>
`,styles:(e,t)=>Yt`
    /**
     * This animation exists because when tree item children are conditionally loaded
     * there is a visual bug where the DOM exists but styles have not yet been applied (essentially FOUC).
     * This subtle animation provides a ever so slight timing adjustment for loading that solves the issue.
     */
    @keyframes treeItemLoading {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
         }
    }

    ${ca("block")} :host {
        contain: content;
        position: relative;
        outline: none;
        color: ${bc};
        background: ${nc};
        cursor: pointer;
        font-family: ${ml};
        --expand-collapse-button-size: calc(${Tc} * 1px);
        --tree-item-nested-width: 0;
    }

        :host(:focus) > .positioning-region {
            outline: none;
        }

        :host(:focus) .content-region {
            outline: none;
        }

        :host(:${ha}) .positioning-region {
            border: ${uc} calc(${Cl} * 1px) solid;
            border-radius: calc(${bl} * 1px);
            color: ${bc};
        }

        .positioning-region {
            display: flex;
            position: relative;
            box-sizing: border-box;
            background: ${nc};
            border: transparent calc(${Cl} * 1px) solid;
            height: calc((${Tc} + 1) * 1px);
        }

        .positioning-region::before {
            content: "";
            display: block;
            width: var(--tree-item-nested-width);
            flex-shrink: 0;
        }

        :host(:not([disabled])) .positioning-region:hover {
            background: ${sc};
        }

        :host(:not([disabled])) .positioning-region:active {
            background: ${ac};
        }

        .content-region {
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
            width: 100%;
            height: calc(${Tc} * 1px);
            margin-inline-start: calc(${xl} * 2px + 8px);
            font-size: ${_l};
            line-height: ${Sl};
            font-weight: 400;
        }

        .items {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            font-size: calc(1em + (${xl} + 16) * 1px);
        }

        .expand-collapse-button {
            background: none;
            border: none;
            outline: none;
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: calc((${$h} + (${xl} * 2)) * 1px);
            height: calc((${$h} + (${xl} * 2)) * 1px);
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin-left: 6px;
            margin-right: 6px;
        }

        .expand-collapse-glyph {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: 16px;
            height: 16px;
            transition: transform 0.1s linear;

            pointer-events: none;
            fill: currentcolor;
        }

        .start,
        .end {
            display: flex;
            fill: currentcolor;
        }

        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: 16px;
            height: 16px;
        }

        .start {
            /* TODO: horizontalSpacing https://github.com/microsoft/fast/issues/2766 */
            margin-inline-end: calc(${xl} * 2px + 2px);
        }

        .end {
            /* TODO: horizontalSpacing https://github.com/microsoft/fast/issues/2766 */
            margin-inline-start: calc(${xl} * 2px + 2px);
        }

        :host([expanded]) > .items {
            animation: treeItemLoading ease-in 10ms;
            animation-iteration-count: 1;
            animation-fill-mode: forwards;
        }

        :host([disabled]) .content-region {
            opacity: ${kl};
            cursor: ${"not-allowed"};
        }

        :host(.nested) .content-region {
            position: relative;
            margin-inline-start: var(--expand-collapse-button-size);
        }

        :host(.nested) .expand-collapse-button {
            position: absolute;
        }

        :host(.nested:not([disabled])) .expand-collapse-button:hover {
            background: ${_h};
        }

        :host([selected]) .positioning-region {
            background: ${Yd};
        }

        :host([selected]:not([disabled])) .positioning-region:hover {
            background: ${Qd};
        }

        :host([selected]:not([disabled])) .positioning-region:active {
            background: ${Jd};
        }

        :host([selected]:not([disabled])) .expand-collapse-button:hover {
            background: ${Sh};
        }

        :host([selected])::after {
            /* The background needs to be calculated based on the selected background state
                for this control. We currently have no way of changing that, so setting to
                accent-foreground-rest for the time being */
            background: ${Gd};
            border-radius: calc(${bl} * 1px);
            content: "";
            display: block;
            position: absolute;
            top: calc((${Tc} / 4) * 1px);
            width: 3px;
            height: calc((${Tc} / 2) * 1px);
        }

        ::slotted(${e.tagFor(ra)}) {
            --tree-item-nested-width: 1em;
            --expand-collapse-button-nested-width: calc(${Tc} * -1px);
        }
    `.withBehaviors(new Rc(kh,Ch),la(Yt`
            :host {
                forced-color-adjust: none;
                border-color: transparent;
                background: ${Ao.Field};
                color: ${Ao.FieldText};
            }
            :host .content-region .expand-collapse-glyph {
                fill: ${Ao.FieldText};
            }
            :host .positioning-region:hover,
            :host([selected]) .positioning-region {
                background: ${Ao.Highlight};
            }
            :host .positioning-region:hover .content-region,
            :host([selected]) .positioning-region .content-region {
                color: ${Ao.HighlightText};
            }
            :host .positioning-region:hover .content-region .expand-collapse-glyph,
            :host .positioning-region:hover .content-region .start,
            :host .positioning-region:hover .content-region .end,
            :host([selected]) .content-region .expand-collapse-glyph,
            :host([selected]) .content-region .start,
            :host([selected]) .content-region .end {
                fill: ${Ao.HighlightText};
            }
            :host([selected])::after {
                background: ${Ao.Field};
            }
            :host(:${ha}) .positioning-region {
                border-color: ${Ao.FieldText};
                box-shadow: 0 0 0 2px inset ${Ao.Field};
                color: ${Ao.FieldText};
            }
            :host([disabled]) .content-region,
            :host([disabled]) .positioning-region:hover .content-region {
                opacity: 1;
                color: ${Ao.GrayText};
            }
            :host([disabled]) .content-region .expand-collapse-glyph,
            :host([disabled]) .content-region .start,
            :host([disabled]) .content-region .end,
            :host([disabled]) .positioning-region:hover .content-region .expand-collapse-glyph,
            :host([disabled]) .positioning-region:hover .content-region .start,
            :host([disabled]) .positioning-region:hover .content-region .end {
                fill: ${Ao.GrayText};
            }
            :host([disabled]) .positioning-region:hover {
                background: ${Ao.Field};
            }
            .expand-collapse-glyph,
            .start,
            .end {
                fill: ${Ao.FieldText};
            }
            :host(.nested) .expand-collapse-button:hover {
                background: ${Ao.Field};
            }
            :host(.nested) .expand-collapse-button:hover .expand-collapse-glyph {
                fill: ${Ao.FieldText};
            }
        `)),expandCollapseGlyph:'\n        <svg\n            viewBox="0 0 16 16"\n            xmlns="http://www.w3.org/2000/svg"\n            class="expand-collapse-glyph"\n        >\n            <path\n                d="M5.00001 12.3263C5.00124 12.5147 5.05566 12.699 5.15699 12.8578C5.25831 13.0167 5.40243 13.1437 5.57273 13.2242C5.74304 13.3047 5.9326 13.3354 6.11959 13.3128C6.30659 13.2902 6.4834 13.2152 6.62967 13.0965L10.8988 8.83532C11.0739 8.69473 11.2153 8.51658 11.3124 8.31402C11.4096 8.11146 11.46 7.88966 11.46 7.66499C11.46 7.44033 11.4096 7.21853 11.3124 7.01597C11.2153 6.81341 11.0739 6.63526 10.8988 6.49467L6.62967 2.22347C6.48274 2.10422 6.30501 2.02912 6.11712 2.00691C5.92923 1.9847 5.73889 2.01628 5.56823 2.09799C5.39757 2.17969 5.25358 2.30817 5.153 2.46849C5.05241 2.62882 4.99936 2.8144 5.00001 3.00369V12.3263Z"\n            />\n        </svg>\n    '}),na.compose({baseName:"tree-view",template:(e,t)=>Tt`
    <template
        role="tree"
        ${di("treeView")}
        @keydown="${(e,t)=>e.handleKeyDown(t.event)}"
        @focusin="${(e,t)=>e.handleFocus(t.event)}"
        @focusout="${(e,t)=>e.handleBlur(t.event)}"
        @click="${(e,t)=>e.handleClick(t.event)}"
        @selected-change="${(e,t)=>e.handleSelectedChange(t.event)}"
    >
        <slot ${xi("slottedTreeItems")}></slot>
    </template>
`,styles:(e,t)=>Yt`
    ${ca("flex")} :host {
        flex-direction: column;
        align-items: stretch;
        min-width: fit-content;
        font-size: 0;
    }

    :host:focus-visible {
        outline: none;
    }
`});function Th(e){return un.getOrCreate(e).withPrefix("fast")}const Eh=Yt`
    :host {
        --accent-fill-rest: var(--uva-grey-lightest) !important;
        --accent-fill-hover: var(--uva-grey-light, grey) !important;
        --foreground-on-accent-hover: var(--uva-grey-base) !important;
        --foreground-on-accent-rest: var(--uva-grey-base) !important;
        --neutral-fill-rest: var(--uva-blue-alt-base, blue) !important;
        --neutral-fill-hover: var(--uva-blue-alt-dark, darkblue) !important;
        --neutral-fill-input-hover: var(--uva-grey-light, grey) !important;
        --neutral-fill-input-rest: var(--uva-grey-lightest, white) !important;
        --neutral-foreground-rest: var(--uva-text-color-base, black) !important;
        --neutral-fill-stealth-rest: var(--uva-grey-lightest, white) !important;
        --neutral-fill-stealth-hover: var(--uva-grey-light, grey) !important;
    }
`;Th().withPrefix("site").register(gh({styles:(e,t)=>Yt`
                ${fh()}
                ${Eh}
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
            `}),bh({styles:(e,t)=>Yt`
                ${vh()}
                ${Eh}
            `}),yh({styles:(e,t)=>Yt`
                ${mh()}
                ${Eh}      
            `})),Th().withPrefix("site").register(dh({styles:(e,t)=>Yt`
                ${Eh}
                ${qc(e)}
                :host .listbox {
                    background: var(--uva-grey-lightest);
                }
            `}),ih({styles:(e,t)=>Yt`
                ${Eh}
                ${th()}
            `})),Th().withPrefix("site").register(Vc({styles:(e,t)=>Yt`
                ${Eh}
                ${Nc(e)}
            `}));var Ah=u`:host{display:block;padding:25px;color:var(--uva-text-color-base,#000)}`;class Ih extends Me{constructor(){super(...arguments),this.query="",this.describe="",this.sourceTitle="UVA Library"}static get styles(){return[...super.styles,Ah]}render(){return B` <form action="https://search.lib.virginia.edu/search" id="searchForm" method="get" @submit="${this.search}"> <span class="icon-search"></span> <input name="q" id="search" type="text" aria-label="Search everything…" placeholder="Search everything…" .value="${this.query}"> <button type="submit" class="uvalib-button-home-search" aria-label="Search" @submit="${this.search}"></button> </form> <p>${this.describe}</p> `}search(e){return e.preventDefault(),this.query=this.inputEl.value,this.dispatchEvent(new Event("search",{bubbles:!0,composed:!0})),!1}}o([fe("input#search")],Ih.prototype,"inputEl",void 0),o([he({type:String})],Ih.prototype,"query",void 0),o([he({type:String})],Ih.prototype,"describe",void 0),o([he({type:String,attribute:"source-title"})],Ih.prototype,"sourceTitle",void 0),window.customElements.define("bento-search",Ih);var Oh=u`:host{display:block;padding:25px;color:var(--uva-text-color-base,#000)}`;class Lh extends Me{static get styles(){return[...super.styles,Oh]}constructor(){super(),this.query="",this.limit=5,this.searchDescribe="This page searches Virgo, Virgo articles, subject guides, and the Library website.",this.noResultDescribe="No results found.",this.boxes=["catalog","articles","libguides","website"],window.onpopstate=e=>{this.query=e.state&&e.state.query?e.state.query:""}}firstUpdated(){super.firstUpdated();const e=new URLSearchParams(window.location.search);e.has("query")&&(this.query=e.get("query"))}render(){return B` <style>[hidden]{display:none!important}</style> <bento-search .describe="${this.searchDescribe}" class="bento-search-bar" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" id="searchBox" .query="${this.query}" @search="${this.search}"></bento-search> <div class="bs-header" ?hidden="${!this.query}"> <h2>You searched for <span class="bs-search-term">${this.query}</span></h2> <p>Here are the results:</p> </div> <div class="bs-results-container" ?hidden="${!this.query}"> ${this.boxes.map((e=>{switch(e){case"catalog":return import("./4fae09b9.js"),B`<catalog-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></catalog-section>`;case"articles":return import("./218dda2d.js"),B`<articles-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></articles-section>`;case"website":return import("./4ea3ce10.js"),B`<website-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></website-section>`;case"libguides":return import("./59bc5ca1.js"),B`<libguides-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></libguides-section>`;case"talk":return import("./51f5f090.js"),B`<bento-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}" title="Talk to a subject expert"></bento-section>`;case"libraries":return import("./67170c9e.js"),B`<libraries-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"></libraries-section>`;case"events":return Promise.resolve().then((function(){return Jh})),B`<events-section no-result-describe="${this.noResultDescribe}" class="bs-results--block" title="Events" ?no-shadow-dom="${this.noShadowDom}" ?no-style="${this.noStyle}" limit="${this.limit}" query="${this.query}"> <p slot="see-more" class="event-see-all"><a href="https://cal.lib.virginia.edu/events">See all Library events</a></p> </events-section>`;default:return console.error("Requesting a Bento section that does not exist"),""}}))} </div> `}search(e){this.query=e.target.query,history.pushState({query:this.query},"Search for this.query",`?query=${this.query}`)}}o([he({type:String})],Lh.prototype,"query",void 0),o([he({type:Number})],Lh.prototype,"limit",void 0),o([he({type:String,attribute:"search-describe"})],Lh.prototype,"searchDescribe",void 0),o([he({type:String,attribute:"no-result-describe"})],Lh.prototype,"noResultDescribe",void 0),o([he({type:Array})],Lh.prototype,"boxes",void 0),window.customElements.define("bento-box",Lh);class Fh extends ae{constructor(){super(...arguments),this.auto=!1}fetchResults(){if(this.url){const e=new URL(this.url);if(this.params)for(const[t,i]of Object.entries(this.params))e.searchParams.set(t,i);fetch(e.toString()).then((e=>e.json())).then((e=>{this.lastResponse=e})),this.poll&&setTimeout((()=>{this.fetchResults()}),this.poll)}}updated(e){this.auto&&(e.has("auto")||e.has("url")||e.has("params")||e.has("poll"))&&this.fetchResults(),this.lastResponse&&this.dispatchEvent(new Event("response",{bubbles:!0,composed:!0}))}}o([he({type:Boolean})],Fh.prototype,"auto",void 0),o([he({type:String})],Fh.prototype,"url",void 0),o([he({type:Object})],Fh.prototype,"params",void 0),o([he({type:Number,attribute:"debounce-duration"})],Fh.prototype,"debounceDuration",void 0),o([he({type:Number})],Fh.prototype,"poll",void 0),o([he({type:Object})],Fh.prototype,"lastResponse",void 0);class Mh{static async guestAuthToken(){const e=await fetch(this.authURL,{method:"POST"}).then((e=>e.text()));return void 0!==e?`Bearer ${e}`:""}static async fetchData(e,t,i,o=5){const r={method:"POST",headers:{Accept:"application/json","Content-Type":"application/json;charset=UTF-8",Authorization:await Mh.guestAuthToken()},body:JSON.stringify({query:`keyword: {${void 0===i?"":i}}`,pagination:{start:0,rows:o},sort:{sort_id:"SortRelevance",order:"desc"},filters:[{pool_id:"uva_library",facets:[]}]})},n=await fetch(e,r).then((e=>e.json()));return Mh.parseResults(t,n)}static parseResults(e,t){const i=[],o=t.pagination&&t.pagination.total?{totalResults:t.pagination.total}:{totalResults:0};return void 0!==t.group_list&&t.group_list.forEach((t=>{if(1===t.count){const o=t.record_list[0],r=o.fields.find((e=>"identifier"===e.type)).value,n=r?`${e}/${r}`:void 0,s=o.fields.find((e=>"published_date"===e.name)),a={id:o.fields.find((e=>"identifier"===e.type)).value,title:o.fields.find((e=>"title"===e.type)).value,description:"",link:n,author:o.fields.filter((e=>"author"===e.type)).map((e=>e.value)),datePublished:s?new Date(Date.UTC.apply(null,s.value.split("-"))):void 0,publicationType:o.fields.filter((e=>"pub_type"===e.name)).map((e=>e.value)),format:o.fields.filter((e=>"format"===e.name)).map((e=>e.value))};i.push(a)}else console.log("handle grouped item")})),{items:i,meta:o}}}Mh.authURL="https://search.lib.virginia.edu/authorize";class Rh{constructor(e){this.items=[],this.meta={totalResults:0},Object.assign(this,e)}async fetchData(){return this.items=[],Promise.resolve({items:this.items,meta:this.meta})}}class Dh extends Rh{constructor(){super(...arguments),this.items=[]}async fetchData(e){return Mh.fetchData(Dh.virgoCatalogPoolURL,Dh.catalogLinkBase,this.query,e&&e.limit?e.limit:this.limit).then((e=>(e.meta.url=`https://search.lib.virginia.edu/?q=${this.query}&pool=uva_library`,this.items=e.items,this.meta=e.meta,e)))}}Dh.virgoCatalogPoolURL="https://pool-solr-ws-uva-library.internal.lib.virginia.edu/api/search",Dh.catalogLinkBase="https://search.lib.virginia.edu/sources/uva_library/items";class zh extends Rh{constructor(){super(...arguments),this.items=[]}async fetchData(e){return Mh.fetchData(zh.articlePoolURL,zh.articleLinkBaseURL,this.query,e&&e.limit?e.limit:this.limit).then((e=>(e.meta.url=`https://search.lib.virginia.edu/?q=keyword:+{${this.query}}&pool=articles`,this.items=e.items,this.meta=e.meta,e)))}}zh.articlePoolURL="https://pool-eds-ws.internal.lib.virginia.edu/api/search",zh.articleLinkBaseURL="https://search.lib.virginia.edu/sources/articles/items";const Ph="https://library.virginia.edu/search/content";class Nh extends Rh{constructor(e){super(),this.type="",this.types=[],Object.assign(this,e)}makeQueryString(){if(this.types&&this.types.length>0){let e=this.query?`filter[fulltext]=${this.query}&`:"";return e+=this.limit?`page[limit]=${this.limit}&`:"",e+="filter[types-group][group][conjunction]=OR",this.types.forEach((t=>{e+=`&filter[${t}-filter][condition][path]=type&filter[${t}-filter][condition][value]=${t}`,e+=`&filter[${t}-filter][condition][memberOf]=types-group`})),e}return`${this.query?`filter[fulltext]=${this.query}&`:""}${this.type?`filter[type]=${this.type}&page[limit]=${this.limit}`:""}`}makeURL(){return`${Nh.drupalSearchEndpointURL}?${this.makeQueryString()}`.replace(/^(.*)\?$/,"$1")}async fetchData(e){return e&&e.limit&&(this.limit=e.limit),fetch(this.makeURL()).then((e=>e.json())).then((e=>(this._parseResults(e),{items:this.items,meta:this.meta})))}_parseResults(e){this.items=e.data?e.data.map((e=>({title:e.attributes.title,description:e.attributes.body?e.attributes.body.value:null}))):[],this.meta.totalResults=e.data&&e.data.meta?e.data.meta.count:0}}function Hh(e,t){if(t.length<e)throw new TypeError(e+" argument"+(e>1?"s":"")+" required, but only "+t.length+" present")}function Bh(e){return Bh="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Bh(e)}function Vh(e){Hh(1,arguments);var t=Object.prototype.toString.call(e);return e instanceof Date||"object"===Bh(e)&&"[object Date]"===t?new Date(e.getTime()):"number"==typeof e||"[object Number]"===t?new Date(e):("string"!=typeof e&&"[object String]"!==t||"undefined"==typeof console||(console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments"),console.warn((new Error).stack)),new Date(NaN))}function jh(e){Hh(1,arguments);var t=Vh(e);return t.setHours(0,0,0,0),t}function Uh(e){if(Hh(1,arguments),"string"==typeof e){var t=e.match(/(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{0,7}))?(?:Z|(.)(\d{2}):?(\d{2})?)?/);return t?new Date(Date.UTC(+t[1],+t[2]-1,+t[3],+t[4]-(+t[9]||0)*("-"==t[8]?-1:1),+t[5]-(+t[10]||0)*("-"==t[8]?-1:1),+t[6],+((t[7]||"0")+"00").substring(0,3))):new Date(NaN)}return Vh(e)}function Wh(e){return{id:e.id,title:e.title,allday:e.allday,start:e.start?Uh(e.start).getTime():null,end:e.end?Uh(e.end).getTime():null,description:e.description,link:e.url.public,location:e.location.name,campusLocation:e.campus,category:e.category.name,owner:e.owner.name,calendar:{name:e.calendar.name,url:e.calendar.public},registration:e.registration,registrationOpen:e.has_registration_opened,registrationClosed:e.has_registration_closed,seats:e.seats,seatsTaken:e.seats_taken,physicalSeats:e.physical_seats,physicalSeatsTaken:e.physical_seats_taken,onlineSeats:e.online_seats,onlineSeatsTaken:e.online_seats_taken,waitList:e.wait_list,image:e.featured_image,futureDates:e.future_dates.map((e=>({id:e.event_id,start:Uh(e.start).getTime()}))),registrationCost:e.registration_cost,moreInfo:e.more_info,setupTime:e.setup_time,teardownTime:e.teardown_time}}Nh.drupalSearchEndpointURL="https://api.library.virginia.edu/drupal/jsonapi/index/default_index";class qh extends Rh{constructor(e){super(),this.items=[],Object.assign(this,e)}endpointURL(){let e=this.query?`&search=${this.query}`:"";return e+=this.limit?`&limit=${this.limit}`:"",e+=this.category?`&category=${this.category}`:"",this.query?`https://api2.libcal.com/1.0/event_search?key=c45a1428103ed000ba4025e9970edf54&iid=863&cal_id=4299&limit=600&campus=&category=&days=365${e}`:`https://api2.libcal.com/1.0/events?key=c45a1428103ed000ba4025e9970edf54&iid=863&cal_id=4299&limit=600&campus=&category=&days=365${e}`}async fetchData(){return fetch(this.endpointURL()).then((e=>e.json())).then((e=>(this._parseResults(e),{items:this.items,meta:this.meta})))}_parseResults(e){this.items=e.events.map(Wh),this.meta.totalResults=e.events.length}}var Gh,Xh=u`:host{display:block;padding:25px;color:var(--uva-text-color-base,#000);border:1px solid #000;border-radius:16px}[hidden]{display:none}`;class Kh extends ae{constructor(){super(...arguments),this.message="",this.overlay=!1,this.dots=!0}render(){return B` ${this.overlay?B` <div class="v4-spinner-overlay"> <div class="v4-spinner ${this.dots?"border":""}"> ${this.dots?B` ${this.message?B`<h3>${this.message}</h3>`:""} <div class="spinner-animation"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> `:B` <div class="book"> <div class="book-page"></div> <div class="book-page"></div> <div class="book-page"></div> <p>Searching...</p> </div> `} </div> </div> `:B` <div class="v4-spinner embed"> ${this.message?B`<h3>${this.message}</h3>`:""} <div class="spinner-animation"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> </div> `} `}}function Zh(e){return B` ${e.link?B` <div class="bento-section-title"><a href="${e.link}">${Te(e.title)}</a></div> `:B` <div class="bento-section-title">${Te(e.title)}</div> `} <div class="bento-section-desc">${Te(e.description)}</div> `}Kh.styles=u`:host{display:block}.spinner-animation>div{background-color:var(--site-spinner-color,var(--uvalib-brand-orange-base,orange));height:var(--site-spinner-size,18px);width:var(--site-spinner-size,18px)}div.v4-spinner-overlay{position:fixed;left:0;top:0;width:100%;height:100%;z-index:1000;background:rgba(0,0,0,.1)}div.v4-spinner{background:#fff;margin:12vw auto;text-align:center;padding:10px 150px 25px 150px;display:inline-block;font-weight:700;color:var(--uva-text-color-base);box-shadow:var(--box-shadow)}div.v4-spinner.embed{box-shadow:none;padding:0;margin:0;background:0 0}@media only screen and (min-width:768px){div.v4-spinner{padding:40px 90px}}@media only screen and (max-width:768px){div.v4-spinner{width:95%;padding:40px 0;margin-top:30%}}div.v4-spinner h1{color:var(--uva-text-color-base);border:none}.spinner-animation{margin:0 auto;width:80px;text-align:center}.spinner-animation>div{width:18px;height:18px;border-radius:100%;display:inline-block;-webkit-animation:sk-bouncedelay 1.4s infinite ease-in-out both;animation:sk-bouncedelay 1.4s infinite ease-in-out both;margin:0 2px}.spinner-animation .bounce1{-webkit-animation-delay:-.32s;animation-delay:-.32s}.spinner-animation .bounce2{-webkit-animation-delay:-.16s;animation-delay:-.16s}@-webkit-keyframes sk-bouncedelay{0%,100%,80%{-webkit-transform:scale(0)}40%{-webkit-transform:scale(1)}}@keyframes sk-bouncedelay{0%,100%,80%{-webkit-transform:scale(0);transform:scale(0)}40%{-webkit-transform:scale(1);transform:scale(1)}}.book{top:50%;transform:translateY(-4%);position:relative;margin:0 auto;border:5px solid var(--uvalib-brand-orange-base);width:140px;height:80px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:center;align-content:stretch;align-items:center}.book-page{position:absolute;left:50%;top:-5px;margin:0 auto;border-top:5px solid var(--uvalib-brand-orange-base);border-bottom:5px solid var(--uvalib-brand-orange-base);border-right:5px solid var(--uvalib-brand-orange-base);background:#fff;width:70px;height:80px;transform-origin:0 50%;animation:flip 1.2s infinite linear;animation-fill-mode:forwards}.book-page:nth-child(1){z-index:-1;animation-delay:0s}.book-page:nth-child(2){z-index:-2;animation-delay:.5s}.book-page:nth-child(3){z-index:-3;animation-delay:1s}div.v4-spinner .book p{color:var(--uva-text-color-base,#000);border:none;font-size:1.25em;margin:0 0 10px 0}@keyframes flip{0%{transform:perspective(600px) rotateY(0)}20%{background:#e6e6e6}29.9%{background:#e6e6e6}30%{transform:perspective(200px) rotateY(-90deg);background:#fff}54.999%{opacity:1}55%{opacity:0}60%{transform:perspective(200px) rotateY(-180deg);background:#fff}100%{transform:perspective(200px) rotateY(-180deg);background:#fff}}`,o([he({type:String})],Kh.prototype,"message",void 0),o([he({type:Boolean})],Kh.prototype,"overlay",void 0),o([he({type:Boolean})],Kh.prototype,"dots",void 0),window.customElements.define("site-spinner",Kh);class Yh extends Me{constructor(){super(...arguments),this.query="",this.limit=void 0,this.title="",this.label=null,this.items=[],this.loading=!1,this.noResultDescribe="",this.isEmptySearch=!0}static get styles(){return[...super.styles,Xh]}updated(e){(e.has("items")||e.has("loading"))&&(this.isEmptySearch=this.loading||!this.items||0===this.items.length)}renderBriefItem(e){return Zh(e)}render(){return B` <h1>${this.title}</h1> ${null==this.label||""!==this.label?B` <h2 ?hidden="${this.loading}">${this.label?this.label:B`Search for ${this.query}`}</h2> `:""} ${this.loading?B`<site-spinner></site-spinner>`:""} <p id="no-results" ?hidden="${this.isEmptySearch}">${this.noResultDescribe}</p> <ul ?hidden="${this.loading}"> ${this.items.map((e=>B` <li> ${this.renderBriefItem(e)} </li> `))} </ul> `}}o([he({type:String})],Yh.prototype,"query",void 0),o([he({type:Number})],Yh.prototype,"limit",void 0),o([he({type:String})],Yh.prototype,"title",void 0),o([he({type:String})],Yh.prototype,"label",void 0),o([he({type:Array})],Yh.prototype,"items",void 0),o([he({type:Boolean})],Yh.prototype,"loading",void 0),o([he({type:String,attribute:"no-result-describe"})],Yh.prototype,"noResultDescribe",void 0),o([he({type:Boolean,attribute:"is-empty-search"})],Yh.prototype,"isEmptySearch",void 0);class Qh extends Yh{constructor(){super(),this.items=[],Gh.set(this,void 0),this.title="",s(this,Gh,new qh,"f")}updated(e){super.updated(e),(e.has("query")||e.has("limit")||e.has("category"))&&(this.loading=!0,n(this,Gh,"f").query=this.query,n(this,Gh,"f").limit=this.limit,n(this,Gh,"f").category=this.category,n(this,Gh,"f").fetchData().then((e=>{this.items=e.items,this.loading=!1})))}_dateRange(e,t){const i=e?new Date(e):new Date,o=t?new Date(t):new Date;return function(e,t){Hh(2,arguments);var i=jh(e),o=jh(t);return i.getTime()===o.getTime()}(i,o)?new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric",timeZone:"America/New_York"}).format(i):`${new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",timeZone:"America/New_York"}).format(i)} - ${new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric",timeZone:"America/New_York"}).format(o)}`}_timeRange(e,t){return`${new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"}).format(e)} - ${new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",timeZoneName:"short",timeZone:"America/New_York"}).format(t)}`}render(){return B` ${this.title?B`<h2>${this.title}</h2>`:""} <div class="event-container"> ${this.loading?B`<site-spinner></site-spinner>`:""} ${this.items.map((e=>B` <div class="event"> <a href="${e.link}" class="event-url"> <h4 class="event-title">${e.title}</h4> <p class="event-date">${this._dateRange(e.start,e.end)}</p> <p class="event-time">${this._timeRange(e.start,e.end)}</p> </a> </div> `))} <slot name="see-more"></slot> </div> `}}Gh=new WeakMap,o([he({type:String})],Qh.prototype,"category",void 0),o([he({type:Array})],Qh.prototype,"items",void 0),window.customElements.define("events-section",Qh);var Jh=Object.freeze({__proto__:null});const eu=Symbol("Comlink.proxy"),tu=Symbol("Comlink.endpoint"),iu=Symbol("Comlink.releaseProxy"),ou=Symbol("Comlink.thrown"),ru=e=>"object"==typeof e&&null!==e||"function"==typeof e,nu=new Map([["proxy",{canHandle:e=>ru(e)&&e[eu],serialize(e){const{port1:t,port2:i}=new MessageChannel;return su(e,t),[i,[i]]},deserialize:e=>(e.start(),lu(e))}],["throw",{canHandle:e=>ru(e)&&ou in e,serialize({value:e}){let t;return t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[t,[]]},deserialize(e){if(e.isError)throw Object.assign(new Error(e.value.message),e.value);throw e.value}}]]);function su(e,t=self){t.addEventListener("message",(function i(o){if(!o||!o.data)return;const{id:r,type:n,path:s}=Object.assign({path:[]},o.data),a=(o.data.argumentList||[]).map(fu);let l;try{const t=s.slice(0,-1).reduce(((e,t)=>e[t]),e),i=s.reduce(((e,t)=>e[t]),e);switch(n){case"GET":l=i;break;case"SET":t[s.slice(-1)[0]]=fu(o.data.value),l=!0;break;case"APPLY":l=i.apply(t,a);break;case"CONSTRUCT":l=pu(new i(...a));break;case"ENDPOINT":{const{port1:t,port2:i}=new MessageChannel;su(e,i),l=function(e,t){return uu.set(e,t),e}(t,[t])}break;case"RELEASE":l=void 0;break;default:return}}catch(e){l={value:e,[ou]:0}}Promise.resolve(l).catch((e=>({value:e,[ou]:0}))).then((e=>{const[o,s]=mu(e);t.postMessage(Object.assign(Object.assign({},o),{id:r}),s),"RELEASE"===n&&(t.removeEventListener("message",i),au(t))}))})),t.start&&t.start()}function au(e){(function(e){return"MessagePort"===e.constructor.name})(e)&&e.close()}function lu(e,t){return cu(e,[],t)}function du(e){if(e)throw new Error("Proxy has been released and is not useable")}function cu(e,t=[],i=function(){}){let o=!1;const r=new Proxy(i,{get(i,n){if(du(o),n===iu)return()=>gu(e,{type:"RELEASE",path:t.map((e=>e.toString()))}).then((()=>{au(e),o=!0}));if("then"===n){if(0===t.length)return{then:()=>r};const i=gu(e,{type:"GET",path:t.map((e=>e.toString()))}).then(fu);return i.then.bind(i)}return cu(e,[...t,n])},set(i,r,n){du(o);const[s,a]=mu(n);return gu(e,{type:"SET",path:[...t,r].map((e=>e.toString())),value:s},a).then(fu)},apply(i,r,n){du(o);const s=t[t.length-1];if(s===tu)return gu(e,{type:"ENDPOINT"}).then(fu);if("bind"===s)return cu(e,t.slice(0,-1));const[a,l]=hu(n);return gu(e,{type:"APPLY",path:t.map((e=>e.toString())),argumentList:a},l).then(fu)},construct(i,r){du(o);const[n,s]=hu(r);return gu(e,{type:"CONSTRUCT",path:t.map((e=>e.toString())),argumentList:n},s).then(fu)}});return r}function hu(e){const t=e.map(mu);return[t.map((e=>e[0])),(i=t.map((e=>e[1])),Array.prototype.concat.apply([],i))];var i}const uu=new WeakMap;function pu(e){return Object.assign(e,{[eu]:!0})}function mu(e){for(const[t,i]of nu)if(i.canHandle(e)){const[o,r]=i.serialize(e);return[{type:"HANDLER",name:t,value:o},r]}return[{type:"RAW",value:e},uu.get(e)||[]]}function fu(e){switch(e.type){case"HANDLER":return nu.get(e.name).deserialize(e.value);case"RAW":return e.value}}function gu(e,t,i){return new Promise((o=>{const r=new Array(4).fill(0).map((()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16))).join("-");e.addEventListener("message",(function t(i){i.data&&i.data.id&&i.data.id===r&&(e.removeEventListener("message",t),o(i.data))})),e.start&&e.start(),e.postMessage(Object.assign({id:r},t),i)}))}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const vu=e=>e.endsWith("/")?e:e+"/";function bu(e){return Array.isArray?Array.isArray(e):"[object Array]"===_u(e)}function yu(e){return"string"==typeof e}function xu(e){return"number"==typeof e}function wu(e){return!0===e||!1===e||function(e){return ku(e)&&null!==e}(e)&&"[object Boolean]"==_u(e)}function ku(e){return"object"==typeof e}function Cu(e){return null!=e}function $u(e){return!e.trim().length}function _u(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":Object.prototype.toString.call(e)}const Su=Object.prototype.hasOwnProperty;class Tu{constructor(e){this._keys=[],this._keyMap={};let t=0;e.forEach((e=>{let i=Eu(e);t+=i.weight,this._keys.push(i),this._keyMap[i.id]=i,t+=i.weight})),this._keys.forEach((e=>{e.weight/=t}))}get(e){return this._keyMap[e]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function Eu(e){let t=null,i=null,o=null,r=1,n=null;if(yu(e)||bu(e))o=e,t=Au(e),i=Iu(e);else{if(!Su.call(e,"name"))throw new Error((e=>`Missing ${e} property in key`)("name"));const s=e.name;if(o=s,Su.call(e,"weight")&&(r=e.weight,r<=0))throw new Error((e=>`Property 'weight' in key '${e}' must be a positive integer`)(s));t=Au(s),i=Iu(s),n=e.getFn}return{path:t,id:i,weight:r,src:o,getFn:n}}function Au(e){return bu(e)?e:e.split(".")}function Iu(e){return bu(e)?e.join("."):e}const Ou={useExtendedSearch:!1,getFn:function(e,t){let i=[],o=!1;const r=(e,t,n)=>{if(Cu(e))if(t[n]){const s=e[t[n]];if(!Cu(s))return;if(n===t.length-1&&(yu(s)||xu(s)||wu(s)))i.push(function(e){return null==e?"":function(e){if("string"==typeof e)return e;let t=e+"";return"0"==t&&1/e==-1/0?"-0":t}(e)}(s));else if(bu(s)){o=!0;for(let e=0,i=s.length;e<i;e+=1)r(s[e],t,n+1)}else t.length&&r(s,t,n+1)}else i.push(e)};return r(e,yu(t)?t.split("."):t,0),o?i:i[0]},ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1};var Lu={isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(e,t)=>e.score===t.score?e.idx<t.idx?-1:1:e.score<t.score?-1:1,includeMatches:!1,findAllMatches:!1,minMatchCharLength:1,location:0,threshold:.6,distance:100,...Ou};const Fu=/[^ ]+/g;class Mu{constructor({getFn:e=Lu.getFn,fieldNormWeight:t=Lu.fieldNormWeight}={}){this.norm=function(e=1,t=3){const i=new Map,o=Math.pow(10,t);return{get(t){const r=t.match(Fu).length;if(i.has(r))return i.get(r);const n=1/Math.pow(r,.5*e),s=parseFloat(Math.round(n*o)/o);return i.set(r,s),s},clear(){i.clear()}}}(t,3),this.getFn=e,this.isCreated=!1,this.setIndexRecords()}setSources(e=[]){this.docs=e}setIndexRecords(e=[]){this.records=e}setKeys(e=[]){this.keys=e,this._keysMap={},e.forEach(((e,t)=>{this._keysMap[e.id]=t}))}create(){!this.isCreated&&this.docs.length&&(this.isCreated=!0,yu(this.docs[0])?this.docs.forEach(((e,t)=>{this._addString(e,t)})):this.docs.forEach(((e,t)=>{this._addObject(e,t)})),this.norm.clear())}add(e){const t=this.size();yu(e)?this._addString(e,t):this._addObject(e,t)}removeAt(e){this.records.splice(e,1);for(let t=e,i=this.size();t<i;t+=1)this.records[t].i-=1}getValueForItemAtKeyId(e,t){return e[this._keysMap[t]]}size(){return this.records.length}_addString(e,t){if(!Cu(e)||$u(e))return;let i={v:e,i:t,n:this.norm.get(e)};this.records.push(i)}_addObject(e,t){let i={i:t,$:{}};this.keys.forEach(((t,o)=>{let r=t.getFn?t.getFn(e):this.getFn(e,t.path);if(Cu(r))if(bu(r)){let e=[];const t=[{nestedArrIndex:-1,value:r}];for(;t.length;){const{nestedArrIndex:i,value:o}=t.pop();if(Cu(o))if(yu(o)&&!$u(o)){let t={v:o,i:i,n:this.norm.get(o)};e.push(t)}else bu(o)&&o.forEach(((e,i)=>{t.push({nestedArrIndex:i,value:e})}))}i.$[o]=e}else if(yu(r)&&!$u(r)){let e={v:r,n:this.norm.get(r)};i.$[o]=e}})),this.records.push(i)}toJSON(){return{keys:this.keys,records:this.records}}}function Ru(e,t,{getFn:i=Lu.getFn,fieldNormWeight:o=Lu.fieldNormWeight}={}){const r=new Mu({getFn:i,fieldNormWeight:o});return r.setKeys(e.map(Eu)),r.setSources(t),r.create(),r}function Du(e,{errors:t=0,currentLocation:i=0,expectedLocation:o=0,distance:r=Lu.distance,ignoreLocation:n=Lu.ignoreLocation}={}){const s=t/e.length;if(n)return s;const a=Math.abs(o-i);return r?s+a/r:a?1:s}function zu(e,t,i,{location:o=Lu.location,distance:r=Lu.distance,threshold:n=Lu.threshold,findAllMatches:s=Lu.findAllMatches,minMatchCharLength:a=Lu.minMatchCharLength,includeMatches:l=Lu.includeMatches,ignoreLocation:d=Lu.ignoreLocation}={}){if(t.length>32)throw new Error(`Pattern length exceeds max of ${32}.`);const c=t.length,h=e.length,u=Math.max(0,Math.min(o,h));let p=n,m=u;const f=a>1||l,g=f?Array(h):[];let v;for(;(v=e.indexOf(t,m))>-1;){let e=Du(t,{currentLocation:v,expectedLocation:u,distance:r,ignoreLocation:d});if(p=Math.min(e,p),m=v+c,f){let e=0;for(;e<c;)g[v+e]=1,e+=1}}m=-1;let b=[],y=1,x=c+h;const w=1<<c-1;for(let o=0;o<c;o+=1){let n=0,a=x;for(;n<a;){Du(t,{errors:o,currentLocation:u+a,expectedLocation:u,distance:r,ignoreLocation:d})<=p?n=a:x=a,a=Math.floor((x-n)/2+n)}x=a;let l=Math.max(1,u-a+1),v=s?h:Math.min(u+a,h)+c,k=Array(v+2);k[v+1]=(1<<o)-1;for(let n=v;n>=l;n-=1){let s=n-1,a=i[e.charAt(s)];if(f&&(g[s]=+!!a),k[n]=(k[n+1]<<1|1)&a,o&&(k[n]|=(b[n+1]|b[n])<<1|1|b[n+1]),k[n]&w&&(y=Du(t,{errors:o,currentLocation:s,expectedLocation:u,distance:r,ignoreLocation:d}),y<=p)){if(p=y,m=s,m<=u)break;l=Math.max(1,2*u-m)}}if(Du(t,{errors:o+1,currentLocation:u,expectedLocation:u,distance:r,ignoreLocation:d})>p)break;b=k}const k={isMatch:m>=0,score:Math.max(.001,y)};if(f){const e=function(e=[],t=Lu.minMatchCharLength){let i=[],o=-1,r=-1,n=0;for(let s=e.length;n<s;n+=1){let s=e[n];s&&-1===o?o=n:s||-1===o||(r=n-1,r-o+1>=t&&i.push([o,r]),o=-1)}return e[n-1]&&n-o>=t&&i.push([o,n-1]),i}(g,a);e.length?l&&(k.indices=e):k.isMatch=!1}return k}function Pu(e){let t={};for(let i=0,o=e.length;i<o;i+=1){const r=e.charAt(i);t[r]=(t[r]||0)|1<<o-i-1}return t}class Nu{constructor(e,{location:t=Lu.location,threshold:i=Lu.threshold,distance:o=Lu.distance,includeMatches:r=Lu.includeMatches,findAllMatches:n=Lu.findAllMatches,minMatchCharLength:s=Lu.minMatchCharLength,isCaseSensitive:a=Lu.isCaseSensitive,ignoreLocation:l=Lu.ignoreLocation}={}){if(this.options={location:t,threshold:i,distance:o,includeMatches:r,findAllMatches:n,minMatchCharLength:s,isCaseSensitive:a,ignoreLocation:l},this.pattern=a?e:e.toLowerCase(),this.chunks=[],!this.pattern.length)return;const d=(e,t)=>{this.chunks.push({pattern:e,alphabet:Pu(e),startIndex:t})},c=this.pattern.length;if(c>32){let e=0;const t=c%32,i=c-t;for(;e<i;)d(this.pattern.substr(e,32),e),e+=32;if(t){const e=c-32;d(this.pattern.substr(e),e)}}else d(this.pattern,0)}searchIn(e){const{isCaseSensitive:t,includeMatches:i}=this.options;if(t||(e=e.toLowerCase()),this.pattern===e){let t={isMatch:!0,score:0};return i&&(t.indices=[[0,e.length-1]]),t}const{location:o,distance:r,threshold:n,findAllMatches:s,minMatchCharLength:a,ignoreLocation:l}=this.options;let d=[],c=0,h=!1;this.chunks.forEach((({pattern:t,alphabet:u,startIndex:p})=>{const{isMatch:m,score:f,indices:g}=zu(e,t,u,{location:o+p,distance:r,threshold:n,findAllMatches:s,minMatchCharLength:a,includeMatches:i,ignoreLocation:l});m&&(h=!0),c+=f,m&&g&&(d=[...d,...g])}));let u={isMatch:h,score:h?c/this.chunks.length:1};return h&&i&&(u.indices=d),u}}class Hu{constructor(e){this.pattern=e}static isMultiMatch(e){return Bu(e,this.multiRegex)}static isSingleMatch(e){return Bu(e,this.singleRegex)}search(){}}function Bu(e,t){const i=e.match(t);return i?i[1]:null}class Vu extends Hu{constructor(e,{location:t=Lu.location,threshold:i=Lu.threshold,distance:o=Lu.distance,includeMatches:r=Lu.includeMatches,findAllMatches:n=Lu.findAllMatches,minMatchCharLength:s=Lu.minMatchCharLength,isCaseSensitive:a=Lu.isCaseSensitive,ignoreLocation:l=Lu.ignoreLocation}={}){super(e),this._bitapSearch=new Nu(e,{location:t,threshold:i,distance:o,includeMatches:r,findAllMatches:n,minMatchCharLength:s,isCaseSensitive:a,ignoreLocation:l})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(e){return this._bitapSearch.searchIn(e)}}class ju extends Hu{constructor(e){super(e)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(e){let t,i=0;const o=[],r=this.pattern.length;for(;(t=e.indexOf(this.pattern,i))>-1;)i=t+r,o.push([t,i-1]);const n=!!o.length;return{isMatch:n,score:n?0:1,indices:o}}}const Uu=[class extends Hu{constructor(e){super(e)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(e){const t=e===this.pattern;return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}},ju,class extends Hu{constructor(e){super(e)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(e){const t=e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}},class extends Hu{constructor(e){super(e)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(e){const t=!e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}},class extends Hu{constructor(e){super(e)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(e){const t=!e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}},class extends Hu{constructor(e){super(e)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(e){const t=e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[e.length-this.pattern.length,e.length-1]}}},class extends Hu{constructor(e){super(e)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(e){const t=-1===e.indexOf(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}},Vu],Wu=Uu.length,qu=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;const Gu=new Set([Vu.type,ju.type]);class Xu{constructor(e,{isCaseSensitive:t=Lu.isCaseSensitive,includeMatches:i=Lu.includeMatches,minMatchCharLength:o=Lu.minMatchCharLength,ignoreLocation:r=Lu.ignoreLocation,findAllMatches:n=Lu.findAllMatches,location:s=Lu.location,threshold:a=Lu.threshold,distance:l=Lu.distance}={}){this.query=null,this.options={isCaseSensitive:t,includeMatches:i,minMatchCharLength:o,findAllMatches:n,ignoreLocation:r,location:s,threshold:a,distance:l},this.pattern=t?e:e.toLowerCase(),this.query=function(e,t={}){return e.split("|").map((e=>{let i=e.trim().split(qu).filter((e=>e&&!!e.trim())),o=[];for(let e=0,r=i.length;e<r;e+=1){const r=i[e];let n=!1,s=-1;for(;!n&&++s<Wu;){const e=Uu[s];let i=e.isMultiMatch(r);i&&(o.push(new e(i,t)),n=!0)}if(!n)for(s=-1;++s<Wu;){const e=Uu[s];let i=e.isSingleMatch(r);if(i){o.push(new e(i,t));break}}}return o}))}(this.pattern,this.options)}static condition(e,t){return t.useExtendedSearch}searchIn(e){const t=this.query;if(!t)return{isMatch:!1,score:1};const{includeMatches:i,isCaseSensitive:o}=this.options;e=o?e:e.toLowerCase();let r=0,n=[],s=0;for(let o=0,a=t.length;o<a;o+=1){const a=t[o];n.length=0,r=0;for(let t=0,o=a.length;t<o;t+=1){const o=a[t],{isMatch:l,indices:d,score:c}=o.search(e);if(!l){s=0,r=0,n.length=0;break}if(r+=1,s+=c,i){const e=o.constructor.type;Gu.has(e)?n=[...n,...d]:n.push(d)}}if(r){let e={isMatch:!0,score:s/r};return i&&(e.indices=n),e}}return{isMatch:!1,score:1}}}const Ku=[];function Zu(e,t){for(let i=0,o=Ku.length;i<o;i+=1){let o=Ku[i];if(o.condition(e,t))return new o(e,t)}return new Nu(e,t)}const Yu="$and",Qu="$or",Ju="$path",ep="$val",tp=e=>!(!e[Yu]&&!e[Qu]),ip=e=>({[Yu]:Object.keys(e).map((t=>({[t]:e[t]})))});function op(e,t,{auto:i=!0}={}){const o=e=>{let r=Object.keys(e);const n=(e=>!!e[Ju])(e);if(!n&&r.length>1&&!tp(e))return o(ip(e));if((e=>!bu(e)&&ku(e)&&!tp(e))(e)){const o=n?e[Ju]:r[0],s=n?e[ep]:e[o];if(!yu(s))throw new Error((e=>`Invalid value for key ${e}`)(o));const a={keyId:Iu(o),pattern:s};return i&&(a.searcher=Zu(s,t)),a}let s={children:[],operator:r[0]};return r.forEach((t=>{const i=e[t];bu(i)&&i.forEach((e=>{s.children.push(o(e))}))})),s};return tp(e)||(e=ip(e)),o(e)}function rp(e,t){const i=e.matches;t.matches=[],Cu(i)&&i.forEach((e=>{if(!Cu(e.indices)||!e.indices.length)return;const{indices:i,value:o}=e;let r={indices:i,value:o};e.key&&(r.key=e.key.src),e.idx>-1&&(r.refIndex=e.idx),t.matches.push(r)}))}function np(e,t){t.score=e.score}class sp{constructor(e,t={},i){this.options={...Lu,...t},this.options.useExtendedSearch,this._keyStore=new Tu(this.options.keys),this.setCollection(e,i)}setCollection(e,t){if(this._docs=e,t&&!(t instanceof Mu))throw new Error("Incorrect 'index' type");this._myIndex=t||Ru(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(e){Cu(e)&&(this._docs.push(e),this._myIndex.add(e))}remove(e=(()=>!1)){const t=[];for(let i=0,o=this._docs.length;i<o;i+=1){const r=this._docs[i];e(r,i)&&(this.removeAt(i),i-=1,o-=1,t.push(r))}return t}removeAt(e){this._docs.splice(e,1),this._myIndex.removeAt(e)}getIndex(){return this._myIndex}search(e,{limit:t=-1}={}){const{includeMatches:i,includeScore:o,shouldSort:r,sortFn:n,ignoreFieldNorm:s}=this.options;let a=yu(e)?yu(this._docs[0])?this._searchStringList(e):this._searchObjectList(e):this._searchLogical(e);return function(e,{ignoreFieldNorm:t=Lu.ignoreFieldNorm}){e.forEach((e=>{let i=1;e.matches.forEach((({key:e,norm:o,score:r})=>{const n=e?e.weight:null;i*=Math.pow(0===r&&n?Number.EPSILON:r,(n||1)*(t?1:o))})),e.score=i}))}(a,{ignoreFieldNorm:s}),r&&a.sort(n),xu(t)&&t>-1&&(a=a.slice(0,t)),function(e,t,{includeMatches:i=Lu.includeMatches,includeScore:o=Lu.includeScore}={}){const r=[];return i&&r.push(rp),o&&r.push(np),e.map((e=>{const{idx:i}=e,o={item:t[i],refIndex:i};return r.length&&r.forEach((t=>{t(e,o)})),o}))}(a,this._docs,{includeMatches:i,includeScore:o})}_searchStringList(e){const t=Zu(e,this.options),{records:i}=this._myIndex,o=[];return i.forEach((({v:e,i:i,n:r})=>{if(!Cu(e))return;const{isMatch:n,score:s,indices:a}=t.searchIn(e);n&&o.push({item:e,idx:i,matches:[{score:s,value:e,norm:r,indices:a}]})})),o}_searchLogical(e){const t=op(e,this.options),i=(e,t,o)=>{if(!e.children){const{keyId:i,searcher:r}=e,n=this._findMatches({key:this._keyStore.get(i),value:this._myIndex.getValueForItemAtKeyId(t,i),searcher:r});return n&&n.length?[{idx:o,item:t,matches:n}]:[]}const r=[];for(let n=0,s=e.children.length;n<s;n+=1){const s=e.children[n],a=i(s,t,o);if(a.length)r.push(...a);else if(e.operator===Yu)return[]}return r},o=this._myIndex.records,r={},n=[];return o.forEach((({$:e,i:o})=>{if(Cu(e)){let s=i(t,e,o);s.length&&(r[o]||(r[o]={idx:o,item:e,matches:[]},n.push(r[o])),s.forEach((({matches:e})=>{r[o].matches.push(...e)})))}})),n}_searchObjectList(e){const t=Zu(e,this.options),{keys:i,records:o}=this._myIndex,r=[];return o.forEach((({$:e,i:o})=>{if(!Cu(e))return;let n=[];i.forEach(((i,o)=>{n.push(...this._findMatches({key:i,value:e[o],searcher:t}))})),n.length&&r.push({idx:o,item:e,matches:n})})),r}_findMatches({key:e,value:t,searcher:i}){if(!Cu(t))return[];let o=[];if(bu(t))t.forEach((({v:t,i:r,n:n})=>{if(!Cu(t))return;const{isMatch:s,score:a,indices:l}=i.searchIn(t);s&&o.push({score:a,key:e,value:t,idx:r,norm:n,indices:l})}));else{const{v:r,n:n}=t,{isMatch:s,score:a,indices:l}=i.searchIn(r);s&&o.push({score:a,key:e,value:r,norm:n,indices:l})}return o}}sp.version="6.6.2",sp.createIndex=Ru,sp.parseIndex=function(e,{getFn:t=Lu.getFn,fieldNormWeight:i=Lu.fieldNormWeight}={}){const{keys:o,records:r}=e,n=new Mu({getFn:t,fieldNormWeight:i});return n.setKeys(o),n.setIndexRecords(r),n},sp.config=Lu,sp.parseQuery=op,function(...e){Ku.push(...e)}(Xu);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class ap{constructor(){this.settled=!1,this.promise=new Promise(((e,t)=>{this._resolve=e,this._reject=t}))}resolve(e){this.settled=!0,this._resolve(e)}reject(e){this.settled=!0,this._reject(e)}}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lp={status:404,body:"Playground file not found"},dp={status:503,body:"Playground build cancelled"};class cp{constructor(e){this.diagnostics=new Map,this._state="active",this._stateChange=new ap,this._files=new Map,this._diagnosticsCallback=e}state(){return this._state}get stateChange(){return this._stateChange.promise}cancel(){this._errorPendingFileRequests(dp),this._changeState("cancelled")}async getFile(e){let t=this._files.get(e);if(void 0===t){if("done"===this._state)return lp;if("cancelled"===this._state)return dp;t=new ap,this._files.set(e,t)}return t.promise}onOutput(e){if("active"===this._state)if("file"===e.kind)this._onFile(e);else if("diagnostic"===e.kind)this._onDiagnostic(e);else{if("done"!==e.kind)throw new Error(`Unexpected BuildOutput kind: ${e.kind}`);this._onDone()}}_changeState(e){this._state=e,this._stateChange.resolve(),this._stateChange=new ap}_onFile(e){let t=this._files.get(e.file.name);void 0===t&&(t=new ap,this._files.set(e.file.name,t)),t.resolve(e.file)}_onDiagnostic(e){let t=this.diagnostics.get(e.filename);void 0===t&&(t=[],this.diagnostics.set(e.filename,t)),t.push(e.diagnostic),void 0===this._diagnosticsDebounceId&&(this._diagnosticsDebounceId=requestAnimationFrame((()=>{"cancelled"!==this._state&&(this._diagnosticsDebounceId=void 0,this._diagnosticsCallback())})))}_onDone(){this._errorPendingFileRequests(lp),this._changeState("done")}_errorPendingFileRequests(e){for(const t of this._files.values())t.settled||t.resolve(e)}}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const hp=new Set;class up extends Event{constructor(e=!1){super("filesChanged"),this.projectLoaded=e}}let pp=class extends ae{constructor(){super(...arguments),this._source={type:"none"},this.sandboxBaseUrl="https://unpkg.com/playground-elements@0.17.0/",this.sandboxScope="__playground_swfs_1dae6563/",this._modified=!1,this._sessionId=(()=>{let e;do{e=crypto.getRandomValues(new Uint32Array(1))[0].toString(32)}while(hp.has(e));return hp.add(e),e})(),this._deferredTypeScriptWorkerApi=new ap,this._validImportMap={},this.lastSave=Promise.resolve(),this.savePending=!1}get projectSrc(){if("url"===this._source.type)return this._source.url}set projectSrc(e){e?"url"===this._source.type&&this._source.url===e||(this._source={type:"url",url:e}):"url"===this._source.type&&(this._source={type:"none"})}get config(){var e;return{files:Object.fromEntries((null!==(e=this._files)&&void 0!==e?e:[]).map((e=>[e.name,{...e,name:void 0}]))),importMap:this._validImportMap}}set config(e){e?this._source={type:"direct",config:e}:"direct"===this._source.type&&(this._source={type:"none"})}get files(){return this._files}get diagnostics(){var e;return null===(e=this._build)||void 0===e?void 0:e.diagnostics}get modified(){return void 0===this._modified&&(void 0===this._files&&void 0===this._pristineFiles?this._modified=!1:void 0===this._files||void 0===this._pristineFiles?this._modified=!0:this._modified=!xp(this._files,this._pristineFiles)),this._modified}set _importMap(e){const t=bp(e);if(t.length>0){for(const e of t)console.error(e);this._validImportMap={}}else this._validImportMap=e}get _importMap(){return this._validImportMap}get _normalizedSandboxBaseUrl(){const e=new URL(this.sandboxBaseUrl,import.meta.url);return e.pathname=vu(e.pathname),e}get baseUrl(){if(void 0===this._serviceWorkerAPI||void 0===this._files)return;return new URL(`${vu(this.sandboxScope)}${this._sessionId}/`,this._normalizedSandboxBaseUrl).href}get _serviceWorkerProxyIframeUrl(){return new URL(`playground-service-worker-proxy.html#playground-session-id=${this._sessionId}`,this._normalizedSandboxBaseUrl).href}async update(e){e.has("_source")&&this._loadProjectFromSource(),(e.has("sandboxScope")||e.has("sandboxBaseUrl")||e.has("_serviceWorkerAPI"))&&this.dispatchEvent(new CustomEvent("urlChanged")),super.update(e)}async _loadProjectFromSource(){const e=this._source;switch(e.type){case"none":this._files=void 0,this._importMap={};break;case"direct":{const{files:t,importMap:i}=await fp(e.config,document.baseURI);if(e!==this._source)return;this._files=t,this._importMap=i}break;case"slot":this._files=e.files,this._importMap=e.importMap;break;case"url":{const{files:t,importMap:i}=await mp(new URL(e.url,document.baseURI).href);if(e!==this._source)return;this._files=t,this._importMap=i}}this._pristineFiles=this._files&&JSON.parse(JSON.stringify(this._files)),this._modified=!1,this.dispatchEvent(new up(!0)),this.save()}render(){return B` <slot @slotchange="${this._slotChange}"></slot> <iframe src="${this._serviceWorkerProxyIframeUrl}" @load="${this._onServiceWorkerProxyIframeLoad}"></iframe> `}_slotChange(){var e;const{type:t}=this._source;if("none"!==t&&"slot"!==t)return;const i=[];let o;for(const t of this._slot.assignedElements({flatten:!0})){const r=t.getAttribute("type");if(!(null==r?void 0:r.startsWith("sample/")))continue;const n=r.substring("sample/".length);let s=null!==(e=t.textContent)&&void 0!==e?e:"";if("html"===n&&(s=s.replace(/&lt;\//g,"</")),t.hasAttribute("preserve-whitespace")||(s=yp(s)),"importmap"===n)try{o=JSON.parse(s)}catch{console.error("Invalid import map JSON",t)}else{const e=t.getAttribute("filename");if(!e)continue;const o=t.getAttribute("label")||void 0,r=t.hasAttribute("selected"),a=vp(n);i.push({name:e,label:o,hidden:t.hasAttribute("hidden"),content:s,contentType:a,selected:r})}}(i.length>0||void 0!==o)&&(this._source={type:"slot",files:i,importMap:null!=o?o:{}})}async firstUpdated(){const e=("cdn.skypack.dev"===(t=new URL(new URL("d2b5d895.js",import.meta.url).href,import.meta.url)).hostname&&(t.pathname=t.pathname.replace(/mode=imports\/(un)?optimized/,"mode=raw")),t);var t;let i;if(e.origin===window.location.origin)i=new Worker(e);else{const t=await fetch(e.href),o=await t.text(),r=URL.createObjectURL(new Blob([o],{type:"application/javascript"}));i=new Worker(r),URL.revokeObjectURL(r)}this._deferredTypeScriptWorkerApi.resolve(lu(i))}_onServiceWorkerProxyIframeLoad(){const{port1:e,port2:t}=new MessageChannel;e.addEventListener("message",(e=>{3===e.data.type&&this._onNewServiceWorkerPort(e.data.port)})),e.start(),this._postMessageToServiceWorkerProxyIframe({type:1,scope:this.sandboxScope,port:t},[t])}_onNewServiceWorkerPort(e){const t=i=>{4===i.data.type&&(e.removeEventListener("message",t),"1dae6563"===i.data.version?(this._serviceWorkerAPI=lu(e),this._serviceWorkerAPI.setFileAPI(pu({getFile:e=>this._getFile(e)}),this._sessionId)):(console.info(`Playground service worker is outdated. Want 1dae6563 but got ${i.data.version}. Waiting for update.`),this._postMessageToServiceWorkerProxyIframe({type:6})))};e.addEventListener("message",t),e.start()}_postMessageToServiceWorkerProxyIframe(e,t){const i=this._serviceWorkerProxyIframe.contentWindow;if(!i)throw new Error("Unexpected internal error: <playground-project> service worker proxy iframe had no contentWindow");i.postMessage(e,"*",t)}async _getFile(e){return void 0===this._build?{status:503,body:"Playground build not started"}:this._build.getFile(e)}async save(){var e,t;null===(e=this._build)||void 0===e||e.cancel();const i=new cp((()=>{this.dispatchEvent(new CustomEvent("diagnosticsChanged"))}));this._build=i,this.dispatchEvent(new CustomEvent("compileStart"));const o=await this._deferredTypeScriptWorkerApi.promise;"active"===i.state()&&(o.compileProject(null!==(t=this._files)&&void 0!==t?t:[],{importMap:this._importMap},pu((e=>i.onOutput(e)))),await i.stateChange,"done"===i.state()&&this.dispatchEvent(new CustomEvent("compileDone")))}async getCompletions(e){var t,i,o;const r=e.tokenUnderCursor.trim();if(!e.isRefinement){const t=await this._deferredTypeScriptWorkerApi.promise,i=await t.getCompletions(e.fileName,e.fileContent,r,e.cursorIndex,{importMap:this._importMap});if(i){const t=this._getCompletionDetails.bind(this);this._completionInfo=function(e,t,i,o){const r=e;return r.entries=null==e?void 0:e.entries.map((e=>({...e,_details:void 0,get details(){return this._details||(this._details=o(t,i,e.name)),this._details}}))),r}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */(i,e.fileName,e.cursorIndex,t)}}let n=[];return n="."===e.tokenUnderCursor||""===e.tokenUnderCursor?function(e,t=""){var i;return null!==(i=null==e?void 0:e.map((e=>({text:t+e.name,displayText:e.name,score:Number.parseInt(e.sortText),get details(){return e.details}}))))&&void 0!==i?i:[]}(null===(t=this._completionInfo)||void 0===t?void 0:t.entries,e.tokenUnderCursor):
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function(e,t){if(!e)return[];const i=new sp(null!=e?e:[],{threshold:.3,shouldSort:!0,isCaseSensitive:!0,includeScore:!0,includeMatches:!0,keys:["name"],minMatchCharLength:Math.max(t.length/1.2,1)}).search(t).map((e=>{var t;return{text:e.item.name,displayText:e.item.name,score:null!==(t=e.score)&&void 0!==t?t:0,matches:e.matches,get details(){return e.item.details}}})).sort(((e,t)=>e.score===t.score?e.text.localeCompare(t.text):e.score-t.score));return i}(null===(i=this._completionInfo)||void 0===i?void 0:i.entries,r),null===(o=n[0])||void 0===o||o.details,n}async _getCompletionDetails(e,t,i){const o=await this._deferredTypeScriptWorkerApi.promise;return await o.getCompletionItemDetails(e,t,{importMap:this._importMap},i)}async saveDebounced(){this.savePending||(this.savePending=!0,await this.lastSave,this.savePending=!1,this.lastSave=this.save())}isValidNewFilename(e){var t;if(!e)return!1;const i=null===(t=this._files)||void 0===t?void 0:t.find((t=>t.name===e));return void 0===i||!0===i.hidden}editFile(e,t){e.content=t,this._modified=void 0,this.saveDebounced()}addFile(e){var t;if(!this._files||!this.isValidNewFilename(e))return;const i=null===(t=this._files)||void 0===t?void 0:t.find((t=>t.name===e));!0===(null==i?void 0:i.hidden)?i.hidden=!1:this._files.push({name:e,content:"",contentType:gp(e)}),this._modified=void 0,this.requestUpdate(),this.dispatchEvent(new up),this.save()}deleteFile(e){if(!this._files)return;const t=this._files.findIndex((t=>t.name===e));t<0||(this._files=[...this._files.slice(0,t),...this._files.slice(t+1)],this._modified=void 0,this.dispatchEvent(new up),this.save())}renameFile(e,t){if(!e||!this._files)return;if(!this.isValidNewFilename(t))return;const i=this._files.find((t=>t.name===e));i&&(i.name=t,i.contentType=gp(t),this._files=[...this._files],this._modified=void 0,this.dispatchEvent(new up),this.save())}};pp.styles=u`iframe{display:none}`,o([he({attribute:"project-src",hasChanged:()=>!1})],pp.prototype,"projectSrc",null),o([he({attribute:!1,hasChanged:()=>!1})],pp.prototype,"config",null),o([ue()],pp.prototype,"_source",void 0),o([he({attribute:"sandbox-base-url"})],pp.prototype,"sandboxBaseUrl",void 0),o([he({attribute:"sandbox-scope"})],pp.prototype,"sandboxScope",void 0),o([ue()],pp.prototype,"_serviceWorkerAPI",void 0),o([fe("slot")],pp.prototype,"_slot",void 0),o([fe("iframe")],pp.prototype,"_serviceWorkerProxyIframe",void 0),pp=o([de("playground-project")],pp);const mp=async(e,t=new Set,i=new Set)=>{if(i.has(e))throw new Error(`Circular project config extends: ${[...i.values(),e].join(" extends ")}`);i.add(e);const o=await fetch(e);if(200!==o.status)throw new Error(`Error ${o.status} fetching project config from ${e}: ${await o.text()}`);let r;try{r=await o.json()}catch(t){throw new Error(`Error parsing project config JSON from ${e}: ${t.message}`)}return await fp(r,e,t,i)},fp=async(e,t,i=new Set,o=new Set)=>{var r,n,s,a,l;const d=[];for(const[o,a]of Object.entries(null!==(r=e.files)&&void 0!==r?r:{}))i.has(o)||(i.add(o),void 0===a.content?d.push((async()=>{var e,i;const r=await fetch(new URL(o,t).href);return{...a,name:o,content:await r.text(),contentType:null!==(i=null===(e=r.headers.get("Content-Type"))||void 0===e?void 0:e.toLowerCase())&&void 0!==i?i:"text/plain"}})()):d.push(Promise.resolve({...a,name:o,content:null!==(n=a.content)&&void 0!==n?n:"",contentType:null!==(s=gp(o))&&void 0!==s?s:"text/plain"})));const c=e.extends?mp(new URL(e.extends,t).href,i,o):void 0,h=await Promise.all(d),u=null!==(a=e.importMap)&&void 0!==a?a:{};if(c){const e=await c;h.push(...e.files),u.imports={...null===(l=e.importMap)||void 0===l?void 0:l.imports,...u.imports}}return{files:h,importMap:u}},gp=e=>{const t=e.lastIndexOf(".");if(-1===t||t===e.length-1)return;const i=e.slice(t+1);return vp(i)},vp=e=>{if(void 0!==e)switch(e){case"ts":return"video/mp2t";case"js":return"application/javascript; charset=utf-8";case"json":return"application/json; charset=utf-8";case"jsx":return"text/jsx; charset=utf-8";case"tsx":return"text/typescript-jsx; charset=utf-8";case"html":return"text/html; charset=utf-8";case"css":return"text/css; charset=utf-8";case"svg":return"image/svg+xml";case"png":return"image/png";case"gif":return"image/gif";case"jpeg":case"jpg":return"image/jpeg";case"ico":return"image/vnd.microsoft.icon";case"webp":return"image/webp";case"webm":return"video/webm";case"mid":case"midi":return"audio/midi";case"mp3":return"audio/mpeg";case"weba":return"audio/webm"}},bp=e=>{const t=[];if("object"!=typeof e||null===e)return t.push(`Import map is invalid because it must be an object, but it was ${null===e?"null":typeof e}.`),t;const i=Object.keys(e).filter((e=>"imports"!==e));i.length>0&&t.push(`Invalid import map properties: ${[...i].join(", ")}. Only "imports" are currently supported.`);const o=e.imports;if(void 0===o)return t;if("object"!=typeof o||null===o)return t.push(`Import map "imports" property is invalid because it must be an object, but it was ${null===o?"null":typeof o}.`),t;for(const[e,i]of Object.entries(o))if("string"==typeof i){e.endsWith("/")&&!i.endsWith("/")&&t.push(`Import map key "${e}" is invalid because address "${i}" must end in a forward-slash.`);try{new URL(i)}catch{t.push(`Import map key "${e}" is invalid because address "${i}" is not a valid URL.`)}}else t.push(`Import map key "${e}" is invalid because address must be a string, but was `+(null===i?"null":typeof i));return t},yp=e=>{let t;e=e.replace(/(^[\n\s]*\n)|(\n[\n\s]*$)/g,"");for(const i of e.split(/\n/g)){const e=i.match(/^\s*/)[0].length;(void 0===t||e<t)&&(t=e)}return e.replace(RegExp(`^\\s{${null!=t?t:0}}`,"gm"),"")},xp=(e,t)=>{if(e.length!==t.length)return!1;for(let i=0;i<e.length;i++){const o=e[i],r=t[i];if(o.name!==r.name||o.contentType!==r.contentType||o.hidden!==r.hidden||o.label!==r.label)return!1}for(let i=0;i<e.length;i++){const o=e[i],r=t[i];if(o.content!==r.content)return!1}return!0};function wp(e){return{addClass:t=>{e.classList.add(t)},removeClass:t=>{e.classList.remove(t)},hasClass:t=>e.classList.contains(t)}}const kp=()=>{},Cp={get passive(){return!1}};document.addEventListener("x",kp,Cp),document.removeEventListener("x",kp);const $p=(e=window.document)=>{let t=e.activeElement;const i=[];if(!t)return i;for(;t&&(i.push(t),t.shadowRoot);)t=t.shadowRoot.activeElement;return i},_p=e=>{const t=$p();if(!t.length)return!1;const i=t[t.length-1],o=new Event("check-if-focused",{bubbles:!0,composed:!0});let r=[];const n=e=>{r=e.composedPath()};return document.body.addEventListener("check-if-focused",n),i.dispatchEvent(o),document.body.removeEventListener("check-if-focused",n),-1!==r.indexOf(e)};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Sp extends ae{click(){if(this.mdcRoot)return this.mdcRoot.focus(),void this.mdcRoot.click();super.click()}createFoundation(){void 0!==this.mdcFoundation&&this.mdcFoundation.destroy(),this.mdcFoundationClass&&(this.mdcFoundation=new this.mdcFoundationClass(this.createAdapter()),this.mdcFoundation.init())}firstUpdated(){this.createFoundation()}}
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */var Tp=function(){function e(e){void 0===e&&(e={}),this.adapter=e}return Object.defineProperty(e,"cssClasses",{get:function(){return{}},enumerable:!1,configurable:!0}),Object.defineProperty(e,"strings",{get:function(){return{}},enumerable:!1,configurable:!0}),Object.defineProperty(e,"numbers",{get:function(){return{}},enumerable:!1,configurable:!0}),Object.defineProperty(e,"defaultAdapter",{get:function(){return{}},enumerable:!1,configurable:!0}),e.prototype.init=function(){},e.prototype.destroy=function(){},e}(),Ep={BG_FOCUSED:"mdc-ripple-upgraded--background-focused",FG_ACTIVATION:"mdc-ripple-upgraded--foreground-activation",FG_DEACTIVATION:"mdc-ripple-upgraded--foreground-deactivation",ROOT:"mdc-ripple-upgraded",UNBOUNDED:"mdc-ripple-upgraded--unbounded"},Ap={VAR_FG_SCALE:"--mdc-ripple-fg-scale",VAR_FG_SIZE:"--mdc-ripple-fg-size",VAR_FG_TRANSLATE_END:"--mdc-ripple-fg-translate-end",VAR_FG_TRANSLATE_START:"--mdc-ripple-fg-translate-start",VAR_LEFT:"--mdc-ripple-left",VAR_TOP:"--mdc-ripple-top"},Ip={DEACTIVATION_TIMEOUT_MS:225,FG_DEACTIVATION_MS:150,INITIAL_ORIGIN_SCALE:.6,PADDING:10,TAP_DELAY_MS:300};
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Op=["touchstart","pointerdown","mousedown","keydown"],Lp=["touchend","pointerup","mouseup","contextmenu"],Fp=[],Mp=function(e){function o(t){var r=e.call(this,i(i({},o.defaultAdapter),t))||this;return r.activationAnimationHasEnded=!1,r.activationTimer=0,r.fgDeactivationRemovalTimer=0,r.fgScale="0",r.frame={width:0,height:0},r.initialSize=0,r.layoutFrame=0,r.maxRadius=0,r.unboundedCoords={left:0,top:0},r.activationState=r.defaultActivationState(),r.activationTimerCallback=function(){r.activationAnimationHasEnded=!0,r.runDeactivationUXLogicIfReady()},r.activateHandler=function(e){r.activateImpl(e)},r.deactivateHandler=function(){r.deactivateImpl()},r.focusHandler=function(){r.handleFocus()},r.blurHandler=function(){r.handleBlur()},r.resizeHandler=function(){r.layout()},r}return t(o,e),Object.defineProperty(o,"cssClasses",{get:function(){return Ep},enumerable:!1,configurable:!0}),Object.defineProperty(o,"strings",{get:function(){return Ap},enumerable:!1,configurable:!0}),Object.defineProperty(o,"numbers",{get:function(){return Ip},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClass:function(){},browserSupportsCssVars:function(){return!0},computeBoundingRect:function(){return{top:0,right:0,bottom:0,left:0,width:0,height:0}},containsEventTarget:function(){return!0},deregisterDocumentInteractionHandler:function(){},deregisterInteractionHandler:function(){},deregisterResizeHandler:function(){},getWindowPageOffset:function(){return{x:0,y:0}},isSurfaceActive:function(){return!0},isSurfaceDisabled:function(){return!0},isUnbounded:function(){return!0},registerDocumentInteractionHandler:function(){},registerInteractionHandler:function(){},registerResizeHandler:function(){},removeClass:function(){},updateCssVariable:function(){}}},enumerable:!1,configurable:!0}),o.prototype.init=function(){var e=this,t=this.supportsPressRipple();if(this.registerRootHandlers(t),t){var i=o.cssClasses,r=i.ROOT,n=i.UNBOUNDED;requestAnimationFrame((function(){e.adapter.addClass(r),e.adapter.isUnbounded()&&(e.adapter.addClass(n),e.layoutInternal())}))}},o.prototype.destroy=function(){var e=this;if(this.supportsPressRipple()){this.activationTimer&&(clearTimeout(this.activationTimer),this.activationTimer=0,this.adapter.removeClass(o.cssClasses.FG_ACTIVATION)),this.fgDeactivationRemovalTimer&&(clearTimeout(this.fgDeactivationRemovalTimer),this.fgDeactivationRemovalTimer=0,this.adapter.removeClass(o.cssClasses.FG_DEACTIVATION));var t=o.cssClasses,i=t.ROOT,r=t.UNBOUNDED;requestAnimationFrame((function(){e.adapter.removeClass(i),e.adapter.removeClass(r),e.removeCssVars()}))}this.deregisterRootHandlers(),this.deregisterDeactivationHandlers()},o.prototype.activate=function(e){this.activateImpl(e)},o.prototype.deactivate=function(){this.deactivateImpl()},o.prototype.layout=function(){var e=this;this.layoutFrame&&cancelAnimationFrame(this.layoutFrame),this.layoutFrame=requestAnimationFrame((function(){e.layoutInternal(),e.layoutFrame=0}))},o.prototype.setUnbounded=function(e){var t=o.cssClasses.UNBOUNDED;e?this.adapter.addClass(t):this.adapter.removeClass(t)},o.prototype.handleFocus=function(){var e=this;requestAnimationFrame((function(){return e.adapter.addClass(o.cssClasses.BG_FOCUSED)}))},o.prototype.handleBlur=function(){var e=this;requestAnimationFrame((function(){return e.adapter.removeClass(o.cssClasses.BG_FOCUSED)}))},o.prototype.supportsPressRipple=function(){return this.adapter.browserSupportsCssVars()},o.prototype.defaultActivationState=function(){return{activationEvent:void 0,hasDeactivationUXRun:!1,isActivated:!1,isProgrammatic:!1,wasActivatedByPointer:!1,wasElementMadeActive:!1}},o.prototype.registerRootHandlers=function(e){var t,i;if(e){try{for(var o=r(Op),n=o.next();!n.done;n=o.next()){var s=n.value;this.adapter.registerInteractionHandler(s,this.activateHandler)}}catch(e){t={error:e}}finally{try{n&&!n.done&&(i=o.return)&&i.call(o)}finally{if(t)throw t.error}}this.adapter.isUnbounded()&&this.adapter.registerResizeHandler(this.resizeHandler)}this.adapter.registerInteractionHandler("focus",this.focusHandler),this.adapter.registerInteractionHandler("blur",this.blurHandler)},o.prototype.registerDeactivationHandlers=function(e){var t,i;if("keydown"===e.type)this.adapter.registerInteractionHandler("keyup",this.deactivateHandler);else try{for(var o=r(Lp),n=o.next();!n.done;n=o.next()){var s=n.value;this.adapter.registerDocumentInteractionHandler(s,this.deactivateHandler)}}catch(e){t={error:e}}finally{try{n&&!n.done&&(i=o.return)&&i.call(o)}finally{if(t)throw t.error}}},o.prototype.deregisterRootHandlers=function(){var e,t;try{for(var i=r(Op),o=i.next();!o.done;o=i.next()){var n=o.value;this.adapter.deregisterInteractionHandler(n,this.activateHandler)}}catch(t){e={error:t}}finally{try{o&&!o.done&&(t=i.return)&&t.call(i)}finally{if(e)throw e.error}}this.adapter.deregisterInteractionHandler("focus",this.focusHandler),this.adapter.deregisterInteractionHandler("blur",this.blurHandler),this.adapter.isUnbounded()&&this.adapter.deregisterResizeHandler(this.resizeHandler)},o.prototype.deregisterDeactivationHandlers=function(){var e,t;this.adapter.deregisterInteractionHandler("keyup",this.deactivateHandler);try{for(var i=r(Lp),o=i.next();!o.done;o=i.next()){var n=o.value;this.adapter.deregisterDocumentInteractionHandler(n,this.deactivateHandler)}}catch(t){e={error:t}}finally{try{o&&!o.done&&(t=i.return)&&t.call(i)}finally{if(e)throw e.error}}},o.prototype.removeCssVars=function(){var e=this,t=o.strings;Object.keys(t).forEach((function(i){0===i.indexOf("VAR_")&&e.adapter.updateCssVariable(t[i],null)}))},o.prototype.activateImpl=function(e){var t=this;if(!this.adapter.isSurfaceDisabled()){var i=this.activationState;if(!i.isActivated){var o=this.previousActivationEvent;if(!(o&&void 0!==e&&o.type!==e.type)){i.isActivated=!0,i.isProgrammatic=void 0===e,i.activationEvent=e,i.wasActivatedByPointer=!i.isProgrammatic&&(void 0!==e&&("mousedown"===e.type||"touchstart"===e.type||"pointerdown"===e.type));var r=void 0!==e&&Fp.length>0&&Fp.some((function(e){return t.adapter.containsEventTarget(e)}));r?this.resetActivationState():(void 0!==e&&(Fp.push(e.target),this.registerDeactivationHandlers(e)),i.wasElementMadeActive=this.checkElementMadeActive(e),i.wasElementMadeActive&&this.animateActivation(),requestAnimationFrame((function(){Fp=[],i.wasElementMadeActive||void 0===e||" "!==e.key&&32!==e.keyCode||(i.wasElementMadeActive=t.checkElementMadeActive(e),i.wasElementMadeActive&&t.animateActivation()),i.wasElementMadeActive||(t.activationState=t.defaultActivationState())})))}}}},o.prototype.checkElementMadeActive=function(e){return void 0===e||"keydown"!==e.type||this.adapter.isSurfaceActive()},o.prototype.animateActivation=function(){var e=this,t=o.strings,i=t.VAR_FG_TRANSLATE_START,r=t.VAR_FG_TRANSLATE_END,n=o.cssClasses,s=n.FG_DEACTIVATION,a=n.FG_ACTIVATION,l=o.numbers.DEACTIVATION_TIMEOUT_MS;this.layoutInternal();var d="",c="";if(!this.adapter.isUnbounded()){var h=this.getFgTranslationCoordinates(),u=h.startPoint,p=h.endPoint;d=u.x+"px, "+u.y+"px",c=p.x+"px, "+p.y+"px"}this.adapter.updateCssVariable(i,d),this.adapter.updateCssVariable(r,c),clearTimeout(this.activationTimer),clearTimeout(this.fgDeactivationRemovalTimer),this.rmBoundedActivationClasses(),this.adapter.removeClass(s),this.adapter.computeBoundingRect(),this.adapter.addClass(a),this.activationTimer=setTimeout((function(){e.activationTimerCallback()}),l)},o.prototype.getFgTranslationCoordinates=function(){var e,t=this.activationState,i=t.activationEvent;return e=t.wasActivatedByPointer?function(e,t,i){if(!e)return{x:0,y:0};var o,r,n=t.x,s=t.y,a=n+i.left,l=s+i.top;if("touchstart"===e.type){var d=e;o=d.changedTouches[0].pageX-a,r=d.changedTouches[0].pageY-l}else{var c=e;o=c.pageX-a,r=c.pageY-l}return{x:o,y:r}}(i,this.adapter.getWindowPageOffset(),this.adapter.computeBoundingRect()):{x:this.frame.width/2,y:this.frame.height/2},{startPoint:e={x:e.x-this.initialSize/2,y:e.y-this.initialSize/2},endPoint:{x:this.frame.width/2-this.initialSize/2,y:this.frame.height/2-this.initialSize/2}}},o.prototype.runDeactivationUXLogicIfReady=function(){var e=this,t=o.cssClasses.FG_DEACTIVATION,i=this.activationState,r=i.hasDeactivationUXRun,n=i.isActivated;(r||!n)&&this.activationAnimationHasEnded&&(this.rmBoundedActivationClasses(),this.adapter.addClass(t),this.fgDeactivationRemovalTimer=setTimeout((function(){e.adapter.removeClass(t)}),Ip.FG_DEACTIVATION_MS))},o.prototype.rmBoundedActivationClasses=function(){var e=o.cssClasses.FG_ACTIVATION;this.adapter.removeClass(e),this.activationAnimationHasEnded=!1,this.adapter.computeBoundingRect()},o.prototype.resetActivationState=function(){var e=this;this.previousActivationEvent=this.activationState.activationEvent,this.activationState=this.defaultActivationState(),setTimeout((function(){return e.previousActivationEvent=void 0}),o.numbers.TAP_DELAY_MS)},o.prototype.deactivateImpl=function(){var e=this,t=this.activationState;if(t.isActivated){var o=i({},t);t.isProgrammatic?(requestAnimationFrame((function(){e.animateDeactivation(o)})),this.resetActivationState()):(this.deregisterDeactivationHandlers(),requestAnimationFrame((function(){e.activationState.hasDeactivationUXRun=!0,e.animateDeactivation(o),e.resetActivationState()})))}},o.prototype.animateDeactivation=function(e){var t=e.wasActivatedByPointer,i=e.wasElementMadeActive;(t||i)&&this.runDeactivationUXLogicIfReady()},o.prototype.layoutInternal=function(){var e=this;this.frame=this.adapter.computeBoundingRect();var t=Math.max(this.frame.height,this.frame.width);this.maxRadius=this.adapter.isUnbounded()?t:Math.sqrt(Math.pow(e.frame.width,2)+Math.pow(e.frame.height,2))+o.numbers.PADDING;var i=Math.floor(t*o.numbers.INITIAL_ORIGIN_SCALE);this.adapter.isUnbounded()&&i%2!=0?this.initialSize=i-1:this.initialSize=i,this.fgScale=""+this.maxRadius/this.initialSize,this.updateLayoutCssVars()},o.prototype.updateLayoutCssVars=function(){var e=o.strings,t=e.VAR_FG_SIZE,i=e.VAR_LEFT,r=e.VAR_TOP,n=e.VAR_FG_SCALE;this.adapter.updateCssVariable(t,this.initialSize+"px"),this.adapter.updateCssVariable(n,this.fgScale),this.adapter.isUnbounded()&&(this.unboundedCoords={left:Math.round(this.frame.width/2-this.initialSize/2),top:Math.round(this.frame.height/2-this.initialSize/2)},this.adapter.updateCssVariable(i,this.unboundedCoords.left+"px"),this.adapter.updateCssVariable(r,this.unboundedCoords.top+"px"))},o}(Tp),Rp=Mp;
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dp=$e(class extends _e{constructor(e){var t;if(super(e),e.type!==xe||"class"!==e.name||(null===(t=e.strings)||void 0===t?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){var i,o;if(void 0===this.nt){this.nt=new Set,void 0!==e.strings&&(this.st=new Set(e.strings.join(" ").split(/\s/).filter((e=>""!==e))));for(const e in t)t[e]&&!(null===(i=this.st)||void 0===i?void 0:i.has(e))&&this.nt.add(e);return this.render(t)}const r=e.element.classList;this.nt.forEach((e=>{e in t||(r.remove(e),this.nt.delete(e))}));for(const e in t){const i=!!t[e];i===this.nt.has(e)||(null===(o=this.st)||void 0===o?void 0:o.has(e))||(i?(r.add(e),this.nt.add(e)):(r.remove(e),this.nt.delete(e)))}return V}}),zp=$e(class extends _e{constructor(e){var t;if(super(e),e.type!==xe||"style"!==e.name||(null===(t=e.strings)||void 0===t?void 0:t.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce(((t,i)=>{const o=e[i];return null==o?t:t+`${i=i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`}),"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.vt){this.vt=new Set;for(const e in t)this.vt.add(e);return this.render(t)}this.vt.forEach((e=>{null==t[e]&&(this.vt.delete(e),e.includes("-")?i.removeProperty(e):i[e]="")}));for(const e in t){const o=t[e];null!=o&&(this.vt.add(e),e.includes("-")?i.setProperty(e,o):i[e]=o)}return V}});
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Pp extends Sp{constructor(){super(...arguments),this.primary=!1,this.accent=!1,this.unbounded=!1,this.disabled=!1,this.activated=!1,this.selected=!1,this.internalUseStateLayerCustomProperties=!1,this.hovering=!1,this.bgFocused=!1,this.fgActivation=!1,this.fgDeactivation=!1,this.fgScale="",this.fgSize="",this.translateStart="",this.translateEnd="",this.leftPos="",this.topPos="",this.mdcFoundationClass=Rp}get isActive(){return e=this.parentElement||this,t=":active",(e.matches||e.webkitMatchesSelector||e.msMatchesSelector).call(e,t);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var e,t;
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */}createAdapter(){return{browserSupportsCssVars:()=>!0,isUnbounded:()=>this.unbounded,isSurfaceActive:()=>this.isActive,isSurfaceDisabled:()=>this.disabled,addClass:e=>{switch(e){case"mdc-ripple-upgraded--background-focused":this.bgFocused=!0;break;case"mdc-ripple-upgraded--foreground-activation":this.fgActivation=!0;break;case"mdc-ripple-upgraded--foreground-deactivation":this.fgDeactivation=!0}},removeClass:e=>{switch(e){case"mdc-ripple-upgraded--background-focused":this.bgFocused=!1;break;case"mdc-ripple-upgraded--foreground-activation":this.fgActivation=!1;break;case"mdc-ripple-upgraded--foreground-deactivation":this.fgDeactivation=!1}},containsEventTarget:()=>!0,registerInteractionHandler:()=>{},deregisterInteractionHandler:()=>{},registerDocumentInteractionHandler:()=>{},deregisterDocumentInteractionHandler:()=>{},registerResizeHandler:()=>{},deregisterResizeHandler:()=>{},updateCssVariable:(e,t)=>{switch(e){case"--mdc-ripple-fg-scale":this.fgScale=t;break;case"--mdc-ripple-fg-size":this.fgSize=t;break;case"--mdc-ripple-fg-translate-end":this.translateEnd=t;break;case"--mdc-ripple-fg-translate-start":this.translateStart=t;break;case"--mdc-ripple-left":this.leftPos=t;break;case"--mdc-ripple-top":this.topPos=t}},computeBoundingRect:()=>(this.parentElement||this).getBoundingClientRect(),getWindowPageOffset:()=>({x:window.pageXOffset,y:window.pageYOffset})}}startPress(e){this.waitForFoundation((()=>{this.mdcFoundation.activate(e)}))}endPress(){this.waitForFoundation((()=>{this.mdcFoundation.deactivate()}))}startFocus(){this.waitForFoundation((()=>{this.mdcFoundation.handleFocus()}))}endFocus(){this.waitForFoundation((()=>{this.mdcFoundation.handleBlur()}))}startHover(){this.hovering=!0}endHover(){this.hovering=!1}waitForFoundation(e){this.mdcFoundation?e():this.updateComplete.then(e)}update(e){e.has("disabled")&&this.disabled&&this.endHover(),super.update(e)}render(){const e=this.activated&&(this.primary||!this.accent),t=this.selected&&(this.primary||!this.accent),i={"mdc-ripple-surface--accent":this.accent,"mdc-ripple-surface--primary--activated":e,"mdc-ripple-surface--accent--activated":this.accent&&this.activated,"mdc-ripple-surface--primary--selected":t,"mdc-ripple-surface--accent--selected":this.accent&&this.selected,"mdc-ripple-surface--disabled":this.disabled,"mdc-ripple-surface--hover":this.hovering,"mdc-ripple-surface--primary":this.primary,"mdc-ripple-surface--selected":this.selected,"mdc-ripple-upgraded--background-focused":this.bgFocused,"mdc-ripple-upgraded--foreground-activation":this.fgActivation,"mdc-ripple-upgraded--foreground-deactivation":this.fgDeactivation,"mdc-ripple-upgraded--unbounded":this.unbounded,"mdc-ripple-surface--internal-use-state-layer-custom-properties":this.internalUseStateLayerCustomProperties};return B` <div class="mdc-ripple-surface mdc-ripple-upgraded ${Dp(i)}" style="${zp({"--mdc-ripple-fg-scale":this.fgScale,"--mdc-ripple-fg-size":this.fgSize,"--mdc-ripple-fg-translate-end":this.translateEnd,"--mdc-ripple-fg-translate-start":this.translateStart,"--mdc-ripple-left":this.leftPos,"--mdc-ripple-top":this.topPos})}"></div>`}}o([fe(".mdc-ripple-surface")],Pp.prototype,"mdcRoot",void 0),o([he({type:Boolean})],Pp.prototype,"primary",void 0),o([he({type:Boolean})],Pp.prototype,"accent",void 0),o([he({type:Boolean})],Pp.prototype,"unbounded",void 0),o([he({type:Boolean})],Pp.prototype,"disabled",void 0),o([he({type:Boolean})],Pp.prototype,"activated",void 0),o([he({type:Boolean})],Pp.prototype,"selected",void 0),o([he({type:Boolean})],Pp.prototype,"internalUseStateLayerCustomProperties",void 0),o([ue()],Pp.prototype,"hovering",void 0),o([ue()],Pp.prototype,"bgFocused",void 0),o([ue()],Pp.prototype,"fgActivation",void 0),o([ue()],Pp.prototype,"fgDeactivation",void 0),o([ue()],Pp.prototype,"fgScale",void 0),o([ue()],Pp.prototype,"fgSize",void 0),o([ue()],Pp.prototype,"translateStart",void 0),o([ue()],Pp.prototype,"translateEnd",void 0),o([ue()],Pp.prototype,"leftPos",void 0),o([ue()],Pp.prototype,"topPos",void 0);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const Np=u`.mdc-ripple-surface{--mdc-ripple-fg-size:0;--mdc-ripple-left:0;--mdc-ripple-top:0;--mdc-ripple-fg-scale:1;--mdc-ripple-fg-translate-end:0;--mdc-ripple-fg-translate-start:0;-webkit-tap-highlight-color:transparent;will-change:transform,opacity;position:relative;outline:0;overflow:hidden}.mdc-ripple-surface::after,.mdc-ripple-surface::before{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-ripple-surface::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index,1)}.mdc-ripple-surface::after{z-index:0;z-index:var(--mdc-ripple-z-index,0)}.mdc-ripple-surface.mdc-ripple-upgraded::before{transform:scale(var(--mdc-ripple-fg-scale,1))}.mdc-ripple-surface.mdc-ripple-upgraded::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-ripple-surface.mdc-ripple-upgraded--unbounded::after{top:var(--mdc-ripple-top,0);left:var(--mdc-ripple-left,0)}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-activation::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-deactivation::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}.mdc-ripple-surface::after,.mdc-ripple-surface::before{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-ripple-surface.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size,100%);height:var(--mdc-ripple-fg-size,100%)}.mdc-ripple-surface[data-mdc-ripple-is-unbounded],.mdc-ripple-upgraded--unbounded{overflow:visible}.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::after,.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::before,.mdc-ripple-upgraded--unbounded::after,.mdc-ripple-upgraded--unbounded::before{top:calc(50% - 50%);left:calc(50% - 50%);width:100%;height:100%}.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after,.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::before,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::after,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::before{top:var(--mdc-ripple-top,calc(50% - 50%));left:var(--mdc-ripple-left,calc(50% - 50%));width:var(--mdc-ripple-fg-size,100%);height:var(--mdc-ripple-fg-size,100%)}.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size,100%);height:var(--mdc-ripple-fg-size,100%)}.mdc-ripple-surface::after,.mdc-ripple-surface::before{background-color:#000;background-color:var(--mdc-ripple-color,#000)}.mdc-ripple-surface.mdc-ripple-surface--hover::before,.mdc-ripple-surface:hover::before{opacity:.04;opacity:var(--mdc-ripple-hover-opacity,.04)}.mdc-ripple-surface.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:.12;opacity:var(--mdc-ripple-focus-opacity,.12)}.mdc-ripple-surface:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:.12;opacity:var(--mdc-ripple-press-opacity,.12)}.mdc-ripple-surface.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(.4,0,.2,1);transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity,0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity,0)}to{opacity:0}}:host{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:block}:host .mdc-ripple-surface{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;will-change:unset}.mdc-ripple-surface--primary::after,.mdc-ripple-surface--primary::before{background-color:#6200ee;background-color:var(--mdc-ripple-color,var(--mdc-theme-primary,#6200ee))}.mdc-ripple-surface--primary.mdc-ripple-surface--hover::before,.mdc-ripple-surface--primary:hover::before{opacity:.04;opacity:var(--mdc-ripple-hover-opacity,.04)}.mdc-ripple-surface--primary.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:.12;opacity:var(--mdc-ripple-focus-opacity,.12)}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:.12;opacity:var(--mdc-ripple-press-opacity,.12)}.mdc-ripple-surface--primary.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--primary--activated::before{opacity:.12;opacity:var(--mdc-ripple-activated-opacity,.12)}.mdc-ripple-surface--primary--activated::after,.mdc-ripple-surface--primary--activated::before{background-color:#6200ee;background-color:var(--mdc-ripple-color,var(--mdc-theme-primary,#6200ee))}.mdc-ripple-surface--primary--activated.mdc-ripple-surface--hover::before,.mdc-ripple-surface--primary--activated:hover::before{opacity:.16;opacity:var(--mdc-ripple-hover-opacity,.16)}.mdc-ripple-surface--primary--activated.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:.24;opacity:var(--mdc-ripple-focus-opacity,.24)}.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:.24;opacity:var(--mdc-ripple-press-opacity,.24)}.mdc-ripple-surface--primary--activated.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--primary--selected::before{opacity:.08;opacity:var(--mdc-ripple-selected-opacity,.08)}.mdc-ripple-surface--primary--selected::after,.mdc-ripple-surface--primary--selected::before{background-color:#6200ee;background-color:var(--mdc-ripple-color,var(--mdc-theme-primary,#6200ee))}.mdc-ripple-surface--primary--selected.mdc-ripple-surface--hover::before,.mdc-ripple-surface--primary--selected:hover::before{opacity:.12;opacity:var(--mdc-ripple-hover-opacity,.12)}.mdc-ripple-surface--primary--selected.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:.2;opacity:var(--mdc-ripple-focus-opacity,.2)}.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:.2;opacity:var(--mdc-ripple-press-opacity,.2)}.mdc-ripple-surface--primary--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--accent::after,.mdc-ripple-surface--accent::before{background-color:#018786;background-color:var(--mdc-ripple-color,var(--mdc-theme-secondary,#018786))}.mdc-ripple-surface--accent.mdc-ripple-surface--hover::before,.mdc-ripple-surface--accent:hover::before{opacity:.04;opacity:var(--mdc-ripple-hover-opacity,.04)}.mdc-ripple-surface--accent.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:.12;opacity:var(--mdc-ripple-focus-opacity,.12)}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:.12;opacity:var(--mdc-ripple-press-opacity,.12)}.mdc-ripple-surface--accent.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--accent--activated::before{opacity:.12;opacity:var(--mdc-ripple-activated-opacity,.12)}.mdc-ripple-surface--accent--activated::after,.mdc-ripple-surface--accent--activated::before{background-color:#018786;background-color:var(--mdc-ripple-color,var(--mdc-theme-secondary,#018786))}.mdc-ripple-surface--accent--activated.mdc-ripple-surface--hover::before,.mdc-ripple-surface--accent--activated:hover::before{opacity:.16;opacity:var(--mdc-ripple-hover-opacity,.16)}.mdc-ripple-surface--accent--activated.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:.24;opacity:var(--mdc-ripple-focus-opacity,.24)}.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:.24;opacity:var(--mdc-ripple-press-opacity,.24)}.mdc-ripple-surface--accent--activated.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--accent--selected::before{opacity:.08;opacity:var(--mdc-ripple-selected-opacity,.08)}.mdc-ripple-surface--accent--selected::after,.mdc-ripple-surface--accent--selected::before{background-color:#018786;background-color:var(--mdc-ripple-color,var(--mdc-theme-secondary,#018786))}.mdc-ripple-surface--accent--selected.mdc-ripple-surface--hover::before,.mdc-ripple-surface--accent--selected:hover::before{opacity:.12;opacity:var(--mdc-ripple-hover-opacity,.12)}.mdc-ripple-surface--accent--selected.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:.2;opacity:var(--mdc-ripple-focus-opacity,.2)}.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:.2;opacity:var(--mdc-ripple-press-opacity,.2)}.mdc-ripple-surface--accent--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--disabled{opacity:0}.mdc-ripple-surface--internal-use-state-layer-custom-properties::after,.mdc-ripple-surface--internal-use-state-layer-custom-properties::before{background-color:#000;background-color:var(--mdc-ripple-hover-state-layer-color,#000)}.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-surface--hover::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties:hover::before{opacity:.04;opacity:var(--mdc-ripple-hover-state-layer-opacity,.04)}.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:.12;opacity:var(--mdc-ripple-focus-state-layer-opacity,.12)}.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:.12;opacity:var(--mdc-ripple-pressed-state-layer-opacity,.12)}.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-pressed-state-layer-opacity, 0.12)}`
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let Hp=class extends Pp{};function Bp(e,t,i){if(void 0!==t)
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
return function(e,t,i){const o=e.constructor;if(!i){const e=`__${t}`;if(!(i=o.getPropertyDescriptor(t,e)))throw new Error("@ariaProperty must be used after a @property decorator")}const r=i;let n="";if(!r.set)throw new Error(`@ariaProperty requires a setter for ${t}`);if(e.dispatchWizEvent)return i;const s={configurable:!0,enumerable:!0,set(e){if(""===n){const e=o.getPropertyOptions(t);n="string"==typeof e.attribute?e.attribute:t}this.hasAttribute(n)&&this.removeAttribute(n),r.set.call(this,e)}};return r.get&&(s.get=function(){return r.get.call(this)}),s}(e,t,i);throw new Error("@ariaProperty only supports TypeScript Decorators")}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */Hp.styles=[Np],Hp=o([de("mwc-ripple")],Hp);class Vp{constructor(e){this.startPress=t=>{e().then((e=>{e&&e.startPress(t)}))},this.endPress=()=>{e().then((e=>{e&&e.endPress()}))},this.startFocus=()=>{e().then((e=>{e&&e.startFocus()}))},this.endFocus=()=>{e().then((e=>{e&&e.endFocus()}))},this.startHover=()=>{e().then((e=>{e&&e.startHover()}))},this.endHover=()=>{e().then((e=>{e&&e.endHover()}))}}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jp=e=>null!=e?e:j
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;class Up extends ae{constructor(){super(...arguments),this.disabled=!1,this.icon="",this.shouldRenderRipple=!1,this.rippleHandlers=new Vp((()=>(this.shouldRenderRipple=!0,this.ripple)))}renderRipple(){return this.shouldRenderRipple?B` <mwc-ripple .disabled="${this.disabled}" unbounded> </mwc-ripple>`:""}focus(){const e=this.buttonElement;e&&(this.rippleHandlers.startFocus(),e.focus())}blur(){const e=this.buttonElement;e&&(this.rippleHandlers.endFocus(),e.blur())}render(){return B`<button class="mdc-icon-button mdc-icon-button--display-flex" aria-label="${this.ariaLabel||this.icon}" aria-haspopup="${jp(this.ariaHasPopup)}" ?disabled="${this.disabled}" @focus="${this.handleRippleFocus}" @blur="${this.handleRippleBlur}" @mousedown="${this.handleRippleMouseDown}" @mouseenter="${this.handleRippleMouseEnter}" @mouseleave="${this.handleRippleMouseLeave}" @touchstart="${this.handleRippleTouchStart}" @touchend="${this.handleRippleDeactivate}" @touchcancel="${this.handleRippleDeactivate}">${this.renderRipple()} ${this.icon?B`<i class="material-icons">${this.icon}</i>`:""} <span><slot></slot></span> </button>`}handleRippleMouseDown(e){const t=()=>{window.removeEventListener("mouseup",t),this.handleRippleDeactivate()};window.addEventListener("mouseup",t),this.rippleHandlers.startPress(e)}handleRippleTouchStart(e){this.rippleHandlers.startPress(e)}handleRippleDeactivate(){this.rippleHandlers.endPress()}handleRippleMouseEnter(){this.rippleHandlers.startHover()}handleRippleMouseLeave(){this.rippleHandlers.endHover()}handleRippleFocus(){this.rippleHandlers.startFocus()}handleRippleBlur(){this.rippleHandlers.endFocus()}}o([he({type:Boolean,reflect:!0})],Up.prototype,"disabled",void 0),o([he({type:String})],Up.prototype,"icon",void 0),o([Bp,he({type:String,attribute:"aria-label"})],Up.prototype,"ariaLabel",void 0),o([Bp,he({type:String,attribute:"aria-haspopup"})],Up.prototype,"ariaHasPopup",void 0),o([fe("button")],Up.prototype,"buttonElement",void 0),o([ge("mwc-ripple")],Up.prototype,"ripple",void 0),o([ue()],Up.prototype,"shouldRenderRipple",void 0),o([me({passive:!0})],Up.prototype,"handleRippleMouseDown",null),o([me({passive:!0})],Up.prototype,"handleRippleTouchStart",null);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const Wp=u`.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:400;font-style:normal;font-size:var(--mdc-icon-size,24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}.mdc-icon-button{font-size:24px;width:48px;height:48px;padding:12px}.mdc-icon-button .mdc-icon-button__focus-ring{display:none}.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{display:block;max-height:48px;max-width:48px}@media screen and (forced-colors:active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{pointer-events:none;border:2px solid transparent;border-radius:6px;box-sizing:content-box;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);height:100%;width:100%}}@media screen and (forced-colors:active)and (forced-colors:active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{border-color:CanvasText}}@media screen and (forced-colors:active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring::after,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring::after{content:"";border:2px solid transparent;border-radius:8px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);height:calc(100% + 4px);width:calc(100% + 4px)}}@media screen and (forced-colors:active)and (forced-colors:active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring::after,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring::after{border-color:CanvasText}}.mdc-icon-button.mdc-icon-button--reduced-size .mdc-icon-button__ripple{width:40px;height:40px;margin-top:4px;margin-bottom:4px;margin-right:4px;margin-left:4px}.mdc-icon-button.mdc-icon-button--reduced-size.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button.mdc-icon-button--reduced-size:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{max-height:40px;max-width:40px}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%,-50%)}.mdc-icon-button:disabled{color:rgba(0,0,0,.38);color:var(--mdc-theme-text-disabled-on-light,rgba(0,0,0,.38))}.mdc-icon-button img,.mdc-icon-button svg{width:24px;height:24px}.mdc-icon-button{display:inline-block;position:relative;box-sizing:border-box;border:none;outline:0;background-color:transparent;fill:currentColor;color:inherit;text-decoration:none;cursor:pointer;user-select:none;z-index:0;overflow:visible}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%,-50%)}.mdc-icon-button:disabled{cursor:default;pointer-events:none}.mdc-icon-button--display-flex{align-items:center;display:inline-flex;justify-content:center}.mdc-icon-button__icon{display:inline-block}.mdc-icon-button__icon.mdc-icon-button__icon--on{display:none}.mdc-icon-button--on .mdc-icon-button__icon{display:none}.mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on{display:inline-block}.mdc-icon-button__link{height:100%;left:0;outline:0;position:absolute;top:0;width:100%}.mdc-icon-button{display:inline-block;position:relative;box-sizing:border-box;border:none;outline:0;background-color:transparent;fill:currentColor;color:inherit;text-decoration:none;cursor:pointer;user-select:none;z-index:0;overflow:visible}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%,-50%)}.mdc-icon-button:disabled{cursor:default;pointer-events:none}.mdc-icon-button--display-flex{align-items:center;display:inline-flex;justify-content:center}.mdc-icon-button__icon{display:inline-block}.mdc-icon-button__icon.mdc-icon-button__icon--on{display:none}.mdc-icon-button--on .mdc-icon-button__icon{display:none}.mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on{display:inline-block}.mdc-icon-button__link{height:100%;left:0;outline:0;position:absolute;top:0;width:100%}:host{display:inline-block;outline:0}:host([disabled]){pointer-events:none}.mdc-icon-button ::slotted(*),.mdc-icon-button i,.mdc-icon-button img,.mdc-icon-button svg{display:block}:host{--mdc-ripple-color:currentcolor;-webkit-tap-highlight-color:transparent}.mdc-icon-button,:host{vertical-align:top}.mdc-icon-button{width:var(--mdc-icon-button-size,48px);height:var(--mdc-icon-button-size,48px);padding:calc((var(--mdc-icon-button-size,48px) - var(--mdc-icon-size,24px))/ 2)}.mdc-icon-button ::slotted(*),.mdc-icon-button i,.mdc-icon-button img,.mdc-icon-button svg{display:block;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)}`
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let qp=class extends Up{};qp.styles=[Wp],qp=o([de("mwc-icon-button")],qp);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Gp=class extends ae{constructor(){super(...arguments),this._tabs=[],this._active=void 0}get active(){return this._active}set active(e){const t=this._active;e!==t&&(this._active=e,void 0!==t&&(t.active=!1),void 0!==e?e.active=!0:this.dispatchEvent(new CustomEvent("tabchange",{detail:{tab:void 0},bubbles:!0})))}render(){return B` <div role="tablist" aria-label="${jp(this.label)}"> <slot @slotchange="${this._onSlotchange}" @click="${this._activateTab}" @keydown="${this._onKeydown}" @tabchange="${this._activateTab}"></slot> </div> `}_onSlotchange(e){let t;this._tabs=e.target.assignedElements();for(let e=0;e<this._tabs.length;e++){const i=this._tabs[e];i.index=e,void 0!==t?i.active=!1:(i.active||i.hasAttribute("active"))&&(t=i)}this.active=t}_activateTab(e){const t=this._findEventTab(e);void 0!==t&&(this.active=t,this._scrollTabIntoViewIfNeeded(t))}_scrollTabIntoViewIfNeeded(e){const t=this.getBoundingClientRect(),i=e.getBoundingClientRect();if(i.left-48<t.left||i.right+48>t.right){const e=i.left-t.left+this.scrollLeft-t.width/2+i.width/2;this.scroll({left:e,behavior:"smooth"})}}async _onKeydown(e){var t,i;const o=null!==(i=null===(t=this.active)||void 0===t?void 0:t.index)&&void 0!==i?i:0,r=this._tabs.length-1;let n=o;switch(e.key){case"ArrowLeft":0===o?n=r:n--;break;case"ArrowRight":o===r?n=0:n++;break;case"Home":n=0;break;case"End":n=r}if(n!==o){e.preventDefault();const t=this._tabs[n];this.active=t,await t.updateComplete,t.focus()}}_findEventTab(e){const t=e.target;if("playground-internal-tab"===(null==t?void 0:t.localName))return e.target;for(const t of e.composedPath())if("playground-internal-tab"===(null==t?void 0:t.localName))return t}};Gp.styles=u`:host{display:flex;overflow-x:auto}:host::-webkit-scrollbar{display:none}div{display:flex}`,o([he()],Gp.prototype,"label",void 0),Gp=o([de("playground-internal-tab-bar")],Gp);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Xp=class extends ae{constructor(){super(...arguments),this.active=!1,this.index=0}render(){return B`<button role="tab" part="button" aria-selected="${this.active?"true":"false"}" tabindex="${this.active?"0":"-1"}"> <slot></slot> </button>`}updated(e){e.has("active")&&this.active&&this.dispatchEvent(new CustomEvent("tabchange",{detail:{tab:this},bubbles:!0}))}focus(){this._button.focus()}};Xp.styles=u`:host{display:flex}button{flex:1;border:none;font-size:inherit;font-family:inherit;color:inherit;background:0 0;display:flex;align-items:center;cursor:pointer;position:relative;outline:0}button::before{content:'';position:absolute;width:100%;height:100%;left:0;top:0;background:currentcolor;opacity:0;transition:opacity 150ms}button:focus::before,button:hover::before{opacity:10%}button:active::before{opacity:20%}:host([active])>button::after{content:'';position:absolute;left:0;bottom:0;width:100%;height:2px;background:var(--playground-tab-bar-indicator-color,var(--playground-highlight-color,#6200ee))}`,o([he({type:Boolean,reflect:!0})],Xp.prototype,"active",void 0),o([fe("button")],Xp.prototype,"_button",void 0),Xp=o([de("playground-internal-tab")],Xp);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const Kp=e=>(t,i)=>{if(t.constructor._observers){if(!t.constructor.hasOwnProperty("_observers")){const e=t.constructor._observers;t.constructor._observers=new Map,e.forEach(((e,i)=>t.constructor._observers.set(i,e)))}}else{t.constructor._observers=new Map;const e=t.updated;t.updated=function(t){e.call(this,t),t.forEach(((e,t)=>{const i=this.constructor._observers.get(t);void 0!==i&&i.call(this,this[t],e)}))}}t.constructor._observers.set(i,e)}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;class Zp extends ae{constructor(){super(...arguments),this.value="",this.group=null,this.tabindex=-1,this.disabled=!1,this.twoline=!1,this.activated=!1,this.graphic=null,this.multipleGraphics=!1,this.hasMeta=!1,this.noninteractive=!1,this.selected=!1,this.shouldRenderRipple=!1,this._managingList=null,this.boundOnClick=this.onClick.bind(this),this._firstChanged=!0,this._skipPropRequest=!1,this.rippleHandlers=new Vp((()=>(this.shouldRenderRipple=!0,this.ripple))),this.listeners=[{target:this,eventNames:["click"],cb:()=>{this.onClick()}},{target:this,eventNames:["mouseenter"],cb:this.rippleHandlers.startHover},{target:this,eventNames:["mouseleave"],cb:this.rippleHandlers.endHover},{target:this,eventNames:["focus"],cb:this.rippleHandlers.startFocus},{target:this,eventNames:["blur"],cb:this.rippleHandlers.endFocus},{target:this,eventNames:["mousedown","touchstart"],cb:e=>{const t=e.type;this.onDown("mousedown"===t?"mouseup":"touchend",e)}}]}get text(){const e=this.textContent;return e?e.trim():""}render(){const e=this.renderText(),t=this.graphic?this.renderGraphic():B``,i=this.hasMeta?this.renderMeta():B``;return B` ${this.renderRipple()} ${t} ${e} ${i}`}renderRipple(){return this.shouldRenderRipple?B` <mwc-ripple .activated="${this.activated}"> </mwc-ripple>`:this.activated?B`<div class="fake-activated-ripple"></div>`:""}renderGraphic(){const e={multi:this.multipleGraphics};return B` <span class="mdc-deprecated-list-item__graphic material-icons ${Dp(e)}"> <slot name="graphic"></slot> </span>`}renderMeta(){return B` <span class="mdc-deprecated-list-item__meta material-icons"> <slot name="meta"></slot> </span>`}renderText(){const e=this.twoline?this.renderTwoline():this.renderSingleLine();return B` <span class="mdc-deprecated-list-item__text"> ${e} </span>`}renderSingleLine(){return B`<slot></slot>`}renderTwoline(){return B` <span class="mdc-deprecated-list-item__primary-text"> <slot></slot> </span> <span class="mdc-deprecated-list-item__secondary-text"> <slot name="secondary"></slot> </span> `}onClick(){this.fireRequestSelected(!this.selected,"interaction")}onDown(e,t){const i=()=>{window.removeEventListener(e,i),this.rippleHandlers.endPress()};window.addEventListener(e,i),this.rippleHandlers.startPress(t)}fireRequestSelected(e,t){if(this.noninteractive)return;const i=new CustomEvent("request-selected",{bubbles:!0,composed:!0,detail:{source:t,selected:e}});this.dispatchEvent(i)}connectedCallback(){super.connectedCallback(),this.noninteractive||this.setAttribute("mwc-list-item","");for(const e of this.listeners)for(const t of e.eventNames)e.target.addEventListener(t,e.cb,{passive:!0})}disconnectedCallback(){super.disconnectedCallback();for(const e of this.listeners)for(const t of e.eventNames)e.target.removeEventListener(t,e.cb);this._managingList&&(this._managingList.debouncedLayout?this._managingList.debouncedLayout(!0):this._managingList.layout(!0))}firstUpdated(){const e=new Event("list-item-rendered",{bubbles:!0,composed:!0});this.dispatchEvent(e)}}o([fe("slot")],Zp.prototype,"slotElement",void 0),o([ge("mwc-ripple")],Zp.prototype,"ripple",void 0),o([he({type:String})],Zp.prototype,"value",void 0),o([he({type:String,reflect:!0})],Zp.prototype,"group",void 0),o([he({type:Number,reflect:!0})],Zp.prototype,"tabindex",void 0),o([he({type:Boolean,reflect:!0}),Kp((function(e){e?this.setAttribute("aria-disabled","true"):this.setAttribute("aria-disabled","false")}))],Zp.prototype,"disabled",void 0),o([he({type:Boolean,reflect:!0})],Zp.prototype,"twoline",void 0),o([he({type:Boolean,reflect:!0})],Zp.prototype,"activated",void 0),o([he({type:String,reflect:!0})],Zp.prototype,"graphic",void 0),o([he({type:Boolean})],Zp.prototype,"multipleGraphics",void 0),o([he({type:Boolean})],Zp.prototype,"hasMeta",void 0),o([he({type:Boolean,reflect:!0}),Kp((function(e){e?(this.removeAttribute("aria-checked"),this.removeAttribute("mwc-list-item"),this.selected=!1,this.activated=!1,this.tabIndex=-1):this.setAttribute("mwc-list-item","")}))],Zp.prototype,"noninteractive",void 0),o([he({type:Boolean,reflect:!0}),Kp((function(e){const t=this.getAttribute("role"),i="gridcell"===t||"option"===t||"row"===t||"tab"===t;i&&e?this.setAttribute("aria-selected","true"):i&&this.setAttribute("aria-selected","false"),this._firstChanged?this._firstChanged=!1:this._skipPropRequest||this.fireRequestSelected(e,"property")}))],Zp.prototype,"selected",void 0),o([ue()],Zp.prototype,"shouldRenderRipple",void 0),o([ue()],Zp.prototype,"_managingList",void 0);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const Yp=u`:host{cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;height:48px;display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:var(--mdc-list-side-padding,16px);padding-right:var(--mdc-list-side-padding,16px);outline:0;height:48px;color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-background,rgba(0,0,0,.87))}:host:focus{outline:0}:host([activated]){color:#6200ee;color:var(--mdc-theme-primary,#6200ee);--mdc-ripple-color:var( --mdc-theme-primary, #6200ee )}:host([activated]) .mdc-deprecated-list-item__graphic{color:#6200ee;color:var(--mdc-theme-primary,#6200ee)}:host([activated]) .fake-activated-ripple::before{position:absolute;display:block;top:0;bottom:0;left:0;right:0;width:100%;height:100%;pointer-events:none;z-index:1;content:"";opacity:.12;opacity:var(--mdc-ripple-activated-opacity,.12);background-color:#6200ee;background-color:var(--mdc-ripple-color,var(--mdc-theme-primary,#6200ee))}.mdc-deprecated-list-item__graphic{flex-shrink:0;align-items:center;justify-content:center;fill:currentColor;display:inline-flex}.mdc-deprecated-list-item__graphic ::slotted(*){flex-shrink:0;align-items:center;justify-content:center;fill:currentColor;width:100%;height:100%;text-align:center}.mdc-deprecated-list-item__meta{width:var(--mdc-list-item-meta-size,24px);height:var(--mdc-list-item-meta-size,24px);margin-left:auto;margin-right:0;color:rgba(0,0,0,.38);color:var(--mdc-theme-text-hint-on-background,rgba(0,0,0,.38))}.mdc-deprecated-list-item__meta.multi{width:auto}.mdc-deprecated-list-item__meta ::slotted(*){width:var(--mdc-list-item-meta-size,24px);line-height:var(--mdc-list-item-meta-size,24px)}.mdc-deprecated-list-item__meta ::slotted(.material-icons),.mdc-deprecated-list-item__meta ::slotted(mwc-icon){line-height:var(--mdc-list-item-meta-size,24px)!important}.mdc-deprecated-list-item__meta ::slotted(:not(.material-icons):not(mwc-icon)){-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-caption-font-family,var(--mdc-typography-font-family,Roboto,sans-serif));font-size:.75rem;font-size:var(--mdc-typography-caption-font-size,.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height,1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight,400);letter-spacing:.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing,.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform,inherit)}.mdc-deprecated-list-item__meta[dir=rtl],[dir=rtl] .mdc-deprecated-list-item__meta{margin-left:0;margin-right:auto}.mdc-deprecated-list-item__meta ::slotted(*){width:100%;height:100%}.mdc-deprecated-list-item__text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mdc-deprecated-list-item__text ::slotted([for]),.mdc-deprecated-list-item__text[for]{pointer-events:none}.mdc-deprecated-list-item__primary-text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;margin-top:0;line-height:normal;margin-bottom:-20px;display:block}.mdc-deprecated-list-item__primary-text::before{display:inline-block;width:0;height:32px;content:"";vertical-align:0}.mdc-deprecated-list-item__primary-text::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}.mdc-deprecated-list-item__secondary-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-body2-font-family,var(--mdc-typography-font-family,Roboto,sans-serif));font-size:.875rem;font-size:var(--mdc-typography-body2-font-size,.875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height,1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight,400);letter-spacing:.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing,.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform,inherit);text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;margin-top:0;line-height:normal;display:block}.mdc-deprecated-list-item__secondary-text::before{display:inline-block;width:0;height:20px;content:"";vertical-align:0}.mdc-deprecated-list--dense .mdc-deprecated-list-item__secondary-text{font-size:inherit}* ::slotted(a),a{color:inherit;text-decoration:none}:host([twoline]){height:72px}:host([twoline]) .mdc-deprecated-list-item__text{align-self:flex-start}:host([disabled]),:host([noninteractive]){cursor:default;pointer-events:none}:host([disabled]) .mdc-deprecated-list-item__text ::slotted(*){opacity:.38}:host([disabled]) .mdc-deprecated-list-item__primary-text ::slotted(*),:host([disabled]) .mdc-deprecated-list-item__secondary-text ::slotted(*),:host([disabled]) .mdc-deprecated-list-item__text ::slotted(*){color:#000;color:var(--mdc-theme-on-surface,#000)}.mdc-deprecated-list-item__secondary-text ::slotted(*){color:rgba(0,0,0,.54);color:var(--mdc-theme-text-secondary-on-background,rgba(0,0,0,.54))}.mdc-deprecated-list-item__graphic ::slotted(*){background-color:transparent;color:rgba(0,0,0,.38);color:var(--mdc-theme-text-icon-on-background,rgba(0,0,0,.38))}.mdc-deprecated-list-group__subheader ::slotted(*){color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-background,rgba(0,0,0,.87))}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size,40px);height:var(--mdc-list-item-graphic-size,40px)}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size,40px);line-height:var(--mdc-list-item-graphic-size,40px)}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size,40px)!important}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(*){border-radius:50%}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic,:host([graphic=control]) .mdc-deprecated-list-item__graphic,:host([graphic=large]) .mdc-deprecated-list-item__graphic,:host([graphic=medium]) .mdc-deprecated-list-item__graphic{margin-left:0;margin-right:var(--mdc-list-item-graphic-margin,16px)}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=control]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=large]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=medium]) .mdc-deprecated-list-item__graphic[dir=rtl],[dir=rtl] :host([graphic=avatar]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=control]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=large]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=medium]) .mdc-deprecated-list-item__graphic{margin-left:var(--mdc-list-item-graphic-margin,16px);margin-right:0}:host([graphic=icon]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size,24px);height:var(--mdc-list-item-graphic-size,24px);margin-left:0;margin-right:var(--mdc-list-item-graphic-margin,32px)}:host([graphic=icon]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size,24px);line-height:var(--mdc-list-item-graphic-size,24px)}:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size,24px)!important}:host([graphic=icon]) .mdc-deprecated-list-item__graphic[dir=rtl],[dir=rtl] :host([graphic=icon]) .mdc-deprecated-list-item__graphic{margin-left:var(--mdc-list-item-graphic-margin,32px);margin-right:0}:host([graphic=avatar]:not([twoLine])),:host([graphic=icon]:not([twoLine])){height:56px}:host([graphic=large]:not([twoLine])),:host([graphic=medium]:not([twoLine])){height:72px}:host([graphic=large]) .mdc-deprecated-list-item__graphic,:host([graphic=medium]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size,56px);height:var(--mdc-list-item-graphic-size,56px)}:host([graphic=large]) .mdc-deprecated-list-item__graphic.multi,:host([graphic=medium]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(*),:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size,56px);line-height:var(--mdc-list-item-graphic-size,56px)}:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon),:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size,56px)!important}:host([graphic=large]){padding-left:0}`
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let Qp=class extends Zp{};Qp.styles=[Yp],Qp=o([de("mwc-list-item")],Qp);
/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Jp="Unknown",em="Backspace",tm="Enter",im="Spacebar",om="PageUp",rm="PageDown",nm="End",sm="Home",am="ArrowLeft",lm="ArrowUp",dm="ArrowRight",cm="ArrowDown",hm="Delete",um="Escape",pm="Tab",mm=new Set;mm.add(em),mm.add(tm),mm.add(im),mm.add(om),mm.add(rm),mm.add(nm),mm.add(sm),mm.add(am),mm.add(lm),mm.add(dm),mm.add(cm),mm.add(hm),mm.add(um),mm.add(pm);var fm=8,gm=13,vm=32,bm=33,ym=34,xm=35,wm=36,km=37,Cm=38,$m=39,_m=40,Sm=46,Tm=27,Em=9,Am=new Map;Am.set(fm,em),Am.set(gm,tm),Am.set(vm,im),Am.set(bm,om),Am.set(ym,rm),Am.set(xm,nm),Am.set(wm,sm),Am.set(km,am),Am.set(Cm,lm),Am.set($m,dm),Am.set(_m,cm),Am.set(Sm,hm),Am.set(Tm,um),Am.set(Em,pm);var Im,Om,Lm=new Set;function Fm(e){var t=e.key;if(mm.has(t))return t;var i=Am.get(e.keyCode);return i||Jp}
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */Lm.add(om),Lm.add(rm),Lm.add(nm),Lm.add(sm),Lm.add(am),Lm.add(lm),Lm.add(dm),Lm.add(cm);var Mm="mdc-list-item--activated",Rm="mdc-list-item",Dm="mdc-list-item--disabled",zm="mdc-list-item--selected",Pm="mdc-list-item__text",Nm="mdc-list-item__primary-text",Hm="mdc-list";(Im={})[""+Mm]="mdc-list-item--activated",Im[""+Rm]="mdc-list-item",Im[""+Dm]="mdc-list-item--disabled",Im[""+zm]="mdc-list-item--selected",Im[""+Nm]="mdc-list-item__primary-text",Im[""+Hm]="mdc-list";var Bm=((Om={})[""+Mm]="mdc-deprecated-list-item--activated",Om[""+Rm]="mdc-deprecated-list-item",Om[""+Dm]="mdc-deprecated-list-item--disabled",Om[""+zm]="mdc-deprecated-list-item--selected",Om[""+Pm]="mdc-deprecated-list-item__text",Om[""+Nm]="mdc-deprecated-list-item__primary-text",Om[""+Hm]="mdc-deprecated-list",Om),Vm={ACTION_EVENT:"MDCList:action",SELECTION_CHANGE_EVENT:"MDCList:selectionChange",ARIA_CHECKED:"aria-checked",ARIA_CHECKED_CHECKBOX_SELECTOR:'[role="checkbox"][aria-checked="true"]',ARIA_CHECKED_RADIO_SELECTOR:'[role="radio"][aria-checked="true"]',ARIA_CURRENT:"aria-current",ARIA_DISABLED:"aria-disabled",ARIA_ORIENTATION:"aria-orientation",ARIA_ORIENTATION_HORIZONTAL:"horizontal",ARIA_ROLE_CHECKBOX_SELECTOR:'[role="checkbox"]',ARIA_SELECTED:"aria-selected",ARIA_INTERACTIVE_ROLES_SELECTOR:'[role="listbox"], [role="menu"]',ARIA_MULTI_SELECTABLE_SELECTOR:'[aria-multiselectable="true"]',CHECKBOX_RADIO_SELECTOR:'input[type="checkbox"], input[type="radio"]',CHECKBOX_SELECTOR:'input[type="checkbox"]',CHILD_ELEMENTS_TO_TOGGLE_TABINDEX:"\n    ."+Rm+" button:not(:disabled),\n    ."+Rm+" a,\n    ."+Bm[Rm]+" button:not(:disabled),\n    ."+Bm[Rm]+" a\n  ",DEPRECATED_SELECTOR:".mdc-deprecated-list",FOCUSABLE_CHILD_ELEMENTS:"\n    ."+Rm+" button:not(:disabled),\n    ."+Rm+" a,\n    ."+Rm+' input[type="radio"]:not(:disabled),\n    .'+Rm+' input[type="checkbox"]:not(:disabled),\n    .'+Bm[Rm]+" button:not(:disabled),\n    ."+Bm[Rm]+" a,\n    ."+Bm[Rm]+' input[type="radio"]:not(:disabled),\n    .'+Bm[Rm]+' input[type="checkbox"]:not(:disabled)\n  ',RADIO_SELECTOR:'input[type="radio"]',SELECTED_ITEM_SELECTOR:'[aria-selected="true"], [aria-current="true"]'},jm={UNSET_INDEX:-1,TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS:300};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const Um=(e,t)=>e-t,Wm=["input","button","textarea","select"];function qm(e){return e instanceof Set}const Gm=e=>{const t=e===jm.UNSET_INDEX?new Set:e;return qm(t)?new Set(t):new Set([t])};class Xm extends Tp{constructor(e){super(Object.assign(Object.assign({},Xm.defaultAdapter),e)),this.isMulti_=!1,this.wrapFocus_=!1,this.isVertical_=!0,this.selectedIndex_=jm.UNSET_INDEX,this.focusedItemIndex_=jm.UNSET_INDEX,this.useActivatedClass_=!1,this.ariaCurrentAttrValue_=null}static get strings(){return Vm}static get numbers(){return jm}static get defaultAdapter(){return{focusItemAtIndex:()=>{},getFocusedElementIndex:()=>0,getListItemCount:()=>0,isFocusInsideList:()=>!1,isRootFocused:()=>!1,notifyAction:()=>{},notifySelected:()=>{},getSelectedStateForElementIndex:()=>!1,setDisabledStateForElementIndex:()=>{},getDisabledStateForElementIndex:()=>!1,setSelectedStateForElementIndex:()=>{},setActivatedStateForElementIndex:()=>{},setTabIndexForElementIndex:()=>{},setAttributeForElementIndex:()=>{},getAttributeForElementIndex:()=>null}}setWrapFocus(e){this.wrapFocus_=e}setMulti(e){this.isMulti_=e;const t=this.selectedIndex_;if(e){if(!qm(t)){const e=t===jm.UNSET_INDEX;this.selectedIndex_=e?new Set:new Set([t])}}else if(qm(t))if(t.size){const e=Array.from(t).sort(Um);this.selectedIndex_=e[0]}else this.selectedIndex_=jm.UNSET_INDEX}setVerticalOrientation(e){this.isVertical_=e}setUseActivatedClass(e){this.useActivatedClass_=e}getSelectedIndex(){return this.selectedIndex_}setSelectedIndex(e){this.isIndexValid_(e)&&(this.isMulti_?this.setMultiSelectionAtIndex_(Gm(e)):this.setSingleSelectionAtIndex_(e))}handleFocusIn(e,t){t>=0&&this.adapter.setTabIndexForElementIndex(t,0)}handleFocusOut(e,t){t>=0&&this.adapter.setTabIndexForElementIndex(t,-1),setTimeout((()=>{this.adapter.isFocusInsideList()||this.setTabindexToFirstSelectedItem_()}),0)}handleKeydown(e,t,i){const o="ArrowLeft"===Fm(e),r="ArrowUp"===Fm(e),n="ArrowRight"===Fm(e),s="ArrowDown"===Fm(e),a="Home"===Fm(e),l="End"===Fm(e),d="Enter"===Fm(e),c="Spacebar"===Fm(e);if(this.adapter.isRootFocused())return void(r||l?(e.preventDefault(),this.focusLastElement()):(s||a)&&(e.preventDefault(),this.focusFirstElement()));let h,u=this.adapter.getFocusedElementIndex();if(!(-1===u&&(u=i,u<0))){if(this.isVertical_&&s||!this.isVertical_&&n)this.preventDefaultEvent(e),h=this.focusNextElement(u);else if(this.isVertical_&&r||!this.isVertical_&&o)this.preventDefaultEvent(e),h=this.focusPrevElement(u);else if(a)this.preventDefaultEvent(e),h=this.focusFirstElement();else if(l)this.preventDefaultEvent(e),h=this.focusLastElement();else if((d||c)&&t){const t=e.target;if(t&&"A"===t.tagName&&d)return;this.preventDefaultEvent(e),this.setSelectedIndexOnAction_(u,!0)}this.focusedItemIndex_=u,void 0!==h&&(this.setTabindexAtIndex_(h),this.focusedItemIndex_=h)}}handleSingleSelection(e,t,i){e!==jm.UNSET_INDEX&&(this.setSelectedIndexOnAction_(e,t,i),this.setTabindexAtIndex_(e),this.focusedItemIndex_=e)}focusNextElement(e){let t=e+1;if(t>=this.adapter.getListItemCount()){if(!this.wrapFocus_)return e;t=0}return this.adapter.focusItemAtIndex(t),t}focusPrevElement(e){let t=e-1;if(t<0){if(!this.wrapFocus_)return e;t=this.adapter.getListItemCount()-1}return this.adapter.focusItemAtIndex(t),t}focusFirstElement(){return this.adapter.focusItemAtIndex(0),0}focusLastElement(){const e=this.adapter.getListItemCount()-1;return this.adapter.focusItemAtIndex(e),e}setEnabled(e,t){this.isIndexValid_(e)&&this.adapter.setDisabledStateForElementIndex(e,!t)}preventDefaultEvent(e){const t=`${e.target.tagName}`.toLowerCase();-1===Wm.indexOf(t)&&e.preventDefault()}setSingleSelectionAtIndex_(e,t=!0){this.selectedIndex_!==e&&(this.selectedIndex_!==jm.UNSET_INDEX&&(this.adapter.setSelectedStateForElementIndex(this.selectedIndex_,!1),this.useActivatedClass_&&this.adapter.setActivatedStateForElementIndex(this.selectedIndex_,!1)),t&&this.adapter.setSelectedStateForElementIndex(e,!0),this.useActivatedClass_&&this.adapter.setActivatedStateForElementIndex(e,!0),this.setAriaForSingleSelectionAtIndex_(e),this.selectedIndex_=e,this.adapter.notifySelected(e))}setMultiSelectionAtIndex_(e,t=!0){const i=((e,t)=>{const i=Array.from(e),o=Array.from(t),r={added:[],removed:[]},n=i.sort(Um),s=o.sort(Um);let a=0,l=0;for(;a<n.length||l<s.length;){const e=n[a],t=s[l];e!==t?void 0!==e&&(void 0===t||e<t)?(r.removed.push(e),a++):void 0!==t&&(void 0===e||t<e)&&(r.added.push(t),l++):(a++,l++)}return r})(Gm(this.selectedIndex_),e);if(i.removed.length||i.added.length){for(const e of i.removed)t&&this.adapter.setSelectedStateForElementIndex(e,!1),this.useActivatedClass_&&this.adapter.setActivatedStateForElementIndex(e,!1);for(const e of i.added)t&&this.adapter.setSelectedStateForElementIndex(e,!0),this.useActivatedClass_&&this.adapter.setActivatedStateForElementIndex(e,!0);this.selectedIndex_=e,this.adapter.notifySelected(e,i)}}setAriaForSingleSelectionAtIndex_(e){this.selectedIndex_===jm.UNSET_INDEX&&(this.ariaCurrentAttrValue_=this.adapter.getAttributeForElementIndex(e,Vm.ARIA_CURRENT));const t=null!==this.ariaCurrentAttrValue_,i=t?Vm.ARIA_CURRENT:Vm.ARIA_SELECTED;this.selectedIndex_!==jm.UNSET_INDEX&&this.adapter.setAttributeForElementIndex(this.selectedIndex_,i,"false");const o=t?this.ariaCurrentAttrValue_:"true";this.adapter.setAttributeForElementIndex(e,i,o)}setTabindexAtIndex_(e){this.focusedItemIndex_===jm.UNSET_INDEX&&0!==e?this.adapter.setTabIndexForElementIndex(0,-1):this.focusedItemIndex_>=0&&this.focusedItemIndex_!==e&&this.adapter.setTabIndexForElementIndex(this.focusedItemIndex_,-1),this.adapter.setTabIndexForElementIndex(e,0)}setTabindexToFirstSelectedItem_(){let e=0;"number"==typeof this.selectedIndex_&&this.selectedIndex_!==jm.UNSET_INDEX?e=this.selectedIndex_:qm(this.selectedIndex_)&&this.selectedIndex_.size>0&&(e=Math.min(...this.selectedIndex_)),this.setTabindexAtIndex_(e)}isIndexValid_(e){if(e instanceof Set){if(!this.isMulti_)throw new Error("MDCListFoundation: Array of index is only supported for checkbox based list");if(0===e.size)return!0;{let t=!1;for(const i of e)if(t=this.isIndexInRange_(i),t)break;return t}}if("number"==typeof e){if(this.isMulti_)throw new Error("MDCListFoundation: Expected array of index for checkbox based list but got number: "+e);return e===jm.UNSET_INDEX||this.isIndexInRange_(e)}return!1}isIndexInRange_(e){const t=this.adapter.getListItemCount();return e>=0&&e<t}setSelectedIndexOnAction_(e,t,i){if(this.adapter.getDisabledStateForElementIndex(e))return;let o=e;if(this.isMulti_&&(o=new Set([e])),this.isIndexValid_(o)){if(this.isMulti_)this.toggleMultiAtIndex(e,i,t);else if(t||i)this.setSingleSelectionAtIndex_(e,t);else{this.selectedIndex_===e&&this.setSingleSelectionAtIndex_(jm.UNSET_INDEX)}t&&this.adapter.notifyAction(e)}}toggleMultiAtIndex(e,t,i=!0){let o=!1;o=void 0===t?!this.adapter.getSelectedStateForElementIndex(e):t;const r=Gm(this.selectedIndex_);o?r.add(e):r.delete(e),this.setMultiSelectionAtIndex_(r,i)}}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Km=e=>e.hasAttribute("mwc-list-item");function Zm(){const e=this.itemsReadyResolver;this.itemsReady=new Promise((e=>this.itemsReadyResolver=e)),e()}class Ym extends Sp{constructor(){super(),this.mdcAdapter=null,this.mdcFoundationClass=Xm,this.activatable=!1,this.multi=!1,this.wrapFocus=!1,this.itemRoles=null,this.innerRole=null,this.innerAriaLabel=null,this.rootTabbable=!1,this.previousTabindex=null,this.noninteractive=!1,this.itemsReadyResolver=()=>{},this.itemsReady=Promise.resolve([]),this.items_=[];const e=function(e,t=50){let i;return function(o=!0){clearTimeout(i),i=setTimeout((()=>{e(o)}),t)}}(this.layout.bind(this));this.debouncedLayout=(t=!0)=>{Zm.call(this),e(t)}}async getUpdateComplete(){const e=await super.getUpdateComplete();return await this.itemsReady,e}get items(){return this.items_}updateItems(){var e;const t=null!==(e=this.assignedElements)&&void 0!==e?e:[],i=[];for(const e of t)Km(e)&&(i.push(e),e._managingList=this),e.hasAttribute("divider")&&!e.hasAttribute("role")&&e.setAttribute("role","separator");this.items_=i;const o=new Set;if(this.items_.forEach(((e,t)=>{this.itemRoles?e.setAttribute("role",this.itemRoles):e.removeAttribute("role"),e.selected&&o.add(t)})),this.multi)this.select(o);else{const e=o.size?o.entries().next().value[1]:-1;this.select(e)}const r=new Event("items-updated",{bubbles:!0,composed:!0});this.dispatchEvent(r)}get selected(){const e=this.index;if(!qm(e))return-1===e?null:this.items[e];const t=[];for(const i of e)t.push(this.items[i]);return t}get index(){return this.mdcFoundation?this.mdcFoundation.getSelectedIndex():-1}render(){const e=null===this.innerRole?void 0:this.innerRole,t=null===this.innerAriaLabel?void 0:this.innerAriaLabel,i=this.rootTabbable?"0":"-1";return B` <ul tabindex="${i}" role="${jp(e)}" aria-label="${jp(t)}" class="mdc-deprecated-list" @keydown="${this.onKeydown}" @focusin="${this.onFocusIn}" @focusout="${this.onFocusOut}" @request-selected="${this.onRequestSelected}" @list-item-rendered="${this.onListItemConnected}"> <slot></slot> ${this.renderPlaceholder()} </ul> `}renderPlaceholder(){var e;const t=null!==(e=this.assignedElements)&&void 0!==e?e:[];return void 0!==this.emptyMessage&&0===t.length?B` <mwc-list-item noninteractive>${this.emptyMessage}</mwc-list-item> `:null}firstUpdated(){super.firstUpdated(),this.items.length||(this.mdcFoundation.setMulti(this.multi),this.layout())}onFocusIn(e){if(this.mdcFoundation&&this.mdcRoot){const t=this.getIndexOfTarget(e);this.mdcFoundation.handleFocusIn(e,t)}}onFocusOut(e){if(this.mdcFoundation&&this.mdcRoot){const t=this.getIndexOfTarget(e);this.mdcFoundation.handleFocusOut(e,t)}}onKeydown(e){if(this.mdcFoundation&&this.mdcRoot){const t=this.getIndexOfTarget(e),i=e.target,o=Km(i);this.mdcFoundation.handleKeydown(e,o,t)}}onRequestSelected(e){if(this.mdcFoundation){let t=this.getIndexOfTarget(e);if(-1===t&&(this.layout(),t=this.getIndexOfTarget(e),-1===t))return;if(this.items[t].disabled)return;const i=e.detail.selected,o=e.detail.source;this.mdcFoundation.handleSingleSelection(t,"interaction"===o,i),e.stopPropagation()}}getIndexOfTarget(e){const t=this.items,i=e.composedPath();for(const e of i){let i=-1;if(e.nodeType===Node.ELEMENT_NODE&&Km(e)&&(i=t.indexOf(e)),-1!==i)return i}return-1}createAdapter(){return this.mdcAdapter={getListItemCount:()=>this.mdcRoot?this.items.length:0,getFocusedElementIndex:this.getFocusedItemIndex,getAttributeForElementIndex:(e,t)=>{if(!this.mdcRoot)return"";const i=this.items[e];return i?i.getAttribute(t):""},setAttributeForElementIndex:(e,t,i)=>{if(!this.mdcRoot)return;const o=this.items[e];o&&o.setAttribute(t,i)},focusItemAtIndex:e=>{const t=this.items[e];t&&t.focus()},setTabIndexForElementIndex:(e,t)=>{const i=this.items[e];i&&(i.tabindex=t)},notifyAction:e=>{const t={bubbles:!0,composed:!0};t.detail={index:e};const i=new CustomEvent("action",t);this.dispatchEvent(i)},notifySelected:(e,t)=>{const i={bubbles:!0,composed:!0};i.detail={index:e,diff:t};const o=new CustomEvent("selected",i);this.dispatchEvent(o)},isFocusInsideList:()=>_p(this),isRootFocused:()=>{const e=this.mdcRoot;return e.getRootNode().activeElement===e},setDisabledStateForElementIndex:(e,t)=>{const i=this.items[e];i&&(i.disabled=t)},getDisabledStateForElementIndex:e=>{const t=this.items[e];return!!t&&t.disabled},setSelectedStateForElementIndex:(e,t)=>{const i=this.items[e];i&&(i.selected=t)},getSelectedStateForElementIndex:e=>{const t=this.items[e];return!!t&&t.selected},setActivatedStateForElementIndex:(e,t)=>{const i=this.items[e];i&&(i.activated=t)}},this.mdcAdapter}selectUi(e,t=!1){const i=this.items[e];i&&(i.selected=!0,i.activated=t)}deselectUi(e){const t=this.items[e];t&&(t.selected=!1,t.activated=!1)}select(e){this.mdcFoundation&&this.mdcFoundation.setSelectedIndex(e)}toggle(e,t){this.multi&&this.mdcFoundation.toggleMultiAtIndex(e,t)}onListItemConnected(e){const t=e.target;this.layout(-1===this.items.indexOf(t))}layout(e=!0){e&&this.updateItems();const t=this.items[0];for(const e of this.items)e.tabindex=-1;t&&(this.noninteractive?this.previousTabindex||(this.previousTabindex=t):t.tabindex=0),this.itemsReadyResolver()}getFocusedItemIndex(){if(!this.mdcRoot)return-1;if(!this.items.length)return-1;const e=$p();if(!e.length)return-1;for(let t=e.length-1;t>=0;t--){const i=e[t];if(Km(i))return this.items.indexOf(i)}return-1}focusItemAtIndex(e){for(const e of this.items)if(0===e.tabindex){e.tabindex=-1;break}this.items[e].tabindex=0,this.items[e].focus()}focus(){const e=this.mdcRoot;e&&e.focus()}blur(){const e=this.mdcRoot;e&&e.blur()}}o([he({type:String})],Ym.prototype,"emptyMessage",void 0),o([fe(".mdc-deprecated-list")],Ym.prototype,"mdcRoot",void 0),o([ye("",!0,"*")],Ym.prototype,"assignedElements",void 0),o([ye("",!0,'[tabindex="0"]')],Ym.prototype,"tabbableElements",void 0),o([he({type:Boolean}),Kp((function(e){this.mdcFoundation&&this.mdcFoundation.setUseActivatedClass(e)}))],Ym.prototype,"activatable",void 0),o([he({type:Boolean}),Kp((function(e,t){this.mdcFoundation&&this.mdcFoundation.setMulti(e),void 0!==t&&this.layout()}))],Ym.prototype,"multi",void 0),o([he({type:Boolean}),Kp((function(e){this.mdcFoundation&&this.mdcFoundation.setWrapFocus(e)}))],Ym.prototype,"wrapFocus",void 0),o([he({type:String}),Kp((function(e,t){void 0!==t&&this.updateItems()}))],Ym.prototype,"itemRoles",void 0),o([he({type:String})],Ym.prototype,"innerRole",void 0),o([he({type:String})],Ym.prototype,"innerAriaLabel",void 0),o([he({type:Boolean})],Ym.prototype,"rootTabbable",void 0),o([he({type:Boolean,reflect:!0}),Kp((function(e){var t,i;if(e){const e=null!==(i=null===(t=this.tabbableElements)||void 0===t?void 0:t[0])&&void 0!==i?i:null;this.previousTabindex=e,e&&e.setAttribute("tabindex","-1")}else!e&&this.previousTabindex&&(this.previousTabindex.setAttribute("tabindex","0"),this.previousTabindex=null)}))],Ym.prototype,"noninteractive",void 0);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const Qm=u`@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(.4,0,.2,1);transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity,0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity,0)}to{opacity:0}}:host{display:block}.mdc-deprecated-list{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-subtitle1-font-family,var(--mdc-typography-font-family,Roboto,sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size,1rem);line-height:1.75rem;line-height:var(--mdc-typography-subtitle1-line-height,1.75rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight,400);letter-spacing:.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing,.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform,inherit);line-height:1.5rem;margin:0;padding:8px 0;list-style-type:none;color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-background,rgba(0,0,0,.87));padding:var(--mdc-list-vertical-padding,8px) 0}.mdc-deprecated-list:focus{outline:0}.mdc-deprecated-list-item{height:48px}.mdc-deprecated-list--dense{padding-top:4px;padding-bottom:4px;font-size:.812rem}.mdc-deprecated-list ::slotted([divider]){height:0;margin:0;border:none;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:rgba(0,0,0,.12)}.mdc-deprecated-list ::slotted([divider][padded]){margin:0 var(--mdc-list-side-padding,16px)}.mdc-deprecated-list ::slotted([divider][inset]){margin-left:var(--mdc-list-inset-margin,72px);margin-right:0;width:calc(100% - var(--mdc-list-inset-margin,72px))}.mdc-deprecated-list ::slotted([divider][inset][dir=rtl]),[dir=rtl] .mdc-deprecated-list ::slotted([divider][inset]){margin-left:0;margin-right:var(--mdc-list-inset-margin,72px)}.mdc-deprecated-list ::slotted([divider][inset][padded]){width:calc(100% - var(--mdc-list-inset-margin,72px) - var(--mdc-list-side-padding,16px))}.mdc-deprecated-list--dense ::slotted([mwc-list-item]){height:40px}.mdc-deprecated-list--dense ::slotted([mwc-list]){--mdc-list-item-graphic-size:20px}.mdc-deprecated-list--avatar-list.mdc-deprecated-list--dense ::slotted([mwc-list-item]),.mdc-deprecated-list--two-line.mdc-deprecated-list--dense ::slotted([mwc-list-item]){height:60px}.mdc-deprecated-list--avatar-list.mdc-deprecated-list--dense ::slotted([mwc-list]){--mdc-list-item-graphic-size:36px}:host([noninteractive]){pointer-events:none;cursor:default}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text){display:block;margin-top:0;line-height:normal;margin-bottom:-20px}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text)::before{display:inline-block;width:0;height:24px;content:"";vertical-align:0}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text)::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}`
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let Jm=class extends Ym{};Jm.styles=[Qm],Jm=o([de("mwc-list")],Jm);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const ef=u`:host{font-family:var(--mdc-icon-font, "Material Icons");font-weight:400;font-style:normal;font-size:var(--mdc-icon-size,24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}`
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let tf=class extends ae{render(){return B`<span><slot></slot></span>`}};tf.styles=[ef],tf=o([de("mwc-icon")],tf);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class of extends ae{constructor(){super(...arguments),this.raised=!1,this.unelevated=!1,this.outlined=!1,this.dense=!1,this.disabled=!1,this.trailingIcon=!1,this.fullwidth=!1,this.icon="",this.label="",this.expandContent=!1,this.shouldRenderRipple=!1,this.rippleHandlers=new Vp((()=>(this.shouldRenderRipple=!0,this.ripple)))}renderOverlay(){return B``}renderRipple(){const e=this.raised||this.unelevated;return this.shouldRenderRipple?B`<mwc-ripple class="ripple" .primary="${!e}" .disabled="${this.disabled}"></mwc-ripple>`:""}focus(){const e=this.buttonElement;e&&(this.rippleHandlers.startFocus(),e.focus())}blur(){const e=this.buttonElement;e&&(this.rippleHandlers.endFocus(),e.blur())}getRenderClasses(){return{"mdc-button--raised":this.raised,"mdc-button--unelevated":this.unelevated,"mdc-button--outlined":this.outlined,"mdc-button--dense":this.dense}}render(){return B` <button id="button" class="mdc-button ${Dp(this.getRenderClasses())}" ?disabled="${this.disabled}" aria-label="${this.label||this.icon}" aria-haspopup="${jp(this.ariaHasPopup)}" @focus="${this.handleRippleFocus}" @blur="${this.handleRippleBlur}" @mousedown="${this.handleRippleActivate}" @mouseenter="${this.handleRippleMouseEnter}" @mouseleave="${this.handleRippleMouseLeave}" @touchstart="${this.handleRippleActivate}" @touchend="${this.handleRippleDeactivate}" @touchcancel="${this.handleRippleDeactivate}"> ${this.renderOverlay()} ${this.renderRipple()} <span class="leading-icon"> <slot name="icon"> ${this.icon&&!this.trailingIcon?this.renderIcon():""} </slot> </span> <span class="mdc-button__label">${this.label}</span> <span class="slot-container ${Dp({flex:this.expandContent})}"> <slot></slot> </span> <span class="trailing-icon"> <slot name="trailingIcon"> ${this.icon&&this.trailingIcon?this.renderIcon():""} </slot> </span> </button>`}renderIcon(){return B` <mwc-icon class="mdc-button__icon"> ${this.icon} </mwc-icon>`}handleRippleActivate(e){const t=()=>{window.removeEventListener("mouseup",t),this.handleRippleDeactivate()};window.addEventListener("mouseup",t),this.rippleHandlers.startPress(e)}handleRippleDeactivate(){this.rippleHandlers.endPress()}handleRippleMouseEnter(){this.rippleHandlers.startHover()}handleRippleMouseLeave(){this.rippleHandlers.endHover()}handleRippleFocus(){this.rippleHandlers.startFocus()}handleRippleBlur(){this.rippleHandlers.endFocus()}}of.shadowRootOptions={mode:"open",delegatesFocus:!0},o([Bp,he({type:String,attribute:"aria-haspopup"})],of.prototype,"ariaHasPopup",void 0),o([he({type:Boolean,reflect:!0})],of.prototype,"raised",void 0),o([he({type:Boolean,reflect:!0})],of.prototype,"unelevated",void 0),o([he({type:Boolean,reflect:!0})],of.prototype,"outlined",void 0),o([he({type:Boolean})],of.prototype,"dense",void 0),o([he({type:Boolean,reflect:!0})],of.prototype,"disabled",void 0),o([he({type:Boolean,attribute:"trailingicon"})],of.prototype,"trailingIcon",void 0),o([he({type:Boolean,reflect:!0})],of.prototype,"fullwidth",void 0),o([he({type:String})],of.prototype,"icon",void 0),o([he({type:String})],of.prototype,"label",void 0),o([he({type:Boolean})],of.prototype,"expandContent",void 0),o([fe("#button")],of.prototype,"buttonElement",void 0),o([ge("mwc-ripple")],of.prototype,"ripple",void 0),o([ue()],of.prototype,"shouldRenderRipple",void 0),o([me({passive:!0})],of.prototype,"handleRippleActivate",null);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const rf=u`.mdc-button{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-button-font-family,var(--mdc-typography-font-family,Roboto,sans-serif));font-size:.875rem;font-size:var(--mdc-typography-button-font-size,.875rem);line-height:2.25rem;line-height:var(--mdc-typography-button-line-height,2.25rem);font-weight:500;font-weight:var(--mdc-typography-button-font-weight,500);letter-spacing:.0892857143em;letter-spacing:var(--mdc-typography-button-letter-spacing,.0892857143em);text-decoration:none;text-decoration:var(--mdc-typography-button-text-decoration,none);text-transform:uppercase;text-transform:var(--mdc-typography-button-text-transform,uppercase)}.mdc-touch-target-wrapper{display:inline}.mdc-elevation-overlay{position:absolute;border-radius:inherit;pointer-events:none;opacity:0;opacity:var(--mdc-elevation-overlay-opacity,0);transition:opacity 280ms cubic-bezier(.4,0,.2,1);background-color:#fff;background-color:var(--mdc-elevation-overlay-color,#fff)}.mdc-button{position:relative;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:64px;border:none;outline:0;line-height:inherit;user-select:none;-webkit-appearance:none;overflow:visible;vertical-align:middle;background:0 0}.mdc-button .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}.mdc-button::-moz-focus-inner{padding:0;border:0}.mdc-button:active{outline:0}.mdc-button:hover{cursor:pointer}.mdc-button:disabled{cursor:default;pointer-events:none}.mdc-button .mdc-button__icon{margin-left:0;margin-right:8px;display:inline-block;position:relative;vertical-align:top}.mdc-button .mdc-button__icon[dir=rtl],[dir=rtl] .mdc-button .mdc-button__icon{margin-left:8px;margin-right:0}.mdc-button .mdc-button__label{position:relative}.mdc-button .mdc-button__focus-ring{display:none}@media screen and (forced-colors:active){.mdc-button.mdc-ripple-upgraded--background-focused .mdc-button__focus-ring,.mdc-button:not(.mdc-ripple-upgraded):focus .mdc-button__focus-ring{pointer-events:none;border:2px solid transparent;border-radius:6px;box-sizing:content-box;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);height:calc(100% + 4px);width:calc(100% + 4px);display:block}}@media screen and (forced-colors:active)and (forced-colors:active){.mdc-button.mdc-ripple-upgraded--background-focused .mdc-button__focus-ring,.mdc-button:not(.mdc-ripple-upgraded):focus .mdc-button__focus-ring{border-color:CanvasText}}@media screen and (forced-colors:active){.mdc-button.mdc-ripple-upgraded--background-focused .mdc-button__focus-ring::after,.mdc-button:not(.mdc-ripple-upgraded):focus .mdc-button__focus-ring::after{content:"";border:2px solid transparent;border-radius:8px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);height:calc(100% + 4px);width:calc(100% + 4px)}}@media screen and (forced-colors:active)and (forced-colors:active){.mdc-button.mdc-ripple-upgraded--background-focused .mdc-button__focus-ring::after,.mdc-button:not(.mdc-ripple-upgraded):focus .mdc-button__focus-ring::after{border-color:CanvasText}}.mdc-button .mdc-button__touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}.mdc-button__label+.mdc-button__icon{margin-left:8px;margin-right:0}.mdc-button__label+.mdc-button__icon[dir=rtl],[dir=rtl] .mdc-button__label+.mdc-button__icon{margin-left:0;margin-right:8px}svg.mdc-button__icon{fill:currentColor}.mdc-button--touch{margin-top:6px;margin-bottom:6px}.mdc-button{padding:0 8px 0 8px}.mdc-button--unelevated{transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);padding:0 16px 0 16px}.mdc-button--unelevated.mdc-button--icon-trailing{padding:0 12px 0 16px}.mdc-button--unelevated.mdc-button--icon-leading{padding:0 16px 0 12px}.mdc-button--raised{transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);padding:0 16px 0 16px}.mdc-button--raised.mdc-button--icon-trailing{padding:0 12px 0 16px}.mdc-button--raised.mdc-button--icon-leading{padding:0 16px 0 12px}.mdc-button--outlined{border-style:solid;transition:border 280ms cubic-bezier(.4,0,.2,1)}.mdc-button--outlined .mdc-button__ripple{border-style:solid;border-color:transparent}.mdc-button{height:36px;border-radius:4px;border-radius:var(--mdc-shape-small,4px)}.mdc-button:not(:disabled){color:#6200ee;color:var(--mdc-theme-primary,#6200ee)}.mdc-button:disabled{color:rgba(0,0,0,.38)}.mdc-button .mdc-button__icon{font-size:1.125rem;width:1.125rem;height:1.125rem}.mdc-button .mdc-button__ripple{border-radius:4px;border-radius:var(--mdc-shape-small,4px)}.mdc-button--raised,.mdc-button--unelevated{height:36px;border-radius:4px;border-radius:var(--mdc-shape-small,4px)}.mdc-button--raised:not(:disabled),.mdc-button--unelevated:not(:disabled){background-color:#6200ee;background-color:var(--mdc-theme-primary,#6200ee)}.mdc-button--raised:disabled,.mdc-button--unelevated:disabled{background-color:rgba(0,0,0,.12)}.mdc-button--raised:not(:disabled),.mdc-button--unelevated:not(:disabled){color:#fff;color:var(--mdc-theme-on-primary,#fff)}.mdc-button--raised:disabled,.mdc-button--unelevated:disabled{color:rgba(0,0,0,.38)}.mdc-button--raised .mdc-button__icon,.mdc-button--unelevated .mdc-button__icon{font-size:1.125rem;width:1.125rem;height:1.125rem}.mdc-button--raised .mdc-button__ripple,.mdc-button--unelevated .mdc-button__ripple{border-radius:4px;border-radius:var(--mdc-shape-small,4px)}.mdc-button--outlined{height:36px;border-radius:4px;border-radius:var(--mdc-shape-small,4px);padding:0 15px 0 15px;border-width:1px}.mdc-button--outlined:not(:disabled){color:#6200ee;color:var(--mdc-theme-primary,#6200ee)}.mdc-button--outlined:disabled{color:rgba(0,0,0,.38)}.mdc-button--outlined .mdc-button__icon{font-size:1.125rem;width:1.125rem;height:1.125rem}.mdc-button--outlined .mdc-button__ripple{border-radius:4px;border-radius:var(--mdc-shape-small,4px)}.mdc-button--outlined:not(:disabled){border-color:rgba(0,0,0,.12)}.mdc-button--outlined:disabled{border-color:rgba(0,0,0,.12)}.mdc-button--outlined.mdc-button--icon-trailing{padding:0 11px 0 15px}.mdc-button--outlined.mdc-button--icon-leading{padding:0 15px 0 11px}.mdc-button--outlined .mdc-button__ripple{top:-1px;left:-1px;bottom:-1px;right:-1px;border-width:1px}.mdc-button--outlined .mdc-button__touch{left:calc(-1 * 1px);width:calc(100% + 2 * 1px)}.mdc-button--raised{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);transition:box-shadow 280ms cubic-bezier(.4,0,.2,1)}.mdc-button--raised:focus,.mdc-button--raised:hover{box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)}.mdc-button--raised:active{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.mdc-button--raised:disabled{box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12)}:host{display:inline-flex;outline:0;-webkit-tap-highlight-color:transparent;vertical-align:top}:host([fullwidth]){width:100%}:host([raised]),:host([unelevated]){--mdc-ripple-color:#fff;--mdc-ripple-focus-opacity:0.24;--mdc-ripple-hover-opacity:0.08;--mdc-ripple-press-opacity:0.24}.leading-icon .mdc-button__icon,.leading-icon ::slotted(*),.trailing-icon .mdc-button__icon,.trailing-icon ::slotted(*){margin-left:0;margin-right:8px;display:inline-block;position:relative;vertical-align:top;font-size:1.125rem;height:1.125rem;width:1.125rem}.leading-icon .mdc-button__icon[dir=rtl],.leading-icon ::slotted([dir=rtl]),.trailing-icon .mdc-button__icon[dir=rtl],.trailing-icon ::slotted([dir=rtl]),[dir=rtl] .leading-icon .mdc-button__icon,[dir=rtl] .leading-icon ::slotted(*),[dir=rtl] .trailing-icon .mdc-button__icon,[dir=rtl] .trailing-icon ::slotted(*){margin-left:8px;margin-right:0}.trailing-icon .mdc-button__icon,.trailing-icon ::slotted(*){margin-left:8px;margin-right:0}.trailing-icon .mdc-button__icon[dir=rtl],.trailing-icon ::slotted([dir=rtl]),[dir=rtl] .trailing-icon .mdc-button__icon,[dir=rtl] .trailing-icon ::slotted(*){margin-left:0;margin-right:8px}.slot-container{display:inline-flex;align-items:center;justify-content:center}.slot-container.flex{flex:auto}.mdc-button{flex:auto;overflow:hidden;padding-left:8px;padding-left:var(--mdc-button-horizontal-padding,8px);padding-right:8px;padding-right:var(--mdc-button-horizontal-padding,8px)}.mdc-button--raised{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);box-shadow:var(--mdc-button-raised-box-shadow,0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12))}.mdc-button--raised:focus{box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);box-shadow:var(--mdc-button-raised-box-shadow-focus,var(--mdc-button-raised-box-shadow-hover,0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)))}.mdc-button--raised:hover{box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);box-shadow:var(--mdc-button-raised-box-shadow-hover,0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12))}.mdc-button--raised:active{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);box-shadow:var(--mdc-button-raised-box-shadow-active,0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12))}.mdc-button--raised:disabled{box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);box-shadow:var(--mdc-button-raised-box-shadow-disabled,0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12))}.mdc-button--raised,.mdc-button--unelevated{padding-left:16px;padding-left:var(--mdc-button-horizontal-padding,16px);padding-right:16px;padding-right:var(--mdc-button-horizontal-padding,16px)}.mdc-button--outlined{border-width:1px;border-width:var(--mdc-button-outline-width,1px);padding-left:calc(16px - 1px);padding-left:calc(var(--mdc-button-horizontal-padding,16px) - var(--mdc-button-outline-width,1px));padding-right:calc(16px - 1px);padding-right:calc(var(--mdc-button-horizontal-padding,16px) - var(--mdc-button-outline-width,1px))}.mdc-button--outlined:not(:disabled){border-color:rgba(0,0,0,.12);border-color:var(--mdc-button-outline-color,rgba(0,0,0,.12))}.mdc-button--outlined .ripple{top:calc(-1 * 1px);top:calc(-1 * var(--mdc-button-outline-width,1px));left:calc(-1 * 1px);left:calc(-1 * var(--mdc-button-outline-width,1px));right:initial;right:initial;border-width:1px;border-width:var(--mdc-button-outline-width,1px);border-style:solid;border-color:transparent}.mdc-button--outlined .ripple[dir=rtl],[dir=rtl] .mdc-button--outlined .ripple{left:initial;left:initial;right:calc(-1 * 1px);right:calc(-1 * var(--mdc-button-outline-width,1px))}.mdc-button--dense{height:28px;margin-top:0;margin-bottom:0}.mdc-button--dense .mdc-button__touch{height:100%}:host([disabled]){pointer-events:none}:host([disabled]) .mdc-button{color:rgba(0,0,0,.38);color:var(--mdc-button-disabled-ink-color,rgba(0,0,0,.38))}:host([disabled]) .mdc-button--raised,:host([disabled]) .mdc-button--unelevated{background-color:rgba(0,0,0,.12);background-color:var(--mdc-button-disabled-fill-color,rgba(0,0,0,.12))}:host([disabled]) .mdc-button--outlined{border-color:rgba(0,0,0,.12);border-color:var(--mdc-button-disabled-outline-color,rgba(0,0,0,.12))}`
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let nf=class extends of{};nf.styles=[rf],nf=o([de("mwc-button")],nf);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var sf={NOTCH_ELEMENT_SELECTOR:".mdc-notched-outline__notch"},af={NOTCH_ELEMENT_PADDING:8},lf={NO_LABEL:"mdc-notched-outline--no-label",OUTLINE_NOTCHED:"mdc-notched-outline--notched",OUTLINE_UPGRADED:"mdc-notched-outline--upgraded"},df=function(e){function o(t){return e.call(this,i(i({},o.defaultAdapter),t))||this}return t(o,e),Object.defineProperty(o,"strings",{get:function(){return sf},enumerable:!1,configurable:!0}),Object.defineProperty(o,"cssClasses",{get:function(){return lf},enumerable:!1,configurable:!0}),Object.defineProperty(o,"numbers",{get:function(){return af},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},setNotchWidthProperty:function(){},removeNotchWidthProperty:function(){}}},enumerable:!1,configurable:!0}),o.prototype.notch=function(e){var t=o.cssClasses.OUTLINE_NOTCHED;e>0&&(e+=af.NOTCH_ELEMENT_PADDING),this.adapter.setNotchWidthProperty(e),this.adapter.addClass(t)},o.prototype.closeNotch=function(){var e=o.cssClasses.OUTLINE_NOTCHED;this.adapter.removeClass(e),this.adapter.removeNotchWidthProperty()},o}(Tp);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class cf extends Sp{constructor(){super(...arguments),this.mdcFoundationClass=df,this.width=0,this.open=!1,this.lastOpen=this.open}createAdapter(){return{addClass:e=>this.mdcRoot.classList.add(e),removeClass:e=>this.mdcRoot.classList.remove(e),setNotchWidthProperty:e=>this.notchElement.style.setProperty("width",`${e}px`),removeNotchWidthProperty:()=>this.notchElement.style.removeProperty("width")}}openOrClose(e,t){this.mdcFoundation&&(e&&void 0!==t?this.mdcFoundation.notch(t):this.mdcFoundation.closeNotch())}render(){this.openOrClose(this.open,this.width);const e=Dp({"mdc-notched-outline--notched":this.open});return B` <span class="mdc-notched-outline ${e}"> <span class="mdc-notched-outline__leading"></span> <span class="mdc-notched-outline__notch"> <slot></slot> </span> <span class="mdc-notched-outline__trailing"></span> </span>`}}o([fe(".mdc-notched-outline")],cf.prototype,"mdcRoot",void 0),o([he({type:Number})],cf.prototype,"width",void 0),o([he({type:Boolean,reflect:!0})],cf.prototype,"open",void 0),o([fe(".mdc-notched-outline__notch")],cf.prototype,"notchElement",void 0);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const hf=u`.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}.mdc-notched-outline[dir=rtl],[dir=rtl] .mdc-notched-outline{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}.mdc-notched-outline__leading[dir=rtl],[dir=rtl] .mdc-notched-outline__leading{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}.mdc-notched-outline__trailing[dir=rtl],[dir=rtl] .mdc-notched-outline__trailing{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / .75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl],[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}:host{display:block;position:absolute;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}:host([dir=rtl]),[dir=rtl] :host{text-align:right}::slotted(.mdc-floating-label){display:inline-block;position:relative;top:17px;bottom:auto;max-width:100%}::slotted(.mdc-floating-label--float-above){text-overflow:clip}.mdc-notched-outline--upgraded ::slotted(.mdc-floating-label--float-above){max-width:calc(100% / .75)}.mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small,4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small,4px)}.mdc-notched-outline .mdc-notched-outline__leading[dir=rtl],[dir=rtl] .mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small,4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small,4px);border-bottom-left-radius:0}@supports(top:max(0%)){.mdc-notched-outline .mdc-notched-outline__leading{width:max(12px,var(--mdc-shape-small,4px))}}@supports(top:max(0%)){.mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px,var(--mdc-shape-small,4px)) * 2)}}.mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small,4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small,4px);border-bottom-left-radius:0}.mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl],[dir=rtl] .mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small,4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small,4px)}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{border-color:var(--mdc-notched-outline-border-color,var(--mdc-theme-primary,#6200ee));border-width:1px;border-width:var(--mdc-notched-outline-stroke-width,1px)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0;padding-top:var(--mdc-notched-outline-notch-offset,0)}`
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let uf=class extends cf{};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
var pf,mf;uf.styles=[hf],uf=o([de("mwc-notched-outline")],uf);const ff=null!==(mf=null===(pf=window.ShadyDOM)||void 0===pf?void 0:pf.inUse)&&void 0!==mf&&mf;class gf extends Sp{constructor(){super(...arguments),this.disabled=!1,this.containingForm=null,this.formDataListener=e=>{this.disabled||this.setFormData(e.formData)}}findFormElement(){if(!this.shadowRoot||ff)return null;const e=this.getRootNode().querySelectorAll("form");for(const t of Array.from(e))if(t.contains(this))return t;return null}connectedCallback(){var e;super.connectedCallback(),this.containingForm=this.findFormElement(),null===(e=this.containingForm)||void 0===e||e.addEventListener("formdata",this.formDataListener)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this.containingForm)||void 0===e||e.removeEventListener("formdata",this.formDataListener),this.containingForm=null}click(){this.formElement&&!this.disabled&&(this.formElement.focus(),this.formElement.click())}firstUpdated(){super.firstUpdated(),this.shadowRoot&&this.mdcRoot.addEventListener("change",(e=>{this.dispatchEvent(new Event("change",e))}))}}gf.shadowRootOptions={mode:"open",delegatesFocus:!0},o([he({type:Boolean})],gf.prototype,"disabled",void 0);
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var vf={LABEL_FLOAT_ABOVE:"mdc-floating-label--float-above",LABEL_REQUIRED:"mdc-floating-label--required",LABEL_SHAKE:"mdc-floating-label--shake",ROOT:"mdc-floating-label"},bf=function(e){function o(t){var r=e.call(this,i(i({},o.defaultAdapter),t))||this;return r.shakeAnimationEndHandler=function(){r.handleShakeAnimationEnd()},r}return t(o,e),Object.defineProperty(o,"cssClasses",{get:function(){return vf},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},getWidth:function(){return 0},registerInteractionHandler:function(){},deregisterInteractionHandler:function(){}}},enumerable:!1,configurable:!0}),o.prototype.init=function(){this.adapter.registerInteractionHandler("animationend",this.shakeAnimationEndHandler)},o.prototype.destroy=function(){this.adapter.deregisterInteractionHandler("animationend",this.shakeAnimationEndHandler)},o.prototype.getWidth=function(){return this.adapter.getWidth()},o.prototype.shake=function(e){var t=o.cssClasses.LABEL_SHAKE;e?this.adapter.addClass(t):this.adapter.removeClass(t)},o.prototype.float=function(e){var t=o.cssClasses,i=t.LABEL_FLOAT_ABOVE,r=t.LABEL_SHAKE;e?this.adapter.addClass(i):(this.adapter.removeClass(i),this.adapter.removeClass(r))},o.prototype.setRequired=function(e){var t=o.cssClasses.LABEL_REQUIRED;e?this.adapter.addClass(t):this.adapter.removeClass(t)},o.prototype.handleShakeAnimationEnd=function(){var e=o.cssClasses.LABEL_SHAKE;this.adapter.removeClass(e)},o}(Tp);
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */const yf=$e(class extends _e{constructor(e){switch(super(e),this.foundation=null,this.previousPart=null,e.type){case xe:case ke:break;default:throw new Error("FloatingLabel directive only support attribute and property parts")}}update(e,[t]){if(e!==this.previousPart){this.foundation&&this.foundation.destroy(),this.previousPart=e;const t=e.element;t.classList.add("mdc-floating-label");const i=(e=>({addClass:t=>e.classList.add(t),removeClass:t=>e.classList.remove(t),getWidth:()=>e.scrollWidth,registerInteractionHandler:(t,i)=>{e.addEventListener(t,i)},deregisterInteractionHandler:(t,i)=>{e.removeEventListener(t,i)}}))(t);this.foundation=new bf(i),this.foundation.init()}return this.render(t)}render(e){return this.foundation}});
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */var xf={LINE_RIPPLE_ACTIVE:"mdc-line-ripple--active",LINE_RIPPLE_DEACTIVATING:"mdc-line-ripple--deactivating"},wf=function(e){function o(t){var r=e.call(this,i(i({},o.defaultAdapter),t))||this;return r.transitionEndHandler=function(e){r.handleTransitionEnd(e)},r}return t(o,e),Object.defineProperty(o,"cssClasses",{get:function(){return xf},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},hasClass:function(){return!1},setStyle:function(){},registerEventHandler:function(){},deregisterEventHandler:function(){}}},enumerable:!1,configurable:!0}),o.prototype.init=function(){this.adapter.registerEventHandler("transitionend",this.transitionEndHandler)},o.prototype.destroy=function(){this.adapter.deregisterEventHandler("transitionend",this.transitionEndHandler)},o.prototype.activate=function(){this.adapter.removeClass(xf.LINE_RIPPLE_DEACTIVATING),this.adapter.addClass(xf.LINE_RIPPLE_ACTIVE)},o.prototype.setRippleCenter=function(e){this.adapter.setStyle("transform-origin",e+"px center")},o.prototype.deactivate=function(){this.adapter.addClass(xf.LINE_RIPPLE_DEACTIVATING)},o.prototype.handleTransitionEnd=function(e){var t=this.adapter.hasClass(xf.LINE_RIPPLE_DEACTIVATING);"opacity"===e.propertyName&&t&&(this.adapter.removeClass(xf.LINE_RIPPLE_ACTIVE),this.adapter.removeClass(xf.LINE_RIPPLE_DEACTIVATING))},o}(Tp);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */const kf=$e(class extends _e{constructor(e){switch(super(e),this.previousPart=null,this.foundation=null,e.type){case xe:case ke:return;default:throw new Error("LineRipple only support attribute and property parts.")}}update(e,t){if(this.previousPart!==e){this.foundation&&this.foundation.destroy(),this.previousPart=e;const t=e.element;t.classList.add("mdc-line-ripple");const i=(e=>({addClass:t=>e.classList.add(t),removeClass:t=>e.classList.remove(t),hasClass:t=>e.classList.contains(t),setStyle:(t,i)=>e.style.setProperty(t,i),registerEventHandler:(t,i)=>{e.addEventListener(t,i)},deregisterEventHandler:(t,i)=>{e.removeEventListener(t,i)}}))(t);this.foundation=new wf(i),this.foundation.init()}return this.render()}render(){return this.foundation}});
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */var Cf={ARIA_CONTROLS:"aria-controls",ARIA_DESCRIBEDBY:"aria-describedby",INPUT_SELECTOR:".mdc-text-field__input",LABEL_SELECTOR:".mdc-floating-label",LEADING_ICON_SELECTOR:".mdc-text-field__icon--leading",LINE_RIPPLE_SELECTOR:".mdc-line-ripple",OUTLINE_SELECTOR:".mdc-notched-outline",PREFIX_SELECTOR:".mdc-text-field__affix--prefix",SUFFIX_SELECTOR:".mdc-text-field__affix--suffix",TRAILING_ICON_SELECTOR:".mdc-text-field__icon--trailing"},$f={DISABLED:"mdc-text-field--disabled",FOCUSED:"mdc-text-field--focused",HELPER_LINE:"mdc-text-field-helper-line",INVALID:"mdc-text-field--invalid",LABEL_FLOATING:"mdc-text-field--label-floating",NO_LABEL:"mdc-text-field--no-label",OUTLINED:"mdc-text-field--outlined",ROOT:"mdc-text-field",TEXTAREA:"mdc-text-field--textarea",WITH_LEADING_ICON:"mdc-text-field--with-leading-icon",WITH_TRAILING_ICON:"mdc-text-field--with-trailing-icon",WITH_INTERNAL_COUNTER:"mdc-text-field--with-internal-counter"},_f={LABEL_SCALE:.75},Sf=["pattern","min","max","required","step","minlength","maxlength"],Tf=["color","date","datetime-local","month","range","time","week"],Ef=["mousedown","touchstart"],Af=["click","keydown"],If=function(e){function o(t,r){void 0===r&&(r={});var n=e.call(this,i(i({},o.defaultAdapter),t))||this;return n.isFocused=!1,n.receivedUserInput=!1,n.valid=!0,n.useNativeValidation=!0,n.validateOnValueChange=!0,n.helperText=r.helperText,n.characterCounter=r.characterCounter,n.leadingIcon=r.leadingIcon,n.trailingIcon=r.trailingIcon,n.inputFocusHandler=function(){n.activateFocus()},n.inputBlurHandler=function(){n.deactivateFocus()},n.inputInputHandler=function(){n.handleInput()},n.setPointerXOffset=function(e){n.setTransformOrigin(e)},n.textFieldInteractionHandler=function(){n.handleTextFieldInteraction()},n.validationAttributeChangeHandler=function(e){n.handleValidationAttributeChange(e)},n}return t(o,e),Object.defineProperty(o,"cssClasses",{get:function(){return $f},enumerable:!1,configurable:!0}),Object.defineProperty(o,"strings",{get:function(){return Cf},enumerable:!1,configurable:!0}),Object.defineProperty(o,"numbers",{get:function(){return _f},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"shouldAlwaysFloat",{get:function(){var e=this.getNativeInput().type;return Tf.indexOf(e)>=0},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"shouldFloat",{get:function(){return this.shouldAlwaysFloat||this.isFocused||!!this.getValue()||this.isBadInput()},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"shouldShake",{get:function(){return!this.isFocused&&!this.isValid()&&!!this.getValue()},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},hasClass:function(){return!0},setInputAttr:function(){},removeInputAttr:function(){},registerTextFieldInteractionHandler:function(){},deregisterTextFieldInteractionHandler:function(){},registerInputInteractionHandler:function(){},deregisterInputInteractionHandler:function(){},registerValidationAttributeChangeHandler:function(){return new MutationObserver((function(){}))},deregisterValidationAttributeChangeHandler:function(){},getNativeInput:function(){return null},isFocused:function(){return!1},activateLineRipple:function(){},deactivateLineRipple:function(){},setLineRippleTransformOrigin:function(){},shakeLabel:function(){},floatLabel:function(){},setLabelRequired:function(){},hasLabel:function(){return!1},getLabelWidth:function(){return 0},hasOutline:function(){return!1},notchOutline:function(){},closeOutline:function(){}}},enumerable:!1,configurable:!0}),o.prototype.init=function(){var e,t,i,o;this.adapter.hasLabel()&&this.getNativeInput().required&&this.adapter.setLabelRequired(!0),this.adapter.isFocused()?this.inputFocusHandler():this.adapter.hasLabel()&&this.shouldFloat&&(this.notchOutline(!0),this.adapter.floatLabel(!0),this.styleFloating(!0)),this.adapter.registerInputInteractionHandler("focus",this.inputFocusHandler),this.adapter.registerInputInteractionHandler("blur",this.inputBlurHandler),this.adapter.registerInputInteractionHandler("input",this.inputInputHandler);try{for(var n=r(Ef),s=n.next();!s.done;s=n.next()){var a=s.value;this.adapter.registerInputInteractionHandler(a,this.setPointerXOffset)}}catch(t){e={error:t}}finally{try{s&&!s.done&&(t=n.return)&&t.call(n)}finally{if(e)throw e.error}}try{for(var l=r(Af),d=l.next();!d.done;d=l.next()){a=d.value;this.adapter.registerTextFieldInteractionHandler(a,this.textFieldInteractionHandler)}}catch(e){i={error:e}}finally{try{d&&!d.done&&(o=l.return)&&o.call(l)}finally{if(i)throw i.error}}this.validationObserver=this.adapter.registerValidationAttributeChangeHandler(this.validationAttributeChangeHandler),this.setcharacterCounter(this.getValue().length)},o.prototype.destroy=function(){var e,t,i,o;this.adapter.deregisterInputInteractionHandler("focus",this.inputFocusHandler),this.adapter.deregisterInputInteractionHandler("blur",this.inputBlurHandler),this.adapter.deregisterInputInteractionHandler("input",this.inputInputHandler);try{for(var n=r(Ef),s=n.next();!s.done;s=n.next()){var a=s.value;this.adapter.deregisterInputInteractionHandler(a,this.setPointerXOffset)}}catch(t){e={error:t}}finally{try{s&&!s.done&&(t=n.return)&&t.call(n)}finally{if(e)throw e.error}}try{for(var l=r(Af),d=l.next();!d.done;d=l.next()){a=d.value;this.adapter.deregisterTextFieldInteractionHandler(a,this.textFieldInteractionHandler)}}catch(e){i={error:e}}finally{try{d&&!d.done&&(o=l.return)&&o.call(l)}finally{if(i)throw i.error}}this.adapter.deregisterValidationAttributeChangeHandler(this.validationObserver)},o.prototype.handleTextFieldInteraction=function(){var e=this.adapter.getNativeInput();e&&e.disabled||(this.receivedUserInput=!0)},o.prototype.handleValidationAttributeChange=function(e){var t=this;e.some((function(e){return Sf.indexOf(e)>-1&&(t.styleValidity(!0),t.adapter.setLabelRequired(t.getNativeInput().required),!0)})),e.indexOf("maxlength")>-1&&this.setcharacterCounter(this.getValue().length)},o.prototype.notchOutline=function(e){if(this.adapter.hasOutline()&&this.adapter.hasLabel())if(e){var t=this.adapter.getLabelWidth()*_f.LABEL_SCALE;this.adapter.notchOutline(t)}else this.adapter.closeOutline()},o.prototype.activateFocus=function(){this.isFocused=!0,this.styleFocused(this.isFocused),this.adapter.activateLineRipple(),this.adapter.hasLabel()&&(this.notchOutline(this.shouldFloat),this.adapter.floatLabel(this.shouldFloat),this.styleFloating(this.shouldFloat),this.adapter.shakeLabel(this.shouldShake)),!this.helperText||!this.helperText.isPersistent()&&this.helperText.isValidation()&&this.valid||this.helperText.showToScreenReader()},o.prototype.setTransformOrigin=function(e){if(!this.isDisabled()&&!this.adapter.hasOutline()){var t=e.touches,i=t?t[0]:e,o=i.target.getBoundingClientRect(),r=i.clientX-o.left;this.adapter.setLineRippleTransformOrigin(r)}},o.prototype.handleInput=function(){this.autoCompleteFocus(),this.setcharacterCounter(this.getValue().length)},o.prototype.autoCompleteFocus=function(){this.receivedUserInput||this.activateFocus()},o.prototype.deactivateFocus=function(){this.isFocused=!1,this.adapter.deactivateLineRipple();var e=this.isValid();this.styleValidity(e),this.styleFocused(this.isFocused),this.adapter.hasLabel()&&(this.notchOutline(this.shouldFloat),this.adapter.floatLabel(this.shouldFloat),this.styleFloating(this.shouldFloat),this.adapter.shakeLabel(this.shouldShake)),this.shouldFloat||(this.receivedUserInput=!1)},o.prototype.getValue=function(){return this.getNativeInput().value},o.prototype.setValue=function(e){if(this.getValue()!==e&&(this.getNativeInput().value=e),this.setcharacterCounter(e.length),this.validateOnValueChange){var t=this.isValid();this.styleValidity(t)}this.adapter.hasLabel()&&(this.notchOutline(this.shouldFloat),this.adapter.floatLabel(this.shouldFloat),this.styleFloating(this.shouldFloat),this.validateOnValueChange&&this.adapter.shakeLabel(this.shouldShake))},o.prototype.isValid=function(){return this.useNativeValidation?this.isNativeInputValid():this.valid},o.prototype.setValid=function(e){this.valid=e,this.styleValidity(e);var t=!e&&!this.isFocused&&!!this.getValue();this.adapter.hasLabel()&&this.adapter.shakeLabel(t)},o.prototype.setValidateOnValueChange=function(e){this.validateOnValueChange=e},o.prototype.getValidateOnValueChange=function(){return this.validateOnValueChange},o.prototype.setUseNativeValidation=function(e){this.useNativeValidation=e},o.prototype.isDisabled=function(){return this.getNativeInput().disabled},o.prototype.setDisabled=function(e){this.getNativeInput().disabled=e,this.styleDisabled(e)},o.prototype.setHelperTextContent=function(e){this.helperText&&this.helperText.setContent(e)},o.prototype.setLeadingIconAriaLabel=function(e){this.leadingIcon&&this.leadingIcon.setAriaLabel(e)},o.prototype.setLeadingIconContent=function(e){this.leadingIcon&&this.leadingIcon.setContent(e)},o.prototype.setTrailingIconAriaLabel=function(e){this.trailingIcon&&this.trailingIcon.setAriaLabel(e)},o.prototype.setTrailingIconContent=function(e){this.trailingIcon&&this.trailingIcon.setContent(e)},o.prototype.setcharacterCounter=function(e){if(this.characterCounter){var t=this.getNativeInput().maxLength;if(-1===t)throw new Error("MDCTextFieldFoundation: Expected maxlength html property on text input or textarea.");this.characterCounter.setCounterValue(e,t)}},o.prototype.isBadInput=function(){return this.getNativeInput().validity.badInput||!1},o.prototype.isNativeInputValid=function(){return this.getNativeInput().validity.valid},o.prototype.styleValidity=function(e){var t=o.cssClasses.INVALID;if(e?this.adapter.removeClass(t):this.adapter.addClass(t),this.helperText){if(this.helperText.setValidity(e),!this.helperText.isValidation())return;var i=this.helperText.isVisible(),r=this.helperText.getId();i&&r?this.adapter.setInputAttr(Cf.ARIA_DESCRIBEDBY,r):this.adapter.removeInputAttr(Cf.ARIA_DESCRIBEDBY)}},o.prototype.styleFocused=function(e){var t=o.cssClasses.FOCUSED;e?this.adapter.addClass(t):this.adapter.removeClass(t)},o.prototype.styleDisabled=function(e){var t=o.cssClasses,i=t.DISABLED,r=t.INVALID;e?(this.adapter.addClass(i),this.adapter.removeClass(r)):this.adapter.removeClass(i),this.leadingIcon&&this.leadingIcon.setDisabled(e),this.trailingIcon&&this.trailingIcon.setDisabled(e)},o.prototype.styleFloating=function(e){var t=o.cssClasses.LABEL_FLOATING;e?this.adapter.addClass(t):this.adapter.removeClass(t)},o.prototype.getNativeInput=function(){return(this.adapter?this.adapter.getNativeInput():null)||{disabled:!1,maxLength:-1,required:!1,type:"input",validity:{badInput:!1,valid:!0},value:""}},o}(Tp),Of=If;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Lf={},Ff=$e(class extends _e{constructor(e){if(super(e),e.type!==ke&&e.type!==xe&&e.type!==Ce)throw Error("The `live` directive is not allowed on child or event bindings");if(!(e=>void 0===e.strings)(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===V||t===j)return t;const i=e.element,o=e.name;if(e.type===ke){if(t===i[o])return V}else if(e.type===Ce){if(!!t===i.hasAttribute(o))return V}else if(e.type===xe&&i.getAttribute(o)===t+"")return V;return((e,t=Lf)=>{e._$AH=t;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */})(e),t}}),Mf=["touchstart","touchmove","scroll","mousewheel"],Rf=(e={})=>{const t={};for(const i in e)t[i]=e[i];return Object.assign({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1},t)};class Df extends gf{constructor(){super(...arguments),this.mdcFoundationClass=Of,this.value="",this.type="text",this.placeholder="",this.label="",this.icon="",this.iconTrailing="",this.disabled=!1,this.required=!1,this.minLength=-1,this.maxLength=-1,this.outlined=!1,this.helper="",this.validateOnInitialRender=!1,this.validationMessage="",this.autoValidate=!1,this.pattern="",this.min="",this.max="",this.step=null,this.size=null,this.helperPersistent=!1,this.charCounter=!1,this.endAligned=!1,this.prefix="",this.suffix="",this.name="",this.readOnly=!1,this.autocapitalize="",this.outlineOpen=!1,this.outlineWidth=0,this.isUiValid=!0,this.focused=!1,this._validity=Rf(),this.validityTransform=null}get validity(){return this._checkValidity(this.value),this._validity}get willValidate(){return this.formElement.willValidate}get selectionStart(){return this.formElement.selectionStart}get selectionEnd(){return this.formElement.selectionEnd}focus(){const e=new CustomEvent("focus");this.formElement.dispatchEvent(e),this.formElement.focus()}blur(){const e=new CustomEvent("blur");this.formElement.dispatchEvent(e),this.formElement.blur()}select(){this.formElement.select()}setSelectionRange(e,t,i){this.formElement.setSelectionRange(e,t,i)}update(e){e.has("autoValidate")&&this.mdcFoundation&&this.mdcFoundation.setValidateOnValueChange(this.autoValidate),e.has("value")&&"string"!=typeof this.value&&(this.value=`${this.value}`),super.update(e)}setFormData(e){this.name&&e.append(this.name,this.value)}render(){const e=this.charCounter&&-1!==this.maxLength,t=!!this.helper||!!this.validationMessage||e,i={"mdc-text-field--disabled":this.disabled,"mdc-text-field--no-label":!this.label,"mdc-text-field--filled":!this.outlined,"mdc-text-field--outlined":this.outlined,"mdc-text-field--with-leading-icon":this.icon,"mdc-text-field--with-trailing-icon":this.iconTrailing,"mdc-text-field--end-aligned":this.endAligned};return B` <label class="mdc-text-field ${Dp(i)}"> ${this.renderRipple()} ${this.outlined?this.renderOutline():this.renderLabel()} ${this.renderLeadingIcon()} ${this.renderPrefix()} ${this.renderInput(t)} ${this.renderSuffix()} ${this.renderTrailingIcon()} ${this.renderLineRipple()} </label> ${this.renderHelperText(t,e)} `}updated(e){e.has("value")&&void 0!==e.get("value")&&(this.mdcFoundation.setValue(this.value),this.autoValidate&&this.reportValidity())}renderRipple(){return this.outlined?"":B` <span class="mdc-text-field__ripple"></span> `}renderOutline(){return this.outlined?B` <mwc-notched-outline .width="${this.outlineWidth}" .open="${this.outlineOpen}" class="mdc-notched-outline"> ${this.renderLabel()} </mwc-notched-outline>`:""}renderLabel(){return this.label?B` <span .floatingLabelFoundation="${yf(this.label)}" id="label">${this.label}</span> `:""}renderLeadingIcon(){return this.icon?this.renderIcon(this.icon):""}renderTrailingIcon(){return this.iconTrailing?this.renderIcon(this.iconTrailing,!0):""}renderIcon(e,t=!1){return B`<i class="material-icons mdc-text-field__icon ${Dp({"mdc-text-field__icon--leading":!t,"mdc-text-field__icon--trailing":t})}">${e}</i>`}renderPrefix(){return this.prefix?this.renderAffix(this.prefix):""}renderSuffix(){return this.suffix?this.renderAffix(this.suffix,!0):""}renderAffix(e,t=!1){return B`<span class="mdc-text-field__affix ${Dp({"mdc-text-field__affix--prefix":!t,"mdc-text-field__affix--suffix":t})}"> ${e}</span>`}renderInput(e){const t=-1===this.minLength?void 0:this.minLength,i=-1===this.maxLength?void 0:this.maxLength,o=this.autocapitalize?this.autocapitalize:void 0,r=this.validationMessage&&!this.isUiValid,n=this.label?"label":void 0,s=e?"helper-text":void 0,a=this.focused||this.helperPersistent||r?"helper-text":void 0;return B` <input aria-labelledby="${jp(n)}" aria-controls="${jp(s)}" aria-describedby="${jp(a)}" class="mdc-text-field__input" type="${this.type}" .value="${Ff(this.value)}" ?disabled="${this.disabled}" placeholder="${this.placeholder}" ?required="${this.required}" ?readonly="${this.readOnly}" minlength="${jp(t)}" maxlength="${jp(i)}" pattern="${jp(this.pattern?this.pattern:void 0)}" min="${jp(""===this.min?void 0:this.min)}" max="${jp(""===this.max?void 0:this.max)}" step="${jp(null===this.step?void 0:this.step)}" size="${jp(null===this.size?void 0:this.size)}" name="${jp(""===this.name?void 0:this.name)}" inputmode="${jp(this.inputMode)}" autocapitalize="${jp(o)}" @input="${this.handleInputChange}" @focus="${this.onInputFocus}" @blur="${this.onInputBlur}">`}renderLineRipple(){return this.outlined?"":B` <span .lineRippleFoundation="${kf()}"></span> `}renderHelperText(e,t){const i=this.validationMessage&&!this.isUiValid,o={"mdc-text-field-helper-text--persistent":this.helperPersistent,"mdc-text-field-helper-text--validation-msg":i},r=this.focused||this.helperPersistent||i?void 0:"true",n=i?this.validationMessage:this.helper;return e?B` <div class="mdc-text-field-helper-line"> <div id="helper-text" aria-hidden="${jp(r)}" class="mdc-text-field-helper-text ${Dp(o)}">${n}</div> ${this.renderCharCounter(t)} </div>`:""}renderCharCounter(e){const t=Math.min(this.value.length,this.maxLength);return e?B` <span class="mdc-text-field-character-counter">${t} / ${this.maxLength}</span>`:""}onInputFocus(){this.focused=!0}onInputBlur(){this.focused=!1,this.reportValidity()}checkValidity(){const e=this._checkValidity(this.value);if(!e){const e=new Event("invalid",{bubbles:!1,cancelable:!0});this.dispatchEvent(e)}return e}reportValidity(){const e=this.checkValidity();return this.mdcFoundation.setValid(e),this.isUiValid=e,e}_checkValidity(e){const t=this.formElement.validity;let i=Rf(t);if(this.validityTransform){const t=this.validityTransform(e,i);i=Object.assign(Object.assign({},i),t),this.mdcFoundation.setUseNativeValidation(!1)}else this.mdcFoundation.setUseNativeValidation(!0);return this._validity=i,this._validity.valid}setCustomValidity(e){this.validationMessage=e,this.formElement.setCustomValidity(e)}handleInputChange(){this.value=this.formElement.value}createAdapter(){return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},this.getRootAdapterMethods()),this.getInputAdapterMethods()),this.getLabelAdapterMethods()),this.getLineRippleAdapterMethods()),this.getOutlineAdapterMethods())}getRootAdapterMethods(){return Object.assign({registerTextFieldInteractionHandler:(e,t)=>this.addEventListener(e,t),deregisterTextFieldInteractionHandler:(e,t)=>this.removeEventListener(e,t),registerValidationAttributeChangeHandler:e=>{const t=new MutationObserver((t=>{e((e=>e.map((e=>e.attributeName)).filter((e=>e)))(t))}));return t.observe(this.formElement,{attributes:!0}),t},deregisterValidationAttributeChangeHandler:e=>e.disconnect()},wp(this.mdcRoot))}getInputAdapterMethods(){return{getNativeInput:()=>this.formElement,setInputAttr:()=>{},removeInputAttr:()=>{},isFocused:()=>!!this.shadowRoot&&this.shadowRoot.activeElement===this.formElement,registerInputInteractionHandler:(e,t)=>this.formElement.addEventListener(e,t,{passive:e in Mf}),deregisterInputInteractionHandler:(e,t)=>this.formElement.removeEventListener(e,t)}}getLabelAdapterMethods(){return{floatLabel:e=>this.labelElement&&this.labelElement.floatingLabelFoundation.float(e),getLabelWidth:()=>this.labelElement?this.labelElement.floatingLabelFoundation.getWidth():0,hasLabel:()=>Boolean(this.labelElement),shakeLabel:e=>this.labelElement&&this.labelElement.floatingLabelFoundation.shake(e),setLabelRequired:e=>{this.labelElement&&this.labelElement.floatingLabelFoundation.setRequired(e)}}}getLineRippleAdapterMethods(){return{activateLineRipple:()=>{this.lineRippleElement&&this.lineRippleElement.lineRippleFoundation.activate()},deactivateLineRipple:()=>{this.lineRippleElement&&this.lineRippleElement.lineRippleFoundation.deactivate()},setLineRippleTransformOrigin:e=>{this.lineRippleElement&&this.lineRippleElement.lineRippleFoundation.setRippleCenter(e)}}}async getUpdateComplete(){var e;const t=await super.getUpdateComplete();return await(null===(e=this.outlineElement)||void 0===e?void 0:e.updateComplete),t}firstUpdated(){var e;super.firstUpdated(),this.mdcFoundation.setValidateOnValueChange(this.autoValidate),this.validateOnInitialRender&&this.reportValidity(),null===(e=this.outlineElement)||void 0===e||e.updateComplete.then((()=>{var e;this.outlineWidth=(null===(e=this.labelElement)||void 0===e?void 0:e.floatingLabelFoundation.getWidth())||0}))}getOutlineAdapterMethods(){return{closeOutline:()=>this.outlineElement&&(this.outlineOpen=!1),hasOutline:()=>Boolean(this.outlineElement),notchOutline:e=>{this.outlineElement&&!this.outlineOpen&&(this.outlineWidth=e,this.outlineOpen=!0)}}}async layout(){await this.updateComplete;const e=this.labelElement;if(!e)return void(this.outlineOpen=!1);const t=!!this.label&&!!this.value;if(e.floatingLabelFoundation.float(t),!this.outlined)return;this.outlineOpen=t,await this.updateComplete;const i=e.floatingLabelFoundation.getWidth();this.outlineOpen&&(this.outlineWidth=i,await this.updateComplete)}}o([fe(".mdc-text-field")],Df.prototype,"mdcRoot",void 0),o([fe("input")],Df.prototype,"formElement",void 0),o([fe(".mdc-floating-label")],Df.prototype,"labelElement",void 0),o([fe(".mdc-line-ripple")],Df.prototype,"lineRippleElement",void 0),o([fe("mwc-notched-outline")],Df.prototype,"outlineElement",void 0),o([fe(".mdc-notched-outline__notch")],Df.prototype,"notchElement",void 0),o([he({type:String})],Df.prototype,"value",void 0),o([he({type:String})],Df.prototype,"type",void 0),o([he({type:String})],Df.prototype,"placeholder",void 0),o([he({type:String}),Kp((function(e,t){void 0!==t&&this.label!==t&&this.layout()}))],Df.prototype,"label",void 0),o([he({type:String})],Df.prototype,"icon",void 0),o([he({type:String})],Df.prototype,"iconTrailing",void 0),o([he({type:Boolean,reflect:!0})],Df.prototype,"disabled",void 0),o([he({type:Boolean})],Df.prototype,"required",void 0),o([he({type:Number})],Df.prototype,"minLength",void 0),o([he({type:Number})],Df.prototype,"maxLength",void 0),o([he({type:Boolean,reflect:!0}),Kp((function(e,t){void 0!==t&&this.outlined!==t&&this.layout()}))],Df.prototype,"outlined",void 0),o([he({type:String})],Df.prototype,"helper",void 0),o([he({type:Boolean})],Df.prototype,"validateOnInitialRender",void 0),o([he({type:String})],Df.prototype,"validationMessage",void 0),o([he({type:Boolean})],Df.prototype,"autoValidate",void 0),o([he({type:String})],Df.prototype,"pattern",void 0),o([he({type:String})],Df.prototype,"min",void 0),o([he({type:String})],Df.prototype,"max",void 0),o([he({type:String})],Df.prototype,"step",void 0),o([he({type:Number})],Df.prototype,"size",void 0),o([he({type:Boolean})],Df.prototype,"helperPersistent",void 0),o([he({type:Boolean})],Df.prototype,"charCounter",void 0),o([he({type:Boolean})],Df.prototype,"endAligned",void 0),o([he({type:String})],Df.prototype,"prefix",void 0),o([he({type:String})],Df.prototype,"suffix",void 0),o([he({type:String})],Df.prototype,"name",void 0),o([he({type:String})],Df.prototype,"inputMode",void 0),o([he({type:Boolean})],Df.prototype,"readOnly",void 0),o([he({type:String})],Df.prototype,"autocapitalize",void 0),o([ue()],Df.prototype,"outlineOpen",void 0),o([ue()],Df.prototype,"outlineWidth",void 0),o([ue()],Df.prototype,"isUiValid",void 0),o([ue()],Df.prototype,"focused",void 0),o([me({passive:!0})],Df.prototype,"handleInputChange",null);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const zf=u`.mdc-floating-label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-subtitle1-font-family,var(--mdc-typography-font-family,Roboto,sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size,1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight,400);letter-spacing:.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing,.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform,inherit);position:absolute;left:0;-webkit-transform-origin:left top;transform-origin:left top;line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform;transition:transform 150ms cubic-bezier(.4,0,.2,1),color 150ms cubic-bezier(.4,0,.2,1)}.mdc-floating-label[dir=rtl],[dir=rtl] .mdc-floating-label{right:0;left:auto;-webkit-transform-origin:right top;transform-origin:right top;text-align:right}.mdc-floating-label--float-above{cursor:auto}.mdc-floating-label--required::after{margin-left:1px;margin-right:0;content:"*"}.mdc-floating-label--required[dir=rtl]::after,[dir=rtl] .mdc-floating-label--required::after{margin-left:0;margin-right:1px}.mdc-floating-label--float-above{transform:translateY(-106%) scale(.75)}.mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-standard 250ms 1}@keyframes mdc-floating-label-shake-float-above-standard{0%{transform:translateX(calc(0 - 0)) translateY(-106%) scale(.75)}33%{animation-timing-function:cubic-bezier(.5,0,.701732,.495819);transform:translateX(calc(4% - 0)) translateY(-106%) scale(.75)}66%{animation-timing-function:cubic-bezier(.302435,.381352,.55,.956352);transform:translateX(calc(-4% - 0)) translateY(-106%) scale(.75)}100%{transform:translateX(calc(0 - 0)) translateY(-106%) scale(.75)}}.mdc-line-ripple::after,.mdc-line-ripple::before{position:absolute;bottom:0;left:0;width:100%;border-bottom-style:solid;content:""}.mdc-line-ripple::before{border-bottom-width:1px}.mdc-line-ripple::before{z-index:1}.mdc-line-ripple::after{transform:scaleX(0);border-bottom-width:2px;opacity:0;z-index:2}.mdc-line-ripple::after{transition:transform 180ms cubic-bezier(.4,0,.2,1),opacity 180ms cubic-bezier(.4,0,.2,1)}.mdc-line-ripple--active::after{transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating::after{opacity:0}.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}.mdc-notched-outline[dir=rtl],[dir=rtl] .mdc-notched-outline{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}.mdc-notched-outline__leading[dir=rtl],[dir=rtl] .mdc-notched-outline__leading{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}.mdc-notched-outline__trailing[dir=rtl],[dir=rtl] .mdc-notched-outline__trailing{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / .75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl],[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(.4,0,.2,1);transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity,0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity,0)}to{opacity:0}}.mdc-text-field--filled{--mdc-ripple-fg-size:0;--mdc-ripple-left:0;--mdc-ripple-top:0;--mdc-ripple-fg-scale:1;--mdc-ripple-fg-translate-end:0;--mdc-ripple-fg-translate-start:0;-webkit-tap-highlight-color:transparent;will-change:transform,opacity}.mdc-text-field--filled .mdc-text-field__ripple::after,.mdc-text-field--filled .mdc-text-field__ripple::before{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-text-field--filled .mdc-text-field__ripple::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index,1)}.mdc-text-field--filled .mdc-text-field__ripple::after{z-index:0;z-index:var(--mdc-ripple-z-index,0)}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::before{transform:scale(var(--mdc-ripple-fg-scale,1))}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-text-field--filled.mdc-ripple-upgraded--unbounded .mdc-text-field__ripple::after{top:var(--mdc-ripple-top,0);left:var(--mdc-ripple-left,0)}.mdc-text-field--filled.mdc-ripple-upgraded--foreground-activation .mdc-text-field__ripple::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-text-field--filled.mdc-ripple-upgraded--foreground-deactivation .mdc-text-field__ripple::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}.mdc-text-field--filled .mdc-text-field__ripple::after,.mdc-text-field--filled .mdc-text-field__ripple::before{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after{width:var(--mdc-ripple-fg-size,100%);height:var(--mdc-ripple-fg-size,100%)}.mdc-text-field__ripple{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.mdc-text-field{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small,4px);border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small,4px);border-bottom-right-radius:0;border-bottom-left-radius:0;display:inline-flex;align-items:baseline;padding:0 16px;position:relative;box-sizing:border-box;overflow:hidden;will-change:opacity,transform,color}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label{color:rgba(0,0,0,.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input{color:rgba(0,0,0,.87)}@media all{.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:rgba(0,0,0,.54)}}@media all{.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:rgba(0,0,0,.54)}}.mdc-text-field .mdc-text-field__input{caret-color:#6200ee;caret-color:var(--mdc-theme-primary,#6200ee)}.mdc-text-field:not(.mdc-text-field--disabled)+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:rgba(0,0,0,.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field-character-counter,.mdc-text-field:not(.mdc-text-field--disabled)+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:rgba(0,0,0,.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--leading{color:rgba(0,0,0,.54)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing{color:rgba(0,0,0,.54)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--prefix{color:rgba(0,0,0,.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--suffix{color:rgba(0,0,0,.6)}.mdc-text-field .mdc-floating-label{top:50%;transform:translateY(-50%);pointer-events:none}.mdc-text-field__input{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-subtitle1-font-family,var(--mdc-typography-font-family,Roboto,sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size,1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight,400);letter-spacing:.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing,.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform,inherit);height:28px;transition:opacity 150ms 0s cubic-bezier(.4,0,.2,1);width:100%;min-width:0;border:none;border-radius:0;background:0 0;appearance:none;padding:0}.mdc-text-field__input::-ms-clear{display:none}.mdc-text-field__input::-webkit-calendar-picker-indicator{display:none}.mdc-text-field__input:focus{outline:0}.mdc-text-field__input:invalid{box-shadow:none}@media all{.mdc-text-field__input::placeholder{transition:opacity 67ms 0s cubic-bezier(.4,0,.2,1);opacity:0}}@media all{.mdc-text-field__input:-ms-input-placeholder{transition:opacity 67ms 0s cubic-bezier(.4,0,.2,1);opacity:0}}@media all{.mdc-text-field--focused .mdc-text-field__input::placeholder,.mdc-text-field--no-label .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}}@media all{.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder,.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}}.mdc-text-field__affix{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-subtitle1-font-family,var(--mdc-typography-font-family,Roboto,sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size,1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight,400);letter-spacing:.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing,.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform,inherit);height:28px;transition:opacity 150ms 0s cubic-bezier(.4,0,.2,1);opacity:0;white-space:nowrap}.mdc-text-field--label-floating .mdc-text-field__affix,.mdc-text-field--no-label .mdc-text-field__affix{opacity:1}@supports(-webkit-hyphens:none){.mdc-text-field--outlined .mdc-text-field__affix{align-items:center;align-self:center;display:inline-flex;height:100%}}.mdc-text-field__affix--prefix{padding-left:0;padding-right:2px}.mdc-text-field__affix--prefix[dir=rtl],[dir=rtl] .mdc-text-field__affix--prefix{padding-left:2px;padding-right:0}.mdc-text-field--end-aligned .mdc-text-field__affix--prefix{padding-left:0;padding-right:12px}.mdc-text-field--end-aligned .mdc-text-field__affix--prefix[dir=rtl],[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__affix--prefix{padding-left:12px;padding-right:0}.mdc-text-field__affix--suffix{padding-left:12px;padding-right:0}.mdc-text-field__affix--suffix[dir=rtl],[dir=rtl] .mdc-text-field__affix--suffix{padding-left:0;padding-right:12px}.mdc-text-field--end-aligned .mdc-text-field__affix--suffix{padding-left:2px;padding-right:0}.mdc-text-field--end-aligned .mdc-text-field__affix--suffix[dir=rtl],[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__affix--suffix{padding-left:0;padding-right:2px}.mdc-text-field--filled{height:56px}.mdc-text-field--filled .mdc-text-field__ripple::after,.mdc-text-field--filled .mdc-text-field__ripple::before{background-color:rgba(0,0,0,.87);background-color:var(--mdc-ripple-color,rgba(0,0,0,.87))}.mdc-text-field--filled.mdc-ripple-surface--hover .mdc-text-field__ripple::before,.mdc-text-field--filled:hover .mdc-text-field__ripple::before{opacity:.04;opacity:var(--mdc-ripple-hover-opacity,.04)}.mdc-text-field--filled.mdc-ripple-upgraded--background-focused .mdc-text-field__ripple::before,.mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before{transition-duration:75ms;opacity:.12;opacity:var(--mdc-ripple-focus-opacity,.12)}.mdc-text-field--filled::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}.mdc-text-field--filled:not(.mdc-text-field--disabled){background-color:#f5f5f5}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0,0,0,.42)}.mdc-text-field--filled:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0,0,0,.87)}.mdc-text-field--filled .mdc-line-ripple::after{border-bottom-color:#6200ee;border-bottom-color:var(--mdc-theme-primary,#6200ee)}.mdc-text-field--filled .mdc-floating-label{left:16px;right:initial}.mdc-text-field--filled .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-text-field--filled .mdc-floating-label{left:initial;right:16px}.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-106%) scale(.75)}.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{height:100%}.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label{display:none}.mdc-text-field--filled.mdc-text-field--no-label::before{display:none}@supports(-webkit-hyphens:none){.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__affix{align-items:center;align-self:center;display:inline-flex;height:100%}}.mdc-text-field--outlined{height:56px;overflow:visible}.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1)}.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(.75)}.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined{0%{transform:translateX(calc(0 - 0)) translateY(-34.75px) scale(.75)}33%{animation-timing-function:cubic-bezier(.5,0,.701732,.495819);transform:translateX(calc(4% - 0)) translateY(-34.75px) scale(.75)}66%{animation-timing-function:cubic-bezier(.302435,.381352,.55,.956352);transform:translateX(calc(-4% - 0)) translateY(-34.75px) scale(.75)}100%{transform:translateX(calc(0 - 0)) translateY(-34.75px) scale(.75)}}.mdc-text-field--outlined .mdc-text-field__input{height:100%}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing{border-color:rgba(0,0,0,.38)}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:rgba(0,0,0,.87)}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing{border-color:#6200ee;border-color:var(--mdc-theme-primary,#6200ee)}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small,4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small,4px)}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl],[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small,4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small,4px);border-bottom-left-radius:0}@supports(top:max(0%)){.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{width:max(12px,var(--mdc-shape-small,4px))}}@supports(top:max(0%)){.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px,var(--mdc-shape-small,4px)) * 2)}}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small,4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small,4px);border-bottom-left-radius:0}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl],[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small,4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small,4px)}@supports(top:max(0%)){.mdc-text-field--outlined{padding-left:max(16px,calc(var(--mdc-shape-small,4px) + 4px))}}@supports(top:max(0%)){.mdc-text-field--outlined{padding-right:max(16px,var(--mdc-shape-small,4px))}}@supports(top:max(0%)){.mdc-text-field--outlined+.mdc-text-field-helper-line{padding-left:max(16px,calc(var(--mdc-shape-small,4px) + 4px))}}@supports(top:max(0%)){.mdc-text-field--outlined+.mdc-text-field-helper-line{padding-right:max(16px,var(--mdc-shape-small,4px))}}.mdc-text-field--outlined.mdc-text-field--with-leading-icon{padding-left:0}@supports(top:max(0%)){.mdc-text-field--outlined.mdc-text-field--with-leading-icon{padding-right:max(16px,var(--mdc-shape-small,4px))}}.mdc-text-field--outlined.mdc-text-field--with-leading-icon[dir=rtl],[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-leading-icon{padding-right:0}@supports(top:max(0%)){.mdc-text-field--outlined.mdc-text-field--with-leading-icon[dir=rtl],[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-leading-icon{padding-left:max(16px,var(--mdc-shape-small,4px))}}.mdc-text-field--outlined.mdc-text-field--with-trailing-icon{padding-right:0}@supports(top:max(0%)){.mdc-text-field--outlined.mdc-text-field--with-trailing-icon{padding-left:max(16px,calc(var(--mdc-shape-small,4px) + 4px))}}.mdc-text-field--outlined.mdc-text-field--with-trailing-icon[dir=rtl],[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-trailing-icon{padding-left:0}@supports(top:max(0%)){.mdc-text-field--outlined.mdc-text-field--with-trailing-icon[dir=rtl],[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-trailing-icon{padding-right:max(16px,calc(var(--mdc-shape-small,4px) + 4px))}}.mdc-text-field--outlined.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon{padding-left:0;padding-right:0}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:1px}.mdc-text-field--outlined .mdc-text-field__ripple::after,.mdc-text-field--outlined .mdc-text-field__ripple::before{background-color:transparent;background-color:var(--mdc-ripple-color,transparent)}.mdc-text-field--outlined .mdc-floating-label{left:4px;right:initial}.mdc-text-field--outlined .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-text-field--outlined .mdc-floating-label{left:initial;right:4px}.mdc-text-field--outlined .mdc-text-field__input{display:flex;border:none!important;background-color:transparent}.mdc-text-field--outlined .mdc-notched-outline{z-index:1}.mdc-text-field--textarea{flex-direction:column;align-items:center;width:auto;height:auto;padding:0;transition:none}.mdc-text-field--textarea .mdc-floating-label{top:19px}.mdc-text-field--textarea .mdc-floating-label:not(.mdc-floating-label--float-above){transform:none}.mdc-text-field--textarea .mdc-text-field__input{flex-grow:1;height:auto;min-height:1.5rem;overflow-x:hidden;overflow-y:auto;box-sizing:border-box;resize:none;padding:0 16px;line-height:1.5rem}.mdc-text-field--textarea.mdc-text-field--filled::before{display:none}.mdc-text-field--textarea.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-10.25px) scale(.75)}.mdc-text-field--textarea.mdc-text-field--filled .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-textarea-filled 250ms 1}@keyframes mdc-floating-label-shake-float-above-textarea-filled{0%{transform:translateX(calc(0 - 0)) translateY(-10.25px) scale(.75)}33%{animation-timing-function:cubic-bezier(.5,0,.701732,.495819);transform:translateX(calc(4% - 0)) translateY(-10.25px) scale(.75)}66%{animation-timing-function:cubic-bezier(.302435,.381352,.55,.956352);transform:translateX(calc(-4% - 0)) translateY(-10.25px) scale(.75)}100%{transform:translateX(calc(0 - 0)) translateY(-10.25px) scale(.75)}}.mdc-text-field--textarea.mdc-text-field--filled .mdc-text-field__input{margin-top:23px;margin-bottom:9px}.mdc-text-field--textarea.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{margin-top:16px;margin-bottom:16px}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-27.25px) scale(1)}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--textarea.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-24.75px) scale(.75)}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--textarea.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-textarea-outlined 250ms 1}@keyframes mdc-floating-label-shake-float-above-textarea-outlined{0%{transform:translateX(calc(0 - 0)) translateY(-24.75px) scale(.75)}33%{animation-timing-function:cubic-bezier(.5,0,.701732,.495819);transform:translateX(calc(4% - 0)) translateY(-24.75px) scale(.75)}66%{animation-timing-function:cubic-bezier(.302435,.381352,.55,.956352);transform:translateX(calc(-4% - 0)) translateY(-24.75px) scale(.75)}100%{transform:translateX(calc(0 - 0)) translateY(-24.75px) scale(.75)}}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-text-field__input{margin-top:16px;margin-bottom:16px}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label{top:18px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field__input{margin-bottom:2px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter{align-self:flex-end;padding:0 16px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter::after{display:inline-block;width:0;height:16px;content:"";vertical-align:-16px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter::before{display:none}.mdc-text-field__resizer{align-self:stretch;display:inline-flex;flex-direction:column;flex-grow:1;max-height:100%;max-width:100%;min-height:56px;min-width:fit-content;min-width:-moz-available;min-width:-webkit-fill-available;overflow:hidden;resize:both}.mdc-text-field--filled .mdc-text-field__resizer{transform:translateY(-1px)}.mdc-text-field--filled .mdc-text-field__resizer .mdc-text-field-character-counter,.mdc-text-field--filled .mdc-text-field__resizer .mdc-text-field__input{transform:translateY(1px)}.mdc-text-field--outlined .mdc-text-field__resizer{transform:translateX(-1px) translateY(-1px)}.mdc-text-field--outlined .mdc-text-field__resizer[dir=rtl],[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer{transform:translateX(1px) translateY(-1px)}.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter,.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input{transform:translateX(1px) translateY(1px)}.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter[dir=rtl],.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input[dir=rtl],[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter,[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input{transform:translateX(-1px) translateY(1px)}.mdc-text-field--with-leading-icon{padding-left:0;padding-right:16px}.mdc-text-field--with-leading-icon[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon{padding-left:16px;padding-right:0}.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 48px);left:48px;right:initial}.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label{left:initial;right:48px}.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / .75 - 64px / .75)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label{left:36px;right:initial}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label{left:initial;right:36px}.mdc-text-field--with-leading-icon.mdc-text-field--outlined :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) translateX(-32px) scale(1)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) translateX(32px) scale(1)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) translateX(-32px) scale(.75)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) translateX(32px) scale(.75)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon{0%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(.75)}33%{animation-timing-function:cubic-bezier(.5,0,.701732,.495819);transform:translateX(calc(4% - 32px)) translateY(-34.75px) scale(.75)}66%{animation-timing-function:cubic-bezier(.302435,.381352,.55,.956352);transform:translateX(calc(-4% - 32px)) translateY(-34.75px) scale(.75)}100%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(.75)}}.mdc-text-field--with-leading-icon.mdc-text-field--outlined[dir=rtl] .mdc-floating-label--shake,[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl{0%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(.75)}33%{animation-timing-function:cubic-bezier(.5,0,.701732,.495819);transform:translateX(calc(4% - -32px)) translateY(-34.75px) scale(.75)}66%{animation-timing-function:cubic-bezier(.302435,.381352,.55,.956352);transform:translateX(calc(-4% - -32px)) translateY(-34.75px) scale(.75)}100%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(.75)}}.mdc-text-field--with-trailing-icon{padding-left:16px;padding-right:0}.mdc-text-field--with-trailing-icon[dir=rtl],[dir=rtl] .mdc-text-field--with-trailing-icon{padding-left:0;padding-right:16px}.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 64px)}.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / .75 - 64px / .75)}.mdc-text-field--with-trailing-icon.mdc-text-field--outlined :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon{padding-left:0;padding-right:0}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 96px)}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / .75 - 96px / .75)}.mdc-text-field-helper-line{display:flex;justify-content:space-between;box-sizing:border-box}.mdc-text-field+.mdc-text-field-helper-line{padding-right:16px;padding-left:16px}.mdc-form-field>.mdc-text-field+label{align-self:flex-start}.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label{color:rgba(98,0,238,.87)}.mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--focused .mdc-notched-outline__trailing{border-width:2px}.mdc-text-field--focused+.mdc-text-field-helper-line .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg){opacity:1}.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:2px}.mdc-text-field--focused.mdc-text-field--outlined.mdc-text-field--textarea .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0}.mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error,#b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error,#b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-floating-label{color:#b00020;color:var(--mdc-theme-error,#b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg{color:#b00020;color:var(--mdc-theme-error,#b00020)}.mdc-text-field--invalid .mdc-text-field__input{caret-color:#b00020;caret-color:var(--mdc-theme-error,#b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing{color:#b00020;color:var(--mdc-theme-error,#b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error,#b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error,#b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error,#b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error,#b00020)}.mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg{opacity:1}.mdc-text-field--disabled{pointer-events:none}.mdc-text-field--disabled .mdc-text-field__input{color:rgba(0,0,0,.38)}@media all{.mdc-text-field--disabled .mdc-text-field__input::placeholder{color:rgba(0,0,0,.38)}}@media all{.mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder{color:rgba(0,0,0,.38)}}.mdc-text-field--disabled .mdc-floating-label{color:rgba(0,0,0,.38)}.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:rgba(0,0,0,.38)}.mdc-text-field--disabled .mdc-text-field-character-counter,.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:rgba(0,0,0,.38)}.mdc-text-field--disabled .mdc-text-field__icon--leading{color:rgba(0,0,0,.3)}.mdc-text-field--disabled .mdc-text-field__icon--trailing{color:rgba(0,0,0,.3)}.mdc-text-field--disabled .mdc-text-field__affix--prefix{color:rgba(0,0,0,.38)}.mdc-text-field--disabled .mdc-text-field__affix--suffix{color:rgba(0,0,0,.38)}.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0,0,0,.06)}.mdc-text-field--disabled .mdc-notched-outline__leading,.mdc-text-field--disabled .mdc-notched-outline__notch,.mdc-text-field--disabled .mdc-notched-outline__trailing{border-color:rgba(0,0,0,.06)}@media screen and (forced-colors:active),(-ms-high-contrast:active){.mdc-text-field--disabled .mdc-text-field__input::placeholder{color:GrayText}}@media screen and (forced-colors:active),(-ms-high-contrast:active){.mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder{color:GrayText}}@media screen and (forced-colors:active),(-ms-high-contrast:active){.mdc-text-field--disabled .mdc-floating-label{color:GrayText}}@media screen and (forced-colors:active),(-ms-high-contrast:active){.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:GrayText}}@media screen and (forced-colors:active),(-ms-high-contrast:active){.mdc-text-field--disabled .mdc-text-field-character-counter,.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:GrayText}}@media screen and (forced-colors:active),(-ms-high-contrast:active){.mdc-text-field--disabled .mdc-text-field__icon--leading{color:GrayText}}@media screen and (forced-colors:active),(-ms-high-contrast:active){.mdc-text-field--disabled .mdc-text-field__icon--trailing{color:GrayText}}@media screen and (forced-colors:active),(-ms-high-contrast:active){.mdc-text-field--disabled .mdc-text-field__affix--prefix{color:GrayText}}@media screen and (forced-colors:active),(-ms-high-contrast:active){.mdc-text-field--disabled .mdc-text-field__affix--suffix{color:GrayText}}@media screen and (forced-colors:active),(-ms-high-contrast:active){.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:GrayText}}@media screen and (forced-colors:active),(-ms-high-contrast:active){.mdc-text-field--disabled .mdc-notched-outline__leading,.mdc-text-field--disabled .mdc-notched-outline__notch,.mdc-text-field--disabled .mdc-notched-outline__trailing{border-color:GrayText}}@media screen and (forced-colors:active){.mdc-text-field--disabled .mdc-text-field__input{background-color:Window}.mdc-text-field--disabled .mdc-floating-label{z-index:1}}.mdc-text-field--disabled .mdc-floating-label{cursor:default}.mdc-text-field--disabled.mdc-text-field--filled{background-color:#fafafa}.mdc-text-field--disabled.mdc-text-field--filled .mdc-text-field__ripple{display:none}.mdc-text-field--disabled .mdc-text-field__input{pointer-events:auto}.mdc-text-field--end-aligned .mdc-text-field__input{text-align:right}.mdc-text-field--end-aligned .mdc-text-field__input[dir=rtl],[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__input{text-align:left}.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__input,[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix,[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__input{direction:ltr}.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--prefix,[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--prefix{padding-left:0;padding-right:2px}.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--suffix,[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--suffix{padding-left:12px;padding-right:0}.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__icon--leading,[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__icon--leading{order:1}.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--suffix,[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--suffix{order:2}.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__input,[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__input{order:3}.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--prefix,[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--prefix{order:4}.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__icon--trailing,[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__icon--trailing{order:5}.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__input,[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__input{text-align:right}.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__affix--prefix,[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__affix--prefix{padding-right:12px}.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__affix--suffix,[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__affix--suffix{padding-left:2px}.mdc-text-field-helper-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-caption-font-family,var(--mdc-typography-font-family,Roboto,sans-serif));font-size:.75rem;font-size:var(--mdc-typography-caption-font-size,.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height,1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight,400);letter-spacing:.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing,.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform,inherit);display:block;margin-top:0;line-height:normal;margin:0;opacity:0;will-change:opacity;transition:opacity 150ms 0s cubic-bezier(.4,0,.2,1)}.mdc-text-field-helper-text::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}.mdc-text-field-helper-text--persistent{transition:none;opacity:1;will-change:initial}.mdc-text-field-character-counter{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto,sans-serif;font-family:var(--mdc-typography-caption-font-family,var(--mdc-typography-font-family,Roboto,sans-serif));font-size:.75rem;font-size:var(--mdc-typography-caption-font-size,.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height,1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight,400);letter-spacing:.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing,.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration,inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform,inherit);display:block;margin-top:0;line-height:normal;margin-left:auto;margin-right:0;padding-left:16px;padding-right:0;white-space:nowrap}.mdc-text-field-character-counter::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}.mdc-text-field-character-counter[dir=rtl],[dir=rtl] .mdc-text-field-character-counter{margin-left:0;margin-right:auto}.mdc-text-field-character-counter[dir=rtl],[dir=rtl] .mdc-text-field-character-counter{padding-left:0;padding-right:16px}.mdc-text-field__icon{align-self:center;cursor:pointer}.mdc-text-field__icon:not([tabindex]),.mdc-text-field__icon[tabindex="-1"]{cursor:default;pointer-events:none}.mdc-text-field__icon svg{display:block}.mdc-text-field__icon--leading{margin-left:16px;margin-right:8px}.mdc-text-field__icon--leading[dir=rtl],[dir=rtl] .mdc-text-field__icon--leading{margin-left:8px;margin-right:16px}.mdc-text-field__icon--trailing{padding:12px;margin-left:0;margin-right:0}.mdc-text-field__icon--trailing[dir=rtl],[dir=rtl] .mdc-text-field__icon--trailing{margin-left:0;margin-right:0}.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:400;font-style:normal;font-size:var(--mdc-icon-size,24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}:host{display:inline-flex;flex-direction:column;outline:0}.mdc-text-field{width:100%}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0,0,0,.42);border-bottom-color:var(--mdc-text-field-idle-line-color,rgba(0,0,0,.42))}.mdc-text-field:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0,0,0,.87);border-bottom-color:var(--mdc-text-field-hover-line-color,rgba(0,0,0,.87))}.mdc-text-field.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0,0,0,.06);border-bottom-color:var(--mdc-text-field-disabled-line-color,rgba(0,0,0,.06))}.mdc-text-field.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error,#b00020)}.mdc-text-field__input{direction:inherit}mwc-notched-outline{--mdc-notched-outline-border-color:var( --mdc-text-field-outlined-idle-border-color, rgba(0, 0, 0, 0.38) )}:host(:not([disabled]):hover) :not(.mdc-text-field--invalid):not(.mdc-text-field--focused) mwc-notched-outline{--mdc-notched-outline-border-color:var( --mdc-text-field-outlined-hover-border-color, rgba(0, 0, 0, 0.87) )}:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--outlined){background-color:var(--mdc-text-field-fill-color,#f5f5f5)}:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid mwc-notched-outline{--mdc-notched-outline-border-color:var( --mdc-text-field-error-color, var(--mdc-theme-error, #b00020) )}:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid .mdc-text-field__icon,:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:var(--mdc-text-field-error-color,var(--mdc-theme-error,#b00020))}:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label,:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label::after{color:var(--mdc-text-field-label-ink-color,rgba(0,0,0,.6))}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused mwc-notched-outline{--mdc-notched-outline-stroke-width:2px}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused:not(.mdc-text-field--invalid) mwc-notched-outline{--mdc-notched-outline-border-color:var( --mdc-text-field-focused-label-color, var(--mdc-theme-primary, rgba(98, 0, 238, 0.87)) )}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused:not(.mdc-text-field--invalid) .mdc-floating-label{color:#6200ee;color:var(--mdc-theme-primary,#6200ee)}:host(:not([disabled])) .mdc-text-field .mdc-text-field__input{color:var(--mdc-text-field-ink-color,rgba(0,0,0,.87))}:host(:not([disabled])) .mdc-text-field .mdc-text-field__input::placeholder{color:var(--mdc-text-field-label-ink-color,rgba(0,0,0,.6))}:host(:not([disabled])) .mdc-text-field-helper-line .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg),:host(:not([disabled])) .mdc-text-field-helper-line:not(.mdc-text-field--invalid) .mdc-text-field-character-counter{color:var(--mdc-text-field-label-ink-color,rgba(0,0,0,.6))}:host([disabled]) .mdc-text-field:not(.mdc-text-field--outlined){background-color:var(--mdc-text-field-disabled-fill-color,#fafafa)}:host([disabled]) .mdc-text-field.mdc-text-field--outlined mwc-notched-outline{--mdc-notched-outline-border-color:var( --mdc-text-field-outlined-disabled-border-color, rgba(0, 0, 0, 0.06) )}:host([disabled]) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label,:host([disabled]) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label::after{color:var(--mdc-text-field-disabled-ink-color,rgba(0,0,0,.38))}:host([disabled]) .mdc-text-field .mdc-text-field__input,:host([disabled]) .mdc-text-field .mdc-text-field__input::placeholder{color:var(--mdc-text-field-disabled-ink-color,rgba(0,0,0,.38))}:host([disabled]) .mdc-text-field-helper-line .mdc-text-field-character-counter,:host([disabled]) .mdc-text-field-helper-line .mdc-text-field-helper-text{color:var(--mdc-text-field-disabled-ink-color,rgba(0,0,0,.38))}`
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let Pf=class extends Df{};Pf.styles=[zf],Pf=o([de("mwc-textfield")],Pf);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Nf,Hf,Bf={ANCHOR:"mdc-menu-surface--anchor",ANIMATING_CLOSED:"mdc-menu-surface--animating-closed",ANIMATING_OPEN:"mdc-menu-surface--animating-open",FIXED:"mdc-menu-surface--fixed",IS_OPEN_BELOW:"mdc-menu-surface--is-open-below",OPEN:"mdc-menu-surface--open",ROOT:"mdc-menu-surface"},Vf={CLOSED_EVENT:"MDCMenuSurface:closed",CLOSING_EVENT:"MDCMenuSurface:closing",OPENED_EVENT:"MDCMenuSurface:opened",OPENING_EVENT:"MDCMenuSurface:opening",FOCUSABLE_ELEMENTS:["button:not(:disabled)",'[href]:not([aria-disabled="true"])',"input:not(:disabled)","select:not(:disabled)","textarea:not(:disabled)",'[tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])'].join(", ")},jf={TRANSITION_OPEN_DURATION:120,TRANSITION_CLOSE_DURATION:75,MARGIN_TO_EDGE:32,ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO:.67,TOUCH_EVENT_WAIT_MS:30};!function(e){e[e.BOTTOM=1]="BOTTOM",e[e.CENTER=2]="CENTER",e[e.RIGHT=4]="RIGHT",e[e.FLIP_RTL=8]="FLIP_RTL"}(Nf||(Nf={})),function(e){e[e.TOP_LEFT=0]="TOP_LEFT",e[e.TOP_RIGHT=4]="TOP_RIGHT",e[e.BOTTOM_LEFT=1]="BOTTOM_LEFT",e[e.BOTTOM_RIGHT=5]="BOTTOM_RIGHT",e[e.TOP_START=8]="TOP_START",e[e.TOP_END=12]="TOP_END",e[e.BOTTOM_START=9]="BOTTOM_START",e[e.BOTTOM_END=13]="BOTTOM_END"}(Hf||(Hf={}));
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Uf=function(e){function o(t){var r=e.call(this,i(i({},o.defaultAdapter),t))||this;return r.isSurfaceOpen=!1,r.isQuickOpen=!1,r.isHoistedElement=!1,r.isFixedPosition=!1,r.isHorizontallyCenteredOnViewport=!1,r.maxHeight=0,r.openBottomBias=0,r.openAnimationEndTimerId=0,r.closeAnimationEndTimerId=0,r.animationRequestId=0,r.anchorCorner=Hf.TOP_START,r.originCorner=Hf.TOP_START,r.anchorMargin={top:0,right:0,bottom:0,left:0},r.position={x:0,y:0},r}return t(o,e),Object.defineProperty(o,"cssClasses",{get:function(){return Bf},enumerable:!1,configurable:!0}),Object.defineProperty(o,"strings",{get:function(){return Vf},enumerable:!1,configurable:!0}),Object.defineProperty(o,"numbers",{get:function(){return jf},enumerable:!1,configurable:!0}),Object.defineProperty(o,"Corner",{get:function(){return Hf},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},hasClass:function(){return!1},hasAnchor:function(){return!1},isElementInContainer:function(){return!1},isFocused:function(){return!1},isRtl:function(){return!1},getInnerDimensions:function(){return{height:0,width:0}},getAnchorDimensions:function(){return null},getWindowDimensions:function(){return{height:0,width:0}},getBodyDimensions:function(){return{height:0,width:0}},getWindowScroll:function(){return{x:0,y:0}},setPosition:function(){},setMaxHeight:function(){},setTransformOrigin:function(){},saveFocus:function(){},restoreFocus:function(){},notifyClose:function(){},notifyClosing:function(){},notifyOpen:function(){},notifyOpening:function(){}}},enumerable:!1,configurable:!0}),o.prototype.init=function(){var e=o.cssClasses,t=e.ROOT,i=e.OPEN;if(!this.adapter.hasClass(t))throw new Error(t+" class required in root element.");this.adapter.hasClass(i)&&(this.isSurfaceOpen=!0)},o.prototype.destroy=function(){clearTimeout(this.openAnimationEndTimerId),clearTimeout(this.closeAnimationEndTimerId),cancelAnimationFrame(this.animationRequestId)},o.prototype.setAnchorCorner=function(e){this.anchorCorner=e},o.prototype.flipCornerHorizontally=function(){this.originCorner=this.originCorner^Nf.RIGHT},o.prototype.setAnchorMargin=function(e){this.anchorMargin.top=e.top||0,this.anchorMargin.right=e.right||0,this.anchorMargin.bottom=e.bottom||0,this.anchorMargin.left=e.left||0},o.prototype.setIsHoisted=function(e){this.isHoistedElement=e},o.prototype.setFixedPosition=function(e){this.isFixedPosition=e},o.prototype.isFixed=function(){return this.isFixedPosition},o.prototype.setAbsolutePosition=function(e,t){this.position.x=this.isFinite(e)?e:0,this.position.y=this.isFinite(t)?t:0},o.prototype.setIsHorizontallyCenteredOnViewport=function(e){this.isHorizontallyCenteredOnViewport=e},o.prototype.setQuickOpen=function(e){this.isQuickOpen=e},o.prototype.setMaxHeight=function(e){this.maxHeight=e},o.prototype.setOpenBottomBias=function(e){this.openBottomBias=e},o.prototype.isOpen=function(){return this.isSurfaceOpen},o.prototype.open=function(){var e=this;this.isSurfaceOpen||(this.adapter.notifyOpening(),this.adapter.saveFocus(),this.isQuickOpen?(this.isSurfaceOpen=!0,this.adapter.addClass(o.cssClasses.OPEN),this.dimensions=this.adapter.getInnerDimensions(),this.autoposition(),this.adapter.notifyOpen()):(this.adapter.addClass(o.cssClasses.ANIMATING_OPEN),this.animationRequestId=requestAnimationFrame((function(){e.dimensions=e.adapter.getInnerDimensions(),e.autoposition(),e.adapter.addClass(o.cssClasses.OPEN),e.openAnimationEndTimerId=setTimeout((function(){e.openAnimationEndTimerId=0,e.adapter.removeClass(o.cssClasses.ANIMATING_OPEN),e.adapter.notifyOpen()}),jf.TRANSITION_OPEN_DURATION)})),this.isSurfaceOpen=!0))},o.prototype.close=function(e){var t=this;if(void 0===e&&(e=!1),this.isSurfaceOpen){if(this.adapter.notifyClosing(),this.isQuickOpen)return this.isSurfaceOpen=!1,e||this.maybeRestoreFocus(),this.adapter.removeClass(o.cssClasses.OPEN),this.adapter.removeClass(o.cssClasses.IS_OPEN_BELOW),void this.adapter.notifyClose();this.adapter.addClass(o.cssClasses.ANIMATING_CLOSED),requestAnimationFrame((function(){t.adapter.removeClass(o.cssClasses.OPEN),t.adapter.removeClass(o.cssClasses.IS_OPEN_BELOW),t.closeAnimationEndTimerId=setTimeout((function(){t.closeAnimationEndTimerId=0,t.adapter.removeClass(o.cssClasses.ANIMATING_CLOSED),t.adapter.notifyClose()}),jf.TRANSITION_CLOSE_DURATION)})),this.isSurfaceOpen=!1,e||this.maybeRestoreFocus()}},o.prototype.handleBodyClick=function(e){var t=e.target;this.adapter.isElementInContainer(t)||this.close()},o.prototype.handleKeydown=function(e){var t=e.keyCode;("Escape"===e.key||27===t)&&this.close()},o.prototype.autoposition=function(){var e;this.measurements=this.getAutoLayoutmeasurements();var t=this.getoriginCorner(),i=this.getMenuSurfaceMaxHeight(t),r=this.hasBit(t,Nf.BOTTOM)?"bottom":"top",n=this.hasBit(t,Nf.RIGHT)?"right":"left",s=this.getHorizontalOriginOffset(t),a=this.getVerticalOriginOffset(t),l=this.measurements,d=l.anchorSize,c=l.surfaceSize,h=((e={})[n]=s,e[r]=a,e);d.width/c.width>jf.ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO&&(n="center"),(this.isHoistedElement||this.isFixedPosition)&&this.adjustPositionForHoistedElement(h),this.adapter.setTransformOrigin(n+" "+r),this.adapter.setPosition(h),this.adapter.setMaxHeight(i?i+"px":""),this.hasBit(t,Nf.BOTTOM)||this.adapter.addClass(o.cssClasses.IS_OPEN_BELOW)},o.prototype.getAutoLayoutmeasurements=function(){var e=this.adapter.getAnchorDimensions(),t=this.adapter.getBodyDimensions(),i=this.adapter.getWindowDimensions(),o=this.adapter.getWindowScroll();return e||(e={top:this.position.y,right:this.position.x,bottom:this.position.y,left:this.position.x,width:0,height:0}),{anchorSize:e,bodySize:t,surfaceSize:this.dimensions,viewportDistance:{top:e.top,right:i.width-e.right,bottom:i.height-e.bottom,left:e.left},viewportSize:i,windowScroll:o}},o.prototype.getoriginCorner=function(){var e,t,i=this.originCorner,r=this.measurements,n=r.viewportDistance,s=r.anchorSize,a=r.surfaceSize,l=o.numbers.MARGIN_TO_EDGE;this.hasBit(this.anchorCorner,Nf.BOTTOM)?(e=n.top-l+this.anchorMargin.bottom,t=n.bottom-l-this.anchorMargin.bottom):(e=n.top-l+this.anchorMargin.top,t=n.bottom-l+s.height-this.anchorMargin.top),!(t-a.height>0)&&e>t+this.openBottomBias&&(i=this.setBit(i,Nf.BOTTOM));var d,c,h=this.adapter.isRtl(),u=this.hasBit(this.anchorCorner,Nf.FLIP_RTL),p=this.hasBit(this.anchorCorner,Nf.RIGHT)||this.hasBit(i,Nf.RIGHT),m=!1;(m=h&&u?!p:p)?(d=n.left+s.width+this.anchorMargin.right,c=n.right-this.anchorMargin.right):(d=n.left+this.anchorMargin.left,c=n.right+s.width-this.anchorMargin.left);var f=d-a.width>0,g=c-a.width>0,v=this.hasBit(i,Nf.FLIP_RTL)&&this.hasBit(i,Nf.RIGHT);return g&&v&&h||!f&&v?i=this.unsetBit(i,Nf.RIGHT):(f&&m&&h||f&&!m&&p||!g&&d>=c)&&(i=this.setBit(i,Nf.RIGHT)),i},o.prototype.getMenuSurfaceMaxHeight=function(e){if(this.maxHeight>0)return this.maxHeight;var t=this.measurements.viewportDistance,i=0,r=this.hasBit(e,Nf.BOTTOM),n=this.hasBit(this.anchorCorner,Nf.BOTTOM),s=o.numbers.MARGIN_TO_EDGE;return r?(i=t.top+this.anchorMargin.top-s,n||(i+=this.measurements.anchorSize.height)):(i=t.bottom-this.anchorMargin.bottom+this.measurements.anchorSize.height-s,n&&(i-=this.measurements.anchorSize.height)),i},o.prototype.getHorizontalOriginOffset=function(e){var t=this.measurements.anchorSize,i=this.hasBit(e,Nf.RIGHT),o=this.hasBit(this.anchorCorner,Nf.RIGHT);if(i){var r=o?t.width-this.anchorMargin.left:this.anchorMargin.right;return this.isHoistedElement||this.isFixedPosition?r-(this.measurements.viewportSize.width-this.measurements.bodySize.width):r}return o?t.width-this.anchorMargin.right:this.anchorMargin.left},o.prototype.getVerticalOriginOffset=function(e){var t=this.measurements.anchorSize,i=this.hasBit(e,Nf.BOTTOM),o=this.hasBit(this.anchorCorner,Nf.BOTTOM);return i?o?t.height-this.anchorMargin.top:-this.anchorMargin.bottom:o?t.height+this.anchorMargin.bottom:this.anchorMargin.top},o.prototype.adjustPositionForHoistedElement=function(e){var t,i,o=this.measurements,n=o.windowScroll,s=o.viewportDistance,a=o.surfaceSize,l=o.viewportSize,d=Object.keys(e);try{for(var c=r(d),h=c.next();!h.done;h=c.next()){var u=h.value,p=e[u]||0;!this.isHorizontallyCenteredOnViewport||"left"!==u&&"right"!==u?(p+=s[u],this.isFixedPosition||("top"===u?p+=n.y:"bottom"===u?p-=n.y:"left"===u?p+=n.x:p-=n.x),e[u]=p):e[u]=(l.width-a.width)/2}}catch(e){t={error:e}}finally{try{h&&!h.done&&(i=c.return)&&i.call(c)}finally{if(t)throw t.error}}},o.prototype.maybeRestoreFocus=function(){var e=this,t=this.adapter.isFocused(),i=this.adapter.getOwnerDocument?this.adapter.getOwnerDocument():document,o=i.activeElement&&this.adapter.isElementInContainer(i.activeElement);(t||o)&&setTimeout((function(){e.adapter.restoreFocus()}),jf.TOUCH_EVENT_WAIT_MS)},o.prototype.hasBit=function(e,t){return Boolean(e&t)},o.prototype.setBit=function(e,t){return e|t},o.prototype.unsetBit=function(e,t){return e^t},o.prototype.isFinite=function(e){return"number"==typeof e&&isFinite(e)},o}(Tp),Wf=Uf;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const qf={TOP_LEFT:Hf.TOP_LEFT,TOP_RIGHT:Hf.TOP_RIGHT,BOTTOM_LEFT:Hf.BOTTOM_LEFT,BOTTOM_RIGHT:Hf.BOTTOM_RIGHT,TOP_START:Hf.TOP_START,TOP_END:Hf.TOP_END,BOTTOM_START:Hf.BOTTOM_START,BOTTOM_END:Hf.BOTTOM_END};class Gf extends Sp{constructor(){super(...arguments),this.mdcFoundationClass=Wf,this.absolute=!1,this.fullwidth=!1,this.fixed=!1,this.x=null,this.y=null,this.quick=!1,this.open=!1,this.stayOpenOnBodyClick=!1,this.bitwiseCorner=Hf.TOP_START,this.previousMenuCorner=null,this.menuCorner="START",this.corner="TOP_START",this.styleTop="",this.styleLeft="",this.styleRight="",this.styleBottom="",this.styleMaxHeight="",this.styleTransformOrigin="",this.anchor=null,this.previouslyFocused=null,this.previousAnchor=null,this.onBodyClickBound=()=>{}}render(){return this.renderSurface()}renderSurface(){const e=this.getRootClasses(),t=this.getRootStyles();return B` <div class="${Dp(e)}" style="${zp(t)}" @keydown="${this.onKeydown}" @opened="${this.registerBodyClick}" @closed="${this.deregisterBodyClick}"> ${this.renderContent()} </div>`}getRootClasses(){return{"mdc-menu-surface":!0,"mdc-menu-surface--fixed":this.fixed,"mdc-menu-surface--fullwidth":this.fullwidth}}getRootStyles(){return{top:this.styleTop,left:this.styleLeft,right:this.styleRight,bottom:this.styleBottom,"max-height":this.styleMaxHeight,"transform-origin":this.styleTransformOrigin}}renderContent(){return B`<slot></slot>`}createAdapter(){return Object.assign(Object.assign({},wp(this.mdcRoot)),{hasAnchor:()=>!!this.anchor,notifyClose:()=>{const e=new CustomEvent("closed",{bubbles:!0,composed:!0});this.open=!1,this.mdcRoot.dispatchEvent(e)},notifyClosing:()=>{const e=new CustomEvent("closing",{bubbles:!0,composed:!0});this.mdcRoot.dispatchEvent(e)},notifyOpen:()=>{const e=new CustomEvent("opened",{bubbles:!0,composed:!0});this.open=!0,this.mdcRoot.dispatchEvent(e)},notifyOpening:()=>{const e=new CustomEvent("opening",{bubbles:!0,composed:!0});this.mdcRoot.dispatchEvent(e)},isElementInContainer:()=>!1,isRtl:()=>!!this.mdcRoot&&"rtl"===getComputedStyle(this.mdcRoot).direction,setTransformOrigin:e=>{this.mdcRoot&&(this.styleTransformOrigin=e)},isFocused:()=>_p(this),saveFocus:()=>{const e=$p(),t=e.length;t||(this.previouslyFocused=null),this.previouslyFocused=e[t-1]},restoreFocus:()=>{this.previouslyFocused&&"focus"in this.previouslyFocused&&this.previouslyFocused.focus()},getInnerDimensions:()=>{const e=this.mdcRoot;return e?{width:e.offsetWidth,height:e.offsetHeight}:{width:0,height:0}},getAnchorDimensions:()=>{const e=this.anchor;return e?e.getBoundingClientRect():null},getBodyDimensions:()=>({width:document.body.clientWidth,height:document.body.clientHeight}),getWindowDimensions:()=>({width:window.innerWidth,height:window.innerHeight}),getWindowScroll:()=>({x:window.pageXOffset,y:window.pageYOffset}),setPosition:e=>{this.mdcRoot&&(this.styleLeft="left"in e?`${e.left}px`:"",this.styleRight="right"in e?`${e.right}px`:"",this.styleTop="top"in e?`${e.top}px`:"",this.styleBottom="bottom"in e?`${e.bottom}px`:"")},setMaxHeight:async e=>{this.mdcRoot&&(this.styleMaxHeight=e,await this.updateComplete,this.styleMaxHeight=`var(--mdc-menu-max-height, ${e})`)}})}onKeydown(e){this.mdcFoundation&&this.mdcFoundation.handleKeydown(e)}onBodyClick(e){if(this.stayOpenOnBodyClick)return;-1===e.composedPath().indexOf(this)&&this.close()}registerBodyClick(){this.onBodyClickBound=this.onBodyClick.bind(this),document.body.addEventListener("click",this.onBodyClickBound,{passive:!0,capture:!0})}deregisterBodyClick(){document.body.removeEventListener("click",this.onBodyClickBound,{capture:!0})}onOpenChanged(e,t){this.mdcFoundation&&(e?this.mdcFoundation.open():void 0!==t&&this.mdcFoundation.close())}close(){this.open=!1}show(){this.open=!0}}o([fe(".mdc-menu-surface")],Gf.prototype,"mdcRoot",void 0),o([fe("slot")],Gf.prototype,"slotElement",void 0),o([he({type:Boolean}),Kp((function(e){this.mdcFoundation&&!this.fixed&&this.mdcFoundation.setIsHoisted(e)}))],Gf.prototype,"absolute",void 0),o([he({type:Boolean})],Gf.prototype,"fullwidth",void 0),o([he({type:Boolean}),Kp((function(e){this.mdcFoundation&&!this.absolute&&this.mdcFoundation.setFixedPosition(e)}))],Gf.prototype,"fixed",void 0),o([he({type:Number}),Kp((function(e){this.mdcFoundation&&null!==this.y&&null!==e&&(this.mdcFoundation.setAbsolutePosition(e,this.y),this.mdcFoundation.setAnchorMargin({left:e,top:this.y,right:-e,bottom:this.y}))}))],Gf.prototype,"x",void 0),o([he({type:Number}),Kp((function(e){this.mdcFoundation&&null!==this.x&&null!==e&&(this.mdcFoundation.setAbsolutePosition(this.x,e),this.mdcFoundation.setAnchorMargin({left:this.x,top:e,right:-this.x,bottom:e}))}))],Gf.prototype,"y",void 0),o([he({type:Boolean}),Kp((function(e){this.mdcFoundation&&this.mdcFoundation.setQuickOpen(e)}))],Gf.prototype,"quick",void 0),o([he({type:Boolean,reflect:!0}),Kp((function(e,t){this.onOpenChanged(e,t)}))],Gf.prototype,"open",void 0),o([he({type:Boolean})],Gf.prototype,"stayOpenOnBodyClick",void 0),o([ue(),Kp((function(e){this.mdcFoundation&&this.mdcFoundation.setAnchorCorner(e)}))],Gf.prototype,"bitwiseCorner",void 0),o([he({type:String}),Kp((function(e){if(this.mdcFoundation){const t="START"===e||"END"===e,i=null===this.previousMenuCorner,o=!i&&e!==this.previousMenuCorner,r=i&&"END"===e;t&&(o||r)&&(this.bitwiseCorner=this.bitwiseCorner^Nf.RIGHT,this.mdcFoundation.flipCornerHorizontally(),this.previousMenuCorner=e)}}))],Gf.prototype,"menuCorner",void 0),o([he({type:String}),Kp((function(e){if(this.mdcFoundation&&e){let t=qf[e];"END"===this.menuCorner&&(t^=Nf.RIGHT),this.bitwiseCorner=t}}))],Gf.prototype,"corner",void 0),o([ue()],Gf.prototype,"styleTop",void 0),o([ue()],Gf.prototype,"styleLeft",void 0),o([ue()],Gf.prototype,"styleRight",void 0),o([ue()],Gf.prototype,"styleBottom",void 0),o([ue()],Gf.prototype,"styleMaxHeight",void 0),o([ue()],Gf.prototype,"styleTransformOrigin",void 0);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const Xf=u`.mdc-menu-surface{display:none;position:absolute;box-sizing:border-box;max-width:calc(100vw - 32px);max-width:var(--mdc-menu-max-width,calc(100vw - 32px));max-height:calc(100vh - 32px);max-height:var(--mdc-menu-max-height,calc(100vh - 32px));margin:0;padding:0;transform:scale(1);transform-origin:top left;opacity:0;overflow:auto;will-change:transform,opacity;z-index:8;transition:opacity .03s linear,transform .12s cubic-bezier(0,0,.2,1),height 250ms cubic-bezier(0,0,.2,1);box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);background-color:#fff;background-color:var(--mdc-theme-surface,#fff);color:#000;color:var(--mdc-theme-on-surface,#000);border-radius:4px;border-radius:var(--mdc-shape-medium,4px);transform-origin-left:top left;transform-origin-right:top right}.mdc-menu-surface:focus{outline:0}.mdc-menu-surface--animating-open{display:inline-block;transform:scale(.8);opacity:0}.mdc-menu-surface--open{display:inline-block;transform:scale(1);opacity:1}.mdc-menu-surface--animating-closed{display:inline-block;opacity:0;transition:opacity 75ms linear}.mdc-menu-surface[dir=rtl],[dir=rtl] .mdc-menu-surface{transform-origin-left:top right;transform-origin-right:top left}.mdc-menu-surface--anchor{position:relative;overflow:visible}.mdc-menu-surface--fixed{position:fixed}.mdc-menu-surface--fullwidth{width:100%}:host(:not([open])){display:none}.mdc-menu-surface{z-index:8;z-index:var(--mdc-menu-z-index,8);min-width:112px;min-width:var(--mdc-menu-min-width,112px)}`
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let Kf=class extends Gf{};Kf.styles=[Xf],Kf=o([de("mwc-menu-surface")],Kf);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class Zf extends ae{set project(e){"string"==typeof e?requestAnimationFrame((()=>{var t;const i=this.getRootNode();this._project=null!==(t=i.getElementById(e))&&void 0!==t?t:void 0})):this._project=e}}o([he()],Zf.prototype,"project",null),o([ue()],Zf.prototype,"_project",void 0);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Yf=class extends Zf{constructor(){super(...arguments),this.state="closed",this._postStateChangeRenderDone=!1}update(e){e.has("state")&&(this._postStateChangeRenderDone=!1),super.update(e)}render(){var e;return B`<mwc-menu-surface fixed quick .open="${"closed"!==this.state}" .anchor="${null!==(e=this.anchorElement)&&void 0!==e?e:null}" corner="BOTTOM_START" class="${this.state}" @closed="${this._onSurfaceClosed}"><div class="wrapper">${this._surfaceContents}</div></mwc-menu-surface>`}async updated(){if(!this._postStateChangeRenderDone){if("menu"===this.state){const e=this._menuList;e&&(await e.updateComplete,e.focusItemAtIndex(0))}else if("rename"===this.state||"newfile"===this.state){const e=this._filenameInput;e&&(await e.updateComplete,e.focus(),"rename"===this.state&&e.setSelectionRange(0,e.value.lastIndexOf(".")))}this._postStateChangeRenderDone=!0}}get _surfaceContents(){switch(this.state){case"closed":return j;case"menu":return this._menu;case"rename":return this._rename;case"newfile":return this._newFile}}get _menu(){return B` <mwc-list class="menu-list" @action="${this._onMenuAction}"> <mwc-list-item graphic="icon" id="renameButton"> Rename <svg slot="graphic" height="24" viewBox="0 0 24 24" width="24" fill="currentcolor"> <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/> </svg> </mwc-list-item> <mwc-list-item graphic="icon" id="deleteButton"> Delete <svg slot="graphic" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor"> <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/> </svg> </mwc-list-item> </mwc-list> `}get _rename(){return B` <mwc-textfield class="filename-input" label="Filename" .value="${this.filename||""}" @input="${this._onFilenameInputChange}" @keydown="${this._onFilenameInputKeydown}"></mwc-textfield> <div class="actions"> <mwc-button outlined @click="${this._onClickCancel}">Cancel</mwc-button> <mwc-button raised class="submit-button" .disabled="${!this._filenameInputValid}" @click="${this._onSubmitRename}">Rename</mwc-button> </div> `}get _newFile(){return B` <mwc-textfield class="filename-input" label="Filename" @input="${this._onFilenameInputChange}" @keydown="${this._onFilenameInputKeydown}"></mwc-textfield> <div class="actions"> <mwc-button outlined @click="${this._onClickCancel}">Cancel</mwc-button> <mwc-button raised class="submit-button" .disabled="${!this._filenameInputValid}" @click="${this._onSubmitNewFile}">Create</mwc-button> </div> `}_onSurfaceClosed(){this.state="closed"}_onClickCancel(){this._surface.close()}_onMenuAction(e){switch(e.detail.index){case 0:return this._onMenuSelectRename();case 1:return this._onMenuSelectDelete()}}_onMenuSelectRename(){this.state="rename"}_onMenuSelectDelete(){this._surface.close(),this._project&&this.filename&&this._project.deleteFile(this.filename)}_onFilenameInputChange(){this.requestUpdate()}get _filenameInputValid(){return!!(this._project&&this._filenameInput&&this._project.isValidNewFilename(this._filenameInput.value))}_onFilenameInputKeydown(e){var t;"Enter"===e.key&&!1===(null===(t=this._submitButton)||void 0===t?void 0:t.disabled)&&(e.preventDefault(),this._submitButton.click())}_onSubmitRename(){var e;this._surface.close();const t=this.filename,i=null===(e=this._filenameInput)||void 0===e?void 0:e.value;this._project&&t&&i&&this._project.renameFile(t,i)}_onSubmitNewFile(){var e;this._surface.close();const t=null===(e=this._filenameInput)||void 0===e?void 0:e.value;this._project&&t&&(this._project.addFile(t),this.dispatchEvent(new CustomEvent("newFile",{detail:{filename:t}})))}};Yf.styles=u`mwc-menu-surface{--mdc-theme-primary:var(
        --playground-floating-controls-color,
        var(--playground-highlight-color, #6200ee)
      )}mwc-menu-surface.menu{--mdc-typography-subtitle1-font-size:13px;--mdc-list-item-graphic-margin:14px}mwc-list-item{min-width:100px;height:40px}mwc-menu-surface.newfile>.wrapper,mwc-menu-surface.rename>.wrapper{padding:18px}.actions{margin-top:18px;display:flex;justify-content:flex-end}.actions>*{margin-left:12px}`,o([he({attribute:!1})],Yf.prototype,"anchorElement",void 0),o([he()],Yf.prototype,"state",void 0),o([he()],Yf.prototype,"filename",void 0),o([fe("mwc-menu-surface")],Yf.prototype,"_surface",void 0),o([fe(".menu-list")],Yf.prototype,"_menuList",void 0),o([fe(".filename-input")],Yf.prototype,"_filenameInput",void 0),o([fe(".submit-button")],Yf.prototype,"_submitButton",void 0),Yf=o([de("playground-file-system-controls")],Yf);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Qf=class extends Zf{constructor(){super(...arguments),this.editableFileSystem=!1,this._activeFileName="",this._activeFileIndex=0,this._onProjectFilesChanged=e=>{this._handleFilesChanged(e.projectLoaded)}}set editor(e){"string"==typeof e?requestAnimationFrame((()=>{var t;const i=this.getRootNode();this._editor=null!==(t=i.getElementById(e))&&void 0!==t?t:void 0})):this._editor=e}get _visibleFiles(){var e,t;return(null!==(t=null===(e=this._project)||void 0===e?void 0:e.files)&&void 0!==t?t:[]).filter((({hidden:e})=>!e))}update(e){if(e.has("_project")){const t=e.get("_project");t&&t.removeEventListener("filesChanged",this._onProjectFilesChanged),this._project&&(this._handleFilesChanged(!0),this._project.addEventListener("filesChanged",this._onProjectFilesChanged))}e.has("_activeFileName")&&this._editor&&(this._editor.filename=this._activeFileName,this._setNewActiveFile()),super.update(e)}render(){return B` <playground-internal-tab-bar @tabchange="${this._onTabchange}" label="File selector"> ${this._visibleFiles.map((({name:e,label:t})=>B`<playground-internal-tab .active="${e===this._activeFileName}" data-filename="${e}"> ${t||e} ${this.editableFileSystem?B`<mwc-icon-button aria-label="File menu" class="menu-button" @click="${this._onOpenMenu}"> <svg viewBox="0 0 24 24" width="16" height="16" fill="currentcolor"> <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/> </svg> </mwc-icon-button>`:j} </playground-internal-tab>`))} </playground-internal-tab-bar> ${this.editableFileSystem?B` <mwc-icon-button class="add-file-button" aria-label="New file" @click="${this._onClickAddFile}"> <svg fill="currentcolor" viewBox="0 0 24 24" width="24" height="24" shape-rendering="crispEdges"> <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/> </svg> </mwc-icon-button> <playground-file-system-controls .project="${this._project}" @newFile="${this._onNewFile}"> </playground-file-system-controls> `:j} `}_handleFilesChanged(e=!1){var t;if(e){const e=null===(t=this._visibleFiles.find((e=>e.selected)))||void 0===t?void 0:t.name;void 0!==e&&(this._activeFileName=e)}this._setNewActiveFile(),this.requestUpdate()}_onTabchange(e){const t=e.detail.tab;if(!t)return;const i=t.dataset.filename,o=t.index;i!==this._activeFileName&&(this._activeFileName=i,this._activeFileIndex=o)}_onOpenMenu(e){const t=this._fileSystemControls;if(t){t.state="menu";for(const i of e.composedPath())if(i instanceof HTMLElement&&i.dataset.filename){t.filename=i.dataset.filename;break}t.anchorElement=e.target,e.stopPropagation()}}_onClickAddFile(e){const t=this._fileSystemControls;t&&(t.state="newfile",t.anchorElement=e.target)}_onNewFile(e){this._activeFileName=e.detail.filename}_setNewActiveFile(){if(this._activeFileName){const e=this._visibleFiles.findIndex((e=>e.name===this._activeFileName));if(e>=0)return void(this._activeFileIndex=e)}for(let e=this._activeFileIndex;e>=0;e--){const t=this._visibleFiles[e];if(t&&!t.hidden)return void(this._activeFileName=t.name)}this._activeFileIndex=0,this._activeFileName=""}};
/* @license CodeMirror, copyright (c) by Marijn Haverbeke and others
Distributed under an MIT license: https://codemirror.net/LICENSE */
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rg=window.CodeMirror,ng=u`.CodeMirror{font-family:var(--playground-code-font-family,monospace);font-size:var(--playground-code-font-size,14px);padding:var(--playground-code-padding,0);height:350px;color:var(--playground-code-default-color,#000);background:var(--playground-code-background,#fff);direction:ltr;isolation:isolate;line-height:var(--playground-code-line-height,1.4em)}.CodeMirror-lines{padding:4px 0}.CodeMirror pre.CodeMirror-line,.CodeMirror pre.CodeMirror-line-like{padding:var(--playground-code-line-padding,0 4px)}.CodeMirror-gutter-filler,.CodeMirror-scrollbar-filler{background:var(--playground-code-background,#fff)}.CodeMirror-gutters{border-right:var(--playground-code-gutter-border-right,none);background:var(--playground-code-gutter-background,var(--playground-code-background,#fff));box-shadow:var(--playground-code-gutter-box-shadow,none);white-space:nowrap}.CodeMirror-linenumber{padding:0 3px 0 5px;min-width:20px;text-align:right;color:var(--playground-code-linenumber-color,#767676);white-space:nowrap;margin-right:1em}.CodeMirror-code>div>.CodeMirror-line{padding-left:.7em}.CodeMirror-cursor{border-left:2px solid var(--playground-code-cursor-color,var(--playground-code-default-color,#000));border-right:none;width:0}@keyframes blink{50%{background:0 0}}.cm-header,.cm-strong{font-weight:700}.cm-em{font-style:italic}.cm-link{text-decoration:underline}.cm-strikethrough{text-decoration:line-through}.cm-keyword{color:var(--playground-code-keyword-color,#708)}.cm-atom{color:var(--playground-code-atom-color,#219)}.cm-number{color:var(--playground-code-number-color,#164)}.cm-def{color:var(--playground-code-def-color,#00f)}.cm-variable{color:var(--playground-code-variable-color,#000)}.cm-property{color:var(--playground-code-property-color,#000)}.cm-operator{color:var(--playground-code-operator-color,#000)}.cm-variable-2{color:var(--playground-code-variable-2-color,#05a)}.cm-variable-3{color:var(--playground-code-variable-3-color,#085)}.cm-type{color:var(--playground-code-type-color,#085)}.cm-comment{color:var(--playground-code-comment-color,#a50)}.cm-string{color:var(--playground-code-string-color,#a11)}.cm-string-2{color:var(--playground-code-string-2-color,#f50)}.cm-meta{color:var(--playground-code-meta-color,#555)}.cm-qualifier{color:var(--playground-code-qualifier-color,#555)}.cm-builtin{color:var(--playground-code-builtin-color,#30a)}.cm-tag{color:var(--playground-code-tag-color,#170)}.cm-attribute{color:var(--playground-code-attribute-color,#00c)}.cm-callee{color:var(--playground-code-callee-color,#000)}.CodeMirror-composing{border-bottom:2px solid}.CodeMirror{position:relative;overflow:hidden}.CodeMirror-scroll{overflow:scroll!important;margin-bottom:-50px;margin-right:-50px;padding-bottom:50px;height:100%;outline:0;position:relative}.CodeMirror-sizer{position:relative;border-right:50px solid transparent}.CodeMirror-gutter-filler,.CodeMirror-hscrollbar,.CodeMirror-scrollbar-filler,.CodeMirror-vscrollbar{position:absolute;z-index:6;display:none;outline:0}.CodeMirror-vscrollbar{right:0;top:0;overflow-x:hidden;overflow-y:scroll}.CodeMirror-hscrollbar{bottom:0;left:0;overflow-y:hidden;overflow-x:scroll}.CodeMirror-scrollbar-filler{right:0;bottom:0}.CodeMirror-gutter-filler{left:0;bottom:0}.CodeMirror-gutters{position:absolute;left:0;top:0;min-height:100%;z-index:3}.CodeMirror-gutter{white-space:normal;height:100%;display:inline-block;vertical-align:top;margin-bottom:-50px}.CodeMirror-gutter-wrapper{position:absolute;z-index:4;background:0 0!important;border:none!important}.CodeMirror-gutter-background{position:absolute;top:0;bottom:0;z-index:4}.CodeMirror-gutter-elt{position:absolute;cursor:default;z-index:4}.CodeMirror-gutter-wrapper ::selection{background:0 0}.CodeMirror-lines{cursor:text;min-height:1px}.CodeMirror pre.CodeMirror-line,.CodeMirror pre.CodeMirror-line-like{border-radius:0;border-width:0;background:0 0;font-family:inherit;font-size:inherit;margin:0;white-space:pre;word-wrap:normal;line-height:inherit;color:inherit;z-index:2;position:relative;overflow:visible;-webkit-tap-highlight-color:transparent;font-variant-ligatures:contextual}.CodeMirror-wrap pre.CodeMirror-line,.CodeMirror-wrap pre.CodeMirror-line-like{word-wrap:break-word;white-space:pre-wrap;word-break:normal}.CodeMirror-linebackground{position:absolute;left:0;right:0;top:0;bottom:0;z-index:0}.CodeMirror-linewidget{position:relative;z-index:2;padding:.1px}.CodeMirror-rtl pre{direction:rtl}.CodeMirror-code{outline:0}.CodeMirror-gutter,.CodeMirror-gutters,.CodeMirror-linenumber,.CodeMirror-scroll,.CodeMirror-sizer{box-sizing:content-box}.CodeMirror-measure{position:absolute;width:100%;height:0;overflow:hidden;visibility:hidden}.CodeMirror-cursor{position:absolute;pointer-events:none}.CodeMirror-measure pre{position:static}div.CodeMirror-cursors{visibility:hidden;position:relative;z-index:3}div.CodeMirror-dragcursors{visibility:visible}.CodeMirror-focused div.CodeMirror-cursors{visibility:visible}.CodeMirror-selected{background:var(--playground-code-selection-background,#d7d4f0)}.CodeMirror-focused .CodeMirror-selected{background:var(--playground-code-selection-background,#d7d4f0)}.CodeMirror-crosshair{cursor:crosshair}.CodeMirror-line::selection,.CodeMirror-line>span::selection,.CodeMirror-line>span>span::selection{background:var(--playground-code-selection-background,#d7d4f0)}.CodeMirror-hints{position:absolute;z-index:10;overflow:hidden;list-style:none;margin:0;padding:0;box-shadow:rgba(0,0,0,.2) 0 5px 5px -3px,rgba(0,0,0,.14) 0 8px 10px 1px,rgba(0,0,0,.12) 0 3px 14px 2px;border:1px solid var(--playground-code-selection-background,silver);background:var(--playground-code-background,#fff);font-size:var(--playground-code-font-size,14px);font-family:var(--playground-code-font-family,monospace);max-height:20em;width:600px;max-width:min(600px,80vw);overflow-y:auto}.CodeMirror-hint{margin:0;padding:0 6px;white-space:pre;color:var(--playground-code-cursor-color,#000);cursor:pointer;display:flex;justify-content:space-between}@media (pointer:coarse){.CodeMirror-hint{padding:1em 6px}}.CodeMirror-hint-active{background:var(--playground-code-background,rgba(0,0,0,.2));filter:brightness(1.2)}.CodeMirror-hint mark{background:inherit;color:var(--playground-code-qualifier-color,#555)}.CodeMirror-hint .hint-object-name{padding-right:2em;white-space:nowrap}.CodeMirror-hint .hint-object-details{flex-basis:80%;font-size:calc(var(--playground-code-font-size,14px) * .9);color:var(--playground-code-string-2-color,#fff);opacity:.8;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cm-force-border{padding-right:.1px}@media print{.CodeMirror div.CodeMirror-cursors{visibility:hidden}}.cm-tab-wrap-hack:after{content:''}span.CodeMirror-selectedtext{background:0 0}`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;let sg=class extends ae{render(){return B`<div id="message"><slot></slot></div>`}};sg.styles=u`:host{position:absolute;width:100%;height:100%;box-sizing:border-box;left:0;top:0;display:flex;align-items:center;justify-content:center;background:0 0;z-index:9;background:rgba(0,0,0,.32);overflow-y:auto}#message{background:#fff;color:#000;padding:10px 20px;border-radius:5px;box-shadow:rgba(0,0,0,.3) 0 2px 10px}`,sg=o([de("playground-internal-overlay")],sg);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let ag=class extends ae{constructor(){super(...arguments),this._docCache=new WeakMap,this.lineNumbers=!1,this.lineWrapping=!1,this.readonly=!1,this.noCompletions=!1,this._completionsOpen=!1,this._currentCompletionSelectionLabel="",this._currentCompletionRequestId=0,this.pragmas="on",this._showKeyboardHelp=!1,this._resizing=!1,this._valueChangingFromOutside=!1,this._diagnosticMarkers=[],this._diagnosticsMouseoverListenerActive=!1,this._onMouseOverWithDiagnostics=e=>{var t,i,o;if(!(null===(t=this.diagnostics)||void 0===t?void 0:t.length))return;const r=null===(i=e.target.className)||void 0===i?void 0:i.match(/diagnostic-(\d+)/);if(null===r)return void(this._tooltipDiagnostic=void 0);const n=Number(r[1]),s=this.diagnostics[n];if(s===(null===(o=this._tooltipDiagnostic)||void 0===o?void 0:o.diagnostic))return;let a="";const l=this.getBoundingClientRect(),d=e.target.getBoundingClientRect(),c=l.y+l.height/2;d.y<c?a+=`top:${d.y+d.height-l.y}px;`:a+=`bottom:${l.bottom-d.y}px;`;const h=l.x+l.width/2;d.left<h?a+=`left:${Math.max(0,d.x-l.x)}px`:a+=`right:${Math.max(0,l.right-d.right)}px`,this._tooltipDiagnostic={diagnostic:s,position:a}}}get cursorPosition(){var e;const t=null===(e=this._codemirror)||void 0===e?void 0:e.getCursor("start");return t?{ch:t.ch,line:t.line}:{ch:0,line:0}}get cursorIndex(){const e=this._codemirror;if(!e)return 0;const t=e.getCursor("start");return e.indexFromPos(t)}get tokenUnderCursor(){const e=this._codemirror;if(!e)return{start:0,end:0,string:""};const t=e.getCursor("start"),i=e.getTokenAt(t);return{start:i.start,end:i.end,string:i.string}}get value(){return this._value}set value(e){const t=this._value;this._value=e,this.requestUpdate("value",t)}update(e){var t,i,o,r,n,s;const a=this._codemirror;if(void 0===a)this._createView();else{const l=e;for(const e of l.keys())switch(e){case"documentKey":{const e=null!==(t=this.documentKey)&&void 0!==t?t:{};let r=this._docCache.get(e),n=!1;r?r.getValue()!==this.value&&r.setValue(null!==(o=this.value)&&void 0!==o?o:""):(r=new rg.Doc(null!==(i=this.value)&&void 0!==i?i:"",this._getLanguageMode()),this._docCache.set(e,r),n=!0),this._valueChangingFromOutside=!0,a.swapDoc(r),n&&this._applyHideAndFoldRegions(),this._valueChangingFromOutside=!1;break}case"value":if(l.has("documentKey"))break;this._valueChangingFromOutside=!0,a.setValue(null!==(r=this.value)&&void 0!==r?r:""),this._valueChangingFromOutside=!1;break;case"lineNumbers":a.setOption("lineNumbers",this.lineNumbers);break;case"lineWrapping":this.lineWrapping?a.on("renderLine",this._onRenderLine):a.off("renderLine",this._onRenderLine),a.setOption("lineWrapping",this.lineWrapping);break;case"type":a.setOption("mode",this._getLanguageMode());break;case"readonly":a.setOption("readOnly",this.readonly);break;case"pragmas":this._applyHideAndFoldRegions();break;case"diagnostics":this._showDiagnostics();break;case"cursorIndex":a.setCursor(null!==(n=this.cursorIndex)&&void 0!==n?n:0);break;case"cursorPosition":a.setCursor(null!==(s=this.cursorPosition)&&void 0!==s?s:{ch:0,line:0});break;case"_completions":this._showCompletions()}}super.update(e)}render(){var e,t;return this.readonly?this._cmDom:B` <div id="focusContainer" tabindex="0" @mousedown="${this._onMousedown}" @focus="${this._onFocus}" @blur="${this._onBlur}" @keydown="${this._onKeyDown}"> ${this._showKeyboardHelp?B`<playground-internal-overlay> <p id="keyboardHelp" part="dialog"> Press <strong>Enter</strong> to start editing<br> Press <strong>Escape</strong> to exit editor </p> </playground-internal-overlay>`:j} ${this._cmDom} <div id="tooltip" ?hidden="${!this._tooltipDiagnostic}" style="${jp(null===(e=this._tooltipDiagnostic)||void 0===e?void 0:e.position)}"> <div part="diagnostic-tooltip"> ${null===(t=this._tooltipDiagnostic)||void 0===t?void 0:t.diagnostic.message} </div> </div> </div> `}connectedCallback(){"function"==typeof ResizeObserver&&(this._resizeObserver=new ResizeObserver((()=>{var e;this._resizing||(this._resizing=!0,null===(e=this._codemirror)||void 0===e||e.refresh(),this._resizing=!1)})),this._resizeObserver.observe(this)),super.connectedCallback()}disconnectedCallback(){var e;null===(e=this._resizeObserver)||void 0===e||e.disconnect(),this._resizeObserver=void 0,super.disconnectedCallback()}_createView(){var e;const t=rg((e=>{this._cmDom=e,this._resizing=!0,requestAnimationFrame((()=>{requestAnimationFrame((()=>{var e;null===(e=this._codemirror)||void 0===e||e.refresh(),this._resizing=!1}))}))}),{value:null!==(e=this.value)&&void 0!==e?e:"",lineNumbers:this.lineNumbers,lineWrapping:this.lineWrapping,mode:this._getLanguageMode(),readOnly:this.readonly,inputStyle:"contenteditable",tabindex:-1,extraKeys:{Tab:()=>{var e;t.replaceSelection(Array(null!==(e=t.getOption("indentUnit"))&&void 0!==e?e:2).join(" "))},"Ctrl-Space":()=>{const e=this.tokenUnderCursor.string.trim();this._requestCompletions({isRefinement:!1,tokenUnderCursor:e})},"Ctrl-/":()=>t.toggleComment(),"Cmd-/":()=>t.toggleComment()}});t.on("change",((e,i)=>{this._value=t.getValue(),this._valueChangingFromOutside?(this._applyHideAndFoldRegions(),this._showDiagnostics()):(this.dispatchEvent(new Event("change")),this._requestCompletionsIfNeeded(i))})),this.lineWrapping&&t.on("renderLine",this._onRenderLine),this._codemirror=t}_onRenderLine(e,t,i){const o=e.getOption("lineNumbers")?"0.7em":"4px",r=e.getOption("tabSize")||4,n=rg.countColumn(t.text,null,r);n>0&&(i.style.textIndent=`-${n}ch`,i.style.paddingLeft=`calc(${o} + ${n}ch)`)}_requestCompletionsIfNeeded(e){if(this.noCompletions||!this._currentFiletypeSupportsCompletion()||!this._codemirror)return;const t=this._codemirror.getTokenAt(e.from),i=this.tokenUnderCursor.string.trim(),o=i.trim(),r="+input"===e.origin,n=(i.length>1||"."===t.string)&&r,s="complete"===e.origin;o.length<=0||(s?this._completions=[]:this._requestCompletions({isRefinement:n,tokenUnderCursor:i}))}_requestCompletions({isRefinement:e,tokenUnderCursor:t}){if(this.noCompletions||!this._currentFiletypeSupportsCompletion()||!this._codemirror)return;const i=++this._currentCompletionRequestId,o=this.cursorIndex;this.dispatchEvent(new CustomEvent("request-completions",{detail:{isRefinement:e,fileContent:this.value,tokenUnderCursor:t,cursorIndex:this.cursorIndex,provideCompletions:e=>this._onCompletionsProvided(i,e,o)}}))}_onCompletionsProvided(e,t,i){e===this._currentCompletionRequestId&&i===this.cursorIndex&&(this._completions=t)}_currentFiletypeSupportsCompletion(){return"ts"===this.type}focus(){var e;null===(e=this._codemirrorEditable)||void 0===e||e.focus()}_completionsAsHints(){var e,t;const i=this._codemirror,o=i.getCursor("start"),r=i.getTokenAt(o),n=o.line,s=null!==(t=null===(e=this._completions)||void 0===e?void 0:e.map(((e,t)=>({text:e.text,displayText:e.displayText,render:(i,o,r)=>{const n=r;this._renderHint(i,o,n,0===t?e.details:void 0)},get details(){return e.details}}))))&&void 0!==t?t:[],a={from:{line:n,ch:r.start},to:{line:n,ch:r.end},list:s};return rg.on(a,"select",(async(e,t)=>{var i;this._isCodeEditorHint(e)&&this._currentCompletionSelectionLabel!==e.text&&(null===(i=this._onCompletionSelectedChange)||void 0===i||i.call(this),this._renderHint(t,a,e,e.details))})),rg.on(a,"shown",(()=>{window.requestAnimationFrame((()=>{this._completionsOpen=!0}))})),rg.on(a,"close",(()=>{window.requestAnimationFrame((()=>{this._completionsOpen=!1}))})),a}_isCodeEditorHint(e){return"string"!=typeof e&&Object.prototype.hasOwnProperty.call(e,"details")}_renderHint(e,t,i,o){var r;if(!e)return;const n=t.list.indexOf(i),s=null===(r=this._completions)||void 0===r?void 0:r[n],a=this._buildHintObjectName(i.displayText,s);this._renderCompletionItem(a,e),void 0!==o&&o.then((o=>{this._renderCompletionItemWithDetails(a,o,e),this._onCompletionSelectedChange=()=>this._renderHint(e,t,i),this._currentCompletionSelectionLabel=i.text}))}_renderCompletionItem(e,t){re(B`<span class="hint-object-name">${e}</span>`,t)}_renderCompletionItemWithDetails(e,t,i){re(B`<span class="hint-object-name">${e}</span> <span class="hint-object-details">${t.text}</span> `,i)}_buildHintObjectName(e,t){var i;const o=null!=e?e:"",r=null!==(i=null==t?void 0:t.matches)&&void 0!==i?i:[];if(r.length<=0)return o;const n=r[0].indices[0],s=n[0],a=n[1],l=null==o?void 0:o.substring(0,s),d=null==o?void 0:o.substring(s,a+1),c=null==o?void 0:o.substring(a+1);return B` ${l}<mark>${d}</mark>${c} `}_showCompletions(){const e=this._codemirror;if(!e||!this._completions||this._completions.length<=0)return;const t={hint:this._completionsAsHints.bind(this),completeSingle:!1,closeOnPick:!0,closeOnUnfocus:!0,container:this._focusContainer,alignWithWord:!0};e.showHint(t)}_onMousedown(){var e;null===(e=this._codemirrorEditable)||void 0===e||e.focus()}_onFocus(){this._showKeyboardHelp=!0}_onBlur(){this._showKeyboardHelp=!1}_onKeyDown(e){var t,i;"Enter"===e.key&&e.target===this._focusContainer?(null===(t=this._codemirrorEditable)||void 0===t||t.focus(),e.preventDefault()):"Escape"===e.key&&(this._completionsOpen||null===(i=this._focusContainer)||void 0===i||i.focus())}async _applyHideAndFoldRegions(){const e=this._codemirror;if(!e)return;for(const t of e.getAllMarks())t.clear();if("off-visible"===this.pragmas)return;const t=this._maskPatternForLang();if(void 0===t)return;const i=e.getDoc(),o=(t,o)=>{e.foldCode(0,{widget:"…",rangeFinder:()=>({from:i.posFromIndex(t),to:i.posFromIndex(o)})})},r=(e,t,o)=>{i.markText(i.posFromIndex(e),i.posFromIndex(t),{collapsed:!0,readOnly:o})},n=e.getValue();for(const e of n.matchAll(t)){const[,t,i,s,a]=e,l=e.index;if(void 0===l)continue;const d=l+t.length;r(l,d,!1);const c=d;let h;if(s&&a){h=c+s.length;r(h,h+a.length,!1)}else h=n.length;"on"===this.pragmas&&("fold"===i?o(c,h):"hide"===i&&r(c,h,!0))}}_maskPatternForLang(){switch(this.type){case"js":case"ts":case"css":case"jsx":case"tsx":return/( *\/\* *playground-(?<kind>hide|fold) *\*\/\n?)(?:(.*?)( *\/\* *playground-\k<kind>-end *\*\/\n?))?/gs;case"html":return/( *<!-- *playground-(?<kind>hide|fold) *-->\n?)(?:(.*?)( *<!-- *playground-\k<kind>-end *-->\n?))?/gs;default:return}}_getLanguageMode(){switch(this.type){case"ts":return"google-typescript";case"js":case"json":return"google-javascript";case"html":return"google-html";case"css":return"css";case"jsx":case"tsx":return"jsx"}}_showDiagnostics(){const e=this._codemirror;void 0!==e&&e.operation((()=>{var t,i,o;for(this._tooltipDiagnostic=void 0;this._diagnosticMarkers.length>0;)this._diagnosticMarkers.pop().clear();if(null===(t=this.diagnostics)||void 0===t?void 0:t.length){this._diagnosticsMouseoverListenerActive||(null===(o=this._cmDom)||void 0===o||o.addEventListener("mouseover",this._onMouseOverWithDiagnostics),this._diagnosticsMouseoverListenerActive=!0);for(let t=0;t<this.diagnostics.length;t++){const i=this.diagnostics[t];this._diagnosticMarkers.push(e.markText({line:i.range.start.line,ch:i.range.start.character},{line:i.range.end.line,ch:i.range.end.character},{className:`diagnostic diagnostic-${t}`}))}}else this._diagnosticsMouseoverListenerActive&&(null===(i=this._cmDom)||void 0===i||i.removeEventListener("mouseover",this._onMouseOverWithDiagnostics),this._diagnosticsMouseoverListenerActive=!1)}))}};ag.styles=[u`:host{display:block}#focusContainer{height:100%;position:relative}#focusContainer:focus{outline:0}.CodeMirror{height:100%!important;border-radius:inherit}.CodeMirror-foldmarker{font-family:sans-serif}.CodeMirror-foldmarker:hover{cursor:pointer;color:var(--playground-code-keyword-color,#708)}#keyboardHelp{font-size:18px;font-family:sans-serif;padding:10px 20px}.diagnostic{position:relative}.diagnostic::before{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sJDw4cOCW1/KIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAHElEQVQI12NggIL/DAz/GdA5/xkY/qPKMDAwAADLZwf5rvm+LQAAAABJRU5ErkJggg==);content:'';position:absolute;bottom:0;left:0;width:100%;height:3px}#tooltip{position:absolute;padding:7px;z-index:4;font-family:var(--playground-code-font-family,monospace)}#tooltip>div{background:var(--playground-code-background,#fff);color:var(--playground-code-default-color,#000);border:1px solid var(--playground-code-linenumber-color,#ccc);padding:5px}`,ng],o([he()],ag.prototype,"value",null),o([he({attribute:!1})],ag.prototype,"documentKey",void 0),o([he()],ag.prototype,"type",void 0),o([he({type:Boolean,attribute:"line-numbers",reflect:!0})],ag.prototype,"lineNumbers",void 0),o([he({type:Boolean,attribute:"line-wrapping",reflect:!0})],ag.prototype,"lineWrapping",void 0),o([he({type:Boolean,reflect:!0})],ag.prototype,"readonly",void 0),o([he({type:Boolean,attribute:"no-completions"})],ag.prototype,"noCompletions",void 0),o([he({attribute:!1})],ag.prototype,"diagnostics",void 0),o([ue()],ag.prototype,"_completions",void 0),o([ue()],ag.prototype,"_completionsOpen",void 0),o([he()],ag.prototype,"pragmas",void 0),o([ue()],ag.prototype,"_tooltipDiagnostic",void 0),o([ue()],ag.prototype,"_showKeyboardHelp",void 0),o([fe("#focusContainer")],ag.prototype,"_focusContainer",void 0),o([fe(".CodeMirror-code")],ag.prototype,"_codemirrorEditable",void 0),ag=o([de("playground-code-editor")],ag);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let lg=class extends Zf{constructor(){super(...arguments),this.lineNumbers=!1,this.lineWrapping=!1,this.pragmas="on",this.readonly=!1,this.noCompletions=!1,this._onProjectFilesChanged=()=>{var e,t;null!==(e=this.filename)&&void 0!==e||(this.filename=null===(t=this._files[0])||void 0===t?void 0:t.name),this.requestUpdate()},this._onCompileDone=()=>{this.requestUpdate()},this._onDiagnosticsChanged=()=>{this.requestUpdate()}}get _files(){var e,t;return null!==(t=null===(e=this._project)||void 0===e?void 0:e.files)&&void 0!==t?t:[]}get _currentFile(){return this.filename?this._files.find((e=>e.name===this.filename)):void 0}async update(e){if(e.has("_project")){const t=e.get("_project");t&&(t.removeEventListener("filesChanged",this._onProjectFilesChanged),t.removeEventListener("compileDone",this._onCompileDone),t.removeEventListener("diagnosticsChanged",this._onDiagnosticsChanged)),this._project&&(this._project.addEventListener("filesChanged",this._onProjectFilesChanged),this._project.addEventListener("compileDone",this._onCompileDone),this._project.addEventListener("diagnosticsChanged",this._onDiagnosticsChanged)),this._onProjectFilesChanged()}super.update(e)}render(){var e,t,i,o,r,n;return B` ${this._files?B` <playground-code-editor exportparts="diagnostic-tooltip, dialog" .value="${Ff(null!==(t=null===(e=this._currentFile)||void 0===e?void 0:e.content)&&void 0!==t?t:"")}" .documentKey="${this._currentFile}" .type="${this._currentFile?dg(this._currentFile.contentType):void 0}" .lineNumbers="${this.lineNumbers}" .lineWrapping="${this.lineWrapping}" .readonly="${this.readonly||!this._currentFile}" .pragmas="${this.pragmas}" .diagnostics="${null===(o=null===(i=this._project)||void 0===i?void 0:i.diagnostics)||void 0===o?void 0:o.get(null!==(n=null===(r=this._currentFile)||void 0===r?void 0:r.name)&&void 0!==n?n:"")}" .noCompletions="${this.noCompletions}" @change="${this._onEdit}" @request-completions="${this._onRequestCompletions}"> </playground-code-editor> `:B`<slot></slot>`} `}_onEdit(){void 0!==this._project&&void 0!==this._currentFile&&void 0!==this._editor.value&&this._project.editFile(this._currentFile,this._editor.value)}async _onRequestCompletions(e){var t,i;const o=e.detail;o.fileName=null!==(t=this.filename)&&void 0!==t?t:"";const r=await(null===(i=this._project)||void 0===i?void 0:i.getCompletions(o));r&&o.provideCompletions(r)}};lg.styles=u`:host{display:block;box-sizing:border-box;height:350px}slot{height:100%;display:block;background:var(--playground-code-background,unset)}playground-code-editor{height:100%;border-radius:inherit;border-top-left-radius:0;border-top-right-radius:0}`,o([fe("playground-code-editor")],lg.prototype,"_editor",void 0),o([he()],lg.prototype,"filename",void 0),o([he({type:Boolean,attribute:"line-numbers"})],lg.prototype,"lineNumbers",void 0),o([he({type:Boolean,attribute:"line-wrapping"})],lg.prototype,"lineWrapping",void 0),o([he()],lg.prototype,"pragmas",void 0),o([he({type:Boolean,reflect:!0})],lg.prototype,"readonly",void 0),o([he({type:Boolean,attribute:"no-completions"})],lg.prototype,"noCompletions",void 0),lg=o([de("playground-file-editor")],lg);const dg=e=>{if(void 0===e)return;const t=e.indexOf(";");switch(-1!==t&&(e=e.substring(0,t)),e){case"video/mp2t":return"ts";case"text/javascript":case"application/javascript":return"js";case"text/jsx":return"jsx";case"text/typescript-jsx":return"tsx";case"application/json":return"json";case"text/html":return"html";case"text/css":return"css"}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class cg extends ae{constructor(){super(...arguments),this.indeterminate=!1,this.progress=0,this.buffer=1,this.reverse=!1,this.closed=!1,this.stylePrimaryHalf="",this.stylePrimaryFull="",this.styleSecondaryQuarter="",this.styleSecondaryHalf="",this.styleSecondaryFull="",this.animationReady=!0,this.closedAnimationOff=!1,this.resizeObserver=null}connectedCallback(){super.connectedCallback(),this.rootEl&&this.attachResizeObserver()}render(){const e={"mdc-linear-progress--closed":this.closed,"mdc-linear-progress--closed-animation-off":this.closedAnimationOff,"mdc-linear-progress--indeterminate":this.indeterminate,"mdc-linear-progress--animation-ready":this.animationReady},t={"--mdc-linear-progress-primary-half":this.stylePrimaryHalf,"--mdc-linear-progress-primary-half-neg":""!==this.stylePrimaryHalf?`-${this.stylePrimaryHalf}`:"","--mdc-linear-progress-primary-full":this.stylePrimaryFull,"--mdc-linear-progress-primary-full-neg":""!==this.stylePrimaryFull?`-${this.stylePrimaryFull}`:"","--mdc-linear-progress-secondary-quarter":this.styleSecondaryQuarter,"--mdc-linear-progress-secondary-quarter-neg":""!==this.styleSecondaryQuarter?`-${this.styleSecondaryQuarter}`:"","--mdc-linear-progress-secondary-half":this.styleSecondaryHalf,"--mdc-linear-progress-secondary-half-neg":""!==this.styleSecondaryHalf?`-${this.styleSecondaryHalf}`:"","--mdc-linear-progress-secondary-full":this.styleSecondaryFull,"--mdc-linear-progress-secondary-full-neg":""!==this.styleSecondaryFull?`-${this.styleSecondaryFull}`:""},i={"flex-basis":this.indeterminate?"100%":100*this.buffer+"%"},o={transform:this.indeterminate?"scaleX(1)":`scaleX(${this.progress})`};return B` <div role="progressbar" class="mdc-linear-progress ${Dp(e)}" style="${zp(t)}" dir="${jp(this.reverse?"rtl":void 0)}" aria-label="${jp(this.ariaLabel)}" aria-valuemin="0" aria-valuemax="1" aria-valuenow="${jp(this.indeterminate?void 0:this.progress)}" @transitionend="${this.syncClosedState}"> <div class="mdc-linear-progress__buffer"> <div class="mdc-linear-progress__buffer-bar" style="${zp(i)}"> </div> <div class="mdc-linear-progress__buffer-dots"></div> </div> <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar" style="${zp(o)}"> <span class="mdc-linear-progress__bar-inner"></span> </div> <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar"> <span class="mdc-linear-progress__bar-inner"></span> </div> </div>`}update(e){!e.has("closed")||this.closed&&void 0!==e.get("closed")||this.syncClosedState(),super.update(e)}async firstUpdated(e){super.firstUpdated(e),this.attachResizeObserver()}syncClosedState(){this.closedAnimationOff=this.closed}updated(e){!e.has("indeterminate")&&e.has("reverse")&&this.indeterminate&&this.restartAnimation(),e.has("indeterminate")&&void 0!==e.get("indeterminate")&&this.indeterminate&&window.ResizeObserver&&this.calculateAndSetAnimationDimensions(this.rootEl.offsetWidth),super.updated(e)}disconnectedCallback(){this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),super.disconnectedCallback()}attachResizeObserver(){if(window.ResizeObserver)return this.resizeObserver=new window.ResizeObserver((e=>{if(this.indeterminate)for(const t of e)if(t.contentRect){const e=t.contentRect.width;this.calculateAndSetAnimationDimensions(e)}})),void this.resizeObserver.observe(this.rootEl);this.resizeObserver=null}calculateAndSetAnimationDimensions(e){const t=.8367142*e,i=2.00611057*e,o=.37651913*e,r=.84386165*e,n=1.60277782*e;this.stylePrimaryHalf=`${t}px`,this.stylePrimaryFull=`${i}px`,this.styleSecondaryQuarter=`${o}px`,this.styleSecondaryHalf=`${r}px`,this.styleSecondaryFull=`${n}px`,this.restartAnimation()}async restartAnimation(){this.animationReady=!1,await this.updateComplete,await new Promise(requestAnimationFrame),this.animationReady=!0,await this.updateComplete}open(){this.closed=!1}close(){this.closed=!0}}o([fe(".mdc-linear-progress")],cg.prototype,"rootEl",void 0),o([he({type:Boolean,reflect:!0})],cg.prototype,"indeterminate",void 0),o([he({type:Number})],cg.prototype,"progress",void 0),o([he({type:Number})],cg.prototype,"buffer",void 0),o([he({type:Boolean,reflect:!0})],cg.prototype,"reverse",void 0),o([he({type:Boolean,reflect:!0})],cg.prototype,"closed",void 0),o([Bp,he({attribute:"aria-label"})],cg.prototype,"ariaLabel",void 0),o([ue()],cg.prototype,"stylePrimaryHalf",void 0),o([ue()],cg.prototype,"stylePrimaryFull",void 0),o([ue()],cg.prototype,"styleSecondaryQuarter",void 0),o([ue()],cg.prototype,"styleSecondaryHalf",void 0),o([ue()],cg.prototype,"styleSecondaryFull",void 0),o([ue()],cg.prototype,"animationReady",void 0),o([ue()],cg.prototype,"closedAnimationOff",void 0);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const hg=u`@keyframes mdc-linear-progress-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(.5,0,.701732,.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(.302435,.381352,.55,.956352);transform:translateX(83.67142%);transform:translateX(var(--mdc-linear-progress-primary-half,83.67142%))}100%{transform:translateX(200.611057%);transform:translateX(var(--mdc-linear-progress-primary-full,200.611057%))}}@keyframes mdc-linear-progress-primary-indeterminate-scale{0%{transform:scaleX(.08)}36.65%{animation-timing-function:cubic-bezier(.334731,.12482,.785844,1);transform:scaleX(.08)}69.15%{animation-timing-function:cubic-bezier(.06,.11,.6,1);transform:scaleX(.661479)}100%{transform:scaleX(.08)}}@keyframes mdc-linear-progress-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(.15,0,.515058,.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(.31033,.284058,.8,.733712);transform:translateX(37.651913%);transform:translateX(var(--mdc-linear-progress-secondary-quarter,37.651913%))}48.35%{animation-timing-function:cubic-bezier(.4,.627035,.6,.902026);transform:translateX(84.386165%);transform:translateX(var(--mdc-linear-progress-secondary-half,84.386165%))}100%{transform:translateX(160.277782%);transform:translateX(var(--mdc-linear-progress-secondary-full,160.277782%))}}@keyframes mdc-linear-progress-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(.205028,.057051,.57661,.453971);transform:scaleX(.08)}19.15%{animation-timing-function:cubic-bezier(.152313,.196432,.648374,1.004315);transform:scaleX(.457104)}44.15%{animation-timing-function:cubic-bezier(.257759,-.003163,.211762,1.38179);transform:scaleX(.72796)}100%{transform:scaleX(.08)}}@keyframes mdc-linear-progress-buffering{from{transform:rotate(180deg) translateX(-10px)}}@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(.5,0,.701732,.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(.302435,.381352,.55,.956352);transform:translateX(-83.67142%);transform:translateX(var(--mdc-linear-progress-primary-half-neg,-83.67142%))}100%{transform:translateX(-200.611057%);transform:translateX(var(--mdc-linear-progress-primary-full-neg,-200.611057%))}}@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse{0%{animation-timing-function:cubic-bezier(.15,0,.515058,.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(.31033,.284058,.8,.733712);transform:translateX(-37.651913%);transform:translateX(var(--mdc-linear-progress-secondary-quarter-neg,-37.651913%))}48.35%{animation-timing-function:cubic-bezier(.4,.627035,.6,.902026);transform:translateX(-84.386165%);transform:translateX(var(--mdc-linear-progress-secondary-half-neg,-84.386165%))}100%{transform:translateX(-160.277782%);transform:translateX(var(--mdc-linear-progress-secondary-full-neg,-160.277782%))}}@keyframes mdc-linear-progress-buffering-reverse{from{transform:translateX(-10px)}}.mdc-linear-progress{position:relative;width:100%;transform:translateZ(0);outline:1px solid transparent;overflow:hidden;transition:opacity 250ms 0s cubic-bezier(.4,0,.6,1)}@media screen and (forced-colors:active){.mdc-linear-progress{outline-color:CanvasText}}.mdc-linear-progress__bar{position:absolute;width:100%;height:100%;animation:none;transform-origin:top left;transition:transform 250ms 0s cubic-bezier(.4,0,.6,1)}.mdc-linear-progress__bar-inner{display:inline-block;position:absolute;width:100%;animation:none;border-top-style:solid}.mdc-linear-progress__buffer{display:flex;position:absolute;width:100%;height:100%}.mdc-linear-progress__buffer-dots{background-repeat:repeat-x;flex:auto;transform:rotate(180deg);animation:mdc-linear-progress-buffering 250ms infinite linear}.mdc-linear-progress__buffer-bar{flex:0 1 100%;transition:flex-basis 250ms 0s cubic-bezier(.4,0,.6,1)}.mdc-linear-progress__primary-bar{transform:scaleX(0)}.mdc-linear-progress__secondary-bar{display:none}.mdc-linear-progress--indeterminate .mdc-linear-progress__bar{transition:none}.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{left:-145.166611%}.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{left:-54.888891%;display:block}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation:mdc-linear-progress-primary-indeterminate-translate 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-primary-indeterminate-scale 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation:mdc-linear-progress-secondary-indeterminate-translate 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-secondary-indeterminate-scale 2s infinite linear}.mdc-linear-progress[dir=rtl]:not([dir=ltr]) .mdc-linear-progress__bar,[dir=rtl] .mdc-linear-progress:not([dir=ltr]) .mdc-linear-progress__bar{right:0;-webkit-transform-origin:center right;transform-origin:center right}.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar,[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation-name:mdc-linear-progress-primary-indeterminate-translate-reverse}.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar,[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation-name:mdc-linear-progress-secondary-indeterminate-translate-reverse}.mdc-linear-progress[dir=rtl]:not([dir=ltr]) .mdc-linear-progress__buffer-dots,[dir=rtl] .mdc-linear-progress:not([dir=ltr]) .mdc-linear-progress__buffer-dots{animation:mdc-linear-progress-buffering-reverse 250ms infinite linear;transform:rotate(0)}.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar,[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{right:-145.166611%;left:auto}.mdc-linear-progress[dir=rtl]:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar,[dir=rtl] .mdc-linear-progress:not([dir=ltr]).mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{right:-54.888891%;left:auto}.mdc-linear-progress--closed{opacity:0}.mdc-linear-progress--closed-animation-off .mdc-linear-progress__buffer-dots{animation:none}.mdc-linear-progress--closed-animation-off.mdc-linear-progress--indeterminate .mdc-linear-progress__bar,.mdc-linear-progress--closed-animation-off.mdc-linear-progress--indeterminate .mdc-linear-progress__bar .mdc-linear-progress__bar-inner{animation:none}.mdc-linear-progress__bar-inner{border-color:#6200ee;border-color:var(--mdc-theme-primary,#6200ee)}.mdc-linear-progress__buffer-dots{background-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e6e6e6'/%3E%3C/svg%3E")}.mdc-linear-progress__buffer-bar{background-color:#e6e6e6}.mdc-linear-progress{height:4px}.mdc-linear-progress__bar-inner{border-top-width:4px}.mdc-linear-progress__buffer-dots{background-size:10px 4px}:host{display:block}.mdc-linear-progress__buffer-bar{background-color:#e6e6e6;background-color:var(--mdc-linear-progress-buffer-color,#e6e6e6)}.mdc-linear-progress__buffer-dots{background-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e6e6e6'/%3E%3C/svg%3E");background-image:var(--mdc-linear-progress-buffering-dots-image, url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e6e6e6'/%3E%3C/svg%3E"))}`
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let ug=class extends cg{};ug.styles=[hg],ug=o([de("mwc-linear-progress")],ug);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let pg=class extends Zf{constructor(){super(),this.htmlFile="index.html",this.location="Result",this._loading=!0,this._showLoadingBar=!1,this._loadedAtLeastOnce=!1,this.reload=()=>{const e=this.iframe;if(!e)return;const{parentNode:t,nextSibling:i}=e;t&&e.remove(),e.src="",e.src=this._indexUrl,t&&t.insertBefore(e,i),this._loading=!0,this._showLoadingBar=!0},void 0===navigator.serviceWorker&&(this._error=B`<p> <b>Sorry!</b> Preview unavailable because this browser doesn't <a href="https://caniuse.com/serviceworkers" target="_blank" rel="noopener">support</a> service workers. </p> <p> <i>Note: Firefox <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1320796" target="_blank" rel="noopener">doesn't</a> support service workers in private browsing mode.</i> </p> `)}update(e){if(e.has("_project")){const t=e.get("_project");t&&(t.removeEventListener("urlChanged",this.reload),t.removeEventListener("compileStart",this.reload)),this._project&&(this._project.addEventListener("urlChanged",this.reload),this._project.addEventListener("compileStart",this.reload))}super.update(e)}get _indexUrl(){var e;const t=null===(e=this._project)||void 0===e?void 0:e.baseUrl;if(!t||!this.htmlFile)return"";return new URL(this.htmlFile,t).toString()}render(){return B` <div id="toolbar" part="preview-toolbar"> <span id="location" part="preview-location"> ${this.location}</span> <mwc-icon-button id="reload-button" aria-label="Reload preview" part="preview-reload-button" ?disabled="${!this._indexUrl}" @click="${this.reload}"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentcolor" width="18px" height="18px"> <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/> </svg> </mwc-icon-button> </div> <div id="content" class="${Dp({error:!!this._error})}"> <mwc-linear-progress aria-hidden="${this._loading?"false":"true"}" part="preview-loading-indicator" indeterminate ?closed="${!this._showLoadingBar}"></mwc-linear-progress> ${this._loadedAtLeastOnce?j:B`<slot></slot>`} <iframe title="Project preview" @load="${this._onIframeLoad}" ?hidden="${!this._loadedAtLeastOnce}"></iframe> </div> ${this._error?B` <playground-internal-overlay id="error"> ${this._error}</playground-internal-overlay> `:j} `}updated(){this.iframe&&this.iframe.src!==this._indexUrl&&(this.iframe.src=this._indexUrl)}async firstUpdated(){var e,t;this._loading&&!this._slotHasAnyVisibleChildren()&&(this._showLoadingBar=!0);const i=this.shadowRoot.querySelector("mwc-linear-progress");await i.updateComplete,null===(t=null===(e=i.shadowRoot)||void 0===e?void 0:e.querySelector("[role=progressbar]"))||void 0===t||t.setAttribute("aria-label","Preview is loading")}_slotHasAnyVisibleChildren(){var e;const t=null===(e=this._slot)||void 0===e?void 0:e.assignedNodes({flatten:!0});if(!t)return!1;for(const e of t)if(e.nodeType!==Node.COMMENT_NODE&&(e.nodeType!==Node.TEXT_NODE||""!==(e.textContent||"").trim()))return!0;return!1}_onIframeLoad(){this._indexUrl&&(this._loading=!1,this._loadedAtLeastOnce=!0,this._showLoadingBar=!1)}};pg.styles=u`:host{display:flex;flex-direction:column;background:#fff;font-family:sans-serif;height:350px;position:relative}#toolbar{flex:0 0 var(--playground-bar-height,40px);display:flex;align-items:center;justify-content:space-between;border-bottom:var(--playground-border,solid 1px #ddd);font-size:15px;color:var(--playground-preview-toolbar-foreground-color,#444);border-radius:inherit;border-bottom-left-radius:0;border-bottom-right-radius:0;background:var(--playground-preview-toolbar-background,#fff)}#location{margin:0 10px}#reload-button{--mdc-icon-button-size:30px;--mdc-icon-size:18px}#content{max-height:100%;position:relative;flex:1}#content.error{display:none}#error{padding:0 20px}mwc-linear-progress{zoom:.5;--mdc-linear-progress-buffer-color:transparent;position:absolute;top:-6px;width:100%;--mdc-theme-primary:var(--playground-highlight-color, #6200ee)}iframe,slot{width:100%;height:100%}iframe{border:none}[hidden]{display:none}`,o([he({attribute:"html-file"})],pg.prototype,"htmlFile",void 0),o([he()],pg.prototype,"location",void 0),o([fe("iframe",!0)],pg.prototype,"iframe",void 0),o([fe("slot")],pg.prototype,"_slot",void 0),o([ue()],pg.prototype,"_loading",void 0),o([ue()],pg.prototype,"_showLoadingBar",void 0),o([ue()],pg.prototype,"_loadedAtLeastOnce",void 0),o([ue()],pg.prototype,"_error",void 0),pg=o([de("playground-preview")],pg);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let mg=class extends ae{constructor(){super(...arguments),this.sandboxBaseUrl="https://unpkg.com/playground-elements@0.17.0/",this.sandboxScope="__playground_swfs_1dae6563/",this.editableFileSystem=!1,this.lineNumbers=!1,this.lineWrapping=!1,this.resizable=!1,this.pragmas="on",this.htmlFile="index.html",this.noCompletions=!1}get projectSrc(){var e,t;return null!==(t=null===(e=this._project)||void 0===e?void 0:e.projectSrc)&&void 0!==t?t:this._projectSrcSetBeforeRender}set projectSrc(e){const t=this._project;t?t.projectSrc=e:this._projectSrcSetBeforeRender=e}get config(){var e,t;return null!==(t=null===(e=this._project)||void 0===e?void 0:e.config)&&void 0!==t?t:this._configSetBeforeRender}set config(e){const t=this._project;t?t.config=e:this._configSetBeforeRender=e}get modified(){var e,t;return null!==(t=null===(e=this._project)||void 0===e?void 0:e.modified)&&void 0!==t&&t}render(){const e="project",t="editor";return B` <playground-project id="${e}" .sandboxBaseUrl="${this.sandboxBaseUrl}" .sandboxScope="${this.sandboxScope}"> <slot></slot> </playground-project> <div id="lhs"> <playground-tab-bar part="tab-bar" .project="${e}" .editor="${t}" .editableFileSystem="${this.editableFileSystem}"> </playground-tab-bar> <playground-file-editor id="${t}" part="editor" .lineNumbers="${this.lineNumbers}" .lineWrapping="${this.lineWrapping}" .project="${e}" .pragmas="${this.pragmas}" .noCompletions="${this.noCompletions}"> </playground-file-editor> </div> <div id="rhs"> ${this.resizable?B`<div id="resizeBar" @pointerdown="${this._onResizeBarPointerdown}"></div>`:j} <playground-preview part="preview" exportparts="preview-toolbar,
                       preview-location,
                       preview-reload-button,
                       preview-loading-indicator,
                       diagnostic-tooltip,
                       dialog" .htmlFile="${this.htmlFile}" .project="${e}"></playground-preview> </div> `}firstUpdated(){this._configSetBeforeRender&&(this._project.config=this._configSetBeforeRender,this._configSetBeforeRender=void 0),this._projectSrcSetBeforeRender&&(this._project.projectSrc=this._projectSrcSetBeforeRender,this._projectSrcSetBeforeRender=void 0)}async update(e){var t;e.has("resizable")&&!1===this.resizable&&(null===(t=this._rhs)||void 0===t||t.style.removeProperty("--playground-preview-width")),super.update(e)}_onResizeBarPointerdown({pointerId:e}){const t=this._resizeBar;t.setPointerCapture(e);const i=this._rhs.style,{left:o,right:r}=this.getBoundingClientRect(),n=r-o,s=n-100,a=e=>{const t=Math.min(s,Math.max(100,r-e.clientX))/n*100;i.setProperty("--playground-preview-width",`${t}%`)};t.addEventListener("pointermove",a);const l=()=>{t.releasePointerCapture(e),t.removeEventListener("pointermove",a),t.removeEventListener("pointerup",l)};t.addEventListener("pointerup",l)}};mg.styles=u`:host{display:flex;height:350px;min-width:200px;border:var(--playground-border,solid 1px #ddd);isolation:isolate}#lhs{display:flex;flex-direction:column;height:100%;flex:1;min-width:100px;border-radius:inherit;border-top-right-radius:0;border-bottom-right-radius:0;border-right:var(--playground-border,solid 1px #ddd)}playground-tab-bar{flex-shrink:0}playground-file-editor{flex:1;height:calc(100% - var(--playground-bar-height,40px))}#rhs{height:100%;width:max(100px,var(--playground-preview-width,30%));position:relative;border-radius:inherit}playground-preview{height:100%;width:100%;border-radius:inherit;border-top-left-radius:0;border-bottom-left-radius:0}slot{display:none}#resizeBar{position:absolute;top:0;left:-5px;width:10px;height:100%;z-index:9;cursor:col-resize}#resizeOverlay{display:none}#resizeOverlay.resizing{display:block;position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;cursor:col-resize}`,o([he({attribute:"project-src",hasChanged:()=>!1})],mg.prototype,"projectSrc",null),o([he({attribute:!1,hasChanged:()=>!1})],mg.prototype,"config",null),o([he({attribute:"sandbox-base-url"})],mg.prototype,"sandboxBaseUrl",void 0),o([he({attribute:"sandbox-scope"})],mg.prototype,"sandboxScope",void 0),o([he({type:Boolean,attribute:"editable-file-system"})],mg.prototype,"editableFileSystem",void 0),o([he({type:Boolean,attribute:"line-numbers"})],mg.prototype,"lineNumbers",void 0),o([he({type:Boolean,attribute:"line-wrapping"})],mg.prototype,"lineWrapping",void 0),o([he({type:Boolean})],mg.prototype,"resizable",void 0),o([he()],mg.prototype,"pragmas",void 0),o([he({attribute:"html-file"})],mg.prototype,"htmlFile",void 0),o([he({type:Boolean,attribute:"no-completions"})],mg.prototype,"noCompletions",void 0),o([fe("playground-project")],mg.prototype,"_project",void 0),o([fe("#resizeBar")],mg.prototype,"_resizeBar",void 0),o([fe("#rhs")],mg.prototype,"_rhs",void 0),mg=o([de("playground-ide")],mg),window.customElements.define("site-style",Me),new URL(new URL("7e15b7e0.svg",import.meta.url).href,import.meta.url).href;class fg extends ae{constructor(){super(),this.title="My app",this.selectedToy="CatalogData",this.toys={ArticlesData:{name:"UVA Library Article Search",query:"food"},CatalogData:{name:"UVA Library Catalog",query:"football"},DHatData:{name:"DH@UVA Entities"},EventsData:{name:"Events at the Library",query:"data"},LibGuidesData:{name:"Libguides at the Library",query:"3d"},LibrariesData:{name:"Libraries",query:"clemons"},PageData:{name:"Pages from the Library Website",query:"about"},PersonData:{name:"Library Staff",query:"chestnut"},WebsiteData:{name:"Mixed data from the Library Website",query:"Unsworth"}},this.example=this.loadExample(this.selectedToy)}selectToy(e){const t=e.currentTarget;this.selectedToy=t.value,this.example=this.loadExample(this.selectedToy)}mkPlayground(e,t){return`\n    <playground-ide editable-file-system line-numbers resizable>\n      <script type="sample/html" filename="index.html">\n        <!doctype html>\n        <body>\n          <site-style>\n          ${t} \n          <site-style>\n          <script type="module" src="./index.js">&lt;/script>          \n        </body>\n      <\/script>\n      <script type="sample/ts" filename="index.ts">\n        import "@uvalib/site-style/site-style.js";\n        ${e}\n      <\/script>\n    </playground-ide>    \n    `}loadExample(e){const t=this.toys[e];return`\n      <h2>Example of <a href="https://github.com/uvalib/monorepo/tree/main/packages/data-wrap">${this.selectedToy}</a> (${t.name})</h2>\n      ${this.mkPlayground(`\n        // We are using a site-data-grid to stuff results into\n        import "@uvalib/site-components/site-data-grid.js";\n\n        // You need the module\n        import { ${this.selectedToy} } from '@uvalib/data-wrap';\n\n        // Just getting the elements to show the results in\n        const resultJar = document.getElementById("results");\n        const metaJar = document.getElementById("resultMeta");\n\n        // A sample query and then make the results visible!\n        new ${this.selectedToy}({query:"${t.query}"}).fetchData().then(results=>{\n          metaJar.innerHTML="Search has "+results.meta.totalResults+" results!";\n          resultJar.rowsData = results.items.map(r=>({Title:r.title}));\n        });        \n      `,`\n        <h1>Search Results from ${this.selectedToy}</h1>\n        <p id="resultMeta"></p>\n        <site-data-grid id="results"></site-data-grid>     \n      `)}   \n    `}render(){return B` <site-style> <site-header></site-header> <main> <h1>UVA Library Web Dev Sandbox</h1> <site-tabs activeid="dataWrap"> <site-tab id="dataWrap">Library Data</site-tab> <site-tab id="siteComponents">Site Components</site-tab> <site-tab id="siteWidgets">Site Widgets</site-tab> <site-tab-panel id="dataWrapPanel"> <div id="selectToy"> <site-select @change="${this.selectToy}"> ${Object.keys(this.toys).map((e=>B`<site-option ?selected="${e===this.selectedToy}" value="${e}">${e}</site-option>`))} </site-select> </div> ${Te(this.example)} </site-tab-panel> <site-tab-panel id="siteComponentsPanel"> <p><a href="https://github.com/uvalib/monorepo/tree/main/packages/site-components">Site Components</a> are base web components used to make more complex components and widgets. These components are custom named and styled implemetations of <a href="https://www.fast.design/">FAST Components</a>.</p> <div> <h2>&lt;site-avatar&gt;</h2> <div> ${Te(this.mkPlayground('\n                // Get the module\n                import "@uvalib/site-components/site-avatar.js";\n              ','\n              <div>\n                <site-avatar src="https://www.library.virginia.edu/sites/default/files/styles/bio_page_photo/public/2020-05/unsworth.jpg?itok=FFjEtOQg"></site-avatar>\n              </div>\n              '))} </div> <h2>&lt;site-button&gt;</h2> <div> ${Te(this.mkPlayground('\n                // Get the module\n                import "@uvalib/site-components/site-button.js";\n              ',"\n              <div>\n                <site-button>Click Me</site-button>\n              </div>\n              "))} </div> <h2>&lt;site-card&gt;</h2> <div> ${Te(this.mkPlayground('\n                // Get the module\n                import "@uvalib/site-components/site-card.js";\n              ',"\n              <div>\n                <site-card>\n                  <h3>Card title</h3>\n                  <p>At purus lectus quis habitant commodo, cras. Aliquam malesuada velit a tortor. Felis orci tellus netus risus et ultricies augue aliquet.</p>\n                </site-card>\n              </div>\n              "))} </div> <h2>&lt;site-data-grid&gt;</h2> <div> ${Te(this.mkPlayground('\n                // Get the module\n                import "@uvalib/site-components/site-data-grid.js";\n\n                // populate the grid by adding an array to the rowsData property\n                const grid = document.querySelector("site-data-grid");\n                \n                grid.rowsData = [{"column 1":"value","column 2":"value"},{"column 1":"another value","column 2":"another value"}]                \n              ',"\n                <site-data-grid></site-data-grid>               \n              "))} </div> <h2>&lt;site-select&gt;</h2> <div> ${Te(this.mkPlayground('\n              // Get the module\n              import "@uvalib/site-components/site-select.js";\n    \n              // listen to the select\n              const select = document.querySelector("site-select");\n              select.addEventListener(\'change\',(e)=>console.log(e.target.value))\n            ',"\n              <site-select>\n                <site-option>Option #1</site-option>\n                <site-option>Option #2</site-option>\n              </site-select>            \n            "))} </div> <h2>&lt;site-tabs&gt;</h2> <div> ${Te(this.mkPlayground('\n                // Get the module\n                import "@uvalib/site-components/site-tabs.js";\n              ',"\n                <site-tabs>\n                  <site-tab>Tab one</site-tab>\n                  <site-tab>Tab two</site-tab>\n                  <site-tab>Tab three</site-tab>\n                  <site-tab-panel>Tab panel 1</site-tab-panel>\n                  <site-tab-panel>Tab panel 2</site-tab-panel>\n                  <site-tab-panel>Tab panel 3</site-tab-panel>\n                </site-tabs> \n              "))} </div> <h2>&lt;site-switch&gt;</h2> <div> ${Te(this.mkPlayground('\n                // Get the module\n                import "@uvalib/site-components/site-switch.js";\n              ','\n              <div>\n                <site-switch></site-switch>\n              </div>\n\n              <div>\n                <site-switch>\n                  Theme\n                  <span slot="checked-message">Dark</span>\n                  <span slot="unchecked-message">Light</span>\n                </site-switch>\n              </div>  \n              '))} </div> </div> </site-tab-panel> <site-tab-panel id="siteWidgetsPanel"> <p>Site Widgets are web components that are usually made from other base componets, widgets and libraries.</p> <div> <h2><a href="https://github.com/uvalib/monorepo/tree/main/packages/site-header">&lt;site-header&gt;</a></h2> <div> ${Te(this.mkPlayground('\n                // Get the module\n                import "@uvalib/site-header/site-header.js";\n              ',"\n                <site-header></site-header>\n              "))} </div> <h2><a href="https://github.com/uvalib/monorepo/tree/main/packages/bento-box">&lt;bento-box&gt;</a></h2> <div> ${Te(this.mkPlayground('\n                // load the module\n                import "@uvalib/bento-box/bento-box.js";\n              ',"\n                <bento-box></bento-box>\n              "))} </div> <h2><a href="https://github.com/uvalib/monorepo/tree/main/packages/bento-box">&lt;events-section&gt;</a></h2> <div> ${Te(this.mkPlayground('\n                // load the module\n                import "@uvalib/bento-box/events-section.js";\n              ','\n                <events-section limit="5"></events-section>\n              '))} </div> <h2><a href="https://github.com/uvalib/monorepo/tree/main/packages/site-hours">&lt;site-hours-section&gt;</a></h2> <div> ${Te(this.mkPlayground('\n                // load the module\n                import "@uvalib/site-hours/site-hours-section.js";\n              ',"\n                <site-hours-section limited></site-hours-section>\n              "))} </div> </div></site-tab-panel> </site-tabs> </main> </site-style> `}}fg.styles=u`:host{min-height:100vh;display:block}`,o([he({type:String})],fg.prototype,"title",void 0),o([he({type:String,attribute:"selected-toy"})],fg.prototype,"selectedToy",void 0),o([he({type:Object})],fg.prototype,"example",void 0),o([he({type:Object})],fg.prototype,"toys",void 0),customElements.define("site-mock",fg);export{zh as A,Yh as B,Dh as C,Nh as D,Rh as G,Ph as W,o as _,s as a,n as b,he as e,Te as o,Zh as r,B as y};