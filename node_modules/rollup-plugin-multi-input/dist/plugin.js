"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var fastGlob = _interopRequireWildcard(require("fast-glob"));
var _path = _interopRequireDefault(require("path"));
var _isString = _interopRequireDefault(require("lodash/isString"));
var _partition = _interopRequireDefault(require("lodash/partition"));
var _packageJson = require("../package.json");
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
var _Object;
/**
 * default multi-input Options
 * */ var defaultOptions = {
    // `path.sep` is used for windows support
    relative: "src".concat(_path.default.sep)
};
// extract the output file name from a file name
var outputFileName = function(filePath) {
    return filePath.replace(/\.[^/.]+$/, '').replace(/\\/g, '/');
};
var _default = function(param) {
    var options = param === void 0 ? defaultOptions : param;
    var globOptions = options.glob, _relative = options.relative, relative = _relative === void 0 ? defaultOptions.relative : _relative, transformOutputPath = options.transformOutputPath;
    return {
        name: _packageJson.name,
        options: function(conf) {
            // flat to enable input to be a string or an array
            // separate globs inputs string from others to enable input to be a mixed array too
            var ref = _slicedToArray((0, _partition).default([
                conf.input
            ].flat(), _isString.default), 2), globs = ref[0], others = ref[1];
            var normalizedGlobs = globs.map(function(glob) {
                return glob.replace(/\\/g, '/');
            });
            // get files from the globs strings and return as a Rollup entries Object
            var input = (_Object = Object).assign.apply(_Object, [
                {
                },
                Object.fromEntries(fastGlob.sync(normalizedGlobs, globOptions).map(function(name) {
                    var filePath = _path.default.relative(relative, name);
                    var isRelative = !filePath.startsWith("..".concat(_path.default.sep));
                    var relativeFilePath = isRelative ? filePath : _path.default.relative(".".concat(_path.default.sep), name);
                    if (transformOutputPath) {
                        return [
                            outputFileName(transformOutputPath(relativeFilePath, name)),
                            name
                        ];
                    }
                    return [
                        outputFileName(relativeFilePath),
                        name
                    ];
                })), 
            ].concat(// add no globs input to the result
            _toConsumableArray(others)));
            // return the new configuration with the glob input and the non string inputs
            return _objectSpread({
            }, conf, {
                input: input
            });
        }
    };
};
exports.default = _default;
