const axios      = require('axios');

const serializeFunction = (f) => {
    const serialized = f.toString();

    // Safari serializes async arrow functions with an invalid `function` keyword.
    // This needs to be removed in order for the function to be interpretable.
    const safariPrefix = 'async function ';
    if (serialized.startsWith(safariPrefix)) {
        const arrowIndex = serialized.indexOf('=>');
        const bracketIndex = serialized.indexOf('{');
        if (arrowIndex > -1 && (bracketIndex === -1 || arrowIndex < bracketIndex)) {
            return `async ${serialized.slice(safariPrefix.length)}`;
        }
    }

    return serialized;
};

export default class ComponentChrome {
    constructor() {
        this.variable = null
    }

    deserialise(data) {
        let [variable] = data ? data : [null];

        this.variable = variable
    }

    onCompile(interpreter, background, scope, asyncWrapper) {
        let obj = {};

        let constructorWrapper  = function () {
            let newChrome  = interpreter.createObjectProto(obj.BROWSER_PROTO),
                wrapper;

            wrapper = function (url, config, callback) {
                url = interpreter.pseudoToNative(url)
                config = interpreter.pseudoToNative(config)

                return axios.get(url, config).then((response) => {
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

            wrapper = function (asyncFunction, args, callback) {
                asyncFunction = interpreter.pseudoToNative(asyncFunction)
                asyncFunction = serializeFunction(asyncFunction)
                args = interpreter.pseudoToNative(args)

                return Promise.resolve()
                    .then(() => {
                        return background.evaluateInBackground(asyncFunction, args)
                    }).then((result) => {
                        callback(interpreter.nativeToPseudo(result));
                    })
            };
            interpreter.setProperty(newChrome, 'browserEvaluateInBackground', interpreter.createAsyncFunction(asyncWrapper(wrapper)));

            wrapper = function (tabId, asyncFunction, args, callback) {
                tabId = interpreter.pseudoToNative(tabId)
                asyncFunction = interpreter.pseudoToNative(asyncFunction)
                asyncFunction = serializeFunction(asyncFunction)
                args = interpreter.pseudoToNative(args)

                return Promise.resolve()
                    .then(() => {
                        return background.evaluateInContent(tabId, asyncFunction, args)
                    }).then((result) => {
                        callback(interpreter.nativeToPseudo(result));
                    })
            };
            interpreter.setProperty(newChrome, 'browserEvaluateInContent', interpreter.createAsyncFunction(asyncWrapper(wrapper)));

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
