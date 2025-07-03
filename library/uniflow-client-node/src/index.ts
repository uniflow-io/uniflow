import Program  from './models/program'
import Runner  from './models/runner'
import Api  from './models/api'

function parseArgv(argv: any) {
  // Removing node/bin and called script name
  argv = argv.slice(2)

  // Returned object
  let args: any = {},
    values: any[] = []

  let argName, argValue

  // For each argument
  argv.forEach(function(arg: any) {
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

(async function main() {
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
  let response:any = await api.endpoint('program')
  let data = await response.json()
  const programData = data.filter((program: any) => {
    return program.slug === identifier
  }).shift()
  if(!programData) {
    console.log('Not such program [' + identifier + ']')
    return
  }

  response = await api.endpoint('program_flows', { uid: programData.uid })
  data = await response.json()
  programData.data = data.data
  let program = new Program(programData),
    flows = program.deserializeFlowsData(),
    runner = new Runner(commandArgs, api)
  runner.run(flows)
})()
