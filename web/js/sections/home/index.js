import Vue from 'vue'
import template from './template.html!text'

import SearchComponent from './search/index.js'

import SFTPMessageUI from '../../messages-ui/sftp/index.js';
import YAMLMessageUI from '../../messages-ui/yaml/index.js';

var messageUIs = [SFTPMessageUI, YAMLMessageUI];

var components = {
    'search-component': SearchComponent,
};
for(var i = 0; i < messageUIs.length; i++) {
    components['message-ui-'+i] = messageUIs[i];
}

var dependComponents = function(messageType) {
    return {
        'message-ui-0': 'SFTPMessageUI',
        'message-ui-1': 'YAMLMessageUI'
    }
};

export default Vue.extend({
    template: template,
    data: function() {
        return {
            title: 'Trads add',
            tags: ['decleor', 'traductions'],
            stack: [{
                component: 'search-component',
                message: dependComponents()
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
    components: components
});
