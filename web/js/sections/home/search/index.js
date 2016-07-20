import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    template: template,
    props: ['message'],
    created: function() {
        this.options = [];

        for (var key in this.message) {
            if( this.message.hasOwnProperty(key) ) {
                this.options.push({
                    id: key, text: this.message[key]
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