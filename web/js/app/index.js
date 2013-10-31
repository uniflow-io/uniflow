(function() {
  define(['jquery', 'ace/ace', 'searchreplace/searchreplace', 'bootstrap'], function($, ace, searchreplace) {
    var applyFilter, changeFilter, filter, input, output, sr;
    input = ace.edit('input');
    output = ace.edit('output');
    sr = new searchreplace();
    sr.add('filter');
    filter = null;
    applyFilter = function() {
      return output.setValue(searchreplace(input.getValue(), filter), -1);
    };
    changeFilter = function(name) {
      return require(['searchreplace/filter/' + name], function(newFilter) {
        filter = newFilter;
        return applyFilter();
      });
    };
    changeFilter('default');
    $('#filters').on('change', function() {
      return changeFilter($(this).val());
    });
    return input.on('change', function() {
      return applyFilter();
    });
  });

}).call(this);
