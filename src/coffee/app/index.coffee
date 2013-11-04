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
    f = new filter()
    value = f.update(input.getValue())
    output.setValue value, -1

  changeFilter = (name) ->
    require ['searchreplace/filter/' + name], (newFilter) ->
      filter = newFilter
      applyFilter()
  changeFilter('filter')

  $('#filters').on 'change', -> changeFilter($(@).val())
  ###

  input.on 'change', () -> applyFilter()
