(function() {
  define(['jquery', 'ace/ace', 'searchreplace/base', 'bootstrap'], function($, ace, SRBase) {
    var input, output, sr;
    input = ace.edit('input');
    output = ace.edit('output');
    sr = new SRBase();
    return require(['searchreplace/filter/filter'], function(filter) {
      return sr.set(filter);
    });
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
