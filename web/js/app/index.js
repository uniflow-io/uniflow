(function() {
  define(['jquery', 'ace/ace', 'bootstrap'], function($, ace) {
    var input, output;
    input = ace.edit('input');
    output = ace.edit('output');
    console.log('coco', 'dodo');
    return input.on('change', function() {
      return output.setValue(input.getValue(), -1);
    });
  });

}).call(this);
