const axios      = require('axios');

export default class ComponentChrome {
    constructor() {
        this.variable = null
    }

    deserialise(data) {
        let [variable] = data ? data : [null];

        this.variable = variable
    }

    onCompile(interpreter, scope, asyncWrapper) {
        let obj = {};

        let constructorWrapper  = function () {
            let newChrome  = interpreter.createObjectProto(obj.BROWSER_PROTO),
                wrapper;

            wrapper = function (url, config, callback) {
                return axios.get(url, config).then((response) => {
                    url = interpreter.pseudoToNative(url)
                    config = interpreter.pseudoToNative(config)

                    callback(interpreter.nativeToPseudo(response.data))
                })
            };
            interpreter.setProperty(newChrome, 'httpGet', interpreter.createAsyncFunction(asyncWrapper(wrapper)));

            wrapper = function (url, data, config, callback) {
                url = interpreter.pseudoToNative(url)
                data = interpreter.pseudoToNative(data)
                config = interpreter.pseudoToNative(config)

                return axios.post(url, data, config).then((response) => {
                    callback(interpreter.nativeToPseudo(response.data))
                })
            };
            interpreter.setProperty(newChrome, 'httpPost', interpreter.createAsyncFunction(asyncWrapper(wrapper)));

            wrapper = function (url, data, config, callback) {
                url = interpreter.pseudoToNative(url)
                data = interpreter.pseudoToNative(data)
                config = interpreter.pseudoToNative(config)

                return axios.put(url, data, config).then((response) => {
                    callback(interpreter.nativeToPseudo(response.data))
                })
            };
            interpreter.setProperty(newChrome, 'httpPut', interpreter.createAsyncFunction(asyncWrapper(wrapper)));

            return newChrome;
        };
        obj.Chrome       = interpreter.createNativeFunction(constructorWrapper, true);
        obj.BROWSER_PROTO = interpreter.getProperty(obj.Chrome, 'prototype');
        interpreter.setProperty(scope, 'Chrome', obj.Chrome);
    }

    onExecute(runner) {
        return runner.eval('var ' + this.variable + ' = new Chrome()')
    }
}
