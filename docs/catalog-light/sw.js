if (!self.define) {
  const e = (e) => {
      "require" !== e && (e += ".js");
      let r = Promise.resolve();
      return (
        s[e] ||
          (r = new Promise(async (r) => {
            if ("document" in self) {
              const s = document.createElement("script");
              (s.src = e), document.head.appendChild(s), (s.onload = r);
            } else importScripts(e), r();
          })),
        r.then(() => {
          if (!s[e]) throw new Error(`Module ${e} didn’t register its module`);
          return s[e];
        })
      );
    },
    r = (r, s) => {
      Promise.all(r.map(e)).then((e) => s(1 === e.length ? e[0] : e));
    },
    s = { require: Promise.resolve(r) };
  self.define = (r, t, i) => {
    s[r] ||
      (s[r] = Promise.resolve().then(() => {
        let s = {};
        const n = { uri: location.origin + r.slice(1) };
        return Promise.all(
          t.map((r) => {
            switch (r) {
              case "exports":
                return s;
              case "module":
                return n;
              default:
                return e(r);
            }
          })
        ).then((e) => {
          const r = i(...e);
          return s.default || (s.default = r), s;
        });
      }));
  };
}
define("./sw.js", ["./workbox-572c7e09"], function (e) {
  "use strict";
  e.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "0ced4459.js", revision: "7e069aa485276d7d73fd2d183cd37208" },
        { url: "index.html", revision: "6ffedbae5474b077dacc2d6894ca8b7e" },
      ],
      {}
    ),
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL("/index.html"))
    ),
    e.registerRoute("polyfills/*.js", new e.CacheFirst(), "GET");
});
//# sourceMappingURL=sw.js.map
