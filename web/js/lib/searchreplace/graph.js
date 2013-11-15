/*
@class SRGraph
*/


(function() {
  define(['nested-graph'], function(g) {
    "use strict";
    var SRGraph;
    SRGraph = (function() {
      /*
        private property
        @var integer unique id managment
      */

      var _uGraph, _uId;

      _uId = 0;

      /*
        private method
        add a new unique graph
      */


      _uGraph = function() {
        _uId++;
        return new g('sr_' + _uId);
      };

      function SRGraph(data) {
        this.data = data;
        this.graph = _uGraph();
        this.graph.ref = this;
        this.filters = {};
      }

      /*
        public method
        attach a filter to node
      */


      SRGraph.prototype.attach = function(filter, node) {
        this.graph.attach(node.graph);
        this.filters[node.graph.id] = filter;
        return node;
      };

      /*
        public method
        remove a filter from node
      */


      SRGraph.prototype.detach = function(node) {
        if (this.graph.detach(node.graph.id)) {
          delete this.filters[node.graph.id];
        }
        return node;
      };

      /*
        public method
        update the graph
      */


      SRGraph.prototype.update = function() {
        var data, filter, i, _results;
        i = 0;
        _results = [];
        while (i < this.graph.edges.length) {
          filter = this.filters[this.graph.edges[i].id];
          data = filter.update(this.data.get());
          this.graph.edges[i].ref.data.set(data);
          _results.push(++i);
        }
        return _results;
      };

      return SRGraph;

    })();
    return SRGraph;
  });

}).call(this);
