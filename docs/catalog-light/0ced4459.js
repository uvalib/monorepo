const e =
    "undefined" != typeof window &&
    null != window.customElements &&
    void 0 !== window.customElements.polyfillWrapFlushCallback,
  t = (e, t, i = null) => {
    for (; t !== i; ) {
      const i = t.nextSibling;
      e.removeChild(t), (t = i);
    }
  },
  i = `{{lit-${String(Math.random()).slice(2)}}}`,
  s = `\x3c!--${i}--\x3e`,
  a = new RegExp(`${i}|${s}`);
class n {
  constructor(e, t) {
    (this.parts = []), (this.element = t);
    const s = [],
      n = [],
      o = document.createTreeWalker(t.content, 133, null, !1);
    let d = 0,
      h = -1,
      u = 0;
    const {
      strings: p,
      values: { length: f },
    } = e;
    for (; u < f; ) {
      const e = o.nextNode();
      if (null !== e) {
        if ((h++, 1 === e.nodeType)) {
          if (e.hasAttributes()) {
            const t = e.attributes,
              { length: i } = t;
            let s = 0;
            for (let e = 0; e < i; e++) r(t[e].name, "$lit$") && s++;
            for (; s-- > 0; ) {
              const t = p[u],
                i = c.exec(t)[2],
                s = i.toLowerCase() + "$lit$",
                n = e.getAttribute(s);
              e.removeAttribute(s);
              const r = n.split(a);
              this.parts.push({
                type: "attribute",
                index: h,
                name: i,
                strings: r,
              }),
                (u += r.length - 1);
            }
          }
          "TEMPLATE" === e.tagName && (n.push(e), (o.currentNode = e.content));
        } else if (3 === e.nodeType) {
          const t = e.data;
          if (t.indexOf(i) >= 0) {
            const i = e.parentNode,
              n = t.split(a),
              o = n.length - 1;
            for (let t = 0; t < o; t++) {
              let s,
                a = n[t];
              if ("" === a) s = l();
              else {
                const e = c.exec(a);
                null !== e &&
                  r(e[2], "$lit$") &&
                  (a =
                    a.slice(0, e.index) +
                    e[1] +
                    e[2].slice(0, -"$lit$".length) +
                    e[3]),
                  (s = document.createTextNode(a));
              }
              i.insertBefore(s, e),
                this.parts.push({ type: "node", index: ++h });
            }
            "" === n[o] ? (i.insertBefore(l(), e), s.push(e)) : (e.data = n[o]),
              (u += o);
          }
        } else if (8 === e.nodeType)
          if (e.data === i) {
            const t = e.parentNode;
            (null !== e.previousSibling && h !== d) ||
              (h++, t.insertBefore(l(), e)),
              (d = h),
              this.parts.push({ type: "node", index: h }),
              null === e.nextSibling ? (e.data = "") : (s.push(e), h--),
              u++;
          } else {
            let t = -1;
            for (; -1 !== (t = e.data.indexOf(i, t + 1)); )
              this.parts.push({ type: "node", index: -1 }), u++;
          }
      } else o.currentNode = n.pop();
    }
    for (const e of s) e.parentNode.removeChild(e);
  }
}
const r = (e, t) => {
    const i = e.length - t.length;
    return i >= 0 && e.slice(i) === t;
  },
  o = (e) => -1 !== e.index,
  l = () => document.createComment(""),
  c =
    /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
function d(e, t) {
  const {
      element: { content: i },
      parts: s,
    } = e,
    a = document.createTreeWalker(i, 133, null, !1);
  let n = u(s),
    r = s[n],
    o = -1,
    l = 0;
  const c = [];
  let d = null;
  for (; a.nextNode(); ) {
    o++;
    const e = a.currentNode;
    for (
      e.previousSibling === d && (d = null),
        t.has(e) && (c.push(e), null === d && (d = e)),
        null !== d && l++;
      void 0 !== r && r.index === o;

    )
      (r.index = null !== d ? -1 : r.index - l), (n = u(s, n)), (r = s[n]);
  }
  c.forEach((e) => e.parentNode.removeChild(e));
}
const h = (e) => {
    let t = 11 === e.nodeType ? 0 : 1;
    const i = document.createTreeWalker(e, 133, null, !1);
    for (; i.nextNode(); ) t++;
    return t;
  },
  u = (e, t = -1) => {
    for (let i = t + 1; i < e.length; i++) {
      const t = e[i];
      if (o(t)) return i;
    }
    return -1;
  };
const p = new WeakMap(),
  f = (e) => "function" == typeof e && p.has(e),
  m = {},
  _ = {};
class v {
  constructor(e, t, i) {
    (this.__parts = []),
      (this.template = e),
      (this.processor = t),
      (this.options = i);
  }
  update(e) {
    let t = 0;
    for (const i of this.__parts) void 0 !== i && i.setValue(e[t]), t++;
    for (const e of this.__parts) void 0 !== e && e.commit();
  }
  _clone() {
    const t = e
        ? this.template.element.content.cloneNode(!0)
        : document.importNode(this.template.element.content, !0),
      i = [],
      s = this.template.parts,
      a = document.createTreeWalker(t, 133, null, !1);
    let n,
      r = 0,
      l = 0,
      c = a.nextNode();
    for (; r < s.length; )
      if (((n = s[r]), o(n))) {
        for (; l < n.index; )
          l++,
            "TEMPLATE" === c.nodeName &&
              (i.push(c), (a.currentNode = c.content)),
            null === (c = a.nextNode()) &&
              ((a.currentNode = i.pop()), (c = a.nextNode()));
        if ("node" === n.type) {
          const e = this.processor.handleTextExpression(this.options);
          e.insertAfterNode(c.previousSibling), this.__parts.push(e);
        } else
          this.__parts.push(
            ...this.processor.handleAttributeExpressions(
              c,
              n.name,
              n.strings,
              this.options
            )
          );
        r++;
      } else this.__parts.push(void 0), r++;
    return e && (document.adoptNode(t), customElements.upgrade(t)), t;
  }
}
const g =
    window.trustedTypes &&
    trustedTypes.createPolicy("lit-html", { createHTML: (e) => e }),
  b = ` ${i} `;
class y {
  constructor(e, t, i, s) {
    (this.strings = e),
      (this.values = t),
      (this.type = i),
      (this.processor = s);
  }
  getHTML() {
    const e = this.strings.length - 1;
    let t = "",
      a = !1;
    for (let n = 0; n < e; n++) {
      const e = this.strings[n],
        r = e.lastIndexOf("\x3c!--");
      a = (r > -1 || a) && -1 === e.indexOf("--\x3e", r + 1);
      const o = c.exec(e);
      t +=
        null === o
          ? e + (a ? b : s)
          : e.substr(0, o.index) + o[1] + o[2] + "$lit$" + o[3] + i;
    }
    return (t += this.strings[e]), t;
  }
  getTemplateElement() {
    const e = document.createElement("template");
    let t = this.getHTML();
    return void 0 !== g && (t = g.createHTML(t)), (e.innerHTML = t), e;
  }
}
const w = (e) =>
    null === e || !("object" == typeof e || "function" == typeof e),
  x = (e) => Array.isArray(e) || !(!e || !e[Symbol.iterator]);
class S {
  constructor(e, t, i) {
    (this.dirty = !0),
      (this.element = e),
      (this.name = t),
      (this.strings = i),
      (this.parts = []);
    for (let e = 0; e < i.length - 1; e++) this.parts[e] = this._createPart();
  }
  _createPart() {
    return new k(this);
  }
  _getValue() {
    const e = this.strings,
      t = e.length - 1,
      i = this.parts;
    if (1 === t && "" === e[0] && "" === e[1]) {
      const e = i[0].value;
      if ("symbol" == typeof e) return String(e);
      if ("string" == typeof e || !x(e)) return e;
    }
    let s = "";
    for (let a = 0; a < t; a++) {
      s += e[a];
      const t = i[a];
      if (void 0 !== t) {
        const e = t.value;
        if (w(e) || !x(e)) s += "string" == typeof e ? e : String(e);
        else for (const t of e) s += "string" == typeof t ? t : String(t);
      }
    }
    return (s += e[t]), s;
  }
  commit() {
    this.dirty &&
      ((this.dirty = !1),
      this.element.setAttribute(this.name, this._getValue()));
  }
}
class k {
  constructor(e) {
    (this.value = void 0), (this.committer = e);
  }
  setValue(e) {
    e === m ||
      (w(e) && e === this.value) ||
      ((this.value = e), f(e) || (this.committer.dirty = !0));
  }
  commit() {
    for (; f(this.value); ) {
      const e = this.value;
      (this.value = m), e(this);
    }
    this.value !== m && this.committer.commit();
  }
}
class C {
  constructor(e) {
    (this.value = void 0), (this.__pendingValue = void 0), (this.options = e);
  }
  appendInto(e) {
    (this.startNode = e.appendChild(l())), (this.endNode = e.appendChild(l()));
  }
  insertAfterNode(e) {
    (this.startNode = e), (this.endNode = e.nextSibling);
  }
  appendIntoPart(e) {
    e.__insert((this.startNode = l())), e.__insert((this.endNode = l()));
  }
  insertAfterPart(e) {
    e.__insert((this.startNode = l())),
      (this.endNode = e.endNode),
      (e.endNode = this.startNode);
  }
  setValue(e) {
    this.__pendingValue = e;
  }
  commit() {
    if (null === this.startNode.parentNode) return;
    for (; f(this.__pendingValue); ) {
      const e = this.__pendingValue;
      (this.__pendingValue = m), e(this);
    }
    const e = this.__pendingValue;
    e !== m &&
      (w(e)
        ? e !== this.value && this.__commitText(e)
        : e instanceof y
        ? this.__commitTemplateResult(e)
        : e instanceof Node
        ? this.__commitNode(e)
        : x(e)
        ? this.__commitIterable(e)
        : e === _
        ? ((this.value = _), this.clear())
        : this.__commitText(e));
  }
  __insert(e) {
    this.endNode.parentNode.insertBefore(e, this.endNode);
  }
  __commitNode(e) {
    this.value !== e && (this.clear(), this.__insert(e), (this.value = e));
  }
  __commitText(e) {
    const t = this.startNode.nextSibling,
      i = "string" == typeof (e = null == e ? "" : e) ? e : String(e);
    t === this.endNode.previousSibling && 3 === t.nodeType
      ? (t.data = i)
      : this.__commitNode(document.createTextNode(i)),
      (this.value = e);
  }
  __commitTemplateResult(e) {
    const t = this.options.templateFactory(e);
    if (this.value instanceof v && this.value.template === t)
      this.value.update(e.values);
    else {
      const i = new v(t, e.processor, this.options),
        s = i._clone();
      i.update(e.values), this.__commitNode(s), (this.value = i);
    }
  }
  __commitIterable(e) {
    Array.isArray(this.value) || ((this.value = []), this.clear());
    const t = this.value;
    let i,
      s = 0;
    for (const a of e)
      (i = t[s]),
        void 0 === i &&
          ((i = new C(this.options)),
          t.push(i),
          0 === s ? i.appendIntoPart(this) : i.insertAfterPart(t[s - 1])),
        i.setValue(a),
        i.commit(),
        s++;
    s < t.length && ((t.length = s), this.clear(i && i.endNode));
  }
  clear(e = this.startNode) {
    t(this.startNode.parentNode, e.nextSibling, this.endNode);
  }
}
class E {
  constructor(e, t, i) {
    if (
      ((this.value = void 0),
      (this.__pendingValue = void 0),
      2 !== i.length || "" !== i[0] || "" !== i[1])
    )
      throw new Error(
        "Boolean attributes can only contain a single expression"
      );
    (this.element = e), (this.name = t), (this.strings = i);
  }
  setValue(e) {
    this.__pendingValue = e;
  }
  commit() {
    for (; f(this.__pendingValue); ) {
      const e = this.__pendingValue;
      (this.__pendingValue = m), e(this);
    }
    if (this.__pendingValue === m) return;
    const e = !!this.__pendingValue;
    this.value !== e &&
      (e
        ? this.element.setAttribute(this.name, "")
        : this.element.removeAttribute(this.name),
      (this.value = e)),
      (this.__pendingValue = m);
  }
}
class N extends S {
  constructor(e, t, i) {
    super(e, t, i),
      (this.single = 2 === i.length && "" === i[0] && "" === i[1]);
  }
  _createPart() {
    return new V(this);
  }
  _getValue() {
    return this.single ? this.parts[0].value : super._getValue();
  }
  commit() {
    this.dirty &&
      ((this.dirty = !1), (this.element[this.name] = this._getValue()));
  }
}
class V extends k {}
let T = !1;
(() => {
  try {
    const e = {
      get capture() {
        return (T = !0), !1;
      },
    };
    window.addEventListener("test", e, e),
      window.removeEventListener("test", e, e);
  } catch (e) {}
})();
class P {
  constructor(e, t, i) {
    (this.value = void 0),
      (this.__pendingValue = void 0),
      (this.element = e),
      (this.eventName = t),
      (this.eventContext = i),
      (this.__boundHandleEvent = (e) => this.handleEvent(e));
  }
  setValue(e) {
    this.__pendingValue = e;
  }
  commit() {
    for (; f(this.__pendingValue); ) {
      const e = this.__pendingValue;
      (this.__pendingValue = m), e(this);
    }
    if (this.__pendingValue === m) return;
    const e = this.__pendingValue,
      t = this.value,
      i =
        null == e ||
        (null != t &&
          (e.capture !== t.capture ||
            e.once !== t.once ||
            e.passive !== t.passive)),
      s = null != e && (null == t || i);
    i &&
      this.element.removeEventListener(
        this.eventName,
        this.__boundHandleEvent,
        this.__options
      ),
      s &&
        ((this.__options = M(e)),
        this.element.addEventListener(
          this.eventName,
          this.__boundHandleEvent,
          this.__options
        )),
      (this.value = e),
      (this.__pendingValue = m);
  }
  handleEvent(e) {
    "function" == typeof this.value
      ? this.value.call(this.eventContext || this.element, e)
      : this.value.handleEvent(e);
  }
}
const M = (e) =>
  e &&
  (T ? { capture: e.capture, passive: e.passive, once: e.once } : e.capture);
function L(e) {
  let t = A.get(e.type);
  void 0 === t &&
    ((t = { stringsArray: new WeakMap(), keyString: new Map() }),
    A.set(e.type, t));
  let s = t.stringsArray.get(e.strings);
  if (void 0 !== s) return s;
  const a = e.strings.join(i);
  return (
    (s = t.keyString.get(a)),
    void 0 === s &&
      ((s = new n(e, e.getTemplateElement())), t.keyString.set(a, s)),
    t.stringsArray.set(e.strings, s),
    s
  );
}
const A = new Map(),
  O = new WeakMap();
