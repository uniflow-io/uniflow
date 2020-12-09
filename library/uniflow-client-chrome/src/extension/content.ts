;(function() {
  let backgroundPort

  const handleMessage = ({ id, message }) => {
    if (message.channel === 'evaluateInContent') {
      const { asyncFunction, args } = message
      Promise.resolve()
        .then(() =>
          eval(`(${asyncFunction}).apply(null, ${JSON.stringify(args)})`)
        )
        .then(result => {
          return backgroundPort.postMessage({ id, message: result })
        })
        .catch(error => {
          backgroundPort.postMessage({
            id,
            error: error.message,
          })
        })
    }
  }

  const createNewConnection = () => {
    backgroundPort = browser.runtime.connect({
      name: 'contentScriptConnection',
    })
    backgroundPort.onDisconnect.addListener(createNewConnection)
    backgroundPort.onMessage.addListener(handleMessage)
  }

  createNewConnection()
})()
