(function() {
  define(['jquery', 'ace/ace', 'searchreplace/base', 'bootstrap'], function($, ace, SRBase) {
    var input, output, sr;
    input = ace.edit('input');
    output = ace.edit('output');
    sr = new SRBase();
    require(['searchreplace/filter/filter'], function(filter) {
      sr.add(filter);
      return sr.update();
    });
    /*
    filter = null
    
    applyFilter = ->
      output.setValue searchreplace(input.getValue(), filter), -1
    
    changeFilter = (name) ->
      require ['searchreplace/filter/' + name], (newFilter) ->
        filter = newFilter
        applyFilter()
    changeFilter('default')
    
    $('#filters').on 'change', -> changeFilter($(@).val())
    */

    return input.on('change', function() {
      return applyFilter();
    });
  });

}).call(this);
