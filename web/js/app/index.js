(function() {
  define(['jquery', 'ace/ace', 'bootstrap', 'searchreplace/graph', 'searchreplace/data/string'], function($, ace, bootstrap, SRGraph, SRStringData) {
    var input, inputGraph, output, outputGraph, update;
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
