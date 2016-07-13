import Vue from 'vue'
import template from './template.html!text'

import SFTPMessage from 'messages/sftp.js'

export default Vue.extend({
    template: template,
    data() {
        return {
            content: null
        }
    },

    methods: {
        handle: function(data) {

        }
    }
});
