define ['jquery','ace/ace','searchreplace/base','bootstrap'], ($, ace, SRBase) ->
  input = ace.edit 'input'
  output = ace.edit 'output'

  sr = new SRBase()
  require ['searchreplace/filter/filter'], (filter) ->
    sr.add filter
    sr.update()

  ###
  filter = null

  applyFilter = ->
    output.setValue searchreplace(input.getValue(), filter), -1

  changeFilter = (name) ->
    require ['searchreplace/filter/' + name], (newFilter) ->
      filter = newFilter
      applyFilter()
  changeFilter('default')

  $('#filters').on 'change', -> changeFilter($(@).val())
  ###

  input.on 'change', () -> applyFilter()
