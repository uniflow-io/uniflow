(function() {
  var script, scripts, _base, _i, _len, _ref;

  requirejs.config({
    baseUrl: '/js/lib',
    paths: {
      'app': '../app',
      'jquery': ['//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min', 'jquery-1.10.1.min'],
      'bootstrap': 'bootstrap.min',
      'php': 'php/PHP',
      'php.xhr': 'php/xhr'
    },
    urlArgs: "bust=" + (new Date()).getTime(),
    shim: {
      'bootstrap': ['jquery'],
      'php.xhr': ['php']
    }
  });

  if (window.app == null) {
    window.app = {};
  }

  if ((_base = window.app).scripts == null) {
    _base.scripts = [];
  }

  scripts = ['jquery'];

  _ref = app.scripts;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    script = _ref[_i];
    scripts.push(script);
  }

  requirejs(scripts);

}).call(this);
