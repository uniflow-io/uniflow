const cp = require('child_process')
const merge = require('merge')

/**
 * @summary Get shell program meta for current platform
 * @private
 * @returns {Object}
 */
function getShell() {
  if (process.platform === 'win32') {
    return { cmd: 'cmd', arg: '/C' }
  } else {
    return { cmd: 'sh', arg: '-c' }
  }
}

function execSh(command: any, commandArgs: any, options: any, callback: any) {
  if (Array.isArray(command)) {
    command = command.join(';')
  }

  if (options === true) {
    options = { stdio: null }
  }

  const defSpawnOptions = { stdio: ['inherit', 'pipe', 'pipe'] }
  if (typeof options === 'function') {
    callback = options
    options = defSpawnOptions
  } else {
    options = options || {}
    options = merge(true, defSpawnOptions, options)
    callback = callback || function() {}
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
    child.stdout.on('data', function(data: any) {
      stdout += data
    })
  }

  if (child.stderr) {
    child.stderr.on('data', function(data: any) {
      stderr += data
    })
  }

  child.on('close', function(code: any) {
    if (code) {
      let e: any = new Error('Shell command exit with non zero code: ' + code)
      e.code = code
      callback(e, stdout, stderr)
    } else {
      callback(null, stdout, stderr)
    }
  })

  return child
}

export default function(commandArgs: any) {
  return {
    exec: function(command: any) {
      return new Promise((resolve, reject) => {
        execSh(command, commandArgs, {}, function(err: any, stdout: any, stderr: any) {
          if (err) {
            reject(stderr)
          } else {
            resolve(stdout)
          }
        })
      })
    },
  }
}
