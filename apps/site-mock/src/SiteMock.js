"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SiteMock = void 0;
var lit_1 = require("lit");
var decorators_js_1 = require("lit/decorators.js");
require("@uvalib/bento-box/bento-box.js");
var logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;
var SiteMock = /** @class */ (function (_super) {
    __extends(SiteMock, _super);
    function SiteMock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = 'My app';
        return _this;
    }
    SiteMock.prototype.render = function () {
        return (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      <main>\n\n        <bento-box></bento-box>\n\n        <div class=\"logo\"><img alt=\"open-wc logo\" src=", " /></div>\n        <h1>", "</h1>\n\n        <p>Edit <code>src/SiteMock.ts</code> and save to reload.</p>\n        <a\n          class=\"app-link\"\n          href=\"https://open-wc.org/guides/developing-components/code-examples\"\n          target=\"_blank\"\n          rel=\"noopener noreferrer\"\n        >\n          Code examples\n        </a>\n      </main>\n\n      <p class=\"app-footer\">\n        \uD83D\uDEBD Made with love by\n        <a\n          target=\"_blank\"\n          rel=\"noopener noreferrer\"\n          href=\"https://github.com/open-wc\"\n          >open-wc</a\n        >.\n      </p>\n    "], ["\n      <main>\n\n        <bento-box></bento-box>\n\n        <div class=\"logo\"><img alt=\"open-wc logo\" src=", " /></div>\n        <h1>", "</h1>\n\n        <p>Edit <code>src/SiteMock.ts</code> and save to reload.</p>\n        <a\n          class=\"app-link\"\n          href=\"https://open-wc.org/guides/developing-components/code-examples\"\n          target=\"_blank\"\n          rel=\"noopener noreferrer\"\n        >\n          Code examples\n        </a>\n      </main>\n\n      <p class=\"app-footer\">\n        \uD83D\uDEBD Made with love by\n        <a\n          target=\"_blank\"\n          rel=\"noopener noreferrer\"\n          href=\"https://github.com/open-wc\"\n          >open-wc</a\n        >.\n      </p>\n    "])), logo, this.title);
    };
    SiteMock.styles = (0, lit_1.css)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    :host {\n      min-height: 100vh;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: flex-start;\n      font-size: calc(10px + 2vmin);\n      color: #1a2b42;\n      max-width: 960px;\n      margin: 0 auto;\n      text-align: center;\n      background-color: var(--site-mock-background-color);\n    }\n\n    main {\n      flex-grow: 1;\n    }\n\n    .logo {\n      margin-top: 36px;\n      animation: app-logo-spin infinite 20s linear;\n    }\n\n    @keyframes app-logo-spin {\n      from {\n        transform: rotate(0deg);\n      }\n      to {\n        transform: rotate(360deg);\n      }\n    }\n\n    .app-footer {\n      font-size: calc(12px + 0.5vmin);\n      align-items: center;\n    }\n\n    .app-footer a {\n      margin-left: 5px;\n    }\n  "], ["\n    :host {\n      min-height: 100vh;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: flex-start;\n      font-size: calc(10px + 2vmin);\n      color: #1a2b42;\n      max-width: 960px;\n      margin: 0 auto;\n      text-align: center;\n      background-color: var(--site-mock-background-color);\n    }\n\n    main {\n      flex-grow: 1;\n    }\n\n    .logo {\n      margin-top: 36px;\n      animation: app-logo-spin infinite 20s linear;\n    }\n\n    @keyframes app-logo-spin {\n      from {\n        transform: rotate(0deg);\n      }\n      to {\n        transform: rotate(360deg);\n      }\n    }\n\n    .app-footer {\n      font-size: calc(12px + 0.5vmin);\n      align-items: center;\n    }\n\n    .app-footer a {\n      margin-left: 5px;\n    }\n  "])));
    __decorate([
        (0, decorators_js_1.property)({ type: String })
    ], SiteMock.prototype, "title");
    return SiteMock;
}(lit_1.LitElement));
exports.SiteMock = SiteMock;
var templateObject_1, templateObject_2;
