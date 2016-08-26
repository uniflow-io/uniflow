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
            content: null,
            search: null,
            replace: null
        }
    },
    methods: {
        handleTypes: function() {
            return [TextMessage];
        },
        handle: function (message) {
            if(message instanceof TextMessage) {
                this.content = message.text;
            }
        },
        onSubmit: function(e) {
            var replaceAll = function(search, replace) {
                return this.split(search).join(replace);
            };

            var replaceContent = replaceAll.call(this.content, this.search, this.replace);
            this.$dispatch('message', new TextMessage(replaceContent));
        }
    }
});