# This file is part of the searchreplace package.
#
# (c) Mathieu Ledru <matyo91@gmail.com>
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

###
The main class required to get started with searchreplace

@class SearchReplace
###
define ['searchreplace/lib/nested-graph'], (graph) ->
  "use strict"

  class SRBase
    ###
      private property
      @var integer manage node unicity
    ###
    _nodeId = 1

    ###
      private method
      add a new unique node
    ###
    _addNode = ->
      _nodeId++
      graph(_nodeId)

    constructor: ->
      # pointer to the current node
      @pointer = null

      # datas nodes and egdes filters
      @datas = {}
      @filters = {}

    ###
      public method
      add a filter beetween two node and position the pointer
    ###
    add: (filter, @pointer = null) ->
      @pointer = _addNode() if @pointer is null
      a = @pointer.id
      @pointer = @pointer.attach(_addNode())
      b = @pointer.id

      @filters[a] ?= {}
      @filters[a][b] = filter

      @

    ###
      public method
      update data from filter and pointer
    ###
    update: (@pointer = null) ->
      @datas[@pointer.id] ?= new SRData()
      @pointer.resolve(graph.visitor((g) ->
        a = g.id
        for edge in g.edges
          b = edge.id
          @datas[b] = @filters[a][b].update @datas[a]
      ))

      @

  SRBase