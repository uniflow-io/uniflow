import Vue from 'vue'
import template from './template.html!text'

import SFTPComponent from 'components/sftp/index.js';

export default Vue.extend({
    template: template,
    components: {
        'sftp-component': SFTPComponent
    }
});
