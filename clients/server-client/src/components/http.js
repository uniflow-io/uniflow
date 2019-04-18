const axios      = require('axios');

module.exports = function(socket) {
    socket.on('http.get', function (url, callback) {
        axios.get(url).then((response) => {
            callback(response.data)
        })
    });

    socket.on('http.post', function (url, data, callback) {
        axios.post(url, data).then((response) => {
            callback(response.data)
        })
    });

    socket.on('http.config', function (config, callback) {
        axios(config).then((response) => {
            callback(response.data)
        })
    });
}
