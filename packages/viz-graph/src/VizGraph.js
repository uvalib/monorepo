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
exports.VizGraph = void 0;
var lit_1 = require("lit");
var decorators_js_1 = require("lit/decorators.js");
var VizGraph = /** @class */ (function (_super) {
    __extends(VizGraph, _super);
    function VizGraph() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = 'Hey there';
        _this.counter = 5;
        return _this;
    }
    VizGraph.prototype.__increment = function () {
        this.counter += 1;
    };
    VizGraph.prototype.render = function () {
        return (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      <h2>", " Nr. ", "!</h2>\n      <button @click=", ">increment</button>\n    "], ["\n      <h2>", " Nr. ", "!</h2>\n      <button @click=", ">increment</button>\n    "])), this.title, this.counter, this.__increment);
    };
    VizGraph.styles = (0, lit_1.css)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    :host {\n      display: block;\n      padding: 25px;\n      color: var(--viz-graph-text-color, #000);\n    }\n  "], ["\n    :host {\n      display: block;\n      padding: 25px;\n      color: var(--viz-graph-text-color, #000);\n    }\n  "])));
    __decorate([
        (0, decorators_js_1.property)({ type: String })
    ], VizGraph.prototype, "title");
    __decorate([
        (0, decorators_js_1.property)({ type: Number })
    ], VizGraph.prototype, "counter");
    return VizGraph;
}(lit_1.LitElement));
exports.VizGraph = VizGraph;
var templateObject_1, templateObject_2;