const F = new (class {
  handleAttributeExpressions(e, t, i, s) {
    const a = t[0];
    if ("." === a) {
      return new N(e, t.slice(1), i).parts;
    }
    if ("@" === a) return [new P(e, t.slice(1), s.eventContext)];
    if ("?" === a) return [new E(e, t.slice(1), i)];
    return new S(e, t, i).parts;
  }
  handleTextExpression(e) {
    return new C(e);
  }
})();
"undefined" != typeof window &&
  (window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.4.1");
const R = (e, ...t) => new y(e, t, "html", F),
  U = (e, t) => `${e}--${t}`;
let D = !0;
void 0 === window.ShadyCSS
  ? (D = !1)
  : void 0 === window.ShadyCSS.prepareTemplateDom &&
    (console.warn(
      "Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."
    ),
    (D = !1));
const H = (e) => (t) => {
    const s = U(t.type, e);
    let a = A.get(s);
    void 0 === a &&
      ((a = { stringsArray: new WeakMap(), keyString: new Map() }),
      A.set(s, a));
    let r = a.stringsArray.get(t.strings);
    if (void 0 !== r) return r;
    const o = t.strings.join(i);
    if (((r = a.keyString.get(o)), void 0 === r)) {
      const i = t.getTemplateElement();
      D && window.ShadyCSS.prepareTemplateDom(i, e),
        (r = new n(t, i)),
        a.keyString.set(o, r);
    }
    return a.stringsArray.set(t.strings, r), r;
  },
  $ = ["html", "svg"],
  B = new Set(),
  I = (e, t, i) => {
    B.add(e);
    const s = i ? i.element : document.createElement("template"),
      a = t.querySelectorAll("style"),
      { length: n } = a;
    if (0 === n) return void window.ShadyCSS.prepareTemplateStyles(s, e);
    const r = document.createElement("style");
    for (let e = 0; e < n; e++) {
      const t = a[e];
      t.parentNode.removeChild(t), (r.textContent += t.textContent);
    }
    ((e) => {
      $.forEach((t) => {
        const i = A.get(U(t, e));
        void 0 !== i &&
          i.keyString.forEach((e) => {
            const {
                element: { content: t },
              } = e,
              i = new Set();
            Array.from(t.querySelectorAll("style")).forEach((e) => {
              i.add(e);
            }),
              d(e, i);
          });
      });
    })(e);
    const o = s.content;
    i
      ? (function (e, t, i = null) {
          const {
            element: { content: s },
            parts: a,
          } = e;
          if (null == i) return void s.appendChild(t);
          const n = document.createTreeWalker(s, 133, null, !1);
          let r = u(a),
            o = 0,
            l = -1;
          for (; n.nextNode(); )
            for (
              l++,
                n.currentNode === i &&
                  ((o = h(t)), i.parentNode.insertBefore(t, i));
              -1 !== r && a[r].index === l;

            ) {
              if (o > 0) {
                for (; -1 !== r; ) (a[r].index += o), (r = u(a, r));
                return;
              }
              r = u(a, r);
            }
        })(i, r, o.firstChild)
      : o.insertBefore(r, o.firstChild),
      window.ShadyCSS.prepareTemplateStyles(s, e);
    const l = o.querySelector("style");
    if (window.ShadyCSS.nativeShadow && null !== l)
      t.insertBefore(l.cloneNode(!0), t.firstChild);
    else if (i) {
      o.insertBefore(r, o.firstChild);
      const e = new Set();
      e.add(r), d(i, e);
    }
  };
window.JSCompiler_renameProperty = (e, t) => e;
const j = {
    toAttribute(e, t) {
      switch (t) {
        case Boolean:
          return e ? "" : null;
        case Object:
        case Array:
          return null == e ? e : JSON.stringify(e);
      }
      return e;
    },
    fromAttribute(e, t) {
      switch (t) {
        case Boolean:
          return null !== e;
        case Number:
          return null === e ? null : Number(e);
        case Object:
        case Array:
          return JSON.parse(e);
      }
      return e;
    },
  },
  z = (e, t) => t !== e && (t == t || e == e),
  q = { attribute: !0, type: String, converter: j, reflect: !1, hasChanged: z };
class Z extends HTMLElement {
  constructor() {
    super(), this.initialize();
  }
  static get observedAttributes() {
    this.finalize();
    const e = [];
    return (
      this._classProperties.forEach((t, i) => {
        const s = this._attributeNameForProperty(i, t);
        void 0 !== s && (this._attributeToPropertyMap.set(s, i), e.push(s));
      }),
      e
    );
  }
  static _ensureClassProperties() {
    if (
      !this.hasOwnProperty(JSCompiler_renameProperty("_classProperties", this))
    ) {
      this._classProperties = new Map();
      const e = Object.getPrototypeOf(this)._classProperties;
      void 0 !== e && e.forEach((e, t) => this._classProperties.set(t, e));
    }
  }
  static createProperty(e, t = q) {
    if (
      (this._ensureClassProperties(),
      this._classProperties.set(e, t),
      t.noAccessor || this.prototype.hasOwnProperty(e))
    )
      return;
    const i = "symbol" == typeof e ? Symbol() : `__${e}`,
      s = this.getPropertyDescriptor(e, i, t);
    void 0 !== s && Object.defineProperty(this.prototype, e, s);
  }
  static getPropertyDescriptor(e, t, i) {
    return {
      get() {
        return this[t];
      },
      set(s) {
        const a = this[e];
        (this[t] = s), this.requestUpdateInternal(e, a, i);
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(e) {
    return (this._classProperties && this._classProperties.get(e)) || q;
  }
  static finalize() {
    const e = Object.getPrototypeOf(this);
    if (
      (e.hasOwnProperty("finalized") || e.finalize(),
      (this.finalized = !0),
      this._ensureClassProperties(),
      (this._attributeToPropertyMap = new Map()),
      this.hasOwnProperty(JSCompiler_renameProperty("properties", this)))
    ) {
      const e = this.properties,
        t = [
          ...Object.getOwnPropertyNames(e),
          ...("function" == typeof Object.getOwnPropertySymbols
            ? Object.getOwnPropertySymbols(e)
            : []),
        ];
      for (const i of t) this.createProperty(i, e[i]);
    }
  }
  static _attributeNameForProperty(e, t) {
    const i = t.attribute;
    return !1 === i
      ? void 0
      : "string" == typeof i
      ? i
      : "string" == typeof e
      ? e.toLowerCase()
      : void 0;
  }
  static _valueHasChanged(e, t, i = z) {
    return i(e, t);
  }
  static _propertyValueFromAttribute(e, t) {
    const i = t.type,
      s = t.converter || j,
      a = "function" == typeof s ? s : s.fromAttribute;
    return a ? a(e, i) : e;
  }
  static _propertyValueToAttribute(e, t) {
    if (void 0 === t.reflect) return;
    const i = t.type,
      s = t.converter;
    return ((s && s.toAttribute) || j.toAttribute)(e, i);
  }
  initialize() {
    (this._updateState = 0),
      (this._updatePromise = new Promise(
        (e) => (this._enableUpdatingResolver = e)
      )),
      (this._changedProperties = new Map()),
      this._saveInstanceProperties(),
      this.requestUpdateInternal();
  }
  _saveInstanceProperties() {
    this.constructor._classProperties.forEach((e, t) => {
      if (this.hasOwnProperty(t)) {
        const e = this[t];
        delete this[t],
          this._instanceProperties || (this._instanceProperties = new Map()),
          this._instanceProperties.set(t, e);
      }
    });
  }
  _applyInstanceProperties() {
    this._instanceProperties.forEach((e, t) => (this[t] = e)),
      (this._instanceProperties = void 0);
  }
  connectedCallback() {
    this.enableUpdating();
  }
  enableUpdating() {
    void 0 !== this._enableUpdatingResolver &&
      (this._enableUpdatingResolver(), (this._enableUpdatingResolver = void 0));
  }
  disconnectedCallback() {}
  attributeChangedCallback(e, t, i) {
    t !== i && this._attributeToProperty(e, i);
  }
  _propertyToAttribute(e, t, i = q) {
    const s = this.constructor,
      a = s._attributeNameForProperty(e, i);
    if (void 0 !== a) {
      const e = s._propertyValueToAttribute(t, i);
      if (void 0 === e) return;
      (this._updateState = 8 | this._updateState),
        null == e ? this.removeAttribute(a) : this.setAttribute(a, e),
        (this._updateState = -9 & this._updateState);
    }
  }
  _attributeToProperty(e, t) {
    if (8 & this._updateState) return;
    const i = this.constructor,
      s = i._attributeToPropertyMap.get(e);
    if (void 0 !== s) {
      const e = i.getPropertyOptions(s);
      (this._updateState = 16 | this._updateState),
        (this[s] = i._propertyValueFromAttribute(t, e)),
        (this._updateState = -17 & this._updateState);
    }
  }
  requestUpdateInternal(e, t, i) {
    let s = !0;
    if (void 0 !== e) {
      const a = this.constructor;
      (i = i || a.getPropertyOptions(e)),
        a._valueHasChanged(this[e], t, i.hasChanged)
          ? (this._changedProperties.has(e) ||
              this._changedProperties.set(e, t),
            !0 !== i.reflect ||
              16 & this._updateState ||
              (void 0 === this._reflectingProperties &&
                (this._reflectingProperties = new Map()),
              this._reflectingProperties.set(e, i)))
          : (s = !1);
    }
    !this._hasRequestedUpdate &&
      s &&
      (this._updatePromise = this._enqueueUpdate());
  }
  requestUpdate(e, t) {
    return this.requestUpdateInternal(e, t), this.updateComplete;
  }
  async _enqueueUpdate() {
    this._updateState = 4 | this._updateState;
    try {
      await this._updatePromise;
    } catch (e) {}
    const e = this.performUpdate();
    return null != e && (await e), !this._hasRequestedUpdate;
  }
  get _hasRequestedUpdate() {
    return 4 & this._updateState;
  }
  get hasUpdated() {
    return 1 & this._updateState;
  }
  performUpdate() {
    if (!this._hasRequestedUpdate) return;
    this._instanceProperties && this._applyInstanceProperties();
    let e = !1;
    const t = this._changedProperties;
    try {
      (e = this.shouldUpdate(t)), e ? this.update(t) : this._markUpdated();
    } catch (t) {
      throw ((e = !1), this._markUpdated(), t);
    }
    e &&
      (1 & this._updateState ||
        ((this._updateState = 1 | this._updateState), this.firstUpdated(t)),
      this.updated(t));
  }
  _markUpdated() {
    (this._changedProperties = new Map()),
      (this._updateState = -5 & this._updateState);
  }
  get updateComplete() {
    return this._getUpdateComplete();
  }
  _getUpdateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._updatePromise;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    void 0 !== this._reflectingProperties &&
      this._reflectingProperties.size > 0 &&
      (this._reflectingProperties.forEach((e, t) =>
        this._propertyToAttribute(t, this[t], e)
      ),
      (this._reflectingProperties = void 0)),
      this._markUpdated();
  }
  updated(e) {}
  firstUpdated(e) {}
}
Z.finalized = !0;
const W =
    window.ShadowRoot &&
    (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow) &&
    "adoptedStyleSheets" in Document.prototype &&
    "replace" in CSSStyleSheet.prototype,
  G = Symbol();
class J {
  constructor(e, t) {
    if (t !== G)
      throw new Error(
        "CSSResult is not constructable. Use `unsafeCSS` or `css` instead."
      );
    this.cssText = e;
  }
  get styleSheet() {
    return (
      void 0 === this._styleSheet &&
        (W
          ? ((this._styleSheet = new CSSStyleSheet()),
            this._styleSheet.replaceSync(this.cssText))
          : (this._styleSheet = null)),
      this._styleSheet
    );
  }
  toString() {
    return this.cssText;
  }
}
const K = (e, ...t) => {
  const i = t.reduce(
    (t, i, s) =>
      t +
      ((e) => {
        if (e instanceof J) return e.cssText;
        if ("number" == typeof e) return e;
        throw new Error(
          `Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`
        );
      })(i) +
      e[s + 1],
    e[0]
  );
  return new J(i, G);
};
(window.litElementVersions || (window.litElementVersions = [])).push("2.5.1");
const Q = {};
class Y extends Z {
  static getStyles() {
    return this.styles;
  }
  static _getUniqueStyles() {
    if (this.hasOwnProperty(JSCompiler_renameProperty("_styles", this))) return;
    const e = this.getStyles();
    if (Array.isArray(e)) {
      const t = (e, i) =>
          e.reduceRight(
            (e, i) => (Array.isArray(i) ? t(i, e) : (e.add(i), e)),
            i
          ),
        i = t(e, new Set()),
        s = [];
      i.forEach((e) => s.unshift(e)), (this._styles = s);
    } else this._styles = void 0 === e ? [] : [e];
    this._styles = this._styles.map((e) => {
      if (e instanceof CSSStyleSheet && !W) {
        const t = Array.prototype.slice
          .call(e.cssRules)
          .reduce((e, t) => e + t.cssText, "");
        return new J(String(t), G);
      }
      return e;
    });
  }
  initialize() {
    super.initialize(),
      this.constructor._getUniqueStyles(),
      (this.renderRoot = this.createRenderRoot()),
      window.ShadowRoot &&
        this.renderRoot instanceof window.ShadowRoot &&
        this.adoptStyles();
  }
  createRenderRoot() {
    return this.attachShadow(this.constructor.shadowRootOptions);
  }
  adoptStyles() {
    const e = this.constructor._styles;
    0 !== e.length &&
      (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow
        ? W
          ? (this.renderRoot.adoptedStyleSheets = e.map((e) =>
              e instanceof CSSStyleSheet ? e : e.styleSheet
            ))
          : (this._needsShimAdoptedStyleSheets = !0)
        : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(
            e.map((e) => e.cssText),
            this.localName
          ));
  }
  connectedCallback() {
    super.connectedCallback(),
      this.hasUpdated &&
        void 0 !== window.ShadyCSS &&
        window.ShadyCSS.styleElement(this);
  }
  update(e) {
    const t = this.render();
    super.update(e),
      t !== Q &&
        this.constructor.render(t, this.renderRoot, {
          scopeName: this.localName,
          eventContext: this,
        }),
      this._needsShimAdoptedStyleSheets &&
        ((this._needsShimAdoptedStyleSheets = !1),
        this.constructor._styles.forEach((e) => {
          const t = document.createElement("style");
          (t.textContent = e.cssText), this.renderRoot.appendChild(t);
        }));
  }
  render() {
    return Q;
  }
}
(Y.finalized = !0),
  (Y.render = (e, i, s) => {
    if (!s || "object" != typeof s || !s.scopeName)
      throw new Error("The `scopeName` option is required.");
    const a = s.scopeName,
      n = O.has(i),
      r = D && 11 === i.nodeType && !!i.host,
      o = r && !B.has(a),
      l = o ? document.createDocumentFragment() : i;
    if (
      (((e, i, s) => {
        let a = O.get(i);
        void 0 === a &&
          (t(i, i.firstChild),
          O.set(i, (a = new C(Object.assign({ templateFactory: L }, s)))),
          a.appendInto(i)),
          a.setValue(e),
          a.commit();
      })(e, l, Object.assign({ templateFactory: H(a) }, s)),
      o)
    ) {
      const e = O.get(l);
      O.delete(l);
      const s = e.value instanceof v ? e.value.template : void 0;
      I(a, l, s), t(i, i.firstChild), i.appendChild(l), O.set(i, e);
    }
    !n && r && window.ShadyCSS.styleElement(i.host);
  }),
  (Y.shadowRootOptions = { mode: "open" });
let X;
var ee = K(
  X ||
    (X = ((e) => e)`
@import url("https://use.typekit.net/tgy5tlj.css");:root{--uvalib-brand-blue-lightest:#87b9d9;--uvalib-brand-blue-lighter:#3395d4;--uvalib-brand-blue-light:#0370b7;--uvalib-brand-blue:#232d4b;--uvalib-brand-orange-lightest:#ffead6;--uvalib-brand-orange:#e57200;--uvalib-brand-orange-dark:#b35900;--uvalib-blue-alt-light:#55c4ec;--uvalib-blue-alt:#007bac;--uvalib-blue-alt-dark:#005679;--uvalib-blue-alt-darkest:#141e3c;--uvalib-teal-lightest:#c8f2f4;--uvalib-teal-light:#5bd7de;--uvalib-teal:#25cad3;--uvalib-teal-dark:#1da1a8;--uvalib-teal-darker:#16777c;--uvalib-green-lightest:#ddefdc;--uvalib-green:#62bb46;--uvalib-green-dark:#4e9737;--uvalib-red-lightest:#fbcfda;--uvalib-red:#ef3f6b;--uvalib-red-emergency:#b30000;--uvalib-red-darker:#b30000;--uvalib-red-dark:#df1e43;--uvalib-yellow-light:#fef6c8;--uvalib-yellow:#ecc602;--uvalib-yellow-dark:#b99c02;--uvalib-beige:#f7efe1;--uvalib-beige-dark:#c0b298;--uvalib-grey-lightest:#f1f1f1;--uvalib-grey-light:#dadada;--uvalib-grey:grey;--uvalib-grey-dark:#4f4f4f;--uvalib-grey-darkest:#2b2b2b;--uvalib-white:#fff;--uvalib-text-light:#fff;--uvalib-text:#4f4f4f;--uvalib-text-dark:#2b2b2b;--uvalib-primary-orange:#e57200;--uvalib-accessibility-highlight:#0370b7;--uvalib-color-link:#005679;--uvalib-color-link-darker:#005679;--uvalib-color-primary-text:#4f4f4f;--uvalib-color-error:#b30000;color:#4f4f4f;font-family:franklin-gothic-urw,arial,sans-serif;font-weight:300;margin-bottom:.25em;margin-top:1em;text-transform:none}.apply-border{border:1px solid #dadada;margin-bottom:1rem;padding:.75rem 1.25rem;position:relative}.h1,h1{color:#232d4b;font-family:franklin-gothic-urw,arial,sans-serif;font-size:60px;font-weight:700;line-height:60px;margin-bottom:.66667em;margin-top:.25em}.h2,h2{font-size:32px;line-height:32px}.h2,.h3,h2,h3{color:#232d4b;font-family:franklin-gothic-urw,arial,sans-serif;font-weight:500}.h3,h3{font-size:24px;line-height:24px}.h4,h4{font-size:20px;line-height:20px}.h4,.h5,h4,h5{color:#232d4b;font-family:franklin-gothic-urw,arial,sans-serif;font-weight:500}.h5,.h6,h5,h6{font-size:16px;line-height:16px}.h6,h6{color:#4f4f4f;font-family:franklin-gothic-urw,arial,sans-serif;font-weight:400}
/*# sourceMappingURL=css/styles.css.map */
`)
);
function te(e, t, i) {
  return (
    t in e
      ? Object.defineProperty(e, t, {
          value: i,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = i),
    e
  );
}
function ie(e, t) {
  return (function (e, t) {
    if (t.get) return t.get.call(e);
    return t.value;
  })(e, ae(e, t, "get"));
}
function se(e, t, i) {
  return (
    (function (e, t, i) {
      if (t.set) t.set.call(e, i);
      else {
        if (!t.writable)
          throw new TypeError("attempted to set read only private field");
        t.value = i;
      }
    })(e, ae(e, t, "set"), i),
    i
  );
}
function ae(e, t, i) {
  if (!t.has(e))
    throw new TypeError("attempted to " + i + " private field on non-instance");
  return t.get(e);
}
const ne = { devMode: !1 },
  re = { start: 0, rows: 5, keyword: "" },
  oe = {
    attributes: [],
    description: "",
    id: "",
    mode: "",
    name: "",
    sort_options: [],
    source: "",
    url: "",
  };
function le(e) {
  return Object.assign({}, ...e.map((e) => ({ [e.id]: e })));
}
var ce = new WeakMap();
class de {
  constructor(e) {
    ce.set(this, { writable: !0, value: void 0 }),
      te(this, "attributes", void 0),
      te(this, "description", void 0),
      te(this, "id", void 0),
      te(this, "mode", void 0),
      te(this, "name", void 0),
      te(this, "sortOptions", void 0),
      te(this, "source", void 0),
      te(this, "url", void 0),
      se(this, ce, { ...oe, ...e }),
      (this.attributes = ie(this, ce).attributes),
      (this.description = ie(this, ce).description),
      (this.id = ie(this, ce).id),
      (this.mode = ie(this, ce).mode),
      (this.name = ie(this, ce).name),
      (this.sortOptions = ie(this, ce).sort_options),
      (this.source = ie(this, ce).source),
      (this.url = ie(this, ce).url);
  }
}
var he = new WeakMap(),
  ue = new WeakMap(),
  pe = new WeakMap(),
  fe = new WeakMap();
class me {
  constructor(e) {
    he.set(this, { writable: !0, value: void 0 }),
      ue.set(this, { writable: !0, value: void 0 }),
      pe.set(this, { writable: !0, value: void 0 }),
      fe.set(this, { writable: !0, value: void 0 }),
      te(this, "lastKeyword", void 0),
      te(this, "lastStart", void 0),
      te(this, "lastRows", void 0),
      te(this, "lastRequest", void 0),
      te(this, "lastSuggestions", void 0),
      se(this, ue, { ...ne, ...e }),
      (this.devMode = ie(this, ue).devMode);
  }
  set devMode(e) {
    e
      ? (console.info("dev mode is true"),
        se(this, pe, "https://search-ws.internal.lib.virginia.edu"))
      : (console.info("dev mode is false"),
        se(this, pe, "https://search-ws.internal.lib.virginia.edu"));
  }
  set lastPools(e) {
    Array.isArray(e) &&
      se(
        this,
        fe,
        e.map((e) => new de(e))
      );
  }
  get lastPools() {
    return ie(this, fe);
  }
  set lastPoolResults(e) {
    Array.isArray(e) &&
      this.poolsPromise.then((t) => {
        e.forEach((e) => {
          t[e.pool_id].lastRssults = e;
        });
      });
  }
  get lastPoolResluts() {}
  get poolsPromise() {
    return this.lastPools
      ? Promise.resolve(le(this.lastPools))
      : this.fetchResults({ rows: 0 }).then(() => le(this.lastPools));
  }
  get authenticated() {
    return !!ie(this, he);
  }
  authorize() {
    return this.authenticated
      ? Promise.resolve(ie(this, he))
      : fetch("https://search.lib.virginia.edu/authorize", {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
        })
          .then((e) => e.text())
          .then((e) => (se(this, he, e), ie(this, he)));
  }
  fetchResults(e) {
    let t = { ...re, ...e };
    return this.authorize().then((e) =>
      fetch(`${ie(this, pe)}/api/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${e}`,
        },
        body: JSON.stringify({
          query: `keyword: {${t.keyword}}`,
          pagination: { start: t.start, rows: t.rows },
        }),
      })
        .then((e) => e.json())
        .then(
          (e) => (
            (this.lastKeyword = t.keyword),
            (this.lastStart = t.start),
            (this.lastRows = t.rows),
            (this.lastPools = e.pools),
            (this.lastPoolResults = e.pool_results),
            (this.lastRequest = e.request),
            (this.lastSuggestions = e.suggestions),
            e
          )
        )
    );
  }
}
const _e =
    window.ShadowRoot &&
    (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow) &&
    "adoptedStyleSheets" in Document.prototype &&
    "replace" in CSSStyleSheet.prototype,
  ve = Symbol();
class ge {
  constructor(e, t) {
    if (t !== ve)
      throw Error(
        "CSSResult is not constructable. Use `unsafeCSS` or `css` instead."
      );
    this.cssText = e;
  }
  get styleSheet() {
    return (
      _e &&
        void 0 === this.t &&
        ((this.t = new CSSStyleSheet()), this.t.replaceSync(this.cssText)),
      this.t
    );
  }
  toString() {
    return this.cssText;
  }
}
const be = new Map(),
  ye = (e) => {
    let t = be.get(e);
    return void 0 === t && be.set(e, (t = new ge(e, ve))), t;
  },
  we = (e, ...t) => {
    const i =
      1 === e.length
        ? e[0]
        : t.reduce(
            (t, i, s) =>
              t +
              ((e) => {
                if (e instanceof ge) return e.cssText;
                if ("number" == typeof e) return e;
                throw Error(
                  "Value passed to 'css' function must be a 'css' function result: " +
                    e +
                    ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security."
                );
              })(i) +
              e[s + 1],
            e[0]
          );
    return ye(i);
  },
  xe = (e, t) => {
    _e
      ? (e.adoptedStyleSheets = t.map((e) =>
          e instanceof CSSStyleSheet ? e : e.styleSheet
        ))
      : t.forEach((t) => {
          const i = document.createElement("style");
          (i.textContent = t.cssText), e.appendChild(i);
        });
  },
  Se = _e
    ? (e) => e
    : (e) =>
        e instanceof CSSStyleSheet
          ? ((e) => {
              let t = "";
              for (const i of e.cssRules) t += i.cssText;
              return ((e) => ye("string" == typeof e ? e : e + ""))(t);
            })(e)
          : e;
var ke, Ce, Ee, Ne;
const Ve = {
    toAttribute(e, t) {
      switch (t) {
        case Boolean:
          e = e ? "" : null;
          break;
        case Object:
        case Array:
          e = null == e ? e : JSON.stringify(e);
      }
      return e;
    },
    fromAttribute(e, t) {
      let i = e;
      switch (t) {
        case Boolean:
          i = null !== e;
          break;
        case Number:
          i = null === e ? null : Number(e);
          break;
        case Object:
        case Array:
          try {
            i = JSON.parse(e);
          } catch (e) {
            i = null;
          }
      }
      return i;
    },
  },
  Te = (e, t) => t !== e && (t == t || e == e),
  Pe = {
    attribute: !0,
    type: String,
    converter: Ve,
    reflect: !1,
    hasChanged: Te,
  };
class Me extends HTMLElement {
  constructor() {
    super(),
      (this.??i = new Map()),
      (this.??o = void 0),
      (this.??l = void 0),
      (this.isUpdatePending = !1),
      (this.hasUpdated = !1),
      (this.??h = null),
      this.u();
  }
  static addInitializer(e) {
    var t;
    (null !== (t = this.v) && void 0 !== t) || (this.v = []), this.v.push(e);
  }
  static get observedAttributes() {
    this.finalize();
    const e = [];
    return (
      this.elementProperties.forEach((t, i) => {
        const s = this.??p(i, t);
        void 0 !== s && (this.??m.set(s, i), e.push(s));
      }),
      e
    );
  }
  static createProperty(e, t = Pe) {
    if (
      (t.state && (t.attribute = !1),
      this.finalize(),
      this.elementProperties.set(e, t),
      !t.noAccessor && !this.prototype.hasOwnProperty(e))
    ) {
      const i = "symbol" == typeof e ? Symbol() : "__" + e,
        s = this.getPropertyDescriptor(e, i, t);
      void 0 !== s && Object.defineProperty(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    return {
      get() {
        return this[t];
      },
      set(s) {
        const a = this[e];
        (this[t] = s), this.requestUpdate(e, a, i);
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) || Pe;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized")) return !1;
    this.finalized = !0;
    const e = Object.getPrototypeOf(this);
    if (
      (e.finalize(),
      (this.elementProperties = new Map(e.elementProperties)),
      (this.??m = new Map()),
      this.hasOwnProperty("properties"))
    ) {
      const e = this.properties,
        t = [
          ...Object.getOwnPropertyNames(e),
          ...Object.getOwnPropertySymbols(e),
        ];
      for (const i of t) this.createProperty(i, e[i]);
    }
    return (this.elementStyles = this.finalizeStyles(this.styles)), !0;
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const e of i) t.unshift(Se(e));
    } else void 0 !== e && t.push(Se(e));
    return t;
  }
  static ??p(e, t) {
    const i = t.attribute;
    return !1 === i
      ? void 0
      : "string" == typeof i
      ? i
      : "string" == typeof e
      ? e.toLowerCase()
      : void 0;
  }
  u() {
    var e;
    (this.??g = new Promise((e) => (this.enableUpdating = e))),
      (this.L = new Map()),
      this.??_(),
      this.requestUpdate(),
      null === (e = this.constructor.v) ||
        void 0 === e ||
        e.forEach((e) => e(this));
  }
  addController(e) {
    var t, i;
    (null !== (t = this.??U) && void 0 !== t ? t : (this.??U = [])).push(e),
      void 0 !== this.renderRoot &&
        this.isConnected &&
        (null === (i = e.hostConnected) || void 0 === i || i.call(e));
  }
  removeController(e) {
    var t;
    null === (t = this.??U) ||
      void 0 === t ||
      t.splice(this.??U.indexOf(e) >>> 0, 1);
  }
  ??_() {
    this.constructor.elementProperties.forEach((e, t) => {
      this.hasOwnProperty(t) && (this.??i.set(t, this[t]), delete this[t]);
    });
  }
  createRenderRoot() {
    var e;
    const t =
      null !== (e = this.shadowRoot) && void 0 !== e
        ? e
        : this.attachShadow(this.constructor.shadowRootOptions);
    return xe(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var e;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()),
      this.enableUpdating(!0),
      null === (e = this.??U) ||
        void 0 === e ||
        e.forEach((e) => {
          var t;
          return null === (t = e.hostConnected) || void 0 === t
            ? void 0
            : t.call(e);
        }),
      this.??l && (this.??l(), (this.??o = this.??l = void 0));
  }
  enableUpdating(e) {}
  disconnectedCallback() {
    var e;
    null === (e = this.??U) ||
      void 0 === e ||
      e.forEach((e) => {
        var t;
        return null === (t = e.hostDisconnected) || void 0 === t
          ? void 0
          : t.call(e);
      }),
      (this.??o = new Promise((e) => (this.??l = e)));
  }
  attributeChangedCallback(e, t, i) {
    this.K(e, i);
  }
  ??j(e, t, i = Pe) {
    var s, a;
    const n = this.constructor.??p(e, i);
    if (void 0 !== n && !0 === i.reflect) {
      const r = (
        null !==
          (a =
            null === (s = i.converter) || void 0 === s
              ? void 0
              : s.toAttribute) && void 0 !== a
          ? a
          : Ve.toAttribute
      )(t, i.type);
      (this.??h = e),
        null == r ? this.removeAttribute(n) : this.setAttribute(n, r),
        (this.??h = null);
    }
  }
  K(e, t) {
    var i, s, a;
    const n = this.constructor,
      r = n.??m.get(e);
    if (void 0 !== r && this.??h !== r) {
      const e = n.getPropertyOptions(r),
        o = e.converter,
        l =
          null !==
            (a =
              null !==
                (s =
                  null === (i = o) || void 0 === i
                    ? void 0
                    : i.fromAttribute) && void 0 !== s
                ? s
                : "function" == typeof o
                ? o
                : null) && void 0 !== a
            ? a
            : Ve.fromAttribute;
      (this.??h = r), (this[r] = l(t, e.type)), (this.??h = null);
    }
  }
  requestUpdate(e, t, i) {
    let s = !0;
    void 0 !== e &&
      (((i = i || this.constructor.getPropertyOptions(e)).hasChanged || Te)(
        this[e],
        t
      )
        ? (this.L.has(e) || this.L.set(e, t),
          !0 === i.reflect &&
            this.??h !== e &&
            (void 0 === this.??k && (this.??k = new Map()), this.??k.set(e, i)))
        : (s = !1)),
      !this.isUpdatePending && s && (this.??g = this.??q());
  }
  async ??q() {
    this.isUpdatePending = !0;
    try {
      for (await this.??g; this.??o; ) await this.??o;
    } catch (e) {
      Promise.reject(e);
    }
    const e = this.performUpdate();
    return null != e && (await e), !this.isUpdatePending;
  }
  performUpdate() {
    var e;
    if (!this.isUpdatePending) return;
    this.hasUpdated,
      this.??i && (this.??i.forEach((e, t) => (this[t] = e)), (this.??i = void 0));
    let t = !1;
    const i = this.L;
    try {
      (t = this.shouldUpdate(i)),
        t
          ? (this.willUpdate(i),
            null === (e = this.??U) ||
              void 0 === e ||
              e.forEach((e) => {
                var t;
                return null === (t = e.hostUpdate) || void 0 === t
                  ? void 0
                  : t.call(e);
              }),
            this.update(i))
          : this.??$();
    } catch (e) {
      throw ((t = !1), this.??$(), e);
    }
    t && this.E(i);
  }
  willUpdate(e) {}
  E(e) {
    var t;
    null === (t = this.??U) ||
      void 0 === t ||
      t.forEach((e) => {
        var t;
        return null === (t = e.hostUpdated) || void 0 === t
          ? void 0
          : t.call(e);
      }),
      this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(e)),
      this.updated(e);
  }
  ??$() {
    (this.L = new Map()), (this.isUpdatePending = !1);
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this.??g;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    void 0 !== this.??k &&
      (this.??k.forEach((e, t) => this.??j(t, this[t], e)), (this.??k = void 0)),
      this.??$();
  }
  updated(e) {}
  firstUpdated(e) {}
}
var Le, Ae, Oe, Fe;
(Me.finalized = !0),
  (Me.elementProperties = new Map()),
  (Me.elementStyles = []),
  (Me.shadowRootOptions = { mode: "open" }),
  null === (Ce = (ke = globalThis).reactiveElementPlatformSupport) ||
    void 0 === Ce ||
    Ce.call(ke, { ReactiveElement: Me }),
  (null !== (Ee = (Ne = globalThis).reactiveElementVersions) && void 0 !== Ee
    ? Ee
    : (Ne.reactiveElementVersions = [])
  ).push("1.0.0-rc.2");
const Re = globalThis.trustedTypes,
  Ue = Re ? Re.createPolicy("lit-html", { createHTML: (e) => e }) : void 0,
  De = `lit$${(Math.random() + "").slice(9)}$`,
  He = "?" + De,
  $e = `<${He}>`,
  Be = document,
  Ie = (e = "") => Be.createComment(e),
  je = (e) => null === e || ("object" != typeof e && "function" != typeof e),
  ze = Array.isArray,
  qe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  Ze = /-->/g,
  We = />/g,
  Ge =
    />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,
  Je = /'/g,
  Ke = /"/g,
  Qe = /^(?:script|style|textarea)$/i,
  Ye = (
    (e) =>
    (t, ...i) => ({ _$litType$: e, strings: t, values: i })
  )(1),
  Xe = Symbol.for("lit-noChange"),
  et = Symbol.for("lit-nothing"),
  tt = new WeakMap(),
  it = Be.createTreeWalker(Be, 129, null, !1),
  st = (e, t) => {
    const i = e.length - 1,
      s = [];
    let a,
      n = 2 === t ? "<svg>" : "",
      r = qe;
    for (let t = 0; t < i; t++) {
      const i = e[t];
      let o,
        l,
        c = -1,
        d = 0;
      for (; d < i.length && ((r.lastIndex = d), (l = r.exec(i)), null !== l); )
        (d = r.lastIndex),
          r === qe
            ? "!--" === l[1]
              ? (r = Ze)
              : void 0 !== l[1]
              ? (r = We)
              : void 0 !== l[2]
              ? (Qe.test(l[2]) && (a = RegExp("</" + l[2], "g")), (r = Ge))
              : void 0 !== l[3] && (r = Ge)
            : r === Ge
            ? ">" === l[0]
              ? ((r = null != a ? a : qe), (c = -1))
              : void 0 === l[1]
              ? (c = -2)
              : ((c = r.lastIndex - l[2].length),
                (o = l[1]),
                (r = void 0 === l[3] ? Ge : '"' === l[3] ? Ke : Je))
            : r === Ke || r === Je
            ? (r = Ge)
            : r === Ze || r === We
            ? (r = qe)
            : ((r = Ge), (a = void 0));
      const h = r === Ge && e[t + 1].startsWith("/>") ? " " : "";
      n +=
        r === qe
          ? i + $e
          : c >= 0
          ? (s.push(o), i.slice(0, c) + "$lit$" + i.slice(c) + De + h)
          : i + De + (-2 === c ? (s.push(void 0), t) : h);
    }
    const o = n + (e[i] || "<?>") + (2 === t ? "</svg>" : "");
    return [void 0 !== Ue ? Ue.createHTML(o) : o, s];
  };
class at {
  constructor({ strings: e, _$litType$: t }, i) {
    let s;
    this.parts = [];
    let a = 0,
      n = 0;
    const r = e.length - 1,
      o = this.parts,
      [l, c] = st(e, t);
    if (
      ((this.el = at.createElement(l, i)),
      (it.currentNode = this.el.content),
      2 === t)
    ) {
      const e = this.el.content,
        t = e.firstChild;
      t.remove(), e.append(...t.childNodes);
    }
    for (; null !== (s = it.nextNode()) && o.length < r; ) {
      if (1 === s.nodeType) {
        if (s.hasAttributes()) {
          const e = [];
          for (const t of s.getAttributeNames())
            if (t.endsWith("$lit$") || t.startsWith(De)) {
              const i = c[n++];
              if ((e.push(t), void 0 !== i)) {
                const e = s.getAttribute(i.toLowerCase() + "$lit$").split(De),
                  t = /([.?@])?(.*)/.exec(i);
                o.push({
                  type: 1,
                  index: a,
                  name: t[2],
                  strings: e,
                  ctor:
                    "." === t[1]
                      ? ct
                      : "?" === t[1]
                      ? dt
                      : "@" === t[1]
                      ? ht
                      : lt,
                });
              } else o.push({ type: 6, index: a });
            }
          for (const t of e) s.removeAttribute(t);
        }
        if (Qe.test(s.tagName)) {
          const e = s.textContent.split(De),
            t = e.length - 1;
          if (t > 0) {
            s.textContent = Re ? Re.emptyScript : "";
            for (let i = 0; i < t; i++)
              s.append(e[i], Ie()),
                it.nextNode(),
                o.push({ type: 2, index: ++a });
            s.append(e[t], Ie());
          }
        }
      } else if (8 === s.nodeType)
        if (s.data === He) o.push({ type: 2, index: a });
        else {
          let e = -1;
          for (; -1 !== (e = s.data.indexOf(De, e + 1)); )
            o.push({ type: 7, index: a }), (e += De.length - 1);
        }
      a++;
    }
  }
  static createElement(e, t) {
    const i = Be.createElement("template");
    return (i.innerHTML = e), i;
  }
}
function nt(e, t, i = e, s) {
  var a, n, r, o;
  if (t === Xe) return t;
  let l =
    void 0 !== s ? (null === (a = i.??i) || void 0 === a ? void 0 : a[s]) : i.??o;
  const c = je(t) ? void 0 : t._$litDirective$;
  return (
    (null == l ? void 0 : l.constructor) !== c &&
      (null === (n = null == l ? void 0 : l.O) || void 0 === n || n.call(l, !1),
      void 0 === c ? (l = void 0) : ((l = new c(e)), l.T(e, i, s)),
      void 0 !== s
        ? ((null !== (r = (o = i).??i) && void 0 !== r ? r : (o.??i = []))[s] = l)
        : (i.??o = l)),
    void 0 !== l && (t = nt(e, l.S(e, t.values), l, s)),
    t
  );
}
class rt {
  constructor(e, t) {
    (this.l = []), (this.N = void 0), (this.D = e), (this.M = t);
  }
  u(e) {
    var t;
    const {
        el: { content: i },
        parts: s,
      } = this.D,
      a = (
        null !== (t = null == e ? void 0 : e.creationScope) && void 0 !== t
          ? t
          : Be
      ).importNode(i, !0);
    it.currentNode = a;
    let n = it.nextNode(),
      r = 0,
      o = 0,
      l = s[0];
    for (; void 0 !== l; ) {
      if (r === l.index) {
        let t;
        2 === l.type
          ? (t = new ot(n, n.nextSibling, this, e))
          : 1 === l.type
          ? (t = new l.ctor(n, l.name, l.strings, this, e))
          : 6 === l.type && (t = new ut(n, this, e)),
          this.l.push(t),
          (l = s[++o]);
      }
      r !== (null == l ? void 0 : l.index) && ((n = it.nextNode()), r++);
    }
    return a;
  }
  v(e) {
    let t = 0;
    for (const i of this.l)
      void 0 !== i &&
        (void 0 !== i.strings
          ? (i.I(e, i, t), (t += i.strings.length - 2))
          : i.I(e[t])),
        t++;
  }
}
class ot {
  constructor(e, t, i, s) {
    (this.type = 2),
      (this.N = void 0),
      (this.A = e),
      (this.B = t),
      (this.M = i),
      (this.options = s);
  }
  setConnected(e) {
    var t;
    null === (t = this.P) || void 0 === t || t.call(this, e);
  }
  get parentNode() {
    return this.A.parentNode;
  }
  get startNode() {
    return this.A;
  }
  get endNode() {
    return this.B;
  }
  I(e, t = this) {
    (e = nt(this, e, t)),
      je(e)
        ? e === et || null == e || "" === e
          ? (this.H !== et && this.R(), (this.H = et))
          : e !== this.H && e !== Xe && this.m(e)
        : void 0 !== e._$litType$
        ? this._(e)
        : void 0 !== e.nodeType
        ? this.$(e)
        : ((e) => {
            var t;
            return (
              ze(e) ||
              "function" ==
                typeof (null === (t = e) || void 0 === t
                  ? void 0
                  : t[Symbol.iterator])
            );
          })(e)
        ? this.g(e)
        : this.m(e);
  }
  k(e, t = this.B) {
    return this.A.parentNode.insertBefore(e, t);
  }
  $(e) {
    this.H !== e && (this.R(), (this.H = this.k(e)));
  }
  m(e) {
    const t = this.A.nextSibling;
    null !== t &&
    3 === t.nodeType &&
    (null === this.B ? null === t.nextSibling : t === this.B.previousSibling)
      ? (t.data = e)
      : this.$(Be.createTextNode(e)),
      (this.H = e);
  }
  _(e) {
    var t;
    const { values: i, _$litType$: s } = e,
      a =
        "number" == typeof s
          ? this.C(e)
          : (void 0 === s.el && (s.el = at.createElement(s.h, this.options)),
            s);
    if ((null === (t = this.H) || void 0 === t ? void 0 : t.D) === a)
      this.H.v(i);
    else {
      const e = new rt(a, this),
        t = e.u(this.options);
      e.v(i), this.$(t), (this.H = e);
    }
  }
  C(e) {
    let t = tt.get(e.strings);
    return void 0 === t && tt.set(e.strings, (t = new at(e))), t;
  }
  g(e) {
    ze(this.H) || ((this.H = []), this.R());
    const t = this.H;
    let i,
      s = 0;
    for (const a of e)
      s === t.length
        ? t.push((i = new ot(this.k(Ie()), this.k(Ie()), this, this.options)))
        : (i = t[s]),
        i.I(a),
        s++;
    s < t.length && (this.R(i && i.B.nextSibling, s), (t.length = s));
  }
  R(e = this.A.nextSibling, t) {
    var i;
    for (
      null === (i = this.P) || void 0 === i || i.call(this, !1, !0, t);
      e && e !== this.B;

    ) {
      const t = e.nextSibling;
      e.remove(), (e = t);
    }
  }
}
class lt {
  constructor(e, t, i, s, a) {
    (this.type = 1),
      (this.H = et),
      (this.N = void 0),
      (this.V = void 0),
      (this.element = e),
      (this.name = t),
      (this.M = s),
      (this.options = a),
      i.length > 2 || "" !== i[0] || "" !== i[1]
        ? ((this.H = Array(i.length - 1).fill(et)), (this.strings = i))
        : (this.H = et);
  }
  get tagName() {
    return this.element.tagName;
  }
  I(e, t = this, i, s) {
    const a = this.strings;
    let n = !1;
    if (void 0 === a)
      (e = nt(this, e, t, 0)),
        (n = !je(e) || (e !== this.H && e !== Xe)),
        n && (this.H = e);
    else {
      const s = e;
      let r, o;
      for (e = a[0], r = 0; r < a.length - 1; r++)
        (o = nt(this, s[i + r], t, r)),
          o === Xe && (o = this.H[r]),
          n || (n = !je(o) || o !== this.H[r]),
          o === et
            ? (e = et)
            : e !== et && (e += (null != o ? o : "") + a[r + 1]),
          (this.H[r] = o);
    }
    n && !s && this.W(e);
  }
  W(e) {
    e === et
      ? this.element.removeAttribute(this.name)
      : this.element.setAttribute(this.name, null != e ? e : "");
  }
}
class ct extends lt {
  constructor() {
    super(...arguments), (this.type = 3);
  }
  W(e) {
    this.element[this.name] = e === et ? void 0 : e;
  }
}
class dt extends lt {
  constructor() {
    super(...arguments), (this.type = 4);
  }
  W(e) {
    e && e !== et
      ? this.element.setAttribute(this.name, "")
      : this.element.removeAttribute(this.name);
  }
}
class ht extends lt {
  constructor() {
    super(...arguments), (this.type = 5);
  }
  I(e, t = this) {
    var i;
    if ((e = null !== (i = nt(this, e, t, 0)) && void 0 !== i ? i : et) === Xe)
      return;
    const s = this.H,
      a =
        (e === et && s !== et) ||
        e.capture !== s.capture ||
        e.once !== s.once ||
        e.passive !== s.passive,
      n = e !== et && (s === et || a);
    a && this.element.removeEventListener(this.name, this, s),
      n && this.element.addEventListener(this.name, this, e),
      (this.H = e);
  }
  handleEvent(e) {
    var t, i;
    "function" == typeof this.H
      ? this.H.call(
          null !==
            (i =
              null === (t = this.options) || void 0 === t ? void 0 : t.host) &&
            void 0 !== i
            ? i
            : this.element,
          e
        )
      : this.H.handleEvent(e);
  }
}
class ut {
  constructor(e, t, i) {
    (this.element = e),
      (this.type = 6),
      (this.N = void 0),
      (this.V = void 0),
      (this.M = t),
      (this.options = i);
  }
  I(e) {
    nt(this, e);
  }
}
var pt, ft, mt, _t, vt, gt;
null === (Ae = (Le = globalThis).litHtmlPlatformSupport) ||
  void 0 === Ae ||
  Ae.call(Le, at, ot),
  (null !== (Oe = (Fe = globalThis).litHtmlVersions) && void 0 !== Oe
    ? Oe
    : (Fe.litHtmlVersions = [])
  ).push("2.0.0-rc.3"),
  (null !== (pt = (gt = globalThis).litElementVersions) && void 0 !== pt
    ? pt
    : (gt.litElementVersions = [])
  ).push("3.0.0-rc.2");
class bt extends Me {
  constructor() {
    super(...arguments),
      (this.renderOptions = { host: this }),
      (this.??t = void 0);
  }
  createRenderRoot() {
    var e, t;
    const i = super.createRenderRoot();
    return (
      (null !== (e = (t = this.renderOptions).renderBefore) && void 0 !== e) ||
        (t.renderBefore = i.firstChild),
      i
    );
  }
  update(e) {
    const t = this.render();
    super.update(e),
      (this.??t = ((e, t, i) => {
        var s, a;
        const n =
          null !== (s = null == i ? void 0 : i.renderBefore) && void 0 !== s
            ? s
            : t;
        let r = n._$litPart$;
        if (void 0 === r) {
          const e =
            null !== (a = null == i ? void 0 : i.renderBefore) && void 0 !== a
              ? a
              : null;
          n._$litPart$ = r = new ot(t.insertBefore(Ie(), e), e, void 0, i);
        }
        return r.I(e), r;
      })(t, this.renderRoot, this.renderOptions));
  }
  connectedCallback() {
    var e;
    super.connectedCallback(),
      null === (e = this.??t) || void 0 === e || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(),
      null === (e = this.??t) || void 0 === e || e.setConnected(!1);
  }
  render() {
    return Xe;
  }
}
(bt.finalized = !0),
  (bt._$litElement$ = !0),
  null === (mt = (ft = globalThis).litElementHydrateSupport) ||
    void 0 === mt ||
    mt.call(ft, { LitElement: bt }),
  null === (vt = (_t = globalThis).litElementPlatformSupport) ||
    void 0 === vt ||
    vt.call(_t, { LitElement: bt }),
  function () {
    function e(e) {
      var t = 0;
      return function () {
        return t < e.length ? { done: !1, value: e[t++] } : { done: !0 };
      };
    }
    if (!ShadowRoot.prototype.createElement) {
      var t,
        i = window.HTMLElement,
        s = window.customElements.define,
        a = window.customElements.get,
        n = window.customElements,
        r = new WeakMap(),
        o = new WeakMap(),
        l = new WeakMap(),
        c = new WeakMap();
      (window.CustomElementRegistry = function () {
        (this.l = new Map()),
          (this.o = new Map()),
          (this.i = new Map()),
          (this.h = new Map());
      }),
        (window.CustomElementRegistry.prototype.define = function (t, i) {
          if (((t = t.toLowerCase()), void 0 !== this.j(t)))
            throw new DOMException(
              "Failed to execute 'define' on 'CustomElementRegistry': the name \"" +
                t +
                '" has already been used with this registry'
            );
          if (void 0 !== this.o.get(i))
            throw new DOMException(
              "Failed to execute 'define' on 'CustomElementRegistry': this constructor has already been used with this registry"
            );
          var r = i.prototype.attributeChangedCallback,
            c = new Set(i.observedAttributes || []);
          if (
            (h(i, c, r),
            (r = {
              g: i,
              connectedCallback: i.prototype.connectedCallback,
              disconnectedCallback: i.prototype.disconnectedCallback,
              adoptedCallback: i.prototype.adoptedCallback,
              attributeChangedCallback: r,
              observedAttributes: c,
            }),
            this.l.set(t, r),
            this.o.set(i, r),
            (c = a.call(n, t)) || ((c = d(t)), s.call(n, t, c)),
            this === window.customElements && (l.set(i, r), (r.s = c)),
            (c = this.h.get(t)))
          ) {
            this.h.delete(t);
            var u =
              "undefined" != typeof Symbol &&
              Symbol.iterator &&
              c[Symbol.iterator];
            for (
              c = u ? u.call(c) : { next: e(c) }, u = c.next();
              !u.done;
              u = c.next()
            )
              (u = u.value), o.delete(u), p(u, r, !0);
          }
          return (
            void 0 !== (r = this.i.get(t)) && (r.resolve(i), this.i.delete(t)),
            i
          );
        }),
        (window.CustomElementRegistry.prototype.upgrade = function () {
          m.push(this), n.upgrade.apply(n, arguments), m.pop();
        }),
        (window.CustomElementRegistry.prototype.get = function (e) {
          var t;
          return null == (t = this.l.get(e)) ? void 0 : t.g;
        }),
        (window.CustomElementRegistry.prototype.j = function (e) {
          return this.l.get(e);
        }),
        (window.CustomElementRegistry.prototype.whenDefined = function (e) {
          var t = this.j(e);
          if (void 0 !== t) return Promise.resolve(t.g);
          var i = this.i.get(e);
          return (
            void 0 === i &&
              (((i = {}).promise = new Promise(function (e) {
                return (i.resolve = e);
              })),
              this.i.set(e, i)),
            i.promise
          );
        }),
        (window.CustomElementRegistry.prototype.m = function (e, t, i) {
          var s = this.h.get(t);
          s || this.h.set(t, (s = new Set())), i ? s.add(e) : s.delete(e);
        }),
        (window.HTMLElement = function () {
          var e = t;
          if (e) return (t = void 0), e;
          var s = l.get(this.constructor);
          if (!s)
            throw new TypeError(
              "Illegal constructor (custom element class must be registered with global customElements registry to be newable)"
            );
          return (
            (e = Reflect.construct(i, [], s.s)),
            Object.setPrototypeOf(e, this.constructor.prototype),
            r.set(e, s),
            e
          );
        }),
        (window.HTMLElement.prototype = i.prototype);
      var d = function (e) {
          function t() {
            var t = Reflect.construct(i, [], this.constructor);
            Object.setPrototypeOf(t, HTMLElement.prototype);
            e: {
              var s = t.getRootNode();
              if (!(s === document || s instanceof ShadowRoot)) {
                if ((s = m[m.length - 1]) instanceof CustomElementRegistry) {
                  var a = s;
                  break e;
                }
                (s = s.getRootNode()) === document ||
                  s instanceof ShadowRoot ||
                  (s =
                    (null == (a = c.get(s)) ? void 0 : a.getRootNode()) ||
                    document);
              }
              a = s.customElements;
            }
            return (
              (s = (a = a || window.customElements).j(e))
                ? p(t, s)
                : o.set(t, a),
              t
            );
          }
          return (
            (t.prototype.connectedCallback = function () {
              var t = r.get(this);
              t
                ? t.connectedCallback &&
                  t.connectedCallback.apply(this, arguments)
                : o.get(this).m(this, e, !0);
            }),
            (t.prototype.disconnectedCallback = function () {
              var t = r.get(this);
              t
                ? t.disconnectedCallback &&
                  t.disconnectedCallback.apply(this, arguments)
                : o.get(this).m(this, e, !1);
            }),
            (t.prototype.adoptedCallback = function () {
              var e, t;
              null == (e = r.get(this)) ||
                null == (t = e.adoptedCallback) ||
                t.apply(this, arguments);
            }),
            t
          );
        },
        h = function (e, t, i) {
          if (0 !== t.size && void 0 !== i) {
            var s = e.prototype.setAttribute;
            s &&
              (e.prototype.setAttribute = function (e, a) {
                if (t.has(e)) {
                  var n = this.getAttribute(e);
                  s.call(this, e, a), i.call(this, e, n, a);
                } else s.call(this, e, a);
              });
            var a = e.prototype.removeAttribute;
            a &&
              (e.prototype.removeAttribute = function (e) {
                if (t.has(e)) {
                  var s = this.getAttribute(e);
                  a.call(this, e), i.call(this, e, s, null);
                } else a.call(this, e);
              });
          }
        },
        u = function (e) {
          var t = Object.getPrototypeOf(e);
          if (t !== window.HTMLElement)
            return t === i
              ? Object.setPrototypeOf(e, window.HTMLElement)
              : u(t);
        },
        p = function (e, i, s) {
          (s = void 0 !== s && s),
            Object.setPrototypeOf(e, i.g.prototype),
            r.set(e, i),
            (t = e);
          try {
            new i.g();
          } catch (e) {
            u(i.g), new i.g();
          }
          i.observedAttributes.forEach(function (t) {
            e.hasAttribute(t) &&
              i.attributeChangedCallback.call(e, t, null, e.getAttribute(t));
          }),
            s &&
              i.connectedCallback &&
              e.isConnected &&
              i.connectedCallback.call(e);
        },
        f = Element.prototype.attachShadow;
      Element.prototype.attachShadow = function (e) {
        var t = f.apply(this, arguments);
        return e.customElements && (t.customElements = e.customElements), t;
      };
      var m = [document],
        _ = function (e, t, i) {
          var s = (i ? Object.getPrototypeOf(i) : e.prototype)[t];
          e.prototype[t] = function () {
            m.push(this);
            var e = s.apply(i || this, arguments);
            return void 0 !== e && c.set(e, this), m.pop(), e;
          };
        };
      _(ShadowRoot, "createElement", document),
        _(ShadowRoot, "importNode", document),
        _(Element, "insertAdjacentHTML");
      var v = function (e) {
        var t = Object.getOwnPropertyDescriptor(e.prototype, "innerHTML");
        Object.defineProperty(
          e.prototype,
          "innerHTML",
          Object.assign({}, t, {
            set: function (e) {
              m.push(this), t.set.call(this, e), m.pop();
            },
          })
        );
      };
      v(Element),
        v(ShadowRoot),
        Object.defineProperty(window, "customElements", {
          value: new CustomElementRegistry(),
          configurable: !0,
          writable: !0,
        });
    }
  }.call(self);
const yt = new WeakMap();
function wt(e) {
  return (t) => {
    if (
      (function (e, t) {
        let i = t;
        for (; i; ) {
          if (yt.get(i) === e) return !0;
          i = Object.getPrototypeOf(i);
        }
        return !1;
      })(e, t)
    )
      return t;
    const i = e(t);
    return yt.set(i, e), i;
  };
}
const xt = wt(
    (e) =>
      class extends e {
        static get scopedElements() {
          return {};
        }
        static get shadowRootOptions() {
          return this.__shadowRootOptions;
        }
        static set shadowRootOptions(e) {
          this.__shadowRootOptions = e;
        }
        static get elementStyles() {
          return this.__elementStyles;
        }
        static set elementStyles(e) {
          this.__elementStyles = e;
        }
        constructor(...e) {
          super(), (this.renderOptions = this.renderOptions || void 0);
        }
        get registry() {
          return this.constructor.__registry;
        }
        set registry(e) {
          this.constructor.__registry = e;
        }
        createRenderRoot() {
          const {
            scopedElements: e,
            shadowRootOptions: t,
            elementStyles: i,
          } = this.constructor;
          this.registry ||
            ((this.registry = new CustomElementRegistry()),
            Object.entries(e).forEach(([e, t]) => this.registry.define(e, t)));
          const s = { mode: "open", ...t, customElements: this.registry };
          return (
            (this.renderOptions.creationScope = this.attachShadow(s)),
            this.renderOptions.creationScope instanceof ShadowRoot &&
              xe(this.renderOptions.creationScope, i),
            this.renderOptions.creationScope
          );
        }
        defineScopedElement(e, t) {
          return this.registry.get(e) || this.registry.define(e, t);
        }
        getScopedTagName(e) {
          return e;
        }
        static getScopedTagName(e) {
          return e;
        }
      }
  ),
  St = wt(
    (e) =>
      class extends e {
        static get properties() {
          return { disabled: { type: Boolean, reflect: !0 } };
        }
        constructor() {
          super(),
            (this._requestedToBeDisabled = !1),
            (this.__isUserSettingDisabled = !0),
            (this.__restoreDisabledTo = !1),
            (this.disabled = !1);
        }
        makeRequestToBeDisabled() {
          !1 === this._requestedToBeDisabled &&
            ((this._requestedToBeDisabled = !0),
            (this.__restoreDisabledTo = this.disabled),
            this.__internalSetDisabled(!0));
        }
        retractRequestToBeDisabled() {
          !0 === this._requestedToBeDisabled &&
            ((this._requestedToBeDisabled = !1),
            this.__internalSetDisabled(this.__restoreDisabledTo));
        }
        __internalSetDisabled(e) {
          (this.__isUserSettingDisabled = !1),
            (this.disabled = e),
            (this.__isUserSettingDisabled = !0);
        }
        requestUpdate(e, t) {
          super.requestUpdate(e, t),
            "disabled" === e &&
              (this.__isUserSettingDisabled &&
                (this.__restoreDisabledTo = this.disabled),
              !1 === this.disabled &&
                !0 === this._requestedToBeDisabled &&
                this.__internalSetDisabled(!0));
        }
      }
  ),
  kt = wt(
    (e) =>
      class extends e {
        get slots() {
          return {};
        }
        constructor() {
          super(), (this.__privateSlots = new Set(null));
        }
        connectedCallback() {
          super.connectedCallback && super.connectedCallback(),
            this._connectSlotMixin();
        }
        _connectSlotMixin() {
          this.__isConnectedSlotMixin ||
            (Object.keys(this.slots).forEach((e) => {
              if (!this.querySelector(`[slot=${e}]`)) {
                const t = (0, this.slots[e])();
                t instanceof Element &&
                  (t.setAttribute("slot", e),
                  this.appendChild(t),
                  this.__privateSlots.add(e));
              }
            }),
            (this.__isConnectedSlotMixin = !0));
        }
        _isPrivateSlot(e) {
          return this.__privateSlots.has(e);
        }
      }
  );
function Ct(e = "google-chrome") {
  const t = window.chrome;
  if ("chromium" === e) return t;
  const i = window.navigator,
    s = i.vendor,
    a = void 0 !== window.opr,
    n = i.userAgent.indexOf("Edge") > -1,
    r = i.userAgent.match("CriOS");
  return "ios" === e
    ? r
    : "google-chrome" === e
    ? null != t && "Google Inc." === s && !1 === a && !1 === n
    : void 0;
}
const Et = /Trident/.test(window.navigator.userAgent),
  Nt =
    (Ct(),
    Ct("ios"),
    Ct("chromium"),
    navigator.appVersion.indexOf("Mac"),
    window),
  Vt = new WeakMap();
const Tt = wt(
    (e) =>
      class extends e {
        static get properties() {
          return {
            focused: { type: Boolean, reflect: !0 },
            focusedVisible: {
              type: Boolean,
              reflect: !0,
              attribute: "focused-visible",
            },
          };
        }
        constructor() {
          super(), (this.focused = !1), (this.focusedVisible = !1);
        }
        connectedCallback() {
          super.connectedCallback(), this.__registerEventsForFocusMixin();
        }
        disconnectedCallback() {
          super.disconnectedCallback(), this.__teardownEventsForFocusMixin();
        }
        focus() {
          var e;
          null === (e = this._focusableNode) || void 0 === e || e.focus();
        }
        blur() {
          var e;
          null === (e = this._focusableNode) || void 0 === e || e.blur();
        }
        get _focusableNode() {
          return this._inputNode || document.createElement("input");
        }
        __onFocus() {
          if (
            ((this.focused = !0),
            "function" == typeof Nt.applyFocusVisiblePolyfill)
          )
            this.focusedVisible = this._focusableNode.hasAttribute(
              "data-focus-visible-added"
            );
          else
            try {
              this.focusedVisible =
                this._focusableNode.matches(":focus-visible");
            } catch (e) {
              this.focusedVisible = !1;
            }
        }
        __onBlur() {
          (this.focused = !1), (this.focusedVisible = !1);
        }
        __registerEventsForFocusMixin() {
          var e;
          (e = this.getRootNode()),
            Nt.applyFocusVisiblePolyfill &&
              !Vt.has(e) &&
              (Nt.applyFocusVisiblePolyfill(e), Vt.set(e, void 0)),
            (this.__redispatchFocus = (e) => {
              e.stopPropagation(), this.dispatchEvent(new Event("focus"));
            }),
            this._focusableNode.addEventListener(
              "focus",
              this.__redispatchFocus
            ),
            (this.__redispatchBlur = (e) => {
              e.stopPropagation(), this.dispatchEvent(new Event("blur"));
            }),
            this._focusableNode.addEventListener("blur", this.__redispatchBlur),
            (this.__redispatchFocusin = (e) => {
              e.stopPropagation(),
                this.__onFocus(),
                this.dispatchEvent(
                  new Event("focusin", { bubbles: !0, composed: !0 })
                );
            }),
            this._focusableNode.addEventListener(
              "focusin",
              this.__redispatchFocusin
            ),
            (this.__redispatchFocusout = (e) => {
              e.stopPropagation(),
                this.__onBlur(),
                this.dispatchEvent(
                  new Event("focusout", { bubbles: !0, composed: !0 })
                );
            }),
            this._focusableNode.addEventListener(
              "focusout",
              this.__redispatchFocusout
            );
        }
        __teardownEventsForFocusMixin() {
          this._focusableNode.removeEventListener(
            "focus",
            this.__redispatchFocus
          ),
            this._focusableNode.removeEventListener(
              "blur",
              this.__redispatchBlur
            ),
            this._focusableNode.removeEventListener(
              "focusin",
              this.__redispatchFocusin
            ),
            this._focusableNode.removeEventListener(
              "focusout",
              this.__redispatchFocusout
            );
        }
      }
  ),
  Pt = [
    Node.DOCUMENT_POSITION_PRECEDING,
    Node.DOCUMENT_POSITION_CONTAINS,
    Node.DOCUMENT_POSITION_CONTAINS | Node.DOCUMENT_POSITION_PRECEDING,
  ];
function Mt(e, { reverse: t } = {}) {
  const i = e.filter((e) => e);
  return (
    i.sort((e, t) => {
      const i = e.compareDocumentPosition(t);
      return Pt.includes(i) ? (Et ? -1 : 1) : Et ? 1 : -1;
    }),
    t && i.reverse(),
    i
  );
}
class Lt {
  constructor(e) {
    (this.type = "unparseable"), (this.viewValue = e);
  }
  toString() {
    return JSON.stringify({ type: this.type, viewValue: this.viewValue });
  }
}
const At = wt(
  (e) =>
    class extends e {
      constructor() {
        super(), (this._parentFormGroup = void 0);
      }
      connectedCallback() {
        super.connectedCallback(),
          this.dispatchEvent(
            new CustomEvent("form-element-register", {
              detail: { element: this },
              bubbles: !0,
            })
          );
      }
      disconnectedCallback() {
        super.disconnectedCallback(),
          this._parentFormGroup &&
            this._parentFormGroup.removeFormElement(this);
      }
    }
);
let Ot,
  Ft,
  Rt,
  Ut,
  Dt,
  Ht,
  $t,
  Bt,
  It,
  jt,
  zt,
  qt,
  Zt,
  Wt = (e) => e;
const Gt = wt(
    (e) =>
      class extends At(St(kt(e))) {
        static get properties() {
          return {
            name: { type: String, reflect: !0 },
            readOnly: { type: Boolean, attribute: "readonly", reflect: !0 },
            label: String,
            helpText: { type: String, attribute: "help-text" },
            modelValue: { attribute: !1 },
            _ariaLabelledNodes: { attribute: !1 },
            _ariaDescribedNodes: { attribute: !1 },
            _repropagationRole: { attribute: !1 },
            _isRepropagationEndpoint: { attribute: !1 },
          };
        }
        get label() {
          return (
            this.__label ||
            (this._labelNode && this._labelNode.textContent) ||
            ""
          );
        }
        set label(e) {
          const t = this.label;
          (this.__label = e), this.requestUpdate("label", t);
        }
        get helpText() {
          return (
            this.__helpText ||
            (this._helpTextNode && this._helpTextNode.textContent) ||
            ""
          );
        }
        set helpText(e) {
          const t = this.helpText;
          (this.__helpText = e), this.requestUpdate("helpText", t);
        }
        get fieldName() {
          return this.__fieldName || this.label || this.name || "";
        }
        set fieldName(e) {
          this.__fieldName = e;
        }
        get slots() {
          return {
            ...super.slots,
            label: () => {
              const e = document.createElement("label");
              return (e.textContent = this.label), e;
            },
            "help-text": () => {
              const e = document.createElement("div");
              return (e.textContent = this.helpText), e;
            },
          };
        }
        get _inputNode() {
          return this.__getDirectSlotChild("input");
        }
        get _labelNode() {
          return this.__getDirectSlotChild("label");
        }
        get _helpTextNode() {
          return this.__getDirectSlotChild("help-text");
        }
        get _feedbackNode() {
          return this.__getDirectSlotChild("feedback");
        }
        constructor() {
          super(),
            (this.name = ""),
            (this.readOnly = !1),
            (this.label = ""),
            (this.helpText = ""),
            (this._inputId = `${this.localName}-${Math.random()
              .toString(36)
              .substr(2, 10)}`),
            (this._ariaLabelledNodes = []),
            (this._ariaDescribedNodes = []),
            (this._repropagationRole = "child"),
            (this._isRepropagationEndpoint = !1),
            this.addEventListener(
              "model-value-changed",
              this.__repropagateChildrenValues
            ),
            (this._onLabelClick = this._onLabelClick.bind(this));
        }
        connectedCallback() {
          super.connectedCallback(),
            this._enhanceLightDomClasses(),
            this._enhanceLightDomA11y(),
            this._triggerInitialModelValueChangedEvent(),
            this._labelNode &&
              this._labelNode.addEventListener("click", this._onLabelClick);
        }
        disconnectedCallback() {
          super.disconnectedCallback(),
            this._labelNode &&
              this._labelNode.removeEventListener("click", this._onLabelClick);
        }
        updated(e) {
          super.updated(e),
            e.has("_ariaLabelledNodes") &&
              this.__reflectAriaAttr(
                "aria-labelledby",
                this._ariaLabelledNodes,
                this.__reorderAriaLabelledNodes
              ),
            e.has("_ariaDescribedNodes") &&
              this.__reflectAriaAttr(
                "aria-describedby",
                this._ariaDescribedNodes,
                this.__reorderAriaDescribedNodes
              ),
            e.has("label") &&
              this._labelNode &&
              (this._labelNode.textContent = this.label),
            e.has("helpText") &&
              this._helpTextNode &&
              (this._helpTextNode.textContent = this.helpText),
            e.has("name") &&
              this.dispatchEvent(
                new CustomEvent("form-element-name-changed", {
                  detail: { oldName: e.get("name"), newName: this.name },
                  bubbles: !0,
                })
              );
        }
        _triggerInitialModelValueChangedEvent() {
          this._dispatchInitialModelValueChangedEvent();
        }
        _enhanceLightDomClasses() {
          this._inputNode && this._inputNode.classList.add("form-control");
        }
        _enhanceLightDomA11y() {
          const {
            _inputNode: e,
            _labelNode: t,
            _helpTextNode: i,
            _feedbackNode: s,
          } = this;
          e && (e.id = e.id || this._inputId),
            t &&
              (t.setAttribute("for", this._inputId),
              this.addToAriaLabelledBy(t, { idPrefix: "label" })),
            i && this.addToAriaDescribedBy(i, { idPrefix: "help-text" }),
            s &&
              (this.addEventListener("focusin", () => {
                s.setAttribute("aria-live", "polite");
              }),
              this.addEventListener("focusout", () => {
                s.setAttribute("aria-live", "assertive");
              }),
              this.addToAriaDescribedBy(s, { idPrefix: "feedback" })),
            this._enhanceLightDomA11yForAdditionalSlots();
        }
        _enhanceLightDomA11yForAdditionalSlots(
          e = ["prefix", "suffix", "before", "after"]
        ) {
          e.forEach((e) => {
            const t = this.__getDirectSlotChild(e);
            t &&
              (t.hasAttribute("data-label") &&
                this.addToAriaLabelledBy(t, { idPrefix: e }),
              t.hasAttribute("data-description") &&
                this.addToAriaDescribedBy(t, { idPrefix: e }));
          });
        }
        __reflectAriaAttr(e, t, i) {
          if (this._inputNode) {
            if (i) {
              const e = t.filter((e) => this.contains(e)),
                i = t.filter((e) => !this.contains(e));
              t = [...Mt(e), ...i];
            }
            const s = t.map((e) => e.id).join(" ");
            this._inputNode.setAttribute(e, s);
          }
        }
        render() {
          return Ye(
            Ot ||
              (Ot = Wt`
        <div class="form-field__group-one">${0}</div>
        <div class="form-field__group-two">${0}</div>
      `),
            this._groupOneTemplate(),
            this._groupTwoTemplate()
          );
        }
        _groupOneTemplate() {
          return Ye(
            Ft || (Ft = Wt` ${0} ${0} `),
            this._labelTemplate(),
            this._helpTextTemplate()
          );
        }
        _groupTwoTemplate() {
          return Ye(
            Rt || (Rt = Wt` ${0} ${0} `),
            this._inputGroupTemplate(),
            this._feedbackTemplate()
          );
        }
        _labelTemplate() {
          return Ye(
            Ut ||
              (Ut = Wt`
        <div class="form-field__label">
          <slot name="label"></slot>
        </div>
      `)
          );
        }
        _helpTextTemplate() {
          return Ye(
            Dt ||
              (Dt = Wt`
        <small class="form-field__help-text">
          <slot name="help-text"></slot>
        </small>
      `)
          );
        }
        _inputGroupTemplate() {
          return Ye(
            Ht ||
              (Ht = Wt`
        <div class="input-group">
          ${0}
          <div class="input-group__container">
            ${0} ${0}
            ${0}
          </div>
          ${0}
        </div>
      `),
            this._inputGroupBeforeTemplate(),
            this._inputGroupPrefixTemplate(),
            this._inputGroupInputTemplate(),
            this._inputGroupSuffixTemplate(),
            this._inputGroupAfterTemplate()
          );
        }
        _inputGroupBeforeTemplate() {
          return Ye(
            $t ||
              ($t = Wt`
        <div class="input-group__before">
          <slot name="before"></slot>
        </div>
      `)
          );
        }
        _inputGroupPrefixTemplate() {
          return Array.from(this.children).find((e) => "prefix" === e.slot)
            ? Ye(
                Bt ||
                  (Bt = Wt`
            <div class="input-group__prefix">
              <slot name="prefix"></slot>
            </div>
          `)
              )
            : et;
        }
        _inputGroupInputTemplate() {
          return Ye(
            It ||
              (It = Wt`
        <div class="input-group__input">
          <slot name="input"></slot>
        </div>
      `)
          );
        }
        _inputGroupSuffixTemplate() {
          return Array.from(this.children).find((e) => "suffix" === e.slot)
            ? Ye(
                jt ||
                  (jt = Wt`
            <div class="input-group__suffix">
              <slot name="suffix"></slot>
            </div>
          `)
              )
            : et;
        }
        _inputGroupAfterTemplate() {
          return Ye(
            zt ||
              (zt = Wt`
        <div class="input-group__after">
          <slot name="after"></slot>
        </div>
      `)
          );
        }
        _feedbackTemplate() {
          return Ye(
            qt ||
              (qt = Wt`
        <div class="form-field__feedback">
          <slot name="feedback"></slot>
        </div>
      `)
          );
        }
        _isEmpty(e = this.modelValue) {
          let t = e;
          if (
            (this.modelValue instanceof Lt && (t = this.modelValue.viewValue),
            "object" == typeof t && null !== t && !(t instanceof Date))
          )
            return !Object.keys(t).length;
          const i = "number" == typeof t && (0 === t || Number.isNaN(t));
          return !t && !i && !("boolean" == typeof t && !1 === t);
        }
        static get styles() {
          return [
            we(
              Zt ||
                (Zt = Wt`
          /**********************
            {block} .form-field
           ********************/

          :host {
            display: block;
          }

          :host([hidden]) {
            display: none;
          }

          :host([disabled]) {
            pointer-events: none;
          }

          :host([disabled]) .form-field__label ::slotted(*),
          :host([disabled]) .form-field__help-text ::slotted(*) {
            color: var(--disabled-text-color, #767676);
          }

          /***********************
            {block} .input-group
           *********************/

          .input-group__container {
            display: flex;
          }

          .input-group__input {
            flex: 1;
            display: flex;
          }

          /***** {state} :disabled *****/
          :host([disabled]) .input-group ::slotted([slot='input']) {
            color: var(--disabled-text-color, #767676);
          }

          /***********************
            {block} .form-control
           **********************/

          .input-group__container > .input-group__input ::slotted(.form-control) {
            flex: 1 1 auto;
            margin: 0; /* remove input margin in Safari */
            font-size: 100%; /* normalize default input font-size */
          }
        `)
            ),
          ];
        }
        _getAriaDescriptionElements() {
          return [this._helpTextNode, this._feedbackNode];
        }
        addToAriaLabelledBy(e, { idPrefix: t = "", reorder: i = !0 } = {}) {
          (e.id = e.id || `${t}-${this._inputId}`),
            this._ariaLabelledNodes.includes(e) ||
              ((this._ariaLabelledNodes = [...this._ariaLabelledNodes, e]),
              (this.__reorderAriaLabelledNodes = Boolean(i)));
        }
        removeFromAriaLabelledBy(e) {
          this._ariaLabelledNodes.includes(e) &&
            (this._ariaLabelledNodes.splice(
              this._ariaLabelledNodes.indexOf(e),
              1
            ),
            (this._ariaLabelledNodes = [...this._ariaLabelledNodes]),
            (this.__reorderAriaLabelledNodes = !1));
        }
        addToAriaDescribedBy(e, { idPrefix: t = "", reorder: i = !0 } = {}) {
          (e.id = e.id || `${t}-${this._inputId}`),
            this._ariaDescribedNodes.includes(e) ||
              ((this._ariaDescribedNodes = [...this._ariaDescribedNodes, e]),
              (this.__reorderAriaDescribedNodes = Boolean(i)));
        }
        removeFromAriaDescribedBy(e) {
          this._ariaDescribedNodes.includes(e) &&
            (this._ariaDescribedNodes.splice(
              this._ariaDescribedNodes.indexOf(e),
              1
            ),
            (this._ariaDescribedNodes = [...this._ariaDescribedNodes]),
            (this.__reorderAriaLabelledNodes = !1));
        }
        __getDirectSlotChild(e) {
          return Array.from(this.children).find((t) => t.slot === e);
        }
        _dispatchInitialModelValueChangedEvent() {
          "child" !== this._repropagationRole &&
            ((this.__repropagateChildrenInitialized = !0),
            this.dispatchEvent(
              new CustomEvent("model-value-changed", {
                bubbles: !0,
                detail: {
                  formPath: [this],
                  initialize: !0,
                  isTriggeredByUser: !1,
                },
              })
            ));
        }
        _onBeforeRepropagateChildrenValues(e) {}
        __repropagateChildrenValues(e) {
          var t;
          this._onBeforeRepropagateChildrenValues(e);
          const i = (e.detail && e.detail.element) || e.target,
            s =
              this._isRepropagationEndpoint ||
              "choice-group" === this._repropagationRole;
          if (i === this) return;
          e.stopImmediatePropagation();
          const a =
              "child" !== this._repropagationRole &&
              !this.__repropagateChildrenInitialized,
            n = e.detail && e.detail.initialize;
          if (a || n) return;
          if (!this._repropagationCondition(i)) return;
          let r = [];
          s || (r = (e.detail && e.detail.formPath) || [i]);
          const o = [...r, this];
          this.dispatchEvent(
            new CustomEvent("model-value-changed", {
              bubbles: !0,
              detail: {
                formPath: o,
                isTriggeredByUser: Boolean(
                  null === (t = e.detail) || void 0 === t
                    ? void 0
                    : t.isTriggeredByUser
                ),
              },
            })
          );
        }
        _repropagationCondition(e) {
          return Boolean(e);
        }
        _onLabelClick() {}
      }
  ),
  Jt = Symbol.for("lion::SingletonManagerClassStorage");
const Kt = new (class {
  constructor() {
    this._map = window[Jt] ? window[Jt] : (window[Jt] = new Map());
  }
  set(e, t) {
    this.has(e) || this._map.set(e, t);
  }
  get(e) {
    return this._map.get(e);
  }
  has(e) {
    return this._map.has(e);
  }
})();
function Qt(e, t) {
  return e((t = { exports: {} }), t.exports), t.exports;
}
var Yt = "long",
  Xt = "short",
  ei = "numeric",
  ti = {
    number: {
      decimal: { style: "decimal" },
      integer: { style: "decimal", maximumFractionDigits: 0 },
      currency: { style: "currency", currency: "USD" },
      percent: { style: "percent" },
      default: { style: "decimal" },
    },
    date: {
      short: { month: ei, day: ei, year: "2-digit" },
      medium: { month: Xt, day: ei, year: ei },
      long: { month: Yt, day: ei, year: ei },
      full: { month: Yt, day: ei, year: ei, weekday: Yt },
      default: { month: Xt, day: ei, year: ei },
    },
    time: {
      short: { hour: ei, minute: ei },
      medium: { hour: ei, minute: ei, second: ei },
      long: { hour: ei, minute: ei, second: ei, timeZoneName: Xt },
      full: { hour: ei, minute: ei, second: ei, timeZoneName: Xt },
      default: { hour: ei, minute: ei, second: ei },
    },
    duration: {
      default: {
        hours: { minimumIntegerDigits: 1, maximumFractionDigits: 0 },
        minutes: { minimumIntegerDigits: 2, maximumFractionDigits: 0 },
        seconds: { minimumIntegerDigits: 2, maximumFractionDigits: 3 },
      },
    },
    parseNumberPattern: function (e) {
      if (e) {
        var t = {},
          i = e.match(/\b[A-Z]{3}\b/i),
          s = e.replace(/[^??]/g, "").length;
        if (
          (!s && i && (s = 1),
          s
            ? ((t.style = "currency"),
              (t.currencyDisplay =
                1 === s ? "symbol" : 2 === s ? "code" : "name"),
              (t.currency = i ? i[0].toUpperCase() : "USD"))
            : e.indexOf("%") >= 0 && (t.style = "percent"),
          !/[@#0]/.test(e))
        )
          return t.style ? t : void 0;
        if (
          ((t.useGrouping = e.indexOf(",") >= 0),
          /E\+?[@#0]+/i.test(e) || e.indexOf("@") >= 0)
        ) {
          var a = e.replace(/E\+?[@#0]+|[^@#0]/gi, "");
          (t.minimumSignificantDigits = Math.min(
            Math.max(a.replace(/[^@0]/g, "").length, 1),
            21
          )),
            (t.maximumSignificantDigits = Math.min(Math.max(a.length, 1), 21));
        } else {
          for (
            var n = e.replace(/[^#0.]/g, "").split("."),
              r = n[0],
              o = r.length - 1;
            "0" === r[o];

          )
            --o;
          t.minimumIntegerDigits = Math.min(Math.max(r.length - 1 - o, 1), 21);
          var l = n[1] || "";
          for (o = 0; "0" === l[o]; ) ++o;
          for (
            t.minimumFractionDigits = Math.min(Math.max(o, 0), 20);
            "#" === l[o];

          )
            ++o;
          t.maximumFractionDigits = Math.min(Math.max(o, 0), 20);
        }
        return t;
      }
    },
    parseDatePattern: function (e) {
      if (e) {
        for (var t = {}, i = 0; i < e.length; ) {
          for (var s = e[i], a = 1; e[++i] === s; ) ++a;
          switch (s) {
            case "G":
              t.era = 5 === a ? "narrow" : 4 === a ? Yt : Xt;
              break;
            case "y":
            case "Y":
              t.year = 2 === a ? "2-digit" : ei;
              break;
            case "M":
            case "L":
              (a = Math.min(Math.max(a - 1, 0), 4)),
                (t.month = [ei, "2-digit", Xt, Yt, "narrow"][a]);
              break;
            case "E":
            case "e":
            case "c":
              t.weekday = 5 === a ? "narrow" : 4 === a ? Yt : Xt;
              break;
            case "d":
            case "D":
              t.day = 2 === a ? "2-digit" : ei;
              break;
            case "h":
            case "K":
              (t.hour12 = !0), (t.hour = 2 === a ? "2-digit" : ei);
              break;
            case "H":
            case "k":
              (t.hour12 = !1), (t.hour = 2 === a ? "2-digit" : ei);
              break;
            case "m":
              t.minute = 2 === a ? "2-digit" : ei;
              break;
            case "s":
            case "S":
              t.second = 2 === a ? "2-digit" : ei;
              break;
            case "z":
            case "Z":
            case "v":
            case "V":
              t.timeZoneName = 1 === a ? Xt : Yt;
          }
        }
        return Object.keys(t).length ? t : void 0;
      }
    },
  },
  ii = "one",
  si = "two",
  ai = "few",
  ni = "many",
  ri = "other",
  oi = [
    function (e) {
      return 1 === +e ? ii : ri;
    },
    function (e) {
      var t = +e;
      return 0 <= t && t <= 1 ? ii : ri;
    },
    function (e) {
      return 0 === Math.floor(Math.abs(+e)) || 1 === +e ? ii : ri;
    },
    function (e) {
      var t = +e;
      return 0 === t
        ? "zero"
        : 1 === t
        ? ii
        : 2 === t
        ? si
        : 3 <= t % 100 && t % 100 <= 10
        ? ai
        : 11 <= t % 100 && t % 100 <= 99
        ? ni
        : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = (e + ".").split(".")[1].length;
      return 1 === t && 0 === i ? ii : ri;
    },
    function (e) {
      var t = +e;
      return t % 10 == 1 && t % 100 != 11
        ? ii
        : 2 <= t % 10 && t % 10 <= 4 && (t % 100 < 12 || 14 < t % 100)
        ? ai
        : t % 10 == 0 ||
          (5 <= t % 10 && t % 10 <= 9) ||
          (11 <= t % 100 && t % 100 <= 14)
        ? ni
        : ri;
    },
    function (e) {
      var t = +e;
      return t % 10 == 1 && t % 100 != 11 && t % 100 != 71 && t % 100 != 91
        ? ii
        : t % 10 == 2 && t % 100 != 12 && t % 100 != 72 && t % 100 != 92
        ? si
        : ((3 <= t % 10 && t % 10 <= 4) || t % 10 == 9) &&
          (t % 100 < 10 || 19 < t % 100) &&
          (t % 100 < 70 || 79 < t % 100) &&
          (t % 100 < 90 || 99 < t % 100)
        ? ai
        : 0 !== t && t % 1e6 == 0
        ? ni
        : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = (e + ".").split(".")[1].length,
        s = +(e + ".").split(".")[1];
      return (0 === i && t % 10 == 1 && t % 100 != 11) ||
        (s % 10 == 1 && s % 100 != 11)
        ? ii
        : (0 === i &&
            2 <= t % 10 &&
            t % 10 <= 4 &&
            (t % 100 < 12 || 14 < t % 100)) ||
          (2 <= s % 10 && s % 10 <= 4 && (s % 100 < 12 || 14 < s % 100))
        ? ai
        : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = (e + ".").split(".")[1].length;
      return 1 === t && 0 === i
        ? ii
        : 2 <= t && t <= 4 && 0 === i
        ? ai
        : 0 !== i
        ? ni
        : ri;
    },
    function (e) {
      var t = +e;
      return 0 === t
        ? "zero"
        : 1 === t
        ? ii
        : 2 === t
        ? si
        : 3 === t
        ? ai
        : 6 === t
        ? ni
        : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = +("" + e).replace(/^[^.]*.?|0+$/g, "");
      return 1 === +e || (0 !== i && (0 === t || 1 === t)) ? ii : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = (e + ".").split(".")[1].length,
        s = +(e + ".").split(".")[1];
      return (0 === i && t % 100 == 1) || s % 100 == 1
        ? ii
        : (0 === i && t % 100 == 2) || s % 100 == 2
        ? si
        : (0 === i && 3 <= t % 100 && t % 100 <= 4) ||
          (3 <= s % 100 && s % 100 <= 4)
        ? ai
        : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e));
      return 0 === t || 1 === t ? ii : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = (e + ".").split(".")[1].length,
        s = +(e + ".").split(".")[1];
      return (0 === i && (1 === t || 2 === t || 3 === t)) ||
        (0 === i && t % 10 != 4 && t % 10 != 6 && t % 10 != 9) ||
        (0 !== i && s % 10 != 4 && s % 10 != 6 && s % 10 != 9)
        ? ii
        : ri;
    },
    function (e) {
      var t = +e;
      return 1 === t
        ? ii
        : 2 === t
        ? si
        : 3 <= t && t <= 6
        ? ai
        : 7 <= t && t <= 10
        ? ni
        : ri;
    },
    function (e) {
      var t = +e;
      return 1 === t || 11 === t
        ? ii
        : 2 === t || 12 === t
        ? si
        : (3 <= t && t <= 10) || (13 <= t && t <= 19)
        ? ai
        : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = (e + ".").split(".")[1].length;
      return 0 === i && t % 10 == 1
        ? ii
        : 0 === i && t % 10 == 2
        ? si
        : 0 !== i ||
          (t % 100 != 0 &&
            t % 100 != 20 &&
            t % 100 != 40 &&
            t % 100 != 60 &&
            t % 100 != 80)
        ? 0 !== i
          ? ni
          : ri
        : ai;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = (e + ".").split(".")[1].length,
        s = +e;
      return 1 === t && 0 === i
        ? ii
        : 2 === t && 0 === i
        ? si
        : 0 === i && (s < 0 || 10 < s) && s % 10 == 0
        ? ni
        : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = +("" + e).replace(/^[^.]*.?|0+$/g, "");
      return (0 === i && t % 10 == 1 && t % 100 != 11) || 0 !== i ? ii : ri;
    },
    function (e) {
      var t = +e;
      return 1 === t ? ii : 2 === t ? si : ri;
    },
    function (e) {
      var t = +e;
      return 0 === t ? "zero" : 1 === t ? ii : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = +e;
      return 0 === i ? "zero" : (0 !== t && 1 !== t) || 0 === i ? ri : ii;
    },
    function (e) {
      var t = +(e + ".").split(".")[1],
        i = +e;
      return i % 10 == 1 && (i % 100 < 11 || 19 < i % 100)
        ? ii
        : 2 <= i % 10 && i % 10 <= 9 && (i % 100 < 11 || 19 < i % 100)
        ? ai
        : 0 !== t
        ? ni
        : ri;
    },
    function (e) {
      var t = (e + ".").split(".")[1].length,
        i = +(e + ".").split(".")[1],
        s = +e;
      return s % 10 == 0 ||
        (11 <= s % 100 && s % 100 <= 19) ||
        (2 === t && 11 <= i % 100 && i % 100 <= 19)
        ? "zero"
        : (s % 10 == 1 && s % 100 != 11) ||
          (2 === t && i % 10 == 1 && i % 100 != 11) ||
          (2 !== t && i % 10 == 1)
        ? ii
        : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = (e + ".").split(".")[1].length,
        s = +(e + ".").split(".")[1];
      return (0 === i && t % 10 == 1 && t % 100 != 11) ||
        (s % 10 == 1 && s % 100 != 11)
        ? ii
        : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = (e + ".").split(".")[1].length,
        s = +e;
      return 1 === t && 0 === i
        ? ii
        : 0 !== i || 0 === s || (1 !== s && 1 <= s % 100 && s % 100 <= 19)
        ? ai
        : ri;
    },
    function (e) {
      var t = +e;
      return 1 === t
        ? ii
        : 0 === t || (2 <= t % 100 && t % 100 <= 10)
        ? ai
        : 11 <= t % 100 && t % 100 <= 19
        ? ni
        : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = (e + ".").split(".")[1].length;
      return 1 === t && 0 === i
        ? ii
        : 0 === i &&
          2 <= t % 10 &&
          t % 10 <= 4 &&
          (t % 100 < 12 || 14 < t % 100)
        ? ai
        : (0 === i && 1 !== t && 0 <= t % 10 && t % 10 <= 1) ||
          (0 === i && 5 <= t % 10 && t % 10 <= 9) ||
          (0 === i && 12 <= t % 100 && t % 100 <= 14)
        ? ni
        : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e));
      return 0 <= t && t <= 1 ? ii : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = (e + ".").split(".")[1].length;
      return 0 === i && t % 10 == 1 && t % 100 != 11
        ? ii
        : 0 === i &&
          2 <= t % 10 &&
          t % 10 <= 4 &&
          (t % 100 < 12 || 14 < t % 100)
        ? ai
        : (0 === i && t % 10 == 0) ||
          (0 === i && 5 <= t % 10 && t % 10 <= 9) ||
          (0 === i && 11 <= t % 100 && t % 100 <= 14)
        ? ni
        : ri;
    },
    function (e) {
      var t = +e;
      return 0 === Math.floor(Math.abs(+e)) || 1 === t
        ? ii
        : 2 <= t && t <= 10
        ? ai
        : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = +(e + ".").split(".")[1],
        s = +e;
      return 0 === s || 1 === s || (0 === t && 1 === i) ? ii : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e)),
        i = (e + ".").split(".")[1].length;
      return 0 === i && t % 100 == 1
        ? ii
        : 0 === i && t % 100 == 2
        ? si
        : (0 === i && 3 <= t % 100 && t % 100 <= 4) || 0 !== i
        ? ai
        : ri;
    },
    function (e) {
      var t = +e;
      return (0 <= t && t <= 1) || (11 <= t && t <= 99) ? ii : ri;
    },
    function (e) {
      var t = +e;
      return 1 === t || 5 === t || 7 === t || 8 === t || 9 === t || 10 === t
        ? ii
        : 2 === t || 3 === t
        ? si
        : 4 === t
        ? ai
        : 6 === t
        ? ni
        : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e));
      return t % 10 == 1 ||
        t % 10 == 2 ||
        t % 10 == 5 ||
        t % 10 == 7 ||
        t % 10 == 8 ||
        t % 100 == 20 ||
        t % 100 == 50 ||
        t % 100 == 70 ||
        t % 100 == 80
        ? ii
        : t % 10 == 3 ||
          t % 10 == 4 ||
          t % 1e3 == 100 ||
          t % 1e3 == 200 ||
          t % 1e3 == 300 ||
          t % 1e3 == 400 ||
          t % 1e3 == 500 ||
          t % 1e3 == 600 ||
          t % 1e3 == 700 ||
          t % 1e3 == 800 ||
          t % 1e3 == 900
        ? ai
        : 0 === t ||
          t % 10 == 6 ||
          t % 100 == 40 ||
          t % 100 == 60 ||
          t % 100 == 90
        ? ni
        : ri;
    },
    function (e) {
      var t = +e;
      return (t % 10 != 2 && t % 10 != 3) || t % 100 == 12 || t % 100 == 13
        ? ri
        : ai;
    },
    function (e) {
      var t = +e;
      return 1 === t || 3 === t ? ii : 2 === t ? si : 4 === t ? ai : ri;
    },
    function (e) {
      var t = +e;
      return 0 === t || 7 === t || 8 === t || 9 === t
        ? "zero"
        : 1 === t
        ? ii
        : 2 === t
        ? si
        : 3 === t || 4 === t
        ? ai
        : 5 === t || 6 === t
        ? ni
        : ri;
    },
    function (e) {
      var t = +e;
      return t % 10 == 1 && t % 100 != 11
        ? ii
        : t % 10 == 2 && t % 100 != 12
        ? si
        : t % 10 == 3 && t % 100 != 13
        ? ai
        : ri;
    },
    function (e) {
      var t = +e;
      return 1 === t
        ? ii
        : 2 === t || 3 === t
        ? si
        : 4 === t
        ? ai
        : 6 === t
        ? ni
        : ri;
    },
    function (e) {
      var t = +e;
      return 1 === t || 5 === t ? ii : ri;
    },
    function (e) {
      var t = +e;
      return 11 === t || 8 === t || 80 === t || 800 === t ? ni : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e));
      return 1 === t
        ? ii
        : 0 === t ||
          (2 <= t % 100 && t % 100 <= 20) ||
          t % 100 == 40 ||
          t % 100 == 60 ||
          t % 100 == 80
        ? ni
        : ri;
    },
    function (e) {
      var t = +e;
      return t % 10 == 6 || t % 10 == 9 || (t % 10 == 0 && 0 !== t) ? ni : ri;
    },
    function (e) {
      var t = Math.floor(Math.abs(+e));
      return t % 10 == 1 && t % 100 != 11
        ? ii
        : t % 10 == 2 && t % 100 != 12
        ? si
        : (t % 10 != 7 && t % 10 != 8) || t % 100 == 17 || t % 100 == 18
        ? ri
        : ni;
    },
    function (e) {
      var t = +e;
      return 1 === t ? ii : 2 === t || 3 === t ? si : 4 === t ? ai : ri;
    },
    function (e) {
      var t = +e;
      return 1 <= t && t <= 4 ? ii : ri;
    },
    function (e) {
      var t = +e;
      return 1 === t || 5 === t || (7 <= t && t <= 9)
        ? ii
        : 2 === t || 3 === t
        ? si
        : 4 === t
        ? ai
        : 6 === t
        ? ni
        : ri;
    },
    function (e) {
      var t = +e;
      return 1 === t ? ii : t % 10 == 4 && t % 100 != 14 ? ni : ri;
    },
    function (e) {
      var t = +e;
      return (t % 10 != 1 && t % 10 != 2) || t % 100 == 11 || t % 100 == 12
        ? ri
        : ii;
    },
    function (e) {
      var t = +e;
      return t % 10 == 6 || t % 10 == 9 || 10 === t ? ai : ri;
    },
    function (e) {
      var t = +e;
      return t % 10 == 3 && t % 100 != 13 ? ai : ri;
    },
  ],
  li = {
    af: { cardinal: oi[0] },
    ak: { cardinal: oi[1] },
    am: { cardinal: oi[2] },
    ar: { cardinal: oi[3] },
    ars: { cardinal: oi[3] },
    as: { cardinal: oi[2], ordinal: oi[34] },
    asa: { cardinal: oi[0] },
    ast: { cardinal: oi[4] },
    az: { cardinal: oi[0], ordinal: oi[35] },
    be: { cardinal: oi[5], ordinal: oi[36] },
    bem: { cardinal: oi[0] },
    bez: { cardinal: oi[0] },
    bg: { cardinal: oi[0] },
    bh: { cardinal: oi[1] },
    bn: { cardinal: oi[2], ordinal: oi[34] },
    br: { cardinal: oi[6] },
    brx: { cardinal: oi[0] },
    bs: { cardinal: oi[7] },
    ca: { cardinal: oi[4], ordinal: oi[37] },
    ce: { cardinal: oi[0] },
    cgg: { cardinal: oi[0] },
    chr: { cardinal: oi[0] },
    ckb: { cardinal: oi[0] },
    cs: { cardinal: oi[8] },
    cy: { cardinal: oi[9], ordinal: oi[38] },
    da: { cardinal: oi[10] },
    de: { cardinal: oi[4] },
    dsb: { cardinal: oi[11] },
    dv: { cardinal: oi[0] },
    ee: { cardinal: oi[0] },
    el: { cardinal: oi[0] },
    en: { cardinal: oi[4], ordinal: oi[39] },
    eo: { cardinal: oi[0] },
    es: { cardinal: oi[0] },
    et: { cardinal: oi[4] },
    eu: { cardinal: oi[0] },
    fa: { cardinal: oi[2] },
    ff: { cardinal: oi[12] },
    fi: { cardinal: oi[4] },
    fil: { cardinal: oi[13], ordinal: oi[0] },
    fo: { cardinal: oi[0] },
    fr: { cardinal: oi[12], ordinal: oi[0] },
    fur: { cardinal: oi[0] },
    fy: { cardinal: oi[4] },
    ga: { cardinal: oi[14], ordinal: oi[0] },
    gd: { cardinal: oi[15] },
    gl: { cardinal: oi[4] },
    gsw: { cardinal: oi[0] },
    gu: { cardinal: oi[2], ordinal: oi[40] },
    guw: { cardinal: oi[1] },
    gv: { cardinal: oi[16] },
    ha: { cardinal: oi[0] },
    haw: { cardinal: oi[0] },
    he: { cardinal: oi[17] },
    hi: { cardinal: oi[2], ordinal: oi[40] },
    hr: { cardinal: oi[7] },
    hsb: { cardinal: oi[11] },
    hu: { cardinal: oi[0], ordinal: oi[41] },
    hy: { cardinal: oi[12], ordinal: oi[0] },
    io: { cardinal: oi[4] },
    is: { cardinal: oi[18] },
    it: { cardinal: oi[4], ordinal: oi[42] },
    iu: { cardinal: oi[19] },
    iw: { cardinal: oi[17] },
    jgo: { cardinal: oi[0] },
    ji: { cardinal: oi[4] },
    jmc: { cardinal: oi[0] },
    ka: { cardinal: oi[0], ordinal: oi[43] },
    kab: { cardinal: oi[12] },
    kaj: { cardinal: oi[0] },
    kcg: { cardinal: oi[0] },
    kk: { cardinal: oi[0], ordinal: oi[44] },
    kkj: { cardinal: oi[0] },
    kl: { cardinal: oi[0] },
    kn: { cardinal: oi[2] },
    ks: { cardinal: oi[0] },
    ksb: { cardinal: oi[0] },
    ksh: { cardinal: oi[20] },
    ku: { cardinal: oi[0] },
    kw: { cardinal: oi[19] },
    ky: { cardinal: oi[0] },
    lag: { cardinal: oi[21] },
    lb: { cardinal: oi[0] },
    lg: { cardinal: oi[0] },
    ln: { cardinal: oi[1] },
    lt: { cardinal: oi[22] },
    lv: { cardinal: oi[23] },
    mas: { cardinal: oi[0] },
    mg: { cardinal: oi[1] },
    mgo: { cardinal: oi[0] },
    mk: { cardinal: oi[24], ordinal: oi[45] },
    ml: { cardinal: oi[0] },
    mn: { cardinal: oi[0] },
    mo: { cardinal: oi[25], ordinal: oi[0] },
    mr: { cardinal: oi[2], ordinal: oi[46] },
    mt: { cardinal: oi[26] },
    nah: { cardinal: oi[0] },
    naq: { cardinal: oi[19] },
    nb: { cardinal: oi[0] },
    nd: { cardinal: oi[0] },
    ne: { cardinal: oi[0], ordinal: oi[47] },
    nl: { cardinal: oi[4] },
    nn: { cardinal: oi[0] },
    nnh: { cardinal: oi[0] },
    no: { cardinal: oi[0] },
    nr: { cardinal: oi[0] },
    nso: { cardinal: oi[1] },
    ny: { cardinal: oi[0] },
    nyn: { cardinal: oi[0] },
    om: { cardinal: oi[0] },
    or: { cardinal: oi[0], ordinal: oi[48] },
    os: { cardinal: oi[0] },
    pa: { cardinal: oi[1] },
    pap: { cardinal: oi[0] },
    pl: { cardinal: oi[27] },
    prg: { cardinal: oi[23] },
    ps: { cardinal: oi[0] },
    pt: { cardinal: oi[28] },
    "pt-PT": { cardinal: oi[4] },
    rm: { cardinal: oi[0] },
    ro: { cardinal: oi[25], ordinal: oi[0] },
    rof: { cardinal: oi[0] },
    ru: { cardinal: oi[29] },
    rwk: { cardinal: oi[0] },
    saq: { cardinal: oi[0] },
    scn: { cardinal: oi[4], ordinal: oi[42] },
    sd: { cardinal: oi[0] },
    sdh: { cardinal: oi[0] },
    se: { cardinal: oi[19] },
    seh: { cardinal: oi[0] },
    sh: { cardinal: oi[7] },
    shi: { cardinal: oi[30] },
    si: { cardinal: oi[31] },
    sk: { cardinal: oi[8] },
    sl: { cardinal: oi[32] },
    sma: { cardinal: oi[19] },
    smi: { cardinal: oi[19] },
    smj: { cardinal: oi[19] },
    smn: { cardinal: oi[19] },
    sms: { cardinal: oi[19] },
    sn: { cardinal: oi[0] },
    so: { cardinal: oi[0] },
    sq: { cardinal: oi[0], ordinal: oi[49] },
    sr: { cardinal: oi[7] },
    ss: { cardinal: oi[0] },
    ssy: { cardinal: oi[0] },
    st: { cardinal: oi[0] },
    sv: { cardinal: oi[4], ordinal: oi[50] },
    sw: { cardinal: oi[4] },
    syr: { cardinal: oi[0] },
    ta: { cardinal: oi[0] },
    te: { cardinal: oi[0] },
    teo: { cardinal: oi[0] },
    ti: { cardinal: oi[1] },
    tig: { cardinal: oi[0] },
    tk: { cardinal: oi[0], ordinal: oi[51] },
    tl: { cardinal: oi[13], ordinal: oi[0] },
    tn: { cardinal: oi[0] },
    tr: { cardinal: oi[0] },
    ts: { cardinal: oi[0] },
    tzm: { cardinal: oi[33] },
    ug: { cardinal: oi[0] },
    uk: { cardinal: oi[29], ordinal: oi[52] },
    ur: { cardinal: oi[4] },
    uz: { cardinal: oi[0] },
    ve: { cardinal: oi[0] },
    vo: { cardinal: oi[0] },
    vun: { cardinal: oi[0] },
    wa: { cardinal: oi[1] },
    wae: { cardinal: oi[0] },
    xh: { cardinal: oi[0] },
    xog: { cardinal: oi[0] },
    yi: { cardinal: oi[4] },
    zu: { cardinal: oi[2] },
    lo: { ordinal: oi[0] },
    ms: { ordinal: oi[0] },
    vi: { ordinal: oi[0] },
  },
  ci = Qt(function (e, t) {
    function i(e, t, a, n, r) {
      var o = e.map(function (e) {
        return (function (e, t, a, n, r) {
          if ("string" == typeof e) {
            var o = e;
            return function () {
              return o;
            };
          }
          var c,
            d = e[0],
            h = e[1];
          if (t && "#" === e[0]) {
            d = t[0];
            var u = t[2],
              p = (n.number || l.number)([d, "number"], a);
            return function (e) {
              return p(s(d, e) - u, e);
            };
          }
          "plural" === h || "selectordinal" === h
            ? ((c = {}),
              Object.keys(e[3]).forEach(function (t) {
                c[t] = i(e[3][t], e, a, n, r);
              }),
              (e = [e[0], e[1], e[2], c]))
            : e[2] &&
              "object" == typeof e[2] &&
              ((c = {}),
              Object.keys(e[2]).forEach(function (t) {
                c[t] = i(e[2][t], e, a, n, r);
              }),
              (e = [e[0], e[1], c]));
          var f = h && (n[h] || l[h]);
          if (f) {
            var m = f(e, a);
            return function (e) {
              return m(s(d, e), e);
            };
          }
          return r
            ? function (e) {
                return String(s(d, e));
              }
            : function (e) {
                return s(d, e);
              };
        })(e, t, a, n, r);
      });
      return r
        ? 1 === o.length
          ? o[0]
          : function (e) {
              for (var t = "", i = 0; i < o.length; ++i) t += o[i](e);
              return t;
            }
        : function (e) {
            return o.reduce(function (t, i) {
              return t.concat(i(e));
            }, []);
          };
    }
    function s(e, t) {
      if (t && e in t) return t[e];
      for (var i = e.split("."), s = t, a = 0, n = i.length; s && a < n; ++a)
        s = s[i[a]];
      return s;
    }
    function a(e, t) {
      var i = e[2],
        s = ti.number[i] || ti.parseNumberPattern(i) || ti.number.default;
      return new Intl.NumberFormat(t, s).format;
    }
    function n(e, t) {
      var i = e[1],
        s = e[2],
        a = ti[i][s] || ti.parseDatePattern(s) || ti[i].default;
      return new Intl.DateTimeFormat(t, a).format;
    }
    function r(e, t) {
      var i,
        s = "selectordinal" === e[1] ? "ordinal" : "cardinal",
        a = e[2],
        n = e[3];
      if (Intl.PluralRules && Intl.PluralRules.supportedLocalesOf(t).length > 0)
        i = new Intl.PluralRules(t, { type: s });
      else {
        var r = (function (e, t) {
            if ("string" == typeof e && t[e]) return e;
            for (var i = [].concat(e || []), s = 0, a = i.length; s < a; ++s)
              for (var n = i[s].split("-"); n.length; ) {
                var r = n.join("-");
                if (t[r]) return r;
                n.pop();
              }
          })(t, li),
          l = (r && li[r][s]) || o;
        i = { select: l };
      }
      return function (e, t) {
        return (n["=" + +e] || n[i.select(e - a)] || n.other)(t);
      };
    }
    function o() {
      return "other";
    }
    (t = e.exports =
      function (e, t, s) {
        return i(e, null, t || "en", s || {}, !0);
      }).toParts = function (e, t, s) {
      return i(e, null, t || "en", s || {}, !1);
    };
    var l = {
      number: a,
      ordinal: a,
      spellout: a,
      duration: function (e, t) {
        var i = e[2],
          s = ti.duration[i] || ti.duration.default,
          a = new Intl.NumberFormat(t, s.seconds).format,
          n = new Intl.NumberFormat(t, s.minutes).format,
          r = new Intl.NumberFormat(t, s.hours).format,
          o = /^fi$|^fi-|^da/.test(String(t)) ? "." : ":";
        return function (e, t) {
          if (((e = +e), !isFinite(e))) return a(e);
          var i = ~~(e / 60 / 60),
            s = ~~((e / 60) % 60),
            l =
              (i ? r(Math.abs(i)) + o : "") +
              n(Math.abs(s)) +
              o +
              a(Math.abs(e % 60));
          return e < 0 ? r(-1).replace(r(1), l) : l;
        };
      },
      date: n,
      time: n,
      plural: r,
      selectordinal: r,
      select: function (e, t) {
        var i = e[2];
        return function (e, t) {
          return (i[e] || i.other)(t);
        };
      },
    };
    t.types = l;
  });
