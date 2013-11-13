(function() {
  define(['jquery', 'ace/ace', 'searchreplace/base', 'bootstrap'], function($, ace, SRBase) {
    var applyFilter, changeFilter, filter, input, output;
    input = ace.edit('input');
    output = ace.edit('output');
    /*
    sr = new SRBase()
    require ['searchreplace/filter/filter'], (filter) ->
      sr.add filter
      sr.update()
    */

    filter = null;
    applyFilter = function() {
      var f, value;
      f = new filter();
      value = f.update(input.getValue());
      return output.setValue(value, -1);
    };
    changeFilter = function(name) {
      return require(['searchreplace/filter/' + name], function(newFilter) {
        filter = newFilter;
        return applyFilter();
      });
    };
    changeFilter('filter');
    $('#filters').on('change', function() {
      return changeFilter($(this).val());
    });
    return input.on('change', function() {
      return applyFilter();
    });
  });

}).call(this);
