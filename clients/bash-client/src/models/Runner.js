const components = require('../uniflow/components')
const cp = require('child_process')
const merge = require('merge')

let defSpawnOptions = {stdio: 'inherit'}

/**
 * @summary Get shell program meta for current platform
 * @private
 * @returns {Object}
 */
function getShell() {
  if (process.platform === 'win32') {
    return {cmd: 'cmd', arg: '/C'}
  } else {
    return {cmd: 'sh', arg: '-c'}
  }
}

function execSh(command, commandArgs, options, callback) {
  if (Array.isArray(command)) {
    command = command.join(';')
  }

  if (options === true) {
    options = {stdio: null}
  }

  if (typeof options === 'function') {
    callback = options
    options = defSpawnOptions
  } else {
    options = options || {}
    options = merge(true, defSpawnOptions, options)
    callback = callback || function () {
    }
  }

  let child
  let stdout = ''
  let stderr = ''
  let shell = getShell()

  try {
    let args = ['-c', command]
    if (commandArgs.length > 0) {
      args = args.concat(['-'], commandArgs)
    }
    child = cp.spawn('sh', args, options)
  } catch (e) {
    callback(e, stdout, stderr)
    return
  }

  if (child.stdout) {
    child.stdout.on('data', function (data) {
      stdout += data
    })
  }

  if (child.stderr) {
    child.stderr.on('data', function (data) {
      stderr += data
    })
  }

  child.on('close', function (code) {
    if (code) {
      let e = new Error('Shell command exit with non zero code: ' + code)
      e.code = code
      callback(e, stdout, stderr)
    } else {
      callback(null, stdout, stderr)
    }
  })

  return child
}


function Runner(commandArgs, api) {
  this.commandArgs = commandArgs
  this.api = api
}

Runner.prototype.run = function (stack) {
  return stack.reduce((promise, flow) => {
    return promise.then(() => {
      process.stdout.write(flow.code)
    })
  }, Promise.resolve())

  /*let commands = [], runner = {
      eval: function (code) {
          if (code === undefined) return

          commands.push(code)
      }
  }

  return stack.reduce((promise, item) => {
      return promise.then(() => {
          let component = new components[item.component]()
          component.deserialise(item.data)
          return component.onExecute(runner, this.api, components)
      })
  }, Promise.resolve())
      .then(() => {
          return new Promise((resolve, reject) => {
              execSh(commands.join("\n"), this.commandArgs, {}, function(err, stdout, stderr) {
                  if(err) {
                      reject(stderr)
                  } else {
                      resolve(stdout)
                  }
              })
          })
      }).then(function(stdout) {
          process.stdout.write(stdout)
      })*/
}

module.exports = Runner