ci.toParts, ci.types;
var di = Qt(function (e, t) {
  var i = "{",
    s = "}",
    a = ",",
    n = "#",
    r = "<",
    o = ">",
    l = "</",
    c = "/>",
    d = "'",
    h = "offset:",
    u = ["number", "date", "time", "ordinal", "duration", "spellout"],
    p = ["plural", "select", "selectordinal"];
  function f(e, t) {
    var i = e.pattern,
      a = i.length,
      n = [],
      r = e.index,
      o = m(e, t);
    for (
      o && n.push(o),
        o && e.tokens && e.tokens.push(["text", i.slice(r, e.index)]);
      e.index < a;

    ) {
      if (i[e.index] === s) {
        if (!t) throw k(e);
        break;
      }
      if (t && e.tagsType && i.slice(e.index, e.index + l.length) === l) break;
      n.push(g(e)),
        (r = e.index),
        (o = m(e, t)) && n.push(o),
        o && e.tokens && e.tokens.push(["text", i.slice(r, e.index)]);
    }
    return n;
  }
  function m(e, t) {
    for (
      var a = e.pattern,
        o = a.length,
        l = "plural" === t || "selectordinal" === t,
        c = !!e.tagsType,
        h = "{style}" === t,
        u = "";
      e.index < o;

    ) {
      var p = a[e.index];
      if (
        p === i ||
        p === s ||
        (l && p === n) ||
        (c && p === r) ||
        (h && _(p.charCodeAt(0)))
      )
        break;
      if (p === d)
        if ((p = a[++e.index]) === d) (u += p), ++e.index;
        else if (p === i || p === s || (l && p === n) || (c && p === r) || h)
          for (u += p; ++e.index < o; )
            if ((p = a[e.index]) === d && a[e.index + 1] === d)
              (u += d), ++e.index;
            else {
              if (p === d) {
                ++e.index;
                break;
              }
              u += p;
            }
        else u += d;
      else (u += p), ++e.index;
    }
    return u;
  }
  function _(e) {
    return (
      (e >= 9 && e <= 13) ||
      32 === e ||
      133 === e ||
      160 === e ||
      6158 === e ||
      (e >= 8192 && e <= 8205) ||
      8232 === e ||
      8233 === e ||
      8239 === e ||
      8287 === e ||
      8288 === e ||
      12288 === e ||
      65279 === e
    );
  }
  function v(e) {
    for (
      var t = e.pattern, i = t.length, s = e.index;
      e.index < i && _(t.charCodeAt(e.index));

    )
      ++e.index;
    s < e.index &&
      e.tokens &&
      e.tokens.push(["space", e.pattern.slice(s, e.index)]);
  }
  function g(e) {
    var t = e.pattern;
    if (t[e.index] === n)
      return e.tokens && e.tokens.push(["syntax", n]), ++e.index, [n];
    var d = (function (e) {
      var t = e.tagsType;
      if (!t || e.pattern[e.index] !== r) return;
      if (e.pattern.slice(e.index, e.index + l.length) === l)
        throw k(e, null, "closing tag without matching opening tag");
      e.tokens && e.tokens.push(["syntax", r]);
      ++e.index;
      var i = b(e, !0);
      if (!i) throw k(e, "placeholder id");
      e.tokens && e.tokens.push(["id", i]);
      if ((v(e), e.pattern.slice(e.index, e.index + c.length) === c))
        return (
          e.tokens && e.tokens.push(["syntax", c]),
          (e.index += c.length),
          [i, t]
        );
      if (e.pattern[e.index] !== o) throw k(e, o);
      e.tokens && e.tokens.push(["syntax", o]);
      ++e.index;
      var s = f(e, t),
        a = e.index;
      if (e.pattern.slice(e.index, e.index + l.length) !== l)
        throw k(e, l + i + o);
      e.tokens && e.tokens.push(["syntax", l]);
      e.index += l.length;
      var n = b(e, !0);
      n && e.tokens && e.tokens.push(["id", n]);
      if (i !== n) throw ((e.index = a), k(e, l + i + o, l + n + o));
      if ((v(e), e.pattern[e.index] !== o)) throw k(e, o);
      e.tokens && e.tokens.push(["syntax", o]);
      return ++e.index, [i, t, { children: s }];
    })(e);
    if (d) return d;
    if (t[e.index] !== i) throw k(e, i);
    e.tokens && e.tokens.push(["syntax", i]), ++e.index, v(e);
    var p = b(e);
    if (!p) throw k(e, "placeholder id");
    e.tokens && e.tokens.push(["id", p]), v(e);
    var m = t[e.index];
    if (m === s)
      return e.tokens && e.tokens.push(["syntax", s]), ++e.index, [p];
    if (m !== a) throw k(e, ", or }");
    e.tokens && e.tokens.push(["syntax", a]), ++e.index, v(e);
    var _,
      g = b(e);
    if (!g) throw k(e, "placeholder type");
    if (
      (e.tokens && e.tokens.push(["type", g]), v(e), (m = t[e.index]) === s)
    ) {
      if (
        (e.tokens && e.tokens.push(["syntax", s]),
        "plural" === g || "selectordinal" === g || "select" === g)
      )
        throw k(e, g + " sub-messages");
      return ++e.index, [p, g];
    }
    if (m !== a) throw k(e, ", or }");
    if (
      (e.tokens && e.tokens.push(["syntax", a]),
      ++e.index,
      v(e),
      "plural" === g || "selectordinal" === g)
    ) {
      var S = (function (e) {
        var t = e.pattern,
          i = t.length,
          s = 0;
        if (t.slice(e.index, e.index + h.length) === h) {
          e.tokens && e.tokens.push(["offset", "offset"], ["syntax", ":"]),
            (e.index += h.length),
            v(e);
          for (var a = e.index; e.index < i && w(t.charCodeAt(e.index)); )
            ++e.index;
          if (a === e.index) throw k(e, "offset number");
          e.tokens && e.tokens.push(["number", t.slice(a, e.index)]),
            (s = +t.slice(a, e.index));
        }
        return s;
      })(e);
      v(e), (_ = [p, g, S, x(e, g)]);
    } else if ("select" === g) _ = [p, g, x(e, g)];
    else if (u.indexOf(g) >= 0) _ = [p, g, y(e)];
    else {
      var C = e.index,
        E = y(e);
      v(e), t[e.index] === i && ((e.index = C), (E = x(e, g))), (_ = [p, g, E]);
    }
    if ((v(e), t[e.index] !== s)) throw k(e, s);
    return e.tokens && e.tokens.push(["syntax", s]), ++e.index, _;
  }
  function b(e, t) {
    for (var l = e.pattern, c = l.length, h = ""; e.index < c; ) {
      var u = l[e.index];
      if (
        u === i ||
        u === s ||
        u === a ||
        u === n ||
        u === d ||
        _(u.charCodeAt(0)) ||
        (t && (u === r || u === o || "/" === u))
      )
        break;
      (h += u), ++e.index;
    }
    return h;
  }
  function y(e) {
    var t = e.index,
      i = m(e, "{style}");
    if (!i) throw k(e, "placeholder style name");
    return e.tokens && e.tokens.push(["style", e.pattern.slice(t, e.index)]), i;
  }
  function w(e) {
    return e >= 48 && e <= 57;
  }
  function x(e, t) {
    for (
      var i = e.pattern, a = i.length, n = {};
      e.index < a && i[e.index] !== s;

    ) {
      var r = b(e);
      if (!r) throw k(e, "sub-message selector");
      e.tokens && e.tokens.push(["selector", r]), v(e), (n[r] = S(e, t)), v(e);
    }
    if (!n.other && p.indexOf(t) >= 0)
      throw k(e, null, null, '"other" sub-message must be specified in ' + t);
    return n;
  }
  function S(e, t) {
    if (e.pattern[e.index] !== i) throw k(e, "{ to start sub-message");
    e.tokens && e.tokens.push(["syntax", i]), ++e.index;
    var a = f(e, t);
    if (e.pattern[e.index] !== s) throw k(e, "} to end sub-message");
    return e.tokens && e.tokens.push(["syntax", s]), ++e.index, a;
  }
  function k(e, t, i, s) {
    var a = e.pattern,
      n = a.slice(0, e.index).split(/\r?\n/),
      r = e.index,
      o = n.length,
      l = n.slice(-1)[0].length;
    return (
      (i =
        i ||
        (e.index >= a.length ? "end of message pattern" : b(e) || a[e.index])),
      s ||
        (s = (function (e, t) {
          return e
            ? "Expected " + e + " but found " + t
            : "Unexpected " + t + " found";
        })(t, i)),
      new C((s += " in " + a.replace(/\r?\n/g, "\n")), t, i, r, o, l)
    );
  }
  function C(e, t, i, s, a, n) {
    Error.call(this, e),
      (this.name = "SyntaxError"),
      (this.message = e),
      (this.expected = t),
      (this.found = i),
      (this.offset = s),
      (this.line = a),
      (this.column = n);
  }
  (t = e.exports =
    function (e, t) {
      return f(
        {
          pattern: String(e),
          index: 0,
          tagsType: (t && t.tagsType) || null,
          tokens: (t && t.tokens) || null,
        },
        ""
      );
    }),
    (C.prototype = Object.create(Error.prototype)),
    (t.SyntaxError = C);
});
di.SyntaxError;
var hi = new RegExp("^(" + Object.keys(li).join("|") + ")\\b"),
  ui = new WeakMap();
