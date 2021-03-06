/* */ 
"format cjs";
"use strict";

var _toolsProtectJs2 = require("./../../tools/protect.js");

var _toolsProtectJs3 = _interopRequireDefault(_toolsProtectJs2);

exports.__esModule = true;
exports.is = is;
exports.pullFlag = pullFlag;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _lodashArrayPull = require("lodash/array/pull");

var _lodashArrayPull2 = _interopRequireDefault(_lodashArrayPull);

var _types = require("../../types");

var t = _interopRequireWildcard(_types);

_toolsProtectJs3["default"](module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function is(node, flag) {
  return t.isLiteral(node) && node.regex && node.regex.flags.indexOf(flag) >= 0;
}

function pullFlag(node, flag) {
  var flags = node.regex.flags.split("");
  if (node.regex.flags.indexOf(flag) < 0) return;
  _lodashArrayPull2["default"](flags, flag);
  node.regex.flags = flags.join("");
}