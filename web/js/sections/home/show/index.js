import Vue from 'vue'
import template from './template.html!text'
import Interpreter from 'acorn-interpreter'
import {Babel} from 'babel'
import _ from 'lodash'
import axios from 'axios'
import History from '../../../models/history.js'

import Search from './search/index.js'
import components from '../../../uniflow/components.js';

let cachedPolyfillJS = null;

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
            let uiStack = [{
                component: 'search',
                index: 0
            }];

            for(let i = 0; i < this.stack.length; i ++) {
                let item = this.stack[i];

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
                if(newHistory.id != lastHistory.id) {
                    this.onFetchFlowData();
                }
            },
            deep: true
        }
    },
    methods: {
        run: function (index) {
            let indexes = [];
            if(index === undefined) {
                for(let i = 0; i < this.stack.length; i ++) {
                    indexes.push(i);
                }
            } else {
                indexes.push(index);
            }

            //get polyfill
            /*if(cachedPolyfillJS) return cachedPolyfillJS;

             return axios.get('/js/libs/babel-polyfill.min.js')
             .then(function(response) {
             cachedPolyfillJS = response.data;

             return cachedPolyfillJS;
             })*/

            let interpreter = new Interpreter('', function(interpreter, scope) {
                let initConsole = function() {
                    let consoleObj = this.createObject(this.OBJECT);
                    this.setProperty(scope, 'console', consoleObj);

                    let wrapper = function(value) {
                        let nativeObj = interpreter.pseudoToNative(value);
                        return interpreter.createPrimitive(console.log(nativeObj));
                    };
                    this.setProperty(consoleObj, 'log', this.createNativeFunction(wrapper));
                };
                initConsole.call(interpreter);
            });

            let runner = {
                hasValue: function (variable) {
                    let scope = interpreter.getScope();
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
                    return interpreter.pseudoToNative(interpreter.getValue(variable));
                },
                setValue: function (variable, value) {
                    return interpreter.setValue(variable, interpreter.nativeToPseudo(value));
                },
                eval: function (code) {
                    if(code === undefined) return;

                    let babelCode = Babel.transform(code, {
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
                }
            };

            return indexes.reduce((promise, index) => {
                return promise
                    .then(() => {
                        return new Promise((resolve) => {
                            this.runIndex = index;
                            setTimeout(() => {
                                this.$nextTick(resolve);
                            }, 100);
                        });
                    }).then(() => {
                        return this.stack[index].bus.$emit('execute', runner);
                    }).then(() => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                this.runIndex = null;
                                this.$nextTick(resolve);
                            }, 100);
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
                    for(let i = 0; i < this.stack.length; i ++) {
                        let item = this.stack[i];
                        item.bus.$emit('reset', item.data);
                    }
                });

            this.onUpdateFlowData();
        },
        onPopFlow: function(index) {
            this.$store.commit('popFlow', {
                index: index
            });

            this.$store.dispatch('setFlow', this.stack)
                .then(() => {
                    for(let i = 0; i < this.stack.length; i ++) {
                        let item = this.stack[i];
                        item.bus.$emit('reset', item.data);
                    }
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
        onFetchFlowData: function () {
            let history = this.history;

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

                    if(history.id != this.history.id) return;

                    return this.$store
                        .dispatch('setFlow', history.deserialiseFlowData())
                        .then(() => {
                            for(let i = 0; i < this.stack.length; i ++) {
                                let item = this.stack[i];
                                item.bus.$emit('reset', item.data);
                            }
                        });
                })

        },
        onUpdateFlowData: function () {
            let data = this.history.data;
            this.history.serialiseFlowData(this.stack);
            if(this.history.data !== data) {
                this.$store.dispatch('setHistoryData', this.history)
            }
        },
        onUpdateTitle: function (e) {
            this.history.title = e.target.value;
            this.onUpdate();
        },
        onUpdateTags: function (tags) {
            this.history.tags = tags;
            this.onUpdate();
        },
        onUpdate: _.debounce(function () {
            this.$store.dispatch('updateHistory', this.history)
        }, 500),
        onDuplicate: function () {
            let history = new History(this.history);
            history.title += ' Copy';

            this.$store.dispatch('createHistory', history)
                .then((item) => {
                    history.id = item.id;
                    return this.$store.dispatch('setHistoryData', history);
                })
                .then(() => {
                    return this.$store.dispatch('setCurrentHistory', history.id);
                });
        },
        onDelete: function () {
            this.$store.dispatch('deleteHistory', this.history)
        }
    },
    components: Object.assign({}, components, {
        'search': Search
    })
});
