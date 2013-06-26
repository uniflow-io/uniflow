define ['jquery','ace/ace','bootstrap'], ($,ace) ->
  input = ace.edit 'input'
  output = ace.edit 'output'
  console.log 'coco', 'dodo'

  input.on 'change', () ->
    output.setValue input.getValue(), -1
