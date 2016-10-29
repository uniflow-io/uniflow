import Vue from 'vue'
import template from './template.html!text'

import TextMessage from '../../../messages/text.js'

export default Vue.extend({
    template: template,
    data() {
        return {
            code: null
        }
    },
    methods: {
        onDelete: function () {
            this.$emit('pop');
        }
    }
});