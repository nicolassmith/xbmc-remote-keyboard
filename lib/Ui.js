(function() {
  var Base, Ui, nc,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  Base = require('./Base').Base;

  nc = require('ncurses');

  Ui = (function(_super) {

    __extends(Ui, _super);

    function Ui() {
      this.onSIGINT = __bind(this.onSIGINT, this);
      this.onSIGWINCH = __bind(this.onSIGWINCH, this);
      this.onInputChar = __bind(this.onInputChar, this);
      this.human = __bind(this.human, this);
      this.close = __bind(this.close, this);
      this.draw = __bind(this.draw, this);
      this.log = __bind(this.log, this);
      this.initLogProxy = __bind(this.initLogProxy, this);
      this.start = __bind(this.start, this);
      Ui.__super__.constructor.apply(this, arguments);
    }

    Ui.prototype.start = function() {
      this.win = new nc.Window();
      if (this.options.verbose || this.options.debug) this.initLogProxy();
      nc.showCursor = false;
      this.win.on('inputChar', this.onInputChar);
      process.on('SIGWINCH', this.onSIGWINCH);
      process.on('SIGINT', this.onSIGINT);
      return this.draw();
    };

    Ui.prototype.initLogProxy = function() {
      this.logBuffer = [];
      this.oldLog = console.log;
      return console.log = this.log;
    };

    Ui.prototype.log = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.logBuffer.push(__slice.call(args));
      return this.draw();
    };

    Ui.prototype.draw = function() {
      var base, i, limit, message;
      this.win.erase();
      this.win.insstr(0, 0, 'Press Q to quit');
      if (this.options.verbose || this.options.debug) {
        limit = Math.min(nc.lines - 3, this.logBuffer.length);
        base = Math.max(0, this.logBuffer.length - limit);
        for (i = 0; 0 <= limit ? i < limit : i > limit; 0 <= limit ? i++ : i--) {
          message = this.logBuffer[base + i].join(' ');
          this.win.insstr(i + 2, 0, message);
        }
      }
      return this.win.refresh();
    };

    Ui.prototype.close = function() {
      this.win.erase();
      return nc.cleanup();
    };

    Ui.prototype.human = function(c, i) {
      var key, val, _ref;
      _ref = nc.keys;
      for (key in _ref) {
        val = _ref[key];
        if (val === i) return key;
      }
      return c;
    };

    Ui.prototype.onInputChar = function(c, i) {
      this.emit('rawInput', c, i);
      return this.emit('input', this.human(c, i), c, i);
    };

    Ui.prototype.onSIGWINCH = function() {
      return this.draw();
    };

    Ui.prototype.onSIGINT = function() {
      return this.emit('quit');
    };

    return Ui;

  })(Base);

  module.exports = {
    Ui: Ui
  };

}).call(this);
