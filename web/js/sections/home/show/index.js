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
                    component: this.$store.state.flow.stack[i],
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
            console.log('run js', index);
        },
        onPush: function(search, index) {
            this.$store.commit('pushFlow', {
                item: search,
                index: index
            });
        },
        onPop: function(index) {
            this.$store.commit('popFlow', {
                index: index
            });
        }
    },
    components: Object.assign({}, components, {
        'search': Search
    })
});
