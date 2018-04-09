'use strict';

/*eslint-disable no-console*/

var fs   = require('fs');
var path = require('path');
var util = require('util');
var yaml = require('./js-yaml');


try {
  var filename = path.join(__dirname, '/../assets/sample_document.yml'),
      contents = fs.readFileSync(filename, 'utf8'),
      data     = yaml.load(contents);

  //console.log(util.inspect(data, false, 10, true));
} catch (err) {
  console.log(err.stack || String(err));
}
