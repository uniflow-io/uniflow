import Vue from 'vue'
import template from './template.html!text'

import TextMessage from 'messages/text.js'

export default Vue.extend({
    template: template,
    props: ['message'],
    created: function() {
        this.handle(this.message);
    },
    data() {
        return {
            content: null
        }
    },
    methods: {
        handle: function (message) {
            if(message instanceof TextMessage) {
                this.content = message.text;

                return true;
            }

            return true;
        },
        onSubmit: function(e) {
            this.$dispatch('message', new TextMessage(this.content));
        }
    }
});