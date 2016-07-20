import Vue from 'vue'
import template from './template.html!text'

import SFTPMessage from 'messages/sftp.js'

export default Vue.extend({
    template: template,
    props: ['message'],
    data() {
        return {
            content: null
        }
    },
    created: function() {
        this.content = this.message;
    },

    methods: {
        handle: function () {
            console.log('handle yaml');
        }
    }
});