import Vue from 'vue'
import template from './template.html!text'

import SFTPComponent from 'components/sftp/index.js';
import YAMLComponent from 'components/yaml/index.js';
import SearchComponent from 'components/search/index.js';

export default Vue.extend({
    template: template,
    data: function() {
        return {
            items: [{
                component: 'search-component'
            }]
        };
    },
    events: {
        'message': function(data) {
            //console.log(data);

            this.items.push({
                component: 'yaml-component',
                message: data
            });
        }
    },
    components: {
        'sftp-component': SFTPComponent,
        'yaml-component': YAMLComponent,
        'search-component': SearchComponent
    }
});
