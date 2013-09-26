/*
The main class required to get started with searchreplace

@class SearchReplace
*/


(function() {
  define(function() {
    "use strict";
    /*
    searchreplace
    
    @param {*} input
    @param filter
    @returns {*}
    */

    return function(input, filter) {
      if (filter) {
        return filter(input);
      }
    };
  });

}).call(this);
