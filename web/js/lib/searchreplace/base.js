/*
The main class required to get started with searchreplace

@class SearchReplace
*/


(function() {
  define(['searchreplace/lib/nested-graph'], function(graph) {
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
        return graph(this.nodeId);
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
        var _base, _name;
        this.pointer = pointer != null ? pointer : null;
        if ((_base = this.data)[_name = this.pointer.id] == null) {
          _base[_name] = new SRData();
        }
        this.pointer.resolve(graph.visitor(function(g) {
          var a, b, edge, _i, _len, _ref, _results;
          a = g.id;
          _ref = g.edges;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            edge = _ref[_i];
            b = edge.id;
            _results.push(this.data[b] = this.filters[a][b].update(this.data[a]));
          }
          return _results;
        }));
        return this;
      };

      return SRBase;

    })();
    return SRBase;
  });

}).call(this);
