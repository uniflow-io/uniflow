import Interpreter from 'acorn-interpreter'
import {transform} from 'babel-standalone'
import axios from 'axios'

export default class Runner {
    run(stack, onRunIndex) {
        //get polyfill
        /*if(cachedPolyfillJS) return cachedPolyfillJS;

         return axios.get('/js/libs/babel-polyfill.min.js')
         .then(function(response) {
         cachedPolyfillJS = response.data;

         return cachedPolyfillJS;
         })*/

        let interpreter = new Interpreter('', (interpreter, scope) => {
            let initConsole = function () {
                let consoleObj = interpreter.createObject(interpreter.OBJECT);
                interpreter.setProperty(scope, 'console', consoleObj);

                let wrapper = function (value) {
                    let nativeObj = interpreter.pseudoToNative(value);
                    return interpreter.createPrimitive(console.log(nativeObj));
                };
                interpreter.setProperty(consoleObj, 'log', interpreter.createNativeFunction(wrapper));
            };
            initConsole.call(interpreter);

            stack.forEach((item) => {
                item.bus.emit('compile', interpreter, scope);
            });
        });

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
                return interpreter.run();
            },
            getReturn: function () {
                return interpreter.value;
            }
        };

        return stack.reduce((promise, item, index) => {
            return promise
                .then(() => {
                    return onRunIndex(index);
                }).then(() => {
                    return item.bus.emit('execute', runner);
                }).then(() => {
                    return new Promise((resolve => {
                        setTimeout(resolve, 200)
                    }))
                }).then(() => {
                    return onRunIndex(null);
                });
        }, Promise.resolve());
    }
}
