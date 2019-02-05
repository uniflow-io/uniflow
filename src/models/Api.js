import axios from 'axios';

function Api(env, key) {
    this.env = env
    this.key = key
}

Api.prototype.endpoint = function(endpoint, params = []) {
    let httpHost  = 'https://api.uniflow.io'
    if(this.env === 'dev') {
        httpHost  = 'http://uniflow-api.localhost'
    }

    const endpoints = {
        'history': `/api/history/me/list?client=chrome&apiKey=${this.key}`,
        'history_data': `/api/history/getData/{id}?apiKey=${this.key}`
    }
    let path = Object.keys(params).reduce(function(path, key) {
        return path.replace('{' + key + '}', params[key]);
    }, endpoints[endpoint]);

    return axios.get(httpHost + path)
}

export default Api
