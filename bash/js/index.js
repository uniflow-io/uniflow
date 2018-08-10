const axios = require('axios');
const History = require('./models/History')
const Runner = require('./models/Runner')

function parseArgv(argv) {
    // Removing node/bin and called script name
    argv = argv.slice(2);

    // Returned object
    let args = {}, values = [];

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
        if(arg.length === 2) {
            args[argName] = parseFloat(arg[1]).toString() === arg[1] ? +arg[1] : arg[1]
        } else {
            values.push(argName)
        }
    });

    return {'args': args, 'values': values};
}

function api(env, apiKey, endpoint, params = []) {
    let httpHost  = 'https://uniflow.io'
    if(env === 'dev') {
        httpHost  = 'http://uniflow.localhost'
    }

    const endpoints = {
        'history': '/api/history',
        'history_data': '/api/history/{id}'
    }
    let path = Object.keys(params).reduce(function(path, key) {
        return path.replace('{' + key + '}', params[key]);
    }, endpoints[endpoint]);

    return axios.get(httpHost + path + '?apiKey=' + apiKey)
}

(function main() {
    let args = parseArgv(process.argv),
        apiKey = args['args']['api-key'],
        env = args['args']['e'] || args['args']['env']
    if(env === undefined) {
        env = 'prod'
    }
    if(apiKey === undefined) {
        console.log('You must provide an api key : use --api-key=[Your Api Key]')
        process.exit(0)
    }
    if(args['values'].length === 0) {
        console.log('You must provide an identifier')
        process.exit(0)
    }

    let identifier = args['values'][0],
        commandArgs = args['values'].slice(1)
    api(env, apiKey, 'history')
        .then((response) => {
            for(let i = 0; i < response.data.length; i++) {
                if(response.data[i].title === identifier) {
                    return api(env, apiKey, 'history_data', {'id': response.data[i].id})
                }
            }

            console.log('Not such process ['+identifier+']')
            process.exit(0)
        })
        .then((response) => {
            let history = new History(response.data),
                stack = history.deserialiseFlowData(),
                runner = new Runner(commandArgs)

            runner.run(stack);
        })
})()
