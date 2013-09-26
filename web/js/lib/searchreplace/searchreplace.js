/*
The main class required to get started with searchreplace

@class SearchReplace
*/


(function() {
  define(function(require, exports, module) {
    "use strict";
    /*
    searchreplace
    
    @param {*} input
    @param filter
    @returns {*}
    */

    return exports.searchreplace = function(input, filter) {
      if (filter) {
        return filter(input);
      }
    };
  });

}).call(this);
