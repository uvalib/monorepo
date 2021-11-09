import { a as a$2, i as i$2 } from './reactive-element-c96285eb.js';
import './uvalib-icon-d71aa8c2.js';
import './lit-element-b0aa61ba.js';

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t,i$1,s$1,e;const o$1=globalThis.trustedTypes,l$1=o$1?o$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,n$1=`lit$${(Math.random()+"").slice(9)}$`,h$1="?"+n$1,r=`<${h$1}>`,u=document,c=(t="")=>u.createComment(t),d=t=>null===t||"object"!=typeof t&&"function"!=typeof t,v=Array.isArray,a$1=t=>{var i;return v(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,$=/'/g,g=/"/g,y=/^(?:script|style|textarea)$/i,b=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),T=b(1),w=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),P=new WeakMap,V=(t,i,s)=>{var e,o;const l=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let n=l._$litPart$;if(void 0===n){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;l._$litPart$=n=new C(i.insertBefore(c(),t),t,void 0,s);}return n.I(t),n},E=u.createTreeWalker(u,129,null,!1),M=(t,i)=>{const s=t.length-1,e=[];let o,h=2===i?"<svg>":"",u=f;for(let i=0;i<s;i++){const s=t[i];let l,c,d=-1,v=0;for(;v<s.length&&(u.lastIndex=v,c=u.exec(s),null!==c);)v=u.lastIndex,u===f?"!--"===c[1]?u=_:void 0!==c[1]?u=m:void 0!==c[2]?(y.test(c[2])&&(o=RegExp("</"+c[2],"g")),u=p):void 0!==c[3]&&(u=p):u===p?">"===c[0]?(u=null!=o?o:f,d=-1):void 0===c[1]?d=-2:(d=u.lastIndex-c[2].length,l=c[1],u=void 0===c[3]?p:'"'===c[3]?g:$):u===g||u===$?u=p:u===_||u===m?u=f:(u=p,o=void 0);const a=u===p&&t[i+1].startsWith("/>")?" ":"";h+=u===f?s+r:d>=0?(e.push(l),s.slice(0,d)+"$lit$"+s.slice(d)+n$1+a):s+n$1+(-2===d?(e.push(void 0),i):a);}const c=h+(t[s]||"<?>")+(2===i?"</svg>":"");return [void 0!==l$1?l$1.createHTML(c):c,e]};class N{constructor({strings:t,_$litType$:i},s){let e;this.parts=[];let l=0,r=0;const u=t.length-1,d=this.parts,[v,a]=M(t,i);if(this.el=N.createElement(v,s),E.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(e=E.nextNode())&&d.length<u;){if(1===e.nodeType){if(e.hasAttributes()){const t=[];for(const i of e.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(n$1)){const s=a[r++];if(t.push(i),void 0!==s){const t=e.getAttribute(s.toLowerCase()+"$lit$").split(n$1),i=/([.?@])?(.*)/.exec(s);d.push({type:1,index:l,name:i[2],strings:t,ctor:"."===i[1]?I:"?"===i[1]?L:"@"===i[1]?R:H});}else d.push({type:6,index:l});}for(const i of t)e.removeAttribute(i);}if(y.test(e.tagName)){const t=e.textContent.split(n$1),i=t.length-1;if(i>0){e.textContent=o$1?o$1.emptyScript:"";for(let s=0;s<i;s++)e.append(t[s],c()),E.nextNode(),d.push({type:2,index:++l});e.append(t[i],c());}}}else if(8===e.nodeType)if(e.data===h$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=e.data.indexOf(n$1,t+1));)d.push({type:7,index:l}),t+=n$1.length-1;}l++;}}static createElement(t,i){const s=u.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){var o,l,n,h;if(i===w)return i;let r=void 0!==e?null===(o=s.Σi)||void 0===o?void 0:o[e]:s.Σo;const u=d(i)?void 0:i._$litDirective$;return (null==r?void 0:r.constructor)!==u&&(null===(l=null==r?void 0:r.O)||void 0===l||l.call(r,!1),void 0===u?r=void 0:(r=new u(t),r.T(t,s,e)),void 0!==e?(null!==(n=(h=s).Σi)&&void 0!==n?n:h.Σi=[])[e]=r:s.Σo=r),void 0!==r&&(i=S(t,r.S(t,i.values),r,e)),i}class k{constructor(t,i){this.l=[],this.N=void 0,this.D=t,this.M=i;}u(t){var i;const{el:{content:s},parts:e}=this.D,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:u).importNode(s,!0);E.currentNode=o;let l=E.nextNode(),n=0,h=0,r=e[0];for(;void 0!==r;){if(n===r.index){let i;2===r.type?i=new C(l,l.nextSibling,this,t):1===r.type?i=new r.ctor(l,r.name,r.strings,this,t):6===r.type&&(i=new z(l,this,t)),this.l.push(i),r=e[++h];}n!==(null==r?void 0:r.index)&&(l=E.nextNode(),n++);}return o}v(t){let i=0;for(const s of this.l)void 0!==s&&(void 0!==s.strings?(s.I(t,s,i),i+=s.strings.length-2):s.I(t[i])),i++;}}class C{constructor(t,i,s,e){this.type=2,this.N=void 0,this.A=t,this.B=i,this.M=s,this.options=e;}setConnected(t){var i;null===(i=this.P)||void 0===i||i.call(this,t);}get parentNode(){return this.A.parentNode}get startNode(){return this.A}get endNode(){return this.B}I(t,i=this){t=S(this,t,i),d(t)?t===A||null==t||""===t?(this.H!==A&&this.R(),this.H=A):t!==this.H&&t!==w&&this.m(t):void 0!==t._$litType$?this._(t):void 0!==t.nodeType?this.$(t):a$1(t)?this.g(t):this.m(t);}k(t,i=this.B){return this.A.parentNode.insertBefore(t,i)}$(t){this.H!==t&&(this.R(),this.H=this.k(t));}m(t){const i=this.A.nextSibling;null!==i&&3===i.nodeType&&(null===this.B?null===i.nextSibling:i===this.B.previousSibling)?i.data=t:this.$(u.createTextNode(t)),this.H=t;}_(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this.C(t):(void 0===e.el&&(e.el=N.createElement(e.h,this.options)),e);if((null===(i=this.H)||void 0===i?void 0:i.D)===o)this.H.v(s);else {const t=new k(o,this),i=t.u(this.options);t.v(s),this.$(i),this.H=t;}}C(t){let i=P.get(t.strings);return void 0===i&&P.set(t.strings,i=new N(t)),i}g(t){v(this.H)||(this.H=[],this.R());const i=this.H;let s,e=0;for(const o of t)e===i.length?i.push(s=new C(this.k(c()),this.k(c()),this,this.options)):s=i[e],s.I(o),e++;e<i.length&&(this.R(s&&s.B.nextSibling,e),i.length=e);}R(t=this.A.nextSibling,i){var s;for(null===(s=this.P)||void 0===s||s.call(this,!1,!0,i);t&&t!==this.B;){const i=t.nextSibling;t.remove(),t=i;}}}class H{constructor(t,i,s,e,o){this.type=1,this.H=A,this.N=void 0,this.V=void 0,this.element=t,this.name=i,this.M=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this.H=Array(s.length-1).fill(A),this.strings=s):this.H=A;}get tagName(){return this.element.tagName}I(t,i=this,s,e){const o=this.strings;let l=!1;if(void 0===o)t=S(this,t,i,0),l=!d(t)||t!==this.H&&t!==w,l&&(this.H=t);else {const e=t;let n,h;for(t=o[0],n=0;n<o.length-1;n++)h=S(this,e[s+n],i,n),h===w&&(h=this.H[n]),l||(l=!d(h)||h!==this.H[n]),h===A?t=A:t!==A&&(t+=(null!=h?h:"")+o[n+1]),this.H[n]=h;}l&&!e&&this.W(t);}W(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class I extends H{constructor(){super(...arguments),this.type=3;}W(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}W(t){t&&t!==A?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name);}}class R extends H{constructor(){super(...arguments),this.type=5;}I(t,i=this){var s;if((t=null!==(s=S(this,t,i,0))&&void 0!==s?s:A)===w)return;const e=this.H,o=t===A&&e!==A||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,l=t!==A&&(e===A||o);o&&this.element.removeEventListener(this.name,this,e),l&&this.element.addEventListener(this.name,this,t),this.H=t;}handleEvent(t){var i,s;"function"==typeof this.H?this.H.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this.H.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this.N=void 0,this.V=void 0,this.M=i,this.options=s;}I(t){S(this,t);}}null===(i$1=(t=globalThis).litHtmlPlatformSupport)||void 0===i$1||i$1.call(t,N,C),(null!==(s$1=(e=globalThis).litHtmlVersions)&&void 0!==s$1?s$1:e.litHtmlVersions=[]).push("2.0.0-rc.3");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var i,l,o,s,n,a;(null!==(i=(a=globalThis).litElementVersions)&&void 0!==i?i:a.litElementVersions=[]).push("3.0.0-rc.2");class h extends a$2{constructor(){super(...arguments),this.renderOptions={host:this},this.Φt=void 0;}createRenderRoot(){var t,e;const r=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=r.firstChild),r}update(t){const r=this.render();super.update(t),this.Φt=V(r,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this.Φt)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this.Φt)||void 0===t||t.setConnected(!1);}render(){return w}}h.finalized=!0,h._$litElement$=!0,null===(o=(l=globalThis).litElementHydrateSupport)||void 0===o||o.call(l,{LitElement:h}),null===(n=(s=globalThis).litElementPlatformSupport)||void 0===n||n.call(s,{LitElement:h});

const UvalibAnalyticsMixin = (superClass) => class extends superClass {
    _analyticsEvent(events, eventTarget=null) {
        let target = eventTarget? eventTarget: this;
        target.dispatchEvent(new CustomEvent("uvalib-analytics-event", {
            detail: {event:events}, bubbles: true, composed: true
        }));
    }
    _analyticsSearch(query, category=null, count=null, eventTarget=null) {
        let target = eventTarget? eventTarget: this;        
        target.dispatchEvent(new CustomEvent("uvalib-analytics-search", {
            detail: {searchQuery:query, searchCategory:category, resultCount:count}, bubbles: true, composed: true
        }));
    }
};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */console.warn("The main 'lit-element' module entrypoint is deprecated. Please update your imports to use the 'lit' package: 'lit' and 'lit/decorators.ts' or import from 'lit-element/lit-element.ts'.");

var style = i$2`
@import url("https://use.typekit.net/tgy5tlj.css");:host{display:inline-block;position:relative}:host .wrapper{fill:#232d4b;background-color:#fff}.wrapper button:focus,:host(:focus) .wrapper button,:host(:hover) .wrapper button{fill:#fff;background-color:#232d4b}.wrapper{position:relative}#image[enlargable]{cursor:pointer}img{display:block;max-width:100%;vertical-align:middle}button{fill:inherit;background-color:inherit;border:none;border-radius:50%;cursor:pointer;display:inline-block;font-size:18px;margin:4px 2px;padding:.4em .45em;right:5px;text-align:center;text-decoration:none;top:5px}.sr-only,button{position:absolute}.sr-only{clip:rect(1px,1px,1px,1px);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;width:1px}
`;

// BigPicture.js | license MIT | henrygd.me/bigpicture

// trigger element used to open popup
let el;

// set to true after first interaction
let initialized;

// container element holding html needed for script
let container;

// currently active display element (image, video, youtube / vimeo iframe container)
let displayElement;

// popup image element
let displayImage;

// popup video element
let displayVideo;

// popup audio element
let displayAudio;

// container element to hold youtube / vimeo iframe
let iframeContainer;

// iframe to hold youtube / vimeo player
let iframeSiteVid;

// store requested image source
let imgSrc;

// button that closes the container
let closeButton;

// youtube / vimeo video id
let siteVidID;

// keeps track of loading icon display state
let isLoading;

// timeout to check video status while loading
let checkMediaTimeout;

// loading icon element
let loadingIcon;

// caption element
let caption;

// caption content element
let captionText;

// store caption content
let captionContent;

// hide caption button element
let captionHideButton;

// open state for container element
let isOpen;

// gallery open state
let galleryOpen;

// used during close animation to avoid triggering timeout twice
let isClosing;

// array of prev viewed image urls to check if cached before showing loading icon
const imgCache = [];

// store whether image requested is remote or local
let remoteImage;

// store animation opening callbacks
let animationStart;
let animationEnd;

// store changeGalleryImage callback
let onChangeImage;

// gallery left / right icons
let rightArrowBtn;

let leftArrowBtn;

// position of gallery
let galleryPosition;

// hold active gallery els / image src
let galleryEls;

// counter element
let galleryCounter;

// store images in gallery that are being loaded
let preloadedImages = {};

// whether device supports touch events
let supportsTouch;

// options object
let opts;

// Save bytes in the minified version
const appendEl = 'appendChild';
const createEl = 'createElement';
const removeEl = 'removeChild';

var BigPicture = (options) => {
	// initialize called on initial open to create elements / style / event handlers
	initialized || initialize();

	// clear currently loading stuff
	if (isLoading) {
		clearTimeout(checkMediaTimeout);
		removeContainer();
	}

	opts = options;

	// store video id if youtube / vimeo video is requested
	siteVidID = options.ytSrc || options.vimeoSrc;

	// store optional callbacks
	animationStart = options.animationStart;
	animationEnd = options.animationEnd;
	onChangeImage = options.onChangeImage;

	// set trigger element
	el = options.el;

	// wipe existing remoteImage state
	remoteImage = false;

	// set caption if provided
	captionContent = el.getAttribute('data-caption');

	if (options.gallery) {
		makeGallery(options.gallery, options.position);
	} else if (siteVidID || options.iframeSrc) {
		// if vimeo, youtube, or iframe video
		// toggleLoadingIcon(true)
		displayElement = iframeContainer;
		createIframe();
	} else if (options.imgSrc) {
		// if remote image
		remoteImage = true;
		imgSrc = options.imgSrc;
		!~imgCache.indexOf(imgSrc) && toggleLoadingIcon(true);
		displayElement = displayImage;
		displayElement.src = imgSrc;
	} else if (options.audio) {
		// if direct video link
		toggleLoadingIcon(true);
		displayElement = displayAudio;
		displayElement.src = options.audio;
		checkMedia('audio file');
	} else if (options.vidSrc) {
		// if direct video link
		toggleLoadingIcon(true);
		if (options.dimensions) {
			changeCSS(displayVideo, `width:${options.dimensions[0]}px`);
		}
		makeVidSrc(options.vidSrc);
		checkMedia('video');
	} else {
		// local image / background image already loaded on page
		displayElement = displayImage;
		// get img source or element background image
		displayElement.src =
			el.tagName === 'IMG'
				? el.src
				: window
						.getComputedStyle(el)
						.backgroundImage.replace(/^url|[(|)|'|"]/g, '');
	}

	// add container to page
	container[appendEl](displayElement);
	document.body[appendEl](container);
	return {
		close,
		next: () => updateGallery(1),
		prev: () => updateGallery(-1),
	}
};

// create all needed methods / store dom elements on first use
function initialize() {
	let startX;
	// return close button elements
	function createCloseButton(className) {
		const el = document[createEl]('button');
		el.className = className;
		el.innerHTML =
			'<svg viewBox="0 0 48 48"><path d="M28 24L47 5a3 3 0 1 0-4-4L24 20 5 1a3 3 0 1 0-4 4l19 19L1 43a3 3 0 1 0 4 4l19-19 19 19a3 3 0 0 0 4 0v-4L28 24z"/></svg>';
		return el
	}

	function createArrowSymbol(direction, style) {
		const el = document[createEl]('button');
		el.className = 'bp-lr';
		el.innerHTML =
			'<svg viewBox="0 0 129 129" height="70" fill="#fff"><path d="M88.6 121.3c.8.8 1.8 1.2 2.9 1.2s2.1-.4 2.9-1.2a4.1 4.1 0 0 0 0-5.8l-51-51 51-51a4.1 4.1 0 0 0-5.8-5.8l-54 53.9a4.1 4.1 0 0 0 0 5.8l54 53.9z"/></svg>';
		changeCSS(el, style);
		el.onclick = (e) => {
			e.stopPropagation();
			updateGallery(direction);
		};
		return el
	}

	// add style - if you want to tweak, run through beautifier
	const style = document[createEl]('STYLE');
	style.innerHTML =
		'#bp_caption,#bp_container{bottom:0;left:0;right:0;position:fixed;opacity:0}#bp_container>*,#bp_loader{position:absolute;right:0;z-index:10}#bp_container,#bp_caption,#bp_container svg{pointer-events:none}#bp_container{top:0;z-index:9999;background:rgba(0,0,0,.7);opacity:0;transition:opacity .35s}#bp_loader{top:0;left:0;bottom:0;display:flex;align-items:center;cursor:wait;background:0;z-index:9}#bp_loader svg{width:50%;max-width:300px;max-height:50%;margin:auto;animation:bpturn 1s infinite linear}#bp_aud,#bp_container img,#bp_sv,#bp_vid{user-select:none;max-height:96%;max-width:96%;top:0;bottom:0;left:0;margin:auto;box-shadow:0 0 3em rgba(0,0,0,.4);z-index:-1}#bp_sv{background:#111}#bp_sv svg{width:66px}#bp_caption{font-size:.9em;padding:1.3em;background:rgba(15,15,15,.94);color:#fff;text-align:center;transition:opacity .3s}#bp_aud{width:650px;top:calc(50% - 20px);bottom:auto;box-shadow:none}#bp_count{left:0;right:auto;padding:14px;color:rgba(255,255,255,.7);font-size:22px;cursor:default}#bp_container button{position:absolute;border:0;outline:0;background:0;cursor:pointer;transition:all .1s}#bp_container>.bp-x{padding:0;height:41px;width:41px;border-radius:100%;top:8px;right:14px;opacity:.8;line-height:1}#bp_container>.bp-x:focus,#bp_container>.bp-x:hover{background:rgba(255,255,255,.2)}.bp-x svg,.bp-xc svg{height:21px;width:20px;fill:#fff;vertical-align:top;}.bp-xc svg{width:16px}#bp_container .bp-xc{left:2%;bottom:100%;padding:9px 20px 7px;background:#d04444;border-radius:2px 2px 0 0;opacity:.85}#bp_container .bp-xc:focus,#bp_container .bp-xc:hover{opacity:1}.bp-lr{top:50%;top:calc(50% - 130px);padding:99px 0;width:6%;background:0;border:0;opacity:.4;transition:opacity .1s}.bp-lr:focus,.bp-lr:hover{opacity:.8}@keyframes bpf{50%{transform:translatex(15px)}100%{transform:none}}@keyframes bpl{50%{transform:translatex(-15px)}100%{transform:none}}@keyframes bpfl{0%{opacity:0;transform:translatex(70px)}100%{opacity:1;transform:none}}@keyframes bpfr{0%{opacity:0;transform:translatex(-70px)}100%{opacity:1;transform:none}}@keyframes bpfol{0%{opacity:1;transform:none}100%{opacity:0;transform:translatex(-70px)}}@keyframes bpfor{0%{opacity:1;transform:none}100%{opacity:0;transform:translatex(70px)}}@keyframes bpturn{0%{transform:none}100%{transform:rotate(360deg)}}@media (max-width:600px){.bp-lr{font-size:15vw}}';
	document.head[appendEl](style);

	// create container element
	container = document[createEl]('DIV');
	container.id = 'bp_container';
	container.onclick = close;
	closeButton = createCloseButton('bp-x');
	container[appendEl](closeButton);
	// gallery swipe listeners
	if ('ontouchstart' in window) {
		supportsTouch = true;
		container.ontouchstart = ({ changedTouches }) => {
			startX = changedTouches[0].pageX;
		};
		container.ontouchmove = (e) => {
			e.preventDefault();
		};
		container.ontouchend = ({ changedTouches }) => {
			if (!galleryOpen) {
				return
			}
			const distX = changedTouches[0].pageX - startX;
			// swipe right
			distX < -30 && updateGallery(1);
			// swipe left
			distX > 30 && updateGallery(-1);
		};
	}

	// create display image element
	displayImage = document[createEl]('IMG');

	// create display video element
	displayVideo = document[createEl]('VIDEO');
	displayVideo.id = 'bp_vid';
	displayVideo.setAttribute('playsinline', true);
	displayVideo.controls = true;
	displayVideo.loop = true;

	// create audio element
	displayAudio = document[createEl]('audio');
	displayAudio.id = 'bp_aud';
	displayAudio.controls = true;
	displayAudio.loop = true;

	// create gallery counter
	galleryCounter = document[createEl]('span');
	galleryCounter.id = 'bp_count';

	// create caption elements
	caption = document[createEl]('DIV');
	caption.id = 'bp_caption';
	captionHideButton = createCloseButton('bp-xc');
	captionHideButton.onclick = toggleCaption.bind(null, false);
	caption[appendEl](captionHideButton);
	captionText = document[createEl]('SPAN');
	caption[appendEl](captionText);
	container[appendEl](caption);

	// left / right arrow icons
	rightArrowBtn = createArrowSymbol(1, 'transform:scalex(-1)');
	leftArrowBtn = createArrowSymbol(-1, 'left:0;right:auto');

	// create loading icon element
	loadingIcon = document[createEl]('DIV');
	loadingIcon.id = 'bp_loader';
	loadingIcon.innerHTML =
		'<svg viewbox="0 0 32 32" fill="#fff" opacity=".8"><path d="M16 0a16 16 0 0 0 0 32 16 16 0 0 0 0-32m0 4a12 12 0 0 1 0 24 12 12 0 0 1 0-24" fill="#000" opacity=".5"/><path d="M16 0a16 16 0 0 1 16 16h-4A12 12 0 0 0 16 4z"/></svg>';
	// create youtube / vimeo container
	iframeContainer = document[createEl]('DIV');
	iframeContainer.id = 'bp_sv';

	// create iframe to hold youtube / vimeo player
	iframeSiteVid = document[createEl]('IFRAME');
	iframeSiteVid.setAttribute('allowfullscreen', true);
	iframeSiteVid.allow = 'autoplay; fullscreen';
	iframeSiteVid.onload = () => iframeContainer[removeEl](loadingIcon);
	changeCSS(
		iframeSiteVid,
		'border:0;position:absolute;height:100%;width:100%;left:0;top:0'
	);
	iframeContainer[appendEl](iframeSiteVid);

	// display image bindings for image load and error
	displayImage.onload = open;
	displayImage.onerror = open.bind(null, 'image');

	window.addEventListener('resize', () => {
		// adjust loader position on window resize
		galleryOpen || (isLoading && toggleLoadingIcon(true));
		// adjust iframe dimensions
		displayElement === iframeContainer && updateIframeDimensions();
	});

	// close container on escape key press and arrow buttons for gallery
	document.addEventListener('keyup', ({ keyCode }) => {
		keyCode === 27 && isOpen && close();
		if (galleryOpen) {
			keyCode === 39 && updateGallery(1);
			keyCode === 37 && updateGallery(-1);
			keyCode === 38 && updateGallery(10);
			keyCode === 40 && updateGallery(-10);
		}
	});
	// prevent scrolling with arrow keys if gallery open
	document.addEventListener('keydown', (e) => {
		const usedKeys = [37, 38, 39, 40];
		if (galleryOpen && ~usedKeys.indexOf(e.keyCode)) {
			e.preventDefault();
		}
	});

	// trap focus within conainer while open
	document.addEventListener(
		'focus',
		(e) => {
			if (isOpen && !container.contains(e.target)) {
				e.stopPropagation();
				closeButton.focus();
			}
		},
		true
	);

	// all done
	initialized = true;
}

// return transform style to make full size display el match trigger el size
function getRect() {
	const { top, left, width, height } = el.getBoundingClientRect();
	const leftOffset = left - (container.clientWidth - width) / 2;
	const centerTop = top - (container.clientHeight - height) / 2;
	const scaleWidth = el.clientWidth / displayElement.clientWidth;
	const scaleHeight = el.clientHeight / displayElement.clientHeight;
	return `transform:translate3D(${leftOffset}px, ${centerTop}px, 0) scale3D(${scaleWidth}, ${scaleHeight}, 0)`
}

function makeVidSrc(source) {
	if (Array.isArray(source)) {
		displayElement = displayVideo.cloneNode();
		source.forEach((src) => {
			const source = document[createEl]('SOURCE');
			source.src = src;
			source.type = `video/${src.match(/.(\w+)$/)[1]}`;
			displayElement[appendEl](source);
		});
	} else {
		displayElement = displayVideo;
		displayElement.src = source;
	}
}

function makeGallery(gallery, position) {
	let galleryAttribute = opts.galleryAttribute || 'data-bp';
	if (Array.isArray(gallery)) {
		// is array of images
		galleryPosition = position || 0;
		galleryEls = gallery;
		captionContent = gallery[galleryPosition].caption;
	} else {
		// is element selector or nodelist
		galleryEls = [].slice.call(
			typeof gallery === 'string'
				? document.querySelectorAll(`${gallery} [${galleryAttribute}]`)
				: gallery
		);
		// find initial gallery position
		const elIndex = galleryEls.indexOf(el);
		galleryPosition =
			position === 0 || position ? position : elIndex !== -1 ? elIndex : 0;
		// make gallery object w/ els / src / caption
		galleryEls = galleryEls.map((el) => ({
			el,
			src: el.getAttribute(galleryAttribute),
			caption: el.getAttribute('data-caption'),
		}));
	}
	// show loading icon if needed
	remoteImage = true;
	// set initial src to imgSrc so it will be cached in open func
	imgSrc = galleryEls[galleryPosition].src;
	!~imgCache.indexOf(imgSrc) && toggleLoadingIcon(true);
	if (galleryEls.length > 1) {
		// if length is greater than one, add gallery stuff
		container[appendEl](galleryCounter);
		galleryCounter.innerHTML = `${galleryPosition + 1}/${galleryEls.length}`;
		if (!supportsTouch) {
			// add arrows if device doesn't support touch
			container[appendEl](rightArrowBtn);
			container[appendEl](leftArrowBtn);
		}
	} else {
		// gallery is one, just show without clutter
		galleryEls = false;
	}
	displayElement = displayImage;
	// set initial image src
	displayElement.src = imgSrc;
}

function updateGallery(movement) {
	const galleryLength = galleryEls.length - 1;

	// only allow one change at a time
	if (isLoading) {
		return
	}

	// return if requesting out of range image
	const isEnd =
		(movement > 0 && galleryPosition === galleryLength) ||
		(movement < 0 && !galleryPosition);
	if (isEnd) {
		// if beginning or end of gallery, run end animation
		if (!opts.loop) {
			changeCSS(displayImage, '');
			setTimeout(
				changeCSS,
				9,
				displayImage,
				`animation:${
					movement > 0 ? 'bpl' : 'bpf'
				} .3s;transition:transform .35s`
			);
			return
		}
		// if gallery is looped, adjust position to beginning / end
		galleryPosition = movement > 0 ? -1 : galleryLength + 1;
	}

	// normalize position
	galleryPosition = Math.max(
		0,
		Math.min(galleryPosition + movement, galleryLength)
	)

	// load images before and after for quicker scrolling through pictures
	;[galleryPosition - 1, galleryPosition, galleryPosition + 1].forEach(
		(position) => {
			// normalize position
			position = Math.max(0, Math.min(position, galleryLength));
			// cancel if image has already been preloaded
			if (preloadedImages[position]) return
			const src = galleryEls[position].src;
			// create image for preloadedImages
			const img = document[createEl]('IMG');
			img.addEventListener('load', addToImgCache.bind(null, src));
			img.src = src;
			preloadedImages[position] = img;
		}
	);
	// if image is loaded, show it
	if (preloadedImages[galleryPosition].complete) {
		return changeGalleryImage(movement)
	}
	// if not, show loading icon and change when loaded
	isLoading = true;
	changeCSS(loadingIcon, 'opacity:.4;');
	container[appendEl](loadingIcon);
	preloadedImages[galleryPosition].onload = () => {
		galleryOpen && changeGalleryImage(movement);
	};
	// if error, store error object in el array
	preloadedImages[galleryPosition].onerror = () => {
		galleryEls[galleryPosition] = {
			error: 'Error loading image',
		};
		galleryOpen && changeGalleryImage(movement);
	};
}

function changeGalleryImage(movement) {
	if (isLoading) {
		container[removeEl](loadingIcon);
		isLoading = false;
	}
	const activeEl = galleryEls[galleryPosition];
	if (activeEl.error) {
		// show alert if error
		alert(activeEl.error);
	} else {
		// add new image, animate images in and out w/ css animation
		const oldimg = container.querySelector('img:last-of-type');
		displayImage = displayElement = preloadedImages[galleryPosition];
		changeCSS(
			displayImage,
			`animation:${
				movement > 0 ? 'bpfl' : 'bpfr'
			} .35s;transition:transform .35s`
		);
		changeCSS(oldimg, `animation:${movement > 0 ? 'bpfol' : 'bpfor'} .35s both`);
		container[appendEl](displayImage);
		// update el for closing animation
		if (activeEl.el) {
			el = activeEl.el;
		}
	}
	// update counter
	galleryCounter.innerHTML = `${galleryPosition + 1}/${galleryEls.length}`;
	// show / hide caption
	toggleCaption(galleryEls[galleryPosition].caption);
	// execute onChangeImage callback
	onChangeImage && onChangeImage([displayImage, galleryEls[galleryPosition]]);
}

// create video iframe
function createIframe() {
	let url;
	const prefix = 'https://';
	const suffix = 'autoplay=1';

	// create appropriate url
	if (opts.ytSrc) {
		url = `${prefix}www.youtube${
			opts.ytNoCookie ? '-nocookie' : ''
		}.com/embed/${siteVidID}?html5=1&rel=0&playsinline=1&${suffix}`;
	} else if (opts.vimeoSrc) {
		url = `${prefix}player.vimeo.com/video/${siteVidID}?${suffix}`;
	} else if (opts.iframeSrc) {
		url = opts.iframeSrc;
	}

	// add loading spinner to iframe container
	changeCSS(loadingIcon, '');
	iframeContainer[appendEl](loadingIcon);

	// set iframe src to url
	iframeSiteVid.src = url;

	updateIframeDimensions();

	setTimeout(open, 9);
}

function updateIframeDimensions() {
	let height;
	let width;

	// handle height / width / aspect / max width for iframe
	const windowHeight = window.innerHeight * 0.95;
	const windowWidth = window.innerWidth * 0.95;
	const windowAspect = windowHeight / windowWidth;

	const [dimensionWidth, dimensionHeight] = opts.dimensions || [1920, 1080];

	const iframeAspect = dimensionHeight / dimensionWidth;

	if (iframeAspect > windowAspect) {
		height = Math.min(dimensionHeight, windowHeight);
		width = height / iframeAspect;
	} else {
		width = Math.min(dimensionWidth, windowWidth);
		height = width * iframeAspect;
	}

	iframeContainer.style.cssText += `width:${width}px;height:${height}px;`;
}

// timeout to check video status while loading
function checkMedia(errMsg) {
	if (~[1, 4].indexOf(displayElement.readyState)) {
		open();
		// short timeout to to make sure controls show in safari 11
		setTimeout(() => {
			displayElement.play();
		}, 99);
	} else if (displayElement.error) {
		open(errMsg);
	} else {
		checkMediaTimeout = setTimeout(checkMedia, 35, errMsg);
	}
}

// hide / show loading icon
function toggleLoadingIcon(bool) {
	// don't show loading icon if noLoader is specified
	if (opts.noLoader) {
		return
	}
	// bool is true if we want to show icon, false if we want to remove
	// change style to match trigger element dimensions if we want to show
	bool &&
		changeCSS(
			loadingIcon,
			`top:${el.offsetTop}px;left:${el.offsetLeft}px;height:${el.clientHeight}px;width:${el.clientWidth}px`
		);
	// add or remove loader from DOM
	el.parentElement[bool ? appendEl : removeEl](loadingIcon);
	isLoading = bool;
}

// hide & show caption
function toggleCaption(captionContent) {
	if (captionContent) {
		captionText.innerHTML = captionContent;
	}
	changeCSS(
		caption,
		`opacity:${captionContent ? `1;pointer-events:auto` : '0'}`
	);
}

function addToImgCache(url) {
	!~imgCache.indexOf(url) && imgCache.push(url);
}

// animate open of image / video; display caption if needed
function open(err) {
	// hide loading spinner
	isLoading && toggleLoadingIcon();

	// execute animationStart callback
	animationStart && animationStart();

	// check if we have an error string instead of normal event
	if (typeof err === 'string') {
		removeContainer();
		return opts.onError
			? opts.onError()
			: alert(`Error: The requested ${err} could not be loaded.`)
	}

	// if remote image is loaded, add url to imgCache array
	remoteImage && addToImgCache(imgSrc);

	// transform displayEl to match trigger el
	displayElement.style.cssText += getRect();

	// fade in container
	changeCSS(container, `opacity:1;pointer-events:auto`);

	// set animationEnd callback to run after animation ends (cleared if container closed)
	if (animationEnd) {
		animationEnd = setTimeout(animationEnd, 410);
	}

	isOpen = true;

	galleryOpen = !!galleryEls;

	// enlarge displayEl, fade in caption if hasCaption
	setTimeout(() => {
		displayElement.style.cssText += 'transition:transform .35s;transform:none';
		captionContent && setTimeout(toggleCaption, 250, captionContent);
	}, 60);
}

// close active display element
function close(e) {
	const target = e ? e.target : container;
	const clickEls = [
		caption,
		captionHideButton,
		displayVideo,
		displayAudio,
		captionText,
		leftArrowBtn,
		rightArrowBtn,
		loadingIcon,
	];

	// blur to hide close button focus style
	target.blur();

	// don't close if one of the clickEls was clicked or container is already closing
	if (isClosing || ~clickEls.indexOf(target)) {
		return
	}

	// animate closing
	displayElement.style.cssText += getRect();
	changeCSS(container, 'pointer-events:auto');

	// timeout to remove els from dom; use variable to avoid calling more than once
	setTimeout(removeContainer, 350);

	// clear animationEnd timeout
	clearTimeout(animationEnd);

	isOpen = false;
	isClosing = true;
}

// remove container / display element from the DOM
function removeContainer() {
	// clear src of displayElement (or iframe if display el is iframe container)
	// needs to be done before removing container in IE
	let srcEl =
		displayElement === iframeContainer ? iframeSiteVid : displayElement;
	srcEl.removeAttribute('src');

	// remove container from DOM & clear inline style
	document.body[removeEl](container);
	container[removeEl](displayElement);
	changeCSS(container, '');
	changeCSS(displayElement, '');

	// remove caption
	toggleCaption(false);

	if (galleryOpen) {
		// remove all gallery stuff
		const images = container.querySelectorAll('img');
		for (let i = 0; i < images.length; i++) {
			container[removeEl](images[i]);
		}
		isLoading && container[removeEl](loadingIcon);
		container[removeEl](galleryCounter);
		galleryOpen = galleryEls = false;
		preloadedImages = {};
		supportsTouch || container[removeEl](rightArrowBtn);
		supportsTouch || container[removeEl](leftArrowBtn);
		// in case displayimage changed, we need to update event listeners
		displayImage.onload = open;
		displayImage.onerror = open.bind(null, 'image');
	}

	// run close callback
	opts.onClose && opts.onClose();

	isClosing = isLoading = false;
}

// style helper functions
function changeCSS({ style }, newStyle) {
	style.cssText = newStyle;
}

class UvalibImage extends UvalibAnalyticsMixin(h) {
  static get styles() {
    return [style];
  }

  static get properties() {
    return {
      src: { type: String },
      alt: { type: String },
      _enlargable: { type: Boolean },
      enlargable: { type: Boolean },
      enlargableMinWidth: { type: Number },
      title: { type: String },
      loading: {type: String }
    };
  }

  constructor() {
    super();
    this.enlargableMinWidth = 768;
    this.enlargable = false;
    this._enlargable = false;
    this.loading = "lazy";
//    this.setAttribute('role',"img");
    this.setAttribute('tabindex',0);
    this.addEventListener('focus', this.focus);

  }

  _getScreenWidth() {  
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  _handleResize() {
    this._enlargable = this.enlargable && this._getScreenWidth() >= this.enlargableMinWidth;
  }

  firstUpdated() {
    if (!this.alt && this.alt!="") console.error("uvalib-image needs an alt attribute even if it is empty!");
    this._img = this.shadowRoot.querySelector('img');
    this.setAttribute("aria-label",this.alt);
    this._handleResize();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._handleResize.bind(this) );
  }
  disconnectedCallback() {
    window.removeEventListener('resize', this._handleResize.bind(this) );
    super.disconnectedCallback();
  }

  render() {
    return (this.alt||this.alt=="")?
      T`
      <div class="wrapper">
        ${this._enlargable? T`<button @click="${this.enlarge}" aria-label="Enlarge image of ${this.alt}"><uvalib-icon icon-id="uvalib:general:searchplus" aria-label="enlarge image" role="image"></uvalib-icon></button>`:''}
        <div id="image" ?enlargable="${this._enlargable}" @click="${this.enlarge}"><img loading="${this.loading}" src="${this.src}" title="${this.title || this.alt}" /></div>
      </div>  
      `:
      T`<!-- uvalib-image needs an alt attribute even if it is empty! -->`;
  }

  focus() {
    console.log("focused");
    this.shadowRoot.querySelector('button').focus();
    this.scrollIntoView();
  }

  enlarge() {
    if (this._enlargable) {
      BigPicture({
        el: this._img, 
        animationEnd: ()=>{ 
          document.querySelector('#bp_caption').style.display = "none";
          let closeButton = document.querySelector('#bp_container .bp-x');
          let icon = closeButton.querySelector('svg');
          let title = document.createElement('title');
          title.id="title";
          title.setAttribute('lang','en');
          title.textContent = "Close";
          icon.appendChild(title);
          icon.setAttribute('aria-labeledby','title');
          closeButton.focus();
        },
        onClose: function(){ 
          this.focus(); 
        }.bind(this)
      });
    }
  }
}

window.customElements.define('uvalib-image', UvalibImage);
