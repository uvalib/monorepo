import { c as css } from './lit-element-b0aa61ba.js';
import { a as a$2, i as i$2 } from './reactive-element-c96285eb.js';

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t,i$1,s$1,e;const o$1=globalThis.trustedTypes,l$1=o$1?o$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,n$1=`lit$${(Math.random()+"").slice(9)}$`,h$1="?"+n$1,r=`<${h$1}>`,u=document,c=(t="")=>u.createComment(t),d=t=>null===t||"object"!=typeof t&&"function"!=typeof t,v$1=Array.isArray,a$1=t=>{var i;return v$1(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,$=/'/g,g=/"/g,y=/^(?:script|style|textarea)$/i,b=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),T=b(1),w=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),P=new WeakMap,V=(t,i,s)=>{var e,o;const l=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let n=l._$litPart$;if(void 0===n){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;l._$litPart$=n=new C(i.insertBefore(c(),t),t,void 0,s);}return n.I(t),n},E=u.createTreeWalker(u,129,null,!1),M=(t,i)=>{const s=t.length-1,e=[];let o,h=2===i?"<svg>":"",u=f;for(let i=0;i<s;i++){const s=t[i];let l,c,d=-1,v=0;for(;v<s.length&&(u.lastIndex=v,c=u.exec(s),null!==c);)v=u.lastIndex,u===f?"!--"===c[1]?u=_:void 0!==c[1]?u=m:void 0!==c[2]?(y.test(c[2])&&(o=RegExp("</"+c[2],"g")),u=p):void 0!==c[3]&&(u=p):u===p?">"===c[0]?(u=null!=o?o:f,d=-1):void 0===c[1]?d=-2:(d=u.lastIndex-c[2].length,l=c[1],u=void 0===c[3]?p:'"'===c[3]?g:$):u===g||u===$?u=p:u===_||u===m?u=f:(u=p,o=void 0);const a=u===p&&t[i+1].startsWith("/>")?" ":"";h+=u===f?s+r:d>=0?(e.push(l),s.slice(0,d)+"$lit$"+s.slice(d)+n$1+a):s+n$1+(-2===d?(e.push(void 0),i):a);}const c=h+(t[s]||"<?>")+(2===i?"</svg>":"");return [void 0!==l$1?l$1.createHTML(c):c,e]};class N{constructor({strings:t,_$litType$:i},s){let e;this.parts=[];let l=0,r=0;const u=t.length-1,d=this.parts,[v,a]=M(t,i);if(this.el=N.createElement(v,s),E.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(e=E.nextNode())&&d.length<u;){if(1===e.nodeType){if(e.hasAttributes()){const t=[];for(const i of e.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(n$1)){const s=a[r++];if(t.push(i),void 0!==s){const t=e.getAttribute(s.toLowerCase()+"$lit$").split(n$1),i=/([.?@])?(.*)/.exec(s);d.push({type:1,index:l,name:i[2],strings:t,ctor:"."===i[1]?I:"?"===i[1]?L:"@"===i[1]?R:H});}else d.push({type:6,index:l});}for(const i of t)e.removeAttribute(i);}if(y.test(e.tagName)){const t=e.textContent.split(n$1),i=t.length-1;if(i>0){e.textContent=o$1?o$1.emptyScript:"";for(let s=0;s<i;s++)e.append(t[s],c()),E.nextNode(),d.push({type:2,index:++l});e.append(t[i],c());}}}else if(8===e.nodeType)if(e.data===h$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=e.data.indexOf(n$1,t+1));)d.push({type:7,index:l}),t+=n$1.length-1;}l++;}}static createElement(t,i){const s=u.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){var o,l,n,h;if(i===w)return i;let r=void 0!==e?null===(o=s.Σi)||void 0===o?void 0:o[e]:s.Σo;const u=d(i)?void 0:i._$litDirective$;return (null==r?void 0:r.constructor)!==u&&(null===(l=null==r?void 0:r.O)||void 0===l||l.call(r,!1),void 0===u?r=void 0:(r=new u(t),r.T(t,s,e)),void 0!==e?(null!==(n=(h=s).Σi)&&void 0!==n?n:h.Σi=[])[e]=r:s.Σo=r),void 0!==r&&(i=S(t,r.S(t,i.values),r,e)),i}class k{constructor(t,i){this.l=[],this.N=void 0,this.D=t,this.M=i;}u(t){var i;const{el:{content:s},parts:e}=this.D,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:u).importNode(s,!0);E.currentNode=o;let l=E.nextNode(),n=0,h=0,r=e[0];for(;void 0!==r;){if(n===r.index){let i;2===r.type?i=new C(l,l.nextSibling,this,t):1===r.type?i=new r.ctor(l,r.name,r.strings,this,t):6===r.type&&(i=new z(l,this,t)),this.l.push(i),r=e[++h];}n!==(null==r?void 0:r.index)&&(l=E.nextNode(),n++);}return o}v(t){let i=0;for(const s of this.l)void 0!==s&&(void 0!==s.strings?(s.I(t,s,i),i+=s.strings.length-2):s.I(t[i])),i++;}}class C{constructor(t,i,s,e){this.type=2,this.N=void 0,this.A=t,this.B=i,this.M=s,this.options=e;}setConnected(t){var i;null===(i=this.P)||void 0===i||i.call(this,t);}get parentNode(){return this.A.parentNode}get startNode(){return this.A}get endNode(){return this.B}I(t,i=this){t=S(this,t,i),d(t)?t===A||null==t||""===t?(this.H!==A&&this.R(),this.H=A):t!==this.H&&t!==w&&this.m(t):void 0!==t._$litType$?this._(t):void 0!==t.nodeType?this.$(t):a$1(t)?this.g(t):this.m(t);}k(t,i=this.B){return this.A.parentNode.insertBefore(t,i)}$(t){this.H!==t&&(this.R(),this.H=this.k(t));}m(t){const i=this.A.nextSibling;null!==i&&3===i.nodeType&&(null===this.B?null===i.nextSibling:i===this.B.previousSibling)?i.data=t:this.$(u.createTextNode(t)),this.H=t;}_(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this.C(t):(void 0===e.el&&(e.el=N.createElement(e.h,this.options)),e);if((null===(i=this.H)||void 0===i?void 0:i.D)===o)this.H.v(s);else {const t=new k(o,this),i=t.u(this.options);t.v(s),this.$(i),this.H=t;}}C(t){let i=P.get(t.strings);return void 0===i&&P.set(t.strings,i=new N(t)),i}g(t){v$1(this.H)||(this.H=[],this.R());const i=this.H;let s,e=0;for(const o of t)e===i.length?i.push(s=new C(this.k(c()),this.k(c()),this,this.options)):s=i[e],s.I(o),e++;e<i.length&&(this.R(s&&s.B.nextSibling,e),i.length=e);}R(t=this.A.nextSibling,i){var s;for(null===(s=this.P)||void 0===s||s.call(this,!1,!0,i);t&&t!==this.B;){const i=t.nextSibling;t.remove(),t=i;}}}class H{constructor(t,i,s,e,o){this.type=1,this.H=A,this.N=void 0,this.V=void 0,this.element=t,this.name=i,this.M=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this.H=Array(s.length-1).fill(A),this.strings=s):this.H=A;}get tagName(){return this.element.tagName}I(t,i=this,s,e){const o=this.strings;let l=!1;if(void 0===o)t=S(this,t,i,0),l=!d(t)||t!==this.H&&t!==w,l&&(this.H=t);else {const e=t;let n,h;for(t=o[0],n=0;n<o.length-1;n++)h=S(this,e[s+n],i,n),h===w&&(h=this.H[n]),l||(l=!d(h)||h!==this.H[n]),h===A?t=A:t!==A&&(t+=(null!=h?h:"")+o[n+1]),this.H[n]=h;}l&&!e&&this.W(t);}W(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class I extends H{constructor(){super(...arguments),this.type=3;}W(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}W(t){t&&t!==A?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name);}}class R extends H{constructor(){super(...arguments),this.type=5;}I(t,i=this){var s;if((t=null!==(s=S(this,t,i,0))&&void 0!==s?s:A)===w)return;const e=this.H,o=t===A&&e!==A||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,l=t!==A&&(e===A||o);o&&this.element.removeEventListener(this.name,this,e),l&&this.element.addEventListener(this.name,this,t),this.H=t;}handleEvent(t){var i,s;"function"==typeof this.H?this.H.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this.H.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this.N=void 0,this.V=void 0,this.M=i,this.options=s;}I(t){S(this,t);}}null===(i$1=(t=globalThis).litHtmlPlatformSupport)||void 0===i$1||i$1.call(t,N,C),(null!==(s$1=(e=globalThis).litHtmlVersions)&&void 0!==s$1?s$1:e.litHtmlVersions=[]).push("2.0.0-rc.3");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var i,l,o,s,n,a;(null!==(i=(a=globalThis).litElementVersions)&&void 0!==i?i:a.litElementVersions=[]).push("3.0.0-rc.2");class h extends a$2{constructor(){super(...arguments),this.renderOptions={host:this},this.Φt=void 0;}createRenderRoot(){var t,e;const r=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=r.firstChild),r}update(t){const r=this.render();super.update(t),this.Φt=V(r,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this.Φt)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this.Φt)||void 0===t||t.setConnected(!1);}render(){return w}}h.finalized=!0,h._$litElement$=!0,null===(o=(l=globalThis).litElementHydrateSupport)||void 0===o||o.call(l,{LitElement:h}),null===(n=(s=globalThis).litElementPlatformSupport)||void 0===n||n.call(s,{LitElement:h});

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const v=(o,t)=>{var i,n;return void 0===t?void 0!==(null===(i=o)||void 0===i?void 0:i._$litType$):(null===(n=o)||void 0===n?void 0:n._$litType$)===t};

const sym = Symbol.for('lion::SingletonManagerClassStorage');

class SingletonManagerClass {
  constructor() {
    /** protected */
    this._map = window[sym] ? window[sym] : (window[sym] = new Map());
  }

  /**
   * Ignores already existing keys (e.g. it will not override)
   *
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    if (!this.has(key)) {
      this._map.set(key, value);
    }
  }

  /**
   * @param {string} key
   * @returns
   */
  get(key) {
    return this._map.get(key);
  }

  /**
   * @param {string} key
   */
  has(key) {
    return this._map.has(key);
  }
}

const singletonManager = new SingletonManagerClass();

/**
 * @typedef {import('lit-html').nothing} nothing
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */

class IconManager {
  constructor() {
    /** @private */
    this.__iconResolvers = new Map();
  }

  /**
   * Adds an icon resolver for the given namespace. An icon resolver is a
   * function which takes an icon set and an icon name and returns an svg
   * icon as a TemplateResult. This function can be sync or async.
   *
   * @param {string} namespace
   * @param {(iconset: string, icon: string) => TemplateResult | Promise<TemplateResult> | nothing | Promise<nothing> } iconResolver
   */
  addIconResolver(namespace, iconResolver) {
    if (this.__iconResolvers.has(namespace)) {
      throw new Error(`An icon resolver has already been registered for namespace: ${namespace}`);
    }
    this.__iconResolvers.set(namespace, iconResolver);
  }

  /**
   * Removes an icon resolver for a namespace.
   * @param {string} namespace
   */
  removeIconResolver(namespace) {
    this.__iconResolvers.delete(namespace);
  }

  /**
   * Resolves icon for the given parameters. Returns the icon as a svg string.
   *
   * @param {string} namespace
   * @param {string} iconset
   * @param {string} icon
   * @returns {Promise<TemplateResult>}
   */
  resolveIcon(namespace, iconset, icon) {
    const resolver = this.__iconResolvers.get(namespace);
    if (resolver) {
      return resolver(iconset, icon);
    }
    throw new Error(`Could not find any icon resolver for namespace ${namespace}.`);
  }

  /**
   * Resolves icon for the given icon id. Returns the icon as a svg string.
   *
   * @param {string} iconId
   * @returns {Promise<TemplateResult>}
   */
  resolveIconForId(iconId) {
    const splitIconId = iconId.split(':');
    if (splitIconId.length !== 3) {
      throw new Error(`Incorrect iconId: ${iconId}. Format: <namespace>:<iconset>:<icon>`);
    }

    return this.resolveIcon(splitIconId[0], splitIconId[1], splitIconId[2]);
  }
}

// eslint-disable-next-line import/no-mutable-exports
let icons = singletonManager.get('@lion/icon::icons::0.5.x') || new IconManager();

/**
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 * @typedef {(tag: (strings: TemplateStringsArray, ... expr: string[]) => string) => string} TagFunction
 */

/**
 * @param {?} wrappedSvgObject
 */
function unwrapSvg(wrappedSvgObject) {
  const svgObject =
    wrappedSvgObject && wrappedSvgObject.default ? wrappedSvgObject.default : wrappedSvgObject;
  return typeof svgObject === 'function' ? svgObject(T) : svgObject;
}

/**
 * @param {TemplateResult|nothing} svg
 */
function validateSvg(svg) {
  if (!(svg === A || v(svg))) {
    throw new Error(
      'icon accepts only lit-html templates or functions like "tag => tag`<svg>...</svg>`"',
    );
  }
}

/**
 * Custom element for rendering SVG icons
 */
class LionIcon extends h {
  static get properties() {
    return {
      /**
       * @desc When icons are not loaded as part of an iconset defined on iconManager,
       * it's possible to directly load an svg.
       */
      svg: {
        attribute: false,
      },
      /**
       * @desc The iconId allows to access icons that are registered to the IconManager
       * For instance, "lion:space:alienSpaceship"
       */
      ariaLabel: {
        type: String,
        attribute: 'aria-label',
        reflect: true,
      },
      /**
       * @desc The iconId allows to access icons that are registered to the IconManager
       * For instance, "lion:space:alienSpaceship"
       */
      iconId: {
        type: String,
        attribute: 'icon-id',
      },
      /**
       * @private
       */
      role: {
        type: String,
        attribute: 'role',
        reflect: true,
      },
    };
  }

  static get styles() {
    return [
      i$2`
        :host {
          box-sizing: border-box;
          display: inline-block;
          width: 1em;
          height: 1em;
        }

        :host([hidden]) {
          display: none;
        }

        :host:first-child {
          margin-left: 0;
        }

        :host:last-child {
          margin-right: 0;
        }

        ::slotted(svg) {
          display: block;
          width: 100%;
          height: 100%;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.role = 'img';
    this.ariaLabel = '';
    this.iconId = '';
    /**
     * @private
     * @type {TemplateResult|nothing|TagFunction}
     */
    this.__svg = A;
  }

  /** @param {import('@lion/core').PropertyValues} changedProperties */
  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has('ariaLabel')) {
      this._onLabelChanged();
    }

    if (changedProperties.has('iconId')) {
      this._onIconIdChanged(/** @type {string} */ (changedProperties.get('iconId')));
    }
  }

  render() {
    return T`<slot></slot>`;
  }

  connectedCallback() {
    // ensures that aria-hidden is set if there is no aria-label attribute
    this._onLabelChanged();
    super.connectedCallback();
  }

  /**
   * On IE11, svgs without focusable false appear in the tab order
   * so make sure to have <svg focusable="false"> in svg files
   * @param {TemplateResult|nothing|TagFunction} svg
   */
  set svg(svg) {
    this.__svg = svg;
    if (svg === undefined || svg === null) {
      this._renderSvg(A);
    } else {
      this._renderSvg(unwrapSvg(svg));
    }
  }

  /**
   * @type {TemplateResult|nothing|TagFunction}
   */
  get svg() {
    return this.__svg;
  }

  /** @protected */
  _onLabelChanged() {
    if (this.ariaLabel) {
      this.setAttribute('aria-hidden', 'false');
    } else {
      this.setAttribute('aria-hidden', 'true');
      this.removeAttribute('aria-label');
    }
  }

  /**
   * @param {TemplateResult | nothing} svgObject
   * @protected
   */
  _renderSvg(svgObject) {
    validateSvg(svgObject);
    V(svgObject, this);
    if (this.firstElementChild) {
      this.firstElementChild.setAttribute('aria-hidden', 'true');
    }
  }

  /** @protected */
  // eslint-disable-next-line class-methods-use-this
  get _iconManager() {
    return icons;
  }

  /**
   * @param {string} prevIconId
   * @protected
   */
  async _onIconIdChanged(prevIconId) {
    if (!this.iconId) {
      // clear if switching from iconId to no iconId
      if (prevIconId) {
        this.svg = A;
      }
    } else {
      const iconIdBeforeResolve = this.iconId;
      const svg = await this._iconManager.resolveIconForId(iconIdBeforeResolve);

      // update SVG if it did not change in the meantime to avoid race conditions
      if (this.iconId === iconIdBeforeResolve) {
        this.svg = svg;
      }
    }
  }
}

icons.addIconResolver('uvalib', (iconset, name) => {
  switch (iconset) {
    case 'alerts':
      return import(
        './alerts-iconset-b97dec19.js'
      ).then(module => module[name]);
    case 'brands':
      return import(
        './brands-iconset-f4384e05.js'
      ).then(module => module[name]);
    case 'general':
      return import(
        './general-iconset-13861c4d.js'
      ).then(module => module[name]);
    default:
      throw new Error(`Unknown iconset ${iconset}`);
  }
});

// Just extends the lion-icon
class UvalibIcon extends LionIcon {
  static get styles() {
    return [
      super.styles,
      css`
:host {
  ::slotted(svg) {
    display: block;
    width: 100px !important;
    height: 100px !important;
  }
}      
      `
    ]
  }
}

window.customElements.define('uvalib-icon', UvalibIcon);
