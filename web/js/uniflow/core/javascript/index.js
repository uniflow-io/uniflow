import Vue from 'vue'
import template from './template.html!text'

import TextMessage from '../../../messages/text.js'

export default Vue.extend({
    template: template,
    props: ['message'],
    created: function() {
        this.handle(this.message);
    },
    data() {
        return {
            code: null
        }
    },
    methods: {
        handleTypes: function() {
            return [undefined, TextMessage];
        },
        handle: function (message) {
            if(message instanceof TextMessage) {
                this.code = message.text;
            }
        },
        onSubmit: function(e) {
            this.$dispatch('message', new TextMessage(this.code));
        }
    }
});