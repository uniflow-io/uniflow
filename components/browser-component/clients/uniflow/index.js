import io from 'socket.io-client'
import { Browser } from 'remote-browser/web-client'

const onCompile = function(interpreter, scope, asyncWrapper) {
    let obj = {}

    let constructorWrapper = function (host, ioPort, proxyPort, mode) {
        let newBrowser = interpreter.createObjectProto(obj.BROWSER_PROTO)

        let socket = io('https://' + host + ':' + ioPort)

        let wrapper

        let browser = new Browser()

        wrapper = function (callback) {
            let args = ['browser.connect', proxyPort, mode]

            return new Promise(resolve => {
                args.push(function (data) {
                    browser.connectionUrl = 'ws://' + host + ':' + proxyPort
                    browser.sessionId = 'default'
                    browser.negotiateConnection()
                        .then(() => {
                            callback(interpreter.nativeToPseudo(data))
                            resolve()
                        })
                })
                socket.emit.apply(socket, args)
            })
        }
        interpreter.setProperty(newBrowser, 'connect', interpreter.createAsyncFunction(asyncWrapper(wrapper)))

        wrapper = function (asyncFunction, args, callback) {
            asyncFunction = interpreter.pseudoToNative(asyncFunction)
            args = interpreter.pseudoToNative(args)
            return browser.evaluateInBackground(asyncFunction, args)
                .then(result => {
                    callback(interpreter.nativeToPseudo(result))
                })
        }
        interpreter.setProperty(newBrowser, 'evaluateInBackground', interpreter.createAsyncFunction(asyncWrapper(wrapper)))

        wrapper = function (tabId, asyncFunction, args, callback) {
            tabId = interpreter.pseudoToNative(tabId)
            asyncFunction = interpreter.pseudoToNative(asyncFunction)
            args = interpreter.pseudoToNative(args)
            return browser.evaluateInContent(tabId, asyncFunction, args)
                .then(result => {
                    callback(interpreter.nativeToPseudo(result))
                })
        }
        interpreter.setProperty(newBrowser, 'evaluateInContent', interpreter.createAsyncFunction(asyncWrapper(wrapper)))

        return newBrowser
    }
    obj.Browser = interpreter.createNativeFunction(constructorWrapper, true)
    obj.BROWSER_PROTO = interpreter.getProperty(obj.Browser, 'prototype')
    interpreter.setProperty(scope, 'Browser', obj.Browser)
}

const onExecute = function(runner) {
    return Promise
        .resolve()
        .then(() => {
            return new Promise(resolve => {
                this.setState({ running: true }, resolve)
            })
        }).then(() => {
            return runner.eval('var ' + this.state.variable + ' = new Browser(\'' + this.state.host + '\', \'' + this.state.ioPort + '\', \'' + this.state.proxyPort + '\', \'' + this.state.mode + '\')')
                .then(() => {
                    return runner.eval(this.state.variable + '.connect()')
                })
                .then(() => {
                    return new Promise(resolve => {
                        this.setState({ displayBrowserConnect: true }, resolve)
                    })
                })
                .then(() => {
                    return new Promise(resolve => {
                        this.resolveBrowserConnected = resolve
                    })
                })
                .then(() => {
                    return new Promise(resolve => {
                        this.setState({ displayBrowserConnect: false }, resolve)
                    })
                })
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
