import Vue from 'vue'
import template from './template.html!text'
import Interpreter from 'acorn-interpreter'
import {Babel} from 'babel'

import Search from './search/index.js'
import components from '../../../uniflow/components.js';

export default Vue.extend({
    template: template,
    data: function () {
        return {
            runIndex: null
        }
    },
    computed: {
        history: function () {
            return this.$store.getters.currentHistory;
        },
        uiStack: function () {
            var uiStack = [{
                component: 'search',
                index: 0
            }];

            for(var i = 0; i < this.$store.state.flow.stack.length; i ++) {
                var item = this.$store.state.flow.stack[i];

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
    methods: {
        run: function (index) {
            var indexes = [];
            if(index === undefined) {
                for(var i = 0; i < this.$store.state.flow.stack.length; i ++) {
                    indexes.push(i);
                }
            } else {
                indexes.push(index);
            }

            var runner = {
                interpreter: null,
                eval: function (code) {
                    if(code === undefined) return;

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
                        runner.interpreter = new Interpreter(code);
                    }

                    return runner.interpreter.run();
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
                        return this.$store.state.flow.stack[index].bus.$emit('execute', runner);
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
        onPush: function(component, index) {
            this.$store.commit('pushFlow', {
                component: component,
                index: index
            });

            var stack = this.$store.state.flow.stack.slice(0);
            this.$store.state.flow.stack = [];

            this.$nextTick(() => {
                this.$store.state.flow.stack = stack;

                this.$nextTick(() => {
                    for(var i = 0; i < this.$store.state.flow.stack.length; i ++) {
                        var item = this.$store.state.flow.stack[i];
                        item.bus.$emit('reset', item.data);
                    }
                });
            });
        },
        onPop: function(index) {
            this.$store.commit('popFlow', {
                index: index
            });
        },
        onUpdate: function(data, index) {
            this.$store.commit('updateFlow', {
                data: data,
                index: index
            });
        }
    },
    components: Object.assign({}, components, {
        'search': Search
    })
});
