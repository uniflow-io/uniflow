/*
The main class required to get started with searchreplace

@class GettersAndSettersFilter
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['searchreplace/filter', 'php', 'php.xhr'], function() {
    "use strict";
    var SRGetterAndSettersFilter, _ref;
    SRGetterAndSettersFilter = (function(_super) {
      __extends(SRGetterAndSettersFilter, _super);

      function SRGetterAndSettersFilter() {
        _ref = SRGetterAndSettersFilter.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      /*
      @param {*} input
      @returns {*}
      */


      SRGetterAndSettersFilter.prototype.update = function(input) {
        var opts, path, php;
        path = window.location.pathname;
        opts = {
          SERVER: {
            SCRIPT_FILENAME: path.substring(0, path.length - 1)
          },
          filesystem: new PHP.Adapters.XHRFileSystem()
        };
        php = new PHP(input, opts);
        return php.vm.OUTPUT_BUFFER;
      };

      return SRGetterAndSettersFilter;

    })(SRFilter);
    return SRGetterAndSettersFilter;
  });

}).call(this);
