(function() {
  define(['jquery', 'ace/ace', 'bootstrap', 'searchreplace/searchreplace'], function($, ace) {
    var filters, input, output, searchreplace;
    filters = $('#filters');
    filters.on('change', function() {
      return console.log($(this).val());
    });
    input = ace.edit('input');
    output = ace.edit('output');
    searchreplace = require(['searchreplace/searchreplace'], function(sp) {
      return console.log(sp);
    });
    return input.on('change', function() {
      return output.setValue(input.getValue(), -1);
    });
  });

}).call(this);
