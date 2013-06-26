(function() {
  define(['jquery', 'ace/ace', 'bootstrap'], function($, ace) {
    ace.edit('input');
    return ace.edit('output');
  });

}).call(this);
