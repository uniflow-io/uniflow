const util = require('util');
const exec = util.promisify(require('child_process').exec);

exec('ls')
    .then(function(result) {
        console.log(result)
    })