function pi(e, t, i) {
  if (!(this instanceof pi) || ui.has(this))
    throw new TypeError(
      "calling MessageFormat constructor without new is invalid"
    );
  var s = di(e);
  ui.set(this, {
    ast: s,
    format: ci(s, t, i && i.types),
    locale: pi.supportedLocalesOf(t)[0] || "en",
    locales: t,
    options: i,
  });
}
var fi = pi;
Object.defineProperties(pi.prototype, {
  format: {
    configurable: !0,
    get: function () {
      var e = ui.get(this);
      if (!e)
        throw new TypeError(
          "MessageFormat.prototype.format called on value that's not an object initialized as a MessageFormat"
        );
      return e.format;
    },
  },
  formatToParts: {
    configurable: !0,
    writable: !0,
    value: function (e) {
      var t = ui.get(this);
      if (!t)
        throw new TypeError(
          "MessageFormat.prototype.formatToParts called on value that's not an object initialized as a MessageFormat"
        );
      return (
        t.toParts ||
        (t.toParts = ci.toParts(t.ast, t.locales, t.options && t.options.types))
      )(e);
    },
  },
  resolvedOptions: {
    configurable: !0,
    writable: !0,
    value: function () {
      var e = ui.get(this);
      if (!e)
        throw new TypeError(
          "MessageFormat.prototype.resolvedOptions called on value that's not an object initialized as a MessageFormat"
        );
      return { locale: e.locale };
    },
  },
}),
  "undefined" != typeof Symbol &&
    Object.defineProperty(pi.prototype, Symbol.toStringTag, {
      value: "Object",
    }),
  Object.defineProperties(pi, {
    supportedLocalesOf: {
      configurable: !0,
      writable: !0,
      value: function (e) {
        return []
          .concat(
            Intl.NumberFormat.supportedLocalesOf(e),
            Intl.DateTimeFormat.supportedLocalesOf(e),
            Intl.PluralRules ? Intl.PluralRules.supportedLocalesOf(e) : [],
            [].concat(e || []).filter(function (e) {
              return hi.test(e);
            })
          )
          .filter(function (e, t, i) {
            return i.indexOf(e) === t;
          });
      },
    },
  });
