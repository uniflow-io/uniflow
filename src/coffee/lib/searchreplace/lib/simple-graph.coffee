# js2coffee from https://github.com/dfkaye/simple-graph

#
# Graph constructor (new is optional)
# param string id - required
# 
Graph = (id) ->
  return new Graph(id)  unless this instanceof Graph
  throw new Error("Graph() requires non-empty string id argument.")  if not id or typeof id isnt "string"
  graph = this
  graph.id = id
  graph.edges = []

#
# attach child to current graph
# 
attach = (node) ->
  graph = this
  unless ~graph.indexOf(node.id)
    graph.edges.push node
    return node
  false

#
# return index of child with matching id
# 
indexOf = (id) ->
  graph = this
  i = 0

  while i < graph.edges.length
    return i  if graph.edges[i].id is id
    ++i
  -1

#
# detach child with matching id
# 
detach = (id) ->
  graph = this
  node = false
  i = graph.indexOf(id)
  node = graph.edges.splice(i, 1)[0]  if ~i
  node

# traversal methods with resolve and visitor

#
# detaches all occurrences of subgraph from the graph and its descendants.
# param string id - required id of the subgraph to be detachd
# returns an array of graphs from which the target has been detachd.
#
remove = (id) ->
  graph = this
  visitor = graph.visitor((graph) ->
    visitor.results.push graph  if graph.detach(visitor.id)
  )
  visitor.id = id
  graph.resolve visitor

#
# find all graphs in subgraph that depend on graph with given id.
# param string id - required id for the target graph.
# return a visitor with the results field as array of ids of graphs that depend on the target subgraph.
# 
dependants = (id) ->
  graph = this
  visitor = graph.visitor((graph) ->
    visitor.results.push graph  if not visitor.visited[graph.id] and ~graph.indexOf(visitor.id)
  )
  visitor.id = id
  graph.resolve visitor

#
# find all graphs in subgraph that the graph with given id depends on.
# return a visitor with the results field as array of ids of graphs under the target subgraph.
# 
subgraph = ->
  graph = this
  id = graph.id
  visitor = graph.visitor((graph) ->
    visitor.results.push graph  if not visitor.visited[graph.id] and visitor.id isnt graph.id
  )
  visitor.id = id
  graph.resolve visitor

#
# size returns the number of results in the current graph *including the current graph*
# 
size = ->
  graph = this
  graph.subgraph().results.length + 1

#
# find child or descendant with matching id
# uses the visitor in order to avoid throwing errors
# a single match terminates search
# 
find = (id) ->
  graph = this
  node = false
  visitor = graph.visitor((graph) ->
    index = graph.indexOf(id)
    if ~index
      node = graph.edges[index]

      # this terminates the search in resolve()
      visitor.done()
  )
  graph.resolve visitor
  node

# recursive print, copied+modified from Processing to JavaScript
# ch. 7 of Visualizing Data by Ben Fry, O'Reilly, 2007
# Graph.prototype.list = list;
# function list(depth) {
#  
#  var out = [];
#  
#  (typeof depth == 'number' && depth >= 0) || (depth = 0)
#  
#  for (var i = 0; i < depth; i++) {
#      out.push('  '); // console
#  }
#  
#  out.push(this.id); // console
#  
#  if (this.edges.length) {
#  
#    out.push(':\n');
#    
#    for (var i = 0; i < this.edges.length; i++) {
#      out.push(this.edges[i].list(depth + 1)); // ye olde recursion...
#    }
#
#  } else {
#    out.push('\n');
#  }
#  
#  return out.join('');
# }
#

#
# alternate version of list iterator - shows deficiency of depth first traversal
# uses the visitor.after() post-process callback approach
# 
list = ->
  graph = this
  id = graph.id
  visitor = graph.visitor()
  visitor.depth = -1
  visitor.process = (graph) ->
    visitor.depth += 2 # unset this after() visiting...
    i = 0

    while i < visitor.depth
      visitor.results.push " "
      i++
    if graph.edges.length > 0
      visitor.results.push "+"
    else
      visitor.results.push "-"
    visitor.results.push " " + graph.id + "\n"


  # post-processing
  visitor.after = (graph) ->
    visitor.depth -= 2

  graph.resolve(visitor).results.join ""

#
# recursive visit through graph and subgraphs.
# sets an error field with an Error instance if a cycle is detected.
# param object visitor - optional - collector with interface provided by graph#visitor() method.
# returns visitor
#
resolve = (visitor) ->
  graph = this
  id = graph.id
  visitor = visitor or graph.visitor()
  unless visitor.visited[id]
    visitor.ids.push id
    throw new Error("Circular reference detected: " + visitor.ids.join(" -> "))  if visitor.visiting[id]

  # happy path
  visitor.visiting[id] = 1
  visitor.process graph  if typeof visitor.process is "function"

  # descend if didn't call done() 
  unless visitor.exit
    i = 0

    while i < graph.edges.length
      graph.edges[i].resolve visitor
      ++i

  # post-processing
  visitor.after graph  if typeof visitor.after is "function"
  visitor.visited[id] = 1
  visitor.visiting[id] = 0
  visitor

#
# return a visitor for use by the resolve() method
#
# TODO - looks like visitor wants to emerge as its own type
#          not sure if visitor should be an external object with visitor.visit(graph) api,
#          or should continue with graph.resolve(visitor)...
# 
visitor = (fn) ->
  ids: []
  results: []
  visited: {}
  visiting: {}
  done: ->
    @exit = true

  process: fn
  after: null

Graph::attach = attach
Graph::indexOf = indexOf
Graph::detach = detach
Graph::remove = remove
Graph::dependants = dependants
Graph::subgraph = subgraph
Graph::size = size
Graph::find = find
Graph::list = list
Graph::resolve = resolve
Graph::visitor = visitor

#
# {
#   ...
#   after: fn(fn) {
#     this.postprocess || (this.postprocess = []);
#     this.postprocess.push(fn);
# }
# 
# assignment:
# 
# visitor.after(fn);
# 
# 
# then in resolve():
# 
# if (visitor.postprocess) {
#     for (var i = 0; i < visitor.postprocess.length; ++i) {
#         visitor.postprocess[i](graph);
#     }
# }
#
#