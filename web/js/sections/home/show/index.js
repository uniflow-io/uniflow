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
        }
    },
    watch: {
        'history.id': function () {
            this.onFetchFlowData();
        },
        'history.title': function () {
            this.onUpdate();
        },
        'history.tags': function () {
            this.onUpdate();
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
                                runner.interpreter.appendCode(babelCode);
                            } else {
                                runner.interpreter = new Interpreter(babelCode);
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
        serialiseFlowData: function (data) {
            var rawData = [];

            for(let i = 0; i < data.length; i++) {
                rawData.push({
                    component: data[i].component,
                    data: data[i].data
                });
            }

            return JSON.stringify(rawData);
        },
        deserialiseFlowData: function (rawData) {
            rawData = JSON.parse(rawData);

            var data = [];

            for(let i = 0; i < rawData.length; i++) {
                data.push({
                    component: rawData[i].component,
                    data: rawData[i].data,
                    bus: new Vue()
                });
            }

            return data;
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
            var id = this.history.id;

            Promise.resolve()
                .then(() => {
                    return this.$store.dispatch('setFlow', []);
                })
                .then(() => {
                    if(this.$store.state.history.items[id].data) {
                        return this.$store.state.history.items[id].data;
                    }

                    return this.$store.dispatch('getHistoryData', this.$store.state.history.items[id]);
                })
                .then((data) => {
                    if(!data) return;

                    this.$store.state.history.items[id].data = data;
                    return this.$store.dispatch('setFlow', this.deserialiseFlowData(data));
                })
                .then(() => {
                    for(var i = 0; i < this.stack.length; i ++) {
                        var item = this.stack[i];
                        item.bus.$emit('reset', item.data);
                    }
                });
        }, 500),
        onUpdateFlowData: _.debounce(function () {
            this.history.data = this.serialiseFlowData(this.stack);
            this.$store.dispatch('setHistoryData', this.history)
        }, 500),
        onUpdate: _.debounce(function () {
            this.$store.dispatch('updateHistory', this.history)
        }, 500),
        onDelete: function () {
            this.$store.dispatch('deleteHistory', this.history)
        }
    },
    components: Object.assign({}, components, {
        'search': Search
    })
});
