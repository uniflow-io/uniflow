const util  = require('util');
const exec  = util.promisify(require('child_process').exec);
const axios = require('axios');

function parseArgv(argv) {
    // Removing node/bin and called script name
    argv = argv.slice(2);

    // Returned object
    let args = {};

    let argName, argValue;

    // For each argument
    argv.forEach(function (arg, index) {
        // Seperate argument, for a key/value return
        arg = arg.split('=');

        // Retrieve the argument name
        argName = arg[0];

        // Remove "--" or "-"
        if (argName.indexOf('-') === 0) {
            argName = argName.slice(argName.slice(0, 2).lastIndexOf('-') + 1);
        }

        // Associate defined value or initialize it to "true" state
        argValue = (arg.length === 2)
            ? parseFloat(arg[1]).toString() === arg[1] // check if argument is valid number
                ? +arg[1]
                : arg[1]
            : true;

        // Finally add the argument to the args set
        args[argName] = argValue;
    });

    return args;
}

function api(apiKey, endpoint, params) {
    const httpHost  = 'http://uniflow.darkwood.localhost'
    const endpoints = {
        'history': '/api/history',
        'history_data': '/api/history/{id}'
    }

    return axios.get(httpHost + endpoints[endpoint] + '?apiKey=' + apiKey)
}

let args = parseArgv(process.argv)
if(args['api-key'] === undefined) {
    console.log('You must provide an api key : use --api-key=[Your Api Key]')
    process.exit(0)
}

api(args['api-key'], 'history')
    .then((data) => {
        console.log(data)
    })

/*
exec('ls -al')
    .then(function(result) {
        console.log(result.stdout)
    })*/
