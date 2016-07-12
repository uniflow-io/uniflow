import Vue from 'vue'
import template from './template.html!text'

import SFTPComponent from 'components/sftp/index.js';

export default Vue.extend({
    template: template,
    data: function() {
        return {
            items: [{
                component: 'sftp-component'
            }, {
                component: 'sftp-component'
            }, {
                component: 'sftp-component'
            }]
        };
    },
    components: {
        'sftp-component': SFTPComponent
    }
});
