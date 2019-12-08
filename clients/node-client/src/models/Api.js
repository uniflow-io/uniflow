const axios = require('axios')

function Api(env, key) {
  this.env = env
  this.key = key
}

Api.prototype.endpoint = function(endpoint, params = []) {
  let httpHost = 'https://api.uniflow.io'
  if (this.env === 'dev') {
    httpHost = 'http://127.0.0.1:8091'
  }

  const endpoints = {
    program: `/api/program/me/list?client=node&apiKey=${this.key}`,
    program_data: `/api/program/getData/{id}?apiKey=${this.key}`,
  }
  let path = Object.keys(params).reduce(function(path, key) {
    return path.replace('{' + key + '}', params[key])
  }, endpoints[endpoint])

  return axios.get(httpHost + path)
}

module.exports = Api
