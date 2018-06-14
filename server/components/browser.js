const RemoteBrowser = require('remote-browser')
let proxies = {}

module.exports = function(socket) {
    socket.on('browser.connect', function (proxyPort, mode, callback) {
        if(mode === 'manual') {
            let proxy = proxies[proxyPort]
            if(proxies[proxyPort] === undefined) {
                proxy = new RemoteBrowser.ConnectionProxy()
                proxy.listen(proxyPort)
                    .then(function() {
                        callback(true)
                    })
                proxies[proxyPort] = proxy
            } else {
                callback(true)
            }
        } else if(mode === 'background') {
            let proxy = proxies[proxyPort]
            if(proxies[proxyPort] === undefined) {
                proxy = new RemoteBrowser.ConnectionProxy()
                proxy.listen(proxyPort)
                    .then(function() {
                        const launch = RemoteBrowser.launchChrome;
                        launch(`ws://localhost:${proxyPort}/`, 'default')
                            .then(function() {
                                callback(true)
                            })
                    })
                proxies[proxyPort] = proxy
            } else {
                callback(true)
            }
        } else {
            callback(false)
        }
    });
}