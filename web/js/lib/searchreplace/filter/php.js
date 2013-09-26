/*
The main class required to get started with searchreplace

@class GettersAndSettersFilter
*/


(function() {
  define(['php', 'php.xhr'], function() {
    "use strict";
    /*
    @param {*} input
    @returns {*}
    */

    return function(input) {
      var opts, path, php;
      path = window.location.pathname;
      console.log(path);
      opts = {
        SERVER: {
          'couuoc': 'too',
          SCRIPT_FILENAME: path.substring(0, path.length - 1)
        },
        filesystem: new PHP.Adapters.XHRFileSystem()
      };
      php = new PHP(input, opts);
      return php.vm.OUTPUT_BUFFER;
    };
  });

}).call(this);
