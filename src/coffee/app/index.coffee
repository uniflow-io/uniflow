define [
  'jquery',
  'ace/ace',
  'bootstrap',
  'searchreplace/graph',
  'searchreplace/data/string',
], ($, ace, bootstrap,SRGraph, SRStringData) ->
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
