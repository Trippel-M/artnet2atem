/* */ 
"format cjs";
"use strict";

var _babelToolsProtectJs2 = require("./../../babel/tools/protect.js");

var _babelToolsProtectJs3 = _interopRequireDefault(_babelToolsProtectJs2);

var _state = require("./state");

_babelToolsProtectJs3["default"](module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var pp = _state.Parser.prototype;

var STATE_KEYS = ["lastTokStartLoc", "lastTokEndLoc", "lastTokStart", "lastTokEnd", "lineStart", "startLoc", "curLine", "endLoc", "start", "pos", "end", "type", "value", "exprAllowed", "potentialArrowAt", "currLine", "input", "inType", "inFunction", "inGenerator", "labels"];

pp.getState = function () {
  var state = {};
  for (var i = 0; i < STATE_KEYS.length; i++) {
    var key = STATE_KEYS[i];
    state[key] = this[key];
  }
  state.context = this.context.slice();
  state.labels = this.labels.slice();
  return state;
};

pp.lookahead = function () {
  var old = this.getState();
  this.isLookahead = true;
  this.next();
  this.isLookahead = false;
  var curr = this.getState();
  for (var key in old) this[key] = old[key];
  return curr;
};