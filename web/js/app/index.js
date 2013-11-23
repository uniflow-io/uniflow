(function() {
  define(['jquery', 'ace/ace', 'bootstrap', 'searchreplace', 'searchreplace/graph', 'searchreplace/data/string'], function($, ace, bootstrap, searchreplace, SRGraph, SRStringData) {
    var input, inputGraph, noflo, output, outputGraph, update;
    noflo = require('noflo');
    noflo.graph.loadFBP("'Hello, World!' -> IN Display(Output)", function(graph) {
      graph.baseDir = "/searchreplace";
      return noflo.createNetwork(graph, function(network) {
        return console.log("Network created");
      });
    });
    input = ace.edit('input');
    output = ace.edit('output');
    inputGraph = new SRGraph(new SRStringData(input.getValue()));
    outputGraph = new SRGraph(new SRStringData(output.getValue()));
    update = function() {
      inputGraph.update();
      return output.setValue(outputGraph.data.get(), -1);
    };
    $('#filters').on('change', function() {
      return require(['searchreplace/filter/' + $(this).val()], function(SRFilter) {
        inputGraph.detach(outputGraph);
        inputGraph.attach(new SRFilter(), outputGraph);
        return update();
      });
    });
    $('#filters').trigger('change');
    return input.on('change', function() {
      inputGraph.data.set(input.getValue());
      return update();
    });
  });

}).call(this);
