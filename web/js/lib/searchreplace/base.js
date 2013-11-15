/*
The main class required to get started with searchreplace

@class SearchReplace
*/


(function() {
  define(['searchreplace/lib/nested-graph'], function(graph) {
    "use strict";
    var SRBase;
    SRBase = (function() {
      /*
        private property
        @var integer manage node unicity
      */

      var _addNode, _nodeId;

      _nodeId = 1;

      /*
        private method
        add a new unique node
      */


      _addNode = function() {
        _nodeId++;
        return graph(_nodeId);
      };

      function SRBase() {
        this.pointer = null;
        this.datas = {};
        this.filters = {};
      }

      /*
        public method
        add a filter beetween two node and position the pointer
      */


      SRBase.prototype.add = function(filter, pointer) {
        var a, b, _base;
        this.pointer = pointer != null ? pointer : null;
        if (this.pointer === null) {
          this.pointer = _addNode();
        }
        a = this.pointer.id;
        this.pointer = this.pointer.attach(_addNode());
        b = this.pointer.id;
        if ((_base = this.filters)[a] == null) {
          _base[a] = {};
        }
        this.filters[a][b] = filter;
        return this;
      };

      /*
        public method
        update data from filter and pointer
      */


      SRBase.prototype.update = function(pointer) {
        var _base, _name,
          _this = this;
        this.pointer = pointer != null ? pointer : null;
        if ((_base = this.datas)[_name = this.pointer.id] == null) {
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
            _results.push(_this.datas[b] = _this.filters[a][b].update(_this.datas[a]));
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
