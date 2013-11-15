define [
  'jquery',
  'ace/ace',
  'bootstrap',
  'searchreplace/graph',
  'searchreplace/data/string',
], ($, ace, bootstrap,SRGraph, SRStringData) ->
  input = ace.edit 'input'
  output = ace.edit 'output'

  inputStringData = new SRGraph(new SRStringData());
  outputStringData = new SRGraph(new SRStringData());

  #require ['searchreplace/filter/filter'], (filter) -> sr.set filter

  ###
  filter = null

  applyFilter = ->
    f = new filter()
    value = f.update(input.getValue())
    output.setValue value, -1

  changeFilter = (name) ->
    require ['searchreplace/filter/' + name], (newFilter) ->
      filter = newFilter
      applyFilter()
  changeFilter('filter')

  $('#filters').on 'change', -> changeFilter($(@).val())

  input.on 'change', () -> applyFilter()
  ###
