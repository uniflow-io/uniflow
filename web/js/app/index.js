(function() {
  define(['jquery', 'ace/ace', 'bootstrap', 'searchreplace/graph', 'searchreplace/data/string'], function($, ace, bootstrap, SRGraph, SRStringData) {
    var input, inputStringData, output, outputStringData;
    input = ace.edit('input');
    output = ace.edit('output');
    inputStringData = new SRGraph(new SRStringData());
    return outputStringData = new SRGraph(new SRStringData());
    /*
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
    */

  });

}).call(this);