let mi =
  Kt.get("@lion/localize::localize::0.10.x") ||
  new (class {
    constructor({
      autoLoadOnLocaleChange: e = !1,
      fallbackLocale: t = "",
    } = {}) {
      (this.__delegationTarget = document.createDocumentFragment()),
        (this._autoLoadOnLocaleChange = !!e),
        (this._fallbackLocale = t),
        (this.__storage = {}),
        (this.__namespacePatternsMap = new Map()),
        (this.__namespaceLoadersCache = {}),
        (this.__namespaceLoaderPromisesCache = {}),
        (this.formatNumberOptions = {
          returnIfNaN: "",
          postProcessors: new Map(),
        }),
        (this.formatDateOptions = { postProcessors: new Map() });
      const i = document.documentElement.getAttribute("data-localize-lang");
      (this._supportExternalTranslationTools = Boolean(i)),
        this._supportExternalTranslationTools &&
          ((this.locale = i || "en-GB"), this._setupTranslationToolSupport()),
        document.documentElement.lang ||
          (document.documentElement.lang = this.locale || "en-GB"),
        this._setupHtmlLangAttributeObserver();
    }
    _setupTranslationToolSupport() {
      this._langAttrSetByTranslationTool =
        document.documentElement.lang || null;
    }
    teardown() {
      this._teardownHtmlLangAttributeObserver();
    }
    get locale() {
      return this._supportExternalTranslationTools
        ? this.__locale || ""
        : document.documentElement.lang;
    }
    set locale(e) {
      let t;
      this._supportExternalTranslationTools
        ? ((t = this.__locale),
          (this.__locale = e),
          null === this._langAttrSetByTranslationTool &&
            this._setHtmlLangAttribute(e))
        : ((t = document.documentElement.lang), this._setHtmlLangAttribute(e)),
        e.includes("-") || this.__handleLanguageOnly(e),
        this._onLocaleChanged(e, t);
    }
    _setHtmlLangAttribute(e) {
      this._teardownHtmlLangAttributeObserver(),
        (document.documentElement.lang = e),
        this._setupHtmlLangAttributeObserver();
    }
    __handleLanguageOnly(e) {
      throw new Error(
        `\n      Locale was set to ${e}.\n      Language only locales are not allowed, please use the full language locale e.g. 'en-GB' instead of 'en'.\n      See https://github.com/ing-bank/lion/issues/187 for more information.\n    `
      );
    }
    get loadingComplete() {
      return "object" == typeof this.__namespaceLoaderPromisesCache[this.locale]
        ? Promise.all(
            Object.values(this.__namespaceLoaderPromisesCache[this.locale])
          )
        : Promise.resolve();
    }
    reset() {
      (this.__storage = {}),
        (this.__namespacePatternsMap = new Map()),
        (this.__namespaceLoadersCache = {}),
        (this.__namespaceLoaderPromisesCache = {});
    }
    addData(e, t, i) {
      if (this._isNamespaceInCache(e, t))
        throw new Error(
          `Namespace "${t}" has been already added for the locale "${e}".`
        );
      (this.__storage[e] = this.__storage[e] || {}), (this.__storage[e][t] = i);
    }
    setupNamespaceLoader(e, t) {
      this.__namespacePatternsMap.set(e, t);
    }
    loadNamespaces(e, { locale: t } = {}) {
      return Promise.all(e.map((e) => this.loadNamespace(e, { locale: t })));
    }
    loadNamespace(e, { locale: t = this.locale } = { locale: this.locale }) {
      const i = "object" == typeof e,
        s = i ? Object.keys(e)[0] : e;
      if (this._isNamespaceInCache(t, s)) return Promise.resolve();
      const a = this._getCachedNamespaceLoaderPromise(t, s);
      return a || this._loadNamespaceData(t, e, i, s);
    }
    msg(e, t, i = {}) {
      const s = i.locale ? i.locale : this.locale,
        a = this._getMessageForKeys(e, s);
      if (!a) return "";
      return new fi(a, s).format(t);
    }
    _setupHtmlLangAttributeObserver() {
      this._htmlLangAttributeObserver ||
        (this._htmlLangAttributeObserver = new MutationObserver((e) => {
          e.forEach((e) => {
            this._supportExternalTranslationTools
              ? "auto" === document.documentElement.lang
                ? ((this._langAttrSetByTranslationTool = null),
                  this._setHtmlLangAttribute(this.locale))
                : (this._langAttrSetByTranslationTool =
                    document.documentElement.lang)
              : this._onLocaleChanged(
                  document.documentElement.lang,
                  e.oldValue || ""
                );
          });
        })),
        this._htmlLangAttributeObserver.observe(document.documentElement, {
          attributes: !0,
          attributeFilter: ["lang"],
          attributeOldValue: !0,
        });
    }
    _teardownHtmlLangAttributeObserver() {
      this._htmlLangAttributeObserver &&
        this._htmlLangAttributeObserver.disconnect();
    }
    _isNamespaceInCache(e, t) {
      return !(!this.__storage[e] || !this.__storage[e][t]);
    }
    _getCachedNamespaceLoaderPromise(e, t) {
      return this.__namespaceLoaderPromisesCache[e]
        ? this.__namespaceLoaderPromisesCache[e][t]
        : null;
    }
    _loadNamespaceData(e, t, i, s) {
      const a = this._getNamespaceLoader(t, i, s),
        n = this._getNamespaceLoaderPromise(a, e, s);
      return (
        this._cacheNamespaceLoaderPromise(e, s, n),
        n.then((t) => {
          if (
            this.__namespaceLoaderPromisesCache[e] &&
            this.__namespaceLoaderPromisesCache[e][s] === n
          ) {
            const i = (function (e) {
              return !(
                !e ||
                !e.default ||
                "object" != typeof e.default ||
                1 !== Object.keys(e).length
              );
            })(t)
              ? t.default
              : t;
            this.addData(e, s, i);
          }
        })
      );
    }
    _getNamespaceLoader(e, t, i) {
      let s = this.__namespaceLoadersCache[i];
      if (!s)
        if (t) {
          (s = e[i]), (this.__namespaceLoadersCache[i] = s);
        } else
          (s = this._lookupNamespaceLoader(i)),
            (this.__namespaceLoadersCache[i] = s);
      if (!s) throw new Error(`Namespace "${i}" was not properly setup.`);
      return (this.__namespaceLoadersCache[i] = s), s;
    }
    _getNamespaceLoaderPromise(e, t, i, s = this._fallbackLocale) {
      return e(t, i).catch(() => {
        const a = this._getLangFromLocale(t);
        return e(a, i).catch(() => {
          if (s)
            return this._getNamespaceLoaderPromise(e, s, i, "").catch(() => {
              const e = this._getLangFromLocale(s);
              throw new Error(
                `Data for namespace "${i}" and current locale "${t}" or fallback locale "${s}" could not be loaded. Make sure you have data either for locale "${t}" (and/or generic language "${a}") or for fallback "${s}" (and/or "${e}").`
              );
            });
          throw new Error(
            `Data for namespace "${i}" and locale "${t}" could not be loaded. Make sure you have data for locale "${t}" (and/or generic language "${a}").`
          );
        });
      });
    }
    _cacheNamespaceLoaderPromise(e, t, i) {
      this.__namespaceLoaderPromisesCache[e] ||
        (this.__namespaceLoaderPromisesCache[e] = {}),
        (this.__namespaceLoaderPromisesCache[e][t] = i);
    }
    _lookupNamespaceLoader(e) {
      for (const [t, i] of this.__namespacePatternsMap) {
        const s = "string" == typeof t && t === e,
          a =
            "object" == typeof t &&
            "RegExp" === t.constructor.name &&
            t.test(e);
        if (s || a) return i;
      }
      return null;
    }
    _getLangFromLocale(e) {
      return e.substring(0, 2);
    }
    addEventListener(e, t, ...i) {
      this.__delegationTarget.addEventListener(e, t, ...i);
    }
    removeEventListener(e, t, ...i) {
      this.__delegationTarget.removeEventListener(e, t, ...i);
    }
    dispatchEvent(e) {
      this.__delegationTarget.dispatchEvent(e);
    }
    _onLocaleChanged(e, t) {
      this.dispatchEvent(new CustomEvent("__localeChanging")),
        e !== t &&
          (this._autoLoadOnLocaleChange
            ? (this._loadAllMissing(e, t),
              this.loadingComplete.then(() => {
                this.dispatchEvent(
                  new CustomEvent("localeChanged", {
                    detail: { newLocale: e, oldLocale: t },
                  })
                );
              }))
            : this.dispatchEvent(
                new CustomEvent("localeChanged", {
                  detail: { newLocale: e, oldLocale: t },
                })
              ));
    }
    _loadAllMissing(e, t) {
      const i = this.__storage[t] || {},
        s = this.__storage[e] || {};
      Object.keys(i).forEach((t) => {
        s[t] || this.loadNamespace(t, { locale: e });
      });
    }
    _getMessageForKeys(e, t) {
      if ("string" == typeof e) return this._getMessageForKey(e, t);
      const i = Array.from(e).reverse();
      let s, a;
      for (; i.length; )
        if (((s = i.pop()), (a = this._getMessageForKey(s, t)), a)) return a;
    }
    _getMessageForKey(e, t) {
      if (!e || -1 === e.indexOf(":"))
        throw new Error(
          `Namespace is missing in the key "${e}". The format for keys is "namespace:name".`
        );
      const [i, s] = e.split(":"),
        a = this.__storage[t],
        n = a ? a[i] : {},
        r = s.split(".").reduce((e, t) => ("object" == typeof e ? e[t] : e), n);
      return String(r || "");
    }
    setDatePostProcessorForLocale({ locale: e, postProcessor: t }) {
      this.formatDateOptions.postProcessors.set(e, t);
    }
    setNumberPostProcessorForLocale({ locale: e, postProcessor: t }) {
      this.formatNumberOptions.postProcessors.set(e, t);
    }
  })({ autoLoadOnLocaleChange: !0, fallbackLocale: "en-GB" });
