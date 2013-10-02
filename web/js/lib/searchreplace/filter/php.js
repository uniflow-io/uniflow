/*
The main class required to get started with searchreplace

@class GettersAndSettersFilter
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['searchreplace/filter/filter', 'php', 'php.xhr'], function() {
    "use strict";
    var SRPHPFilter, _ref;
    SRPHPFilter = (function(_super) {
      __extends(SRPHPFilter, _super);

      function SRPHPFilter() {
        _ref = SRPHPFilter.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      /*
      @param {*} input
      @returns {*}
      */


      SRPHPFilter.prototype.update = function(input) {
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

      return SRPHPFilter;

    })(SRFilter);
    return SRPHPFilter;
  });

}).call(this);
