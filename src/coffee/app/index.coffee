define ['jquery','ace/ace','searchreplace/searchreplace','bootstrap'], ($, ace, searchreplace) ->
  input = ace.edit 'input'
  output = ace.edit 'output'

  filter = null

  applyFilter = ->
    output.setValue searchreplace(input.getValue(), filter), -1

  changeFilter = (name) ->
    require ['searchreplace/filter/' + name], (newFilter) ->
      filter = newFilter
      applyFilter()
  changeFilter('default')

  $('#filters').on 'change', -> changeFilter($(@).val())

  input.on 'change', () -> applyFilter()