class _i {
  constructor() {
    (this.__running = !1), (this.__queue = []);
  }
  add(e) {
    this.__queue.push(e),
      this.__running ||
        ((this.complete = new Promise((e) => {
          this.__callComplete = e;
        })),
        this.__run());
  }
  async __run() {
    (this.__running = !0),
      await this.__queue[0](),
      this.__queue.shift(),
      this.__queue.length > 0
        ? this.__run()
        : ((this.__running = !1), this.__callComplete && this.__callComplete());
  }
}
const vi = wt(
  (e) =>
    class extends e {
      constructor() {
        super(), (this.__SyncUpdatableNamespace = {});
      }
      firstUpdated(e) {
        super.firstUpdated(e), this.__syncUpdatableInitialize();
      }
      connectedCallback() {
        super.connectedCallback(),
          (this.__SyncUpdatableNamespace.connected = !0);
      }
      disconnectedCallback() {
        super.disconnectedCallback(),
          (this.__SyncUpdatableNamespace.connected = !1);
      }
      static __syncUpdatableHasChanged(e, t, i) {
        const s = this.elementProperties;
        return s.get(e) && s.get(e).hasChanged
          ? s.get(e).hasChanged(t, i)
          : t !== i;
      }
      __syncUpdatableInitialize() {
        const e = this.__SyncUpdatableNamespace,
          t = this.constructor;
        (e.initialized = !0),
          e.queue &&
            Array.from(e.queue).forEach((e) => {
              t.__syncUpdatableHasChanged(e, this[e], void 0) &&
                this.updateSync(e, void 0);
            });
      }
      requestUpdate(e, t) {
        super.requestUpdate(e, t),
          (this.__SyncUpdatableNamespace = this.__SyncUpdatableNamespace || {});
        const i = this.__SyncUpdatableNamespace,
          s = this.constructor;
        i.initialized
          ? s.__syncUpdatableHasChanged(e, this[e], t) && this.updateSync(e, t)
          : ((i.queue = i.queue || new Set()), i.queue.add(e));
      }
      updateSync(e, t) {}
    }
);
let gi,
  bi,
  yi = (e) => e;
class wi extends bt {
  static get properties() {
    return { feedbackData: { attribute: !1 } };
  }
  _messageTemplate({ message: e }) {
    return e;
  }
  updated(e) {
    super.updated(e),
      this.feedbackData && this.feedbackData[0]
        ? (this.setAttribute("type", this.feedbackData[0].type),
          (this.currentType = this.feedbackData[0].type),
          window.clearTimeout(this.removeMessage),
          "success" === this.currentType &&
            (this.removeMessage = window.setTimeout(() => {
              this.removeAttribute("type"), (this.feedbackData = []);
            }, 3e3)))
        : "success" !== this.currentType && this.removeAttribute("type");
  }
  render() {
    return Ye(
      gi ||
        (gi = yi`
      ${0}
    `),
      this.feedbackData &&
        this.feedbackData.map(({ message: e, type: t, validator: i }) =>
          Ye(
            bi ||
              (bi = yi`
          ${0}
        `),
            this._messageTemplate({ message: e, type: t, validator: i })
          )
        )
    );
  }
}
class xi {
  constructor(e, t) {
    this.__fakeExtendsEventTarget(),
      (this.__param = e),
      (this.__config = t || {}),
      (this.type = (t && t.type) || "error");
  }
  static get validatorName() {
    return "";
  }
  static get async() {
    return !1;
  }
  execute(e, t, i) {
    if (!this.constructor.validatorName)
      throw new Error(
        "A validator needs to have a name! Please set it via \"static get validatorName() { return 'IsCat'; }\""
      );
    return !0;
  }
  set param(e) {
    (this.__param = e),
      this.dispatchEvent && this.dispatchEvent(new Event("param-changed"));
  }
  get param() {
    return this.__param;
  }
  set config(e) {
    (this.__config = e),
      this.dispatchEvent && this.dispatchEvent(new Event("config-changed"));
  }
  get config() {
    return this.__config;
  }
  async _getMessage(e) {
    const t = this.constructor,
      i = {
        name: t.validatorName,
        type: this.type,
        params: this.param,
        config: this.config,
        ...e,
      };
    if (this.config.getMessage) {
      if ("function" == typeof this.config.getMessage)
        return this.config.getMessage(i);
      throw new Error(
        "You must provide a value for getMessage of type 'function', you provided a value of type: " +
          typeof this.config.getMessage
      );
    }
    return t.getMessage(i);
  }
  static async getMessage(e) {
    return `Please configure an error message for "${this.name}" by overriding "static async getMessage()"`;
  }
  onFormControlConnect(e) {}
  onFormControlDisconnect(e) {}
  abortExecution() {}
  __fakeExtendsEventTarget() {
    const e = document.createDocumentFragment();
    (this.addEventListener = (t, i, s) => e.addEventListener(t, i, s)),
      (this.removeEventListener = (t, i, s) => e.removeEventListener(t, i, s)),
      (this.dispatchEvent = (t) => e.dispatchEvent(t));
  }
}
class Si extends xi {
  executeOnResults({
    regularValidationResult: e,
    prevValidationResult: t,
    prevShownValidationResult: i,
    validators: s,
  }) {
    return !0;
  }
}
class ki extends xi {
  static get validatorName() {
    return "Required";
  }
  static get _compatibleRoles() {
    return [
      "combobox",
      "gridcell",
      "input",
      "listbox",
      "radiogroup",
      "select",
      "spinbutton",
      "textarea",
      "textbox",
      "tree",
    ];
  }
  static get _compatibleTags() {
    return ["input", "select", "textarea"];
  }
  onFormControlConnect({ _inputNode: e }) {
    if (e) {
      const t = e.getAttribute("role") || "",
        i = e.tagName.toLowerCase(),
        s = this.constructor;
      (s._compatibleRoles.includes(t) || s._compatibleTags.includes(i)) &&
        e.setAttribute("aria-required", "true");
    }
  }
  onFormControlDisconnect({ _inputNode: e }) {
    e && e.removeAttribute("aria-required");
  }
}
function Ci(e = [], t = []) {
  return e
    .filter((e) => !t.includes(e))
    .concat(t.filter((t) => !e.includes(t)));
}
const Ei = wt(
    (e) =>
      class extends Gt(vi(St(kt(xt(e))))) {
        static get scopedElements() {
          return {
            ...super.constructor.scopedElements,
            "lion-validation-feedback": wi,
          };
        }
        static get properties() {
          return {
            validators: { attribute: !1 },
            hasFeedbackFor: { attribute: !1 },
            shouldShowFeedbackFor: { attribute: !1 },
            showsFeedbackFor: {
              type: Array,
              attribute: "shows-feedback-for",
              reflect: !0,
              converter: {
                fromAttribute: (e) => e.split(","),
                toAttribute: (e) => e.join(","),
              },
            },
            validationStates: { attribute: !1 },
            isPending: { type: Boolean, attribute: "is-pending", reflect: !0 },
            defaultValidators: { attribute: !1 },
            _visibleMessagesAmount: { attribute: !1 },
            __childModelValueChanged: { attribute: !1 },
          };
        }
        static get validationTypes() {
          return ["error"];
        }
        get slots() {
          return {
            ...super.slots,
            feedback: () => {
              const e = this.shadowRoot.createElement(
                "lion-validation-feedback"
              );
              return (
                e.setAttribute("data-tag-name", "lion-validation-feedback"), e
              );
            },
          };
        }
        get _allValidators() {
          return [...this.validators, ...this.defaultValidators];
        }
        constructor() {
          super(),
            (this.hasFeedbackFor = []),
            (this.showsFeedbackFor = []),
            (this.shouldShowFeedbackFor = []),
            (this.validationStates = {}),
            (this.isPending = !1),
            (this.validators = []),
            (this.defaultValidators = []),
            (this._visibleMessagesAmount = 1),
            (this.__syncValidationResult = []),
            (this.__asyncValidationResult = []),
            (this.__validationResult = []),
            (this.__prevValidationResult = []),
            (this.__prevShownValidationResult = []),
            (this.__childModelValueChanged = !1),
            (this.__onValidatorUpdated = this.__onValidatorUpdated.bind(this)),
            (this._updateFeedbackComponent =
              this._updateFeedbackComponent.bind(this));
        }
        connectedCallback() {
          super.connectedCallback(),
            mi.addEventListener("localeChanged", this._updateFeedbackComponent);
        }
        disconnectedCallback() {
          super.disconnectedCallback(),
            mi.removeEventListener(
              "localeChanged",
              this._updateFeedbackComponent
            );
        }
        firstUpdated(e) {
          super.firstUpdated(e),
            (this.__validateInitialized = !0),
            this.validate(),
            "child" !== this._repropagationRole &&
              this.addEventListener("model-value-changed", () => {
                this.__childModelValueChanged = !0;
              });
        }
        updateSync(e, t) {
          if (
            (super.updateSync(e, t),
            "validators" === e
              ? (this.__setupValidators(),
                this.validate({ clearCurrentResult: !0 }))
              : "modelValue" === e && this.validate({ clearCurrentResult: !0 }),
            [
              "touched",
              "dirty",
              "prefilled",
              "focused",
              "submitted",
              "hasFeedbackFor",
              "filled",
            ].includes(e) && this._updateShouldShowFeedbackFor(),
            "showsFeedbackFor" === e)
          ) {
            this._inputNode &&
              this._inputNode.setAttribute(
                "aria-invalid",
                `${this._hasFeedbackVisibleFor("error")}`
              );
            const e = Ci(this.showsFeedbackFor, t);
            e.length > 0 &&
              this.dispatchEvent(
                new Event("showsFeedbackForChanged", { bubbles: !0 })
              ),
              e.forEach((e) => {
                var t;
                this.dispatchEvent(
                  new Event(
                    `showsFeedbackFor${
                      ((t = e), t.charAt(0).toUpperCase() + t.slice(1))
                    }Changed`,
                    { bubbles: !0 }
                  )
                );
              });
          }
          if ("shouldShowFeedbackFor" === e) {
            Ci(this.shouldShowFeedbackFor, t).length > 0 &&
              this.dispatchEvent(
                new Event("shouldShowFeedbackForChanged", { bubbles: !0 })
              );
          }
        }
        async validate({ clearCurrentResult: e } = {}) {
          if (this.disabled)
            return (
              this.__clearValidationResults(),
              this.__finishValidation({ source: "sync", hasAsync: !0 }),
              void this._updateFeedbackComponent()
            );
          this.__validateInitialized &&
            ((this.__prevValidationResult = this.__validationResult),
            e && this.__clearValidationResults(),
            await this.__executeValidators());
        }
        async __executeValidators() {
          this.validateComplete = new Promise((e) => {
            this.__validateCompleteResolve = e;
          });
          const e =
              this.modelValue instanceof Lt
                ? this.modelValue.viewValue
                : this.modelValue,
            t = this._allValidators.find((e) => e instanceof ki);
          if (this.__isEmpty(e))
            return (
              t && (this.__syncValidationResult = [t]),
              void this.__finishValidation({ source: "sync" })
            );
          const i = this._allValidators.filter(
              (e) => !(e instanceof Si || e instanceof ki)
            ),
            s = i.filter((e) => !e.constructor.async),
            a = i.filter((e) => e.constructor.async);
          this.__executeSyncValidators(s, e, { hasAsync: Boolean(a.length) }),
            await this.__executeAsyncValidators(a, e);
        }
        __executeSyncValidators(e, t, { hasAsync: i }) {
          e.length &&
            (this.__syncValidationResult = e.filter((e) =>
              e.execute(t, e.param, { node: this })
            )),
            this.__finishValidation({ source: "sync", hasAsync: i });
        }
        async __executeAsyncValidators(e, t) {
          if (e.length) {
            this.isPending = !0;
            const i = e.map((e) => e.execute(t, e.param, { node: this })),
              s = await Promise.all(i);
            (this.__asyncValidationResult = s
              .map((t, i) => e[i])
              .filter((e, t) => s[t])),
              this.__finishValidation({ source: "async" }),
              (this.isPending = !1);
          }
        }
        __executeResultValidators(e) {
          return this._allValidators
            .filter((e) => !e.constructor.async && e instanceof Si)
            .filter((t) =>
              t.executeOnResults({
                regularValidationResult: e,
                prevValidationResult: this.__prevValidationResult,
                prevShownValidationResult: this.__prevShownValidationResult,
              })
            );
        }
        __finishValidation({ source: e, hasAsync: t }) {
          const i = [
              ...this.__syncValidationResult,
              ...this.__asyncValidationResult,
            ],
            s = this.__executeResultValidators(i);
          this.__validationResult = [...s, ...i];
          const a = this.constructor.validationTypes.reduce(
            (e, t) => ({ ...e, [t]: {} }),
            {}
          );
          this.__validationResult.forEach((e) => {
            a[e.type] || (a[e.type] = {});
            const t = e.constructor;
            a[e.type][t.validatorName] = !0;
          }),
            (this.validationStates = a),
            (this.hasFeedbackFor = [
              ...new Set(this.__validationResult.map((e) => e.type)),
            ]),
            this.dispatchEvent(
              new Event("validate-performed", { bubbles: !0 })
            ),
            ("async" !== e && t) ||
              (this.__validateCompleteResolve &&
                this.__validateCompleteResolve());
        }
        __clearValidationResults() {
          (this.__syncValidationResult = []),
            (this.__asyncValidationResult = []);
        }
        __onValidatorUpdated(e) {
          ("param-changed" !== e.type && "config-changed" !== e.type) ||
            this.validate();
        }
        __setupValidators() {
          const e = ["param-changed", "config-changed"];
          this.__prevValidators &&
            this.__prevValidators.forEach((t) => {
              e.forEach((e) => {
                t.removeEventListener &&
                  t.removeEventListener(e, this.__onValidatorUpdated);
              }),
                t.onFormControlDisconnect(this);
            }),
            this._allValidators.forEach((t) => {
              if (!(t instanceof xi)) {
                const e = `Validators array only accepts class instances of Validator. Type "${
                  Array.isArray(t) ? "array" : typeof t
                }" found. This may be caused by having multiple installations of @lion/form-core.`;
                throw (console.error(e, this), new Error(e));
              }
              if (-1 === this.constructor.validationTypes.indexOf(t.type)) {
                const e = t.constructor,
                  i = `This component does not support the validator type "${t.type}" used in "${e.validatorName}". You may change your validators type or add it to the components "static get validationTypes() {}".`;
                throw (console.error(i, this), new Error(i));
              }
              e.forEach((e) => {
                t.addEventListener &&
                  t.addEventListener(e, this.__onValidatorUpdated);
              }),
                t.onFormControlConnect(this);
            }),
            (this.__prevValidators = this._allValidators);
        }
        __isEmpty(e) {
          return "function" == typeof this._isEmpty
            ? this._isEmpty(e)
            : null === this.modelValue ||
                void 0 === this.modelValue ||
                "" === this.modelValue;
        }
        async __getFeedbackMessages(e) {
          let t = await this.fieldName;
          return Promise.all(
            e.map(async (e) => {
              e.config.fieldName && (t = await e.config.fieldName);
              return {
                message: await e._getMessage({
                  modelValue: this.modelValue,
                  formControl: this,
                  fieldName: t,
                }),
                type: e.type,
                validator: e,
              };
            })
          );
        }
        _updateFeedbackComponent() {
          const { _feedbackNode: e } = this;
          e &&
            (this.__feedbackQueue || (this.__feedbackQueue = new _i()),
            this.showsFeedbackFor.length > 0
              ? this.__feedbackQueue.add(async () => {
                  (this.__prioritizedResult = this._prioritizeAndFilterFeedback(
                    { validationResult: this.__validationResult }
                  )),
                    this.__prioritizedResult.length > 0 &&
                      (this.__prevShownValidationResult =
                        this.__prioritizedResult);
                  const t = await this.__getFeedbackMessages(
                    this.__prioritizedResult
                  );
                  e.feedbackData = t.length ? t : [];
                })
              : this.__feedbackQueue.add(async () => {
                  e.feedbackData = [];
                }),
            (this.feedbackComplete = this.__feedbackQueue.complete));
        }
        _showFeedbackConditionFor(e, t) {
          return !0;
        }
        get _feedbackConditionMeta() {
          return { modelValue: this.modelValue, el: this };
        }
        feedbackCondition(
          e,
          t = this._feedbackConditionMeta,
          i = this._showFeedbackConditionFor.bind(this)
        ) {
          return i(e, t);
        }
        _hasFeedbackVisibleFor(e) {
          return (
            this.hasFeedbackFor &&
            this.hasFeedbackFor.includes(e) &&
            this.shouldShowFeedbackFor &&
            this.shouldShowFeedbackFor.includes(e)
          );
        }
        updated(e) {
          if (
            (super.updated(e),
            e.has("shouldShowFeedbackFor") || e.has("hasFeedbackFor"))
          ) {
            const e = this.constructor;
            (this.showsFeedbackFor = e.validationTypes
              .map((e) => (this._hasFeedbackVisibleFor(e) ? e : void 0))
              .filter(Boolean)),
              this._updateFeedbackComponent();
          }
          if (
            (e.has("__childModelValueChanged") &&
              this.__childModelValueChanged &&
              (this.validate({ clearCurrentResult: !0 }),
              (this.__childModelValueChanged = !1)),
            e.has("validationStates"))
          ) {
            const t = e.get("validationStates");
            t &&
              Object.entries(this.validationStates).forEach(([e, i]) => {
                t[e] &&
                  JSON.stringify(i) !== JSON.stringify(t[e]) &&
                  this.dispatchEvent(
                    new CustomEvent(`${e}StateChanged`, { detail: i })
                  );
              });
          }
        }
        _updateShouldShowFeedbackFor() {
          const e = this.constructor.validationTypes
            .map((e) =>
              this.feedbackCondition(
                e,
                this._feedbackConditionMeta,
                this._showFeedbackConditionFor.bind(this)
              )
                ? e
                : void 0
            )
            .filter(Boolean);
          JSON.stringify(this.shouldShowFeedbackFor) !== JSON.stringify(e) &&
            (this.shouldShowFeedbackFor = e);
        }
        _prioritizeAndFilterFeedback({ validationResult: e }) {
          const t = this.constructor.validationTypes;
          return e
            .filter((e) =>
              this.feedbackCondition(
                e.type,
                this._feedbackConditionMeta,
                this._showFeedbackConditionFor.bind(this)
              )
            )
            .sort((e, i) => t.indexOf(e.type) - t.indexOf(i.type))
            .slice(0, this._visibleMessagesAmount);
        }
      }
  ),
  Ni = wt(
    (e) =>
      class extends Ei(Gt(e)) {
        static get properties() {
          return {
            formattedValue: { attribute: !1 },
            serializedValue: { attribute: !1 },
            formatOptions: { attribute: !1 },
          };
        }
        requestUpdate(e, t) {
          super.requestUpdate(e, t),
            "modelValue" === e &&
              this.modelValue !== t &&
              this._onModelValueChanged(
                { modelValue: this.modelValue },
                { modelValue: t }
              ),
            "serializedValue" === e &&
              this.serializedValue !== t &&
              this._calculateValues({ source: "serialized" }),
            "formattedValue" === e &&
              this.formattedValue !== t &&
              this._calculateValues({ source: "formatted" });
        }
        get value() {
          return (
            (this._inputNode && this._inputNode.value) || this.__value || ""
          );
        }
        set value(e) {
          this._inputNode
            ? ((this._inputNode.value = e), (this.__value = void 0))
            : (this.__value = e);
        }
        preprocessor(e) {
          return e;
        }
        parser(e, t) {
          return e;
        }
        formatter(e, t) {
          return e;
        }
        serializer(e) {
          return void 0 !== e ? e : "";
        }
        deserializer(e) {
          return void 0 === e ? "" : e;
        }
        _calculateValues({ source: e } = { source: null }) {
          this.__preventRecursiveTrigger ||
            ((this.__preventRecursiveTrigger = !0),
            "model" !== e &&
              ("serialized" === e
                ? (this.modelValue = this.deserializer(this.serializedValue))
                : "formatted" === e && (this.modelValue = this._callParser())),
            "formatted" !== e && (this.formattedValue = this._callFormatter()),
            "serialized" !== e &&
              (this.serializedValue = this.serializer(this.modelValue)),
            this._reflectBackFormattedValueToUser(),
            (this.__preventRecursiveTrigger = !1));
        }
        _callParser(e = this.formattedValue) {
          if ("" === e) return "";
          if ("string" != typeof e) return;
          const t = this.parser(e, this.formatOptions);
          return void 0 !== t ? t : new Lt(e);
        }
        _callFormatter() {
          return this._isHandlingUserInput &&
            this.hasFeedbackFor &&
            this.hasFeedbackFor.length &&
            this.hasFeedbackFor.includes("error") &&
            this._inputNode
            ? this._inputNode
              ? this.value
              : void 0
            : this.modelValue instanceof Lt
            ? this.modelValue.viewValue
            : this.formatter(this.modelValue, this.formatOptions);
        }
        _onModelValueChanged(...e) {
          this._calculateValues({ source: "model" }),
            this._dispatchModelValueChangedEvent(...e);
        }
        _dispatchModelValueChangedEvent(...e) {
          this.dispatchEvent(
            new CustomEvent("model-value-changed", {
              bubbles: !0,
              detail: {
                formPath: [this],
                isTriggeredByUser: Boolean(this._isHandlingUserInput),
              },
            })
          );
        }
        _syncValueUpwards() {
          this.__isHandlingComposition ||
            (this.value = this.preprocessor(this.value));
          const e = this.formattedValue;
          (this.modelValue = this._callParser(this.value)),
            e === this.formattedValue &&
              this.__prevViewValue !== this.value &&
              this._calculateValues(),
            (this.__prevViewValue = this.value);
        }
        _reflectBackFormattedValueToUser() {
          this._reflectBackOn() &&
            (this.value =
              void 0 !== this.formattedValue ? this.formattedValue : "");
        }
        _reflectBackOn() {
          return !this._isHandlingUserInput;
        }
        _proxyInputEvent() {
          this.dispatchEvent(new Event("user-input-changed", { bubbles: !0 }));
        }
        _onUserInputChanged() {
          (this._isHandlingUserInput = !0),
            this._syncValueUpwards(),
            (this._isHandlingUserInput = !1);
        }
        __onCompositionEvent({ type: e }) {
          "compositionstart" === e
            ? (this.__isHandlingComposition = !0)
            : "compositionend" === e &&
              ((this.__isHandlingComposition = !1), this._syncValueUpwards());
        }
        constructor() {
          super(),
            (this.formatOn = "change"),
            (this.formatOptions = {}),
            (this.formattedValue = void 0),
            (this.serializedValue = void 0),
            (this._isPasting = !1),
            (this._isHandlingUserInput = !1),
            (this.__prevViewValue = ""),
            (this.__onCompositionEvent = this.__onCompositionEvent.bind(this)),
            this.addEventListener(
              "user-input-changed",
              this._onUserInputChanged
            ),
            this.addEventListener("paste", this.__onPaste),
            (this._reflectBackFormattedValueToUser =
              this._reflectBackFormattedValueToUser.bind(this)),
            (this._reflectBackFormattedValueDebounced = () => {
              setTimeout(this._reflectBackFormattedValueToUser);
            });
        }
        __onPaste() {
          (this._isPasting = !0),
            (this.formatOptions.mode = "pasted"),
            setTimeout(() => {
              (this._isPasting = !1), (this.formatOptions.mode = "auto");
            });
        }
        connectedCallback() {
          super.connectedCallback(),
            void 0 === this.modelValue && this._syncValueUpwards(),
            this._reflectBackFormattedValueToUser(),
            this._inputNode &&
              (this._inputNode.addEventListener(
                this.formatOn,
                this._reflectBackFormattedValueDebounced
              ),
              this._inputNode.addEventListener("input", this._proxyInputEvent),
              this._inputNode.addEventListener(
                "compositionstart",
                this.__onCompositionEvent
              ),
              this._inputNode.addEventListener(
                "compositionend",
                this.__onCompositionEvent
              ));
        }
        disconnectedCallback() {
          super.disconnectedCallback(),
            this._inputNode &&
              (this._inputNode.removeEventListener(
                "input",
                this._proxyInputEvent
              ),
              this._inputNode.removeEventListener(
                this.formatOn,
                this._reflectBackFormattedValueDebounced
              ),
              this._inputNode.removeEventListener(
                "compositionstart",
                this.__onCompositionEvent
              ),
              this._inputNode.removeEventListener(
                "compositionend",
                this.__onCompositionEvent
              ));
        }
      }
  ),
  Vi = wt(
    (e) =>
      class extends Gt(e) {
        static get properties() {
          return {
            touched: { type: Boolean, reflect: !0 },
            dirty: { type: Boolean, reflect: !0 },
            filled: { type: Boolean, reflect: !0 },
            prefilled: { attribute: !1 },
            submitted: { attribute: !1 },
          };
        }
        requestUpdate(e, t) {
          super.requestUpdate(e, t),
            "touched" === e && this.touched !== t && this._onTouchedChanged(),
            "modelValue" === e && (this.filled = !this._isEmpty()),
            "dirty" === e && this.dirty !== t && this._onDirtyChanged();
        }
        constructor() {
          super(),
            (this.touched = !1),
            (this.dirty = !1),
            (this.prefilled = !1),
            (this.filled = !1),
            (this._leaveEvent = "blur"),
            (this._valueChangedEvent = "model-value-changed"),
            (this._iStateOnLeave = this._iStateOnLeave.bind(this)),
            (this._iStateOnValueChange = this._iStateOnValueChange.bind(this));
        }
        connectedCallback() {
          super.connectedCallback(),
            this.addEventListener(this._leaveEvent, this._iStateOnLeave),
            this.addEventListener(
              this._valueChangedEvent,
              this._iStateOnValueChange
            ),
            this.initInteractionState();
        }
        disconnectedCallback() {
          super.disconnectedCallback(),
            this.removeEventListener(this._leaveEvent, this._iStateOnLeave),
            this.removeEventListener(
              this._valueChangedEvent,
              this._iStateOnValueChange
            );
        }
        initInteractionState() {
          (this.dirty = !1), (this.prefilled = !this._isEmpty());
        }
        _iStateOnLeave() {
          (this.touched = !0), (this.prefilled = !this._isEmpty());
        }
        _iStateOnValueChange() {
          this.dirty = !0;
        }
        resetInteractionState() {
          (this.touched = !1),
            (this.submitted = !1),
            (this.dirty = !1),
            (this.prefilled = !this._isEmpty());
        }
        _onTouchedChanged() {
          this.dispatchEvent(
            new Event("touched-changed", { bubbles: !0, composed: !0 })
          );
        }
        _onDirtyChanged() {
          this.dispatchEvent(
            new Event("dirty-changed", { bubbles: !0, composed: !0 })
          );
        }
        _showFeedbackConditionFor(e, t) {
          return (t.touched && t.dirty) || t.prefilled || t.submitted;
        }
        get _feedbackConditionMeta() {
          return {
            ...super._feedbackConditionMeta,
            submitted: this.submitted,
            touched: this.touched,
            dirty: this.dirty,
            filled: this.filled,
            prefilled: this.prefilled,
          };
        }
      }
  );
