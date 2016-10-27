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
            var uiStack = ['search'];

            for(var i = 0; i < this.$store.state.flow.stack.length; i ++) {
                uiStack.push(this.$store.state.flow.stack[i]);
                uiStack.push('search');
            }

            return uiStack;
        }
    },
    methods: {
        run: function () {
            console.log('run js');
        }
    },
    components: Object.assign({}, components, {
        'search': Search
    })
});
