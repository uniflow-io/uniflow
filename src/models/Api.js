const axios = require('axios');

function Api(env, key) {
    this.env = env
    this.key = key
}

Api.prototype.endpoint = function(endpoint, params = []) {
    let httpHost  = 'https://uniflow.io'
    if(this.env === 'dev') {
        httpHost  = 'http://uniflow-io.localhost'
    }

    const endpoints = {
        'history': `/api/program/me/list?client=bash&apiKey=${this.key}`,
        'history_data': `/api/program/getData/{id}?apiKey=${this.key}`
    }
    let path = Object.keys(params).reduce(function(path, key) {
        return path.replace('{' + key + '}', params[key]);
    }, endpoints[endpoint]);

    return axios.get(httpHost + path)
}

module.exports = Api
