// Generated by CoffeeScript 1.4.0
(function() {
  var Base, Keyboard,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Base = require('./Base').Base;

  Keyboard = (function(_super) {

    __extends(Keyboard, _super);

    function Keyboard() {
      this.on_q = __bind(this.on_q, this);

      this.onInput = __bind(this.onInput, this);

      this.start = __bind(this.start, this);
      return Keyboard.__super__.constructor.apply(this, arguments);
    }

    Keyboard.prototype.start = function() {
      this.on('input', this.onInput);
      return this.emit('api', 'input.left');
    };

    Keyboard.prototype.apiSendMap = {
      'LEFT': 'left',
      'RIGHT': 'right',
      'UP': 'up',
      'DOWN': 'down',
      'NEWLINE': 'select',
      'ESC': 'home',
      127: 'back',
      'm': 'showosd',
      'o': 'showcodec',
      'c': 'contextmenu',
      'i': 'info'
    };

    Keyboard.prototype.onInput = function(c, i) {
      var key, _i, _len, _ref;
      _ref = [c, i];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (this.apiSendMap[key] != null) {
          this.log("sending Input." + this.apiSendMap[key] + " (" + key + ")");
          return this.emit('apiSendInput', this.apiSendMap[key]);
        }
        if (this["on_" + key] != null) {
          return this["on_" + key]();
        }
      }
      return this.emit('unknownInput', c, i);
    };

    Keyboard.prototype.on_q = function() {
      return this.emit('quit');
    };

    return Keyboard;

  })(Base);

  module.exports = {
    Keyboard: Keyboard
  };

}).call(this);