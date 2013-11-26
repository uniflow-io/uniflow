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
    noflo.graph.loadFBP "'Hello, World!' -> IN Display(Output)", (graph) ->
      graph.baseDir = "/searchreplace"
      graph.addInitial input.getValue(), 'Display', 'in'
      noflo.createNetwork graph, (network) ->
        console.log "Network created"

    output.setValue '', -1

  $('#filters').on 'change', ->

  $('#filters').trigger('change')

  input.on 'change', () ->
    input.getValue()
    update()
