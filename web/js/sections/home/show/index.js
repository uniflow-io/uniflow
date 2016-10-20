import Vue from 'vue'
import template from './template.html!text'

import Search from './search/index.js'
import components from '../../../noflo/components.js';

export default Vue.extend({
    template: template,
    data: function() {
        return {
            stack: []
        };
    },
    computed: {
        history: function () {
            return this.$store.getters.currentHistory;
        },
        uiStack: function () {
            var uiStack = ['search'];

            for(var i = 0; i < this.stack.length; i ++) {
                uiStack.push(this.stack[i]);
                uiStack.push('search');
            }

            return uiStack;
        }
    },
    components: Object.assign({}, components, {
        'search': Search
    })
});
