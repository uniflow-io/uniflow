/*
The main class required to get started with searchreplace

@class SearchReplace
*/


(function() {
  define(function() {
    "use strict";
    var SRBase;
    SRBase = (function() {
      function SRBase() {
        this.pointer = null;
        this.datas = null;
        this.filters = {};
      }

      SRBase.prototype.add = function(input, filter) {};

      SRBase.prototype.update = function(pointer) {
        if (pointer == null) {
          pointer = null;
        }
        if (filter) {
          return filter(input);
        }
      };

      return SRBase;

    })();
    return SRBase;
  });

}).call(this);
