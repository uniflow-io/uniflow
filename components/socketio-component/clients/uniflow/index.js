import io from 'socket.io-client'

const onCompile = function(interpreter, scope, asyncWrapper) {
  let obj = {}

  let constructorWrapper = function (url) {
    let newIO = interpreter.createObjectProto(obj.IO_PROTO)

    let socket = io(url)

    let wrapper

    wrapper = function (eventName, callback) {
      socket.on(eventName, callback)
      return this
    }
    interpreter.setProperty(newIO, 'on', interpreter.createNativeFunction(wrapper, false))

    wrapper = function (eventName) {
      let args = Array.prototype.slice.call(arguments, 0, arguments.length - 1)
      args = args.map(data => {
        return interpreter.pseudoToNative(data)
      })
      let callback = arguments[arguments.length - 1]

      return new Promise(resolve => {
        args.push(function (data) {
          callback(interpreter.nativeToPseudo(data))
          resolve()
        })
        socket.emit.apply(socket, args)
      })
    }
    interpreter.setProperty(newIO, 'emit', interpreter.createAsyncFunction(asyncWrapper(wrapper)))

    return newIO
  }
  obj.IO = interpreter.createNativeFunction(constructorWrapper, true)
  obj.IO_PROTO = interpreter.getProperty(obj.IO, 'prototype')
  interpreter.setProperty(scope, 'IO', obj.IO)
}

const onExecute = function(runner) {
  return Promise
    .resolve()
    .then(() => {
      return new Promise(resolve => {
        this.setState({ running: true }, resolve)
      })
    }).then(() => {
      return runner.eval('var ' + this.state.variable + ' = new IO(\'https://' + this.state.host + ':' + this.state.port + '\')')
    })
    .then(() => {
      return new Promise(resolve => {
        setTimeout(resolve, 500)
      })
    })
    .then(() => {
      return new Promise(resolve => {
        this.setState({ running: false }, resolve)
      })
    })
}



export { onCompile, onExecute }
