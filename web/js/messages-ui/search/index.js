import Vue from 'vue'
import template from './template.html!text'

import SearchMessage from '../../messages/search.js';

export default Vue.extend({
    template: template,
    props: ['message'],
    created: function() {
        this.handle(this.message);
    },
    data() {
        return {
            search: null,
            options: []
        }
    },

    methods: {
        handle: function (message) {
            if(message instanceof SearchMessage) {
                this.options = [];

                for (var key in this.message.options) {
                    if( this.message.options.hasOwnProperty(key) ) {
                        this.options.push({
                            id: key, text: this.message.options[key]
                        });
                    }
                }

                return true;
            }

            return false;
        },
        onSubmit: function() {
            if(this.search) {
                this.message.search = this.search;

                this.$dispatch('message', this.message);
            }
        }
    }
});