class Ti extends Gt(Vi(Tt(Ni(Ei(kt(bt)))))) {
  firstUpdated(e) {
    super.firstUpdated(e), (this._initialModelValue = this.modelValue);
  }
  connectedCallback() {
    super.connectedCallback(),
      (this._onChange = this._onChange.bind(this)),
      this._inputNode.addEventListener("change", this._onChange),
      this.classList.add("form-field");
  }
  disconnectedCallback() {
    super.disconnectedCallback(),
      this._inputNode.removeEventListener("change", this._onChange);
  }
  resetInteractionState() {
    super.resetInteractionState(), (this.submitted = !1);
  }
  reset() {
    (this.modelValue = this._initialModelValue), this.resetInteractionState();
  }
  clear() {
    this.modelValue = "";
  }
  _onChange() {
    this.dispatchEvent(new Event("user-input-changed", { bubbles: !0 }));
  }
  get _feedbackConditionMeta() {
    return { ...super._feedbackConditionMeta, focused: this.focused };
  }
  get _focusableNode() {
    return this._inputNode;
  }
}
const Pi = wt(
  (e) =>
    class extends Ni(Tt(Gt(e))) {
      static get properties() {
        return { autocomplete: { type: String, reflect: !0 } };
      }
      constructor() {
        super(), (this.autocomplete = void 0);
      }
      get _inputNode() {
        return super._inputNode;
      }
      get selectionStart() {
        const e = this._inputNode;
        return e && e.selectionStart ? e.selectionStart : 0;
      }
      set selectionStart(e) {
        const t = this._inputNode;
        t && t.selectionStart && (t.selectionStart = e);
      }
      get selectionEnd() {
        const e = this._inputNode;
        return e && e.selectionEnd ? e.selectionEnd : 0;
      }
      set selectionEnd(e) {
        const t = this._inputNode;
        t && t.selectionEnd && (t.selectionEnd = e);
      }
      get value() {
        return (this._inputNode && this._inputNode.value) || this.__value || "";
      }
      set value(e) {
        this._inputNode
          ? (this._inputNode.value !== e && this._setValueAndPreserveCaret(e),
            (this.__value = void 0))
          : (this.__value = e);
      }
      _setValueAndPreserveCaret(e) {
        if (this.focused)
          try {
            if (!(this._inputNode instanceof HTMLSelectElement)) {
              const t = this._inputNode.selectionStart;
              (this._inputNode.value = e),
                (this._inputNode.selectionStart = t),
                (this._inputNode.selectionEnd = t);
            }
          } catch (t) {
            this._inputNode.value = e;
          }
        else this._inputNode.value = e;
      }
      _reflectBackFormattedValueToUser() {
        if (
          (super._reflectBackFormattedValueToUser(),
          this._reflectBackOn() && this.focused)
        )
          try {
            this._inputNode.selectionStart = this._inputNode.value.length;
          } catch (e) {}
      }
      get _focusableNode() {
        return this._inputNode;
      }
    }
);
class Mi extends Pi(Ti) {
  static get properties() {
    return {
      readOnly: { type: Boolean, attribute: "readonly", reflect: !0 },
      type: { type: String, reflect: !0 },
      placeholder: { type: String, reflect: !0 },
    };
  }
  get slots() {
    return {
      ...super.slots,
      input: () => {
        const e = document.createElement("input"),
          t = this.getAttribute("value");
        return t && e.setAttribute("value", t), e;
      },
    };
  }
  get _inputNode() {
    return super._inputNode;
  }
  constructor() {
    super(),
      (this.readOnly = !1),
      (this.type = "text"),
      (this.placeholder = "");
  }
  requestUpdate(e, t) {
    super.requestUpdate(e, t), "readOnly" === e && this.__delegateReadOnly();
  }
  firstUpdated(e) {
    super.firstUpdated(e), this.__delegateReadOnly();
  }
  updated(e) {
    super.updated(e),
      e.has("type") && (this._inputNode.type = this.type),
      e.has("placeholder") && (this._inputNode.placeholder = this.placeholder),
      e.has("disabled") &&
        ((this._inputNode.disabled = this.disabled), this.validate()),
      e.has("name") && (this._inputNode.name = this.name),
      e.has("autocomplete") &&
        (this._inputNode.autocomplete = this.autocomplete);
  }
  __delegateReadOnly() {
    this._inputNode && (this._inputNode.readOnly = this.readOnly);
  }
}
customElements.define("lion-input", Mi);
let Li;
var Ai = K(
  Li ||
    (Li = ((e) => e)`
@import url("https://use.typekit.net/tgy5tlj.css");:host{color:#000;display:inline-block;height:43px;padding:10px}svg{height:100%;max-height:74px;min-height:20px}g#rotunda path,g#rotunda polygon,g#rotunda rect{fill:#e57200}#sepline{fill:#fff}[dark] #sepline{fill:#141e3c}#libletters,#uvaletters{fill:#fff}[dark] #libletters,[dark] #uvaletters{fill:#141e3c}
/*# sourceMappingURL=src/UvalibLogos.css.map */
`)
);
let Oi,
  Fi = (e) => e;
