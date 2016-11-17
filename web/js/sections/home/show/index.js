import Vue from 'vue'
import template from './template.html!text'
import Interpreter from 'acorn-interpreter'
import {Babel} from 'babel'
import _ from 'lodash'
import axios from 'axios'

import Search from './search/index.js'
import components from '../../../uniflow/components.js';

var cachedPolyfillJS = null;

export default Vue.extend({
    template: template,
    created: function () {
        this.onFetchFlowData();
    },
    data: function () {
        return {
            runIndex: null
        }
    },
    computed: {
        history: function () {
            return this.$store.getters.currentHistory;
        },
        stack: function() {
            return this.$store.state.flow.stack;
        },
        uiStack: function () {
            var uiStack = [{
                component: 'search',
                index: 0
            }];

            for(var i = 0; i < this.stack.length; i ++) {
                var item = this.stack[i];

                uiStack.push({
                    component: item.component,
                    bus: item.bus,
                    active: this.runIndex == i,
                    index: i
                });

                uiStack.push({
                    component: 'search',
                    index: i + 1
                });
            }

            return uiStack;
        },
        tagsOptions: function () {
            return {
                availableTags: this.$store.getters.tags
            }
        }
    },
    watch: {
        history: {
            handler: function (newHistory, lastHistory) {
                if(newHistory.id == lastHistory.id) {
                    this.onUpdate();
                } else {
                    this.onFetchFlowData();
                }
            },
            deep: true
        }
    },
    methods: {
        run: function (index) {
            var indexes = [];
            if(index === undefined) {
                for(var i = 0; i < this.stack.length; i ++) {
                    indexes.push(i);
                }
            } else {
                indexes.push(index);
            }

            var runner = {
                interpreter: null,
                eval: function (code) {
                    if(code === undefined) return;

                    return Promise.resolve()
                        .then(() => {
                            return '';

                            //get polyfill
                            /*if(cachedPolyfillJS) return cachedPolyfillJS;

                            return axios.get('/js/libs/babel-polyfill.min.js')
                                .then(function(response) {
                                    cachedPolyfillJS = response.data;

                                    return cachedPolyfillJS;
                                })*/
                        })
                        .then((polyfillJS) => {
                            //prepend polyfill
                            if(runner.interpreter === null) {
                                code = polyfillJS + code;
                            }

                            var babelCode = Babel.transform(code, {
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

                            if(runner.interpreter) {
                                runner.interpreter.appendCode(babelCode.code);
                            } else {
                                var init = function(interpreter, scope) {

                                    var initConsole = function() {
                                        var consoleObj = this.createObject(this.OBJECT);
                                        this.setProperty(scope, 'console', consoleObj);

                                        var wrapper = function(value) {
                                            var nativeObj = interpreter.pseudoToNative(value);
                                            return interpreter.createPrimitive(console.log(nativeObj));
                                        };
                                        this.setProperty(consoleObj, 'log', this.createNativeFunction(wrapper));
                                    };
                                    initConsole.call(interpreter);

                                };

                                runner.interpreter = new Interpreter(babelCode.code, init);
                            }

                            return runner.interpreter.run();
                        })
                    ;
                }
            };

            return indexes.reduce((promise, index) => {
                return promise
                    .then(() => {
                        return new Promise((resolve) => {
                            this.runIndex = index;
                            setTimeout(() => {
                                this.$nextTick(resolve);
                            }, 500);
                        });
                    }).then(() => {
                        return this.stack[index].bus.$emit('execute', runner);
                    }).then(() => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                this.runIndex = null;
                                this.$nextTick(resolve);
                            }, 500);
                        });
                    });
            }, Promise.resolve());
        },
        onPushFlow: function(component, index) {
            this.$store.commit('pushFlow', {
                component: component,
                index: index
            });

            this.$store.dispatch('setFlow', this.stack)
                .then(() => {
                    for(var i = 0; i < this.stack.length; i ++) {
                        var item = this.stack[i];
                        item.bus.$emit('reset', item.data);
                    }
                });

            this.onUpdateFlowData();
        },
        onPopFlow: function(index) {
            this.$store.commit('popFlow', {
                index: index
            });

            this.onUpdateFlowData();
        },
        onUpdateFlow: function(data, index) {
            this.$store.commit('updateFlow', {
                data: data,
                index: index
            });

            this.onUpdateFlowData();
        },
        onFetchFlowData: _.debounce(function () {
            var history = this.history;

            Promise.resolve()
                .then(() => {
                    return this.$store.dispatch('setFlow', []);
                })
                .then(() => {
                    if(history.data) {
                        return history.data;
                    }

                    return this.$store.dispatch('getHistoryData', history);
                })
                .then((data) => {
                    if(!data) return;

                    history.data = data;
                    return this.$store.dispatch('setFlow', history.deserialiseFlowData());
                })
                .then(() => {
                    for(var i = 0; i < this.stack.length; i ++) {
                        var item = this.stack[i];
                        item.bus.$emit('reset', item.data);
                    }
                });
        }, 500),
        onUpdateFlowData: _.debounce(function () {
            var data = this.history.data;
            this.history.serialiseFlowData(this.stack);
            if(this.history.data !== data) {
                this.$store.dispatch('setHistoryData', this.history)
            }
        }, 500),
        onUpdate: (function() {
            var silence = false;

            return _.debounce(function () {
                if(silence) return;

                silence = true;
                this.$store
                    .dispatch('updateHistory', this.history)
                    .then(() => {
                        this.$nextTick(function() {
                            silence = false;
                        });
                    });
            }, 500);
        })(),
        onDelete: function () {
            this.$store.dispatch('deleteHistory', this.history)
        }
    },
    components: Object.assign({}, components, {
        'search': Search
    })
});
