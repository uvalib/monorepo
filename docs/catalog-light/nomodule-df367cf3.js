System.register([], function (t, e) {
  "use strict";
  function r(t, e) {
    var r = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
      var n = Object.getOwnPropertySymbols(t);
      e &&
        (n = n.filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })),
        r.push.apply(r, n);
    }
    return r;
  }
  function n(e) {
    return (
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? t(
            "typeof",
            (n = function (t) {
              return typeof t;
            })
          )
        : t(
            "typeof",
            (n = function (t) {
              return t &&
                "function" == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? "symbol"
                : typeof t;
            })
          ),
      n(e)
    );
  }
  function o(t, e, r, n, o, i, a) {
    try {
      var u = t[i](a),
        c = u.value;
    } catch (t) {
      return void r(t);
    }
    u.done ? e(c) : Promise.resolve(c).then(n, o);
  }
  function i(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r];
      (n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(t, n.key, n);
    }
  }
  function a(t, e, r) {
    return (
      e in t
        ? Object.defineProperty(t, e, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = r),
      t
    );
  }
  function u(e) {
    return (
      t(
        "getPrototypeOf",
        (u = Object.setPrototypeOf
          ? Object.getPrototypeOf
          : function (t) {
              return t.__proto__ || Object.getPrototypeOf(t);
            })
      ),
      u(e)
    );
  }
  function c(e, r) {
    return (
      t(
        "setPrototypeOf",
        (c =
          Object.setPrototypeOf ||
          function (t, e) {
            return (t.__proto__ = e), t;
          })
      ),
      c(e, r)
    );
  }
  function f() {
    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
    if (Reflect.construct.sham) return !1;
    if ("function" == typeof Proxy) return !0;
    try {
      return (
        Boolean.prototype.valueOf.call(
          Reflect.construct(Boolean, [], function () {})
        ),
        !0
      );
    } catch (t) {
      return !1;
    }
  }
  function l(e, r, n) {
    return (
      f()
        ? t("construct", (l = Reflect.construct))
        : t(
            "construct",
            (l = function (t, e, r) {
              var n = [null];
              n.push.apply(n, e);
              var o = new (Function.bind.apply(t, n))();
              return r && c(o, r.prototype), o;
            })
          ),
      l.apply(null, arguments)
    );
  }
  function s(t) {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  }
  function p(e) {
    var r = "function" == typeof Map ? new Map() : void 0;
    return (
      t(
        "wrapNativeSuper",
        (p = function (t) {
          if (null === t || !s(t)) return t;
          if ("function" != typeof t)
            throw new TypeError(
              "Super expression must either be null or a function"
            );
          if (void 0 !== r) {
            if (r.has(t)) return r.get(t);
            r.set(t, e);
          }
          function e() {
            return l(t, arguments, u(this).constructor);
          }
          return (
            (e.prototype = Object.create(t.prototype, {
              constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
            c(e, t)
          );
        })
      ),
      p(e)
    );
  }
  function y(t) {
    if (void 0 === t)
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      );
    return t;
  }
  function h(t, e) {
    return !e || ("object" != typeof e && "function" != typeof e) ? y(t) : e;
  }
  function v(t, e) {
    for (
      ;
      !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = u(t));

    );
    return t;
  }
  function d(e, r, n) {
    return (
      "undefined" != typeof Reflect && Reflect.get
        ? t("get", (d = Reflect.get))
        : t(
            "get",
            (d = function (t, e, r) {
              var n = v(t, e);
              if (n) {
                var o = Object.getOwnPropertyDescriptor(n, e);
                return o.get ? o.get.call(r) : o.value;
              }
            })
          ),
      d(e, r, n || e)
    );
  }
  function b(t) {
    if (Array.isArray(t)) return j(t);
  }
  function m(t) {
    if (Array.isArray(t)) return t;
  }
  function g(t) {
    if (
      ("undefined" != typeof Symbol && null != t[Symbol.iterator]) ||
      null != t["@@iterator"]
    )
      return Array.from(t);
  }
  function w(t, e) {
    var r =
      null == t
        ? null
        : ("undefined" != typeof Symbol && t[Symbol.iterator]) ||
          t["@@iterator"];
    if (null != r) {
      var n,
        o,
        i = [],
        a = !0,
        u = !1;
      try {
        for (
          r = r.call(t);
          !(a = (n = r.next()).done) && (i.push(n.value), !e || i.length !== e);
          a = !0
        );
      } catch (t) {
        (u = !0), (o = t);
      } finally {
        try {
          a || null == r.return || r.return();
        } finally {
          if (u) throw o;
        }
      }
      return i;
    }
  }
  function O(t, e) {
    if (t) {
      if ("string" == typeof t) return j(t, e);
      var r = Object.prototype.toString.call(t).slice(8, -1);
      return (
        "Object" === r && t.constructor && (r = t.constructor.name),
        "Map" === r || "Set" === r
          ? Array.from(t)
          : "Arguments" === r ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
          ? j(t, e)
          : void 0
      );
    }
  }
  function j(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  function x() {
    throw new TypeError(
      "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  function S() {
    throw new TypeError(
      "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  return (
    t({
      objectSpread2: function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = null != arguments[e] ? arguments[e] : {};
          e % 2
            ? r(Object(n), !0).forEach(function (e) {
                a(t, e, n[e]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
            : r(Object(n)).forEach(function (e) {
                Object.defineProperty(
                  t,
                  e,
                  Object.getOwnPropertyDescriptor(n, e)
                );
              });
        }
        return t;
      },
      typeof: n,
      asyncToGenerator: function (t) {
        return function () {
          var e = this,
            r = arguments;
          return new Promise(function (n, i) {
            var a = t.apply(e, r);
            function u(t) {
              o(a, n, i, u, c, "next", t);
            }
            function c(t) {
              o(a, n, i, u, c, "throw", t);
            }
            u(void 0);
          });
        };
      },
      classCallCheck: function (t, e) {
        if (!(t instanceof e))
          throw new TypeError("Cannot call a class as a function");
      },
      createClass: function (t, e, r) {
        return e && i(t.prototype, e), r && i(t, r), t;
      },
      defineProperty: a,
      inherits: function (t, e) {
        if ("function" != typeof e && null !== e)
          throw new TypeError(
            "Super expression must either be null or a function"
          );
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, writable: !0, configurable: !0 },
        })),
          e && c(t, e);
      },
      getPrototypeOf: u,
      setPrototypeOf: c,
      isNativeReflectConstruct: f,
      construct: l,
      isNativeFunction: s,
      wrapNativeSuper: p,
      assertThisInitialized: y,
      possibleConstructorReturn: h,
      createSuper: function (t) {
        var e = f();
        return function () {
          var r,
            n = u(t);
          if (e) {
            var o = u(this).constructor;
            r = Reflect.construct(n, arguments, o);
          } else r = n.apply(this, arguments);
          return h(this, r);
        };
      },
      superPropBase: v,
      get: d,
      taggedTemplateLiteral: function (t, e) {
        return (
          e || (e = t.slice(0)),
          Object.freeze(
            Object.defineProperties(t, { raw: { value: Object.freeze(e) } })
          )
        );
      },
      slicedToArray: function (t, e) {
        return m(t) || w(t, e) || O(t, e) || S();
      },
      toConsumableArray: function (t) {
        return b(t) || g(t) || O(t) || x();
      },
      arrayWithoutHoles: b,
      arrayWithHoles: m,
      iterableToArray: g,
      iterableToArrayLimit: w,
      unsupportedIterableToArray: O,
      arrayLikeToArray: j,
      nonIterableSpread: x,
      nonIterableRest: S,
      createForOfIteratorHelper: function (t, e) {
        var r =
          ("undefined" != typeof Symbol && t[Symbol.iterator]) ||
          t["@@iterator"];
        if (!r) {
          if (
            Array.isArray(t) ||
            (r = O(t)) ||
            (e && t && "number" == typeof t.length)
          ) {
            r && (t = r);
            var n = 0,
              o = function () {};
            return {
              s: o,
              n: function () {
                return n >= t.length
                  ? { done: !0 }
                  : { done: !1, value: t[n++] };
              },
              e: function (t) {
                throw t;
              },
              f: o,
            };
          }
          throw new TypeError(
            "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
          );
        }
        var i,
          a = !0,
          u = !1;
        return {
          s: function () {
            r = r.call(t);
          },
          n: function () {
            var t = r.next();
            return (a = t.done), t;
          },
          e: function (t) {
            (u = !0), (i = t);
          },
          f: function () {
            try {
              a || null == r.return || r.return();
            } finally {
              if (u) throw i;
            }
          },
        };
      },
      regeneratorRuntime: void 0,
    }),
    {
      setters: [],
      execute: function () {
        !(function () {
          var e = (function (t) {
            var e = Object.prototype,
              r = e.hasOwnProperty,
              n = "function" == typeof Symbol ? Symbol : {},
              o = n.iterator || "@@iterator",
              i = n.asyncIterator || "@@asyncIterator",
              a = n.toStringTag || "@@toStringTag";
            function u(t, e, r) {
              return (
                Object.defineProperty(t, e, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                }),
                t[e]
              );
            }
            try {
              u({}, "");
            } catch (t) {
              u = function (t, e, r) {
                return (t[e] = r);
              };
            }
            function c(t, e, r, n) {
              var o = e && e.prototype instanceof s ? e : s,
                i = Object.create(o.prototype),
                a = new x(n || []);
              return (
                (i._invoke = (function (t, e, r) {
                  var n = "suspendedStart";
                  return function (o, i) {
                    if ("executing" === n)
                      throw new Error("Generator is already running");
                    if ("completed" === n) {
                      if ("throw" === o) throw i;
                      return P();
                    }
                    for (r.method = o, r.arg = i; ; ) {
                      var a = r.delegate;
                      if (a) {
                        var u = w(a, r);
                        if (u) {
                          if (u === l) continue;
                          return u;
                        }
                      }
                      if ("next" === r.method) r.sent = r._sent = r.arg;
                      else if ("throw" === r.method) {
                        if ("suspendedStart" === n)
                          throw ((n = "completed"), r.arg);
                        r.dispatchException(r.arg);
                      } else "return" === r.method && r.abrupt("return", r.arg);
                      n = "executing";
                      var c = f(t, e, r);
                      if ("normal" === c.type) {
                        if (
                          ((n = r.done ? "completed" : "suspendedYield"),
                          c.arg === l)
                        )
                          continue;
                        return { value: c.arg, done: r.done };
                      }
                      "throw" === c.type &&
                        ((n = "completed"),
                        (r.method = "throw"),
                        (r.arg = c.arg));
                    }
                  };
                })(t, r, a)),
                i
              );
            }
            function f(t, e, r) {
              try {
                return { type: "normal", arg: t.call(e, r) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            t.wrap = c;
            var l = {};
            function s() {}
            function p() {}
            function y() {}
            var h = {};
            h[o] = function () {
              return this;
            };
            var v = Object.getPrototypeOf,
              d = v && v(v(S([])));
            d && d !== e && r.call(d, o) && (h = d);
            var b = (y.prototype = s.prototype = Object.create(h));
            function m(t) {
              ["next", "throw", "return"].forEach(function (e) {
                u(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function g(t, e) {
              var n;
              this._invoke = function (o, i) {
                function a() {
                  return new e(function (n, a) {
                    !(function n(o, i, a, u) {
                      var c = f(t[o], t, i);
                      if ("throw" !== c.type) {
                        var l = c.arg,
                          s = l.value;
                        return s && "object" == typeof s && r.call(s, "__await")
                          ? e.resolve(s.__await).then(
                              function (t) {
                                n("next", t, a, u);
                              },
                              function (t) {
                                n("throw", t, a, u);
                              }
                            )
                          : e.resolve(s).then(
                              function (t) {
                                (l.value = t), a(l);
                              },
                              function (t) {
                                return n("throw", t, a, u);
                              }
                            );
                      }
                      u(c.arg);
                    })(o, i, n, a);
                  });
                }
                return (n = n ? n.then(a, a) : a());
              };
            }
            function w(t, e) {
              var r = t.iterator[e.method];
              if (void 0 === r) {
                if (((e.delegate = null), "throw" === e.method)) {
                  if (
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    w(t, e),
                    "throw" === e.method)
                  )
                    return l;
                  (e.method = "throw"),
                    (e.arg = new TypeError(
                      "The iterator does not provide a 'throw' method"
                    ));
                }
                return l;
              }
              var n = f(r, t.iterator, e.arg);
              if ("throw" === n.type)
                return (
                  (e.method = "throw"), (e.arg = n.arg), (e.delegate = null), l
                );
              var o = n.arg;
              return o
                ? o.done
                  ? ((e[t.resultName] = o.value),
                    (e.next = t.nextLoc),
                    "return" !== e.method &&
                      ((e.method = "next"), (e.arg = void 0)),
                    (e.delegate = null),
                    l)
                  : o
                : ((e.method = "throw"),
                  (e.arg = new TypeError("iterator result is not an object")),
                  (e.delegate = null),
                  l);
            }
            function O(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function j(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function x(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(O, this),
                this.reset(!0);
            }
            function S(t) {
              if (t) {
                var e = t[o];
                if (e) return e.call(t);
                if ("function" == typeof t.next) return t;
                if (!isNaN(t.length)) {
                  var n = -1,
                    i = function e() {
                      for (; ++n < t.length; )
                        if (r.call(t, n))
                          return (e.value = t[n]), (e.done = !1), e;
                      return (e.value = void 0), (e.done = !0), e;
                    };
                  return (i.next = i);
                }
              }
              return { next: P };
            }
            function P() {
              return { value: void 0, done: !0 };
            }
            return (
              (p.prototype = b.constructor = y),
              (y.constructor = p),
              (p.displayName = u(y, a, "GeneratorFunction")),
              (t.isGeneratorFunction = function (t) {
                var e = "function" == typeof t && t.constructor;
                return (
                  !!e &&
                  (e === p || "GeneratorFunction" === (e.displayName || e.name))
                );
              }),
              (t.mark = function (t) {
                return (
                  Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, y)
                    : ((t.__proto__ = y), u(t, a, "GeneratorFunction")),
                  (t.prototype = Object.create(b)),
                  t
                );
              }),
              (t.awrap = function (t) {
                return { __await: t };
              }),
              m(g.prototype),
              (g.prototype[i] = function () {
                return this;
              }),
              (t.AsyncIterator = g),
              (t.async = function (e, r, n, o, i) {
                void 0 === i && (i = Promise);
                var a = new g(c(e, r, n, o), i);
                return t.isGeneratorFunction(r)
                  ? a
                  : a.next().then(function (t) {
                      return t.done ? t.value : a.next();
                    });
              }),
              m(b),
              u(b, a, "Generator"),
              (b[o] = function () {
                return this;
              }),
              (b.toString = function () {
                return "[object Generator]";
              }),
              (t.keys = function (t) {
                var e = [];
                for (var r in t) e.push(r);
                return (
                  e.reverse(),
                  function r() {
                    for (; e.length; ) {
                      var n = e.pop();
                      if (n in t) return (r.value = n), (r.done = !1), r;
                    }
                    return (r.done = !0), r;
                  }
                );
              }),
              (t.values = S),
              (x.prototype = {
                constructor: x,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(j),
                    !t)
                  )
                    for (var e in this)
                      "t" === e.charAt(0) &&
                        r.call(this, e) &&
                        !isNaN(+e.slice(1)) &&
                        (this[e] = void 0);
                },
                stop: function () {
                  this.done = !0;
                  var t = this.tryEntries[0].completion;
                  if ("throw" === t.type) throw t.arg;
                  return this.rval;
                },
                dispatchException: function (t) {
                  if (this.done) throw t;
                  var e = this;
                  function n(r, n) {
                    return (
                      (a.type = "throw"),
                      (a.arg = t),
                      (e.next = r),
                      n && ((e.method = "next"), (e.arg = void 0)),
                      !!n
                    );
                  }
                  for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                    var i = this.tryEntries[o],
                      a = i.completion;
                    if ("root" === i.tryLoc) return n("end");
                    if (i.tryLoc <= this.prev) {
                      var u = r.call(i, "catchLoc"),
                        c = r.call(i, "finallyLoc");
                      if (u && c) {
                        if (this.prev < i.catchLoc) return n(i.catchLoc, !0);
                        if (this.prev < i.finallyLoc) return n(i.finallyLoc);
                      } else if (u) {
                        if (this.prev < i.catchLoc) return n(i.catchLoc, !0);
                      } else {
                        if (!c)
                          throw new Error(
                            "try statement without catch or finally"
                          );
                        if (this.prev < i.finallyLoc) return n(i.finallyLoc);
                      }
                    }
                  }
                },
                abrupt: function (t, e) {
                  for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                    var o = this.tryEntries[n];
                    if (
                      o.tryLoc <= this.prev &&
                      r.call(o, "finallyLoc") &&
                      this.prev < o.finallyLoc
                    ) {
                      var i = o;
                      break;
                    }
                  }
                  i &&
                    ("break" === t || "continue" === t) &&
                    i.tryLoc <= e &&
                    e <= i.finallyLoc &&
                    (i = null);
                  var a = i ? i.completion : {};
                  return (
                    (a.type = t),
                    (a.arg = e),
                    i
                      ? ((this.method = "next"), (this.next = i.finallyLoc), l)
                      : this.complete(a)
                  );
                },
                complete: function (t, e) {
                  if ("throw" === t.type) throw t.arg;
                  return (
                    "break" === t.type || "continue" === t.type
                      ? (this.next = t.arg)
                      : "return" === t.type
                      ? ((this.rval = this.arg = t.arg),
                        (this.method = "return"),
                        (this.next = "end"))
                      : "normal" === t.type && e && (this.next = e),
                    l
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.finallyLoc === t)
                      return this.complete(r.completion, r.afterLoc), j(r), l;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.tryLoc === t) {
                      var n = r.completion;
                      if ("throw" === n.type) {
                        var o = n.arg;
                        j(r);
                      }
                      return o;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, e, r) {
                  return (
                    (this.delegate = {
                      iterator: S(t),
                      resultName: e,
                      nextLoc: r,
                    }),
                    "next" === this.method && (this.arg = void 0),
                    l
                  );
                },
              }),
              t
            );
          })("object" == typeof module ? module.exports : {});
          try {
            t("regeneratorRuntime", e);
          } catch (t) {
            Function("r", "regeneratorRuntime = r")(e);
          }
        })();
      },
    }
  );
});
