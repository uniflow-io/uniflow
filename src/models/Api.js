const axios = require('axios');

function Api(env, key) {
    this.env = env
    this.key = key
}

Api.prototype.endpoint = function(endpoint, params = []) {
    let httpHost  = 'https://uniflow.io'
    if(this.env === 'dev') {
        httpHost  = 'http://uniflow.localhost'
    }

    const endpoints = {
        'history': '/api/me/history/list/bash',
        'history_data': '/api/history/getData/{id}'
    }
    let path = Object.keys(params).reduce(function(path, key) {
        return path.replace('{' + key + '}', params[key]);
    }, endpoints[endpoint]);

    return axios.get(httpHost + path + '?apiKey=' + this.key)
}

module.exports = Api
