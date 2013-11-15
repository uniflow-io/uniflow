/*
@class SRGraph
*/


(function() {
  define(['searchreplace/lib/nested-graph'], function(Graph) {
    "use strict";
    var SRGraph;
    console.log(Graph);
    SRGraph = (function() {
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
        return Graph(_nodeId);
      };

      function SRGraph(data) {
        this.data = data;
        this.graph = {};
        this.filters = {};
      }

      /*
        public method
        attach a filter to current graph
      */


      SRGraph.prototype.attach = function(filter, graph) {};

      /*
        public method
        remove a filter given graph
      */


      SRGraph.prototype.detach = function(graph) {};

      /*
        public method
        update the graph
      */


      SRGraph.prototype.update = function() {};

      return SRGraph;

    })();
    return SRGraph;
  });

}).call(this);
