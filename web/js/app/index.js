(function() {
  define(['jquery', 'ace/ace', 'bootstrap', 'searchreplace'], function($, ace, bootstrap, searchreplace) {
    var input, noflo, output, update;
    noflo = require('noflo');
    input = ace.edit('input');
    output = ace.edit('output');
    update = function() {
      noflo.graph.loadFBP("'Hello, World!' -> IN Display(Output)", function(graph) {
        graph.baseDir = "/searchreplace";
        graph.addInitial(input.getValue(), 'Display', 'in');
        return noflo.createNetwork(graph, function(network) {
          return console.log("Network created");
        });
      });
      return output.setValue('', -1);
    };
    $('#filters').on('change', function() {});
    $('#filters').trigger('change');
    return input.on('change', function() {
      input.getValue();
      return update();
    });
  });

}).call(this);
