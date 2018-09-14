import Interpreter from '../libs/JS-Interpreter/interpreter'
import {transform} from 'babel-standalone'
import components from '../uniflow/components'

export default class Runner {
    constructor(api, background) {
        this.api = api
        this.background = background
    }

    run(stack) {
        stack = stack.map(function(item) {
            item.instance = new components[item.component]()

            return item;
        })

        //get polyfill
        /*if(cachedPolyfillJS) return cachedPolyfillJS;

         return axios.get('/js/libs/babel-polyfill.min.js')
         .then(function(response) {
         cachedPolyfillJS = response.data;

         return cachedPolyfillJS;
         })*/

        let asyncRunPromise = null
        let interpreter = null
        let interpreterPromise = new Promise((resolve) => {
            interpreter = new Interpreter('', (interpreter, scope) => {
                let initConsole = () => {
                    let consoleObj = interpreter.createObject(interpreter.OBJECT);
                    interpreter.setProperty(scope, 'console', consoleObj);

                    let wrapper = (value) => {
                        let nativeObj = interpreter.pseudoToNative(value);

                        return Promise.resolve()
                            .then(() => {
                                this.background.evaluateInBackground('async function() { return (await browser.tabs.query({ active: true })).map(tab => tab.id) }', [])
                                    .then((tabIds) => {
                                        return this.background.evaluateInContent(tabIds[0], 'function(value) { console.log(value) }', [nativeObj]);
                                    })
                            }).then((result) => {
                                return interpreter.createPrimitive(console.log(nativeObj));
                            })
                    };
                    interpreter.setProperty(consoleObj, 'log', interpreter.createNativeFunction(wrapper));
                };
                initConsole.call(interpreter);

                return stack.reduce((promise, item) => {
                    return promise
                        .then(() => {
                            return item.instance.onCompile(interpreter, this.background, scope, (wrapper) => {
                                return function () {
                                    asyncRunPromise = wrapper.apply(this, arguments)
                                }
                            });
                        })
                }, Promise.resolve()).then(resolve);
            });
        })

        let runner = {
            hasValue: function (variable) {
                let scope   = interpreter.getScope();
                let nameStr = variable.toString();
                while (scope) {
                    if (nameStr in scope.properties) {
                        return true;
                    }
                    scope = scope.parentScope;
                }

                return false;
            },
            getValue: function (variable) {
                return interpreter.pseudoToNative(interpreter.getValueFromScope(variable));
            },
            setValue: function (variable, value) {
                return interpreter.setValueToScope(variable, interpreter.nativeToPseudo(value));
            },
            eval: function (code) {
                if (code === undefined) return;

                let babelCode = transform(code, {
                    presets: [
                        'es2015',
                        'es2015-loose',
                        'es2016',
                        'es2017',
                        'latest',
                        'react',
                        'stage-0',
                        'stage-1',
                        'stage-2',
                        'stage-3'
                    ],
                    filename: 'repl',
                    babelrc: false,
                });

                interpreter.appendCode(babelCode.code);


                let asyncLoop = () => {
                    interpreter.run();

                    if (asyncRunPromise !== null) {
                        return asyncRunPromise
                            .then(() => {
                                asyncRunPromise = null
                            })
                            .then(asyncLoop)
                    }

                    return Promise.resolve()
                }

                return asyncLoop()
            },
            getReturn: function () {
                return interpreter.value;
            }
        };

        return stack.reduce((promise, item, index) => {
            return promise
                .then(() => {
                    let component = item.instance
                    component.deserialise(item.data)
                    return component.onExecute(runner, this.api, this.background, components)
                });
        }, interpreterPromise);
    }
}

