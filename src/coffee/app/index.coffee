define ['jquery','ace/ace','bootstrap', 'searchreplace/searchreplace'], ($,ace) ->
  filters = $('#filters')
  filters.on 'change', ->
    console.log $(@).val()

  input = ace.edit 'input'
  output = ace.edit 'output'

  searchreplace = require ['searchreplace/searchreplace'], (sp) ->
    console.log sp

  input.on 'change', () ->
    output.setValue input.getValue(), -1
