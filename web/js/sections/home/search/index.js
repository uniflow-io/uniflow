import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    template: template,
    props: ['message'],
    created: function() {
        this.options = [];

        for (var key in this.message.options) {
            if( this.message.options.hasOwnProperty(key) ) {
                this.options.push({
                    id: key, text: this.message.options[key]
                });
            }
        }
    },
    data() {
        return {
            search: null,
            options: []
        }
    },

    methods: {
        onSubmit: function() {
            console.log('qdsq', this.search);
        }
    }
});