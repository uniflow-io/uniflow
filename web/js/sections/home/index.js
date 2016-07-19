import Vue from 'vue'
import template from './template.html!text'

import SearchComponent from './search/index.js'

import '../../messages-ui/sftp/index.js';
import '../../messages-ui/yaml/index.js';

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
        'search-component': SearchComponent
    }
});
