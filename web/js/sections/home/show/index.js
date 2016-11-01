import Vue from 'vue'
import template from './template.html!text'

import Search from './search/index.js'
import components from '../../../uniflow/components.js';

export default Vue.extend({
    template: template,
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
                uiStack.push({
                    component: this.$store.state.flow.stack[i].component,
                    bus: this.$store.state.flow.stack[i].bus,
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
            var indexes = [], i;
            if(index) {
                indexes = [index];
            } else {
                for(i = 0; i < this.$store.state.flow.stack.length; i ++) {
                    indexes.push(i);
                }
            }

            var run = Promise.resolve();
            for(i = 0; i < indexes.length; i++) {
                ((index) => {
                    run.then(() => {
                        return Promise.resolve()
                            .then(() => {
                                console.log('before run '+index);
                            }).then(() => {
                                console.log('run js '+ index);
                                return this.$store.state.flow.stack[index].bus.$emit('execute');
                            }).then(() => {
                                console.log('after run '+index);
                            });
                    });
                })(i);
            }

            return run;
        },
        onPush: function(component, index) {
            this.$store.commit('pushFlow', {
                component: component,
                index: index
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
