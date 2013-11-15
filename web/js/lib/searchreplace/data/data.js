/*
@class DefaultFilter
*/


(function() {
  define(function() {
    "use strict";
    var SRData;
    SRData = (function() {
      function SRData(data) {
        this.data = data != null ? data : null;
      }

      SRData.prototype.set = function(data) {
        this.data = data;
        return this;
      };

      SRData.prototype.get = function() {
        return this.data;
      };

      return SRData;

    })();
    return SRData;
  });

}).call(this);
