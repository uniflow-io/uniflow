# This file is part of the searchreplace package.
#
# (c) Mathieu Ledru <matyo91@gmail.com>
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

###
@class SRGraph
###
define ['searchreplace/lib/nested-graph'], (Graph) ->
  "use strict"

  class SRGraph
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
      Graph(_nodeId)

    constructor: (@data)->
      #egdes filters
      @filters = {}

    ###
      public method
      attach a filter to current graph
    ###
    attach: (filter, graph) ->

    ###
      public method
      remove a filter given graph
    ###
    detach: (graph) ->

    ###
      public method
      update the graph
    ###
    update: ->


  SRGraph