import Api from '../models/api'
import Runner from '../models/runner'
import Program from '../models/program'

;(function() {
  let api = null

  // Maintain a registry of open ports with the content scripts.
  let tabMessageId = 0
  let tabMessageResolves = {}
  let tabMessageRevokes = {}
  let tabPorts = {}
  let tabPortPendingRequests = {}
  let tabPortResolves = {}
  const getTabPort = async tabId => {
    const port = tabPorts[tabId]
    if (port) {
      return port
    }
    return new Promise(resolve => {
      tabPortResolves[tabId] = tabPortResolves[tabId] || []
      tabPortResolves[tabId].push(resolve)
    })
  }
  const addTabPort = port => {
    // Store the port.
    const tabId = port.sender.tab.id
    tabPorts[tabId] = port

    // Handle incoming messages.
    port.onMessage.addListener(request => {
      const resolve = tabMessageResolves[request.id]
      const revoke = tabMessageRevokes[request.id]
      if (revoke && request.error) {
        revoke(request.error)
      } else if (resolve) {
        resolve(request.message)
      }
      delete tabMessageResolves[request.id]
      delete tabMessageRevokes[request.id]

      tabPortPendingRequests[tabId] = tabPortPendingRequests[tabId].filter(
        ({ id }) => id !== request.id
      )
      if (tabPortPendingRequests[tabId].length === 0) {
        delete tabPortPendingRequests[tabId]
      }
    })

    // Handle any promise resolutions that are waiting for this port.
    if (tabPortResolves[tabId]) {
      tabPortResolves[tabId].forEach(resolve => resolve(port))
      delete tabPortResolves[tabId]
    }

    // Handle disconnects, this will happen on every page navigation.
    port.onDisconnect.addListener(async () => {
      if (tabPorts[tabId] === port) {
        delete tabPorts[tabId]
      }

      // If there are pending requests, we'll need to resend them. The resolve/revoke callbacks will
      // still be in place, we just need to repost the requests.
      const pendingRequests = tabPortPendingRequests[tabId]
      if (pendingRequests && pendingRequests.length) {
        const newPort = await getTabPort(tabId)
        pendingRequests.forEach(request => newPort.postMessage(request))
      }
    })
  }
  const sendToTab = async (tabId, message) => {
    const port = await getTabPort(tabId)
    tabMessageId += 1
    const id = tabMessageId
    return new Promise((resolve, revoke) => {
      const request = { id, message }
      // Store this in case the port disconnects before we get a response.
      tabPortPendingRequests[tabId] = tabPortPendingRequests[tabId] || []
      tabPortPendingRequests[tabId].push(request)

      tabMessageResolves[id] = resolve
      tabMessageRevokes[id] = revoke
      port.postMessage(request)
    })
  }

  browser.runtime.onConnect.addListener(port => {
    if (port.name === 'contentScriptConnection') {
      addTabPort(port)
    }
  })

  browser.runtime.onMessage.addListener(function(message) {
    if (message.channel === 'run' && api) {
      api.endpoint('program_data', { id: message.id }).then(response => {
        let program = new Program(response.data),
          flows = program.deserializeFlowsData(),
          background = {
            evaluateInContent: (tabId, asyncFunction, args) => {
              return sendToTab(tabId, {
                asyncFunction,
                args,
                channel: 'evaluateInContent',
              })
            },
            evaluateInBackground: (asyncFunction, args) => {
              return eval(
                `(${asyncFunction}).apply(null, ${JSON.stringify(args)})`
              )
            },
          },
          runner = new Runner(api, background)

        runner.run(flows)
      })
    } else if (message.channel === 'refresh') {
      chrome.storage.sync.get(
        {
          apiKey: '',
          env: 'prod',
        },
        function(options) {
          api = new Api(options.env, options.apiKey)

          api.endpoint('program').then(response => {
            browser.runtime.sendMessage({
              channel: 'refresh-data',
              data: response.data,
            })
          })
        }
      )
    }
  })
})()
