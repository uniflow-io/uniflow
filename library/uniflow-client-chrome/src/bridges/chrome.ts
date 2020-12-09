import axios from 'axios'

const serializeFunction = f => {
  const serialized = f.toString()

  // Safari serializes async arrow functions with an invalid `function` keyword.
  // This needs to be removed in order for the function to be interpretable.
  const safariPrefix = 'async function '
  if (serialized.startsWith(safariPrefix)) {
    const arrowIndex = serialized.indexOf('=>')
    const bracketIndex = serialized.indexOf('{')
    if (arrowIndex > -1 && (bracketIndex === -1 || arrowIndex < bracketIndex)) {
      return `async ${serialized.slice(safariPrefix.length)}`
    }
  }

  return serialized
}

export default background => {
  return {
    httpGet: (url, config, callback) => {
      return axios.get(url, config).then(response => {
        callback(response.data)
      })
    },
    httpPost: (url, data, config, callback) => {
      return axios.post(url, data, config).then(response => {
        callback(response.data)
      })
    },
    evaluateInBackground: (asyncFunction, args) => {
      asyncFunction = serializeFunction(asyncFunction)

      return Promise.resolve().then(() => {
        return background.evaluateInBackground(asyncFunction, args)
      })
    },
    evaluateInContent: (tabId, asyncFunction, args) => {
      asyncFunction = serializeFunction(asyncFunction)

      return Promise.resolve().then(() => {
        return background.evaluateInContent(tabId, asyncFunction, args)
      })
    },
  }
}
