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
                console.log(message);
                this.content = message.text;

                return true;
            }

            return false;
        }
    }
});