define [
  'jquery',
  'ace/ace',
  'bootstrap',
  'searchreplace',
  'searchreplace/graph',
  'searchreplace/data/string',
], ($, ace, bootstrap, searchreplace, SRGraph, SRStringData) ->
  # Load some graph definition into NoFlo
  noflo = require 'noflo'
  noflo.graph.loadFBP "'Hello, World!' -> IN Display(Output)", (graph) ->

    # Make all included component libraries available
    graph.baseDir = "/searchreplace"

    # Create the live NoFlo network
    noflo.createNetwork graph, (network) ->
      console.log "Network created"

  input = ace.edit 'input'
  output = ace.edit 'output'

  inputGraph = new SRGraph(new SRStringData(input.getValue()));
  outputGraph = new SRGraph(new SRStringData(output.getValue()));

  update = ->
    inputGraph.update()
    output.setValue outputGraph.data.get(), -1

  $('#filters').on 'change', ->
    require ['searchreplace/filter/' + $(@).val()], (SRFilter) ->
      inputGraph.detach(outputGraph)
      inputGraph.attach(new SRFilter(), outputGraph)
      update()

  $('#filters').trigger('change')

  input.on 'change', () ->
    inputGraph.data.set(input.getValue())
    update()
