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
        handleTypes: function() {
            return [undefined, TextMessage];
        },
        handle: function (message) {
            if(message instanceof TextMessage) {
                this.content = message.text;
            }
        },
        onSubmit: function(e) {
            this.$dispatch('message', new TextMessage(this.content));
        }
    }
});