window.customElements.define(
  "uvalib-logos",
  class extends Y {
    static get styles() {
      return [Ai];
    }
    constructor() {
      super(), (this.onecolor = !1);
    }
    static get properties() {
      return { _dark: { type: Boolean } };
    }
    lightOrDark(e) {
      var t, i, s;
      return (
        e.match(/^rgb/)
          ? ((t = (e = e.match(
              /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
            ))[1]),
            (i = e[2]),
            (s = e[3]))
          : ((t =
              (e = +(
                "0x" + e.slice(1).replace(e.length < 5 && /./g, "$&$&")
              )) >> 16),
            (i = (e >> 8) & 255),
            (s = 255 & e)),
        Math.sqrt(t * t * 0.299 + i * i * 0.587 + s * s * 0.114) > 127.5
          ? "light"
          : "dark"
      );
    }
    realBackgroundColor(e) {
      var t = "rgba(0, 0, 0, 0)";
      if (!e) return t;
      var i = getComputedStyle(e).backgroundColor;
      return i === t || "transparent" === i
        ? this.realBackgroundColor(
            e.parentElement
              ? e.parentElement
              : e.getRootNode()
              ? e.getRootNode().host
              : null
          )
        : i;
    }
    evalBackgroundColor() {
      (this._backgroundColor = this.realBackgroundColor(this)),
        console.info(
          `Found the background of the uvalib-logos to be ${this._backgroundColor}`
        ),
        (this._dark = "dark" != this.lightOrDark(this._backgroundColor));
    }
    connectedCallback() {
      super.connectedCallback(), this.evalBackgroundColor();
    }
    render() {
      return R(
        Oi ||
          (Oi = Fi` <svg ?dark="${0}" role="img" id="library_logo_primary" data-name="library_logo_primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 327.42 73.89"> <title>University of Virginia Library</title> <desc id="desc">"Horizontal version of the logo"</desc> <g> <rect id="sepline" x="168.33" width="0.63" height="73.89"/> <g id="rotunda"> <rect x="21.82" y="34.73" width="2.72" height="12.96"/> <rect x="7.12" y="34.73" width="2.64" height="12.96"/> <rect x="10.67" y="34.73" width="2.81" height="12.96"/> <rect x="14.38" y="34.73" width="2.81" height="12.96"/> <rect x="18.1" y="34.73" width="2.81" height="12.96"/> <polygon points="23.37 33.82 8.23 33.82 16 29.04 23.37 33.82"/> <polygon points="0 28.99 0 33.82 6.49 33.82 14.34 28.99 0 28.99"/> <polygon points="17.61 28.99 31.57 28.99 31.57 33.82 25.05 33.82 17.61 28.99"/> <path d="M29.58,28.07H2a15.73,15.73,0,0,1,27.58,0"/> <path d="M2.13,44l-.24.73.62-.45.62.45L2.89,44l.62-.45H2.74l-.23-.72-.24.72H1.51ZM0,39.88l.62.45-.24.72L1,40.6l.62.45-.24-.72L2,39.88H1.24L1,39.15l-.24.73ZM6.22,47.7H5.38L5.15,47l.61-.44H5l-.24-.73-.23.73H3.77l.61.44-.23.73H0V37.06l.58-.42.62.45L1,36.36l.62-.45H.82l-.24-.72-.1.33-.15.39H0V34.73H6.22Zm-.84,0H4.15l.61-.45ZM0,37v-.75l.19.13-.14.4Z" style="fill-rule:evenodd"/> <rect y="48.61" width="6.21" height="3.44"/> <rect x="25.45" y="48.61" width="6.13" height="3.44"/> <path d="M20.05,51l.62-.45H19.9l-.23-.72-.24.72h-.76l.62.45-.24.73.62-.45.61.45Zm-4.62.48-.17.53H7.12V48.61h1L8,49.15H7.19l.62.45-.24.72.62-.45.61.45-.23-.72.62-.45H8.42l-.17-.54H23.37l-.17.54h-.77l.62.45-.23.72.61-.45.62.45-.24-.72.62-.45h-.76l-.18-.54h1.05v3.44H16.37l-.17-.53.61-.45h-.76l-.24-.72-.23.72h-.76Zm-4-.48-.24.73.62-.45.62.45L12.22,51l.62-.45h-.76l-.24-.72-.23.72h-.77Zm4.71,1h-.7l.34-.25Z" style="fill-rule:evenodd"/> <path d="M29.49,44l.62-.45h-.76l-.24-.72-.23.72h-.77l.62.45-.24.73.62-.45.62.45Zm-2,3.69L27.24,47l.61-.44h-.76l-.23-.73-.24.73h-.76l.61.44-.23.72.62-.44.61.44Zm4.1,0H25.45v-13h6.12v1.18h-.3L31,35.19l-.24.72H30l.62.45-.24.73.62-.45.53.39v2.85h-.71l-.24-.73-.24.73h-.76l.62.45-.24.72.62-.44.62.44L31,40.33l.57-.42Zm0-11.44v.59l-.15-.48Z" style="fill-rule:evenodd"/> </g> <g id="uvaletters"> <path d="M44.09,37.49A6.85,6.85,0,0,0,48.89,36,6.64,6.64,0,0,0,51,31c.08-1,.13-5.47.13-5.82s0-4,0-4.25a1,1,0,0,1,1.1-1h1c.12,0,.15-.1.15-.26v-.56c0-.07,0-.18-.26-.18s-1,.08-2.81.08-2.89-.08-3.14-.08-.18.05-.18.18v.62c0,.12,0,.2.18.2h1.12a1.13,1.13,0,0,1,1.15,1.12c.08.64.13,2.13.13,4.07v5.47a6.35,6.35,0,0,1-1.33,4.5,5.44,5.44,0,0,1-3.83,1.41,4.78,4.78,0,0,1-4.07-1.85,6.12,6.12,0,0,1-.82-3.24c0-.82-.12-4.07-.12-5.42V24.3c0-1.3,0-3.09.05-3.32a1.15,1.15,0,0,1,1.22-1.05h1.28c.18,0,.21-.05.21-.18v-.66c0-.11,0-.16-.23-.16s-1.51.08-3.51.08-3.24-.08-3.5-.08-.23.05-.23.21v.56c0,.18,0,.23.18.23h1.2c.8,0,1,.41,1,1.3v6.09a27.16,27.16,0,0,0,.41,6.21,4.67,4.67,0,0,0,3,3.43,9.66,9.66,0,0,0,3.45.53" style="fill-rule:evenodd"/> <path d="M65.08,28.68c0-1.14-.06-2.89.08-4.17,0-.39.19-.58.89-.58h.28c.11,0,.16-.09.16-.2v-.58c0-.17,0-.22-.19-.22s-1.17.08-1.75.08c-.89,0-2.09-.08-2.28-.08s-.19.05-.19.14v.66c0,.14.05.2.19.2h.47a1.07,1.07,0,0,1,1,.5A13.52,13.52,0,0,1,64,27c.06.89.09,1.75.09,3.33v1.84H64c-.33-.37-2.91-3.62-3.41-4.2s-3.78-4.72-3.86-4.83S56.41,23,56,23s-.92.05-1.36.05-.75,0-1.11-.05-.67,0-.72,0a.16.16,0,0,0-.17.17v.66a.15.15,0,0,0,.17.17h.25a1.38,1.38,0,0,1,1.47,1.47v2.92c0,3.14-.06,5.11-.08,5.44a.85.85,0,0,1-.81.83H53c-.08,0-.11,0-.11.09v.72c0,.14,0,.19.08.19.23,0,1.48-.08,1.86-.08.81,0,1.92.08,2.12.08s.13-.05.13-.16v-.67c0-.11,0-.17-.13-.17h-.59c-.28,0-.58-.3-.66-.94-.06-.25-.17-3-.17-4.69V25.15h.05c.45.5,2.7,3.5,3.37,4.28l2.77,3.3c1.14,1.36,2.09,2.5,2.28,2.7a1.27,1.27,0,0,0,.64.27c.33,0,.42-.27.42-.52Z" style="fill-rule:evenodd"/> <path d="M71.67,28.4c0-.19,0-3.5,0-3.78,0-.58.28-.69,1-.69h.47c.14,0,.17-.09.17-.2v-.66c0-.09-.06-.14-.17-.14s-1.64.08-2.45.08c-1.3,0-3-.08-3.19-.08s-.17.05-.17.16v.64c0,.11,0,.2.17.2h.5c1.17,0,1.42.28,1.42.58s0,3.17,0,3.61v1.22c0,.95,0,4.48,0,4.73-.06.5-.5.52-1.2.52h-.61a.17.17,0,0,0-.17.17v.61c0,.14.06.22.17.22s1.78-.08,2.72-.08c1.25,0,2.7.08,2.92.08s.17-.08.17-.19v-.67c0-.08,0-.14-.17-.14h-.42c-.8,0-1.14-.39-1.19-1,0-.42,0-3.61,0-3.78Z" style="fill-rule:evenodd"/> <path d="M99.83,29.18c0,1.69,0,3.33,0,4.69,0,.61-.33.72-1,.72h-.33c-.11,0-.17.06-.17.14v.64c0,.14.06.22.17.22s1.61-.08,2.3-.08c.92,0,2.42.08,2.61.08s.23-.05.23-.19v-.67c0-.08-.06-.14-.17-.14h-.72a.69.69,0,0,1-.78-.69V30.23a3.08,3.08,0,0,1,.72-.05c1.17,0,1.59.61,2.59,2.33a17.72,17.72,0,0,0,2,3.06c.48,0,1.14-.06,1.78-.06l.86,0,.56.05a.17.17,0,0,0,.17-.19v-.56c0-.16,0-.25-.14-.25a1.9,1.9,0,0,1-1.25-.3,8.63,8.63,0,0,1-1.56-1.78C106.52,30.9,106,30,105.33,29.9v-.06c2.19-.77,3.28-1.88,3.28-3.8a3.06,3.06,0,0,0-1-2A5.51,5.51,0,0,0,104,22.93l-3.11.08c-.5,0-2.22-.08-2.36-.08s-.17.05-.17.14v.66c0,.12,0,.2.12.2h.27c.78,0,1,.3,1.06.86v4.39Zm2.11-4.75c0-.5.42-.61.83-.61a4.64,4.64,0,0,1,2.64.72,2.36,2.36,0,0,1,.92,1.92c0,.72-.47,2.88-3.56,2.88a5.61,5.61,0,0,1-.83-.05Z" style="fill-rule:evenodd"/> <path d="M115.31,35.84A3.65,3.65,0,0,0,119.17,32a3.4,3.4,0,0,0-.89-2.66,7.58,7.58,0,0,0-3-1.5,5,5,0,0,1-1.94-1.14,2.26,2.26,0,0,1-.45-1.36,1.84,1.84,0,0,1,2-1.7,2.36,2.36,0,0,1,1.84.75,7.22,7.22,0,0,1,1,2c0,.09.08.14.17.12l.5-.12a.14.14,0,0,0,.11-.16c0-.39-.28-2.2-.28-3.11,0-.14,0-.25-.25-.25s-.31,0-.36.08l-.11.19c-.06.14-.2.12-.48-.05a4.25,4.25,0,0,0-2-.36,4,4,0,0,0-2.61.83,3.26,3.26,0,0,0-1.19,2.33,3.72,3.72,0,0,0,1,2.87,8.61,8.61,0,0,0,2.72,1.44c1.47.56,2.56,1.25,2.56,2.83,0,1.2-1.33,1.89-2.22,1.89a2.63,2.63,0,0,1-2.37-1.39,3.5,3.5,0,0,1-.5-1.89c0-.11-.11-.16-.22-.19l-.5-.06c-.11,0-.16.09-.19.2,0,.44-.22,2.66-.31,3.44,0,.14.06.25.23.31s.36,0,.41-.14l.08-.22c.06-.22.23-.2.42-.06a4.77,4.77,0,0,0,3,1" style="fill-rule:evenodd"/> <path d="M123.87,28.4c0-.19,0-3.5,0-3.78,0-.58.28-.69,1-.69h.47c.14,0,.17-.09.17-.2v-.66c0-.09-.06-.14-.17-.14S123.76,23,123,23c-1.31,0-3-.08-3.2-.08a.14.14,0,0,0-.16.16v.64c0,.11,0,.2.16.2h.5c1.17,0,1.42.28,1.42.58s.06,3.17.06,3.61v1.22c0,.95,0,4.48-.06,4.73-.05.5-.5.52-1.19.52h-.61a.16.16,0,0,0-.17.17v.61c0,.14.05.22.17.22s1.77-.08,2.72-.08c1.25,0,2.69.08,2.91.08s.17-.08.17-.19v-.67c0-.08,0-.14-.17-.14h-.41a1,1,0,0,1-1.2-1c0-.42,0-3.61,0-3.78Z" style="fill-rule:evenodd"/> <path d="M49.41,44.41c2.54,0,4.07-3.5,4.07-5.43a1.85,1.85,0,0,0-1.88-2c-2.34,0-4,3-4,5.22a2,2,0,0,0,1.81,2.26m-.27-.84a.84.84,0,0,1-.81-.9,6,6,0,0,1,1-2.84c.88-1.43,1.81-2.1,2.55-2.1a.87.87,0,0,1,.88,1c0,1.16-1.81,4.85-3.64,4.85" style="fill-rule:evenodd"/> <path d="M78.36,44.86c0-.2,0-3.5,0-3.78,0-.58.28-.69,1-.69h.47c.14,0,.16-.09.16-.2v-.66c0-.09,0-.14-.16-.14s-1.64.08-2.45.08c-1.3,0-3-.08-3.19-.08s-.17,0-.17.16v.64c0,.11,0,.2.17.2h.5c1.17,0,1.42.27,1.42.58s0,3.17,0,3.61V45.8c0,1,0,4.47,0,4.72-.06.5-.5.53-1.2.53h-.61a.17.17,0,0,0-.17.17v.61c0,.14.06.22.17.22S76.14,52,77.08,52c1.25,0,2.7.08,2.92.08s.17-.08.17-.19v-.67c0-.08,0-.14-.17-.14h-.42a1,1,0,0,1-1.19-1c0-.41,0-3.61,0-3.77Z" style="fill-rule:evenodd"/> <path d="M82.4,45.64c0,1.69,0,3.33,0,4.69,0,.61-.33.72-1,.72H81c-.11,0-.17.06-.17.14v.64c0,.14.06.22.17.22s1.61-.08,2.3-.08c.92,0,2.42.08,2.61.08s.23,0,.23-.19v-.67c0-.08-.06-.14-.17-.14h-.72a.69.69,0,0,1-.78-.69V46.69a3.08,3.08,0,0,1,.72,0c1.17,0,1.58.61,2.58,2.33a18,18,0,0,0,2,3.05C90.29,52,91,52,91.59,52l.86,0,.56,0a.17.17,0,0,0,.17-.19V51.3c0-.16,0-.25-.14-.25a2,2,0,0,1-1.25-.3A8.63,8.63,0,0,1,90.23,49c-1.14-1.61-1.69-2.47-2.33-2.61V46.3c2.19-.77,3.28-1.89,3.28-3.8a3,3,0,0,0-1-2,5.51,5.51,0,0,0-3.61-1.08l-3.11.08c-.5,0-2.22-.08-2.36-.08s-.16,0-.16.14v.66c0,.11,0,.2.11.2h.27c.78,0,1,.3,1.06.86v4.39Zm2.27-4.75c0-.5.42-.61.83-.61a4.64,4.64,0,0,1,2.64.72,2.36,2.36,0,0,1,.92,1.91c0,.73-.47,2.89-3.56,2.89a5.61,5.61,0,0,1-.83,0Z" style="fill-rule:evenodd"/> <path d="M103.58,48.19c0-.47.52-.58.8-.58h.47a.16.16,0,0,0,.14-.17v-.67c0-.08,0-.13-.16-.13s-1.37,0-2.39,0c-1.5,0-2.86,0-3,0s-.14,0-.14.13v.67c0,.08,0,.14.14.14h.67c.72,0,1.36.19,1.36.83v1a1.32,1.32,0,0,1-.42,1.2,3.93,3.93,0,0,1-2.3.61A4,4,0,0,1,96.05,50a6.77,6.77,0,0,1-1.69-4.86A5.86,5.86,0,0,1,95.8,41.5a4,4,0,0,1,3-1.42,3.66,3.66,0,0,1,2.81,1.33,7,7,0,0,1,1.33,2c.08.22.14.25.22.22l.53-.17c.08,0,.11-.08.11-.22,0-.5-.42-3.08-.42-3.22s0-.31-.3-.31a.34.34,0,0,0-.36.2l-.14.25c-.06.08-.17.08-.39-.11A6.05,6.05,0,0,0,99,39.14a7.5,7.5,0,0,0-5,1.69,6.09,6.09,0,0,0-2,4.56,6.76,6.76,0,0,0,1.66,4.88,7.14,7.14,0,0,0,5,2,10.42,10.42,0,0,0,4.75-1.11c.2-.08.31-.17.31-.3s-.08-.31-.08-.56Z" style="fill-rule:evenodd"/> <path d="M108.67,44.86c0-.2,0-3.5,0-3.78,0-.58.27-.69,1-.69h.48c.13,0,.16-.09.16-.2v-.66c0-.09,0-.14-.16-.14s-1.64.08-2.45.08c-1.3,0-3-.08-3.19-.08s-.17,0-.17.16v.64c0,.11,0,.2.17.2h.5c1.16,0,1.42.27,1.42.58s0,3.17,0,3.61V45.8c0,1,0,4.47,0,4.72-.06.5-.5.53-1.2.53h-.61a.17.17,0,0,0-.17.17v.61c0,.14.06.22.17.22s1.78-.08,2.72-.08c1.25,0,2.7.08,2.92.08s.16-.08.16-.19v-.67c0-.08,0-.14-.16-.14h-.42a1,1,0,0,1-1.19-1c0-.41,0-3.61,0-3.77Z" style="fill-rule:evenodd"/> <path d="M123.68,45.14c0-1.14-.06-2.89.08-4.17.06-.39.2-.58.89-.58h.28a.18.18,0,0,0,.17-.2v-.58c0-.17-.06-.22-.2-.22s-1.16.08-1.75.08c-.89,0-2.08-.08-2.27-.08s-.2,0-.2.14v.66c0,.14.06.2.2.2h.47a1,1,0,0,1,1,.5,13.43,13.43,0,0,1,.23,2.61c.05.89.08,1.75.08,3.33v1.83h-.11c-.33-.36-2.92-3.61-3.42-4.19s-3.77-4.72-3.86-4.83-.28-.23-.66-.23-.92.06-1.37.06-.75,0-1.11-.06l-.72,0a.16.16,0,0,0-.17.16v.67a.15.15,0,0,0,.17.17h.25a1.38,1.38,0,0,1,1.47,1.47v2.92c0,3.13-.05,5.11-.08,5.44a.85.85,0,0,1-.8.83h-.64c-.09,0-.12,0-.12.09v.72c0,.14,0,.19.09.19.22,0,1.47-.08,1.86-.08.8,0,1.92.08,2.11.08s.14,0,.14-.16v-.67c0-.11,0-.17-.14-.17H115c-.28,0-.59-.3-.67-.94-.06-.25-.17-3-.17-4.7v-3.8h.06c.44.5,2.69,3.5,3.36,4.28.31.36,1.5,1.77,2.78,3.3,1.14,1.36,2.08,2.5,2.28,2.7a1.23,1.23,0,0,0,.63.27c.34,0,.42-.27.42-.52Z" style="fill-rule:evenodd"/> <path d="M55.44,37.87H53.88c-.09,0-.13-.08-.1-.21l.07-.29c0-.13.16-.41.3-.41h1.53a10.68,10.68,0,0,1,2-3.78A3.61,3.61,0,0,1,60.25,32c1,0,1.59.61,1.59,1a.73.73,0,0,1-.71.81.69.69,0,0,1-.77-.7c0-.18-.19-.51-.72-.51-1.64,0-2,2.32-2.57,4.29,0,0,2.44.07,4.44.07S64.8,36.9,65,36.9s.26.08.26.18v.59c0,.12,0,.23-.2.23H63.86c-.72,0-1.07.23-1.07.66a4,4,0,0,0,.1.87c.15.92,1.1,4,1.56,5.39.3,1,1.79,5.37,2.37,6.93.59-1.2,2.59-6.47,2.79-7s1.23-3.63,1.61-4.76a5.39,5.39,0,0,0,.36-1.46c0-.3-.18-.58-.82-.58H70.1c-.11,0-.13-.08-.13-.23v-.59c0-.13,0-.18.15-.18s1.41.08,3,.08c1.86,0,2.5-.08,2.73-.08s.18.05.18.18v.64c0,.1,0,.18-.18.18h-.69a2.21,2.21,0,0,0-1.81,1c-.67.82-2.71,6.06-3.15,7.14-.3.84-3.6,9-3.73,9.22s-.23.34-.36.34-.3-.26-.43-.59c-.82-2.35-2.89-8.18-3.22-9.1L62.22,45c-.61-1.82-1.81-5.52-2.14-6.29-.26-.59-.52-.84-1-.84l-2.38,0c-.46,1.43-1.27,4.44-2.14,6.69-1.08,2.74-2.32,4.69-4.21,4.69a1.17,1.17,0,0,1-1.26-1,.74.74,0,0,1,.75-.75.91.91,0,0,1,.83.79.34.34,0,0,0,.3.29c.84,0,1.79-1.47,2.74-4.72Z"/> <path d="M126.94,22.89s0,0,.11,0a47.1,47.1,0,0,0,5,.2h1.12c.9,0,1.88,0,2.94-.08.53,0,3.8,0,4.46,0s2.5-.08,2.7-.08a.17.17,0,0,1,.19.19v.61c0,.11,0,.2-.19.2h-.42c-.5,0-.53.3-.42.47S145,28.34,145.4,29c.42-.69,2.72-4.05,2.83-4.28.22-.44.25-.8-.36-.8h-.44a.18.18,0,0,1-.2-.2v-.61a.18.18,0,0,1,.2-.19c.16,0,1.55.08,2.39.08.5,0,1.47-.08,1.63-.08s.2.05.2.22v.58c0,.14-.06.2-.17.2h-.28a2,2,0,0,0-1,.22,62,62,0,0,0-4.27,5.72v2.34c0,.69,0,1.44,0,1.77.06.59.5.61,1,.61h.36c.14,0,.2.06.2.14v.67c0,.11-.06.19-.23.19s-1.72-.08-2.63-.08c-.61,0-2.23.08-2.39.08s-.2-.05-.2-.22v-.61a.17.17,0,0,1,.17-.17h.42c.89,0,1-.16,1.08-.55s0-1.25,0-2.89v-1c-.25-.5-3.64-5.47-4.09-5.89a1.45,1.45,0,0,0-.87-.33c.16.76.38,1.74.47,2.22,0,.11,0,.17-.14.22l-.47.14c-.16.06-.25,0-.3-.11A7.58,7.58,0,0,0,137,24.26a15.12,15.12,0,0,0-3.23-.28v4.67c0,2.92,0,5,0,5.22,0,.45.19.72.64.72h1.05c.14,0,.2.09.2.25v.59c0,.08-.06.16-.2.16s-1.91-.08-2.83-.08-2.58.08-2.8.08-.23-.08-.23-.25v-.55c0-.14.06-.2.17-.2h1.11c.42,0,.61-.22.64-.44.08-1.06.08-2.53.08-4.19V24a14,14,0,0,0-3.11.25,6.36,6.36,0,0,0-1.64,2.14c-.06.11-.14.2-.25.14l-.5-.19c-.14-.06-.14-.17-.11-.28.16-.51.64-2.22.87-3.06,0,0,0-.07,0-.09"/> <path d="M136,46.28h3.78c-.11-.39-1.42-4.56-1.47-4.78s-.09-.28-.17-.28-.14.08-.22.31S136.18,46,136,46.28m-5.76-1.42v1.39c0,.16,0,3.36,0,3.77a1,1,0,0,0,1.2,1h.32a1.52,1.52,0,0,0,1.14-.58c.19-.22,1.61-3.56,2.27-4.94.2-.39,1.84-4.17,2-4.64.06-.17.23-.48,0-.56,0,0-.14-.19-.11-.28s0-.14.28-.19a3.91,3.91,0,0,0,1.55-.81.36.36,0,0,1,.34-.19c.16,0,.22.11.27.3.39,1.12,1.81,5.09,2.17,6.2a51.33,51.33,0,0,0,1.81,4.94,1.62,1.62,0,0,0,1.3.75h.53c.11,0,.14.09.14.17v.58c0,.09,0,.25-.2.25-.33,0-1.8-.08-2.44-.08s-2.17.08-2.53.08c-.19,0-.22-.14-.22-.25v-.58c0-.08,0-.17.14-.17h.44a.43.43,0,0,0,.45-.47c-.11-.56-.86-2.78-1.08-3.42h-4.48c-.11.34-1,2.64-1.11,3-.16.55-.08.91.5.91h.7c.16,0,.19.09.19.2v.61c0,.11,0,.19-.17.19S134,52,133.6,52H129c-.95,0-2.56.08-2.72.08s-.17-.08-.17-.22v-.61a.17.17,0,0,1,.17-.17h.61c.69,0,1.13,0,1.19-.53,0-.25.06-3.77.06-4.72V44.58c0-.44-.06-3.22-.06-3.61s-.25-.58-1.42-.58h-.49c-.14,0-.17-.09-.17-.2v-.64c0-.11,0-.16.17-.16s1.88.11,3.19.08c.8,0,2.22-.08,2.44-.08s.17,0,.17.14v.66c0,.11,0,.2-.17.2h-.47c-.75,0-1,.11-1,.69,0,.28,0,3.58,0,3.78"/> <path d="M79.57,23.12v.64a.17.17,0,0,1-.19.17h-.64c-.36,0-.78.05-.78.42a23.43,23.43,0,0,0,1.22,4c.22.69,1.25,3.92,1.42,4.36h.08c.17-.58,1.53-4,1.67-4.44,1.05-3.09,1.42-3.84,1.42-4.11s-.12-.28-.59-.28h-.3c-.11,0-.17-.06-.17-.2V23.1a.16.16,0,0,1,.17-.17c.16,0,1.61.08,2.25.08h4.24l6.22,0c.28,0,.64-.05.75-.05s.11.05.17.39.83,2.64.89,2.83,0,.17,0,.19l-.44.2c-.06,0-.17,0-.25-.11s-1.39-1.64-1.86-2.08a1.66,1.66,0,0,0-1.06-.42l-2.94-.06v4.72c.16,0,1.8-.08,2-.13.73-.2,1-.59,1-1.45,0-.11,0-.14.14-.14l.61,0c.11,0,.2.06.17.17s-.06,1.72-.06,2c0,.61.09,1.47.12,1.83,0,.11-.06.14-.14.14l-.59.06c-.08,0-.14,0-.16-.11-.14-.7-.31-1.14-1-1.31a10.1,10.1,0,0,0-2.08-.19v.94c0,1,.05,2.58.05,2.94,0,1.31.81,1.39,2,1.39A4.05,4.05,0,0,0,95.82,34a14.91,14.91,0,0,0,1.47-1.87c.14-.19.28-.22.36-.16l.44.25a.17.17,0,0,1,.09.19l-1,3c-.06.14-.2.27-.31.27s-1.66-.08-7.5-.08c-.5,0-2,.08-2.36.08-.14,0-.17-.08-.17-.19v-.64c0-.11.06-.17.2-.17h.25c1.3,0,1.39-.11,1.39-.5V28.18c0-1.47,0-3.28-.06-3.56-.08-.58-.25-.69-1.36-.69H86.6a1.61,1.61,0,0,0-1.17.42,30.33,30.33,0,0,0-2.3,4.88c-.25.59-2.53,6-2.75,6.39a.49.49,0,0,1-.45.22c-.22,0-.36-.19-.44-.41-.61-1.64-2.09-5.67-2.31-6.28L77,28.54c-.47-1.28-1.31-3.81-1.5-4.08a1,1,0,0,0-.81-.53h-.27c-.12,0-.14-.09-.14-.17v-.69c0-.09,0-.14.16-.14s1.67.08,2.39.08,2.36-.08,2.53-.08.22.05.22.19"/> </g> <g id="libletters"> <path d="M206.91,42.63c.06.06.06.12.06.31s-1.38,5.39-1.56,6.23c-.82,0-9.84-.09-13-.09-2.82,0-3.95.09-4.32.09s-.25-.06-.25-.28v-.72c0-.19,0-.25.19-.25h1.25c1.13,0,1.31-.44,1.31-.85,0-.56.13-8.39.13-10.27V35.05c0-2-.06-5.32-.13-5.86-.06-.81-.18-1.12-1-1.12h-1.31a.27.27,0,0,1-.25-.29v-.72c0-.18.06-.25.25-.25s1.44.1,4.32.1c3.38,0,4.7-.1,5-.1s.31.13.31.29v.72c0,.12-.06.25-.31.25h-1.7c-.93,0-1.06.31-1.06,1.15,0,.44-.13,5.14-.13,7.33v2.69c0,.57,0,7.33.13,8.68h1.75a52.38,52.38,0,0,0,5.26-.16c1.76-.25,3.76-4,4.2-5.2.13-.12.19-.18.38-.12Z"/> <path d="M214.91,38.93c0,.31.06,7.52.06,7.86,0,1,.5,1.13,1.26,1.13h1.31c.13,0,.25.06.25.22v.78c0,.19-.12.25-.31.25-.38,0-1.63-.09-4.57-.09-3.13,0-4.51.09-4.83.09s-.25-.06-.25-.22v-.84c0-.13.07-.19.25-.19h1.26c.62,0,1.31-.06,1.44-.91.06-.44.12-7.2.12-8.89V35.93c0-.76-.06-6.39-.09-6.8-.1-.75-.41-1.06-1.28-1.06H207.9c-.19,0-.25-.07-.25-.22V27c0-.15.06-.22.18-.22.38,0,2,.1,5.08.1s4-.1,4.44-.1c.19,0,.25.13.25.29v.72a.23.23,0,0,1-.25.25h-1.19c-.69,0-1.19.25-1.19.84,0,.31-.06,7.2-.06,7.58Z"/> <path d="M223.33,35.42c0-1.12-.06-4.94-.1-5.47-.09-1.82-.59-1.88-1.78-1.88h-1c-.19,0-.25-.07-.25-.25V27.1c0-.19.06-.29.25-.29.44,0,1.94.13,4.57.1,1,0,2.88-.1,4.57-.1,2.38,0,4.39.22,5.51.85a4.35,4.35,0,0,1,2.38,4.26c0,2.5-1.31,4-4.26,5.1v.16c3.57.94,5.64,2.82,5.64,6.14,0,1.69-.94,3.94-2.44,4.76-1.32.75-3.32,1.09-6.83,1.09-1.25,0-3.32-.09-4.57-.09-2.44,0-3.76.09-4.42.09-.12,0-.21-.09-.21-.25v-.78a.19.19,0,0,1,.21-.22H222c.94,0,1.16-.38,1.25-1.35.07-.75.13-4.88.13-7.45Zm3.82,1.32c.5,0,.94,0,1.44,0a5.47,5.47,0,0,0,3.32-.91,4.52,4.52,0,0,0,1.63-3.69,3.92,3.92,0,0,0-1.38-3.2,6.55,6.55,0,0,0-3.57-1.09,4.65,4.65,0,0,0-.94.06.62.62,0,0,0-.41.5c0,.6-.09,3.29-.09,5.92Zm2.69,11.43c2.44,0,4.7-1.16,4.7-5a4.84,4.84,0,0,0-3-4.88,9.06,9.06,0,0,0-3.57-.57h-.81V44C227.15,47,227.84,48.17,229.84,48.17Z"/> <path d="M285,47.92h-1a2.37,2.37,0,0,1-2-1.44c-.44-.85-2.44-6.67-3.2-9.11-.56-2-3-9-3.56-11-.07-.19-.19-.57-.38-.57s-.28.13-.47.32a10.36,10.36,0,0,1-3.1,1.56c-.25.06-.31.19-.31.31a.7.7,0,0,0,.18.38c.19.19,0,.75-.06,1.07L268,37.68c-.94,2.63-3.19,8.27-3.5,8.83a2.77,2.77,0,0,1-2.46,1.41,3.27,3.27,0,0,1-1.85-.53,36.32,36.32,0,0,1-2.66-3.57c-.25-.38-2.19-3.32-2.56-3.82a4.07,4.07,0,0,0-1.88-1.44v-.13c3.44-.56,5.82-2.19,5.82-6.14a4.77,4.77,0,0,0-1.69-3.5,8.39,8.39,0,0,0-5.7-2c-.94,0-3.82.1-5.57.1-3.07,0-4.07-.1-4.29-.1s-.22.07-.22.22v.85c0,.12.06.19.22.19h1.22c.56,0,1,.5,1,1.56v8.24c0,2.94,0,5.88-.06,9,0,.84-.5,1-1.19,1h-1.07c-.12,0-.18.09-.18.25v.72c0,.19.06.28.25.28s1.06-.09,4.13-.09c3.26,0,3.88.09,4.29.09.25,0,.34-.06.34-.28v-.75c0-.13-.06-.22-.25-.22h-1.56c-.5,0-.72-.57-.82-1.19-.06-.47-.12-4-.12-5.86V39.18l1-.06c1.31,0,2,.85,2.82,1.94.5.69,1.38,2.13,1.69,2.69s1.5,2.76,2.07,3.64a8.28,8.28,0,0,0,1.37,1.78c.69,0,1.88-.09,2.76-.09H265c2.19,0,3.5.09,3.94.09.19,0,.25-.12.25-.31v-.78c0-.1-.06-.16-.31-.16h-1.31c-.63,0-1.13-.35-1.13-.75a2.81,2.81,0,0,1,.06-.66c.16-.85,1.69-5.32,1.94-6h7.27c.37,1.15,1.62,5.16,1.88,6.29.18.85-.07,1.16-.94,1.16h-.82c-.19,0-.25.06-.25.25v.63c0,.18.06.37.31.37.69,0,1.76-.09,4.39-.09,3.44,0,4.07.09,4.63.09.25,0,.32-.19.32-.37v-.66C285.24,48,285.17,47.92,285,47.92ZM248.9,38.18a8.88,8.88,0,0,1-1.19-.12l.06-9a1.08,1.08,0,0,1,.38-.91,2.17,2.17,0,0,1,1.13-.19,6,6,0,0,1,4.13,1.35,4.93,4.93,0,0,1,1.38,3.5A5.48,5.48,0,0,1,248.9,38.18Zm20,1c.22-.72,3-8.42,3.16-8.83s.22-.4.41-.4.19.18.31.56c.19.63,2.32,7.77,2.63,8.67Z"/> <path d="M292.58,40.87c0,1.88.06,5.39.12,5.86.1.62.32,1.19.82,1.19h1.56c.19,0,.25.09.25.22v.75c0,.22-.09.28-.34.28-.41,0-1-.09-4.29-.09-3.07,0-3.82.09-4.13.09s-.25-.09-.25-.28v-.72c0-.16.06-.25.18-.25h1.07c.69,0,1.19-.19,1.19-1,.06-3.14.06-6.08.06-9V29.63c0-1.06-.44-1.56-1-1.56H286.6c-.16,0-.22-.07-.22-.19V27c0-.15.06-.22.22-.22s1.22.1,4.29.1c1.75,0,4.63-.1,5.57-.1a8.39,8.39,0,0,1,5.7,2,4.77,4.77,0,0,1,1.69,3.5c0,4-2.38,5.58-5.82,6.14v.13A4.07,4.07,0,0,1,299.91,40c.37.5,2.31,3.44,2.56,3.82s2.2,3.13,2.67,3.57a3.28,3.28,0,0,0,2.22.59c.19,0,.25.1.25.22v.66c0,.22-.06.31-.25.31s-1.07-.09-3.07-.09c-.88,0-2.07.06-2.76.09a8.28,8.28,0,0,1-1.37-1.78c-.57-.88-1.79-3.14-2.07-3.64s-1.19-2-1.69-2.69c-.78-1.09-1.5-1.94-2.82-1.94l-1,.06Zm.06-2.81a9,9,0,0,0,1.19.12,5.48,5.48,0,0,0,5.89-5.39,4.93,4.93,0,0,0-1.38-3.5,6,6,0,0,0-4.13-1.35,2.19,2.19,0,0,0-1.13.19,1.08,1.08,0,0,0-.38.91Z"/> <path d="M317.91,43.25c0,1.19.06,3.26.09,3.6.09,1,.59,1.07,1.22,1.07h1a.2.2,0,0,1,.22.22v.72c0,.22-.06.31-.22.31-.34,0-1.59-.09-4.41-.09-3.07,0-4.07.09-4.35.09s-.22-.12-.22-.28v-.72c0-.13.06-.25.22-.25h1.28c.81,0,1.06-.31,1.1-.78s.09-2.89.09-5.83v-1.5c-.5-.94-5.57-10-6.45-11a2.26,2.26,0,0,0-1.57-.69h-.56c-.19,0-.25-.07-.25-.22V27c0-.12.06-.19.25-.19s1.75.1,4.13.1c3.2,0,4.32-.1,4.64-.1s.25.07.25.22v.72c0,.19-.06.32-.25.32h-.82c-.69,0-.94.25-.87.9s3.82,7.52,4.66,9.27c1.07-1.75,5.11-8.26,5.17-9,.06-.56-.13-1.12-1.07-1.12h-.81a.22.22,0,0,1-.25-.25V27c0-.15.06-.22.19-.22.31,0,1.63.1,3.82.1,2,0,2.69-.1,3-.1s.25.07.25.22v.72c0,.19-.06.32-.25.32h-.69a2.46,2.46,0,0,0-1.69.72c-.5.56-5.7,8.58-6.88,10.64Z"/> </g> </g> </svg> `),
        this._dark
      );
    }
  }
);
let Ri;
var Ui = K(
  Ri ||
    (Ri = ((e) => e)`
@import url("https://use.typekit.net/tgy5tlj.css");:host{display:block;margin:0;padding:0;width:100%}header{align-items:center;background-color:#232d4b;display:flex;flex-direction:column;height:60px;margin:0;padding:0}#container{max-width:1200px;width:100%}
/*# sourceMappingURL=src/UvalibHeader.css.map */
`)
);
let Di,
  Hi = (e) => e;
customElements.define(
  "uvalib-header",
  class extends Y {
    static get styles() {
      return [Ui];
    }
    static get properties() {
      return { homelink: { type: String }, simple: { type: Boolean } };
    }
    constructor() {
      super(), (this.homelink = "https://library.virginia.edu");
    }
    render() {
      return R(
        Di ||
          (Di = Hi` <header> <div id="container"> <a href="${0}"><uvalib-logos>University of Virginia Library</uvalib-logos></a> </div> </header> `),
        this.homelink
      );
    }
  }
);
let $i,
  Bi,
  Ii,
  ji = (e) => e;
customElements.define(
  "uvalib-catalog-light",
  class extends Y {
    static get properties() {
      return { pools: { type: Object } };
    }
    static get styles() {
      return [ee, K($i || ($i = ji``))];
    }
    constructor() {
      super(),
        (this.catalog = new me({ devMode: !0 })),
        (this.pools = []),
        this.catalog.poolsPromise.then((e) => {
          this.pools = this.catalog.lastPools;
        });
    }
    render() {
      return R(
        Bi ||
          (Bi = ji` <uvalib-header></uvalib-header> <main> <h1>UVA Library Catalog Light</h1> <ul> ${0} </ul> <lion-input> <label slot="label">Search Virgo for books, articles, and more.</label> </lion-input> </main> `),
        this.pools.map((e) => R(Ii || (Ii = ji`<li>${0}</li>`), e.name))
      );
    }
  }
);
