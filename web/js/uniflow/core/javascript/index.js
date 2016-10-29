import Vue from 'vue'
import template from './template.html!text'

import TextMessage from '../../../messages/text.js'

export default Vue.extend({
    template: template,
    props: ['message'],
    data() {
        return {
            code: null
        }
    },
    methods: {
    }
});