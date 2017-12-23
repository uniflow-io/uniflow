import Vue from 'vue'
import template from './template.html!text'

import TextMessage from '../../../messages/text.js'

export default Vue.extend({
    template: template,
    data() {
        return {
            content: null,
            search: null,
            replace: null,
            regexp: false,
        }
    },
    methods: {
        onDelete: function () {
            this.$emit('pop');
        },
        handleTypes: function() {
            return [TextMessage];
        },
        handle: function (message) {
            if(message instanceof TextMessage) {
                this.content = message.text;
            }
        },
        onSubmit: function(e) {
            let replaceAll = function(search, replace) {
                return this.split(search).join(replace);
            };

            let replaceContent = replaceAll.call(this.content, this.search, this.replace);
            this.$dispatch('message', new TextMessage(replaceContent));
        }
    }
});