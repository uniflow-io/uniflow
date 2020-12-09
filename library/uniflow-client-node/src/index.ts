const Program = require('./models/program')
const Runner = require('./models/runner')
const Api = require('./models/api')

function parseArgv(argv) {
  // Removing node/bin and called script name
  argv = argv.slice(2)

  // Returned object
  let args = {},
    values = []

  let argName, argValue

  // For each argument
  argv.forEach(function(arg, index) {
    // Separate argument, for a key/value return
    arg = arg.split('=')

    // Retrieve the argument name
    argName = arg[0]

    // Remove "--" or "-"
    if (argName.indexOf('-') === 0) {
      argName = argName.slice(argName.slice(0, 2).lastIndexOf('-') + 1)
    }

    // Associate defined value or initialize it to "true" state
    if (arg.length === 2) {
      args[argName] =
        parseFloat(arg[1]).toString() === arg[1] ? +arg[1] : arg[1]
    } else {
      values.push(argName)
    }
  })

  return { args: args, values: values }
}

;(function main() {
  let args = parseArgv(process.argv),
    apiKey = args['args']['api-key'],
    env = args['args']['e'] || args['args']['env']
  if (env === undefined) {
    env = 'prod'
  }
  if (apiKey === undefined) {
    console.log('You must provide an api key : use --api-key=[Your Api Key]')
    process.exit(0)
  }
  if (args['values'].length === 0) {
    console.log('You must provide an identifier')
    process.exit(0)
  }

  let api = new Api(env, apiKey),
    identifier = args['values'][0],
    commandArgs = args['values'].slice(1)
  api
    .endpoint('program')
    .then(response => {
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].slug === identifier) {
          return api.endpoint('program_data', { id: response.data[i].id })
        }
      }

      console.log('Not such process [' + identifier + ']')
      process.exit(0)
    })
    .then(response => {
      let program = new Program(response.data),
        flows = program.deserializeFlowsData(),
        runner = new Runner(commandArgs, api)

      runner.run(flows)
    })
})()
