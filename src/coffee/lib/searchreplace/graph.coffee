# This file is part of the searchreplace package.
#
# (c) Mathieu Ledru <matyo91@gmail.com>
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

###
@class SRGraph
###
define ['nested-graph'], (g) ->
  "use strict"

  class SRGraph
    ###
      private property
      @var integer unique id managment
    ###
    _uId = 0

    ###
      private method
      add a new unique graph
    ###
    _uGraph = ->
      _uId++
      new g('sr_' + _uId)

    constructor: (@data) ->
      #graph
      @graph = _uGraph()
      @graph.ref = @

      #egdes filters
      @filters = {}

    ###
      public method
      attach a filter to node
    ###
    attach: (filter, node) ->
      @graph.attach node.graph
      @filters[node.graph.id] = filter
      node

    ###
      public method
      remove a filter from node
    ###
    detach: (node) ->
      delete @filters[node.graph.id] if @graph.detach node.graph.id
      node

    ###
      public method
      update the graph
    ###
    update: ->
      i = 0

      while i < @graph.edges.length
        filter = @filters[@graph.edges[i].id]
        data = filter.update(@data.get())
        @graph.edges[i].ref.data.set(data)

        ++i

  SRGraph