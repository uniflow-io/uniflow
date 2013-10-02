/*
The main class required to get started with searchreplace

@class DefaultFilter
*/


(function() {
  define(function() {
    "use strict";
    var SRFilter;
    SRFilter = (function() {
      function SRFilter() {}

      /*
      @param {*} input
      @returns {*}
      */


      SRFilter.prototype.update = function(input) {
        return input;
      };

      return SRFilter;

    })();
    return SRFilter;
  });

}).call(this);
