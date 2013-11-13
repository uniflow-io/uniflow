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
define ['searchreplace/lib/simple-graph'], (graph) ->
  "use strict"

  class SRBase
    constructor: ->
      @nodeId = 1
      @pointer = null
      @datas = {}
      @filters = {}

    addNode: ->
      @nodeId++
      graph(@nodeId)

    add: (filter, @pointer = null) ->
      @pointer = @addNode() if @pointer is null
      a = @pointer.id
      @pointer = @pointer.attach(@addNode())
      b = @pointer.id

      @filters[a] ?= {}
      @filters[a][b] = filter

      @

    update: (@pointer = null) ->
      @data[@pointer.id] ?= new SRData()
      @pointer.resolve(graph.visitor((g) ->
        a = g.id
        for edge in g.edges
          b = edge.id
          @data[b] = @filters[a][b].update @data[a]
      ))

      @

  SRBase