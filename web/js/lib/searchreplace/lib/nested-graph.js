(function() {
  var Graph, attach, dependants, detach, find, indexOf, list, remove, resolve, size, subgraph, visitor;

  Graph = function(id) {
    var graph;
    if (!(this instanceof Graph)) {
      return new Graph(id);
    }
    if (!id || typeof id !== "string") {
      throw new Error("Graph() requires non-empty string id argument.");
    }
    graph = this;
    graph.id = id;
    graph.edges = [];
    return graph;
  };

  attach = function(node) {
    var graph;
    graph = this;
    if (!~graph.indexOf(node.id)) {
      graph.edges.push(node);
      return node;
    }
    return false;
  };

  indexOf = function(id) {
    var graph, i;
    graph = this;
    i = 0;
    while (i < graph.edges.length) {
      if (graph.edges[i].id === id) {
        return i;
      }
      ++i;
    }
    return -1;
  };

  detach = function(id) {
    var graph, i, node;
    graph = this;
    node = false;
    i = graph.indexOf(id);
    if (~i) {
      node = graph.edges.splice(i, 1)[0];
    }
    return node;
  };

  remove = function(id) {
    var graph, visitor;
    graph = this;
    visitor = graph.visitor(function(graph) {
      if (graph.detach(visitor.id)) {
        return visitor.results.push(graph);
      }
    });
    visitor.id = id;
    return graph.resolve(visitor);
  };

  dependants = function(id) {
    var graph, visitor;
    graph = this;
    visitor = graph.visitor(function(graph) {
      if (!visitor.visited[graph.id] && ~graph.indexOf(visitor.id)) {
        return visitor.results.push(graph);
      }
    });
    visitor.id = id;
    return graph.resolve(visitor);
  };

  subgraph = function() {
    var graph, id, visitor;
    graph = this;
    id = graph.id;
    visitor = graph.visitor(function(graph) {
      if (!visitor.visited[graph.id] && visitor.id !== graph.id) {
        return visitor.results.push(graph);
      }
    });
    visitor.id = id;
    return graph.resolve(visitor);
  };

  size = function() {
    var graph;
    graph = this;
    return graph.subgraph().results.length + 1;
  };

  find = function(id) {
    var graph, node, visitor;
    graph = this;
    node = false;
    visitor = graph.visitor(function(graph) {
      var index;
      index = graph.indexOf(id);
      if (~index) {
        node = graph.edges[index];
        return visitor.done();
      }
    });
    graph.resolve(visitor);
    return node;
  };

  list = function() {
    var graph, id, visitor;
    graph = this;
    id = graph.id;
    visitor = graph.visitor();
    visitor.depth = -1;
    visitor.process = function(graph) {
      var i;
      visitor.depth += 2;
      i = 0;
      while (i < visitor.depth) {
        visitor.results.push(" ");
        i++;
      }
      if (graph.edges.length > 0) {
        visitor.results.push("+");
      } else {
        visitor.results.push("-");
      }
      return visitor.results.push(" " + graph.id + "\n");
    };
    visitor.after = function(graph) {
      return visitor.depth -= 2;
    };
    return graph.resolve(visitor).results.join("");
  };

  resolve = function(visitor) {
    var graph, i, id;
    graph = this;
    id = graph.id;
    visitor = visitor || graph.visitor();
    if (!visitor.visited[id]) {
      visitor.ids.push(id);
      if (visitor.visiting[id]) {
        throw new Error("Circular reference detected: " + visitor.ids.join(" -> "));
      }
    }
    visitor.visiting[id] = 1;
    if (typeof visitor.process === "function") {
      visitor.process(graph);
    }
    if (!visitor.exit) {
      i = 0;
      while (i < graph.edges.length) {
        graph.edges[i].resolve(visitor);
        ++i;
      }
    }
    if (typeof visitor.after === "function") {
      visitor.after(graph);
    }
    visitor.visited[id] = 1;
    visitor.visiting[id] = 0;
    return visitor;
  };

  visitor = function(fn) {
    return {
      ids: [],
      results: [],
      visited: {},
      visiting: {},
      done: function() {
        return this.exit = true;
      },
      process: fn,
      after: null
    };
  };

  Graph.prototype.attach = attach;

  Graph.prototype.indexOf = indexOf;

  Graph.prototype.detach = detach;

  Graph.prototype.remove = remove;

  Graph.prototype.dependants = dependants;

  Graph.prototype.subgraph = subgraph;

  Graph.prototype.size = size;

  Graph.prototype.find = find;

  Graph.prototype.list = list;

  Graph.prototype.resolve = resolve;

  Graph.prototype.visitor = visitor;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = Graph;
  } else if (typeof define === "function" && define.amd) {
    define("nested-graph", [], function() {
      return Graph;
    });
  }

}).call(this);
