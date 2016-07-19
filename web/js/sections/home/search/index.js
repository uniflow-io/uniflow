import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    template: template,
    data() {
        return {
            search: null,
            options: [
                { id: 1, text: 'hello' },
                { id: 2, text: 'what' }
            ]
        }
    },

    methods: {

    }
});