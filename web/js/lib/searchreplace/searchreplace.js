/*
The main class required to get started with searchreplace

@class SearchReplace
*/


(function() {
  define(['searchreplace/lib/simple-graph'], function(Graph) {
    "use strict";
    var SRBase;
    SRBase = (function() {
      function SRBase() {
        this.nodeId = 1;
        this.pointer = null;
        this.datas = {};
        this.filters = {};
      }

      SRBase.prototype.addNode = function() {
        this.nodeId++;
        return new Graph('srid:' + this.nodeId);
      };

      SRBase.prototype.add = function(filter, pointer) {
        var a, b, _base;
        this.pointer = pointer != null ? pointer : null;
        if (this.pointer === null) {
          this.pointer = this.addNode();
        }
        a = this.pointer.id;
        this.pointer = this.pointer.attach(this.addNode());
        b = this.pointer.id;
        if ((_base = this.filters)[a] == null) {
          _base[a] = {};
        }
        this.filters[a][b] = filter;
        return this;
      };

      SRBase.prototype.update = function(pointer) {
        this.pointer = pointer != null ? pointer : null;
        return this;
      };

      return SRBase;

    })();
    return SRBase;
  });

}).call(this);
