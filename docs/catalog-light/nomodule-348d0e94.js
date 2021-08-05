System.register(["./nomodule-df367cf3.js"], function (e, t) {
  var n,
    i,
    a,
    r,
    o,
    s,
    l,
    u,
    c,
    d,
    h,
    p,
    f,
    v,
    y,
    m,
    g,
    _,
    b,
    k,
    w,
    x,
    S,
    C,
    E,
    N,
    T,
    V,
    P,
    M,
    A,
    L,
    O,
    F,
    R,
    U,
    D,
    H,
    B,
    I,
    j,
    z,
    q,
    $,
    Z,
    W,
    G,
    J,
    K,
    Q,
    Y,
    X,
    ee,
    te,
    ne,
    ie,
    ae,
    re,
    oe,
    se,
    le,
    ue,
    ce,
    de,
    he,
    pe,
    fe,
    ve,
    ye,
    me,
    ge,
    _e,
    be,
    ke,
    we,
    xe,
    Se,
    Ce,
    Ee,
    Ne,
    Te,
    Ve,
    Pe,
    Me,
    Ae,
    Le,
    Oe,
    Fe,
    Re,
    Ue,
    De,
    He,
    Be,
    Ie,
    je,
    ze,
    qe,
    $e,
    Ze,
    We,
    Ge,
    Je,
    Ke,
    Qe,
    Ye,
    Xe,
    et,
    tt,
    nt,
    it,
    at,
    rt,
    ot,
    st,
    lt,
    ut,
    ct,
    dt,
    ht,
    pt,
    ft,
    vt,
    yt,
    mt,
    gt,
    _t,
    bt,
    kt,
    wt,
    xt,
    St,
    Ct,
    Et,
    Nt,
    Tt,
    Vt,
    Pt,
    Mt,
    At,
    Lt,
    Ot,
    Ft,
    Rt,
    Ut,
    Dt,
    Ht,
    Bt,
    It,
    jt,
    zt,
    qt,
    $t,
    Zt,
    Wt,
    Gt,
    Jt,
    Kt,
    Qt,
    Yt,
    Xt,
    en,
    tn,
    nn,
    an,
    rn,
    on,
    sn,
    ln,
    un,
    cn,
    dn,
    hn,
    pn,
    fn,
    vn,
    yn,
    mn,
    gn,
    _n,
    bn,
    kn,
    wn,
    xn,
    Sn,
    Cn,
    En,
    Nn,
    Tn,
    Vn,
    Pn,
    Mn,
    An,
    Ln,
    On,
    Fn,
    Rn,
    Un,
    Dn,
    Hn,
    Bn,
    In,
    jn,
    zn,
    qn,
    $n,
    Zn,
    Wn,
    Gn,
    Jn,
    Kn,
    Qn,
    Yn,
    Xn,
    ei,
    ti,
    ni,
    ii,
    ai,
    ri,
    oi,
    si,
    li,
    ui,
    ci,
    di,
    hi,
    pi,
    fi,
    vi,
    yi,
    mi,
    gi,
    _i,
    bi,
    ki,
    wi,
    xi,
    Si,
    Ci,
    Ei,
    Ni,
    Ti,
    Vi,
    Pi,
    Mi,
    Ai;
  function Li(e, t) {
    for (
      var n = e.element.content,
        i = e.parts,
        a = document.createTreeWalker(n, X, null, !1),
        r = te(i),
        o = i[r],
        s = -1,
        l = 0,
        u = [],
        c = null;
      a.nextNode();

    ) {
      s++;
      var d = a.currentNode;
      for (
        d.previousSibling === c && (c = null),
          t.has(d) && (u.push(d), null === c && (c = d)),
          null !== c && l++;
        void 0 !== o && o.index === s;

      )
        (o.index = null !== c ? -1 : o.index - l), (o = i[(r = te(i, r))]);
    }
    u.forEach(function (e) {
      return e.parentNode.removeChild(e);
    });
  }
  function Oi(e) {
    var t = ke.get(e.type);
    void 0 === t &&
      ((t = { stringsArray: new WeakMap(), keyString: new Map() }),
      ke.set(e.type, t));
    var n = t.stringsArray.get(e.strings);
    if (void 0 !== n) return n;
    var i = e.strings.join(q);
    return (
      void 0 === (n = t.keyString.get(i)) &&
        ((n = new G(e, e.getTemplateElement())), t.keyString.set(i, n)),
      t.stringsArray.set(e.strings, n),
      n
    );
  }
  function Fi(e, t, n) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function Ri(e, t) {
    return (function (e, t) {
      if (t.get) return t.get.call(e);
      return t.value;
    })(e, Di(e, t, "get"));
  }
  function Ui(e, t, n) {
    return (
      (function (e, t, n) {
        if (t.set) t.set.call(e, n);
        else {
          if (!t.writable)
            throw new TypeError("attempted to set read only private field");
          t.value = n;
        }
      })(e, Di(e, t, "set"), n),
      n
    );
  }
  function Di(e, t, n) {
    if (!t.has(e))
      throw new TypeError(
        "attempted to " + n + " private field on non-instance"
      );
    return t.get(e);
  }
  function Hi(e) {
    return Object.assign.apply(
      Object,
      [{}].concat(
        r(
          e.map(function (e) {
            return v({}, e.id, e);
          })
        )
      )
    );
  }
  function Bi(e, t) {
    var n,
      i,
      a,
      r,
      o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : e,
      s = arguments.length > 3 ? arguments[3] : void 0;
    if (t === qt) return t;
    var l =
        void 0 !== s
          ? null === (n = o.Σi) || void 0 === n
            ? void 0
            : n[s]
          : o.Σo,
      u = Lt(t) ? void 0 : t._$litDirective$;
    return (
      (null == l ? void 0 : l.constructor) !== u &&
        (null === (i = null == l ? void 0 : l.O) ||
          void 0 === i ||
          i.call(l, !1),
        void 0 === u ? (l = void 0) : (l = new u(e)).T(e, o, s),
        void 0 !== s
          ? ((null !== (a = (r = o).Σi) && void 0 !== a ? a : (r.Σi = []))[s] =
              l)
          : (o.Σo = l)),
      void 0 !== l && (t = Bi(e, l.S(e, t.values), l, s)),
      t
    );
  }
  function Ii(e) {
    return function (t) {
      if (
        (function (e, t) {
          for (var n = t; n; ) {
            if (hn.get(n) === e) return !0;
            n = Object.getPrototypeOf(n);
          }
          return !1;
        })(e, t)
      )
        return t;
      var n = e(t);
      return hn.set(n, e), n;
    };
  }
  function ji() {
    var e =
        arguments.length > 0 && void 0 !== arguments[0]
          ? arguments[0]
          : "google-chrome",
      t = window.chrome;
    if ("chromium" === e) return t;
    var n = window.navigator,
      i = n.vendor,
      a = void 0 !== window.opr,
      r = n.userAgent.indexOf("Edge") > -1,
      o = n.userAgent.match("CriOS");
    return "ios" === e
      ? o
      : "google-chrome" === e
      ? null != t && "Google Inc." === i && !1 === a && !1 === r
      : void 0;
  }
  function zi(e, t) {
    return e((t = { exports: {} }), t.exports), t.exports;
  }
  function qi(e, t, n) {
    if (!(this instanceof qi) || ii.has(this))
      throw new TypeError(
        "calling MessageFormat constructor without new is invalid"
      );
    var i = ti(e);
    ii.set(this, {
      ast: i,
      format: ei(i, t, n && n.types),
      locale: qi.supportedLocalesOf(t)[0] || "en",
      locales: t,
      options: n,
    });
  }
  function $i() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
    return e
      .filter(function (e) {
        return !t.includes(e);
      })
      .concat(
        t.filter(function (t) {
          return !e.includes(t);
        })
      );
  }
  return {
    setters: [
      function (e) {
        (n = e.classCallCheck),
          (i = e.createClass),
          (a = e.createForOfIteratorHelper),
          (r = e.toConsumableArray),
          (o = e.typeof),
          (s = e.createSuper),
          (l = e.inherits),
          (u = e.getPrototypeOf),
          (c = e.get),
          (d = e.wrapNativeSuper),
          (h = e.asyncToGenerator),
          (p = e.regeneratorRuntime),
          (f = e.taggedTemplateLiteral),
          (v = e.defineProperty),
          (y = e.objectSpread2),
          (m = e.slicedToArray),
          (g = e.assertThisInitialized);
      },
    ],
    execute: function () {
      (j =
        "undefined" != typeof window &&
        null != window.customElements &&
        void 0 !== window.customElements.polyfillWrapFlushCallback),
        (z = function (e, t) {
          for (
            var n =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : null;
            t !== n;

          ) {
            var i = t.nextSibling;
            e.removeChild(t), (t = i);
          }
        }),
        (q = "{{lit-".concat(String(Math.random()).slice(2), "}}")),
        ($ = "\x3c!--".concat(q, "--\x3e")),
        (Z = new RegExp("".concat(q, "|").concat($))),
        (W = "$lit$"),
        (G = function e(t, i) {
          n(this, e), (this.parts = []), (this.element = i);
          for (
            var a = [],
              r = [],
              o = document.createTreeWalker(i.content, 133, null, !1),
              s = 0,
              l = -1,
              u = 0,
              c = t.strings,
              d = t.values.length;
            u < d;

          ) {
            var h = o.nextNode();
            if (null !== h) {
              if ((l++, 1 === h.nodeType)) {
                if (h.hasAttributes()) {
                  for (
                    var p = h.attributes, f = p.length, v = 0, y = 0;
                    y < f;
                    y++
                  )
                    J(p[y].name, W) && v++;
                  for (; v-- > 0; ) {
                    var m = c[u],
                      g = Y.exec(m)[2],
                      _ = g.toLowerCase() + W,
                      b = h.getAttribute(_);
                    h.removeAttribute(_);
                    var k = b.split(Z);
                    this.parts.push({
                      type: "attribute",
                      index: l,
                      name: g,
                      strings: k,
                    }),
                      (u += k.length - 1);
                  }
                }
                "TEMPLATE" === h.tagName &&
                  (r.push(h), (o.currentNode = h.content));
              } else if (3 === h.nodeType) {
                var w = h.data;
                if (w.indexOf(q) >= 0) {
                  for (
                    var x = h.parentNode,
                      S = w.split(Z),
                      C = S.length - 1,
                      E = 0;
                    E < C;
                    E++
                  ) {
                    var N = void 0,
                      T = S[E];
                    if ("" === T) N = Q();
                    else {
                      var V = Y.exec(T);
                      null !== V &&
                        J(V[2], W) &&
                        (T =
                          T.slice(0, V.index) +
                          V[1] +
                          V[2].slice(0, -W.length) +
                          V[3]),
                        (N = document.createTextNode(T));
                    }
                    x.insertBefore(N, h),
                      this.parts.push({ type: "node", index: ++l });
                  }
                  "" === S[C]
                    ? (x.insertBefore(Q(), h), a.push(h))
                    : (h.data = S[C]),
                    (u += C);
                }
              } else if (8 === h.nodeType)
                if (h.data === q) {
                  var P = h.parentNode;
                  (null !== h.previousSibling && l !== s) ||
                    (l++, P.insertBefore(Q(), h)),
                    (s = l),
                    this.parts.push({ type: "node", index: l }),
                    null === h.nextSibling ? (h.data = "") : (a.push(h), l--),
                    u++;
                } else
                  for (var M = -1; -1 !== (M = h.data.indexOf(q, M + 1)); )
                    this.parts.push({ type: "node", index: -1 }), u++;
            } else o.currentNode = r.pop();
          }
          for (var A = 0, L = a; A < L.length; A++) {
            var O = L[A];
            O.parentNode.removeChild(O);
          }
        }),
        (J = function (e, t) {
          var n = e.length - t.length;
          return n >= 0 && e.slice(n) === t;
        }),
        (K = function (e) {
          return -1 !== e.index;
        }),
        (Q = function () {
          return document.createComment("");
        }),
        (Y =
          /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/),
        (X = 133),
        (ee = function (e) {
          for (
            var t = 11 === e.nodeType ? 0 : 1,
              n = document.createTreeWalker(e, X, null, !1);
            n.nextNode();

          )
            t++;
          return t;
        }),
        (te = function (e) {
          for (
            var t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : -1,
              n = t + 1;
            n < e.length;
            n++
          ) {
            var i = e[n];
            if (K(i)) return n;
          }
          return -1;
        }),
        (ne = new WeakMap()),
        (ie = function (e) {
          return "function" == typeof e && ne.has(e);
        }),
        (ae = {}),
        (re = {}),
        (oe = (function () {
          function e(t, i, a) {
            n(this, e),
              (this.__parts = []),
              (this.template = t),
              (this.processor = i),
              (this.options = a);
          }
          return (
            i(e, [
              {
                key: "update",
                value: function (e) {
                  var t,
                    n = 0,
                    i = a(this.__parts);
                  try {
                    for (i.s(); !(t = i.n()).done; ) {
                      var r = t.value;
                      void 0 !== r && r.setValue(e[n]), n++;
                    }
                  } catch (e) {
                    i.e(e);
                  } finally {
                    i.f();
                  }
                  var o,
                    s = a(this.__parts);
                  try {
                    for (s.s(); !(o = s.n()).done; ) {
                      var l = o.value;
                      void 0 !== l && l.commit();
                    }
                  } catch (e) {
                    s.e(e);
                  } finally {
                    s.f();
                  }
                },
              },
              {
                key: "_clone",
                value: function () {
                  for (
                    var e,
                      t = j
                        ? this.template.element.content.cloneNode(!0)
                        : document.importNode(
                            this.template.element.content,
                            !0
                          ),
                      n = [],
                      i = this.template.parts,
                      a = document.createTreeWalker(t, 133, null, !1),
                      o = 0,
                      s = 0,
                      l = a.nextNode();
                    o < i.length;

                  )
                    if (((e = i[o]), K(e))) {
                      for (; s < e.index; )
                        s++,
                          "TEMPLATE" === l.nodeName &&
                            (n.push(l), (a.currentNode = l.content)),
                          null === (l = a.nextNode()) &&
                            ((a.currentNode = n.pop()), (l = a.nextNode()));
                      if ("node" === e.type) {
                        var u = this.processor.handleTextExpression(
                          this.options
                        );
                        u.insertAfterNode(l.previousSibling),
                          this.__parts.push(u);
                      } else {
                        var c;
                        (c = this.__parts).push.apply(
                          c,
                          r(
                            this.processor.handleAttributeExpressions(
                              l,
                              e.name,
                              e.strings,
                              this.options
                            )
                          )
                        );
                      }
                      o++;
                    } else this.__parts.push(void 0), o++;
                  return (
                    j && (document.adoptNode(t), customElements.upgrade(t)), t
                  );
                },
              },
            ]),
            e
          );
        })()),
        (se =
          window.trustedTypes &&
          trustedTypes.createPolicy("lit-html", {
            createHTML: function (e) {
              return e;
            },
          })),
        (le = " ".concat(q, " ")),
        (ue = (function () {
          function e(t, i, a, r) {
            n(this, e),
              (this.strings = t),
              (this.values = i),
              (this.type = a),
              (this.processor = r);
          }
          return (
            i(e, [
              {
                key: "getHTML",
                value: function () {
                  for (
                    var e = this.strings.length - 1, t = "", n = !1, i = 0;
                    i < e;
                    i++
                  ) {
                    var a = this.strings[i],
                      r = a.lastIndexOf("\x3c!--");
                    n = (r > -1 || n) && -1 === a.indexOf("--\x3e", r + 1);
                    var o = Y.exec(a);
                    t +=
                      null === o
                        ? a + (n ? le : $)
                        : a.substr(0, o.index) + o[1] + o[2] + W + o[3] + q;
                  }
                  return (t += this.strings[e]);
                },
              },
              {
                key: "getTemplateElement",
                value: function () {
                  var e = document.createElement("template"),
                    t = this.getHTML();
                  return (
                    void 0 !== se && (t = se.createHTML(t)),
                    (e.innerHTML = t),
                    e
                  );
                },
              },
            ]),
            e
          );
        })()),
        (ce = function (e) {
          return null === e || !("object" === o(e) || "function" == typeof e);
        }),
        (de = function (e) {
          return Array.isArray(e) || !(!e || !e[Symbol.iterator]);
        }),
        (he = (function () {
          function e(t, i, a) {
            n(this, e),
              (this.dirty = !0),
              (this.element = t),
              (this.name = i),
              (this.strings = a),
              (this.parts = []);
            for (var r = 0; r < a.length - 1; r++)
              this.parts[r] = this._createPart();
          }
          return (
            i(e, [
              {
                key: "_createPart",
                value: function () {
                  return new pe(this);
                },
              },
              {
                key: "_getValue",
                value: function () {
                  var e = this.strings,
                    t = e.length - 1,
                    n = this.parts;
                  if (1 === t && "" === e[0] && "" === e[1]) {
                    var i = n[0].value;
                    if ("symbol" === o(i)) return String(i);
                    if ("string" == typeof i || !de(i)) return i;
                  }
                  for (var r = "", s = 0; s < t; s++) {
                    r += e[s];
                    var l = n[s];
                    if (void 0 !== l) {
                      var u = l.value;
                      if (ce(u) || !de(u))
                        r += "string" == typeof u ? u : String(u);
                      else {
                        var c,
                          d = a(u);
                        try {
                          for (d.s(); !(c = d.n()).done; ) {
                            var h = c.value;
                            r += "string" == typeof h ? h : String(h);
                          }
                        } catch (e) {
                          d.e(e);
                        } finally {
                          d.f();
                        }
                      }
                    }
                  }
                  return (r += e[t]);
                },
              },
              {
                key: "commit",
                value: function () {
                  this.dirty &&
                    ((this.dirty = !1),
                    this.element.setAttribute(this.name, this._getValue()));
                },
              },
            ]),
            e
          );
        })()),
        (pe = (function () {
          function e(t) {
            n(this, e), (this.value = void 0), (this.committer = t);
          }
          return (
            i(e, [
              {
                key: "setValue",
                value: function (e) {
                  e === ae ||
                    (ce(e) && e === this.value) ||
                    ((this.value = e), ie(e) || (this.committer.dirty = !0));
                },
              },
              {
                key: "commit",
                value: function () {
                  for (; ie(this.value); ) {
                    var e = this.value;
                    (this.value = ae), e(this);
                  }
                  this.value !== ae && this.committer.commit();
                },
              },
            ]),
            e
          );
        })()),
        (fe = (function () {
          function e(t) {
            n(this, e),
              (this.value = void 0),
              (this.__pendingValue = void 0),
              (this.options = t);
          }
          return (
            i(e, [
              {
                key: "appendInto",
                value: function (e) {
                  (this.startNode = e.appendChild(Q())),
                    (this.endNode = e.appendChild(Q()));
                },
              },
              {
                key: "insertAfterNode",
                value: function (e) {
                  (this.startNode = e), (this.endNode = e.nextSibling);
                },
              },
              {
                key: "appendIntoPart",
                value: function (e) {
                  e.__insert((this.startNode = Q())),
                    e.__insert((this.endNode = Q()));
                },
              },
              {
                key: "insertAfterPart",
                value: function (e) {
                  e.__insert((this.startNode = Q())),
                    (this.endNode = e.endNode),
                    (e.endNode = this.startNode);
                },
              },
              {
                key: "setValue",
                value: function (e) {
                  this.__pendingValue = e;
                },
              },
              {
                key: "commit",
                value: function () {
                  if (null !== this.startNode.parentNode) {
                    for (; ie(this.__pendingValue); ) {
                      var e = this.__pendingValue;
                      (this.__pendingValue = ae), e(this);
                    }
                    var t = this.__pendingValue;
                    t !== ae &&
                      (ce(t)
                        ? t !== this.value && this.__commitText(t)
                        : t instanceof ue
                        ? this.__commitTemplateResult(t)
                        : t instanceof Node
                        ? this.__commitNode(t)
                        : de(t)
                        ? this.__commitIterable(t)
                        : t === re
                        ? ((this.value = re), this.clear())
                        : this.__commitText(t));
                  }
                },
              },
              {
                key: "__insert",
                value: function (e) {
                  this.endNode.parentNode.insertBefore(e, this.endNode);
                },
              },
              {
                key: "__commitNode",
                value: function (e) {
                  this.value !== e &&
                    (this.clear(), this.__insert(e), (this.value = e));
                },
              },
              {
                key: "__commitText",
                value: function (e) {
                  var t = this.startNode.nextSibling,
                    n =
                      "string" == typeof (e = null == e ? "" : e)
                        ? e
                        : String(e);
                  t === this.endNode.previousSibling && 3 === t.nodeType
                    ? (t.data = n)
                    : this.__commitNode(document.createTextNode(n)),
                    (this.value = e);
                },
              },
              {
                key: "__commitTemplateResult",
                value: function (e) {
                  var t = this.options.templateFactory(e);
                  if (this.value instanceof oe && this.value.template === t)
                    this.value.update(e.values);
                  else {
                    var n = new oe(t, e.processor, this.options),
                      i = n._clone();
                    n.update(e.values), this.__commitNode(i), (this.value = n);
                  }
                },
              },
              {
                key: "__commitIterable",
                value: function (t) {
                  Array.isArray(this.value) ||
                    ((this.value = []), this.clear());
                  var n,
                    i,
                    r = this.value,
                    o = 0,
                    s = a(t);
                  try {
                    for (s.s(); !(i = s.n()).done; ) {
                      var l = i.value;
                      void 0 === (n = r[o]) &&
                        ((n = new e(this.options)),
                        r.push(n),
                        0 === o
                          ? n.appendIntoPart(this)
                          : n.insertAfterPart(r[o - 1])),
                        n.setValue(l),
                        n.commit(),
                        o++;
                    }
                  } catch (e) {
                    s.e(e);
                  } finally {
                    s.f();
                  }
                  o < r.length && ((r.length = o), this.clear(n && n.endNode));
                },
              },
              {
                key: "clear",
                value: function () {
                  var e =
                    arguments.length > 0 && void 0 !== arguments[0]
                      ? arguments[0]
                      : this.startNode;
                  z(this.startNode.parentNode, e.nextSibling, this.endNode);
                },
              },
            ]),
            e
          );
        })()),
        (ve = (function () {
          function e(t, i, a) {
            if (
              (n(this, e),
              (this.value = void 0),
              (this.__pendingValue = void 0),
              2 !== a.length || "" !== a[0] || "" !== a[1])
            )
              throw new Error(
                "Boolean attributes can only contain a single expression"
              );
            (this.element = t), (this.name = i), (this.strings = a);
          }
          return (
            i(e, [
              {
                key: "setValue",
                value: function (e) {
                  this.__pendingValue = e;
                },
              },
              {
                key: "commit",
                value: function () {
                  for (; ie(this.__pendingValue); ) {
                    var e = this.__pendingValue;
                    (this.__pendingValue = ae), e(this);
                  }
                  if (this.__pendingValue !== ae) {
                    var t = !!this.__pendingValue;
                    this.value !== t &&
                      (t
                        ? this.element.setAttribute(this.name, "")
                        : this.element.removeAttribute(this.name),
                      (this.value = t)),
                      (this.__pendingValue = ae);
                  }
                },
              },
            ]),
            e
          );
        })()),
        (ye = (function (e) {
          l(a, e);
          var t = s(a);
          function a(e, i, r) {
            var o;
            return (
              n(this, a),
              ((o = t.call(this, e, i, r)).single =
                2 === r.length && "" === r[0] && "" === r[1]),
              o
            );
          }
          return (
            i(a, [
              {
                key: "_createPart",
                value: function () {
                  return new me(this);
                },
              },
              {
                key: "_getValue",
                value: function () {
                  return this.single
                    ? this.parts[0].value
                    : c(u(a.prototype), "_getValue", this).call(this);
                },
              },
              {
                key: "commit",
                value: function () {
                  this.dirty &&
                    ((this.dirty = !1),
                    (this.element[this.name] = this._getValue()));
                },
              },
            ]),
            a
          );
        })(he)),
        (me = (function (e) {
          l(i, e);
          var t = s(i);
          function i() {
            return n(this, i), t.apply(this, arguments);
          }
          return i;
        })(pe)),
        (ge = !1),
        (function () {
          try {
            var e = {
              get capture() {
                return (ge = !0), !1;
              },
            };
            window.addEventListener("test", e, e),
              window.removeEventListener("test", e, e);
          } catch (e) {}
        })(),
        (_e = (function () {
          function e(t, i, a) {
            var r = this;
            n(this, e),
              (this.value = void 0),
              (this.__pendingValue = void 0),
              (this.element = t),
              (this.eventName = i),
              (this.eventContext = a),
              (this.__boundHandleEvent = function (e) {
                return r.handleEvent(e);
              });
          }
          return (
            i(e, [
              {
                key: "setValue",
                value: function (e) {
                  this.__pendingValue = e;
                },
              },
              {
                key: "commit",
                value: function () {
                  for (; ie(this.__pendingValue); ) {
                    var e = this.__pendingValue;
                    (this.__pendingValue = ae), e(this);
                  }
                  if (this.__pendingValue !== ae) {
                    var t = this.__pendingValue,
                      n = this.value,
                      i =
                        null == t ||
                        (null != n &&
                          (t.capture !== n.capture ||
                            t.once !== n.once ||
                            t.passive !== n.passive)),
                      a = null != t && (null == n || i);
                    i &&
                      this.element.removeEventListener(
                        this.eventName,
                        this.__boundHandleEvent,
                        this.__options
                      ),
                      a &&
                        ((this.__options = be(t)),
                        this.element.addEventListener(
                          this.eventName,
                          this.__boundHandleEvent,
                          this.__options
                        )),
                      (this.value = t),
                      (this.__pendingValue = ae);
                  }
                },
              },
              {
                key: "handleEvent",
                value: function (e) {
                  "function" == typeof this.value
                    ? this.value.call(this.eventContext || this.element, e)
                    : this.value.handleEvent(e);
                },
              },
            ]),
            e
          );
        })()),
        (be = function (e) {
          return (
            e &&
            (ge
              ? { capture: e.capture, passive: e.passive, once: e.once }
              : e.capture)
          );
        }),
        (ke = new Map()),
        (we = new WeakMap()),
        (xe = function (e, t, n) {
          var i = we.get(t);
          void 0 === i &&
            (z(t, t.firstChild),
            we.set(t, (i = new fe(Object.assign({ templateFactory: Oi }, n)))),
            i.appendInto(t)),
            i.setValue(e),
            i.commit();
        }),
        (Se = new ((function () {
          function e() {
            n(this, e);
          }
          return (
            i(e, [
              {
                key: "handleAttributeExpressions",
                value: function (e, t, n, i) {
                  var a = t[0];
                  return "." === a
                    ? new ye(e, t.slice(1), n).parts
                    : "@" === a
                    ? [new _e(e, t.slice(1), i.eventContext)]
                    : "?" === a
                    ? [new ve(e, t.slice(1), n)]
                    : new he(e, t, n).parts;
                },
              },
              {
                key: "handleTextExpression",
                value: function (e) {
                  return new fe(e);
                },
              },
            ]),
            e
          );
        })())()),
        "undefined" != typeof window &&
          (window.litHtmlVersions || (window.litHtmlVersions = [])).push(
            "1.4.1"
          ),
        (Ce = function (e) {
          for (
            var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1;
            i < t;
            i++
          )
            n[i - 1] = arguments[i];
          return new ue(e, n, "html", Se);
        }),
        (Ee = function (e, t) {
          return "".concat(e, "--").concat(t);
        }),
        (Ne = !0),
        void 0 === window.ShadyCSS
          ? (Ne = !1)
          : void 0 === window.ShadyCSS.prepareTemplateDom &&
            (console.warn(
              "Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."
            ),
            (Ne = !1)),
        (Te = function (e) {
          return function (t) {
            var n = Ee(t.type, e),
              i = ke.get(n);
            void 0 === i &&
              ((i = { stringsArray: new WeakMap(), keyString: new Map() }),
              ke.set(n, i));
            var a = i.stringsArray.get(t.strings);
            if (void 0 !== a) return a;
            var r = t.strings.join(q);
            if (void 0 === (a = i.keyString.get(r))) {
              var o = t.getTemplateElement();
              Ne && window.ShadyCSS.prepareTemplateDom(o, e),
                (a = new G(t, o)),
                i.keyString.set(r, a);
            }
            return i.stringsArray.set(t.strings, a), a;
          };
        }),
        (Ve = ["html", "svg"]),
        (Pe = function (e) {
          Ve.forEach(function (t) {
            var n = ke.get(Ee(t, e));
            void 0 !== n &&
              n.keyString.forEach(function (e) {
                var t = e.element.content,
                  n = new Set();
                Array.from(t.querySelectorAll("style")).forEach(function (e) {
                  n.add(e);
                }),
                  Li(e, n);
              });
          });
        }),
        (Me = new Set()),
        (Ae = function (e, t, n) {
          Me.add(e);
          var i = n ? n.element : document.createElement("template"),
            a = t.querySelectorAll("style"),
            r = a.length;
          if (0 !== r) {
            for (var o = document.createElement("style"), s = 0; s < r; s++) {
              var l = a[s];
              l.parentNode.removeChild(l), (o.textContent += l.textContent);
            }
            Pe(e);
            var u = i.content;
            n
              ? (function (e, t) {
                  var n =
                      arguments.length > 2 && void 0 !== arguments[2]
                        ? arguments[2]
                        : null,
                    i = e.element.content,
                    a = e.parts;
                  if (null != n)
                    for (
                      var r = document.createTreeWalker(i, X, null, !1),
                        o = te(a),
                        s = 0,
                        l = -1;
                      r.nextNode();

                    ) {
                      for (
                        l++,
                          r.currentNode === n &&
                            ((s = ee(t)), n.parentNode.insertBefore(t, n));
                        -1 !== o && a[o].index === l;

                      ) {
                        if (s > 0) {
                          for (; -1 !== o; ) (a[o].index += s), (o = te(a, o));
                          return;
                        }
                        o = te(a, o);
                      }
                    }
                  else i.appendChild(t);
                })(n, o, u.firstChild)
              : u.insertBefore(o, u.firstChild),
              window.ShadyCSS.prepareTemplateStyles(i, e);
            var c = u.querySelector("style");
            if (window.ShadyCSS.nativeShadow && null !== c)
              t.insertBefore(c.cloneNode(!0), t.firstChild);
            else if (n) {
              u.insertBefore(o, u.firstChild);
              var d = new Set();
              d.add(o), Li(n, d);
            }
          } else window.ShadyCSS.prepareTemplateStyles(i, e);
        }),
        (Le = function (e, t, n) {
          if (!n || "object" !== o(n) || !n.scopeName)
            throw new Error("The `scopeName` option is required.");
          var i = n.scopeName,
            a = we.has(t),
            r = Ne && 11 === t.nodeType && !!t.host,
            s = r && !Me.has(i),
            l = s ? document.createDocumentFragment() : t;
          if ((xe(e, l, Object.assign({ templateFactory: Te(i) }, n)), s)) {
            var u = we.get(l);
            we.delete(l);
            var c = u.value instanceof oe ? u.value.template : void 0;
            Ae(i, l, c), z(t, t.firstChild), t.appendChild(l), we.set(t, u);
          }
          !a && r && window.ShadyCSS.styleElement(t.host);
        }),
        (window.JSCompiler_renameProperty = function (e, t) {
          return e;
        }),
        (Oe = {
          toAttribute: function (e, t) {
            switch (t) {
              case Boolean:
                return e ? "" : null;
              case Object:
              case Array:
                return null == e ? e : JSON.stringify(e);
            }
            return e;
          },
          fromAttribute: function (e, t) {
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
        }),
        (Fe = function (e, t) {
          return t !== e && (t == t || e == e);
        }),
        (Re = {
          attribute: !0,
          type: String,
          converter: Oe,
          reflect: !1,
          hasChanged: Fe,
        }),
        1,
        4,
        8,
        16,
        (Ue = "finalized"),
        (De = (function (e) {
          l(c, e);
          var t,
            u = s(c);
          function c() {
            var e;
            return n(this, c), (e = u.call(this)).initialize(), e;
          }
          return (
            i(
              c,
              [
                {
                  key: "initialize",
                  value: function () {
                    var e = this;
                    (this._updateState = 0),
                      (this._updatePromise = new Promise(function (t) {
                        return (e._enableUpdatingResolver = t);
                      })),
                      (this._changedProperties = new Map()),
                      this._saveInstanceProperties(),
                      this.requestUpdateInternal();
                  },
                },
                {
                  key: "_saveInstanceProperties",
                  value: function () {
                    var e = this;
                    this.constructor._classProperties.forEach(function (t, n) {
                      if (e.hasOwnProperty(n)) {
                        var i = e[n];
                        delete e[n],
                          e._instanceProperties ||
                            (e._instanceProperties = new Map()),
                          e._instanceProperties.set(n, i);
                      }
                    });
                  },
                },
                {
                  key: "_applyInstanceProperties",
                  value: function () {
                    var e = this;
                    this._instanceProperties.forEach(function (t, n) {
                      return (e[n] = t);
                    }),
                      (this._instanceProperties = void 0);
                  },
                },
                {
                  key: "connectedCallback",
                  value: function () {
                    this.enableUpdating();
                  },
                },
                {
                  key: "enableUpdating",
                  value: function () {
                    void 0 !== this._enableUpdatingResolver &&
                      (this._enableUpdatingResolver(),
                      (this._enableUpdatingResolver = void 0));
                  },
                },
                { key: "disconnectedCallback", value: function () {} },
                {
                  key: "attributeChangedCallback",
                  value: function (e, t, n) {
                    t !== n && this._attributeToProperty(e, n);
                  },
                },
                {
                  key: "_propertyToAttribute",
                  value: function (e, t) {
                    var n =
                        arguments.length > 2 && void 0 !== arguments[2]
                          ? arguments[2]
                          : Re,
                      i = this.constructor,
                      a = i._attributeNameForProperty(e, n);
                    if (void 0 !== a) {
                      var r = i._propertyValueToAttribute(t, n);
                      if (void 0 === r) return;
                      (this._updateState = 8 | this._updateState),
                        null == r
                          ? this.removeAttribute(a)
                          : this.setAttribute(a, r),
                        (this._updateState = -9 & this._updateState);
                    }
                  },
                },
                {
                  key: "_attributeToProperty",
                  value: function (e, t) {
                    if (!(8 & this._updateState)) {
                      var n = this.constructor,
                        i = n._attributeToPropertyMap.get(e);
                      if (void 0 !== i) {
                        var a = n.getPropertyOptions(i);
                        (this._updateState = 16 | this._updateState),
                          (this[i] = n._propertyValueFromAttribute(t, a)),
                          (this._updateState = -17 & this._updateState);
                      }
                    }
                  },
                },
                {
                  key: "requestUpdateInternal",
                  value: function (e, t, n) {
                    var i = !0;
                    if (void 0 !== e) {
                      var a = this.constructor;
                      (n = n || a.getPropertyOptions(e)),
                        a._valueHasChanged(this[e], t, n.hasChanged)
                          ? (this._changedProperties.has(e) ||
                              this._changedProperties.set(e, t),
                            !0 !== n.reflect ||
                              16 & this._updateState ||
                              (void 0 === this._reflectingProperties &&
                                (this._reflectingProperties = new Map()),
                              this._reflectingProperties.set(e, n)))
                          : (i = !1);
                    }
                    !this._hasRequestedUpdate &&
                      i &&
                      (this._updatePromise = this._enqueueUpdate());
                  },
                },
                {
                  key: "requestUpdate",
                  value: function (e, t) {
                    return (
                      this.requestUpdateInternal(e, t), this.updateComplete
                    );
                  },
                },
                {
                  key: "_enqueueUpdate",
                  value:
                    ((t = h(
                      p.mark(function e() {
                        var t;
                        return p.wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (this._updateState = 4 | this._updateState),
                                    (e.prev = 1),
                                    (e.next = 4),
                                    this._updatePromise
                                  );
                                case 4:
                                  e.next = 8;
                                  break;
                                case 6:
                                  (e.prev = 6), (e.t0 = e.catch(1));
                                case 8:
                                  if (null == (t = this.performUpdate())) {
                                    e.next = 12;
                                    break;
                                  }
                                  return (e.next = 12), t;
                                case 12:
                                  return e.abrupt(
                                    "return",
                                    !this._hasRequestedUpdate
                                  );
                                case 13:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[1, 6]]
                        );
                      })
                    )),
                    function () {
                      return t.apply(this, arguments);
                    }),
                },
                {
                  key: "_hasRequestedUpdate",
                  get: function () {
                    return 4 & this._updateState;
                  },
                },
                {
                  key: "hasUpdated",
                  get: function () {
                    return 1 & this._updateState;
                  },
                },
                {
                  key: "performUpdate",
                  value: function () {
                    if (this._hasRequestedUpdate) {
                      this._instanceProperties &&
                        this._applyInstanceProperties();
                      var e = !1,
                        t = this._changedProperties;
                      try {
                        (e = this.shouldUpdate(t))
                          ? this.update(t)
                          : this._markUpdated();
                      } catch (t) {
                        throw ((e = !1), this._markUpdated(), t);
                      }
                      e &&
                        (1 & this._updateState ||
                          ((this._updateState = 1 | this._updateState),
                          this.firstUpdated(t)),
                        this.updated(t));
                    }
                  },
                },
                {
                  key: "_markUpdated",
                  value: function () {
                    (this._changedProperties = new Map()),
                      (this._updateState = -5 & this._updateState);
                  },
                },
                {
                  key: "updateComplete",
                  get: function () {
                    return this._getUpdateComplete();
                  },
                },
                {
                  key: "_getUpdateComplete",
                  value: function () {
                    return this.getUpdateComplete();
                  },
                },
                {
                  key: "getUpdateComplete",
                  value: function () {
                    return this._updatePromise;
                  },
                },
                {
                  key: "shouldUpdate",
                  value: function (e) {
                    return !0;
                  },
                },
                {
                  key: "update",
                  value: function (e) {
                    var t = this;
                    void 0 !== this._reflectingProperties &&
                      this._reflectingProperties.size > 0 &&
                      (this._reflectingProperties.forEach(function (e, n) {
                        return t._propertyToAttribute(n, t[n], e);
                      }),
                      (this._reflectingProperties = void 0)),
                      this._markUpdated();
                  },
                },
                { key: "updated", value: function (e) {} },
                { key: "firstUpdated", value: function (e) {} },
              ],
              [
                {
                  key: "observedAttributes",
                  get: function () {
                    var e = this;
                    this.finalize();
                    var t = [];
                    return (
                      this._classProperties.forEach(function (n, i) {
                        var a = e._attributeNameForProperty(i, n);
                        void 0 !== a &&
                          (e._attributeToPropertyMap.set(a, i), t.push(a));
                      }),
                      t
                    );
                  },
                },
                {
                  key: "_ensureClassProperties",
                  value: function () {
                    var e = this;
                    if (
                      !this.hasOwnProperty(
                        JSCompiler_renameProperty("_classProperties", this)
                      )
                    ) {
                      this._classProperties = new Map();
                      var t = Object.getPrototypeOf(this)._classProperties;
                      void 0 !== t &&
                        t.forEach(function (t, n) {
                          return e._classProperties.set(n, t);
                        });
                    }
                  },
                },
                {
                  key: "createProperty",
                  value: function (e) {
                    var t =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : Re;
                    if (
                      (this._ensureClassProperties(),
                      this._classProperties.set(e, t),
                      !t.noAccessor && !this.prototype.hasOwnProperty(e))
                    ) {
                      var n = "symbol" === o(e) ? Symbol() : "__".concat(e),
                        i = this.getPropertyDescriptor(e, n, t);
                      void 0 !== i &&
                        Object.defineProperty(this.prototype, e, i);
                    }
                  },
                },
                {
                  key: "getPropertyDescriptor",
                  value: function (e, t, n) {
                    return {
                      get: function () {
                        return this[t];
                      },
                      set: function (i) {
                        var a = this[e];
                        (this[t] = i), this.requestUpdateInternal(e, a, n);
                      },
                      configurable: !0,
                      enumerable: !0,
                    };
                  },
                },
                {
                  key: "getPropertyOptions",
                  value: function (e) {
                    return (
                      (this._classProperties && this._classProperties.get(e)) ||
                      Re
                    );
                  },
                },
                {
                  key: "finalize",
                  value: function () {
                    var e = Object.getPrototypeOf(this);
                    if (
                      (e.hasOwnProperty(Ue) || e.finalize(),
                      (this.finalized = !0),
                      this._ensureClassProperties(),
                      (this._attributeToPropertyMap = new Map()),
                      this.hasOwnProperty(
                        JSCompiler_renameProperty("properties", this)
                      ))
                    ) {
                      var t,
                        n = this.properties,
                        i = [].concat(
                          r(Object.getOwnPropertyNames(n)),
                          r(
                            "function" == typeof Object.getOwnPropertySymbols
                              ? Object.getOwnPropertySymbols(n)
                              : []
                          )
                        ),
                        o = a(i);
                      try {
                        for (o.s(); !(t = o.n()).done; ) {
                          var s = t.value;
                          this.createProperty(s, n[s]);
                        }
                      } catch (e) {
                        o.e(e);
                      } finally {
                        o.f();
                      }
                    }
                  },
                },
                {
                  key: "_attributeNameForProperty",
                  value: function (e, t) {
                    var n = t.attribute;
                    return !1 === n
                      ? void 0
                      : "string" == typeof n
                      ? n
                      : "string" == typeof e
                      ? e.toLowerCase()
                      : void 0;
                  },
                },
                {
                  key: "_valueHasChanged",
                  value: function (e, t) {
                    var n =
                      arguments.length > 2 && void 0 !== arguments[2]
                        ? arguments[2]
                        : Fe;
                    return n(e, t);
                  },
                },
                {
                  key: "_propertyValueFromAttribute",
                  value: function (e, t) {
                    var n = t.type,
                      i = t.converter || Oe,
                      a = "function" == typeof i ? i : i.fromAttribute;
                    return a ? a(e, n) : e;
                  },
                },
                {
                  key: "_propertyValueToAttribute",
                  value: function (e, t) {
                    if (void 0 !== t.reflect) {
                      var n = t.type,
                        i = t.converter;
                      return ((i && i.toAttribute) || Oe.toAttribute)(e, n);
                    }
                  },
                },
              ]
            ),
            c
          );
        })(d(HTMLElement))),
        Ue,
        (De.finalized = !0),
        (He =
          window.ShadowRoot &&
          (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow) &&
          "adoptedStyleSheets" in Document.prototype &&
          "replace" in CSSStyleSheet.prototype),
        (Be = Symbol()),
        (Ie = (function () {
          function e(t, i) {
            if ((n(this, e), i !== Be))
              throw new Error(
                "CSSResult is not constructable. Use `unsafeCSS` or `css` instead."
              );
            this.cssText = t;
          }
          return (
            i(e, [
              {
                key: "styleSheet",
                get: function () {
                  return (
                    void 0 === this._styleSheet &&
                      (He
                        ? ((this._styleSheet = new CSSStyleSheet()),
                          this._styleSheet.replaceSync(this.cssText))
                        : (this._styleSheet = null)),
                    this._styleSheet
                  );
                },
              },
              {
                key: "toString",
                value: function () {
                  return this.cssText;
                },
              },
            ]),
            e
          );
        })()),
        (je = function (e) {
          return new Ie(String(e), Be);
        }),
        (ze = function (e) {
          if (e instanceof Ie) return e.cssText;
          if ("number" == typeof e) return e;
          throw new Error(
            "Value passed to 'css' function must be a 'css' function result: ".concat(
              e,
              ". Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security."
            )
          );
        }),
        (qe = function (e) {
          for (
            var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1;
            i < t;
            i++
          )
            n[i - 1] = arguments[i];
          var a = n.reduce(function (t, n, i) {
            return t + ze(n) + e[i + 1];
          }, e[0]);
          return new Ie(a, Be);
        }),
        (window.litElementVersions || (window.litElementVersions = [])).push(
          "2.5.1"
        ),
        ($e = {}),
        ((Ze = (function (e) {
          l(a, e);
          var t = s(a);
          function a() {
            return n(this, a), t.apply(this, arguments);
          }
          return (
            i(
              a,
              [
                {
                  key: "initialize",
                  value: function () {
                    c(u(a.prototype), "initialize", this).call(this),
                      this.constructor._getUniqueStyles(),
                      (this.renderRoot = this.createRenderRoot()),
                      window.ShadowRoot &&
                        this.renderRoot instanceof window.ShadowRoot &&
                        this.adoptStyles();
                  },
                },
                {
                  key: "createRenderRoot",
                  value: function () {
                    return this.attachShadow(
                      this.constructor.shadowRootOptions
                    );
                  },
                },
                {
                  key: "adoptStyles",
                  value: function () {
                    var e = this.constructor._styles;
                    0 !== e.length &&
                      (void 0 === window.ShadyCSS ||
                      window.ShadyCSS.nativeShadow
                        ? He
                          ? (this.renderRoot.adoptedStyleSheets = e.map(
                              function (e) {
                                return e instanceof CSSStyleSheet
                                  ? e
                                  : e.styleSheet;
                              }
                            ))
                          : (this._needsShimAdoptedStyleSheets = !0)
                        : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(
                            e.map(function (e) {
                              return e.cssText;
                            }),
                            this.localName
                          ));
                  },
                },
                {
                  key: "connectedCallback",
                  value: function () {
                    c(u(a.prototype), "connectedCallback", this).call(this),
                      this.hasUpdated &&
                        void 0 !== window.ShadyCSS &&
                        window.ShadyCSS.styleElement(this);
                  },
                },
                {
                  key: "update",
                  value: function (e) {
                    var t = this,
                      n = this.render();
                    c(u(a.prototype), "update", this).call(this, e),
                      n !== $e &&
                        this.constructor.render(n, this.renderRoot, {
                          scopeName: this.localName,
                          eventContext: this,
                        }),
                      this._needsShimAdoptedStyleSheets &&
                        ((this._needsShimAdoptedStyleSheets = !1),
                        this.constructor._styles.forEach(function (e) {
                          var n = document.createElement("style");
                          (n.textContent = e.cssText),
                            t.renderRoot.appendChild(n);
                        }));
                  },
                },
                {
                  key: "render",
                  value: function () {
                    return $e;
                  },
                },
              ],
              [
                {
                  key: "getStyles",
                  value: function () {
                    return this.styles;
                  },
                },
                {
                  key: "_getUniqueStyles",
                  value: function () {
                    if (
                      !this.hasOwnProperty(
                        JSCompiler_renameProperty("_styles", this)
                      )
                    ) {
                      var e = this.getStyles();
                      if (Array.isArray(e)) {
                        var t = (function e(t, n) {
                            return t.reduceRight(function (t, n) {
                              return Array.isArray(n) ? e(n, t) : (t.add(n), t);
                            }, n);
                          })(e, new Set()),
                          n = [];
                        t.forEach(function (e) {
                          return n.unshift(e);
                        }),
                          (this._styles = n);
                      } else this._styles = void 0 === e ? [] : [e];
                      this._styles = this._styles.map(function (e) {
                        if (e instanceof CSSStyleSheet && !He) {
                          var t = Array.prototype.slice
                            .call(e.cssRules)
                            .reduce(function (e, t) {
                              return e + t.cssText;
                            }, "");
                          return je(t);
                        }
                        return e;
                      });
                    }
                  },
                },
              ]
            ),
            a
          );
        })(De)).finalized = !0),
        (Ze.render = Le),
        (Ze.shadowRootOptions = { mode: "open" }),
        function (e) {
          return e;
        },
        (Ge = qe(
          We ||
            (We =
              _ ||
              (_ = f([
                '\n@import url("https://use.typekit.net/tgy5tlj.css");:root{--uvalib-brand-blue-lightest:#87b9d9;--uvalib-brand-blue-lighter:#3395d4;--uvalib-brand-blue-light:#0370b7;--uvalib-brand-blue:#232d4b;--uvalib-brand-orange-lightest:#ffead6;--uvalib-brand-orange:#e57200;--uvalib-brand-orange-dark:#b35900;--uvalib-blue-alt-light:#55c4ec;--uvalib-blue-alt:#007bac;--uvalib-blue-alt-dark:#005679;--uvalib-blue-alt-darkest:#141e3c;--uvalib-teal-lightest:#c8f2f4;--uvalib-teal-light:#5bd7de;--uvalib-teal:#25cad3;--uvalib-teal-dark:#1da1a8;--uvalib-teal-darker:#16777c;--uvalib-green-lightest:#ddefdc;--uvalib-green:#62bb46;--uvalib-green-dark:#4e9737;--uvalib-red-lightest:#fbcfda;--uvalib-red:#ef3f6b;--uvalib-red-emergency:#b30000;--uvalib-red-darker:#b30000;--uvalib-red-dark:#df1e43;--uvalib-yellow-light:#fef6c8;--uvalib-yellow:#ecc602;--uvalib-yellow-dark:#b99c02;--uvalib-beige:#f7efe1;--uvalib-beige-dark:#c0b298;--uvalib-grey-lightest:#f1f1f1;--uvalib-grey-light:#dadada;--uvalib-grey:grey;--uvalib-grey-dark:#4f4f4f;--uvalib-grey-darkest:#2b2b2b;--uvalib-white:#fff;--uvalib-text-light:#fff;--uvalib-text:#4f4f4f;--uvalib-text-dark:#2b2b2b;--uvalib-primary-orange:#e57200;--uvalib-accessibility-highlight:#0370b7;--uvalib-color-link:#005679;--uvalib-color-link-darker:#005679;--uvalib-color-primary-text:#4f4f4f;--uvalib-color-error:#b30000;color:#4f4f4f;font-family:franklin-gothic-urw,arial,sans-serif;font-weight:300;margin-bottom:.25em;margin-top:1em;text-transform:none}.apply-border{border:1px solid #dadada;margin-bottom:1rem;padding:.75rem 1.25rem;position:relative}.h1,h1{color:#232d4b;font-family:franklin-gothic-urw,arial,sans-serif;font-size:60px;font-weight:700;line-height:60px;margin-bottom:.66667em;margin-top:.25em}.h2,h2{font-size:32px;line-height:32px}.h2,.h3,h2,h3{color:#232d4b;font-family:franklin-gothic-urw,arial,sans-serif;font-weight:500}.h3,h3{font-size:24px;line-height:24px}.h4,h4{font-size:20px;line-height:20px}.h4,.h5,h4,h5{color:#232d4b;font-family:franklin-gothic-urw,arial,sans-serif;font-weight:500}.h5,.h6,h5,h6{font-size:16px;line-height:16px}.h6,h6{color:#4f4f4f;font-family:franklin-gothic-urw,arial,sans-serif;font-weight:400}\n/*# sourceMappingURL=css/styles.css.map */\n',
              ])))
        )),
        "/api/search",
        (Je = { devMode: !1 }),
        (Ke = { start: 0, rows: 5, keyword: "" }),
        (Qe = {
          attributes: [],
          description: "",
          id: "",
          mode: "",
          name: "",
          sort_options: [],
          source: "",
          url: "",
        }),
        (Ye = new WeakMap()),
        (Xe = function e(t) {
          n(this, e),
            Ye.set(this, { writable: !0, value: void 0 }),
            Fi(this, "attributes", void 0),
            Fi(this, "description", void 0),
            Fi(this, "id", void 0),
            Fi(this, "mode", void 0),
            Fi(this, "name", void 0),
            Fi(this, "sortOptions", void 0),
            Fi(this, "source", void 0),
            Fi(this, "url", void 0),
            Ui(this, Ye, y(y({}, Qe), t)),
            (this.attributes = Ri(this, Ye).attributes),
            (this.description = Ri(this, Ye).description),
            (this.id = Ri(this, Ye).id),
            (this.mode = Ri(this, Ye).mode),
            (this.name = Ri(this, Ye).name),
            (this.sortOptions = Ri(this, Ye).sort_options),
            (this.source = Ri(this, Ye).source),
            (this.url = Ri(this, Ye).url);
        }),
        (et = new WeakMap()),
        (tt = new WeakMap()),
        (nt = new WeakMap()),
        (it = new WeakMap()),
        (at = (function () {
          function e(t) {
            n(this, e),
              et.set(this, { writable: !0, value: void 0 }),
              tt.set(this, { writable: !0, value: void 0 }),
              nt.set(this, { writable: !0, value: void 0 }),
              it.set(this, { writable: !0, value: void 0 }),
              Fi(this, "lastKeyword", void 0),
              Fi(this, "lastStart", void 0),
              Fi(this, "lastRows", void 0),
              Fi(this, "lastRequest", void 0),
              Fi(this, "lastSuggestions", void 0),
              Ui(this, tt, y(y({}, Je), t)),
              (this.devMode = Ri(this, tt).devMode);
          }
          return (
            i(e, [
              {
                key: "devMode",
                set: function (e) {
                  e
                    ? (console.info("dev mode is true"),
                      Ui(
                        this,
                        nt,
                        "https://search-ws.internal.lib.virginia.edu"
                      ))
                    : (console.info("dev mode is false"),
                      Ui(
                        this,
                        nt,
                        "https://search-ws.internal.lib.virginia.edu"
                      ));
                },
              },
              {
                key: "lastPools",
                get: function () {
                  return Ri(this, it);
                },
                set: function (e) {
                  Array.isArray(e) &&
                    Ui(
                      this,
                      it,
                      e.map(function (e) {
                        return new Xe(e);
                      })
                    );
                },
              },
              {
                key: "lastPoolResults",
                set: function (e) {
                  Array.isArray(e) &&
                    this.poolsPromise.then(function (t) {
                      e.forEach(function (e) {
                        t[e.pool_id].lastRssults = e;
                      });
                    });
                },
              },
              { key: "lastPoolResluts", get: function () {} },
              {
                key: "poolsPromise",
                get: function () {
                  var e = this;
                  return this.lastPools
                    ? Promise.resolve(Hi(this.lastPools))
                    : this.fetchResults({ rows: 0 }).then(function () {
                        return Hi(e.lastPools);
                      });
                },
              },
              {
                key: "authenticated",
                get: function () {
                  return !!Ri(this, et);
                },
              },
              {
                key: "authorize",
                value: function () {
                  var e = this;
                  return this.authenticated
                    ? Promise.resolve(Ri(this, et))
                    : fetch("https://search.lib.virginia.edu/authorize", {
                        method: "POST",
                        mode: "cors",
                        cache: "no-cache",
                      })
                        .then(function (e) {
                          return e.text();
                        })
                        .then(function (t) {
                          return Ui(e, et, t), Ri(e, et);
                        });
                },
              },
              {
                key: "fetchResults",
                value: function (e) {
                  var t = this,
                    n = y(y({}, Ke), e);
                  return this.authorize().then(function (e) {
                    return fetch("".concat(Ri(t, nt)).concat("/api/search"), {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer ".concat(e),
                      },
                      body: JSON.stringify({
                        query: "keyword: {".concat(n.keyword, "}"),
                        pagination: { start: n.start, rows: n.rows },
                      }),
                    })
                      .then(function (e) {
                        return e.json();
                      })
                      .then(function (e) {
                        return (
                          (t.lastKeyword = n.keyword),
                          (t.lastStart = n.start),
                          (t.lastRows = n.rows),
                          (t.lastPools = e.pools),
                          (t.lastPoolResults = e.pool_results),
                          (t.lastRequest = e.request),
                          (t.lastSuggestions = e.suggestions),
                          e
                        );
                      });
                  });
                },
              },
            ]),
            e
          );
        })()),
        (rt =
          window.ShadowRoot &&
          (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow) &&
          "adoptedStyleSheets" in Document.prototype &&
          "replace" in CSSStyleSheet.prototype),
        (ot = Symbol()),
        (st = (function () {
          function e(t, i) {
            if ((n(this, e), i !== ot))
              throw Error(
                "CSSResult is not constructable. Use `unsafeCSS` or `css` instead."
              );
            this.cssText = t;
          }
          return (
            i(e, [
              {
                key: "styleSheet",
                get: function () {
                  return (
                    rt &&
                      void 0 === this.t &&
                      ((this.t = new CSSStyleSheet()),
                      this.t.replaceSync(this.cssText)),
                    this.t
                  );
                },
              },
              {
                key: "toString",
                value: function () {
                  return this.cssText;
                },
              },
            ]),
            e
          );
        })()),
        (lt = new Map()),
        (ut = function (e) {
          var t = lt.get(e);
          return void 0 === t && lt.set(e, (t = new st(e, ot))), t;
        }),
        (ct = function (e) {
          return ut("string" == typeof e ? e : e + "");
        }),
        (dt = function (e) {
          for (
            var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1;
            i < t;
            i++
          )
            n[i - 1] = arguments[i];
          var a =
            1 === e.length
              ? e[0]
              : n.reduce(function (t, n, i) {
                  return (
                    t +
                    (function (e) {
                      if (e instanceof st) return e.cssText;
                      if ("number" == typeof e) return e;
                      throw Error(
                        "Value passed to 'css' function must be a 'css' function result: " +
                          e +
                          ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security."
                      );
                    })(n) +
                    e[i + 1]
                  );
                }, e[0]);
          return ut(a);
        }),
        (ht = function (e, t) {
          rt
            ? (e.adoptedStyleSheets = t.map(function (e) {
                return e instanceof CSSStyleSheet ? e : e.styleSheet;
              }))
            : t.forEach(function (t) {
                var n = document.createElement("style");
                (n.textContent = t.cssText), e.appendChild(n);
              });
        }),
        (pt = rt
          ? function (e) {
              return e;
            }
          : function (e) {
              return e instanceof CSSStyleSheet
                ? (function (e) {
                    var t,
                      n = "",
                      i = a(e.cssRules);
                    try {
                      for (i.s(); !(t = i.n()).done; ) {
                        n += t.value.cssText;
                      }
                    } catch (e) {
                      i.e(e);
                    } finally {
                      i.f();
                    }
                    return ct(n);
                  })(e)
                : e;
            }),
        (gt = {
          toAttribute: function (e, t) {
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
          fromAttribute: function (e, t) {
            var n = e;
            switch (t) {
              case Boolean:
                n = null !== e;
                break;
              case Number:
                n = null === e ? null : Number(e);
                break;
              case Object:
              case Array:
                try {
                  n = JSON.parse(e);
                } catch (e) {
                  n = null;
                }
            }
            return n;
          },
        }),
        (_t = function (e, t) {
          return t !== e && (t == t || e == e);
        }),
        (bt = {
          attribute: !0,
          type: String,
          converter: gt,
          reflect: !1,
          hasChanged: _t,
        }),
        ((kt = (function (e) {
          l(c, e);
          var t,
            u = s(c);
          function c() {
            var e;
            return (
              n(this, c),
              ((e = u.call(this)).Πi = new Map()),
              (e.Πo = void 0),
              (e.Πl = void 0),
              (e.isUpdatePending = !1),
              (e.hasUpdated = !1),
              (e.Πh = null),
              e.u(),
              e
            );
          }
          return (
            i(
              c,
              [
                {
                  key: "u",
                  value: function () {
                    var e,
                      t = this;
                    (this.Πg = new Promise(function (e) {
                      return (t.enableUpdating = e);
                    })),
                      (this.L = new Map()),
                      this.Π_(),
                      this.requestUpdate(),
                      null === (e = this.constructor.v) ||
                        void 0 === e ||
                        e.forEach(function (e) {
                          return e(t);
                        });
                  },
                },
                {
                  key: "addController",
                  value: function (e) {
                    var t, n;
                    (null !== (t = this.ΠU) && void 0 !== t
                      ? t
                      : (this.ΠU = [])
                    ).push(e),
                      void 0 !== this.renderRoot &&
                        this.isConnected &&
                        (null === (n = e.hostConnected) ||
                          void 0 === n ||
                          n.call(e));
                  },
                },
                {
                  key: "removeController",
                  value: function (e) {
                    var t;
                    null === (t = this.ΠU) ||
                      void 0 === t ||
                      t.splice(this.ΠU.indexOf(e) >>> 0, 1);
                  },
                },
                {
                  key: "Π_",
                  value: function () {
                    var e = this;
                    this.constructor.elementProperties.forEach(function (t, n) {
                      e.hasOwnProperty(n) && (e.Πi.set(n, e[n]), delete e[n]);
                    });
                  },
                },
                {
                  key: "createRenderRoot",
                  value: function () {
                    var e,
                      t =
                        null !== (e = this.shadowRoot) && void 0 !== e
                          ? e
                          : this.attachShadow(
                              this.constructor.shadowRootOptions
                            );
                    return ht(t, this.constructor.elementStyles), t;
                  },
                },
                {
                  key: "connectedCallback",
                  value: function () {
                    var e;
                    void 0 === this.renderRoot &&
                      (this.renderRoot = this.createRenderRoot()),
                      this.enableUpdating(!0),
                      null === (e = this.ΠU) ||
                        void 0 === e ||
                        e.forEach(function (e) {
                          var t;
                          return null === (t = e.hostConnected) || void 0 === t
                            ? void 0
                            : t.call(e);
                        }),
                      this.Πl && (this.Πl(), (this.Πo = this.Πl = void 0));
                  },
                },
                { key: "enableUpdating", value: function (e) {} },
                {
                  key: "disconnectedCallback",
                  value: function () {
                    var e,
                      t = this;
                    null === (e = this.ΠU) ||
                      void 0 === e ||
                      e.forEach(function (e) {
                        var t;
                        return null === (t = e.hostDisconnected) || void 0 === t
                          ? void 0
                          : t.call(e);
                      }),
                      (this.Πo = new Promise(function (e) {
                        return (t.Πl = e);
                      }));
                  },
                },
                {
                  key: "attributeChangedCallback",
                  value: function (e, t, n) {
                    this.K(e, n);
                  },
                },
                {
                  key: "Πj",
                  value: function (e, t) {
                    var n,
                      i,
                      a =
                        arguments.length > 2 && void 0 !== arguments[2]
                          ? arguments[2]
                          : bt,
                      r = this.constructor.Πp(e, a);
                    if (void 0 !== r && !0 === a.reflect) {
                      var o = (
                        null !==
                          (i =
                            null === (n = a.converter) || void 0 === n
                              ? void 0
                              : n.toAttribute) && void 0 !== i
                          ? i
                          : gt.toAttribute
                      )(t, a.type);
                      (this.Πh = e),
                        null == o
                          ? this.removeAttribute(r)
                          : this.setAttribute(r, o),
                        (this.Πh = null);
                    }
                  },
                },
                {
                  key: "K",
                  value: function (e, t) {
                    var n,
                      i,
                      a,
                      r = this.constructor,
                      o = r.Πm.get(e);
                    if (void 0 !== o && this.Πh !== o) {
                      var s = r.getPropertyOptions(o),
                        l = s.converter,
                        u =
                          null !==
                            (a =
                              null !==
                                (i =
                                  null === (n = l) || void 0 === n
                                    ? void 0
                                    : n.fromAttribute) && void 0 !== i
                                ? i
                                : "function" == typeof l
                                ? l
                                : null) && void 0 !== a
                            ? a
                            : gt.fromAttribute;
                      (this.Πh = o), (this[o] = u(t, s.type)), (this.Πh = null);
                    }
                  },
                },
                {
                  key: "requestUpdate",
                  value: function (e, t, n) {
                    var i = !0;
                    void 0 !== e &&
                      ((
                        (n = n || this.constructor.getPropertyOptions(e))
                          .hasChanged || _t
                      )(this[e], t)
                        ? (this.L.has(e) || this.L.set(e, t),
                          !0 === n.reflect &&
                            this.Πh !== e &&
                            (void 0 === this.Πk && (this.Πk = new Map()),
                            this.Πk.set(e, n)))
                        : (i = !1)),
                      !this.isUpdatePending && i && (this.Πg = this.Πq());
                  },
                },
                {
                  key: "Πq",
                  value:
                    ((t = h(
                      p.mark(function e() {
                        var t;
                        return p.wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (this.isUpdatePending = !0),
                                    (e.prev = 1),
                                    (e.next = 4),
                                    this.Πg
                                  );
                                case 4:
                                  if (!this.Πo) {
                                    e.next = 9;
                                    break;
                                  }
                                  return (e.next = 7), this.Πo;
                                case 7:
                                  e.next = 4;
                                  break;
                                case 9:
                                  e.next = 14;
                                  break;
                                case 11:
                                  (e.prev = 11),
                                    (e.t0 = e.catch(1)),
                                    Promise.reject(e.t0);
                                case 14:
                                  if (
                                    ((t = this.performUpdate()),
                                    (e.t1 = null != t),
                                    !e.t1)
                                  ) {
                                    e.next = 19;
                                    break;
                                  }
                                  return (e.next = 19), t;
                                case 19:
                                  return e.abrupt(
                                    "return",
                                    !this.isUpdatePending
                                  );
                                case 20:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[1, 11]]
                        );
                      })
                    )),
                    function () {
                      return t.apply(this, arguments);
                    }),
                },
                {
                  key: "performUpdate",
                  value: function () {
                    var e,
                      t = this;
                    if (this.isUpdatePending) {
                      this.hasUpdated,
                        this.Πi &&
                          (this.Πi.forEach(function (e, n) {
                            return (t[n] = e);
                          }),
                          (this.Πi = void 0));
                      var n = !1,
                        i = this.L;
                      try {
                        (n = this.shouldUpdate(i))
                          ? (this.willUpdate(i),
                            null === (e = this.ΠU) ||
                              void 0 === e ||
                              e.forEach(function (e) {
                                var t;
                                return null === (t = e.hostUpdate) ||
                                  void 0 === t
                                  ? void 0
                                  : t.call(e);
                              }),
                            this.update(i))
                          : this.Π$();
                      } catch (e) {
                        throw ((n = !1), this.Π$(), e);
                      }
                      n && this.E(i);
                    }
                  },
                },
                { key: "willUpdate", value: function (e) {} },
                {
                  key: "E",
                  value: function (e) {
                    var t;
                    null === (t = this.ΠU) ||
                      void 0 === t ||
                      t.forEach(function (e) {
                        var t;
                        return null === (t = e.hostUpdated) || void 0 === t
                          ? void 0
                          : t.call(e);
                      }),
                      this.hasUpdated ||
                        ((this.hasUpdated = !0), this.firstUpdated(e)),
                      this.updated(e);
                  },
                },
                {
                  key: "Π$",
                  value: function () {
                    (this.L = new Map()), (this.isUpdatePending = !1);
                  },
                },
                {
                  key: "updateComplete",
                  get: function () {
                    return this.getUpdateComplete();
                  },
                },
                {
                  key: "getUpdateComplete",
                  value: function () {
                    return this.Πg;
                  },
                },
                {
                  key: "shouldUpdate",
                  value: function (e) {
                    return !0;
                  },
                },
                {
                  key: "update",
                  value: function (e) {
                    var t = this;
                    void 0 !== this.Πk &&
                      (this.Πk.forEach(function (e, n) {
                        return t.Πj(n, t[n], e);
                      }),
                      (this.Πk = void 0)),
                      this.Π$();
                  },
                },
                { key: "updated", value: function (e) {} },
                { key: "firstUpdated", value: function (e) {} },
              ],
              [
                {
                  key: "addInitializer",
                  value: function (e) {
                    var t;
                    (null !== (t = this.v) && void 0 !== t) || (this.v = []),
                      this.v.push(e);
                  },
                },
                {
                  key: "observedAttributes",
                  get: function () {
                    var e = this;
                    this.finalize();
                    var t = [];
                    return (
                      this.elementProperties.forEach(function (n, i) {
                        var a = e.Πp(i, n);
                        void 0 !== a && (e.Πm.set(a, i), t.push(a));
                      }),
                      t
                    );
                  },
                },
                {
                  key: "createProperty",
                  value: function (e) {
                    var t =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : bt;
                    if (
                      (t.state && (t.attribute = !1),
                      this.finalize(),
                      this.elementProperties.set(e, t),
                      !t.noAccessor && !this.prototype.hasOwnProperty(e))
                    ) {
                      var n = "symbol" == o(e) ? Symbol() : "__" + e,
                        i = this.getPropertyDescriptor(e, n, t);
                      void 0 !== i &&
                        Object.defineProperty(this.prototype, e, i);
                    }
                  },
                },
                {
                  key: "getPropertyDescriptor",
                  value: function (e, t, n) {
                    return {
                      get: function () {
                        return this[t];
                      },
                      set: function (i) {
                        var a = this[e];
                        (this[t] = i), this.requestUpdate(e, a, n);
                      },
                      configurable: !0,
                      enumerable: !0,
                    };
                  },
                },
                {
                  key: "getPropertyOptions",
                  value: function (e) {
                    return this.elementProperties.get(e) || bt;
                  },
                },
                {
                  key: "finalize",
                  value: function () {
                    if (this.hasOwnProperty("finalized")) return !1;
                    this.finalized = !0;
                    var e = Object.getPrototypeOf(this);
                    if (
                      (e.finalize(),
                      (this.elementProperties = new Map(e.elementProperties)),
                      (this.Πm = new Map()),
                      this.hasOwnProperty("properties"))
                    ) {
                      var t,
                        n = this.properties,
                        i = [].concat(
                          r(Object.getOwnPropertyNames(n)),
                          r(Object.getOwnPropertySymbols(n))
                        ),
                        o = a(i);
                      try {
                        for (o.s(); !(t = o.n()).done; ) {
                          var s = t.value;
                          this.createProperty(s, n[s]);
                        }
                      } catch (e) {
                        o.e(e);
                      } finally {
                        o.f();
                      }
                    }
                    return (
                      (this.elementStyles = this.finalizeStyles(this.styles)),
                      !0
                    );
                  },
                },
                {
                  key: "finalizeStyles",
                  value: function (e) {
                    var t = [];
                    if (Array.isArray(e)) {
                      var n,
                        i = new Set(e.flat(1 / 0).reverse()),
                        r = a(i);
                      try {
                        for (r.s(); !(n = r.n()).done; ) {
                          var o = n.value;
                          t.unshift(pt(o));
                        }
                      } catch (e) {
                        r.e(e);
                      } finally {
                        r.f();
                      }
                    } else void 0 !== e && t.push(pt(e));
                    return t;
                  },
                },
                {
                  key: "Πp",
                  value: function (e, t) {
                    var n = t.attribute;
                    return !1 === n
                      ? void 0
                      : "string" == typeof n
                      ? n
                      : "string" == typeof e
                      ? e.toLowerCase()
                      : void 0;
                  },
                },
              ]
            ),
            c
          );
        })(d(HTMLElement))).finalized = !0),
        (kt.elementProperties = new Map()),
        (kt.elementStyles = []),
        (kt.shadowRootOptions = { mode: "open" }),
        null === (vt = (ft = globalThis).reactiveElementPlatformSupport) ||
          void 0 === vt ||
          vt.call(ft, { ReactiveElement: kt }),
        (null !== (yt = (mt = globalThis).reactiveElementVersions) &&
        void 0 !== yt
          ? yt
          : (mt.reactiveElementVersions = [])
        ).push("1.0.0-rc.2"),
        (Et = globalThis.trustedTypes),
        (Nt = Et
          ? Et.createPolicy("lit-html", {
              createHTML: function (e) {
                return e;
              },
            })
          : void 0),
        (Tt = "lit$".concat((Math.random() + "").slice(9), "$")),
        (Pt = "<".concat((Vt = "?" + Tt), ">")),
        (Mt = document),
        (At = function () {
          var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
          return Mt.createComment(e);
        }),
        (Lt = function (e) {
          return null === e || ("object" != o(e) && "function" != typeof e);
        }),
        (Ot = Array.isArray),
        (Ft = function (e) {
          var t;
          return (
            Ot(e) ||
            "function" ==
              typeof (null === (t = e) || void 0 === t
                ? void 0
                : t[Symbol.iterator])
          );
        }),
        (Rt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g),
        (Ut = /-->/g),
        (Dt = />/g),
        (Ht =
          />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g),
        (Bt = /'/g),
        (It = /"/g),
        (jt = /^(?:script|style|textarea)$/i),
        (zt = (function (e) {
          return function (t) {
            for (
              var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), a = 1;
              a < n;
              a++
            )
              i[a - 1] = arguments[a];
            return { _$litType$: e, strings: t, values: i };
          };
        })(1)),
        (qt = Symbol.for("lit-noChange")),
        ($t = Symbol.for("lit-nothing")),
        (Zt = new WeakMap()),
        (Wt = function (e, t, n) {
          var i,
            a,
            r =
              null !== (i = null == n ? void 0 : n.renderBefore) && void 0 !== i
                ? i
                : t,
            o = r._$litPart$;
          if (void 0 === o) {
            var s =
              null !== (a = null == n ? void 0 : n.renderBefore) && void 0 !== a
                ? a
                : null;
            r._$litPart$ = o = new Yt(t.insertBefore(At(), s), s, void 0, n);
          }
          return o.I(e), o;
        }),
        (Gt = Mt.createTreeWalker(Mt, 129, null, !1)),
        (Jt = function (e, t) {
          for (
            var n,
              i = e.length - 1,
              a = [],
              r = 2 === t ? "<svg>" : "",
              o = Rt,
              s = 0;
            s < i;
            s++
          ) {
            for (
              var l = e[s], u = void 0, c = void 0, d = -1, h = 0;
              h < l.length && ((o.lastIndex = h), null !== (c = o.exec(l)));

            )
              (h = o.lastIndex),
                o === Rt
                  ? "!--" === c[1]
                    ? (o = Ut)
                    : void 0 !== c[1]
                    ? (o = Dt)
                    : void 0 !== c[2]
                    ? (jt.test(c[2]) && (n = RegExp("</" + c[2], "g")),
                      (o = Ht))
                    : void 0 !== c[3] && (o = Ht)
                  : o === Ht
                  ? ">" === c[0]
                    ? ((o = null != n ? n : Rt), (d = -1))
                    : void 0 === c[1]
                    ? (d = -2)
                    : ((d = o.lastIndex - c[2].length),
                      (u = c[1]),
                      (o = void 0 === c[3] ? Ht : '"' === c[3] ? It : Bt))
                  : o === It || o === Bt
                  ? (o = Ht)
                  : o === Ut || o === Dt
                  ? (o = Rt)
                  : ((o = Ht), (n = void 0));
            var p = o === Ht && e[s + 1].startsWith("/>") ? " " : "";
            r +=
              o === Rt
                ? l + Pt
                : d >= 0
                ? (a.push(u), l.slice(0, d) + "$lit$" + l.slice(d) + Tt + p)
                : l + Tt + (-2 === d ? (a.push(void 0), s) : p);
          }
          var f = r + (e[i] || "<?>") + (2 === t ? "</svg>" : "");
          return [void 0 !== Nt ? Nt.createHTML(f) : f, a];
        }),
        (Kt = (function () {
          function e(t, i) {
            var o,
              s = t.strings,
              l = t._$litType$;
            n(this, e), (this.parts = []);
            var u = 0,
              c = 0,
              d = s.length - 1,
              h = this.parts,
              p = Jt(s, l),
              f = m(p, 2),
              v = f[0],
              y = f[1];
            if (
              ((this.el = e.createElement(v, i)),
              (Gt.currentNode = this.el.content),
              2 === l)
            ) {
              var g = this.el.content,
                _ = g.firstChild;
              _.remove(), g.append.apply(g, r(_.childNodes));
            }
            for (; null !== (o = Gt.nextNode()) && h.length < d; ) {
              if (1 === o.nodeType) {
                if (o.hasAttributes()) {
                  var b,
                    k = [],
                    w = a(o.getAttributeNames());
                  try {
                    for (w.s(); !(b = w.n()).done; ) {
                      var x = b.value;
                      if (x.endsWith("$lit$") || x.startsWith(Tt)) {
                        var S = y[c++];
                        if ((k.push(x), void 0 !== S)) {
                          var C = o
                              .getAttribute(S.toLowerCase() + "$lit$")
                              .split(Tt),
                            E = /([.?@])?(.*)/.exec(S);
                          h.push({
                            type: 1,
                            index: u,
                            name: E[2],
                            strings: C,
                            ctor:
                              "." === E[1]
                                ? en
                                : "?" === E[1]
                                ? tn
                                : "@" === E[1]
                                ? nn
                                : Xt,
                          });
                        } else h.push({ type: 6, index: u });
                      }
                    }
                  } catch (e) {
                    w.e(e);
                  } finally {
                    w.f();
                  }
                  for (var N = 0, T = k; N < T.length; N++) {
                    var V = T[N];
                    o.removeAttribute(V);
                  }
                }
                if (jt.test(o.tagName)) {
                  var P = o.textContent.split(Tt),
                    M = P.length - 1;
                  if (M > 0) {
                    o.textContent = Et ? Et.emptyScript : "";
                    for (var A = 0; A < M; A++)
                      o.append(P[A], At()),
                        Gt.nextNode(),
                        h.push({ type: 2, index: ++u });
                    o.append(P[M], At());
                  }
                }
              } else if (8 === o.nodeType)
                if (o.data === Vt) h.push({ type: 2, index: u });
                else
                  for (var L = -1; -1 !== (L = o.data.indexOf(Tt, L + 1)); )
                    h.push({ type: 7, index: u }), (L += Tt.length - 1);
              u++;
            }
          }
          return (
            i(e, null, [
              {
                key: "createElement",
                value: function (e, t) {
                  var n = Mt.createElement("template");
                  return (n.innerHTML = e), n;
                },
              },
            ]),
            e
          );
        })()),
        (Qt = (function () {
          function e(t, i) {
            n(this, e),
              (this.l = []),
              (this.N = void 0),
              (this.D = t),
              (this.M = i);
          }
          return (
            i(e, [
              {
                key: "u",
                value: function (e) {
                  var t,
                    n = this.D,
                    i = n.el.content,
                    a = n.parts,
                    r = (
                      null !== (t = null == e ? void 0 : e.creationScope) &&
                      void 0 !== t
                        ? t
                        : Mt
                    ).importNode(i, !0);
                  Gt.currentNode = r;
                  for (
                    var o = Gt.nextNode(), s = 0, l = 0, u = a[0];
                    void 0 !== u;

                  ) {
                    if (s === u.index) {
                      var c = void 0;
                      2 === u.type
                        ? (c = new Yt(o, o.nextSibling, this, e))
                        : 1 === u.type
                        ? (c = new u.ctor(o, u.name, u.strings, this, e))
                        : 6 === u.type && (c = new an(o, this, e)),
                        this.l.push(c),
                        (u = a[++l]);
                    }
                    s !== (null == u ? void 0 : u.index) &&
                      ((o = Gt.nextNode()), s++);
                  }
                  return r;
                },
              },
              {
                key: "v",
                value: function (e) {
                  var t,
                    n = 0,
                    i = a(this.l);
                  try {
                    for (i.s(); !(t = i.n()).done; ) {
                      var r = t.value;
                      void 0 !== r &&
                        (void 0 !== r.strings
                          ? (r.I(e, r, n), (n += r.strings.length - 2))
                          : r.I(e[n])),
                        n++;
                    }
                  } catch (e) {
                    i.e(e);
                  } finally {
                    i.f();
                  }
                },
              },
            ]),
            e
          );
        })()),
        (Yt = (function () {
          function e(t, i, a, r) {
            n(this, e),
              (this.type = 2),
              (this.N = void 0),
              (this.A = t),
              (this.B = i),
              (this.M = a),
              (this.options = r);
          }
          return (
            i(e, [
              {
                key: "setConnected",
                value: function (e) {
                  var t;
                  null === (t = this.P) || void 0 === t || t.call(this, e);
                },
              },
              {
                key: "parentNode",
                get: function () {
                  return this.A.parentNode;
                },
              },
              {
                key: "startNode",
                get: function () {
                  return this.A;
                },
              },
              {
                key: "endNode",
                get: function () {
                  return this.B;
                },
              },
              {
                key: "I",
                value: function (e) {
                  var t =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : this;
                  (e = Bi(this, e, t)),
                    Lt(e)
                      ? e === $t || null == e || "" === e
                        ? (this.H !== $t && this.R(), (this.H = $t))
                        : e !== this.H && e !== qt && this.m(e)
                      : void 0 !== e._$litType$
                      ? this._(e)
                      : void 0 !== e.nodeType
                      ? this.$(e)
                      : Ft(e)
                      ? this.g(e)
                      : this.m(e);
                },
              },
              {
                key: "k",
                value: function (e) {
                  var t =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : this.B;
                  return this.A.parentNode.insertBefore(e, t);
                },
              },
              {
                key: "$",
                value: function (e) {
                  this.H !== e && (this.R(), (this.H = this.k(e)));
                },
              },
              {
                key: "m",
                value: function (e) {
                  var t = this.A.nextSibling;
                  null !== t &&
                  3 === t.nodeType &&
                  (null === this.B
                    ? null === t.nextSibling
                    : t === this.B.previousSibling)
                    ? (t.data = e)
                    : this.$(Mt.createTextNode(e)),
                    (this.H = e);
                },
              },
              {
                key: "_",
                value: function (e) {
                  var t,
                    n = e.values,
                    i = e._$litType$,
                    a =
                      "number" == typeof i
                        ? this.C(e)
                        : (void 0 === i.el &&
                            (i.el = Kt.createElement(i.h, this.options)),
                          i);
                  if (
                    (null === (t = this.H) || void 0 === t ? void 0 : t.D) === a
                  )
                    this.H.v(n);
                  else {
                    var r = new Qt(a, this),
                      o = r.u(this.options);
                    r.v(n), this.$(o), (this.H = r);
                  }
                },
              },
              {
                key: "C",
                value: function (e) {
                  var t = Zt.get(e.strings);
                  return void 0 === t && Zt.set(e.strings, (t = new Kt(e))), t;
                },
              },
              {
                key: "g",
                value: function (t) {
                  Ot(this.H) || ((this.H = []), this.R());
                  var n,
                    i,
                    r = this.H,
                    o = 0,
                    s = a(t);
                  try {
                    for (s.s(); !(i = s.n()).done; ) {
                      var l = i.value;
                      o === r.length
                        ? r.push(
                            (n = new e(
                              this.k(At()),
                              this.k(At()),
                              this,
                              this.options
                            ))
                          )
                        : (n = r[o]),
                        n.I(l),
                        o++;
                    }
                  } catch (e) {
                    s.e(e);
                  } finally {
                    s.f();
                  }
                  o < r.length &&
                    (this.R(n && n.B.nextSibling, o), (r.length = o));
                },
              },
              {
                key: "R",
                value: function () {
                  var e,
                    t =
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : this.A.nextSibling,
                    n = arguments.length > 1 ? arguments[1] : void 0;
                  for (
                    null === (e = this.P) ||
                    void 0 === e ||
                    e.call(this, !1, !0, n);
                    t && t !== this.B;

                  ) {
                    var i = t.nextSibling;
                    t.remove(), (t = i);
                  }
                },
              },
            ]),
            e
          );
        })()),
        (en = (function (e) {
          l(a, e);
          var t = s(a);
          function a() {
            var e;
            return n(this, a), ((e = t.apply(this, arguments)).type = 3), e;
          }
          return (
            i(a, [
              {
                key: "W",
                value: function (e) {
                  this.element[this.name] = e === $t ? void 0 : e;
                },
              },
            ]),
            a
          );
        })(
          (Xt = (function () {
            function e(t, i, a, r, o) {
              n(this, e),
                (this.type = 1),
                (this.H = $t),
                (this.N = void 0),
                (this.V = void 0),
                (this.element = t),
                (this.name = i),
                (this.M = r),
                (this.options = o),
                a.length > 2 || "" !== a[0] || "" !== a[1]
                  ? ((this.H = Array(a.length - 1).fill($t)),
                    (this.strings = a))
                  : (this.H = $t);
            }
            return (
              i(e, [
                {
                  key: "tagName",
                  get: function () {
                    return this.element.tagName;
                  },
                },
                {
                  key: "I",
                  value: function (e) {
                    var t =
                        arguments.length > 1 && void 0 !== arguments[1]
                          ? arguments[1]
                          : this,
                      n = arguments.length > 2 ? arguments[2] : void 0,
                      i = arguments.length > 3 ? arguments[3] : void 0,
                      a = this.strings,
                      r = !1;
                    if (void 0 === a)
                      (e = Bi(this, e, t, 0)),
                        (r = !Lt(e) || (e !== this.H && e !== qt)) &&
                          (this.H = e);
                    else {
                      var o,
                        s,
                        l = e;
                      for (e = a[0], o = 0; o < a.length - 1; o++)
                        (s = Bi(this, l[n + o], t, o)) === qt &&
                          (s = this.H[o]),
                          r || (r = !Lt(s) || s !== this.H[o]),
                          s === $t
                            ? (e = $t)
                            : e !== $t &&
                              (e += (null != s ? s : "") + a[o + 1]),
                          (this.H[o] = s);
                    }
                    r && !i && this.W(e);
                  },
                },
                {
                  key: "W",
                  value: function (e) {
                    e === $t
                      ? this.element.removeAttribute(this.name)
                      : this.element.setAttribute(
                          this.name,
                          null != e ? e : ""
                        );
                  },
                },
              ]),
              e
            );
          })())
        )),
        (tn = (function (e) {
          l(a, e);
          var t = s(a);
          function a() {
            var e;
            return n(this, a), ((e = t.apply(this, arguments)).type = 4), e;
          }
          return (
            i(a, [
              {
                key: "W",
                value: function (e) {
                  e && e !== $t
                    ? this.element.setAttribute(this.name, "")
                    : this.element.removeAttribute(this.name);
                },
              },
            ]),
            a
          );
        })(Xt)),
        (nn = (function (e) {
          l(a, e);
          var t = s(a);
          function a() {
            var e;
            return n(this, a), ((e = t.apply(this, arguments)).type = 5), e;
          }
          return (
            i(a, [
              {
                key: "I",
                value: function (e) {
                  var t,
                    n =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : this;
                  if (
                    (e =
                      null !== (t = Bi(this, e, n, 0)) && void 0 !== t
                        ? t
                        : $t) !== qt
                  ) {
                    var i = this.H,
                      a =
                        (e === $t && i !== $t) ||
                        e.capture !== i.capture ||
                        e.once !== i.once ||
                        e.passive !== i.passive,
                      r = e !== $t && (i === $t || a);
                    a && this.element.removeEventListener(this.name, this, i),
                      r && this.element.addEventListener(this.name, this, e),
                      (this.H = e);
                  }
                },
              },
              {
                key: "handleEvent",
                value: function (e) {
                  var t, n;
                  "function" == typeof this.H
                    ? this.H.call(
                        null !==
                          (n =
                            null === (t = this.options) || void 0 === t
                              ? void 0
                              : t.host) && void 0 !== n
                          ? n
                          : this.element,
                        e
                      )
                    : this.H.handleEvent(e);
                },
              },
            ]),
            a
          );
        })(Xt)),
        (an = (function () {
          function e(t, i, a) {
            n(this, e),
              (this.element = t),
              (this.type = 6),
              (this.N = void 0),
              (this.V = void 0),
              (this.M = i),
              (this.options = a);
          }
          return (
            i(e, [
              {
                key: "I",
                value: function (e) {
                  Bi(this, e);
                },
              },
            ]),
            e
          );
        })()),
        null === (xt = (wt = globalThis).litHtmlPlatformSupport) ||
          void 0 === xt ||
          xt.call(wt, Kt, Yt),
        (null !== (St = (Ct = globalThis).litHtmlVersions) && void 0 !== St
          ? St
          : (Ct.litHtmlVersions = [])
        ).push("2.0.0-rc.3"),
        (null !== (rn = (cn = globalThis).litElementVersions) && void 0 !== rn
          ? rn
          : (cn.litElementVersions = [])
        ).push("3.0.0-rc.2"),
        ((dn = (function (e) {
          l(a, e);
          var t = s(a);
          function a() {
            var e;
            return (
              n(this, a),
              ((e = t.apply(this, arguments)).renderOptions = { host: g(e) }),
              (e.Φt = void 0),
              e
            );
          }
          return (
            i(a, [
              {
                key: "createRenderRoot",
                value: function () {
                  var e,
                    t,
                    n = c(u(a.prototype), "createRenderRoot", this).call(this);
                  return (
                    (null !== (e = (t = this.renderOptions).renderBefore) &&
                      void 0 !== e) ||
                      (t.renderBefore = n.firstChild),
                    n
                  );
                },
              },
              {
                key: "update",
                value: function (e) {
                  var t = this.render();
                  c(u(a.prototype), "update", this).call(this, e),
                    (this.Φt = Wt(t, this.renderRoot, this.renderOptions));
                },
              },
              {
                key: "connectedCallback",
                value: function () {
                  var e;
                  c(u(a.prototype), "connectedCallback", this).call(this),
                    null === (e = this.Φt) ||
                      void 0 === e ||
                      e.setConnected(!0);
                },
              },
              {
                key: "disconnectedCallback",
                value: function () {
                  var e;
                  c(u(a.prototype), "disconnectedCallback", this).call(this),
                    null === (e = this.Φt) ||
                      void 0 === e ||
                      e.setConnected(!1);
                },
              },
              {
                key: "render",
                value: function () {
                  return qt;
                },
              },
            ]),
            a
          );
        })(kt)).finalized = !0),
        (dn._$litElement$ = !0),
        null === (sn = (on = globalThis).litElementHydrateSupport) ||
          void 0 === sn ||
          sn.call(on, { LitElement: dn }),
        null === (un = (ln = globalThis).litElementPlatformSupport) ||
          void 0 === un ||
          un.call(ln, { LitElement: dn }),
        function () {
          function e(e) {
            var t = 0;
            return function () {
              return t < e.length ? { done: !1, value: e[t++] } : { done: !0 };
            };
          }
          if (!ShadowRoot.prototype.createElement) {
            var t,
              n = window.HTMLElement,
              i = window.customElements.define,
              a = window.customElements.get,
              r = window.customElements,
              o = new WeakMap(),
              s = new WeakMap(),
              l = new WeakMap(),
              u = new WeakMap();
            (window.CustomElementRegistry = function () {
              (this.l = new Map()),
                (this.o = new Map()),
                (this.i = new Map()),
                (this.h = new Map());
            }),
              (window.CustomElementRegistry.prototype.define = function (t, n) {
                if (((t = t.toLowerCase()), void 0 !== this.j(t)))
                  throw new DOMException(
                    "Failed to execute 'define' on 'CustomElementRegistry': the name \"" +
                      t +
                      '" has already been used with this registry'
                  );
                if (void 0 !== this.o.get(n))
                  throw new DOMException(
                    "Failed to execute 'define' on 'CustomElementRegistry': this constructor has already been used with this registry"
                  );
                var o = n.prototype.attributeChangedCallback,
                  u = new Set(n.observedAttributes || []);
                if (
                  (d(n, u, o),
                  (o = {
                    g: n,
                    connectedCallback: n.prototype.connectedCallback,
                    disconnectedCallback: n.prototype.disconnectedCallback,
                    adoptedCallback: n.prototype.adoptedCallback,
                    attributeChangedCallback: o,
                    observedAttributes: u,
                  }),
                  this.l.set(t, o),
                  this.o.set(n, o),
                  (u = a.call(r, t)) || ((u = c(t)), i.call(r, t, u)),
                  this === window.customElements && (l.set(n, o), (o.s = u)),
                  (u = this.h.get(t)))
                ) {
                  this.h.delete(t);
                  var h =
                    "undefined" != typeof Symbol &&
                    Symbol.iterator &&
                    u[Symbol.iterator];
                  for (
                    u = h ? h.call(u) : { next: e(u) }, h = u.next();
                    !h.done;
                    h = u.next()
                  )
                    (h = h.value), s.delete(h), p(h, o, !0);
                }
                return (
                  void 0 !== (o = this.i.get(t)) &&
                    (o.resolve(n), this.i.delete(t)),
                  n
                );
              }),
              (window.CustomElementRegistry.prototype.upgrade = function () {
                v.push(this), r.upgrade.apply(r, arguments), v.pop();
              }),
              (window.CustomElementRegistry.prototype.get = function (e) {
                var t;
                return null == (t = this.l.get(e)) ? void 0 : t.g;
              }),
              (window.CustomElementRegistry.prototype.j = function (e) {
                return this.l.get(e);
              }),
              (window.CustomElementRegistry.prototype.whenDefined = function (
                e
              ) {
                var t = this.j(e);
                if (void 0 !== t) return Promise.resolve(t.g);
                var n = this.i.get(e);
                return (
                  void 0 === n &&
                    (((n = {}).promise = new Promise(function (e) {
                      return (n.resolve = e);
                    })),
                    this.i.set(e, n)),
                  n.promise
                );
              }),
              (window.CustomElementRegistry.prototype.m = function (e, t, n) {
                var i = this.h.get(t);
                i || this.h.set(t, (i = new Set())), n ? i.add(e) : i.delete(e);
              }),
              (window.HTMLElement = function () {
                var e = t;
                if (e) return (t = void 0), e;
                var i = l.get(this.constructor);
                if (!i)
                  throw new TypeError(
                    "Illegal constructor (custom element class must be registered with global customElements registry to be newable)"
                  );
                return (
                  (e = Reflect.construct(n, [], i.s)),
                  Object.setPrototypeOf(e, this.constructor.prototype),
                  o.set(e, i),
                  e
                );
              }),
              (window.HTMLElement.prototype = n.prototype);
            var c = function (e) {
                function t() {
                  var t = Reflect.construct(n, [], this.constructor);
                  Object.setPrototypeOf(t, HTMLElement.prototype);
                  e: {
                    var i = t.getRootNode();
                    if (!(i === document || i instanceof ShadowRoot)) {
                      if (
                        (i = v[v.length - 1]) instanceof CustomElementRegistry
                      ) {
                        var a = i;
                        break e;
                      }
                      (i = i.getRootNode()) === document ||
                        i instanceof ShadowRoot ||
                        (i =
                          (null == (a = u.get(i)) ? void 0 : a.getRootNode()) ||
                          document);
                    }
                    a = i.customElements;
                  }
                  return (
                    (i = (a = a || window.customElements).j(e))
                      ? p(t, i)
                      : s.set(t, a),
                    t
                  );
                }
                return (
                  (t.prototype.connectedCallback = function () {
                    var t = o.get(this);
                    t
                      ? t.connectedCallback &&
                        t.connectedCallback.apply(this, arguments)
                      : s.get(this).m(this, e, !0);
                  }),
                  (t.prototype.disconnectedCallback = function () {
                    var t = o.get(this);
                    t
                      ? t.disconnectedCallback &&
                        t.disconnectedCallback.apply(this, arguments)
                      : s.get(this).m(this, e, !1);
                  }),
                  (t.prototype.adoptedCallback = function () {
                    var e, t;
                    null == (e = o.get(this)) ||
                      null == (t = e.adoptedCallback) ||
                      t.apply(this, arguments);
                  }),
                  t
                );
              },
              d = function (e, t, n) {
                if (0 !== t.size && void 0 !== n) {
                  var i = e.prototype.setAttribute;
                  i &&
                    (e.prototype.setAttribute = function (e, a) {
                      if (t.has(e)) {
                        var r = this.getAttribute(e);
                        i.call(this, e, a), n.call(this, e, r, a);
                      } else i.call(this, e, a);
                    });
                  var a = e.prototype.removeAttribute;
                  a &&
                    (e.prototype.removeAttribute = function (e) {
                      if (t.has(e)) {
                        var i = this.getAttribute(e);
                        a.call(this, e), n.call(this, e, i, null);
                      } else a.call(this, e);
                    });
                }
              },
              h = function e(t) {
                var i = Object.getPrototypeOf(t);
                if (i !== window.HTMLElement)
                  return i === n
                    ? Object.setPrototypeOf(t, window.HTMLElement)
                    : e(i);
              },
              p = function (e, n, i) {
                (i = void 0 !== i && i),
                  Object.setPrototypeOf(e, n.g.prototype),
                  o.set(e, n),
                  (t = e);
                try {
                  new n.g();
                } catch (e) {
                  h(n.g), new n.g();
                }
                n.observedAttributes.forEach(function (t) {
                  e.hasAttribute(t) &&
                    n.attributeChangedCallback.call(
                      e,
                      t,
                      null,
                      e.getAttribute(t)
                    );
                }),
                  i &&
                    n.connectedCallback &&
                    e.isConnected &&
                    n.connectedCallback.call(e);
              },
              f = Element.prototype.attachShadow;
            Element.prototype.attachShadow = function (e) {
              var t = f.apply(this, arguments);
              return (
                e.customElements && (t.customElements = e.customElements), t
              );
            };
            var v = [document],
              y = function (e, t, n) {
                var i = (n ? Object.getPrototypeOf(n) : e.prototype)[t];
                e.prototype[t] = function () {
                  v.push(this);
                  var e = i.apply(n || this, arguments);
                  return void 0 !== e && u.set(e, this), v.pop(), e;
                };
              };
            y(ShadowRoot, "createElement", document),
              y(ShadowRoot, "importNode", document),
              y(Element, "insertAdjacentHTML");
            var m = function (e) {
              var t = Object.getOwnPropertyDescriptor(e.prototype, "innerHTML");
              Object.defineProperty(
                e.prototype,
                "innerHTML",
                Object.assign({}, t, {
                  set: function (e) {
                    v.push(this), t.set.call(this, e), v.pop();
                  },
                })
              );
            };
            m(Element),
              m(ShadowRoot),
              Object.defineProperty(window, "customElements", {
                value: new CustomElementRegistry(),
                configurable: !0,
                writable: !0,
              });
          }
        }.call(self),
        (hn = new WeakMap()),
        (pn = Ii(function (e) {
          return (function (e) {
            l(a, e);
            var t = s(a);
            function a() {
              var e;
              return (
                n(this, a),
                ((e = t.call(this)).renderOptions = e.renderOptions || void 0),
                e
              );
            }
            return (
              i(
                a,
                [
                  {
                    key: "registry",
                    get: function () {
                      return this.constructor.__registry;
                    },
                    set: function (e) {
                      this.constructor.__registry = e;
                    },
                  },
                  {
                    key: "createRenderRoot",
                    value: function () {
                      var e = this,
                        t = this.constructor,
                        n = t.scopedElements,
                        i = t.shadowRootOptions,
                        a = t.elementStyles;
                      this.registry ||
                        ((this.registry = new CustomElementRegistry()),
                        Object.entries(n).forEach(function (t) {
                          var n = m(t, 2),
                            i = n[0],
                            a = n[1];
                          return e.registry.define(i, a);
                        }));
                      var r = y(
                        y({ mode: "open" }, i),
                        {},
                        { customElements: this.registry }
                      );
                      return (
                        (this.renderOptions.creationScope =
                          this.attachShadow(r)),
                        this.renderOptions.creationScope instanceof
                          ShadowRoot && ht(this.renderOptions.creationScope, a),
                        this.renderOptions.creationScope
                      );
                    },
                  },
                  {
                    key: "defineScopedElement",
                    value: function (e, t) {
                      return this.registry.get(e) || this.registry.define(e, t);
                    },
                  },
                  {
                    key: "getScopedTagName",
                    value: function (e) {
                      return e;
                    },
                  },
                ],
                [
                  {
                    key: "scopedElements",
                    get: function () {
                      return {};
                    },
                  },
                  {
                    key: "shadowRootOptions",
                    get: function () {
                      return this.__shadowRootOptions;
                    },
                    set: function (e) {
                      this.__shadowRootOptions = e;
                    },
                  },
                  {
                    key: "elementStyles",
                    get: function () {
                      return this.__elementStyles;
                    },
                    set: function (e) {
                      this.__elementStyles = e;
                    },
                  },
                  {
                    key: "getScopedTagName",
                    value: function (e) {
                      return e;
                    },
                  },
                ]
              ),
              a
            );
          })(e);
        })),
        (fn = Ii(function (e) {
          return (function (e) {
            l(a, e);
            var t = s(a);
            function a() {
              var e;
              return (
                n(this, a),
                ((e = t.call(this))._requestedToBeDisabled = !1),
                (e.__isUserSettingDisabled = !0),
                (e.__restoreDisabledTo = !1),
                (e.disabled = !1),
                e
              );
            }
            return (
              i(
                a,
                [
                  {
                    key: "makeRequestToBeDisabled",
                    value: function () {
                      !1 === this._requestedToBeDisabled &&
                        ((this._requestedToBeDisabled = !0),
                        (this.__restoreDisabledTo = this.disabled),
                        this.__internalSetDisabled(!0));
                    },
                  },
                  {
                    key: "retractRequestToBeDisabled",
                    value: function () {
                      !0 === this._requestedToBeDisabled &&
                        ((this._requestedToBeDisabled = !1),
                        this.__internalSetDisabled(this.__restoreDisabledTo));
                    },
                  },
                  {
                    key: "__internalSetDisabled",
                    value: function (e) {
                      (this.__isUserSettingDisabled = !1),
                        (this.disabled = e),
                        (this.__isUserSettingDisabled = !0);
                    },
                  },
                  {
                    key: "requestUpdate",
                    value: function (e, t) {
                      c(u(a.prototype), "requestUpdate", this).call(this, e, t),
                        "disabled" === e &&
                          (this.__isUserSettingDisabled &&
                            (this.__restoreDisabledTo = this.disabled),
                          !1 === this.disabled &&
                            !0 === this._requestedToBeDisabled &&
                            this.__internalSetDisabled(!0));
                    },
                  },
                ],
                [
                  {
                    key: "properties",
                    get: function () {
                      return { disabled: { type: Boolean, reflect: !0 } };
                    },
                  },
                ]
              ),
              a
            );
          })(e);
        })),
        (vn = Ii(function (e) {
          return (function (e) {
            l(a, e);
            var t = s(a);
            function a() {
              var e;
              return (
                n(this, a),
                ((e = t.call(this)).__privateSlots = new Set(null)),
                e
              );
            }
            return (
              i(a, [
                {
                  key: "slots",
                  get: function () {
                    return {};
                  },
                },
                {
                  key: "connectedCallback",
                  value: function () {
                    c(u(a.prototype), "connectedCallback", this) &&
                      c(u(a.prototype), "connectedCallback", this).call(this),
                      this._connectSlotMixin();
                  },
                },
                {
                  key: "_connectSlotMixin",
                  value: function () {
                    var e = this;
                    this.__isConnectedSlotMixin ||
                      (Object.keys(this.slots).forEach(function (t) {
                        if (!e.querySelector("[slot=".concat(t, "]"))) {
                          var n = (0, e.slots[t])();
                          n instanceof Element &&
                            (n.setAttribute("slot", t),
                            e.appendChild(n),
                            e.__privateSlots.add(t));
                        }
                      }),
                      (this.__isConnectedSlotMixin = !0));
                  },
                },
                {
                  key: "_isPrivateSlot",
                  value: function (e) {
                    return this.__privateSlots.has(e);
                  },
                },
              ]),
              a
            );
          })(e);
        })),
        (yn = {
          isIE11: /Trident/.test(window.navigator.userAgent),
          isChrome: ji(),
          isIOSChrome: ji("ios"),
          isChromium: ji("chromium"),
          isMac: -1 !== navigator.appVersion.indexOf("Mac"),
        }),
        (mn = window),
        (gn = new WeakMap()),
        (_n = Ii(function (e) {
          return (function (e) {
            l(a, e);
            var t = s(a);
            function a() {
              var e;
              return (
                n(this, a),
                ((e = t.call(this)).focused = !1),
                (e.focusedVisible = !1),
                e
              );
            }
            return (
              i(
                a,
                [
                  {
                    key: "connectedCallback",
                    value: function () {
                      c(u(a.prototype), "connectedCallback", this).call(this),
                        this.__registerEventsForFocusMixin();
                    },
                  },
                  {
                    key: "disconnectedCallback",
                    value: function () {
                      c(u(a.prototype), "disconnectedCallback", this).call(
                        this
                      ),
                        this.__teardownEventsForFocusMixin();
                    },
                  },
                  {
                    key: "focus",
                    value: function () {
                      var e;
                      null === (e = this._focusableNode) ||
                        void 0 === e ||
                        e.focus();
                    },
                  },
                  {
                    key: "blur",
                    value: function () {
                      var e;
                      null === (e = this._focusableNode) ||
                        void 0 === e ||
                        e.blur();
                    },
                  },
                  {
                    key: "_focusableNode",
                    get: function () {
                      return this._inputNode || document.createElement("input");
                    },
                  },
                  {
                    key: "__onFocus",
                    value: function () {
                      if (
                        ((this.focused = !0),
                        "function" == typeof mn.applyFocusVisiblePolyfill)
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
                    },
                  },
                  {
                    key: "__onBlur",
                    value: function () {
                      (this.focused = !1), (this.focusedVisible = !1);
                    },
                  },
                  {
                    key: "__registerEventsForFocusMixin",
                    value: function () {
                      var e,
                        t = this;
                      (e = this.getRootNode()),
                        mn.applyFocusVisiblePolyfill &&
                          !gn.has(e) &&
                          (mn.applyFocusVisiblePolyfill(e), gn.set(e, void 0)),
                        (this.__redispatchFocus = function (e) {
                          e.stopPropagation(),
                            t.dispatchEvent(new Event("focus"));
                        }),
                        this._focusableNode.addEventListener(
                          "focus",
                          this.__redispatchFocus
                        ),
                        (this.__redispatchBlur = function (e) {
                          e.stopPropagation(),
                            t.dispatchEvent(new Event("blur"));
                        }),
                        this._focusableNode.addEventListener(
                          "blur",
                          this.__redispatchBlur
                        ),
                        (this.__redispatchFocusin = function (e) {
                          e.stopPropagation(),
                            t.__onFocus(),
                            t.dispatchEvent(
                              new Event("focusin", {
                                bubbles: !0,
                                composed: !0,
                              })
                            );
                        }),
                        this._focusableNode.addEventListener(
                          "focusin",
                          this.__redispatchFocusin
                        ),
                        (this.__redispatchFocusout = function (e) {
                          e.stopPropagation(),
                            t.__onBlur(),
                            t.dispatchEvent(
                              new Event("focusout", {
                                bubbles: !0,
                                composed: !0,
                              })
                            );
                        }),
                        this._focusableNode.addEventListener(
                          "focusout",
                          this.__redispatchFocusout
                        );
                    },
                  },
                  {
                    key: "__teardownEventsForFocusMixin",
                    value: function () {
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
                    },
                  },
                ],
                [
                  {
                    key: "properties",
                    get: function () {
                      return {
                        focused: { type: Boolean, reflect: !0 },
                        focusedVisible: {
                          type: Boolean,
                          reflect: !0,
                          attribute: "focused-visible",
                        },
                      };
                    },
                  },
                ]
              ),
              a
            );
          })(e);
        })),
        (bn = [
          Node.DOCUMENT_POSITION_PRECEDING,
          Node.DOCUMENT_POSITION_CONTAINS,
          Node.DOCUMENT_POSITION_CONTAINS | Node.DOCUMENT_POSITION_PRECEDING,
        ]),
        (kn = (function () {
          function e(t) {
            n(this, e), (this.type = "unparseable"), (this.viewValue = t);
          }
          return (
            i(e, [
              {
                key: "toString",
                value: function () {
                  return JSON.stringify({
                    type: this.type,
                    viewValue: this.viewValue,
                  });
                },
              },
            ]),
            e
          );
        })()),
        (wn = Ii(function (e) {
          return (function (e) {
            l(a, e);
            var t = s(a);
            function a() {
              var e;
              return (
                n(this, a), ((e = t.call(this))._parentFormGroup = void 0), e
              );
            }
            return (
              i(a, [
                {
                  key: "connectedCallback",
                  value: function () {
                    c(u(a.prototype), "connectedCallback", this).call(this),
                      this.dispatchEvent(
                        new CustomEvent("form-element-register", {
                          detail: { element: this },
                          bubbles: !0,
                        })
                      );
                  },
                },
                {
                  key: "disconnectedCallback",
                  value: function () {
                    c(u(a.prototype), "disconnectedCallback", this).call(this),
                      this._parentFormGroup &&
                        this._parentFormGroup.removeFormElement(this);
                  },
                },
              ]),
              a
            );
          })(e);
        })),
        function (e) {
          return e;
        },
        (Rn = Ii(function (e) {
          return (function (e) {
            l(a, e);
            var t = s(a);
            function a() {
              var e, i;
              return (
                n(this, a),
                ((e = t.call(this)).name = ""),
                (e.readOnly = !1),
                (e.label = ""),
                (e.helpText = ""),
                (e._inputId =
                  ((i = e.localName),
                  ""
                    .concat(i, "-")
                    .concat(Math.random().toString(36).substr(2, 10)))),
                (e._ariaLabelledNodes = []),
                (e._ariaDescribedNodes = []),
                (e._repropagationRole = "child"),
                (e._isRepropagationEndpoint = !1),
                e.addEventListener(
                  "model-value-changed",
                  e.__repropagateChildrenValues
                ),
                (e._onLabelClick = e._onLabelClick.bind(g(e))),
                e
              );
            }
            return (
              i(
                a,
                [
                  {
                    key: "label",
                    get: function () {
                      return (
                        this.__label ||
                        (this._labelNode && this._labelNode.textContent) ||
                        ""
                      );
                    },
                    set: function (e) {
                      var t = this.label;
                      (this.__label = e), this.requestUpdate("label", t);
                    },
                  },
                  {
                    key: "helpText",
                    get: function () {
                      return (
                        this.__helpText ||
                        (this._helpTextNode &&
                          this._helpTextNode.textContent) ||
                        ""
                      );
                    },
                    set: function (e) {
                      var t = this.helpText;
                      (this.__helpText = e), this.requestUpdate("helpText", t);
                    },
                  },
                  {
                    key: "fieldName",
                    get: function () {
                      return this.__fieldName || this.label || this.name || "";
                    },
                    set: function (e) {
                      this.__fieldName = e;
                    },
                  },
                  {
                    key: "slots",
                    get: function () {
                      var e = this;
                      return y(
                        y({}, c(u(a.prototype), "slots", this)),
                        {},
                        {
                          label: function () {
                            var t = document.createElement("label");
                            return (t.textContent = e.label), t;
                          },
                          "help-text": function () {
                            var t = document.createElement("div");
                            return (t.textContent = e.helpText), t;
                          },
                        }
                      );
                    },
                  },
                  {
                    key: "_inputNode",
                    get: function () {
                      return this.__getDirectSlotChild("input");
                    },
                  },
                  {
                    key: "_labelNode",
                    get: function () {
                      return this.__getDirectSlotChild("label");
                    },
                  },
                  {
                    key: "_helpTextNode",
                    get: function () {
                      return this.__getDirectSlotChild("help-text");
                    },
                  },
                  {
                    key: "_feedbackNode",
                    get: function () {
                      return this.__getDirectSlotChild("feedback");
                    },
                  },
                  {
                    key: "connectedCallback",
                    value: function () {
                      c(u(a.prototype), "connectedCallback", this).call(this),
                        this._enhanceLightDomClasses(),
                        this._enhanceLightDomA11y(),
                        this._triggerInitialModelValueChangedEvent(),
                        this._labelNode &&
                          this._labelNode.addEventListener(
                            "click",
                            this._onLabelClick
                          );
                    },
                  },
                  {
                    key: "disconnectedCallback",
                    value: function () {
                      c(u(a.prototype), "disconnectedCallback", this).call(
                        this
                      ),
                        this._labelNode &&
                          this._labelNode.removeEventListener(
                            "click",
                            this._onLabelClick
                          );
                    },
                  },
                  {
                    key: "updated",
                    value: function (e) {
                      c(u(a.prototype), "updated", this).call(this, e),
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
                              detail: {
                                oldName: e.get("name"),
                                newName: this.name,
                              },
                              bubbles: !0,
                            })
                          );
                    },
                  },
                  {
                    key: "_triggerInitialModelValueChangedEvent",
                    value: function () {
                      this._dispatchInitialModelValueChangedEvent();
                    },
                  },
                  {
                    key: "_enhanceLightDomClasses",
                    value: function () {
                      this._inputNode &&
                        this._inputNode.classList.add("form-control");
                    },
                  },
                  {
                    key: "_enhanceLightDomA11y",
                    value: function () {
                      var e = this._inputNode,
                        t = this._labelNode,
                        n = this._helpTextNode,
                        i = this._feedbackNode;
                      e && (e.id = e.id || this._inputId),
                        t &&
                          (t.setAttribute("for", this._inputId),
                          this.addToAriaLabelledBy(t, { idPrefix: "label" })),
                        n &&
                          this.addToAriaDescribedBy(n, {
                            idPrefix: "help-text",
                          }),
                        i &&
                          (this.addEventListener("focusin", function () {
                            i.setAttribute("aria-live", "polite");
                          }),
                          this.addEventListener("focusout", function () {
                            i.setAttribute("aria-live", "assertive");
                          }),
                          this.addToAriaDescribedBy(i, {
                            idPrefix: "feedback",
                          })),
                        this._enhanceLightDomA11yForAdditionalSlots();
                    },
                  },
                  {
                    key: "_enhanceLightDomA11yForAdditionalSlots",
                    value: function () {
                      var e = this,
                        t =
                          arguments.length > 0 && void 0 !== arguments[0]
                            ? arguments[0]
                            : ["prefix", "suffix", "before", "after"];
                      t.forEach(function (t) {
                        var n = e.__getDirectSlotChild(t);
                        n &&
                          (n.hasAttribute("data-label") &&
                            e.addToAriaLabelledBy(n, { idPrefix: t }),
                          n.hasAttribute("data-description") &&
                            e.addToAriaDescribedBy(n, { idPrefix: t }));
                      });
                    },
                  },
                  {
                    key: "__reflectAriaAttr",
                    value: function (e, t, n) {
                      var i = this;
                      if (this._inputNode) {
                        if (n) {
                          var a = t.filter(function (e) {
                              return i.contains(e);
                            }),
                            o = t.filter(function (e) {
                              return !i.contains(e);
                            });
                          t = [].concat(
                            r(
                              (function (e) {
                                var t = (
                                    arguments.length > 1 &&
                                    void 0 !== arguments[1]
                                      ? arguments[1]
                                      : {}
                                  ).reverse,
                                  n = function (e, t) {
                                    var n = e.compareDocumentPosition(t);
                                    return bn.includes(n)
                                      ? yn.isIE11
                                        ? -1
                                        : 1
                                      : yn.isIE11
                                      ? 1
                                      : -1;
                                  },
                                  i = e.filter(function (e) {
                                    return e;
                                  });
                                return i.sort(n), t && i.reverse(), i;
                              })(a)
                            ),
                            r(o)
                          );
                        }
                        var s = t
                          .map(function (e) {
                            return e.id;
                          })
                          .join(" ");
                        this._inputNode.setAttribute(e, s);
                      }
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      return zt(
                        xn ||
                          (xn =
                            b ||
                            (b = f([
                              '\n        <div class="form-field__group-one">',
                              '</div>\n        <div class="form-field__group-two">',
                              "</div>\n      ",
                            ]))),
                        this._groupOneTemplate(),
                        this._groupTwoTemplate()
                      );
                    },
                  },
                  {
                    key: "_groupOneTemplate",
                    value: function () {
                      return zt(
                        Sn || (Sn = k || (k = f([" ", " ", " "]))),
                        this._labelTemplate(),
                        this._helpTextTemplate()
                      );
                    },
                  },
                  {
                    key: "_groupTwoTemplate",
                    value: function () {
                      return zt(
                        Cn || (Cn = w || (w = f([" ", " ", " "]))),
                        this._inputGroupTemplate(),
                        this._feedbackTemplate()
                      );
                    },
                  },
                  {
                    key: "_labelTemplate",
                    value: function () {
                      return zt(
                        En ||
                          (En =
                            x ||
                            (x = f([
                              '\n        <div class="form-field__label">\n          <slot name="label"></slot>\n        </div>\n      ',
                            ])))
                      );
                    },
                  },
                  {
                    key: "_helpTextTemplate",
                    value: function () {
                      return zt(
                        Nn ||
                          (Nn =
                            S ||
                            (S = f([
                              '\n        <small class="form-field__help-text">\n          <slot name="help-text"></slot>\n        </small>\n      ',
                            ])))
                      );
                    },
                  },
                  {
                    key: "_inputGroupTemplate",
                    value: function () {
                      return zt(
                        Tn ||
                          (Tn =
                            C ||
                            (C = f([
                              '\n        <div class="input-group">\n          ',
                              '\n          <div class="input-group__container">\n            ',
                              " ",
                              "\n            ",
                              "\n          </div>\n          ",
                              "\n        </div>\n      ",
                            ]))),
                        this._inputGroupBeforeTemplate(),
                        this._inputGroupPrefixTemplate(),
                        this._inputGroupInputTemplate(),
                        this._inputGroupSuffixTemplate(),
                        this._inputGroupAfterTemplate()
                      );
                    },
                  },
                  {
                    key: "_inputGroupBeforeTemplate",
                    value: function () {
                      return zt(
                        Vn ||
                          (Vn =
                            E ||
                            (E = f([
                              '\n        <div class="input-group__before">\n          <slot name="before"></slot>\n        </div>\n      ',
                            ])))
                      );
                    },
                  },
                  {
                    key: "_inputGroupPrefixTemplate",
                    value: function () {
                      return Array.from(this.children).find(function (e) {
                        return "prefix" === e.slot;
                      })
                        ? zt(
                            Pn ||
                              (Pn =
                                N ||
                                (N = f([
                                  '\n            <div class="input-group__prefix">\n              <slot name="prefix"></slot>\n            </div>\n          ',
                                ])))
                          )
                        : $t;
                    },
                  },
                  {
                    key: "_inputGroupInputTemplate",
                    value: function () {
                      return zt(
                        Mn ||
                          (Mn =
                            T ||
                            (T = f([
                              '\n        <div class="input-group__input">\n          <slot name="input"></slot>\n        </div>\n      ',
                            ])))
                      );
                    },
                  },
                  {
                    key: "_inputGroupSuffixTemplate",
                    value: function () {
                      return Array.from(this.children).find(function (e) {
                        return "suffix" === e.slot;
                      })
                        ? zt(
                            An ||
                              (An =
                                V ||
                                (V = f([
                                  '\n            <div class="input-group__suffix">\n              <slot name="suffix"></slot>\n            </div>\n          ',
                                ])))
                          )
                        : $t;
                    },
                  },
                  {
                    key: "_inputGroupAfterTemplate",
                    value: function () {
                      return zt(
                        Ln ||
                          (Ln =
                            P ||
                            (P = f([
                              '\n        <div class="input-group__after">\n          <slot name="after"></slot>\n        </div>\n      ',
                            ])))
                      );
                    },
                  },
                  {
                    key: "_feedbackTemplate",
                    value: function () {
                      return zt(
                        On ||
                          (On =
                            M ||
                            (M = f([
                              '\n        <div class="form-field__feedback">\n          <slot name="feedback"></slot>\n        </div>\n      ',
                            ])))
                      );
                    },
                  },
                  {
                    key: "_isEmpty",
                    value: function () {
                      var e =
                          arguments.length > 0 && void 0 !== arguments[0]
                            ? arguments[0]
                            : this.modelValue,
                        t = e;
                      if (
                        (this.modelValue instanceof kn &&
                          (t = this.modelValue.viewValue),
                        "object" === o(t) && null !== t && !(t instanceof Date))
                      )
                        return !Object.keys(t).length;
                      var n =
                          "number" == typeof t && (0 === t || Number.isNaN(t)),
                        i = "boolean" == typeof t && !1 === t;
                      return !t && !n && !i;
                    },
                  },
                  {
                    key: "_getAriaDescriptionElements",
                    value: function () {
                      return [this._helpTextNode, this._feedbackNode];
                    },
                  },
                  {
                    key: "addToAriaLabelledBy",
                    value: function (e) {
                      var t =
                          arguments.length > 1 && void 0 !== arguments[1]
                            ? arguments[1]
                            : {},
                        n = t.idPrefix,
                        i = void 0 === n ? "" : n,
                        a = t.reorder,
                        o = void 0 === a || a;
                      (e.id = e.id || "".concat(i, "-").concat(this._inputId)),
                        this._ariaLabelledNodes.includes(e) ||
                          ((this._ariaLabelledNodes = [].concat(
                            r(this._ariaLabelledNodes),
                            [e]
                          )),
                          (this.__reorderAriaLabelledNodes = Boolean(o)));
                    },
                  },
                  {
                    key: "removeFromAriaLabelledBy",
                    value: function (e) {
                      this._ariaLabelledNodes.includes(e) &&
                        (this._ariaLabelledNodes.splice(
                          this._ariaLabelledNodes.indexOf(e),
                          1
                        ),
                        (this._ariaLabelledNodes = r(this._ariaLabelledNodes)),
                        (this.__reorderAriaLabelledNodes = !1));
                    },
                  },
                  {
                    key: "addToAriaDescribedBy",
                    value: function (e) {
                      var t =
                          arguments.length > 1 && void 0 !== arguments[1]
                            ? arguments[1]
                            : {},
                        n = t.idPrefix,
                        i = void 0 === n ? "" : n,
                        a = t.reorder,
                        o = void 0 === a || a;
                      (e.id = e.id || "".concat(i, "-").concat(this._inputId)),
                        this._ariaDescribedNodes.includes(e) ||
                          ((this._ariaDescribedNodes = [].concat(
                            r(this._ariaDescribedNodes),
                            [e]
                          )),
                          (this.__reorderAriaDescribedNodes = Boolean(o)));
                    },
                  },
                  {
                    key: "removeFromAriaDescribedBy",
                    value: function (e) {
                      this._ariaDescribedNodes.includes(e) &&
                        (this._ariaDescribedNodes.splice(
                          this._ariaDescribedNodes.indexOf(e),
                          1
                        ),
                        (this._ariaDescribedNodes = r(
                          this._ariaDescribedNodes
                        )),
                        (this.__reorderAriaLabelledNodes = !1));
                    },
                  },
                  {
                    key: "__getDirectSlotChild",
                    value: function (e) {
                      return Array.from(this.children).find(function (t) {
                        return t.slot === e;
                      });
                    },
                  },
                  {
                    key: "_dispatchInitialModelValueChangedEvent",
                    value: function () {
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
                    },
                  },
                  {
                    key: "_onBeforeRepropagateChildrenValues",
                    value: function (e) {},
                  },
                  {
                    key: "__repropagateChildrenValues",
                    value: function (e) {
                      var t;
                      this._onBeforeRepropagateChildrenValues(e);
                      var n = (e.detail && e.detail.element) || e.target,
                        i =
                          this._isRepropagationEndpoint ||
                          "choice-group" === this._repropagationRole;
                      if (n !== this) {
                        e.stopImmediatePropagation();
                        var a =
                            "child" !== this._repropagationRole &&
                            !this.__repropagateChildrenInitialized,
                          o = e.detail && e.detail.initialize;
                        if (!a && !o && this._repropagationCondition(n)) {
                          var s = [];
                          i || (s = (e.detail && e.detail.formPath) || [n]);
                          var l = [].concat(r(s), [this]);
                          this.dispatchEvent(
                            new CustomEvent("model-value-changed", {
                              bubbles: !0,
                              detail: {
                                formPath: l,
                                isTriggeredByUser: Boolean(
                                  null === (t = e.detail) || void 0 === t
                                    ? void 0
                                    : t.isTriggeredByUser
                                ),
                              },
                            })
                          );
                        }
                      }
                    },
                  },
                  {
                    key: "_repropagationCondition",
                    value: function (e) {
                      return Boolean(e);
                    },
                  },
                  { key: "_onLabelClick", value: function () {} },
                ],
                [
                  {
                    key: "properties",
                    get: function () {
                      return {
                        name: { type: String, reflect: !0 },
                        readOnly: {
                          type: Boolean,
                          attribute: "readonly",
                          reflect: !0,
                        },
                        label: String,
                        helpText: { type: String, attribute: "help-text" },
                        modelValue: { attribute: !1 },
                        _ariaLabelledNodes: { attribute: !1 },
                        _ariaDescribedNodes: { attribute: !1 },
                        _repropagationRole: { attribute: !1 },
                        _isRepropagationEndpoint: { attribute: !1 },
                      };
                    },
                  },
                  {
                    key: "styles",
                    get: function () {
                      return [
                        dt(
                          Fn ||
                            (Fn =
                              A ||
                              (A = f([
                                "\n          /**********************\n            {block} .form-field\n           ********************/\n\n          :host {\n            display: block;\n          }\n\n          :host([hidden]) {\n            display: none;\n          }\n\n          :host([disabled]) {\n            pointer-events: none;\n          }\n\n          :host([disabled]) .form-field__label ::slotted(*),\n          :host([disabled]) .form-field__help-text ::slotted(*) {\n            color: var(--disabled-text-color, #767676);\n          }\n\n          /***********************\n            {block} .input-group\n           *********************/\n\n          .input-group__container {\n            display: flex;\n          }\n\n          .input-group__input {\n            flex: 1;\n            display: flex;\n          }\n\n          /***** {state} :disabled *****/\n          :host([disabled]) .input-group ::slotted([slot='input']) {\n            color: var(--disabled-text-color, #767676);\n          }\n\n          /***********************\n            {block} .form-control\n           **********************/\n\n          .input-group__container > .input-group__input ::slotted(.form-control) {\n            flex: 1 1 auto;\n            margin: 0; /* remove input margin in Safari */\n            font-size: 100%; /* normalize default input font-size */\n          }\n        ",
                              ])))
                        ),
                      ];
                    },
                  },
                ]
              ),
              a
            );
          })(wn(fn(vn(e))));
        })),
        (Un = Symbol.for("lion::SingletonManagerClassStorage")),
        (Dn = new ((function () {
          function e() {
            n(this, e),
              (this._map = window[Un] ? window[Un] : (window[Un] = new Map()));
          }
          return (
            i(e, [
              {
                key: "set",
                value: function (e, t) {
                  this.has(e) || this._map.set(e, t);
                },
              },
              {
                key: "get",
                value: function (e) {
                  return this._map.get(e);
                },
              },
              {
                key: "has",
                value: function (e) {
                  return this._map.has(e);
                },
              },
            ]),
            e
          );
        })())()),
        (In = "narrow"),
        (qn = {
          number: {
            decimal: { style: "decimal" },
            integer: { style: "decimal", maximumFractionDigits: 0 },
            currency: { style: "currency", currency: "USD" },
            percent: { style: "percent" },
            default: { style: "decimal" },
          },
          date: {
            short: { month: (jn = "numeric"), day: jn, year: (zn = "2-digit") },
            medium: { month: (Bn = "short"), day: jn, year: jn },
            long: { month: (Hn = "long"), day: jn, year: jn },
            full: { month: Hn, day: jn, year: jn, weekday: Hn },
            default: { month: Bn, day: jn, year: jn },
          },
          time: {
            short: { hour: jn, minute: jn },
            medium: { hour: jn, minute: jn, second: jn },
            long: { hour: jn, minute: jn, second: jn, timeZoneName: Bn },
            full: { hour: jn, minute: jn, second: jn, timeZoneName: Bn },
            default: { hour: jn, minute: jn, second: jn },
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
                n = e.match(/\b[A-Z]{3}\b/i),
                i = e.replace(/[^¤]/g, "").length;
              if (
                (!i && n && (i = 1),
                i
                  ? ((t.style = "currency"),
                    (t.currencyDisplay =
                      1 === i ? "symbol" : 2 === i ? "code" : "name"),
                    (t.currency = n ? n[0].toUpperCase() : "USD"))
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
                  (t.maximumSignificantDigits = Math.min(
                    Math.max(a.length, 1),
                    21
                  ));
              } else {
                for (
                  var r = e.replace(/[^#0.]/g, "").split("."),
                    o = r[0],
                    s = o.length - 1;
                  "0" === o[s];

                )
                  --s;
                t.minimumIntegerDigits = Math.min(
                  Math.max(o.length - 1 - s, 1),
                  21
                );
                var l = r[1] || "";
                for (s = 0; "0" === l[s]; ) ++s;
                for (
                  t.minimumFractionDigits = Math.min(Math.max(s, 0), 20);
                  "#" === l[s];

                )
                  ++s;
                t.maximumFractionDigits = Math.min(Math.max(s, 0), 20);
              }
              return t;
            }
          },
          parseDatePattern: function (e) {
            if (e) {
              for (var t = {}, n = 0; n < e.length; ) {
                for (var i = e[n], a = 1; e[++n] === i; ) ++a;
                switch (i) {
                  case "G":
                    t.era = 5 === a ? In : 4 === a ? Hn : Bn;
                    break;
                  case "y":
                  case "Y":
                    t.year = 2 === a ? zn : jn;
                    break;
                  case "M":
                  case "L":
                    (a = Math.min(Math.max(a - 1, 0), 4)),
                      (t.month = [jn, zn, Bn, Hn, In][a]);
                    break;
                  case "E":
                  case "e":
                  case "c":
                    t.weekday = 5 === a ? In : 4 === a ? Hn : Bn;
                    break;
                  case "d":
                  case "D":
                    t.day = 2 === a ? zn : jn;
                    break;
                  case "h":
                  case "K":
                    (t.hour12 = !0), (t.hour = 2 === a ? zn : jn);
                    break;
                  case "H":
                  case "k":
                    (t.hour12 = !1), (t.hour = 2 === a ? zn : jn);
                    break;
                  case "m":
                    t.minute = 2 === a ? zn : jn;
                    break;
                  case "s":
                  case "S":
                    t.second = 2 === a ? zn : jn;
                    break;
                  case "z":
                  case "Z":
                  case "v":
                  case "V":
                    t.timeZoneName = 1 === a ? Bn : Hn;
                }
              }
              return Object.keys(t).length ? t : void 0;
            }
          },
        }),
        ($n = function (e, t) {
          if ("string" == typeof e && t[e]) return e;
          for (var n = [].concat(e || []), i = 0, a = n.length; i < a; ++i)
            for (var r = n[i].split("-"); r.length; ) {
              var o = r.join("-");
              if (t[o]) return o;
              r.pop();
            }
        }),
        (Zn = "zero"),
        (Wn = "one"),
        (Gn = "two"),
        (Jn = "few"),
        (Kn = "many"),
        (Qn = "other"),
        (Xn = {
          af: {
            cardinal: (Yn = [
              function (e) {
                return 1 === +e ? Wn : Qn;
              },
              function (e) {
                var t = +e;
                return 0 <= t && t <= 1 ? Wn : Qn;
              },
              function (e) {
                return 0 === Math.floor(Math.abs(+e)) || 1 === +e ? Wn : Qn;
              },
              function (e) {
                var t = +e;
                return 0 === t
                  ? Zn
                  : 1 === t
                  ? Wn
                  : 2 === t
                  ? Gn
                  : 3 <= t % 100 && t % 100 <= 10
                  ? Jn
                  : 11 <= t % 100 && t % 100 <= 99
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = (e + ".").split(".")[1].length;
                return 1 === t && 0 === n ? Wn : Qn;
              },
              function (e) {
                var t = +e;
                return t % 10 == 1 && t % 100 != 11
                  ? Wn
                  : 2 <= t % 10 && t % 10 <= 4 && (t % 100 < 12 || 14 < t % 100)
                  ? Jn
                  : t % 10 == 0 ||
                    (5 <= t % 10 && t % 10 <= 9) ||
                    (11 <= t % 100 && t % 100 <= 14)
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return t % 10 == 1 &&
                  t % 100 != 11 &&
                  t % 100 != 71 &&
                  t % 100 != 91
                  ? Wn
                  : t % 10 == 2 &&
                    t % 100 != 12 &&
                    t % 100 != 72 &&
                    t % 100 != 92
                  ? Gn
                  : ((3 <= t % 10 && t % 10 <= 4) || t % 10 == 9) &&
                    (t % 100 < 10 || 19 < t % 100) &&
                    (t % 100 < 70 || 79 < t % 100) &&
                    (t % 100 < 90 || 99 < t % 100)
                  ? Jn
                  : 0 !== t && t % 1e6 == 0
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = (e + ".").split(".")[1].length,
                  i = +(e + ".").split(".")[1];
                return (0 === n && t % 10 == 1 && t % 100 != 11) ||
                  (i % 10 == 1 && i % 100 != 11)
                  ? Wn
                  : (0 === n &&
                      2 <= t % 10 &&
                      t % 10 <= 4 &&
                      (t % 100 < 12 || 14 < t % 100)) ||
                    (2 <= i % 10 &&
                      i % 10 <= 4 &&
                      (i % 100 < 12 || 14 < i % 100))
                  ? Jn
                  : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = (e + ".").split(".")[1].length;
                return 1 === t && 0 === n
                  ? Wn
                  : 2 <= t && t <= 4 && 0 === n
                  ? Jn
                  : 0 !== n
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return 0 === t
                  ? Zn
                  : 1 === t
                  ? Wn
                  : 2 === t
                  ? Gn
                  : 3 === t
                  ? Jn
                  : 6 === t
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = +("" + e).replace(/^[^.]*.?|0+$/g, "");
                return 1 === +e || (0 !== n && (0 === t || 1 === t)) ? Wn : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = (e + ".").split(".")[1].length,
                  i = +(e + ".").split(".")[1];
                return (0 === n && t % 100 == 1) || i % 100 == 1
                  ? Wn
                  : (0 === n && t % 100 == 2) || i % 100 == 2
                  ? Gn
                  : (0 === n && 3 <= t % 100 && t % 100 <= 4) ||
                    (3 <= i % 100 && i % 100 <= 4)
                  ? Jn
                  : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e));
                return 0 === t || 1 === t ? Wn : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = (e + ".").split(".")[1].length,
                  i = +(e + ".").split(".")[1];
                return (0 === n && (1 === t || 2 === t || 3 === t)) ||
                  (0 === n && t % 10 != 4 && t % 10 != 6 && t % 10 != 9) ||
                  (0 !== n && i % 10 != 4 && i % 10 != 6 && i % 10 != 9)
                  ? Wn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return 1 === t
                  ? Wn
                  : 2 === t
                  ? Gn
                  : 3 <= t && t <= 6
                  ? Jn
                  : 7 <= t && t <= 10
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return 1 === t || 11 === t
                  ? Wn
                  : 2 === t || 12 === t
                  ? Gn
                  : (3 <= t && t <= 10) || (13 <= t && t <= 19)
                  ? Jn
                  : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = (e + ".").split(".")[1].length;
                return 0 === n && t % 10 == 1
                  ? Wn
                  : 0 === n && t % 10 == 2
                  ? Gn
                  : 0 !== n ||
                    (t % 100 != 0 &&
                      t % 100 != 20 &&
                      t % 100 != 40 &&
                      t % 100 != 60 &&
                      t % 100 != 80)
                  ? 0 !== n
                    ? Kn
                    : Qn
                  : Jn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = (e + ".").split(".")[1].length,
                  i = +e;
                return 1 === t && 0 === n
                  ? Wn
                  : 2 === t && 0 === n
                  ? Gn
                  : 0 === n && (i < 0 || 10 < i) && i % 10 == 0
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = +("" + e).replace(/^[^.]*.?|0+$/g, "");
                return (0 === n && t % 10 == 1 && t % 100 != 11) || 0 !== n
                  ? Wn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return 1 === t ? Wn : 2 === t ? Gn : Qn;
              },
              function (e) {
                var t = +e;
                return 0 === t ? Zn : 1 === t ? Wn : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = +e;
                return 0 === n ? Zn : (0 !== t && 1 !== t) || 0 === n ? Qn : Wn;
              },
              function (e) {
                var t = +(e + ".").split(".")[1],
                  n = +e;
                return n % 10 == 1 && (n % 100 < 11 || 19 < n % 100)
                  ? Wn
                  : 2 <= n % 10 && n % 10 <= 9 && (n % 100 < 11 || 19 < n % 100)
                  ? Jn
                  : 0 !== t
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = (e + ".").split(".")[1].length,
                  n = +(e + ".").split(".")[1],
                  i = +e;
                return i % 10 == 0 ||
                  (11 <= i % 100 && i % 100 <= 19) ||
                  (2 === t && 11 <= n % 100 && n % 100 <= 19)
                  ? Zn
                  : (i % 10 == 1 && i % 100 != 11) ||
                    (2 === t && n % 10 == 1 && n % 100 != 11) ||
                    (2 !== t && n % 10 == 1)
                  ? Wn
                  : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = (e + ".").split(".")[1].length,
                  i = +(e + ".").split(".")[1];
                return (0 === n && t % 10 == 1 && t % 100 != 11) ||
                  (i % 10 == 1 && i % 100 != 11)
                  ? Wn
                  : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = (e + ".").split(".")[1].length,
                  i = +e;
                return 1 === t && 0 === n
                  ? Wn
                  : 0 !== n ||
                    0 === i ||
                    (1 !== i && 1 <= i % 100 && i % 100 <= 19)
                  ? Jn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return 1 === t
                  ? Wn
                  : 0 === t || (2 <= t % 100 && t % 100 <= 10)
                  ? Jn
                  : 11 <= t % 100 && t % 100 <= 19
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = (e + ".").split(".")[1].length;
                return 1 === t && 0 === n
                  ? Wn
                  : 0 === n &&
                    2 <= t % 10 &&
                    t % 10 <= 4 &&
                    (t % 100 < 12 || 14 < t % 100)
                  ? Jn
                  : (0 === n && 1 !== t && 0 <= t % 10 && t % 10 <= 1) ||
                    (0 === n && 5 <= t % 10 && t % 10 <= 9) ||
                    (0 === n && 12 <= t % 100 && t % 100 <= 14)
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e));
                return 0 <= t && t <= 1 ? Wn : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = (e + ".").split(".")[1].length;
                return 0 === n && t % 10 == 1 && t % 100 != 11
                  ? Wn
                  : 0 === n &&
                    2 <= t % 10 &&
                    t % 10 <= 4 &&
                    (t % 100 < 12 || 14 < t % 100)
                  ? Jn
                  : (0 === n && t % 10 == 0) ||
                    (0 === n && 5 <= t % 10 && t % 10 <= 9) ||
                    (0 === n && 11 <= t % 100 && t % 100 <= 14)
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return 0 === Math.floor(Math.abs(+e)) || 1 === t
                  ? Wn
                  : 2 <= t && t <= 10
                  ? Jn
                  : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = +(e + ".").split(".")[1],
                  i = +e;
                return 0 === i || 1 === i || (0 === t && 1 === n) ? Wn : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e)),
                  n = (e + ".").split(".")[1].length;
                return 0 === n && t % 100 == 1
                  ? Wn
                  : 0 === n && t % 100 == 2
                  ? Gn
                  : (0 === n && 3 <= t % 100 && t % 100 <= 4) || 0 !== n
                  ? Jn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return (0 <= t && t <= 1) || (11 <= t && t <= 99) ? Wn : Qn;
              },
              function (e) {
                var t = +e;
                return 1 === t ||
                  5 === t ||
                  7 === t ||
                  8 === t ||
                  9 === t ||
                  10 === t
                  ? Wn
                  : 2 === t || 3 === t
                  ? Gn
                  : 4 === t
                  ? Jn
                  : 6 === t
                  ? Kn
                  : Qn;
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
                  ? Wn
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
                  ? Jn
                  : 0 === t ||
                    t % 10 == 6 ||
                    t % 100 == 40 ||
                    t % 100 == 60 ||
                    t % 100 == 90
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return (t % 10 != 2 && t % 10 != 3) ||
                  t % 100 == 12 ||
                  t % 100 == 13
                  ? Qn
                  : Jn;
              },
              function (e) {
                var t = +e;
                return 1 === t || 3 === t
                  ? Wn
                  : 2 === t
                  ? Gn
                  : 4 === t
                  ? Jn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return 0 === t || 7 === t || 8 === t || 9 === t
                  ? Zn
                  : 1 === t
                  ? Wn
                  : 2 === t
                  ? Gn
                  : 3 === t || 4 === t
                  ? Jn
                  : 5 === t || 6 === t
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return t % 10 == 1 && t % 100 != 11
                  ? Wn
                  : t % 10 == 2 && t % 100 != 12
                  ? Gn
                  : t % 10 == 3 && t % 100 != 13
                  ? Jn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return 1 === t
                  ? Wn
                  : 2 === t || 3 === t
                  ? Gn
                  : 4 === t
                  ? Jn
                  : 6 === t
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return 1 === t || 5 === t ? Wn : Qn;
              },
              function (e) {
                var t = +e;
                return 11 === t || 8 === t || 80 === t || 800 === t ? Kn : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e));
                return 1 === t
                  ? Wn
                  : 0 === t ||
                    (2 <= t % 100 && t % 100 <= 20) ||
                    t % 100 == 40 ||
                    t % 100 == 60 ||
                    t % 100 == 80
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return t % 10 == 6 || t % 10 == 9 || (t % 10 == 0 && 0 !== t)
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = Math.floor(Math.abs(+e));
                return t % 10 == 1 && t % 100 != 11
                  ? Wn
                  : t % 10 == 2 && t % 100 != 12
                  ? Gn
                  : (t % 10 != 7 && t % 10 != 8) ||
                    t % 100 == 17 ||
                    t % 100 == 18
                  ? Qn
                  : Kn;
              },
              function (e) {
                var t = +e;
                return 1 === t
                  ? Wn
                  : 2 === t || 3 === t
                  ? Gn
                  : 4 === t
                  ? Jn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return 1 <= t && t <= 4 ? Wn : Qn;
              },
              function (e) {
                var t = +e;
                return 1 === t || 5 === t || (7 <= t && t <= 9)
                  ? Wn
                  : 2 === t || 3 === t
                  ? Gn
                  : 4 === t
                  ? Jn
                  : 6 === t
                  ? Kn
                  : Qn;
              },
              function (e) {
                var t = +e;
                return 1 === t ? Wn : t % 10 == 4 && t % 100 != 14 ? Kn : Qn;
              },
              function (e) {
                var t = +e;
                return (t % 10 != 1 && t % 10 != 2) ||
                  t % 100 == 11 ||
                  t % 100 == 12
                  ? Qn
                  : Wn;
              },
              function (e) {
                var t = +e;
                return t % 10 == 6 || t % 10 == 9 || 10 === t ? Jn : Qn;
              },
              function (e) {
                var t = +e;
                return t % 10 == 3 && t % 100 != 13 ? Jn : Qn;
              },
            ])[0],
          },
          ak: { cardinal: Yn[1] },
          am: { cardinal: Yn[2] },
          ar: { cardinal: Yn[3] },
          ars: { cardinal: Yn[3] },
          as: { cardinal: Yn[2], ordinal: Yn[34] },
          asa: { cardinal: Yn[0] },
          ast: { cardinal: Yn[4] },
          az: { cardinal: Yn[0], ordinal: Yn[35] },
          be: { cardinal: Yn[5], ordinal: Yn[36] },
          bem: { cardinal: Yn[0] },
          bez: { cardinal: Yn[0] },
          bg: { cardinal: Yn[0] },
          bh: { cardinal: Yn[1] },
          bn: { cardinal: Yn[2], ordinal: Yn[34] },
          br: { cardinal: Yn[6] },
          brx: { cardinal: Yn[0] },
          bs: { cardinal: Yn[7] },
          ca: { cardinal: Yn[4], ordinal: Yn[37] },
          ce: { cardinal: Yn[0] },
          cgg: { cardinal: Yn[0] },
          chr: { cardinal: Yn[0] },
          ckb: { cardinal: Yn[0] },
          cs: { cardinal: Yn[8] },
          cy: { cardinal: Yn[9], ordinal: Yn[38] },
          da: { cardinal: Yn[10] },
          de: { cardinal: Yn[4] },
          dsb: { cardinal: Yn[11] },
          dv: { cardinal: Yn[0] },
          ee: { cardinal: Yn[0] },
          el: { cardinal: Yn[0] },
          en: { cardinal: Yn[4], ordinal: Yn[39] },
          eo: { cardinal: Yn[0] },
          es: { cardinal: Yn[0] },
          et: { cardinal: Yn[4] },
          eu: { cardinal: Yn[0] },
          fa: { cardinal: Yn[2] },
          ff: { cardinal: Yn[12] },
          fi: { cardinal: Yn[4] },
          fil: { cardinal: Yn[13], ordinal: Yn[0] },
          fo: { cardinal: Yn[0] },
          fr: { cardinal: Yn[12], ordinal: Yn[0] },
          fur: { cardinal: Yn[0] },
          fy: { cardinal: Yn[4] },
          ga: { cardinal: Yn[14], ordinal: Yn[0] },
          gd: { cardinal: Yn[15] },
          gl: { cardinal: Yn[4] },
          gsw: { cardinal: Yn[0] },
          gu: { cardinal: Yn[2], ordinal: Yn[40] },
          guw: { cardinal: Yn[1] },
          gv: { cardinal: Yn[16] },
          ha: { cardinal: Yn[0] },
          haw: { cardinal: Yn[0] },
          he: { cardinal: Yn[17] },
          hi: { cardinal: Yn[2], ordinal: Yn[40] },
          hr: { cardinal: Yn[7] },
          hsb: { cardinal: Yn[11] },
          hu: { cardinal: Yn[0], ordinal: Yn[41] },
          hy: { cardinal: Yn[12], ordinal: Yn[0] },
          io: { cardinal: Yn[4] },
          is: { cardinal: Yn[18] },
          it: { cardinal: Yn[4], ordinal: Yn[42] },
          iu: { cardinal: Yn[19] },
          iw: { cardinal: Yn[17] },
          jgo: { cardinal: Yn[0] },
          ji: { cardinal: Yn[4] },
          jmc: { cardinal: Yn[0] },
          ka: { cardinal: Yn[0], ordinal: Yn[43] },
          kab: { cardinal: Yn[12] },
          kaj: { cardinal: Yn[0] },
          kcg: { cardinal: Yn[0] },
          kk: { cardinal: Yn[0], ordinal: Yn[44] },
          kkj: { cardinal: Yn[0] },
          kl: { cardinal: Yn[0] },
          kn: { cardinal: Yn[2] },
          ks: { cardinal: Yn[0] },
          ksb: { cardinal: Yn[0] },
          ksh: { cardinal: Yn[20] },
          ku: { cardinal: Yn[0] },
          kw: { cardinal: Yn[19] },
          ky: { cardinal: Yn[0] },
          lag: { cardinal: Yn[21] },
          lb: { cardinal: Yn[0] },
          lg: { cardinal: Yn[0] },
          ln: { cardinal: Yn[1] },
          lt: { cardinal: Yn[22] },
          lv: { cardinal: Yn[23] },
          mas: { cardinal: Yn[0] },
          mg: { cardinal: Yn[1] },
          mgo: { cardinal: Yn[0] },
          mk: { cardinal: Yn[24], ordinal: Yn[45] },
          ml: { cardinal: Yn[0] },
          mn: { cardinal: Yn[0] },
          mo: { cardinal: Yn[25], ordinal: Yn[0] },
          mr: { cardinal: Yn[2], ordinal: Yn[46] },
          mt: { cardinal: Yn[26] },
          nah: { cardinal: Yn[0] },
          naq: { cardinal: Yn[19] },
          nb: { cardinal: Yn[0] },
          nd: { cardinal: Yn[0] },
          ne: { cardinal: Yn[0], ordinal: Yn[47] },
          nl: { cardinal: Yn[4] },
          nn: { cardinal: Yn[0] },
          nnh: { cardinal: Yn[0] },
          no: { cardinal: Yn[0] },
          nr: { cardinal: Yn[0] },
          nso: { cardinal: Yn[1] },
          ny: { cardinal: Yn[0] },
          nyn: { cardinal: Yn[0] },
          om: { cardinal: Yn[0] },
          or: { cardinal: Yn[0], ordinal: Yn[48] },
          os: { cardinal: Yn[0] },
          pa: { cardinal: Yn[1] },
          pap: { cardinal: Yn[0] },
          pl: { cardinal: Yn[27] },
          prg: { cardinal: Yn[23] },
          ps: { cardinal: Yn[0] },
          pt: { cardinal: Yn[28] },
          "pt-PT": { cardinal: Yn[4] },
          rm: { cardinal: Yn[0] },
          ro: { cardinal: Yn[25], ordinal: Yn[0] },
          rof: { cardinal: Yn[0] },
          ru: { cardinal: Yn[29] },
          rwk: { cardinal: Yn[0] },
          saq: { cardinal: Yn[0] },
          scn: { cardinal: Yn[4], ordinal: Yn[42] },
          sd: { cardinal: Yn[0] },
          sdh: { cardinal: Yn[0] },
          se: { cardinal: Yn[19] },
          seh: { cardinal: Yn[0] },
          sh: { cardinal: Yn[7] },
          shi: { cardinal: Yn[30] },
          si: { cardinal: Yn[31] },
          sk: { cardinal: Yn[8] },
          sl: { cardinal: Yn[32] },
          sma: { cardinal: Yn[19] },
          smi: { cardinal: Yn[19] },
          smj: { cardinal: Yn[19] },
          smn: { cardinal: Yn[19] },
          sms: { cardinal: Yn[19] },
          sn: { cardinal: Yn[0] },
          so: { cardinal: Yn[0] },
          sq: { cardinal: Yn[0], ordinal: Yn[49] },
          sr: { cardinal: Yn[7] },
          ss: { cardinal: Yn[0] },
          ssy: { cardinal: Yn[0] },
          st: { cardinal: Yn[0] },
          sv: { cardinal: Yn[4], ordinal: Yn[50] },
          sw: { cardinal: Yn[4] },
          syr: { cardinal: Yn[0] },
          ta: { cardinal: Yn[0] },
          te: { cardinal: Yn[0] },
          teo: { cardinal: Yn[0] },
          ti: { cardinal: Yn[1] },
          tig: { cardinal: Yn[0] },
          tk: { cardinal: Yn[0], ordinal: Yn[51] },
          tl: { cardinal: Yn[13], ordinal: Yn[0] },
          tn: { cardinal: Yn[0] },
          tr: { cardinal: Yn[0] },
          ts: { cardinal: Yn[0] },
          tzm: { cardinal: Yn[33] },
          ug: { cardinal: Yn[0] },
          uk: { cardinal: Yn[29], ordinal: Yn[52] },
          ur: { cardinal: Yn[4] },
          uz: { cardinal: Yn[0] },
          ve: { cardinal: Yn[0] },
          vo: { cardinal: Yn[0] },
          vun: { cardinal: Yn[0] },
          wa: { cardinal: Yn[1] },
          wae: { cardinal: Yn[0] },
          xh: { cardinal: Yn[0] },
          xog: { cardinal: Yn[0] },
          yi: { cardinal: Yn[4] },
          zu: { cardinal: Yn[2] },
          lo: { ordinal: Yn[0] },
          ms: { ordinal: Yn[0] },
          vi: { ordinal: Yn[0] },
        }),
        (ei = zi(function (e, t) {
          function n(e, t, a, r, s) {
            var l = e.map(function (e) {
              return (function (e, t, a, r, s) {
                if ("string" == typeof e) {
                  var l = e;
                  return function () {
                    return l;
                  };
                }
                var c,
                  d = e[0],
                  h = e[1];
                if (t && "#" === e[0]) {
                  d = t[0];
                  var p = t[2],
                    f = (r.number || u.number)([d, "number"], a);
                  return function (e) {
                    return f(i(d, e) - p, e);
                  };
                }
                "plural" === h || "selectordinal" === h
                  ? ((c = {}),
                    Object.keys(e[3]).forEach(function (t) {
                      c[t] = n(e[3][t], e, a, r, s);
                    }),
                    (e = [e[0], e[1], e[2], c]))
                  : e[2] &&
                    "object" === o(e[2]) &&
                    ((c = {}),
                    Object.keys(e[2]).forEach(function (t) {
                      c[t] = n(e[2][t], e, a, r, s);
                    }),
                    (e = [e[0], e[1], c]));
                var v = h && (r[h] || u[h]);
                if (v) {
                  var y = v(e, a);
                  return function (e) {
                    return y(i(d, e), e);
                  };
                }
                return s
                  ? function (e) {
                      return String(i(d, e));
                    }
                  : function (e) {
                      return i(d, e);
                    };
              })(e, t, a, r, s);
            });
            return s
              ? 1 === l.length
                ? l[0]
                : function (e) {
                    for (var t = "", n = 0; n < l.length; ++n) t += l[n](e);
                    return t;
                  }
              : function (e) {
                  return l.reduce(function (t, n) {
                    return t.concat(n(e));
                  }, []);
                };
          }
          function i(e, t) {
            if (t && e in t) return t[e];
            for (
              var n = e.split("."), i = t, a = 0, r = n.length;
              i && a < r;
              ++a
            )
              i = i[n[a]];
            return i;
          }
          function a(e, t) {
            var n = e[2],
              i = qn.number[n] || qn.parseNumberPattern(n) || qn.number.default;
            return new Intl.NumberFormat(t, i).format;
          }
          function r(e, t) {
            var n = e[1],
              i = e[2],
              a = qn[n][i] || qn.parseDatePattern(i) || qn[n].default;
            return new Intl.DateTimeFormat(t, a).format;
          }
          function s(e, t) {
            var n,
              i = "selectordinal" === e[1] ? "ordinal" : "cardinal",
              a = e[2],
              r = e[3];
            if (
              Intl.PluralRules &&
              Intl.PluralRules.supportedLocalesOf(t).length > 0
            )
              n = new Intl.PluralRules(t, { type: i });
            else {
              var o = $n(t, Xn),
                s = (o && Xn[o][i]) || l;
              n = { select: s };
            }
            return function (e, t) {
              return (r["=" + +e] || r[n.select(e - a)] || r.other)(t);
            };
          }
          function l() {
            return "other";
          }
          (t = e.exports =
            function (e, t, i) {
              return n(e, null, t || "en", i || {}, !0);
            }).toParts = function (e, t, i) {
            return n(e, null, t || "en", i || {}, !1);
          };
          var u = {
            number: a,
            ordinal: a,
            spellout: a,
            duration: function (e, t) {
              var n = e[2],
                i = qn.duration[n] || qn.duration.default,
                a = new Intl.NumberFormat(t, i.seconds).format,
                r = new Intl.NumberFormat(t, i.minutes).format,
                o = new Intl.NumberFormat(t, i.hours).format,
                s = /^fi$|^fi-|^da/.test(String(t)) ? "." : ":";
              return function (e, t) {
                if (((e = +e), !isFinite(e))) return a(e);
                var n = ~~(e / 60 / 60),
                  i = ~~((e / 60) % 60),
                  l =
                    (n ? o(Math.abs(n)) + s : "") +
                    r(Math.abs(i)) +
                    s +
                    a(Math.abs(e % 60));
                return e < 0 ? o(-1).replace(o(1), l) : l;
              };
            },
            date: r,
            time: r,
            plural: s,
            selectordinal: s,
            select: function (e, t) {
              var n = e[2];
              return function (e, t) {
                return (n[e] || n.other)(t);
              };
            },
          };
          t.types = u;
        })).toParts,
        ei.types,
        (ti = zi(function (e, t) {
          var n = "{",
            i = "}",
            a = ",",
            r = "#",
            o = "<",
            s = ">",
            l = "</",
            u = "/>",
            c = "'",
            d = "offset:",
            h = ["number", "date", "time", "ordinal", "duration", "spellout"],
            p = ["plural", "select", "selectordinal"];
          function f(e, t) {
            var n = e.pattern,
              a = n.length,
              r = [],
              o = e.index,
              s = v(e, t);
            for (
              s && r.push(s),
                s && e.tokens && e.tokens.push(["text", n.slice(o, e.index)]);
              e.index < a;

            ) {
              if (n[e.index] === i) {
                if (!t) throw S(e);
                break;
              }
              if (t && e.tagsType && n.slice(e.index, e.index + l.length) === l)
                break;
              r.push(g(e)),
                (o = e.index),
                (s = v(e, t)) && r.push(s),
                s && e.tokens && e.tokens.push(["text", n.slice(o, e.index)]);
            }
            return r;
          }
          function v(e, t) {
            for (
              var a = e.pattern,
                s = a.length,
                l = "plural" === t || "selectordinal" === t,
                u = !!e.tagsType,
                d = "{style}" === t,
                h = "";
              e.index < s;

            ) {
              var p = a[e.index];
              if (
                p === n ||
                p === i ||
                (l && p === r) ||
                (u && p === o) ||
                (d && y(p.charCodeAt(0)))
              )
                break;
              if (p === c)
                if ((p = a[++e.index]) === c) (h += p), ++e.index;
                else if (
                  p === n ||
                  p === i ||
                  (l && p === r) ||
                  (u && p === o) ||
                  d
                )
                  for (h += p; ++e.index < s; )
                    if ((p = a[e.index]) === c && a[e.index + 1] === c)
                      (h += c), ++e.index;
                    else {
                      if (p === c) {
                        ++e.index;
                        break;
                      }
                      h += p;
                    }
                else h += c;
              else (h += p), ++e.index;
            }
            return h;
          }
          function y(e) {
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
          function m(e) {
            for (
              var t = e.pattern, n = t.length, i = e.index;
              e.index < n && y(t.charCodeAt(e.index));

            )
              ++e.index;
            i < e.index &&
              e.tokens &&
              e.tokens.push(["space", e.pattern.slice(i, e.index)]);
          }
          function g(e) {
            var t = e.pattern;
            if (t[e.index] === r)
              return e.tokens && e.tokens.push(["syntax", r]), ++e.index, [r];
            var c = (function (e) {
              var t = e.tagsType;
              if (!t || e.pattern[e.index] !== o) return;
              if (e.pattern.slice(e.index, e.index + l.length) === l)
                throw S(e, null, "closing tag without matching opening tag");
              e.tokens && e.tokens.push(["syntax", o]);
              ++e.index;
              var n = _(e, !0);
              if (!n) throw S(e, "placeholder id");
              e.tokens && e.tokens.push(["id", n]);
              if ((m(e), e.pattern.slice(e.index, e.index + u.length) === u))
                return (
                  e.tokens && e.tokens.push(["syntax", u]),
                  (e.index += u.length),
                  [n, t]
                );
              if (e.pattern[e.index] !== s) throw S(e, s);
              e.tokens && e.tokens.push(["syntax", s]);
              ++e.index;
              var i = f(e, t),
                a = e.index;
              if (e.pattern.slice(e.index, e.index + l.length) !== l)
                throw S(e, l + n + s);
              e.tokens && e.tokens.push(["syntax", l]);
              e.index += l.length;
              var r = _(e, !0);
              r && e.tokens && e.tokens.push(["id", r]);
              if (n !== r) throw ((e.index = a), S(e, l + n + s, l + r + s));
              if ((m(e), e.pattern[e.index] !== s)) throw S(e, s);
              e.tokens && e.tokens.push(["syntax", s]);
              return ++e.index, [n, t, { children: i }];
            })(e);
            if (c) return c;
            if (t[e.index] !== n) throw S(e, n);
            e.tokens && e.tokens.push(["syntax", n]), ++e.index, m(e);
            var p = _(e);
            if (!p) throw S(e, "placeholder id");
            e.tokens && e.tokens.push(["id", p]), m(e);
            var v = t[e.index];
            if (v === i)
              return e.tokens && e.tokens.push(["syntax", i]), ++e.index, [p];
            if (v !== a) throw S(e, ", or }");
            e.tokens && e.tokens.push(["syntax", a]), ++e.index, m(e);
            var y,
              g = _(e);
            if (!g) throw S(e, "placeholder type");
            if (
              (e.tokens && e.tokens.push(["type", g]),
              m(e),
              (v = t[e.index]) === i)
            ) {
              if (
                (e.tokens && e.tokens.push(["syntax", i]),
                "plural" === g || "selectordinal" === g || "select" === g)
              )
                throw S(e, g + " sub-messages");
              return ++e.index, [p, g];
            }
            if (v !== a) throw S(e, ", or }");
            if (
              (e.tokens && e.tokens.push(["syntax", a]),
              ++e.index,
              m(e),
              "plural" === g || "selectordinal" === g)
            ) {
              var x = (function (e) {
                var t = e.pattern,
                  n = t.length,
                  i = 0;
                if (t.slice(e.index, e.index + d.length) === d) {
                  e.tokens &&
                    e.tokens.push(["offset", "offset"], ["syntax", ":"]),
                    (e.index += d.length),
                    m(e);
                  for (
                    var a = e.index;
                    e.index < n && k(t.charCodeAt(e.index));

                  )
                    ++e.index;
                  if (a === e.index) throw S(e, "offset number");
                  e.tokens && e.tokens.push(["number", t.slice(a, e.index)]),
                    (i = +t.slice(a, e.index));
                }
                return i;
              })(e);
              m(e), (y = [p, g, x, w(e, g)]);
            } else if ("select" === g) y = [p, g, w(e, g)];
            else if (h.indexOf(g) >= 0) y = [p, g, b(e)];
            else {
              var C = e.index,
                E = b(e);
              m(e),
                t[e.index] === n && ((e.index = C), (E = w(e, g))),
                (y = [p, g, E]);
            }
            if ((m(e), t[e.index] !== i)) throw S(e, i);
            return e.tokens && e.tokens.push(["syntax", i]), ++e.index, y;
          }
          function _(e, t) {
            for (var l = e.pattern, u = l.length, d = ""; e.index < u; ) {
              var h = l[e.index];
              if (
                h === n ||
                h === i ||
                h === a ||
                h === r ||
                h === c ||
                y(h.charCodeAt(0)) ||
                (t && (h === o || h === s || "/" === h))
              )
                break;
              (d += h), ++e.index;
            }
            return d;
          }
          function b(e) {
            var t = e.index,
              n = v(e, "{style}");
            if (!n) throw S(e, "placeholder style name");
            return (
              e.tokens && e.tokens.push(["style", e.pattern.slice(t, e.index)]),
              n
            );
          }
          function k(e) {
            return e >= 48 && e <= 57;
          }
          function w(e, t) {
            for (
              var n = e.pattern, a = n.length, r = {};
              e.index < a && n[e.index] !== i;

            ) {
              var o = _(e);
              if (!o) throw S(e, "sub-message selector");
              e.tokens && e.tokens.push(["selector", o]),
                m(e),
                (r[o] = x(e, t)),
                m(e);
            }
            if (!r.other && p.indexOf(t) >= 0)
              throw S(
                e,
                null,
                null,
                '"other" sub-message must be specified in ' + t
              );
            return r;
          }
          function x(e, t) {
            if (e.pattern[e.index] !== n) throw S(e, "{ to start sub-message");
            e.tokens && e.tokens.push(["syntax", n]), ++e.index;
            var a = f(e, t);
            if (e.pattern[e.index] !== i) throw S(e, "} to end sub-message");
            return e.tokens && e.tokens.push(["syntax", i]), ++e.index, a;
          }
          function S(e, t, n, i) {
            var a = e.pattern,
              r = a.slice(0, e.index).split(/\r?\n/),
              o = e.index,
              s = r.length,
              l = r.slice(-1)[0].length;
            return (
              (n =
                n ||
                (e.index >= a.length
                  ? "end of message pattern"
                  : _(e) || a[e.index])),
              i ||
                (i = (function (e, t) {
                  return e
                    ? "Expected " + e + " but found " + t
                    : "Unexpected " + t + " found";
                })(t, n)),
              new C((i += " in " + a.replace(/\r?\n/g, "\n")), t, n, o, s, l)
            );
          }
          function C(e, t, n, i, a, r) {
            Error.call(this, e),
              (this.name = "SyntaxError"),
              (this.message = e),
              (this.expected = t),
              (this.found = n),
              (this.offset = i),
              (this.line = a),
              (this.column = r);
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
        })).SyntaxError,
        (ni = new RegExp("^(" + Object.keys(Xn).join("|") + ")\\b")),
        (ii = new WeakMap()),
        (ai = qi),
        Object.defineProperties(qi.prototype, {
          format: {
            configurable: !0,
            get: function () {
              var e = ii.get(this);
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
              var t = ii.get(this);
              if (!t)
                throw new TypeError(
                  "MessageFormat.prototype.formatToParts called on value that's not an object initialized as a MessageFormat"
                );
              return (
                t.toParts ||
                (t.toParts = ei.toParts(
                  t.ast,
                  t.locales,
                  t.options && t.options.types
                ))
              )(e);
            },
          },
          resolvedOptions: {
            configurable: !0,
            writable: !0,
            value: function () {
              var e = ii.get(this);
              if (!e)
                throw new TypeError(
                  "MessageFormat.prototype.resolvedOptions called on value that's not an object initialized as a MessageFormat"
                );
              return { locale: e.locale };
            },
          },
        }),
        "undefined" != typeof Symbol &&
          Object.defineProperty(qi.prototype, Symbol.toStringTag, {
            value: "Object",
          }),
        Object.defineProperties(qi, {
          supportedLocalesOf: {
            configurable: !0,
            writable: !0,
            value: function (e) {
              return []
                .concat(
                  Intl.NumberFormat.supportedLocalesOf(e),
                  Intl.DateTimeFormat.supportedLocalesOf(e),
                  Intl.PluralRules
                    ? Intl.PluralRules.supportedLocalesOf(e)
                    : [],
                  [].concat(e || []).filter(function (e) {
                    return ni.test(e);
                  })
                )
                .filter(function (e, t, n) {
                  return n.indexOf(e) === t;
                });
            },
          },
        }),
        (ri = (function () {
          function e() {
            var t =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {},
              i = t.autoLoadOnLocaleChange,
              a = void 0 !== i && i,
              r = t.fallbackLocale,
              o = void 0 === r ? "" : r;
            n(this, e),
              (this.__delegationTarget = document.createDocumentFragment()),
              (this._autoLoadOnLocaleChange = !!a),
              (this._fallbackLocale = o),
              (this.__storage = {}),
              (this.__namespacePatternsMap = new Map()),
              (this.__namespaceLoadersCache = {}),
              (this.__namespaceLoaderPromisesCache = {}),
              (this.formatNumberOptions = {
                returnIfNaN: "",
                postProcessors: new Map(),
              }),
              (this.formatDateOptions = { postProcessors: new Map() });
            var s = document.documentElement.getAttribute("data-localize-lang");
            (this._supportExternalTranslationTools = Boolean(s)),
              this._supportExternalTranslationTools &&
                ((this.locale = s || "en-GB"),
                this._setupTranslationToolSupport()),
              document.documentElement.lang ||
                (document.documentElement.lang = this.locale || "en-GB"),
              this._setupHtmlLangAttributeObserver();
          }
          return (
            i(e, [
              {
                key: "_setupTranslationToolSupport",
                value: function () {
                  this._langAttrSetByTranslationTool =
                    document.documentElement.lang || null;
                },
              },
              {
                key: "teardown",
                value: function () {
                  this._teardownHtmlLangAttributeObserver();
                },
              },
              {
                key: "locale",
                get: function () {
                  return this._supportExternalTranslationTools
                    ? this.__locale || ""
                    : document.documentElement.lang;
                },
                set: function (e) {
                  var t;
                  this._supportExternalTranslationTools
                    ? ((t = this.__locale),
                      (this.__locale = e),
                      null === this._langAttrSetByTranslationTool &&
                        this._setHtmlLangAttribute(e))
                    : ((t = document.documentElement.lang),
                      this._setHtmlLangAttribute(e)),
                    e.includes("-") || this.__handleLanguageOnly(e),
                    this._onLocaleChanged(e, t);
                },
              },
              {
                key: "_setHtmlLangAttribute",
                value: function (e) {
                  this._teardownHtmlLangAttributeObserver(),
                    (document.documentElement.lang = e),
                    this._setupHtmlLangAttributeObserver();
                },
              },
              {
                key: "__handleLanguageOnly",
                value: function (e) {
                  throw new Error(
                    "\n      Locale was set to ".concat(
                      e,
                      ".\n      Language only locales are not allowed, please use the full language locale e.g. 'en-GB' instead of 'en'.\n      See https://github.com/ing-bank/lion/issues/187 for more information.\n    "
                    )
                  );
                },
              },
              {
                key: "loadingComplete",
                get: function () {
                  return "object" ===
                    o(this.__namespaceLoaderPromisesCache[this.locale])
                    ? Promise.all(
                        Object.values(
                          this.__namespaceLoaderPromisesCache[this.locale]
                        )
                      )
                    : Promise.resolve();
                },
              },
              {
                key: "reset",
                value: function () {
                  (this.__storage = {}),
                    (this.__namespacePatternsMap = new Map()),
                    (this.__namespaceLoadersCache = {}),
                    (this.__namespaceLoaderPromisesCache = {});
                },
              },
              {
                key: "addData",
                value: function (e, t, n) {
                  if (this._isNamespaceInCache(e, t))
                    throw new Error(
                      'Namespace "'
                        .concat(t, '" has been already added for the locale "')
                        .concat(e, '".')
                    );
                  (this.__storage[e] = this.__storage[e] || {}),
                    (this.__storage[e][t] = n);
                },
              },
              {
                key: "setupNamespaceLoader",
                value: function (e, t) {
                  this.__namespacePatternsMap.set(e, t);
                },
              },
              {
                key: "loadNamespaces",
                value: function (e) {
                  var t = this,
                    n =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : {},
                    i = n.locale;
                  return Promise.all(
                    e.map(function (e) {
                      return t.loadNamespace(e, { locale: i });
                    })
                  );
                },
              },
              {
                key: "loadNamespace",
                value: function (e) {
                  var t =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : { locale: this.locale },
                    n = t.locale,
                    i = void 0 === n ? this.locale : n,
                    a = "object" === o(e),
                    r = a ? Object.keys(e)[0] : e;
                  if (this._isNamespaceInCache(i, r)) return Promise.resolve();
                  var s = this._getCachedNamespaceLoaderPromise(i, r);
                  return s || this._loadNamespaceData(i, e, a, r);
                },
              },
              {
                key: "msg",
                value: function (e, t) {
                  var n =
                      arguments.length > 2 && void 0 !== arguments[2]
                        ? arguments[2]
                        : {},
                    i = n.locale ? n.locale : this.locale,
                    a = this._getMessageForKeys(e, i);
                  if (!a) return "";
                  var r = new ai(a, i);
                  return r.format(t);
                },
              },
              {
                key: "_setupHtmlLangAttributeObserver",
                value: function () {
                  var e = this;
                  this._htmlLangAttributeObserver ||
                    (this._htmlLangAttributeObserver = new MutationObserver(
                      function (t) {
                        t.forEach(function (t) {
                          e._supportExternalTranslationTools
                            ? "auto" === document.documentElement.lang
                              ? ((e._langAttrSetByTranslationTool = null),
                                e._setHtmlLangAttribute(e.locale))
                              : (e._langAttrSetByTranslationTool =
                                  document.documentElement.lang)
                            : e._onLocaleChanged(
                                document.documentElement.lang,
                                t.oldValue || ""
                              );
                        });
                      }
                    )),
                    this._htmlLangAttributeObserver.observe(
                      document.documentElement,
                      {
                        attributes: !0,
                        attributeFilter: ["lang"],
                        attributeOldValue: !0,
                      }
                    );
                },
              },
              {
                key: "_teardownHtmlLangAttributeObserver",
                value: function () {
                  this._htmlLangAttributeObserver &&
                    this._htmlLangAttributeObserver.disconnect();
                },
              },
              {
                key: "_isNamespaceInCache",
                value: function (e, t) {
                  return !(!this.__storage[e] || !this.__storage[e][t]);
                },
              },
              {
                key: "_getCachedNamespaceLoaderPromise",
                value: function (e, t) {
                  return this.__namespaceLoaderPromisesCache[e]
                    ? this.__namespaceLoaderPromisesCache[e][t]
                    : null;
                },
              },
              {
                key: "_loadNamespaceData",
                value: function (e, t, n, i) {
                  var a = this,
                    r = this._getNamespaceLoader(t, n, i),
                    s = this._getNamespaceLoaderPromise(r, e, i);
                  return (
                    this._cacheNamespaceLoaderPromise(e, i, s),
                    s.then(function (t) {
                      if (
                        a.__namespaceLoaderPromisesCache[e] &&
                        a.__namespaceLoaderPromisesCache[e][i] === s
                      ) {
                        var n = (function (e) {
                          return !(
                            !e ||
                            !e.default ||
                            "object" !== o(e.default) ||
                            1 !== Object.keys(e).length
                          );
                        })(t)
                          ? t.default
                          : t;
                        a.addData(e, i, n);
                      }
                    })
                  );
                },
              },
              {
                key: "_getNamespaceLoader",
                value: function (e, t, n) {
                  var i = this.__namespaceLoadersCache[n];
                  i ||
                    (t
                      ? ((i = e[n]), (this.__namespaceLoadersCache[n] = i))
                      : ((i = this._lookupNamespaceLoader(n)),
                        (this.__namespaceLoadersCache[n] = i)));
                  if (!i)
                    throw new Error(
                      'Namespace "'.concat(n, '" was not properly setup.')
                    );
                  return (this.__namespaceLoadersCache[n] = i), i;
                },
              },
              {
                key: "_getNamespaceLoaderPromise",
                value: function (e, t, n) {
                  var i = this,
                    a =
                      arguments.length > 3 && void 0 !== arguments[3]
                        ? arguments[3]
                        : this._fallbackLocale;
                  return e(t, n).catch(function () {
                    var r = i._getLangFromLocale(t);
                    return e(r, n).catch(function () {
                      if (a)
                        return i
                          ._getNamespaceLoaderPromise(e, a, n, "")
                          .catch(function () {
                            var e = i._getLangFromLocale(a);
                            throw new Error(
                              'Data for namespace "'
                                .concat(n, '" and current locale "')
                                .concat(t, '" or fallback locale "')
                                .concat(a, '" could not be loaded. ') +
                                'Make sure you have data either for locale "'
                                  .concat(t, '" (and/or generic language "')
                                  .concat(r, '") or for fallback "')
                                  .concat(a, '" (and/or "')
                                  .concat(e, '").')
                            );
                          });
                      throw new Error(
                        'Data for namespace "'
                          .concat(n, '" and locale "')
                          .concat(t, '" could not be loaded. ') +
                          'Make sure you have data for locale "'
                            .concat(t, '" (and/or generic language "')
                            .concat(r, '").')
                      );
                    });
                  });
                },
              },
              {
                key: "_cacheNamespaceLoaderPromise",
                value: function (e, t, n) {
                  this.__namespaceLoaderPromisesCache[e] ||
                    (this.__namespaceLoaderPromisesCache[e] = {}),
                    (this.__namespaceLoaderPromisesCache[e][t] = n);
                },
              },
              {
                key: "_lookupNamespaceLoader",
                value: function (e) {
                  var t,
                    n = a(this.__namespacePatternsMap);
                  try {
                    for (n.s(); !(t = n.n()).done; ) {
                      var i = m(t.value, 2),
                        r = i[0],
                        s = i[1],
                        l = "string" == typeof r && r === e,
                        u =
                          "object" === o(r) &&
                          "RegExp" === r.constructor.name &&
                          r.test(e);
                      if (l || u) return s;
                    }
                  } catch (e) {
                    n.e(e);
                  } finally {
                    n.f();
                  }
                  return null;
                },
              },
              {
                key: "_getLangFromLocale",
                value: function (e) {
                  return e.substring(0, 2);
                },
              },
              {
                key: "addEventListener",
                value: function (e, t) {
                  for (
                    var n,
                      i = arguments.length,
                      a = new Array(i > 2 ? i - 2 : 0),
                      r = 2;
                    r < i;
                    r++
                  )
                    a[r - 2] = arguments[r];
                  (n = this.__delegationTarget).addEventListener.apply(
                    n,
                    [e, t].concat(a)
                  );
                },
              },
              {
                key: "removeEventListener",
                value: function (e, t) {
                  for (
                    var n,
                      i = arguments.length,
                      a = new Array(i > 2 ? i - 2 : 0),
                      r = 2;
                    r < i;
                    r++
                  )
                    a[r - 2] = arguments[r];
                  (n = this.__delegationTarget).removeEventListener.apply(
                    n,
                    [e, t].concat(a)
                  );
                },
              },
              {
                key: "dispatchEvent",
                value: function (e) {
                  this.__delegationTarget.dispatchEvent(e);
                },
              },
              {
                key: "_onLocaleChanged",
                value: function (e, t) {
                  var n = this;
                  this.dispatchEvent(new CustomEvent("__localeChanging")),
                    e !== t &&
                      (this._autoLoadOnLocaleChange
                        ? (this._loadAllMissing(e, t),
                          this.loadingComplete.then(function () {
                            n.dispatchEvent(
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
                },
              },
              {
                key: "_loadAllMissing",
                value: function (e, t) {
                  var n = this,
                    i = this.__storage[t] || {},
                    a = this.__storage[e] || {};
                  Object.keys(i).forEach(function (t) {
                    a[t] || n.loadNamespace(t, { locale: e });
                  });
                },
              },
              {
                key: "_getMessageForKeys",
                value: function (e, t) {
                  if ("string" == typeof e) return this._getMessageForKey(e, t);
                  for (var n, i, a = Array.from(e).reverse(); a.length; )
                    if (((n = a.pop()), (i = this._getMessageForKey(n, t))))
                      return i;
                },
              },
              {
                key: "_getMessageForKey",
                value: function (e, t) {
                  if (!e || -1 === e.indexOf(":"))
                    throw new Error(
                      'Namespace is missing in the key "'.concat(
                        e,
                        '". The format for keys is "namespace:name".'
                      )
                    );
                  var n = e.split(":"),
                    i = m(n, 2),
                    a = i[0],
                    r = i[1],
                    s = this.__storage[t],
                    l = s ? s[a] : {},
                    u = r.split(".").reduce(function (e, t) {
                      return "object" === o(e) ? e[t] : e;
                    }, l);
                  return String(u || "");
                },
              },
              {
                key: "setDatePostProcessorForLocale",
                value: function (e) {
                  var t = e.locale,
                    n = e.postProcessor;
                  this.formatDateOptions.postProcessors.set(t, n);
                },
              },
              {
                key: "setNumberPostProcessorForLocale",
                value: function (e) {
                  var t = e.locale,
                    n = e.postProcessor;
                  this.formatNumberOptions.postProcessors.set(t, n);
                },
              },
            ]),
            e
          );
        })()),
        (oi =
          Dn.get("@lion/localize::localize::0.10.x") ||
          new ri({ autoLoadOnLocaleChange: !0, fallbackLocale: "en-GB" })),
        (si = (function () {
          function e() {
            n(this, e), (this.__running = !1), (this.__queue = []);
          }
          var t;
          return (
            i(e, [
              {
                key: "add",
                value: function (e) {
                  var t = this;
                  this.__queue.push(e),
                    this.__running ||
                      ((this.complete = new Promise(function (e) {
                        t.__callComplete = e;
                      })),
                      this.__run());
                },
              },
              {
                key: "__run",
                value:
                  ((t = h(
                    p.mark(function e() {
                      return p.wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (
                                  (this.__running = !0),
                                  (e.next = 3),
                                  this.__queue[0]()
                                );
                              case 3:
                                this.__queue.shift(),
                                  this.__queue.length > 0
                                    ? this.__run()
                                    : ((this.__running = !1),
                                      this.__callComplete &&
                                        this.__callComplete());
                              case 5:
                              case "end":
                                return e.stop();
                            }
                        },
                        e,
                        this
                      );
                    })
                  )),
                  function () {
                    return t.apply(this, arguments);
                  }),
              },
            ]),
            e
          );
        })()),
        (li = Ii(function (e) {
          return (function (e) {
            l(a, e);
            var t = s(a);
            function a() {
              var e;
              return (
                n(this, a),
                ((e = t.call(this)).__SyncUpdatableNamespace = {}),
                e
              );
            }
            return (
              i(
                a,
                [
                  {
                    key: "firstUpdated",
                    value: function (e) {
                      c(u(a.prototype), "firstUpdated", this).call(this, e),
                        this.__syncUpdatableInitialize();
                    },
                  },
                  {
                    key: "connectedCallback",
                    value: function () {
                      c(u(a.prototype), "connectedCallback", this).call(this),
                        (this.__SyncUpdatableNamespace.connected = !0);
                    },
                  },
                  {
                    key: "disconnectedCallback",
                    value: function () {
                      c(u(a.prototype), "disconnectedCallback", this).call(
                        this
                      ),
                        (this.__SyncUpdatableNamespace.connected = !1);
                    },
                  },
                  {
                    key: "__syncUpdatableInitialize",
                    value: function () {
                      var e = this,
                        t = this.__SyncUpdatableNamespace,
                        n = this.constructor;
                      (t.initialized = !0),
                        t.queue &&
                          Array.from(t.queue).forEach(function (t) {
                            n.__syncUpdatableHasChanged(t, e[t], void 0) &&
                              e.updateSync(t, void 0);
                          });
                    },
                  },
                  {
                    key: "requestUpdate",
                    value: function (e, t) {
                      c(u(a.prototype), "requestUpdate", this).call(this, e, t),
                        (this.__SyncUpdatableNamespace =
                          this.__SyncUpdatableNamespace || {});
                      var n = this.__SyncUpdatableNamespace,
                        i = this.constructor;
                      n.initialized
                        ? i.__syncUpdatableHasChanged(e, this[e], t) &&
                          this.updateSync(e, t)
                        : ((n.queue = n.queue || new Set()), n.queue.add(e));
                    },
                  },
                  { key: "updateSync", value: function (e, t) {} },
                ],
                [
                  {
                    key: "__syncUpdatableHasChanged",
                    value: function (e, t, n) {
                      var i = this.elementProperties;
                      return i.get(e) && i.get(e).hasChanged
                        ? i.get(e).hasChanged(t, n)
                        : t !== n;
                    },
                  },
                ]
              ),
              a
            );
          })(e);
        })),
        function (e) {
          return e;
        },
        (di = (function (e) {
          l(a, e);
          var t = s(a);
          function a() {
            return n(this, a), t.apply(this, arguments);
          }
          return (
            i(
              a,
              [
                {
                  key: "_messageTemplate",
                  value: function (e) {
                    return e.message;
                  },
                },
                {
                  key: "updated",
                  value: function (e) {
                    var t = this;
                    c(u(a.prototype), "updated", this).call(this, e),
                      this.feedbackData && this.feedbackData[0]
                        ? (this.setAttribute("type", this.feedbackData[0].type),
                          (this.currentType = this.feedbackData[0].type),
                          window.clearTimeout(this.removeMessage),
                          "success" === this.currentType &&
                            (this.removeMessage = window.setTimeout(
                              function () {
                                t.removeAttribute("type"),
                                  (t.feedbackData = []);
                              },
                              3e3
                            )))
                        : "success" !== this.currentType &&
                          this.removeAttribute("type");
                  },
                },
                {
                  key: "render",
                  value: function () {
                    var e = this;
                    return zt(
                      ui || (ui = L || (L = f(["\n      ", "\n    "]))),
                      this.feedbackData &&
                        this.feedbackData.map(function (t) {
                          var n = t.message,
                            i = t.type,
                            a = t.validator;
                          return zt(
                            ci ||
                              (ci =
                                O || (O = f(["\n          ", "\n        "]))),
                            e._messageTemplate({
                              message: n,
                              type: i,
                              validator: a,
                            })
                          );
                        })
                    );
                  },
                },
              ],
              [
                {
                  key: "properties",
                  get: function () {
                    return { feedbackData: { attribute: !1 } };
                  },
                },
              ]
            ),
            a
          );
        })(dn)),
        (pi = (function (e) {
          l(a, e);
          var t = s(a);
          function a() {
            return n(this, a), t.apply(this, arguments);
          }
          return (
            i(a, [
              {
                key: "executeOnResults",
                value: function (e) {
                  e.regularValidationResult,
                    e.prevValidationResult,
                    e.prevShownValidationResult,
                    e.validators;
                  return !0;
                },
              },
            ]),
            a
          );
        })(
          (hi = (function () {
            function e(t, i) {
              n(this, e),
                this.__fakeExtendsEventTarget(),
                (this.__param = t),
                (this.__config = i || {}),
                (this.type = (i && i.type) || "error");
            }
            var t, a;
            return (
              i(
                e,
                [
                  {
                    key: "execute",
                    value: function (e, t, n) {
                      if (!this.constructor.validatorName)
                        throw new Error(
                          "A validator needs to have a name! Please set it via \"static get validatorName() { return 'IsCat'; }\""
                        );
                      return !0;
                    },
                  },
                  {
                    key: "param",
                    get: function () {
                      return this.__param;
                    },
                    set: function (e) {
                      (this.__param = e),
                        this.dispatchEvent &&
                          this.dispatchEvent(new Event("param-changed"));
                    },
                  },
                  {
                    key: "config",
                    get: function () {
                      return this.__config;
                    },
                    set: function (e) {
                      (this.__config = e),
                        this.dispatchEvent &&
                          this.dispatchEvent(new Event("config-changed"));
                    },
                  },
                  {
                    key: "_getMessage",
                    value:
                      ((a = h(
                        p.mark(function e(t) {
                          var n, i;
                          return p.wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    if (
                                      ((n = this.constructor),
                                      (i = y(
                                        {
                                          name: n.validatorName,
                                          type: this.type,
                                          params: this.param,
                                          config: this.config,
                                        },
                                        t
                                      )),
                                      !this.config.getMessage)
                                    ) {
                                      e.next = 6;
                                      break;
                                    }
                                    if (
                                      "function" !=
                                      typeof this.config.getMessage
                                    ) {
                                      e.next = 5;
                                      break;
                                    }
                                    return e.abrupt(
                                      "return",
                                      this.config.getMessage(i)
                                    );
                                  case 5:
                                    throw new Error(
                                      "You must provide a value for getMessage of type 'function', you provided a value of type: ".concat(
                                        o(this.config.getMessage)
                                      )
                                    );
                                  case 6:
                                    return e.abrupt("return", n.getMessage(i));
                                  case 7:
                                  case "end":
                                    return e.stop();
                                }
                            },
                            e,
                            this
                          );
                        })
                      )),
                      function (e) {
                        return a.apply(this, arguments);
                      }),
                  },
                  { key: "onFormControlConnect", value: function (e) {} },
                  { key: "onFormControlDisconnect", value: function (e) {} },
                  { key: "abortExecution", value: function () {} },
                  {
                    key: "__fakeExtendsEventTarget",
                    value: function () {
                      var e = document.createDocumentFragment();
                      (this.addEventListener = function (t, n, i) {
                        return e.addEventListener(t, n, i);
                      }),
                        (this.removeEventListener = function (t, n, i) {
                          return e.removeEventListener(t, n, i);
                        }),
                        (this.dispatchEvent = function (t) {
                          return e.dispatchEvent(t);
                        });
                    },
                  },
                ],
                [
                  {
                    key: "validatorName",
                    get: function () {
                      return "";
                    },
                  },
                  {
                    key: "async",
                    get: function () {
                      return !1;
                    },
                  },
                  {
                    key: "getMessage",
                    value:
                      ((t = h(
                        p.mark(function e(t) {
                          return p.wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    return e.abrupt(
                                      "return",
                                      'Please configure an error message for "'.concat(
                                        this.name,
                                        '" by overriding "static async getMessage()"'
                                      )
                                    );
                                  case 1:
                                  case "end":
                                    return e.stop();
                                }
                            },
                            e,
                            this
                          );
                        })
                      )),
                      function (e) {
                        return t.apply(this, arguments);
                      }),
                  },
                ]
              ),
              e
            );
          })())
        )),
        (fi = (function (e) {
          l(a, e);
          var t = s(a);
          function a() {
            return n(this, a), t.apply(this, arguments);
          }
          return (
            i(
              a,
              [
                {
                  key: "onFormControlConnect",
                  value: function (e) {
                    var t = e._inputNode;
                    if (t) {
                      var n = t.getAttribute("role") || "",
                        i = t.tagName.toLowerCase(),
                        a = this.constructor;
                      (a._compatibleRoles.includes(n) ||
                        a._compatibleTags.includes(i)) &&
                        t.setAttribute("aria-required", "true");
                    }
                  },
                },
                {
                  key: "onFormControlDisconnect",
                  value: function (e) {
                    var t = e._inputNode;
                    t && t.removeAttribute("aria-required");
                  },
                },
              ],
              [
                {
                  key: "validatorName",
                  get: function () {
                    return "Required";
                  },
                },
                {
                  key: "_compatibleRoles",
                  get: function () {
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
                  },
                },
                {
                  key: "_compatibleTags",
                  get: function () {
                    return ["input", "select", "textarea"];
                  },
                },
              ]
            ),
            a
          );
        })(hi)),
        (vi = Ii(function (e) {
          return (function (e) {
            l(b, e);
            var t,
              a,
              d,
              f,
              _ = s(b);
            function b() {
              var e;
              return (
                n(this, b),
                ((e = _.call(this)).hasFeedbackFor = []),
                (e.showsFeedbackFor = []),
                (e.shouldShowFeedbackFor = []),
                (e.validationStates = {}),
                (e.isPending = !1),
                (e.validators = []),
                (e.defaultValidators = []),
                (e._visibleMessagesAmount = 1),
                (e.__syncValidationResult = []),
                (e.__asyncValidationResult = []),
                (e.__validationResult = []),
                (e.__prevValidationResult = []),
                (e.__prevShownValidationResult = []),
                (e.__childModelValueChanged = !1),
                (e.__onValidatorUpdated = e.__onValidatorUpdated.bind(g(e))),
                (e._updateFeedbackComponent = e._updateFeedbackComponent.bind(
                  g(e)
                )),
                e
              );
            }
            return (
              i(
                b,
                [
                  {
                    key: "slots",
                    get: function () {
                      var e = this;
                      return y(
                        y({}, c(u(b.prototype), "slots", this)),
                        {},
                        {
                          feedback: function () {
                            var t = e.shadowRoot.createElement(
                              "lion-validation-feedback"
                            );
                            return (
                              t.setAttribute(
                                "data-tag-name",
                                "lion-validation-feedback"
                              ),
                              t
                            );
                          },
                        }
                      );
                    },
                  },
                  {
                    key: "_allValidators",
                    get: function () {
                      return [].concat(
                        r(this.validators),
                        r(this.defaultValidators)
                      );
                    },
                  },
                  {
                    key: "connectedCallback",
                    value: function () {
                      c(u(b.prototype), "connectedCallback", this).call(this),
                        oi.addEventListener(
                          "localeChanged",
                          this._updateFeedbackComponent
                        );
                    },
                  },
                  {
                    key: "disconnectedCallback",
                    value: function () {
                      c(u(b.prototype), "disconnectedCallback", this).call(
                        this
                      ),
                        oi.removeEventListener(
                          "localeChanged",
                          this._updateFeedbackComponent
                        );
                    },
                  },
                  {
                    key: "firstUpdated",
                    value: function (e) {
                      var t = this;
                      c(u(b.prototype), "firstUpdated", this).call(this, e),
                        (this.__validateInitialized = !0),
                        this.validate(),
                        "child" !== this._repropagationRole &&
                          this.addEventListener(
                            "model-value-changed",
                            function () {
                              t.__childModelValueChanged = !0;
                            }
                          );
                    },
                  },
                  {
                    key: "updateSync",
                    value: function (e, t) {
                      var n = this;
                      if (
                        (c(u(b.prototype), "updateSync", this).call(this, e, t),
                        "validators" === e
                          ? (this.__setupValidators(),
                            this.validate({ clearCurrentResult: !0 }))
                          : "modelValue" === e &&
                            this.validate({ clearCurrentResult: !0 }),
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
                            "".concat(this._hasFeedbackVisibleFor("error"))
                          );
                        var i = $i(this.showsFeedbackFor, t);
                        i.length > 0 &&
                          this.dispatchEvent(
                            new Event("showsFeedbackForChanged", {
                              bubbles: !0,
                            })
                          ),
                          i.forEach(function (e) {
                            var t;
                            n.dispatchEvent(
                              new Event(
                                "showsFeedbackFor".concat(
                                  (t = e).charAt(0).toUpperCase() + t.slice(1),
                                  "Changed"
                                ),
                                { bubbles: !0 }
                              )
                            );
                          });
                      }
                      "shouldShowFeedbackFor" === e &&
                        $i(this.shouldShowFeedbackFor, t).length > 0 &&
                        this.dispatchEvent(
                          new Event("shouldShowFeedbackForChanged", {
                            bubbles: !0,
                          })
                        );
                    },
                  },
                  {
                    key: "validate",
                    value:
                      ((f = h(
                        p.mark(function e() {
                          var t,
                            n,
                            i = arguments;
                          return p.wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    if (
                                      ((t =
                                        i.length > 0 && void 0 !== i[0]
                                          ? i[0]
                                          : {}),
                                      (n = t.clearCurrentResult),
                                      !this.disabled)
                                    ) {
                                      e.next = 6;
                                      break;
                                    }
                                    return (
                                      this.__clearValidationResults(),
                                      this.__finishValidation({
                                        source: "sync",
                                        hasAsync: !0,
                                      }),
                                      this._updateFeedbackComponent(),
                                      e.abrupt("return")
                                    );
                                  case 6:
                                    if (this.__validateInitialized) {
                                      e.next = 8;
                                      break;
                                    }
                                    return e.abrupt("return");
                                  case 8:
                                    return (
                                      (this.__prevValidationResult =
                                        this.__validationResult),
                                      n && this.__clearValidationResults(),
                                      (e.next = 12),
                                      this.__executeValidators()
                                    );
                                  case 12:
                                  case "end":
                                    return e.stop();
                                }
                            },
                            e,
                            this
                          );
                        })
                      )),
                      function () {
                        return f.apply(this, arguments);
                      }),
                  },
                  {
                    key: "__executeValidators",
                    value:
                      ((d = h(
                        p.mark(function e() {
                          var t,
                            n,
                            i,
                            a,
                            r,
                            o = this;
                          return p.wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    if (
                                      ((this.validateComplete = new Promise(
                                        function (e) {
                                          o.__validateCompleteResolve = e;
                                        }
                                      )),
                                      (t =
                                        this.modelValue instanceof kn
                                          ? this.modelValue.viewValue
                                          : this.modelValue),
                                      (n = this._allValidators.find(function (
                                        e
                                      ) {
                                        return e instanceof fi;
                                      })),
                                      !this.__isEmpty(t))
                                    ) {
                                      e.next = 8;
                                      break;
                                    }
                                    return (
                                      n && (this.__syncValidationResult = [n]),
                                      this.__finishValidation({
                                        source: "sync",
                                      }),
                                      e.abrupt("return")
                                    );
                                  case 8:
                                    return (
                                      (i = this._allValidators.filter(function (
                                        e
                                      ) {
                                        return !(
                                          e instanceof pi || e instanceof fi
                                        );
                                      })),
                                      (a = i.filter(function (e) {
                                        return !e.constructor.async;
                                      })),
                                      (r = i.filter(function (e) {
                                        return e.constructor.async;
                                      })),
                                      this.__executeSyncValidators(a, t, {
                                        hasAsync: Boolean(r.length),
                                      }),
                                      (e.next = 14),
                                      this.__executeAsyncValidators(r, t)
                                    );
                                  case 14:
                                  case "end":
                                    return e.stop();
                                }
                            },
                            e,
                            this
                          );
                        })
                      )),
                      function () {
                        return d.apply(this, arguments);
                      }),
                  },
                  {
                    key: "__executeSyncValidators",
                    value: function (e, t, n) {
                      var i = this,
                        a = n.hasAsync;
                      e.length &&
                        (this.__syncValidationResult = e.filter(function (e) {
                          return e.execute(t, e.param, { node: i });
                        })),
                        this.__finishValidation({
                          source: "sync",
                          hasAsync: a,
                        });
                    },
                  },
                  {
                    key: "__executeAsyncValidators",
                    value:
                      ((a = h(
                        p.mark(function e(t, n) {
                          var i,
                            a,
                            r = this;
                          return p.wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    if (!t.length) {
                                      e.next = 9;
                                      break;
                                    }
                                    return (
                                      (this.isPending = !0),
                                      (i = t.map(function (e) {
                                        return e.execute(n, e.param, {
                                          node: r,
                                        });
                                      })),
                                      (e.next = 5),
                                      Promise.all(i)
                                    );
                                  case 5:
                                    (a = e.sent),
                                      (this.__asyncValidationResult = a
                                        .map(function (e, n) {
                                          return t[n];
                                        })
                                        .filter(function (e, t) {
                                          return a[t];
                                        })),
                                      this.__finishValidation({
                                        source: "async",
                                      }),
                                      (this.isPending = !1);
                                  case 9:
                                  case "end":
                                    return e.stop();
                                }
                            },
                            e,
                            this
                          );
                        })
                      )),
                      function (e, t) {
                        return a.apply(this, arguments);
                      }),
                  },
                  {
                    key: "__executeResultValidators",
                    value: function (e) {
                      var t = this;
                      return this._allValidators
                        .filter(function (e) {
                          return !e.constructor.async && e instanceof pi;
                        })
                        .filter(function (n) {
                          return n.executeOnResults({
                            regularValidationResult: e,
                            prevValidationResult: t.__prevValidationResult,
                            prevShownValidationResult:
                              t.__prevShownValidationResult,
                          });
                        });
                    },
                  },
                  {
                    key: "__finishValidation",
                    value: function (e) {
                      var t = e.source,
                        n = e.hasAsync,
                        i = [].concat(
                          r(this.__syncValidationResult),
                          r(this.__asyncValidationResult)
                        ),
                        a = this.__executeResultValidators(i);
                      this.__validationResult = [].concat(r(a), r(i));
                      var o = this.constructor.validationTypes.reduce(function (
                        e,
                        t
                      ) {
                        return y(y({}, e), {}, v({}, t, {}));
                      },
                      {});
                      this.__validationResult.forEach(function (e) {
                        o[e.type] || (o[e.type] = {});
                        var t = e.constructor;
                        o[e.type][t.validatorName] = !0;
                      }),
                        (this.validationStates = o),
                        (this.hasFeedbackFor = r(
                          new Set(
                            this.__validationResult.map(function (e) {
                              return e.type;
                            })
                          )
                        )),
                        this.dispatchEvent(
                          new Event("validate-performed", { bubbles: !0 })
                        ),
                        ("async" !== t && n) ||
                          (this.__validateCompleteResolve &&
                            this.__validateCompleteResolve());
                    },
                  },
                  {
                    key: "__clearValidationResults",
                    value: function () {
                      (this.__syncValidationResult = []),
                        (this.__asyncValidationResult = []);
                    },
                  },
                  {
                    key: "__onValidatorUpdated",
                    value: function (e) {
                      ("param-changed" !== e.type &&
                        "config-changed" !== e.type) ||
                        this.validate();
                    },
                  },
                  {
                    key: "__setupValidators",
                    value: function () {
                      var e = this,
                        t = ["param-changed", "config-changed"];
                      this.__prevValidators &&
                        this.__prevValidators.forEach(function (n) {
                          t.forEach(function (t) {
                            n.removeEventListener &&
                              n.removeEventListener(t, e.__onValidatorUpdated);
                          }),
                            n.onFormControlDisconnect(e);
                        }),
                        this._allValidators.forEach(function (n) {
                          if (!(n instanceof hi)) {
                            var i = Array.isArray(n) ? "array" : o(n),
                              a =
                                'Validators array only accepts class instances of Validator. Type "'.concat(
                                  i,
                                  '" found. This may be caused by having multiple installations of @lion/form-core.'
                                );
                            throw (console.error(a, e), new Error(a));
                          }
                          if (
                            -1 === e.constructor.validationTypes.indexOf(n.type)
                          ) {
                            var r = n.constructor,
                              s =
                                'This component does not support the validator type "'
                                  .concat(n.type, '" used in "')
                                  .concat(
                                    r.validatorName,
                                    '". You may change your validators type or add it to the components "static get validationTypes() {}".'
                                  );
                            throw (console.error(s, e), new Error(s));
                          }
                          t.forEach(function (t) {
                            n.addEventListener &&
                              n.addEventListener(t, e.__onValidatorUpdated);
                          }),
                            n.onFormControlConnect(e);
                        }),
                        (this.__prevValidators = this._allValidators);
                    },
                  },
                  {
                    key: "__isEmpty",
                    value: function (e) {
                      return "function" == typeof this._isEmpty
                        ? this._isEmpty(e)
                        : null === this.modelValue ||
                            void 0 === this.modelValue ||
                            "" === this.modelValue;
                    },
                  },
                  {
                    key: "__getFeedbackMessages",
                    value:
                      ((t = h(
                        p.mark(function e(t) {
                          var n,
                            i = this;
                          return p.wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    return (e.next = 2), this.fieldName;
                                  case 2:
                                    return (
                                      (n = e.sent),
                                      e.abrupt(
                                        "return",
                                        Promise.all(
                                          t.map(
                                            (function () {
                                              var e = h(
                                                p.mark(function e(t) {
                                                  var a;
                                                  return p.wrap(function (e) {
                                                    for (;;)
                                                      switch (
                                                        (e.prev = e.next)
                                                      ) {
                                                        case 0:
                                                          if (
                                                            !t.config.fieldName
                                                          ) {
                                                            e.next = 4;
                                                            break;
                                                          }
                                                          return (
                                                            (e.next = 3),
                                                            t.config.fieldName
                                                          );
                                                        case 3:
                                                          n = e.sent;
                                                        case 4:
                                                          return (
                                                            (e.next = 6),
                                                            t._getMessage({
                                                              modelValue:
                                                                i.modelValue,
                                                              formControl: i,
                                                              fieldName: n,
                                                            })
                                                          );
                                                        case 6:
                                                          return (
                                                            (a = e.sent),
                                                            e.abrupt("return", {
                                                              message: a,
                                                              type: t.type,
                                                              validator: t,
                                                            })
                                                          );
                                                        case 8:
                                                        case "end":
                                                          return e.stop();
                                                      }
                                                  }, e);
                                                })
                                              );
                                              return function (t) {
                                                return e.apply(this, arguments);
                                              };
                                            })()
                                          )
                                        )
                                      )
                                    );
                                  case 4:
                                  case "end":
                                    return e.stop();
                                }
                            },
                            e,
                            this
                          );
                        })
                      )),
                      function (e) {
                        return t.apply(this, arguments);
                      }),
                  },
                  {
                    key: "_updateFeedbackComponent",
                    value: function () {
                      var e = this,
                        t = this._feedbackNode;
                      t &&
                        (this.__feedbackQueue ||
                          (this.__feedbackQueue = new si()),
                        this.showsFeedbackFor.length > 0
                          ? this.__feedbackQueue.add(
                              h(
                                p.mark(function n() {
                                  var i;
                                  return p.wrap(function (n) {
                                    for (;;)
                                      switch ((n.prev = n.next)) {
                                        case 0:
                                          return (
                                            (e.__prioritizedResult =
                                              e._prioritizeAndFilterFeedback({
                                                validationResult:
                                                  e.__validationResult,
                                              })),
                                            e.__prioritizedResult.length > 0 &&
                                              (e.__prevShownValidationResult =
                                                e.__prioritizedResult),
                                            (n.next = 4),
                                            e.__getFeedbackMessages(
                                              e.__prioritizedResult
                                            )
                                          );
                                        case 4:
                                          (i = n.sent),
                                            (t.feedbackData = i.length
                                              ? i
                                              : []);
                                        case 6:
                                        case "end":
                                          return n.stop();
                                      }
                                  }, n);
                                })
                              )
                            )
                          : this.__feedbackQueue.add(
                              h(
                                p.mark(function e() {
                                  return p.wrap(function (e) {
                                    for (;;)
                                      switch ((e.prev = e.next)) {
                                        case 0:
                                          t.feedbackData = [];
                                        case 1:
                                        case "end":
                                          return e.stop();
                                      }
                                  }, e);
                                })
                              )
                            ),
                        (this.feedbackComplete =
                          this.__feedbackQueue.complete));
                    },
                  },
                  {
                    key: "_showFeedbackConditionFor",
                    value: function (e, t) {
                      return !0;
                    },
                  },
                  {
                    key: "_feedbackConditionMeta",
                    get: function () {
                      return { modelValue: this.modelValue, el: this };
                    },
                  },
                  {
                    key: "feedbackCondition",
                    value: function (e) {
                      var t =
                          arguments.length > 1 && void 0 !== arguments[1]
                            ? arguments[1]
                            : this._feedbackConditionMeta,
                        n =
                          arguments.length > 2 && void 0 !== arguments[2]
                            ? arguments[2]
                            : this._showFeedbackConditionFor.bind(this);
                      return n(e, t);
                    },
                  },
                  {
                    key: "_hasFeedbackVisibleFor",
                    value: function (e) {
                      return (
                        this.hasFeedbackFor &&
                        this.hasFeedbackFor.includes(e) &&
                        this.shouldShowFeedbackFor &&
                        this.shouldShowFeedbackFor.includes(e)
                      );
                    },
                  },
                  {
                    key: "updated",
                    value: function (e) {
                      var t = this;
                      if (
                        (c(u(b.prototype), "updated", this).call(this, e),
                        e.has("shouldShowFeedbackFor") ||
                          e.has("hasFeedbackFor"))
                      ) {
                        var n = this.constructor;
                        (this.showsFeedbackFor = n.validationTypes
                          .map(function (e) {
                            return t._hasFeedbackVisibleFor(e) ? e : void 0;
                          })
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
                        var i = e.get("validationStates");
                        i &&
                          Object.entries(this.validationStates).forEach(
                            function (e) {
                              var n = m(e, 2),
                                a = n[0],
                                r = n[1];
                              i[a] &&
                                JSON.stringify(r) !== JSON.stringify(i[a]) &&
                                t.dispatchEvent(
                                  new CustomEvent(
                                    "".concat(a, "StateChanged"),
                                    { detail: r }
                                  )
                                );
                            }
                          );
                      }
                    },
                  },
                  {
                    key: "_updateShouldShowFeedbackFor",
                    value: function () {
                      var e = this,
                        t = this.constructor.validationTypes
                          .map(function (t) {
                            return e.feedbackCondition(
                              t,
                              e._feedbackConditionMeta,
                              e._showFeedbackConditionFor.bind(e)
                            )
                              ? t
                              : void 0;
                          })
                          .filter(Boolean);
                      JSON.stringify(this.shouldShowFeedbackFor) !==
                        JSON.stringify(t) && (this.shouldShowFeedbackFor = t);
                    },
                  },
                  {
                    key: "_prioritizeAndFilterFeedback",
                    value: function (e) {
                      var t = this,
                        n = e.validationResult,
                        i = this.constructor.validationTypes;
                      return n
                        .filter(function (e) {
                          return t.feedbackCondition(
                            e.type,
                            t._feedbackConditionMeta,
                            t._showFeedbackConditionFor.bind(t)
                          );
                        })
                        .sort(function (e, t) {
                          return i.indexOf(e.type) - i.indexOf(t.type);
                        })
                        .slice(0, this._visibleMessagesAmount);
                    },
                  },
                ],
                [
                  {
                    key: "scopedElements",
                    get: function () {
                      var e = c(u(b), "constructor", this);
                      return y(
                        y({}, e.scopedElements),
                        {},
                        { "lion-validation-feedback": di }
                      );
                    },
                  },
                  {
                    key: "properties",
                    get: function () {
                      return {
                        validators: { attribute: !1 },
                        hasFeedbackFor: { attribute: !1 },
                        shouldShowFeedbackFor: { attribute: !1 },
                        showsFeedbackFor: {
                          type: Array,
                          attribute: "shows-feedback-for",
                          reflect: !0,
                          converter: {
                            fromAttribute: function (e) {
                              return e.split(",");
                            },
                            toAttribute: function (e) {
                              return e.join(",");
                            },
                          },
                        },
                        validationStates: { attribute: !1 },
                        isPending: {
                          type: Boolean,
                          attribute: "is-pending",
                          reflect: !0,
                        },
                        defaultValidators: { attribute: !1 },
                        _visibleMessagesAmount: { attribute: !1 },
                        __childModelValueChanged: { attribute: !1 },
                      };
                    },
                  },
                  {
                    key: "validationTypes",
                    get: function () {
                      return ["error"];
                    },
                  },
                ]
              ),
              b
            );
          })(Rn(li(fn(vn(pn(e))))));
        })),
        (yi = Ii(function (e) {
          return (function (e) {
            l(a, e);
            var t = s(a);
            function a() {
              var e;
              return (
                n(this, a),
                ((e = t.call(this)).formatOn = "change"),
                (e.formatOptions = {}),
                (e.formattedValue = void 0),
                (e.serializedValue = void 0),
                (e._isPasting = !1),
                (e._isHandlingUserInput = !1),
                (e.__prevViewValue = ""),
                (e.__onCompositionEvent = e.__onCompositionEvent.bind(g(e))),
                e.addEventListener("user-input-changed", e._onUserInputChanged),
                e.addEventListener("paste", e.__onPaste),
                (e._reflectBackFormattedValueToUser =
                  e._reflectBackFormattedValueToUser.bind(g(e))),
                (e._reflectBackFormattedValueDebounced = function () {
                  setTimeout(e._reflectBackFormattedValueToUser);
                }),
                e
              );
            }
            return (
              i(
                a,
                [
                  {
                    key: "requestUpdate",
                    value: function (e, t) {
                      c(u(a.prototype), "requestUpdate", this).call(this, e, t),
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
                    },
                  },
                  {
                    key: "value",
                    get: function () {
                      return (
                        (this._inputNode && this._inputNode.value) ||
                        this.__value ||
                        ""
                      );
                    },
                    set: function (e) {
                      this._inputNode
                        ? ((this._inputNode.value = e), (this.__value = void 0))
                        : (this.__value = e);
                    },
                  },
                  {
                    key: "preprocessor",
                    value: function (e) {
                      return e;
                    },
                  },
                  {
                    key: "parser",
                    value: function (e, t) {
                      return e;
                    },
                  },
                  {
                    key: "formatter",
                    value: function (e, t) {
                      return e;
                    },
                  },
                  {
                    key: "serializer",
                    value: function (e) {
                      return void 0 !== e ? e : "";
                    },
                  },
                  {
                    key: "deserializer",
                    value: function (e) {
                      return void 0 === e ? "" : e;
                    },
                  },
                  {
                    key: "_calculateValues",
                    value: function () {
                      var e =
                          arguments.length > 0 && void 0 !== arguments[0]
                            ? arguments[0]
                            : { source: null },
                        t = e.source;
                      this.__preventRecursiveTrigger ||
                        ((this.__preventRecursiveTrigger = !0),
                        "model" !== t &&
                          ("serialized" === t
                            ? (this.modelValue = this.deserializer(
                                this.serializedValue
                              ))
                            : "formatted" === t &&
                              (this.modelValue = this._callParser())),
                        "formatted" !== t &&
                          (this.formattedValue = this._callFormatter()),
                        "serialized" !== t &&
                          (this.serializedValue = this.serializer(
                            this.modelValue
                          )),
                        this._reflectBackFormattedValueToUser(),
                        (this.__preventRecursiveTrigger = !1));
                    },
                  },
                  {
                    key: "_callParser",
                    value: function () {
                      var e =
                        arguments.length > 0 && void 0 !== arguments[0]
                          ? arguments[0]
                          : this.formattedValue;
                      if ("" === e) return "";
                      if ("string" == typeof e) {
                        var t = this.parser(e, this.formatOptions);
                        return void 0 !== t ? t : new kn(e);
                      }
                    },
                  },
                  {
                    key: "_callFormatter",
                    value: function () {
                      return this._isHandlingUserInput &&
                        this.hasFeedbackFor &&
                        this.hasFeedbackFor.length &&
                        this.hasFeedbackFor.includes("error") &&
                        this._inputNode
                        ? this._inputNode
                          ? this.value
                          : void 0
                        : this.modelValue instanceof kn
                        ? this.modelValue.viewValue
                        : this.formatter(this.modelValue, this.formatOptions);
                    },
                  },
                  {
                    key: "_onModelValueChanged",
                    value: function () {
                      this._calculateValues({ source: "model" }),
                        this._dispatchModelValueChangedEvent.apply(
                          this,
                          arguments
                        );
                    },
                  },
                  {
                    key: "_dispatchModelValueChangedEvent",
                    value: function () {
                      this.dispatchEvent(
                        new CustomEvent("model-value-changed", {
                          bubbles: !0,
                          detail: {
                            formPath: [this],
                            isTriggeredByUser: Boolean(
                              this._isHandlingUserInput
                            ),
                          },
                        })
                      );
                    },
                  },
                  {
                    key: "_syncValueUpwards",
                    value: function () {
                      this.__isHandlingComposition ||
                        (this.value = this.preprocessor(this.value));
                      var e = this.formattedValue;
                      (this.modelValue = this._callParser(this.value)),
                        e === this.formattedValue &&
                          this.__prevViewValue !== this.value &&
                          this._calculateValues(),
                        (this.__prevViewValue = this.value);
                    },
                  },
                  {
                    key: "_reflectBackFormattedValueToUser",
                    value: function () {
                      this._reflectBackOn() &&
                        (this.value =
                          void 0 !== this.formattedValue
                            ? this.formattedValue
                            : "");
                    },
                  },
                  {
                    key: "_reflectBackOn",
                    value: function () {
                      return !this._isHandlingUserInput;
                    },
                  },
                  {
                    key: "_proxyInputEvent",
                    value: function () {
                      this.dispatchEvent(
                        new Event("user-input-changed", { bubbles: !0 })
                      );
                    },
                  },
                  {
                    key: "_onUserInputChanged",
                    value: function () {
                      (this._isHandlingUserInput = !0),
                        this._syncValueUpwards(),
                        (this._isHandlingUserInput = !1);
                    },
                  },
                  {
                    key: "__onCompositionEvent",
                    value: function (e) {
                      var t = e.type;
                      "compositionstart" === t
                        ? (this.__isHandlingComposition = !0)
                        : "compositionend" === t &&
                          ((this.__isHandlingComposition = !1),
                          this._syncValueUpwards());
                    },
                  },
                  {
                    key: "__onPaste",
                    value: function () {
                      var e = this;
                      (this._isPasting = !0),
                        (this.formatOptions.mode = "pasted"),
                        setTimeout(function () {
                          (e._isPasting = !1), (e.formatOptions.mode = "auto");
                        });
                    },
                  },
                  {
                    key: "connectedCallback",
                    value: function () {
                      c(u(a.prototype), "connectedCallback", this).call(this),
                        void 0 === this.modelValue && this._syncValueUpwards(),
                        this._reflectBackFormattedValueToUser(),
                        this._inputNode &&
                          (this._inputNode.addEventListener(
                            this.formatOn,
                            this._reflectBackFormattedValueDebounced
                          ),
                          this._inputNode.addEventListener(
                            "input",
                            this._proxyInputEvent
                          ),
                          this._inputNode.addEventListener(
                            "compositionstart",
                            this.__onCompositionEvent
                          ),
                          this._inputNode.addEventListener(
                            "compositionend",
                            this.__onCompositionEvent
                          ));
                    },
                  },
                  {
                    key: "disconnectedCallback",
                    value: function () {
                      c(u(a.prototype), "disconnectedCallback", this).call(
                        this
                      ),
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
                    },
                  },
                ],
                [
                  {
                    key: "properties",
                    get: function () {
                      return {
                        formattedValue: { attribute: !1 },
                        serializedValue: { attribute: !1 },
                        formatOptions: { attribute: !1 },
                      };
                    },
                  },
                ]
              ),
              a
            );
          })(vi(Rn(e)));
        })),
        (mi = Ii(function (e) {
          return (function (e) {
            l(a, e);
            var t = s(a);
            function a() {
              var e;
              return (
                n(this, a),
                ((e = t.call(this)).touched = !1),
                (e.dirty = !1),
                (e.prefilled = !1),
                (e.filled = !1),
                (e._leaveEvent = "blur"),
                (e._valueChangedEvent = "model-value-changed"),
                (e._iStateOnLeave = e._iStateOnLeave.bind(g(e))),
                (e._iStateOnValueChange = e._iStateOnValueChange.bind(g(e))),
                e
              );
            }
            return (
              i(
                a,
                [
                  {
                    key: "requestUpdate",
                    value: function (e, t) {
                      c(u(a.prototype), "requestUpdate", this).call(this, e, t),
                        "touched" === e &&
                          this.touched !== t &&
                          this._onTouchedChanged(),
                        "modelValue" === e && (this.filled = !this._isEmpty()),
                        "dirty" === e &&
                          this.dirty !== t &&
                          this._onDirtyChanged();
                    },
                  },
                  {
                    key: "connectedCallback",
                    value: function () {
                      c(u(a.prototype), "connectedCallback", this).call(this),
                        this.addEventListener(
                          this._leaveEvent,
                          this._iStateOnLeave
                        ),
                        this.addEventListener(
                          this._valueChangedEvent,
                          this._iStateOnValueChange
                        ),
                        this.initInteractionState();
                    },
                  },
                  {
                    key: "disconnectedCallback",
                    value: function () {
                      c(u(a.prototype), "disconnectedCallback", this).call(
                        this
                      ),
                        this.removeEventListener(
                          this._leaveEvent,
                          this._iStateOnLeave
                        ),
                        this.removeEventListener(
                          this._valueChangedEvent,
                          this._iStateOnValueChange
                        );
                    },
                  },
                  {
                    key: "initInteractionState",
                    value: function () {
                      (this.dirty = !1), (this.prefilled = !this._isEmpty());
                    },
                  },
                  {
                    key: "_iStateOnLeave",
                    value: function () {
                      (this.touched = !0), (this.prefilled = !this._isEmpty());
                    },
                  },
                  {
                    key: "_iStateOnValueChange",
                    value: function () {
                      this.dirty = !0;
                    },
                  },
                  {
                    key: "resetInteractionState",
                    value: function () {
                      (this.touched = !1),
                        (this.submitted = !1),
                        (this.dirty = !1),
                        (this.prefilled = !this._isEmpty());
                    },
                  },
                  {
                    key: "_onTouchedChanged",
                    value: function () {
                      this.dispatchEvent(
                        new Event("touched-changed", {
                          bubbles: !0,
                          composed: !0,
                        })
                      );
                    },
                  },
                  {
                    key: "_onDirtyChanged",
                    value: function () {
                      this.dispatchEvent(
                        new Event("dirty-changed", {
                          bubbles: !0,
                          composed: !0,
                        })
                      );
                    },
                  },
                  {
                    key: "_showFeedbackConditionFor",
                    value: function (e, t) {
                      return (
                        (t.touched && t.dirty) || t.prefilled || t.submitted
                      );
                    },
                  },
                  {
                    key: "_feedbackConditionMeta",
                    get: function () {
                      return y(
                        y(
                          {},
                          c(u(a.prototype), "_feedbackConditionMeta", this)
                        ),
                        {},
                        {
                          submitted: this.submitted,
                          touched: this.touched,
                          dirty: this.dirty,
                          filled: this.filled,
                          prefilled: this.prefilled,
                        }
                      );
                    },
                  },
                ],
                [
                  {
                    key: "properties",
                    get: function () {
                      return {
                        touched: { type: Boolean, reflect: !0 },
                        dirty: { type: Boolean, reflect: !0 },
                        filled: { type: Boolean, reflect: !0 },
                        prefilled: { attribute: !1 },
                        submitted: { attribute: !1 },
                      };
                    },
                  },
                ]
              ),
              a
            );
          })(Rn(e));
        })),
        (gi = (function (e) {
          l(a, e);
          var t = s(a);
          function a() {
            return n(this, a), t.apply(this, arguments);
          }
          return (
            i(a, [
              {
                key: "firstUpdated",
                value: function (e) {
                  c(u(a.prototype), "firstUpdated", this).call(this, e),
                    (this._initialModelValue = this.modelValue);
                },
              },
              {
                key: "connectedCallback",
                value: function () {
                  c(u(a.prototype), "connectedCallback", this).call(this),
                    (this._onChange = this._onChange.bind(this)),
                    this._inputNode.addEventListener("change", this._onChange),
                    this.classList.add("form-field");
                },
              },
              {
                key: "disconnectedCallback",
                value: function () {
                  c(u(a.prototype), "disconnectedCallback", this).call(this),
                    this._inputNode.removeEventListener(
                      "change",
                      this._onChange
                    );
                },
              },
              {
                key: "resetInteractionState",
                value: function () {
                  c(u(a.prototype), "resetInteractionState", this).call(this),
                    (this.submitted = !1);
                },
              },
              {
                key: "reset",
                value: function () {
                  (this.modelValue = this._initialModelValue),
                    this.resetInteractionState();
                },
              },
              {
                key: "clear",
                value: function () {
                  this.modelValue = "";
                },
              },
              {
                key: "_onChange",
                value: function () {
                  this.dispatchEvent(
                    new Event("user-input-changed", { bubbles: !0 })
                  );
                },
              },
              {
                key: "_feedbackConditionMeta",
                get: function () {
                  return y(
                    y({}, c(u(a.prototype), "_feedbackConditionMeta", this)),
                    {},
                    { focused: this.focused }
                  );
                },
              },
              {
                key: "_focusableNode",
                get: function () {
                  return this._inputNode;
                },
              },
            ]),
            a
          );
        })(Rn(mi(_n(yi(vi(vn(dn)))))))),
        (_i = Ii(function (e) {
          return (function (e) {
            l(a, e);
            var t = s(a);
            function a() {
              var e;
              return n(this, a), ((e = t.call(this)).autocomplete = void 0), e;
            }
            return (
              i(
                a,
                [
                  {
                    key: "_inputNode",
                    get: function () {
                      return c(u(a.prototype), "_inputNode", this);
                    },
                  },
                  {
                    key: "selectionStart",
                    get: function () {
                      var e = this._inputNode;
                      return e && e.selectionStart ? e.selectionStart : 0;
                    },
                    set: function (e) {
                      var t = this._inputNode;
                      t && t.selectionStart && (t.selectionStart = e);
                    },
                  },
                  {
                    key: "selectionEnd",
                    get: function () {
                      var e = this._inputNode;
                      return e && e.selectionEnd ? e.selectionEnd : 0;
                    },
                    set: function (e) {
                      var t = this._inputNode;
                      t && t.selectionEnd && (t.selectionEnd = e);
                    },
                  },
                  {
                    key: "value",
                    get: function () {
                      return (
                        (this._inputNode && this._inputNode.value) ||
                        this.__value ||
                        ""
                      );
                    },
                    set: function (e) {
                      this._inputNode
                        ? (this._inputNode.value !== e &&
                            this._setValueAndPreserveCaret(e),
                          (this.__value = void 0))
                        : (this.__value = e);
                    },
                  },
                  {
                    key: "_setValueAndPreserveCaret",
                    value: function (e) {
                      if (this.focused)
                        try {
                          if (!(this._inputNode instanceof HTMLSelectElement)) {
                            var t = this._inputNode.selectionStart;
                            (this._inputNode.value = e),
                              (this._inputNode.selectionStart = t),
                              (this._inputNode.selectionEnd = t);
                          }
                        } catch (t) {
                          this._inputNode.value = e;
                        }
                      else this._inputNode.value = e;
                    },
                  },
                  {
                    key: "_reflectBackFormattedValueToUser",
                    value: function () {
                      if (
                        (c(
                          u(a.prototype),
                          "_reflectBackFormattedValueToUser",
                          this
                        ).call(this),
                        this._reflectBackOn() && this.focused)
                      )
                        try {
                          this._inputNode.selectionStart =
                            this._inputNode.value.length;
                        } catch (e) {}
                    },
                  },
                  {
                    key: "_focusableNode",
                    get: function () {
                      return this._inputNode;
                    },
                  },
                ],
                [
                  {
                    key: "properties",
                    get: function () {
                      return { autocomplete: { type: String, reflect: !0 } };
                    },
                  },
                ]
              ),
              a
            );
          })(yi(_n(Rn(e))));
        })),
        (bi = (function (e) {
          l(a, e);
          var t = s(a);
          function a() {
            var e;
            return (
              n(this, a),
              ((e = t.call(this)).readOnly = !1),
              (e.type = "text"),
              (e.placeholder = ""),
              e
            );
          }
          return (
            i(
              a,
              [
                {
                  key: "slots",
                  get: function () {
                    var e = this;
                    return y(
                      y({}, c(u(a.prototype), "slots", this)),
                      {},
                      {
                        input: function () {
                          var t = document.createElement("input"),
                            n = e.getAttribute("value");
                          return n && t.setAttribute("value", n), t;
                        },
                      }
                    );
                  },
                },
                {
                  key: "_inputNode",
                  get: function () {
                    return c(u(a.prototype), "_inputNode", this);
                  },
                },
                {
                  key: "requestUpdate",
                  value: function (e, t) {
                    c(u(a.prototype), "requestUpdate", this).call(this, e, t),
                      "readOnly" === e && this.__delegateReadOnly();
                  },
                },
                {
                  key: "firstUpdated",
                  value: function (e) {
                    c(u(a.prototype), "firstUpdated", this).call(this, e),
                      this.__delegateReadOnly();
                  },
                },
                {
                  key: "updated",
                  value: function (e) {
                    c(u(a.prototype), "updated", this).call(this, e),
                      e.has("type") && (this._inputNode.type = this.type),
                      e.has("placeholder") &&
                        (this._inputNode.placeholder = this.placeholder),
                      e.has("disabled") &&
                        ((this._inputNode.disabled = this.disabled),
                        this.validate()),
                      e.has("name") && (this._inputNode.name = this.name),
                      e.has("autocomplete") &&
                        (this._inputNode.autocomplete = this.autocomplete);
                  },
                },
                {
                  key: "__delegateReadOnly",
                  value: function () {
                    this._inputNode &&
                      (this._inputNode.readOnly = this.readOnly);
                  },
                },
              ],
              [
                {
                  key: "properties",
                  get: function () {
                    return {
                      readOnly: {
                        type: Boolean,
                        attribute: "readonly",
                        reflect: !0,
                      },
                      type: { type: String, reflect: !0 },
                      placeholder: { type: String, reflect: !0 },
                    };
                  },
                },
              ]
            ),
            a
          );
        })(_i(gi))),
        customElements.define("lion-input", bi),
        function (e) {
          return e;
        },
        (wi = qe(
          ki ||
            (ki =
              F ||
              (F = f([
                '\n@import url("https://use.typekit.net/tgy5tlj.css");:host{color:#000;display:inline-block;height:43px;padding:10px}svg{height:100%;max-height:74px;min-height:20px}g#rotunda path,g#rotunda polygon,g#rotunda rect{fill:#e57200}#sepline{fill:#fff}[dark] #sepline{fill:#141e3c}#libletters,#uvaletters{fill:#fff}[dark] #libletters,[dark] #uvaletters{fill:#141e3c}\n/*# sourceMappingURL=src/UvalibLogos.css.map */\n',
              ])))
        )),
        function (e) {
          return e;
        },
        (Si = (function (e) {
          l(a, e);
          var t = s(a);
          function a() {
            var e;
            return n(this, a), ((e = t.call(this)).onecolor = !1), e;
          }
          return (
            i(
              a,
              [
                {
                  key: "lightOrDark",
                  value: function (e) {
                    var t, n, i;
                    return (
                      e.match(/^rgb/)
                        ? ((t = (e = e.match(
                            /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
                          ))[1]),
                          (n = e[2]),
                          (i = e[3]))
                        : ((t =
                            (e = +(
                              "0x" +
                              e.slice(1).replace(e.length < 5 && /./g, "$&$&")
                            )) >> 16),
                          (n = (e >> 8) & 255),
                          (i = 255 & e)),
                      Math.sqrt(t * t * 0.299 + n * n * 0.587 + i * i * 0.114) >
                      127.5
                        ? "light"
                        : "dark"
                    );
                  },
                },
                {
                  key: "realBackgroundColor",
                  value: function (e) {
                    var t = "rgba(0, 0, 0, 0)";
                    if (!e) return t;
                    var n = getComputedStyle(e).backgroundColor;
                    return n === t || "transparent" === n
                      ? this.realBackgroundColor(
                          e.parentElement
                            ? e.parentElement
                            : e.getRootNode()
                            ? e.getRootNode().host
                            : null
                        )
                      : n;
                  },
                },
                {
                  key: "evalBackgroundColor",
                  value: function () {
                    (this._backgroundColor = this.realBackgroundColor(this)),
                      console.info(
                        "Found the background of the uvalib-logos to be ".concat(
                          this._backgroundColor
                        )
                      ),
                      (this._dark =
                        "dark" != this.lightOrDark(this._backgroundColor));
                  },
                },
                {
                  key: "connectedCallback",
                  value: function () {
                    c(u(a.prototype), "connectedCallback", this).call(this),
                      this.evalBackgroundColor();
                  },
                },
                {
                  key: "render",
                  value: function () {
                    return Ce(
                      xi ||
                        (xi =
                          R ||
                          (R = f([
                            ' <svg ?dark="',
                            '" role="img" id="library_logo_primary" data-name="library_logo_primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 327.42 73.89"> <title>University of Virginia Library</title> <desc id="desc">"Horizontal version of the logo"</desc> <g> <rect id="sepline" x="168.33" width="0.63" height="73.89"/> <g id="rotunda"> <rect x="21.82" y="34.73" width="2.72" height="12.96"/> <rect x="7.12" y="34.73" width="2.64" height="12.96"/> <rect x="10.67" y="34.73" width="2.81" height="12.96"/> <rect x="14.38" y="34.73" width="2.81" height="12.96"/> <rect x="18.1" y="34.73" width="2.81" height="12.96"/> <polygon points="23.37 33.82 8.23 33.82 16 29.04 23.37 33.82"/> <polygon points="0 28.99 0 33.82 6.49 33.82 14.34 28.99 0 28.99"/> <polygon points="17.61 28.99 31.57 28.99 31.57 33.82 25.05 33.82 17.61 28.99"/> <path d="M29.58,28.07H2a15.73,15.73,0,0,1,27.58,0"/> <path d="M2.13,44l-.24.73.62-.45.62.45L2.89,44l.62-.45H2.74l-.23-.72-.24.72H1.51ZM0,39.88l.62.45-.24.72L1,40.6l.62.45-.24-.72L2,39.88H1.24L1,39.15l-.24.73ZM6.22,47.7H5.38L5.15,47l.61-.44H5l-.24-.73-.23.73H3.77l.61.44-.23.73H0V37.06l.58-.42.62.45L1,36.36l.62-.45H.82l-.24-.72-.1.33-.15.39H0V34.73H6.22Zm-.84,0H4.15l.61-.45ZM0,37v-.75l.19.13-.14.4Z" style="fill-rule:evenodd"/> <rect y="48.61" width="6.21" height="3.44"/> <rect x="25.45" y="48.61" width="6.13" height="3.44"/> <path d="M20.05,51l.62-.45H19.9l-.23-.72-.24.72h-.76l.62.45-.24.73.62-.45.61.45Zm-4.62.48-.17.53H7.12V48.61h1L8,49.15H7.19l.62.45-.24.72.62-.45.61.45-.23-.72.62-.45H8.42l-.17-.54H23.37l-.17.54h-.77l.62.45-.23.72.61-.45.62.45-.24-.72.62-.45h-.76l-.18-.54h1.05v3.44H16.37l-.17-.53.61-.45h-.76l-.24-.72-.23.72h-.76Zm-4-.48-.24.73.62-.45.62.45L12.22,51l.62-.45h-.76l-.24-.72-.23.72h-.77Zm4.71,1h-.7l.34-.25Z" style="fill-rule:evenodd"/> <path d="M29.49,44l.62-.45h-.76l-.24-.72-.23.72h-.77l.62.45-.24.73.62-.45.62.45Zm-2,3.69L27.24,47l.61-.44h-.76l-.23-.73-.24.73h-.76l.61.44-.23.72.62-.44.61.44Zm4.1,0H25.45v-13h6.12v1.18h-.3L31,35.19l-.24.72H30l.62.45-.24.73.62-.45.53.39v2.85h-.71l-.24-.73-.24.73h-.76l.62.45-.24.72.62-.44.62.44L31,40.33l.57-.42Zm0-11.44v.59l-.15-.48Z" style="fill-rule:evenodd"/> </g> <g id="uvaletters"> <path d="M44.09,37.49A6.85,6.85,0,0,0,48.89,36,6.64,6.64,0,0,0,51,31c.08-1,.13-5.47.13-5.82s0-4,0-4.25a1,1,0,0,1,1.1-1h1c.12,0,.15-.1.15-.26v-.56c0-.07,0-.18-.26-.18s-1,.08-2.81.08-2.89-.08-3.14-.08-.18.05-.18.18v.62c0,.12,0,.2.18.2h1.12a1.13,1.13,0,0,1,1.15,1.12c.08.64.13,2.13.13,4.07v5.47a6.35,6.35,0,0,1-1.33,4.5,5.44,5.44,0,0,1-3.83,1.41,4.78,4.78,0,0,1-4.07-1.85,6.12,6.12,0,0,1-.82-3.24c0-.82-.12-4.07-.12-5.42V24.3c0-1.3,0-3.09.05-3.32a1.15,1.15,0,0,1,1.22-1.05h1.28c.18,0,.21-.05.21-.18v-.66c0-.11,0-.16-.23-.16s-1.51.08-3.51.08-3.24-.08-3.5-.08-.23.05-.23.21v.56c0,.18,0,.23.18.23h1.2c.8,0,1,.41,1,1.3v6.09a27.16,27.16,0,0,0,.41,6.21,4.67,4.67,0,0,0,3,3.43,9.66,9.66,0,0,0,3.45.53" style="fill-rule:evenodd"/> <path d="M65.08,28.68c0-1.14-.06-2.89.08-4.17,0-.39.19-.58.89-.58h.28c.11,0,.16-.09.16-.2v-.58c0-.17,0-.22-.19-.22s-1.17.08-1.75.08c-.89,0-2.09-.08-2.28-.08s-.19.05-.19.14v.66c0,.14.05.2.19.2h.47a1.07,1.07,0,0,1,1,.5A13.52,13.52,0,0,1,64,27c.06.89.09,1.75.09,3.33v1.84H64c-.33-.37-2.91-3.62-3.41-4.2s-3.78-4.72-3.86-4.83S56.41,23,56,23s-.92.05-1.36.05-.75,0-1.11-.05-.67,0-.72,0a.16.16,0,0,0-.17.17v.66a.15.15,0,0,0,.17.17h.25a1.38,1.38,0,0,1,1.47,1.47v2.92c0,3.14-.06,5.11-.08,5.44a.85.85,0,0,1-.81.83H53c-.08,0-.11,0-.11.09v.72c0,.14,0,.19.08.19.23,0,1.48-.08,1.86-.08.81,0,1.92.08,2.12.08s.13-.05.13-.16v-.67c0-.11,0-.17-.13-.17h-.59c-.28,0-.58-.3-.66-.94-.06-.25-.17-3-.17-4.69V25.15h.05c.45.5,2.7,3.5,3.37,4.28l2.77,3.3c1.14,1.36,2.09,2.5,2.28,2.7a1.27,1.27,0,0,0,.64.27c.33,0,.42-.27.42-.52Z" style="fill-rule:evenodd"/> <path d="M71.67,28.4c0-.19,0-3.5,0-3.78,0-.58.28-.69,1-.69h.47c.14,0,.17-.09.17-.2v-.66c0-.09-.06-.14-.17-.14s-1.64.08-2.45.08c-1.3,0-3-.08-3.19-.08s-.17.05-.17.16v.64c0,.11,0,.2.17.2h.5c1.17,0,1.42.28,1.42.58s0,3.17,0,3.61v1.22c0,.95,0,4.48,0,4.73-.06.5-.5.52-1.2.52h-.61a.17.17,0,0,0-.17.17v.61c0,.14.06.22.17.22s1.78-.08,2.72-.08c1.25,0,2.7.08,2.92.08s.17-.08.17-.19v-.67c0-.08,0-.14-.17-.14h-.42c-.8,0-1.14-.39-1.19-1,0-.42,0-3.61,0-3.78Z" style="fill-rule:evenodd"/> <path d="M99.83,29.18c0,1.69,0,3.33,0,4.69,0,.61-.33.72-1,.72h-.33c-.11,0-.17.06-.17.14v.64c0,.14.06.22.17.22s1.61-.08,2.3-.08c.92,0,2.42.08,2.61.08s.23-.05.23-.19v-.67c0-.08-.06-.14-.17-.14h-.72a.69.69,0,0,1-.78-.69V30.23a3.08,3.08,0,0,1,.72-.05c1.17,0,1.59.61,2.59,2.33a17.72,17.72,0,0,0,2,3.06c.48,0,1.14-.06,1.78-.06l.86,0,.56.05a.17.17,0,0,0,.17-.19v-.56c0-.16,0-.25-.14-.25a1.9,1.9,0,0,1-1.25-.3,8.63,8.63,0,0,1-1.56-1.78C106.52,30.9,106,30,105.33,29.9v-.06c2.19-.77,3.28-1.88,3.28-3.8a3.06,3.06,0,0,0-1-2A5.51,5.51,0,0,0,104,22.93l-3.11.08c-.5,0-2.22-.08-2.36-.08s-.17.05-.17.14v.66c0,.12,0,.2.12.2h.27c.78,0,1,.3,1.06.86v4.39Zm2.11-4.75c0-.5.42-.61.83-.61a4.64,4.64,0,0,1,2.64.72,2.36,2.36,0,0,1,.92,1.92c0,.72-.47,2.88-3.56,2.88a5.61,5.61,0,0,1-.83-.05Z" style="fill-rule:evenodd"/> <path d="M115.31,35.84A3.65,3.65,0,0,0,119.17,32a3.4,3.4,0,0,0-.89-2.66,7.58,7.58,0,0,0-3-1.5,5,5,0,0,1-1.94-1.14,2.26,2.26,0,0,1-.45-1.36,1.84,1.84,0,0,1,2-1.7,2.36,2.36,0,0,1,1.84.75,7.22,7.22,0,0,1,1,2c0,.09.08.14.17.12l.5-.12a.14.14,0,0,0,.11-.16c0-.39-.28-2.2-.28-3.11,0-.14,0-.25-.25-.25s-.31,0-.36.08l-.11.19c-.06.14-.2.12-.48-.05a4.25,4.25,0,0,0-2-.36,4,4,0,0,0-2.61.83,3.26,3.26,0,0,0-1.19,2.33,3.72,3.72,0,0,0,1,2.87,8.61,8.61,0,0,0,2.72,1.44c1.47.56,2.56,1.25,2.56,2.83,0,1.2-1.33,1.89-2.22,1.89a2.63,2.63,0,0,1-2.37-1.39,3.5,3.5,0,0,1-.5-1.89c0-.11-.11-.16-.22-.19l-.5-.06c-.11,0-.16.09-.19.2,0,.44-.22,2.66-.31,3.44,0,.14.06.25.23.31s.36,0,.41-.14l.08-.22c.06-.22.23-.2.42-.06a4.77,4.77,0,0,0,3,1" style="fill-rule:evenodd"/> <path d="M123.87,28.4c0-.19,0-3.5,0-3.78,0-.58.28-.69,1-.69h.47c.14,0,.17-.09.17-.2v-.66c0-.09-.06-.14-.17-.14S123.76,23,123,23c-1.31,0-3-.08-3.2-.08a.14.14,0,0,0-.16.16v.64c0,.11,0,.2.16.2h.5c1.17,0,1.42.28,1.42.58s.06,3.17.06,3.61v1.22c0,.95,0,4.48-.06,4.73-.05.5-.5.52-1.19.52h-.61a.16.16,0,0,0-.17.17v.61c0,.14.05.22.17.22s1.77-.08,2.72-.08c1.25,0,2.69.08,2.91.08s.17-.08.17-.19v-.67c0-.08,0-.14-.17-.14h-.41a1,1,0,0,1-1.2-1c0-.42,0-3.61,0-3.78Z" style="fill-rule:evenodd"/> <path d="M49.41,44.41c2.54,0,4.07-3.5,4.07-5.43a1.85,1.85,0,0,0-1.88-2c-2.34,0-4,3-4,5.22a2,2,0,0,0,1.81,2.26m-.27-.84a.84.84,0,0,1-.81-.9,6,6,0,0,1,1-2.84c.88-1.43,1.81-2.1,2.55-2.1a.87.87,0,0,1,.88,1c0,1.16-1.81,4.85-3.64,4.85" style="fill-rule:evenodd"/> <path d="M78.36,44.86c0-.2,0-3.5,0-3.78,0-.58.28-.69,1-.69h.47c.14,0,.16-.09.16-.2v-.66c0-.09,0-.14-.16-.14s-1.64.08-2.45.08c-1.3,0-3-.08-3.19-.08s-.17,0-.17.16v.64c0,.11,0,.2.17.2h.5c1.17,0,1.42.27,1.42.58s0,3.17,0,3.61V45.8c0,1,0,4.47,0,4.72-.06.5-.5.53-1.2.53h-.61a.17.17,0,0,0-.17.17v.61c0,.14.06.22.17.22S76.14,52,77.08,52c1.25,0,2.7.08,2.92.08s.17-.08.17-.19v-.67c0-.08,0-.14-.17-.14h-.42a1,1,0,0,1-1.19-1c0-.41,0-3.61,0-3.77Z" style="fill-rule:evenodd"/> <path d="M82.4,45.64c0,1.69,0,3.33,0,4.69,0,.61-.33.72-1,.72H81c-.11,0-.17.06-.17.14v.64c0,.14.06.22.17.22s1.61-.08,2.3-.08c.92,0,2.42.08,2.61.08s.23,0,.23-.19v-.67c0-.08-.06-.14-.17-.14h-.72a.69.69,0,0,1-.78-.69V46.69a3.08,3.08,0,0,1,.72,0c1.17,0,1.58.61,2.58,2.33a18,18,0,0,0,2,3.05C90.29,52,91,52,91.59,52l.86,0,.56,0a.17.17,0,0,0,.17-.19V51.3c0-.16,0-.25-.14-.25a2,2,0,0,1-1.25-.3A8.63,8.63,0,0,1,90.23,49c-1.14-1.61-1.69-2.47-2.33-2.61V46.3c2.19-.77,3.28-1.89,3.28-3.8a3,3,0,0,0-1-2,5.51,5.51,0,0,0-3.61-1.08l-3.11.08c-.5,0-2.22-.08-2.36-.08s-.16,0-.16.14v.66c0,.11,0,.2.11.2h.27c.78,0,1,.3,1.06.86v4.39Zm2.27-4.75c0-.5.42-.61.83-.61a4.64,4.64,0,0,1,2.64.72,2.36,2.36,0,0,1,.92,1.91c0,.73-.47,2.89-3.56,2.89a5.61,5.61,0,0,1-.83,0Z" style="fill-rule:evenodd"/> <path d="M103.58,48.19c0-.47.52-.58.8-.58h.47a.16.16,0,0,0,.14-.17v-.67c0-.08,0-.13-.16-.13s-1.37,0-2.39,0c-1.5,0-2.86,0-3,0s-.14,0-.14.13v.67c0,.08,0,.14.14.14h.67c.72,0,1.36.19,1.36.83v1a1.32,1.32,0,0,1-.42,1.2,3.93,3.93,0,0,1-2.3.61A4,4,0,0,1,96.05,50a6.77,6.77,0,0,1-1.69-4.86A5.86,5.86,0,0,1,95.8,41.5a4,4,0,0,1,3-1.42,3.66,3.66,0,0,1,2.81,1.33,7,7,0,0,1,1.33,2c.08.22.14.25.22.22l.53-.17c.08,0,.11-.08.11-.22,0-.5-.42-3.08-.42-3.22s0-.31-.3-.31a.34.34,0,0,0-.36.2l-.14.25c-.06.08-.17.08-.39-.11A6.05,6.05,0,0,0,99,39.14a7.5,7.5,0,0,0-5,1.69,6.09,6.09,0,0,0-2,4.56,6.76,6.76,0,0,0,1.66,4.88,7.14,7.14,0,0,0,5,2,10.42,10.42,0,0,0,4.75-1.11c.2-.08.31-.17.31-.3s-.08-.31-.08-.56Z" style="fill-rule:evenodd"/> <path d="M108.67,44.86c0-.2,0-3.5,0-3.78,0-.58.27-.69,1-.69h.48c.13,0,.16-.09.16-.2v-.66c0-.09,0-.14-.16-.14s-1.64.08-2.45.08c-1.3,0-3-.08-3.19-.08s-.17,0-.17.16v.64c0,.11,0,.2.17.2h.5c1.16,0,1.42.27,1.42.58s0,3.17,0,3.61V45.8c0,1,0,4.47,0,4.72-.06.5-.5.53-1.2.53h-.61a.17.17,0,0,0-.17.17v.61c0,.14.06.22.17.22s1.78-.08,2.72-.08c1.25,0,2.7.08,2.92.08s.16-.08.16-.19v-.67c0-.08,0-.14-.16-.14h-.42a1,1,0,0,1-1.19-1c0-.41,0-3.61,0-3.77Z" style="fill-rule:evenodd"/> <path d="M123.68,45.14c0-1.14-.06-2.89.08-4.17.06-.39.2-.58.89-.58h.28a.18.18,0,0,0,.17-.2v-.58c0-.17-.06-.22-.2-.22s-1.16.08-1.75.08c-.89,0-2.08-.08-2.27-.08s-.2,0-.2.14v.66c0,.14.06.2.2.2h.47a1,1,0,0,1,1,.5,13.43,13.43,0,0,1,.23,2.61c.05.89.08,1.75.08,3.33v1.83h-.11c-.33-.36-2.92-3.61-3.42-4.19s-3.77-4.72-3.86-4.83-.28-.23-.66-.23-.92.06-1.37.06-.75,0-1.11-.06l-.72,0a.16.16,0,0,0-.17.16v.67a.15.15,0,0,0,.17.17h.25a1.38,1.38,0,0,1,1.47,1.47v2.92c0,3.13-.05,5.11-.08,5.44a.85.85,0,0,1-.8.83h-.64c-.09,0-.12,0-.12.09v.72c0,.14,0,.19.09.19.22,0,1.47-.08,1.86-.08.8,0,1.92.08,2.11.08s.14,0,.14-.16v-.67c0-.11,0-.17-.14-.17H115c-.28,0-.59-.3-.67-.94-.06-.25-.17-3-.17-4.7v-3.8h.06c.44.5,2.69,3.5,3.36,4.28.31.36,1.5,1.77,2.78,3.3,1.14,1.36,2.08,2.5,2.28,2.7a1.23,1.23,0,0,0,.63.27c.34,0,.42-.27.42-.52Z" style="fill-rule:evenodd"/> <path d="M55.44,37.87H53.88c-.09,0-.13-.08-.1-.21l.07-.29c0-.13.16-.41.3-.41h1.53a10.68,10.68,0,0,1,2-3.78A3.61,3.61,0,0,1,60.25,32c1,0,1.59.61,1.59,1a.73.73,0,0,1-.71.81.69.69,0,0,1-.77-.7c0-.18-.19-.51-.72-.51-1.64,0-2,2.32-2.57,4.29,0,0,2.44.07,4.44.07S64.8,36.9,65,36.9s.26.08.26.18v.59c0,.12,0,.23-.2.23H63.86c-.72,0-1.07.23-1.07.66a4,4,0,0,0,.1.87c.15.92,1.1,4,1.56,5.39.3,1,1.79,5.37,2.37,6.93.59-1.2,2.59-6.47,2.79-7s1.23-3.63,1.61-4.76a5.39,5.39,0,0,0,.36-1.46c0-.3-.18-.58-.82-.58H70.1c-.11,0-.13-.08-.13-.23v-.59c0-.13,0-.18.15-.18s1.41.08,3,.08c1.86,0,2.5-.08,2.73-.08s.18.05.18.18v.64c0,.1,0,.18-.18.18h-.69a2.21,2.21,0,0,0-1.81,1c-.67.82-2.71,6.06-3.15,7.14-.3.84-3.6,9-3.73,9.22s-.23.34-.36.34-.3-.26-.43-.59c-.82-2.35-2.89-8.18-3.22-9.1L62.22,45c-.61-1.82-1.81-5.52-2.14-6.29-.26-.59-.52-.84-1-.84l-2.38,0c-.46,1.43-1.27,4.44-2.14,6.69-1.08,2.74-2.32,4.69-4.21,4.69a1.17,1.17,0,0,1-1.26-1,.74.74,0,0,1,.75-.75.91.91,0,0,1,.83.79.34.34,0,0,0,.3.29c.84,0,1.79-1.47,2.74-4.72Z"/> <path d="M126.94,22.89s0,0,.11,0a47.1,47.1,0,0,0,5,.2h1.12c.9,0,1.88,0,2.94-.08.53,0,3.8,0,4.46,0s2.5-.08,2.7-.08a.17.17,0,0,1,.19.19v.61c0,.11,0,.2-.19.2h-.42c-.5,0-.53.3-.42.47S145,28.34,145.4,29c.42-.69,2.72-4.05,2.83-4.28.22-.44.25-.8-.36-.8h-.44a.18.18,0,0,1-.2-.2v-.61a.18.18,0,0,1,.2-.19c.16,0,1.55.08,2.39.08.5,0,1.47-.08,1.63-.08s.2.05.2.22v.58c0,.14-.06.2-.17.2h-.28a2,2,0,0,0-1,.22,62,62,0,0,0-4.27,5.72v2.34c0,.69,0,1.44,0,1.77.06.59.5.61,1,.61h.36c.14,0,.2.06.2.14v.67c0,.11-.06.19-.23.19s-1.72-.08-2.63-.08c-.61,0-2.23.08-2.39.08s-.2-.05-.2-.22v-.61a.17.17,0,0,1,.17-.17h.42c.89,0,1-.16,1.08-.55s0-1.25,0-2.89v-1c-.25-.5-3.64-5.47-4.09-5.89a1.45,1.45,0,0,0-.87-.33c.16.76.38,1.74.47,2.22,0,.11,0,.17-.14.22l-.47.14c-.16.06-.25,0-.3-.11A7.58,7.58,0,0,0,137,24.26a15.12,15.12,0,0,0-3.23-.28v4.67c0,2.92,0,5,0,5.22,0,.45.19.72.64.72h1.05c.14,0,.2.09.2.25v.59c0,.08-.06.16-.2.16s-1.91-.08-2.83-.08-2.58.08-2.8.08-.23-.08-.23-.25v-.55c0-.14.06-.2.17-.2h1.11c.42,0,.61-.22.64-.44.08-1.06.08-2.53.08-4.19V24a14,14,0,0,0-3.11.25,6.36,6.36,0,0,0-1.64,2.14c-.06.11-.14.2-.25.14l-.5-.19c-.14-.06-.14-.17-.11-.28.16-.51.64-2.22.87-3.06,0,0,0-.07,0-.09"/> <path d="M136,46.28h3.78c-.11-.39-1.42-4.56-1.47-4.78s-.09-.28-.17-.28-.14.08-.22.31S136.18,46,136,46.28m-5.76-1.42v1.39c0,.16,0,3.36,0,3.77a1,1,0,0,0,1.2,1h.32a1.52,1.52,0,0,0,1.14-.58c.19-.22,1.61-3.56,2.27-4.94.2-.39,1.84-4.17,2-4.64.06-.17.23-.48,0-.56,0,0-.14-.19-.11-.28s0-.14.28-.19a3.91,3.91,0,0,0,1.55-.81.36.36,0,0,1,.34-.19c.16,0,.22.11.27.3.39,1.12,1.81,5.09,2.17,6.2a51.33,51.33,0,0,0,1.81,4.94,1.62,1.62,0,0,0,1.3.75h.53c.11,0,.14.09.14.17v.58c0,.09,0,.25-.2.25-.33,0-1.8-.08-2.44-.08s-2.17.08-2.53.08c-.19,0-.22-.14-.22-.25v-.58c0-.08,0-.17.14-.17h.44a.43.43,0,0,0,.45-.47c-.11-.56-.86-2.78-1.08-3.42h-4.48c-.11.34-1,2.64-1.11,3-.16.55-.08.91.5.91h.7c.16,0,.19.09.19.2v.61c0,.11,0,.19-.17.19S134,52,133.6,52H129c-.95,0-2.56.08-2.72.08s-.17-.08-.17-.22v-.61a.17.17,0,0,1,.17-.17h.61c.69,0,1.13,0,1.19-.53,0-.25.06-3.77.06-4.72V44.58c0-.44-.06-3.22-.06-3.61s-.25-.58-1.42-.58h-.49c-.14,0-.17-.09-.17-.2v-.64c0-.11,0-.16.17-.16s1.88.11,3.19.08c.8,0,2.22-.08,2.44-.08s.17,0,.17.14v.66c0,.11,0,.2-.17.2h-.47c-.75,0-1,.11-1,.69,0,.28,0,3.58,0,3.78"/> <path d="M79.57,23.12v.64a.17.17,0,0,1-.19.17h-.64c-.36,0-.78.05-.78.42a23.43,23.43,0,0,0,1.22,4c.22.69,1.25,3.92,1.42,4.36h.08c.17-.58,1.53-4,1.67-4.44,1.05-3.09,1.42-3.84,1.42-4.11s-.12-.28-.59-.28h-.3c-.11,0-.17-.06-.17-.2V23.1a.16.16,0,0,1,.17-.17c.16,0,1.61.08,2.25.08h4.24l6.22,0c.28,0,.64-.05.75-.05s.11.05.17.39.83,2.64.89,2.83,0,.17,0,.19l-.44.2c-.06,0-.17,0-.25-.11s-1.39-1.64-1.86-2.08a1.66,1.66,0,0,0-1.06-.42l-2.94-.06v4.72c.16,0,1.8-.08,2-.13.73-.2,1-.59,1-1.45,0-.11,0-.14.14-.14l.61,0c.11,0,.2.06.17.17s-.06,1.72-.06,2c0,.61.09,1.47.12,1.83,0,.11-.06.14-.14.14l-.59.06c-.08,0-.14,0-.16-.11-.14-.7-.31-1.14-1-1.31a10.1,10.1,0,0,0-2.08-.19v.94c0,1,.05,2.58.05,2.94,0,1.31.81,1.39,2,1.39A4.05,4.05,0,0,0,95.82,34a14.91,14.91,0,0,0,1.47-1.87c.14-.19.28-.22.36-.16l.44.25a.17.17,0,0,1,.09.19l-1,3c-.06.14-.2.27-.31.27s-1.66-.08-7.5-.08c-.5,0-2,.08-2.36.08-.14,0-.17-.08-.17-.19v-.64c0-.11.06-.17.2-.17h.25c1.3,0,1.39-.11,1.39-.5V28.18c0-1.47,0-3.28-.06-3.56-.08-.58-.25-.69-1.36-.69H86.6a1.61,1.61,0,0,0-1.17.42,30.33,30.33,0,0,0-2.3,4.88c-.25.59-2.53,6-2.75,6.39a.49.49,0,0,1-.45.22c-.22,0-.36-.19-.44-.41-.61-1.64-2.09-5.67-2.31-6.28L77,28.54c-.47-1.28-1.31-3.81-1.5-4.08a1,1,0,0,0-.81-.53h-.27c-.12,0-.14-.09-.14-.17v-.69c0-.09,0-.14.16-.14s1.67.08,2.39.08,2.36-.08,2.53-.08.22.05.22.19"/> </g> <g id="libletters"> <path d="M206.91,42.63c.06.06.06.12.06.31s-1.38,5.39-1.56,6.23c-.82,0-9.84-.09-13-.09-2.82,0-3.95.09-4.32.09s-.25-.06-.25-.28v-.72c0-.19,0-.25.19-.25h1.25c1.13,0,1.31-.44,1.31-.85,0-.56.13-8.39.13-10.27V35.05c0-2-.06-5.32-.13-5.86-.06-.81-.18-1.12-1-1.12h-1.31a.27.27,0,0,1-.25-.29v-.72c0-.18.06-.25.25-.25s1.44.1,4.32.1c3.38,0,4.7-.1,5-.1s.31.13.31.29v.72c0,.12-.06.25-.31.25h-1.7c-.93,0-1.06.31-1.06,1.15,0,.44-.13,5.14-.13,7.33v2.69c0,.57,0,7.33.13,8.68h1.75a52.38,52.38,0,0,0,5.26-.16c1.76-.25,3.76-4,4.2-5.2.13-.12.19-.18.38-.12Z"/> <path d="M214.91,38.93c0,.31.06,7.52.06,7.86,0,1,.5,1.13,1.26,1.13h1.31c.13,0,.25.06.25.22v.78c0,.19-.12.25-.31.25-.38,0-1.63-.09-4.57-.09-3.13,0-4.51.09-4.83.09s-.25-.06-.25-.22v-.84c0-.13.07-.19.25-.19h1.26c.62,0,1.31-.06,1.44-.91.06-.44.12-7.2.12-8.89V35.93c0-.76-.06-6.39-.09-6.8-.1-.75-.41-1.06-1.28-1.06H207.9c-.19,0-.25-.07-.25-.22V27c0-.15.06-.22.18-.22.38,0,2,.1,5.08.1s4-.1,4.44-.1c.19,0,.25.13.25.29v.72a.23.23,0,0,1-.25.25h-1.19c-.69,0-1.19.25-1.19.84,0,.31-.06,7.2-.06,7.58Z"/> <path d="M223.33,35.42c0-1.12-.06-4.94-.1-5.47-.09-1.82-.59-1.88-1.78-1.88h-1c-.19,0-.25-.07-.25-.25V27.1c0-.19.06-.29.25-.29.44,0,1.94.13,4.57.1,1,0,2.88-.1,4.57-.1,2.38,0,4.39.22,5.51.85a4.35,4.35,0,0,1,2.38,4.26c0,2.5-1.31,4-4.26,5.1v.16c3.57.94,5.64,2.82,5.64,6.14,0,1.69-.94,3.94-2.44,4.76-1.32.75-3.32,1.09-6.83,1.09-1.25,0-3.32-.09-4.57-.09-2.44,0-3.76.09-4.42.09-.12,0-.21-.09-.21-.25v-.78a.19.19,0,0,1,.21-.22H222c.94,0,1.16-.38,1.25-1.35.07-.75.13-4.88.13-7.45Zm3.82,1.32c.5,0,.94,0,1.44,0a5.47,5.47,0,0,0,3.32-.91,4.52,4.52,0,0,0,1.63-3.69,3.92,3.92,0,0,0-1.38-3.2,6.55,6.55,0,0,0-3.57-1.09,4.65,4.65,0,0,0-.94.06.62.62,0,0,0-.41.5c0,.6-.09,3.29-.09,5.92Zm2.69,11.43c2.44,0,4.7-1.16,4.7-5a4.84,4.84,0,0,0-3-4.88,9.06,9.06,0,0,0-3.57-.57h-.81V44C227.15,47,227.84,48.17,229.84,48.17Z"/> <path d="M285,47.92h-1a2.37,2.37,0,0,1-2-1.44c-.44-.85-2.44-6.67-3.2-9.11-.56-2-3-9-3.56-11-.07-.19-.19-.57-.38-.57s-.28.13-.47.32a10.36,10.36,0,0,1-3.1,1.56c-.25.06-.31.19-.31.31a.7.7,0,0,0,.18.38c.19.19,0,.75-.06,1.07L268,37.68c-.94,2.63-3.19,8.27-3.5,8.83a2.77,2.77,0,0,1-2.46,1.41,3.27,3.27,0,0,1-1.85-.53,36.32,36.32,0,0,1-2.66-3.57c-.25-.38-2.19-3.32-2.56-3.82a4.07,4.07,0,0,0-1.88-1.44v-.13c3.44-.56,5.82-2.19,5.82-6.14a4.77,4.77,0,0,0-1.69-3.5,8.39,8.39,0,0,0-5.7-2c-.94,0-3.82.1-5.57.1-3.07,0-4.07-.1-4.29-.1s-.22.07-.22.22v.85c0,.12.06.19.22.19h1.22c.56,0,1,.5,1,1.56v8.24c0,2.94,0,5.88-.06,9,0,.84-.5,1-1.19,1h-1.07c-.12,0-.18.09-.18.25v.72c0,.19.06.28.25.28s1.06-.09,4.13-.09c3.26,0,3.88.09,4.29.09.25,0,.34-.06.34-.28v-.75c0-.13-.06-.22-.25-.22h-1.56c-.5,0-.72-.57-.82-1.19-.06-.47-.12-4-.12-5.86V39.18l1-.06c1.31,0,2,.85,2.82,1.94.5.69,1.38,2.13,1.69,2.69s1.5,2.76,2.07,3.64a8.28,8.28,0,0,0,1.37,1.78c.69,0,1.88-.09,2.76-.09H265c2.19,0,3.5.09,3.94.09.19,0,.25-.12.25-.31v-.78c0-.1-.06-.16-.31-.16h-1.31c-.63,0-1.13-.35-1.13-.75a2.81,2.81,0,0,1,.06-.66c.16-.85,1.69-5.32,1.94-6h7.27c.37,1.15,1.62,5.16,1.88,6.29.18.85-.07,1.16-.94,1.16h-.82c-.19,0-.25.06-.25.25v.63c0,.18.06.37.31.37.69,0,1.76-.09,4.39-.09,3.44,0,4.07.09,4.63.09.25,0,.32-.19.32-.37v-.66C285.24,48,285.17,47.92,285,47.92ZM248.9,38.18a8.88,8.88,0,0,1-1.19-.12l.06-9a1.08,1.08,0,0,1,.38-.91,2.17,2.17,0,0,1,1.13-.19,6,6,0,0,1,4.13,1.35,4.93,4.93,0,0,1,1.38,3.5A5.48,5.48,0,0,1,248.9,38.18Zm20,1c.22-.72,3-8.42,3.16-8.83s.22-.4.41-.4.19.18.31.56c.19.63,2.32,7.77,2.63,8.67Z"/> <path d="M292.58,40.87c0,1.88.06,5.39.12,5.86.1.62.32,1.19.82,1.19h1.56c.19,0,.25.09.25.22v.75c0,.22-.09.28-.34.28-.41,0-1-.09-4.29-.09-3.07,0-3.82.09-4.13.09s-.25-.09-.25-.28v-.72c0-.16.06-.25.18-.25h1.07c.69,0,1.19-.19,1.19-1,.06-3.14.06-6.08.06-9V29.63c0-1.06-.44-1.56-1-1.56H286.6c-.16,0-.22-.07-.22-.19V27c0-.15.06-.22.22-.22s1.22.1,4.29.1c1.75,0,4.63-.1,5.57-.1a8.39,8.39,0,0,1,5.7,2,4.77,4.77,0,0,1,1.69,3.5c0,4-2.38,5.58-5.82,6.14v.13A4.07,4.07,0,0,1,299.91,40c.37.5,2.31,3.44,2.56,3.82s2.2,3.13,2.67,3.57a3.28,3.28,0,0,0,2.22.59c.19,0,.25.1.25.22v.66c0,.22-.06.31-.25.31s-1.07-.09-3.07-.09c-.88,0-2.07.06-2.76.09a8.28,8.28,0,0,1-1.37-1.78c-.57-.88-1.79-3.14-2.07-3.64s-1.19-2-1.69-2.69c-.78-1.09-1.5-1.94-2.82-1.94l-1,.06Zm.06-2.81a9,9,0,0,0,1.19.12,5.48,5.48,0,0,0,5.89-5.39,4.93,4.93,0,0,0-1.38-3.5,6,6,0,0,0-4.13-1.35,2.19,2.19,0,0,0-1.13.19,1.08,1.08,0,0,0-.38.91Z"/> <path d="M317.91,43.25c0,1.19.06,3.26.09,3.6.09,1,.59,1.07,1.22,1.07h1a.2.2,0,0,1,.22.22v.72c0,.22-.06.31-.22.31-.34,0-1.59-.09-4.41-.09-3.07,0-4.07.09-4.35.09s-.22-.12-.22-.28v-.72c0-.13.06-.25.22-.25h1.28c.81,0,1.06-.31,1.1-.78s.09-2.89.09-5.83v-1.5c-.5-.94-5.57-10-6.45-11a2.26,2.26,0,0,0-1.57-.69h-.56c-.19,0-.25-.07-.25-.22V27c0-.12.06-.19.25-.19s1.75.1,4.13.1c3.2,0,4.32-.1,4.64-.1s.25.07.25.22v.72c0,.19-.06.32-.25.32h-.82c-.69,0-.94.25-.87.9s3.82,7.52,4.66,9.27c1.07-1.75,5.11-8.26,5.17-9,.06-.56-.13-1.12-1.07-1.12h-.81a.22.22,0,0,1-.25-.25V27c0-.15.06-.22.19-.22.31,0,1.63.1,3.82.1,2,0,2.69-.1,3-.1s.25.07.25.22v.72c0,.19-.06.32-.25.32h-.69a2.46,2.46,0,0,0-1.69.72c-.5.56-5.7,8.58-6.88,10.64Z"/> </g> </g> </svg> ',
                          ]))),
                      this._dark
                    );
                  },
                },
              ],
              [
                {
                  key: "styles",
                  get: function () {
                    return [wi];
                  },
                },
                {
                  key: "properties",
                  get: function () {
                    return { _dark: { type: Boolean } };
                  },
                },
              ]
            ),
            a
          );
        })(Ze)),
        window.customElements.define("uvalib-logos", Si),
        function (e) {
          return e;
        },
        (Ei = qe(
          Ci ||
            (Ci =
              U ||
              (U = f([
                '\n@import url("https://use.typekit.net/tgy5tlj.css");:host{display:block;margin:0;padding:0;width:100%}header{align-items:center;background-color:#232d4b;display:flex;flex-direction:column;height:60px;margin:0;padding:0}#container{max-width:1200px;width:100%}\n/*# sourceMappingURL=src/UvalibHeader.css.map */\n',
              ])))
        )),
        function (e) {
          return e;
        },
        (Ti = (function (e) {
          l(a, e);
          var t = s(a);
          function a() {
            var e;
            return (
              n(this, a),
              ((e = t.call(this)).homelink = "https://library.virginia.edu"),
              e
            );
          }
          return (
            i(
              a,
              [
                {
                  key: "render",
                  value: function () {
                    return Ce(
                      Ni ||
                        (Ni =
                          D ||
                          (D = f([
                            ' <header> <div id="container"> <a href="',
                            '"><uvalib-logos>University of Virginia Library</uvalib-logos></a> </div> </header> ',
                          ]))),
                      this.homelink
                    );
                  },
                },
              ],
              [
                {
                  key: "styles",
                  get: function () {
                    return [Ei];
                  },
                },
                {
                  key: "properties",
                  get: function () {
                    return {
                      homelink: { type: String },
                      simple: { type: Boolean },
                    };
                  },
                },
              ]
            ),
            a
          );
        })(Ze)),
        customElements.define("uvalib-header", Ti),
        function (e) {
          return e;
        },
        (Ai = (function (e) {
          l(a, e);
          var t = s(a);
          function a() {
            var e;
            return (
              n(this, a),
              ((e = t.call(this)).catalog = new at({ devMode: !0 })),
              (e.pools = []),
              e.catalog.poolsPromise.then(function (t) {
                e.pools = e.catalog.lastPools;
              }),
              e
            );
          }
          return (
            i(
              a,
              [
                {
                  key: "render",
                  value: function () {
                    return Ce(
                      Pi ||
                        (Pi =
                          H ||
                          (H = f([
                            " <uvalib-header></uvalib-header> <main> <h1>UVA Library Catalog Light</h1> <ul> ",
                            ' </ul> <lion-input> <label slot="label">Search Virgo for books, articles, and more.</label> </lion-input> </main> ',
                          ]))),
                      this.pools.map(function (e) {
                        return Ce(
                          Mi || (Mi = B || (B = f(["<li>", "</li>"]))),
                          e.name
                        );
                      })
                    );
                  },
                },
              ],
              [
                {
                  key: "properties",
                  get: function () {
                    return { pools: { type: Object } };
                  },
                },
                {
                  key: "styles",
                  get: function () {
                    return [Ge, qe(Vi || (Vi = I || (I = f([""]))))];
                  },
                },
              ]
            ),
            a
          );
        })(Ze)),
        customElements.define("uvalib-catalog-light", Ai);
    },
  };
});
