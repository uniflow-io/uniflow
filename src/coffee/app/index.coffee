define [
  'jquery',
  'ace/ace',
  'bootstrap',
  'searchreplace',
], ($, ace, bootstrap, searchreplace) ->
  noflo = require 'noflo'

  input = ace.edit 'input'
  output = ace.edit 'output'

  update = ->
    graph = new noflo.Graph
    graph.baseDir = "/searchreplace"
    graph.addNode 'Replace', 'SRComponent'
    graph.addNode 'Fun', 'Callback'
    graph.addEdge 'Replace', 'out', 'Fun', 'in'
    graph.addInitial (data) ->
      output.setValue data, -1
    , 'Fun', 'callback'
    graph.addInitial input.getValue(), 'Replace', 'in'
    noflo.createNetwork graph, (network) ->
      #console.log "Network created"

  $('#filters').on 'change', ->
    update()

  $('#filters').trigger('change')

  input.on 'change', () ->
    input.getValue()
    update()
